import AuthContainer from "@/app/components/auth/AuthContainer";
import SignInForm from "@/app/components/auth/SignInForm";

export default async function SignIn ({
  searchParams
} : {
  searchParams: Promise<{ callbackUrl?: string }>
}) {

  
  const params = await searchParams
  const callbackUrl = params.callbackUrl ?? '/'

  return (
    <AuthContainer
      form={<SignInForm callbackUrl={callbackUrl}/>}
      title="Sign In"
      subtitle="Don't have an account?"
      linkTitle="Register Here"
      linkHref={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
      callbackUrl={callbackUrl}
    />
  )
}