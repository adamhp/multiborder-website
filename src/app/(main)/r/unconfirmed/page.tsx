import { Container } from "@/components/Container";
import { NewsletterSignup } from "../../../../components/NewsletterSignup";
import { Button } from "@/components/Button";

export default function Subscribed() {
  return (
    <Container>
      <div className="overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36 max-w-lg text-center mx-auto text-xl">
        Hmm. 🤔 Looks like you didn’t successfully subscribe. If this was
        unintentional, you can try again below! Otherwise, no worries.
        <NewsletterSignup />
        <Button href="/" variant="outline" className="mt-16">
          Back to main page
        </Button>
      </div>
    </Container>
  );
}
