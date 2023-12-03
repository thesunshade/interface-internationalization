export default function createButton(options) {
  const { targetElement, targetVariable, fileName, buttonText, buttonSuccessText, onClick = () => {} } = options;
  console.log("create button");
  const copyButton = document.createElement("button");
  copyButton.id = "copyButton";
  copyButton.innerHTML = buttonText;

  // Append button to the target element
  targetElement.insertBefore(copyButton, targetElement.firstChild);

  // Add click event listener to the copy button
  copyButton.addEventListener("click", function () {
    // Change button text to success text
    copyButton.innerText = buttonSuccessText;

    // Toggle class for transition effect
    copyButton.classList.add("clicked");

    // Execute the callback function
    onClick(targetVariable, fileName);

    // Reset button text after 5 seconds
    setTimeout(function () {
      copyButton.innerHTML = buttonText;
      copyButton.classList.remove("clicked");
    }, 5000);
  });
}
