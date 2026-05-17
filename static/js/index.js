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
    cluster: { ko: "수도권", en: "Capital Area" },
    name: { ko: "서울", en: "Seoul" },
    price: 15.8,
    note: { ko: "전국에서 가장 높은 더미 평균 시세입니다.", en: "The highest dummy average market price in the dataset." }
  },
  {
    id: "gyeonggi",
    cluster: { ko: "수도권", en: "Capital Area" },
    name: { ko: "경기", en: "Gyeonggi" },
    price: 7.6,
    note: { ko: "서울 접근성과 신도시 수요가 반영된 예시 값입니다.", en: "A sample value reflecting Seoul access and new-town demand." }
  },
  {
    id: "incheon",
    cluster: { ko: "수도권", en: "Capital Area" },
    name: { ko: "인천", en: "Incheon" },
    price: 5.2,
    note: { ko: "수도권 내 상대적으로 낮은 더미 평균 시세입니다.", en: "A comparatively lower dummy average within the capital area." }
  },
  {
    id: "gangwon",
    cluster: { ko: "비수도권", en: "Non-capital Region" },
    name: { ko: "강원", en: "Gangwon" },
    price: 2.4,
    note: { ko: "관광 및 생활권 특성이 섞인 예시 값입니다.", en: "A sample value combining tourism and local living-area traits." }
  },
  {
    id: "chungcheong",
    cluster: { ko: "비수도권", en: "Non-capital Region" },
    name: { ko: "충청", en: "Chungcheong" },
    price: 3.1,
    note: { ko: "세종과 대전 생활권 영향을 반영한 더미 값입니다.", en: "A dummy value reflecting the influence of Sejong and Daejeon." }
  },
  {
    id: "gyeongsang",
    cluster: { ko: "비수도권", en: "Non-capital Region" },
    name: { ko: "경상", en: "Gyeongsang" },
    price: 3.7,
    note: { ko: "부산, 대구 등 광역시 효과를 포함한 예시 값입니다.", en: "A sample value including effects from Busan, Daegu, and nearby cities." }
  },
  {
    id: "jeolla",
    cluster: { ko: "비수도권", en: "Non-capital Region" },
    name: { ko: "전라", en: "Jeolla" },
    price: 2.8,
    note: { ko: "지방권 평균을 설명하기 위한 더미 값입니다.", en: "A dummy value used to describe non-capital regional averages." }
  },
  {
    id: "jeju",
    cluster: { ko: "비수도권", en: "Non-capital Region" },
    name: { ko: "제주", en: "Jeju" },
    price: 4.4,
    note: { ko: "섬 지역의 특수성을 반영한 예시 값입니다.", en: "A sample value reflecting the island-region context." }
  }
];

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

function updateKoreaMap(map, selectedId) {
  const lang = map.dataset.lang || "en";
  const selected = koreaMapData.find((item) => item.id === selectedId) || koreaMapData[0];

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
}

function initKoreaMaps() {
  document.querySelectorAll("[data-korea-map]").forEach((map) => {
    map.querySelectorAll(".map-region").forEach((button) => {
      button.setAttribute("type", "button");
      button.setAttribute("aria-pressed", "false");
    });

    map.addEventListener("click", (event) => {
      const button = event.target.closest(".map-region");
      if (!button) return;
      updateKoreaMap(map, button.dataset.region);
    });

    updateKoreaMap(map, "seoul");
  });
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
initKoreaMaps();
