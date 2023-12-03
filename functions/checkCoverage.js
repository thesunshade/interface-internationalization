import { clearInterface } from "./clearInterface.js";
import { obsolete, untranslated } from "../data/exceptions.js";
import { missingOutput, languageObject, missingHeading, obsoleteHeading, obsoleteOutput, untranslatedHeading, untranslatedOutput, fileLocation } from "../index.js";
import createCopyButton from "./createCopyButton.js";

export function checkCoverage(languageId, fileName) {
  const rootFile = `${fileName}_root-en-site.json`;
  const targetFile = `${fileName}_translation-${languageId}-site.json`;

  let someTranslationExists = true;
  const root = fetch(`https://raw.githubusercontent.com/suttacentral/bilara-data/published/root/en/site/${rootFile}`)
    .then(response => response.json())
    .catch(error => {});

  const target = fetch(`https://raw.githubusercontent.com/suttacentral/bilara-data/published/translation/${languageId}/site/${targetFile}`)
    .then(response => response.json())
    .catch(error => {
      clearInterface();
      someTranslationExists = false;
    });

  Promise.all([root, target])
    .then(responses => {
      const [rootInterface, targetInterface] = responses;

      const { missing, leaveUntranslated, notUsed } = generateMissing(rootInterface, targetInterface);

      missingHeading.innerHTML = missing ? `Items missing from the ${languageObject[languageId]} <code>${targetFile}</code>:` : "";
      missingOutput.innerText = missing ? missing : `✅The ${languageObject[languageId]} language ${targetFile} file is complete.`;

      if (missing) {
        createCopyButton(missingOutput, missing);
      }

      obsoleteHeading.innerText = notUsed ? `Items that are no longer used in the interface:` : "";
      obsoleteOutput.innerText = notUsed ? notUsed : "";

      untranslatedHeading.innerText = leaveUntranslated ? `Items that don't need to be translated:` : "";
      untranslatedOutput.innerText = leaveUntranslated ? leaveUntranslated : "";

      fileLocation.innerHTML = someTranslationExists
        ? `Existing ${targetFile} located at <a href="https://github.com/suttacentral/bilara-data/blob/published/translation/${languageId}/site/${targetFile}">https://github.com/suttacentral/bilara-data/blob/published/translation/${languageId}/site/${targetFile}</a>`
        : `❌ There is no <code>${targetFile}</code> file for ${languageObject[languageId]}. The file should be located at <code>github.com/suttacentral/bilara-data/blob/published/translation/${languageId}/site/</code>`;
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
        notUsed += `"${rootKeys[i]}": "${rootInterface[rootKeys[i]]}",\n`;
      } else if (untranslated.includes(key)) {
        leaveUntranslated += `"${rootKeys[i]}": "${rootInterface[rootKeys[i]]}",\n`;
      } else {
        missing += `"${rootKeys[i]}": "${rootInterface[rootKeys[i]]}",\n`;
      }
    }
  }

  return { missing, leaveUntranslated, notUsed };
}
