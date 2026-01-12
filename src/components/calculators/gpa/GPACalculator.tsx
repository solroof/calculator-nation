"use client";

import { useState } from "react";

type GradeSystem = "4.5" | "4.3" | "4.0";

interface Subject {
  id: string;
  name: string;
  credits: string;
  grade: string;
}

const gradePoints: Record<GradeSystem, Record<string, number>> = {
  "4.5": {
    "A+": 4.5, "A0": 4.0, "B+": 3.5, "B0": 3.0,
    "C+": 2.5, "C0": 2.0, "D+": 1.5, "D0": 1.0, "F": 0,
  },
  "4.3": {
    "A+": 4.3, "A0": 4.0, "A-": 3.7,
    "B+": 3.3, "B0": 3.0, "B-": 2.7,
    "C+": 2.3, "C0": 2.0, "C-": 1.7,
    "D+": 1.3, "D0": 1.0, "D-": 0.7, "F": 0,
  },
  "4.0": {
    "A": 4.0, "B": 3.0, "C": 2.0, "D": 1.0, "F": 0,
  },
};

export function GPACalculator() {
  const [gradeSystem, setGradeSystem] = useState<GradeSystem>("4.5");
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "1", name: "", credits: "3", grade: "A+" },
    { id: "2", name: "", credits: "3", grade: "A0" },
    { id: "3", name: "", credits: "3", grade: "B+" },
  ]);

  const addSubject = () => {
    setSubjects([
      ...subjects,
      { id: Date.now().toString(), name: "", credits: "3", grade: "A+" },
    ]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((s) => s.id !== id));
    }
  };

  const updateSubject = (id: string, field: keyof Subject, value: string) => {
    setSubjects(
      subjects.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const calculate = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    for (const subject of subjects) {
      const credits = parseFloat(subject.credits);
      const points = gradePoints[gradeSystem][subject.grade];

      if (!isNaN(credits) && points !== undefined) {
        totalCredits += credits;
        totalPoints += credits * points;
      }
    }

    if (totalCredits === 0) return null;

    const gpa = totalPoints / totalCredits;
    const maxGpa = parseFloat(gradeSystem);
    const percentage = (gpa / maxGpa) * 100;

    return {
      gpa: gpa.toFixed(2),
      totalCredits,
      totalPoints: totalPoints.toFixed(1),
      percentage: percentage.toFixed(1),
      maxGpa: gradeSystem,
    };
  };

  const result = calculate();
  const grades = Object.keys(gradePoints[gradeSystem]);

  return (
    <div id="gpa" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">학점 계산기</h2>
          <p className="text-xs text-gray-500">GPA 계산</p>
        </div>
        <span className="text-2xl">📚</span>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">학점 체계</label>
        <div className="grid grid-cols-3 gap-2">
          {(["4.5", "4.3", "4.0"] as GradeSystem[]).map((system) => (
            <button
              key={system}
              onClick={() => setGradeSystem(system)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                gradeSystem === system
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {system} 만점
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 space-y-2">
        {subjects.map((subject, idx) => (
          <div key={subject.id} className="flex gap-2 items-center">
            <span className="text-sm text-gray-400 w-6">{idx + 1}</span>
            <input
              type="number"
              value={subject.credits}
              onChange={(e) => updateSubject(subject.id, "credits", e.target.value)}
              className="w-16 px-2 py-2 border border-gray-200 rounded-lg text-center text-sm"
              placeholder="학점"
              min="1"
              max="6"
            />
            <select
              value={subject.grade}
              onChange={(e) => updateSubject(subject.id, "grade", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              {grades.map((g) => (
                <option key={g} value={g}>
                  {g} ({gradePoints[gradeSystem][g]})
                </option>
              ))}
            </select>
            <button
              onClick={() => removeSubject(subject.id)}
              className="p-2 text-red-400 hover:text-red-600"
              disabled={subjects.length <= 1}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addSubject}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-indigo-400 hover:text-indigo-500 transition-colors mb-4"
      >
        + 과목 추가
      </button>

      {result && (
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white">
          <p className="text-white/80 text-sm mb-1">평균 학점</p>
          <p className="text-4xl font-bold">
            {result.gpa}
            <span className="text-lg ml-1 font-normal opacity-80">/ {result.maxGpa}</span>
          </p>
          <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${result.percentage}%` }}
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-white/70 text-xs">총 이수학점</p>
              <p className="font-medium">{result.totalCredits}학점</p>
            </div>
            <div>
              <p className="text-white/70 text-xs">백분율</p>
              <p className="font-medium">{result.percentage}%</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• GPA = Σ(과목별 학점 × 성적점수) ÷ 총 이수학점</p>
          <p>• 백분율 = (GPA ÷ 만점) × 100</p>
        </div>
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
          <p className="font-medium mb-1">학점 체계</p>
          <p>• 4.5만점: A+ 4.5, A0 4.0, B+ 3.5 ...</p>
          <p>• 4.3만점: A+ 4.3, A0 4.0, A- 3.7 ...</p>
          <p>• 4.0만점: A 4.0, B 3.0, C 2.0 ...</p>
        </div>
      </div>
    </div>
  );
}
