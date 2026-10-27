import React, { useState } from 'react';
import { Student } from '../types';
import { SAMPLE_STUDENTS, createEmptyStudents } from '../utils/sampleData';
import {
  Table,
  UploadCloud,
  FileSpreadsheet,
  Trash2,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface StudentDataTableProps {
  students: Student[];
  onStudentsChange: (students: Student[]) => void;
  items: [string, string, string, string, string];
}

export const StudentDataTable: React.FC<StudentDataTableProps> = ({
  students,
  onStudentsChange,
  items,
}) => {
  const [csvUrl, setCsvUrl] = useState('');
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Direct name cell editing
  const handleNameChange = (index: number, newName: string) => {
    const updated = [...students];
    updated[index] = { ...updated[index], name: newName };
    onStudentsChange(updated);
  };

  // Direct score editing without dropdown
  const handleScoreChange = (studentIndex: number, itemIndex: number, valStr: string) => {
    const updated = [...students];
    const newScores = [...updated[studentIndex].scores];
    const trimmed = valStr.trim();
    if (trimmed === '') {
      newScores[itemIndex] = null;
    } else {
      const num = parseInt(trimmed, 10);
      if (!isNaN(num)) {
        newScores[itemIndex] = Math.max(1, Math.min(5, num));
      }
    }
    updated[studentIndex] = { ...updated[studentIndex], scores: newScores };
    onStudentsChange(updated);
  };

  // Fill sample data
  const handleLoadSample = () => {
    onStudentsChange([...SAMPLE_STUDENTS]);
    showStatus('success', '샘플 학생 30명 데이터(1~5점)가 표에 채워졌습니다.');
  };

  // Clear all to completely blank
  const handleClear = () => {
    onStudentsChange(createEmptyStudents(30));
    showStatus('success', '표의 모든 칸이 빈칸으로 초기화되었습니다.');
  };

  // Parse pasted TSV/CSV data (e.g. copied directly from Google Sheets or Excel)
  const handleApplyPaste = () => {
    if (!pasteText.trim()) return;

    try {
      const lines = pasteText
        .trim()
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      let startIdx = 0;
      const firstLineTokens = lines[0].split(/[\t,]/).map((s) => s.trim().replace(/^["']|["']$/g, ''));
      const hasHeader =
        firstLineTokens.some((t) => t.includes('이름') || t.includes('학번') || t.includes('타임스탬프') || t.includes('순번')) ||
        isNaN(Number(firstLineTokens[1]));

      if (hasHeader && lines.length > 1) {
        startIdx = 1;
      }

      const newStudents = createEmptyStudents(30);
      let studentCount = 0;

      for (let i = startIdx; i < lines.length && studentCount < 30; i++) {
        const line = lines[i];
        const tokens = line.split(/[\t,]/).map((s) => s.trim().replace(/^["']|["']$/g, ''));
        if (tokens.length === 0 || tokens.every((t) => t === '')) continue;

        let name = '';
        let scores: (number | null)[] = [];

        // Check if token 0 looks like timestamp (contains ':' or '-' or '/')
        if (tokens.length >= 7 && (tokens[0].includes(':') || tokens[0].includes('-') || tokens[0].includes('/'))) {
          name = tokens[1] || '';
          scores = tokens.slice(2, 7).map((n) => {
            const num = Number(n);
            return isNaN(num) || num < 1 ? null : Math.max(1, Math.min(5, Math.round(num)));
          });
        } else {
          name = tokens[0] || '';
          scores = tokens.slice(1, 6).map((n) => {
            const num = Number(n);
            return isNaN(num) || num < 1 ? null : Math.max(1, Math.min(5, Math.round(num)));
          });
        }

        while (scores.length < 5) scores.push(null);
        scores = scores.slice(0, 5);

        newStudents[studentCount] = {
          id: studentCount + 1,
          name,
          scores,
        };
        studentCount++;
      }

      onStudentsChange(newStudents);
      setShowPasteModal(false);
      setPasteText('');
      showStatus('success', `${studentCount}명의 구글 설문 응답 데이터가 표에 연동되었습니다.`);
    } catch {
      showStatus('error', '데이터 파싱 중 오류가 발생했습니다. 양식을 확인해주세요.');
    }
  };

  // Fetch published Google Sheets CSV
  const handleFetchCsv = async () => {
    if (!csvUrl.trim()) {
      showStatus('error', '구글 시트 CSV 웹게시 URL을 입력해주세요.');
      return;
    }

    setIsLoadingUrl(true);
    try {
      const response = await fetch(csvUrl.trim());
      if (!response.ok) throw new Error('네트워크 응답 오류');
      const text = await response.text();
      handleApplyPasteFromText(text);
    } catch (err) {
      console.error(err);
      showStatus(
        'error',
        '구글 시트 연동 실패: CSV 주소를 확인하거나, 스프레드시트에서 표를 복사해 [붙여넣기]를 이용하세요.'
      );
    } finally {
      setIsLoadingUrl(false);
    }
  };

  const handleApplyPasteFromText = (rawText: string) => {
    try {
      const lines = rawText
        .trim()
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      let startIdx = 0;
      if (lines.length > 1) {
        startIdx = 1;
      }

      const newStudents = createEmptyStudents(30);
      let studentCount = 0;

      for (let i = startIdx; i < lines.length && studentCount < 30; i++) {
        const line = lines[i];
        const tokens = line.split(/[\t,]/).map((s) => s.trim().replace(/^["']|["']$/g, ''));
        if (tokens.length === 0 || tokens.every((t) => t === '')) continue;

        let name = '';
        let scores: (number | null)[] = [];

        if (tokens.length >= 7 && (tokens[0].includes(':') || tokens[0].includes('-') || tokens[0].includes('/'))) {
          name = tokens[1] || '';
          scores = tokens.slice(2, 7).map((n) => {
            const num = Number(n);
            return isNaN(num) || num < 1 ? null : Math.max(1, Math.min(5, Math.round(num)));
          });
        } else {
          name = tokens[0] || '';
          scores = tokens.slice(1, 6).map((n) => {
            const num = Number(n);
            return isNaN(num) || num < 1 ? null : Math.max(1, Math.min(5, Math.round(num)));
          });
        }

        while (scores.length < 5) scores.push(null);
        scores = scores.slice(0, 5);

        newStudents[studentCount] = {
          id: studentCount + 1,
          name,
          scores,
        };
        studentCount++;
      }

      onStudentsChange(newStudents);
      showStatus('success', `${studentCount}명의 설문 결과가 실시간으로 연동되었습니다!`);
    } catch {
      showStatus('error', '데이터 변환에 실패했습니다.');
    }
  };

  // Export current table as CSV
  const handleExportCsv = () => {
    const header = ['학번/이름', ...items].join(',');
    const rows = students.map((s) => [s.name, ...s.scores.map((sc) => sc ?? '')].join(','));
    const csvContent = '\uFEFF' + [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '학생_설문결과_30명_점수표.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const filledCount = students.filter((s) => s.name.trim() !== '').length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 transition-all hover:shadow-md">
      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-sm">
            3
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
              <Table className="w-4 h-4 text-indigo-600" />
              설문 결과
            </h2>
            <p className="text-xs text-slate-500">
              1행에는 항목 명칭이 자동 연동되며, 1열에는 학생의 학번/이름, 2~6열에는 5개 항목의 응답 점수(가장 선호하는 것부터 1점, 2점, 3점, 4점, 5점)가 드롭다운 없이 직접 표시됩니다.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
            응답 학생: <strong className="text-indigo-600">{filledCount}</strong> / 30명
          </span>

          <button
            type="button"
            onClick={handleLoadSample}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-semibold transition cursor-pointer flex items-center gap-1 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" /> 예시 데이터 채우기
          </button>

          <button
            type="button"
            onClick={() => setShowPasteModal(true)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold transition cursor-pointer flex items-center gap-1 shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> 스프레드시트 붙여넣기
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition cursor-pointer flex items-center gap-1"
            title="CSV 파일로 다운로드"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" /> CSV 내보내기
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="text-xs px-2 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-medium transition cursor-pointer flex items-center gap-1"
            title="표의 모든 칸 빈칸으로 초기화"
          >
            <Trash2 className="w-3.5 h-3.5" /> 전체 빈칸으로 비우기
          </button>
        </div>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div
          className={`mb-3 p-2.5 rounded-xl text-xs flex items-center gap-2 font-medium ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Google Sheets Live Link Bar */}
      <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 shrink-0">
          <UploadCloud className="w-4 h-4 text-indigo-600" />
          구글 시트 웹 게시 CSV 연동:
        </div>
        <input
          type="text"
          value={csvUrl}
          onChange={(e) => setCsvUrl(e.target.value)}
          placeholder="예: https://docs.google.com/spreadsheets/d/e/.../pub?output=csv (희미하게 표시된 예시)"
          className="flex-1 w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 placeholder:text-slate-400/60 placeholder:font-normal focus:outline-none focus:border-indigo-500"
        />
        <button
          type="button"
          onClick={handleFetchCsv}
          disabled={isLoadingUrl}
          className="w-full md:w-auto text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isLoadingUrl ? '연동 중...' : '실시간 연동 실행'}
        </button>
      </div>

      {/* The 31 rows x 6 columns Table (All cells completely blank by default, NO dropdown) */}
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="max-h-[460px] overflow-y-auto overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            {/* Row 1 (Header: 1행) */}
            <thead className="bg-indigo-900 text-white sticky top-0 z-10 select-none">
              <tr>
                <th className="p-2.5 w-14 text-center font-bold border-r border-indigo-800">
                  순번
                </th>
                <th className="p-2.5 min-w-[140px] font-bold border-r border-indigo-800">
                  1열: 학번 또는 이름
                </th>
                {items.map((item, idx) => (
                  <th
                    key={idx}
                    className="p-2.5 text-center min-w-[100px] font-bold border-r border-indigo-800 last:border-r-0"
                  >
                    <div className="text-[10px] text-indigo-200 font-medium">
                      {idx + 2}열 (x_{idx + 1})
                    </div>
                    <div className="truncate font-semibold">
                      {item.trim() ? item : <span className="text-indigo-300 font-normal">항목 {idx + 1}</span>}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Rows 2 to 31 (30 Student rows - all cells empty blank, no dropdown) */}
            <tbody className="divide-y divide-slate-200 bg-white">
              {students.map((student, sIdx) => {
                const isEven = sIdx % 2 === 0;

                return (
                  <tr
                    key={student.id}
                    className={`${
                      isEven ? 'bg-white' : 'bg-slate-50/50'
                    } hover:bg-indigo-50/30 transition group`}
                  >
                    {/* Index */}
                    <td className="p-2 text-center text-slate-300 font-medium border-r border-slate-100 w-14 select-none">
                      {sIdx + 1}
                    </td>

                    {/* Column 1: Student Name / ID (Completely blank if no data) */}
                    <td className="p-1 border-r border-slate-200 min-w-[140px]">
                      <input
                        type="text"
                        value={student.name}
                        onChange={(e) => handleNameChange(sIdx, e.target.value)}
                        placeholder=""
                        className="w-full px-2 py-1.5 text-xs text-slate-800 font-medium bg-transparent border-0 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-400 rounded transition"
                      />
                    </td>

                    {/* Columns 2 to 6: 5 Items Scores (NO DROPDOWN - Displays response scores directly, blank if empty) */}
                    {student.scores.map((score, itemIdx) => (
                      <td
                        key={itemIdx}
                        className="p-1 text-center border-r border-slate-200 last:border-r-0 min-w-[100px]"
                      >
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={score !== null ? score : ''}
                          onChange={(e) => handleScoreChange(sIdx, itemIdx, e.target.value)}
                          placeholder=""
                          className={`w-full text-center py-1.5 px-1 text-sm font-black rounded transition focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 ${
                            score === 1
                              ? 'text-indigo-700 bg-indigo-50/70 font-black'
                              : score === 2
                              ? 'text-blue-700 bg-blue-50/50'
                              : score === 3
                              ? 'text-sky-700'
                              : score === 4
                              ? 'text-slate-600'
                              : score === 5
                              ? 'text-slate-400'
                              : 'text-slate-800 bg-transparent'
                          }`}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] text-slate-500">
        <span>※ 총 31행 6열: 모든 칸이 빈칸이며, 구글 설문 결과 연동 또는 복사 시 점수(1, 2, 3, 4, 5)가 드롭다운 없이 바로 나타납니다.</span>
        <span>선호도 점수 배점: 가장 선호하는 것부터 1점(최선호), 2점, 3점, 4점, 5점</span>
      </div>

      {/* Paste Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              구글 시트 / 엑셀 설문 결과 붙여넣기
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              구글 설문지와 연결된 스프레드시트나 엑셀에서 표 영역을 <strong>Ctrl+C (복사)</strong>한 후, 아래 입력창에{' '}
              <strong>Ctrl+V (붙여넣기)</strong>하세요.
            </p>

            <textarea
              rows={8}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="예시 형식:
10101 강민준	5	4	2	1	3
10102 고서연	4	5	1	3	2
(또는 타임스탬프가 포함된 구글 설문 결과 행 전체 복사 가능)"
              className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white resize-none"
            />

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowPasteModal(false);
                  setPasteText('');
                }}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleApplyPaste}
                disabled={!pasteText.trim()}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition shadow-sm"
              >
                표에 반영하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
