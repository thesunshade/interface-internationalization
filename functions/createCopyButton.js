import { copyIcon } from "../images/icons.js";

export default function createCopyButton(targetElement, targetVariable) {
  const copyButton = document.createElement("button");
  copyButton.id = "copyButton";
  const copyButtonText = `${copyIcon} Copy`;
  copyButton.innerHTML = copyButtonText;

  // Append button to the target element
  targetElement.insertBefore(copyButton, targetElement.firstChild);

  // Add click event listener to the copy button
  copyButton.addEventListener("click", function () {
    // Copy value to clipboard
    navigator.clipboard.writeText(targetVariable);

    // Change button text to "Copied!"
    copyButton.innerText = "Copied!";

    // Toggle class for transition effect
    copyButton.classList.add("clicked");

    // Reset button text after 5 seconds
    setTimeout(function () {
      copyButton.innerHTML = copyButtonText;
      copyButton.classList.remove("clicked");
    }, 5000);
  });
}
