import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { Editor } from '@/components/editor/Editor';
import './editor.css';

export const metadata: Metadata = {
  title: 'Web Editor · Multiborder',
  description: 'Add borders to your photos in your browser. Nothing is uploaded.',
};

export default function EditorPage() {
  return (
    <Container>
      <Editor />
    </Container>
  );
}
