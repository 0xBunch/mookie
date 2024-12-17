// Function to initialize header popup for header
export const initHeaderPopup = () => {
  const headerPopUp = document.querySelector('.header-popup');
  const headerMoreBtn = document.querySelector('.header-more__btn');

  if (headerPopUp) {
    headerMoreBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      const itemRect = headerMoreBtn.getBoundingClientRect();
      const tooltipPositionLeft = itemRect.left + itemRect.width + 42;
      const tooltipPositionTop = itemRect.top + itemRect.height / 2 - headerPopUp.offsetHeight / 2;

      headerPopUp.style.left = `${tooltipPositionLeft}px`;
      headerPopUp.style.top = `${tooltipPositionTop}px`;

      headerPopUp.classList.toggle('show');
    });

    document.addEventListener('click', (event) => {
      if (!headerPopUp.contains(event.target) && !headerMoreBtn.contains(event.target)) {
        headerPopUp.classList.remove('show');
      }
    });
  }
};
