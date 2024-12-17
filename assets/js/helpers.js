import 'simplebar/dist/simplebar.css';
import SimpleBar from 'simplebar';

import { setCacheInSessionStorage } from './sessionStorage';
import { store } from './store';

// Function to scroll smoothly to a specific anchor element
export const scrollToAnchor = (anchor) => {
  let scrollContainer = document.querySelector('.post-page[data-simplebar]');
  let simpleBarInstance = SimpleBar.instances.get(scrollContainer);

  const targetElement = document.querySelector(anchor);

  // Check if the target element exists
  if (targetElement) {
    // Calculate the target position relative to the top of the SimpleBar scroll container
    const targetPosition =
      targetElement.getBoundingClientRect().top + simpleBarInstance.getScrollElement().scrollTop;

    simpleBarInstance.getScrollElement().scrollTo({
      top: targetPosition - 50,
      behavior: 'smooth'
    });
  }
};

// Function to scroll smoothly to the top of the SimpleBar scroll container
export const scrollToTop = () => {
  let scrollContainer = document.querySelector('.post-page[data-simplebar]');
  let simpleBarInstance = SimpleBar.instances.get(scrollContainer);

  // Smoothly scroll to the top of the container
  simpleBarInstance.getScrollElement().scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

export const getCurrentUrl = () => {
  return location.origin + location.pathname + location.search;
};

export const parseHtml = (htmlString) => {
  return new DOMParser().parseFromString(htmlString, 'text/html');
};

export const fetchPage = async (url) => {
  try {
    const response = await fetch(url);

    const pageContent = await response.text();

    setCacheInSessionStorage('ajax', url, pageContent);

    return pageContent;
  } catch (error) {
    throw error;
  }
};

// Function to calculate and set a uniform height for all membership card descriptions
export const calcHeight = () => {
  const membershipCards = document.querySelectorAll('.tier-card');

  if (!membershipCards.length) {
    return;
  }

  if (membershipCards.length && window.innerWidth > 1100) {
    const cardsDescriptions = document.querySelectorAll('.tier-card__desc');
    let maxHeight = 0;

    cardsDescriptions.forEach((desc) => {
      if (desc.clientHeight >= maxHeight) {
        maxHeight = desc.clientHeight;
      }
    });

    cardsDescriptions.forEach((desc) => {
      desc.style.height = `${maxHeight}px`;
    });
  }
};

export const disableAllActiveTags = () => {
  const tags = Array.from(document.querySelectorAll('.filter .post-tag'));

  if (!tags.length) {
    return;
  }

  tags.forEach((tag) => {
    tag.classList.remove('active');
  });
};

export const checkActiveFilters = () => {
  const tags = Array.from(document.querySelectorAll('.filter .post-tag'));
  return tags.some((tag) => tag.classList.contains('active'));
};

export const clearPostsInHtml = () => {
  let postsLayout = document.querySelector('.main-content__posts');
  let posts = postsLayout.querySelectorAll('article');

  posts.forEach((post) => {
    post.remove();
  });
};

export const renderPostsInHtml = () => {
  let newPosts = '';
  store.posts.forEach((post) => {
    checkAndChangePostView(post.postNodeElement);
    post.postNodeElement.style.opacity = 0;
    newPosts += post.postNodeElement.outerHTML;
  });

  clearPostsInHtml();
  document.querySelector('.main-content__posts').insertAdjacentHTML('beforeend', newPosts);
};

export const filterPostsByDateInStore = () => {
  store.posts.sort((a, b) => b.postDate - a.postDate);
};

export const clearPostStore = () => {
  store.posts.length = 0;
};

export const getPosts = async (url) => {
  const response = await fetch(url);
  if (response.ok) {
    const responseText = await response.text();
    const html = parseHtml(responseText);

    const posts = Array.from(html.querySelectorAll('.main-content__posts article'));
    return posts;
  } else {
    alert('Ошибка HTTP: ' + response.status);
  }
};

// Function to convert a NodeList of post elements into an array of post objects
export const convertToPostsArray = (posts) => {
  const convertedArray = posts.map((post) => {
    const postId = post.dataset.postId;
    const postDate = new Date(post.querySelector('time').getAttribute('datetime'));

    return {
      postId,
      postDate,
      postNodeElement: post
    };
  });

  return convertedArray;
};

// Function to merge two arrays of objects without duplicates based on postId
export const mergeWithoutDuplicates = (sourceArray, incomingArray) => {
  const incomingIds = new Set(incomingArray.map((item) => item.postId));

  const filteredSource = sourceArray.filter((sourceItem) => !incomingIds.has(sourceItem.postId));

  return [...filteredSource, ...incomingArray];
};

export const filterPostsByActiveTags = () => {
  store.posts = store.posts.filter((post) => {
    const postTags = post.postNodeElement
      .getAttribute('data-post-tag')
      .split(',')
      .map((tag) => tag.trim());

    return store.activeTags.some((tag) => postTags.includes(tag));
  });
};

const reloadScript = (oldScript) => {
  const newScript = document.createElement('script');

  for (let attr of oldScript.attributes) {
    newScript.setAttribute(attr.name, attr.value);
  }

  if (oldScript.innerHTML) {
    newScript.textContent = oldScript.innerHTML;
  }

  oldScript.replaceWith(newScript);
};

// Function to reload specific scripts and components within a given container
export const reloadScriptsAndComponents = (container) => {
  const cardsScript = document.querySelector('script[src*="cards"]');
  if (cardsScript) {
    reloadScript(cardsScript);
  }

  if (
    container.querySelector(
      '[data-lexical-signup-form], [data-members-form], [data-portal], [href*="#/portal"]'
    )
  ) {
    const portalScript = document.querySelector('script[src*="ghost/portal"]');
    if (portalScript) {
      reloadScript(portalScript);
    }
  }

  if (container.querySelector('[data-ghost-comment-count]')) {
    const commentCountScript = document.querySelector('script[src*="comment-counts"]');
    if (commentCountScript) {
      reloadScript(commentCountScript);
    }
  }

  const commentsUiScript = document.querySelector('script[src*="comments-ui"]');
  if (commentsUiScript) {
    reloadScript(commentsUiScript);
  }

  const navigationScript = document.querySelector('script[data-active-link]');
  if (navigationScript) {
    reloadScript(navigationScript);
  }

  const caseStudyClientsScript = document.querySelector('script[data-case-study-clients]');
  if (caseStudyClientsScript) {
    reloadScript(caseStudyClientsScript);
  }
};

// Function to update the active navigation link based on the provided URL
export const updateActiveNavLink = (url) => {
  const navGroups = [
    { links: document.querySelectorAll('.header .nav-item a'), activeClass: 'nav-item--current' },
    { links: document.querySelectorAll('.mobile-nav a'), activeClass: 'mobile-nav__item--current' },
    {
      links: document.querySelectorAll('.mobile-menu__wrapper .nav-item__link'),
      activeClass: 'nav-item--current'
    }
  ];

  navGroups.forEach(({ links, activeClass }) => {
    // Remove active class from all links in the current group
    links.forEach((link) => link.parentElement.classList.remove(activeClass));

    // Find the link that matches the provided URL and add the active class
    const activeLink = Array.from(links).find((link) => link.href === url);
    if (activeLink) activeLink.parentElement.classList.add(activeClass);
  });
};

export const changePostCardView = (post, currentPostClass, newPostClass) => {
  const postElements = post.querySelectorAll(`[class*="${currentPostClass}"]`);

  post.classList.replace(currentPostClass, newPostClass);

  postElements.forEach((postElement) => {
    const className = postElement.className;
    if (className.startsWith(currentPostClass)) {
      const newClassName = className.replace(currentPostClass, newPostClass);
      postElement.classList.replace(className, newClassName);
    }
  });
};

export const checkAndChangePostView = (post) => {
  const postViewState = document
    .querySelector('.main-header__toggle')
    ?.getAttribute('data-post-type');

  if (!postViewState) {
    return;
  }

  if (postViewState == 'board') {
    changePostCardView(post, 'list-card', 'board-card');
  }

  if (postViewState == 'list') {
    changePostCardView(post, 'board-card', 'list-card');
  }
};

export function getHeaderState() {
  return localStorage.getItem('header-state');
}

export function setHeaderState(state) {
  localStorage.setItem('header-state', state);
}
