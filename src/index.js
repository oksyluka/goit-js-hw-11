import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange() {
  const isFilled = input.value.trim();
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
  if (isFilled) {
    fetchCountries(isFilled)
      .then(inputEstimation)
      .catch(error => {
        if (error.code === '404') {
          Notify.failure('Oops, there is no country with that name');
          return;
        }
        Notify.failure('Unexpected error');
      });
  }
}

function inputEstimation(data) {
  if (data.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  } else if (data.length > 1 && data.length <= 10) {
    createCountriesList(data);
    return;
  } else if (data.length === 1) {
    createCountryInfo(data);
  }

  function createCountriesList(data) {
    const markupCountries = data
      .map(({ flags: { svg }, name: { official } }) => {
        return `<li class="country-item"><img src="${svg}" alt="Flag of ${official}" width="100" height="50"/>
        <p class="country-name">${official}</p></li>`;
      })
      .join('');
    countryList.insertAdjacentHTML('afterbegin', markupCountries);
  }
}

function createCountryInfo(data) {
  const markupInfo = data.map(
    ({
      flags: { svg },
      name: { official },
      capital,
      population,
      languages,
    }) => {
      return `<div class="country-title"><img src="${svg}" alt="Flag of ${official}" width="100" height="50"/>
        <p class="country">${official}</p></div>
    <ul>
      <li><span class="feature">Capital: </span>${capital}</li>
      <li><span class="feature">Population: </span>${population}</li>
      <li><span class="feature">Languages: </span>${Object.values(
        languages
      ).join(', ')}</li>
      </ul>`;
    }
  );
  countryInfo.insertAdjacentHTML('afterbegin', markupInfo);
}
