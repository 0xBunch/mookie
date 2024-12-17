import 'simplebar/dist/simplebar.css';
import SimpleBar from 'simplebar';

export const initCustomScrollBar = () => {
  const newSimpleBars = document.querySelectorAll(
    'main[data-simplebar], .sidebar__wrapper[data-simplebar]'
  );

  newSimpleBars.forEach((element) => {
    new SimpleBar(element, {
      autoHide: false,
      classNames: {
        scrollbar: 'scrollbar-style'
      }
    });
  });
};
