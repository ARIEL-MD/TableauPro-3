import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { WireDir, STEP_MIN, STEP_MAX } from './wireRoute';
import { WIRE_COLORS, WIRE_THICKNESSES } from './WireConnectionModal';
import { WireThickness } from '../types/panel';

interface WireRouteBarProps {
  colorName: string;
  color: string;
  thickness: WireThickness;
  step: number;
  marked: boolean;
  hint?: string | null;
  onColor: (c: { name: string; hex: string }) => void;
  onThickness: (v: WireThickness) => void;
  onStep: (v: number) => void;
  onMarked: (m: boolean) => void;
  onMove: (dir: WireDir) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const arrowBtn =
  'w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center cursor-pointer';

const SLIDER_H = 128; // hauteur du curseur vertical, en px

/**
 * Panneau de tracé du fil, ancré en bas de l'écran. Tout est visible d'un coup :
 *  - case « Marquage » ;
 *  - colonne des couleurs, colonne des épaisseurs ;
 *  - cadre « Passage de câble et taille du pas » : curseur vertical du pas
 *    (2x en haut, 0,2x en bas) et croix de flèches.
 * Chaque appui sur une flèche prolonge le bout libre du fil dans cette direction.
 */
export const WireRouteBar: React.FC<WireRouteBarProps> = ({
  colorName,
  color,
  thickness,
  step,
  marked,
  hint,
  onColor,
  onThickness,
  onStep,
  onMarked,
  onMove,
  onCancel,
  onConfirm,
}) => {
  return (
    <div
      role="dialog"
      aria-label={`Tracé du fil ${colorName}`}
      className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[160] w-[min(100vw,440px)] rounded-t-3xl bg-white px-3 pt-3 pb-3 shadow-2xl text-slate-900 no-print"
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* Marquage */}
      <label className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={marked}
          onChange={(e) => onMarked(e.target.checked)}
          className="w-4 h-4 accent-[#1d5fa8]"
        />
        Marquage
      </label>

      <div className="mt-2 grid grid-cols-[auto_auto_1fr] gap-x-2 items-stretch">
        {/* Couleurs */}
        <div className="flex flex-col gap-1.5 rounded-xl bg-slate-100 p-1.5 overflow-y-auto" style={{ maxHeight: 176 }}>
          {WIRE_COLORS.map((c) => (
            <button
              key={c.name}
              type="button"
              aria-label={c.name}
              title={c.name}
              onClick={() => onColor(c)}
              className={`w-7 h-7 shrink-0 rounded-full border-2 cursor-pointer ${
                color === c.hex ? 'border-[#007aff] ring-2 ring-[#007aff]/40' : 'border-slate-300'
              }`}
              style={{ background: c.hex }}
            />
          ))}
        </div>

        {/* Épaisseurs */}
        <div className="flex flex-col gap-1.5 rounded-xl bg-slate-100 p-1.5 justify-between">
          {WIRE_THICKNESSES.map((t) => (
            <button
              key={t.value}
              type="button"
              aria-label={`Épaisseur ${t.label}`}
              title={t.label}
              onClick={() => onThickness(t.value)}
              className={`w-11 h-10 rounded-lg border-2 flex items-center justify-center cursor-pointer ${
                thickness === t.value ? 'bg-sky-300/70 border-sky-400' : 'bg-white border-sky-300'
              }`}
            >
              <span
                className="h-7 rounded-sm border border-black/70"
                style={{ width: t.px * 2 + 1, background: color }}
              />
            </button>
          ))}
        </div>

        {/* Passage de câble et taille du pas */}
        <div className="rounded-xl border border-slate-300 px-2 py-1.5 min-w-0">
          <p className="text-[11px] text-slate-500 leading-tight">Passage de câble et taille du pas</p>
          <div className="mt-1 flex items-center gap-2">
            {/* Curseur vertical : 2x en haut, 0,2x en bas */}
            <div className="flex items-center gap-1">
              <div className="flex flex-col justify-between text-[10px] text-slate-500 text-right" style={{ height: SLIDER_H }}>
                <span>{STEP_MAX}x</span>
                <span>1x</span>
                <span>{STEP_MIN}x</span>
              </div>
              <div className="relative w-6" style={{ height: SLIDER_H }}>
                <input
                  type="range"
                  aria-label="Taille du pas"
                  min={STEP_MIN}
                  max={STEP_MAX}
                  step={0.1}
                  value={step}
                  onChange={(e) => onStep(Number(e.target.value))}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 accent-[#007aff]"
                  style={{ width: SLIDER_H }}
                />
              </div>
            </div>

            {/* Croix de flèches */}
            <div className="grid grid-cols-3 gap-0.5 justify-items-center flex-1">
              <span />
              <button type="button" aria-label="Haut" className={arrowBtn} onClick={() => onMove('up')}>
                <ArrowUp className="w-5 h-5" />
              </button>
              <span />
              <button type="button" aria-label="Gauche" className={arrowBtn} onClick={() => onMove('left')}>
                <ArrowLeft className="w-5 h-5" />
              </button>
              <span />
              <button type="button" aria-label="Droite" className={arrowBtn} onClick={() => onMove('right')}>
                <ArrowRight className="w-5 h-5" />
              </button>
              <span />
              <button type="button" aria-label="Bas" className={arrowBtn} onClick={() => onMove('down')}>
                <ArrowDown className="w-5 h-5" />
              </button>
              <span />
            </div>
          </div>
        </div>
      </div>

      {hint && <p className="mt-1.5 text-xs text-amber-700">{hint}</p>}

      <div className="mt-2 flex justify-center gap-6">
        <button
          type="button"
          onClick={onCancel}
          aria-label="Annuler le fil"
          className="w-24 h-11 rounded-2xl bg-red-100 hover:bg-red-200 text-xl font-semibold text-red-600 cursor-pointer"
        >
          ✕
        </button>
        <button
          type="button"
          onClick={onConfirm}
          aria-label="Valider le fil"
          className="w-24 h-11 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-xl font-semibold text-emerald-700 cursor-pointer"
        >
          ✓
        </button>
      </div>
    </div>
  );
};
