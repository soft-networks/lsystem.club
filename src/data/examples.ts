import { CompleteLSExample } from "../lib/utils";

const examples: CompleteLSExample[] = [
  {
    name: "Spiral",
    code: "A\nA:FB + A\nA:FB + A\nB:[-(90)FF]",
    gfxProps: { angle: 5, center: [-0.1, 0] , iterations: 72},
  },
  {
    name: "Koch Curve",
    code: "+(90) [F]\nF:F+F--F+F",
    gfxProps: { angle: 60, length: 1, center: [-0.4, -0.1], iterations: 5},
  },
  {
    name: "Beautiful octopus",
    code: "A(10,50)\nA(a,w){w>0}: F #(w) !(w) +(a) C(w) A(a,w-0.5)\nB(b): #(b) F B(b+1)\nC(w): [!(w/2) -B(w)]\nA(a,w){w<0}:X",
    gfxProps: {
      iterations: 50
    }
  },
  {
    name: "Simple tree",
    code: "A(10)\nA(x):F[+(x)FA(0.9*x)][-(x)FA(0.9*x)]",
    gfxProps: { angle: 22.5, length: 25, center: [0, 0.4], iterations: 7},
  },
  {
    name: "prospect lawn",
    code: "A(25)\nA(x):!(1.5)F(4.1)Y(x)[+(x)E(4.1)A(0.9*x)][-(x)E(4.1)A(0.9*x)]\nF(x):#(10) F(x*1.55)\n!(x){x>=1.5}:!(x*1.44)\nE(x):{5} #(rnd(0,300)) F(x)\nE(x):{1} #(250) E(x)\nY(x): [-(rnd(-45,45)) A(x)]",
    gfxProps: { center: [0, 0.48], length: 1, iterations: 8 },
  },
  {
    name: "wildflowers",
    code: "P\nP: +(90) f(100) -(90) [A(rnd(0,10))]\nA(a): FFF I(40) +(rnd(0-a,a))  A(a+1) [ #(200) E(4)]\nI(a): [-(a)B] [+(a)B]\nB:FB [ #(100)E(2)]\nB:I(rnd(0,10))",
    gfxProps: {center: [-0.2,0.4], iterations: 18}
  },
  {
    name: "double cymes",
    code: "-(180) f(100) +(180) A(7)\nA(t) {t==7}: FI(20)[&(60)∼L(0)]/(90)[&(45)A(0)]/(90) [&(60)∼L(0)]/(90)[&(45)A(4)]FI(10)∼K(0) \nA(t){t<7}: A(t+1)\nI(t){t>0}:FFI(t-1) \nL(t): [#(90)E(5)]\nK(t): [#(300)E(10)]",
    gfxProps: {length: 2, renderType: ["3d"], iterations: 25}
  },
  {
    name: "lilac inflorescene",
    code: " /(90) -(180) f(120) +(180) #(120) !(2) A∼K\nA: [-/∼K][+/∼K]I(0)/(rnd(0,90))A\nI(t) {t!=2}: FI(t+1)\nI(t) {t==2}: I(t+1)[-FFA][+FFA]\nK: [#(300) !(0.9) F E(10,300)]",
    gfxProps: {length: 5, angle: 42, renderType: ["3d"], iterations: 14}
  }

];

export default examples;