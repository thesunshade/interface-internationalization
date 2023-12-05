import { checkCoverage } from "./functions/checkCoverage.js";
import { buildFileDropdown } from "./functions/buildFileDropdown.js";
import { clearAll } from "./functions/clearAll.js";
import { buildLanguageDropdown } from "./functions/buildLanguageDropdown.js";
import { checkAllLanguages } from "./functions/checkAllLanguages.js";

export const missingHeading = document.getElementById("missing-heading");
export const missingOutput = document.getElementById("missing");
export const untranslatedHeading = document.getElementById("untranslated-heading");
export const untranslatedOutput = document.getElementById("untranslated");
export const obsoleteHeading = document.getElementById("obsolete-heading");
export const obsoleteOutput = document.getElementById("obsolete");
export const fileLocation = document.getElementById("file-location");
export const allTranslationsArea = document.getElementById("all-translations");
export const languageDropdown = document.getElementById("languages");
export let languageObject = {};

const allLanguageButton = document.getElementById("submit-all-language");
const clearButton = document.getElementById("clear-button");
const submitLanguageButton = document.getElementById("submit-language");

buildLanguageDropdown();
buildFileDropdown();

clearButton.addEventListener("click", () => {
  clearAll();
});

submitLanguageButton.addEventListener("click", e => {
  clearAll();
  checkCoverage(languageDropdown.value, localStorage.fileName);
});

allLanguageButton.addEventListener("click", () => {
  clearAll();
  checkAllLanguages();
});
