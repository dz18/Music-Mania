export default function StarStatisticsBar ({
  stat,
  maxCount
} : {
  stat: StarCount,
  maxCount: number
}) {
  const normalized = (stat.rating - 0.5) / (5 - 0.5) // 0 → 1
  const hue = normalized * 120 // red (0) → green (120)

  return (
    <div
      className="flex-1 flex bg-surface-elevated border-white/5 border rounded"
    >
      <div
        className="h-4 rounded transition-[width] duration-300 ease-out"
        style={{
          width: `${maxCount > 0 ? (stat.count / maxCount) * 100 : 0}%`,
          backgroundColor: `hsl(${hue}, 85%, 40%)`,
          border: `1px solid hsl(${hue}, 85%, 55%)`,
        }}
      />
    </div>
  )
}