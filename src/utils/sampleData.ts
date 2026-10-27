import { Student, Preset } from '../types';

export const EMPTY_ITEMS: [string, string, string, string, string] = ['', '', '', '', ''];

export const DEFAULT_ITEMS_PLACEHOLDER: [string, string, string, string, string] = [
  '음악 감상',
  '영화/드라마',
  '운동/스포츠',
  '독서/글쓰기',
  '게임/e스포츠',
];

export const PRESETS: Preset[] = [
  {
    title: '취미 및 여가 활동',
    items: ['음악 감상', '영화/드라마', '운동/스포츠', '독서/글쓰기', '게임/e스포츠'],
  },
  {
    title: '선호 교과목',
    items: ['국어', '수학', '영어', '과학 탐구', '사회 탐구'],
  },
  {
    title: '진로 및 전공 희망',
    items: ['IT/인공지능', '예술/디자인', '자연/생명과학', '인문/어문', '경영/경제'],
  },
  {
    title: '선호 음식 카테고리',
    items: ['한식', '양식/패스트푸드', '중식', '일식/초밥', '디저트/카페'],
  },
];

// Sample 30 students (ranking scores: 1점=최선호/1순위 ~ 5점=5순위)
export const SAMPLE_STUDENTS: Student[] = [
  { id: 1, name: '10101 강민준', scores: [1, 2, 4, 5, 3] },
  { id: 2, name: '10102 고서연', scores: [2, 1, 5, 3, 4] },
  { id: 3, name: '10103 김도현', scores: [3, 4, 1, 5, 2] },
  { id: 4, name: '10104 김민서', scores: [1, 3, 5, 2, 4] },
  { id: 5, name: '10105 김서진', scores: [4, 2, 3, 5, 1] },
  { id: 6, name: '10106 김예준', scores: [5, 4, 1, 5, 2] },
  { id: 7, name: '10107 김하은', scores: [2, 1, 4, 3, 5] },
  { id: 8, name: '10108 노현우', scores: [3, 5, 2, 4, 1] },
  { id: 9, name: '10109 문지우', scores: [1, 2, 5, 1, 4] },
  { id: 10, name: '10110 박건우', scores: [4, 3, 2, 5, 1] },
  { id: 11, name: '10111 박서아', scores: [2, 2, 4, 1, 5] },
  { id: 12, name: '10112 박시우', scores: [5, 3, 1, 5, 2] },
  { id: 13, name: '10113 박유진', scores: [1, 1, 3, 4, 2] },
  { id: 14, name: '10114 배준혁', scores: [5, 4, 1, 5, 2] },
  { id: 15, name: '10115 송민재', scores: [3, 2, 3, 4, 1] },
  { id: 16, name: '10116 신지민', scores: [2, 3, 5, 2, 4] },
  { id: 17, name: '10117 안채원', scores: [1, 2, 4, 3, 5] },
  { id: 18, name: '10118 오지호', scores: [4, 5, 1, 5, 2] },
  { id: 19, name: '10119 유승우', scores: [3, 1, 4, 5, 2] },
  { id: 20, name: '10120 윤다은', scores: [2, 4, 5, 1, 3] },
  { id: 21, name: '10121 이도윤', scores: [5, 3, 2, 4, 1] },
  { id: 22, name: '10122 이동건', scores: [1, 4, 2, 5, 3] },
  { id: 23, name: '10123 이서현', scores: [2, 1, 3, 4, 5] },
  { id: 24, name: '10124 이준우', scores: [4, 2, 1, 5, 3] },
  { id: 25, name: '10125 이채은', scores: [1, 2, 5, 2, 4] },
  { id: 26, name: '10126 임태양', scores: [3, 5, 1, 4, 2] },
  { id: 27, name: '10127 정소율', scores: [2, 1, 4, 3, 5] },
  { id: 28, name: '10128 조우진', scores: [5, 4, 2, 5, 1] },
  { id: 29, name: '10129 최하린', scores: [1, 3, 4, 2, 5] },
  { id: 30, name: '10130 한지후', scores: [4, 2, 3, 5, 1] },
];

export function createEmptyStudents(count = 30): Student[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: '',
    scores: [null, null, null, null, null],
  }));
}
