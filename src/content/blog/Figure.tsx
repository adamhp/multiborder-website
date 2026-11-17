import Image from 'next/image';

/** A post image from `public/blog/`, with its caption. */
export function Figure({ src, alt, width, height, caption }: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
}) {
  return (
    <figure>
      <Image src={`/blog/${src}`} alt={alt} width={width} height={height} sizes='(min-width: 768px) 65ch, 100vw' />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
