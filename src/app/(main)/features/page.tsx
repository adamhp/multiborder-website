import type { Metadata } from 'next';
import { FeaturesSection } from "@/components/FeaturesSection";

export const metadata: Metadata = {
  title: 'Features',
  description:
    'Batch borders, aspect ratios, colors, camera captions and more: everything Multiborder can do for your photos.',
};

export default function Features() {
  return (
    <div className="pt-16 sm:pt-24">
      <FeaturesSection />
    </div>
  );
}
