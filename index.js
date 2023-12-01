import { descriptions } from "./descriptions.js";
import { obsolete, untranslated } from "./exceptions.js";

const missingHeading = document.getElementById("missing-heading");
const missingOutput = document.getElementById("missing");
const untranslatedHeading = document.getElementById("untranslated-heading");
const untranslatedOutput = document.getElementById("untranslated");
const obsoleteHeading = document.getElementById("obsolete-heading");
const obsoleteOutput = document.getElementById("obsolete");
const fileLocatoin = document.getElementById("file-location");
let languageObject = {};

function clearInterface() {
  missingOutput.innerHTML = "";
  fileLocatoin.innerHTML = "";
  missingHeading.innerHTML = "";
}

function checkCoverage(languageId) {
  const root = fetch(`https://raw.githubusercontent.com/suttacentral/bilara-data/published/root/en/site/interface_root-en-site.json`)
    .then(response => response.json())
    .catch(error => {
    });

  const target = fetch(`https://raw.githubusercontent.com/suttacentral/bilara-data/published/translation/${languageId}/site/interface_translation-${languageId}-site.json`)
    .then(response => response.json())
    .catch(error => {
      clearInterface();
      missingOutput.innerText = `❌There is no interface tranlsation for ${languageObject[languageId]}.`;
    });

  Promise.all([root, target])
    .then(responses => {
      const [rootInterface, targetInterface] = responses;
      const rootKeys = Object.keys(rootInterface);

      let missing = "";
      let leaveUntranslated="";
      let notUsed=""

      for (let i = 0; i < rootKeys.length; i++) {
        const key=rootKeys[i]
        const targetTranslation=targetInterface[key];
 
        if (!targetTranslation) {
          if (obsolete.includes(key)){
            notUsed+= `"${rootKeys[i]}": "${rootInterface[rootKeys[i]]}" , \n`;
          }
          else if (untranslated.includes(key)){
            leaveUntranslated+= `"${rootKeys[i]}": "${rootInterface[rootKeys[i]]}" , \n`;
          }
          else {
          missing += `"${rootKeys[i]}": "${rootInterface[rootKeys[i]]}" , \n`;
          }
        }
      }


      clearInterface();
      missingHeading.innerText = missing ? `Items missing from the ${languageObject[languageId]} interface:` : "";
      missingOutput.innerText = missing ? missing : `✅The ${languageObject[languageId]} language interface file is complete.`;

      obsoleteHeading.innerText = notUsed ? `Items that are no longer used in the interface:` : "";
      obsoleteOutput.innerText = notUsed? notUsed:"";
      
      untranslatedHeading.innerText = leaveUntranslated ? `Items that don't need to be translated:` : "";
      untranslatedOutput.innerText = leaveUntranslated? leaveUntranslated:"";



      fileLocatoin.innerHTML = `Existing file located at <a href="https://github.com/suttacentral/bilara-data/blob/published/translation/${languageId}/site/interface_translation-${languageId}-site.json">https://github.com/suttacentral/bilara-data/blob/published/translation/${languageId}/site/interface_translation-${languageId}-site.json</a>`;
    })
    .catch(error => {

    });
}

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

const allLanguageButton = document.getElementById("submit-all-language");
const noTranslationsArea = document.getElementById("no-translations");
allLanguageButton.addEventListener("click", () => {
  noTranslationsArea.innerHTML = `<h2>No Translations</h2>`;
  const languageIds = Object.keys(languageObject);
  for (let i = 0; i < languageIds.length; i++) {
    const languageId = languageIds[i];
    const target = fetch(`https://raw.githubusercontent.com/suttacentral/bilara-data/published/translation/${languageId}/site/interface_translation-${languageId}-site.json`)
      .then(response => response.json())
      .then(data => {
      })
      .catch(error => {
        const newDiv = document.createElement("div");
        newDiv.innerHTML = `${languageObject[languageId]} <span class="description">${descriptions[languageId]}</span>`;
        // newDiv.appendChild(node);
        noTranslationsArea.appendChild(newDiv);
      });
  }
});
