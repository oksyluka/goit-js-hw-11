import axios from 'axios';

export default async function getImages(query, page) {
  const searchParams = {
    params: {
      key: '29329235-4ba61ea66a877185ada781bb7',
      q: query,
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
