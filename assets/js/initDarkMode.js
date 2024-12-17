const changeTwitterCardTheme = () => {
  const tweets = document.querySelectorAll('[data-tweet-id]');

  const changeTweetsTheme = () => {
    const storedTheme =
      localStorage.getItem('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const targetTheme = storedTheme === 'dark' ? 'light' : 'dark';

    const switchTweetTheme = (currentTheme, targetTheme) => {
      tweets.forEach((tweet) => {
        const src = tweet.getAttribute('src');
        tweet.setAttribute('src', src.replace('theme=' + currentTheme, 'theme=' + targetTheme));
      });
    };

    switchTweetTheme(targetTheme, storedTheme);
  };

  if (tweets) {
    changeTweetsTheme();
  }
};

const changeCommentsColorOnToggle = () => {
  const rootElem = document.querySelector('html[data-theme]');
  const theme = rootElem.getAttribute('data-theme');

  const commentsSection = document.querySelector('#ghost-comments-root');

  if (commentsSection) {
    const commentsScript = document.querySelector('script[data-color-scheme]');
    commentsScript.setAttribute('data-color-scheme', theme);
  }
};

const switchTheme = () => {
  const rootElem = document.querySelector('html[data-theme]');
  const currentTheme = rootElem.getAttribute('data-theme');
  const switchThemeBtn = document.querySelector('.switch-theme-btn');
  const toolTip = document.querySelector('.menu-tooltip');

  const themeModeText = switchThemeBtn.getAttribute('data-menu-tooltip-content');
  const [lightModeText, darkModeText] = themeModeText.split('/');

  if (toolTip) {
    if (currentTheme === 'light') {
      toolTip.textContent = darkModeText;
    }
    if (currentTheme === 'dark') {
      toolTip.textContent = lightModeText;
    }
  }

  rootElem.setAttribute('data-theme', currentTheme === 'light' ? 'dark' : 'light');
  localStorage.setItem('data-theme', currentTheme === 'light' ? 'dark' : 'light');
  changeCommentsColorOnToggle();
  changeTwitterCardTheme();
};

export const initDarkMode = () => {
  const switchThemeBtns = document.querySelectorAll('.switch-theme-btn');

  if (switchThemeBtns) {
    switchThemeBtns.forEach((switchThemeBtn) => {
      switchThemeBtn.addEventListener('click', switchTheme);
    });
  }

  window.addEventListener('load', changeTwitterCardTheme);
  window.addEventListener('load', changeCommentsColorOnToggle);
};
