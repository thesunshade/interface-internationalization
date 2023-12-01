export default function createCopyButton(targetElement, targetVariable) {
  console.log("create copy button", targetElement, { targetVariable });

  const copyButton = document.createElement("button");
  copyButton.id = "copyButton";
  copyButton.innerText = "Copy";

  // Append button to the target element
  targetElement.insertBefore(copyButton, targetElement.firstChild);

  // Add click event listener to the copy button
  copyButton.addEventListener("click", function () {
    // Copy value to clipboard
    navigator.clipboard.writeText(targetVariable);

    // Change button text to "Copied!"
    copyButton.innerText = "Copied!";

    // Toggle class for transition effect
    copyButton.classList.add("copied");

    // Reset button text after 5 seconds
    setTimeout(function () {
      copyButton.innerText = "Copy";
      copyButton.classList.remove("copied");
    }, 5000);
  });
}
