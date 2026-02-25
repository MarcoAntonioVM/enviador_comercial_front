import { useRef, useState } from "react";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";
import EmailPreview from "./EmailPreview";
import { processEmailHtml, sanitizeEditorHtml } from "@/utils/processEmailHtml";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

// Ejecuta un comando execCommand sobre el doc del iframe
function exec(iframe: HTMLIFrameElement | null, cmd: string, arg?: string) {
  const doc = iframe?.contentDocument;
  if (!doc) return;
  iframe?.contentWindow?.focus();
  doc.execCommand(cmd, false, arg);
}

type BtnProps = {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  active?: boolean;
};

function Btn({ onClick, title, children, active }: BtnProps) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`px-2 py-1 rounded text-sm border transition-colors ${
        active
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white dark:bg-gray-700 text-slate-700 dark:text-gray-200 border-slate-200 dark:border-gray-600 hover:bg-slate-100 dark:hover:bg-gray-600"
      }`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span className="w-px h-6 bg-slate-200 dark:bg-gray-600 self-center mx-1" />;
}

export default function TemplatePreviewField({ value, onChange }: Props) {
  // tab principal: editar | vista previa
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  // sub-tab dentro de "editar": tinymce | wysiwyg
  const [editMode, setEditMode] = useState<"tinymce" | "wysiwyg">("tinymce");

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [wysiwygDraft, setWysiwygDraft] = useState("");

  // Al cambiar al sub-tab wysiwyg, snapshoteamos el valor actual como draft
  const switchToWysiwyg = () => {
    setWysiwygDraft(processEmailHtml(value || ""));
    setEditMode("wysiwyg");
  };

  const handleWysiwygSave = () => {
    const doc = iframeRef.current?.contentDocument;
    if (doc) onChange(processEmailHtml(doc.body.innerHTML || ""));
    setEditMode("tinymce");
  };

  return (
    <div>
      {/* ── Tabs principales ── */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setTab("edit")}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
            tab === "edit"
              ? "bg-primary text-white border-primary"
              : "bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 border-slate-200 dark:border-gray-600 hover:border-slate-300 dark:hover:border-gray-500"
          }`}
        >
          <i className="pi pi-pencil mr-1.5 text-xs" />
          Editar contenido
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
            tab === "preview"
              ? "bg-primary text-white border-primary"
              : "bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 border-slate-200 dark:border-gray-600 hover:border-slate-300 dark:hover:border-gray-500"
          }`}
        >
          <i className="pi pi-eye mr-1.5 text-xs" />
          Vista previa
        </button>
      </div>

      {/* ── Vista previa ── */}
      {tab === "preview" && <EmailPreview content={value} />}

      {/* ── Editar contenido ── */}
      {tab === "edit" && (
        <div className="border border-slate-200 dark:border-gray-600 rounded-xl overflow-hidden">

          {/* Sub-tabs: Editor de texto | WYSIWYG */}
          <div className="flex items-center gap-0 border-b border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-800">
            <button
              type="button"
              onClick={() => setEditMode("tinymce")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                editMode === "tinymce"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200"
              }`}
            >
              <i className="pi pi-file-edit mr-1.5 text-xs" />
              Editor de texto
            </button>
            <button
              type="button"
              onClick={switchToWysiwyg}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                editMode === "wysiwyg"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200"
              }`}
            >
              <i className="pi pi-objects-column mr-1.5 text-xs" />
              WYSIWYG
            </button>
          </div>

          {/* Editor de texto (TinyMCE) */}
          {editMode === "tinymce" && (
            <div className="p-2">
              <RichTextEditor value={value} onChange={onChange} />
            </div>
          )}

          {/* Editor WYSIWYG (iframe editable) */}
          {editMode === "wysiwyg" && (
            <div>
              {/* Toolbar WYSIWYG */}
              <div className="flex flex-wrap items-center gap-1 px-2 py-2 bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-700">
                {/* Historial */}
                <Btn onClick={() => exec(iframeRef.current, "undo")} title="Deshacer"><i className="pi pi-undo text-xs" /></Btn>
                <Btn onClick={() => exec(iframeRef.current, "redo")} title="Rehacer"><i className="pi pi-refresh text-xs" /></Btn>
                <Sep />

                {/* Formato */}
                <Btn onClick={() => exec(iframeRef.current, "bold")}          title="Negrita"><b>B</b></Btn>
                <Btn onClick={() => exec(iframeRef.current, "italic")}        title="Cursiva"><i>I</i></Btn>
                <Btn onClick={() => exec(iframeRef.current, "underline")}     title="Subrayado"><u>U</u></Btn>
                <Btn onClick={() => exec(iframeRef.current, "strikeThrough")} title="Tachado"><s>S</s></Btn>
                <Sep />

                {/* Tamaño */}
                <select
                  title="Tamaño de fuente"
                  className="text-sm border border-slate-200 dark:border-gray-600 rounded px-1 py-0.5 bg-white dark:bg-gray-700 text-slate-700 dark:text-gray-200"
                  defaultValue=""
                  onChange={(ev) => { exec(iframeRef.current, "fontSize", ev.target.value); ev.target.value = ""; }}
                >
                  <option value="" disabled>Tamaño</option>
                  {["1","2","3","4","5","6","7"].map((s) => (
                    <option key={s} value={s}>{["8","10","12","14","18","24","36"][+s-1]}px</option>
                  ))}
                </select>

                {/* Color texto */}
                <label title="Color de texto" className="flex items-center gap-0.5 cursor-pointer">
                  <i className="pi pi-palette text-xs text-slate-500" />
                  <input type="color" className="w-6 h-6 rounded border-0 cursor-pointer" onChange={(ev) => exec(iframeRef.current, "foreColor", ev.target.value)} />
                </label>
                {/* Color fondo */}
                <label title="Color de fondo" className="flex items-center gap-0.5 cursor-pointer">
                  <i className="pi pi-stop text-xs text-slate-400" />
                  <input type="color" className="w-6 h-6 rounded border-0 cursor-pointer" onChange={(ev) => exec(iframeRef.current, "hiliteColor", ev.target.value)} />
                </label>
                <Sep />

                {/* Alineación */}
                <Btn onClick={() => exec(iframeRef.current, "justifyLeft")}   title="Izquierda"><i className="pi pi-align-left text-xs" /></Btn>
                <Btn onClick={() => exec(iframeRef.current, "justifyCenter")} title="Centrar"><i className="pi pi-align-center text-xs" /></Btn>
                <Btn onClick={() => exec(iframeRef.current, "justifyRight")}  title="Derecha"><i className="pi pi-align-right text-xs" /></Btn>
                <Btn onClick={() => exec(iframeRef.current, "justifyFull")}   title="Justificar"><i className="pi pi-align-justify text-xs" /></Btn>
                <Sep />

                {/* Listas */}
                <Btn onClick={() => exec(iframeRef.current, "insertUnorderedList")} title="Lista viñetas"><i className="pi pi-list text-xs" /></Btn>
                <Btn onClick={() => exec(iframeRef.current, "insertOrderedList")}   title="Lista numerada"><i className="pi pi-sort-numeric-down text-xs" /></Btn>
                <Sep />

                {/* Enlace */}
                <Btn onClick={() => { const u = window.prompt("URL:", "https://"); if (u) exec(iframeRef.current, "createLink", u); }} title="Insertar enlace">
                  <i className="pi pi-link text-xs" />
                </Btn>
                <Btn onClick={() => exec(iframeRef.current, "unlink")} title="Quitar enlace"><i className="pi pi-times text-xs" /></Btn>
                <Sep />

                {/* Guardar */}
                <button
                  type="button"
                  onClick={handleWysiwygSave}
                  className="ml-auto px-3 py-1 rounded-lg bg-primary text-white text-sm font-medium"
                >
                  <i className="pi pi-check mr-1 text-xs" />Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode("tinymce")}
                  className="px-3 py-1 rounded-lg border border-slate-300 dark:border-gray-500 text-slate-600 dark:text-gray-300 text-sm"
                >
                  Cancelar
                </button>
              </div>

              {/* iframe editable */}
              <iframe
                ref={iframeRef}
                title="editor-wysiwyg"
                srcDoc={wysiwygDraft}
                style={{ width: "100%", height: 520, border: 0, display: "block", background: "white" }}
                onLoad={() => {
                  try {
                    const doc = iframeRef.current?.contentDocument;
                    if (!doc) return;
                    doc.designMode = "on";
                    doc.addEventListener("paste", (e: ClipboardEvent) => {
                      e.preventDefault();
                      const html = e.clipboardData?.getData("text/html");
                      if (html) {
                        doc.execCommand("insertHTML", false, sanitizeEditorHtml(html));
                      } else {
                        const text = e.clipboardData?.getData("text/plain") ?? "";
                        doc.execCommand("insertText", false, text);
                      }
                    });
                  } catch (_) {}
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
