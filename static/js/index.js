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
    rank: "선택 지역 순위",
    trendUp: "최근 12개월 추세가 완만하게 상승했습니다.",
    trendDown: "최근 12개월 추세가 조정 구간에 들어섰습니다.",
    trendFlat: "최근 12개월 추세가 비교적 안정적으로 유지됐습니다."
  },
  en: {
    average: "One-year average transaction price",
    rank: "Selected region rank",
    trendUp: "The 12-month trend moved upward gradually.",
    trendDown: "The 12-month trend entered a correction phase.",
    trendFlat: "The 12-month trend stayed comparatively stable."
  }
};

const graphData = [
  { id: "seoul", color: "#b65f5b", cluster: { ko: "서울 평균", en: "Seoul Average" }, name: { ko: "서울 평균", en: "Seoul Average" }, value: 14.04, trend: [12.85, 12.98, 13.37, 13.61, 13.77, 13.9, 14.16, 14.44, 14.62, 14.76, 14.93, 15.1] },
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
    cluster: { ko: "특별시", en: "Special City" },
    name: { ko: "서울특별시", en: "Seoul Special City" },
    price: 15.8,
    note: { ko: "전국에서 가장 높은 더미 평균 시세입니다.", en: "The highest dummy average market price in the dataset." }
  },
  {
    id: "busan",
    cluster: { ko: "광역시", en: "Metropolitan City" },
    name: { ko: "부산광역시", en: "Busan Metropolitan City" },
    price: 4.9,
    note: { ko: "해안권 대도시 수요를 반영한 더미 값입니다.", en: "A dummy value reflecting coastal metropolitan demand." }
  },
  {
    id: "daegu",
    cluster: { ko: "광역시", en: "Metropolitan City" },
    name: { ko: "대구광역시", en: "Daegu Metropolitan City" },
    price: 4.1,
    note: { ko: "영남 내륙권 중심 도시의 예시 평균 시세입니다.", en: "A sample average for a major inland city in Yeongnam." }
  },
  {
    id: "incheon",
    cluster: { ko: "광역시", en: "Metropolitan City" },
    name: { ko: "인천광역시", en: "Incheon Metropolitan City" },
    price: 5.2,
    note: { ko: "수도권 내 상대적으로 낮은 더미 평균 시세입니다.", en: "A comparatively lower dummy average within the capital area." }
  },
  {
    id: "gwangju",
    cluster: { ko: "광역시", en: "Metropolitan City" },
    name: { ko: "광주광역시", en: "Gwangju Metropolitan City" },
    price: 3.2,
    note: { ko: "호남권 중심 도시를 설명하기 위한 더미 값입니다.", en: "A dummy value for the central city of the Honam region." }
  },
  {
    id: "daejeon",
    cluster: { ko: "광역시", en: "Metropolitan City" },
    name: { ko: "대전광역시", en: "Daejeon Metropolitan City" },
    price: 3.8,
    note: { ko: "충청권 광역 생활권의 예시 값입니다.", en: "A sample value for the Chungcheong metropolitan living area." }
  },
  {
    id: "ulsan",
    cluster: { ko: "광역시", en: "Metropolitan City" },
    name: { ko: "울산광역시", en: "Ulsan Metropolitan City" },
    price: 3.6,
    note: { ko: "산업도시 특성을 반영한 예시 값입니다.", en: "A sample value reflecting industrial-city characteristics." }
  },
  {
    id: "sejong",
    cluster: { ko: "특별자치시", en: "Special Self-Governing City" },
    name: { ko: "세종특별자치시", en: "Sejong Special Self-Governing City" },
    price: 4.6,
    note: { ko: "행정수도 기능을 반영한 더미 평균 시세입니다.", en: "A dummy average reflecting administrative-capital functions." }
  },
  {
    id: "gyeonggi",
    cluster: { ko: "도", en: "Province" },
    name: { ko: "경기도", en: "Gyeonggi-do" },
    price: 7.6,
    note: { ko: "서울 접근성과 신도시 수요가 반영된 예시 값입니다.", en: "A sample value reflecting Seoul access and new-town demand." }
  },
  {
    id: "gangwon",
    cluster: { ko: "특별자치도", en: "Special Self-Governing Province" },
    name: { ko: "강원특별자치도", en: "Gangwon State" },
    price: 2.4,
    note: { ko: "관광 및 생활권 특성이 섞인 예시 값입니다.", en: "A sample value combining tourism and local living-area traits." }
  },
  {
    id: "chungbuk",
    cluster: { ko: "도", en: "Province" },
    name: { ko: "충청북도", en: "North Chungcheong Province" },
    price: 2.9,
    note: { ko: "내륙 산업 및 생활권 특성을 반영한 더미 값입니다.", en: "A dummy value reflecting inland industry and living-area traits." }
  },
  {
    id: "chungnam",
    cluster: { ko: "도", en: "Province" },
    name: { ko: "충청남도", en: "South Chungcheong Province" },
    price: 3.0,
    note: { ko: "수도권 남부 확장과 산업 수요를 반영한 더미 값입니다.", en: "A dummy value reflecting southern capital-area expansion and industrial demand." }
  },
  {
    id: "jeonbuk",
    cluster: { ko: "특별자치도", en: "Special Self-Governing Province" },
    name: { ko: "전북특별자치도", en: "Jeonbuk State" },
    price: 2.6,
    note: { ko: "전북권 평균을 설명하기 위한 더미 값입니다.", en: "A dummy value used to describe the Jeonbuk regional average." }
  },
  {
    id: "jeonnam",
    cluster: { ko: "도", en: "Province" },
    name: { ko: "전라남도", en: "South Jeolla Province" },
    price: 2.3,
    note: { ko: "농어촌 및 중소도시 생활권을 반영한 예시 값입니다.", en: "A sample value reflecting rural, coastal, and small-city living areas." }
  },
  {
    id: "gyeongbuk",
    cluster: { ko: "도", en: "Province" },
    name: { ko: "경상북도", en: "North Gyeongsang Province" },
    price: 2.7,
    note: { ko: "영남 북부권 평균을 나타내는 더미 값입니다.", en: "A dummy value representing the northern Yeongnam average." }
  },
  {
    id: "gyeongnam",
    cluster: { ko: "도", en: "Province" },
    name: { ko: "경상남도", en: "South Gyeongsang Province" },
    price: 3.1,
    note: { ko: "창원과 동남권 산업 생활권을 반영한 예시 값입니다.", en: "A sample value reflecting Changwon and southeast industrial living areas." }
  },
  {
    id: "jeju",
    cluster: { ko: "특별자치도", en: "Special Self-Governing Province" },
    name: { ko: "제주특별자치도", en: "Jeju Special Self-Governing Province" },
    price: 4.4,
    note: { ko: "섬 지역의 특수성을 반영한 예시 값입니다.", en: "A sample value reflecting the island-region context." }
  }
];

const seoulMapData = [
  { id: "gangnam", cluster: { ko: "강남권", en: "Southeast Seoul" }, name: { ko: "강남구", en: "Gangnam-gu" }, price: 30.28, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } },
  { id: "gangdong", cluster: { ko: "강동권", en: "Eastern Seoul" }, name: { ko: "강동구", en: "Gangdong-gu" }, price: 14.11, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } },
  { id: "gangbuk", cluster: { ko: "강북권", en: "Northern Seoul" }, name: { ko: "강북구", en: "Gangbuk-gu" }, price: 6.94, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } },
  { id: "gangseo", cluster: { ko: "서남권", en: "Western Seoul" }, name: { ko: "강서구", en: "Gangseo-gu" }, price: 9.96, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } },
  { id: "gwanak", cluster: { ko: "서남권", en: "Southwest Seoul" }, name: { ko: "관악구", en: "Gwanak-gu" }, price: 8.55, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } },
  { id: "gwangjin", cluster: { ko: "동북권", en: "Northeast Seoul" }, name: { ko: "광진구", en: "Gwangjin-gu" }, price: 15.72, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } },
  { id: "guro", cluster: { ko: "서남권", en: "Southwest Seoul" }, name: { ko: "구로구", en: "Guro-gu" }, price: 7.91, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } },
  { id: "geumcheon", cluster: { ko: "서남권", en: "Southwest Seoul" }, name: { ko: "금천구", en: "Geumcheon-gu" }, price: 7.33, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } },
  { id: "nowon", cluster: { ko: "동북권", en: "Northeast Seoul" }, name: { ko: "노원구", en: "Nowon-gu" }, price: 7.67, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } },
  { id: "dobong", cluster: { ko: "동북권", en: "Northeast Seoul" }, name: { ko: "도봉구", en: "Dobong-gu" }, price: 6.29, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } },
  { id: "dongdaemun", cluster: { ko: "동북권", en: "Northeast Seoul" }, name: { ko: "동대문구", en: "Dongdaemun-gu" }, price: 10.31, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } },
  { id: "dongjak", cluster: { ko: "서남권", en: "Southwest Seoul" }, name: { ko: "동작구", en: "Dongjak-gu" }, price: 13.9, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } },
  { id: "mapo", cluster: { ko: "서북권", en: "Northwest Seoul" }, name: { ko: "마포구", en: "Mapo-gu" }, price: 15.72, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } },
  { id: "seodaemun", cluster: { ko: "서북권", en: "Northwest Seoul" }, name: { ko: "서대문구", en: "Seodaemun-gu" }, price: 10.81, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } },
  { id: "seocho", cluster: { ko: "강남권", en: "Southeast Seoul" }, name: { ko: "서초구", en: "Seocho-gu" }, price: 30.35, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } },
  { id: "seongdong", cluster: { ko: "도심권", en: "Central Seoul" }, name: { ko: "성동구", en: "Seongdong-gu" }, price: 16.65, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } },
  { id: "seongbuk", cluster: { ko: "동북권", en: "Northeast Seoul" }, name: { ko: "성북구", en: "Seongbuk-gu" }, price: 9.04, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } },
  { id: "songpa", cluster: { ko: "강남권", en: "Southeast Seoul" }, name: { ko: "송파구", en: "Songpa-gu" }, price: 23.25, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } },
  { id: "yangcheon", cluster: { ko: "서남권", en: "Southwest Seoul" }, name: { ko: "양천구", en: "Yangcheon-gu" }, price: 14.03, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } },
  { id: "yeongdeungpo", cluster: { ko: "서남권", en: "Southwest Seoul" }, name: { ko: "영등포구", en: "Yeongdeungpo-gu" }, price: 12.39, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } },
  { id: "yongsan", cluster: { ko: "도심권", en: "Central Seoul" }, name: { ko: "용산구", en: "Yongsan-gu" }, price: 18.23, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } },
  { id: "eunpyeong", cluster: { ko: "서북권", en: "Northwest Seoul" }, name: { ko: "은평구", en: "Eunpyeong-gu" }, price: 8.77, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } },
  { id: "jongno", cluster: { ko: "도심권", en: "Central Seoul" }, name: { ko: "종로구", en: "Jongno-gu" }, price: 13.75, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } },
  { id: "jung", cluster: { ko: "도심권", en: "Central Seoul" }, name: { ko: "중구", en: "Jung-gu" }, price: 13.18, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } },
  { id: "jungnang", cluster: { ko: "동북권", en: "Northeast Seoul" }, name: { ko: "중랑구", en: "Jungnang-gu" }, price: 7.34, note: { ko: "2025.04-2026.03 실제 1년 평균 거래가격입니다.", en: "Actual one-year average transaction price from Apr. 2025 to Mar. 2026." } }
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

function updateInteractiveChart(chart, selectedId) {
  const lang = chart.dataset.lang || "en";
  const labels = chartText[lang] || chartText.en;
  const sorted = [...graphData].sort((a, b) => b.value - a.value);
  const selected = graphData.find((item) => item.id === selectedId) || graphData[0];
  const rank = sorted.findIndex((item) => item.id === selected.id) + 1;

  chart.querySelectorAll(".chart-bar").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.region === selected.id);
    button.setAttribute("aria-pressed", String(button.dataset.region === selected.id));
  });

  chart.querySelector("[data-detail-cluster]").textContent = selected.cluster[lang];
  chart.querySelector("[data-detail-name]").textContent = selected.name[lang];
  chart.querySelector("[data-detail-value]").textContent = formatPrice(selected.value, lang);
  chart.querySelector("[data-detail-note]").textContent = `${labels.average}: ${formatPrice(selected.value, lang)} | ${labels.rank}: ${rank}/${graphData.length}. ${labels[getTrendType(selected.trend)]}`;
  drawSparkline(chart.querySelector("[data-sparkline]"), selected.trend);
}

function initInteractiveCharts() {
  document.querySelectorAll("[data-interactive-chart]").forEach((chart) => {
    const lang = chart.dataset.lang || "en";
    const maxValue = Math.max(...graphData.map((item) => item.value));
    const barChart = chart.querySelector("[data-bar-chart]");
    barChart.style.setProperty("--bar-count", graphData.length);

    barChart.innerHTML = graphData.map((item) => {
      const height = Math.max((item.value / maxValue) * 100, 10);
      return `
        <button class="chart-bar" type="button" data-region="${item.id}" aria-pressed="false" style="--bar-color: ${item.color}">
          <span class="chart-bar-value">${formatPrice(item.value, lang)}</span>
          <span class="chart-bar-fill" style="height: ${height}%"></span>
          <span class="chart-bar-label">${item.name[lang]}</span>
        </button>
      `;
    }).join("");

    barChart.addEventListener("click", (event) => {
      const button = event.target.closest(".chart-bar");
      if (!button) return;
      updateInteractiveChart(chart, button.dataset.region);
    });

    updateInteractiveChart(chart, "seoul");
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

function colorMapSvg(map, selectedId) {
  const svg = map.querySelector(".interactive-map-svg");
  if (!svg) return;

  const ids = getMapSvgIds(map);
  Object.values(ids).forEach((svgId) => {
    const region = svg.querySelector(`#${svgId}`);
    if (!region) return;
    if (!region.dataset.originalFill) {
      region.dataset.originalFill = getSvgFill(region);
    }
    region.style.fill = region.dataset.originalFill;
    region.style.opacity = "1";
  });

  const selectedSvgId = ids[selectedId];
  const selectedRegion = selectedSvgId ? svg.querySelector(`#${selectedSvgId}`) : null;
  if (!selectedRegion) return;
  selectedRegion.style.fill = "#0b7f72";
  selectedRegion.style.opacity = "1";
}

function updateMapWidget(map, selectedId) {
  const lang = map.dataset.lang || "en";
  const data = getMapData(map);
  const selected = data.find((item) => item.id === selectedId) || data[0];

  map.querySelectorAll(".map-region").forEach((button) => {
    const isActive = button.dataset.region === selected.id;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  map.querySelector("[data-map-cluster]").textContent = selected.cluster[lang];
  map.querySelector("[data-map-name]").textContent = selected.name[lang];
  map.querySelector("[data-map-price]").textContent = formatPrice(selected.price, lang);
  map.querySelector("[data-map-note]").textContent = selected.note[lang];
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
      const button = event.target.closest(".map-region");
      if (!button) return;
      updateMapWidget(map, button.dataset.region);
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

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal-on-scroll").forEach((section) => {
  revealObserver.observe(section);
});

window.addEventListener("scroll", () => {
  updateHeader();
  updateStage();
  maybeStartCounters();
}, { passive: true });

window.addEventListener("resize", updateStage);

updateHeader();
updateStage();
maybeStartCounters();
initInteractiveCharts();
initMapWidgets();
initScrollDots();
