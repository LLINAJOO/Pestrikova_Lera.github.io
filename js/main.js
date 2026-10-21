/**
 * Логика страницы: док-навигация, проекты с подробным окном,
 * достижения с просмотром документов, копирование почты, часы и тема.
 * Данные берутся из js/data.js, иконки — из js/icons.js.
 */

const $ = (selector) => document.querySelector(selector);

/* ==========================================================================
   Док-навигация
   ========================================================================== */

const NAV_ITEMS = [
  {
    id: "top",
    label: "Обо мне",
    icon: "home",
    color: "linear-gradient(160deg, #ff9a8b, #ff6a88 55%, #ff99ac)",
  },
  {
    id: "projects",
    label: "Проекты",
    icon: "folder",
    color: "linear-gradient(160deg, #6ec6ff, #2196f3)",
  },
  {
    id: "awards",
    label: "Достижения",
    icon: "trophy",
    color: "linear-gradient(160deg, #ffd54f, #ff9800)",
  },
  {
    id: "contact",
    label: "Связь",
    icon: "send",
    color: "linear-gradient(160deg, #69f0ae, #00b85c)",
  },
];

function initDock() {
  const dock = $("#dock");

  dock.innerHTML = NAV_ITEMS.map(
    (item) => `
      <a class="dk" href="#${item.id}">
        ${tileIcon(item.color, item.icon)}
        <span class="lbl">${item.label}</span>
      </a>`,
  ).join("");

  const links = [...dock.querySelectorAll(".dk")];
  const sections = NAV_ITEMS.map((item) => document.getElementById(item.id));

  // Увеличение иконок под курсором — только для мыши
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    dock.addEventListener("pointermove", (event) => {
      links.forEach((link) => {
        const rect = link.getBoundingClientRect();
        const distance = Math.abs(event.clientX - (rect.left + rect.width / 2));
        const scale = 1 + Math.max(0, 1 - distance / 120) * 0.4;
        link.style.setProperty("--s", scale.toFixed(3));
      });
    });
    dock.addEventListener("pointerleave", () => {
      links.forEach((link) => link.style.setProperty("--s", 1));
    });
  }

  // Подсветка раздела, который сейчас на экране
  function highlightCurrentSection() {
    let current = 0;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top < innerHeight * 0.45) current = index;
    });

    const reachedBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 4;
    if (reachedBottom) current = sections.length - 1;

    links.forEach((link, index) => {
      link.classList.toggle("on", index === current);
      link.toggleAttribute("aria-current", index === current);
    });
  }

  addEventListener("scroll", highlightCurrentSection, { passive: true });
  highlightCurrentSection();
}

/* ==========================================================================
   Модальные окна: общая логика открытия и закрытия
   ========================================================================== */

let lastFocused = null;

function openOverlay(overlay) {
  lastFocused = document.activeElement;
  overlay.hidden = false;
  document.body.classList.add("no-scroll");
  requestAnimationFrame(() => overlay.classList.add("is-open"));
  overlay.querySelector("[data-close]").focus({ preventScroll: true });
}

function closeOverlay(overlay) {
  overlay.classList.remove("is-open");
  document.body.classList.remove("no-scroll");
  setTimeout(() => {
    overlay.hidden = true;
    lastFocused?.focus({ preventScroll: true });
  }, 200);
}

function initOverlay(overlay) {
  // Закрыть: красная кнопка или клик по затемнённому фону
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay || event.target.closest("[data-close]")) closeOverlay(overlay);
  });
}

/* ==========================================================================
   Раздел «Проекты»
   ========================================================================== */

const STATUSES = {
  live: { label: "Работает", color: "#28c840" },
  wip: { label: "В разработке", color: "#febc2e" },
  plan: { label: "В планах", color: "var(--fg-3)" },
};

const PROJECT_FILTERS = [
  { key: "all", label: "Все проекты", icon: "folder" },
  { key: "live", label: "Работают", icon: "code" },
  { key: "wip", label: "В разработке", icon: "bricks" },
];

let projectFilter = "all";

function countProjects(filterKey) {
  return filterKey === "all"
    ? PROJECTS.length
    : PROJECTS.filter((project) => project.status === filterKey).length;
}

function renderProjectSidebar() {
  $("#projSide").innerHTML =
    "<h6>Портфолио</h6>" +
    PROJECT_FILTERS.map(
      (filter) => `
        <button class="${filter.key === projectFilter ? "on" : ""}" data-filter="${filter.key}">
          ${ICONS[filter.icon]}${filter.label}
          <span class="cnt">${countProjects(filter.key)}</span>
        </button>`,
    ).join("");
}

function projectCard(project) {
  const status = STATUSES[project.status];
  return `
    <button class="card-item" data-project="${project.id}">
      <span class="card-item__shot"><img src="${project.image}" alt="" loading="lazy"></span>
      <span class="card-item__body">
        ${tileIcon(project.color, project.icon)}
        <span class="card-item__text">
          <b>${project.name}</b>
          <span class="status" style="--c: ${status.color}"><i></i>${status.label}</span>
          <small>${project.summary}</small>
        </span>
      </span>
    </button>`;
}

// Пустая карточка-заглушка под будущие проекты
const NEXT_PROJECT_CARD = `
  <div class="card-item card-item--empty" aria-hidden="true">
    <span class="card-item__shot">+</span>
    <span class="card-item__body"><span class="card-item__text">
      <b>Новый проект</b><small>Здесь появится следующая работа</small>
    </span></span>
  </div>`;

function renderProjectGrid() {
  const visible = PROJECTS.filter(
    (project) => projectFilter === "all" || project.status === projectFilter,
  );
  $("#projGrid").innerHTML =
    visible.map(projectCard).join("") + (projectFilter === "all" ? NEXT_PROJECT_CARD : "");
}

function renderProjects() {
  renderProjectSidebar();
  renderProjectGrid();
}

function openProject(id) {
  const project = PROJECTS.find((item) => item.id === id);
  if (!project) return;

  const status = STATUSES[project.status];

  const progress = project.progress
    ? `<div class="detail-block">
         <div class="prog"><i style="--v: ${project.progress}%"></i></div>
         <small class="prog-label">Готовность ${project.progress}%</small>
       </div>`
    : "";

  const link = project.url
    ? `<a class="pbtn" href="${project.url}" target="_blank" rel="noopener">Открыть ${project.domain} ↗</a>`
    : `<span class="pbtn pbtn--disabled">Сайт скоро откроется</span>`;

  $("#projectModalBar").textContent = project.name;
  $("#projectModalBody").innerHTML = `
    <div class="detail">
      <div class="detail__shot"><img src="${project.image}" alt="Скриншот сайта «${project.name}»"></div>
      <div class="detail__info">
        <div class="detail__head">
          ${tileIcon(project.color, project.icon)}
          <div>
            <h3 id="projectModalTitle">${project.name}</h3>
            <span class="status" style="--c: ${status.color}"><i></i>${status.label}</span>
          </div>
        </div>
        ${project.about.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        ${progress}
        <div class="detail-block">
          <h4>Что есть на сайте</h4>
          <ul class="checklist">${project.features.map((feature) => `<li>${feature}</li>`).join("")}</ul>
        </div>
        <dl class="detail-meta">
          <dt>Моя роль</dt><dd>${project.role}</dd>
          ${project.url ? `<dt>Адрес</dt><dd>${project.domain}</dd>` : ""}
        </dl>
        ${link}
      </div>
    </div>`;

  openOverlay($("#projectModal"));
}

function initProjects() {
  initOverlay($("#projectModal"));

  $("#projSide").addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    projectFilter = button.dataset.filter;
    renderProjects();
  });

  $("#projGrid").addEventListener("click", (event) => {
    const card = event.target.closest("[data-project]");
    if (card) openProject(card.dataset.project);
  });

  renderProjects();
}

/* ==========================================================================
   Раздел «Достижения» и просмотр документов
   ========================================================================== */

const AWARD_FOLDERS = [
  { name: "Все", icon: "folder" },
  { name: "Дипломы", icon: "cap" },
  { name: "Сертификаты", icon: "cert" },
  { name: "Конференции", icon: "mic" },
  { name: "Другое", icon: "screen" },
];

let awardFolder = "Все";
let viewerList = []; // документы текущей папки — по ним листает просмотр
let viewerIndex = 0;

function awardsInFolder(folder) {
  return folder === "Все"
    ? ACHIEVEMENTS
    : ACHIEVEMENTS.filter((award) => award.folders.includes(folder));
}

function renderAwardSidebar() {
  $("#awSide").innerHTML =
    "<h6>Папки</h6>" +
    AWARD_FOLDERS.map(
      (folder) => `
        <button class="${folder.name === awardFolder ? "on" : ""}" data-folder="${folder.name}">
          ${ICONS[folder.icon]}${folder.name}
          <span class="cnt">${awardsInFolder(folder.name).length}</span>
        </button>`,
    ).join("");
}

function renderAwardGrid() {
  viewerList = awardsInFolder(awardFolder);

  if (viewerList.length === 0) {
    $("#awGrid").innerHTML = `
      <div class="empty">
        ${tileIcon("linear-gradient(160deg, #80cbc4, #00897b)", "screen")}
        <b>Папка «${awardFolder}» пока пуста</b>
        Скоро здесь появятся новые документы
      </div>`;
    return;
  }

  $("#awGrid").innerHTML = viewerList
    .map(
      (award, index) => `
        <button class="doc" data-index="${index}">
          <span class="doc__paper"><img src="${award.thumb}" alt="" loading="lazy"></span>
          <b>${award.title}</b>
          <small>${award.date}</small>
        </button>`,
    )
    .join("");
}

function showInViewer(index) {
  viewerIndex = (index + viewerList.length) % viewerList.length;
  const award = viewerList[viewerIndex];

  $("#viewerStage").classList.remove("is-zoomed");
  $("#viewerImage").src = award.image;
  $("#viewerImage").alt = `${award.title}. ${award.event}`;
  $("#viewerTitle").textContent = `${award.title} — ${viewerIndex + 1} из ${viewerList.length}`;
  $("#viewerName").textContent = award.event;
  $("#viewerMeta").textContent = `${award.org} · ${award.date}`;

  const single = viewerList.length < 2;
  $("#viewerPrev").hidden = single;
  $("#viewerNext").hidden = single;
}

function initAwards() {
  const viewer = $("#viewer");
  initOverlay(viewer);

  $("#awSide").addEventListener("click", (event) => {
    const button = event.target.closest("[data-folder]");
    if (!button) return;
    awardFolder = button.dataset.folder;
    renderAwardSidebar();
    renderAwardGrid();
  });

  $("#awGrid").addEventListener("click", (event) => {
    const doc = event.target.closest("[data-index]");
    if (!doc) return;
    showInViewer(Number(doc.dataset.index));
    openOverlay(viewer);
  });

  $("#viewerPrev").addEventListener("click", () => showInViewer(viewerIndex - 1));
  $("#viewerNext").addEventListener("click", () => showInViewer(viewerIndex + 1));

  // Клик по документу — увеличить / вернуть по размеру окна
  $("#viewerImage").addEventListener("click", () => {
    $("#viewerStage").classList.toggle("is-zoomed");
  });

  renderAwardSidebar();
  renderAwardGrid();
}

/* ==========================================================================
   Клавиатура: Esc закрывает окна, стрелки листают документы
   ========================================================================== */

function initKeyboard() {
  addEventListener("keydown", (event) => {
    const openOverlayEl = document.querySelector(".overlay:not([hidden])");
    if (!openOverlayEl) return;

    if (event.key === "Escape") closeOverlay(openOverlayEl);

    if (openOverlayEl.id === "viewer" && viewerList.length > 1) {
      if (event.key === "ArrowLeft") showInViewer(viewerIndex - 1);
      if (event.key === "ArrowRight") showInViewer(viewerIndex + 1);
    }
  });
}

/* ==========================================================================
   Копирование почты
   ========================================================================== */

function initCopyEmail() {
  const button = $("#copyMail");

  const showCopied = () => {
    button.textContent = "Скопировано";
    setTimeout(() => (button.textContent = "Копировать"), 1500);
  };

  // Если буфер обмена недоступен — просто выделяем адрес
  const selectEmail = () => {
    const range = document.createRange();
    range.selectNodeContents($("#mail"));
    const selection = getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  };

  button.addEventListener("click", () => {
    try {
      navigator.clipboard.writeText(CONTACTS.email).then(showCopied, selectEmail);
    } catch {
      selectEmail();
    }
  });
}

/* ==========================================================================
   Часы в менюбаре и переключатель темы
   ========================================================================== */

function initClock() {
  const clock = $("#clock");

  const update = () => {
    const now = new Date();
    const date = now.toLocaleDateString("ru-RU", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    const time = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    clock.textContent = `${date}  ${time}`;
  };

  update();
  setInterval(update, 15000);
}

function initThemeToggle() {
  $("#themeBtn").addEventListener("click", () => {
    const root = document.documentElement;
    const systemTheme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const currentTheme = root.dataset.theme || systemTheme;
    root.dataset.theme = currentTheme === "dark" ? "light" : "dark";
  });
}

/* ==========================================================================
   Запуск
   ========================================================================== */

initDock();
initProjects();
initAwards();
initKeyboard();
initCopyEmail();
initClock();
initThemeToggle();
