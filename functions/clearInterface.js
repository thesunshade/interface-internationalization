import { missingOutput, fileLocatoin, missingHeading } from "../index.js";

export function clearInterface() {
  missingOutput.innerHTML = "";
  fileLocatoin.innerHTML = "";
  missingHeading.innerHTML = "";
}
