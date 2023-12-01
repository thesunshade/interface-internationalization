import { clearInterface } from "./clearInterface.js";
import { obsolete, untranslated } from "../data/exceptions.js";
import { missingOutput, languageObject, missingHeading, obsoleteHeading, obsoleteOutput, untranslatedHeading, untranslatedOutput, fileLocation } from "../index.js";
import createCopyButton from "./createCopyButton.js";

export function checkCoverage(languageId) {
  let someTranslationExists = true;
  const root = fetch(`https://raw.githubusercontent.com/suttacentral/bilara-data/published/root/en/site/interface_root-en-site.json`)
    .then(response => response.json())
    .catch(error => {});

  const target = fetch(`https://raw.githubusercontent.com/suttacentral/bilara-data/published/translation/${languageId}/site/interface_translation-${languageId}-site.json`)
    .then(response => response.json())
    .catch(error => {
      clearInterface();
      someTranslationExists = false;
      // missingOutput.innerText = `❌There is no interface tranlsation for ${languageObject[languageId]}.`;
    });

  Promise.all([root, target])
    .then(responses => {
      const [rootInterface, targetInterface] = responses;

      const { missing, leaveUntranslated, notUsed } = generateMissing(rootInterface, targetInterface);

      missingHeading.innerText = missing ? `Items missing from the ${languageObject[languageId]} interface:` : "";
      missingOutput.innerText = missing ? missing : `✅The ${languageObject[languageId]} language interface file is complete.`;

      if (missing) {
        createCopyButton(missingOutput, missing);
      }

      obsoleteHeading.innerText = notUsed ? `Items that are no longer used in the interface:` : "";
      obsoleteOutput.innerText = notUsed ? notUsed : "";

      untranslatedHeading.innerText = leaveUntranslated ? `Items that don't need to be translated:` : "";
      untranslatedOutput.innerText = leaveUntranslated ? leaveUntranslated : "";

      fileLocation.innerHTML = someTranslationExists
        ? `Existing file located at <a href="https://github.com/suttacentral/bilara-data/blob/published/translation/${languageId}/site/interface_translation-${languageId}-site.json">https://github.com/suttacentral/bilara-data/blob/published/translation/${languageId}/site/interface_translation-${languageId}-site.json</a>`
        : `❌ There is no interface tranlsation for ${languageObject[languageId]}. The file name should be <code>interface_translation-${languageId}-site.json</code> and it should be located at <code>github.com/suttacentral/bilara-data/blob/published/translation/${languageId}/site/</code>`;
    })
    .catch(error => {});
}

function generateMissing(rootInterface, targetInterface) {
  if (targetInterface === undefined) {
    targetInterface = {};
  }

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

  return { missing, leaveUntranslated, notUsed };
}
