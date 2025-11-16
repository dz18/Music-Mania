import AuthContainer from "@/app/components/auth/AuthContainer";
import SignInForm from "@/app/components/auth/SignInForm";

export default function SignIn ({
  searchParams
} : {
  searchParams: {
    callbackUrl: string
  }
}) {

  const callbackUrl = searchParams.callbackUrl ?? '/'

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