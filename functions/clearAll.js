// clear button
export function clearAll() {
  const elementsToClear = document.querySelectorAll(".clearable");
  elementsToClear.forEach(element => (element.innerHTML = ""));
}
