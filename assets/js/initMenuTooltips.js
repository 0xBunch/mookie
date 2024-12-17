// Function to initialize tooltips for menu items
export const initMenuTooltips = () => {
  const html = document.documentElement;
  const navItems = document.querySelectorAll('[data-menu-item]');
  const toolTip = document.createElement('div');
  toolTip.classList.add('menu-tooltip');
  navItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      if (
        html.getAttribute('header-state') !== 'resize' &&
        !item.classList.contains('switch-theme-btn')
      ) {
        return;
      }
      const itemRect = item.getBoundingClientRect();
      const tooltipPositionLeft = itemRect.left + itemRect.width + 10;
      const tooltipPositionTop = itemRect.top + itemRect.height / 2 - 10;

      if (!item.classList.contains('switch-theme-btn')) {
        toolTip.textContent = item.getAttribute('data-menu-tooltip-content');
      } else {
        const currentTheme = rootElem.getAttribute('data-theme');
        const btnTooltipText = item.getAttribute('data-menu-tooltip-content');
        const [lightModeText, darkModeText] = btnTooltipText.split('/');

        if (currentTheme === 'light') {
          toolTip.textContent = lightModeText;
        }
        if (currentTheme === 'dark') {
          toolTip.textContent = darkModeText;
        }
      }

      toolTip.style.left = `${tooltipPositionLeft}px`;
      toolTip.style.top = `${tooltipPositionTop}px`;
      document.body.appendChild(toolTip);
    });
    item.addEventListener('mouseleave', () => {
      if (
        html.getAttribute('header-state') !== 'resize' &&
        !item.classList.contains('switch-theme-btn')
      ) {
        return;
      }
      toolTip.remove();
    });
  });
};
