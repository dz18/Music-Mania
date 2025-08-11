import Container from "../components/ui/Container";
import AuthContainer from "../components/auth/AuthContainer";
import SignInForm from "../components/auth/SignInForm";

export default function signIn () {

  return (
    <div>
      <Container>
        <AuthContainer
          form={<SignInForm/>}
          title="Sign In"
          subtitle="Don't have an account?"
          linkTitle="Register Here"
          linkHref="/register"
        />
      </Container>
    </div>
  )
}