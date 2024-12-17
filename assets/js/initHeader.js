// Function to initialize header behavior on scroll
const initHeader = () => {
  const mobileHeader = document.querySelector('.mobile-header');
  const wrapper = document.querySelector('.wrapper');

  if (!mobileHeader) {
    return;
  }

  const hidePos = 200;
  let prevScrollYPos = 0;

  // Function to handle header visibility based on scroll position
  const headerScrollHandler = () => {
    if (wrapper.scrollTop === 0) {
      mobileHeader.classList.remove('hide');
    } else if (wrapper.scrollTop > hidePos) {
      if (wrapper.scrollTop < prevScrollYPos) {
        mobileHeader.classList.remove('hide');
      } else {
        mobileHeader.classList.add('hide');
      }
    }

    prevScrollYPos = wrapper.scrollTop;
  };

  headerScrollHandler();

  wrapper.addEventListener('scroll', headerScrollHandler);
};

export { initHeader };
