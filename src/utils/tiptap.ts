interface TiptapContent {
  text?: string;
}

interface TiptapBlock {
  type?: string;
  content?: TiptapContent[];
  children?: unknown[];
  text?: string;
}

/**
 * Extracts plain text from a Tiptap JSON string representation.
 */
export function extractTextFromTiptap(jsonStr?: string): string {
  if (!jsonStr) return "";
  const trimmed = jsonStr.trim();
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      const obj = JSON.parse(trimmed);
      if (obj.type === "doc" && Array.isArray(obj.content)) {
        return obj.content
          .map((block: TiptapBlock) => {
            if (block.content && Array.isArray(block.content)) {
              return block.content.map((inline: TiptapContent) => inline.text || "").join("");
            }
            return "";
          })
          .filter((text: string) => text.trim().length > 0)
          .join("\n");
      }
      return extractText(obj);
    } catch {
      return jsonStr;
    }
  }
  return jsonStr;
}

/**
 * Helper to recursively extract text from any parsed JSON content block.
 */
export function extractText(obj: unknown): string {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  if (Array.isArray(obj)) {
    return obj.map(extractText).filter(Boolean).join("\n\n");
  }
  if (typeof obj === "object") {
    const record = obj as Record<string, unknown>;
    if (typeof record.text === "string") return record.text;
    if (record.content) return extractText(record.content);
    if (record.children) return extractText(record.children);
  }
  return "";
}

/**
 * Validates and formats rich text from content string.
 */
export function formatRichText(text: string | undefined): string {
  if (!text) return "";
  const trimmed = text.trim();
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      const obj = JSON.parse(trimmed);
      return extractText(obj);
    } catch {
      return text;
    }
  }
  return text;
}
