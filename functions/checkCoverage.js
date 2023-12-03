import { clearInterface } from "./clearInterface.js";
import { obsolete, untranslated } from "../data/exceptions.js";
import { missingOutput, languageObject, missingHeading, obsoleteHeading, obsoleteOutput, untranslatedHeading, untranslatedOutput, fileLocation } from "../index.js";
import createCopyButton from "./createCopyButton.js";
import createButton from "./createButton.js";
import { saveToFile } from "./saveToFile.js";

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
      missingOutput.innerText = missing ? wrapCurlyBrackets(missing) : `✅The ${languageObject[languageId]} language ${targetFile} file is complete.`;

      if (missing) {
        createCopyButton(missingOutput, missing);

        const optionsJsonButton = {
          targetElement: missingOutput,
          targetVariable: missing,
          fileName: targetFile,
          buttonText: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path style="fill:none;stroke-width:16;stroke-linecap:round;stroke-linejoin:round;stroke:#f6e5d2;stroke-opacity:1;stroke-miterlimit:4" d="M80 40c-64 0 0 88-64 88 64 0 0 88 64 88M176 40c64 0 0 88 64 88-64 0 0 88-64 88" transform="scale(.0586)"/></svg> Save JSON`,
          buttonSuccessText: "Saved!",
          onClick: saveToFile,
        };
        createButton(optionsJsonButton);

        const optionsCsvButton = {
          targetElement: missingOutput,
          targetVariable: missingCSV,
          fileName: targetFile.replace("json", "csv"),
          buttonText: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path style="fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:#f6e5d2;stroke-opacity:1;stroke-miterlimit:10" d="M3 15h18M3 9h18M9 21V3m6 18V3M5.4 3h13.2A2.4 2.4 0 0 1 21 5.4v13.2a2.4 2.4 0 0 1-2.4 2.4H5.4A2.4 2.4 0 0 1 3 18.6V5.4A2.4 2.4 0 0 1 5.4 3zm0 0" transform="scale(.625)"/></svg> Save CSV`,
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
  let missingCSV = "";
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
        missingCSV += `"${rootKeys[i]}", "${rootInterface[rootKeys[i]]}",\n`;
      }
    }
  }

  return { missing, missingCSV, leaveUntranslated, notUsed };
}

function wrapCurlyBrackets(text) {
  return `{\n${text}}`;
}
