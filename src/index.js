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
let query;

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  imagesGallery.innerHTML = '';
  query = searchQuery.value.trim();
  if (query === '') {
    Notify.info('Please enter your search request.');
    return;
  } else {
    try {
      loadMoreBtn.classList.add('is-hidden');
      const data = await getImages(query, page);
      dataHandle(data);
    } catch (error) {
      errorHandle(error);
    }
  }
}

async function onLoadMore() {
  try {
    loadMoreBtn.classList.add('is-hidden');
    page += 1;
    const data = await getImages(query, page);
    renderGallery(data);
    gallery.refresh();
    smoothScroll();
    ifGalleryEnd(data);
  } catch (error) {
    errorHandle(error);
  }
}

function dataHandle(data) {
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
}

function errorHandle(error) {
  console.log(error.message);
  Notify.failure('Something went wrang. Please try again.');
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
