import { clearInterface } from "./clearInterface.js";
import { obsolete, untranslated } from "../data/exceptions.js";
import { missingOutput, languageObject, missingHeading, obsoleteHeading, obsoleteOutput, untranslatedHeading, untranslatedOutput, fileLocatoin as fileLocation } from "../index.js";

export function checkCoverage(languageId) {
  const root = fetch(`https://raw.githubusercontent.com/suttacentral/bilara-data/published/root/en/site/interface_root-en-site.json`)
    .then(response => response.json())
    .catch(error => {});

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
      let leaveUntranslated = "";
      let notUsed = "";

      for (let i = 0; i < rootKeys.length; i++) {
        const key = rootKeys[i];
        const targetTranslation = targetInterface[key];

        if (!targetTranslation) {
          if (obsolete.includes(key)) {
            notUsed += `"${rootKeys[i]}": "${rootInterface[rootKeys[i]]}" , \n`;
          } else if (untranslated.includes(key)) {
            leaveUntranslated += `"${rootKeys[i]}": "${rootInterface[rootKeys[i]]}" , \n`;
          } else {
            missing += `"${rootKeys[i]}": "${rootInterface[rootKeys[i]]}" , \n`;
          }
        }
      }

      clearInterface();

      missingHeading.innerText = missing ? `Items missing from the ${languageObject[languageId]} interface:` : "";
      missingOutput.innerText = missing ? missing : `✅The ${languageObject[languageId]} language interface file is complete.`;

      obsoleteHeading.innerText = notUsed ? `Items that are no longer used in the interface:` : "";
      obsoleteOutput.innerText = notUsed ? notUsed : "";

      untranslatedHeading.innerText = leaveUntranslated ? `Items that don't need to be translated:` : "";
      untranslatedOutput.innerText = leaveUntranslated ? leaveUntranslated : "";

      fileLocation.innerHTML = `Existing file located at <a href="https://github.com/suttacentral/bilara-data/blob/published/translation/${languageId}/site/interface_translation-${languageId}-site.json">https://github.com/suttacentral/bilara-data/blob/published/translation/${languageId}/site/interface_translation-${languageId}-site.json</a>`;
    })
    .catch(error => {});
}
