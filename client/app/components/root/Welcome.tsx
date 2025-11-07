'use client'

import { Music } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Welcome () {

  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-8 font-mono">

      <section className="flex flex-col items-center">
        <h1 className="text-5xl font-bold flex  text-center items-center justify-center gap-3">
          Welcome to 
          <Link 
            className="ml-4 hover:[text-shadow:0_0_10px_rgb(20_184_166_/_0.3),0_0_20px_rgb(56_189_248_/_0.3),0_0_30px_rgb(244_114_182_/_0.3)] transition-all bg-gradient-to-r from-teal-500 via-sky-300 to-pink-300 bg-clip-text text-transparent"
            href='/'
          >
            Music Mania
          </Link>
          <Music size={40}/>  
        </h1>
        <p className="mt-2 text-lg text-center">Providing music listeners with a community for music reviews, statistics, and a platform to be heard.</p>
        <p className="mt-2 text-lg text-center">Currently under constuction. Your patience is appreciated.🚧</p>
      </section>
      
    </div>
  )
}