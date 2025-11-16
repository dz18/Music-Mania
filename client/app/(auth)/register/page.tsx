import RegisterForm from "../../components/auth/registerForm";
import AuthContainer from "../../components/auth/AuthContainer";

export default function Register ({
  searchParams
} : {
  searchParams: {
    callbackUrl: string
  }
}) {

  const callbackUrl = searchParams.callbackUrl ?? '/'

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