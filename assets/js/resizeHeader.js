import 'simplebar/dist/simplebar.css';
import SimpleBar from 'simplebar';

import imagesLoaded from 'imagesloaded';
import { store } from './store';
import { setHeaderState } from './helpers';

export const resizeHeader = () => {
  const resizeBtn = document.querySelector('.resize-btn');
  const html = document.documentElement;

  if (!resizeBtn) {
    return;
  }

  resizeBtn.addEventListener('click', () => {
    const postsWrapper = document.querySelector('.main-content__posts');

    if (html.getAttribute('header-state') == 'resize') {
      setHeaderState('no-resize');
      html.setAttribute('header-state', 'no-resize');
    } else {
      setHeaderState('resize');
      html.setAttribute('header-state', 'resize');
    }

    if (postsWrapper) {
      imagesLoaded(postsWrapper, () => {
        store.postsGrid.layout();
      });
    }
  });
};
