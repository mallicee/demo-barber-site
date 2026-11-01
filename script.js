/* =========================================================
   Demo Barber — скрипты
   ========================================================= */

/* ---------------------------------------------------------
   ⚠️  ВПИШИТЕ СЮДА ССЫЛКУ НА СВОЕГО TELEGRAM-БОТА  ⚠️
   Замените ИМЯ_БОТА на username бота (без @),
   например: "https://t.me/demo_barber_bot"
   Эта ссылка автоматически подставится во все кнопки «Записаться».
   --------------------------------------------------------- */
const BOT_LINK = "https://t.me/ИМЯ_БОТА";


document.documentElement.classList.remove("no-js");

/* ---------- Ссылки на бота ---------- */
document.querySelectorAll(".js-bot-link").forEach((link) => {
  link.href = BOT_LINK;
});

/* ---------- Год в подвале ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Шапка: фон при прокрутке ---------- */
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* ---------- Мобильное меню ---------- */
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

function setMenu(open) {
  nav.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  document.body.classList.toggle("menu-open", open);
}

burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});

/* ---------- Появление блоков при прокрутке ---------- */
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        // Небольшая задержка для соседних карточек — эффект «лесенки»
        const siblings = [...entry.target.parentElement.children].filter((el) => el.classList.contains("reveal"));
        const index = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${Math.min(index, 5) * 90}ms`;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

/* ---------- Аккордеон FAQ ---------- */
document.querySelectorAll(".faq__item").forEach((item) => {
  const btn = item.querySelector(".faq__q");
  btn.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");
    // Закрываем остальные, чтобы был открыт только один ответ
    document.querySelectorAll(".faq__item.is-open").forEach((other) => {
      other.classList.remove("is-open");
      other.querySelector(".faq__q").setAttribute("aria-expanded", "false");
    });
    if (!isOpen) {
      item.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
});

/* ---------- Форма заявки ---------- */
const form = document.getElementById("booking-form");
const success = document.getElementById("form-success");
const phoneInput = document.getElementById("f-phone");

// Маска телефона: +7 (900) 000-00-00
phoneInput.addEventListener("input", () => {
  let digits = phoneInput.value.replace(/\D/g, "");
  if (!digits) { phoneInput.value = ""; return; }
  if (digits[0] === "8") digits = "7" + digits.slice(1);
  if (digits[0] !== "7") digits = "7" + digits;
  digits = digits.slice(0, 11);

  let out = "+7";
  if (digits.length > 1) out += " (" + digits.slice(1, 4);
  if (digits.length >= 4) out += ")";
  if (digits.length > 4) out += " " + digits.slice(4, 7);
  if (digits.length > 7) out += "-" + digits.slice(7, 9);
  if (digits.length > 9) out += "-" + digits.slice(9, 11);
  phoneInput.value = out;
});

const validators = {
  name(value) {
    const v = value.trim();
    if (!v) return "Введите имя";
    if (v.length < 2) return "Имя слишком короткое";
    if (!/^[A-Za-zА-Яа-яЁё\s-]+$/.test(v)) return "Используйте только буквы";
    return "";
  },
  phone(value) {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "Введите номер телефона";
    if (digits.length !== 11) return "Номер должен содержать 11 цифр";
    return "";
  },
  service(value) {
    return value ? "" : "Выберите услугу";
  },
};

function validateField(field) {
  const message = validators[field.name](field.value);
  const wrapper = field.closest(".form__field");
  wrapper.classList.toggle("has-error", Boolean(message));
  wrapper.querySelector(".form__error").textContent = message;
  field.setAttribute("aria-invalid", message ? "true" : "false");
  return !message;
}

// Проверяем поле, когда пользователь из него уходит, и убираем ошибку при исправлении
[...form.elements].forEach((field) => {
  if (!validators[field.name]) return;
  field.addEventListener("blur", () => validateField(field));
  field.addEventListener("input", () => {
    if (field.closest(".form__field").classList.contains("has-error")) validateField(field);
  });
  field.addEventListener("change", () => validateField(field));
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fields = [...form.elements].filter((f) => validators[f.name]);
  const results = fields.map(validateField);
  const firstInvalid = fields[results.indexOf(false)];

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  // Демо: заявка никуда не отправляется
  success.hidden = false;
  form.reset();
  setTimeout(() => { success.hidden = true; }, 6000);
});
