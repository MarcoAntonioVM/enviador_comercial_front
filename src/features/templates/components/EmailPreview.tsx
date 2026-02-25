import { wrapEmailTemplate } from "./EmailTemplateWrapper";

interface Props {
  content: string;
}

export default function EmailPreview({ content }: Props) {
  const html = wrapEmailTemplate(content);

  return (
    <iframe
      title="email-preview"
      srcDoc={html}
      style={{
        width: "100%",
        height: "700px",
        border: "1px solid #ccc",
        background: "white",
      }}
    />
  );
}