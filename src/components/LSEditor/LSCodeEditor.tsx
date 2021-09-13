import React from "react";
import Editor from "react-simple-code-editor";
import { useEffect } from "react";
import {syntaxHighlight} from "./codeSyntax"

interface CodeEditorProps {
  initialCode?: string;
  style?: React.CSSProperties
  className?: string,
  onCodeWasEdited: (code: string) => void,
}


const LSCodeEditor: React.FunctionComponent<CodeEditorProps> = ({ initialCode , style, onCodeWasEdited, className}) => {

  const [code, setCode] = React.useState<string>(initialCode || "");



  //TODO: Move this up into LSEditor, because its running too often right now :)
  useEffect(() => {
    onCodeWasEdited(code);
  }, [onCodeWasEdited, code]);

  const decorateCode = (code: string) => {
    return syntaxHighlight(code);
  }

  return (
    <Editor
      value={code}
      onValueChange={(newCode) => setCode(newCode)}
      style={style}
      highlight={decorateCode}
      padding={10}
      className={className}
    />
  );
};

export default LSCodeEditor;
