import LSystem, { ParamsValue } from "@bvk/lsystem";
import p5 from "p5";
import P5Turtle from "../LSDraw/P5Turtle";
import { CompleteLSExample } from "../utils";

let webData : CompleteLSExample = {
  lsProps: {
    axiom: "A(15)", 
    productions: ["A(a):f(a)+B(a)A(a+1)", "B(b):[-(90)ffT(b-15)]  [+(90) fff -(90) P(b-20)]"],
    iterations: 48
  },
  gfxProps: {
    angle: 5,
    length: 5,
    width: 2000,
    height: 800,
    center: [-0.18,0.2]
  }
}

export default function WebPage() {
  let ls = new LSystem(webData.lsProps.axiom, webData.lsProps.productions, webData.lsProps.iterations);
  let gfxProps = webData.gfxProps;
  return <WebTurtle LSystem={ls} GFXProps={gfxProps}/>
}


const text = ["Alt social ",
"Starry night - rhizome ",
"Run your own social ",
"Special fish",
"Petals network",
"cyberspace and as space",
"Mastodon",
"Feminist community networks ",
"Echo",
"This is Fine: Optimism & Emergency in the P2P Network",
"Distributed Web of Care",
"PeerToPeerWeb / Dat",
"Consentful Tech",
"Rediscovering the small web",
"Zonelets: ",
"Cozy web/extended internet universe",
"Small web / site.js",
"NYC mesh ",
"History of communication ",
"Black gooey universe ",
"Hand made web ",
"Hundred rabbits",
"Dark Study ",
"Tiny tools list (everest pipkin)",
"Wonderful world of weird creative tools ",
"Glyph Drawing Club",
"Programs | Emergent Works",
"Casual creation tools - a paper ",
"SQLLite story",
"Jeffrey Alan schuder",
"Picrew: Create avatars",
"coming age of calm tech - xerox parc",
"The rise of the ambient video game",
"Using the internet mindfully",
"Soft.works",
"hardlyeverything.co",
"How to grow an idea",]

const defaultText = "";


function drawText(p: p5, params: ParamsValue | undefined) {
  let index =  params && params.length == 1 ? parseInt(params[0]  as string) : -1;
  let textObj = index > -1 ? text[index] : defaultText;
  p.push();
  p.noStroke();
  p.fill(230,100,100);
  p.textSize(12);
  p.textStyle()
  p.text(textObj, 0,0);
  p.pop();
}

const t2 = ["m",
"y",
" ",
"f",
"a",
"v",
"o",
"r",
"i",
"t",
"e",
" ",
"r",
"e",
"f",
"e",
"r",
"e",
"n",
"c",
"e",
"s", ]

function drawText2(p: p5, params: ParamsValue | undefined) {
  let index =  params && params.length == 1 ? parseInt(params[0]  as string) : -1;
  let textObj = index > -1 && index < t2.length ? t2[index] : defaultText;
  p.push();
  p.noStroke();
  p.fill(0,0,0);
  p.textSize(14);
  p.textStyle()
  p.text(textObj, 0,0);
  p.pop();
}

class WebTurtle extends P5Turtle {

  animationSpeed = 1000;
  preload = (p:p5) => { 
    //p.textFont("consolas");
  }
  customRules = {
    "T": drawText,
    "P": drawText2
  }

  render() {
    return (
    <div className="full-bleed"  >
      <div ref={this.containerRef} style={{display: "inline-block", marginLeft: "50%", transform: "translate(-50%, 0)"}}/>
    </div>)
  }
}

