/**
 * Интерактивные эффекты. Стили к ним — в css/effects.css.
 * Каждый эффект — отдельная функция; чтобы выключить, закомментируйте её вызов внизу.
 */

const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasMouse = matchMedia("(hover: hover) and (pointer: fine)").matches;

/* Блик на стеклянных окнах следует за курсором */
function initGlassSpotlight() {
  if (!hasMouse) return;

  document.addEventListener("pointermove", (event) => {
    const win = event.target.closest(".win");
    if (!win) return;
    const rect = win.getBoundingClientRect();
    win.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    win.style.setProperty("--my", `${event.clientY - rect.top}px`);
  });
}

/* Карточки проектов наклоняются за курсором (не больше 5°) */
function initCardTilt() {
  if (!hasMouse || prefersReducedMotion) return;

  const grid = document.querySelector("#projGrid");
  const MAX_TILT = 5;

  grid.addEventListener("pointermove", (event) => {
    const card = event.target.closest(".card-item:not(.card-item--empty)");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5; // от -0.5 до 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--ry", `${x * MAX_TILT * 2}deg`);
    card.style.setProperty("--rx", `${-y * MAX_TILT * 2}deg`);
  });

  grid.addEventListener(
    "pointerleave",
    (event) => {
      const card = event.target.closest?.(".card-item");
      if (!card) return;
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    },
    true, // ловим уход курсора с каждой карточки
  );
}

/* Заголовки секций: заголовок выезжает, комментарий «//» печатается */
function initSectionReveal() {
  const heads = document.querySelectorAll("[data-reveal]");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("js-reveal");

  // Запоминаем текст комментариев и прячем его до появления секции
  heads.forEach((head) => {
    const comment = head.querySelector(".comment");
    if (!comment) return;
    comment.dataset.text = comment.textContent.trim().replace(/\s+/g, " ");
    comment.textContent = "";
    comment.style.minHeight = "3.2em"; // чтобы вёрстка не прыгала во время печати
  });

  const typeText = (element) => {
    const text = element.dataset.text;
    const caret = document.createElement("span");
    caret.className = "caret";
    let index = 0;

    const step = () => {
      element.textContent = text.slice(0, index);
      element.append(caret);
      if (index < text.length) {
        index += 1;
        setTimeout(step, 18);
      } else {
        setTimeout(() => caret.remove(), 2500); // курсор мигает и исчезает
      }
    };
    step();
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const head = entry.target;
        head.classList.add("is-visible");
        const comment = head.querySelector(".comment");
        if (comment?.dataset.text) setTimeout(() => typeText(comment), 300);
        observer.unobserve(head);
      });
    },
    { threshold: 0.4 },
  );

  heads.forEach((head) => observer.observe(head));
}

/* Иконка в доке подпрыгивает при нажатии */
function initDockBounce() {
  if (prefersReducedMotion) return;

  document.querySelector("#dock").addEventListener("click", (event) => {
    const link = event.target.closest(".dk");
    if (!link) return;
    link.classList.remove("is-bouncing");
    void link.offsetWidth; // перезапуск анимации, если нажали повторно
    link.classList.add("is-bouncing");
    link.addEventListener("animationend", () => link.classList.remove("is-bouncing"), {
      once: true,
    });
  });
}

/* Волны на фоне смещаются при прокрутке */
function initWaveParallax() {
  if (prefersReducedMotion) return;

  const wall = document.querySelector(".wall");
  let ticking = false;

  addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        wall.style.setProperty("--scroll", Math.round(scrollY));
        ticking = false;
      });
    },
    { passive: true },
  );
}

/* Запуск */
initGlassSpotlight();
initCardTilt();
initSectionReveal();
initDockBounce();
initWaveParallax();
