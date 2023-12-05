import { languageDropdown, languageObject } from "../index.js";

// language dropdown
export function buildLanguageDropdown() {
  fetch(`https://suttacentral.net/api/languages`)
    .then(response => response.json())
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].uid != "en") {
          languageDropdown.innerHTML += `<option value="${data[i].uid}" >[${data[i].uid}] ${data[i].name}</option>`;
          languageObject[data[i].uid] = data[i].name;
        }
      }
    });
}
