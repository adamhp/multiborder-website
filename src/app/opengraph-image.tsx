import { ImageResponse } from 'next/og';

export const alt = 'Multiborder: add borders to multiple photos at once';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 96,
          background: '#292524',
          color: '#f5f5f4',
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 700 }}>Multiborder</div>
        <div style={{ marginTop: 24, fontSize: 44, color: '#d6d3d1' }}>
          Add borders to multiple photos at once.
        </div>
        <div style={{ marginTop: 48, fontSize: 32, color: '#d97706' }}>
          iOS app · free web editor
        </div>
      </div>
    ),
    size,
  );
}
