'use client';

import {
  closestCenter,
  DndContext,
  pointerWithin,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Captions,
  Check,
  Droplet,
  File as FileIcon,
  Image as ImageIcon,
  Layers2,
  PanelBottom,
  PanelLeft,
  PanelRight,
  PanelTop,
  Quote,
  RectangleHorizontal,
  RectangleVertical,
  Settings,
  SquareDashed,
  SquareRoundCorner,
  SquareSquare,
  Type,
  type LucideIcon,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { SwitchRow } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { FIELD_ICONS, HANDLE_ICONS, type CaptionIcon } from '@/editor/caption';
import { CAPTION_FONT_INFO } from '@/editor/fonts';
import { CAPTION_ICON_PATHS } from '@/editor/icons';
import {
  ASPECT_RATIOS,
  aspectRatioTitle,
  BLUR_RANGE,
  CAPTION_FONTS,
  CORNER_RANGE,
  EXPORT_FORMATS,
  EXPORT_WIDTHS,
  HANDLE_STYLES,
  hasOrientation,
  insets,
  moveCaptionField,
  PADDING_RANGE,
  SHADOW_RANGE,
  type BorderSettings,
  type CaptionAlignment,
  type CaptionField,
  type CaptionRow,
  type HandleStyle,
  type Insets,
} from '@/editor/settings';

// The editor's controls, laid out like the iPhone app's: the caption's detail pills, a row of icon
// switches, a slider row for each option that's on, the border width with its color, and the aspect ratios.

type Change = (patch: Partial<BorderSettings>) => void;

const FIELD_TITLES: Record<CaptionField, string> = {
  date: 'Date',
  title: 'Title',
  filename: 'Filename',
  handle: 'Handle',
  camera: 'Camera',
  focalLength: 'Focal Length',
  aperture: 'Aperture',
  shutter: 'Shutter Speed',
  iso: 'ISO',
};

const HANDLE_TITLES: Record<HandleStyle, string> = {
  instagram: 'Instagram',
  flickr: 'Flickr',
  at: '@',
  website: 'Website',
  plain: 'Text Only',
};

const ALIGNMENTS: Record<CaptionAlignment, { title: string; icon: LucideIcon; next: CaptionAlignment; justify: string }> = {
  spread: { title: 'Spread', icon: AlignJustify, next: 'leading', justify: 'justify-between' },
  leading: { title: 'Left', icon: AlignLeft, next: 'center', justify: 'justify-start' },
  center: { title: 'Center', icon: AlignCenter, next: 'trailing', justify: 'justify-center' },
  trailing: { title: 'Right', icon: AlignRight, next: 'spread', justify: 'justify-end' },
};

const ICON = 'size-5';
const spring = { type: 'spring', stiffness: 500, damping: 38, mass: 0.8 } as const;

/** A row that slides open and closed as its option turns on and off, as the app's rows do. */
function Reveal({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
          animate={{ height: 'auto', opacity: 1, transitionEnd: { overflow: 'visible' } }}
          exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
          transition={spring}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** A caption icon, drawn from the same paths the export prints. */
export function CaptionIconSvg({ icon, className }: { icon: CaptionIcon; className?: string }) {
  const { paths, fill } = CAPTION_ICON_PATHS[icon];
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' className={cn('size-[18px]', className)}
      fill={fill ? 'currentColor' : 'none'} fillRule='evenodd' stroke={fill ? 'none' : 'currentColor'}
      strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
      {paths.map((d) => <path key={d} d={d} />)}
    </svg>
  );
}

/** What stands for a handle style in the controls: its icon, "@", or a text symbol for the text-only style. */
function HandleFace({ style }: { style: HandleStyle }) {
  const icon = HANDLE_ICONS[style];
  if (icon) return <CaptionIconSvg icon={icon} className='size-[17px]' />;
  if (style === 'plain') return <Type className='size-[17px]' />;
  return <span className='text-base leading-none'>@</span>;
}

/** A caption pill's face: the detail's icon, or a short label where there's no fitting icon. */
function PillFace({ field, handleStyle }: { field: CaptionField; handleStyle: HandleStyle }) {
  if (field === 'handle') return <HandleFace style={handleStyle} />;
  if (field === 'iso') return <span className='text-[13px] leading-none'>ISO</span>;
  if (field === 'title') return <Quote className='size-[17px]' />;
  if (field === 'filename') return <FileIcon className='size-[17px]' />;
  return <CaptionIconSvg icon={FIELD_ICONS[field]!} />;
}

/** One of the icon switches in the top row: amber while on. */
function IconToggle({ label, icon: Icon, on, onClick }: { label: string; icon: LucideIcon; on: boolean; onClick: () => void }) {
  return (
    <button type='button' onClick={onClick} aria-label={label} aria-pressed={on} title={label}
      className={cn('flex h-10 flex-1 items-center justify-center rounded-lg transition-[color,background-color,transform] duration-150 hover:bg-white/5 active:scale-90',
        on ? 'text-amber-500' : 'text-stone-100')}>
      <Icon className={ICON} fill={on && Icon === Droplet ? 'currentColor' : 'none'} />
    </button>
  );
}

/** A row of the grid: a 32px leading column (an icon or button) and the row's control. */
function Row({ lead, children, className }: { lead?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex h-12 items-center gap-4', className)}>
      <div className='flex w-8 shrink-0 justify-center text-stone-400'>{lead}</div>
      <div className='flex min-w-0 flex-1 items-center gap-3'>{children}</div>
    </div>
  );
}

/** A slider whose thumb shows its value on the app's scale: `value * scale`, rounded, then `suffix`. */
function ScaledSlider({ label, value, range, step, scale, suffix = '', onChange, disabled, className }: {
  label: string;
  value: number;
  range: readonly [number, number];
  step: number;
  scale: number;
  suffix?: string;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Slider label={label} valueText={`${Math.round(value * scale)}${suffix}`} min={range[0]} max={range[1]} step={step}
      value={[value]} onValueChange={([v]) => onChange(v)} disabled={disabled}
      className={cn('min-w-0 flex-1', disabled && 'opacity-40', className)} />
  );
}

// MARK: - Caption pills

/** Turns one caption detail on or off, for the options popovers. */
function ShowSwitch({ field, settings: s, onChange }: { field: CaptionField; settings: BorderSettings; onChange: Change }) {
  return (
    <SwitchRow label='Show' checked={s.captionFields.includes(field)}
      onCheckedChange={(on) => onChange({ captionFields: on ? [...s.captionFields, field] : s.captionFields.filter((f) => f !== field) })} />
  );
}

/** A detail's options: for the camera which parts of its name, whether its icon is printed, and whether it's shown. */
function FieldEditor({ field, settings: s, onChange }: { field: CaptionField; settings: BorderSettings; onChange: Change }) {
  const hasIcon = FIELD_ICONS[field] !== undefined;
  return (
    <div className='w-52 space-y-3.5'>
      <p className='text-xs text-stone-400'>{FIELD_TITLES[field]}</p>
      {field === 'camera' && (
        <>
          <SwitchRow label='Make' checked={s.cameraShowsMake} onCheckedChange={(cameraShowsMake) => onChange({ cameraShowsMake })} />
          <SwitchRow label='Model' checked={s.cameraShowsModel} onCheckedChange={(cameraShowsModel) => onChange({ cameraShowsModel })} />
        </>
      )}
      {hasIcon && (
        // Overruled while every icon is turned off in the caption's style.
        <SwitchRow label='Icon' checked={!s.captionHiddenIcons.includes(field)} disabled={!s.showsCaptionIcons}
          onCheckedChange={(shows) => onChange({
            captionHiddenIcons: shows ? s.captionHiddenIcons.filter((f) => f !== field) : [...s.captionHiddenIcons, field],
          })} />
      )}
      {(field === 'camera' || hasIcon) && <div className='h-px bg-white/10' />}
      <ShowSwitch field={field} settings={s} onChange={onChange} />
    </div>
  );
}

/** The handle printed by the caption: its text, its icon, and whether it's shown. */
function HandleEditor({ settings: s, onChange }: { settings: BorderSettings; onChange: Change }) {
  return (
    <div className='w-60 space-y-3.5'>
      <input type='text' value={s.handle} placeholder='yourname' aria-label='Handle' autoFocus={!s.handle}
        autoCapitalize='none' autoCorrect='off' spellCheck={false}
        onChange={(e) => {
          const handle = e.target.value;
          // Typing a handle means wanting it shown.
          onChange(handle.trim() && !s.captionFields.includes('handle') ? { handle, captionFields: [...s.captionFields, 'handle'] } : { handle });
        }}
        className='h-10 w-full rounded-xl border-0 bg-white/10 px-3 text-base text-stone-100 placeholder:text-stone-500 focus:ring-2 focus:ring-amber-500' />
      <div className='flex gap-1.5' role='group' aria-label='Handle style'>
        {HANDLE_STYLES.map((style) => (
          <button key={style} type='button' onClick={() => onChange({ handleStyle: style })} aria-label={HANDLE_TITLES[style]}
            aria-pressed={s.handleStyle === style} title={HANDLE_TITLES[style]}
            className={cn('flex h-9 flex-1 items-center justify-center rounded-lg transition-colors active:scale-95',
              s.handleStyle === style ? 'bg-white/15 text-amber-500' : 'text-stone-100 hover:bg-white/5')}>
            <HandleFace style={style} />
          </button>
        ))}
      </div>
      <ShowSwitch field='handle' settings={s} onChange={onChange} />
    </div>
  );
}

/** The caption's look as a whole: its font, and whether icons are printed at all. */
function CaptionStyleEditor({ settings: s, onChange }: { settings: BorderSettings; onChange: Change }) {
  return (
    <div className='w-64 space-y-3.5'>
      <div role='radiogroup' aria-label='Caption font' className='space-y-1'>
        {CAPTION_FONTS.map((font) => {
          const on = s.captionFont === font;
          return (
            <button key={font} type='button' role='radio' aria-checked={on} onClick={() => onChange({ captionFont: font })}
              className='flex w-full items-center justify-between rounded-lg px-1 py-1.5 text-left hover:bg-white/5'>
              {/* Each name in its own font, as a preview. */}
              <span style={{ fontFamily: CAPTION_FONT_INFO[font].family, fontSize: 16 }}>{CAPTION_FONT_INFO[font].title}</span>
              {on && <Check className='size-4 text-amber-500' />}
            </button>
          );
        })}
      </div>
      <div className='h-px bg-white/10' />
      <SwitchRow label='Icons' checked={s.showsCaptionIcons} onCheckedChange={(showsCaptionIcons) => onChange({ showsCaptionIcons })} />
    </div>
  );
}

/** A detail's pill: tap opens its options, drag moves it along its row or into the other. */
function CaptionPill({ field, settings: s, onChange, onKeyMove }: {
  field: CaptionField;
  settings: BorderSettings;
  onChange: Change;
  onKeyMove: (key: string) => boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field });
  const on = s.captionFields.includes(field) && (field !== 'handle' || !!s.handle.trim());
  const row = s.captionAbove.includes(field) ? 'Above photo' : 'Below photo';
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          ref={setNodeRef}
          type='button'
          data-caption-field={field}
          {...attributes}
          {...listeners}
          onKeyDown={(e) => {
            if (onKeyMove(e.key)) e.preventDefault();
          }}
          aria-roledescription='movable detail'
          aria-describedby='caption-pill-help'
          aria-label={`${field === 'handle' && s.handle ? `Handle, ${s.handle}` : FIELD_TITLES[field]}, ${on ? 'shown' : 'hidden'}, ${row}`}
          style={{ transform: CSS.Translate.toString(transform), transition }}
          className={cn(
            'flex h-7 min-w-0 flex-[0_1_3rem] touch-none items-center justify-center rounded-full border bg-stone-800 transition-[color,box-shadow,scale,border-color] duration-150',
            on ? 'text-amber-500' : 'text-white/50',
            isDragging ? 'z-10 scale-115 cursor-grabbing border-white/40 shadow-lg shadow-black/40' : 'cursor-grab border-white/15 hover:border-white/30',
          )}
        >
          <PillFace field={field} handleStyle={s.handleStyle} />
        </button>
      </PopoverTrigger>
      <PopoverContent side='top'>
        {field === 'handle' ? <HandleEditor settings={s} onChange={onChange} /> : <FieldEditor field={field} settings={s} onChange={onChange} />}
      </PopoverContent>
    </Popover>
  );
}

/**
 * What's under the pointer, preferring a pill over the row it's in, so dropping in a row's empty end lands in
 * that row; away from both rows, the nearest pill.
 */
const collisions: CollisionDetection = (args) => {
  const under = pointerWithin(args);
  const pills = under.filter((c) => c.id !== 'above' && c.id !== 'below');
  return pills.length ? pills : under.length ? under : closestCenter(args);
};

/** One row of pills, arranged like the caption row it stands for: spread, or grouped left, center or right. */
function PillRow({ row, settings: s, onChange, onKeyMove }: {
  row: CaptionRow;
  settings: BorderSettings;
  onChange: Change;
  onKeyMove: (field: CaptionField, key: string) => boolean;
}) {
  const { setNodeRef } = useDroppable({ id: row });
  const fields = row === 'above' ? s.captionAbove : s.captionBelow;
  const alignment = ALIGNMENTS[row === 'above' ? s.captionAlignmentAbove : s.captionAlignmentBelow];
  return (
    <SortableContext items={fields} strategy={rectSortingStrategy}>
      <div ref={setNodeRef} role='group' aria-label={row === 'above' ? 'Top row' : 'Bottom row'}
        className={cn('flex h-12 min-w-0 flex-1 items-center gap-1.5', fields.length === 1 ? 'justify-center' : alignment.justify)}>
        {fields.map((field) => (
          <CaptionPill key={field} field={field} settings={s} onChange={onChange} onKeyMove={(key) => onKeyMove(field, key)} />
        ))}
      </div>
    </SortableContext>
  );
}

function AlignmentButton({ row, settings: s, onChange }: { row: CaptionRow; settings: BorderSettings; onChange: Change }) {
  const key = row === 'above' ? 'captionAlignmentAbove' : 'captionAlignmentBelow';
  const alignment = ALIGNMENTS[s[key]];
  return (
    <button type='button' onClick={() => onChange({ [key]: alignment.next })} title={alignment.title}
      aria-label={`${row === 'above' ? 'Top' : 'Bottom'} row arrangement: ${alignment.title}`}
      className='flex h-12 w-8 items-center justify-center text-stone-100 transition-transform active:scale-90'>
      <alignment.icon className={ICON} />
    </button>
  );
}

/**
 * The caption's details as pills in two rows, matching the rows above and below the photo. Tapping a pill opens
 * its options; dragging moves it along its row or into the other one. A button at the start of each row cycles
 * how it's arranged, and the gear opens the caption's font and icons.
 */
function CaptionFieldsRow({ settings: s, onChange }: { settings: BorderSettings; onChange: Change }) {
  // A small move before a drag starts, so a tap still opens the pill's options.
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
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
    <div className='flex items-center gap-4'>
      <p id='caption-pill-help' className='sr-only'>
        Press Enter for this detail&apos;s options. Use the left and right arrows to move it along its row, and up or down to move it to the other row.
      </p>
      <div className='flex w-8 shrink-0 flex-col'>
        <AlignmentButton row='above' settings={s} onChange={onChange} />
        <AlignmentButton row='below' settings={s} onChange={onChange} />
      </div>
      <DndContext sensors={sensors} collisionDetection={collisions} onDragOver={onDragOver} onDragEnd={onDragEnd}>
        <div className='min-w-0 flex-1'>
          <PillRow row='above' settings={s} onChange={onChange} onKeyMove={onKeyMove} />
          <PillRow row='below' settings={s} onChange={onChange} onKeyMove={onKeyMove} />
        </div>
      </DndContext>
      <Popover>
        <PopoverTrigger asChild>
          <button type='button' aria-label='Caption style' title='Caption style'
            className='flex h-10 w-8 shrink-0 items-center justify-center text-stone-100 transition-transform active:scale-90'>
            <Settings className={ICON} />
          </button>
        </PopoverTrigger>
        <PopoverContent side='top' align='end'>
          <CaptionStyleEditor settings={s} onChange={onChange} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

// MARK: - Controls

function RatioButton({ on, onClick, label, children }: { on: boolean; onClick: () => void; label?: string; children: React.ReactNode }) {
  return (
    <button type='button' onClick={onClick} aria-pressed={on} aria-label={label}
      className={cn('flex h-10 min-w-0 flex-1 items-center justify-center rounded-xl px-1 text-sm transition-[color,background-color,transform] duration-150 active:scale-95',
        on ? 'bg-stone-950/70 text-amber-500 ring-1 ring-white/15' : 'bg-stone-600 text-stone-100 hover:bg-stone-500')}>
      {children}
    </button>
  );
}

const EDGES: { key: keyof Insets; title: string; icon: LucideIcon }[] = [
  { key: 'top', title: 'Top border', icon: PanelTop },
  { key: 'left', title: 'Left border', icon: PanelLeft },
  { key: 'right', title: 'Right border', icon: PanelRight },
  { key: 'bottom', title: 'Bottom border', icon: PanelBottom },
];

export function Controls({ settings: s, onChange, canBlur }: { settings: BorderSettings; onChange: Change; canBlur: boolean }) {
  const blur = s.fill === 'blur' && canBlur;
  const cornerMax = CORNER_RANGE[1], paddingMax = PADDING_RANGE[1], shadowMax = SHADOW_RANGE[1];
  const Orientation = s.isLandscape ? RectangleHorizontal : RectangleVertical;
  const sides = insets(s);
  const togglePerSide = () =>
    // The first time, each side starts at the current width so nothing jumps.
    onChange(!s.isPerSide && !s.sides ? { isPerSide: true, sides: insets({ ...s, isPerSide: false }) } : { isPerSide: !s.isPerSide });
  return (
    <div className='w-full'>
      <Reveal show={s.showsCaption}>
        <CaptionFieldsRow settings={s} onChange={onChange} />
      </Reveal>

      <div className='flex'>
        <IconToggle label='Separate border for each side' icon={SquareDashed} on={s.isPerSide} onClick={togglePerSide} />
        <IconToggle label='Rounded corners' icon={SquareRoundCorner} on={s.roundsCorners} onClick={() => onChange({ roundsCorners: !s.roundsCorners })} />
        <IconToggle label='Shadow' icon={Layers2} on={s.hasShadow} onClick={() => onChange({ hasShadow: !s.hasShadow })} />
        <IconToggle label='Camera settings caption' icon={Captions} on={s.showsCaption} onClick={() => onChange({ showsCaption: !s.showsCaption })} />
        {canBlur && (
          <IconToggle label='Blurred photo border' icon={Droplet} on={blur} onClick={() => onChange({ fill: blur ? 'color' : 'blur' })} />
        )}
      </div>

      <Reveal show={s.roundsCorners}>
        <Row lead={<SquareRoundCorner className={ICON} />}>
          {/* 1–64 on the border width's scale, as the app shows it. */}
          <ScaledSlider label='Corner radius' value={s.cornerFraction} range={CORNER_RANGE} step={cornerMax / 64}
            scale={64 / cornerMax} onChange={(cornerFraction) => onChange({ cornerFraction })} />
        </Row>
      </Reveal>
      <Reveal show={s.hasShadow}>
        <Row lead={<Layers2 className={ICON} />}>
          <ScaledSlider label='Shadow' value={s.shadowFraction} range={SHADOW_RANGE} step={shadowMax / 20}
            scale={100 / shadowMax} suffix='%' onChange={(shadowFraction) => onChange({ shadowFraction })} />
        </Row>
      </Reveal>
      <Reveal show={s.isPerSide}>
        {EDGES.map(({ key, title, icon: Icon }) => (
          <Row key={key} lead={<Icon className={ICON} />}>
            <ScaledSlider label={title} value={sides[key]} range={PADDING_RANGE} step={paddingMax / 64} scale={64 / paddingMax}
              onChange={(value) => onChange({ sides: { ...sides, [key]: value } })} />
          </Row>
        ))}
      </Reveal>

      <Row lead={<SquareSquare className={ICON} />}>
        {/* 0–64, the app's border width scale. Each side sets its own width while they're separate. */}
        <ScaledSlider label='Border width' value={s.paddingFraction} range={PADDING_RANGE} step={paddingMax / 64}
          scale={64 / paddingMax} disabled={s.isPerSide} onChange={(paddingFraction) => onChange({ paddingFraction })} />
        {blur ? (
          <ScaledSlider label='Blur strength' value={s.blurFraction} range={BLUR_RANGE} step={0.005} scale={1000} suffix='%'
            onChange={(blurFraction) => onChange({ blurFraction })} className='max-w-28' />
        ) : (
          <input type='color' value={s.borderColor} aria-label='Border color' onChange={(e) => onChange({ borderColor: e.target.value })}
            className='size-8 shrink-0 cursor-pointer appearance-none rounded-full border-2 border-white/30 bg-transparent p-0 transition-transform active:scale-90 [&::-moz-color-swatch]:rounded-full [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0' />
        )}
      </Row>

      <Row lead={
        <button type='button' onClick={() => onChange({ isLandscape: !s.isLandscape })} disabled={!hasOrientation(s.aspectRatio)}
          aria-label='Orientation' aria-pressed={s.isLandscape} title={s.isLandscape ? 'Landscape' : 'Portrait'}
          className='flex h-10 w-8 items-center justify-center text-stone-100 transition-transform active:scale-90 disabled:opacity-40'>
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

const WIDTH_TITLES: Record<(typeof EXPORT_WIDTHS)[number], string> = { 1080: '1080', 2160: '2160', 0: 'Full' };
const FORMAT_TITLES: Record<(typeof EXPORT_FORMATS)[number], string> = { original: 'Orig.', jpeg: 'JPEG', png: 'PNG' };

function Segmented<T extends string | number>({ label, options, value, titles, onChange }: {
  label: string;
  options: readonly T[];
  value: T;
  titles: Record<T, string>;
  onChange: (value: T) => void;
}) {
  return (
    <div className='flex items-center justify-between gap-3 text-xs text-stone-400'>
      <span>{label}</span>
      <div className='flex gap-0.5 rounded-full bg-stone-800 p-0.5' role='group' aria-label={label}>
        {options.map((option) => (
          <button key={option} type='button' aria-pressed={value === option} onClick={() => onChange(option)}
            className={cn('h-7 rounded-full px-3 transition-colors', value === option ? 'bg-stone-600 text-amber-500' : 'text-stone-300 hover:text-stone-100')}>
            {titles[option]}
          </button>
        ))}
      </div>
    </div>
  );
}

/** How downloads are saved: their width, and their format (the browser can't write HEIC, so "Orig." keeps PNG as PNG). */
export function ExportOptions({ settings: s, onChange }: { settings: BorderSettings; onChange: Change }) {
  return (
    <div className='space-y-2'>
      <Segmented label='Size (px wide)' options={EXPORT_WIDTHS} value={s.exportWidth as (typeof EXPORT_WIDTHS)[number]}
        titles={WIDTH_TITLES} onChange={(exportWidth) => onChange({ exportWidth })} />
      <Segmented label='Format' options={EXPORT_FORMATS} value={s.exportFormat} titles={FORMAT_TITLES}
        onChange={(exportFormat) => onChange({ exportFormat })} />
    </div>
  );
}
