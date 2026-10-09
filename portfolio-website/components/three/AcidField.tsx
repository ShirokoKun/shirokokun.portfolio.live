'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * After hours, behind the name: flowing noise crushed to 1-bit with an ordered
 * dither, in acid lime. The pointer stirs it. Rendered at a fraction of screen
 * resolution and scaled up with nearest-neighbour, so the pixels are chunky on
 * purpose and the GPU barely notices.
 */

const fragment = /* glsl */ `
  uniform vec2 uRes;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uStir;
  uniform vec3 uInk;
  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float bayer4(vec2 p) {
    vec2 q = mod(floor(p), 4.0);
    float i = q.x + q.y * 4.0;
    // 4x4 Bayer matrix, row-major.
    if (i < 1.0) return 0.0 / 16.0; if (i < 2.0) return 8.0 / 16.0; if (i < 3.0) return 2.0 / 16.0; if (i < 4.0) return 10.0 / 16.0;
    if (i < 5.0) return 12.0 / 16.0; if (i < 6.0) return 4.0 / 16.0; if (i < 7.0) return 14.0 / 16.0; if (i < 8.0) return 6.0 / 16.0;
    if (i < 9.0) return 3.0 / 16.0; if (i < 10.0) return 11.0 / 16.0; if (i < 11.0) return 1.0 / 16.0; if (i < 12.0) return 9.0 / 16.0;
    if (i < 13.0) return 15.0 / 16.0; if (i < 14.0) return 7.0 / 16.0; if (i < 15.0) return 13.0 / 16.0; return 5.0 / 16.0;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uRes.x / uRes.y;
    vec2 p = vec2(uv.x * aspect, uv.y) * 1.6;
    float t = uTime * 0.08;

    // Domain-warped noise: slow, liquid.
    vec2 w = vec2(snoise(p + vec2(t, -t)), snoise(p + vec2(-t * 1.3, t * 0.7) + 4.2));
    float n = snoise(p * 0.9 + w * 0.9 + t);

    // The pointer pushes a ring through it.
    vec2 d = vec2((uv.x - uPointer.x) * aspect, uv.y - uPointer.y);
    float r = length(d);
    float ring = exp(-r * 6.0) * (0.6 + 0.4 * sin(r * 28.0 - uTime * 3.0));
    n += ring * (0.6 + uStir);

    // Sparse by default; densest in the middle band, thinning out under the
    // tagline (bottom left) and the status bar so text stays readable.
    float v = n * 0.5 + 0.5;
    float band = smoothstep(0.0, 0.35, uv.y) * smoothstep(1.0, 0.7, uv.y);
    // On wide screens the tagline sits bottom left; on phones it spans the width.
    float left = mix(1.0, smoothstep(0.42, 0.18, uv.x), step(1.0, aspect));
    float text = 1.0 - smoothstep(0.32, 0.0, uv.y) * left;
    v = v * mix(0.5, 1.0, band) * text - 0.42 + ring * 0.25;

    float on = step(bayer4(gl_FragCoord.xy), v);
    gl_FragColor = vec4(uInk, on * 0.6);
  }
`;

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

function Field({ ink, calm }: { ink: string; calm: boolean }) {
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);
  const pointer = useRef({ x: 0.5, y: 0.4, tx: 0.5, ty: 0.4, stir: 0, lastX: 0, lastY: 0 });

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthTest: false,
        uniforms: {
          uRes: { value: new THREE.Vector2(1, 1) },
          uTime: { value: 8 },
          uPointer: { value: new THREE.Vector2(0.5, 0.4) },
          uStir: { value: 0 },
          uInk: { value: new THREE.Color(ink) },
        },
      }),
    [ink]
  );
  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    material.uniforms.uRes.value.set(size.width, size.height);
  }, [material, size]);

  // Pointer in canvas UV space. One rect read per move, nothing per frame.
  useEffect(() => {
    const el = gl.domElement;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const p = pointer.current;
      p.tx = (e.clientX - r.left) / r.width;
      p.ty = 1 - (e.clientY - r.top) / r.height;
      p.stir = Math.min(p.stir + Math.hypot(e.clientX - p.lastX, e.clientY - p.lastY) / 400, 1.2);
      p.lastX = e.clientX;
      p.lastY = e.clientY;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [gl]);

  useFrame((_, delta) => {
    if (calm) return;
    const p = pointer.current;
    const u = material.uniforms;
    p.x += (p.tx - p.x) * 0.08;
    p.y += (p.ty - p.y) * 0.08;
    p.stir *= 0.95;
    u.uTime.value += Math.min(delta, 1 / 20);
    u.uPointer.value.set(p.x, p.y);
    u.uStir.value = p.stir;
  });

  return (
    <mesh material={material} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

export default function AcidField({ ink, live, calm = false }: { ink: string; live: boolean; calm?: boolean }) {
  return (
    <Canvas
      className="!absolute inset-0 [&_canvas]:[image-rendering:pixelated]"
      // Low resolution on purpose: chunky pixels, almost free to draw.
      dpr={0.34}
      frameloop={calm ? 'demand' : live ? 'always' : 'never'}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      style={{ pointerEvents: 'none' }}
    >
      <Field ink={ink} calm={calm} />
    </Canvas>
  );
}
