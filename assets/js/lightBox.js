export const initLightBox = () => {
  const postPage = document.querySelector('.post-page');

  if (postPage && postPage.classList.contains('tag-hash-lightbox')) {
    const lightBoxScript = document.createElement('script');
    lightBoxScript.textContent = `
        lightbox.destroy()
        lightbox.init()`;
    document.body.insertAdjacentElement('afterend', lightBoxScript);
  }
};

export const createLightBox = () => {
  const initScript = document.createElement('script');
  initScript.textContent = `
                const lightbox = new PhotoSwipeLightbox({
                    gallery: '.kg-gallery-card, .kg-image-card, .kg-product-card',
                    children: 'img:not(a>img)',
                    pswpModule: PhotoSwipe,
                    preloaderDelay: 0 });
  
                lightbox.addFilter('domItemData', (itemData, element, linkEl) => {
                    if (element) {
                        itemData.src = element.src;
                        itemData.srcset = element.getAttribute('srcset');
                        itemData.w = element.getAttribute('width');
                        itemData.h = element.getAttribute('height');
                        itemData.msrc = element.src;
                        itemData.thumbCropped = true;
  
                        const alt = element.alt;
  
                        if (alt) {
                            itemData.alt = element.alt;
                        }
                    }
                    return itemData;
                });
            `;

  document.body.insertAdjacentElement('afterend', initScript);
};
