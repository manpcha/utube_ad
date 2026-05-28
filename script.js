const CONTACT_EMAIL = "manpcha@gmail.com";

const form = document.querySelector("#estimateForm");
const note = document.querySelector("#formNote");
const navEmailLink = document.querySelector("#navEmailLink");
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector("#main-nav");
const navOverlay = document.querySelector(".nav-overlay");
const simulationOpen = document.querySelector("#simulationOpen");
const navSimulation = document.querySelector("#navSimulation");
const simulationModal = document.querySelector("#simulationModal");
const simulationBackdrop = document.querySelector("#simulationBackdrop");
const simulationFormStep = document.querySelector("#simulationFormStep");
const simulationResultStep = document.querySelector("#simulationResultStep");
const simCompany = document.querySelector("#simCompany");
const simKeyword = document.querySelector("#simKeyword");
const simulationHint = document.querySelector("#simulationHint");
const simRun = document.querySelector("#simRun");
const simCancel = document.querySelector("#simCancel");
const simDone = document.querySelector("#simDone");
const simSearchBox = document.querySelector("#simSearchBox");
const simSuggestions = document.querySelector("#simSuggestions");

let latestMailto = "";

const RELATED_SUFFIXES = [
  "추천",
  "가격",
  "후기",
  "잘하는 곳",
  "비용",
  "TOP10",
  "비교",
  "예약",
  "상담",
  "이벤트",
];

function setNavOpen(isOpen) {
  if (!navToggle || !mainNav || !navOverlay) {
    return;
  }

  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
  mainNav.classList.toggle("is-open", isOpen);
  navOverlay.classList.toggle("is-visible", isOpen);
  navOverlay.hidden = !isOpen;
  document.body.classList.toggle("nav-open", isOpen);
}

function resetSimulationForm() {
  if (simCompany) {
    simCompany.value = "";
  }
  if (simKeyword) {
    simKeyword.value = "";
  }
  if (simulationHint) {
    simulationHint.hidden = true;
  }
  if (simulationFormStep) {
    simulationFormStep.hidden = false;
  }
  if (simulationResultStep) {
    simulationResultStep.hidden = true;
  }
  if (simSuggestions) {
    simSuggestions.innerHTML = "";
  }
}

function openSimulation() {
  if (!simulationModal) {
    return;
  }

  setNavOpen(false);
  resetSimulationForm();
  simulationModal.hidden = false;
  simulationModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("simulation-open");
  simCompany?.focus();
}

function closeSimulation() {
  if (!simulationModal) {
    return;
  }

  simulationModal.hidden = true;
  simulationModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("simulation-open");
  resetSimulationForm();
}

function buildSuggestionList(keyword, company) {
  const brandLine = `${keyword} ${company}`;
  const pool = RELATED_SUFFIXES.map((suffix) => `${keyword} ${suffix}`);
  const totalCount = 8;
  const brandPosition = Math.floor(Math.random() * 6) + 3;
  const suggestions = [];

  let poolIndex = 0;
  for (let index = 1; index <= totalCount; index += 1) {
    if (index === brandPosition) {
      suggestions.push({ text: brandLine, highlight: true });
      continue;
    }

    suggestions.push({
      text: pool[poolIndex % pool.length],
      highlight: false,
    });
    poolIndex += 1;
  }

  return suggestions;
}

function runSimulation() {
  const company = simCompany?.value.trim() || "";
  const keyword = simKeyword?.value.trim() || "";

  if (!company || !keyword) {
    if (simulationHint) {
      simulationHint.hidden = false;
    }
    if (!company) {
      simCompany?.focus();
    } else {
      simKeyword?.focus();
    }
    return;
  }

  if (simulationHint) {
    simulationHint.hidden = true;
  }

  const suggestions = buildSuggestionList(keyword, company);

  if (simSearchBox) {
    simSearchBox.textContent = keyword;
  }

  if (simSuggestions) {
    simSuggestions.innerHTML = suggestions
      .map(({ text, highlight }) => {
        const className = highlight ? ' class="highlight"' : "";
        return `<li${className}>${text}</li>`;
      })
      .join("");
  }

  if (simulationFormStep) {
    simulationFormStep.hidden = true;
  }
  if (simulationResultStep) {
    simulationResultStep.hidden = false;
  }
}

if (navToggle && mainNav && navOverlay) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setNavOpen(!isOpen);
  });

  navOverlay.addEventListener("click", () => {
    setNavOpen(false);
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setNavOpen(false);
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (simulationModal && !simulationModal.hidden) {
        closeSimulation();
        return;
      }
      setNavOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) {
      setNavOpen(false);
    }
  });
}

simulationOpen?.addEventListener("click", openSimulation);
navSimulation?.addEventListener("click", openSimulation);
simulationBackdrop?.addEventListener("click", closeSimulation);
simCancel?.addEventListener("click", closeSimulation);
simDone?.addEventListener("click", closeSimulation);
simRun?.addEventListener("click", runSimulation);

if (new URLSearchParams(window.location.search).get("simulation") === "1") {
  openSimulation();
}

const navEmailSubject = "[유튜브검색 광고 견적요청] 귀사의 회사 상호/업종";
const navEmailBody = [
  "유튜브검색 광고 견적 요청드립니다.",
  "이름: ",
  "이메일: ",
  "연락처: ",
  "상호: ",
  "업종: ",
  "희망 키워드: 세 개 정도 콤마로 구분",
  "소재지: ",
  "개인정보 수집 및 이용 동의: 동의함",
  "기타 요청 사항: ",
].join("\n");

if (navEmailLink) {
  navEmailLink.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(navEmailSubject)}&body=${encodeURIComponent(navEmailBody)}`;
}

if (form && note) {
  form.addEventListener("invalid", (event) => {
    event.preventDefault();
    note.textContent = "필수 입력 항목과 개인정보 수집 및 이용 동의 체크 여부를 확인해주세요.";
    event.target.focus();
  }, true);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = data.get("name").trim();
    const email = data.get("email").trim();
    const phone = data.get("phone").trim();
    const company = data.get("company").trim() || "미입력";
    const industry = data.get("industry") || "미입력";
    const keywords = data.get("keywords").trim() || "미입력";
    const location = data.get("location").trim() || "미입력";
    const message = data.get("message").trim() || "별도 요청 내용 없음";
    const consent = data.get("privacyConsent") ? "동의함" : "미동의";

    const subjectName = company === "미입력" ? name : company;
    const subject = `[유튜브검색 광고 견적 요청] ${subjectName} / ${industry}`;
    const body = [
      "유튜브검색 광고 견적 요청드립니다.",
      "",
      `이름: ${name}`,
      `이메일: ${email}`,
      `연락처: ${phone}`,
      `상호: ${company}`,
      `업종: ${industry}`,
      `희망 키워드: ${keywords}`,
      `소재지: ${location}`,
      `개인정보 수집 및 이용 동의: ${consent}`,
      "",
      "기타 요청 사항:",
      message,
    ].join("\n");

    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    latestMailto = mailto;
    window.location.href = mailto;

    note.innerHTML = `메일 작성창이 열리지 않으면 <a href="${latestMailto}">여기를 눌러 다시 열어주세요.</a>`;
  });
}
