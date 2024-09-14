import { Container } from "@/components/Container";
import { PrimaryFeatures } from "@/components/Features";

export default function Features() {
  return (
    <Container>
      <div className="flex flex-col items-center mx-auto">
        <PrimaryFeatures />
      </div>
    </Container>
  );
}
