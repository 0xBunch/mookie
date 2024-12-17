// SCSS imports
// --------------------------------------------------------

import '../scss/index.scss';
import 'simplebar/dist/simplebar.css';

// JS imports
// --------------------------------------------------------

import SimpleBar from 'simplebar';
import ResizeObserver from 'resize-observer-polyfill';
import imagesLoaded from 'imagesloaded';

import { initDarkMode } from './initDarkMode';
import { initMenuTooltips } from './initMenuTooltips';
import { initLightBox, createLightBox } from './lightBox';
import { initToggleViewCard } from './initToggleViewCard';
import { initMembershipSections } from './membershipSections';
import { initCopyToClipboard } from './initCopyToClipboard';
import { initCustomScrollBar } from './initCustomScrollBar';
import { initMasonry, reloadMasonryItemsAndShowPosts } from './masonryGrid';
import { initToC } from './initToC';
import { resizeHeader } from './resizeHeader';
import { initFormspree } from './initFormspree';
import { initHeaderSubmenu } from './initHeaderSubmenu';
import { initHeader } from './initHeader';
import { initMobileMenu, closeMobileMenu } from './initMobileMenu';
import { getCacheInSessionStorage } from './sessionStorage';
import {
  getPosts,
  clearPostStore,
  filterPostsByActiveTags,
  convertToPostsArray,
  mergeWithoutDuplicates,
  renderPostsInHtml,
  fetchPage,
  updateActiveNavLink,
  getCurrentUrl,
  calcHeight,
  disableAllActiveTags,
  checkActiveFilters,
  filterPostsByDateInStore,
  scrollToTop,
  scrollToAnchor,
  reloadScriptsAndComponents,
  parseHtml,
  checkAndChangePostView
} from './helpers';
import { store } from './store';
import { initHeaderPopup } from './initHeaderPopup';

window.ResizeObserver = ResizeObserver;
let nextUrl = document.querySelector('link[rel="next"]')?.href;

const initMainThemeFunc = () => {
  initCustomScrollBar();
  initToggleViewCard();

  initLoadMoreUrls();
  initLoadMoreBtn();
  initFilters();
  initFormspree();
  initToC();

  calcHeight();

  initLightBox();

  initMembershipSections();
  initCopyToClipboard();
};

// Fetches the "load more" URL from the given URL
const getLoadMoreUrl = async (url) => {
  if (!url) {
    return;
  }

  const response = await fetch(url);
  if (response.ok) {
    const responseText = await response.text();
    const html = parseHtml(responseText);
    nextUrl = html.querySelector('link[rel="next"]')?.href;

    return nextUrl ? nextUrl : null;
  } else {
    console.error('Ошибка HTTP: ' + response.status);
  }
};

// Initializes the "load more" URLs and manages the visibility of the load more button.
const initLoadMoreUrls = () => {
  const btnLoadMore = document.querySelector('.load-more-btn');
  const nextUrl = document.querySelector('link[rel="next"]')?.href;

  if (!nextUrl || !btnLoadMore) {
    return;
  }

  // Find the index of the 'home' entry in the loadMoreUrls array in the store
  let homeUrlIndex = store.loadMoreUrls.findIndex((url) => url.name === 'home');

  // If 'home' is not found in the loadMoreUrls, add the current URL to the array
  if (homeUrlIndex == -1) {
    store.loadMoreUrls.push({
      name: window.location.pathname === '/' ? 'home' : window.location.pathname,
      nextUrl
    });
  }

  if (store.loadMoreUrls.every((urlObj) => urlObj.nextUrl === null)) {
    btnLoadMore.style.display = 'none';
  } else {
    btnLoadMore.style.display = 'block';
  }
};

const loadMorePostsWithActiveFilters = async (loadMoreBtn) => {
  loadMoreBtn.classList.add('loading');

  // Iterate through each URL stored in loadMoreUrls
  for (let i = 0; i < store.loadMoreUrls.length; i++) {
    const { nextUrl } = store.loadMoreUrls[i];
    if (nextUrl) {
      try {
        // Get all post elements from the fetched HTML
        const response = await fetch(nextUrl);
        if (response.ok) {
          const responseText = await response.text();
          const html = parseHtml(responseText);
          let posts = Array.from(html.querySelectorAll('.main-content__posts article'));
          const nextPageUrl = html.querySelector('link[rel="next"]')?.href; // Check for a next page URL
          if (nextPageUrl) {
            store.loadMoreUrls[i].nextUrl = nextPageUrl;
          } else {
            store.loadMoreUrls[i].nextUrl = null;
          }
          if (store.loadMoreUrls.every((urlObj) => urlObj.nextUrl === null)) {
            loadMoreBtn.style.display = 'none';
          }
          const newPosts = convertToPostsArray(posts);
          store.posts = [...store.posts, ...newPosts]; // Append new posts to the store

          renderPostsInHtml();
          initNavLinks(document.querySelector('.main-content__posts'));
          reloadMasonryItemsAndShowPosts();
          loadMoreBtn.classList.remove('loading');
        } else {
          console.error('Error HTTP: ' + response.status);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
};

/*
Loads more posts and appends them to the specified layout container.
@param {HTMLElement} loadMoreBtn - The "Load More" button element that triggers the load action. 
@param {boolean} postsGridUpdate - A flag indicating whether to update the Masonry layout after loading new posts.
@param {string} postsLayoutSelector - A CSS selector to identify the container where new posts will be appended.
*/

const loadMorePostsDefault = async (loadMoreBtn, postsGridUpdate, postsLayoutSelector) => {
  const nextUrl = document.head.querySelector('link[rel="next"]')?.href;
  const postsLayout = document.querySelector(postsLayoutSelector);
  loadMoreBtn.classList.add('loading');

  if (nextUrl) {
    try {
      const response = await fetch(nextUrl);

      if (response.ok) {
        const responseText = await response.text();
        const html = parseHtml(responseText);
        let posts = Array.from(html.querySelectorAll(`${postsLayoutSelector} article`));

        const nextPageUrl = html.querySelector('link[rel="next"]');

        // Update the next page link in the document head
        if (nextPageUrl) {
          document.head.querySelector('link[rel="next"]').remove();
          document.head.appendChild(nextPageUrl);
        } else {
          loadMoreBtn.style.display = 'none';
        }

        posts.forEach((post) => {
          checkAndChangePostView(post);
          post.style.opacity = 0;
          post.style.filter = 'blur(5px)';
          postsLayout.append(post);
        });

        initNavLinks(document.querySelector(postsLayoutSelector));

        // Use imagesLoaded to ensure images are loaded before manipulating layout
        imagesLoaded(postsLayout, function () {
          if (postsGridUpdate) {
            store.postsGrid.appended(posts);
          }

          posts.forEach((post) => {
            post.style.opacity = 1;
            post.style.filter = 'none';
          });
          loadMoreBtn.classList.remove('loading');
        });
      } else {
        console.error('Error HTTP: ' + response.status);
      }
    } catch (error) {
      console.error(error);
    }
  }
};

const checkAuthorPage = () => {
  if (document.body.classList.contains('author-template')) {
    return true;
  } else {
    return false;
  }
};

const renderLoadMoreBtn = () => {
  const nextUrl = document.head.querySelector('link[rel="next"]')?.href;
  const loadMoreBtn = document.querySelector('.sidebar .load-more-btn');

  const btn = `<a rel="next" name="" class="btn load-more-btn" aria-label="Load more button">
        <span>Load More</span>
        <svg class="loader-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="background: none; shape-rendering: auto;" width="25px" height="25px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
          <circle cx="50" cy="50" fill="none" stroke="#ffffff" stroke-width="10" r="37" stroke-dasharray="174.35839227423352 60.119464091411174">
              <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
          </circle>
      </svg>    
  </a>`;

  if (!loadMoreBtn && nextUrl) {
    const sidebarPostsLayout = document.querySelector('.sidebar__posts');
    const authorPagePostsLayout = document.querySelector('.author-page__posts-wrapper');
    sidebarPostsLayout.insertAdjacentHTML('afterend', btn);
    authorPagePostsLayout.insertAdjacentHTML('afterend', btn);
  }
};

const initLoadMoreBtn = () => {
  const loadMoreButtons = document.querySelectorAll('.load-more-btn');

  if (loadMoreButtons.length) {
    loadMoreButtons.forEach((loadMoreButton) => {
      loadMoreButton.addEventListener('click', async (e) => {
        e.preventDefault();

        if (checkAuthorPage()) {
          if (e.target.parentElement.classList.contains('author-page__posts')) {
            loadMorePostsDefault(loadMoreButton, false, '.author-page__posts-wrapper');
          } else {
            loadMorePostsDefault(loadMoreButton, false, '.sidebar__posts');
          }
        } else {
          if (checkActiveFilters()) {
            // Load more posts with active filters if they are applied
            await loadMorePostsWithActiveFilters(loadMoreButton);
          } else {
            // Load more posts without filters if no filters are active
            await loadMorePostsDefault(loadMoreButton, true, '.main-content__posts');
          }
        }
      });
    });
  }
};

/*
Updates the document's title, body class, and history state.
@param {Document} parsedDocument - The parsed HTML document.
@param {string} title - The new title for the document.
@param {boolean} push - Whether to push the state to history.
@param {string} url - The URL for the new state.
*/
const updateDocumentMetadata = (parsedDocument, title, push, url) => {
  const bodyClass = parsedDocument.body.getAttribute('class');
  const metaTags = Array.from(parsedDocument.head.querySelectorAll('meta[content]'));
  const loadMoreNextLink = parsedDocument.head.querySelector('link[rel="next"]');

  if (push && typeof history !== 'undefined') {
    const newUrl = new URL(url);
    if (newUrl.hash == '') {
      history.pushState({ pageUrl: newUrl.href }, title, newUrl.href);
    }
  }

  document.title = title;
  document.body.setAttribute('class', bodyClass);

  document.head.querySelectorAll('meta[content]').forEach((meta) => {
    meta.remove();
  });
  metaTags.forEach((meta) => {
    document.head.appendChild(meta);
  });

  if (loadMoreNextLink) {
    document.head.querySelector('link[rel="next"]')?.remove();
    document.head.appendChild(loadMoreNextLink);
  } else {
    document.head.querySelector('link[rel="next"]')?.remove();
  }
};

/*
Updates the content of the current page with the new content from the fetched response.
@param {string} url - The URL to update the content for.
@param {string} response - The HTML response from the fetch request.
@param {boolean} push - Determines whether to push the new state to the browser history.
*/

const updateContent = async (url, response, push) => {
  const parsedDocument = parseHtml(response);
  const title = parsedDocument.title;
  const contentClass = parsedDocument.querySelector('main').getAttribute('class');

  updateDocumentMetadata(parsedDocument, title, push, url);

  store.isAnchorScroll = false;

  if (parsedDocument.querySelector('.page-404')) {
    throw new Error('404');
  }

  const currentContent = document.querySelector('main');
  const currentSidebar = document.querySelector('aside');

  currentContent.style.opacity = 0;
  currentSidebar.style.opacity = 0;
  currentContent.style.filter = 'blur(5px)';
  currentSidebar.style.filter = 'blur(5px)';

  const loader = parsedDocument.querySelector('.loader');

  if (loader) {
    loader.remove();

    parsedDocument.querySelector('.content').style.opacity = 1;
  }

  setTimeout(async () => {
    currentContent.setAttribute('class', contentClass);
    currentContent.innerHTML = parsedDocument.querySelector('main').innerHTML;
    currentSidebar.innerHTML = parsedDocument.querySelector('aside').innerHTML;

    if (checkAuthorPage()) {
      renderLoadMoreBtn();
    }
    initNavLinks(document.querySelector('.main'));
    initMasonry();

    initMainThemeFunc();

    reloadScriptsAndComponents(window.document);

    currentContent.style.opacity = 1;
    currentContent.style.filter = 'none';
    currentSidebar.style.opacity = 1;
    currentSidebar.style.filter = 'none';
  }, 700);
};

//Initializes the filter functionality for posts, allowing users to filter posts by tags and clear selected filters.
const initFilters = () => {
  const tags = document.querySelectorAll('.filter .post-tag');
  const clearTag = document.querySelector('.filter__clear-btn');
  const postsContainer = document.querySelector('.main-content__posts');
  const filterWrapper = document.querySelector('.filter');

  if (!tags || !clearTag) {
    return;
  }

  tags.forEach((tag) => {
    tag.addEventListener('click', async function () {
      // Get the next URL to load based on the tag filter
      const tagUrl = this.getAttribute('data-tag-filter-url');
      const tagName = this.getAttribute('data-tag-name');
      let nextUrl = await getLoadMoreUrl(tagUrl);
      const btnLoad = document.querySelector('.load-more-btn');

      clearTag.style.visibility = 'visible';

      if (this.classList.contains('active')) {
        // Remove the tag from the active tags store
        store.activeTags = store.activeTags.filter((activeTag) => activeTag !== tagName);
        this.classList.add('loading');
        filterWrapper.classList.add('loading');

        filterPostsByActiveTags();

        store.loadMoreUrls = store.loadMoreUrls.filter((url) => !url.name.includes(tagName));
      } else {
        this.classList.add('loading');
        filterWrapper.classList.add('loading');

        store.activeTags.push(tagName);

        const posts = await getPosts(tagUrl);
        const newPosts = convertToPostsArray(posts);

        store.posts = mergeWithoutDuplicates(store.posts, newPosts);

        store.loadMoreUrls.push({
          name: this.getAttribute('data-tag-name'),
          nextUrl
        });
      }

      store.loadMoreUrls = store.loadMoreUrls.filter((url) => !url.name.includes('home'));

      if (store.posts.length) {
        filterPostsByDateInStore();
        renderPostsInHtml();
        initNavLinks(document.querySelector('.main-content__posts'));

        reloadMasonryItemsAndShowPosts();
      }

      if (!store.posts.length) {
        clearTag.style.visibility = 'hidden';
        const posts = await getPosts(clearTag.getAttribute('data-tag-filter-url'));
        store.posts = convertToPostsArray(posts);

        renderPostsInHtml();
        initNavLinks(document.querySelector('.main-content__posts'));

        reloadMasonryItemsAndShowPosts();

        initLoadMoreUrls();
        clearPostStore();
      }

      this.classList.remove('loading');
      filterWrapper.classList.remove('loading');

      if (this.classList.contains('active')) {
        this.classList.remove('active');
      } else {
        this.classList.add('active');
      }

      if (store.loadMoreUrls.every((urlObj) => urlObj.nextUrl === null)) {
        btnLoad.style.display = 'none';
      } else {
        btnLoad.style.display = 'block';
      }
    });
  });

  clearTag.addEventListener('click', async function () {
    disableAllActiveTags();

    const posts = await getPosts(clearTag.getAttribute('data-tag-filter-url'));
    store.posts = convertToPostsArray(posts);
    filterWrapper.classList.add('loading');

    renderPostsInHtml();

    imagesLoaded(postsContainer, function () {
      if (store.postsGrid) {
        store.postsGrid.reloadItems();
        store.postsGrid.layout();
      }

      initNavLinks(document.querySelector('.main-content__posts'));

      document.querySelectorAll('.main-content__posts article').forEach((post) => {
        post.style.opacity = 1;
        post.style.filter = 'none';
      });

      store.loadMoreUrls = [];
      initLoadMoreUrls();
      clearPostStore();

      filterWrapper.classList.remove('loading');
      clearTag.style.visibility = 'hidden';
    });
  });
};

/*
Navigates to a specified URL, using cached data if available. 
@param {boolean} push - Determines whether to push the state to history (default: true).
*/
const navigateTo = async (url, push = true) => {
  const cacheSessionStorage = getCacheInSessionStorage('ajax', url);

  if (!cacheSessionStorage) {
    document.querySelector('.main').classList.add('loading');
  }

  try {
    if (cacheSessionStorage) {
      await updateContent(url, cacheSessionStorage, push);
      updateActiveNavLink(url);
      closeMobileMenu();
    } else {
      const response = await fetchPage(url);
      if (response) {
        await updateContent(url, response, push);
        updateActiveNavLink(url);
        closeMobileMenu();
      }
    }
  } catch (error) {
    if (error.message === '404') {
      window.location = '/404';
    } else {
      window.location = url;
    }
  } finally {
    document.querySelector('.main').classList.remove('loading');
  }
};

/*
Initializes navigation links within a given selector.
@param {Element} selector - The element within which to initialize navigation links.
*/
const initNavLinks = (selector) => {
  const links = selector.querySelectorAll(
    'a:not(.no-ajax, [target="_blank"], [href^="#"], [rel="next"], [href^="mailto"], [href^="javascript:"], [href*="#/portal"], a[aria-label="Account page link"], a[aria-label="Sign In link"], a[aria-label="Sign In Navigation link"], .sidebar-adv-banner__banner--link, .post-content a, .sidebar-toc__item-link'
  );

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();

      if (getCurrentUrl() !== link.href) {
        navigateTo(link.href);
      }
    });
  });
};

/// -----------------------------------------------------------

window.addEventListener('popstate', async (event) => {
  if (event.state) {
    if (event.state.anchor) {
      if (!store.isAnchorScroll) {
        await navigateTo(`${window.location.href}`);
        store.isAnchorScroll = true;
        setTimeout(async () => {
          scrollToAnchor(event.state.anchor);
        }, 900);
      } else {
        scrollToAnchor(event.state.anchor);
      }
    } else {
      if (store.isAnchorScroll) {
        scrollToTop();
        store.isAnchorScroll = false;
      } else {
        navigateTo(event.state.pageUrl, false);
      }
    }
  } else {
    let url = window.location.pathname;
    navigateTo(url, false);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const loader = document.querySelector('.loader');
  const content = document.querySelector('.content');
  const postsWrapper = document.querySelector('.main-content__posts');

  initHeaderPopup();
  initMenuTooltips();
  initDarkMode();
  resizeHeader();
  initHeader();

  initNavLinks(window.document);
  initMobileMenu();
  initHeaderSubmenu();
  createLightBox();

  initMainThemeFunc();

  if (loader) {
    loader.style.display = 'block';

    content.style.opacity = 0;
    content.style.filter = 'blur(5px)';
  }

  new SimpleBar(document.querySelector('.header-wrapper'), {
    autoHide: false,
    classNames: {
      scrollbar: 'scrollbar-style'
    }
  });

  if (postsWrapper) {
    imagesLoaded(postsWrapper, () => {
      initMasonry();

      if (loader) {
        loader.style.display = 'none';

        content.style.opacity = 1;
        content.style.filter = 'none';
        loader.remove();
      }
    });
  } else {
    if (loader) {
      loader.style.display = 'none';

      content.style.opacity = 1;
      content.style.filter = 'none';
      loader.remove();
    }
  }
});
