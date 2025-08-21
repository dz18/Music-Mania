export default function IndeterminateLoadingBar ({
  bgColor,
  mainColor
} : {
  bgColor: string
  mainColor: string
}) {
  return (
    <div className="w-full">
      <div className={`h-1.5 w-full ${bgColor} overflow-hidden`}>
        <div className={`progress w-full h-full ${mainColor} left-right`}></div>
      </div>
    </div>
  )
}