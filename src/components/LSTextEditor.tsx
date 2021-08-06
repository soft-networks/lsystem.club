import React from "react";
import Editor from "react-simple-code-editor";

interface CodeEditorProps {
  initialCode?: string;
  style?: React.CSSProperties
}

const tokenColors = {
  comment: "gray",
  symbol: "black",
  letterColor: (n: number) => `hsl(${n * 20 % 360},50%,50%)`
}

const LSTextEditor: React.FunctionComponent<CodeEditorProps> = ({ initialCode , style}) => {

  const [code, setCode] = React.useState<string>(initialCode || "");
  const charactersSeen = React.useRef<{ [key: string]: string}>({});

  const highlightCharacter = (character: string) => {
    let color: string = tokenColors.symbol
    if (character.match('[A-Za-z]')) {  
      console.log("Character matched", character, charactersSeen.current);
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

  const highlightLine = (line: string, lineNumber: number): React.ReactNode => {
    const lineNoWhitespace = line.replace(/\s/g, "");
    if (lineNoWhitespace[0] === "*") {
      return <span style={{ color: tokenColors.comment }}>{line}</span>;
    }
    const characters = line.split("");
    return characters.map( character => highlightCharacter(character));
  };

  const syntaxHighlightAndUpdateLS = (rawCode: string): React.ReactNode => {
    const lines = rawCode.split("\n").map((line) => line + "\n");
    return lines.map((line, i) => highlightLine(line, i));
  };

  return (
    <Editor value={code} onValueChange={(newCode) => setCode(newCode)} style={style} highlight={syntaxHighlightAndUpdateLS} padding={10}/>
  );
};

export default LSTextEditor;
