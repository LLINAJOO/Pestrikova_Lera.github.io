/**
 * Набор SVG-иконок. Цвет берётся из currentColor.
 */
const ICONS = {
  home: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4.2"/><path d="M3.5 21c.8-4.6 4.2-7 8.5-7s7.7 2.4 8.5 7z"/></svg>',
  folder:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h5l2 2h8A2.5 2.5 0 0 1 22 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5z"/></svg>',
  trophy:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 3h10v6a5 5 0 0 1-10 0zM17 4h3.5v2A3.5 3.5 0 0 1 17 9.5zM7 4H3.5v2A3.5 3.5 0 0 0 7 9.5zM10.5 14h3v4h-3zM7 19h10v2H7z"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.3 18.7 19.4c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-5 9.2-8.3c.4-.4-.1-.6-.6-.2L6.1 13 1.3 11.5c-1-.3-1-1 .2-1.5L20.6 2.7c.9-.3 1.6.2 1.3 1.6z"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m8 7-5 5 5 5M16 7l5 5-5 5"/></svg>',
  bricks:
    '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="4" width="9" height="4.5" rx="1"/><rect x="13" y="4" width="9" height="4.5" rx="1"/><rect x="2" y="10" width="4" height="4.5" rx="1"/><rect x="8" y="10" width="9" height="4.5" rx="1"/><rect x="19" y="10" width="3" height="4.5" rx="1"/><rect x="2" y="16" width="9" height="4.5" rx="1"/><rect x="13" y="16" width="9" height="4.5" rx="1"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  medal:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h4l1 4-3 3zM17 2h-4l-1 4 3 3z"/><circle cx="12" cy="15" r="6"/></svg>',
  cert: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v12H3z" opacity=".9"/><circle cx="16" cy="16" r="4"/><path d="M14 19l-1 4 3-1.5 3 1.5-1-4z"/></svg>',
  cap: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1 8.5 12 14l9-4.5V16h2V8.5z"/><path d="M5 11.5V16c3 2.5 11 2.5 14 0v-4.5L12 15z"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="8.5" y="2" width="7" height="12" rx="3.5"/><path d="M5 11a7 7 0 0 0 14 0h-2a5 5 0 0 1-10 0zM11 18h2v4h-2z"/></svg>',
  screen:
    '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 20h8v2H8zM11 17h2v3h-2z"/></svg>',
};
/**
 * Цветная плитка с иконкой (как иконка приложения в macOS).
 * @param {string} background — CSS-фон плитки (обычно градиент)
 * @param {string} name — ключ из ICONS
 */
function tileIcon(background, name) {
  return `<span class="ficon" style="background: ${background}">${ICONS[name]}</span>`;
}
