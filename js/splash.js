/**
 * Экран приветствия. Показывается один раз за визит (до закрытия вкладки).
 * Пропустить — клик или любая клавиша.
 */
(function () {
  const splash = document.getElementById("splash");
  const STORAGE_KEY = "splash-seen";

  let alreadySeen = false;
  try {
    alreadySeen = sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {}

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (alreadySeen || reduceMotion) {
    splash.remove();
    return;
  }

  splash.hidden = false;
  document.documentElement.classList.add("splash-active");

  const textEl = splash.querySelector(".splash__text");
  const caret = document.createElement("span");
  caret.className = "splash__caret";
  const TEXT = "// Hello world!";
  const timers = [];
  let finished = false;

  // Печать текста по буквам
  function type(index) {
    textEl.textContent = TEXT.slice(0, index);
    textEl.append(caret);
    if (index < TEXT.length) timers.push(setTimeout(() => type(index + 1), 85));
    else timers.push(setTimeout(leave, 900));
  }

  function leave() {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}

    splash.classList.add("is-leaving");
    document.documentElement.classList.remove("splash-active"); // запускаем анимации сайта
    setTimeout(() => splash.remove(), 1100);
  }

  timers.push(setTimeout(() => type(0), 650)); // ждём, пока появится звезда
  splash.addEventListener("click", leave);
  addEventListener("keydown", leave, { once: true });
})();
