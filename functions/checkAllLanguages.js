import { descriptions } from "../data/descriptions.js";
import { allTranslationsArea, languageObject } from "../index.js";

export function checkAllLanguages() {
  const fileName = localStorage.fileName;
  allTranslationsArea.classList.add("hide");
  allTranslationsArea.innerHTML = `
    <h2>The following have no translations of the <code>${fileName}</code> file:</h2>
    <div id="no-translations"></div>
    <h2>The following have some or all translations of the <code>${fileName}</code> file:</h2>
    <div id="some-translations"></div>`;

  const noTranslationArea = document.getElementById("no-translations");
  const someTranslationArea = document.getElementById("some-translations");
  const languageIds = Object.keys(languageObject);

  // Create an array to store all the promises
  const fetchPromises = [];

  for (let i = 0; i < languageIds.length; i++) {
    const languageId = languageIds[i];
    const fileLocation = `https://raw.githubusercontent.com/suttacentral/bilara-data/published/translation/${languageId}/site/${fileName}_translation-${languageId}-site.json`;

    // Push each fetch promise to the array
    fetchPromises.push(
      fetch(fileLocation)
        .then(response => response.json())
        .then(data => {
          const githubPageLocation = `https://github.com/suttacentral/bilara-data/blob/published/translation/${languageId}/site/${fileName}_translation-${languageId}-site.json`;
          const newDiv = document.createElement("div");
          let description = descriptions[languageId] ? `<span class="description">(${descriptions[languageId]})</span>` : "";
          newDiv.innerHTML = `<a href="${githubPageLocation}" rel="noreferrer" target="_blank">${languageObject[languageId]}</a> ${description}`;
          someTranslationArea.appendChild(newDiv);
        })
        .catch(error => {
          const newDiv = document.createElement("div");
          let description = descriptions[languageId] ? `<span class="description">(${descriptions[languageId]})</span>` : "";
          newDiv.innerHTML = `${languageObject[languageId]} ${description}`;
          noTranslationArea.appendChild(newDiv);
        })
    );
  }

  // Use Promise.all to wait for all fetchPromises to resolve
  Promise.all(fetchPromises)
    .then(() => {
      // This block will be executed after all promises are resolved
      allTranslationsArea.classList.remove("hide");
    })
    .catch(error => {
      // Handle errors if any of the promises reject
      console.error("Error fetching translations:", error);
    });
}
