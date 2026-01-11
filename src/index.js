import debounce from 'lodash.debounce';
import { alert } from '@pnotify/core';
import '../src/css/styles.css';
import fetchCountries from './js/fetchCountries.js';

import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const input = document.querySelector('#search');
const result = document.querySelector('#result');

function renderCountryList(countries) {
  return `
    <ul>
      ${countries.map(country => `<li>${country.name.common}</li>`).join('')}
    </ul>
  `;
}

function renderCountryDetails(country) {
  return `
    <h2>${country.name.common}</h2>
    <p><b>Столиця:</b> ${country.capital[0]}</p>
    <p><b>Населення:</b> ${country.population.toLocaleString()}</p>
    <p><b>Мова:</b> ${Object.values(country.languages).join(', ')}</p>
    <img src="${country.flags.png}" alt="${country.name.common}">
  `;
}

function handleCountries(countries) {
  result.innerHTML = '';

  if (countries.length > 10) {
    alert({
      text: 'Занадто багато результатів. Уточніть запит.',
      delay: 2000,
    });
    return;
  }

  if (countries.length >= 2) {
    result.innerHTML = renderCountryList(countries);
    return;
  }

  result.innerHTML = renderCountryDetails(countries[0]);
}

const onSearch = debounce(event => {
  const query = event.target.value.trim();

  if (!query) {
    result.innerHTML = '';
    return;
  }

  fetchCountries(query)
    .then(handleCountries)
    .catch(() => {
      result.innerHTML = '';
      alert({
        text: 'Країну не знайдено',
        delay: 2000,
      });
    });
}, 500);

input.addEventListener('input', onSearch);