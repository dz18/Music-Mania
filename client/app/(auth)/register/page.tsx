import RegisterForm from "../../components/auth/registerForm";
import AuthContainer from "../../components/auth/AuthContainer";

export default async function Register ({
  searchParams
} : {
  searchParams: Promise<{ callbackUrl?: string }>
}) {

  const params = await searchParams
  const callbackUrl = params.callbackUrl ?? '/'

  return (
    <AuthContainer
      form={<RegisterForm callbackUrl={callbackUrl}/>}
      title="Register"
      subtitle="Already have an account?"
      linkTitle="Sign In Here"
      linkHref={`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}
      callbackUrl={callbackUrl}
    />
  )
}