export const initMobileMenu = () => {
  const mobileNavList = document.querySelector('.mobile-nav');
  const mobileNavMore = document.querySelector('.mobile-nav__more-items-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuNavList = document.querySelector('.mobile-menu .nav-list');
  const mobileMenuCloseBtn = document.querySelector('.mobile-menu-header__close-btn');

  // Check if the mobile navigation list and menu exist
  if (mobileNavList && mobileMenu) {
    // If there are 5 or fewer items in the mobile navigation list
    if (mobileNavList.childElementCount <= 5) {
      // Set a CSS variable for the number of navigation elements
      mobileNavList.style.setProperty('--navElemCount', mobileNavList.childElementCount);
      mobileNavList.setAttribute('data-nav-elem-count', mobileNavList.childElementCount);
      // Remove the main navigation from the mobile menu
      document.querySelector('.mobile-menu nav').remove();
      // Add a class to indicate that there are no primary navigation items
      document
        .querySelector('.mobile-menu .nav-list--secondary')
        .classList.add('nav-list--secondary-without-primary');
    } else {
      // Limit the number of displayed items to 5
      mobileNavList.style.setProperty('--navElemCount', 5);
      mobileNavList.setAttribute('data-nav-elem-count', 5);
    }

    // Loop through the mobile navigation items
    for (let i = 0; i < mobileNavList.childElementCount - 1; i++) {
      const mobileNavItem = mobileNavList.children[i];

      // If the item is a mobile navigation item and it's beyond the first two items, remove it
      if (mobileNavItem.classList.contains('mobile-nav__item') && i > 3) {
        mobileNavItem.style.display = 'none';
        mobileNavItem.setAttribute('data-state', 'hide');
      }
    }

    // Loop through the items in the mobile menu navigation list
    Array.from(mobileMenuNavList.children).forEach((navItem) => {
      // Get the slug data attribute from the current navigation item
      let mobileMenuNavItemSlug = navItem.getAttribute('data-nav-slug');
      // Check against the items in the mobile navigation list
      for (let i = 0; i < mobileNavList.childElementCount; i++) {
        let mobileNavItemSlug = mobileNavList.children[i].getAttribute('data-nav-slug');
        let mobileNavItemStatus = mobileNavList.children[i].getAttribute('data-state');
        // If a matching slug is found, remove the item from the mobile menu
        if (mobileNavItemSlug === mobileMenuNavItemSlug && mobileNavItemStatus !== 'hide') {
          navItem.remove();
          break; // Exit the loop once a match is found
        }
      }
    });

    mobileNavMore.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });

    mobileMenuCloseBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });
  }
};

export const closeMobileMenu = () => {
  const mobileMenu = document.querySelector('.mobile-menu');

  if (mobileMenu) {
    mobileMenu.classList.remove('active');
  }
};
