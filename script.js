const CONTACT_EMAIL = "manpcha@gmail.com";
const WEB3FORMS_ACCESS_KEY = "e02262c0-b695-40c0-849e-4a989eb19e45";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

const form = document.querySelector("#estimateForm");
const note = document.querySelector("#formNote");
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector("#main-nav");
const navOverlay = document.querySelector(".nav-overlay");
const simulationTriggers = document.querySelectorAll(".simulation-trigger");
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
const consentModal = document.querySelector("#consentModal");
const consentBackdrop = document.querySelector("#consentBackdrop");
const consentModalConfirm = document.querySelector("#consentModalConfirm");

let isEstimateSubmitting = false;

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

function openConsentModal() {
  if (!consentModal) {
    return;
  }

  consentModal.hidden = false;
  consentModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("simulation-open");
  consentModalConfirm?.focus();
}

function closeConsentModal() {
  if (!consentModal) {
    return;
  }

  consentModal.hidden = true;
  consentModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("simulation-open");
  form?.querySelector('[name="privacyConsent"]')?.focus();
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
      if (consentModal && !consentModal.hidden) {
        closeConsentModal();
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

simulationTriggers.forEach((trigger) => {
  trigger.addEventListener("click", openSimulation);
});
navSimulation?.addEventListener("click", openSimulation);
simulationBackdrop?.addEventListener("click", closeSimulation);
simCancel?.addEventListener("click", closeSimulation);
simDone?.addEventListener("click", closeSimulation);
simRun?.addEventListener("click", runSimulation);

if (new URLSearchParams(window.location.search).get("simulation") === "1") {
  openSimulation();
}

if (form && note) {
  const submitButton = form.querySelector('button[type="submit"]');
  const privacyConsentInput = form.querySelector('[name="privacyConsent"]');

  form.addEventListener("invalid", (event) => {
    event.preventDefault();

    if (event.target === privacyConsentInput) {
      note.textContent = "";
      note.classList.remove("is-success", "is-error");
      openConsentModal();
      return;
    }

    note.textContent = "필수 입력 항목을 확인해주세요.";
    note.classList.remove("is-success", "is-error");
    event.target.focus();
  }, true);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isEstimateSubmitting) {
      return;
    }

    if (!privacyConsentInput?.checked) {
      note.textContent = "";
      note.classList.remove("is-success", "is-error");
      openConsentModal();
      return;
    }

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

    isEstimateSubmitting = true;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "전송 중...";
    }
    note.textContent = "견적 요청을 전송하고 있습니다. 잠시만 기다려 주세요.";
    note.classList.remove("is-success", "is-error");

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject,
          from_name: name,
          name,
          email,
          phone,
          company,
          industry,
          keywords,
          location,
          message,
          privacy_consent: consent,
          botcheck: "",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "전송에 실패했습니다.");
      }

      form.reset();
      note.textContent = "견적 요청이 접수되었습니다. 확인 후 빠르게 회신드리겠습니다.";
      note.classList.add("is-success");
      note.classList.remove("is-error");
    } catch (error) {
      note.textContent = "전송에 실패했습니다. 잠시 후 다시 시도하시거나 이메일(manpcha@gmail.com) 또는 카카오톡 상담을 이용해 주세요.";
      note.classList.add("is-error");
      note.classList.remove("is-success");
    } finally {
      isEstimateSubmitting = false;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "견적 요청 보내기";
      }
    }
  });
}

consentBackdrop?.addEventListener("click", closeConsentModal);
consentModalConfirm?.addEventListener("click", closeConsentModal);
