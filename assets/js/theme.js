(() => {
  const preference = matchMedia('(prefers-color-scheme: light)');
  let selected;
  try { selected = localStorage.getItem('nodavex-theme'); } catch {}
  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#ffffff' : '#000000');
    const button = document.querySelector('.theme-toggle');
    if (button) {
      button.textContent = theme === 'light' ? 'Dark mode' : 'Light mode';
      button.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
    }
  }
  apply(selected === 'light' || selected === 'dark' ? selected : preference.matches ? 'light' : 'dark');
  document.addEventListener('DOMContentLoaded', () => {
    apply(document.documentElement.dataset.theme);
    document.querySelector('.theme-toggle').addEventListener('click', () => {
      selected = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      try { localStorage.setItem('nodavex-theme', selected); } catch {}
      apply(selected);
    });
  });
  preference.addEventListener('change', () => {
    if (!selected) apply(preference.matches ? 'light' : 'dark');
  });
})();
