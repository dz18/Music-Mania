'use client'

import { useQuery } from "@tanstack/react-query"
import { getLandingStats, TopArtist, TopRelease } from "@/app/lib/api/stats"
import Link from "next/link"
import { BarChart2, Heart, MessageSquare } from "lucide-react"
import Image from "next/image"

function artistCreditName(artistCredit: any[]): string {
  if (!Array.isArray(artistCredit) || artistCredit.length === 0) return 'Unknown'
  return artistCredit.map(c => c.name ?? c.artist?.name ?? '').filter(Boolean).join(', ')
}

function ArtistRow({ item, rank }: { item: TopArtist; rank: number }) {
  return (
    <Link
      href={`/artist/${item.id}`}
      className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5 transition-colors group"
    >
      <span className="text-xs font-bold text-gray-500 w-4 shrink-0">#{rank}</span>
      <span className="text-sm text-gray-200 flex-1 truncate group-hover:text-teal-300 transition-colors">
        {item.name}
      </span>
      <span className="text-xs text-gray-500 shrink-0">{item.count}</span>
    </Link>
  )
}

function ReleaseRow({ item, rank }: { item: TopRelease; rank: number }) {
  return (
    <Link
      href={`/release/${item.id}`}
      className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5 transition-colors group"
    >
      <span className="text-xs font-bold text-gray-500 w-4 shrink-0">#{rank}</span>
      {item.coverArt ? (
        <Image
          src={item.coverArt}
          alt={item.title}
          width={32}
          height={32}
          className="rounded shrink-0 object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded bg-surface shrink-0" />
      )}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm text-gray-200 truncate group-hover:text-teal-300 transition-colors">
          {item.title}
        </span>
        <span className="text-xs text-gray-500 truncate">
          {artistCreditName(item.artistCredit)}
        </span>
      </div>
      <span className="text-xs text-gray-500 shrink-0">{item.count}</span>
    </Link>
  )
}

function StatColumn({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-surface-elevated border border-white/10 rounded-lg p-4 flex flex-col gap-1">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
        <Icon size={15} className="text-teal-400 shrink-0" />
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</span>
      </div>
      {children}
    </div>
  )
}

function SkeletonRows() {
  return (
    <>
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center gap-3 px-3 py-2">
          <div className="w-4 h-3 bg-white/10 rounded animate-pulse shrink-0" />
          <div className="flex-1 h-3 bg-white/10 rounded animate-pulse" />
          <div className="w-4 h-3 bg-white/10 rounded animate-pulse shrink-0" />
        </div>
      ))}
    </>
  )
}

export default function LandingStats() {
  const { data, isLoading } = useQuery({
    queryKey: ['landingStats'],
    queryFn: getLandingStats,
    staleTime: 5 * 60 * 1000,
  })

  const empty = (
    <p className="text-xs text-gray-600 px-3 py-2">No data yet</p>
  )

  return (
    <section className="pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-center mb-1 text-gray-200">Community Highlights</h2>
        <p className="text-sm text-gray-500 text-center mb-8">What the community is listening to right now.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">

          <StatColumn icon={MessageSquare} label="Most Reviewed Artists">
            {isLoading ? <SkeletonRows /> :
              data?.topReviewedArtists.length
                ? data.topReviewedArtists.map((a, i) => <ArtistRow key={a.id} item={a} rank={i + 1} />)
                : empty}
          </StatColumn>

          <StatColumn icon={Heart} label="Most Liked Artists">
            {isLoading ? <SkeletonRows /> :
              data?.topLikedArtists.length
                ? data.topLikedArtists.map((a, i) => <ArtistRow key={a.id} item={a} rank={i + 1} />)
                : empty}
          </StatColumn>

          <StatColumn icon={BarChart2} label="Most Liked Albums">
            {isLoading ? <SkeletonRows /> :
              data?.topLikedReleases.length
                ? data.topLikedReleases.map((r, i) => <ReleaseRow key={r.id} item={r} rank={i + 1} />)
                : empty}
          </StatColumn>

        </div>
      </div>
    </section>
  )
}
