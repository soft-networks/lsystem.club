//Adapted from https://www.emgoto.com/react-table-of-contents/

import React, { useEffect, useState } from "react"


const TableOfContents: React.FunctionComponent = () => {
  const [headings, setHeadings] = useState<Element[]>([]);
  useEffect(() => {
    const headingElements = Array.from(
      document.querySelectorAll("h1, h2")
    );
    setHeadings(headingElements);

  }, []);
  
  return (
    <nav aria-label="Table of contents" className="floating padded stack gray">
      {headings.map((el) => {
        return (
          <a href={"#" + el.id} className={getClassName(el.nodeName)}>
            {el.innerHTML}
          </a>
        );
      })}
    </nav>
  );
};

const getClassName = (nodeName: string) => {
  if (nodeName === "H3") {
    return "padded:left:large"
  }
  if (nodeName === "H1") {
    return "bold "
  }
  return "padded:left"
}


export default TableOfContents;