'use client';

import clsx from 'clsx';
import {
  ASPECT_RATIOS,
  aspectRatioTitle,
  BLUR_RANGE,
  CORNER_RANGE,
  hasOrientation,
  PADDING_RANGE,
  SHADOW_RANGE,
  type BorderSettings,
  type CaptionAlignment,
  type CaptionField,
} from '@/editor/settings';

// The editor's controls, laid out like the iPhone app's: a row of icon switches, a slider row for each
// option that's on, the border width with its color, and the aspect ratios.

type Change = (patch: Partial<BorderSettings>) => void;

const FIELD_TITLES: Record<CaptionField, string> = {
  date: 'Date',
  handle: 'Handle',
  camera: 'Camera',
  focalLength: 'Focal Length',
  aperture: 'Aperture',
  shutter: 'Shutter',
  iso: 'ISO',
};

const ALIGNMENT_TITLES: Record<CaptionAlignment, string> = {
  spread: 'Spread',
  leading: 'Left',
  center: 'Center',
  trailing: 'Right',
};

const NEXT_ALIGNMENT: Record<CaptionAlignment, CaptionAlignment> = {
  spread: 'leading',
  leading: 'center',
  center: 'trailing',
  trailing: 'spread',
};

// Line icons in the spirit of the app's SF Symbols, drawn on a 24-point grid.
const ICONS = {
  corners: <rect x='4' y='4' width='16' height='16' rx='5' />,
  shadow: (
    <>
      <rect x='3.5' y='3.5' width='13' height='13' rx='1.5' />
      <path d='M19.5 7.5v12h-12' />
    </>
  ),
  caption: (
    <>
      <rect x='4' y='3.5' width='16' height='11' rx='1.5' />
      <path d='M5 18h14M8 21h8' />
    </>
  ),
  blur: <path d='M12 3.5c3.5 4.2 6 7.6 6 10.5a6 6 0 0 1-12 0c0-2.9 2.5-6.3 6-10.5Z' />,
  blurOn: (
    <>
      <path d='M12 3.5c3.5 4.2 6 7.6 6 10.5a6 6 0 0 1-12 0c0-2.9 2.5-6.3 6-10.5Z' />
      <path d='M12 20a6 6 0 0 0 6-6H6a6 6 0 0 0 6 6Z' fill='currentColor' stroke='none' />
    </>
  ),
  border: (
    <>
      <rect x='3.5' y='4.5' width='17' height='15' rx='1.5' />
      <rect x='7' y='8' width='10' height='8' rx='0.5' fill='currentColor' stroke='none' />
    </>
  ),
  portrait: (
    <>
      <rect x='7' y='3.5' width='10' height='15' rx='1.5' />
      <path d='M4 15.5a8 8 0 0 0 5 5.5M20 8.5a8 8 0 0 0-5-5.5' />
    </>
  ),
  landscape: (
    <>
      <rect x='3.5' y='7' width='15' height='10' rx='1.5' />
      <path d='M15.5 20a8 8 0 0 0 5.5-5M8.5 4a8 8 0 0 0-5.5 5' />
    </>
  ),
  original: (
    <>
      <rect x='3.5' y='5' width='17' height='14' rx='1.5' />
      <path d='m6.5 16 4-4.5 3 3 2-2 2.5 3.5' />
    </>
  ),
  spread: <path d='M4 7h16M4 12h16M4 17h16' />,
  leading: <path d='M4 7h16M4 12h10M4 17h13' />,
  center: <path d='M4 7h16M7 12h10M5.5 17h13' />,
  trailing: <path d='M4 7h16M10 12h10M7 17h13' />,
};

function Icon({ name, className }: { name: keyof typeof ICONS; className?: string }) {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' fill='none' stroke='currentColor' strokeWidth='1.6'
      strokeLinecap='round' strokeLinejoin='round' className={clsx('size-6', className)}>
      {ICONS[name]}
    </svg>
  );
}

/** One of the icon switches in the top row: amber while on. */
function IconToggle({ label, icon, on, onClick }: { label: string; icon: keyof typeof ICONS; on: boolean; onClick: () => void }) {
  return (
    <button type='button' onClick={onClick} aria-label={label} aria-pressed={on} title={label}
      className={clsx('flex h-10 flex-1 items-center justify-center rounded-lg transition-colors hover:bg-stone-700/60',
        on ? 'text-amber-500' : 'text-stone-100')}>
      <Icon name={icon} />
    </button>
  );
}

/** A slider whose value is shown on the app's scale: `value * scale`, rounded, then `suffix`. */
function Slider({ label, value, range, step, scale, suffix = '', onChange, className }: {
  label: string;
  value: number;
  range: readonly [number, number];
  step: number;
  scale: number;
  suffix?: string;
  onChange: (value: number) => void;
  className?: string;
}) {
  const shown = `${Math.round(value * scale)}${suffix}`;
  return (
    <div className={clsx('flex min-w-0 flex-1 items-center gap-3', className)}>
      <input type='range' min={range[0]} max={range[1]} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))} aria-label={label} aria-valuetext={shown}
        className='min-w-0 flex-1 accent-amber-500' />
      <span className='w-12 shrink-0 text-right text-sm tabular-nums text-stone-300' aria-hidden='true'>{shown}</span>
    </div>
  );
}

/** A slider row: the option's icon in the leading column, like the app's grid. */
function Row({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className='flex min-h-12 items-center gap-3'>
      <div className='flex w-8 shrink-0 justify-center text-stone-400'>{icon}</div>
      {children}
    </div>
  );
}

function Pill({ on, onClick, label, children, className }: {
  on: boolean;
  onClick: () => void;
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button type='button' onClick={onClick} aria-pressed={on} aria-label={label}
      className={clsx('flex h-10 items-center justify-center rounded-xl px-2 text-sm transition-colors',
        on ? 'bg-stone-900 text-amber-500' : 'bg-stone-600 text-stone-100 hover:bg-stone-500', className)}>
      {children}
    </button>
  );
}

/** Caption details as pills in two rows, with each row's arrangement, like the app's caption row. */
function CaptionRows({ settings: s, onChange }: { settings: BorderSettings; onChange: Change }) {
  const toggle = (field: CaptionField) =>
    onChange({ captionFields: s.captionFields.includes(field) ? s.captionFields.filter((f) => f !== field) : [...s.captionFields, field] });
  const row = (title: string, fields: CaptionField[], alignment: CaptionAlignment, key: 'captionAlignmentAbove' | 'captionAlignmentBelow') => (
    <div role='group' aria-label={`${title} row`} className='flex items-center gap-1.5'>
      <button type='button' onClick={() => onChange({ [key]: NEXT_ALIGNMENT[alignment] })}
        aria-label={`${title} row arrangement: ${ALIGNMENT_TITLES[alignment]}`} title={ALIGNMENT_TITLES[alignment]}
        className='flex size-8 shrink-0 items-center justify-center rounded-lg text-stone-300 hover:bg-stone-700/60'>
        <Icon name={alignment} className='size-5' />
      </button>
      <div className='flex flex-wrap gap-1.5'>
        {fields.map((field) => (
          <Pill key={field} on={s.captionFields.includes(field)} onClick={() => toggle(field)} className='h-8 px-2.5 text-xs'>
            {FIELD_TITLES[field]}
          </Pill>
        ))}
      </div>
    </div>
  );
  return (
    <div className='space-y-2 py-2'>
      {row('Top', s.captionAbove, s.captionAlignmentAbove, 'captionAlignmentAbove')}
      {row('Bottom', s.captionBelow, s.captionAlignmentBelow, 'captionAlignmentBelow')}
      <div className='flex flex-wrap items-center gap-2 pl-[2.375rem]'>
        <input type='text' value={s.handle} placeholder='@yourname' aria-label='Your handle'
          onChange={(e) => onChange({ handle: e.target.value })}
          className='h-8 w-40 rounded-lg border-0 bg-stone-700 px-2.5 text-xs text-stone-100 placeholder:text-stone-500 focus:ring-2 focus:ring-amber-500' />
        {s.captionFields.includes('camera') && (
          <>
            <Pill on={s.cameraShowsMake} onClick={() => onChange({ cameraShowsMake: !s.cameraShowsMake })} label='Show camera make'
              className='h-8 px-2.5 text-xs'>Make</Pill>
            <Pill on={s.cameraShowsModel} onClick={() => onChange({ cameraShowsModel: !s.cameraShowsModel })} label='Show camera model'
              className='h-8 px-2.5 text-xs'>Model</Pill>
          </>
        )}
      </div>
      <p className='pl-[2.375rem] text-xs text-stone-500'>Details need room: widen the border if they don&apos;t show.</p>
    </div>
  );
}

export function Controls({ settings: s, onChange, canBlur }: { settings: BorderSettings; onChange: Change; canBlur: boolean }) {
  const blur = s.fill === 'blur' && canBlur;
  const cornerMax = CORNER_RANGE[1];
  const paddingMax = PADDING_RANGE[1];
  const shadowMax = SHADOW_RANGE[1];
  return (
    <div className='w-full'>
      {s.showsCaption && <CaptionRows settings={s} onChange={onChange} />}

      <div className='flex'>
        <IconToggle label='Rounded corners' icon='corners' on={s.roundsCorners} onClick={() => onChange({ roundsCorners: !s.roundsCorners })} />
        <IconToggle label='Shadow' icon='shadow' on={s.hasShadow} onClick={() => onChange({ hasShadow: !s.hasShadow })} />
        <IconToggle label='Camera settings caption' icon='caption' on={s.showsCaption} onClick={() => onChange({ showsCaption: !s.showsCaption })} />
        {canBlur && (
          <IconToggle label='Blurred photo border' icon={blur ? 'blurOn' : 'blur'} on={blur}
            onClick={() => onChange({ fill: blur ? 'color' : 'blur' })} />
        )}
      </div>

      {s.roundsCorners && (
        <Row icon={<Icon name='corners' />}>
          {/* 1–64 px, on the border width's scale, as the app shows it. */}
          <Slider label='Corner radius' value={s.cornerFraction} range={CORNER_RANGE} step={cornerMax / 64}
            scale={64 / cornerMax} suffix=' px' onChange={(cornerFraction) => onChange({ cornerFraction })} />
        </Row>
      )}
      {s.hasShadow && (
        <Row icon={<Icon name='shadow' />}>
          <Slider label='Shadow' value={s.shadowFraction} range={SHADOW_RANGE} step={shadowMax / 20}
            scale={100 / shadowMax} suffix='%' onChange={(shadowFraction) => onChange({ shadowFraction })} />
        </Row>
      )}

      <Row icon={<Icon name='border' />}>
        {/* 0–64, the app's border width scale. */}
        <Slider label='Border width' value={s.paddingFraction} range={PADDING_RANGE} step={paddingMax / 64}
          scale={64 / paddingMax} onChange={(paddingFraction) => onChange({ paddingFraction })} />
        {blur ? (
          <Slider label='Blur strength' value={s.blurFraction} range={BLUR_RANGE} step={0.005} scale={1000} suffix='%'
            onChange={(blurFraction) => onChange({ blurFraction })} className='max-w-44' />
        ) : (
          <input type='color' value={s.borderColor} aria-label='Border color' onChange={(e) => onChange({ borderColor: e.target.value })}
            className='size-8 shrink-0 cursor-pointer appearance-none rounded-full border-2 border-stone-500 bg-transparent p-0 [&::-moz-color-swatch]:rounded-full [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0' />
        )}
      </Row>

      <Row icon={
        <button type='button' onClick={() => onChange({ isLandscape: !s.isLandscape })} disabled={!hasOrientation(s.aspectRatio)}
          aria-label='Orientation' aria-pressed={s.isLandscape} title={s.isLandscape ? 'Landscape' : 'Portrait'}
          className='flex h-10 w-8 items-center justify-center text-stone-100 disabled:opacity-40'>
          <Icon name={s.isLandscape ? 'landscape' : 'portrait'} />
        </button>
      }>
        <div className='flex min-w-0 flex-1 gap-1' role='group' aria-label='Aspect ratio'>
          {ASPECT_RATIOS.map((ratio) => (
            <Pill key={ratio} on={s.aspectRatio === ratio} onClick={() => onChange({ aspectRatio: ratio })}
              label={ratio === 'original' ? 'Original aspect ratio' : undefined} className='min-w-0 flex-1 px-1'>
              {ratio === 'original' ? <Icon name='original' className='size-5' /> : aspectRatioTitle(ratio, s.isLandscape && hasOrientation(ratio))}
            </Pill>
          ))}
        </div>
      </Row>

      <Row>
        <div className='flex gap-1 text-sm' role='group' aria-label='Export size'>
          {([[0, 'Full size'], [1080, '1080 px']] as const).map(([width, title]) => (
            <Pill key={width} on={s.exportWidth === width} onClick={() => onChange({ exportWidth: width })} className='h-8 px-3 text-xs'>
              {title}
            </Pill>
          ))}
        </div>
      </Row>
    </div>
  );
}
