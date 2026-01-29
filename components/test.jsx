"use client";

import gsap from "gsap";
import {
  ScrollTrigger,
  MorphSVGPlugin,
  SplitText,
  DrawSVGPlugin,
} from "gsap/all";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(
  useGSAP,
  MorphSVGPlugin,
  ScrollTrigger,
  SplitText,
  DrawSVGPlugin
);

export default function Test() {
  useGSAP(() => {
    const VELOCITY_TO_ENERGY = 3500; // bigger => less sensitive
    const DECAY = 0.85; // 0.85–0.95 (higher => slower decay)

    let energy = 0;

    let split = SplitText.create("#tt", { type: "chars, words" });

    gsap.from("#damn", { duration: 1, drawSVG: "50%", stagger: 0.1 });
    gsap.from(".cls-1", {
      drawSVG: 0,
      duration: 1.5,
      stagger: 0.4,
    });

    const scrollTween = gsap.to("#tt", {
      //xPercent: -100,
      ease: "none",
      scrollTrigger: {
        trigger: "#tt",
        //pin: true,
        //end: "+=5000px",
        scrub: true,
      },
    });

    split.chars.forEach((char) => {
      gsap.to(char, {
        yPercent: "random(-200, 200)",
        rotation: "random(-20, 20)",
        //ease: "back.out(1.2)",
        //ease: "expo.out",
        //duration: 1.6,
        scrollTrigger: {
          trigger: "#tt",
          containerAnimation: scrollTween,
          //start: "left 100%",
          //end: "left 30%",
          scrub: true,
        },
      });
    });

    /*const tween = gsap.to("#tt", {
      rotate: 45,
      transformOrigin: "center center",
      morphSVG: "#star",
      duration: 2,
      ease: "sine.inOut",
      paused: true
      //ease: "expo.inOut",
      //repeat: -1,
      //yoyo: true
    });*/

    /*const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate(self) {
        const speed = Math.abs(self.getVelocity()); // px/sec
        const impulse = gsap.utils.clamp(0, 2, speed / VELOCITY_TO_ENERGY);
        energy = Math.max(energy, impulse); // take peaks, then decay
      },
    });

    const tick = () => {
      energy *= DECAY;
      // avoid tiny perpetual updates
      if (energy < 0.0005) energy = 0;
      tween.progress(energy);
    };*/

    //gsap.ticker.add(tick);
  });

  return (
    <div className="w-auto text-center">
      {/*<h1 id="tt">this is a subtitle with some funky animation</h1>*/}
      <p className="font-sans text-2xl max-sm:m-10">I like to make
        <span>
      <svg
        className="inline-block h-[2em] align-baseline relative top-[1.1em] mx-[0.2em] inline-block h-[1em]"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1042 331"
      >
        <path
          className="cls-1 fill-none stroke-black stroke-5"
          d="M87.47,132.32C53.66,124.13-.27,110.32,12.85,168.16c50.56,5.59,101.78-84.42,106.31-127.47-18,31.02-58.53,113.96-19.91,136.32,35.46,20.54,106.73-35.04,125.98-60.96-12.34,3.36-10.5,3.78-18.71,12.6,45.02,19.14,87.26,1.57,129.39-16.72-13.24,10.62-20.69,24.28-19.24,39.86,18.65-11.3,30.15-28.47,45.46-43.57-7.43,53.58-58.41,214.83-134.15,203.34,19.36-51.61,99.72-88.58,136.69-130.05,25.53-28.64,51.04-55.3,63.42-90.21,41.58,37.09,93.08-8.71,102.9-52.51-9.74,24.99-40.33,61.38-2.72,75.65,17.94,6.81,64.5-17.74,86.57-19.05-37.06-7.71-35.88,50.47,13.44,12.61,40.45,59.33,99.31-67.53,115.46-89.16-18.64,69.84-14.71,103.35,67.47,114.91,72.61,10.22,146.84,6.76,219.98,6.76"
        />
        <path
          className="cls-1 fill-none stroke-black stroke-5"
          d="M228.66,82.97c-6.16,11.56,8.91.82,2.49-1.47"
        />
        <path
          className="cls-1 fill-none stroke-black stroke-5"
          d="M427.63,66.12c-.74.19-1.15-.2-1.63,1.08,1.29.79,9.63,2.56,5.38-2.3"
        />
        <path
          className="cls-1 fill-none stroke-black stroke-5"
          d="M489.57,62.56h77.96"
        />
      </svg></span>
      things
      </p>
    </div>
  );
}
