import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

export default function Reviews() {
  return (
    <Container>
      <div className="overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36">
        Reviews
        <Button href="/" variant="outline" className="mt-16">
          Back to main page
        </Button>
      </div>
    </Container>
  );
}
