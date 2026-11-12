"use client";

import { useEffect, useRef, useState } from "react";
import { EDGES, NODES, RELATIONSHIPS } from "./systems";
import { useUI } from "../UI";

/**
 * Signature systems visualization.
 *
 * Layers, from always-available to enhanced:
 *   1. A static SVG diagram, server-rendered (no-JS, no-WebGL, reduced motion).
 *   2. A compact HTML chain on small screens.
 *   3. A WebGL scene (Three.js), loaded on demand on capable, wide screens only.
 * The same NODES and EDGES drive all three, so they always tell one story.
 */

const W = 1000;
const H = 460;
const px = (x: number) => W / 2 + x * 400;
const py = (y: number) => H / 2 - y * 170;

export default function HeroSystems() {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const api = useRef<{ setPaused: (p: boolean) => void; setActive: (i: number) => void } | null>(null);
  const [live, setLive] = useState(false);
  const [paused, setPaused] = useState(false);
  const { reducedMotion } = useUI();

  useEffect(() => {
    if (reducedMotion) return;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    const capable = matchMedia("(min-width: 900px)").matches && !nav.connection?.saveData && (navigator.hardwareConcurrency ?? 4) >= 4;
    if (!capable || !canvas.current || !host.current) return;

    let dispose = () => {};
    let cancelled = false;

    (async () => {
      const THREE = await import("three");
      if (cancelled || !canvas.current || !host.current) return;
      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas: canvas.current, antialias: true, alpha: true, powerPreference: "low-power" });
      } catch {
        return; // No WebGL: the SVG stays.
      }
      const el = host.current;
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
      camera.position.set(0, 0, 7.2);
      const group = new THREE.Group();
      scene.add(group);

      const teal = new THREE.Color("#5fe0d0");
      const cyan = new THREE.Color("#a8e9f2");
      const paper = new THREE.Color("#f3efe6");
      const SX = 3.1;
      const SY = 1.25;
      const pos = NODES.map((n) => new THREE.Vector3(n.x * SX, n.y * SY, n.z));

      // Depth layers: a quiet reference grid behind the system.
      const grid: number[] = [];
      for (let i = -6; i <= 6; i++) {
        grid.push(i * 0.7, -2.1, -1.6, i * 0.7, 2.1, -1.6);
        if (Math.abs(i) <= 3) grid.push(-4.2, i * 0.7, -1.6, 4.2, i * 0.7, -1.6);
      }
      const gridGeo = new THREE.BufferGeometry();
      gridGeo.setAttribute("position", new THREE.Float32BufferAttribute(grid, 3));
      const gridMat = new THREE.LineBasicMaterial({ color: "#8fb0c8", transparent: true, opacity: 0.07 });
      group.add(new THREE.LineSegments(gridGeo, gridMat));

      // Pathways
      const curves = EDGES.map(([a, b]) => {
        const mid = pos[a].clone().lerp(pos[b], 0.5);
        mid.z += 0.5;
        mid.y += (pos[b].y - pos[a].y) * 0.12;
        return new THREE.QuadraticBezierCurve3(pos[a], mid, pos[b]);
      });
      const edgeMats = curves.map(() => new THREE.LineBasicMaterial({ color: teal, transparent: true, opacity: 0.32 }));
      const disposables: { dispose: () => void }[] = [gridGeo, gridMat, ...edgeMats];
      curves.forEach((c, i) => {
        const g = new THREE.BufferGeometry().setFromPoints(c.getPoints(40));
        disposables.push(g);
        group.add(new THREE.Line(g, edgeMats[i]));
      });

      // Nodes
      const dotGeo = new THREE.SphereGeometry(0.055, 20, 20);
      const ringGeo = new THREE.RingGeometry(0.13, 0.142, 48);
      disposables.push(dotGeo, ringGeo);
      const rings: import("three").Mesh[] = [];
      NODES.forEach((n, i) => {
        const strong = n.kind !== "discipline";
        const dotMat = new THREE.MeshBasicMaterial({ color: strong ? paper : teal });
        const ringMat = new THREE.MeshBasicMaterial({ color: strong ? paper : teal, transparent: true, opacity: strong ? 0.9 : 0.5, side: THREE.DoubleSide });
        disposables.push(dotMat, ringMat);
        const dot = new THREE.Mesh(dotGeo, dotMat);
        const ring = new THREE.Mesh(ringGeo, ringMat);
        dot.position.copy(pos[i]);
        ring.position.copy(pos[i]);
        if (strong) ring.scale.setScalar(1.5);
        rings.push(ring);
        group.add(dot, ring);
      });

      // Signals travelling along pathways, from need towards outcome.
      const sigGeo = new THREE.SphereGeometry(0.028, 12, 12);
      const sigMat = new THREE.MeshBasicMaterial({ color: cyan });
      disposables.push(sigGeo, sigMat);
      const signals = curves.map((c, i) => {
        const m = new THREE.Mesh(sigGeo, sigMat);
        group.add(m);
        return { m, c, t: (i * 0.37) % 1, speed: 0.16 + (i % 3) * 0.035 };
      });

      let active = -1;
      let running = true;
      let visible = true;
      let raf = 0;
      let last = performance.now();
      const pointer = { x: 0, y: 0 };
      const v = new THREE.Vector3();

      const resize = () => {
        const { width, height } = el.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        // Keep the whole system in frame at any aspect ratio.
        camera.position.z = Math.max(7.2, 9.6 / camera.aspect + 1.2);
        camera.updateProjectionMatrix();
      };

      const frame = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        if (running) for (const s of signals) s.t = (s.t + s.speed * dt) % 1;
        for (const s of signals) s.m.position.copy(s.c.getPoint(s.t));
        group.rotation.y += (pointer.x * 0.2 - group.rotation.y) * 0.05;
        group.rotation.x += (-pointer.y * 0.1 - group.rotation.x) * 0.05;
        EDGES.forEach(([a, b], i) => {
          const target = active < 0 ? 0.32 : a === active || b === active ? 0.95 : 0.1;
          edgeMats[i].opacity += (target - edgeMats[i].opacity) * 0.12;
        });
        for (const r of rings) r.quaternion.copy(camera.quaternion);
        renderer.render(scene, camera);
        const rect = el.getBoundingClientRect();
        NODES.forEach((_, i) => {
          const label = labels.current[i];
          if (!label) return;
          v.copy(pos[i]).applyMatrix4(group.matrixWorld).project(camera);
          label.style.transform = `translate(${((v.x + 1) / 2) * rect.width}px, ${((1 - v.y) / 2) * rect.height}px)`;
        });
        if (running && visible) raf = requestAnimationFrame(frame);
      };
      const kick = () => {
        cancelAnimationFrame(raf);
        last = performance.now();
        raf = requestAnimationFrame(frame);
      };

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const r = el.getBoundingClientRect();
        pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
        if (!running) kick();
      };
      const ro = new ResizeObserver(() => {
        resize();
        kick();
      });
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) kick();
      });
      const onVis = () => {
        visible = !document.hidden;
        if (visible) kick();
      };
      ro.observe(el);
      io.observe(el);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("visibilitychange", onVis);

      api.current = {
        setPaused: (p) => {
          running = !p;
          kick();
        },
        setActive: (i) => {
          active = i;
          if (!running) {
            // A few frames so the highlight eases in even while paused.
            let n = 0;
            const step = (t: number) => {
              frame(t);
              if (++n < 24) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }
        },
      };
      resize();
      kick();
      setLive(true);

      dispose = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("visibilitychange", onVis);
        disposables.forEach((d) => d.dispose());
        renderer.dispose();
        api.current = null;
      };
    })();

    return () => {
      cancelled = true;
      dispose();
      setLive(false);
    };
  }, [reducedMotion]);

  return (
    <figure className="systems" data-live={live || undefined}>
      <figcaption className="sr-only">Systems diagram. {RELATIONSHIPS}</figcaption>

      <div className="systems__stage" ref={host} aria-hidden="true">
        <svg className="systems__svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" focusable="false">
          {EDGES.map(([a, b], i) => {
            const A = NODES[a];
            const B = NODES[b];
            const mx = (px(A.x) + px(B.x)) / 2;
            const my = (py(A.y) + py(B.y)) / 2 - 26;
            return <path key={i} className="systems__edge" style={{ "--i": i } as React.CSSProperties} d={`M${px(A.x)} ${py(A.y)} Q${mx} ${my} ${px(B.x)} ${py(B.y)}`} />;
          })}
          {NODES.map((n) => (
            <g key={n.id} className="systems__node" data-kind={n.kind}>
              <circle cx={px(n.x)} cy={py(n.y)} r={n.kind === "discipline" ? 15 : 22} className="systems__ring" />
              <circle cx={px(n.x)} cy={py(n.y)} r={6} className="systems__dot" />
              <text x={px(n.x)} y={py(n.y) + (n.y > 0 ? -30 : n.kind === "discipline" ? 40 : 48)} textAnchor="middle">
                {n.label}
              </text>
            </g>
          ))}
        </svg>
        <canvas ref={canvas} className="systems__canvas" />
        <div className="systems__labels">
          {NODES.map((n, i) => (
            <span
              key={n.id}
              ref={(el) => {
                labels.current[i] = el;
              }}
              data-kind={n.kind}
              data-below={n.y <= 0 || undefined}
              onPointerEnter={() => api.current?.setActive(i)}
              onPointerLeave={() => api.current?.setActive(-1)}
            >
              <i>{n.label}</i>
            </span>
          ))}
        </div>
      </div>

      <ol className="systems__chain" aria-hidden="true">
        <li data-kind="origin">Human Needs</li>
        <li className="systems__chain-group">
          <span>Product</span>
          <span>Learning</span>
          <span>Design</span>
          <span>AI</span>
        </li>
        <li>Teams</li>
        <li data-kind="result">Business Outcomes</li>
      </ol>

      {live && (
        <button
          type="button"
          className="systems__pause mono"
          aria-pressed={paused}
          onClick={() => {
            setPaused(!paused);
            api.current?.setPaused(!paused);
          }}
        >
          {paused ? "Play motion" : "Pause motion"}
        </button>
      )}
    </figure>
  );
}
