import React, { useEffect, useRef } from "react";

/**
 * ASCII Donut (inspired by a1k0n donut-math)
 * Port of the snippet you posted into a React component.
 *
 * Notes:
 * - Uses textContent (not innerHTML) for speed + safety
 * - Cleans up the interval on unmount
 * - Monospace + pre formatting included
 */
export default function AsciiDonut({
  fps = 20, // 20fps ~= 50ms interval
  className = "",
  style = {},
}) {
  const preRef = useRef(null);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;

    const cols = 80;
    const rows = 22;
    const size = cols * rows;

    let z = 0;
    let y = 0;

    const ramp = ".,-~:;=!*#$@";

    const intervalMs = Math.max(1, Math.floor(1000 / fps));

    const tick = () => {
      z += 0.07;
      y += 0.03;

      // char buffer (includes newlines)
      const a = Array.from({ length: size }, (_, r) => (r % cols === cols - 1 ? "\n" : " "));
      // z-buffer
      const r = new Array(size).fill(0);

      const t = Math.cos(z),
        e = Math.sin(z),
        n = Math.cos(y),
        o = Math.sin(y);

      for (let s = 0; s < 6.28; s += 0.07) {
        const c = Math.cos(s),
          h = Math.sin(s);

        for (let s2 = 0; s2 < 6.28; s2 += 0.02) {
          const v = Math.sin(s2),
            M = Math.cos(s2),
            i = c + 2,
            l = 1 / (v * i * e + h * t + 5),
            p = v * i * t - h * e;

          const d = (0 | (40 + 30 * l * (M * i * n - p * o)));
          const m = (0 | (12 + 15 * l * (M * i * o + p * n)));

          const f =
            0 |
            (8 *
              ((h * e - v * c * t) * n -
                v * c * e -
                h * t -
                M * c * o));

          const idx = d + cols * m;

          if (m < rows && m >= 0 && d >= 0 && d < cols - 1 && l > r[idx]) {
            r[idx] = l;
            a[idx] = ramp[f > 0 ? f : 0] ?? ramp[0];
          }
        }
      }

      pre.textContent = a.join("");
    };

    // kick off immediately, then loop
    tick();
    const id = setInterval(tick, intervalMs);

    return () => clearInterval(id);
  }, [fps]);

  return (
    <pre
      ref={preRef}
      className={className}
      style={{
        margin: 0,
        whiteSpace: "pre",
        lineHeight: 1,
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        fontSize: 22,
        ...style,
      }}
    />
  );
}
