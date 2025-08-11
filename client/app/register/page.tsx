
import { AudioLines, ChevronLeft } from "lucide-react";
import Container from "../components/ui/Container";
import Link from "next/link";
import RegisterForm from "../components/auth/registerForm";
import ProviderOptions from "../components/auth/ProviderOptions";
import AuthContainer from "../components/auth/AuthContainer";

export default function Register () {


  return (
    <div>
      <Container>
        <AuthContainer
          form={<RegisterForm/>}
          title="Register"
          subtitle="Already have an account?"
          linkTitle="Sign In Here"
          linkHref="/sign-in"
        />
        
      </Container>
    </div>
  )
}