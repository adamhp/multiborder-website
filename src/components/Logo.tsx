export function Logomark(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      {...props}
      width='100%'
      height='100%'
      viewBox='0 0 1000 1000'
      version='1.1'
      style={{
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeMiterlimit: 2,
      }}
    >
      <rect
        x={100}
        y={130}
        width={220}
        height={220}
        style={{ fill: 'none', stroke: '#d97706', strokeWidth: '33.33px' }}
      />
      <rect
        x={100}
        y={410}
        width={220}
        height={220}
        style={{
          fill: 'none',
          stroke: '#d97706',
          strokeWidth: '33.33px',
          strokeLinejoin: 'miter',
        }}
      />
      <rect
        x={100}
        y={690}
        width={220}
        height={220}
        style={{
          fill: 'none',
          stroke: '#d97706',
          strokeWidth: '33.33px',
          strokeLinejoin: 'miter',
        }}
      />
      <rect
        x={680}
        y={130}
        width={220}
        height={220}
        style={{ fill: 'none', stroke: '#d97706', strokeWidth: '33.33px' }}
      />
      <rect
        x={680}
        y={410}
        width={220}
        height={220}
        style={{
          fill: 'none',
          stroke: '#d97706',
          strokeWidth: '33.33px',
          strokeLinejoin: 'miter',
        }}
      />
      <rect
        x={680}
        y={690}
        width={220}
        height={220}
        style={{
          fill: 'none',
          stroke: '#d97706',
          strokeWidth: '33.33px',
          strokeLinejoin: 'miter',
        }}
      />
      <rect
        x={390}
        y={290}
        width={220}
        height={220}
        style={{ fill: 'none', stroke: '#d97706', strokeWidth: '33.33px' }}
      />
    </svg>
  );
}

export function Logo(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox='0 0 40 40' aria-hidden='true' {...props}>
      <Logomark width='40' height='40' className='fill-amber-500' />
    </svg>
  );
}
