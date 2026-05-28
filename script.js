const CONTACT_EMAIL = "manpcha@gmail.com";

const form = document.querySelector("#estimateForm");
const note = document.querySelector("#formNote");
const navEmailLink = document.querySelector("#navEmailLink");
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector("#main-nav");
const navOverlay = document.querySelector(".nav-overlay");

let latestMailto = "";

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
      setNavOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) {
      setNavOpen(false);
    }
  });
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
