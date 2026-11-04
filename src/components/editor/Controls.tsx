'use client';

import {
  closestCenter,
  DndContext,
  pointerWithin,
  type CollisionDetection,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Captions,
  Droplet,
  Image as ImageIcon,
  Layers2,
  RectangleHorizontal,
  RectangleVertical,
  SquareRoundCorner,
  SquareSquare,
  type LucideIcon,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import {
  ASPECT_RATIOS,
  aspectRatioTitle,
  BLUR_RANGE,
  CORNER_RANGE,
  hasOrientation,
  moveCaptionField,
  PADDING_RANGE,
  SHADOW_RANGE,
  type BorderSettings,
  type CaptionAlignment,
  type CaptionField,
  type CaptionRow,
} from '@/editor/settings';

// The editor's controls, laid out like the iPhone app's: the caption's detail pills, a row of icon
// switches, a slider row for each option that's on, the border width with its color, and the aspect ratios.

type Change = (patch: Partial<BorderSettings>) => void;

const FIELD_TITLES: Record<CaptionField, string> = {
  date: 'Date',
  handle: 'Handle',
  camera: 'Camera',
  focalLength: 'Focal',
  aperture: 'ƒ-stop',
  shutter: 'Shutter',
  iso: 'ISO',
};

const ALIGNMENTS: Record<CaptionAlignment, { title: string; icon: LucideIcon; next: CaptionAlignment }> = {
  spread: { title: 'Spread', icon: AlignJustify, next: 'leading' },
  leading: { title: 'Left', icon: AlignLeft, next: 'center' },
  center: { title: 'Center', icon: AlignCenter, next: 'trailing' },
  trailing: { title: 'Right', icon: AlignRight, next: 'spread' },
};

const ICON = 'size-5';

/**
 * What's under the pointer, preferring a pill over the row it's in, so dropping in a row's empty end lands in
 * that row; away from both rows, the nearest pill.
 */
const collisions: CollisionDetection = (args) => {
  const under = pointerWithin(args);
  const pills = under.filter((c) => c.id !== 'above' && c.id !== 'below');
  return pills.length ? pills : under.length ? under : closestCenter(args);
};

/** One of the icon switches in the top row: amber while on. */
function IconToggle({ label, icon: Icon, on, onClick }: { label: string; icon: LucideIcon; on: boolean; onClick: () => void }) {
  return (
    <button type='button' onClick={onClick} aria-label={label} aria-pressed={on} title={label}
      className={cn('flex h-10 flex-1 items-center justify-center rounded-lg transition-colors hover:bg-white/5',
        on ? 'text-amber-500' : 'text-stone-100')}>
      <Icon className={ICON} fill={on && Icon === Droplet ? 'currentColor' : 'none'} />
    </button>
  );
}

/** A row of the grid: a 32px leading column (an icon or button) and the row's control. */
function Row({ lead, children }: { lead?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className='flex h-12 items-center gap-4'>
      <div className='flex w-8 shrink-0 justify-center text-stone-400'>{lead}</div>
      <div className='flex min-w-0 flex-1 items-center gap-3'>{children}</div>
    </div>
  );
}

/** A slider whose value reads on the app's scale: `value * scale`, rounded, then `suffix`. */
function ScaledSlider({ label, value, range, step, scale, suffix = '', onChange, className }: {
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
    <div className={cn('flex min-w-0 flex-1 items-center gap-3', className)}>
      <Slider label={label} valueText={shown} min={range[0]} max={range[1]} step={step} value={[value]}
        onValueChange={([v]) => onChange(v)} />
      <span className='w-11 shrink-0 text-right text-xs tabular-nums text-stone-300' aria-hidden='true'>{shown}</span>
    </div>
  );
}

// MARK: - Caption pills

/** A detail's pill: tap to turn it on or off, drag to move it along its row or into the other. */
function CaptionPill({ field, on, onToggle, onKeyMove }: {
  field: CaptionField;
  on: boolean;
  onToggle: () => void;
  onKeyMove: (key: string) => boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field });
  return (
    <button
      ref={setNodeRef}
      type='button'
      data-caption-field={field}
      onClick={onToggle}
      {...attributes}
      {...listeners}
      onKeyDown={(e) => {
        if (onKeyMove(e.key)) e.preventDefault();
      }}
      aria-pressed={on}
      aria-roledescription='movable detail'
      aria-describedby='caption-pill-help'
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        'h-7 touch-none rounded-full border bg-stone-800 px-2.5 text-xs transition-[color,box-shadow,scale]',
        on ? 'text-amber-500' : 'text-stone-100/50',
        isDragging ? 'z-10 scale-110 cursor-grabbing border-white/40 shadow-lg shadow-black/40' : 'cursor-grab border-white/15',
      )}
    >
      {FIELD_TITLES[field]}
    </button>
  );
}

function PillRow({ row, fields, settings: s, onChange, onKeyMove }: {
  row: CaptionRow;
  fields: CaptionField[];
  settings: BorderSettings;
  onChange: Change;
  onKeyMove: (field: CaptionField, key: string) => boolean;
}) {
  const { setNodeRef } = useDroppable({ id: row });
  const key = row === 'above' ? 'captionAlignmentAbove' : 'captionAlignmentBelow';
  const alignment = ALIGNMENTS[s[key]];
  const title = row === 'above' ? 'Top' : 'Bottom';
  const toggle = (field: CaptionField) =>
    onChange({ captionFields: s.captionFields.includes(field) ? s.captionFields.filter((f) => f !== field) : [...s.captionFields, field] });
  return (
    <Row lead={
      <button type='button' onClick={() => onChange({ [key]: alignment.next })} title={alignment.title}
        aria-label={`${title} row arrangement: ${alignment.title}`}
        className='flex h-10 w-8 items-center justify-center text-stone-100'>
        <alignment.icon className={ICON} />
      </button>
    }>
      <SortableContext items={fields} strategy={rectSortingStrategy}>
        <div ref={setNodeRef} role='group' aria-label={`${title} row`} className='flex min-h-9 flex-1 flex-wrap items-center gap-1.5 rounded-lg'>
          {fields.map((field) => (
            <CaptionPill key={field} field={field} on={s.captionFields.includes(field)} onToggle={() => toggle(field)}
              onKeyMove={(key) => onKeyMove(field, key)} />
          ))}
        </div>
      </SortableContext>
    </Row>
  );
}

function CaptionRows({ settings: s, onChange }: { settings: BorderSettings; onChange: Change }) {
  // A small move before a drag starts, so a tap still toggles the pill.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );
  const rowOf = (id: UniqueIdentifier): CaptionRow | null =>
    id === 'above' || id === 'below' ? id
      : s.captionAbove.includes(id as CaptionField) ? 'above'
      : s.captionBelow.includes(id as CaptionField) ? 'below' : null;
  const fields = (row: CaptionRow) => (row === 'above' ? s.captionAbove : s.captionBelow);
  const move = (field: CaptionField, row: CaptionRow, index: number) => {
    const next = moveCaptionField(s, field, row, index);
    onChange({ captionAbove: next.captionAbove, captionBelow: next.captionBelow });
  };

  // From the keyboard, the arrows move a focused pill: left and right along its row, up and down to the other row.
  const onKeyMove = (field: CaptionField, key: string): boolean => {
    const row = rowOf(field);
    if (!row) return false;
    const index = fields(row).indexOf(field);
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      const to = index + (key === 'ArrowLeft' ? -1 : 1);
      if (to < 0 || to >= fields(row).length) return true;
      move(field, row, to);
    } else if ((key === 'ArrowUp' && row === 'below') || (key === 'ArrowDown' && row === 'above')) {
      move(field, row === 'above' ? 'below' : 'above', Number.MAX_SAFE_INTEGER);
    } else {
      return key === 'ArrowUp' || key === 'ArrowDown';
    }
    // Moving into the other row remounts the pill there; keep it focused.
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-caption-field="${field}"]`)?.focus());
    return true;
  };

  // Crossing into the other row moves the pill there right away, so that row makes room for it.
  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    const from = rowOf(active.id), to = rowOf(over.id);
    if (!from || !to || from === to) return;
    const list = fields(to);
    move(active.id as CaptionField, to, over.id === to ? list.length : list.indexOf(over.id as CaptionField));
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return;
    const to = rowOf(over.id);
    if (!to) return;
    const list = fields(to);
    const index = over.id === to ? list.length - 1 : list.indexOf(over.id as CaptionField);
    if (list.indexOf(active.id as CaptionField) !== index) move(active.id as CaptionField, to, index);
  };

  return (
    <div className='pb-1'>
      <p id='caption-pill-help' className='sr-only'>
        Press Enter to turn this detail on or off. Use the left and right arrows to move it along its row, and up or down to move it to the other row.
      </p>
      <DndContext sensors={sensors} collisionDetection={collisions} onDragOver={onDragOver} onDragEnd={onDragEnd}>
        <PillRow row='above' fields={s.captionAbove} settings={s} onChange={onChange} onKeyMove={onKeyMove} />
        <PillRow row='below' fields={s.captionBelow} settings={s} onChange={onChange} onKeyMove={onKeyMove} />
      </DndContext>
      <Row>
        <input type='text' value={s.handle} placeholder='@yourname' aria-label='Your handle'
          onChange={(e) => onChange({ handle: e.target.value })}
          className='h-8 min-w-0 flex-1 rounded-lg border border-white/15 bg-stone-800 px-2.5 text-xs text-stone-100 placeholder:text-stone-500 focus:border-amber-500 focus:ring-0' />
        {s.captionFields.includes('camera') && (
          <div className='flex gap-1.5' role='group' aria-label='Camera name'>
            {([['cameraShowsMake', 'Make'], ['cameraShowsModel', 'Model']] as const).map(([key, title]) => (
              <button key={key} type='button' aria-pressed={s[key]} onClick={() => onChange({ [key]: !s[key] })}
                className={cn('h-7 rounded-full border border-white/15 bg-stone-800 px-2.5 text-xs', s[key] ? 'text-amber-500' : 'text-stone-100/50')}>
                {title}
              </button>
            ))}
          </div>
        )}
      </Row>
    </div>
  );
}

// MARK: - Controls

function RatioButton({ on, onClick, label, children }: { on: boolean; onClick: () => void; label?: string; children: React.ReactNode }) {
  return (
    <button type='button' onClick={onClick} aria-pressed={on} aria-label={label}
      className={cn('flex h-10 min-w-0 flex-1 items-center justify-center rounded-xl px-1 text-sm transition-colors',
        on ? 'bg-stone-950/70 text-amber-500 ring-1 ring-white/15' : 'bg-stone-600 text-stone-100 hover:bg-stone-500')}>
      {children}
    </button>
  );
}

export function Controls({ settings: s, onChange, canBlur }: { settings: BorderSettings; onChange: Change; canBlur: boolean }) {
  const blur = s.fill === 'blur' && canBlur;
  const cornerMax = CORNER_RANGE[1], paddingMax = PADDING_RANGE[1], shadowMax = SHADOW_RANGE[1];
  const Orientation = s.isLandscape ? RectangleHorizontal : RectangleVertical;
  return (
    <div className='w-full'>
      {s.showsCaption && <CaptionRows settings={s} onChange={onChange} />}

      <div className='flex'>
        <IconToggle label='Rounded corners' icon={SquareRoundCorner} on={s.roundsCorners} onClick={() => onChange({ roundsCorners: !s.roundsCorners })} />
        <IconToggle label='Shadow' icon={Layers2} on={s.hasShadow} onClick={() => onChange({ hasShadow: !s.hasShadow })} />
        <IconToggle label='Camera settings caption' icon={Captions} on={s.showsCaption} onClick={() => onChange({ showsCaption: !s.showsCaption })} />
        {canBlur && (
          <IconToggle label='Blurred photo border' icon={Droplet} on={blur} onClick={() => onChange({ fill: blur ? 'color' : 'blur' })} />
        )}
      </div>

      {s.roundsCorners && (
        <Row lead={<SquareRoundCorner className={ICON} />}>
          {/* 1–64 px on the border width's scale, as the app shows it. */}
          <ScaledSlider label='Corner radius' value={s.cornerFraction} range={CORNER_RANGE} step={cornerMax / 64}
            scale={64 / cornerMax} suffix=' px' onChange={(cornerFraction) => onChange({ cornerFraction })} />
        </Row>
      )}
      {s.hasShadow && (
        <Row lead={<Layers2 className={ICON} />}>
          <ScaledSlider label='Shadow' value={s.shadowFraction} range={SHADOW_RANGE} step={shadowMax / 20}
            scale={100 / shadowMax} suffix='%' onChange={(shadowFraction) => onChange({ shadowFraction })} />
        </Row>
      )}

      <Row lead={<SquareSquare className={ICON} />}>
        {/* 0–64, the app's border width scale. */}
        <ScaledSlider label='Border width' value={s.paddingFraction} range={PADDING_RANGE} step={paddingMax / 64}
          scale={64 / paddingMax} onChange={(paddingFraction) => onChange({ paddingFraction })} />
        {blur ? (
          <ScaledSlider label='Blur strength' value={s.blurFraction} range={BLUR_RANGE} step={0.005} scale={1000} suffix='%'
            onChange={(blurFraction) => onChange({ blurFraction })} className='max-w-36' />
        ) : (
          <input type='color' value={s.borderColor} aria-label='Border color' onChange={(e) => onChange({ borderColor: e.target.value })}
            className='size-8 shrink-0 cursor-pointer appearance-none rounded-full border-2 border-white/30 bg-transparent p-0 [&::-moz-color-swatch]:rounded-full [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0' />
        )}
      </Row>

      <Row lead={
        <button type='button' onClick={() => onChange({ isLandscape: !s.isLandscape })} disabled={!hasOrientation(s.aspectRatio)}
          aria-label='Orientation' aria-pressed={s.isLandscape} title={s.isLandscape ? 'Landscape' : 'Portrait'}
          className='flex h-10 w-8 items-center justify-center text-stone-100 disabled:opacity-40'>
          <Orientation className={ICON} />
        </button>
      }>
        <div className='flex min-w-0 flex-1 gap-1' role='group' aria-label='Aspect ratio'>
          {ASPECT_RATIOS.map((ratio) => (
            <RatioButton key={ratio} on={s.aspectRatio === ratio} onClick={() => onChange({ aspectRatio: ratio })}
              label={ratio === 'original' ? 'Original aspect ratio' : undefined}>
              {ratio === 'original' ? <ImageIcon className={ICON} /> : aspectRatioTitle(ratio, s.isLandscape && hasOrientation(ratio))}
            </RatioButton>
          ))}
        </div>
      </Row>
    </div>
  );
}
