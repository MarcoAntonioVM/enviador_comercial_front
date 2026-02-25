import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo2,
  Redo2,
} from "lucide-react";
import { cn } from "../../utils/cn";
import "./RichTextEditor.css";

interface RichTextEditorProps {
  /** Contenido HTML actual del editor */
  value?: string;
  /** Callback al cambiar el contenido, devuelve HTML */
  onChange?: (html: string) => void;
  /** Texto de placeholder cuando el editor está vacío */
  placeholder?: string;
  /** Deshabilita la edición */
  disabled?: boolean;
  /** Clases adicionales para el contenedor */
  className?: string;
  /** Altura mínima del área de edición (default: 160px) */
  minHeight?: number;
}

type ToolbarButtonProps = {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
};

function ToolbarButton({
  onClick,
  active = false,
  disabled = false,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "p-1.5 rounded transition-colors",
        "hover:bg-surface-200 disabled:opacity-40 disabled:cursor-not-allowed",
        active && "bg-primary text-white hover:bg-primary"
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="w-px h-5 bg-surface-300 mx-1 self-center" />;
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Escribe aquí...",
  disabled = false,
  className,
  minHeight = 160,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
    ],
    content: value,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "rich-editor-content outline-none",
        style: `min-height:${minHeight}px`,
        "data-placeholder": placeholder,
      },
    },
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });

  // Sincroniza valor externo (ej. reset de formulario)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  // Sincroniza estado disabled
  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [disabled, editor]);

  if (!editor) return null;

  const iconSize = 15;

  return (
    <div
      className={cn(
        "border border-surface-300 rounded-lg overflow-hidden",
        "focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary",
        disabled && "opacity-60 pointer-events-none bg-surface-100",
        className
      )}
    >
      {/* ── Barra de herramientas ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-surface-300 bg-surface-50">
        {/* Formato de texto */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Negrita (Ctrl+B)"
        >
          <Bold size={iconSize} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Cursiva (Ctrl+I)"
        >
          <Italic size={iconSize} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Tachado"
        >
          <Strikethrough size={iconSize} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Código en línea"
        >
          <Code size={iconSize} />
        </ToolbarButton>

        <Divider />

        {/* Encabezados */}
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="Encabezado 2"
        >
          <Heading2 size={iconSize} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          title="Encabezado 3"
        >
          <Heading3 size={iconSize} />
        </ToolbarButton>

        <Divider />

        {/* Listas */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Lista con viñetas"
        >
          <List size={iconSize} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Lista numerada"
        >
          <ListOrdered size={iconSize} />
        </ToolbarButton>

        <Divider />

        {/* Bloques */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Cita"
        >
          <Quote size={iconSize} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Línea horizontal"
        >
          <Minus size={iconSize} />
        </ToolbarButton>

        <Divider />

        {/* Historial */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Deshacer (Ctrl+Z)"
        >
          <Undo2 size={iconSize} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Rehacer (Ctrl+Y)"
        >
          <Redo2 size={iconSize} />
        </ToolbarButton>
      </div>

      {/* ── Área de edición ── */}
      <EditorContent editor={editor} className="px-3 py-2" />
    </div>
  );
}
