"use client";

import { useState } from "react";
import { NumberInput } from "@/components/ui";

type Gender = "male" | "female";

export function BodyFatCalculator() {
  const [gender, setGender] = useState<Gender>("male");
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(175);
  const [neck, setNeck] = useState<number>(38);
  const [waist, setWaist] = useState<number>(85);
  const [hip, setHip] = useState<number>(95);

  const calculateBodyFat = () => {
    if (weight <= 0 || height <= 0 || neck <= 0 || waist <= 0) return null;

    let bodyFat: number;

    // US Navy Method
    if (gender === "male") {
      bodyFat =
        495 /
          (1.0324 -
            0.19077 * Math.log10(waist - neck) +
            0.15456 * Math.log10(height)) -
        450;
    } else {
      if (hip <= 0) return null;
      bodyFat =
        495 /
          (1.29579 -
            0.35004 * Math.log10(waist + hip - neck) +
            0.221 * Math.log10(height)) -
        450;
    }

    bodyFat = Math.max(0, Math.min(60, bodyFat));

    // 체지방량 (kg)
    const fatMass = (weight * bodyFat) / 100;
    // 제지방량 (kg)
    const leanMass = weight - fatMass;

    // 평가
    let status: string;
    let statusColor: string;

    if (gender === "male") {
      if (bodyFat < 6) {
        status = "필수 지방";
        statusColor = "text-red-500";
      } else if (bodyFat < 14) {
        status = "운동선수";
        statusColor = "text-blue-500";
      } else if (bodyFat < 18) {
        status = "건강";
        statusColor = "text-green-500";
      } else if (bodyFat < 25) {
        status = "평균";
        statusColor = "text-yellow-500";
      } else {
        status = "비만";
        statusColor = "text-red-500";
      }
    } else {
      if (bodyFat < 14) {
        status = "필수 지방";
        statusColor = "text-red-500";
      } else if (bodyFat < 21) {
        status = "운동선수";
        statusColor = "text-blue-500";
      } else if (bodyFat < 25) {
        status = "건강";
        statusColor = "text-green-500";
      } else if (bodyFat < 32) {
        status = "평균";
        statusColor = "text-yellow-500";
      } else {
        status = "비만";
        statusColor = "text-red-500";
      }
    }

    return {
      bodyFat: bodyFat.toFixed(1),
      fatMass: fatMass.toFixed(1),
      leanMass: leanMass.toFixed(1),
      status,
      statusColor,
    };
  };

  const result = calculateBodyFat();

  return (
    <div id="body-fat" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">체지방률 계산기</h2>
          <p className="text-xs text-gray-500">US Navy Method</p>
        </div>
        <span className="text-2xl">💪</span>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setGender("male")}
            className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              gender === "male"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            남성
          </button>
          <button
            onClick={() => setGender("female")}
            className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              gender === "female"
                ? "bg-pink-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            여성
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">키</label>
            <NumberInput
              value={height}
              onChange={setHeight}
              min={100}
              max={250}
              step={1}
              format="none"
              suffix="cm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">체중</label>
            <NumberInput
              value={weight}
              onChange={setWeight}
              min={20}
              max={200}
              step={1}
              format="none"
              suffix="kg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">목둘레</label>
            <NumberInput
              value={neck}
              onChange={setNeck}
              min={20}
              max={60}
              step={0.5}
              format="none"
              suffix="cm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">허리둘레</label>
            <NumberInput
              value={waist}
              onChange={setWaist}
              min={40}
              max={200}
              step={0.5}
              format="none"
              suffix="cm"
            />
          </div>
        </div>

        {gender === "female" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">엉덩이둘레</label>
            <NumberInput
              value={hip}
              onChange={setHip}
              min={50}
              max={200}
              step={0.5}
              format="none"
              suffix="cm"
            />
          </div>
        )}
      </div>

      {result && (
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-5 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/80 text-sm mb-1">체지방률</p>
              <p className="text-4xl font-bold">
                {result.bodyFat}
                <span className="text-lg ml-1 font-normal opacity-80">%</span>
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium bg-white ${result.statusColor}`}>
              {result.status}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-white/70 text-xs">체지방량</p>
              <p className="font-medium">{result.fatMass} kg</p>
            </div>
            <div>
              <p className="text-white/70 text-xs">제지방량</p>
              <p className="font-medium">{result.leanMass} kg</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">계산 공식 (US Navy Method)</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 남성: 495/(1.0324-0.19077×log(허리-목)+0.15456×log(키))-450</p>
          <p>• 여성: 495/(1.29579-0.35004×log(허리+엉덩이-목)+0.221×log(키))-450</p>
          <p>• 체지방량(kg) = 체중 × 체지방률(%)</p>
        </div>
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
          <p className="font-medium mb-1">체지방률 기준 ({gender === "male" ? "남성" : "여성"})</p>
          {gender === "male" ? (
            <p>필수 2-5% | 운동선수 6-13% | 건강 14-17% | 평균 18-24% | 비만 25%+</p>
          ) : (
            <p>필수 10-13% | 운동선수 14-20% | 건강 21-24% | 평균 25-31% | 비만 32%+</p>
          )}
        </div>
      </div>
    </div>
  );
}
