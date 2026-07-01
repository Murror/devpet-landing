'use client'

import { useEffect, useRef } from 'react'

/**
 * HeroShader — a slow, living aurora rendered in WebGL behind the hero
 * constellation. Domain-warped fbm in the brand purples/blues/pink,
 * screen-blended so it only adds light. Cheap: half-res internal buffer,
 * 5-octave noise. Degrades to nothing when WebGL is unavailable, and
 * renders a single static frame under prefers-reduced-motion.
 */
const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i+vec2(0.0,0.0)), hash(i+vec2(1.0,0.0)), u.x),
             mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.02; a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv;
  p.x *= u_res.x / u_res.y;
  float t = u_time * 0.045;
  vec2 q = vec2(fbm(p*1.4 + t), fbm(p*1.4 - t + 5.2));
  float f = fbm(p*2.1 + q*1.9 + vec2(0.0, t*1.6));

  vec3 blue   = vec3(0.145, 0.388, 0.922);
  vec3 purple = vec3(0.486, 0.227, 0.929);
  vec3 pink   = vec3(1.0,   0.42,  0.61);
  vec3 col = mix(blue, purple, smoothstep(0.18, 0.82, f));
  col = mix(col, pink, smoothstep(0.62, 1.0, f) * 0.45);

  float glow = pow(f, 2.3);
  float vign = smoothstep(1.15, 0.18, length(uv - vec2(0.5, 0.42)));
  col *= glow * 1.7 * vign;
  gl_FragColor = vec4(col, 1.0);
}
`

const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`

export default function HeroShader() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: false })
    if (!gl) return

    // Phones: skip the WebGL aurora entirely — a full-screen fragment shader
    // plus a screen-blended composite layer is a heavy GPU cost on mobile,
    // and the nebula glow already carries the colour. (Canvas is also
    // display:none on mobile via CSS.)
    if (window.matchMedia('(max-width: 820px)').matches) return

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    // Full-screen triangle.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uTime = gl.getUniformLocation(prog, 'u_time')

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Phones render a single static frame. A continuously-running fragment
    // shader (5-octave fbm noise, full-screen) is a heavy, always-on GPU
    // load that stutters the whole page while scrolling on mobile — and the
    // aurora is subtle enough that a still frame reads the same. Desktop
    // animates but pauses whenever the hero scrolls out of view.
    const staticOnly = reduce || window.matchMedia('(pointer: coarse)').matches

    let raf = 0
    let visible = true
    const drawFrame = (ms: number) => {
      gl.uniform1f(uTime, ms * 0.001)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const SCALE = 0.5 // render at half-res; the field is soft so it's invisible
    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * SCALE))
      const h = Math.max(1, Math.floor(canvas.clientHeight * SCALE))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      // In static mode the loop won't repaint, so redraw at the new size.
      if (staticOnly) drawFrame(8000)
    }
    resize()
    window.addEventListener('resize', resize)

    const loop = (ms: number) => {
      drawFrame(ms)
      if (visible) raf = requestAnimationFrame(loop)
    }

    let io: IntersectionObserver | null = null
    if (staticOnly) {
      drawFrame(8000)
    } else {
      raf = requestAnimationFrame(loop)
      io = new IntersectionObserver(
        ([e]) => {
          visible = e.isIntersecting
          if (visible) { cancelAnimationFrame(raf); raf = requestAnimationFrame(loop) }
        },
        { rootMargin: '80px' },
      )
      io.observe(canvas)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      io?.disconnect()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return <canvas ref={ref} className="v3-hero-shader" aria-hidden="true" />
}
