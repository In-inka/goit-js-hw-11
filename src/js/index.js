import Notiflix from 'notiflix';
import axios from 'axios';

// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('#search-form');
const buttonLoadMore = document.querySelector('.load-more');
let imagesName = '';
let currentPage = 1;

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '36759166-b262fab0d028493afdf08d48d';

searchForm.addEventListener('submit', onInput);
buttonLoadMore.addEventListener('click', onClickLoadMore);

async function getUser() {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        key: API_KEY,
        q: imagesName,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: currentPage,
        per_page: 40,
      },
    });

    const { data } = response;

    const image = data.hits;
    const totalHits = data.totalHits;

    if (image.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    const postImg = image
      .map(
        ({
          webformatURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => `<div class="photo-card">
  <img src=${webformatURL} alt=${tags} loading="lazy"  width="350px"
  height="250px" />
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
</div>`
      )
      .join('');
    gallery.insertAdjacentHTML('beforeend', postImg);
    currentPage += 1;

    if (imagesName) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images`);
    }
    if (currentPage > 1) {
      buttonLoadMore.style.display = 'block';
    }

    if (currentPage * 40 >= totalHits) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function onInput(evt) {
  evt.preventDefault();
  imagesName = evt.target.elements.searchQuery.value.trim();

  currentPage = 1;

  if (imagesName === '') {
    return;
  }
  getUser();

  gallery.innerHTML = '';
}
function onClickLoadMore() {
  buttonLoadMore.style.display = 'none';
  getUser();
}
