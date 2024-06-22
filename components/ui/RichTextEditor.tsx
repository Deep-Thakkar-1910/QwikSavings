"use client";
import { useEditor, EditorContent, type Editor, Content } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Strikethrough,
  UnderlineIcon,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  SuperscriptIcon,
  SubscriptIcon,
  Undo,
  Redo,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import {
  TextAlignCenterIcon,
  TextAlignJustifyIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from "@radix-ui/react-icons";
import { useEffect } from "react";

const RichTextEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          "min-h-[150px] max-h-[150px] w-full rounded-md rounded-br-none rounded-bl-none border border-input bg-transparent px-3 py-2  text-sm ring-offset-background outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 overflow-auto",
      },
    },
    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-4",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-4",
          },
        },
      }),
      Heading.configure({
        levels: [1, 2],
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
      Underline,
      Superscript,
      Subscript,
    ],
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // Call the onChange callback with the updated HTML content
    },
  });

  // for setting inital value from props
  useEffect(() => {
    if (editor) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  return (
    <>
      {editor ? <RichTextEditorToolbar editor={editor} /> : null}
      <EditorContent
        content={value}
        editor={editor}
        className="border-primary caret-red-600 focus-within:rounded-md focus-within:border dark:caret-app-main"
      />
    </>
  );
};

const RichTextEditorToolbar = ({ editor }: { editor: Editor }) => {
  const iconClass = "size-4";
  return (
    <div className="mb-1 flex w-full flex-row flex-wrap items-center justify-start gap-1 rounded-bl-md rounded-br-md border border-input bg-transparent p-1">
      <div className="flex w-full max-w-sm flex-row flex-wrap items-center justify-start gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className={iconClass} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className={iconClass} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className={iconClass} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className={iconClass} />
        </Toggle>
        <Separator
          orientation="vertical"
          className="mx-1 h-8 w-px dark:bg-neutral-600"
        />
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 1 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 className={iconClass} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className={iconClass} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("superscript")}
          onPressedChange={() =>
            editor.chain().focus().toggleSuperscript().run()
          }
        >
          <SuperscriptIcon className={iconClass} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("subscript")}
          onPressedChange={() => editor.chain().focus().toggleSubscript().run()}
        >
          <SubscriptIcon className={iconClass} />
        </Toggle>
        <Separator
          orientation="vertical"
          className="mx-1 h-8 w-px dark:bg-neutral-600"
        />
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          <List className={iconClass} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          <ListOrdered className={iconClass} />
        </Toggle>
        <Separator
          orientation="vertical"
          className="h-8 w-px dark:bg-neutral-600"
        />

        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "left" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("left").run()
          }
        >
          <TextAlignLeftIcon className={iconClass} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "center" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("center").run()
          }
        >
          <TextAlignCenterIcon className={iconClass} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "right" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("right").run()
          }
        >
          <TextAlignRightIcon className={iconClass} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "justify" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("justify").run()
          }
        >
          <TextAlignJustifyIcon className={iconClass} />
        </Toggle>

        <Separator
          orientation="vertical"
          className="mx-1 h-8 w-px dark:bg-neutral-600"
        />
        <Toggle
          size="sm"
          pressed={editor.isActive("undo")}
          onPressedChange={() => editor.chain().focus().undo().run()}
        >
          <Undo className={iconClass} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("redo")}
          onPressedChange={() => editor.chain().focus().redo().run()}
        >
          <Redo className={iconClass} />
        </Toggle>
      </div>
    </div>
  );
};

export default RichTextEditor;
