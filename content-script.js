let currentTitle;
let currentProverb;

// Setup the title for first time with the custom title
window.onload = async function () {
  const { title } = await chrome.storage.local.get(["title"]);
  currentTitle = title;
  const { proverb } = await chrome.storage.local.get(["proverb"]);
  currentProverb = proverb;

  const titleElement = document.createElement("div");
  titleElement.id = "title_element";
  titleElement.textContent = `${title || "ב״ה"} | ${proverb || ""}`;
  titleElement.classList.add("title");
  document.body.appendChild(titleElement);
};

// Listen to store cahnges and update the tiitle on each page
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local") {
    for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
      if (key === "title") {
        currentTitle = newValue;
        updateTitle();
      } else if (key === "proverb") {
        currentProverb = newValue;
        updateTitle();
      }
    }
  }
});

const updateTitle = () => {
  const titleElement = document.getElementById("title_element");
  titleElement.textContent = `${currentTitle || "ב״ה"} | ${
    currentProverb || ""
  }`;
};
