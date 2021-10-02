import { CompleteLSExample } from "../components/utils";

const examples: CompleteLSExample[] = [
  {
    name: "Text example",
    lsProps: { axiom: "F", productions: ["F:BF", "B:F"], iterations: 9 },
    gfxProps: { renderType: ["text"] },
  },
  {
    name: "Spiral",
    lsProps: { axiom: "A", productions: ["A:FB + A", "B:[-(90)FF]"], iterations: 72 },
    gfxProps: { angle: 5, center: [-0.1, 0] },
  },
  {
    name: "Koch Curve",
    lsProps: { axiom: "+(90) [F]", productions: ["F:F+F--F+F"], iterations: 5 },
    gfxProps: { angle: 60, length: 1, center: [-0.4, -0.1] },
  },
  {
    name: "Beautiful octopus",
    lsProps: {
      axiom: "A(10,50)",
      iterations: 50,
      productions: [
        "A(a,w){w>0}: F #(w) !(w) +(a) C(w) A(a,w-0.5)",
        "B(b): #(b) F B(b+1)",
        "C(w): [!(w/2) -B(w)]",
        "A(a,w){w<0}:X",
      ],
    },
  },
  {
    name: "Simple tree",
    lsProps: {
      axiom: `A(10)`,
      productions: ["A(x):F[+(x)FA(0.9*x)][-(x)FA(0.9*x)]"],
      iterations: 7,
    },
    gfxProps: { angle: 22.5, length: 25, center: [0, 0.4] },
  },
  {
    name: "prospect lawn",
    lsProps: {
      axiom: "A(25)",
      productions: [
        "A(x):!(1.5)F(4.1)Y(x)[+(x)E(4.1)A(0.9*x)][-(x)E(4.1)A(0.9*x)]",
        "F(x):#(10) F(x*1.55)",
        "!(x){x>=1.5}:!(x*1.44)",
        "E(x):{5} #(rnd(0,300)) F(x)",
        "E(x):{1} #(250) E(x)",
        "Y(x): [-(rnd(-45,45)) A(x)]",
      ],
      iterations: 8,
    },
    gfxProps: { center: [0, 0.48], length: 1 },
  },
  {
    name: "wildflowers",
    lsProps: {
        axiom: "P",
        productions: ["P: +(90) f(100) -(90) [A(rnd(0,10))]", "A(a): FFF I(40) +(rnd(0-a,a))  A(a+1) [ #(200) E(4)]", "I(a): [-(a)B] [+(a)B]", "B:FB [ #(100)E(2)]", "B:I(rnd(0,10))"],
        iterations: 18
    },
    gfxProps: {center: [-0.2,0.4]}
  },
  {
    name: "double cymes",
    lsProps: {
      axiom: "-(180) f(100) +(180) A(7)",
      productions: ["A(t) {t==7}: FI(20)[&(60)∼L(0)]/(90)[&(45)A(0)]/(90) [&(60)∼L(0)]/(90)[&(45)A(4)]FI(10)∼K(0) ", "A(t){t<7}: A(t+1)", "I(t){t>0}:FFI(t-1) ", "L(t): [#(90)E(5)]", "K(t): [#(300)E(10)]"],
      iterations: 28
    },
    gfxProps: {length: 2, renderType: ["3d"]}
  },
  {
    name: "lilac inflorescene",
    lsProps: {
        axiom: " /(90) -(180) f(120) +(180) #(120) !(2) A∼K",
        productions: ["A: [-/∼K][+/∼K]I(0)/(rnd(0,90))A", "I(t) {t!=2}: FI(t+1)", "I(t) {t==2}: I(t+1)[-FFA][+FFA]","K: [#(300) !(0.9) F E(10,300)]"],
        iterations: 14
    },
    gfxProps: {length: 5, angle: 42, renderType: ["3d"]}
  }

];

export default examples;