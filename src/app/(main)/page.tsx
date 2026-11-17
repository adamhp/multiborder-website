import { Hero } from "@/components/Hero";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ReviewsStrip } from "@/components/ReviewsStrip";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MobileApplication",
      name: "Multiborder",
      operatingSystem: "iOS",
      applicationCategory: "PhotographyApplication",
      description:
        "Add borders to multiple images at once, preserving aspect ratio for social media posts.",
      url: "https://apps.apple.com/app/id6473557515",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "WebApplication",
      name: "Multiborder Web Editor",
      browserRequirements: "Requires JavaScript",
      applicationCategory: "PhotographyApplication",
      url: "https://www.multiborder.io/editor",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Hero />
      <ReviewsStrip />
      <FeaturesSection />
    </>
  );
}
