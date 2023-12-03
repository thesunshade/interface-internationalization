import { checkCoverage } from "./functions/checkCoverage.js";
import { descriptions } from "./data/descriptions.js";

export const missingHeading = document.getElementById("missing-heading");
export const missingOutput = document.getElementById("missing");
export const untranslatedHeading = document.getElementById("untranslated-heading");
export const untranslatedOutput = document.getElementById("untranslated");
export const obsoleteHeading = document.getElementById("obsolete-heading");
export const obsoleteOutput = document.getElementById("obsolete");
export const fileLocation = document.getElementById("file-location");
const allLanguageButton = document.getElementById("submit-all-language");
const noTranslationsArea = document.getElementById("no-translations");
export let languageObject = {};
let fileName = "";

// language dropdown
const languageDropdown = document.getElementById("languages");
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

// file dropdown
function buildFileDropdown() {
  const filesDropdown = document.getElementById("files");
  const filesDescription = document.getElementById("file-description");
  const files = {
    interface: "most of the website interface",
    home: "homepage specific content",
    about: `for the <a href="https://suttacentral.net/about" rel="noreferrer" target="_blank">About page</a>`,
    introduction: `for the <a href="https://suttacentral.net/introduction"rel="noreferrer" target="_blank">Introduction to SuttaCentral page</a>`,
    licensing: `for the <a href="https://suttacentral.net/licensing"rel="noreferrer" target="_blank">Copyright page</a>`,
    start: `for the <a href="https://suttacentral.net/start"rel="noreferrer" target="_blank">Getting started reading suttas page</a>`,
  };
  const fileKeys = Object.keys(files);
  for (let i = 0; i < fileKeys.length; i++) {
    filesDropdown.innerHTML += `<option value="${fileKeys[i]}">${fileKeys[i]}</options>`;
  }
  filesDescription.innerHTML = `This file is ${files[fileKeys[0]]}`;
  fileName = fileKeys[1];

  filesDropdown.addEventListener("change", e => {
    const selected = e.target.value;
    filesDescription.innerHTML = `This file is ${files[selected]}`;
    fileName = selected;
  });
}

buildFileDropdown();

const submitLanguageButton = document.getElementById("submit-language");
submitLanguageButton.addEventListener("click", e => {
  checkCoverage(languageDropdown.value, fileName);
});

allLanguageButton.addEventListener("click", () => {
  noTranslationsArea.innerHTML = `<h2>The following have no translations of the <code>${fileName}</code> file:</h2>`;
  const languageIds = Object.keys(languageObject);
  for (let i = 0; i < languageIds.length; i++) {
    const languageId = languageIds[i];
    const target = fetch(`https://raw.githubusercontent.com/suttacentral/bilara-data/published/translation/${languageId}/site/${fileName}-${languageId}-site.json`)
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
