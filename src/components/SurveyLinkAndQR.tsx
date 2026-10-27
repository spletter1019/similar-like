import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Link as LinkIcon,
  ExternalLink,
  Copy,
  Check,
  Maximize2,
  X,
  Upload,
  Sparkles,
  Download,
  CheckCircle2,
} from 'lucide-react';

interface SurveyLinkAndQRProps {
  surveyUrl: string;
  onSurveyUrlChange: (url: string) => void;
  customQrImage: string | null;
  onCustomQrImageChange: (image: string | null) => void;
  items: [string, string, string, string, string];
}

export const SurveyLinkAndQR: React.FC<SurveyLinkAndQRProps> = ({
  surveyUrl,
  onSurveyUrlChange,
  customQrImage,
  onCustomQrImageChange,
}) => {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Generate QR code data URL whenever surveyUrl changes
  useEffect(() => {
    const trimmed = surveyUrl.trim();
    if (!trimmed) {
      setQrDataUrl(null);
      return;
    }

    let isMounted = true;
    QRCode.toDataURL(trimmed, {
      width: 360,
      margin: 2,
      color: {
        dark: '#1e1b4b',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((error) => {
        console.error('QR code generation error:', error);
      });

    return () => {
      isMounted = false;
    };
  }, [surveyUrl]);

  const handleCopy = () => {
    if (!surveyUrl) return;
    navigator.clipboard.writeText(surveyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    const activeImage = customQrImage || qrDataUrl;
    if (!activeImage) return;
    const link = document.createElement('a');
    link.href = activeImage;
    link.download = '구글설문_QR코드.png';
    link.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onCustomQrImageChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const setSampleGoogleForm = () => {
    onSurveyUrlChange('https://forms.gle/wonmookHighMathAi2026');
    onCustomQrImageChange(null);
  };

  const activeQrSrc = customQrImage || qrDataUrl;
  const hasQrContent = Boolean(activeQrSrc);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 transition-all hover:shadow-md">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-sm">
            2
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-indigo-600" />
              학생 응답용 구글 설문 링크 또는 QR코드 입력 창
            </h2>
            <p className="text-xs text-slate-500">
              구글 설문지 링크를 입력하면 바로 아래 창에 학생 접속용 QR 코드가 자동으로 생성됩니다.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={setSampleGoogleForm}
          className="text-xs px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium transition cursor-pointer flex items-center gap-1 border border-indigo-200"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> 예시 설문 링크 넣기
        </button>
      </div>

      {/* QR 코드 및 링크 통합 창 */}
      <div className="rounded-2xl border-2 border-indigo-100 bg-gradient-to-b from-indigo-50/40 to-slate-50 p-4 transition-all">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-indigo-100/70">
            <div className="flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800">
                자동 생성 QR 코드 창
              </span>
              {hasQrContent && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 자동 생성 완료
                </span>
              )}
            </div>

            {/* Custom QR image upload alternative */}
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] px-2 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-medium flex items-center gap-1 transition cursor-pointer"
                title="기존 보유한 QR 코드 이미지 파일이 있는 경우 업로드"
              >
                <Upload className="w-3 h-3 text-slate-500" /> 이미지 파일 등록
              </button>
              {customQrImage && (
                <button
                  type="button"
                  onClick={() => onCustomQrImageChange(null)}
                  className="text-[11px] px-2 py-1 text-red-500 hover:bg-red-50 rounded transition"
                >
                  업로드 취소
                </button>
              )}
            </div>
          </div>

          {/* QR Code Content Window (Immediately under the input) */}
          {hasQrContent ? (
            <div className="flex flex-col sm:flex-row items-center gap-5 p-2 bg-white rounded-xl border border-indigo-100 shadow-2xs">
              {/* QR Image Box */}
              <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 shrink-0 flex items-center justify-center">
                {activeQrSrc ? (
                  <img
                    src={activeQrSrc}
                    alt="학생 설문용 QR 코드"
                    className="w-36 h-36 object-contain rounded"
                  />
                ) : (
                  <div className="w-36 h-36 flex items-center justify-center text-xs text-slate-400">
                    생성 중...
                  </div>
                )}
              </div>

              {/* QR Details & Action Buttons */}
              <div className="flex-1 w-full space-y-2.5 text-left">
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center justify-between mb-1">
                    <span>학생 설문 참여 링크 (URL)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={surveyUrl}
                      onChange={(e) => onSurveyUrlChange(e.target.value)}
                      placeholder="구글 설문지 링크를 입력하세요"
                      className="flex-1 p-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-indigo-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                    />
                    {surveyUrl && (
                      <a
                        href={surveyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1 text-xs font-semibold shrink-0"
                        title="새 창에서 설문지 열기"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">열기</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {surveyUrl && (
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? '링크 복사 완료' : 'QR 링크 복사'}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsFullscreen(true)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold border border-indigo-200 flex items-center gap-1.5 transition cursor-pointer"
                    title="교실 빔프로젝터에 크게 띄우기"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    프로젝터 크게보기
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadQr}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-1 transition cursor-pointer"
                    title="QR 이미지 PNG 파일로 저장"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    QR 다운로드
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 pt-0.5">
                  ※ 교실 학생들이 스마트폰 기본 카메라 앱으로 비추면 구글 설문지에 즉시 접속하여 점수를 제출할 수 있습니다.
                </p>
              </div>
            </div>
          ) : (
            /* Empty State Window */
            <div className="py-7 px-4 text-center flex flex-col items-center justify-center bg-white/70 border-2 border-dashed border-slate-200 rounded-xl">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-400 flex items-center justify-center mb-2.5">
                <QrCode className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-700 mb-1">
                구글 설문지 링크를 입력하면 QR 코드가 실시간으로 자동 생성됩니다
              </h4>
              <p className="text-[11px] text-slate-400 max-w-sm mb-3">
                구글 설문지 URL을 입력하거나 예시 링크를 넣어보세요.
              </p>
              <div className="w-full max-w-md flex items-center gap-2">
                <input
                  type="url"
                  value={surveyUrl}
                  onChange={(e) => onSurveyUrlChange(e.target.value)}
                  placeholder="예: https://forms.gle/wonmookHighMathAi2026"
                  className="flex-1 text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 shadow-2xs placeholder:text-slate-400/60"
                />
                <button
                  type="button"
                  onClick={setSampleGoogleForm}
                  className="text-xs px-3 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-semibold transition shrink-0 shadow-xs cursor-pointer"
                >
                  예시 넣기
                </button>
              </div>
            </div>
          )}
        </div>

      {/* Classroom Projector Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative text-center flex flex-col items-center">
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full mb-3">
              교실 수업 화면 (스마트폰 카메라로 스캔하세요)
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              학생 취향 선호도 설문 참여
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              카메라 앱으로 아래 QR코드를 비추면 설문 페이지로 즉시 연결됩니다.
            </p>

            <div className="p-4 bg-white rounded-2xl shadow-lg border-2 border-indigo-100 mb-6">
              {activeQrSrc ? (
                <img
                  src={activeQrSrc}
                  alt="설문지 QR 코드"
                  className="w-72 h-72 object-contain"
                />
              ) : (
                <div className="w-72 h-72 flex items-center justify-center text-sm text-slate-400">
                  생성 중...
                </div>
              )}
            </div>

            <div className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 break-all mb-4">
              {surveyUrl || '링크 없음'}
            </div>

            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
