import Notiflix from 'notiflix';
import axios from 'axios';

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

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const image = await data.hits;

    if (image.length === 0) {
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    const postImg = await image
      .map(
        ({
          webformatURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => `<div class="photo-card">
  <img src=${webformatURL} alt=${tags} loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`
      )
      .join('');
    gallery.insertAdjacentHTML('beforeend', postImg);
  } catch (error) {
    console.log(error);
  }
}

function onInput(evt) {
  evt.preventDefault();
  imagesName = evt.target.elements.searchQuery.value.trim();

  searchForm.reset();
  getUser();
}
function onClickLoadMore() {
  currentPage += 1;
  getUser();

  if (imagesName === '') {
    currentPage === 1;
  }
}
///
