import { sanitizeEditorHtml } from "@/utils/processEmailHtml";
import "./RichTextEditor.css";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

/**
 * Editor de texto enriquecido básico (contentEditable).
 * Se usa en el sistema de entidades genérico (FieldRenderer, type="richtext").
 * Para edición avanzada de plantillas de email, ver TemplatePreviewField.
 * Al pegar, conserva HTML (tablas, colores) tras sanitización.
 */
export default function RichTextEditor({ value, onChange }: Props) {
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    if (html) {
      const clean = sanitizeEditorHtml(html);
      document.execCommand("insertHTML", false, clean);
    } else {
      const text = e.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
    }
  };

  return (
    <div
      contentEditable
      suppressContentEditableWarning
      className="rich-editor-content min-h-[200px] p-3 rounded-lg border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: value }}
      onBlur={(e) => onChange(e.currentTarget.innerHTML)}
      onPaste={handlePaste}
    />
  );
}
