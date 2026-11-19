import About from "@/components/about";
import Contact from "@/components/Contact";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";


export default function Home() {
  return (
    <main style={{ width: "100%", minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <About/>
      <Skills/>
      <Projects/>
      <Contact/>
    </main>
  );
}
