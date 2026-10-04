'use client';

import React, { useState } from 'react';
import { Ruler, X, Check, Info } from 'lucide-react';

export function HowToMeasureModal({ buttonLabel = 'How to Measure Visual Guide' }: { buttonLabel?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeGarment, setActiveGarment] = useState<'SUIT' | 'SHIRT' | 'TROUSER'>('SUIT');

  const guides = {
    SUIT: [
      {
        step: '1. Chest Circumference',
        desc: 'Place the measuring tape under your armpits and wrap it horizontally around the fullest part of your chest. Keep tape snug but comfortable.',
        tip: 'Breathe normally and do not puff out your chest.',
      },
      {
        step: '2. Shoulder Width',
        desc: 'Measure horizontally across the upper back from the tip of the left shoulder bone to the tip of the right shoulder bone.',
        tip: 'Wear a well-fitting shirt to easily locate the shoulder seam points.',
      },
      {
        step: '3. Sleeve Length',
        desc: 'With your arm relaxed by your side, measure from the shoulder seam tip down along the outer arm to the wrist bone.',
        tip: 'Allow an extra 0.5 inch if you prefer your shirt cuff to peek through.',
      },
      {
        step: '4. Jacket Length',
        desc: 'Measure from the base of the back collar down the center of the spine to where you want the jacket hem to end (typically mid-crotch or knuckle level).',
        tip: 'Standard suit length falls just past the curve of the seat.',
      },
    ],
    SHIRT: [
      {
        step: '1. Neck / Collar',
        desc: 'Wrap the tape around the base of your neck where your shirt collar naturally sits. Place one finger between your neck and tape for breathing ease.',
        tip: 'Never pull the tape too tight around the throat.',
      },
      {
        step: '2. Chest Width',
        desc: 'Measure around the fullest part of the chest, under the arms, keeping the tape parallel to the floor.',
        tip: 'Keep arms relaxed at sides.',
      },
      {
        step: '3. Shirt Length',
        desc: 'From the top of the shoulder seam near the collar down to the bottom of the hip/fly line.',
        tip: 'For tucked shirts, add 2 inches for staying tucked comfortably.',
      },
    ],
    TROUSER: [
      {
        step: '1. Trouser Waist',
        desc: 'Measure around your waistline at the exact height where you normally wear your trousers (mid-rise or high-rise).',
        tip: 'Do not measure over a thick leather belt.',
      },
      {
        step: '2. Inseam Length',
        desc: 'Measure from the underside of the crotch seam straight down the inside of the leg to the top of your shoe sole.',
        tip: 'Stand upright with shoes on or flat feet against the floor.',
      },
      {
        step: '3. Outseam (Total Length)',
        desc: 'Measure from the top edge of the trouser waistband down the outside of the hip and leg to the bottom hem.',
        tip: 'Ensure the tape runs straight without curling.',
      },
      {
        step: '4. Thigh Circumference',
        desc: 'Measure around the fullest part of your upper thigh, approximately 1-2 inches below the crotch.',
        tip: 'Ensure tape allows room for comfortable sitting.',
      },
    ],
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gold-dark hover:underline"
      >
        <Ruler className="w-3.5 h-3.5" />
        <span>{buttonLabel}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-heritage-200 space-y-5 max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-heritage-100">
              <div>
                <h3 className="font-serif text-lg font-bold text-heritage-900">
                  How to Measure — Master Tailor Guide
                </h3>
                <p className="text-xs text-gold-dark font-medium">B M Tailors Atelier Standards (Inches)</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-heritage-400 hover:text-heritage-900 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Garment Selector Tabs */}
            <div className="flex border-b border-heritage-200 gap-4 text-xs font-bold">
              {(['SUIT', 'SHIRT', 'TROUSER'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveGarment(type)}
                  className={`pb-2 transition border-b-2 ${
                    activeGarment === type
                      ? 'border-heritage-900 text-heritage-900'
                      : 'border-transparent text-heritage-400 hover:text-heritage-700'
                  }`}
                >
                  {type === 'SUIT' ? 'Suits & Bandhgalas' : type === 'SHIRT' ? 'Bespoke Shirts' : 'Trousers'}
                </button>
              ))}
            </div>

            {/* Steps List */}
            <div className="space-y-4">
              {guides[activeGarment].map((step, idx) => (
                <div key={idx} className="p-3.5 bg-heritage-50 rounded-xl border border-heritage-200 space-y-1.5 text-xs">
                  <p className="font-bold text-heritage-900 text-sm">{step.step}</p>
                  <p className="text-heritage-700 leading-relaxed">{step.desc}</p>
                  <div className="flex items-center space-x-1.5 text-[11px] text-amber-900 bg-amber-50 p-2 rounded border border-amber-200/60">
                    <Info className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                    <span><strong>Master Cutter Tip:</strong> {step.tip}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-heritage-500 text-center">
              Prefer professional hands-on measurement? Visit our Jaipur atelier for an in-person measurement session with our master cutters.
            </p>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full py-2.5 bg-heritage-900 text-gold font-bold text-xs rounded hover:bg-heritage-800 transition"
            >
              Close Visual Guide
            </button>
          </div>
        </div>
      )}
    </>
  );
}
