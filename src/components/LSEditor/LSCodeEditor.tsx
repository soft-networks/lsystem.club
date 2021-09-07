import React from "react";
import Editor from "react-simple-code-editor";
import { useEffect } from "react";
import { lineIsComment, splitLines, tokenColors } from "./codeSyntax";

interface CodeEditorProps {
  initialCode?: string;
  style?: React.CSSProperties
  className?: string,
  onCodeWasEdited: (code: string) => void
}


const LSCodeEditor: React.FunctionComponent<CodeEditorProps> = ({ initialCode , style, onCodeWasEdited, className}) => {

  const [code, setCode] = React.useState<string>(initialCode || "");
  const charactersSeen = React.useRef<{ [key: string]: string}>({});

  const highlightCharacter = (character: string) => {
    let color: string = tokenColors.symbol
    if (character.match('[A-Za-z]')) {  
      if (charactersSeen.current[character]) {
       color = charactersSeen.current[character]
      } else {
        let newColor = tokenColors.letterColor( Object.keys(charactersSeen.current).length);
        let colorTable = charactersSeen.current;
        colorTable[character] = newColor;
        charactersSeen.current = colorTable;
        color = newColor;
      }
    }
    return <span style={{color: color}}>{character}</span>
  }

  //TODO: Move this up into LSEditor, because its running too often right now :)
  useEffect(() => {
    onCodeWasEdited(code);
  }, [onCodeWasEdited, code]);

  const highlightLine = (line: string, lineNumber: number): React.ReactNode => {
    if (lineIsComment(line)) {
      return <span style={{ color: tokenColors.comment }}>{line}</span>;
    }
    const characters = line.split("");
    return characters.map( character => highlightCharacter(character));
  };

  const syntaxHighlightAndUpdateLS = (rawCode: string): React.ReactNode => {
    const lines = splitLines(rawCode);  
    return lines.map((line, i) => highlightLine(line, i));
  };


  return (
    <Editor
      value={code}
      onValueChange={(newCode) => setCode(newCode)}
      style={style}
      highlight={syntaxHighlightAndUpdateLS}
      padding={10}
      className={className}
    />
  );
};

export default LSCodeEditor;
