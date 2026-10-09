/**
 * Tiny scripts inlined in <head> so they run before first paint.
 * Kept in a plain (non-client) module so the server layout can embed the strings.
 */
export const MODE_STORAGE_KEY = 'sg-mode';

export const modeBootScript = `(function(){try{var d=document.documentElement,p=new URLSearchParams(location.search).get('mode'),s=localStorage.getItem('${MODE_STORAGE_KEY}'),ok=function(v){return v==='personal'||v==='professional'};d.dataset.mode=ok(p)?p:ok(s)?s:'professional';}catch(e){}})();`;
