import Welcome from "./components/root/Welcome";
import Container from "./components/ui/Container";
import Footer from "./components/ui/Footer";

export default function Home() {
  return (
    <div>
      <Container>

        <section>
          <Welcome/>
        </section>

      </Container>
        
      <Footer/>
    </div>
  );
}
