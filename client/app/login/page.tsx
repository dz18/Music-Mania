import { AudioLines } from "lucide-react";
import Container from "../components/ui/Container";
import Footer from "../components/ui/Footer";
import UnderConstruction from "../lib/fallback/UnderConstruction";
import Link from "next/link";
import Google from "../assets/Google";
import LoginForm from "../components/login/loginForm";

export default function Login () {

  return (
    <div>
      <Container>
        <div className="flex flex-col min-h-screen items-center justify-center">

          <Link className="text-4xl flex gap-2 mb-10 items-center justify-center font-mono transition-all hover:text-shadow-[0_0_10px_rgba(255,255,255,0.5)]" href="/">
            <AudioLines className="text-teal-500" size={36}/>
            Music Mania
          </Link>

          <div className="border-1 rounded p-4 shadow-[0_0_15px_rgba(255,255,255,0.5)]">

            <h1 className="text-2xl text-bold font-bold">
              Login
            </h1>
            <p className="text-xs">
              Don't have an account? 
              <Link href='/register' className="ml-1 hover:font-bold">Register</Link>
            </p>
            
            <div className="border-b-1 w-full mb-4 mt-2"/>

            <LoginForm/>
            
            <div className="flex items-center gap-2 text-xs my-3">
              <div className="border-b-1 w-full"/>
              or
              <div className="border-b-1 w-full"/>
            </div>

            <button className="flex w-full gap-4 px-1 py-2 bg-white rounded text-black items-center justify-center font-mono cursor-pointer hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] text-sm active:shadow-[0_0_20px_rgba(255,255,255,0.5)] active:bg-white/80 transition-all">
              <Google size={18}/>Sign-in with Google
            </button>

          </div>

        </div>
      </Container>
    </div>
  )
}