import LSystem, { ParamsValue } from "@bvk/lsystem"
import p5 from "p5"
import P5Turtle3D from "../LSDraw/P5Turtle3D"
import { CompleteLSExample, GFXProps } from "../utils"

const lilacData: CompleteLSExample = {
  name: "lilac",
  lsProps: {
    axiom: "!(0.9) #(120) [ -(44)  ^(20) F(50) AK ] ",
    productions: [
      "A: P I(0) /(90)  A",
      "I(t) {t!=2}:  F I(t+1)",
      "I(t) {t==2}: ^(rnd(5,15)) #(rnd(60,150)) I(t+1)[-(45)FFA][+(45)FFA][FFA]",
      "P: [-(45)/(45)K][+(45)/(45)K]",
      "K: [F #(100) F [~ M(0.05)]]",
      "M(s) {s<0.1}: M(s+0.05)",
      "M(s) {s>=0.1}: M(0.1)"
    ],
    iterations: 16,
  },
  gfxProps: {
    length: 3,
    renderType: ["3d"],
    width: 1200,
    height: 850,
    angle: 8
  },
};
export default function Lilac() {
  let ls =  new LSystem(lilacData.lsProps.axiom, lilacData.lsProps.productions, lilacData.lsProps.iterations);
  let gfxProps = lilacData.gfxProps; 

  return (
    <div > 
      <DrawLilac LSystem={ls} GFXProps={gfxProps} /> 
      
    </div>)
}

const flowerHue = 325;  
class DrawLilac extends P5Turtle3D {
  windAngle = 0;
  animationSpeed = 1000;
  preload = (p: p5) => {
    p.loadModel(
      process.env.PUBLIC_URL + "/assets/lily-flat.obj",
      true,
      (m) => {
        this.models.push(m);
        this.startIterationAnimation()
      },
      (e) => {
        console.log("Fail to load model");
      }
    );
  }
  moveToCenter = () => {
    //Do nothing, were already there
    let p = this.p5Context;
    if (!p) return;
    p.background(200, 100,100,0.0);
    
    let pos = [-180,-150,-320];
    p.ambientLight(flowerHue - 95, 80, 100);
    p.pointLight(flowerHue, 80, 90, -500, -500, -900);
    p.pointLight(flowerHue + 200, 80, 65, 200, 200, -300);
    
    p.camera(pos[0], pos[1], pos[2], pos[0], pos[1],0, 0,1,0);
    
  }
  simulateWind = () => {
    let maxBlows = Math.floor(Math.random() * 100 + 20);
    for (var i = 0; i < maxBlows; i++) {
      setTimeout(() => {
        this.redraw();
      }, i * 100);
    }
  }
  drawModel = (p:p5, params: ParamsValue | undefined) => {
    let scaleValue = params && params[0] ? parseFloat(params[0] as string) : 0.1;
    let model = this.models[0];
    if (!model) return;
    p.push();

    p.noStroke();
    p.fill(100,100,100);   
    p.specularMaterial(flowerHue,0,100)
    p.scale(scaleValue);
    p.model(model);
    p.pop();
  }
  moveCamera = () => {
    //Do nothing
  }
  render() {
    return (
      <div style={{backgroundImage: "linear-gradient(white 30%, rgb(255,220,250))"}}>
        <div
          style={{
            position: "fixed",
            top: "12px",
            right: "12px",
            width: "24px",
            height: "24px",
            borderRadius: "100%",
            cursor: "ne-resize",
            background: "rgb(250,120,200)"
          }}
          onClick={() => this.startIterationAnimation()}
        >
          {" "}
        </div>
        <div onClick={(e) => this.simulateWind()} ref={this.containerRef} style={{marginLeft: "10%"}}/>
      </div>
    );
  }
}