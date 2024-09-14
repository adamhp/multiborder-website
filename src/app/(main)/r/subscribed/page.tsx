import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

export default function Subscribed() {
  return (
    <Container>
      <div className="overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36 max-w-sm text-center mx-auto text-xl">
        You have been successfully subscribed to our newsletter!
      </div>
      <Button href="/" variant="outline" className="mt-16">
        Back to main page
      </Button>
    </Container>
  );
}
