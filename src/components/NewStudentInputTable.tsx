import React from 'react';
import { NewStudent } from '../types';
import { UserPlus, Sparkles, RefreshCw } from 'lucide-react';

interface NewStudentInputTableProps {
  newStudent: NewStudent;
  onNewStudentChange: (student: NewStudent) => void;
  items: [string, string, string, string, string];
}

export const NewStudentInputTable: React.FC<NewStudentInputTableProps> = ({
  newStudent,
  onNewStudentChange,
  items,
}) => {
  const handleNameChange = (name: string) => {
    onNewStudentChange({
      ...newStudent,
      name,
    });
  };

  const handleScoreChange = (itemIdx: number, valStr: string) => {
    const newScores = [...newStudent.scores];
    const trimmed = valStr.trim();
    if (trimmed === '') {
      newScores[itemIdx] = null;
    } else {
      const num = parseInt(trimmed, 10);
      if (!isNaN(num)) {
        newScores[itemIdx] = Math.max(1, Math.min(5, num));
      }
    }
    onNewStudentChange({
      ...newStudent,
      scores: newScores,
    });
  };

  const handleSetScore = (itemIdx: number, val: number) => {
    const newScores = [...newStudent.scores];
    newScores[itemIdx] = val;
    onNewStudentChange({
      ...newStudent,
      scores: newScores,
    });
  };

  const handleExampleFill = () => {
    onNewStudentChange({
      name: '10131 전학생 (나신입)',
      scores: [1, 2, 4, 5, 3],
    });
  };

  const handleReset = () => {
    onNewStudentChange({
      name: '',
      scores: [null, null, null, null, null],
    });
  };

  const scoreOptions = [1, 2, 3, 4, 5];
  const exampleScores = [1, 2, 3, 4, 5];

  return (
    <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-md p-5 transition-all hover:border-indigo-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-indigo-100">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-sm">
            4
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-indigo-600" />
              내 취향 순위 입력
            </h2>
            <p className="text-xs text-slate-500">
              비교 대상이 될 새로운 학생 한 명의 학번/이름과 가장 선호하는 항목부터 차례대로 점수(1점, 2점, 3점, 4점, 5점)를 입력하세요. (예시는 희미하게 표시됩니다)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExampleFill}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold transition cursor-pointer flex items-center gap-1 border border-indigo-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> 예시 새 학생 채우기
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition cursor-pointer flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" /> 빈칸으로 비우기
          </button>
        </div>
      </div>

      {/* 2 Rows x 6 Columns Table */}
      <div className="border-2 border-indigo-300 rounded-xl overflow-hidden shadow-sm bg-indigo-50/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            {/* 1행: 항목 명칭 자동 입력 (6열) */}
            <thead className="bg-indigo-800 text-white select-none">
              <tr>
                <th className="p-3 w-48 font-bold border-r border-indigo-700">
                  <div className="text-[10px] text-indigo-200">1행 1열</div>
                  <div>학번 또는 이름</div>
                </th>
                {items.map((item, idx) => (
                  <th
                    key={idx}
                    className="p-3 text-center min-w-[120px] font-bold border-r border-indigo-700 last:border-r-0"
                  >
                    <div className="text-[10px] text-indigo-200">
                      1행 {idx + 2}열 (성분 x_{idx + 1})
                    </div>
                    <div className="truncate text-sm font-semibold text-amber-200">
                      {item.trim() ? item : <span className="text-indigo-300 font-normal">항목 {idx + 1}</span>}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* 2행: 새로운 학생 한 명이 학번/이름과 점수를 입력할 수 있는 빈 칸 (6열) */}
            <tbody className="bg-white">
              <tr className="hover:bg-indigo-50/50 transition">
                {/* 2행 1열: 새로운 학생 학번 또는 이름 빈 칸 (예시는 희미하게 처리) */}
                <td className="p-3 border-r border-slate-200 bg-amber-50/30">
                  <div className="text-[10px] font-medium text-slate-400 mb-1">
                    2행 1열 (학번/이름)
                  </div>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="예: 10131 전학생 (나신입)"
                    className="w-full text-sm font-bold text-indigo-900 placeholder:text-slate-400/60 placeholder:font-normal bg-white border-2 border-indigo-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition shadow-inner"
                  />
                </td>

                {/* 2행 2열부터 6열: 새로운 학생이 5가지 항목에 점수(1~5점)를 입력할 수 있는 빈 칸 */}
                {items.map((_, itemIdx) => {
                  const currentScore = newStudent.scores[itemIdx];

                  return (
                    <td
                      key={itemIdx}
                      className="p-2.5 text-center border-r border-slate-200 last:border-r-0 bg-indigo-50/20"
                    >
                      <div className="text-[10px] font-medium text-slate-400 mb-1">
                        2행 {itemIdx + 2}열 점수
                      </div>

                      {/* Direct Numeric Input with Faint Placeholder */}
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={currentScore !== null && currentScore !== undefined ? currentScore : ''}
                        onChange={(e) => handleScoreChange(itemIdx, e.target.value)}
                        placeholder={`예: ${exampleScores[itemIdx]}`}
                        className={`w-full text-center py-1.5 px-2 text-base font-black rounded-lg border-2 transition placeholder:text-slate-300 placeholder:font-normal ${
                          currentScore
                            ? 'bg-amber-100 text-amber-950 border-amber-400 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-300 focus:border-indigo-500'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                      />

                      {/* Quick click score buttons (5점, 4점, 3점, 2점, 1점) */}
                      <div className="flex items-center justify-center gap-1 mt-1.5">
                        {scoreOptions.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleSetScore(itemIdx, opt)}
                            className={`w-5 h-5 text-[10px] font-bold rounded flex items-center justify-center transition cursor-pointer ${
                              currentScore === opt
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-indigo-100 text-slate-600'
                            }`}
                            title={`${opt}점 (${opt === 1 ? '1순위(최선호)' : opt === 5 ? '5순위(비선호)' : opt + '순위'})`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Vector preview of the new student */}
      <div className="mt-3 p-3 bg-indigo-50/80 rounded-xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-indigo-950">
            새로운 학생 벡터 표현:
          </span>
          {newStudent.scores.some((sc) => sc !== null) ? (
            <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
              {newStudent.name.trim() ? newStudent.name : '새로운 학생'} = (
              {newStudent.scores.map((sc) => (sc !== null ? sc : '-')).join(', ')})
            </span>
          ) : (
            <span className="text-slate-400 italic">
              (학번/이름과 5가지 항목의 점수를 입력하면 벡터가 생성됩니다)
            </span>
          )}
        </div>
        <span className="text-slate-500 text-[11px]">
          선호도 점수 배점: 가장 선호하는 것부터 1점(최선호), 2점, 3점, 4점, 5점
        </span>
      </div>
    </div>
  );
};
