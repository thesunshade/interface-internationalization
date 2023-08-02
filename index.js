const missingOutput = document.getElementById("missing");
const fileLocatoin = document.getElementById("file-location");
const missingHeading = document.getElementById("missing-heading");
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
      console.log(error);
    });

  const target = fetch(`https://raw.githubusercontent.com/suttacentral/bilara-data/published/translation/${languageId}/site/interface_translation-${languageId}-site.json`)
    .then(response => response.json())
    .catch(error => {
      clearInterface();
      missingOutput.innerText = `❌There is no interface tranlsation for ${languageObject[languageId]}.`;
      console.log(error);
    });

  Promise.all([root, target])
    .then(responses => {
      const [rootInterface, targetInterface] = responses;
      const rootKeys = Object.keys(rootInterface);

      let missing = "";

      for (let i = 0; i < rootKeys.length; i++) {
        if (!targetInterface[rootKeys[i]]) {
          missing += `"${rootKeys[i]}": "${rootInterface[rootKeys[i]]}" , \n`;
        }
      }
      console.log(missing);
      clearInterface();
      missingOutput.innerText = missing ? missing : `✅The ${languageObject[languageId]} language interface file is complete.`;
      missingHeading.innerText = missing ? `Items missing from the ${languageObject[languageId]} interface:` : "";
      fileLocatoin.innerHTML = `Existing file located at <a href="https://github.com/suttacentral/bilara-data/blob/published/translation/${languageId}/site/interface_translation-${languageId}-site.json">https://github.com/suttacentral/bilara-data/blob/published/translation/${languageId}/site/interface_translation-${languageId}-site.json</a>`;
    })
    .catch(error => {
      console.log(error);
    });
}

const dropdown = document.getElementById("languages");

fetch(`https://suttacentral.net/api/languages`)
  .then(response => response.json())
  .then(data => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].uid != "en") {
        dropdown.innerHTML += `<option value="${data[i].uid}" >${data[i].name}</option>`;
        languageObject[data[i].uid] = data[i].name;
      }
    }
  });

const submitLanguageButton = document.getElementById("submit-language");
submitLanguageButton.addEventListener("click", e => {
  checkCoverage(dropdown.value);
});
