import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { Editor } from '@/components/editor/Editor';
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
    </Container>
  );
}
