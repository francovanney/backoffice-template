import { Controller, type Control } from "react-hook-form";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { useEffect, useState, useRef } from "react";

type Props = {
  control: Control<any>;
  name: string;
  placeholder?: string;
  className?: string;
};

export default function EditorField({
  control,
  name,
  placeholder,
  className,
}: Props) {
  return (
    <div className={className}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <TiptapInstance
            value={field.value}
            onChange={field.onChange}
            placeholder={placeholder}
          />
        )}
      />
    </div>
  );
}

function TiptapInstance({
  value,
  onChange,
  placeholder,
}: {
  value?: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  // normaliza el HTML que guarda (como en "como_llegar")
  const normalizeHtml = (html = "") =>
    html
      .replace(/<p>\s*<\/p>/gi, "<p><br></p>")
      .replace(/(?:<br\s*\/?>\s*){2,}/gi, "</p><p><br></p><p>");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
      }),
      Underline,
      Link.configure({
        autolink: true,
        openOnClick: false,        // no navegar dentro del editor
        linkOnPaste: true,
        protocols: ["http", "https", "mailto", "tel"],
        HTMLAttributes: {
          class: "text-blue-600 hover:underline",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Escribí acá...",
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "min-h-[220px] bg-white border rounded-lg p-3 focus:outline-none prose max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      const raw = editor.getHTML();
      const html = normalizeHtml(raw);
      onChange(html);
    },
  });

  // sincroniza value externo (reset) con la misma normalización
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const incoming = normalizeHtml(value || "");
    if (incoming !== current) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
  }, [value, editor]);

  // ---- UI Link ----
  const [showLink, setShowLink] = useState(false);
  const [url, setUrl] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (showLink) inputRef.current?.focus();
  }, [showLink]);

  const normalizeHref = (u: string) => {
    const t = u.trim();
    if (!t) return "";
    return /^https?:\/\//i.test(t) ? t : `https://${t}`;
  };

  const addLink = () => {
    if (!editor) return;
    const href = normalizeHref(url);
    if (!href) return;

    const { empty } = editor.state.selection;

    if (empty) {
      // si no hay selección, insertamos el propio texto del link
      editor
        .chain()
        .focus()
        .insertContent(
          `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${href}</a>`
        )
        .run();
    } else {
      // si hay selección, envolvemos el texto seleccionado
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href })
        .run();
    }

    setUrl("");
    setShowLink(false);
  };

  if (!editor) {
    return (
      <div className="min-h-[220px] bg-white border rounded-lg p-3">
        Cargando editor…
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      {/* Toolbar mínima + Link */}
      <div className="flex flex-wrap items-center gap-2 p-2 border-b">
        <Btn editor={editor} cmd="toggleBold" active={editor.isActive("bold")}>
          B
        </Btn>
        <Btn
          editor={editor}
          cmd="toggleItalic"
          active={editor.isActive("italic")}
        >
          <i>I</i>
        </Btn>
        <Btn
          editor={editor}
          cmd="toggleUnderline"
          active={editor.isActive("underline")}
        >
          <u>U</u>
        </Btn>

        {/* Botón Link */}
        <button
          type="button"
          onClick={() => setShowLink((s) => !s)}
          className={`text-sm px-2 py-1 rounded border ${
            editor.isActive("link") ? "bg-gray-200" : "bg-white"
          } hover:bg-gray-100`}
        >
          Link
        </button>

        {/* Inline input para el link */}
        {showLink && (
          <div className="flex items-center gap-2 w-full sm:w-auto ml-0 sm:ml-2 mt-2 sm:mt-0">
            <input
              ref={inputRef}
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://ejemplo.com"
              className="border rounded px-2 py-1 text-sm flex-1 min-w-[220px]"
            />
            <button
              type="button"
              onClick={addLink}
              className="text-sm px-2 py-1 rounded border bg-white hover:bg-gray-100"
            >
              Agregar
            </button>
          </div>
        )}
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

function Btn({
  editor,
  cmd,
  active,
  children,
}: {
  editor: any;
  cmd: "toggleBold" | "toggleItalic" | "toggleUnderline";
  active?: boolean;
  children: React.ReactNode;
}) {
  const run = () => editor.chain().focus()[cmd]().run();
  return (
    <button
      type="button"
      onClick={run}
      className={`text-sm px-2 py-1 rounded border ${
        active ? "bg-gray-200" : "bg-white"
      } hover:bg-gray-100`}
    >
      {children}
    </button>
  );
}
