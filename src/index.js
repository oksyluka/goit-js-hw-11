import './css/styles.css';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const searchQuery = document.querySelector('[name = "searchQuery"]');
const imagesGallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
let q;

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onClick);

async function onSearch(e) {
  e.preventDefault();
  imagesGallery.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');
  q = searchQuery.value.trim();
  if (q === '') {
    Notify.info('Please enter your search request.');
    return;
  } else {
    try {
      const data = await getFotoes(q, page);
      if (data.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notify.success(`Hooray! We found ${data.totalHits} images`);
        renderGallery(data.hits);
        gallery = new SimpleLightbox('.gallery a', {
          captionsData: 'alt',
          captionDelay: 250,
        });
        loadMoreBtn.classList.remove('is-hidden');
        page += 1;
      }
    } catch (error) {
      Notify.failure('Something was wrang. Please try again.');
    }
  }
}

async function onClick() {
  try {
    q = searchQuery.value.trim();
    const data = await getFotoes(q, page);
    renderGallery(data.hits);
    gallery.refresh();
    smoothScroll();
    if (page * 40 >= data.totalHits) {
      loadMoreBtn.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
    page += 1;
  } catch (error) {
    Notify.failure('Something was wrang. Please try again.');
  }
}

async function getFotoes(q, page) {
  const searchParams = {
    params: {
      key: '29329235-4ba61ea66a877185ada781bb7',
      q,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: 40,
    },
  };
  const responce = await axios.get('https://pixabay.com/api/', searchParams);
  return responce.data;
}

function renderGallery(data) {
  const mark = data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
                 <a href="${largeImageURL}" class="gallery-link">
                    <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
                        <div class="info">
                            <p class="info-item">
                                <b>Likes</b>
                                ${likes}
                            </p>
                            <p class="info-item">
                                <b>Views</b>
                                ${views}
                            </p>
                            <p class="info-item">
                                <b>Comments</b>
                                ${comments}
                            </p>
                            <p class="info-item">
                                <b>Downloads</b>
                                ${downloads}
                            </p>
                        </div>
                  </a>       
                </div>`;
      }
    )
    .join('');
  imagesGallery.insertAdjacentHTML('beforeend', mark);
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
