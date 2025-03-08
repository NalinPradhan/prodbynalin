import ContactForm from "@/components/contact-form";
import MusicGallery from "@/components/music-gallery";
import type { Metadata } from "next";
// import { BackgroundAnimation } from "@/components/background-animation";

export const metadata: Metadata = {
  title: "prodbynalin's music collection",
  description: "A personal music hosting site for my beats",
};

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Remove bg-background class and add bg-transparent */}
      <div className="relative min-h-screen overflow-hidden bg-transparent transition-colors duration-500">
        {/* <BackgroundAnimation /> */}
        {/* Add bg-background/50 for semi-transparent container */}
        <div className="container relative px-4 py-10 mx-auto bg-transparent rounded-lg ">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-heading text-gradient from-yellow-300 via-pink-300 to-cyan-300 animate-gradient">
              prodbynalin
            </h1>
          </header>
          <MusicGallery />
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
