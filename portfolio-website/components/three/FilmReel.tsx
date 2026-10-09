'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { glImage } from '@/lib/webgl';

/**
 * The hero's film strip in WebGL. Frames ride a drum (edges curve away from
 * the camera), drift on their own, speed up and colour-split with scroll
 * velocity, lean toward the pointer, and wake up to full colour on hover.
 * One shared geometry, one material per frame, nothing allocated per frame.
 */

const BAND = 0.1; // sprocket band, fraction of cell height
const GAP = 0.025; // gap either side of a frame, fraction of cell width
const FRAME_ASPECT = 16 / 10;

const vertex = /* glsl */ `
  uniform float uBend;
  uniform float uTime;
  uniform float uVel;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    wp.z -= uBend * wp.x * wp.x;
    wp.y += sin(wp.x * 0.7 + uTime * 2.0) * uVel * 0.06;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uHasTex;
  uniform float uImgAspect;
  uniform float uCellAspect;
  uniform float uVel;
  uniform float uHover;
  uniform vec3 uBase;
  uniform vec3 uHole;
  varying vec2 vUv;

  float box(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    float b = ${BAND.toFixed(3)};
    float g = ${GAP.toFixed(3)};
    vec3 col = uBase;

    if (vUv.y < b || vUv.y > 1.0 - b) {
      // Perforations: 8 per frame, soft-edged rounded rects.
      float ly = vUv.y < b ? vUv.y / b : (vUv.y - (1.0 - b)) / b;
      vec2 p = vec2((fract(vUv.x * 8.0) - 0.5) * uCellAspect / 8.0 / b, ly - 0.5);
      float d = box(p, vec2(0.22, 0.26), 0.08);
      col = mix(uHole, uBase, smoothstep(0.0, 0.03, d));
    } else if (vUv.x > g && vUv.x < 1.0 - g) {
      vec2 f = vec2((vUv.x - g) / (1.0 - 2.0 * g), (vUv.y - b) / (1.0 - 2.0 * b));
      // Cover-fit the image into the frame.
      float fa = ${FRAME_ASPECT.toFixed(4)};
      vec2 uv = f;
      if (uImgAspect > fa) uv.x = (uv.x - 0.5) * fa / uImgAspect + 0.5;
      else uv.y = (uv.y - 0.5) * uImgAspect / fa + 0.5;

      vec3 img;
      if (uHasTex > 0.5) {
        float o = uVel * 0.014;
        img = vec3(
          texture2D(uTex, uv + vec2(o, 0.0)).r,
          texture2D(uTex, uv).g,
          texture2D(uTex, uv - vec2(o, 0.0)).b
        );
      } else {
        // Leader stock while the frame loads: diagonal hatching.
        float s = step(0.5, fract((f.x * fa + f.y) * 9.0));
        img = mix(vec3(0.10), vec3(0.14), s);
      }
      // Graded down until hovered, like an inactive monitor.
      float l = dot(img, vec3(0.299, 0.587, 0.114));
      img = mix(vec3(l), img, 0.45 + 0.55 * uHover) * (0.78 + 0.22 * uHover);
      // Soft frame corners.
      vec2 e = min(f, 1.0 - f);
      float corner = smoothstep(0.0, 0.012, min(e.x / fa, e.y));
      col = mix(uBase, img, corner);
    }
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

type Cell = { mesh: THREE.Mesh; mat: THREE.ShaderMaterial; hover: number; target: number };

function Strip({ frames }: { frames: string[] }) {
  const viewport = useThree((st) => st.viewport);
  const setDpr = useThree((st) => st.setDpr);
  const perf = useRef({ frames: 0, total: 0, done: false });
  const group = useRef<THREE.Group>(null);
  const cells = useRef<Cell[]>([]);
  const state = useRef({ offset: 0, vel: 0, lastY: 0, px: 0, py: 0 });

  // Layout in world units, from the canvas size.
  const dims = useMemo(() => {
    const cellH = viewport.height * 0.9;
    const frameH = cellH * (1 - 2 * BAND);
    const cellW = (frameH * FRAME_ASPECT) / (1 - 2 * GAP);
    const count = Math.max(frames.length, Math.ceil(viewport.width / cellW) + 4);
    return {
      cellH,
      cellW,
      count,
      total: count * cellW,
      bend: (viewport.width * 0.09) / Math.pow(viewport.width / 2, 2),
    };
  }, [viewport.width, viewport.height, frames.length]);

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1, 24, 1), []);

  // Textures, loaded once through the image optimiser, with a maxres → hq fallback.
  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return frames.map((src) => {
      const slot = { tex: null as THREE.Texture | null, aspect: 16 / 9 };
      const load = (url: string, fallback?: string): void => {
        loader.load(
          glImage(url),
          (t) => {
            t.colorSpace = THREE.SRGBColorSpace;
            t.minFilter = THREE.LinearFilter;
            t.generateMipmaps = false;
            const img = t.image as HTMLImageElement;
            slot.aspect = img.width / img.height;
            slot.tex = t;
          },
          undefined,
          () => fallback && load(fallback)
        );
      };
      load(src, src.includes('maxresdefault') ? src.replace('maxresdefault', 'hqdefault') : undefined);
      return slot;
    });
  }, [frames]);

  // One material per cell; uniforms are mutated in place.
  const materials = useMemo(
    () =>
      Array.from(
        { length: dims.count },
        () =>
          new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {
              uTex: { value: null },
              uHasTex: { value: 0 },
              uImgAspect: { value: 16 / 9 },
              uCellAspect: { value: dims.cellW / dims.cellH },
              uBend: { value: dims.bend },
              uTime: { value: 0 },
              uVel: { value: 0 },
              uHover: { value: 0 },
              uBase: { value: new THREE.Color('#121212') },
              uHole: { value: new THREE.Color('#d9d7d2') },
            },
          })
      ),
    [dims]
  );

  useEffect(() => {
    cells.current.length = materials.length;
    return () => materials.forEach((m) => m.dispose());
  }, [materials]);
  useEffect(
    () => () => {
      geometry.dispose();
      textures.forEach((t) => t.tex?.dispose());
    },
    [geometry, textures]
  );

  useEffect(() => {
    state.current.lastY = window.scrollY;
    const onMove = (e: PointerEvent) => {
      state.current.px = (e.clientX / window.innerWidth) * 2 - 1;
      state.current.py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((three, delta) => {
    const s = state.current;
    const dt = Math.min(delta, 1 / 20);
    // Slow device? After a second of frames, drop to 1x pixels and stay there.
    const pf = perf.current;
    if (!pf.done) {
      pf.frames++;
      pf.total += delta;
      if (pf.frames === 60) {
        pf.done = true;
        if (pf.total / 60 > 1 / 45) setDpr(1);
      }
    }
    // Scroll velocity, read from scrollY (no layout), smoothed.
    const y = window.scrollY;
    const v = Math.min(Math.abs(y - s.lastY) / Math.max(dt, 1e-3) / 2500, 1.5);
    s.lastY = y;
    s.vel += (v - s.vel) * (v > s.vel ? 0.35 : 0.06);
    s.offset += dt * dims.cellW * (0.12 + s.vel * 3);

    if (group.current) {
      group.current.rotation.y += (s.px * 0.1 - group.current.rotation.y) * 0.06;
      group.current.rotation.x += (s.py * 0.06 - group.current.rotation.x) * 0.06;
    }

    const t = three.clock.elapsedTime;
    cells.current.forEach((c, i) => {
      const x = ((((i * dims.cellW - s.offset) % dims.total) + dims.total) % dims.total) - dims.total / 2;
      c.mesh.position.x = x;
      c.hover += (c.target - c.hover) * 0.12;
      const u = c.mat.uniforms;
      const slot = textures[i % textures.length];
      if (slot.tex && u.uTex.value !== slot.tex) {
        u.uTex.value = slot.tex;
        u.uHasTex.value = 1;
        u.uImgAspect.value = slot.aspect;
      }
      u.uTime.value = t;
      u.uVel.value = s.vel;
      u.uHover.value = c.hover;
    });
  });

  // Hover uses R3F pointer events, which only raycast while the pointer moves.
  return (
    <group ref={group}>
      {materials.map((mat, i) => (
        <mesh
          key={i}
          geometry={geometry}
          material={mat}
          scale={[dims.cellW, dims.cellH, 1]}
          ref={(m) => {
            if (!m) return;
            const prev = cells.current[i];
            cells.current[i] = { mesh: m, mat, hover: prev?.hover ?? 0, target: prev?.target ?? 0 };
          }}
          onPointerOver={() => cells.current[i] && (cells.current[i].target = 1)}
          onPointerOut={() => cells.current[i] && (cells.current[i].target = 0)}
        />
      ))}
    </group>
  );
}

export default function FilmReel({ frames, live, onReady }: { frames: string[]; live: boolean; onReady?: () => void }) {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.5]}
      frameloop={live ? 'always' : 'never'}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6], fov: 30 }}
      onCreated={({ gl }) => {
        gl.setClearColor('#121212');
        onReady?.();
      }}
    >
      <Strip frames={frames} />
    </Canvas>
  );
}
