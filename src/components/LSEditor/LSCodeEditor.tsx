import React, { useCallback } from "react";
import Editor from "react-simple-code-editor";
import { useEffect } from "react";
import {syntaxHighlight} from "./codeSyntax"
import { LSError } from "../utils";

interface CodeEditorProps {
  initialCode?: string;
  style?: React.CSSProperties
  className?: string,
  onCodeWasEdited: (code: string) => void,
  errorList?: LSError[],
  tabIndex?: number
}


const LSCodeEditor: React.FunctionComponent<CodeEditorProps> = ({ initialCode , style, onCodeWasEdited, className, errorList, tabIndex}) => {

  const [code, setCode] = React.useState<string>(initialCode || "");


  //TODO: Move this up into LSEditor, because its running too often right now :)
  useEffect(() => {
    onCodeWasEdited(code);
  }, [onCodeWasEdited, code]);

  const decorateCode = useCallback((code: string) => {
    let classNameList: string[] = [];
    if (errorList) {
      errorList.forEach(err => {
        if (err.lineNum !== "global")
          classNameList[err.lineNum] = "display-as-error"
      })
    }
    return syntaxHighlight(code, false, classNameList);
  }, [errorList])

  return (
    <Editor
      value={code}
      onValueChange={(newCode) => setCode(newCode)}
      style={style}
      highlight={decorateCode}
      padding={10}
      className={className}       
      tabIndex={tabIndex}
      autoFocus
    />
  );
};

export default LSCodeEditor;
