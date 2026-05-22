const CONTACT_EMAIL = "manpcha@gmail.com";

const form = document.querySelector("#estimateForm");
const note = document.querySelector("#formNote");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = data.get("name").trim();
  const email = data.get("email").trim();
  const phone = data.get("phone").trim();
  const company = data.get("company").trim();
  const industry = data.get("industry");
  const keywords = data.get("keywords").trim();
  const location = data.get("location").trim();
  const message = data.get("message").trim() || "별도 요청 내용 없음";

  const subject = `[유튜브검색 광고 견적 요청] ${company} / ${industry}`;
  const body = [
    "유튜브검색 광고 견적 요청이 접수되었습니다.",
    "",
    `이름: ${name}`,
    `이메일: ${email}`,
    `연락처: ${phone}`,
    `상호: ${company}`,
    `업종: ${industry}`,
    `희망 키워드: ${keywords}`,
    `소재지: ${location}`,
    "",
    "기타 요청 사항:",
    message,
  ].join("\n");

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;

  note.textContent = "메일 작성창이 열리지 않으면 브라우저 또는 PC의 기본 메일 앱 설정을 확인해주세요.";
});
