const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const panels = Array.from(document.querySelectorAll("[data-stage-panel]"));
const stage = document.querySelector(".scroll-stage");
const counters = Array.from(document.querySelectorAll("[data-count]"));
let countersStarted = false;

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
    panel.classList.toggle("is-active", index === activeIndex);
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
