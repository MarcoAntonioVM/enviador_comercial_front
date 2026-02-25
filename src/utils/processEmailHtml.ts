import DOMPurify from "dompurify";
import juice from "juice";

export const processEmailHtml = (html: string) => {
  if (!html) return "";

  // limpiar HTML
  const cleanHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true }
  });

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