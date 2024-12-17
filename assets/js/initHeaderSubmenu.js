// Function to initialize behavior for header submenu items
const initHeaderSubmenu = () => {
  const submenuItems = document.querySelectorAll('.nav-submenu-btn');

  if (!submenuItems.length) {
    return;
  }

  // Click handler function to toggle submenu visibility
  const clickHandler = (btn) => {
    // Select the submenu container and items related to the clicked button
    const submenu = btn.parentElement;
    const submenuItems = submenu.querySelectorAll('.submenu__item');
    const submenuItemsList = submenu.querySelector('.submenu');

    // If submenu is already active, hide it
    if (submenu.classList.contains('active')) {
      submenu.classList.remove('active');
      submenuItemsList.style.height = '0px'; // Set height to 0 to collapse submenu
    }
    // If submenu is inactive, show it by calculating and setting its height
    else {
      submenu.classList.add('active');

      // Calculate the total height of all submenu items
      const submenuHeight = Array.from(submenuItems).reduce(
        (accumulator, currentValue) => accumulator + currentValue.offsetHeight,
        0
      );
      // Apply calculated height to submenu to expand it
      submenuItemsList.style.height = `${submenuHeight}px`;
    }
  };

  submenuItems.forEach((btn) => {
    btn.addEventListener('click', () => clickHandler(btn));
  });
};

export { initHeaderSubmenu };
