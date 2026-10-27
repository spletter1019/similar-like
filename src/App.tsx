import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { ItemNameEditor } from './components/ItemNameEditor';
import { SurveyLinkAndQR } from './components/SurveyLinkAndQR';
import { StudentDataTable } from './components/StudentDataTable';
import { NewStudentInputTable } from './components/NewStudentInputTable';
import { SimilarityResults } from './components/SimilarityResults';
import { MathGuideModal } from './components/MathGuideModal';
import { EMPTY_ITEMS, DEFAULT_ITEMS_PLACEHOLDER, SAMPLE_STUDENTS, createEmptyStudents } from './utils/sampleData';
import { Student, NewStudent } from './types';
import { computeAllSimilarities } from './utils/math';

export default function App() {
  // (1) 5 items (starts empty with faint placeholders)
  const [items, setItems] = useState<[string, string, string, string, string]>([
    ...EMPTY_ITEMS,
  ]);

  // (2) Google survey URL and QR (starts empty with faint placeholder)
  const [surveyUrl, setSurveyUrl] = useState<string>('');
  const [customQrImage, setCustomQrImage] = useState<string | null>(null);

  // (3) 30 students data for the 31-row x 6-col table (starts completely blank)
  const [students, setStudents] = useState<Student[]>(createEmptyStudents(30));

  // (4) New student 1 person for the 2-row x 6-col table (starts empty with faint placeholders)
  const [newStudent, setNewStudent] = useState<NewStudent>({
    name: '',
    scores: [null, null, null, null, null],
  });

  // 6th dimension vector toggle
  const [use6thDim, setUse6thDim] = useState<boolean>(false);

  // Guide modal state
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // (5), (6), (7), (8) Compute similarities
  const similarityResults = useMemo(() => {
    return computeAllSimilarities(students, newStudent, use6thDim);
  }, [students, newStudent, use6thDim]);

  // Reset all to completely empty with faint placeholders
  const handleResetAll = () => {
    setItems([...EMPTY_ITEMS]);
    setSurveyUrl('');
    setCustomQrImage(null);
    setStudents(createEmptyStudents(30));
    setNewStudent({ name: '', scores: [null, null, null, null, null] });
  };

  // Load full demo
  const handleLoadFullDemo = () => {
    setItems([...DEFAULT_ITEMS_PLACEHOLDER]);
    setSurveyUrl('https://forms.gle/wonmookHighMathAi2026');
    setCustomQrImage(null);
    setStudents([...SAMPLE_STUDENTS]);
    setNewStudent({
      name: '10131 전학생 (나신입)',
      scores: [1, 2, 4, 5, 3],
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        onLoadFullDemo={handleLoadFullDemo}
        onResetAll={handleResetAll}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Intro banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase bg-amber-400 text-indigo-950 px-2.5 py-0.5 rounded-full mb-2 inline-block">
              고등학교 인공지능 수학 교과 연계
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              취향 유사도 분석
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-3xl leading-relaxed">
              사전에 입력한 5가지 항목에 대해 최대 30명의 학생이 가장 선호하는 항목부터 차례대로 부여한 점수(1점, 2점, 3점, 4점, 5점)를 벡터화하고,
              새로운 학생 한 명의 취향 벡터와 비교하여 <strong>유클리드 유사도</strong>와 <strong>코사인 유사도</strong>가 가장 높은 최적의 학생을 찾아냅니다.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/20 text-xs">
            <div className="text-right">
              <div className="text-indigo-200 text-[11px]">현재 등록 학생 수</div>
              <div className="text-lg font-black text-amber-300">
                {students.filter((s) => s.name.trim() !== '').length} / 30명
              </div>
            </div>
          </div>
        </div>

        {/* (1) 항목 명칭 5가지 입력할 수 있는 창 */}
        <section id="section-items">
          <ItemNameEditor items={items} onChange={setItems} />
        </section>

        {/* (2) 학생이 응답할 구글 설문 링크 또는 QR코드 입력할 수 있는 창 */}
        <section id="section-qr">
          <SurveyLinkAndQR
            surveyUrl={surveyUrl}
            onSurveyUrlChange={setSurveyUrl}
            customQrImage={customQrImage}
            onCustomQrImageChange={setCustomQrImage}
            items={items}
          />
        </section>

        {/* (3) 학생이 응답한 구글 설문 결과가 그대로 연동되는 31행 6열의 표 */}
        <section id="section-table">
          <StudentDataTable
            students={students}
            onStudentsChange={setStudents}
            items={items}
          />
        </section>

        {/* (4) 새로운 학생 한 명이 5가지 항목에 점수를 입력할 수 있는 2행 6열의 표 형식의 창 */}
        <section id="section-new-student">
          <NewStudentInputTable
            newStudent={newStudent}
            onNewStudentChange={setNewStudent}
            items={items}
          />
        </section>

        {/* (5, 6, 7, 8) 유클리드 유사도와 코사인 유사도 탭, 최댓값 음영 처리 표, 가장 유사한 학생 문구 출력 */}
        <section id="section-results">
          <SimilarityResults
            students={students}
            newStudent={newStudent}
            results={similarityResults}
            items={items}
            use6thDim={use6thDim}
            onToggle6thDim={setUse6thDim}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-8 py-6 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">
          인공지능 수학(AI Mathematics) 취향 벡터 유사도 탐구 소프트웨어
        </p>
        <p className="mt-1 text-slate-400">
          구글 설문지(Google Forms) 연동 • 31행 6열 설문 결과 표 • 2행 6열 신규 학생 표 • 유클리드 및 코사인 유사도 계산
        </p>
      </footer>

      {/* Guide Modal */}
      <MathGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
