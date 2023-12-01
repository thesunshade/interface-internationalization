import { checkCoverage } from "./functions/checkCoverage.js";
import { descriptions } from "./data/descriptions.js";

export const missingHeading = document.getElementById("missing-heading");
export const missingOutput = document.getElementById("missing");
export const untranslatedHeading = document.getElementById("untranslated-heading");
export const untranslatedOutput = document.getElementById("untranslated");
export const obsoleteHeading = document.getElementById("obsolete-heading");
export const obsoleteOutput = document.getElementById("obsolete");
export const fileLocatoin = document.getElementById("file-location");
const allLanguageButton = document.getElementById("submit-all-language");
const noTranslationsArea = document.getElementById("no-translations");
export let languageObject = {};

// language dropdown
const dropdown = document.getElementById("languages");
fetch(`https://suttacentral.net/api/languages`)
  .then(response => response.json())
  .then(data => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].uid != "en") {
        dropdown.innerHTML += `<option value="${data[i].uid}" >[${data[i].uid}] ${data[i].name}</option>`;
        languageObject[data[i].uid] = data[i].name;
      }
    }
  });

const submitLanguageButton = document.getElementById("submit-language");
submitLanguageButton.addEventListener("click", e => {
  checkCoverage(dropdown.value);
});

allLanguageButton.addEventListener("click", () => {
  noTranslationsArea.innerHTML = `<h2>The following have no translations of the main interface file:</h2>`;
  const languageIds = Object.keys(languageObject);
  for (let i = 0; i < languageIds.length; i++) {
    const languageId = languageIds[i];
    const target = fetch(`https://raw.githubusercontent.com/suttacentral/bilara-data/published/translation/${languageId}/site/interface_translation-${languageId}-site.json`)
      .then(response => response.json())
      .then(data => {})
      .catch(error => {
        const newDiv = document.createElement("div");
        newDiv.innerHTML = `${languageObject[languageId]} <span class="description">${descriptions[languageId]}</span>`;
        // newDiv.appendChild(node);
        noTranslationsArea.appendChild(newDiv);
      });
  }
});
