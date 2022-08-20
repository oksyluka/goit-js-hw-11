import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import getImages from './get_images';
import markupGallery from './markup_gallery';

const searchForm = document.querySelector('.search-form');
const searchQuery = document.querySelector('[name = "searchQuery"]');
const imagesGallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
let page = 1;


searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);
infinitScrollBtn.addEventListener('click', onInfinitScrolling);

async function onSearch(e) {
  e.preventDefault();
  imagesGallery.innerHTML = '';
  let q = searchQuery.value.trim();
  if (q !== '') {
    try {
      const data = await getImages(q, page);
      if (data.hits.length === 0) {
        Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notify.success(`Hooray! We found ${data.totalHits} images`);
        renderGallery(data);
        gallery.refresh();
        ifGalleryEnd(data);
      }
    } catch (error) {
      console.log(error.message);
      Notify.failure('Something went wrang. Please try again.');
    }
  } else Notify.info('Please enter your search request.');
}

async function onLoadMore() {
  try {
    let q = searchQuery.value.trim();
    const data = await getImages(q, page);
    page += 1;
    renderGallery(data);
    gallery.refresh();
    smoothScroll();
    ifGalleryEnd(data);
  } catch (error) {
    console.log(error.message);
    Notify.failure('Something went wrang. Please try again.');
  }
}

function renderGallery(data) {
  imagesGallery.insertAdjacentHTML('beforeend', markupGallery(data.hits));
}

function ifGalleryEnd(data) {
  if (page * 40 >= data.totalHits) {
    Notify.info("We're sorry, but you've reached the end of search results.");
  } else {
    loadMoreBtn.classList.remove('is-hidden');
      }
}

function smoothScroll() {
  const { height } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}
