import React from 'react';
import { X, BookOpen, Ruler, Compass, Layers, CheckCircle2 } from 'lucide-react';

interface MathGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MathGuideModal: React.FC<MathGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-indigo-600 mb-2">
          <BookOpen className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            인공지능 수학 (AI Mathematics) 개념 노트
          </span>
        </div>

        <h2 className="text-xl font-black text-slate-900 mb-4">
          학생 취향 벡터와 유사도 측정 원리
        </h2>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5 mb-2 text-sm">
              <Layers className="w-4 h-4 text-indigo-600" />
              1. 취향의 벡터화 (Vectorization)
            </h3>
            <p className="text-slate-600">
              5가지 평가 항목에 대해 학생이 가장 선호하는 항목부터 차례대로 부여한 점수(1점, 2점, 3점, 4점, 5점)를 순서쌍으로 나타내면 5차원 실수 공간 ℝ⁵의 점 또는 벡터로 표현됩니다.
            </p>
            <div className="mt-2 p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-xs text-indigo-900">
              새로운 학생 벡터 <strong>A</strong> = (x₁, x₂, x₃, x₄, x₅)<br />
              기존 학생 벡터 <strong>B</strong> = (y₁, y₂, y₃, y₄, y₅)
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              ※ 6차원 벡터 옵션을 활성화하면 5개 항목의 총점 또는 가중치 성분이 6번째 차원으로 추가됩니다.
            </p>
          </section>

          <section className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
            <h3 className="font-bold text-indigo-950 flex items-center gap-1.5 mb-2 text-sm">
              <Ruler className="w-4 h-4 text-indigo-600" />
              2. 유클리드 유사도 (Euclidean Similarity)
            </h3>
            <p className="text-slate-600 mb-2">
              두 벡터 사이의 최단 직선 거리(유클리드 거리 d)를 구한 뒤, 거리가 0일 때 유사도가 1이 되도록 역수 변환합니다:
            </p>
            <div className="p-2.5 bg-white rounded-xl border border-indigo-200 font-mono text-xs text-indigo-900 space-y-1">
              <div>거리 d = √( (x₁ - y₁)² + (x₂ - y₂)² + ⋯ + (x₅ - y₅)² )</div>
              <div className="font-bold text-indigo-700">유클리드 유사도 S = 1 / (1 + d)</div>
            </div>
            <p className="mt-2 text-slate-600">
              두 학생의 점수가 똑같을수록 d가 작아져서 유사도 S는 <strong>최댓값 1.0</strong>에 가까워집니다. 따라서 <strong className="text-indigo-800">최댓값을 가진 학생이 가장 유사한 학생</strong>입니다.
            </p>
          </section>

          <section className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200">
            <h3 className="font-bold text-amber-950 flex items-center gap-1.5 mb-2 text-sm">
              <Compass className="w-4 h-4 text-amber-600" />
              3. 코사인 유사도 (Cosine Similarity)
            </h3>
            <p className="text-slate-600 mb-2">
              두 벡터가 가리키는 방향의 사잇각 θ의 코사인 값을 계산합니다. 점수의 총합보다 <strong>어떤 항목을 더 선호하는지에 대한 비율(취향의 방향)</strong>을 측정합니다:
            </p>
            <div className="p-2.5 bg-white rounded-xl border border-amber-300 font-mono text-xs text-amber-950 space-y-1">
              <div>내적 A · B = x₁y₁ + x₂y₂ + x₃y₃ + x₄y₄ + x₅y₅ (분자)</div>
              <div>두 벡터 크기의 곱 ||A|| × ||B|| = √(∑ x_i²) × √(∑ y_i²) (분모)</div>
              <div className="font-bold text-amber-800">코사인 유사도 cos(θ) = ( A · B ) / ( ||A|| × ||B|| )</div>
            </div>
            <p className="mt-2 text-slate-600">
              취향의 방향성이 완전히 같으면 각도 θ=0°가 되어 <strong>최댓값 1.0</strong>을 갖습니다. 따라서 <strong className="text-amber-900">최댓값을 가진 학생이 가장 유사한 학생</strong>입니다.
            </p>
          </section>

          <div className="flex items-center gap-2 pt-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold text-slate-700">
              학생들과 함께 유클리드 유사도와 코사인 유사도에서 1위가 서로 다를 수 있는 사례를 탐구해보세요!
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition text-xs sm:text-sm"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
