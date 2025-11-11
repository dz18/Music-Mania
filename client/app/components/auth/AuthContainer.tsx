import { AudioLines, ChevronLeft } from "lucide-react";
import ProviderOptions from "./ProviderOptions";
import { ReactNode } from "react";
import Link from "next/link";

export default function AuthContainer({
  form,
  title,
  subtitle,
  linkTitle,
  linkHref,
  callbackUrl
} : {
  form: ReactNode
  title: string
  subtitle: string,
  linkTitle: string,
  linkHref: string,
  callbackUrl: string
}) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">

      <Link className="text-4xl flex gap-2 mb-10 items-center justify-center font-mono transition-all hover:text-shadow-[0_0_10px_rgba(255,255,255,0.5)]" href="/">
        <AudioLines className="text-teal-500" size={36}/>
        Music Mania
      </Link>

      <div className="border-1 rounded p-4 shadow-[0_0_15px_rgba(255,255,255,0.5)]">

        <Link 
          className="hover:bg-white/10 active:bg-white/30 p-1 rounded-full inline-flex items-center cursor-pointer"
          href={callbackUrl}
        >
          <ChevronLeft size={18}/>
        </Link>

        <h1 className="text-2xl text-bold font-bold">
          {title}
        </h1>
        <p className="text-xs">
          {subtitle} 
          <Link href={linkHref} className="ml-1 hover:font-bold">{linkTitle}</Link>
        </p>
        
        <div className="border-b-1 w-full mb-4 mt-2"/>

        {form}
        
        <div className="flex items-center gap-2 text-xs my-3">
          <div className="border-b-1 w-full"/>
          or
          <div className="border-b-1 w-full"/>
        </div>

        <ProviderOptions/>

      </div>

    </div>
  )
}