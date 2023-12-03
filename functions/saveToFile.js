export function saveToFile(content, fileName) {
  console.log(fileName);
  if (fileName) {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;

    // Decide file extension based on the content type (you can customize this logic)
    // let extension = ".txt";
    // if (content.includes("<html") || content.includes("<!DOCTYPE html>")) {
    //   extension = ".html";
    // }

    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
