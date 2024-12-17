import imagesLoaded from 'imagesloaded';
import Masonry from 'masonry-layout';
import { store } from './store';

export const masonryBoardCardOptions = {
  itemSelector: '.board-card',
  columnWidth: '.board-card',
  percentPosition: true,
  gutter: '.gutter-sizer',
  transitionDuration: 0
};

export const masonryListCardOptions = {
  itemSelector: '.list-card',
  columnWidth: '.list-card',
  percentPosition: true,
  gutter: '.gutter-sizer',
  transitionDuration: 0
};

export const initMasonry = () => {
  const postsWrapper = document.querySelector('.main-content__posts');
  if (!postsWrapper) return;

  imagesLoaded(postsWrapper, () => {
    if (document.querySelector('.main-content__posts .list-card')) {
      store.postsGrid = new Masonry(postsWrapper, masonryListCardOptions);
      store.postsGrid.layout();
    }

    if (document.querySelector('.main-content__posts .board-card')) {
      store.postsGrid = new Masonry(postsWrapper, masonryBoardCardOptions);
      store.postsGrid.layout();
    }
  });
};

export const reloadMasonryItemsAndShowPosts = () => {
  const postsWrapper = document.querySelector('.main-content__posts');
  const posts = postsWrapper.querySelectorAll('article');

  if (postsWrapper && posts) {
    imagesLoaded(postsWrapper, function () {
      if (store.postsGrid) {
        store.postsGrid.reloadItems();
        store.postsGrid.layout();
      }

      posts.forEach((post) => {
        post.style.opacity = 1;
      });
    });
  }
};
