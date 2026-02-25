import DOMPurify from "dompurify";
import juice from "juice";

/** Configuración de sanitización para contenido de email/editor: permite tablas y estilos seguros */
const SANITIZE_CONFIG: DOMPurify.Config & {
  ADD_TAGS?: string[];
  ADD_ATTR?: string[];
} = {
  USE_PROFILES: { html: true },
  // Asegurar que tablas y celdas se conserven (algunos perfiles los omiten)
  ADD_TAGS: ["table", "thead", "tbody", "tfoot", "tr", "td", "th"],
  // Atributos típicos de tablas y maquetación de emails
  ADD_ATTR: [
    "colspan",
    "rowspan",
    "cellpadding",
    "cellspacing",
    "align",
    "valign",
    "border",
    "width",
    "height",
    "bgcolor",
  ],
};

/**
 * Sanitiza HTML para uso en el editor (pegado o guardado).
 * Conserva tablas, estilos inline y colores; elimina scripts y atributos peligrosos.
 */
export function sanitizeEditorHtml(html: string): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, SANITIZE_CONFIG);
}

export const processEmailHtml = (html: string) => {
  if (!html) return "";

  const cleanHtml = sanitizeEditorHtml(html);

  // convertir estilos CSS a inline (compatibilidad email)
  const inlinedHtml = juice(cleanHtml, {
    removeStyleTags: false,
    preserveMediaQueries: true,
  });

  // imágenes responsivas
  const fixedImages = inlinedHtml.replace(
    /<img /g,
    `<img style="max-width:100%; height:auto; display:block;" `
  );

  return fixedImages;
};