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
    average: "평균 거래 가격",
    rank: "선택 지역 순위",
    trendUp: "최근 12개월 추세가 완만하게 상승했습니다.",
    trendDown: "최근 12개월 추세가 조정 구간에 들어섰습니다.",
    trendFlat: "최근 12개월 추세가 비교적 안정적으로 유지됐습니다."
  },
  en: {
    average: "Average transaction price",
    rank: "Selected region rank",
    trendUp: "The 12-month trend moved upward gradually.",
    trendDown: "The 12-month trend entered a correction phase.",
    trendFlat: "The 12-month trend stayed comparatively stable."
  }
};

const graphData = [
  {
    id: "seoul",
    color: "#8f1d21",
    cluster: { ko: "서울 평균", en: "Seoul Average" },
    name: { ko: "서울 평균", en: "Seoul Average" },
    value: 15.2,
    trend: [14.7, 14.8, 14.9, 15.0, 15.1, 15.0, 15.2, 15.3, 15.2, 15.4, 15.3, 15.2]
  },
  {
    id: "gangnam",
    color: "#1d4f91",
    cluster: { ko: "상위권", en: "Upper Tier" },
    name: { ko: "강남구", en: "Gangnam" },
    value: 27.4,
    trend: [25.9, 26.1, 26.3, 26.8, 26.9, 27.0, 27.1, 27.3, 27.2, 27.4, 27.5, 27.4]
  },
  {
    id: "seocho",
    color: "#1d4f91",
    cluster: { ko: "상위권", en: "Upper Tier" },
    name: { ko: "서초구", en: "Seocho" },
    value: 25.8,
    trend: [24.8, 25.0, 25.2, 25.3, 25.6, 25.7, 25.6, 25.8, 26.0, 25.9, 25.8, 25.8]
  },
  {
    id: "songpa",
    color: "#1d4f91",
    cluster: { ko: "상위권", en: "Upper Tier" },
    name: { ko: "송파구", en: "Songpa" },
    value: 21.9,
    trend: [21.2, 21.4, 21.5, 21.6, 21.8, 21.9, 21.7, 21.8, 22.0, 21.9, 22.1, 21.9]
  },
  {
    id: "mapo",
    color: "#0b7f72",
    cluster: { ko: "중간권", en: "Middle Tier" },
    name: { ko: "마포구", en: "Mapo" },
    value: 16.8,
    trend: [16.1, 16.3, 16.4, 16.5, 16.7, 16.8, 16.8, 16.9, 16.7, 16.8, 16.9, 16.8]
  },
  {
    id: "gwangjin",
    color: "#0b7f72",
    cluster: { ko: "중간권", en: "Middle Tier" },
    name: { ko: "광진구", en: "Gwangjin" },
    value: 14.9,
    trend: [14.5, 14.5, 14.6, 14.7, 14.8, 14.8, 14.9, 15.0, 14.9, 15.0, 14.9, 14.9]
  },
  {
    id: "gangseo",
    color: "#3f7d45",
    cluster: { ko: "하위권", en: "Lower Tier" },
    name: { ko: "강서구", en: "Gangseo" },
    value: 10.7,
    trend: [10.9, 10.8, 10.8, 10.7, 10.7, 10.6, 10.7, 10.8, 10.7, 10.7, 10.6, 10.7]
  },
  {
    id: "dobong",
    color: "#3f7d45",
    cluster: { ko: "하위권", en: "Lower Tier" },
    name: { ko: "도봉구", en: "Dobong" },
    value: 7.8,
    trend: [8.1, 8.0, 7.9, 7.9, 7.8, 7.8, 7.7, 7.8, 7.8, 7.7, 7.8, 7.8]
  }
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
  { id: "gangnam", cluster: { ko: "강남권", en: "Southeast Seoul" }, name: { ko: "강남구", en: "Gangnam-gu" }, price: 27.4, note: { ko: "서울 내 상위권 더미 평균 시세입니다.", en: "A top-tier dummy average price in Seoul." } },
  { id: "gangdong", cluster: { ko: "강동권", en: "Eastern Seoul" }, name: { ko: "강동구", en: "Gangdong-gu" }, price: 16.1, note: { ko: "동부 생활권 수요를 반영한 예시 값입니다.", en: "A sample value for eastern Seoul demand." } },
  { id: "gangbuk", cluster: { ko: "강북권", en: "Northern Seoul" }, name: { ko: "강북구", en: "Gangbuk-gu" }, price: 8.4, note: { ko: "북부 주거권 평균을 설명하는 더미 값입니다.", en: "A dummy value for northern residential Seoul." } },
  { id: "gangseo", cluster: { ko: "서남권", en: "Western Seoul" }, name: { ko: "강서구", en: "Gangseo-gu" }, price: 10.7, note: { ko: "서부 교통권 특성을 반영한 예시 값입니다.", en: "A sample value reflecting western transit access." } },
  { id: "gwanak", cluster: { ko: "서남권", en: "Southwest Seoul" }, name: { ko: "관악구", en: "Gwanak-gu" }, price: 10.2, note: { ko: "대학가와 주거 수요가 섞인 예시 값입니다.", en: "A sample value mixing campus and housing demand." } },
  { id: "gwangjin", cluster: { ko: "동북권", en: "Northeast Seoul" }, name: { ko: "광진구", en: "Gwangjin-gu" }, price: 14.9, note: { ko: "한강변 접근성을 반영한 더미 값입니다.", en: "A dummy value reflecting Han River access." } },
  { id: "guro", cluster: { ko: "서남권", en: "Southwest Seoul" }, name: { ko: "구로구", en: "Guro-gu" }, price: 9.6, note: { ko: "산업 및 교통축 수요의 예시 값입니다.", en: "A sample value for industry and transit corridors." } },
  { id: "geumcheon", cluster: { ko: "서남권", en: "Southwest Seoul" }, name: { ko: "금천구", en: "Geumcheon-gu" }, price: 8.9, note: { ko: "서남부 업무권 특성을 반영한 더미 값입니다.", en: "A dummy value for the southwest business area." } },
  { id: "nowon", cluster: { ko: "동북권", en: "Northeast Seoul" }, name: { ko: "노원구", en: "Nowon-gu" }, price: 8.8, note: { ko: "대규모 아파트 생활권의 예시 값입니다.", en: "A sample value for a large apartment district." } },
  { id: "dobong", cluster: { ko: "동북권", en: "Northeast Seoul" }, name: { ko: "도봉구", en: "Dobong-gu" }, price: 7.8, note: { ko: "북동부 생활권의 더미 평균 시세입니다.", en: "A dummy average for northeastern Seoul." } },
  { id: "dongdaemun", cluster: { ko: "동북권", en: "Northeast Seoul" }, name: { ko: "동대문구", en: "Dongdaemun-gu" }, price: 11.7, note: { ko: "도심 접근성과 대학가 수요의 예시 값입니다.", en: "A sample value for central access and campus demand." } },
  { id: "dongjak", cluster: { ko: "서남권", en: "Southwest Seoul" }, name: { ko: "동작구", en: "Dongjak-gu" }, price: 14.3, note: { ko: "한강 이남 주거권을 반영한 더미 값입니다.", en: "A dummy value for south-of-river housing demand." } },
  { id: "mapo", cluster: { ko: "서북권", en: "Northwest Seoul" }, name: { ko: "마포구", en: "Mapo-gu" }, price: 16.8, note: { ko: "업무와 문화 수요가 섞인 예시 값입니다.", en: "A sample value mixing office and cultural demand." } },
  { id: "seodaemun", cluster: { ko: "서북권", en: "Northwest Seoul" }, name: { ko: "서대문구", en: "Seodaemun-gu" }, price: 12.6, note: { ko: "서북부 도심 접근성을 반영한 값입니다.", en: "A value reflecting northwest central access." } },
  { id: "seocho", cluster: { ko: "강남권", en: "Southeast Seoul" }, name: { ko: "서초구", en: "Seocho-gu" }, price: 25.8, note: { ko: "강남권 고가 주거지의 예시 값입니다.", en: "A sample value for premium southeast housing." } },
  { id: "seongdong", cluster: { ko: "도심권", en: "Central Seoul" }, name: { ko: "성동구", en: "Seongdong-gu" }, price: 17.2, note: { ko: "한강변 재개발 수요를 반영한 값입니다.", en: "A value reflecting riverside redevelopment demand." } },
  { id: "seongbuk", cluster: { ko: "동북권", en: "Northeast Seoul" }, name: { ko: "성북구", en: "Seongbuk-gu" }, price: 10.5, note: { ko: "북부 주거 및 대학가 수요의 예시 값입니다.", en: "A sample value for northern housing and campus demand." } },
  { id: "songpa", cluster: { ko: "강남권", en: "Southeast Seoul" }, name: { ko: "송파구", en: "Songpa-gu" }, price: 21.9, note: { ko: "잠실권 수요를 반영한 더미 값입니다.", en: "A dummy value reflecting Jamsil-area demand." } },
  { id: "yangcheon", cluster: { ko: "서남권", en: "Southwest Seoul" }, name: { ko: "양천구", en: "Yangcheon-gu" }, price: 12.2, note: { ko: "목동권 교육 수요의 예시 값입니다.", en: "A sample value for Mok-dong education demand." } },
  { id: "yeongdeungpo", cluster: { ko: "서남권", en: "Southwest Seoul" }, name: { ko: "영등포구", en: "Yeongdeungpo-gu" }, price: 13.9, note: { ko: "여의도 업무권 접근성을 반영한 값입니다.", en: "A value reflecting Yeouido business access." } },
  { id: "yongsan", cluster: { ko: "도심권", en: "Central Seoul" }, name: { ko: "용산구", en: "Yongsan-gu" }, price: 22.8, note: { ko: "도심 핵심 개발 수요의 예시 값입니다.", en: "A sample value for central development demand." } },
  { id: "eunpyeong", cluster: { ko: "서북권", en: "Northwest Seoul" }, name: { ko: "은평구", en: "Eunpyeong-gu" }, price: 9.4, note: { ko: "서북부 주거권 평균을 나타내는 값입니다.", en: "A value for northwest residential Seoul." } },
  { id: "jongno", cluster: { ko: "도심권", en: "Central Seoul" }, name: { ko: "종로구", en: "Jongno-gu" }, price: 13.4, note: { ko: "도심 업무·문화축을 반영한 예시 값입니다.", en: "A sample value for central office and culture corridors." } },
  { id: "jung", cluster: { ko: "도심권", en: "Central Seoul" }, name: { ko: "중구", en: "Jung-gu" }, price: 12.8, note: { ko: "도심 핵심 업무권의 더미 값입니다.", en: "A dummy value for the central business district." } },
  { id: "jungnang", cluster: { ko: "동북권", en: "Northeast Seoul" }, name: { ko: "중랑구", en: "Jungnang-gu" }, price: 8.7, note: { ko: "동북부 생활권을 설명하는 예시 값입니다.", en: "A sample value for northeastern Seoul living areas." } }
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
  chart.querySelector("[data-detail-value]").textContent = selected.value.toFixed(1);
  chart.querySelector("[data-detail-note]").textContent = `${labels.average}: ${selected.value.toFixed(1)} | ${labels.rank}: ${rank}/${graphData.length}. ${labels[getTrendType(selected.trend)]}`;
  drawSparkline(chart.querySelector("[data-sparkline]"), selected.trend);
}

function initInteractiveCharts() {
  document.querySelectorAll("[data-interactive-chart]").forEach((chart) => {
    const lang = chart.dataset.lang || "en";
    const maxValue = Math.max(...graphData.map((item) => item.value));
    const barChart = chart.querySelector("[data-bar-chart]");

    barChart.innerHTML = graphData.map((item) => {
      const height = Math.max((item.value / maxValue) * 100, 10);
      return `
        <button class="chart-bar" type="button" data-region="${item.id}" aria-pressed="false" style="--bar-color: ${item.color}">
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
  map.querySelector("[data-map-price]").textContent = lang === "ko"
    ? `${selected.price.toFixed(1)}억 원`
    : `KRW ${selected.price.toFixed(1)}B`;
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
