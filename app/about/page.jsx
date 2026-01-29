import Image from "next/image";

export default function About() {
 

  return (
    <div className="min-h-screen-h px-6">
      <div className="grid grid-cols-6 gap-6 max-sm:grid-cols-1">
        <div className="col-span-2">
          <p className="font-sans">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum, tellus ut pellentesque pellentesque, est neque sollicitudin purus, et facilisis risus arcu malesuada nunc. Donec nisl est, consequat at vulputate quis, ultricies at turpis. Donec eros dolor, sollicitudin id erat eu, fringilla ultrices elit. Donec est justo, iaculis a ex ac, vulputate lacinia elit. Vestibulum purus lorem, fringilla vel porttitor at, semper id sem. Aenean suscipit eu dui nec congue. Nam gravida tellus eu tortor aliquam tempus. Curabitur eget fringilla mi, sed aliquam nisl. Phasellus libero augue, finibus ut turpis sed, egestas tristique neque. Pellentesque vitae risus pulvinar, blandit urna eu, tristique tortor. Nam sit amet ultrices metus, eget mollis quam.
          </p>
        </div>
        <Image 
            src="/dummy-img.jpg"
            width={900}
            height={900}
            alt="flowers"
            className="col-start-4 max-sm:col-start-1 col-span-3 aspect-square rounded-sm object-cover max-sm:h-[50vh]]">    
        </Image>
        

      </div>
      
    </div>
  );
}
