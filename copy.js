const uuidRegex = /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\b/g;

function highlightUUIDs() {
  const swaggerElements = document.querySelectorAll(".language-json *:not(script):not(style)");

  swaggerElements.forEach(element => {
    if (element.nodeType === Node.ELEMENT_NODE) {
      const text = element.textContent;
  
      if (text && uuidRegex.test(text)) {
        const replacedHTML = text.replace(uuidRegex, (match) => {
          return `<span class="uuid-highlight" data-uuid="${match}">${match}</span>`;
        });
        element.innerHTML = replacedHTML;
      }
    }
  });  
}

function copyToClipboard(text) {
  navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
    if (result.state === "granted" || result.state === "prompt") {
      navigator.clipboard.writeText(text).then(() => {
        console.log(`Copied UUID: ${text}`);
        showCopyNotification("Copied to clipboard!");
      }).catch((err) => {
        console.error('Copying error:', err);
        showCopyNotification("Error while copying text...");
      });
    } else {
      const tempTextarea = document.createElement('textarea');
      // Устанавливаем значение текста
      tempTextarea.value = text;
      // Скрываем элемент с помощью CSS (чтобы он не был виден пользователю)
      tempTextarea.style.position = 'fixed'; // Позиционирование, чтобы элемент не сдвигал страницу
      tempTextarea.style.top = '0';
      tempTextarea.style.left = '0';
      tempTextarea.style.opacity = '0';
      
      // Добавляем элемент в документ
      document.body.appendChild(tempTextarea);
      // Выделяем текст внутри элемента
      tempTextarea.select();
      // Для некоторых браузеров (например, iOS) также нужен execCommand('selectAll')
      tempTextarea.setSelectionRange(0, tempTextarea.value.length);

      try {
        // Копируем текст в буфер обмена
        document.execCommand('copy');
        console.log('Текст скопирован в буфер обмена:', text);
        showCopyNotification("Copied to clipboard!");
      } catch (err) {
        console.error('Не удалось скопировать текст:', err);
        showCopyNotification("Error while copying text...");
      }

      // Удаляем временный элемент
      document.body.removeChild(tempTextarea);
    }
  });
}

function showCopyNotification(message) {
  const notification = document.createElement("div");
  notification.className = "uuid-copy-notification";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("fade-out");
    notification.addEventListener("animationend", () => {
      notification.remove();
    });
  }, 2000);
}

function handleClick(event) {
  const target = event.target;
  if (target.classList.contains("uuid-highlight")) {
    const uuid = target.getAttribute("data-uuid");
    copyToClipboard(uuid);
  }
}

document.addEventListener("click", handleClick);

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "findUUID") {
    highlightUUIDs();
  }
});
