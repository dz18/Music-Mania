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
            href='/home'
          >
            Music Mania
          </Link>
          <Music size={40}/>  
        </h1>
        <p className="mt-2 text-lg text-center">Providing music listeners with a community for music reviews, statistics, and a platform to be heard.</p>
        <p className="mt-2 text-lg text-center">Currently under constuction. Your patience is appreciated.🚧</p>
      </section>

      <section>
        <div className="flex gap-4 items-center">
          <button 
            className="bg-transparent text-white border-white hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] transition border-1 px-4 py-2 rounded text-xl font-bold cursor-pointer active:bg-white/10"
            onClick={() => router.push('/home')}
          >
            Visit Music Mania
          </button>
        </div>
        <p className="text-xs text-center m-2 text-gray-500">pre-register your account</p>
      </section>
      
    </div>
  )
}