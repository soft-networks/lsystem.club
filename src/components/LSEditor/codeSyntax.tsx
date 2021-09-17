import React from 'react';

let charactersSeen: {[key:string]: string} = {};


export const tokenColors = {
  comment: "gray",
  symbol: "black",
  letterColor: (n: number) => `hsl(${n * 20 % 360},50%,50%)`
}

export const splitLines = ( rawCode: string) => {
  if (! rawCode) { console.error("Somehow tried instatintiang with null code"); return [""]}
  return rawCode.split("\n").map((line) => line + "\n");
}

export const lineIsComment = (line: string) => {
  const lineNoWhitespace = line.replace(/\s/g, "");
  return lineNoWhitespace[0] === "*"
}

export const syntaxHighlight = (rawCode: string): React.ReactNode => {
  const lines = splitLines(rawCode);  
  return lines.map((line, i) => highlightLine(line, i));
};

function highlightLine(line: string, lineNumber: number): React.ReactNode {
  if (lineIsComment(line)) {
    return <span style={{ color: tokenColors.comment }}>{line}</span>;
  }
  const characters = line.split("");
  return characters.map( character => highlightCharacter(character));
};



function highlightCharacter(character: string) {
  let color: string = tokenColors.symbol
  if (character.match('[A-Za-z]')) {  
    if (charactersSeen[character]) {
     color = charactersSeen[character]
    } else {
      let newColor = tokenColors.letterColor( Object.keys(charactersSeen).length);
      let colorTable = charactersSeen;
      colorTable[character] = newColor;
      charactersSeen = colorTable;
      color = newColor;
    }
  }
  return <span style={{color: color}}>{character}</span>
}