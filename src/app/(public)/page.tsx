import { Navbar } from "@/components/landing/Navbar"
import { Hero } from "@/components/landing/Hero"
import { Stats } from "@/components/landing/Stats"
import { Features } from "@/components/landing/Features"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { ContactForm } from "@/components/landing/ContactForm"
import { Footer } from "@/components/landing/Footer"

export default function Home() {
  return (
    <main className="w-full flex justify-center overflow-hidden">
      {/* We wrap everything in a container to prevent horizontal overflow from animations/blobs if any */}
      <div className="w-full max-w-[100vw] flex flex-col relative">
        <Navbar />
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <ContactForm />
        <Footer />
      </div>
    </main>
  )
}
