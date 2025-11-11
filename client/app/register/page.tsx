
'use client'

import Container from "../components/ui/Container";
import RegisterForm from "../components/auth/registerForm";
import AuthContainer from "../components/auth/AuthContainer";
import { useSearchParams } from "next/navigation";

export default function Register () {

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'

  return (
    <div>
      <Container>
        <AuthContainer
          form={<RegisterForm callbackUrl={callbackUrl}/>}
          title="Register"
          subtitle="Already have an account?"
          linkTitle="Sign In Here"
          linkHref={`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          callbackUrl={callbackUrl}
        />
        
      </Container>
    </div>
  )
}