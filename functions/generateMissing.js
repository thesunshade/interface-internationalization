import { obsolete, untranslated } from "../data/exceptions.js";

export function generateMissing(rootInterface, targetInterface) {
  if (targetInterface === undefined) {
    targetInterface = {};
  }

  const rootKeys = Object.keys(rootInterface);

  let missing = "";
  let missingCount = 0;
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
        missingCount++;
      }
    }
  }

  return { missing, missingCount, missingCSV, leaveUntranslated, notUsed };
}
