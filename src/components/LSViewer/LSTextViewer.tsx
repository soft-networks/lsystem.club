import LSystem from '@bvk/lsystem'

export default function LSTextViewer(LSystem: LSystem | undefined) {
  if (!LSystem) return "LSystem doesnt exist"
  let text = LSystem.getAllIterationsAsString();
  let textDivs = text.map((val, index) => (
    <li>  {val}  </li>
  ));
  return <ol style={{width: "100%", height: "100%", overflow: "scroll"}}> {textDivs} </ol>
}