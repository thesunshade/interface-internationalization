import { clearInterface } from "./clearInterface.js";
import { missingOutput, languageObject, missingHeading, obsoleteHeading, obsoleteOutput, untranslatedHeading, untranslatedOutput, fileLocation } from "../index.js";
import createCopyButton from "./createCopyButton.js";
import createButton from "./createButton.js";
import { saveToFile } from "./saveToFile.js";
import { jsonIcon, csvIcon, cautionIcon, checkIcon } from "../images/icons.js";
import { generateMissing } from "./generateMissing.js";

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

      const { missing, missingCSV, leaveUntranslated, notUsed } = generateMissing(rootInterface, targetInterface);

      missingHeading.innerHTML = missing ? `Items missing from the ${languageObject[languageId]} <code>${targetFile}</code>:` : "";
      if (missing) {
        missingOutput.innerText = wrapCurlyBrackets(missing);
      } else {
        missingOutput.innerHTML = `${checkIcon} The ${languageObject[languageId]} language ${targetFile} file is complete.`;
      }

      if (missing) {
        createCopyButton(missingOutput, missing);

        const optionsJsonButton = {
          targetElement: missingOutput,
          targetVariable: missing,
          fileName: targetFile,
          buttonText: `${jsonIcon} Save JSON`,
          buttonSuccessText: "Saved!",
          onClick: saveToFile,
        };
        createButton(optionsJsonButton);

        const optionsCsvButton = {
          targetElement: missingOutput,
          targetVariable: missingCSV,
          fileName: targetFile.replace("json", "csv"),
          buttonText: `${csvIcon} Save CSV`,
          buttonSuccessText: "Saved!",
          onClick: saveToFile,
        };
        createButton(optionsCsvButton);
      }

      obsoleteHeading.innerText = notUsed ? `Items that are no longer used in the interface:` : "";
      obsoleteOutput.innerText = notUsed ? notUsed : "";

      untranslatedHeading.innerText = leaveUntranslated ? `Items that don't need to be translated:` : "";
      untranslatedOutput.innerText = leaveUntranslated ? leaveUntranslated : "";

      fileLocation.innerHTML = someTranslationExists
        ? `Existing <code>${targetFile}</code> located at <code><a href="https://github.com/suttacentral/bilara-data/blob/published/translation/${languageId}/site/${targetFile}">https://github.com/suttacentral/bilara-data/blob/published/translation/${languageId}/site/${targetFile}</a></code>`
        : `${cautionIcon} There is no <code>${targetFile}</code> file for ${languageObject[languageId]}. The file should be located at <code>github.com/suttacentral/bilara-data/blob/published/translation/${languageId}/site/</code>`;
    })
    .catch(error => {});
}

function wrapCurlyBrackets(text) {
  return `{\n${text}}`;
}
