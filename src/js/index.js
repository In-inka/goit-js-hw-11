import Notiflix from 'notiflix';
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

import { galleryMarkup } from '../partias/markup';
import { apiServiseImages } from '../partias/api';

//змінні з селекторами

const ref = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};
//змінна на пошук, змінна на сторінку
let nameImages;
let currentPage;
//SimpleLightbox
const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: '250',
  animationSpeed: 100,
  fadeSpeed: 300,
});

//кнопка прихована до першого запиту
ref.loadMore.style.display = 'none';

//базове url

//слухач на кнопку пошуку та на кнопку додавання
ref.searchForm.addEventListener('submit', onSearchImages);
ref.loadMore.addEventListener('click', onLoadMore);

//функція  пошуку

function onSearchImages(e) {
  e.preventDefault();
  clearMarkup();
  currentPage = 1;

  nameImages = e.target.elements.searchQuery.value.trim();
  //У разі пошуку за новим ключовим словом, значення page потрібно повернути до початкового, оскільки буде пагінація по новій колекції зображень.
  if (nameImages === '') {
    emptyForm();
    return;
  }
  requestImages();
}

//створюємо асин.функцію запиту на сервер
//в параметрах вказуємо per_page 40 та page = змінна поточне значення 1

//перебипаємо повернений масив та мапимо розмітку

async function requestImages() {
  try {
    const data = await apiServiseImages(nameImages, currentPage);

    const images = data.hits;
    const totalHits = data.totalHits;

    if (images.length === 0) {
      nothingFound();
      return;
    }

    if (currentPage === 1) {
      foundTotalHits(totalHits);
    }

    const imagesMurkup = await galleryMarkup(images);
    ref.gallery.insertAdjacentHTML('beforeend', imagesMurkup);
    ref.loadMore.style.display = 'block';

    lightbox.refresh();

    if (currentPage >= 2) {
      scrollPage();
    }

    const totalPages = Math.ceil(totalHits / 40);
    if (currentPage >= totalPages) {
      endOfCollection();
      return;
    }
    currentPage++;
  } catch (error) {
    Notify.failure(error.message, 'Something went wrong!');
    clearMarkup();
  }
}

//перевіряємо чи не пустий масив

function nothingFound() {
  return Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

//під час нового пошуку очищаємо вміст галереї
function clearMarkup() {
  ref.loadMore.style.display = 'none';
  ref.gallery.innerHTML = ' ';
}

//з кожним наступним запитом по кліку додати зображення, збільшуємо  page +1
//функція для додавання зображень при кліку на кнопку

function onLoadMore() {
  ref.loadMore.style.display = 'none';
  requestImages();
}

function emptyForm() {
  return Notiflix.Notify.failure('Search field is empty!');
}

//перевіряємо якщо користувач дійшов до кінця колекції властивість totalHits ховаємо кнопку, виводимо повідомлення

function endOfCollection() {
  ref.loadMore.style.display = 'none';
  return Notiflix.Notify.failure(
    "We're sorry, but you've reached the end of search results."
  );
}

//тільки після першого сабміту вказуємо скільки всього знайшли зображень (властивість totalHits). Текст повідомлення - "Hooray! We found totalHits images."
function foundTotalHits(total) {
  return Notiflix.Notify.success(`Hooray! We found ${total} images.`);
}

//додати прокручування сторінки після кліку на кнопку додавання ще групи зображень
function scrollPage() {
  const { height: cardHeight } =
    ref.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
