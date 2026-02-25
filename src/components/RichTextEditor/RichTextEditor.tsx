interface Props {
  value: string;
  onChange: (val: string) => void;
}

/**
 * Editor de texto enriquecido básico (contentEditable).
 * Se usa en el sistema de entidades genérico (FieldRenderer, type="richtext").
 * Para edición avanzada de plantillas de email, ver TemplatePreviewField.
 */
export default function RichTextEditor({ value, onChange }: Props) {
  return (
    <div
      contentEditable
      suppressContentEditableWarning
      className="min-h-[200px] p-3 rounded-lg border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: value }}
      onBlur={(e) => onChange(e.currentTarget.innerHTML)}
    />
  );
}
