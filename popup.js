const titleElement = document.getElementById("title");
titleElement.addEventListener("input", saveTitleToStorage);

function saveTitleToStorage(event) {
  chrome.storage.local.set({ title: event.target.value });
}
