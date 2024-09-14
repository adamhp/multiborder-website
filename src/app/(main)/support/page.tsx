import { Container } from "@/components/Container";
import Link from "next/link";
import { Button } from "@/components/Button";

export default function Support() {
  return (
    <Container>
      <h1 className="text-3xl">Support</h1>
      <div className="flex flex-col items-center max-w-2xl py-16 mx-auto">
        <p className="text-lg text-center">
          If you have questions or issues using the app, please email us or use
          the <Link href="/feedback">feedback form</Link>!
          <br />
        </p>
        <a className="text-xl mt-8" href="mailto:email@multiborder.io">
          email@multiborder.io
        </a>
        <Button href="/" variant="outline" className="mt-16">
          Back to main page
        </Button>
      </div>
    </Container>
  );
}
