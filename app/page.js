"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import Link from "next/link";
import ChainLetters from "../components/chains.tsx";
import TornadoChain from "../components/chains.tsx";
import MatterCircles from "@/components/balls.jsx";
import AsciiDonut from "@/components/donut.jsx";
import Test from "@/components/test.jsx";

import content from "../utils/projects.json";
import Image from "next/image";
import AttributeTags from "@/components/ui/attributeTags";

gsap.registerPlugin(ScrollTrigger, SplitText);


export default function Home() {
  const containerRef = useRef();
  const wrapperRef = useRef();
  const textRef = useRef();

  const size = 15;
  const center = Math.floor(size / 2);
  const maxDistance = Math.sqrt(2 * center * center);

  //let wrapper = document.querySelector(".Horizontal");
  //let text = document.querySelector(".Horizontal__text");
  //let split = SplitText.create(".Horizontal__text", { type: "chars, words" });




  useLayoutEffect(() => {


    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".project-card");
      let split = SplitText.create(textRef.current, {
        types: "chars",
      });

      gsap.from(split.chars, {
        opacity: 1,
        y: "100%",
        ease: "expo.out",
        duration: 0.6,
        stagger: 0.04,
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%",
        },
      });

      // initial state
      gsap.set(cards, { autoAlpha: 0, y: 24 });

      // animate each card once when it enters view
      cards.forEach((card) => {
        gsap.to(card, {
          autoAlpha: 1,
          y: 0,
          duration: 1.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 75%",
            once: true,
          },
        });
      });

      return () => split.revert();
    }, containerRef, textRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center font-sans dark:bg-light-white">
      <main className="flex min-h-screen w-full   flex-col items-center justify-between  dark:bg-light-white sm:items-start" id="smooth-wrapper">
        <div className="h-[calc(100vh-80px)] pb-[80px] w-full text-dark-grey px-6">

   
          {/*

          <div  
            className="grid h-full absolute"
            style={{
              gridTemplateColumns: `repeat(${size}, 1fr)`,
            }}
          >
            {Array.from({ length: size * size }).map((_, i) => {
              const row = Math.floor(i / size);
              const col = i % size;

              const dx = col - center;
              const dy = row - center;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const intensity = 0.8 - distance / maxDistance;

              return (
                <div
                  key={i}
                  className="aspect-square"
                  style={{
                    backgroundColor: `rgba(255, 60, 60, ${intensity})`,
                  }}
                />
              );
            })}
          </div>
          */}
          <div className="w-full h-full flex flex-col justify-center">
            <h1 className="font-accent text-9xl max-sm:text-6xl overflow-hidden mx-auto z-10 text-center" ref={textRef}>Hi, I'm Clara </h1> 
            <Test/>    
          </div>
          <div className="w-full h-full flex absolute top-0">
            <div className="bg-none size-96 block m-auto"></div>
          </div>
  

        </div>

        <div ref={containerRef} className="grid grid-cols-2 gap-4 w-full  px-16 max-sm:px-5 max-w-7xl mx-auto" id="smooth-content">
          {content.contents.map((element, i) => (
            <div
              key={element.title}
              //className={`bg-light-white ${index % 3 === 0 ? "col-span-2" : ""}`}
              className={`project-card flex flex-col gap-5 my-5 ${(Math.floor(i / 2) + (i % 2)) % 2 === 0
                ? "mx-auto max-sm:col-span-2"
                : "px-[25%] mx-auto my-auto max-sm:col-span-2 max-sm:px-0"
                }`}
            >
              <Link href={`/project/${element.id}`} className="overflow-hidden">
                <Image
                  width={500}
                  height={500}
                  alt="Picture of the author"
                  src={element.thumbnail}
                  className="aspect-square rounded-sm cursor-pointer object-cover scale-110"
                ></Image>
              </Link>

              <h1 className="font-serif capitalize text-dark-grey text-2xl cursor-pointer">
                {element.title}
              </h1>

              <AttributeTags attributes={element.attributes} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
