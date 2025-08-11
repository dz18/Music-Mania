import Google from "@/app/assets/Google";
import Spotify from "@/app/assets/Spotify";

export default function ProviderOptions () {
  return (
    
    <div className="flex flex-col gap-3">
      <button className="flex w-full gap-4 px-1 py-2 bg-white rounded text-black items-center justify-center font-mono cursor-pointer hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] text-sm active:shadow-[0_0_20px_rgba(255,255,255,0.5)] active:bg-white/80 transition-all">
        <Google size={18}/>Sign-in with Google
      </button>
      
      <button className="flex w-full gap-4 px-1 py-2 bg-white rounded text-black items-center justify-center font-mono cursor-pointer hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] text-sm active:shadow-[0_0_20px_rgba(255,255,255,0.5)] active:bg-white/80 transition-all">
        <Spotify size={18}/>Sign-in with Spotify
      </button>
    </div>
  )
}