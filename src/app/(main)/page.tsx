import { Hero } from "@/components/Hero";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ReviewsStrip } from "@/components/ReviewsStrip";

export default function Home() {
  return (
    <>
      <Hero />
      <ReviewsStrip />
      <FeaturesSection />
    </>
  );
}
