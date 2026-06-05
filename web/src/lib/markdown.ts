import DOMPurify from "dompurify";
import { marked } from "marked";

// GFM — модель шлёт списки/таблицы; breaks — одиночный \n это перенос строки.
marked.setOptions({ gfm: true, breaks: true });

// Внешние ссылки уводят из чата — открываем в новой вкладке.
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A") {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");
  }
});

/** Markdown → безопасный HTML для чата. Вывод модели никогда не идёт в {@html} напрямую. */
export function renderMarkdown(src: string): string {
  return DOMPurify.sanitize(marked.parse(src, { async: false }) as string);
}
