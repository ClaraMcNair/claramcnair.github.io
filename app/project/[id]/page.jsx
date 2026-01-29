"use client";

import content from "@/utils/projects.json";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import AttributeTags from "@/components/ui/attributeTags";

export default function ProjectPage() {
  //const { id } = params;
  const { id } = useParams();
  //console.log(id);

  // assumes each project has an `id` in your JSON
  const project = content.contents.find((p) => String(p.id) === id);

  if (!project) notFound();

  return (
    <div className="min-h-screen px-6">
      <div className="mx-auto w-full  flex flex-col gap-5">
        

        <div className="">
          <Image
            src="/dummy-img.jpg"
            width={900}
            height={900}
            alt={project.title}
            className="h-[70dvh] w-full rounded-sm object-cover max-sm:h-[50vh]]"
          />
        </div>

        <Link href="/about" className="text-sm font-mono text-dark-grey hover:underline">
          ← Back
        </Link>
        <div className="grid grid-cols-6 gap-6 ">
          <h1 className="font-serif text-5xl text-dark-grey col-span-2 max-sm:col-span-full">
            {project.title}
          </h1>
          {project.description && (
          <p className="font-sans text-2xl text-dark-grey col-span-4 max-sm:col-span-full">{project.description}</p>
        )}
        </div>
        <AttributeTags attributes={project.attributes}/>
        
     

        {project.content && (
          <div className="grid grid-cols-6 gap-5">
            {
          project.content.map((content, i) => {
            if (content.type == "img"){
              return (
              <div key={i} className={`${content.size} max-sm:col-span-full`}>
                <Image className={`w-full rounded-sm aspect-video object-cover max-sm:aspect-square`} width={500} height={500} alt={content.alt} src={content.source}></Image>
                <p className="font-mono text-sm mt-2.5">Source</p>
              </div>
            )
            }
            else if (content.type == "text"){
              return (<p className={`text-dark-grey h-auto bottom-0 ${content.size}`} key={i}>{content.text}</p>)
            }
            else if (content.type == "video") {
              return (
                <video key={i} autoPlay controls muted className="rounded-sm">
                  <source src="/cherish_final_small.mp4" type="video/mp4"></source>
                  error
                </video>
              )
            }
          })
        }
          </div>
        )
        }
        
       
      </div>
    </div>
  );
}
