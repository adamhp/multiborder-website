import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/Container';
import { Editor } from '@/components/editor/Editor';
import { editorPresets } from '@/content/editorPresets';
import './editor.css';

export const metadata: Metadata = {
  title: 'Free Online Photo Border Editor',
  description:
    'Add borders to multiple photos at once, right in your browser. Set aspect ratio, border size and color. Free, and nothing is uploaded.',
};

export default function EditorPage() {
  return (
    <Container>
      <Editor />
      <nav aria-labelledby='presets-heading' className='border-t border-white/10 py-12'>
        <h2 id='presets-heading' className='text-xl text-stone-100'>Start from a preset</h2>
        <ul className='mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2'>
          {editorPresets.map((preset) => (
            <li key={preset.slug}>
              <Link href={`/editor/${preset.slug}`} className='text-stone-100 underline underline-offset-4 hover:text-white'>
                {preset.heading}
              </Link>
              <p className='mt-1 text-sm text-stone-400'>{preset.description}</p>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}
