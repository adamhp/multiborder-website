import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/Container';
import { Editor } from '@/components/editor/Editor';
import { siteUrl } from '@/constants';
import { editorPresets, findPreset } from '@/content/editorPresets';
import '../editor.css';

type Props = { params: Promise<{ preset: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return editorPresets.map(({ slug }) => ({ preset: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const preset = findPreset((await params).preset);
  if (!preset) return {};
  return { title: preset.title, description: preset.description };
}

export default async function PresetEditorPage({ params }: Props) {
  const preset = findPreset((await params).preset);
  if (!preset) notFound();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `Multiborder: ${preset.heading}`,
    description: preset.description,
    browserRequirements: 'Requires JavaScript',
    applicationCategory: 'PhotographyApplication',
    url: `${siteUrl}/editor/${preset.slug}`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  return (
    <Container>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Editor preset={preset.settings} heading={preset.heading} intro={preset.intro} />
    </Container>
  );
}
