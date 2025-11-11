'use client'

import Container from "../components/ui/Container";
import AuthContainer from "../components/auth/AuthContainer";
import SignInForm from "../components/auth/SignInForm";
import { useSearchParams } from "next/navigation";

interface SignInPageProps {
  searchParams: {
    callbackUrl?: string;
  };
}

export default function signIn () {

  
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'
  console.log(callbackUrl)

  return (
    <div>
      <Container>
        <AuthContainer
          form={<SignInForm callbackUrl={callbackUrl}/>}
          title="Sign In"
          subtitle="Don't have an account?"
          linkTitle="Register Here"
          linkHref={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          callbackUrl={callbackUrl}
        />
      </Container>
    </div>
  )
}