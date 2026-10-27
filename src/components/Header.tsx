import React from 'react';
import {
  Sparkles,
  GraduationCap,
  RotateCcw,
  BookOpenCheck,
  Share2,
} from 'lucide-react';

interface HeaderProps {
  onLoadFullDemo: () => void;
  onResetAll: () => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onLoadFullDemo,
  onResetAll,
  onOpenGuide,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900 tracking-tight">
                학생 취향 유사도 분석기
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                고등학교 인공지능 수학
              </span>
            </div>
            <p className="text-xs text-slate-500">
              5차원 선호도 벡터 기반 유클리드 & 코사인 유사도 비교 탐구 프로그램
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLoadFullDemo}
            className="text-xs px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>원클릭 수업 데모 실행</span>
          </button>

          <button
            type="button"
            onClick={onOpenGuide}
            className="text-xs px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="수학 공식 및 수업 활용 안내"
          >
            <BookOpenCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>수학 원리 안내</span>
          </button>

          <button
            type="button"
            onClick={onResetAll}
            className="text-xs px-2.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold transition cursor-pointer"
            title="모든 항목과 학생 데이터 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
