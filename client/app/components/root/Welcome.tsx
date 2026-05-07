'use client'

import { ArrowRight, BarChart2, Music, Star, Users } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LandingStats from "./LandingStats";

const features = [
  {
    icon: Star,
    title: 'Reviews',
    description: 'Share your take on albums, tracks, and artists. Rate anything in music and see how your opinions stack up.',
  },
  {
    icon: BarChart2,
    title: 'Statistics',
    description: "Explore community-driven trends and charts. Discover what's rising, ruling, and being talked about.",
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Connect with music lovers, follow their taste, and find your next favorite artist through real people.',
  },
]

export default function Welcome() {
  const { status } = useSession()

  return (
    <div className="flex flex-col font-mono">

      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-6 px-4 pt-30 text-center">
        <div className="flex items-center justify-center gap-3">
          <Music size={44} className="text-teal-400" />
          <h1 className="cursor-pointer text-5xl font-bold bg-gradient-to-r from-teal-500 via-sky-300 to-pink-300 bg-clip-text text-transparent hover:[text-shadow:0_0_20px_rgb(20_184_166_/_0.3),0_0_40px_rgb(56_189_248_/_0.3)] transition-all">
            Music Mania
          </h1>
          <Music size={44} className="text-pink-300" /> 
        </div>

        <p className="text-xl text-gray-300 max-w-xl leading-relaxed">
          The community for music reviews, statistics, and discovering what people are really listening to.
        </p>


      </section>
      {/* CTA Banner */}
      <section className="py-10 px-4 text-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-200">Ready to join the community?</h2>
        <p className="text-gray-400 mb-6 text-sm">Create an account and start sharing your music taste today.</p>
        <Link
          href={status === 'authenticated' ? '/explore' : '/register'}
          className="bg-teal-950 text-teal-300 border border-teal-300 px-6 py-2 rounded input-glow interactive-button font-semibold inline-flex items-center gap-2 text-sm"
        >
          {status === 'authenticated' ? 'Start Searching' : 'Create Account'} <ArrowRight size={15} />
        </Link>
      </section>

      <LandingStats />

      {/* Features */}
      <section className="pb-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-200">Everything in one place</h2>
          <p className="text-sm text-gray-500 text-center mb-10">Built for people who take music seriously.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-surface-elevated border border-white/10 rounded-lg p-6 flex flex-col gap-3 hover:border-teal-500/40 transition-colors duration-200"
              >
                <Icon size={26} className="text-teal-400" />
                <h3 className="text-base font-bold text-gray-100">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
