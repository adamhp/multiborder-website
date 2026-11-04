'use client';

import clsx from 'clsx';
import { useId } from 'react';
import {
  ASPECT_RATIOS,
  aspectRatioTitle,
  BLUR_RANGE,
  CAPTION_ALIGNMENTS,
  CORNER_RANGE,
  hasOrientation,
  PADDING_RANGE,
  SHADOW_RANGE,
  type BorderSettings,
  type CaptionAlignment,
  type CaptionField,
} from '@/editor/settings';

const FIELD_TITLES: Record<CaptionField, string> = {
  date: 'Date',
  handle: 'Handle',
  camera: 'Camera',
  focalLength: 'Focal Length',
  aperture: 'Aperture',
  shutter: 'Shutter Speed',
  iso: 'ISO',
};

const ALIGNMENT_TITLES: Record<CaptionAlignment, string> = {
  spread: 'Spread',
  leading: 'Left',
  center: 'Center',
  trailing: 'Right',
};

type Change = (patch: Partial<BorderSettings>) => void;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className='border-t border-stone-700 pt-4'>
      <legend className='float-left mb-3 w-full text-sm font-semibold text-stone-100'>{title}</legend>
      <div className='clear-both space-y-3'>{children}</div>
    </fieldset>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className='flex items-center gap-2 text-sm text-stone-300'>
      <input
        type='checkbox'
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className='rounded border-stone-500 bg-stone-700 text-amber-500 focus:ring-amber-500'
      />
      {label}
    </label>
  );
}

/** A slider over `range`, shown to people as `display(value)`. */
function Slider({
  label,
  value,
  range,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  range: readonly [number, number];
  step: number;
  display: (value: number) => string;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div>
      <div className='flex justify-between text-sm text-stone-300'>
        <label htmlFor={id}>{label}</label>
        <span className='tabular-nums text-stone-400'>{display(value)}</span>
      </div>
      <input
        id={id}
        type='range'
        min={range[0]}
        max={range[1]}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className='w-full accent-amber-500'
      />
    </div>
  );
}

function Select<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: [T, string][];
  onChange: (value: T) => void;
}) {
  const id = useId();
  return (
    <div className='flex items-center justify-between gap-3 text-sm text-stone-300'>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={String(value)}
        onChange={(e) => onChange(options.find(([v]) => String(v) === e.target.value)![0])}
        className='rounded-lg border-stone-600 bg-stone-700 py-1 text-sm text-stone-100 focus:border-amber-500 focus:ring-amber-500'
      >
        {options.map(([v, title]) => (
          <option key={String(v)} value={String(v)}>
            {title}
          </option>
        ))}
      </select>
    </div>
  );
}

const percent = (value: number) => `${Math.round(value * 100)}%`;
const alignmentOptions = CAPTION_ALIGNMENTS.map((a) => [a, ALIGNMENT_TITLES[a]] as [CaptionAlignment, string]);

export function Controls({ settings: s, onChange, canBlur }: { settings: BorderSettings; onChange: Change; canBlur: boolean }) {
  const toggleField = (field: CaptionField, on: boolean) =>
    onChange({ captionFields: on ? [...s.captionFields, field] : s.captionFields.filter((f) => f !== field) });
  const fieldToggles = (fields: CaptionField[]) =>
    fields.map((field) => (
      <Toggle key={field} label={FIELD_TITLES[field]} checked={s.captionFields.includes(field)} onChange={(on) => toggleField(field, on)} />
    ));

  return (
    <div className='space-y-4'>
      <Section title='Aspect ratio'>
        <div className='flex flex-wrap gap-2' role='group' aria-label='Aspect ratio'>
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio}
              type='button'
              aria-pressed={s.aspectRatio === ratio}
              onClick={() => onChange({ aspectRatio: ratio })}
              className={clsx(
                'rounded-lg px-3 py-1.5 text-sm transition-colors',
                s.aspectRatio === ratio ? 'bg-amber-500 text-stone-900' : 'bg-stone-700 text-stone-200 hover:bg-stone-600',
              )}
            >
              {aspectRatioTitle(ratio, s.isLandscape && hasOrientation(ratio))}
            </button>
          ))}
        </div>
        {hasOrientation(s.aspectRatio) && (
          <Toggle label='Landscape' checked={s.isLandscape} onChange={(isLandscape) => onChange({ isLandscape })} />
        )}
      </Section>

      <Section title='Border'>
        <Slider label='Width' value={s.paddingFraction} range={PADDING_RANGE} step={0.005} display={percent}
          onChange={(paddingFraction) => onChange({ paddingFraction })} />
        {canBlur && (
          <Select label='Fill' value={s.fill} options={[['color', 'Color'], ['blur', 'Blurred photo']]}
            onChange={(fill) => onChange({ fill })} />
        )}
        {s.fill === 'blur' && canBlur ? (
          <Slider label='Blur' value={s.blurFraction} range={BLUR_RANGE} step={0.005} display={(v) => String(Math.round(v * 1000))}
            onChange={(blurFraction) => onChange({ blurFraction })} />
        ) : (
          <label className='flex items-center justify-between text-sm text-stone-300'>
            Color
            <input type='color' value={s.borderColor} onChange={(e) => onChange({ borderColor: e.target.value })}
              className='h-8 w-14 cursor-pointer rounded border border-stone-600 bg-stone-700' />
          </label>
        )}
      </Section>

      <Section title='Photo'>
        <Toggle label='Rounded corners' checked={s.roundsCorners} onChange={(roundsCorners) => onChange({ roundsCorners })} />
        {s.roundsCorners && (
          <Slider label='Corner radius' value={s.cornerFraction} range={CORNER_RANGE} step={0.00125}
            display={(v) => String(Math.round(v * 800))} onChange={(cornerFraction) => onChange({ cornerFraction })} />
        )}
        <Toggle label='Shadow' checked={s.hasShadow} onChange={(hasShadow) => onChange({ hasShadow })} />
        {s.hasShadow && (
          <Slider label='Shadow size' value={s.shadowFraction} range={SHADOW_RANGE} step={0.002}
            display={(v) => percent(v / SHADOW_RANGE[1])} onChange={(shadowFraction) => onChange({ shadowFraction })} />
        )}
      </Section>

      <Section title='Caption'>
        <Toggle label='Show photo details' checked={s.showsCaption} onChange={(showsCaption) => onChange({ showsCaption })} />
        {s.showsCaption && (
          <>
            <p className='text-xs text-stone-400'>Details need room: widen the border if they don&apos;t appear.</p>
            <div className='space-y-2'>
              <p className='text-xs uppercase tracking-wide text-stone-400'>Above the photo</p>
              {fieldToggles(s.captionAbove)}
              <Select label='Alignment' value={s.captionAlignmentAbove} options={alignmentOptions}
                onChange={(captionAlignmentAbove) => onChange({ captionAlignmentAbove })} />
            </div>
            <div className='space-y-2'>
              <p className='text-xs uppercase tracking-wide text-stone-400'>Below the photo</p>
              {fieldToggles(s.captionBelow)}
              <Select label='Alignment' value={s.captionAlignmentBelow} options={alignmentOptions}
                onChange={(captionAlignmentBelow) => onChange({ captionAlignmentBelow })} />
            </div>
            <label className='block text-sm text-stone-300'>
              Your handle
              <input type='text' value={s.handle} placeholder='@yourname' onChange={(e) => onChange({ handle: e.target.value })}
                className='mt-1 block w-full rounded-lg border-stone-600 bg-stone-700 text-sm text-stone-100 placeholder:text-stone-500 focus:border-amber-500 focus:ring-amber-500' />
            </label>
            {s.captionFields.includes('camera') && (
              <div className='flex gap-4'>
                <Toggle label='Camera make' checked={s.cameraShowsMake} onChange={(cameraShowsMake) => onChange({ cameraShowsMake })} />
                <Toggle label='Model' checked={s.cameraShowsModel} onChange={(cameraShowsModel) => onChange({ cameraShowsModel })} />
              </div>
            )}
          </>
        )}
      </Section>

      <Section title='Export'>
        <Select label='Size' value={s.exportWidth} options={[[0, 'Full size'], [1080, '1080 px wide']]}
          onChange={(exportWidth) => onChange({ exportWidth })} />
      </Section>
    </div>
  );
}
