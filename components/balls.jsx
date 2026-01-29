"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";

export default function MatterCircles({
  width = 320,
  height = 320,
  background = "#111827", // overlay color (the thing you "cut holes" in)
  circleCount = 10,
}) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const { Engine, World, Bodies, Runner } = Matter;

    const engine = Engine.create();
    const world = engine.world;

    // Runner (physics loop)
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Walls to confine circles
    const thickness = 40;
    const walls = [
      Bodies.rectangle(width / 2, -thickness / 2, width, thickness, { isStatic: true }),
      Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, { isStatic: true }),
      Bodies.rectangle(-thickness / 2, height / 2, thickness, height, { isStatic: true }),
      Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, { isStatic: true }),
    ];
    World.add(world, walls);

    // Circles
    const r = Math.min(width, height) * 0.05; // radius relative to size
    const circles = Array.from({ length: circleCount }).map((_, i) =>
      Bodies.circle(
        width/2,
        20 + Math.floor(i / 10) * 20,
        40,
        { restitution: 0.9, friction: 0.05, frictionAir: 0.01 }
      )
    );
    World.add(world, circles);

    // Canvas setup
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    let rafId = 0;

    const draw = () => {
      // fill overlay
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);

      // punch holes where circles are
      ctx.globalCompositeOperation = "destination-out";
      for (const body of circles) {
        const { x, y } = body.position;

        ctx.beginPath();
        ctx.arc(x, y, body.circleRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // reset (good hygiene)
      ctx.globalCompositeOperation = "source-over";

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      Runner.stop(runner);
      World.clear(world, false);
      Engine.clear(engine);
    };
  }, [width, height, background, circleCount]);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "relative",
        width,
        height,
        overflow: "hidden",
        borderRadius: 12,
      }}
    >
      {/* Whatever you put here will be revealed through the "holes" */}
      <div style={{ position: "absolute", inset: 0 }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(135deg, #22c55e, #3b82f6, #a855f7)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            color: "white",
            fontFamily: "system-ui",
            fontWeight: 700,
            fontSize: 20,
            textShadow: "0 2px 20px rgba(0,0,0,0.5)",
          }}
        >
          Behind MatterCirclesMask
        </div>
      </div>

      {/* The overlay canvas that gets holes punched in it */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none", // so you can interact with content behind if needed
        }}
      />
    </div>
  );
}
