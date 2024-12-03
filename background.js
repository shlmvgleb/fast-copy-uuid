// Создание нового пункта в контекстном меню
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
      id: "find-uuid-menu",
      title: "Find UUIDs", // Название пункта
      contexts: ["all"] // Пункт будет виден везде (текст, ссылки, страницы)
  });
});

// Обработка нажатия на пункт меню
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "find-uuid-menu") {
      chrome.tabs.sendMessage(tab.id, { action: "findUUID" });
  }
});
