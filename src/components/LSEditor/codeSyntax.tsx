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

export const syntaxHighlight = (rawCode: string, wrapLines?: boolean, lineClassNames?: string[]): React.ReactNode => {
  const lines = splitLines(rawCode);  
  console.log(lineClassNames)
  const highlightedLines = lines.map((line, i) =>
    highlightLine(line, i, lineClassNames ? lineClassNames[i] : undefined)
  );
  if (!wrapLines) {
    return highlightedLines;
  }
  return highlightedLines.map((hLine, index) => <p key={"p" + index}> {hLine} </p>)
};

function highlightLine(line: string, lineNumber: number, lineClassName?: string): React.ReactNode {
  let lineDOM; 
  if (lineIsComment(line)) {
    lineDOM = (
      <span key={"l" + lineNumber} style={{ color: tokenColors.comment }}>
        {line}
      </span>
    );
  } else {
    const characters = line.split("");
    const characterDOM = [];

    for (var i =0; i <characters.length;) {
      if (i + 2 < characters.length && checkIsPhrase(characters[i], characters[i+1], characters[i+2])) {
        characterDOM.push(higlightCharAsPhrase(characters[i], lineNumber + ":" + i));
        characterDOM.push(higlightCharAsPhrase(characters[i+1], lineNumber + ":" + i+1));
        characterDOM.push(higlightCharAsPhrase(characters[i+2], lineNumber + ":" + i+2)); 
        i = i + 3;
      } else {
        characterDOM.push(highlightCharacter(characters[i], lineNumber + ":" + i));
        i = i + 1;
      }
    } 
    lineDOM = (
      <span>
        {characterDOM}
       </span>
    )
  }
  
  return (
    <span  className={lineClassName || ""}>
      <span className="line-number no-select"> {lineNumber} </span>
      {lineDOM}
    </span>
  );
};


function checkIsPhrase(c1: string, c2: string, c3: string) {
  let s = c1 + c2 + c3;
  if (s === "rnd" || s === "max" || s === "min") {
    return true;
  }
  else {
    return false;
  }
}
function higlightCharAsPhrase(c: string, keyString: String){
  let color : string = tokenColors.symbol;
  return <span key={"token" + keyString} style={{color: color}}>{c}</span>
}
function highlightCharacter(character: string, keyString: string) {
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
  return <span key={"token" + keyString} style={{color: color}}>{character}</span>
}