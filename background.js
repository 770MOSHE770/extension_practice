chrome.runtime.onInstalled.addListener(async () => {
  // Triger dailyProverb every day
  chrome.alarms.create("dailyProverb", { periodInMinutes: 24 * 60 });

  // Setup the badge for first time with the custom title
  const { title } = await chrome.storage.local.get(["title"]);
  chrome.action.setBadgeText({ text: title || "ב״ה" });
});

// Listen to alarms, fetch proverb from server and save to store
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "dailyProverb") {
    fetchProverbAndSaveToStore();
  }
});

// Listen to alarms title changes, and update badge title
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local") {
    for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
      if (key === "title") {
        chrome.action.setBadgeText({ text: newValue || "ב״ה" });
      }
    }
  }
});

const fetchProverbAndSaveToStore = () => {
  const proverbsList = [
    "הפיקח עושה מיד. הטיפש - דוחה למחר",
    "איסור גמור מן התורה, לחפש חסרונות על בן ישראל חבירו",
    "תחשוב טוב יהיה טוב",
  ];

  const randomIndex = Math.floor(Math.random() * proverbsList.length);
  chrome.storage.local.set({ proverb: proverbsList[randomIndex] });
};

// Hot reload when shortcut like Ctrl+K / Ctrl+Shhift+K
chrome.commands.onCommand.addListener((shortcut) => {
  chrome.management.getSelf((self) => {
    if (self.installType === "development") {
      if (shortcut == "reload_extension") {
        chrome.runtime.reload();
      }
      if (shortcut == "reload_extension_and_current_tab") {
        refreshCurrentTab();
      }
    }
  });
});

const refreshCurrentTab = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      const currentTab = tabs[0];
      chrome.tabs.reload(currentTab.id, {}, () => chrome.runtime.reload());
    }
  });
};
