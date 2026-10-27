import React, { useState } from 'react';
import { Student, NewStudent, SimilarityResult, SimilarityTab } from '../types';
import {
  Trophy,
  Compass,
  Ruler,
  Award,
  Sparkles,
  Layers,
  ArrowUpDown,
  BookOpen,
  Check,
} from 'lucide-react';

interface SimilarityResultsProps {
  students: Student[];
  newStudent: NewStudent;
  results: SimilarityResult[];
  items: [string, string, string, string, string];
  use6thDim: boolean;
  onToggle6thDim: (val: boolean) => void;
}

export const SimilarityResults: React.FC<SimilarityResultsProps> = ({
  students,
  newStudent,
  results,
  items,
  use6thDim,
  onToggle6thDim,
}) => {
  const [activeTab, setActiveTab] = useState<SimilarityTab>('euclidean');
  const [sortOrder, setSortOrder] = useState<'rank' | 'original'>('rank');

  const newStudentName = newStudent.name.trim() || '새로운 학생';
  const hasActiveStudents = results.length > 0;

  // Find the top student for each metric
  const topEuclidean = results.find((r) => r.isMaxEuclidean);
  const topCosine = results.find((r) => r.isMaxCosine);

  // Active top student for current tab
  const activeTopResult = activeTab === 'euclidean' ? topEuclidean : topCosine;
  const activeTopStudentName = activeTopResult?.student.name || '없음';

  // Sort displayed results
  const displayedResults = [...results].sort((a, b) => {
    if (sortOrder === 'rank') {
      return activeTab === 'euclidean'
        ? a.rankEuclidean - b.rankEuclidean
        : a.rankCosine - b.rankCosine;
    }
    return a.student.id - b.student.id;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 space-y-6">
      {/* Title & Vector Dimension Config */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-sm">
            5
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              벡터 유사도 계산 및 가장 유사한 학생 분석 화면
            </h2>
            <p className="text-xs text-slate-500">
              각 학생의 점수 벡터를 바탕으로 유클리드 유사도와 코사인 유사도를 계산하여 취향이 가장 일치하는 학생을 도출합니다.
            </p>
          </div>
        </div>

        {/* 6D Vector Toggle / Options */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
          <Layers className="w-3.5 h-3.5 text-indigo-600" />
          <span className="font-medium text-slate-700">벡터 차원:</span>
          <button
            type="button"
            onClick={() => onToggle6thDim(false)}
            className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${
              !use6thDim
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            5차원 (5개 항목 점수)
          </button>
          <button
            type="button"
            onClick={() => onToggle6thDim(true)}
            className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${
              use6thDim
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="5개 항목 점수 + 6번째 차원(총점)"
          >
            6차원 (5개 항목 + 총점)
          </button>
        </div>
      </div>

      {/* (6) 2개의 탭 구성: 유클리드 유사도 / 코사인 유사도 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-100/80 p-1.5 rounded-2xl">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('euclidean')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${
              activeTab === 'euclidean'
                ? 'bg-white text-indigo-950 shadow-sm border border-slate-200/60 ring-2 ring-indigo-500/20'
                : 'text-slate-600 hover:text-indigo-700 hover:bg-white/60'
            }`}
          >
            <Ruler className="w-4 h-4 text-indigo-600" />
            <span>유클리드 유사도 (Euclidean Similarity)</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              최댓값 1위
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cosine')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${
              activeTab === 'cosine'
                ? 'bg-white text-indigo-950 shadow-sm border border-slate-200/60 ring-2 ring-indigo-500/20'
                : 'text-slate-600 hover:text-indigo-700 hover:bg-white/60'
            }`}
          >
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>코사인 유사도 (Cosine Similarity)</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              최댓값 1위
            </span>
          </button>
        </div>

        {/* Sort order toggle */}
        <div className="flex items-center gap-1 px-2">
          <button
            type="button"
            onClick={() =>
              setSortOrder((prev) => (prev === 'rank' ? 'original' : 'rank'))
            }
            className="text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-1 shadow-2xs transition cursor-pointer"
          >
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
            {sortOrder === 'rank' ? '유사도 순위순 정렬' : '원래 출석번호순 정렬'}
          </button>
        </div>
      </div>

      {/* Tab Mathematical Formula Header */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
        {activeTab === 'euclidean' ? (
          <div>
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm mb-1">
              <Ruler className="w-4 h-4 text-indigo-600" />
              유클리드 거리 및 유사도 계산 원리
            </div>
            <p className="text-slate-600 leading-relaxed">
              • <strong>유클리드 거리</strong>: 두 점수 벡터 간의 직선 거리{' '}
              <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-indigo-700 font-mono">
                d = √( ∑ (x_i - y_i)² )
              </code>
              <br />• <strong>유클리드 유사도</strong>:{' '}
              <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-indigo-700 font-mono font-bold">
                유사도 = 1 / (1 + d)
              </code>
              {' '}(두 학생의 점수가 완전히 같으면 거리 d=0 이므로 <strong>최댓값 1.0</strong>이 됩니다. 거리가 가까울수록 유사도가 커지므로{' '}
              <span className="font-bold text-amber-700">최댓값을 가진 학생이 가장 유사합니다</span>.)
            </p>
          </div>
        ) : (
          <div>
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm mb-1">
              <Compass className="w-4 h-4 text-indigo-600" />
              코사인 유사도(Cosine Similarity) 계산 원리
            </div>
            <p className="text-slate-600 leading-relaxed">
              • <strong>코사인 유사도</strong>: 다차원 공간에서 두 학생의 선호도 벡터가 이루는 사잇각 θ의 코사인 값{' '}
              <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-indigo-700 font-mono font-bold">
                cos(θ) = ( A · B ) / ( ||A|| × ||B|| )
              </code>
              <br />• 벡터의 절대적 크기(점수의 총합)보다 <strong>취향의 방향성(어떤 항목을 더 선호하는지 비율)</strong>을 비교합니다.{' '}
              각도가 완전히 일치할 때 <span className="font-bold text-amber-700">최댓값 1.0</span>이 되므로{' '}
              <span className="font-bold text-amber-700">최댓값을 가진 학생이 가장 유사합니다</span>.
            </p>
          </div>
        )}
      </div>

      {!hasActiveStudents ? (
        <div className="p-8 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl space-y-2">
          <Trophy className="w-8 h-8 text-slate-300 mx-auto mb-1" />
          <h4 className="text-sm font-bold text-slate-700">유사도 분석 대기 중</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            위 <strong>3번 표</strong>에 설문 결과 데이터를 입력(또는 스프레드시트 붙여넣기 / [예시 데이터 채우기])하고,{' '}
            <strong>4번 표</strong>에 새로운 학생의 학번/이름 및 점수를 입력하면 유클리드와 코사인 유사도가 즉시 계산됩니다.
          </p>
        </div>
      ) : (
        <>
          {/* (7) Similarity Results Table with Highlighted Max Value Cell */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="max-h-[440px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-800 text-white sticky top-0 z-10 select-none">
                  <tr>
                    <th className="p-3 text-center w-16 font-bold border-r border-slate-700">
                      순위
                    </th>
                    <th className="p-3 min-w-[130px] font-bold border-r border-slate-700">
                      학번 또는 이름
                    </th>
                    <th className="p-3 min-w-[160px] font-bold border-r border-slate-700 text-center">
                      점수 벡터 {use6thDim ? 'v ∈ ℝ⁶' : 'v ∈ ℝ⁵'}
                    </th>

                    {activeTab === 'euclidean' ? (
                      <>
                        <th className="p-3 text-center min-w-[120px] font-bold border-r border-slate-700">
                          유클리드 거리 (d)
                        </th>
                        <th className="p-3 text-center min-w-[160px] font-extrabold bg-indigo-900 border-r border-indigo-700 text-amber-300">
                          ★ 유클리드 유사도 [ 1 / (1 + d) ]
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="p-3 text-center min-w-[110px] font-bold border-r border-slate-700">
                          내적 (A · B)
                        </th>
                        <th className="p-3 text-center min-w-[130px] font-bold border-r border-slate-700">
                          <div>||A|| × ||B||</div>
                          <div className="text-[10px] text-indigo-300 font-normal">벡터 크기의 곱</div>
                        </th>
                        <th className="p-3 text-center min-w-[160px] font-extrabold bg-indigo-900 border-r border-indigo-700 text-amber-300">
                          ★ 코사인 유사도 [ cos(θ) ]
                        </th>
                      </>
                    )}

                    <th className="p-3 text-center w-28 font-bold">판정</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                  {displayedResults.map((r) => {
                    const isMax =
                      activeTab === 'euclidean' ? r.isMaxEuclidean : r.isMaxCosine;
                    const rank =
                      activeTab === 'euclidean' ? r.rankEuclidean : r.rankCosine;

                    const vectorValues = [
                      ...r.student.scores.map((sc) => (sc !== null ? sc : 0)),
                      ...(use6thDim
                        ? [r.student.scores.reduce((a, b) => (a ?? 0) + (b ?? 0), 0)]
                        : []),
                    ];

                    return (
                      <tr
                        key={r.student.id}
                        className={`transition ${
                          isMax
                            ? 'bg-amber-50/80 font-semibold'
                            : rank <= 3
                            ? 'bg-indigo-50/20'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        {/* Rank */}
                        <td className="p-3 text-center border-r border-slate-200">
                          {rank === 1 ? (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-amber-500 text-white font-black text-xs shadow-xs animate-pulse">
                              🏆 1위
                            </span>
                          ) : rank === 2 ? (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-slate-300 text-slate-800 font-bold text-xs">
                              🥈 2위
                            </span>
                          ) : rank === 3 ? (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-amber-700 text-amber-100 font-bold text-xs">
                              🥉 3위
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium">{rank}위</span>
                          )}
                        </td>

                        {/* Name */}
                        <td className="p-3 border-r border-slate-200 font-semibold text-slate-800">
                          <div className="flex items-center gap-1.5">
                            {isMax && <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                            <span>{r.student.name}</span>
                          </div>
                        </td>

                        {/* Vector */}
                        <td className="p-3 text-center border-r border-slate-200 font-mono text-[11px] text-slate-600">
                          ({vectorValues.join(', ')})
                        </td>

                        {/* Euclidean Metrics */}
                        {activeTab === 'euclidean' ? (
                          <>
                            <td className="p-3 text-center border-r border-slate-200 font-mono text-slate-700">
                              {r.euclideanDistance.toFixed(4)}
                            </td>

                            {/* (7) REQUIREMENT: 각 탭의 유사도 계산 결과를 나타내는 표에서 가장 유사한 값(유클리드 유사도는 최댓값)이 있는 칸에는 한 눈에 알아볼 수 있는 색깔로 음영 처리 */}
                            <td
                              className={`p-3 text-center border-r border-slate-200 transition ${
                                isMax
                                  ? 'bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-300 text-amber-950 font-black text-sm shadow-inner ring-2 ring-inset ring-amber-400'
                                  : 'text-slate-700 font-mono font-medium'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-1.5">
                                {isMax && (
                                  <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.5 rounded font-black tracking-wider uppercase shadow-xs">
                                    최댓값
                                  </span>
                                )}
                                <span className={isMax ? 'text-base font-extrabold text-amber-950' : ''}>
                                  {r.euclideanSimilarity.toFixed(4)}
                                </span>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            {/* Cosine Metrics */}
                            <td className="p-3 text-center border-r border-slate-200 font-mono text-slate-700">
                              {r.dotProduct.toFixed(1)}
                            </td>
                            <td className="p-3 text-center border-r border-slate-200 font-mono text-slate-700" title={`||A||=${r.normA.toFixed(3)} × ||B||=${r.normB.toFixed(3)}`}>
                              {r.normProduct.toFixed(3)}
                            </td>

                            {/* (7) REQUIREMENT: 각 탭의 유사도 계산 결과를 나타내는 표에서 가장 유사한 값(코사인 유사도는 최댓값)이 있는 칸에는 한 눈에 알아볼 수 있는 색깔로 음영 처리 */}
                            <td
                              className={`p-3 text-center border-r border-slate-200 transition ${
                                isMax
                                  ? 'bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-300 text-amber-950 font-black text-sm shadow-inner ring-2 ring-inset ring-amber-400'
                                  : 'text-slate-700 font-mono font-medium'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-1.5">
                                {isMax && (
                                  <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.5 rounded font-black tracking-wider uppercase shadow-xs">
                                    최댓값
                                  </span>
                                )}
                                <span className={isMax ? 'text-base font-extrabold text-amber-950' : ''}>
                                  {r.cosineSimilarity.toFixed(4)}
                                </span>
                              </div>
                            </td>
                          </>
                        )}

                        {/* Status badge */}
                        <td className="p-3 text-center">
                          {isMax ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300 shadow-2xs">
                              <Check className="w-3 h-3 text-emerald-600" />
                              최고 유사 학생
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* (8) REQUIREMENT: 각 탭의 유사도 계산 결과를 나타내는 표의 아래쪽에는
              "새로운 학생 <학번 또는 이름>과(와) 가장 유사한 학생은 <학번 또는 이름>입니다."라는 문구가 선명하게 보이도록 출력 */}
          <div className="mt-4 p-6 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-xl border-2 border-indigo-400/40 relative overflow-hidden">
            {/* Background decorative glow */}
            <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-8 -top-8 w-48 h-48 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center shrink-0 shadow-lg">
                  <Trophy className="w-8 h-8" />
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wider text-amber-300 font-extrabold mb-1 flex items-center gap-1.5 justify-center md:justify-start">
                    <Sparkles className="w-3.5 h-3.5" />
                    {activeTab === 'euclidean' ? '유클리드 유사도 분석 결과' : '코사인 유사도 분석 결과'}
                  </div>

                  {/* The Exact Sentence Mandated by Requirement (8) */}
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug drop-shadow-sm">
                    새로운 학생 <span className="text-amber-300 underline decoration-amber-400 decoration-2 underline-offset-4 font-black">{newStudentName}</span>과(와) 가장 유사한 학생은{' '}
                    <span className="text-amber-300 underline decoration-amber-400 decoration-2 underline-offset-4 font-black">{activeTopStudentName}</span>입니다.
                  </h3>

                  <p className="text-xs text-indigo-200 mt-2">
                    {activeTab === 'euclidean' ? (
                      <>
                        유클리드 거리 <strong>{activeTopResult?.euclideanDistance.toFixed(4)}</strong> 로 최단 거리이며,
                        유클리드 유사도 <strong className="text-amber-300 font-bold">{activeTopResult?.euclideanSimilarity.toFixed(4)}</strong> (최댓값)를 기록했습니다.
                      </>
                    ) : (
                      <>
                        벡터 내적 <strong>{activeTopResult?.dotProduct.toFixed(1)}</strong>,
                        두 벡터 크기의 곱 ||A||×||B|| <strong>{activeTopResult?.normProduct.toFixed(3)}</strong>,
                        코사인 유사도 <strong className="text-amber-300 font-bold">{activeTopResult?.cosineSimilarity.toFixed(4)}</strong> (최댓값)로 취향의 방향성이 가장 일치합니다.
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Side-by-side Score Comparison Badge */}
              {activeTopResult && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/20 text-xs text-white shrink-0 min-w-[280px]">
                  <div className="font-bold text-amber-200 mb-2 flex items-center gap-1">
                    <Award className="w-4 h-4" /> 항목별 점수 비교:
                  </div>
                  <div className="space-y-1 font-mono text-[11px]">
                    {items.map((item, idx) => {
                      const newScore = newStudent.scores[idx] ?? 0;
                      const topScore = activeTopResult.student.scores[idx] ?? 0;
                      const isSame = newScore === topScore;
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-0.5 border-b border-white/10 last:border-b-0"
                        >
                          <span className="text-indigo-200 truncate max-w-[100px]">
                            {item}:
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-amber-300 font-bold">{newScore}점</span>
                            <span className="text-slate-400">vs</span>
                            <span className="text-emerald-300 font-bold">{topScore}점</span>
                            {isSame && (
                              <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-1 rounded">
                                일치!
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Educational Insights for High School AI Math */}
          <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-indigo-900 block mb-1">
                💡 고등학교 [인공지능 수학] 탐구 길잡이: 유클리드 유사도 vs 코사인 유사도
              </span>
              유클리드 유사도는 점수의 절대적인 차이(거리)를 측정하므로 두 학생의 점수 편차가 전반적으로 작을 때 높은 유사도를 나타냅니다.
              반면 코사인 유사도는 점수 크기와 관계없이 5개 항목 간의 <strong>상대적인 선호 비율(취향의 방향 벡터)</strong>이 얼마나 닮았는지를 측정합니다.
              두 탭의 결과를 번갈아 보며 순위가 달라지는 학생이 있는지 관찰하고 그 수학적 이유를 토론해보세요!
            </div>
          </div>
        </>
      )}
    </div>
  );
};
