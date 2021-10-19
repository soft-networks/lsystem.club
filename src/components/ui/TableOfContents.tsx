//Adapted from https://www.emgoto.com/react-table-of-contents/

import React, { useEffect, useState } from "react"


const TableOfContents: React.FunctionComponent = () => {
  const [headings, setHeadings] = useState<Element[]>([]);
  useEffect(() => {
    const headingElements = Array.from(
      document.querySelectorAll("h2, h3")
    );
    setHeadings(headingElements);

  }, []);
  return (
    <nav aria-label="Table of contents" className="floating padded stack">
      {headings.map((el) => {
        return (
          <a href={"#" + el.id} className={el.nodeName === "H3" ? "padded:left" : ""}>
            {el.innerHTML}
          </a>
        );
      })}
    </nav>
  );
};

export default TableOfContents;