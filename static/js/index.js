const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const panels = Array.from(document.querySelectorAll("[data-stage-panel]"));
const stageBackgrounds = Array.from(document.querySelectorAll("[data-stage-bg]"));
const stage = document.querySelector(".scroll-stage");
const counters = Array.from(document.querySelectorAll("[data-count]"));
let countersStarted = false;

function getPageLang(element = null) {
  const explicitLang = element?.dataset?.lang || document.documentElement.lang || "en";
  return explicitLang.startsWith("ko") ? "ko" : "en";
}

function ensureElementAfter(anchor, selector, tagName, setup = () => {}) {
  let element = anchor.nextElementSibling;
  if (!element || !element.matches(selector)) {
    element = document.createElement(tagName);
    setup(element);
    anchor.after(element);
  }
  return element;
}

function ensureElementBefore(anchor, selector, tagName, setup = () => {}) {
  let element = anchor.previousElementSibling;
  if (!element || !element.matches(selector)) {
    element = document.createElement(tagName);
    setup(element);
    anchor.before(element);
  }
  return element;
}

function ensureCustomElementAfter(anchor, selector, createElement) {
  let element = anchor.nextElementSibling;
  if (!element || !element.matches(selector)) {
    element = createElement();
    anchor.after(element);
  }
  return element;
}

function removeNextElement(anchor, selector) {
  const element = anchor.nextElementSibling;
  if (element && element.matches(selector)) element.remove();
}

function syncParagraphAfter(anchor, selector, text, setup = () => {}) {
  const paragraph = ensureElementAfter(anchor, selector, "p", setup);
  paragraph.textContent = text;
  return paragraph;
}

function syncContentParagraphsAfter(anchor, selector, paragraphs, setup = () => {}) {
  if (!paragraphs.length) {
    removeNextElement(anchor, selector);
    return null;
  }

  const content = ensureElementAfter(anchor, selector, "div", setup);
  content.innerHTML = paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");
  return content;
}

const staticBodySections = {
  "ko": {
    "overview": "\n      <div class=\"container is-max-desktop\">\n        <p class=\"section-kicker\">Overview</p>\n        <h2 class=\"title is-3\">프로젝트 개요</h2>\n        <div class=\"content\">\n          <p>\n            최근 한국의 주택 가격은 전국적으로 상승했지만, 특히 서울과 수도권을 중심으로 가격 상승이 집중되며 지역 간 격차가 더욱 심화되었습니다. 본 프로젝트는 KB국민은행의 KB부동산 데이터를 중심으로 서울과 지방의 주택 가격 차이를 시각적으로 분석하고, 이러한 불균형이 어떤 사회적·경제적 요인과 연결되는지를 탐구합니다.\n          </p>\n          <p>\n            먼저, 전국 평균 집값과 서울 집값을 비교하여 한국 부동산 시장의 전반적인 구조를 확인하며, 이후 서울 집값 상승률 변화를 분석하여 특정 시기에 가격이 급격하게 상승한 현상을 보여줍니다. 또한 서울과 지방의 인프라 차이를 교육, 교통, 일자리 측면에서 비교함으로써 왜 수도권 집중 현상이 지속되는지를 설명합니다.\n          </p>\n          <p>\n            다음으로 정부의 금융 규제와 대출 정책이 실제 주택 구매와 어떤 관계를 가지는지를 분석합니다. 특히 대출 규제 강화와 가계부채 증가, 그리고 정권별 집값 상승률 변화를 함께 시각화하여 정부 정책이 시장 안정에 얼마나 효과적이었는지를 탐구합니다. 마지막으로 정책적 방향성과 향후 해결 방안을 제시하며 프로젝트를 마무리하고자 합니다.\n          </p>\n          <p>\n            본 프로젝트는 단순히 “집값이 올랐다”는 현상을 보여주는 것이 아니라, 한국 부동산 시장이 왜 서울 중심으로 불균형하게 성장하고 있는지를 데이터 기반 시각화를 통해 설명하는 것을 목표로 하고 있습니다.\n          </p>\n          <div class=\"author-block\">\n            <h3>저자</h3>\n            <p><strong>배인성</strong><br>데이터과학과, 2학년, 한국조지메이슨대학교</p>\n            <p><strong>천수영</strong><br>경제학과, 2학년, 한국조지메이슨대학교</p>\n            <p><strong>최혁준</strong><br>데이터과학과, 3학년, 한국조지메이슨대학교</p>\n          </div>\n        </div>\n      </div>",
    "analysis": "\n      <div class=\"container is-max-desktop\">\n        <p class=\"section-kicker\">Analysis</p>\n        <h2 class=\"title is-3\">분석 내용</h2>\n        <nav class=\"doc-toc\" aria-label=\"분석 내용 목차\">\n          <strong>목차</strong>\n          <ol>\n            <li><a href=\"#analysis-intro\"><span>1.</span> 시작하기에 앞서</a></li>\n            <li><a href=\"#analysis-map\"><span>2.</span> 지도로 보는 대한민국의 집값</a></li>\n            <li><a href=\"#analysis-seoul-growth\"><span>3.</span> 서울시 집값의 상승률</a></li>\n            <li><a href=\"#analysis-gap\"><span>4.</span> 서울, 수도권과 지방의 가격 차이</a></li>\n            <li><a href=\"#analysis-regulations\"><span>5.</span> 여러 가지 규제들의 장벽</a></li>\n            <li><a href=\"#analysis-conclusion\"><span>6.</span> 결론</a></li>\n          </ol>\n        </nav>\n        <h3 id=\"analysis-intro\" class=\"analysis-subtitle\"><span>1.</span> 시작하기에 앞서</h3>\n        <p>\n          현재 본 사이트와 분석 단계에서 이용하는 부동산 시세 데이터 정보는 KB부동산 데이터허브의 2026.03자로 발표된 데이터를 기준으로 하며, 아파트의 공급 면적에 있어서는 다양한 변수가 존재하기 때문에 중소형 공급 면적 (전용 60㎡ 이상 85㎡ 미만)을 기준으로 평균 가격을 산정했습니다. 추후 신규 데이터 발표에 따라 본 자료에 사용되는 데이터에 대해 수정이 가해질 수 있습니다.\n        </p>\n        <p>\n          본 컨텐츠는 부동산 시세, 정부의 정책 등과 같은 정치적으로 다소 민감할 수 있는 소재를 다루고 있습니다. 본 연구팀은 본 연구가 교내 혹은 대외적인 정치적 논쟁거리로 소비되는 것을 희망하지 않으며, 소속 팀원 각각의 정치 성향, 소속 정당 등의 다양한 요소에서 발생할 수 있는 모든 정치적 변수 사항을 최대한 배제하고 학문적으로 본 데이터에 접근한 결과와 연구 결론을 도출하기 위해 최선의 노력을 기하고 있습니다.\n        </p>\n\n        <h3 id=\"analysis-map\" class=\"analysis-subtitle\"><span>2.</span> 지도로 보는 대한민국의 집값</h3>\n        <p>\n          본격적으로 시작하기에 앞서, 아래의 히트맵은 2025년 04월부터 2026년 03월까지의 KB부동산 데이터를 기반으로 대한민국 주요 권역 간의 집값 차이를 보여줍니다. 히트맵에 위치한 버튼을 눌러보며 해당 지역의 시세를 확인하고, 권역별 시세도 확인할 수 있습니다.\n        </p>\n        <p class=\"chart-intro-text\">행정구역별 버튼을 선택하면 해당 구역의 최근 12개월 간 아파트 평균 거래가격을 확인할 수 있습니다. 시세 강조 지도로 전환 시, 지역별 시세가 색깔별로 강조된 지도로 변합니다.</p>\n        <div class=\"interactive-chart heatmap-chart\">\n          <div class=\"chart-head\">\n            <div>\n              <p class=\"chart-label\">Heatmap Visualization</p>\n            <h3>대한민국 행정구역별 평균 시세 히트맵</h3>\n          </div>\n          <aside class=\"map-detail\" aria-live=\"polite\">\n            <span data-map-cluster>수도권</span>\n            <h4 data-map-name>서울</h4>\n            <strong data-map-price>0.0</strong>\n            <p data-map-note>지역을 클릭하면 예시 평균 시세가 표시됩니다.</p>\n          </aside>\n        </div>\n        <div class=\"map-widget korea-map-widget\" data-map-widget data-map-type=\"korea\" data-lang=\"ko\" data-map-view=\"region\">\n          <div class=\"map-view-toggle\" role=\"group\" aria-label=\"대한민국 지도 보기 방식\">\n            <button class=\"map-view-button is-active\" type=\"button\" data-map-view-option=\"region\" aria-pressed=\"true\">행정구역/권역별 보기</button>\n            <button class=\"map-view-button\" type=\"button\" data-map-view-option=\"price\" aria-pressed=\"false\">시세 강조 지도 보기</button>\n          </div>\n          <div class=\"map-panel korea-map-panel\">\n            <div class=\"korea-map\" role=\"img\" aria-label=\"대한민국 시도 단위 클릭형 지도\">\n              <img src=\"./static/images/southKoreaLow.svg?v=20260518-20\" alt=\"\" aria-hidden=\"true\" data-map-svg>\n            </div>\n            <div class=\"map-price-legend\" data-map-legend aria-label=\"시세 색상 범례\"></div>\n            <div class=\"map-region-list\" aria-label=\"대한민국 지역 버튼\">\n              <button class=\"map-region\" data-region=\"seoul\">서울특별시</button>\n              <button class=\"map-region\" data-region=\"incheon\">인천광역시</button>\n              <button class=\"map-region\" data-region=\"gyeonggi\">경기도</button>\n              <button class=\"map-region\" data-region=\"gangwon\">강원특별자치도</button>\n              <button class=\"map-region\" data-region=\"daejeon\">대전광역시</button>\n              <button class=\"map-region\" data-region=\"sejong\">세종특별자치시</button>\n              <button class=\"map-region\" data-region=\"chungbuk\">충청북도</button>\n              <button class=\"map-region\" data-region=\"chungnam\">충청남도</button>\n              <button class=\"map-region\" data-region=\"gwangju\">광주광역시</button>\n              <button class=\"map-region\" data-region=\"jeonnam\">전라남도</button>\n              <button class=\"map-region\" data-region=\"jeonbuk\">전북특별자치도</button>\n              <button class=\"map-region\" data-region=\"busan\">부산광역시</button>\n              <button class=\"map-region\" data-region=\"ulsan\">울산광역시</button>\n              <button class=\"map-region\" data-region=\"daegu\">대구광역시</button>\n              <button class=\"map-region\" data-region=\"gyeongbuk\">경상북도</button>\n              <button class=\"map-region\" data-region=\"gyeongnam\">경상남도</button>\n              <button class=\"map-region\" data-region=\"jeju\">제주도</button>\n              <button class=\"map-region map-region-divider\" data-region=\"capitalArea\">수도권 평균</button>\n              <button class=\"map-region\" data-region=\"gangwonJeju\">강원/제주권 평균</button>\n              <button class=\"map-region\" data-region=\"chungcheong\">충청권 평균</button>\n              <button class=\"map-region\" data-region=\"honam\">호남권 평균</button>\n              <button class=\"map-region\" data-region=\"southeast\">동남권 평균</button>\n              <button class=\"map-region\" data-region=\"daeguGyeongbuk\">대구/경북권 평균</button>\n            </div>\n          </div>\n          <p class=\"map-source-note\">* 2025.04-2026.03 KB부동산 자료 기준 1년 평균 거래가격에 기반함.</p>\n        </div>\n        </div>\n        <p>\n          본 히트맵은 현재 대한민국의 부동산 시세가 가지는 현황을 짚어주는 목적에서 등장합니다. 보이다시피, 서울 지역이 타 지역 대비 압도적으로 높은 시세를 형성한 것을 보여주고 있습니다. 이제, 본격적으로 왜 서울이 타 지역 대비 시세가 높은 것인가에 대해 분석을 진행해 보겠습니다.\n        </p>\n\n        <h3 id=\"analysis-seoul-growth\" class=\"analysis-subtitle\"><span>3.</span> 서울시 집값의 상승률</h3>\n        <p>\n          서울시의 집값이 타 지역 대비 높다는 점이 앞에서 짚어드린 히트맵에서도 확연히 드러납니다. 그렇다면, 상세한 서울 권역별 거래 가격은 어떨까에 대한 의문점을 짚고 넘어갈 필요도 있다고 생각됩니다. 본 히트맵은, 서울 권역별 거래 가격을 상세하게 짚어주는 히트맵입니다.\n        </p>\n        <p class=\"chart-intro-text\">행정구역별 버튼을 선택하면 해당 구역의 최근 12개월 간 아파트 평균 거래가격을 확인할 수 있습니다. 시세 강조 지도로 전환 시, 지역별 시세가 색깔별로 강조된 지도로 변합니다.</p>\n        <div class=\"interactive-chart heatmap-chart\">\n          <div class=\"chart-head\">\n            <div>\n              <p class=\"chart-label\">Heatmap Visualization</p>\n            <h3>서울시 행정구역별 평균 시세 히트맵</h3>\n          </div>\n          <aside class=\"map-detail\" aria-live=\"polite\">\n            <span data-map-cluster>서울 전체</span>\n            <h4 data-map-name>서울 평균</h4>\n            <strong data-map-price>0.0</strong>\n            <p data-map-note>구를 클릭하면 해당 지역 색상이 선명해지고 평균 가격이 표시됩니다.</p>\n          </aside>\n        </div>\n        <div class=\"map-widget seoul-map-widget\" data-map-widget data-map-type=\"seoul\" data-lang=\"ko\" data-default-region=\"seoul\" data-map-view=\"region\">\n          <div class=\"map-view-toggle\" role=\"group\" aria-label=\"서울 지도 보기 방식\">\n            <button class=\"map-view-button is-active\" type=\"button\" data-map-view-option=\"region\" aria-pressed=\"true\">행정구역별 보기</button>\n            <button class=\"map-view-button\" type=\"button\" data-map-view-option=\"price\" aria-pressed=\"false\">시세 강조 지도 보기</button>\n          </div>\n          <div class=\"map-panel\">\n            <div class=\"seoul-map\" role=\"img\" aria-label=\"서울 구 단위 클릭형 지도\">\n              <img src=\"./static/images/Seoul_districts.svg?v=20260518-20\" alt=\"\" aria-hidden=\"true\" data-map-svg>\n            </div>\n            <div class=\"map-price-legend\" data-map-legend aria-label=\"시세 색상 범례\"></div>\n            <div class=\"map-region-list\" aria-label=\"서울 지역 버튼\">\n              <button class=\"map-region\" data-region=\"seoul\">서울 전체</button>\n              <button class=\"map-region\" data-region=\"gangnam\">강남구</button>\n              <button class=\"map-region\" data-region=\"seocho\">서초구</button>\n              <button class=\"map-region\" data-region=\"songpa\">송파구</button>\n              <button class=\"map-region\" data-region=\"yongsan\">용산구</button>\n              <button class=\"map-region\" data-region=\"seongdong\">성동구</button>\n              <button class=\"map-region\" data-region=\"mapo\">마포구</button>\n              <button class=\"map-region\" data-region=\"gwangjin\">광진구</button>\n              <button class=\"map-region\" data-region=\"dongjak\">동작구</button>\n              <button class=\"map-region\" data-region=\"yeongdeungpo\">영등포구</button>\n              <button class=\"map-region\" data-region=\"seodaemun\">서대문구</button>\n              <button class=\"map-region\" data-region=\"yangcheon\">양천구</button>\n              <button class=\"map-region\" data-region=\"dongdaemun\">동대문구</button>\n              <button class=\"map-region\" data-region=\"seongbuk\">성북구</button>\n              <button class=\"map-region\" data-region=\"gangseo\">강서구</button>\n              <button class=\"map-region\" data-region=\"gwanak\">관악구</button>\n              <button class=\"map-region\" data-region=\"guro\">구로구</button>\n              <button class=\"map-region\" data-region=\"eunpyeong\">은평구</button>\n              <button class=\"map-region\" data-region=\"geumcheon\">금천구</button>\n              <button class=\"map-region\" data-region=\"nowon\">노원구</button>\n              <button class=\"map-region\" data-region=\"jung\">중구</button>\n              <button class=\"map-region\" data-region=\"jongno\">종로구</button>\n              <button class=\"map-region\" data-region=\"gangdong\">강동구</button>\n              <button class=\"map-region\" data-region=\"jungnang\">중랑구</button>\n              <button class=\"map-region\" data-region=\"gangbuk\">강북구</button>\n              <button class=\"map-region\" data-region=\"dobong\">도봉구</button>\n            </div>\n          </div>\n          <p class=\"map-source-note\">* 2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 1년 평균 거래가격에 기반함.</p>\n          <p class=\"map-source-note\">** 양천구와 서울시 평균이 표기 상으로는 14억으로 동일하나, 서울시 평균 거래가는 반올림을 적용한 소숫점 3단위까지 표기할 경우 14.041억원으로 집계되며, 양천구의 경우는 14.033억원으로 집계됨.</p>\n        </div>\n        </div>\n        <p>\n          저희가 선정한 상급지와 하급지가 명확히 나뉘는 기준은 최근 1년간의 KB부동산 데이터 기반 서울시 실거래가 평균이 기준입니다. 하지만, 상급지와 하급지를 나눈다고 해서 단순히 모든 것이 설명되는 것은 아니기에, 이번에는 해당 지역의 최근 12개월 간 거래가 변동 추이도 짚고 넘어가려고 합니다.\n        </p>\n        <p class=\"chart-intro-text\">서울 전체 또는 구 버튼을 선택하면 해당 지역의 최근 12개월 아파트 거래가격 변동을 직선그래프로 확인할 수 있습니다.</p>\n        <div class=\"interactive-chart\" data-interactive-chart data-lang=\"ko\">\n          <div class=\"chart-head\">\n            <div>\n              <p class=\"chart-label\">Trend Tracking Visualization</p>\n              <h3>서울시 행정구별 최근 12개월 집값 변동 추이</h3>\n            </div>\n            <aside class=\"chart-detail\" data-chart-detail aria-live=\"polite\">\n              <span data-detail-cluster>Seoul</span>\n              <h4 data-detail-name>Seoul Average</h4>\n              <strong data-detail-value>0.00</strong>\n              <p data-detail-note>구를 선택하면 이 영역에 월별 추세 요약이 표시됩니다.</p>\n            </aside>\n          </div>\n          <div class=\"chart-layout\">\n            <div class=\"chart-selector\" data-chart-selector aria-label=\"서울 지역별 추세 버튼\"></div>\n            <div class=\"line-chart\" data-line-chart aria-label=\"선택 지역 12개월 추세 직선 그래프\"></div>\n          </div>\n          <p class=\"map-source-note\">* 2025.04-2026.03 KB부동산 자료 기준 서울시 전체 및 행정구역별 최근 12개월 아파트 거래가격 변동 추이에 기반함.</p>\n        </div>\n        <h3 id=\"analysis-gap\" class=\"analysis-subtitle\"><span>4.</span> 서울, 수도권과 지방의 가격 차이</h3>\n        <p>\n          다만, 서울시의 집값이 너무 높다는 것을 짚기에는 왜 수도권의 집값도 똑같이 높은 것인가라는 반박이 있을 수 있습니다. 이에 대한 데이터도 짚고 넘어가고자 합니다.\n        </p>\n        <div class=\"interactive-chart\" data-comparison-chart data-comparison-type=\"capital\" data-lang=\"ko\"></div>\n        <p>수도권 주요 지역의 선정 근거에는 다음과 같은 내용이 있습니다.</p>\n        <div class=\"reason-box\">\n          <p>인천광역시 연수구: 송도국제도시</p>\n          <p>인천광역시 서구: 청라국제도시</p>\n          <p>고양시 일산동구/일산서구: 일산신도시</p>\n          <p>과천시: (구) 정부과천청사 소재지</p>\n          <p>군포시: 산본신도시</p>\n          <p>부천시 원미구: 중동신도시</p>\n          <p>성남시 분당구: 분당신도시, 판교신도시</p>\n          <p>수원시 영통구: 광교신도시</p>\n          <p>안양시 동안구: 평촌신도시</p>\n          <p>용인시 수지구: 분당신도시 연계 수지지구 개발구역, 광교신도시 일부 구역 배속</p>\n          <p>화성시 동탄구: 동탄신도시</p>\n        </div>\n        <p>(향후 추가 예정)</p>\n        <div class=\"question-callout\">\n          <p>그러면, 이러한 질문도 나올 수 있습니다.</p>\n          <p class=\"question-line\"><strong>\"왜 굳이, 서울 혹은 수도권에 집을 마련하려고 모두가 아우성인 것인가?\"</strong></p>\n          <p>그래서, 하단에 이러한 질문에 대한 답변을 준비했습니다.</p>\n        </div>\n        <div class=\"interactive-chart grdp-donut-chart\" data-grdp-donut-chart data-lang=\"ko\"></div>\n        <div class=\"interactive-chart\" data-comparison-chart data-comparison-type=\"local\" data-lang=\"ko\"></div>\n        <p>\n          저희가 선정한 지방 주요 지역은 대구 수성구, 대전 유성구, 대전 서구, 울산 남구, 세종시, 충북 청주 흥덕구, 경남 창원 성산구, 경남 창원 의창구, 부산 해운대구로 총 9개 지역입니다. 본 9개 지역은 대체로 해당 지역 및 인근 지역 대비 집값이 상대적으로 높게 집계되는 지역들입니다. 이러한 지역들에 대해 저희가 분석을 진행한 결과, 크게 2가지의 경우로 나눌 수 있었습니다.\n        </p>\n        <p>\n          첫 번째는, 바로 교육과 연관된 경우입니다. 대구 수성구, 대전 유성구, 대전 서구, 울산 남구, 부산 해운대구가 이에 해당하는 지역입니다. 이들 지역의 공통점으로는, 교육열이 상당히 높은 지역이라는 점입니다. 이러한 점은, 해당 지역 내에 소재한 학원의 갯수로도 직관적으로 연결됩니다.\n        </p>\n        <p>(향후 추가 예정)</p>\n        <p>\n          두 번째는, 특정 산업과 연관된 경우입니다. 세종시, 충북 청주 흥덕구, 경남 창원 성산구, 경남 창원 의창구가 그 예시입니다.\n        </p>\n        <p>(향후 추가 예정)</p>\n\n        <h3 id=\"analysis-regulations\" class=\"analysis-subtitle\"><span>5.</span> 여러 가지 규제들의 장벽</h3>\n        <p>\n          주택 구매는 가격뿐 아니라 대출 한도, 금융 규제, 정책 조건에 의해 제한되며, 이러한 장벽이 실제 구매 가능성에 미치는 영향을 살펴봅니다.\n        </p>\n\n        <h3 id=\"analysis-conclusion\" class=\"analysis-subtitle\"><span>6.</span> 결론</h3>\n        <p>\n          서울 중심의 집값 불균형은 단순한 가격 문제가 아니라 인프라, 일자리, 금융 접근성, 정책 설계가 얽힌 구조적 문제임을 데이터 시각화를 통해 정리합니다.\n        </p>\n      </div>",
    "notes": "\n      <div class=\"container is-max-desktop\">\n        <h2 class=\"title is-3\">참고사항</h2>\n        <div class=\"content\">\n          <p>\n            본 프로젝트는 현재 지속해서 연구개발이 진행되고 있는 프로젝트이며, 향후 인원의 추가가 있을 수 있습니다.\n          </p>\n          <p>\n            현재까지의 진행상황은 다음과 같습니다<br>\n            : 현재 정부 규제에 따른 부동산 실거래 활성화 추이, 가계부채 대비 집값 상승률, 수도권 지역 공급 확대 가능성 분석 진행 중 / 기업 본사 분포도 현황 데이터 취득 및 지방 학군지 관련 추가 정보 취득 후 지방 가격관련 추이에 대한 보완자료 추가 예정\n          </p>\n          <h3>이미지 출처</h3>\n          <p>헬리오시티 (서울 송파구 가락동) 주간 전경 - 헬리오시티 국평 24억→12억?…정말 이 가격에 살 수 있나, 매일경제 | <a href=\"https://www.mk.co.kr/news/realestate/10606037\" target=\"_blank\" rel=\"noopener\">https://www.mk.co.kr/news/realestate/10606037</a></p>\n          <p>롯데월드타워 (서울 송파구 신천동) 일몰 전경 - 롯데월드타워·몰, 지난해 역대 최다 방문객 수 기록...\"5500만명 방문\", 뉴스1 | <a href=\"https://www.news1.kr/industry/distribution/5299635\" target=\"_blank\" rel=\"noopener\">https://www.news1.kr/industry/distribution/5299635</a></p>\n          <p>래미안 원베일리 (서울 서초구 반포동) 야경 전경 - 삼성물산 건설부문 포트폴리오 | <a href=\"https://secc.co.kr/ko/business/portfolio/all/300\" target=\"_blank\" rel=\"noopener\">https://secc.co.kr/ko/business/portfolio/all/300</a></p>\n          <h3>참고 데이터 및 사이트</h3>\n          <p>KB부동산 데이터허브, KB국민은행 제공 | <a href=\"https://data.kbland.kr/\" target=\"_blank\" rel=\"noopener\">https://data.kbland.kr/</a></p>\n          <p>부동산통계정보시스템, 한국부동산원 제공 | <a href=\"https://www.reb.or.kr/r-one/portal/main/indexPage.do\" target=\"_blank\" rel=\"noopener\">https://www.reb.or.kr/r-one/portal/main/indexPage.do</a></p>\n          <p>공공데이터포털, 행정안전부 제공 | <a href=\"https://www.data.go.kr/index.do\" target=\"_blank\" rel=\"noopener\">https://www.data.go.kr/index.do</a></p>\n          <h3>참고 인터뷰</h3>\n          <p>미래에셋증권 Sage마케팅팀 성다야 수석매니저님</p>\n          <p>미래에셋증권 Sage컨설팅팀 정숙희 부동산 수석컨설턴트님</p>\n        </div>\n      </div>",
    "contact": "\n      <div class=\"container is-max-desktop\">\n        <p class=\"section-kicker\">Contact</p>\n        <h2 class=\"title is-3\">프로젝트 합류 문의</h2>\n        <div class=\"content\">\n          <p>프로젝트 합류 또는 데이터 시각화 협업 문의는 저자 팀을 통해 전달해 주세요.</p>\n        </div>\n      </div>"
  },
  "en": {
    "overview": "\n      <div class=\"container is-max-desktop\">\n        <p class=\"section-kicker\">Overview</p>\n        <h2 class=\"title is-3\">Project Overview</h2>\n        <div class=\"content\">\n          <p>\n            Recent housing prices in Korea have risen nationwide, but the increase has been especially concentrated in Seoul and the greater metropolitan area, deepening regional disparities. Centered on KB Real Estate data from KB Kookmin Bank, this project visually analyzes the housing price gap between Seoul and other regions and explores how this imbalance is connected to social and economic factors.\n          </p>\n          <p>\n            First, the project compares the national average housing price with Seoul housing prices to examine the overall structure of Korea's real estate market. It then analyzes changes in Seoul's housing price growth rate to show how prices rose sharply during specific periods. It also compares infrastructure differences between Seoul and non-capital regions in terms of education, transportation, and jobs to explain why concentration in the metropolitan area continues.\n          </p>\n          <p>\n            Next, the project analyzes how government financial regulations and lending policies relate to actual home purchases. In particular, it visualizes stricter lending regulations, rising household debt, and housing price growth rates by administration to explore how effective government policy has been in stabilizing the market. Finally, the project concludes by suggesting policy directions and future solutions.\n          </p>\n          <p>\n            This project does not simply show that housing prices have risen. Its goal is to explain, through data-based visualization, why Korea's real estate market has grown unevenly around Seoul.\n          </p>\n          <div class=\"author-block\">\n            <h3>Authors</h3>\n            <p><strong>Insung Bae</strong><br>Computational &amp; Data Sciences, B.S., George Mason University Korea, Sophomore</p>\n            <p><strong>Sooyeong Cheon</strong><br>Economics, B.S., George Mason University Korea, Sophomore</p>\n            <p><strong>Hyukjoon Choi</strong><br>Computational &amp; Data Sciences, B.S., George Mason University Korea, Junior</p>\n          </div>\n        </div>\n      </div>",
    "analysis": "\n      <div class=\"container is-max-desktop\">\n        <p class=\"section-kicker\">Analysis</p>\n        <h2 class=\"title is-3\">Contents</h2>\n        <nav class=\"doc-toc\" aria-label=\"Contents table of contents\">\n          <strong>Contents</strong>\n          <ol>\n            <li><a href=\"#analysis-intro\"><span>1.</span> Before We Begin</a></li>\n            <li><a href=\"#analysis-map\"><span>2.</span> Korea Housing Prices on a Map</a></li>\n            <li><a href=\"#analysis-seoul-growth\"><span>3.</span> Seoul Housing Price Growth Rate</a></li>\n            <li><a href=\"#analysis-gap\"><span>4.</span> Price Gap Between Seoul, the Capital Area, and Other Regions</a></li>\n            <li><a href=\"#analysis-regulations\"><span>5.</span> Barriers Created by Regulations</a></li>\n            <li><a href=\"#analysis-conclusion\"><span>6.</span> Conclusion</a></li>\n          </ol>\n        </nav>\n        <h3 id=\"analysis-intro\" class=\"analysis-subtitle\"><span>1.</span> Before We Begin</h3>\n        <p>\n          The real estate price data used on this site and in the analysis is based on the dataset published by KB Real Estate Data Hub for March 2026. Because apartment supply area can vary in many ways, the average prices are calculated using small-to-medium units with exclusive areas of at least 60㎡ and less than 85㎡. Future releases may lead to revisions of the data used in this material.\n        </p>\n        <p>\n          This content addresses topics that may be politically sensitive, including real estate prices and government policy. The research team does not wish for this work to be used as a political controversy inside or outside the university, and has made every effort to approach the data academically while excluding political variables such as each team member's political orientation or party affiliation.\n        </p>\n\n        <h3 id=\"analysis-map\" class=\"analysis-subtitle\"><span>2.</span> Korea Housing Prices on a Map</h3>\n        <p>\n          Before moving into the full analysis, the heatmap below uses KB Real Estate data from April 2025 to March 2026 to show housing-price differences among major Korean regions. Try selecting buttons on the heatmap to check each region's price level and compare regional averages.\n        </p>\n        <p class=\"chart-intro-text\">Select an administrative-region button to view the recent 12-month average apartment transaction price. Switching to the price-highlight map emphasizes each region's price level by color.</p>\n        <div class=\"interactive-chart heatmap-chart\">\n          <div class=\"chart-head\">\n            <div>\n              <p class=\"chart-label\">Heatmap Visualization</p>\n            <h3>Average Housing Price Heatmap by Korean Administrative Region</h3>\n          </div>\n          <aside class=\"map-detail\" aria-live=\"polite\">\n            <span data-map-cluster>Capital Area</span>\n            <h4 data-map-name>Seoul</h4>\n            <strong data-map-price>0.0</strong>\n            <p data-map-note>Click a region to view the sample average market price.</p>\n          </aside>\n        </div>\n        <div class=\"map-widget korea-map-widget\" data-map-widget data-map-type=\"korea\" data-lang=\"en\" data-map-view=\"region\">\n          <div class=\"map-view-toggle\" role=\"group\" aria-label=\"Korea map view mode\">\n            <button class=\"map-view-button is-active\" type=\"button\" data-map-view-option=\"region\" aria-pressed=\"true\">Administrative / Regional View</button>\n            <button class=\"map-view-button\" type=\"button\" data-map-view-option=\"price\" aria-pressed=\"false\">Price Highlight Map</button>\n          </div>\n          <div class=\"map-panel korea-map-panel\">\n            <div class=\"korea-map\" role=\"img\" aria-label=\"Clickable map of South Korea by administrative region\">\n              <img src=\"./static/images/southKoreaLow.svg?v=20260518-20\" alt=\"\" aria-hidden=\"true\" data-map-svg>\n            </div>\n            <div class=\"map-price-legend\" data-map-legend aria-label=\"Price color legend\"></div>\n            <div class=\"map-region-list\" aria-label=\"Korea region buttons\">\n              <button class=\"map-region\" data-region=\"seoul\">Seoul</button>\n              <button class=\"map-region\" data-region=\"incheon\">Incheon</button>\n              <button class=\"map-region\" data-region=\"gyeonggi\">Gyeonggi</button>\n              <button class=\"map-region\" data-region=\"gangwon\">Gangwon</button>\n              <button class=\"map-region\" data-region=\"daejeon\">Daejeon</button>\n              <button class=\"map-region\" data-region=\"sejong\">Sejong</button>\n              <button class=\"map-region\" data-region=\"chungbuk\">Chungbuk</button>\n              <button class=\"map-region\" data-region=\"chungnam\">Chungnam</button>\n              <button class=\"map-region\" data-region=\"gwangju\">Gwangju</button>\n              <button class=\"map-region\" data-region=\"jeonnam\">Jeonnam</button>\n              <button class=\"map-region\" data-region=\"jeonbuk\">Jeonbuk</button>\n              <button class=\"map-region\" data-region=\"busan\">Busan</button>\n              <button class=\"map-region\" data-region=\"ulsan\">Ulsan</button>\n              <button class=\"map-region\" data-region=\"daegu\">Daegu</button>\n              <button class=\"map-region\" data-region=\"gyeongbuk\">Gyeongbuk</button>\n              <button class=\"map-region\" data-region=\"gyeongnam\">Gyeongnam</button>\n              <button class=\"map-region\" data-region=\"jeju\">Jeju</button>\n              <button class=\"map-region map-region-divider\" data-region=\"capitalArea\">Capital Area Avg.</button>\n              <button class=\"map-region\" data-region=\"gangwonJeju\">Gangwon/Jeju Avg.</button>\n              <button class=\"map-region\" data-region=\"chungcheong\">Chungcheong Avg.</button>\n              <button class=\"map-region\" data-region=\"honam\">Honam Avg.</button>\n              <button class=\"map-region\" data-region=\"southeast\">Southeast Avg.</button>\n              <button class=\"map-region\" data-region=\"daeguGyeongbuk\">Daegu/Gyeongbuk Avg.</button>\n            </div>\n          </div>\n          <p class=\"map-source-note\">* Based on the one-year average transaction price from KB Real Estate data, 2025.04-2026.03.</p>\n        </div>\n        </div>\n        <p>\n          This heatmap is included to frame the current state of real estate prices in Korea. As shown, Seoul forms a price level that is overwhelmingly higher than other regions. We now move into an analysis of why Seoul prices are higher than those of other regions.\n        </p>\n\n        <h3 id=\"analysis-seoul-growth\" class=\"analysis-subtitle\"><span>3.</span> Seoul Housing Price Growth Rate</h3>\n        <p>\n          The previous heatmap clearly shows that Seoul's housing prices are higher than those of other regions. This raises a more detailed question: how do transaction prices differ within Seoul itself? The following heatmap examines transaction prices by Seoul administrative district.\n        </p>\n        <p class=\"chart-intro-text\">Select an administrative-district button to view the recent 12-month average apartment transaction price. Switching to the price-highlight map emphasizes each district's price level by color.</p>\n        <div class=\"interactive-chart heatmap-chart\">\n          <div class=\"chart-head\">\n            <div>\n              <p class=\"chart-label\">Heatmap Visualization</p>\n            <h3>Average Housing Price Heatmap by Seoul Administrative District</h3>\n          </div>\n          <aside class=\"map-detail\" aria-live=\"polite\">\n            <span data-map-cluster>Seoul Average</span>\n            <h4 data-map-name>Seoul Average</h4>\n            <strong data-map-price>0.0</strong>\n            <p data-map-note>Click a district to sharpen its color and view its average price.</p>\n          </aside>\n        </div>\n        <div class=\"map-widget seoul-map-widget\" data-map-widget data-map-type=\"seoul\" data-lang=\"en\" data-default-region=\"seoul\" data-map-view=\"region\">\n          <div class=\"map-view-toggle\" role=\"group\" aria-label=\"Seoul map view mode\">\n            <button class=\"map-view-button is-active\" type=\"button\" data-map-view-option=\"region\" aria-pressed=\"true\">Administrative View</button>\n            <button class=\"map-view-button\" type=\"button\" data-map-view-option=\"price\" aria-pressed=\"false\">Price Highlight Map</button>\n          </div>\n          <div class=\"map-panel\">\n            <div class=\"seoul-map\" role=\"img\" aria-label=\"Clickable map of Seoul by district\">\n              <img src=\"./static/images/Seoul_districts.svg?v=20260518-20\" alt=\"\" aria-hidden=\"true\" data-map-svg>\n            </div>\n            <div class=\"map-price-legend\" data-map-legend aria-label=\"Price color legend\"></div>\n            <div class=\"map-region-list\" aria-label=\"Seoul district buttons\">\n              <button class=\"map-region\" data-region=\"seoul\">All Seoul</button>\n              <button class=\"map-region\" data-region=\"gangnam\">Gangnam</button>\n              <button class=\"map-region\" data-region=\"seocho\">Seocho</button>\n              <button class=\"map-region\" data-region=\"songpa\">Songpa</button>\n              <button class=\"map-region\" data-region=\"yongsan\">Yongsan</button>\n              <button class=\"map-region\" data-region=\"seongdong\">Seongdong</button>\n              <button class=\"map-region\" data-region=\"mapo\">Mapo</button>\n              <button class=\"map-region\" data-region=\"gwangjin\">Gwangjin</button>\n              <button class=\"map-region\" data-region=\"dongjak\">Dongjak</button>\n              <button class=\"map-region\" data-region=\"yeongdeungpo\">Yeongdeungpo</button>\n              <button class=\"map-region\" data-region=\"seodaemun\">Seodaemun</button>\n              <button class=\"map-region\" data-region=\"yangcheon\">Yangcheon</button>\n              <button class=\"map-region\" data-region=\"dongdaemun\">Dongdaemun</button>\n              <button class=\"map-region\" data-region=\"seongbuk\">Seongbuk</button>\n              <button class=\"map-region\" data-region=\"gangseo\">Gangseo</button>\n              <button class=\"map-region\" data-region=\"gwanak\">Gwanak</button>\n              <button class=\"map-region\" data-region=\"guro\">Guro</button>\n              <button class=\"map-region\" data-region=\"eunpyeong\">Eunpyeong</button>\n              <button class=\"map-region\" data-region=\"geumcheon\">Geumcheon</button>\n              <button class=\"map-region\" data-region=\"nowon\">Nowon</button>\n              <button class=\"map-region\" data-region=\"jung\">Jung</button>\n              <button class=\"map-region\" data-region=\"jongno\">Jongno</button>\n              <button class=\"map-region\" data-region=\"gangdong\">Gangdong</button>\n              <button class=\"map-region\" data-region=\"jungnang\">Jungnang</button>\n              <button class=\"map-region\" data-region=\"gangbuk\">Gangbuk</button>\n              <button class=\"map-region\" data-region=\"dobong\">Dobong</button>\n            </div>\n          </div>\n          <p class=\"map-source-note\">* Based on the one-year average transaction price for Seoul overall and each administrative district from KB Real Estate data, 2025.04-2026.03.</p>\n          <p class=\"map-source-note\">** Yangcheon-gu and the Seoul average both appear as ₩1.40B when rounded for display. At three decimal places, the Seoul average is 14.041 hundred million KRW, while Yangcheon-gu is 14.033 hundred million KRW.</p>\n        </div>\n        </div>\n        <p>\n          The distinction between the upper-tier and lower-tier areas selected here is based on Seoul's average transaction prices from KB Real Estate data over the past year. However, simply separating upper-tier and lower-tier districts does not explain everything, so we also examine the recent 12-month transaction-price trend for each area.\n        </p>\n        <p class=\"chart-intro-text\">Choose Seoul Average or a district button to show the recent 12-month apartment transaction price trend as a line chart.</p>\n        <div class=\"interactive-chart\" data-interactive-chart data-lang=\"en\">\n          <div class=\"chart-head\">\n            <div>\n              <p class=\"chart-label\">Trend Tracking Visualization</p>\n              <h3>Recent 12-Month Housing Price Trend by Seoul District</h3>\n            </div>\n            <aside class=\"chart-detail\" data-chart-detail aria-live=\"polite\">\n              <span data-detail-cluster>Seoul</span>\n              <h4 data-detail-name>Seoul Average</h4>\n              <strong data-detail-value>0.00</strong>\n              <p data-detail-note>Select a district to show the detailed monthly trend here.</p>\n            </aside>\n          </div>\n          <div class=\"chart-layout\">\n            <div class=\"chart-selector\" data-chart-selector aria-label=\"Seoul district trend buttons\"></div>\n            <div class=\"line-chart\" data-line-chart aria-label=\"Selected district 12-month trend line chart\"></div>\n          </div>\n          <p class=\"map-source-note\">* Based on the recent 12-month apartment transaction price trend for Seoul overall and each administrative district from KB Real Estate data, 2025.04-2026.03.</p>\n        </div>\n        <div class=\"content\">\n          <p>\n            Looking closely at the graph, some regions show noticeably larger price increases. This will be analyzed later using the distribution of corporate locations.\n          </p>\n          <p>(To be added)</p>\n        </div>\n\n        <h3 id=\"analysis-gap\" class=\"analysis-subtitle\"><span>4.</span> Price Gap Between Seoul, the Capital Area, and Other Regions</h3>\n        <p>\n          However, one could argue that if Seoul prices are high, prices in the broader capital area are also high. We therefore examine that data as well.\n        </p>\n        <div class=\"interactive-chart\" data-comparison-chart data-comparison-type=\"capital\" data-lang=\"en\"></div>\n        <p>The major capital-area regions were selected based on the following contexts.</p>\n        <div class=\"reason-box\">\n          <p>Incheon Yeonsu-gu: Songdo International City</p>\n          <p>Incheon Seo-gu: Cheongna International City</p>\n          <p>Goyang Ilsandong-gu / Ilsanseo-gu: Ilsan New Town</p>\n          <p>Gwacheon: former Government Complex Gwacheon</p>\n          <p>Gunpo: Sanbon New Town</p>\n          <p>Bucheon Wonmi-gu: Jungdong New Town</p>\n          <p>Seongnam Bundang-gu: Bundang New Town, Pangyo New Town</p>\n          <p>Suwon Yeongtong-gu: Gwanggyo New Town</p>\n          <p>Anyang Dongan-gu: Pyeongchon New Town</p>\n          <p>Yongin Suji-gu: Suji development area linked to Bundang, and parts of Gwanggyo New Town</p>\n          <p>Hwaseong Dongtan-gu: Dongtan New Town</p>\n        </div>\n        <p>(To be added)</p>\n        <div class=\"question-callout\">\n          <p>This leads to another question:</p>\n          <p class=\"question-line\"><strong>\"Why are so many people determined to own a home in Seoul or the capital area?\"</strong></p>\n          <p>The following section prepares an answer to that question.</p>\n        </div>\n        <div class=\"interactive-chart grdp-donut-chart\" data-grdp-donut-chart data-lang=\"en\"></div>\n        <div class=\"interactive-chart\" data-comparison-chart data-comparison-type=\"local\" data-lang=\"en\"></div>\n        <p>\n          The major local regions selected here are Daegu Suseong-gu, Daejeon Yuseong-gu, Daejeon Seo-gu, Ulsan Nam-gu, Sejong, Cheongju Heungdeok-gu, Changwon Seongsan-gu, Changwon Uichang-gu, and Busan Haeundae-gu. These nine regions generally record relatively high housing prices compared with their surrounding areas. Our analysis suggests that they can be broadly divided into two cases.\n        </p>\n        <p>\n          The first case is related to education. Daegu Suseong-gu, Daejeon Yuseong-gu, Daejeon Seo-gu, Ulsan Nam-gu, and Busan Haeundae-gu fall into this category. A common feature of these regions is their strong educational demand, which is also intuitively connected to the number of private academies located there.\n        </p>\n        <p>(To be added)</p>\n        <p>\n          The second case is related to specific industries. Sejong, Cheongju Heungdeok-gu, Changwon Seongsan-gu, and Changwon Uichang-gu are examples.\n        </p>\n        <p>(To be added)</p>\n\n        <h3 id=\"analysis-regulations\" class=\"analysis-subtitle\"><span>5.</span> Barriers Created by Regulations</h3>\n        <p>\n          Housing purchases are affected not only by prices but also by lending limits, financial regulations, and policy conditions that shape access to the market.\n        </p>\n\n        <h3 id=\"analysis-conclusion\" class=\"analysis-subtitle\"><span>6.</span> Conclusion</h3>\n        <p>\n          The project concludes that Seoul-centered housing inequality is not a simple price issue, but a structural problem connected to infrastructure, jobs, financing, and policy design.\n        </p>\n      </div>",
    "notes": "\n      <div class=\"container is-max-desktop\">\n        <h2 class=\"title is-3\">Notes</h2>\n        <div class=\"content\">\n          <p>\n            This project is currently under continuous research and development, and additional contributors may be added in the future.\n          </p>\n          <p>\n            Current progress is as follows:<br>\n            Trend analysis of real-estate transaction activity under current government regulations, housing price growth relative to household debt, and the possibility of expanding supply in the capital area are currently in progress. Additional supporting material on regional price trends will be added after collecting corporate-headquarters distribution data and further information on local school-district areas.\n          </p>\n          <h3>Image Sources</h3>\n          <p>Helio City daytime view (Garak-dong, Songpa-gu, Seoul) - Maeil Business Newspaper | <a href=\"https://www.mk.co.kr/news/realestate/10606037\" target=\"_blank\" rel=\"noopener\">https://www.mk.co.kr/news/realestate/10606037</a></p>\n          <p>Lotte World Tower sunset view (Sincheon-dong, Songpa-gu, Seoul) - News1 | <a href=\"https://www.news1.kr/industry/distribution/5299635\" target=\"_blank\" rel=\"noopener\">https://www.news1.kr/industry/distribution/5299635</a></p>\n          <p>Raemian One Bailey night view (Banpo-dong, Seocho-gu, Seoul) - Samsung C&amp;T Engineering &amp; Construction Portfolio | <a href=\"https://secc.co.kr/ko/business/portfolio/all/300\" target=\"_blank\" rel=\"noopener\">https://secc.co.kr/ko/business/portfolio/all/300</a></p>\n          <h3>Reference Data and Sites</h3>\n          <p>KB Real Estate Data Hub, provided by KB Kookmin Bank | <a href=\"https://data.kbland.kr/\" target=\"_blank\" rel=\"noopener\">https://data.kbland.kr/</a></p>\n          <p>Real Estate Statistics Information System, provided by Korea Real Estate Board | <a href=\"https://www.reb.or.kr/r-one/portal/main/indexPage.do\" target=\"_blank\" rel=\"noopener\">https://www.reb.or.kr/r-one/portal/main/indexPage.do</a></p>\n          <p>Public Data Portal, provided by the Ministry of the Interior and Safety | <a href=\"https://www.data.go.kr/index.do\" target=\"_blank\" rel=\"noopener\">https://www.data.go.kr/index.do</a></p>\n          <h3>Reference Interviews</h3>\n          <p>Mr. Dia Sung, Senior Manager, Sage Marketing Team, Mirae Asset Securities</p>\n          <p>Ms. Sukhee Jeong, Senior Real Estate Consultant, Sage Consulting Team, Mirae Asset Securities</p>\n        </div>\n      </div>",
    "contact": "\n      <div class=\"container is-max-desktop\">\n        <p class=\"section-kicker\">Contact</p>\n        <h2 class=\"title is-3\">Project Join Inquiry</h2>\n        <div class=\"content\">\n          <p>Please contact the author team for project participation or data visualization collaboration inquiries.</p>\n        </div>\n      </div>"
  }
};

function syncStaticBodySections() {
  const sections = staticBodySections[getPageLang()] || staticBodySections.en;
  Object.entries(sections).forEach(([sectionId, html]) => {
    const section = document.getElementById(sectionId);
    if (section) section.innerHTML = html;
  });
}

const analysisNarrative = {
  ko: {
    capitalAccess:
      "이러한 지역들의 공통점은 바로 서울과의 접근성이 좋거나, 해당 지역 내에서 자급자족이 가능한 구조가 이미 완성되었다는 점을 볼 수 있습니다. 실제로 송도국제도시, 청라국제도시, 동탄신도시의 경우에는 이미 해당 지역 내에서 자급자족이 가능한 경제권을 구축하고 있으며, 일산신도시, 산본신도시, 중동신도시, 광교신도시, 평촌신도시, 수지택지지구, 과천시의 경우에는 서울과의 접근성이 좋다는 점을 주 강점으로 가집니다. 그 중에서 분당신도시와 판교신도시는 서울과의 접근성과 더불어 자급자족까지 두 가지의 조건을 모두 갖추고 있다는 점 또한 특기할만한 사항입니다.",
    localHtml: `
      <p>
        저희가 선정한 지방 주요 지역은 대구 수성구, 대전 유성구, 대전 서구, 울산 남구, 세종시, 충북 청주 흥덕구, 경남 창원 성산구, 경남 창원 의창구, 부산 해운대구로 총 9개 지역입니다. 본 9개 지역은 대체로 해당 지역 및 인근 지역 대비 집값이 상대적으로 높게 집계되는 지역들입니다. 이러한 지역들에 대해 저희가 분석을 진행한 결과, 크게 2가지의 경우로 나눌 수 있었습니다.
      </p>
      <p>
        첫 번째는, 바로 교육과 연관된 경우입니다. 대구 수성구, 대전 유성구, 대전 서구, 울산 남구, 부산 해운대구가 이에 해당하는 지역입니다. 이들 지역의 공통점으로는, 교육열이 상당히 높은 지역이라는 점입니다. 이러한 점은, 해당 지역 내에 소재한 학원의 갯수로도 직관적으로 연결됩니다.
      </p>
      <p>
        상기 그래프에서 확인되는 바와 같이, 수도권을 제외한 지방 기초자치단체 당 학원 소재 갯수는 평균 317개입니다. 그에 반해, 대구 수성, 대전 유성, 대전 서, 울산 남, 부산 해운대 5개 구의 경우 학원 갯수가 타 지역 평균 대비 압도적으로 높은 것을 알 수 있습니다. 실제로 학원 소재 갯수가 유독 높은 해당 구역들과 타 구역들 간의 집값이 차이가 난다는 점으로 미루어보아, 지방에서는 학군 소재지가 아니면 집값 상승의 요인이 없을 수 있다는 것이 첫 번째 추론 결과가 될 수 있습니다.
      </p>
      <p>
        두 번째는 특정 산업과 연관된 경우입니다. 세종시, 충북 청주 흥덕구, 경남 창원 성산구, 경남 창원 의창구가 그 예시입니다. 세종시의 경우, 현재 대한민국 정부의 대다수 주무부처와 기관들이 세종을 본부로 두고 활동하고 있으며, 충북 청주 흥덕의 경우 SK하이닉스 청주FAB과 오송생명과학단지, 경남 창원 성산/의창의 경우 한국항공우주(KAI)의 본사가 소재한 사천과의 접근성을 비롯해 한화에어로스페이스의 창원본사 및 창원1/2/3사업장이 위치해있다는 점이 주요한 원인이라고 할 수 있는데, 이는 제조업 중심 국가인 대한민국에서 반도체, 군수, 바이오 산업이 현재 대한민국 경제를 이끌어가는 주 축이기 때문입니다.
      </p>
      <p>즉, 지방에서 사람들이 집을 구하는 경우에는 사람들의 결론은 두 가지로 나뉜다고 볼 수 있게 되는데,</p>
      <ol class="analysis-highlight-list">
        <li><strong>학군 소재지로 자녀 교육에 유리한 지역이거나</strong></li>
        <li><strong>아니면 현재 주축 산업의 주 사업장과 자택이 근접한 지역이거나</strong></li>
      </ol>
      <p>라는 추론이 가능하게 됩니다.</p>
    `,
    regulationHtml: `
      <p>
        그렇다면, 수도권으로 몰리는 이유는 비교적 명확해졌습니다. 그런데, 왜 여전히 서울 내 집 마련은 꿈이라고 다들 표현하는 것일까요? 그 문제를 들여다보기 위해, 저희는 정권별 주택매매거래량과 집값 상승률을 확인해보기로 했습니다. 먼저 보여드리는 지표는 정권별 주택매매거래량입니다.
      </p>
      <p class="chart-intro-text">정권별 버튼을 선택하면 해당 정권 시기 동안의 주택매매거래량을 확인할 수 있습니다. 횡스크롤을 통해 상세 변동 내역을 확인할 수 있습니다.</p>
      <div class="interactive-chart transaction-volume-chart" data-transaction-volume-chart data-lang="ko"></div>
      <p>
        세로선은 정권별 부동산 정책 발표에 관한 내용입니다. 빨간 선은 부동산 규제 강화, 파란 선은 부동산 규제 완화, 회색 선은 부동산 규제 중 주택 구매와 연관 없는 규제인 경우입니다.
      </p>
      <p>
        여기서 특기할 만한 공통점이 존재하는데, 규제 완화 시기에는 주택 거래량이 상승하는 기조를 보였으며, 규제 강화 시기에는 강화 직후 한동안은 주택 거래량이 감소하는 기조를 보인다는 점입니다. 그리고, 규제 강화 이후에 주택 거래량 감소 시기를 지나고 나면, 거래량이 다시 증가하는 시기가 도래한다는 점 또한 공통적인 패턴을 보입니다. 이 점을 잘 기억해 두시고 다음으로 중소형 평형 매매평균가를 확인해보겠습니다.
      </p>
      <p class="chart-intro-text">정권별 버튼을 선택하면 해당 정권 시기 동안의 중소형 평형 매매평균가를 확인할 수 있습니다. 횡스크롤을 통해 상세 변동 내역을 확인할 수 있습니다.</p>
      <div class="interactive-chart area-price-chart" data-area-price-chart data-lang="ko"></div>
      <p>
        중소형 평형 매매평균가를 보는 경우, 대체로 규제가 강화되는 시기에는 거래량이 일시적으로 떨어지긴 하지만, 그 시기동안 집값이 상승 기조를 보인다는 점을 알 수 있습니다. 이제 중소형 평형 매매평균가와 주택매매거래량을 같이 겹쳐놓고 비교를 해야 하는데, 그 이전에 부동산 규제의 형태에 대해 적어드리겠습니다.
      </p>
      <p>
        부동산 정책은 보통 발표 이후 시행까지 약간의 유예를 두게 됩니다. 예를 들어, 6월 8일에 부동산 정책을 발표하면 실제 시행은 8월 혹은 9월에 시행된다던가와 같은 방식을 취하는데, 지금까지의 부동산 정책에서 규제가 강화되는 시점에는 항상 공통점이 있었습니다. 바로 DSR, LTV, DTI 비율에 대한 조정을 통한 규제 강화입니다. 이 비율을 조정하게 되면, 주택 구매 자금을 조달하는 주 방식인 대출 시장에 크게 영향을 끼치게 되는데, DSR, LTV, DTI라는 용어에 대해 설명을 드리겠습니다.
      </p>
      <div class="definition-box">
        <p><strong>DSR:</strong> 총부채원리금상환비율, 채무자의 연간 소득에서 각종 금융 부채의 연간 원리금 상환액이 차지하는 비율. 은행, 카드사, 캐피탈사 등 여신금융을 취급하는 금융기관은 개인 당 대출을 실행할 때 정부에서 지정한 DSR 비율 내에서만 대출을 실행하여야 한다. DSR 산정에는 개인신용대출, 학자금대출, 장기카드대출, 주택담보대출 등의 모든 여신거래를 더한다.</p>
        <p><strong>LTV:</strong> 담보인정비율, 물건의 가치 대비, 해당 물건을 담보로 빌릴 수 있는 돈의 비율을 뜻한다. 예를 들어, 어떤 부동산의 가치가 10억이고 LTV가 80%인 경우, 해당 부동산을 담보로 최대 8억까지 대출이 가능한 것이다.</p>
        <p><strong>DTI:</strong> 총부채상환비율, 차입자의 소득에 대한 부채의 비율로, 차입자의 소득으로 연간 상환액(대출이자와 원금)을 나눈 값을 뜻한다. 산정 공식은 (DTI 비율) = (총 대출금액 + 총 대출이자) / (차입자의 소득 * 대여 연수)로 산정되는데, 보통 DSR보다 DTI가 조금 더 범위가 넓게 나오는 편이다.</p>
      </div>
      <p>
        정부는 가계부채 억제 및 주택 가격 안정화를 명목으로 주택담보대출에 대출규제를 적용하여 다주택자들의 주택 판매를 유도합니다. 다만, 대부분의 주택 실수요자들은 주택 구매를 위해 거의 필연적인 수준으로 주택담보대출을 이용하게 되는데, 부동산 정책이 대출규제 강화로 이어지는 경우 정책 시행 이전까지 유예기간이 주어지기 때문에 최대한 유리한 조건으로 대출을 받아 주택 구매를 진행하기 위해 실수요자들은 구매를 서두르게 됩니다.
      </p>
      <p>
        여기서 가장 기초적인 시장의 수요와 공급의 원칙이 작용하는데, 시장에서 공급이 일정하면 수요가 몰리면서 가격이 상승하게 됩니다. 만약, 여기서 공급이 더 줄어든다면 주택 가격은 어떻게 될 것인가라는 질문을 던진다면, 답은 명확해집니다.
      </p>
      <div class="question-callout"><p class="question-line"><strong>"주택 가격이 상승한다."</strong></p></div>
      <p>
        대출 규제를 시행하면서 주택 보유자들은 시장에 주택 매물을 내놓지 않게 되고, 수요가 몰리는 관계로 자연스럽게 가격이 상승하면서 부동산 가격이 지속적으로 인상되게 된 것입니다.
      </p>
    `,
    conclusionHtml: `
      <p>
        결국, 집값 불균형을 해소하기 위한 가장 단순한 방법은 서울 내 주택 공급매물 확대라고 할 수 있는데, 이는 곧 노후 주택에 대한 재건축 지원 등 및 가로주택정비사업 지원 확대 등의 정책이 필요하고, 규제 완화를 통해 주택 실수요자들의 차주 단위 주택 구매자금 유동성 확보가 시행되어야 한다라는 결론을 내리게 됩니다.
      </p>
      <p>이에 따라 저희는 다음과 같은 정책 공급안을 제시하며 본 프로젝트를 마감하고자 합니다.</p>
      <ol class="analysis-highlight-list">
        <li><strong>서울 내 노후 주택에 대한 재건축 및 리모델링 사업 적극적 확대 및 신속 진행 지원</strong></li>
        <li><strong>DSR 비율 완화와 LTV 비율 인상 등의 정책 완화를 통한 주택 실수요자 대상 주택 구매자금 유동성 확보 지원</strong></li>
      </ol>
    `
  },
  en: {
    capitalAccess:
      "The common feature of these areas is that they either have strong access to Seoul or have already formed a self-sustaining local structure. Songdo International City, Cheongna International City, and Dongtan New Town have built economic zones that can function within their own areas. Ilsan New Town, Sanbon New Town, Jungdong New Town, Gwanggyo New Town, Pyeongchon New Town, the Suji development area, and Gwacheon are strong mainly because of their access to Seoul. Bundang New Town and Pangyo New Town are especially notable because they satisfy both conditions: access to Seoul and self-sufficiency.",
    localHtml: `
      <p>
        The major local regions selected here are Daegu Suseong-gu, Daejeon Yuseong-gu, Daejeon Seo-gu, Ulsan Nam-gu, Sejong, Cheongju Heungdeok-gu, Changwon Seongsan-gu, Changwon Uichang-gu, and Busan Haeundae-gu. These nine regions generally record relatively high housing prices compared with their surrounding areas. Our analysis suggests that they can be broadly divided into two cases.
      </p>
      <p>
        The first case is related to education. Daegu Suseong-gu, Daejeon Yuseong-gu, Daejeon Seo-gu, Ulsan Nam-gu, and Busan Haeundae-gu fall into this category. A common feature of these regions is their strong educational demand, which is also intuitively connected to the number of private academies located there.
      </p>
      <p>
        As shown in the graph above, local municipalities outside the capital area have an average of 317 private academies. By contrast, Daegu Suseong, Daejeon Yuseong, Daejeon Seo, Ulsan Nam, and Busan Haeundae have far more academies than the local average. Because housing prices differ between these academy-heavy districts and other areas, the first inference is that in local regions, housing-price growth may be difficult without a strong school-district factor.
      </p>
      <p>
        The second case is related to specific industries. Sejong, Cheongju Heungdeok-gu, Changwon Seongsan-gu, and Changwon Uichang-gu are examples. Sejong hosts many central government ministries and agencies. Cheongju Heungdeok is connected to SK hynix's Cheongju FAB and the Osong Bio-Health Science Technopolis. Changwon Seongsan and Uichang benefit from access to Sacheon, where Korea Aerospace Industries is headquartered, as well as Hanwha Aerospace's Changwon headquarters and Plant 1/2/3. These factors matter because semiconductors, defense, and bio industries are key pillars of Korea's manufacturing-centered economy.
      </p>
      <p>In other words, when people look for homes in local regions, the conclusion tends to split into two paths:</p>
      <ol class="analysis-highlight-list">
        <li><strong>an area advantageous for children's education because it is a school-district location</strong></li>
        <li><strong>or an area where the home is close to a major workplace in a current core industry</strong></li>
      </ol>
      <p>This is the inference suggested by the data.</p>
    `,
    regulationHtml: `
      <p>
        The reason people concentrate in the capital area has now become relatively clear. But why do people still describe buying a home in Seoul as a dream? To examine that question, we looked at housing transaction volume and housing-price growth by administration. The first indicator is housing transaction volume by administration.
      </p>
      <p class="chart-intro-text">Select an administration button to view housing transaction volume during that administration. Use horizontal scrolling to inspect detailed changes.</p>
      <div class="interactive-chart transaction-volume-chart" data-transaction-volume-chart data-lang="en"></div>
      <p>
        The vertical lines mark real-estate policy announcements by administration. Red lines indicate stricter real-estate regulation, blue lines indicate easing or support measures, and gray lines indicate regulations that are not directly related to home purchases.
      </p>
      <p>
        A notable pattern appears here: during periods of regulatory easing, housing transaction volume tended to rise, while after stricter regulations were announced, transaction volume tended to decline for a while. After that decline, transaction volume often rose again. Keep this pattern in mind as we next examine average sale prices for small-to-medium unit sizes.
      </p>
      <p class="chart-intro-text">Select an administration button to view average sale prices for small-to-medium unit sizes during that administration. Use horizontal scrolling to inspect detailed changes.</p>
      <div class="interactive-chart area-price-chart" data-area-price-chart data-lang="en"></div>
      <p>
        Looking at average sale prices for small-to-medium units, transaction volume often falls temporarily when regulations are strengthened, yet housing prices tend to continue rising during that period. Before comparing transaction volume and average sale prices together, we first explain the form that real-estate regulation usually takes.
      </p>
      <p>
        Real-estate policies usually leave a short grace period between announcement and enforcement. For example, a policy announced on June 8 may take effect in August or September. Across past tightening periods, one common feature has repeatedly appeared: tighter rules through adjustments to DSR, LTV, and DTI ratios. Because these ratios strongly affect the mortgage market, which is the main funding channel for home purchases, we explain the terms below.
      </p>
      <div class="definition-box">
        <p><strong>DSR:</strong> Debt Service Ratio. This is the share of a borrower's annual income used to repay principal and interest on financial debt. Financial institutions such as banks, card companies, and capital firms must keep each borrower's lending within the DSR ratio set by the government. DSR includes credit loans, student loans, long-term card loans, mortgages, and other credit transactions.</p>
        <p><strong>LTV:</strong> Loan-to-Value ratio. This means the percentage of an asset's value that can be borrowed using that asset as collateral. If a property is worth 1 billion KRW and the LTV is 80%, up to 800 million KRW can be borrowed against that property.</p>
        <p><strong>DTI:</strong> Debt-to-Income ratio. This measures debt relative to the borrower's income by comparing annual repayments with income. It is generally calculated as total loan principal plus interest divided by the borrower's income multiplied by the loan period, and it often allows a somewhat wider range than DSR.</p>
      </div>
      <p>
        The government applies mortgage restrictions in the name of reducing household debt and stabilizing housing prices, encouraging multi-home owners to sell. However, most end users almost inevitably rely on mortgages when purchasing homes. When a policy leads to tighter lending rules, the grace period before enforcement encourages buyers to hurry so they can secure financing under more favorable conditions.
      </p>
      <p>
        This is where the basic principle of supply and demand operates. If supply is fixed and demand concentrates, prices rise. If supply decreases even further, the answer to what happens to housing prices becomes clear.
      </p>
      <div class="question-callout"><p class="question-line"><strong>"Housing prices rise."</strong></p></div>
      <p>
        As lending restrictions are implemented, homeowners become less willing to put homes on the market. Demand remains concentrated, prices rise naturally, and real-estate prices continue to increase.
      </p>
    `,
    conclusionHtml: `
      <p>
        Ultimately, the simplest way to ease housing-price imbalance is to expand the supply of homes available in Seoul. This points to policies such as support for reconstruction of aging housing, broader support for small-block housing renewal projects, and regulatory easing that secures home-purchase liquidity for genuine end-user buyers.
      </p>
      <p>Accordingly, we close this project by proposing the following policy directions.</p>
      <ol class="analysis-highlight-list">
        <li><strong>Actively expand and accelerate reconstruction and remodeling projects for aging housing in Seoul</strong></li>
        <li><strong>Secure purchase-fund liquidity for genuine home buyers through eased DSR ratios and higher LTV ratios</strong></li>
      </ol>
    `
  }
};

function removeSiblingRange(start, endExclusive) {
  let current = start;
  while (current && current !== endExclusive) {
    const next = current.nextElementSibling;
    current.remove();
    current = next;
  }
}

function createFragmentFromHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content;
}

function syncAnalysisNarrative() {
  const lang = getPageLang();
  const copy = analysisNarrative[lang] || analysisNarrative.en;
  const gapTitle = document.querySelector("#analysis-gap");
  const regulationsTitle = document.querySelector("#analysis-regulations");
  const conclusionTitle = document.querySelector("#analysis-conclusion");

  if (gapTitle) {
    const staleSeoulContent = gapTitle.previousElementSibling;
    if (staleSeoulContent?.matches(".content")) staleSeoulContent.remove();
  }

  const capitalChart = document.querySelector('[data-comparison-chart][data-comparison-type="capital"]');
  const reasonBox = capitalChart?.nextElementSibling?.nextElementSibling;
  if (reasonBox?.matches(".reason-box")) {
    const capitalParagraph = syncParagraphAfter(reasonBox, "[data-capital-access-analysis]", copy.capitalAccess, (element) => {
      element.dataset.capitalAccessAnalysis = "";
    });
    capitalParagraph.className = "";
    const staleCapitalPlaceholder = capitalParagraph.nextElementSibling;
    if (staleCapitalPlaceholder?.tagName === "P" && /^\((향후 추가 예정|To be added)\)$/.test(staleCapitalPlaceholder.textContent.trim())) {
      staleCapitalPlaceholder.remove();
    }
  }

  const localChart = document.querySelector('[data-comparison-chart][data-comparison-type="local"]');
  if (localChart && regulationsTitle) {
    removeSiblingRange(localChart.nextElementSibling, regulationsTitle);
    localChart.after(createFragmentFromHtml(copy.localHtml));
  }

  if (regulationsTitle && conclusionTitle) {
    removeSiblingRange(regulationsTitle.nextElementSibling, conclusionTitle);
    regulationsTitle.after(createFragmentFromHtml(copy.regulationHtml));
  }

  if (conclusionTitle) {
    conclusionTitle.parentElement.querySelectorAll("[data-synced-conclusion]").forEach((element) => element.remove());
    removeSiblingRange(conclusionTitle.nextElementSibling, null);
    conclusionTitle.after(createFragmentFromHtml(copy.conclusionHtml));
    let current = conclusionTitle.nextElementSibling;
    while (current) {
      current.dataset.syncedConclusion = "";
      current = current.nextElementSibling;
    }
  }
}

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

function formatAxisPrice(value, lang) {
  return lang === "ko" ? `${value.toFixed(1)}억` : `₩${(value / 10).toFixed(2)}B`;
}

function formatCount(value, lang) {
  return lang === "ko" ? `${Math.round(value).toLocaleString("ko-KR")}개` : `${Math.round(value).toLocaleString("en-US")} academies`;
}

function formatAxisCount(value, lang) {
  return lang === "ko" ? `${Math.round(value).toLocaleString("ko-KR")}개` : Math.round(value).toLocaleString("en-US");
}

function getGraphItem(id) {
  return graphData.find((item) => item.id === id) || graphData[0];
}

function updateOverflowingChoices(root = document) {
  root.querySelectorAll(".chart-choice").forEach((button) => {
    const label = button.querySelector("span");
    if (!label) return;
    button.classList.toggle("is-overflowing", label.scrollWidth > label.clientWidth + 1);
  });
}

function drawLineChart(container, selected, lang) {
  const width = 760;
  const height = 300;
  const padding = { top: 26, right: 52, bottom: 56, left: 58 };
  const values = selected.trend;
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const paddingValue = Math.max((rawMax - rawMin) * 0.12, 0.08);
  const min = Math.max(0, rawMin - paddingValue);
  const max = rawMax + paddingValue;
  const range = Math.max(max - min, 0.01);
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const yTicks = Array.from({ length: 5 }, (_, index) => {
    const ratio = index / 4;
    const value = max - ratio * range;
    const y = padding.top + ratio * plotHeight;
    return { value, y };
  });

  const points = values.map((value, index) => {
    const x = padding.left + (index / (values.length - 1)) * plotWidth;
    const y = padding.top + (1 - (value - min) / range) * plotHeight;
    return { x, y, value };
  });

  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const pointNodes = points.map((point, index) => `
    <g class="line-point" style="--point-delay: ${(260 + index * 42).toFixed(0)}ms">
      <circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="4"></circle>
      <text x="${point.x.toFixed(1)}" y="${(point.y - 10).toFixed(1)}">${formatPrice(point.value, lang)}</text>
      <text class="line-month" x="${point.x.toFixed(1)}" y="${height - 22}">${trendMonths[index]}</text>
    </g>
  `).join("");
  const yAxisNodes = yTicks.map((tick) => `
    <g class="line-y-tick">
      <line x1="${padding.left}" y1="${tick.y.toFixed(1)}" x2="${width - padding.right}" y2="${tick.y.toFixed(1)}"></line>
      <text x="${padding.left - 10}" y="${(tick.y + 4).toFixed(1)}">${formatAxisPrice(tick.value, lang)}</text>
    </g>
  `).join("");

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" focusable="false" aria-label="${selected.name[lang]} 12-month trend" style="--line-color: ${selected.color}">
      ${yAxisNodes}
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

    updateOverflowingChoices(selector);

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
  },
  academy: {
    label: { ko: "Academy Count Indicator", en: "Academy Count Indicator" },
    title: { ko: "지방 학군지의 학원 갯수 지표", en: "Academy Count Indicator for Local School-District Areas" },
    description: { ko: "행정구역별 버튼을 선택하면 2026년 03월 기준 해당 구역의 학원 갯수를 확인할 수 있습니다.", en: "Select an administrative-region button to view the academy count as of March 2026." },
    detailLabel: { ko: "학원 갯수", en: "Academy Count" },
    baseline: { ko: "지방 기초자치단체 평균", en: "Local Municipality Average" },
    baselineValue: 366.7,
    valueType: "count",
    footnote: { ko: "* 학원 갯수는 2026년 03월의 지표를 기반으로 함. 평균값은 서울/경기/인천교육청 관할 구역을 제외한 지방 기초자치단체 기준.", en: "* Academy counts are based on the March 2026 indicator. The average excludes districts under the Seoul, Gyeonggi, and Incheon education offices." },
    items: [
      { id: "daeguSuseongAcademy", name: { ko: "대구 수성", en: "Daegu Suseong" }, value: 2489 },
      { id: "daejeonYuseongAcademy", name: { ko: "대전 유성", en: "Daejeon Yuseong" }, value: 1156 },
      { id: "daejeonSeoAcademy", name: { ko: "대전 서", en: "Daejeon Seo" }, value: 1473 },
      { id: "ulsanNamAcademy", name: { ko: "울산 남", en: "Ulsan Nam" }, value: 1364 },
      { id: "busanHaeundaeAcademy", name: { ko: "부산 해운대", en: "Busan Haeundae" }, value: 1407 }
    ]
  }
};

const transactionVolumeData = {
  label: { ko: "Housing Transaction Volume", en: "Housing Transaction Volume" },
  title: { ko: "정권별 주택매매거래량 비교", en: "Housing Transaction Volume by Administration" },
  description: {
    ko: "2014.03부터 2026.03까지의 주택매매거래량을 수도권과 지방으로 나누어 비교합니다.",
    en: "Compares housing transaction volume in the capital area and local regions from Mar. 2014 to Mar. 2026."
  },
  lineTitle: { ko: "전체 기간 직선그래프", en: "Full-Period Line Chart" },
  footnote: {
    ko: "* 주택매매거래량은 2014.03-2026.03 월별 지표를 기반으로 함. 점선 세로줄은 정권별 부동산 금융규제 대책 발표일을 표시함.",
    en: "* Housing transaction volume is based on monthly indicators from 2014.03 to 2026.03. Dashed vertical lines mark real-estate finance-policy announcement dates by administration."
  },
  months: ["2014.03", "2014.04", "2014.05", "2014.06", "2014.07", "2014.08", "2014.09", "2014.10", "2014.11", "2014.12", "2015.01", "2015.02", "2015.03", "2015.04", "2015.05", "2015.06", "2015.07", "2015.08", "2015.09", "2015.10", "2015.11", "2015.12", "2016.01", "2016.02", "2016.03", "2016.04", "2016.05", "2016.06", "2016.07", "2016.08", "2016.09", "2016.10", "2016.11", "2016.12", "2017.01", "2017.02", "2017.03", "2017.04", "2017.05", "2017.06", "2017.07", "2017.08", "2017.09", "2017.10", "2017.11", "2017.12", "2018.01", "2018.02", "2018.03", "2018.04", "2018.05", "2018.06", "2018.07", "2018.08", "2018.09", "2018.10", "2018.11", "2018.12", "2019.01", "2019.02", "2019.03", "2019.04", "2019.05", "2019.06", "2019.07", "2019.08", "2019.09", "2019.10", "2019.11", "2019.12", "2020.01", "2020.02", "2020.03", "2020.04", "2020.05", "2020.06", "2020.07", "2020.08", "2020.09", "2020.10", "2020.11", "2020.12", "2021.01", "2021.02", "2021.03", "2021.04", "2021.05", "2021.06", "2021.07", "2021.08", "2021.09", "2021.10", "2021.11", "2021.12", "2022.01", "2022.02", "2022.03", "2022.04", "2022.05", "2022.06", "2022.07", "2022.08", "2022.09", "2022.10", "2022.11", "2022.12", "2023.01", "2023.02", "2023.03", "2023.04", "2023.05", "2023.06", "2023.07", "2023.08", "2023.09", "2023.10", "2023.11", "2023.12", "2024.01", "2024.02", "2024.03", "2024.04", "2024.05", "2024.06", "2024.07", "2024.08", "2024.09", "2024.10", "2024.11", "2024.12", "2025.01", "2025.02", "2025.03", "2025.04", "2025.05", "2025.06", "2025.07", "2025.08", "2025.09", "2025.10", "2025.11", "2025.12", "2026.01", "2026.02", "2026.03"],
  series: [
    { id: "capital", color: "#1f5eff", name: { ko: "수도권 거래량", en: "Capital Area Volume" }, values: [44289, 43335, 35187, 30982, 33065, 34816, 43013, 54233, 43661, 37674, 34301, 37502, 58242, 63712, 58963, 57227, 57105, 49892, 45932, 56199, 49392, 43315, 29705, 28084, 38311, 43452, 49477, 52864, 56629, 56792, 51868, 60728, 54976, 45376, 26042, 28459, 37836, 39467, 47093, 57251, 58247, 57094, 46019, 31487, 37550, 37441, 37328, 40538, 54144, 37045, 35054, 31521, 33509, 38604, 49219, 54823, 32921, 25986, 22483, 18390, 22375, 25366, 26826, 26944, 34471, 35290, 33335, 42465, 48547, 62374, 55382, 66456, 65051, 36852, 40228, 75534, 75725, 43107, 38089, 41884, 41117, 63203, 47132, 47433, 49358, 45012, 47389, 42016, 42074, 41668, 37225, 31982, 26365, 21573, 16209, 16149, 20109, 23346, 26314, 21704, 16734, 13883, 12609, 12102, 11428, 11127, 10299, 17240, 22722, 20830, 24739, 23989, 22179, 23277, 22741, 19791, 18010, 15083, 17608, 18916, 22722, 27124, 27603, 28703, 37684, 32776, 25829, 25011, 21777, 20235, 17846, 24026, 35556, 33820, 32362, 42967, 34704, 21673, 31298, 39644, 27697, 29048, 30142, 29459, 36008] },
    { id: "local", color: "#6f9b78", name: { ko: "지방 거래량", en: "Local Volume" }, values: [45637, 49873, 43023, 42553, 44221, 41569, 43676, 55142, 47389, 53456, 45019, 41362, 53627, 56776, 50909, 53156, 53570, 44218, 40220, 50075, 48421, 44556, 32660, 31181, 39542, 42846, 39790, 39747, 38949, 41338, 39744, 47873, 47912, 43225, 32497, 35025, 39474, 35914, 37953, 40747, 40167, 39484, 38331, 31723, 37598, 34205, 33026, 29141, 38651, 34706, 32735, 33506, 30178, 27341, 26922, 37743, 31883, 29695, 27803, 25054, 28982, 31659, 30277, 27949, 32878, 31216, 30753, 39928, 43866, 56041, 45952, 48808, 43626, 36679, 43266, 63044, 65694, 42165, 43839, 50885, 75641, 77078, 43547, 39588, 52751, 48056, 50135, 46906, 46863, 47389, 44406, 43308, 40794, 32201, 25500, 27030, 33352, 35061, 36886, 28600, 22866, 21648, 19794, 20071, 18792, 17476, 15462, 23951, 29611, 26725, 30437, 28603, 25991, 28301, 26707, 28008, 27405, 22953, 25425, 24575, 30094, 31091, 29833, 27057, 30612, 27872, 25438, 31568, 27337, 25686, 20476, 26672, 31703, 31601, 30341, 30871, 29531, 24579, 32067, 30074, 33710, 33845, 31308, 28326, 35967] }
  ],
  periods: [
    { id: "all", name: { ko: "전체 기간", en: "Full Period" }, range: "2014.03-2026.03", start: "2014.03", end: "2026.03" },
    { id: "park", name: { ko: "박근혜 정부", en: "Park Geun-hye" }, range: "2014.03-2017.05", start: "2014.03", end: "2017.05" },
    { id: "moon", name: { ko: "문재인 정부", en: "Moon Jae-in" }, range: "2017.05-2022.05", start: "2017.05", end: "2022.05" },
    { id: "yoon", name: { ko: "윤석열 정부", en: "Yoon Suk Yeol" }, range: "2022.05-2025.06", start: "2022.05", end: "2025.06" },
    { id: "lee", name: { ko: "이재명 정부", en: "Lee Jae-myung" }, range: "2025.06-2026.03", start: "2025.06", end: "2026.03" }
  ],
  policies: [
    { government: "park", date: "2014-09-01", name: { ko: "9.1 부동산 대책", en: "Sep. 1 Real Estate Measures" }, direction: { ko: "완화", en: "Easing" } },
    { government: "park", date: "2016-08-25", name: { ko: "8.25 가계부채 대책", en: "Aug. 25 Household Debt Measures" }, direction: { ko: "강화", en: "Tightening" } },
    { government: "park", date: "2016-11-03", name: { ko: "11.3 부동산 대책", en: "Nov. 3 Real Estate Measures" }, direction: { ko: "강화", en: "Tightening" } },
    { government: "moon", date: "2017-06-19", name: { ko: "6.19 부동산 대책", en: "Jun. 19 Real Estate Measures" }, direction: { ko: "강화", en: "Tightening" } },
    { government: "moon", date: "2017-08-02", name: { ko: "8.2 부동산 대책", en: "Aug. 2 Real Estate Measures" }, direction: { ko: "강화", en: "Tightening" } },
    { government: "moon", date: "2017-09-05", name: { ko: "9.5 부동산 대책", en: "Sep. 5 Real Estate Measures" }, direction: { ko: "강화", en: "Tightening" } },
    { government: "moon", date: "2017-10-24", name: { ko: "10.24 가계부채 대책", en: "Oct. 24 Household Debt Measures" }, direction: { ko: "강화", en: "Tightening" } },
    { government: "moon", date: "2018-09-13", name: { ko: "9.13 부동산 대책", en: "Sep. 13 Real Estate Measures" }, direction: { ko: "강화", en: "Tightening" } },
    { government: "moon", date: "2019-12-16", name: { ko: "12.16 부동산 대책", en: "Dec. 16 Real Estate Measures" }, direction: { ko: "강화", en: "Tightening" } },
    { government: "moon", date: "2020-06-17", name: { ko: "6.17 부동산 대책", en: "Jun. 17 Real Estate Measures" }, direction: { ko: "강화", en: "Tightening" } },
    { government: "moon", date: "2020-07-10", name: { ko: "7.10 부동산 대책", en: "Jul. 10 Real Estate Measures" }, direction: { ko: "강화", en: "Tightening" } },
    { government: "moon", date: "2020-08-04", name: { ko: "8.4 부동산 대책", en: "Aug. 4 Real Estate Measures" }, direction: { ko: "중립", en: "Neutral" } },
    { government: "moon", date: "2021-02-04", name: { ko: "2.4 부동산 대책", en: "Feb. 4 Real Estate Measures" }, direction: { ko: "중립", en: "Neutral" } },
    { government: "yoon", date: "2023-01-03", name: { ko: "1.3 부동산 대책", en: "Jan. 3 Real Estate Measures" }, direction: { ko: "완화", en: "Easing" } },
    { government: "yoon", date: "2024-01-10", name: { ko: "1.10 부동산 대책", en: "Jan. 10 Real Estate Measures" }, direction: { ko: "완화/지원", en: "Easing/Support" } },
    { government: "yoon", date: "2024-08-08", name: { ko: "8.8 부동산 대책", en: "Aug. 8 Real Estate Measures" }, direction: { ko: "지원", en: "Support" } },
    { government: "lee", date: "2025-06-27", name: { ko: "6.27 부동산 대책", en: "Jun. 27 Real Estate Measures" }, direction: { ko: "강화", en: "Tightening" } },
    { government: "lee", date: "2025-09-05", name: { ko: "9.5 부동산 대책", en: "Sep. 5 Real Estate Measures" }, direction: { ko: "강화", en: "Tightening" } },
    { government: "lee", date: "2025-10-15", name: { ko: "10.15 부동산 대책", en: "Oct. 15 Real Estate Measures" }, direction: { ko: "강화", en: "Tightening" } }
  ]
};

const areaPriceData = {
  label: { ko: "Mid-Small Unit Price", en: "Mid-Small Unit Price" },
  title: { ko: "중소형 평형 매매평균가 비교", en: "Average Sale Price for Mid-Small Unit Sizes" },
  description: {
    ko: "전용면적별 매매평균가 중 중소형 평형만 사용하여 서울, 수도권, 지방 평균 가격을 비교합니다.",
    en: "Compares average sale prices for mid-small unit sizes across Seoul, the capital area, and local regions."
  },
  lineTitle: { ko: "중소형 평형 매매평균가", en: "Mid-Small Unit Average Sale Price" },
  footnote: {
    ko: "* 단위: 만원. 지방 평균은 부산, 대구, 광주, 대전, 울산, 세종, 충북, 충남, 경북, 경남, 전북, 전남, 제주, 강원 중소형 평균값을 단순 평균함.",
    en: "* Unit: KRW 10,000. Local average is the simple average of mid-small unit prices across Busan, Daegu, Gwangju, Daejeon, Ulsan, Sejong, Chungbuk, Chungnam, Gyeongbuk, Gyeongnam, Jeonbuk, Jeonnam, Jeju, and Gangwon."
  },
  months: ["2016.01", "2016.02", "2016.03", "2016.04", "2016.05", "2016.06", "2016.07", "2016.08", "2016.09", "2016.10", "2016.11", "2016.12", "2017.01", "2017.02", "2017.03", "2017.04", "2017.05", "2017.06", "2017.07", "2017.08", "2017.09", "2017.10", "2017.11", "2017.12", "2018.01", "2018.02", "2018.03", "2018.04", "2018.05", "2018.06", "2018.07", "2018.08", "2018.09", "2018.10", "2018.11", "2018.12", "2019.01", "2019.02", "2019.03", "2019.04", "2019.05", "2019.06", "2019.07", "2019.08", "2019.09", "2019.10", "2019.11", "2019.12", "2020.01", "2020.02", "2020.03", "2020.04", "2020.05", "2020.06", "2020.07", "2020.08", "2020.09", "2020.10", "2020.11", "2020.12", "2021.01", "2021.02", "2021.03", "2021.04", "2021.05", "2021.06", "2021.07", "2021.08", "2021.09", "2021.10", "2021.11", "2021.12", "2022.01", "2022.02", "2022.03", "2022.04", "2022.05", "2022.06", "2022.07", "2022.08", "2022.09", "2022.10", "2022.11", "2022.12", "2023.01", "2023.02", "2023.03", "2023.04", "2023.05", "2023.06", "2023.07", "2023.08", "2023.09", "2023.10", "2023.11", "2023.12", "2024.01", "2024.02", "2024.03", "2024.04", "2024.05", "2024.06", "2024.07", "2024.08", "2024.09", "2024.10", "2024.11", "2024.12", "2025.01", "2025.02", "2025.03", "2025.04", "2025.05", "2025.06", "2025.07", "2025.08", "2025.09", "2025.10", "2025.11", "2025.12", "2026.01", "2026.02", "2026.03", "2026.04", "2026.05"],
  series: [
    { id: "seoul", color: "#b65f5b", name: { ko: "서울 중소형 평균", en: "Seoul Mid-Small Average" }, values: [49283.0, 49354.9, 49417.0, 49560.5, 49865.0, 50237.1, 50750.8, 51326.5, 51772.0, 52628.3, 53325.5, 53499.5, 53575.1, 53665.2, 53810.8, 53975.5, 54464.0, 55332.1, 56013.3, 57171.4, 57501.7, 58118.0, 58953.0, 59884.8, 61193.5, 62408.6, 64397.4, 65630.0, 66229.9, 66672.8, 67284.1, 68461.2, 71895.6, 73677.2, 74513.6, 74771.3, 69607.4, 69581.6, 69445.3, 69421.8, 69501.4, 69651.1, 70506.9, 71166.3, 71824.0, 72276.9, 73048.6, 74292.0, 76668.8, 77680.1, 79157.7, 79567.4, 79654.5, 80663.8, 83136.6, 85489.5, 87835.2, 88986.4, 90728.7, 92151.2, 93921.1, 95947.2, 97629.4, 98658.5, 99585.5, 101262.4, 102464.1, 104201.2, 106002.7, 109963.7, 114308.7, 116224.8, 118193.8, 120180.5, 121798.2, 122895.0, 123545.7, 123652.6, 123678.8, 123273.2, 122221.6, 120844.1, 123760.5, 121663.5, 118953.8, 117426.1, 115784.1, 114714.5, 113863.2, 113842.4, 113860.0, 114316.9, 115058.5, 115550.7, 115772.1, 115622.9, 115419.1, 115300.6, 115229.2, 115243.6, 115423.6, 115874.3, 117134.5, 118882.4, 120339.7, 121258.1, 122477.1, 123087.3, 123292.4, 123704.3, 125518.7, 128525.1, 129859.1, 133715.8, 136151.9, 137730.8, 139027.0, 141637.3, 144416.2, 146278.8, 147650.0, 149322.7, 151021.7, 151860.7, 152698.7] },
    { id: "capital", color: "#1f5eff", name: { ko: "수도권 중소형 평균", en: "Capital Area Mid-Small Average" }, values: [35838.9, 35889.6, 35927.7, 35998.4, 36144.8, 36319.0, 36556.1, 36825.0, 37045.5, 37462.4, 37830.1, 37940.4, 37990.3, 38034.6, 38116.1, 38190.6, 38393.5, 38758.1, 39068.5, 39578.2, 39769.7, 40024.7, 40371.4, 40732.6, 41283.3, 41795.1, 42589.7, 43093.2, 43350.2, 43535.6, 43782.0, 44248.8, 45778.9, 46633.8, 47002.3, 47122.8, 44135.7, 44127.2, 44075.5, 44022.0, 44001.7, 44036.7, 44291.1, 44512.4, 44734.8, 45103.6, 45490.7, 46260.1, 46854.4, 47530.8, 48655.4, 49027.2, 49201.5, 49886.6, 51230.9, 52382.9, 53565.7, 54235.4, 55341.1, 56382.4, 57641.6, 59319.3, 60865.4, 61999.7, 62906.4, 64340.5, 65491.0, 67101.0, 68678.2, 71031.4, 73641.3, 74803.7, 75989.7, 77184.2, 78140.0, 78772.6, 79125.0, 79177.7, 79170.0, 78728.8, 77830.0, 76614.9, 77090.6, 75408.9, 73335.8, 72147.7, 70974.0, 70025.6, 69488.7, 69409.3, 69391.5, 69715.6, 70144.3, 70479.2, 70692.3, 70658.2, 70587.5, 70523.1, 70465.6, 70436.0, 70440.8, 70611.3, 71014.9, 71698.2, 72296.9, 72688.2, 73087.8, 73223.8, 73235.6, 73346.5, 73856.1, 74756.5, 75148.4, 76315.2, 77062.4, 77605.1, 78025.9, 78922.1, 79925.5, 80638.3, 81154.8, 81894.5, 82690.4, 83127.4, 83535.3] },
    { id: "local", color: "#6f9b78", name: { ko: "지방 중소형 평균", en: "Local Mid-Small Average" }, values: [21101.5, 21131.9, 21163.8, 21181.9, 21201.1, 21196.8, 21213.4, 21236.6, 21271.0, 21355.4, 21446.5, 21494.1, 21539.7, 21557.5, 21583.7, 21599.1, 21613.7, 21652.1, 21695.6, 21739.2, 21750.9, 21758.1, 21779.8, 21789.9, 21820.6, 21821.3, 21844.7, 21814.7, 21817.6, 21815.7, 21790.5, 21773.1, 21786.5, 21809.9, 21775.6, 21782.8, 21586.7, 21550.1, 21511.7, 21456.3, 21424.3, 21350.2, 21292.0, 21249.5, 21252.1, 21279.3, 21309.1, 21428.7, 21577.1, 21808.7, 22106.2, 22184.0, 22226.7, 22542.3, 22902.2, 23272.4, 23729.5, 24059.5, 24605.0, 25253.9, 25789.7, 26293.1, 26655.8, 26905.7, 27145.3, 27461.8, 27734.4, 28122.0, 28459.9, 30002.3, 31524.1, 32203.5, 32890.7, 33576.2, 34119.8, 34478.4, 34665.4, 34693.4, 34688.1, 34469.1, 34060.6, 33638.7, 35538.7, 34927.7, 34183.2, 33745.4, 33404.9, 33108.0, 32944.8, 32913.1, 32890.5, 32947.7, 33020.8, 33115.9, 33174.4, 33199.1, 33249.4, 33235.8, 33225.6, 33174.5, 33145.5, 33120.1, 33108.6, 33219.7, 33280.2, 33333.5, 33353.5, 33294.5, 33273.2, 33261.7, 33253.7, 33272.1, 33329.0, 33422.0, 33546.4, 33598.3, 33646.9, 33673.7, 33752.6, 33900.4, 34019.8, 34137.1, 34289.7, 34417.4, 34484.8] }
  ]
};

const grdpDonutData = {
  label: { ko: "GRDP Concentration Visualization", en: "GRDP Concentration Visualization" },
  title: { ko: "2024년 권역별 지역내총생산 비중", en: "Regional GRDP Share by Area, 2024" },
  description: {
    ko: "권역별 버튼을 선택하면 해당 권역의 2024년 지역내총생산(GRDP)을 확인할 수 있습니다.",
    en: "Select an area button to view that area's 2024 gross regional domestic product (GRDP)."
  },
  totalLabel: { ko: "2024년 총생산", en: "2024 Total GRDP" },
  selectedLabel: { ko: "선택 권역 총생산", en: "Selected Area GRDP" },
  totalName: { ko: "대한민국", en: "South Korea" },
  totalValue: 2560811,
  note: {
    ko: "* 국가데이터처 「지역소득」 시도별 지역내총생산(2020년 기준), 당해년가격 기준 2024년 자료를 권역별로 합산함. 단위: 10억원.",
    en: "* Based on Statistics Korea regional income data, GRDP by province/city at current prices, 2024 values. Unit: billion KRW."
  },
  additionalNote: {
    ko: "** 매년 12월말 전년도 잠정자료 발표 후 국세, 지방세 등 기초통계자료를 보완하여 익년 12월 확정자료를 발표 및 DB에 수록하기 때문에, 데이터 수집 시점인 2026.06 기준 2025년 GRDP 자료는 공시내용이 없음.",
    en: "** Because preliminary data for the previous year is released at the end of each December, then finalized and added to the database the following December after supplementing base statistics such as national and local taxes, 2025 GRDP data had not been published as of the June 2026 data collection point."
  },
  items: [
    { id: "capitalArea", color: "#b65f5b", name: { ko: "수도권", en: "Capital Area" }, areas: { ko: "서울, 경기, 인천", en: "Seoul, Gyeonggi, Incheon" }, value: 1352044 },
    { id: "southeast", color: "#8b6f5a", name: { ko: "동남권", en: "Southeast Region" }, areas: { ko: "부산, 울산, 경남", en: "Busan, Ulsan, Gyeongnam" }, value: 366264 },
    { id: "chungcheong", color: "#6f9b78", name: { ko: "충청권", en: "Chungcheong Region" }, areas: { ko: "충북, 충남, 세종, 대전", en: "Chungbuk, Chungnam, Sejong, Daejeon" }, value: 316135 },
    { id: "honam", color: "#5f83ad", name: { ko: "호남권", en: "Honam Region" }, areas: { ko: "전북, 전남, 광주", en: "Jeonbuk, Jeonnam, Gwangju" }, value: 224600 },
    { id: "daeguGyeongbuk", color: "#c77b9a", name: { ko: "대구·경북권", en: "Daegu-Gyeongbuk Region" }, areas: { ko: "대구, 경북", en: "Daegu, Gyeongbuk" }, value: 209222 },
    { id: "gangwonJeju", color: "#c48755", name: { ko: "강원·제주권", en: "Gangwon-Jeju Region" }, areas: { ko: "강원, 제주", en: "Gangwon, Jeju" }, value: 91544 }
  ],
  analysis: {
    ko: [
      "GRDP는 지역별 경제 집중도를 보여주는 대리 지표로 활용할 수 있는 지표입니다. 일반적으로 GRDP가 높다는 것은 해당 지역에 일자리, 기업, 소득, 인프라가 집중되어 있음을 의미합니다. 이는 왜 주택 수요가 수도권에 자연스럽게 몰리는지를 설명하게 되는데, 상기한 원형 그래프는 서울, 인천, 경기 지역이 한국 누적 GRDP의 52.7%를 차지한다는 점을 보여주며, 이는 곧 주택 수요가 무작위로 발생하는 것이 아니라 명확한 경제적 유인에 의해 움직인다는 점을 시사합니다. 따라서 부동산 가격 상승 압력은 단순한 주택 시장의 문제가 아닌 지역 경제 집중의 결과로도 이해할 수 있게 됩니다.",
      "다만, 이러한 내용들에 대해서 의문을 제기하실 수 있습니다.",
      "\"그러면 지방에서도 집값이 수도권 일부 지역에 맞먹을만큼 비싼 곳이 있지 않은가?\"",
      "이러한 의문에 대해서 아래의 내용을 통해 설명드리겠습니다."
    ],
    en: [
      "GRDP can be used as a proxy indicator for regional economic concentration. In general, a higher GRDP means that jobs, companies, income, and infrastructure are concentrated in that area. This helps explain why housing demand naturally gravitates toward the capital area. The pie chart above shows that Seoul, Incheon, and Gyeonggi account for 52.7% of Korea's aggregate GRDP, suggesting that housing demand does not arise randomly but moves in response to clear economic incentives. Therefore, upward pressure on real estate prices can be understood not only as a housing-market issue, but also as a result of regional economic concentration.",
      "However, you may still raise a question about this point.",
      "\"Then are there not also places outside the capital area where home prices are as expensive as some capital-area districts?\"",
      "The following section explains that question."
    ]
  }
};

const seoulGrowthSectionCopy = {
  ko: {
    intro: "저희가 선정한 상급지와 하급지가 명확히 나뉘는 기준은 최근 1년간의 KB부동산 데이터 기반 서울시 실거래가 평균이 기준입니다. 이러한 기준에서 확인해보면, 강남구, 서초구, 송파구, 마포구, 용산구, 성동구, 강동구, 광진구가 상급지로 분류되며, 그 외 지역은 하급지로 분류됩니다. 해당 지역의 거래 시세를 조금 더 살펴보기 위해, 아래에서 각 지역별 최근 12개월 간 거래가 변동 추이 그래프를 보여드리고자 합니다.",
    afterTrend: "상급지와 하급지의 거래 금액에는 차이가 꽤 있는 편입니다. 다만, 근본적으로 왜 해당 지역이 상급지가 되었는가와 왜 해당 지역이 하급지가 되었는가에 대해서 따져보게 되면, 크게 짚어봐야 할 내용은 바로 서울특별시 2040 도시기본계획입니다.",
    planIntro: "도심/광역중심/지역중심 버튼을 선택하면 해당되는 기본계획 구역에 점의 형태로 강조표시가 생깁니다. 상급지 강조 스위치를 눌러 상급지 지역을 강조처리한 다음 각 버튼을 눌러가며 비교해보세요.",
    cloneTitle: "서울 2040 도시기본계획과 상급지 간 연관성 비교",
    planAnalysis: [
      "서울 2040 도시기본계획은 서울시를 3도심, 7광역중심, 12지역중심으로 나누어 권역별 균형개발을 활성화하는 취지에서 세워진 도시기본계획입니다. 상급지 강조를 켜고 3도심과 7광역중심을 켜면, 상급지로 지목된 지역과 3도심이 근교에 위치해 있음을 확인할 수 있습니다. 3도심 중 강남 권역에는 강남, 서초, 송파, 강동, 용산, 성동, 광진이 인접한 위치로 배치되어 있고, 서울 도심 권역에는 마포, 용산, 성동이 인접하게 배치되어 있으며, 영등포/여의도 권역에는 마포, 용산이 인접함을 알 수 있습니다. 이는 7광역중심 중 상급지에 인접한 권역이 4권역이라는 점에서도 두드러지는 부분인데, 실제로 7광역중심 중 상암/수색, 용산, 잠실 권역이 해당 상급지 내에 위치해 있다는 점은 이를 뒷받침합니다. 12지역중심까지 들여다볼 경우, 더 극명하게 드러나는 부분이 있는데, 상급지 내에 직접적으로 위치한 12지역중심은 신촌, 마포/공덕, 성수, 천호/길동, 수서/문정, 상급지에 인접한 12지역중심은 동대문, 사당/이수라는 점이 상급지가 상급지로 기능할 수 있는 개발지형도적 가치를 보여줍니다.",
      "실제로 3도심 중 강남은 서울 내 IT 산업의 핵심 중추로, 서울 도심은 서울 원도심으로서의 역사적 지위를 통한 국제문화교류 및 관광 중심지로서의 역할과 동시에 대기업 HQ들의 소재지, 그리고 영등포/여의도 권역은 서울, 더 나아가 대한민국 금융업의 핵심 중추로 기능한다는 점이 특기할만한 사항입니다. 그리고 7광역중심 중 청량리/왕십리 쪽은 서울 동부의 철도교통 거점, 잠실은 롯데그룹의 본진이며 롯데월드 어드벤쳐 서울, 롯데월드타워 등의 요소들로 서울의 관광지로 기능하는 동시에 서울 MICE 산업의 새 중심지, 용산은 구 용산 미군기지의 재개발을 통한 새로운 글로벌 업무지구 육성의 중추이자 윤석열 정권에서 대통령 집무실로 기능했던 이력이 있는 정치적 기능지, 상암/수색은 MBC, 중앙일보/JTBC, CJ ENM의 본사 등을 위시한 한국 언론 및 방송산업의 새로운 거점으로 기능한다는 점이 특기할만한 사항입니다.",
      "이러한 점에서 상급지들은 공통적으로 특정 산업의 중추로 기능하는 지역에서 접근성이 좋다는 공통점을 지닌다는 점을 알 수 있으며, 이를 통해 서울 주요 산업 거점구역의 접근성이 상급지와 하급지의 분류에 영향을 준다고 추론해볼 수 있습니다.",
      "그리고, 상급지로 강조표시된 구역을 보면 하나 특기할만한 사항이 있는데, 바로 한강벨트를 따라 상급지가 분포한다는 점에 있습니다. 실제로 한강 이남에 위치한 상급지인 서초, 강남, 송파, 강동과 한강 이북에 위치한 상급지인 마포, 용산, 성동, 광진을 보면 공통점이 있습니다. 바로 한강변에 위치한 행정구라는 점인데, 실제로 서울에서 한강벨트에 접하지 않은 지역인 한강 이남지역의 구로, 금천, 관악, 양천과 한강 이북지역의 중, 종로, 서대문, 동대문, 중랑, 은평, 성북, 노원, 도봉, 강동을 보면 공통사항이 드러납니다. 한강벨트에 인접해있지 않다라는 점입니다. 다만, 한강벨트에 인접해있는 단지와 그렇지 않은 단지의 시세 차이가 있는 마포, 용산, 성동, 광진의 경우를 생각해본다면 한강벨트는 공통점으로 기능한다는 것 외에 특별한 의미를 부여하기에는 다소 신중할 필요가 있다라는 결론으로 귀결됩니다."
    ]
  },
  en: {
    intro: "The distinction between the upper-tier and lower-tier areas selected here is based on Seoul's average transaction prices from KB Real Estate data over the past year. Under this standard, Gangnam-gu, Seocho-gu, Songpa-gu, Mapo-gu, Yongsan-gu, Seongdong-gu, Gangdong-gu, and Gwangjin-gu are classified as upper-tier areas, while the other districts are classified as lower-tier areas. To examine transaction prices in these areas more closely, the graph below shows the recent 12-month transaction-price trend for each district.",
    afterTrend: "There is a fairly clear gap in transaction prices between upper-tier and lower-tier areas. However, if we ask why certain areas became upper-tier and why others became lower-tier, there are two major points that need to be examined. The first is Seoul's 2040 Comprehensive Urban Plan, which we will address here.",
    planIntro: "Select the metropolitan center, regional center, or local center buttons to mark the corresponding Seoul 2040 planning areas with dots. Turn on the upper-tier highlight switch, then compare the highlighted districts with each center layer.",
    cloneTitle: "Comparison Between the Seoul 2040 Comprehensive Urban Plan and Upper-Tier Areas",
    planAnalysis: []
  }
};

const seoulGrowthUpperTierIds = ["gangnam", "seocho", "songpa", "mapo", "yongsan", "seongdong", "gangdong", "gwangjin"];

const seoulGrowthPlanTiers = {
  core: {
    color: "#2f5f95",
    label: { ko: "3도심", en: "3 Metropolitan Centers" },
    points: [
      { name: { ko: "서울 도심", en: "Seoul CBD" }, x: 52, y: 45 },
      { name: { ko: "여의도·영등포", en: "Yeouido·Yeongdeungpo" }, x: 36, y: 61 },
      { name: { ko: "강남", en: "Gangnam" }, x: 65, y: 67 }
    ]
  },
  metropolitan: {
    color: "#c9151b",
    label: { ko: "7광역중심", en: "7 Regional Centers" },
    points: [
      { name: { ko: "용산", en: "Yongsan" }, x: 45, y: 59 },
      { name: { ko: "청량리·왕십리", en: "Cheongnyangni·Wangsimni" }, x: 62, y: 45 },
      { name: { ko: "창동·상계", en: "Changdong·Sanggye" }, x: 66, y: 16 },
      { name: { ko: "상암·수색", en: "Sangam·Susaek" }, x: 27, y: 43 },
      { name: { ko: "마곡", en: "Magok" }, x: 16, y: 54 },
      { name: { ko: "가산·대림", en: "Gasan·Daerim" }, x: 25, y: 80 },
      { name: { ko: "잠실", en: "Jamsil" }, x: 76, y: 61 }
    ]
  },
  local: {
    color: "#f3c735",
    label: { ko: "12지역중심", en: "12 Local Centers" },
    points: [
      { name: { ko: "동대문", en: "Dongdaemun" }, x: 54, y: 47 },
      { name: { ko: "마포·공덕", en: "Mapo·Gongdeok" }, x: 41, y: 55 },
      { name: { ko: "연신내·불광", en: "Yeonsinnae·Bulgwang" }, x: 35, y: 30 },
      { name: { ko: "신촌", en: "Sinchon" }, x: 39, y: 50 },
      { name: { ko: "목동", en: "Mokdong" }, x: 28, y: 65 },
      { name: { ko: "봉천", en: "Bongcheon" }, x: 40, y: 79 },
      { name: { ko: "사당·이수", en: "Sadang·Isu" }, x: 49, y: 79 },
      { name: { ko: "수서·문정", en: "Suseo·Munjeong" }, x: 77, y: 78 },
      { name: { ko: "천호·길동", en: "Cheonho·Gildong" }, x: 84, y: 55 },
      { name: { ko: "망우", en: "Mangu" }, x: 78, y: 33 },
      { name: { ko: "미아", en: "Mia" }, x: 60, y: 34 },
      { name: { ko: "성수", en: "Seongsu" }, x: 65, y: 49 }
    ]
  }
};

function getBarAxisMax(value) {
  const padded = value * 1.14;
  if (padded <= 4) return 4;
  if (padded <= 6) return 6;
  if (padded <= 8) return 8;
  if (padded <= 12) return 12;
  if (padded <= 16) return 16;
  if (padded <= 20) return 20;
  if (padded <= 25) return 25;
  return Math.ceil(padded / 10) * 10;
}

function formatGrdpValue(value, lang) {
  const trillion = value / 1000;
  return lang === "ko" ? `${trillion.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}조 원` : `KRW ${trillion.toLocaleString("en-US", { maximumFractionDigits: 0 })}T`;
}

function getDonutPoint(cx, cy, radius, angle) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + (radius * Math.cos(radians)),
    y: cy + (radius * Math.sin(radians))
  };
}

function getDonutSegmentPath(startAngle, endAngle, outerRadius = 50, innerRadius = 29) {
  const center = 50;
  const startOuter = getDonutPoint(center, center, outerRadius, startAngle);
  const endOuter = getDonutPoint(center, center, outerRadius, endAngle);
  const startInner = getDonutPoint(center, center, innerRadius, endAngle);
  const endInner = getDonutPoint(center, center, innerRadius, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${startOuter.x.toFixed(3)} ${startOuter.y.toFixed(3)}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${endOuter.x.toFixed(3)} ${endOuter.y.toFixed(3)}`,
    `L ${startInner.x.toFixed(3)} ${startInner.y.toFixed(3)}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${endInner.x.toFixed(3)} ${endInner.y.toFixed(3)}`,
    "Z"
  ].join(" ");
}

function syncGrdpDonutCopy(chart, lang) {
  const intro = ensureElementBefore(chart, ".chart-intro-text[data-grdp-donut-intro]", "p", (element) => {
    element.className = "chart-intro-text";
    element.dataset.grdpDonutIntro = "";
  });
  intro.textContent = grdpDonutData.description[lang];

  const analysis = ensureElementAfter(chart, ".grdp-donut-analysis[data-grdp-donut-analysis]", "div", (element) => {
    element.className = "grdp-donut-analysis";
    element.dataset.grdpDonutAnalysis = "";
  });
  const [main, lead, question, close] = grdpDonutData.analysis[lang];
  analysis.innerHTML = `
    <p>${main}</p>
    <p>${lead}</p>
    <div class="question-callout">
      <p class="question-line"><strong>${question}</strong></p>
    </div>
    <p>${close}</p>
  `;
}

function renderGrdpDonutCharts() {
  document.querySelectorAll("[data-grdp-donut-chart]").forEach((chart) => {
    const lang = chart.dataset.lang || "en";
    syncGrdpDonutCopy(chart, lang);
    const sectorTotal = grdpDonutData.items.reduce((sum, item) => sum + item.value, 0);
    const total = grdpDonutData.totalValue;
    let cursor = 0;
    const segments = grdpDonutData.items.map((item) => {
      const startAngle = cursor;
      const angle = (item.value / sectorTotal) * 360;
      cursor += angle;
      return {
        item,
        startAngle,
        endAngle: cursor,
        midpoint: startAngle + (angle / 2),
        path: getDonutSegmentPath(startAngle, cursor)
      };
    });

    chart.innerHTML = `
      <div class="chart-head">
        <div>
          <p class="chart-label">${grdpDonutData.label[lang]}</p>
          <h3>${grdpDonutData.title[lang]}</h3>
        </div>
        <aside class="chart-detail" aria-live="polite">
          <span data-grdp-detail-label>${grdpDonutData.totalLabel[lang]}</span>
          <h4 data-grdp-detail-name>${grdpDonutData.totalName[lang]}</h4>
          <strong data-grdp-detail-value>${formatGrdpValue(total, lang)}</strong>
          <p data-grdp-detail-meta>${lang === "ko" ? "전체 기준 100.0%" : "100.0% of total"}</p>
        </aside>
      </div>
      <div class="grdp-donut-body">
        <div class="grdp-donut-control-panel">
          <div class="grdp-donut-controls" aria-label="${lang === "ko" ? "권역 선택" : "Select area"}">
            <button class="grdp-donut-toggle is-active" type="button" data-grdp-region="total" aria-pressed="true">
              <span class="grdp-donut-swatch is-total"></span>
              <span class="grdp-donut-toggle-copy">
                <span class="grdp-donut-toggle-name">${grdpDonutData.totalName[lang]}</span>
              </span>
              <strong>100.0%</strong>
            </button>
            ${grdpDonutData.items.map((item) => {
              const share = (item.value / total) * 100;
              return `
                <button class="grdp-donut-toggle" type="button" data-grdp-region="${item.id}" aria-pressed="false">
                  <span class="grdp-donut-swatch" style="background: ${item.color}"></span>
                  <span class="grdp-donut-toggle-copy">
                    <span class="grdp-donut-toggle-name">${item.name[lang]}</span>
                    <span class="grdp-donut-toggle-areas">${item.areas[lang]}</span>
                  </span>
                  <strong>${share.toFixed(1)}%</strong>
                </button>
              `;
            }).join("")}
          </div>
        </div>
        <div class="grdp-donut-visual">
          <svg class="grdp-donut-svg" viewBox="0 0 100 100" role="img" aria-label="${grdpDonutData.title[lang]}">
            ${segments.map(({ item, path }) => `
              <path d="${path}" fill="${item.color}" data-grdp-segment="${item.id}" tabindex="0" role="button" aria-label="${item.name[lang]}"></path>
            `).join("")}
          </svg>
          <span class="grdp-donut-share-badge" data-grdp-share-badge></span>
          <div class="grdp-donut-hole">
            <span data-grdp-hole-label>${grdpDonutData.totalLabel[lang]}</span>
            <strong data-grdp-hole-value>${formatGrdpValue(total, lang)}</strong>
          </div>
        </div>
      </div>
      <p class="chart-footnote">${grdpDonutData.note[lang]}</p>
      <p class="chart-footnote">${grdpDonutData.additionalNote[lang]}</p>
    `;

    const detailLabel = chart.querySelector("[data-grdp-detail-label]");
    const detailName = chart.querySelector("[data-grdp-detail-name]");
    const detailValue = chart.querySelector("[data-grdp-detail-value]");
    const detailMeta = chart.querySelector("[data-grdp-detail-meta]");
    const holeLabel = chart.querySelector("[data-grdp-hole-label]");
    const holeValue = chart.querySelector("[data-grdp-hole-value]");
    const badge = chart.querySelector("[data-grdp-share-badge]");

    const selectGrdpRegion = (regionId) => {
      const isTotal = regionId === "total";
      const item = grdpDonutData.items.find((entry) => entry.id === regionId);
      if (!isTotal && !item) return;

      chart.querySelectorAll("[data-grdp-region]").forEach((control) => {
        const isSelected = control.dataset.grdpRegion === regionId;
        control.classList.toggle("is-active", isSelected);
        control.setAttribute("aria-pressed", String(isSelected));
      });

      if (isTotal) {
        detailLabel.textContent = grdpDonutData.totalLabel[lang];
        detailName.textContent = grdpDonutData.totalName[lang];
        detailValue.textContent = formatGrdpValue(total, lang);
        detailMeta.textContent = lang === "ko" ? "전체 기준 100.0%" : "100.0% of total";
        holeLabel.textContent = grdpDonutData.totalLabel[lang];
        holeValue.textContent = formatGrdpValue(total, lang);
        badge.classList.remove("is-visible");
        chart.querySelectorAll("[data-grdp-segment]").forEach((segmentPath) => {
          segmentPath.classList.remove("is-active", "is-muted");
        });
        return;
      }

      const itemIndex = grdpDonutData.items.indexOf(item);
      const totalShare = (item.value / total) * 100;
      const segment = segments[itemIndex];
      const badgePoint = getDonutPoint(50, 50, 39.5, segment.midpoint);

      detailLabel.textContent = grdpDonutData.selectedLabel[lang];
      detailName.textContent = item.name[lang];
      detailValue.textContent = formatGrdpValue(item.value, lang);
      detailMeta.textContent = lang === "ko" ? `전체 대비 ${totalShare.toFixed(1)}%` : `${totalShare.toFixed(1)}% of total`;
      holeLabel.textContent = item.name[lang];
      holeValue.textContent = formatGrdpValue(item.value, lang);
      badge.textContent = `${totalShare.toFixed(1)}%`;
      badge.style.setProperty("--badge-x", `${badgePoint.x.toFixed(2)}%`);
      badge.style.setProperty("--badge-y", `${badgePoint.y.toFixed(2)}%`);
      badge.style.setProperty("--badge-color", item.color);
      badge.classList.add("is-visible");

      chart.querySelectorAll("[data-grdp-segment]").forEach((segmentPath) => {
        const isSelected = segmentPath.dataset.grdpSegment === item.id;
        segmentPath.classList.toggle("is-active", isSelected);
        segmentPath.classList.toggle("is-muted", !isSelected);
      });
    };

    chart.querySelectorAll("[data-grdp-region]").forEach((button) => {
      button.addEventListener("click", () => selectGrdpRegion(button.dataset.grdpRegion));
    });

    chart.querySelectorAll("[data-grdp-segment]").forEach((segmentPath) => {
      const activateSegment = () => selectGrdpRegion(segmentPath.dataset.grdpSegment);
      segmentPath.addEventListener("click", activateSegment);
      segmentPath.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        activateSegment();
      });
    });
  });
}

function syncComparisonIntro(chart, text) {
  const intro = ensureElementBefore(chart, ".chart-intro-text[data-comparison-intro]", "p", (element) => {
    element.className = "chart-intro-text";
    element.dataset.comparisonIntro = "";
  });
  intro.textContent = text;
}

function getComparisonDetailLabel(lang) {
  return lang === "ko" ? "특정 지역 평균" : "Selected Region Average";
}

function getComparisonValueText(value, lang, config, axis = false) {
  if (config.valueType === "count") return axis ? formatAxisCount(value, lang) : formatCount(value, lang);
  return axis ? formatAxisPrice(value, lang) : formatPrice(value, lang);
}

function getComparisonGapText(gap, lang, config) {
  if (config.valueType === "count") {
    const valueText = formatCount(Math.abs(gap), lang);
    return lang === "ko" ? `${config.baseline[lang]} 대비 ${valueText} ${gap >= 0 ? "많습니다" : "적습니다"}.` : `${valueText} ${gap >= 0 ? "above" : "below"} the ${config.baseline[lang].toLowerCase()}.`;
  }
  const valueText = formatPrice(Math.abs(gap), lang);
  return lang === "ko" ? `지방 평균 대비 ${valueText} ${gap >= 0 ? "높습니다" : "낮습니다"}.` : `${valueText} ${gap >= 0 ? "above" : "below"} the local average.`;
}

function drawComparisonBars(bars, axisMax, lang, config) {
  const width = 760;
  const height = 330;
  const padding = { top: 34, right: 52, bottom: 58, left: 62 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const barWidth = 150;
  const centers = bars.map((_, index) => {
    const ratio = bars.length === 1 ? 0.5 : (index + 1) / (bars.length + 1);
    return padding.left + plotWidth * ratio;
  });
  const yTicks = Array.from({ length: 5 }, (_, index) => {
    const value = axisMax - (axisMax / 4) * index;
    const y = padding.top + (index / 4) * plotHeight;
    return { value, y };
  });

  const tickNodes = yTicks.map((tick) => `
    <g class="comparison-y-tick">
      <line x1="${padding.left}" y1="${tick.y.toFixed(1)}" x2="${width - padding.right}" y2="${tick.y.toFixed(1)}"></line>
      <text x="${padding.left - 10}" y="${(tick.y + 4).toFixed(1)}">${getComparisonValueText(tick.value, lang, config, true)}</text>
    </g>
  `).join("");

  const barNodes = bars.map((bar, index) => {
    const barHeight = (bar.value / axisMax) * plotHeight;
    const x = centers[index] - barWidth / 2;
    const y = padding.top + plotHeight - barHeight;
    const stateClass = bar.id === "baseline" ? "is-baseline" : "is-active";
    return `
      <g class="comparison-bar ${stateClass}" style="--bar-color: ${bar.color}">
        <text class="comparison-bar-value" x="${centers[index].toFixed(1)}" y="${(y - 12).toFixed(1)}">${getComparisonValueText(bar.value, lang, config)}</text>
        <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth}" height="${barHeight.toFixed(1)}" rx="0"></rect>
        <text class="comparison-bar-label" x="${centers[index].toFixed(1)}" y="${(padding.top + plotHeight + 24).toFixed(1)}">${bar.name[lang]}</text>
      </g>
    `;
  }).join("");

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" focusable="false" aria-label="${bars.map((bar) => bar.name[lang]).join(" and ")} comparison">
      ${tickNodes}
      <line class="comparison-axis" x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${padding.top + plotHeight}"></line>
      <line class="comparison-axis" x1="${padding.left}" y1="${padding.top + plotHeight}" x2="${width - padding.right}" y2="${padding.top + plotHeight}"></line>
      ${barNodes}
    </svg>
  `;
}

function renderComparisonChart(chart, selectedId) {
  const lang = chart.dataset.lang || "en";
  const config = comparisonChartData[chart.dataset.comparisonType] || comparisonChartData.capital;
  const selected = config.items.find((item) => item.id === selectedId) || config.items[0];
  const maxValue = Math.max(config.baselineValue, selected.value);
  const gap = selected.value - config.baselineValue;
  const gapText = getComparisonGapText(gap, lang, config);
  const bars = [
    { id: "baseline", name: config.baseline, value: config.baselineValue, color: "#9fb4c9" },
    { ...selected, color: "#1f5eff" }
  ];
  const barAxisMax = getBarAxisMax(maxValue);

  syncComparisonIntro(chart, config.description[lang]);
  chart.innerHTML = `
    <div class="chart-head">
      <div>
        <p class="chart-label">${config.label[lang]}</p>
        <h3>${config.title[lang]}</h3>
      </div>
      <aside class="chart-detail" aria-live="polite">
        <span>${config.detailLabel ? config.detailLabel[lang] : getComparisonDetailLabel(lang)}</span>
        <h4>${selected.name[lang]}</h4>
        <strong>${getComparisonValueText(selected.value, lang, config)}</strong>
        <p>${gapText}</p>
      </aside>
    </div>
    <div class="chart-layout">
      <div class="chart-selector" data-comparison-selector>
        ${config.items.map((item) => `<button class="chart-choice ${item.id === selected.id ? "is-active" : ""}" type="button" data-region="${item.id}" aria-pressed="${item.id === selected.id}"><span>${item.name[lang]}</span></button>`).join("")}
      </div>
      <div class="comparison-chart-plot">
        ${drawComparisonBars(bars, barAxisMax, lang, config)}
      </div>
    </div>
    ${config.footnote ? `<p class="chart-footnote">${config.footnote[lang]}</p>` : ""}
  `;
  updateOverflowingChoices(chart);
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

function syncAcademyCountChart() {
  const sectionTitle = document.querySelector("#analysis-gap");
  if (!sectionTitle) return;

  const localChart = sectionTitle.parentElement?.querySelector('[data-comparison-chart][data-comparison-type="local"]');
  if (!localChart) return;

  const followingParagraphs = [];
  let current = localChart.nextElementSibling;
  while (current && !current.matches(".analysis-subtitle")) {
    if (current.matches("p")) followingParagraphs.push(current);
    if (followingParagraphs.length >= 2) break;
    current = current.nextElementSibling;
  }
  const insertionTarget = followingParagraphs[1];
  if (!insertionTarget) return;

  ensureElementAfter(insertionTarget, "[data-academy-count-chart]", "div", (chart) => {
    chart.className = "interactive-chart";
    chart.dataset.comparisonChart = "";
    chart.dataset.comparisonType = "academy";
    chart.dataset.lang = getPageLang(localChart);
    chart.dataset.academyCountChart = "";
  });
}

function formatVolume(value, lang) {
  const locale = lang === "ko" ? "ko-KR" : "en-US";
  return lang === "ko" ? `${Math.round(value).toLocaleString(locale)}건` : `${Math.round(value).toLocaleString(locale)} transactions`;
}

function formatAxisVolume(value, lang) {
  const locale = lang === "ko" ? "ko-KR" : "en-US";
  return Math.round(value).toLocaleString(locale);
}

function formatAreaPrice(value, lang) {
  const locale = lang === "ko" ? "ko-KR" : "en-US";
  return lang === "ko" ? `${Math.round(value).toLocaleString(locale)}만원` : `KRW ${(value / 100).toLocaleString(locale, { maximumFractionDigits: 1 })}M`;
}

function formatAxisAreaPrice(value, lang) {
  const locale = lang === "ko" ? "ko-KR" : "en-US";
  return lang === "ko" ? `${Math.round(value).toLocaleString(locale)}만` : `${Math.round(value / 100).toLocaleString(locale)}M`;
}

function getTransactionPeriod(id) {
  return transactionVolumeData.periods.find((period) => period.id === id) || transactionVolumeData.periods[0];
}

function getPolicyMonth(date) {
  return date.slice(0, 7).replace("-", ".");
}

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function getPeriodIndexes(months, period) {
  return months
    .map((month, index) => ({ month, index }))
    .filter((item) => item.month >= period.start && item.month <= period.end);
}

function getTransactionPolicyX(date, visibleMonths, paddingLeft, plotWidth) {
  const [yearText, monthText, dayText] = date.split("-");
  const monthKey = `${yearText}.${monthText}`;
  const monthIndex = visibleMonths.indexOf(monthKey);
  if (monthIndex < 0) return null;
  const dayRatio = (Number(dayText) - 1) / getDaysInMonth(Number(yearText), Number(monthText));
  const monthStep = plotWidth / Math.max(visibleMonths.length - 1, 1);
  return paddingLeft + (monthIndex + dayRatio) * monthStep;
}

function getTransactionPolicies(period) {
  return transactionVolumeData.policies.filter((policy) => {
    const policyMonth = getPolicyMonth(policy.date);
    return policyMonth >= period.start && policyMonth <= period.end;
  });
}

function getPolicyMarkerColor(policy) {
  const direction = policy.direction.ko;
  if (direction.includes("강화")) return "#b65f5b";
  if (direction.includes("완화") || direction.includes("지원")) return "#2f5f95";
  return "#7b8794";
}

function getLineChartScale(values, scaleConfig) {
  if (scaleConfig.type === "zero") {
    const max = Math.ceil((Math.max(...values) * scaleConfig.maxMultiplier) / scaleConfig.unit) * scaleConfig.unit;
    return { min: 0, max, range: Math.max(max, 1) };
  }

  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const paddedRange = Math.max((rawMax - rawMin) * scaleConfig.rangeMultiplier, scaleConfig.minRange);
  const step = Math.max(scaleConfig.unit, Math.ceil((paddedRange / 4) / scaleConfig.unit) * scaleConfig.unit);
  const min = Math.max(0, Math.floor((rawMin - step * scaleConfig.paddingSteps) / step) * step);
  const max = Math.ceil((rawMax + step * scaleConfig.paddingSteps) / step) * step;
  return { min, max, range: Math.max(max - min, 1) };
}

function renderPolicyLineChart(container, lang, period, config) {
  const visibleIndexes = getPeriodIndexes(config.data.months, period);
  const visibleMonths = visibleIndexes.map((item) => item.month);
  const visibleSeries = config.data.series.map((series) => ({
    ...series,
    values: visibleIndexes.map((item) => series.values[item.index])
  }));
  const width = Math.max(config.minWidth, visibleMonths.length * config.monthWidth);
  const { height, padding } = config;
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const allValues = visibleSeries.flatMap((series) => series.values);
  const { min, max, range } = getLineChartScale(allValues, config.scale);
  const yTicks = Array.from({ length: 5 }, (_, index) => {
    const value = max - (range / 4) * index;
    const y = padding.top + (index / 4) * plotHeight;
    return { value, y };
  });
  const xLabels = visibleMonths.map((month, index) => {
    if (index !== 0 && index !== visibleMonths.length - 1 && !month.endsWith(".01")) return "";
    const x = padding.left + (index / Math.max(visibleMonths.length - 1, 1)) * plotWidth;
    return `<text class="transaction-x-label" x="${x.toFixed(1)}" y="${height - 22}">${month}</text>`;
  }).join("");
  const yAxisNodes = yTicks.map((tick) => `
    <g class="line-y-tick">
      <line x1="${padding.left}" y1="${tick.y.toFixed(1)}" x2="${width - padding.right}" y2="${tick.y.toFixed(1)}"></line>
      <text x="${padding.left - 10}" y="${(tick.y + 4).toFixed(1)}">${config.axisFormatter(tick.value, lang)}</text>
    </g>
  `).join("");
  const paths = visibleSeries.map((series) => {
    const points = series.values.map((value, index) => {
      const x = padding.left + (index / Math.max(series.values.length - 1, 1)) * plotWidth;
      const y = padding.top + (1 - (value - min) / range) * plotHeight;
      return { x, y, value, month: visibleMonths[index] };
    });
    const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
    const pointNodes = points.map((point, index) => `
      <g class="line-point transaction-line-point" style="--point-delay: ${(260 + index * 18).toFixed(0)}ms">
        <circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="3"></circle>
        <text x="${point.x.toFixed(1)}" y="${(point.y - 10).toFixed(1)}">${config.valueFormatter(point.value, lang)}</text>
      </g>
    `).join("");
    return `
      <g style="--line-color: ${series.color}">
        <path class="line-path transaction-line-path" pathLength="1" d="${path}"></path>
        ${pointNodes}
      </g>
    `;
  }).join("");
  const policyNodes = getTransactionPolicies(period).map((policy, index) => {
    const x = getTransactionPolicyX(policy.date, visibleMonths, padding.left, plotWidth);
    if (x === null) return "";
    const labelY = padding.top + 15 + (index % 3) * 16;
    return `
      <g class="transaction-policy-marker" style="--policy-color: ${getPolicyMarkerColor(policy)}">
        <line x1="${x.toFixed(1)}" y1="${padding.top}" x2="${x.toFixed(1)}" y2="${height - padding.bottom}"></line>
        <text x="${(x + 5).toFixed(1)}" y="${labelY}">${policy.date.slice(5).replace("-", ".")}</text>
        <title>${policy.date} ${policy.name[lang]} (${policy.direction[lang]})</title>
      </g>
    `;
  }).join("");

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" focusable="false" aria-label="${config.title[lang]} line chart" style="width: ${width}px; height: ${config.svgHeight}px;">
      ${yAxisNodes}
      <line class="line-axis" x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}"></line>
      <line class="line-axis" x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}"></line>
      ${policyNodes}
      ${paths}
      ${xLabels}
    </svg>
  `;
}

function drawTransactionLineChart(container, lang, period) {
  renderPolicyLineChart(container, lang, period, {
    data: transactionVolumeData,
    title: transactionVolumeData.title,
    valueFormatter: formatVolume,
    axisFormatter: formatAxisVolume,
    minWidth: 1600,
    monthWidth: 110,
    height: 360,
    svgHeight: 380,
    padding: { top: 34, right: 42, bottom: 54, left: 74 },
    scale: { type: "zero", unit: 10000, maxMultiplier: 1.12 }
  });
}

function drawAreaPriceLineChart(container, lang, period) {
  renderPolicyLineChart(container, lang, period, {
    data: areaPriceData,
    title: areaPriceData.title,
    valueFormatter: formatAreaPrice,
    axisFormatter: formatAxisAreaPrice,
    minWidth: 1600,
    monthWidth: 110,
    height: 400,
    svgHeight: 400,
    padding: { top: 42, right: 54, bottom: 62, left: 88 },
    scale: { type: "padded", unit: 5000, minRange: 10000, rangeMultiplier: 1.24, paddingSteps: 0.7 }
  });
}

function renderTransactionVolumeChart(chart, selectedPeriodId = "all") {
  const lang = chart.dataset.lang || "en";
  const period = getTransactionPeriod(selectedPeriodId);

  chart.innerHTML = `
    <div class="chart-head">
      <div>
        <p class="chart-label">${transactionVolumeData.label[lang]}</p>
        <h3>${transactionVolumeData.title[lang]}</h3>
      </div>
    </div>
    <div class="map-view-toggle transaction-period-selector" role="group" aria-label="${transactionVolumeData.title[lang]} period selector" data-transaction-period-selector>
      ${transactionVolumeData.periods.map((item) => `<button class="map-view-button ${item.id === period.id ? "is-active" : ""}" type="button" data-period="${item.id}" aria-pressed="${item.id === period.id}">${item.name[lang]}</button>`).join("")}
    </div>
    <div class="transaction-chart-block">
      <p class="chart-intro-text">${transactionVolumeData.description[lang]}</p>
      <div class="transaction-legend">
        ${transactionVolumeData.series.map((series) => `<span><i style="--legend-color: ${series.color}"></i>${series.name[lang]}</span>`).join("")}
      </div>
      <h4>${transactionVolumeData.lineTitle[lang]} (${period.range})</h4>
      <div class="line-chart transaction-line-chart" data-transaction-line-chart></div>
    </div>
    <p class="chart-footnote">${transactionVolumeData.footnote[lang]}</p>
  `;
  drawTransactionLineChart(chart.querySelector("[data-transaction-line-chart]"), lang, period);
  updateOverflowingChoices(chart);
}

function renderAreaPriceChart(chart, selectedPeriodId = "all") {
  const lang = chart.dataset.lang || "en";
  const period = getTransactionPeriod(selectedPeriodId);

  chart.innerHTML = `
    <div class="chart-head">
      <div>
        <p class="chart-label">${areaPriceData.label[lang]}</p>
        <h3>${areaPriceData.title[lang]}</h3>
      </div>
    </div>
    <div class="map-view-toggle transaction-period-selector" role="group" aria-label="${areaPriceData.title[lang]} period selector" data-area-price-period-selector>
      ${transactionVolumeData.periods.map((item) => `<button class="map-view-button ${item.id === period.id ? "is-active" : ""}" type="button" data-period="${item.id}" aria-pressed="${item.id === period.id}">${item.name[lang]}</button>`).join("")}
    </div>
    <div class="transaction-chart-block area-price-chart-block">
      <p class="chart-intro-text">${areaPriceData.description[lang]}</p>
      <div class="transaction-legend">
        ${areaPriceData.series.map((series) => `<span><i style="--legend-color: ${series.color}"></i>${series.name[lang]}</span>`).join("")}
      </div>
      <h4>${areaPriceData.lineTitle[lang]} (${period.range})</h4>
      <div class="line-chart transaction-line-chart area-price-line-chart" data-area-price-line-chart></div>
    </div>
    <p class="chart-footnote area-price-footnote">${areaPriceData.footnote[lang]}</p>
  `;
  drawAreaPriceLineChart(chart.querySelector("[data-area-price-line-chart]"), lang, period);
  updateOverflowingChoices(chart);
}

function initTransactionVolumeCharts() {
  document.querySelectorAll("[data-transaction-volume-chart]").forEach((chart) => {
    renderTransactionVolumeChart(chart, "all");
    chart.addEventListener("click", (event) => {
      const button = event.target.closest("[data-period]");
      if (!button) return;
      renderTransactionVolumeChart(chart, button.dataset.period);
    });
  });
}

function initAreaPriceCharts() {
  document.querySelectorAll("[data-area-price-chart]").forEach((chart) => {
    renderAreaPriceChart(chart, "all");
    chart.addEventListener("click", (event) => {
      const button = event.target.closest("[data-period]");
      if (!button) return;
      renderAreaPriceChart(chart, button.dataset.period);
    });
  });
}

function syncRegulationTransactionChart() {
  const sectionTitle = document.querySelector("#analysis-regulations");
  if (!sectionTitle) return;
  const lang = getPageLang(sectionTitle);
  const section = sectionTitle.parentElement;
  const existingTransactionChart = section?.querySelector("[data-transaction-volume-chart]");
  const existingAreaPriceChart = section?.querySelector("[data-area-price-chart]");
  if (existingTransactionChart && existingAreaPriceChart) {
    existingTransactionChart.dataset.lang = lang;
    existingAreaPriceChart.dataset.lang = lang;
    return;
  }
  const transactionChart = ensureElementAfter(sectionTitle, "[data-transaction-volume-chart]", "div", (element) => {
    element.className = "interactive-chart transaction-volume-chart";
    element.dataset.transactionVolumeChart = "";
    element.dataset.lang = lang;
  });
  transactionChart.dataset.lang = lang;

  const areaPriceChart = ensureElementAfter(transactionChart, "[data-area-price-chart]", "div", (element) => {
    element.className = "interactive-chart area-price-chart";
    element.dataset.areaPriceChart = "";
    element.dataset.lang = lang;
  });
  areaPriceChart.dataset.lang = lang;
}

window.addEventListener("resize", () => {
  window.requestAnimationFrame(() => updateOverflowingChoices());
});

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

  if (map.dataset.growthPlanMap === "true") {
    legend.innerHTML = "";
    return;
  }

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
  const isGrowthPlanMap = map.dataset.growthPlanMap === "true";
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

    region.style.stroke = isSelected && !isGrowthPlanMap ? "#0d355a" : "";
    region.style.strokeWidth = isSelected && !isGrowthPlanMap ? "2.4" : "";

    if (isGrowthPlanMap) {
      const showUpperTier = map.dataset.upperTierHeatmap === "true";
      region.style.fill = showUpperTier && seoulGrowthUpperTierIds.includes(dataId) ? "#b8dbc3" : "#dedede";
      region.style.opacity = showUpperTier && seoulGrowthUpperTierIds.includes(dataId) ? "0.94" : "0.56";
      return;
    }

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

function updateSeoulGrowthPlanDots(map) {
  const layer = map.querySelector("[data-plan-dot-layer]");
  if (!layer) return;

  const lang = map.dataset.lang || "en";
  const activeTiers = new Set((map.dataset.activePlanTiers || "").split(",").filter(Boolean));
  layer.innerHTML = Object.entries(seoulGrowthPlanTiers)
    .filter(([id]) => activeTiers.has(id))
    .map(([id, tier]) => tier.points.map((point) => `
      <span class="seoul-plan-dot seoul-plan-dot-${id}" style="left: ${point.x}%; top: ${point.y}%; --dot-color: ${tier.color};" title="${point.name[lang]}">
        <span>${point.name[lang]}</span>
      </span>
    `).join(""))
    .join("");

  map.querySelectorAll("[data-plan-tier]").forEach((button) => {
    const isActive = activeTiers.has(button.dataset.planTier);
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function updateSeoulGrowthSwitchCopy(map) {
  const label = map.querySelector("[data-upper-tier-label]");
  if (!label) return;

  const lang = map.dataset.lang || "en";
  const isActive = map.dataset.upperTierHeatmap === "true";
  label.textContent = isActive
    ? (lang === "ko" ? "상급지 강조 끄기" : "Turn Off Upper-Tier Highlight")
    : (lang === "ko" ? "상급지 강조 켜기" : "Turn On Upper-Tier Highlight");
}

function setupSeoulGrowthPlanMap(clonedHeatmap, lang) {
  const map = clonedHeatmap.querySelector("[data-map-widget]");
  const seoulMap = clonedHeatmap.querySelector(".seoul-map");
  const regionList = clonedHeatmap.querySelector(".map-region-list");
  if (!map || !seoulMap || !regionList) return;

  clonedHeatmap.querySelector(".map-detail")?.remove();
  clonedHeatmap.querySelectorAll(".map-source-note").forEach((note) => note.remove());

  map.dataset.growthPlanMap = "true";
  map.dataset.mapView = "region";
  map.dataset.defaultRegion = "seoul";
  map.dataset.upperTierHeatmap = "false";
  map.dataset.activePlanTiers = "";

  const tierButtons = Object.entries(seoulGrowthPlanTiers).map(([id, tier]) => `
    <button class="seoul-plan-toggle" type="button" data-plan-tier="${id}" aria-pressed="false">
      <span class="seoul-plan-toggle-dot" style="--dot-color: ${tier.color};"></span>
      ${tier.label[lang]}
    </button>
  `).join("");

  regionList.classList.add("seoul-plan-controls");
  regionList.innerHTML = `
    <label class="seoul-plan-switch">
      <input type="checkbox" data-upper-tier-switch>
      <span class="seoul-plan-switch-track" aria-hidden="true"></span>
      <span data-upper-tier-label>${lang === "ko" ? "상급지 강조 켜기" : "Turn On Upper-Tier Highlight"}</span>
    </label>
    <div class="seoul-plan-toggle-group" role="group" aria-label="${lang === "ko" ? "서울 2040 중심지 토글" : "Seoul 2040 center toggles"}">
      ${tierButtons}
    </div>
  `;

  if (!seoulMap.querySelector("[data-plan-dot-layer]")) {
    const dotLayer = document.createElement("div");
    dotLayer.className = "seoul-plan-dot-layer";
    dotLayer.dataset.planDotLayer = "";
    seoulMap.append(dotLayer);
  }

  regionList.addEventListener("click", (event) => {
    const tierButton = event.target.closest("[data-plan-tier]");
    if (!tierButton) return;
    const activeTiers = new Set((map.dataset.activePlanTiers || "").split(",").filter(Boolean));
    if (activeTiers.has(tierButton.dataset.planTier)) {
      activeTiers.delete(tierButton.dataset.planTier);
    } else {
      activeTiers.add(tierButton.dataset.planTier);
    }
    map.dataset.activePlanTiers = Array.from(activeTiers).join(",");
    updateSeoulGrowthPlanDots(map);
  });

  regionList.querySelector("[data-upper-tier-switch]")?.addEventListener("change", (event) => {
    map.dataset.upperTierHeatmap = event.currentTarget.checked ? "true" : "false";
    updateSeoulGrowthSwitchCopy(map);
    updateMapWidget(map, "seoul");
  });

  updateSeoulGrowthSwitchCopy(map);
  updateSeoulGrowthPlanDots(map);
}

function updateMapWidget(map, selectedId) {
  const lang = map.dataset.lang || "en";
  const data = getMapData(map);
  const selected = data.find((item) => item.id === selectedId) || data[0];
  const detailRoot = map.closest(".heatmap-chart") || map;
  const detail = detailRoot.querySelector(".map-detail");
  map.dataset.selectedRegion = selected.id;

  map.querySelectorAll(".map-region").forEach((button) => {
    const members = koreaRegionMembers[selected.id] || [];
    const isActive = button.dataset.region === selected.id || members.includes(button.dataset.region);
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (detail) {
    detail.querySelector("[data-map-cluster]").textContent = selected.cluster[lang];
    detail.querySelector("[data-map-name]").textContent = selected.name[lang];
    detail.querySelector("[data-map-price]").textContent = formatPrice(selected.price, lang);
    detail.querySelector("[data-map-note]").textContent = selected.note[lang];
  }
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

function syncSeoulGrowthSection() {
  const heading = document.getElementById("analysis-seoul-growth");
  if (!heading) return;

  const section = heading.closest(".content-section") || heading.parentElement;
  if (!section) return;

  const lineChart = section.querySelector("[data-interactive-chart]");
  const sourceHeatmap = Array.from(section.querySelectorAll(".interactive-chart.heatmap-chart:not([data-seoul-growth-clone])"))
    .find((chart) => chart.querySelector(".seoul-map-widget"));
  if (!lineChart || !sourceHeatmap) return;

  const lang = getPageLang(lineChart);
  const copy = seoulGrowthSectionCopy[lang] || seoulGrowthSectionCopy.en;
  const lineIntro = lineChart.previousElementSibling;
  const setupParagraph = lineIntro && lineIntro.previousElementSibling;
  if (setupParagraph && setupParagraph.tagName === "P") {
    setupParagraph.textContent = copy.intro;
  }

  const followup = syncContentParagraphsAfter(lineChart, ".content[data-seoul-growth-followup]", [copy.afterTrend], (element) => {
    element.className = "content";
    element.dataset.seoulGrowthFollowup = "";
  });

  const planIntro = syncParagraphAfter(followup, "[data-seoul-plan-intro]", copy.planIntro, (element) => {
    element.className = "chart-intro-text";
    element.dataset.seoulPlanIntro = "";
  });

  const clonedHeatmap = ensureCustomElementAfter(planIntro, "[data-seoul-growth-clone]", () => {
    const clonedHeatmap = sourceHeatmap.cloneNode(true);
    clonedHeatmap.dataset.seoulGrowthClone = "";
    const clonedTitle = clonedHeatmap.querySelector(".chart-head h3");
    const clonedMap = clonedHeatmap.querySelector("[data-map-widget]");
    clonedHeatmap.querySelector(".map-view-toggle")?.remove();
    if (clonedTitle) clonedTitle.textContent = copy.cloneTitle;
    if (clonedMap) clonedMap.dataset.mapView = "region";
    setupSeoulGrowthPlanMap(clonedHeatmap, lang);
    return clonedHeatmap;
  });

  syncContentParagraphsAfter(clonedHeatmap, "[data-seoul-plan-analysis]", copy.planAnalysis || [], (element) => {
    element.className = "content seoul-plan-analysis";
    element.dataset.seoulPlanAnalysis = "";
  });
}

function initPage() {
  syncStaticBodySections();
  syncAnalysisNarrative();
  updateHeader();
  updateStage();
  maybeStartCounters();
  initRevealSections();
  initInteractiveCharts();
  syncSeoulGrowthSection();
  renderGrdpDonutCharts();
  syncAcademyCountChart();
  syncRegulationTransactionChart();
  initComparisonCharts();
  initTransactionVolumeCharts();
  initAreaPriceCharts();
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

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => updateOverflowingChoices());
}
