export default function createCopyButton(targetElement, targetVariable) {
  const copyButton = document.createElement("button");
  copyButton.id = "copyButton";
  const copyButtonText = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path style="fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:#f6e5d2;stroke-opacity:1;stroke-miterlimit:10" d="M6 15h-.6A2.393 2.393 0 0 1 3 12.6V5.4C3 4.069 4.069 3 5.4 3h7.2C13.931 3 15 4.069 15 5.4V6m-3.6 3h7.2a2.4 2.4 0 0 1 2.4 2.4v7.2a2.4 2.4 0 0 1-2.4 2.4h-7.2A2.4 2.4 0 0 1 9 18.6v-7.2A2.4 2.4 0 0 1 11.4 9zm0 0" transform="scale(.625)"/></svg> Copy`;
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
