const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const panels = Array.from(document.querySelectorAll("[data-stage-panel]"));
const stageBackgrounds = Array.from(document.querySelectorAll("[data-stage-bg]"));
const stage = document.querySelector(".scroll-stage");
const counters = Array.from(document.querySelectorAll("[data-count]"));
let countersStarted = false;

const chartText = {
  ko: {
    average: "1년 평균 거래 가격",
    monthlyTrend: "월별 거래가격 추세",
    selectDistrict: "지역 선택",
    rank: "선택 지역 순위",
    trendUp: "완만하게 상승했습니다.",
    trendSteep: "가파르게 상승했습니다.",
    trendJump: "에서 가파른 상승세를 보였습니다.",
    trendFlat: "완만하게 상승했습니다.",
    seoulAverageNote: "서울 전체 1년 평균 거래가격입니다. 구를 선택하면 지도와 월별 추세가 함께 강조됩니다."
  },
  en: {
    average: "One-year average transaction price",
    monthlyTrend: "Monthly transaction price trend",
    selectDistrict: "Select district",
    rank: "Selected region rank",
    trendUp: "rose gradually.",
    trendSteep: "rose sharply.",
    trendJump: "showed a sharp upward movement between",
    trendFlat: "rose gradually.",
    seoulAverageNote: "Seoul's one-year average transaction price. Select a district to highlight the map and monthly trend."
  }
};

const trendMonths = ["2025.04", "2025.05", "2025.06", "2025.07", "2025.08", "2025.09", "2025.10", "2025.11", "2025.12", "2026.01", "2026.02", "2026.03"];
const pricePalette = ["#d9ecff", "#a9d4f7", "#75b7ec", "#3e93d4", "#1768a8"];
const mapViewText = {
  ko: {
    legendTitle: "시세 범주",
    regionLegendTitle: "색상 범례",
    lowest: "낮음",
    highest: "높음"
  },
  en: {
    legendTitle: "Price range",
    regionLegendTitle: "Color legend",
    lowest: "Low",
    highest: "High"
  }
};

const koreaRegionLegend = [
  { color: "#b65f5b", label: { ko: "수도권", en: "Capital Area" } },
  { color: "#c48755", label: { ko: "강원·제주권", en: "Gangwon-Jeju Region" } },
  { color: "#6f9b78", label: { ko: "충청권", en: "Chungcheong Region" } },
  { color: "#5f83ad", label: { ko: "호남권", en: "Honam Region" } },
  { color: "#8b6f5a", label: { ko: "동남권", en: "Southeast Region" } },
  { color: "#c77b9a", label: { ko: "대구·경북권", en: "Daegu-Gyeongbuk Region" } }
];

const seoulRegionLegend = [
  { color: "#b65f5b", label: { ko: "서울 평균 (14.0억 원)", en: "Seoul Average (₩1.40B)" } },
  { color: "#5f83ad", label: { ko: "서울 평균보다 높음", en: "Above Seoul Average" } },
  { color: "#6f9b78", label: { ko: "서울 평균보다 낮음", en: "Below Seoul Average" } }
];

const koreaRegionMembers = {
  capitalArea: ["seoul", "incheon", "gyeonggi"],
  gangwonJeju: ["gangwon", "jeju"],
  chungcheong: ["daejeon", "sejong", "chungbuk", "chungnam"],
  honam: ["gwangju", "jeonnam", "jeonbuk"],
  southeast: ["busan", "ulsan", "gyeongnam"],
  daeguGyeongbuk: ["daegu", "gyeongbuk"]
};

const graphData = [
  { id: "seoul", color: "#b65f5b", cluster: { ko: "서울 평균", en: "Seoul Average" }, name: { ko: "서울 전체", en: "All Seoul" }, value: 14.04, trend: [12.85, 12.98, 13.37, 13.61, 13.77, 13.9, 14.16, 14.44, 14.62, 14.76, 14.93, 15.1] },
  { id: "gangnam", color: "#5f83ad", cluster: { ko: "상급지", en: "Upper Tier" }, name: { ko: "강남구", en: "Gangnam-gu" }, value: 30.28, trend: [27.06, 27.68, 29.27, 29.75, 30.13, 30.39, 30.73, 31.15, 31.58, 31.85, 31.95, 31.8] },
  { id: "gangdong", color: "#5f83ad", cluster: { ko: "상급지", en: "Upper Tier" }, name: { ko: "강동구", en: "Gangdong-gu" }, value: 14.11, trend: [12.61, 12.65, 12.95, 13.35, 13.53, 13.74, 14.54, 14.86, 14.97, 15.14, 15.32, 15.69] },
  { id: "gangbuk", color: "#6f9b78", cluster: { ko: "하급지", en: "Lower Tier" }, name: { ko: "강북구", en: "Gangbuk-gu" }, value: 6.94, trend: [6.84, 6.84, 6.83, 6.88, 6.88, 6.9, 6.9, 6.93, 6.97, 7.0, 7.08, 7.23] },
  { id: "gangseo", color: "#6f9b78", cluster: { ko: "하급지", en: "Lower Tier" }, name: { ko: "강서구", en: "Gangseo-gu" }, value: 9.96, trend: [9.56, 9.59, 9.63, 9.69, 9.74, 9.81, 9.89, 10.06, 10.16, 10.24, 10.46, 10.7] },
  { id: "gwanak", color: "#6f9b78", cluster: { ko: "하급지", en: "Lower Tier" }, name: { ko: "관악구", en: "Gwanak-gu" }, value: 8.55, trend: [8.1, 8.2, 8.26, 8.3, 8.33, 8.37, 8.47, 8.61, 8.71, 8.86, 9.11, 9.33] },
  { id: "gwangjin", color: "#5f83ad", cluster: { ko: "상급지", en: "Upper Tier" }, name: { ko: "광진구", en: "Gwangjin-gu" }, value: 15.72, trend: [13.82, 13.95, 14.25, 14.67, 14.89, 15.15, 16.14, 16.83, 17.03, 17.15, 17.32, 17.49] },
  { id: "guro", color: "#6f9b78", cluster: { ko: "하급지", en: "Lower Tier" }, name: { ko: "구로구", en: "Guro-gu" }, value: 7.91, trend: [7.69, 7.69, 7.71, 7.77, 7.81, 7.85, 7.89, 7.95, 8.0, 8.05, 8.18, 8.34] },
  { id: "geumcheon", color: "#6f9b78", cluster: { ko: "하급지", en: "Lower Tier" }, name: { ko: "금천구", en: "Geumcheon-gu" }, value: 7.33, trend: [7.3, 7.3, 7.28, 7.31, 7.33, 7.34, 7.34, 7.33, 7.34, 7.35, 7.36, 7.39] },
  { id: "nowon", color: "#6f9b78", cluster: { ko: "하급지", en: "Lower Tier" }, name: { ko: "노원구", en: "Nowon-gu" }, value: 7.67, trend: [7.53, 7.57, 7.57, 7.59, 7.61, 7.63, 7.65, 7.7, 7.72, 7.76, 7.82, 7.93] },
  { id: "dobong", color: "#6f9b78", cluster: { ko: "하급지", en: "Lower Tier" }, name: { ko: "도봉구", en: "Dobong-gu" }, value: 6.29, trend: [6.23, 6.23, 6.24, 6.25, 6.26, 6.27, 6.29, 6.3, 6.32, 6.33, 6.37, 6.42] },
  { id: "dongdaemun", color: "#6f9b78", cluster: { ko: "하급지", en: "Lower Tier" }, name: { ko: "동대문구", en: "Dongdaemun-gu" }, value: 10.31, trend: [9.42, 9.43, 9.47, 9.56, 10.17, 10.23, 10.39, 10.68, 10.84, 10.95, 11.1, 11.46] },
  { id: "dongjak", color: "#6f9b78", cluster: { ko: "하급지", en: "Lower Tier" }, name: { ko: "동작구", en: "Dongjak-gu" }, value: 13.9, trend: [12.49, 12.6, 12.88, 13.12, 13.33, 13.5, 13.83, 14.46, 14.63, 15.07, 15.25, 15.6] },
  { id: "mapo", color: "#5f83ad", cluster: { ko: "상급지", en: "Upper Tier" }, name: { ko: "마포구", en: "Mapo-gu" }, value: 15.72, trend: [14.27, 14.38, 14.61, 15.02, 15.19, 15.38, 15.86, 16.38, 16.53, 16.68, 17.02, 17.28] },
  { id: "seodaemun", color: "#6f9b78", cluster: { ko: "하급지", en: "Lower Tier" }, name: { ko: "서대문구", en: "Seodaemun-gu" }, value: 10.81, trend: [10.12, 10.13, 10.3, 10.47, 10.57, 10.63, 10.78, 11.0, 11.1, 11.25, 11.53, 11.79] },
  { id: "seocho", color: "#5f83ad", cluster: { ko: "상급지", en: "Upper Tier" }, name: { ko: "서초구", en: "Seocho-gu" }, value: 30.35, trend: [27.31, 27.94, 29.2, 29.7, 30.09, 30.36, 30.61, 30.95, 31.61, 31.94, 32.21, 32.23] },
  { id: "seongdong", color: "#5f83ad", cluster: { ko: "상급지", en: "Upper Tier" }, name: { ko: "성동구", en: "Seongdong-gu" }, value: 16.65, trend: [14.75, 14.93, 15.41, 15.89, 16.05, 16.21, 16.83, 17.52, 17.71, 17.87, 18.12, 18.56] },
  { id: "seongbuk", color: "#6f9b78", cluster: { ko: "하급지", en: "Lower Tier" }, name: { ko: "성북구", en: "Seongbuk-gu" }, value: 9.04, trend: [8.74, 8.76, 8.8, 8.85, 8.86, 8.91, 8.97, 9.1, 9.16, 9.27, 9.4, 9.7] },
  { id: "songpa", color: "#5f83ad", cluster: { ko: "상급지", en: "Upper Tier" }, name: { ko: "송파구", en: "Songpa-gu" }, value: 23.25, trend: [20.66, 20.9, 21.73, 22.32, 22.88, 23.21, 23.73, 24.13, 24.64, 24.8, 25.06, 24.9] },
  { id: "yangcheon", color: "#6f9b78", cluster: { ko: "하급지", en: "Lower Tier" }, name: { ko: "양천구", en: "Yangcheon-gu" }, value: 14.03, trend: [12.53, 12.78, 13.31, 13.77, 13.83, 13.95, 14.22, 14.57, 14.7, 14.79, 14.89, 15.06] },
  { id: "yeongdeungpo", color: "#6f9b78", cluster: { ko: "하급지", en: "Lower Tier" }, name: { ko: "영등포구", en: "Yeongdeungpo-gu" }, value: 12.39, trend: [11.43, 11.52, 11.7, 11.91, 12.0, 12.13, 12.42, 12.69, 12.89, 13.02, 13.29, 13.72] },
  { id: "yongsan", color: "#5f83ad", cluster: { ko: "상급지", en: "Upper Tier" }, name: { ko: "용산구", en: "Yongsan-gu" }, value: 18.23, trend: [16.77, 16.86, 17.13, 17.43, 17.71, 17.95, 18.27, 18.63, 19.12, 19.36, 19.54, 19.99] },
  { id: "eunpyeong", color: "#6f9b78", cluster: { ko: "하급지", en: "Lower Tier" }, name: { ko: "은평구", en: "Eunpyeong-gu" }, value: 8.77, trend: [8.59, 8.6, 8.62, 8.66, 8.67, 8.68, 8.71, 8.76, 8.81, 8.87, 9.03, 9.26] },
  { id: "jongno", color: "#6f9b78", cluster: { ko: "하급지", en: "Lower Tier" }, name: { ko: "종로구", en: "Jongno-gu" }, value: 13.75, trend: [13.12, 13.24, 13.43, 13.59, 13.63, 13.69, 13.72, 13.95, 14.02, 14.04, 14.18, 14.41] },
  { id: "jung", color: "#6f9b78", cluster: { ko: "하급지", en: "Lower Tier" }, name: { ko: "중구", en: "Jung-gu" }, value: 13.18, trend: [12.13, 12.16, 12.33, 12.57, 12.65, 12.85, 13.07, 13.6, 14.03, 14.12, 14.24, 14.44] },
  { id: "jungnang", color: "#6f9b78", cluster: { ko: "하급지", en: "Lower Tier" }, name: { ko: "중랑구", en: "Jungnang-gu" }, value: 7.34, trend: [7.25, 7.27, 7.28, 7.29, 7.3, 7.32, 7.32, 7.35, 7.36, 7.4, 7.44, 7.54] }
];

const koreaMapData = [
  {
    id: "seoul",
    color: "#b65f5b",
    cluster: { ko: "수도권", en: "Capital Area" },
    name: { ko: "서울특별시", en: "Seoul Special City" },
    price: 14.04,
    note: { ko: "2025.04-2026.03 KB부동산 자료 기준 1년 평균 거래가격입니다.", en: "One-year average transaction price based on KB Real Estate data, Apr. 2025 to Mar. 2026." }
  },
  {
    id: "busan",
    color: "#8b6f5a",
    cluster: { ko: "동남권", en: "Southeast Region" },
    name: { ko: "부산광역시", en: "Busan Metropolitan City" },
    price: 4.18,
    note: { ko: "2025.04-2026.03 KB부동산 자료 기준 1년 평균 거래가격입니다.", en: "One-year average transaction price based on KB Real Estate data, Apr. 2025 to Mar. 2026." }
  },
  {
    id: "daegu",
    color: "#c77b9a",
    cluster: { ko: "대구·경북권", en: "Daegu-Gyeongbuk Region" },
    name: { ko: "대구광역시", en: "Daegu Metropolitan City" },
    price: 3.60,
    note: { ko: "2025.04-2026.03 KB부동산 자료 기준 1년 평균 거래가격입니다.", en: "One-year average transaction price based on KB Real Estate data, Apr. 2025 to Mar. 2026." }
  },
  {
    id: "incheon",
    color: "#b65f5b",
    cluster: { ko: "수도권", en: "Capital Area" },
    name: { ko: "인천광역시", en: "Incheon Metropolitan City" },
    price: 4.48,
    note: { ko: "2025.04-2026.03 KB부동산 자료 기준 1년 평균 거래가격입니다.", en: "One-year average transaction price based on KB Real Estate data, Apr. 2025 to Mar. 2026." }
  },
  {
    id: "gwangju",
    color: "#5f83ad",
    cluster: { ko: "호남권", en: "Honam Region" },
    name: { ko: "광주광역시", en: "Gwangju Metropolitan City" },
    price: 3.35,
    note: { ko: "2025.04-2026.03 KB부동산 자료 기준 1년 평균 거래가격입니다.", en: "One-year average transaction price based on KB Real Estate data, Apr. 2025 to Mar. 2026." }
  },
  {
    id: "daejeon",
    color: "#6f9b78",
    cluster: { ko: "충청권", en: "Chungcheong Region" },
    name: { ko: "대전광역시", en: "Daejeon Metropolitan City" },
    price: 3.78,
    note: { ko: "2025.04-2026.03 KB부동산 자료 기준 1년 평균 거래가격입니다.", en: "One-year average transaction price based on KB Real Estate data, Apr. 2025 to Mar. 2026." }
  },
  {
    id: "ulsan",
    color: "#8b6f5a",
    cluster: { ko: "동남권", en: "Southeast Region" },
    name: { ko: "울산광역시", en: "Ulsan Metropolitan City" },
    price: 3.53,
    note: { ko: "2025.04-2026.03 KB부동산 자료 기준 1년 평균 거래가격입니다.", en: "One-year average transaction price based on KB Real Estate data, Apr. 2025 to Mar. 2026." }
  },
  {
    id: "sejong",
    color: "#6f9b78",
    cluster: { ko: "충청권", en: "Chungcheong Region" },
    name: { ko: "세종특별자치시", en: "Sejong Special Self-Governing City" },
    price: 5.52,
    note: { ko: "2025.04-2026.03 KB부동산 자료 기준 1년 평균 거래가격입니다.", en: "One-year average transaction price based on KB Real Estate data, Apr. 2025 to Mar. 2026." }
  },
  {
    id: "gyeonggi",
    color: "#b65f5b",
    cluster: { ko: "수도권", en: "Capital Area" },
    name: { ko: "경기도", en: "Gyeonggi-do" },
    price: 5.75,
    note: { ko: "2025.04-2026.03 KB부동산 자료 기준 1년 평균 거래가격입니다.", en: "One-year average transaction price based on KB Real Estate data, Apr. 2025 to Mar. 2026." }
  },
  {
    id: "gangwon",
    color: "#c48755",
    cluster: { ko: "강원·제주권", en: "Gangwon-Jeju Region" },
    name: { ko: "강원특별자치도", en: "Gangwon State" },
    price: 2.76,
    note: { ko: "2025.04-2026.03 KB부동산 자료 기준 1년 평균 거래가격입니다.", en: "One-year average transaction price based on KB Real Estate data, Apr. 2025 to Mar. 2026." }
  },
  {
    id: "chungbuk",
    color: "#6f9b78",
    cluster: { ko: "충청권", en: "Chungcheong Region" },
    name: { ko: "충청북도", en: "North Chungcheong Province" },
    price: 2.92,
    note: { ko: "2025.04-2026.03 KB부동산 자료 기준 1년 평균 거래가격입니다.", en: "One-year average transaction price based on KB Real Estate data, Apr. 2025 to Mar. 2026." }
  },
  {
    id: "chungnam",
    color: "#6f9b78",
    cluster: { ko: "충청권", en: "Chungcheong Region" },
    name: { ko: "충청남도", en: "South Chungcheong Province" },
    price: 2.71,
    note: { ko: "2025.04-2026.03 KB부동산 자료 기준 1년 평균 거래가격입니다.", en: "One-year average transaction price based on KB Real Estate data, Apr. 2025 to Mar. 2026." }
  },
  {
    id: "jeonbuk",
    color: "#5f83ad",
    cluster: { ko: "호남권", en: "Honam Region" },
    name: { ko: "전북특별자치도", en: "Jeonbuk State" },
    price: 2.60,
    note: { ko: "2025.04-2026.03 KB부동산 자료 기준 1년 평균 거래가격입니다.", en: "One-year average transaction price based on KB Real Estate data, Apr. 2025 to Mar. 2026." }
  },
  {
    id: "jeonnam",
    color: "#5f83ad",
    cluster: { ko: "호남권", en: "Honam Region" },
    name: { ko: "전라남도", en: "South Jeolla Province" },
    price: 2.31,
    note: { ko: "2025.04-2026.03 KB부동산 자료 기준 1년 평균 거래가격입니다.", en: "One-year average transaction price based on KB Real Estate data, Apr. 2025 to Mar. 2026." }
  },
  {
    id: "gyeongbuk",
    color: "#c77b9a",
    cluster: { ko: "대구·경북권", en: "Daegu-Gyeongbuk Region" },
    name: { ko: "경상북도", en: "North Gyeongsang Province" },
    price: 2.36,
    note: { ko: "2025.04-2026.03 KB부동산 자료 기준 1년 평균 거래가격입니다.", en: "One-year average transaction price based on KB Real Estate data, Apr. 2025 to Mar. 2026." }
  },
  {
    id: "gyeongnam",
    color: "#8b6f5a",
    cluster: { ko: "동남권", en: "Southeast Region" },
    name: { ko: "경상남도", en: "South Gyeongsang Province" },
    price: 2.72,
    note: { ko: "2025.04-2026.03 KB부동산 자료 기준 1년 평균 거래가격입니다.", en: "One-year average transaction price based on KB Real Estate data, Apr. 2025 to Mar. 2026." }
  },
  {
    id: "jeju",
    color: "#c48755",
    cluster: { ko: "강원·제주권", en: "Gangwon-Jeju Region" },
    name: { ko: "제주특별자치도", en: "Jeju Special Self-Governing Province" },
    price: 4.79,
    note: { ko: "2025.04-2026.03 KB부동산 자료 기준 1년 평균 거래가격입니다.", en: "One-year average transaction price based on KB Real Estate data, Apr. 2025 to Mar. 2026." }
  }
];

koreaMapData.push(
  { id: "capitalArea", color: "#b65f5b", cluster: { ko: "권역 평균", en: "Regional Average" }, name: { ko: "수도권 평균", en: "Capital Area Average" }, price: 8.09, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 1년 평균 거래가격입니다.", en: "One-year average transaction price based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "gangwonJeju", color: "#c48755", cluster: { ko: "권역 평균", en: "Regional Average" }, name: { ko: "강원/제주권 평균", en: "Gangwon/Jeju Average" }, price: 3.78, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 1년 평균 거래가격입니다.", en: "One-year average transaction price based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "chungcheong", color: "#6f9b78", cluster: { ko: "권역 평균", en: "Regional Average" }, name: { ko: "충청권 평균", en: "Chungcheong Average" }, price: 3.73, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 1년 평균 거래가격입니다.", en: "One-year average transaction price based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "honam", color: "#5f83ad", cluster: { ko: "권역 평균", en: "Regional Average" }, name: { ko: "호남권 평균", en: "Honam Average" }, price: 2.75, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 1년 평균 거래가격입니다.", en: "One-year average transaction price based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "southeast", color: "#8b6f5a", cluster: { ko: "권역 평균", en: "Regional Average" }, name: { ko: "동남권 평균", en: "Southeast Average" }, price: 3.48, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 1년 평균 거래가격입니다.", en: "One-year average transaction price based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "daeguGyeongbuk", color: "#c77b9a", cluster: { ko: "권역 평균", en: "Regional Average" }, name: { ko: "대구/경북권 평균", en: "Daegu/Gyeongbuk Average" }, price: 2.98, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 1년 평균 거래가격입니다.", en: "One-year average transaction price based on KB Real Estate data, Apr. 2025 to Mar. 2026." } }
);

const seoulMapData = [
  { id: "seoul", cluster: { ko: "서울 전체", en: "Seoul Average" }, name: { ko: "서울 평균", en: "Seoul Average" }, price: 14.04, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "gangnam", cluster: { ko: "강남권", en: "Southeast Seoul" }, name: { ko: "강남구", en: "Gangnam-gu" }, price: 30.28, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "gangdong", cluster: { ko: "강동권", en: "Eastern Seoul" }, name: { ko: "강동구", en: "Gangdong-gu" }, price: 14.11, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "gangbuk", cluster: { ko: "강북권", en: "Northern Seoul" }, name: { ko: "강북구", en: "Gangbuk-gu" }, price: 6.94, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "gangseo", cluster: { ko: "서남권", en: "Western Seoul" }, name: { ko: "강서구", en: "Gangseo-gu" }, price: 9.96, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "gwanak", cluster: { ko: "서남권", en: "Southwest Seoul" }, name: { ko: "관악구", en: "Gwanak-gu" }, price: 8.55, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "gwangjin", cluster: { ko: "동북권", en: "Northeast Seoul" }, name: { ko: "광진구", en: "Gwangjin-gu" }, price: 15.72, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "guro", cluster: { ko: "서남권", en: "Southwest Seoul" }, name: { ko: "구로구", en: "Guro-gu" }, price: 7.91, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "geumcheon", cluster: { ko: "서남권", en: "Southwest Seoul" }, name: { ko: "금천구", en: "Geumcheon-gu" }, price: 7.33, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "nowon", cluster: { ko: "동북권", en: "Northeast Seoul" }, name: { ko: "노원구", en: "Nowon-gu" }, price: 7.67, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "dobong", cluster: { ko: "동북권", en: "Northeast Seoul" }, name: { ko: "도봉구", en: "Dobong-gu" }, price: 6.29, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "dongdaemun", cluster: { ko: "동북권", en: "Northeast Seoul" }, name: { ko: "동대문구", en: "Dongdaemun-gu" }, price: 10.31, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "dongjak", cluster: { ko: "서남권", en: "Southwest Seoul" }, name: { ko: "동작구", en: "Dongjak-gu" }, price: 13.9, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "mapo", cluster: { ko: "서북권", en: "Northwest Seoul" }, name: { ko: "마포구", en: "Mapo-gu" }, price: 15.72, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "seodaemun", cluster: { ko: "서북권", en: "Northwest Seoul" }, name: { ko: "서대문구", en: "Seodaemun-gu" }, price: 10.81, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "seocho", cluster: { ko: "강남권", en: "Southeast Seoul" }, name: { ko: "서초구", en: "Seocho-gu" }, price: 30.35, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "seongdong", cluster: { ko: "도심권", en: "Central Seoul" }, name: { ko: "성동구", en: "Seongdong-gu" }, price: 16.65, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "seongbuk", cluster: { ko: "동북권", en: "Northeast Seoul" }, name: { ko: "성북구", en: "Seongbuk-gu" }, price: 9.04, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "songpa", cluster: { ko: "강남권", en: "Southeast Seoul" }, name: { ko: "송파구", en: "Songpa-gu" }, price: 23.25, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "yangcheon", cluster: { ko: "서남권", en: "Southwest Seoul" }, name: { ko: "양천구", en: "Yangcheon-gu" }, price: 14.03, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "yeongdeungpo", cluster: { ko: "서남권", en: "Southwest Seoul" }, name: { ko: "영등포구", en: "Yeongdeungpo-gu" }, price: 12.39, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "yongsan", cluster: { ko: "도심권", en: "Central Seoul" }, name: { ko: "용산구", en: "Yongsan-gu" }, price: 18.23, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "eunpyeong", cluster: { ko: "서북권", en: "Northwest Seoul" }, name: { ko: "은평구", en: "Eunpyeong-gu" }, price: 8.77, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "jongno", cluster: { ko: "도심권", en: "Central Seoul" }, name: { ko: "종로구", en: "Jongno-gu" }, price: 13.75, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "jung", cluster: { ko: "도심권", en: "Central Seoul" }, name: { ko: "중구", en: "Jung-gu" }, price: 13.18, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } },
  { id: "jungnang", cluster: { ko: "동북권", en: "Northeast Seoul" }, name: { ko: "중랑구", en: "Jungnang-gu" }, price: 7.34, note: { ko: "2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격입니다.", en: "One-year average transaction price for all Seoul and each administrative district based on KB Real Estate data, Apr. 2025 to Mar. 2026." } }
];

const seoulSvgIds = {
  gangnam: "Gangnam-gu",
  gangdong: "Gangdong-gu",
  gangbuk: "Gangbuk-gu",
  gangseo: "Gangseo-gu",
  gwanak: "Gwanak-gu",
  gwangjin: "Gwangjin-gu",
  guro: "Guro-gu",
  geumcheon: "Geumcheon-gu",
  nowon: "Nowon-gu",
  dobong: "Dobong-gu",
  dongdaemun: "Dongdaemun-gu",
  dongjak: "Dongjak-gu",
  mapo: "Mapo-gu",
  seodaemun: "Seodaemun-gu",
  seocho: "Seocho-gu",
  seongdong: "Seongdong-gu",
  seongbuk: "Seongbuk-gu",
  songpa: "Songpa-gu",
  yangcheon: "Yangcheon-gu",
  yeongdeungpo: "Yeongdeungpo-gu_1_",
  yongsan: "Yongsan-gu",
  eunpyeong: "Eunpyeong-gu",
  jongno: "Jongno-gu",
  jung: "Jung-gu",
  jungnang: "Jungnang-gu"
};

const koreaSvgIds = {
  seoul: "seoul",
  busan: "busan",
  daegu: "daegu",
  incheon: "incheon",
  gwangju: "gwangju",
  daejeon: "daejeon",
  ulsan: "ulsan",
  sejong: "sejong",
  gyeonggi: "gyeonggi",
  gangwon: "gangwon",
  chungbuk: "chungbuk",
  chungnam: "chungnam",
  jeonbuk: "jeonbuk",
  jeonnam: "jeonnam",
  gyeongbuk: "gyeongbuk",
  gyeongnam: "gyeongnam",
  jeju: "jeju"
};

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}

function updateStage() {
  if (!stage || panels.length === 0) return;

  const rect = stage.getBoundingClientRect();
  const scrollable = Math.max(stage.offsetHeight - window.innerHeight, 1);
  const rawProgress = Math.min(Math.max(-rect.top / scrollable, 0), 1);
  const activeIndex = Math.min(panels.length - 1, Math.floor(rawProgress * panels.length));
  const isComplete = rect.bottom <= window.innerHeight * 0.08;

  panels.forEach((panel, index) => {
    const isActive = index === activeIndex;
    panel.classList.toggle("is-active", isActive);
    panel.setAttribute("aria-hidden", String(!isActive));
  });

  stageBackgrounds.forEach((background, index) => {
    background.classList.toggle("is-active", index === activeIndex);
  });

  stage.classList.toggle("is-complete", isComplete);
  document.documentElement.style.setProperty("--hero-scale", (1 + rawProgress * 0.38).toFixed(3));
  document.documentElement.style.setProperty("--hero-shift", `${Math.round(rawProgress * -90)}px`);
}

function animateCounters() {
  counters.forEach((counter) => {
    const target = Number(counter.dataset.count || 0);
    const duration = 850;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  });
}

function maybeStartCounters() {
  if (countersStarted || counters.length === 0) return;
  countersStarted = true;
  animateCounters();
}

function getTrendType(trend) {
  const first = trend[0];
  const last = trend[trend.length - 1];
  const delta = last - first;

  if (delta > 0.35) return "trendUp";
  if (delta < -0.25) return "trendDown";
  return "trendFlat";
}

function getTrendSummary(trend, lang) {
  const labels = chartText[lang] || chartText.en;
  const first = trend[0];
  const last = trend[trend.length - 1];
  const changeRate = ((last - first) / first) * 100;
  if (changeRate >= 15) return labels.trendSteep;

  let jumpIndex = -1;
  let jumpAmount = 0;
  for (let index = 1; index < trend.length; index += 1) {
    const amount = trend[index] - trend[index - 1];
    if (amount > jumpAmount) {
      jumpAmount = amount;
      jumpIndex = index;
    }
  }

  if (jumpAmount >= 0.7 && jumpIndex > 0) {
    const from = trendMonths[jumpIndex - 1];
    const to = trendMonths[jumpIndex];
    return lang === "ko" ? `${from}에서 ${to} 사이에 가파른 상승세를 보였습니다.` : `${labels.trendJump} ${from} and ${to}.`;
  }

  return labels.trendFlat;
}

function drawSparkline(container, trend) {
  const width = 320;
  const height = 118;
  const padding = 10;
  const min = Math.min(...trend);
  const max = Math.max(...trend);
  const range = Math.max(max - min, 0.01);

  const points = trend.map((value, index) => {
    const x = padding + (index / (trend.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return [x, y];
  });

  const path = points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const circles = points
    .map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3"></circle>`)
    .join("");

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" focusable="false">
      <path d="${path}"></path>
      ${circles}
    </svg>
  `;
}

function formatPrice(value, lang) {
  return lang === "ko" ? `${value.toFixed(1)}억 원` : `₩${(value / 10).toFixed(2)}B`;
}

function getGraphItem(id) {
  return graphData.find((item) => item.id === id) || graphData[0];
}

function drawLineChart(container, selected, lang) {
  const width = 760;
  const height = 300;
  const padding = { top: 26, right: 28, bottom: 56, left: 58 };
  const values = selected.trend;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 0.01);
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const points = values.map((value, index) => {
    const x = padding.left + (index / (values.length - 1)) * plotWidth;
    const y = padding.top + (1 - (value - min) / range) * plotHeight;
    return { x, y, value };
  });

  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const pointNodes = points.map((point, index) => `
    <g class="line-point" style="--point-delay: ${(260 + index * 42).toFixed(0)}ms">
      <circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="4"></circle>
      <rect class="line-value-bg" x="${(point.x - 31).toFixed(1)}" y="${(point.y - 25).toFixed(1)}" width="62" height="18" rx="7"></rect>
      <text x="${point.x.toFixed(1)}" y="${(point.y - 10).toFixed(1)}">${formatPrice(point.value, lang)}</text>
      <text class="line-month" x="${point.x.toFixed(1)}" y="${height - 22}">${trendMonths[index]}</text>
    </g>
  `).join("");

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" focusable="false" aria-label="${selected.name[lang]} 12-month trend" style="--line-color: ${selected.color}">
      <line class="line-axis" x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}"></line>
      <line class="line-axis" x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}"></line>
      <path class="line-path" pathLength="1" d="${path}"></path>
      ${pointNodes}
    </svg>
  `;
}

function updateInteractiveChart(chart, selectedId) {
  const lang = chart.dataset.lang || "en";
  const labels = chartText[lang] || chartText.en;
  const sorted = [...graphData].sort((a, b) => b.value - a.value);
  const selected = getGraphItem(selectedId);
  const rank = sorted.findIndex((item) => item.id === selected.id) + 1;
  const lineChart = chart.querySelector("[data-line-chart]");

  chart.querySelectorAll(".chart-choice").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.region === selected.id);
    button.setAttribute("aria-pressed", String(button.dataset.region === selected.id));
  });

  chart.querySelector("[data-detail-cluster]").textContent = selected.cluster[lang];
  chart.querySelector("[data-detail-name]").textContent = selected.name[lang];
  chart.querySelector("[data-detail-value]").textContent = formatPrice(selected.value, lang);
  chart.querySelector("[data-detail-note]").textContent = `${labels.average}: ${formatPrice(selected.value, lang)} | ${labels.rank}: ${rank}/${graphData.length}. ${getTrendSummary(selected.trend, lang)}`;
  drawLineChart(lineChart, selected, lang);
}

function initInteractiveCharts() {
  document.querySelectorAll("[data-interactive-chart]").forEach((chart) => {
    const lang = chart.dataset.lang || "en";
    const selector = chart.querySelector("[data-chart-selector]");

    selector.innerHTML = graphData.map((item) => {
      return `
        <button class="chart-choice" type="button" data-region="${item.id}" aria-pressed="false">
          <span>${item.name[lang]}</span>
        </button>
      `;
    }).join("");

    selector.addEventListener("click", (event) => {
      const button = event.target.closest(".chart-choice");
      if (!button) return;
      updateInteractiveChart(chart, button.dataset.region);
    });

    updateInteractiveChart(chart, "seoul");
  });
}

const comparisonChartData = {
  capital: {
    label: { ko: "Price Comparison Visualization", en: "Price Comparison Visualization" },
    title: { ko: "수도권 주요 지역 대비 지방 전체 거래 평균가 간 비교", en: "Comparison Between Major Capital-Area Regions and the Overall Local Average" },
    description: { ko: "행정구역별 버튼을 선택하면 해당 구역의 최근 12개월 간 아파트 평균 거래가격을 확인할 수 있습니다.", en: "Select an administrative-region button to view the recent 12-month average apartment transaction price." },
    baseline: { ko: "지방 평균", en: "Local Average" },
    baselineValue: 3.06,
    footnote: { ko: "* 화성시 동탄구의 경우, 화성시의 행정구역 개편이 2026년 02월에 이루어진 관계로 KB부동산 시세 데이터가 2026년 02월과 03월 총 2달간의 데이터만 집계되어 있음. 데이터의 부정확성에 대해 일부 감안 필요.", en: "* For Hwaseong Dongtan-gu, KB Real Estate price data is available only for February and March 2026 because Hwaseong's administrative-district reorganization took place in February 2026. Some caution is needed regarding data accuracy." },
    items: [
      { id: "incheonYeonsu", name: { ko: "인천 연수", en: "Incheon Yeonsu" }, value: 5.71 },
      { id: "incheonSeo", name: { ko: "인천 서", en: "Incheon Seo" }, value: 4.86 },
      { id: "goyangIlsandong", name: { ko: "고양 일산동", en: "Goyang Ilsandong" }, value: 5.75 },
      { id: "goyangIlsanseo", name: { ko: "고양 일산서", en: "Goyang Ilsanseo" }, value: 4.37 },
      { id: "gwacheon", name: { ko: "과천", en: "Gwacheon" }, value: 21.45 },
      { id: "gunpo", name: { ko: "군포", en: "Gunpo" }, value: 5.75 },
      { id: "bucheonWonmi", name: { ko: "부천 원미", en: "Bucheon Wonmi" }, value: 6.46 },
      { id: "bundang", name: { ko: "성남 분당", en: "Seongnam Bundang" }, value: 14.56 },
      { id: "suwonYeongtong", name: { ko: "수원 영통", en: "Suwon Yeongtong" }, value: 7.78 },
      { id: "anyangDongan", name: { ko: "안양 동안", en: "Anyang Dongan" }, value: 8.32 },
      { id: "yonginSuji", name: { ko: "용인 수지", en: "Yongin Suji" }, value: 8.78 },
      { id: "hwaseongDongtan", name: { ko: "화성 동탄", en: "Hwaseong Dongtan" }, value: 7.54 }
    ]
  },
  local: {
    label: { ko: "Price Comparison Visualization", en: "Price Comparison Visualization" },
    title: { ko: "지방 주요 지역 대비 지방 전체 평균가 간 비교", en: "Comparison Between Major Local Regions and the Overall Local Average" },
    description: { ko: "행정구역별 버튼을 선택하면 해당 구역의 최근 12개월 간 아파트 평균 거래가격을 확인할 수 있습니다.", en: "Select an administrative-region button to view the recent 12-month average apartment transaction price." },
    baseline: { ko: "지방 평균", en: "Local Average" },
    baselineValue: 3.85,
    items: [
      { id: "daeguSuseong", name: { ko: "대구 수성", en: "Daegu Suseong" }, value: 5.3 },
      { id: "daejeonYuseong", name: { ko: "대전 유성", en: "Daejeon Yuseong" }, value: 4.56 },
      { id: "daejeonSeo", name: { ko: "대전 서", en: "Daejeon Seo" }, value: 3.91 },
      { id: "ulsanNam", name: { ko: "울산 남", en: "Ulsan Nam" }, value: 4.39 },
      { id: "sejongMajor", name: { ko: "세종", en: "Sejong" }, value: 5.52 },
      { id: "cheongjuHeungdeok", name: { ko: "청주 흥덕", en: "Cheongju Heungdeok" }, value: 3.77 },
      { id: "changwonSeongsan", name: { ko: "창원 성산", en: "Changwon Seongsan" }, value: 4.12 },
      { id: "changwonUichang", name: { ko: "창원 의창", en: "Changwon Uichang" }, value: 3.73 },
      { id: "busanHaeundae", name: { ko: "부산 해운대", en: "Busan Haeundae" }, value: 5.57 }
    ]
  }
};

function renderComparisonChart(chart, selectedId) {
  const lang = chart.dataset.lang || "en";
  const config = comparisonChartData[chart.dataset.comparisonType] || comparisonChartData.capital;
  const selected = config.items.find((item) => item.id === selectedId) || config.items[0];
  const maxValue = Math.max(config.baselineValue, ...config.items.map((item) => item.value));
  const gap = selected.value - config.baselineValue;
  const gapText = lang === "ko" ? `지방 평균 대비 ${formatPrice(Math.abs(gap), lang)} ${gap >= 0 ? "높습니다" : "낮습니다"}.` : `${formatPrice(Math.abs(gap), lang)} ${gap >= 0 ? "above" : "below"} the local average.`;
  const sortedBars = [...config.items].sort((a, b) => b.value - a.value);
  const bars = [
    { id: "baseline", name: config.baseline, value: config.baselineValue, color: "#9fb4c9" },
    ...sortedBars.map((item) => ({ ...item, color: "#1f5eff" }))
  ];

  chart.innerHTML = `
    <div class="chart-head">
      <div>
        <p class="chart-label">${config.label[lang]}</p>
        <h3>${config.title[lang]}</h3>
      </div>
      <p>${config.description[lang]}</p>
    </div>
    <div class="chart-layout">
      <div class="chart-selector" data-comparison-selector>
        ${config.items.map((item) => `<button class="chart-choice ${item.id === selected.id ? "is-active" : ""}" type="button" data-region="${item.id}" aria-pressed="${item.id === selected.id}"><span>${item.name[lang]}</span></button>`).join("")}
      </div>
      <div class="bar-chart comparison-bars" style="--bar-count: ${bars.length}">
        ${bars.map((bar) => `
          <div class="chart-bar month-bar ${bar.id === selected.id ? "is-active" : ""} ${bar.id !== "baseline" && bar.id !== selected.id ? "is-muted" : ""}">
            <span class="chart-bar-value">${formatPrice(bar.value, lang)}</span>
            <span class="chart-bar-fill" style="--bar-color: ${bar.color}; height: ${(bar.value / maxValue * 100).toFixed(1)}%"></span>
            <span class="chart-bar-label">${bar.name[lang]}</span>
          </div>
        `).join("")}
      </div>
      <aside class="chart-detail" aria-live="polite">
        <span>${config.baseline[lang]}</span>
        <h4>${selected.name[lang]}</h4>
        <strong>${formatPrice(selected.value, lang)}</strong>
        <p>${gapText}</p>
      </aside>
    </div>
    ${config.footnote ? `<p class="chart-footnote">${config.footnote[lang]}</p>` : ""}
  `;
}

function initComparisonCharts() {
  document.querySelectorAll("[data-comparison-chart]").forEach((chart) => {
    const config = comparisonChartData[chart.dataset.comparisonType] || comparisonChartData.capital;
    renderComparisonChart(chart, config.items[0].id);
    chart.addEventListener("click", (event) => {
      const button = event.target.closest(".chart-choice");
      if (!button) return;
      renderComparisonChart(chart, button.dataset.region);
    });
  });
}

function getMapData(map) {
  return map.dataset.mapType === "seoul" ? seoulMapData : koreaMapData;
}

function getMapSvgIds(map) {
  return map.dataset.mapType === "seoul" ? seoulSvgIds : koreaSvgIds;
}

function getSvgFill(element) {
  return element.style.fill || element.getAttribute("fill") || "#cdcccc";
}

function getPriceMapData(map) {
  const data = getMapData(map);
  if (map.dataset.mapType === "seoul") return data.filter((item) => item.id !== "seoul");
  const ids = getMapSvgIds(map);
  return data.filter((item) => ids[item.id]);
}

function getPriceBucketIndex(value, data) {
  const prices = data.map((item) => item.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = Math.max(max - min, 0.01);
  const normalized = (value - min) / range;
  return Math.min(pricePalette.length - 1, Math.floor(normalized * pricePalette.length));
}

function getPriceColor(item, data) {
  return pricePalette[getPriceBucketIndex(item.price, data)];
}

function renderMapLegend(map) {
  const legend = map.querySelector("[data-map-legend]");
  if (!legend) return;

  const lang = map.dataset.lang || "en";
  const labels = mapViewText[lang] || mapViewText.en;
  const isPriceView = map.dataset.mapView === "price";

  if (!isPriceView) {
    const regionLegend = map.dataset.mapType === "seoul" ? seoulRegionLegend : koreaRegionLegend;
    const items = regionLegend.map((item) => `
      <span class="map-legend-item">
        <span class="map-legend-swatch" style="background: ${item.color}"></span>
        ${item.label[lang]}
      </span>
    `).join("");

    legend.innerHTML = `<span class="map-legend-title">${labels.regionLegendTitle}</span>${items}`;
    return;
  }

  const data = getPriceMapData(map);
  const prices = data.map((item) => item.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const step = (max - min) / pricePalette.length;

  const items = pricePalette.map((color, index) => {
    const start = min + step * index;
    const end = index === pricePalette.length - 1 ? max : min + step * (index + 1);
    return `
      <span class="map-legend-item">
        <span class="map-legend-swatch" style="background: ${color}"></span>
        ${formatPrice(start, lang)}-${formatPrice(end, lang)}
      </span>
    `;
  }).join("");

  legend.innerHTML = `<span class="map-legend-title">${labels.legendTitle}</span>${items}<span>${labels.lowest} → ${labels.highest}</span>`;
}

function getRegionFromSvgTarget(map, target) {
  const region = target.closest("[id]");
  if (!region || region.classList.contains("interactive-map-svg")) return "";

  const ids = getMapSvgIds(map);
  const match = Object.entries(ids).find(([, svgId]) => svgId === region.id);
  return match ? match[0] : "";
}

function colorMapSvg(map, selectedId) {
  const svg = map.querySelector(".interactive-map-svg");
  if (!svg) return;

  const ids = getMapSvgIds(map);
  const isSeoulMap = map.dataset.mapType === "seoul";
  const isPriceView = map.dataset.mapView === "price";
  const priceData = getPriceMapData(map);
  const selectedMembers = koreaRegionMembers[selectedId] || [];

  Object.values(ids).forEach((svgId) => {
    const region = svg.querySelector(`#${svgId}`);
    if (!region) return;
    if (!region.dataset.originalFill) {
      region.dataset.originalFill = getSvgFill(region);
    }
    const dataId = Object.keys(ids).find((id) => ids[id] === svgId);
    const item = getMapData(map).find((entry) => entry.id === dataId);
    const isSelected = selectedId === dataId || selectedMembers.includes(dataId);

    region.style.stroke = isSelected ? "#0d355a" : "";
    region.style.strokeWidth = isSelected ? "2.4" : "";

    if (isPriceView && item) {
      region.style.fill = getPriceColor(item, priceData);
      region.style.opacity = isSelected || (isSeoulMap && selectedId === "seoul") ? "0.96" : "0.78";
      return;
    }

    if (isSeoulMap) {
      const graphItem = getGraphItem(dataId);
      region.style.fill = selectedId === "seoul" ? "#b65f5b" : graphItem.color;
      region.style.opacity = isSelected || selectedId === "seoul" ? "0.88" : "0.32";
      return;
    }

    region.style.fill = item?.color || region.dataset.originalFill;
    region.style.opacity = isSelected ? "0.95" : "0.34";
  });

  const selectedSvgId = ids[selectedId];
  const selectedRegion = selectedSvgId ? svg.querySelector(`#${selectedSvgId}`) : null;
  if (!selectedRegion) return;
  if (isSeoulMap) {
    selectedRegion.style.opacity = "0.95";
    return;
  }
  selectedRegion.style.opacity = "0.95";
}

function updateMapWidget(map, selectedId) {
  const lang = map.dataset.lang || "en";
  const data = getMapData(map);
  const selected = data.find((item) => item.id === selectedId) || data[0];
  map.dataset.selectedRegion = selected.id;

  map.querySelectorAll(".map-region").forEach((button) => {
    const members = koreaRegionMembers[selected.id] || [];
    const isActive = button.dataset.region === selected.id || members.includes(button.dataset.region);
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  map.querySelector("[data-map-cluster]").textContent = selected.cluster[lang];
  map.querySelector("[data-map-name]").textContent = selected.name[lang];
  map.querySelector("[data-map-price]").textContent = formatPrice(selected.price, lang);
  map.querySelector("[data-map-note]").textContent = selected.note[lang];
  renderMapLegend(map);
  colorMapSvg(map, selected.id);
}

function inlineMapSvg(map) {
  const image = map.querySelector("[data-map-svg]");
  if (!image || image.dataset.inlined === "true") return Promise.resolve();

  image.dataset.inlined = "true";
  return fetch(image.getAttribute("src"))
    .then((response) => {
      if (!response.ok) throw new Error(`Unable to load ${image.getAttribute("src")}`);
      return response.text();
    })
    .then((svgText) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgText, "image/svg+xml");
      const svg = doc.querySelector("svg");
      if (!svg) return;
      svg.classList.add("interactive-map-svg");
      svg.setAttribute("aria-hidden", "true");
      svg.removeAttribute("width");
      svg.removeAttribute("height");
      image.replaceWith(document.importNode(svg, true));
    })
    .catch(() => {
      image.dataset.inlined = "false";
    });
}

function initMapWidgets() {
  document.querySelectorAll("[data-map-widget], [data-korea-map]").forEach((map) => {
    map.querySelectorAll(".map-region").forEach((button) => {
      button.setAttribute("type", "button");
      button.setAttribute("aria-pressed", "false");
    });

    map.addEventListener("click", (event) => {
      const viewButton = event.target.closest("[data-map-view-option]");
      if (viewButton) {
        map.dataset.mapView = viewButton.dataset.mapViewOption;
        map.querySelectorAll("[data-map-view-option]").forEach((button) => {
          const isActive = button === viewButton;
          button.classList.toggle("is-active", isActive);
          button.setAttribute("aria-pressed", String(isActive));
        });
        updateMapWidget(map, map.dataset.selectedRegion || map.dataset.defaultRegion || "seoul");
        return;
      }

      const button = event.target.closest(".map-region");
      if (button) {
        updateMapWidget(map, button.dataset.region);
        return;
      }

      const regionId = getRegionFromSvgTarget(map, event.target);
      if (!regionId) return;
      updateMapWidget(map, regionId);
    });

    inlineMapSvg(map).finally(() => {
      updateMapWidget(map, map.dataset.defaultRegion || "seoul");
    });
  });
}

function initScrollDots() {
  const dots = Array.from(document.querySelectorAll("[data-scroll-dots] a"));
  if (dots.length === 0) return;

  const targets = dots
    .map((dot) => document.querySelector(dot.getAttribute("href")))
    .filter(Boolean);

  const dotObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        dots.forEach((dot) => {
          dot.classList.toggle("is-active", dot.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
  );

  targets.forEach((target) => dotObserver.observe(target));
}

if (navToggle && navMenu && header) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.classList.toggle("is-active");
    navMenu.classList.toggle("is-active", isOpen);
    header.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target.tagName !== "A") return;
    navToggle.classList.remove("is-active");
    navMenu.classList.remove("is-active");
    header.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
}

function initRevealSections() {
  const sections = Array.from(document.querySelectorAll(".reveal-on-scroll"));
  if (sections.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px 18% 0px", threshold: 0.01 }
  );

  sections.forEach((section) => {
    section.classList.add("is-reveal-ready");
    revealObserver.observe(section);
  });
}

function initPage() {
  updateHeader();
  updateStage();
  maybeStartCounters();
  initRevealSections();
  initInteractiveCharts();
  initComparisonCharts();
  initMapWidgets();
  initScrollDots();
}

window.addEventListener("scroll", () => {
  updateHeader();
  updateStage();
  maybeStartCounters();
}, { passive: true });

window.addEventListener("resize", updateStage);

initPage();
