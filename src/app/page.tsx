import Link from "next/link";

// 계산기 카테고리 및 목록
const calculatorCategories = [
  {
    name: "급여/고용",
    color: "blue",
    icon: "💼",
    items: [
      { name: "연봉 실수령액", href: "/salary", icon: "💰", description: "4대보험+소득세 공제", hot: true },
      { name: "퇴직금 계산기", href: "/severance", icon: "💼", description: "퇴직금 예상 금액" },
      { name: "실업급여 계산기", href: "/unemployment", icon: "📋", description: "구직급여 예상액" },
      { name: "육아휴직 급여", href: "/parental-leave", icon: "👶", description: "육아휴직 급여" },
      { name: "국민연금 계산기", href: "/pension", icon: "🏦", description: "연금 예상액" },
      { name: "학점 계산기", href: "/gpa", icon: "📚", description: "GPA 계산", isNew: true },
    ],
  },
  {
    name: "부동산/세금",
    color: "emerald",
    icon: "🏠",
    items: [
      { name: "부동산 취득세", href: "/acquisition-tax", icon: "🏠", description: "부동산 취득세율" },
      { name: "양도소득세", href: "/capital-gains-tax", icon: "📈", description: "부동산 양도세" },
      { name: "증여세 계산기", href: "/gift-tax", icon: "🎁", description: "증여세 예상액", isNew: true },
      { name: "종합소득세", href: "/income-tax", icon: "📋", description: "소득세 계산", isNew: true },
      { name: "전월세 전환", href: "/rent-conversion", icon: "🔄", description: "전세↔월세 변환" },
      { name: "평수 변환", href: "/pyeong", icon: "📏", description: "평↔제곱미터" },
      { name: "중개수수료", href: "/brokerage-fee", icon: "🤝", description: "부동산 중개비" },
    ],
  },
  {
    name: "금융/투자",
    color: "violet",
    icon: "💵",
    items: [
      { name: "대출 이자", href: "/loan", icon: "🏦", description: "대출 상환액 계산", hot: true },
      { name: "적금/예금 이자", href: "/savings", icon: "💵", description: "만기 수령액 계산" },
      { name: "복리 계산기", href: "/compound-interest", icon: "📊", description: "복리 이자 계산" },
      { name: "부가세(VAT)", href: "/vat", icon: "🧾", description: "부가가치세 계산" },
      { name: "할인율 계산기", href: "/discount", icon: "🏷️", description: "할인가/할인율" },
      { name: "퍼센트 계산기", href: "/percent", icon: "％", description: "퍼센트 계산" },
      { name: "단가 비교", href: "/unit-price", icon: "🛒", description: "가성비 비교" },
      { name: "환율 계산기", href: "/currency", icon: "💱", description: "통화 환전 계산", isNew: true },
      { name: "주식 수익률", href: "/stock-return", icon: "📈", description: "매매 수익 계산", isNew: true },
      { name: "신용카드 이자", href: "/credit-card", icon: "💳", description: "할부/리볼빙", isNew: true },
    ],
  },
  {
    name: "생활/요금",
    color: "orange",
    icon: "🏠",
    items: [
      { name: "전기요금 계산기", href: "/electricity", icon: "⚡", description: "누진제 요금" },
      { name: "가스요금 계산기", href: "/gas-bill", icon: "🔥", description: "도시가스 요금", isNew: true },
      { name: "수도요금 계산기", href: "/water-bill", icon: "🚿", description: "누진제 수도세", isNew: true },
      { name: "택배비 계산기", href: "/shipping", icon: "📦", description: "택배사별 비교", isNew: true },
      { name: "팁/더치페이", href: "/tip", icon: "💳", description: "N빵 계산" },
    ],
  },
  {
    name: "건강/다이어트",
    color: "rose",
    icon: "❤️",
    items: [
      { name: "BMI 계산기", href: "/bmi", icon: "⚖️", description: "체질량지수 계산" },
      { name: "BMR 기초대사량", href: "/bmr", icon: "🔥", description: "일일 칼로리 계산" },
      { name: "칼로리 계산기", href: "/calorie", icon: "🍎", description: "음식 칼로리" },
      { name: "체지방률 계산기", href: "/body-fat", icon: "💪", description: "체지방 비율" },
      { name: "물 섭취량", href: "/water-intake", icon: "💧", description: "하루 물 섭취량" },
      { name: "음주 분해시간", href: "/alcohol", icon: "🍺", description: "혈중알코올농도", isNew: true },
      { name: "수면 사이클", href: "/sleep", icon: "😴", description: "최적 기상시간", isNew: true },
    ],
  },
  {
    name: "날짜/시간",
    color: "amber",
    icon: "📅",
    items: [
      { name: "만 나이 계산기", href: "/age", icon: "🎂", description: "만 나이 확인" },
      { name: "D-Day 계산기", href: "/dday", icon: "📅", description: "날짜 카운트", hot: true },
      { name: "날짜 계산기", href: "/date-calc", icon: "🗓️", description: "날짜 더하기/빼기" },
      { name: "시간 계산기", href: "/time-calc", icon: "⏰", description: "시간 더하기/빼기" },
      { name: "임신 주수", href: "/pregnancy", icon: "🤰", description: "출산 예정일" },
      { name: "별자리/띠", href: "/zodiac", icon: "⭐", description: "12간지, 별자리", isNew: true },
    ],
  },
  {
    name: "단위 변환",
    color: "cyan",
    icon: "🔄",
    items: [
      { name: "길이 변환", href: "/length", icon: "📏", description: "cm, m, inch, ft" },
      { name: "넓이 변환", href: "/area", icon: "⬜", description: "㎡, 평, acre" },
      { name: "무게 변환", href: "/weight", icon: "⚖️", description: "kg, lb, oz" },
      { name: "온도 변환", href: "/temperature", icon: "🌡️", description: "°C ↔ °F ↔ K" },
      { name: "속도 변환", href: "/speed", icon: "🚗", description: "km/h, mph, m/s" },
      { name: "압력 변환", href: "/pressure", icon: "🎈", description: "Pa, bar, atm", isNew: true },
      { name: "에너지 변환", href: "/energy", icon: "⚡", description: "J, cal, kWh", isNew: true },
      { name: "각도 변환", href: "/angle", icon: "📐", description: "도, 라디안", isNew: true },
      { name: "부피 변환", href: "/volume", icon: "🫗", description: "L, mL, cup", isNew: true },
      { name: "힘 변환", href: "/force", icon: "💪", description: "N, kgf, lbf", isNew: true },
      { name: "시간대 변환", href: "/timezone", icon: "🌍", description: "세계 시간대", isNew: true },
      { name: "데이터 용량", href: "/data-size", icon: "💾", description: "KB, MB, GB, TB" },
      { name: "진법 변환", href: "/base-converter", icon: "🔢", description: "2진수, 16진수" },
      { name: "색상 변환", href: "/color", icon: "🎨", description: "HEX, RGB, HSL" },
    ],
  },
  {
    name: "자동차",
    color: "slate",
    icon: "🚗",
    items: [
      { name: "자동차세 계산기", href: "/car-tax", icon: "🚙", description: "연간 자동차세" },
      { name: "연비 계산기", href: "/fuel-economy", icon: "⛽", description: "km/L, 주유비" },
    ],
  },
  {
    name: "도형/수학",
    color: "indigo",
    icon: "📐",
    items: [
      { name: "삼각형 계산기", href: "/triangle", icon: "📐", description: "변/각/넓이 계산" },
      { name: "형상 분할 계산기", href: "/shape-divider", icon: "📊", description: "도형 분할 계산" },
      { name: "원 계산기", href: "/circle", icon: "⭕", description: "원의 넓이/둘레" },
      { name: "사각형 계산기", href: "/rectangle", icon: "⬜", description: "사각형 넓이" },
      { name: "구 계산기", href: "/sphere", icon: "🔮", description: "구 부피/겉넓이", isNew: true },
      { name: "원기둥 계산기", href: "/cylinder", icon: "🥫", description: "원기둥 부피", isNew: true },
      { name: "원뿔 계산기", href: "/cone", icon: "🍦", description: "원뿔 부피", isNew: true },
      { name: "최대공약수/최소공배수", href: "/gcd-lcm", icon: "🔢", description: "GCD/LCM" },
      { name: "소수 계산기", href: "/prime", icon: "🔢", description: "소수 판별/분해" },
      { name: "순열/조합", href: "/permutation", icon: "🎯", description: "nPr, nCr 계산", isNew: true },
      { name: "통계 계산기", href: "/statistics", icon: "📊", description: "평균, 표준편차", isNew: true },
      { name: "피타고라스", href: "/pythagorean", icon: "📐", description: "a²+b²=c²", isNew: true },
      { name: "이차방정식", href: "/quadratic", icon: "📝", description: "근의 공식", isNew: true },
      { name: "비율 계산기", href: "/ratio", icon: "⚖️", description: "비례식 계산", isNew: true },
      { name: "로그 계산기", href: "/logarithm", icon: "📈", description: "log, ln 계산", isNew: true },
    ],
  },
  {
    name: "텍스트/유틸",
    color: "gray",
    icon: "📝",
    items: [
      { name: "글자수 세기", href: "/character-count", icon: "📝", description: "문자/단어/바이트" },
      { name: "랜덤 숫자", href: "/random", icon: "🎲", description: "랜덤 번호 생성" },
      { name: "비밀번호 생성", href: "/password", icon: "🔐", description: "안전한 비밀번호", isNew: true },
      { name: "Base64 인코딩", href: "/base64", icon: "🔐", description: "인코딩/디코딩", isNew: true },
      { name: "로마 숫자", href: "/roman", icon: "🏛️", description: "아라비아↔로마", isNew: true },
      { name: "신발 사이즈", href: "/shoe-size", icon: "👟", description: "US/EU/UK 변환", isNew: true },
      { name: "사진 비율", href: "/aspect-ratio", icon: "🖼️", description: "화면비 계산", isNew: true },
    ],
  },
];

const colorClasses: Record<string, { bg: string; border: string; text: string; gradient: string; light: string }> = {
  blue: { bg: "bg-blue-500", border: "border-blue-200", text: "text-blue-600", gradient: "from-blue-500 to-blue-600", light: "bg-blue-50" },
  emerald: { bg: "bg-emerald-500", border: "border-emerald-200", text: "text-emerald-600", gradient: "from-emerald-500 to-emerald-600", light: "bg-emerald-50" },
  violet: { bg: "bg-violet-500", border: "border-violet-200", text: "text-violet-600", gradient: "from-violet-500 to-violet-600", light: "bg-violet-50" },
  rose: { bg: "bg-rose-500", border: "border-rose-200", text: "text-rose-600", gradient: "from-rose-500 to-rose-600", light: "bg-rose-50" },
  amber: { bg: "bg-amber-500", border: "border-amber-200", text: "text-amber-600", gradient: "from-amber-500 to-amber-600", light: "bg-amber-50" },
  cyan: { bg: "bg-cyan-500", border: "border-cyan-200", text: "text-cyan-600", gradient: "from-cyan-500 to-cyan-600", light: "bg-cyan-50" },
  slate: { bg: "bg-slate-500", border: "border-slate-200", text: "text-slate-600", gradient: "from-slate-500 to-slate-600", light: "bg-slate-50" },
  indigo: { bg: "bg-indigo-500", border: "border-indigo-200", text: "text-indigo-600", gradient: "from-indigo-500 to-indigo-600", light: "bg-indigo-50" },
  gray: { bg: "bg-gray-500", border: "border-gray-200", text: "text-gray-600", gradient: "from-gray-500 to-gray-600", light: "bg-gray-50" },
  orange: { bg: "bg-orange-500", border: "border-orange-200", text: "text-orange-600", gradient: "from-orange-500 to-orange-600", light: "bg-orange-50" },
};

// 인기 계산기
const popularCalculators = [
  { name: "연봉 실수령액", href: "/salary", icon: "💰", color: "blue", desc: "4대보험+소득세" },
  { name: "대출 이자", href: "/loan", icon: "🏦", color: "emerald", desc: "상환액 계산" },
  { name: "BMI 계산기", href: "/bmi", icon: "⚖️", color: "rose", desc: "체질량지수" },
  { name: "D-Day", href: "/dday", icon: "📅", color: "amber", desc: "날짜 카운트" },
  { name: "환율 계산기", href: "/currency", icon: "💱", color: "violet", desc: "통화 환전" },
  { name: "퍼센트 계산기", href: "/percent", icon: "％", color: "cyan", desc: "퍼센트 계산" },
];

export default function Home() {
  const totalCalculators = calculatorCategories.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 모바일 레이아웃 */}
      <div className="lg:hidden max-w-lg mx-auto px-4 py-6">
        {/* 히어로 섹션 */}
        <section className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
            <span>🧮</span>
            <span>{totalCalculators}개의 무료 계산기</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            계산기나라
          </h1>
          <p className="text-gray-500 text-sm">
            필요한 모든 계산을 쉽고 빠르게
          </p>
        </section>

        {/* 인기 계산기 */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-800">🔥 인기 계산기</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {popularCalculators.slice(0, 4).map((calc) => {
              const colors = colorClasses[calc.color];
              return (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className={`bg-gradient-to-br ${colors.gradient} rounded-2xl p-4 text-white hover:shadow-lg hover:scale-[1.02] transition-all`}
                >
                  <span className="text-2xl mb-2 block">{calc.icon}</span>
                  <p className="font-bold text-sm">{calc.name}</p>
                  <p className="text-white/70 text-xs mt-0.5">{calc.desc}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 카테고리별 계산기 */}
        {calculatorCategories.map((category) => {
          const colors = colorClasses[category.color];
          return (
            <section key={category.name} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">{category.icon}</span>
                <h2 className="text-sm font-bold text-gray-800">{category.name}</h2>
                <span className="text-xs text-gray-400">({category.items.length})</span>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {category.items.map((item, idx) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                      idx !== category.items.length - 1 ? "border-b border-gray-50" : ""
                    }`}
                  >
                    <span className={`w-9 h-9 ${colors.light} rounded-xl flex items-center justify-center text-base`}>
                      {item.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                        {item.hot && (
                          <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded">HOT</span>
                        )}
                        {item.isNew && (
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded">NEW</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate">{item.description}</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {/* 푸터 */}
        <footer className="text-center py-8 border-t border-gray-100 mt-8">
          <p className="text-gray-400 text-xs mb-2">© 2024 계산기나라</p>
          <p className="text-gray-300 text-xs">모든 계산 결과는 참고용입니다</p>
        </footer>
      </div>

      {/* PC 레이아웃 */}
      <div className="hidden lg:block max-w-7xl mx-auto px-6 py-10">
        {/* 히어로 섹션 */}
        <section className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <span>🧮</span>
            <span>{totalCalculators}개의 무료 계산기</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            계산기나라
          </h1>
          <p className="text-gray-500 text-lg">
            필요한 모든 계산을 쉽고 빠르게
          </p>
        </section>

        {/* 인기 계산기 */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🔥 인기 계산기</h2>
          <div className="grid grid-cols-6 gap-4">
            {popularCalculators.map((calc) => {
              const colors = colorClasses[calc.color];
              return (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className={`bg-gradient-to-br ${colors.gradient} rounded-2xl p-5 text-white hover:shadow-lg hover:scale-[1.02] transition-all`}
                >
                  <span className="text-3xl mb-3 block">{calc.icon}</span>
                  <p className="font-bold">{calc.name}</p>
                  <p className="text-white/70 text-sm mt-1">{calc.desc}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 카테고리별 계산기 - 2열 그리드 */}
        <div className="grid grid-cols-2 gap-6">
          {calculatorCategories.map((category) => {
            const colors = colorClasses[category.color];
            return (
              <section key={category.name} className="mb-2">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{category.icon}</span>
                  <h2 className="text-base font-bold text-gray-800">{category.name}</h2>
                  <span className="text-sm text-gray-400">({category.items.length})</span>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="grid grid-cols-2">
                    {category.items.map((item, idx) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                          idx % 2 === 0 ? "border-r" : ""
                        }`}
                      >
                        <span className={`w-10 h-10 ${colors.light} rounded-xl flex items-center justify-center text-lg`}>
                          {item.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-medium text-gray-800">{item.name}</p>
                            {item.hot && (
                              <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded">HOT</span>
                            )}
                            {item.isNew && (
                              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded">NEW</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 truncate">{item.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* 푸터 */}
        <footer className="text-center py-12 border-t border-gray-100 mt-12">
          <p className="text-gray-400 text-sm mb-2">© 2024 계산기나라</p>
          <p className="text-gray-300 text-sm">모든 계산 결과는 참고용입니다</p>
        </footer>
      </div>
    </div>
  );
}
