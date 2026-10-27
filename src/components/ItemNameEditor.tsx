import React from 'react';
import { Tag, Sparkles } from 'lucide-react';
import { PRESETS, DEFAULT_ITEMS_PLACEHOLDER } from '../utils/sampleData';
import { Preset } from '../types';

interface ItemNameEditorProps {
  items: [string, string, string, string, string];
  onChange: (newItems: [string, string, string, string, string]) => void;
}

export const ItemNameEditor: React.FC<ItemNameEditorProps> = ({ items, onChange }) => {
  const handleItemChange = (index: number, value: string) => {
    const updated = [...items] as [string, string, string, string, string];
    updated[index] = value;
    onChange(updated);
  };

  const applyPreset = (preset: Preset) => {
    onChange([...preset.items] as [string, string, string, string, string]);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-sm">
            1
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-indigo-600" />
              5가지 항목 입력
            </h2>
            <p className="text-xs text-slate-500">
              학생들이 가장 선호하는 항목부터 차례대로 점수(1점, 2점, 3점, 4점, 5점)를 매길 5개 항목의 이름을 입력하세요. (예시 항목은 희미하게 표시됩니다)
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 추천 프리셋 채우기:
          </span>
          {PRESETS.map((preset) => (
            <button
              key={preset.title}
              type="button"
              onClick={() => applyPreset(preset)}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition cursor-pointer border border-slate-200 hover:border-indigo-200"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* 5 Input Boxes with Faint Placeholders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col p-3 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-1.5 py-0.5 rounded">
                항목 {idx + 1}
              </span>
              <span className="text-[10px] text-slate-400">성분 x_{idx + 1}</span>
            </div>
            <input
              type="text"
              value={item}
              onChange={(e) => handleItemChange(idx, e.target.value)}
              placeholder={`예: ${DEFAULT_ITEMS_PLACEHOLDER[idx]}`}
              className="w-full text-sm font-semibold text-slate-800 placeholder:text-slate-400/60 placeholder:font-normal bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
