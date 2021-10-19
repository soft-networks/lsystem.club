import Markdown from "markdown-to-jsx";
import { CSSProperties, useEffect, useState } from "react";
import { LSPreview } from "../LSPreview";
import TableOfContents from "./TableOfContents";

interface MarkdownLoaderProps {
  className?: string,
  style?: CSSProperties,
  markdownFile: string
  codeStyle?: CSSProperties
}

const LSCode: React.FunctionComponent<{ code: string; iterations: string; asText: boolean; length: string }> = ({
  code,
  iterations,
  asText,
  length,
}) => {
  console.log(iterations);
  return (
    <LSPreview
      code={code}
      gfxProps={{
        iterations: parseInt(iterations) || 1,
        renderType: [asText ? "text" : "auto"],
        length: parseFloat(length) || 10,
      }}
    />
  );
};


const MarkdownLoader: React.FunctionComponent<MarkdownLoaderProps> = ({className, style, markdownFile}) => {
  const [markdownContent, setMarkdownContent] = useState<string>();
  
  useEffect(() => {
    fetch(markdownFile)
    .then((response) => response.text())
    .then((text) => {
      // Logs a string of Markdown content.
      // Now you could use e.g. <rexxars/react-markdown> to render it.
      // console.log(text);
      setMarkdownContent(text);
    });
  }, [markdownFile]);

  return (
    <>
    {markdownContent && <TableOfContents /> }
    <Markdown className={className} style={style} options={{ overrides: { LSCode: { component: LSCode }}}}>
      {markdownContent || "Loading..."}
    </Markdown>
    </>
  );
}


export default MarkdownLoader;