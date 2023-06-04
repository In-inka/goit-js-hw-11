import axios from 'axios';
export async function apiServiseImages(nameImages, currentPage) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '36759166-b262fab0d028493afdf08d48d';

  const responses = await axios.get(`${BASE_URL}`, {
    params: {
      key: API_KEY,
      q: nameImages,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: currentPage,
      per_page: 40,
    },
  });
  const { data } = responses;

  return data;
}
