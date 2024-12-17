import Masonry from 'masonry-layout';
import { changePostCardView } from './helpers';
import { masonryBoardCardOptions, masonryListCardOptions } from './masonryGrid';
import { store } from './store';

export const initToggleViewCard = () => {
  const toggleCardBtn = document.querySelector('.main-header__toggle');
  const postsLayout = document.querySelector('.main-content__posts');

  if (toggleCardBtn) {
    toggleCardBtn.addEventListener('click', function () {
      let postType = this.getAttribute('data-post-type');
      let posts = document.querySelectorAll('.main-content__posts article');

      if (postType == 'board') {
        this.setAttribute('data-post-type', 'list');
        posts.forEach((post) => changePostCardView(post, 'board-card', 'list-card'));

        store.postsGrid.destroy();
        store.postsGrid = new Masonry(postsLayout, masonryListCardOptions);
        store.postsGrid.layout();
      }
      if (postType == 'list') {
        this.setAttribute('data-post-type', 'board');
        posts.forEach((post) => changePostCardView(post, 'list-card', 'board-card'));

        store.postsGrid.destroy();
        store.postsGrid = new Masonry(postsLayout, masonryBoardCardOptions);
        store.postsGrid.layout();
      }
    });
  }
};
