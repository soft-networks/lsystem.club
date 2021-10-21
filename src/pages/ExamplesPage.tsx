import { LSPreview } from "../components/LSPreview";
import PageLayout from "../components/ui/PageLayout";
import { propsToCode } from "../lib/utils";
import examples from "../data/examples";

//staticExamples.js

const StaticExamples: React.FunctionComponent = ({}) => {
 
  function drawExamples() {
    let examplesDOM: JSX.Element[] = [];
    examples.forEach((example, index) => {
      //let lS = new LSystem(example.axiom, example.productions, example.iterations);
      let preview = (
        <p >
        <h2 id={example.name}> {example.name} </h2>
        <LSPreview
          code={example.code}
          gfxProps={example.gfxProps}
          key={"eg-" + example.name}
          name={example.name}
        />
        </p>
      );
      examplesDOM.push(preview);
    });
    return <> <h1> Examples </h1> {examplesDOM} </>;
  }
  return drawExamples();
}

export default StaticExamples

// {
//   name: "fern",
//   lsProps:{
//     axiom: "A(0,1)",
//     iterations: 12,
//     productions: ["A(d,D){d>0}: A(d-1,D)", "A(d,D){d==0}: F(1)[+(45)A(D,D)][-(45)A(D,D)]F(1)A(0,D)", "F(a):  F(a*1.48)"],
//   },
//   gfxProps: {length: 2, center: [0,0.4]}
// },

