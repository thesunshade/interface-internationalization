import { fileLocation, missingHeading, missingOutput, obsoleteHeading, obsoleteOutput, untranslatedHeading, untranslatedOutput } from "../index.js";

export function clearInterface() {
  fileLocation.innerHTML = "";
  missingOutput.innerHTML = "";
  missingHeading.innerHTML = "";
  obsoleteHeading.innerText = "";
  obsoleteOutput.innerText = "";
  untranslatedHeading.innerText = "";
  untranslatedOutput.innerText = "";
}
