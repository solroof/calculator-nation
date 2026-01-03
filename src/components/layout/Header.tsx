"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 계산기 카테고리 및 목록
const calculatorCategories = [
  {
    name: "급여/고용",
    icon: "💼",
    items: [
      { name: "연봉 실수령액", href: "/salary", icon: "💰" },
      { name: "퇴직금 계산기", href: "/severance", icon: "💼" },
      { name: "실업급여 계산기", href: "/unemployment", icon: "📋" },
      { name: "육아휴직 급여", href: "/parental-leave", icon: "👶" },
      { name: "국민연금 계산기", href: "/pension", icon: "🏦" },
      { name: "학점 계산기", href: "/gpa", icon: "📚" },
    ],
  },
  {
    name: "부동산/세금",
    icon: "🏠",
    items: [
      { name: "부동산 취득세", href: "/acquisition-tax", icon: "🏠" },
      { name: "양도소득세", href: "/capital-gains-tax", icon: "📈" },
      { name: "증여세 계산기", href: "/gift-tax", icon: "🎁" },
      { name: "종합소득세", href: "/income-tax", icon: "📋" },
      { name: "전월세 전환", href: "/rent-conversion", icon: "🔄" },
      { name: "평수 변환", href: "/pyeong", icon: "📏" },
      { name: "중개수수료", href: "/brokerage-fee", icon: "🤝" },
    ],
  },
  {
    name: "금융/투자",
    icon: "💵",
    items: [
      { name: "대출 이자", href: "/loan", icon: "🏦" },
      { name: "적금/예금 이자", href: "/savings", icon: "💵" },
      { name: "복리 계산기", href: "/compound-interest", icon: "📊" },
      { name: "부가세(VAT)", href: "/vat", icon: "🧾" },
      { name: "할인율 계산기", href: "/discount", icon: "🏷️" },
      { name: "퍼센트 계산기", href: "/percent", icon: "％" },
      { name: "단가 비교", href: "/unit-price", icon: "🛒" },
      { name: "환율 계산기", href: "/currency", icon: "💱" },
      { name: "주식 수익률", href: "/stock-return", icon: "📈" },
      { name: "신용카드 이자", href: "/credit-card", icon: "💳" },
    ],
  },
  {
    name: "생활/요금",
    icon: "🏠",
    items: [
      { name: "전기요금 계산기", href: "/electricity", icon: "⚡" },
      { name: "가스요금 계산기", href: "/gas-bill", icon: "🔥" },
      { name: "수도요금 계산기", href: "/water-bill", icon: "🚿" },
      { name: "택배비 계산기", href: "/shipping", icon: "📦" },
      { name: "팁/더치페이", href: "/tip", icon: "💳" },
    ],
  },
  {
    name: "건강/다이어트",
    icon: "❤️",
    items: [
      { name: "BMI 계산기", href: "/bmi", icon: "⚖️" },
      { name: "BMR 기초대사량", href: "/bmr", icon: "🔥" },
      { name: "칼로리 계산기", href: "/calorie", icon: "🍎" },
      { name: "체지방률 계산기", href: "/body-fat", icon: "💪" },
      { name: "물 섭취량", href: "/water-intake", icon: "💧" },
      { name: "음주 분해시간", href: "/alcohol", icon: "🍺" },
      { name: "수면 사이클", href: "/sleep", icon: "😴" },
    ],
  },
  {
    name: "날짜/시간",
    icon: "📅",
    items: [
      { name: "만 나이 계산기", href: "/age", icon: "🎂" },
      { name: "D-Day 계산기", href: "/dday", icon: "📅" },
      { name: "날짜 계산기", href: "/date-calc", icon: "🗓️" },
      { name: "시간 계산기", href: "/time-calc", icon: "⏰" },
      { name: "임신 주수", href: "/pregnancy", icon: "🤰" },
      { name: "별자리/띠", href: "/zodiac", icon: "⭐" },
    ],
  },
  {
    name: "단위 변환",
    icon: "🔄",
    items: [
      { name: "길이 변환", href: "/length", icon: "📏" },
      { name: "넓이 변환", href: "/area", icon: "⬜" },
      { name: "무게 변환", href: "/weight", icon: "⚖️" },
      { name: "온도 변환", href: "/temperature", icon: "🌡️" },
      { name: "속도 변환", href: "/speed", icon: "🚗" },
      { name: "압력 변환", href: "/pressure", icon: "🎈" },
      { name: "에너지 변환", href: "/energy", icon: "⚡" },
      { name: "각도 변환", href: "/angle", icon: "📐" },
      { name: "부피 변환", href: "/volume", icon: "🫗" },
      { name: "힘 변환", href: "/force", icon: "💪" },
      { name: "시간대 변환", href: "/timezone", icon: "🌍" },
      { name: "데이터 용량", href: "/data-size", icon: "💾" },
      { name: "진법 변환", href: "/base-converter", icon: "🔢" },
      { name: "색상 변환", href: "/color", icon: "🎨" },
    ],
  },
  {
    name: "자동차",
    icon: "🚗",
    items: [
      { name: "자동차세 계산기", href: "/car-tax", icon: "🚙" },
      { name: "연비 계산기", href: "/fuel-economy", icon: "⛽" },
    ],
  },
  {
    name: "도형/수학",
    icon: "📐",
    items: [
      { name: "삼각형 계산기", href: "/triangle", icon: "📐" },
      { name: "형상 분할 계산기", href: "/shape-divider", icon: "📊" },
      { name: "원 계산기", href: "/circle", icon: "⭕" },
      { name: "사각형 계산기", href: "/rectangle", icon: "⬜" },
      { name: "구 계산기", href: "/sphere", icon: "🔮" },
      { name: "원기둥 계산기", href: "/cylinder", icon: "🥫" },
      { name: "원뿔 계산기", href: "/cone", icon: "🍦" },
      { name: "최대공약수/최소공배수", href: "/gcd-lcm", icon: "🔢" },
      { name: "소수 계산기", href: "/prime", icon: "🔢" },
      { name: "순열/조합", href: "/permutation", icon: "🎯" },
      { name: "통계 계산기", href: "/statistics", icon: "📊" },
      { name: "피타고라스", href: "/pythagorean", icon: "📐" },
      { name: "이차방정식", href: "/quadratic", icon: "📝" },
      { name: "비율 계산기", href: "/ratio", icon: "⚖️" },
      { name: "로그 계산기", href: "/logarithm", icon: "📈" },
    ],
  },
  {
    name: "텍스트/유틸",
    icon: "📝",
    items: [
      { name: "글자수 세기", href: "/character-count", icon: "📝" },
      { name: "랜덤 숫자", href: "/random", icon: "🎲" },
      { name: "비밀번호 생성", href: "/password", icon: "🔐" },
      { name: "Base64 인코딩", href: "/base64", icon: "🔐" },
      { name: "로마 숫자", href: "/roman", icon: "🏛️" },
      { name: "신발 사이즈", href: "/shoe-size", icon: "👟" },
      { name: "사진 비율", href: "/aspect-ratio", icon: "🖼️" },
    ],
  },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // ESC 키로 메뉴 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    if (isMenuOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, closeMenu]);

  // 현재 페이지 타이틀 가져오기
  const getCurrentTitle = () => {
    for (const category of calculatorCategories) {
      const item = category.items.find((item) => item.href === pathname);
      if (item) return item.name;
    }
    return "계산기나라";
  };

  const isHome = pathname === "/";

  return (
    <>
      {/* 고정 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* 햄버거 메뉴 버튼 */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors"
            aria-label="메뉴 열기"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* 사이트 로고 / 페이지 타이틀 */}
          <Link href="/" className="text-lg font-bold">
            {isHome ? "계산기나라" : getCurrentTitle()}
          </Link>

          {/* 홈 버튼 (서브 페이지에서만 표시) */}
          {!isHome ? (
            <Link
              href="/"
              className="p-2 -mr-2 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors"
              aria-label="홈으로"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
          ) : (
            <div className="w-10"></div>
          )}
        </div>
      </header>

      {/* 오버레이 */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={closeMenu}
        />
      )}

      {/* 사이드 메뉴 */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-xl ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* 메뉴 헤더 */}
        <div className="h-14 px-4 flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <span className="font-bold">계산기나라</span>
          <button
            onClick={closeMenu}
            className="p-2 rounded-lg hover:bg-white/10"
            aria-label="메뉴 닫기"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 홈 링크 */}
        <Link
          href="/"
          onClick={closeMenu}
          className={`flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-100 ${
            pathname === "/"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <span className="text-lg">🏠</span>
          <span className="font-medium">홈</span>
        </Link>

        {/* 메뉴 내용 */}
        <nav className="p-4 overflow-y-auto h-[calc(100%-7rem)]">
          {calculatorCategories.map((category) => (
            <div key={category.name} className="mb-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {category.name}
              </h3>
              <ul className="space-y-1">
                {category.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                          isActive
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm">{item.name}</span>
                        {isActive && (
                          <svg className="w-4 h-4 ml-auto text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
