import 'simplebar/dist/simplebar.css';
import SimpleBar from 'simplebar';

import { store } from './store';

export const initToC = () => {
  const tocList = document.querySelector('.sidebar-toc');
  const content = document.querySelector('.post-content');
  const shareBlock = document.querySelector('.share-block');

  if (!tocList || !content) {
    return;
  }

  function createTOC() {
    // Select all headings (h2 and h3) in the content area, excluding those inside .kg-card
    const headings = content.querySelectorAll('h2:not(.kg-card h2), h3:not(.kg-card h3)');
    let currentLevel = 1; // Track the current heading level
    let currentList = tocList; // Start with the main ToC list

    // If there are no headings, remove the ToC wrapper and handle visibility of other elements
    if (!headings.length) {
      document.querySelector('.sidebar__toc-wrapper').remove();
      return;
    }

    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.substring(1), 10); // Determine heading level (2 or 3)
      const id = heading.id || `heading-${heading.textContent.replace(/\s+/g, '-')}`; // Generate ID if not present
      heading.id = id;

      const listItem = document.createElement('li');
      listItem.classList.add('sidebar-toc__item');
      const link = document.createElement('a');
      link.classList.add('sidebar-toc__item-link');
      link.href = `#${id}`; // Set the link's href to the heading ID
      link.textContent = heading.textContent; // Set the link's text to the heading text
      listItem.appendChild(link);

      // Handle the nesting of ToC items based on heading levels
      if (level > currentLevel) {
        let lastListItem = currentList.lastElementChild; // Get the last item in the current list
        if (lastListItem) {
          const newList = document.createElement('ul'); // Create a new sub-list
          newList.classList.add('sidebar-toc__sub-list');
          lastListItem.appendChild(newList); // Append the new list to the last item
          currentList = newList; // Update currentList to the new sub-list
        }
      } else if (level < currentLevel) {
        let levelDiff = currentLevel - level; // Determine how many levels to go up
        while (levelDiff > 0 && currentList.parentElement) {
          const parentList = currentList.parentElement.closest('ul'); // Find the parent list
          if (parentList) {
            currentList = parentList; // Move up to the parent list
          }
          levelDiff--;
        }
      }

      currentList.appendChild(listItem);
      currentLevel = level;
    });
  }

  createTOC();

  const links = document.querySelectorAll('.sidebar-toc__item-link');
  let scrollContainer = document.querySelector('.post-page[data-simplebar]');
  let simpleBarInstance = SimpleBar.instances.get(scrollContainer);

  function activateLink(link) {
    links.forEach((link) => link.classList.remove('sidebar-toc__item-link--active'));
    link.classList.add('sidebar-toc__item-link--active');
  }

  function deactivateAllLinks() {
    links.forEach((link) => link.classList.remove('sidebar-toc__item-link--active'));
  }

  links.forEach((link) => {
    link.addEventListener('click', function (event) {
      event.preventDefault();

      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      const targetPosition =
        targetElement.getBoundingClientRect().top + simpleBarInstance.getScrollElement().scrollTop;

      // Smoothly scroll to the target position
      simpleBarInstance.getScrollElement().scrollTo({
        top: targetPosition - 50,
        behavior: 'smooth'
      });

      // Update the browser history with the new anchor
      history.pushState({ anchor: `#${targetId}` }, 'anchor', `#${targetId}`);
      store.isAnchorScroll = true; // Indicate that an anchor scroll has occurred
    });
  });

  // Function to handle scrolling and link activation
  function onSimpleBarScroll() {
    const scrollPosition = simpleBarInstance.getScrollElement().scrollTop; // Get the current scroll position
    const shareBlockPosition =
      shareBlock.getBoundingClientRect().top + simpleBarInstance.getScrollElement().scrollTop - 50;
    let activeLink = null;

    // Loop through all headings to find the currently active one based on scroll position
    content.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
      const headingPosition =
        heading.getBoundingClientRect().top + simpleBarInstance.getScrollElement().scrollTop - 51;

      // If the heading is above the scroll position, set it as the active link
      if (headingPosition <= scrollPosition) {
        activeLink = tocList.querySelector(`a[href="#${heading.id}"]`);
      }
    });

    if (activeLink) {
      deactivateAllLinks();
      activateLink(activeLink);
    }

    if (shareBlockPosition <= scrollPosition) {
      deactivateAllLinks();
    }

    if (!activeLink) {
      deactivateAllLinks();
    }
  }

  simpleBarInstance.getScrollElement().addEventListener('scroll', onSimpleBarScroll);
};
