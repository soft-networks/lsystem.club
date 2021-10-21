
export default function LSTextViewer(axioms: string[] | undefined) {
  if (!axioms)  return <div>No axioms exist</div>
  let textDivs = axioms.map((val, index) => (
    <li style={{marginLeft: "1ch"}}> { val}  </li>
  ));
  return <ol style={{width: "100%", height: "100%", overflow: "scroll"}} > {textDivs} </ol>
}