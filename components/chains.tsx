"use client";

import React, { useEffect, useRef } from "react";
import Matter from "matter-js";

type TornadoChainProps = {
  /** Tailwind-friendly size (e.g. "h-[520px] w-full") */
  className?: string;

  /** Number of links in the chain */
  links?: number;

  /** Text to lay along the chain (repeats if shorter than links) */
  text?: string;

  /** Canvas text styling */
  fontSizePx?: number;
  fontFamily?: string;
  textColor?: string;
  textStrokeColor?: string;
};

export default function TornadoChain({
  className = "h-[520px] w-full",
  links = 36,
  text = "I make fun createve experiences",
  fontSizePx = 34,
  fontFamily = "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
  textColor = "rgba(1,1,1,0.92)",
  textStrokeColor = "rgba(0,0,0,0.35)",
}: TornadoChainProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hostRef.current) return;

    const {
      Engine,
      Render,
      Runner,
      Bodies,
      Body,
      Composite,
      Composites,
      Constraint,
      Events,
      Vector,
    } = Matter;

    const host = hostRef.current;

    // ---- Size helpers
    const getSize = () => {
      const rect = host.getBoundingClientRect();
      return { w: Math.max(300, rect.width), h: Math.max(300, rect.height) };
    };

    let { w, h } = getSize();

    // ---- Engine / world
    const engine = Engine.create();
    engine.gravity.x = 0;
    engine.gravity.y = 0;

    // More stable constraints/collisions for longer chains
    engine.positionIterations = 10;
    engine.velocityIterations = 8;
    engine.constraintIterations = 4;

    const world = engine.world;

    // ---- Renderer (Matter’s canvas)
    const render = Render.create({
      element: host,
      engine,
     fillStyle: "rgba(255,255,255,0.85)" ,
     visible: false,

      options: {
        width: w,
        height: h,
        wireframes: false,
        background: "transparent",
        pixelRatio: Math.min(2, window.devicePixelRatio || 1),
      },
    });

    // ---- Boundaries (static walls)
    const thickness = 5;
    const bounds = [
      Bodies.rectangle(w / 2, -thickness / 2, w, thickness, {
        isStatic: true,
        render: { fillStyle: "rgba(255,255,255,0.06)" },
      }),
      Bodies.rectangle(w / 2, h + thickness / 2, w, thickness, {
        isStatic: true,
        render: { fillStyle: "rgba(255,255,255,0.06)" },
      }),
      Bodies.rectangle(-thickness / 2, h / 2, thickness, h, {
        isStatic: true,
        render: { fillStyle: "rgba(255,255,255,0.06)" },
      }),
      Bodies.rectangle(w + thickness / 2, h / 2, thickness, h, {
        isStatic: true,
        render: { fillStyle: "rgba(255,255,255,0.06)" },
      }),
    ];
    Composite.add(world, bounds);

    // ---- Chain (spawn safely inside bounds even with lots of links)
    const innerPad = thickness + 20;
    const innerW = w - innerPad * 2;
    const innerH = h - innerPad * 2;

    // Shrink link size slightly as link count grows (prevents overflow / wedging)
    const sizeScale = Math.max(0.55, Math.min(1, 42 / Math.max(links, 1)));
    const baseLinkW = Math.max(10, Math.min(18, Math.floor(w / 45)));
    const baseLinkH = Math.max(16, Math.min(30, Math.floor(h / 22)));
    const linkW = Math.max(8, Math.floor(baseLinkW * sizeScale));
    const linkH = Math.max(12, Math.floor(baseLinkH * sizeScale));
    

    // Prefer a vertical chain so "too many links" doesn't exceed width
    const startX = innerPad + innerW * 0.5;
    const startY = innerPad + Math.min(innerH * 0.15, 90);
    const gapY = Math.max(2, Math.floor(linkH * 0.15));

    const chain = Composites.stack(
      startX,
      startY,
      1,
      links,
      0,
      gapY,
      (x, y) =>
        Bodies.rectangle(x, y, linkW, linkH, {
          chamfer: { radius: Math.min(6, Math.floor(linkW / 3)) },
          friction: 0.6,
          frictionAir: 0.15,
          restitution: 0.15,
          density: 0.0022,
          // group=0 means they *will* collide with each other (self-collision)
          collisionFilter: { group: 0 },
          render: { fillStyle: "rgba(255,,255,0.85)" },
          
        })
    );

    // Connect into chain. Anchors are set for vertical stacking.
    Composites.chain(chain, 0.0, 0.45, 0.0, -0.45, {
      stiffness: 0.85,
      damping: 0.25,
      length: 1,
      render: { strokeStyle: "rgba(255,255,255,0.15)" , visible: false},
    });

    // Ensure AABB is fully inside inner bounds (nudge if needed)
    {
      const aabb = Composite.bounds(chain);
      const minX = innerPad + 10;
      const minY = innerPad + 10;
      const maxX = w - innerPad - 10;
      const maxY = h - innerPad - 10;

      let shiftX = 0;
      let shiftY = 0;

      if (aabb.min.x < minX) shiftX = minX - aabb.min.x;
      if (aabb.max.x > maxX) shiftX = Math.min(shiftX, maxX - aabb.max.x);

      if (aabb.min.y < minY) shiftY = minY - aabb.min.y;
      if (aabb.max.y > maxY) shiftY = Math.min(shiftY, maxY - aabb.max.y);

      if (shiftX !== 0 || shiftY !== 0) {
        Composite.translate(chain, { x: shiftX, y: shiftY });
      }
    }

    // Give the chain some initial motion
    for (const b of chain.bodies) {
      Body.setAngle(b, (Math.random() - 0.5) * 0.4);
      Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.12);
      Body.setVelocity(b, {
        x: (Math.random() - 0.5) * 1.6,
        y: (Math.random() - 0.5) * 1.6,
      });
    }

    // ---- Optional soft tether (keeps it in the vortex without hard anchoring)
    const center = { x: w * 0.5, y: h * 0.6 };
    const softTether = Constraint.create({
      bodyA: chain.bodies[0],
      pointB: { x: center.x, y: center.y },
      stiffness: 0.01,
      damping: 0.08,
      length: Math.min(w, h) * 0.25,
      render: { visible: false },
    });

    Composite.add(world, [chain, softTether]);

    // ---- Tornado “force field”
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

    const beforeUpdate = (evt: Matter.IEventTimestamped<Matter.Engine>) => {
      const t = evt.timestamp * 0.001;
      const maxR = Math.min(w, h) * 0.42;

      for (const b of chain.bodies) {
        const dx = b.position.x - center.x;
        const dy = b.position.y - center.y;
        const r = Math.sqrt(dx * dx + dy * dy) + 0.0001;

        const rn = clamp(r / maxR, 0, 1);

        // Tangential direction (perpendicular to radial vector)
        const tangential = Vector.normalise({ x: -dy, y: dx });
        // Radial direction
        const radial = Vector.normalise({ x: dx, y: dy });

        const swirl = 0.00045 * (1.1 - 0.7 * rn) * (1 + 0.25 * Math.sin(t * 2 + b.id));
        const pull = 0.00022 * (0.4 + 0.9 * rn);
        const up = 0.00035 * (1.1 - rn) * (0.8 + 0.2 * Math.sin(t * 3));
        const jitter = 0.00008 * Math.sin(t * 6 + b.id * 0.37);

        Body.applyForce(b, b.position, {
          x: tangential.x * swirl + radial.x * -pull + jitter * (Math.random() - 0.5),
          y: tangential.y * swirl + radial.y * -pull + -up + jitter * (Math.random() - 0.5),
        });

        // Cap angular velocity to prevent blow-ups for very long chains
        const av = b.angularVelocity;
        const capped = clamp(av, -0.35, 0.35);
        if (capped !== av) Body.setAngularVelocity(b, capped);
      }
    };

    Events.on(engine, "beforeUpdate", beforeUpdate);

    // ✅ Draw text along the chain path (one glyph per link)
    const getGlyph = (i: number) => {
      const s = text.length ? text : " ";
      return s[i % s.length];
    };

    const afterRender = () => {
      const ctx = render.context;
      ctx.save();

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${fontSizePx}px ${fontFamily}`;
      ctx.fillStyle = textColor;

      const doStroke = !!textStrokeColor;
      if (!doStroke) {
        ctx.strokeStyle = textStrokeColor;
        ctx.lineWidth = Math.max(2, Math.round(fontSizePx * 0.18));
      }

      for (let i = 0; i < chain.bodies.length; i++) {
        const b = chain.bodies[i];
        const ch = getGlyph(i);

        ctx.save();
        ctx.translate(b.position.x, b.position.y);
        ctx.rotate(b.angle + 90);

        if (doStroke) ctx.strokeText(ch, 0, 0);
        ctx.fillText(ch, 0, 0);

        ctx.restore();
      }

      ctx.restore();
    };

    Events.on(render, "afterRender", afterRender);

    // ---- Run
    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // ---- Resize handling
    const ro = new ResizeObserver(() => {
      ({ w, h } = getSize());

      render.options.width = w;
      render.options.height = h;
      render.canvas.width = Math.floor(w * (render.options.pixelRatio || 1));
      render.canvas.height = Math.floor(h * (render.options.pixelRatio || 1));
      render.canvas.style.width = `${w}px`;
      render.canvas.style.height = `${h}px`;

      // Update boundary positions/sizes
      Body.setPosition(bounds[0], { x: w / 2, y: -thickness / 2 });
      Body.setVertices(bounds[0], Bodies.rectangle(w / 2, -thickness / 2, w, thickness).vertices);

      Body.setPosition(bounds[1], { x: w / 2, y: h + thickness / 2 });
      Body.setVertices(bounds[1], Bodies.rectangle(w / 2, h + thickness / 2, w, thickness).vertices);

      Body.setPosition(bounds[2], { x: -thickness / 2, y: h / 2 });
      Body.setVertices(bounds[2], Bodies.rectangle(-thickness / 2, h / 2, thickness, h).vertices);

      Body.setPosition(bounds[3], { x: w + thickness / 2, y: h / 2 });
      Body.setVertices(bounds[3], Bodies.rectangle(w + thickness / 2, h / 2, thickness, h).vertices);

      // Move center & tether target with size
      center.x = w * 0.5;
      center.y = h * 0.6;
      softTether.pointB = { x: center.x, y: center.y };
    });
    ro.observe(host);

    // Cleanup
    return () => {
      ro.disconnect();
      Events.off(engine, "beforeUpdate", beforeUpdate);
      Events.off(render, "afterRender", afterRender);

      Render.stop(render);
      Runner.stop(runner);

      Composite.clear(world, false);
      Engine.clear(engine);

      render.canvas.remove();
      // @ts-expect-error Matter keeps a reference
      render.textures = {};
    };
  }, [links, text, fontSizePx, fontFamily, textColor, textStrokeColor]);

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <div className="absolute inset-0 " />
      <div ref={hostRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 " />
    </div>
  );
}
