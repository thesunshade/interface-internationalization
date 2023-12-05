// file dropdown
import { files } from "../data/files.js";

export function buildFileDropdown() {
  const filesDropdown = document.getElementById("files");
  const filesDescription = document.getElementById("file-description");

  const fileKeys = Object.keys(files);
  for (let i = 0; i < fileKeys.length; i++) {
    filesDropdown.innerHTML += `<option value="${fileKeys[i]}">${fileKeys[i]}</options>`;
  }
  filesDescription.innerHTML = `This file is ${files[fileKeys[0]]}`;
  localStorage.fileName = fileKeys[0];

  filesDropdown.addEventListener("change", e => {
    const selected = e.target.value;
    filesDescription.innerHTML = `This file is ${files[selected]}`;
    localStorage.fileName = selected;
  });
}
