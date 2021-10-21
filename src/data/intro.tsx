import { LSPreview } from "../components/LSPreview";


const intro = (
  <>
    <h1> Intro </h1>
    <h2> What are L-Systems</h2>
    <p>
      Formally, L-Systems, or Lindenmeyer Systems, are a mathematical and computational language, intended to aide in
      the description and drawing of cells, plants, organic structures and their growth process. They were introduced by
      a Botanist named Astrid Lindenmeyer in 1968, who they are named after.
    </p>
    <p>
      Personally, I think that L-Systems are a language to look anew at the world and its plant life. When I learnt how
      to write L-Systems to describe plants, I really learnt to pay attention closely to plants and their structures. I
      began to walk through the world and see more deeply the patterns and beauty in organic life around me.
      Furthermore, the outputs of L-Systems are not constant in time - they grow and change with every iteration.
      They've shown me that all life is in motion, and to draw organic life is to really be understanding where it's
      coming from and where its going.
    </p>
    <p>
      I am grateful to the mathematicians, botanists and computer scientists who have developed L-Systems for many
      years. I also recognize that L-Systems, and in general the scientific ways of looking at plants are only one part
      of the story. I am deeply also grateful to indigeneous knowledge, many writers, thinkers and artists, and most
      importantly the plants themselves who have taught me to look, speak and draw in new ways.
    </p>
    <h2> Writing your first L-System</h2>
    <h3> An alphabet, productions and axioms</h3>
    <p>
      An LSystem, or Lindenmeyer System, is a type of programming language that takes a sentence of special symbols and
      changes and grows this sentence over time. The goal of many L-Systems, is for the changing sentence to represent
      the structure and growth of an organic object, like a plant or a cell. L-Systems achieve this magical feat using
      three main components: an alphabet, a set of productions, and an axiom.
    </p>
    <p>
      <em>Alphabet:</em><br/>
      The alphabet is all the symbols that can be used to write L-Systems. ****Often, the alphabet is simply the English
      letters (ie: every letter from <code>A-Z</code> their non-capitalized verisons <code>a-z</code>, every number (
      <code>0-9</code> as well as most symbols (like <code>!,@,#, $</code>and so on). The symbols in the alphabet join
      together to form sentences - for eg: <code>Az#</code>is a valid sentence for L-Systems.
    </p>
    <p>
      <em>Productions:</em><br/>
      Productions are a list of rules that convert symbols over time. A production rule, or production, takes in a
      single symbol as an input and produces a sentence of symbols as its output. For eg: <code>A : BA</code>is a
      production that will swap the symbol <code>A</code>with two symbols <code>BA</code>over time.
    </p>
    <p>
      <em>Axiom:</em><br/>
      Finally, the L-System needs a place to start - the first symbol, or sentence from which to begin its journey of
      swapping, converting, and growing symbols. This starting point is known as an Axiom, ****and can be as small as
      one symbol like <code>A</code>or any sentence like <code>A#BFf!</code>
      Putting this all together in the L-System below, notice how the L-System starts at <code>AB</code>and turns into{" "}
      <code>FXZ</code> At this point there are no more swaps to do, as there are no Productions for <code>F</code>,{" "}
      <code>X</code> or <code>Z</code> so the L-System stops.
    </p>
    <LSPreview
      code="A
BA:F
B:XZ"
      gfxProps={{ iterations: 10, renderType: ["text"] }}
    />
    <h3> Iterations and recursions</h3>
    <p>
      In the above example, the L-System stops immediately because there are no more swaps to do. This is rare. More
      commonly L-Systems, like plants, continue growing for a long time by continuing to swap symbols and generating
      longer sentences.
    </p>
    <p>
      Each time an L-System is run, or performs a set of swaps, is known as an "iteration". You need to specify the
      number of iterations you'd like an L-System to run for when you define it, otherwise the L-System can run forever.
    </p>
    <p>
      To model long term growth across many iterations, we can use a Production that employs recursion. Recursion here
      just means swapping a symbol with itself. In the example below, every instance of <code>A</code>becomes{" "}
      <code>AF</code> so with each iteration the L-System adds an additional <code>F</code>to the output, generating
      sentences that grow linearly.
    </p>
    <LSPreview
      code="A
A:AF"
      gfxProps={{ iterations: 10, renderType: ["text"] }}
    />
    <p>
      The following L-System replaces every symbol A with itself twice, as well as other symbols. This L-System below
      models exponential growth, doubling in length in each iteration and very quickly generates extremely long
      sentences.
    </p>
    <LSPreview
      code="A
A: A F A"
      gfxProps={{ iterations: 5, renderType: ["text"] }}
    />
    <h1> Drawing with L-Systems </h1>
    <h2> Turtle Graphics and L-Systems</h2>
    <p>
      Turtle graphics programs are computer drawing programs that execute on a set of instructions to draw pictures. If
      you're not familiar with them, imagine a turtle holding a pen, sitting on your computer screen. Each time you give
      the turtle an instruction, like "Go forward by 10 inches", the turtle draws a line as it walks across the screen.
    </p>
    <h2> Drawing in 2D</h2>
    <p>
      If you start to look at the symbols in the L-System alphabet as inputs to a turtle graphics program, then you can
      start to visualize L-Systems as graphical pictures. There are many ways to convert each symbols to drawing
      instructions, but a common rule of thumb is as follows.
    </p>
    <pre>
      F : move forward and draw a line (with some pre-defined length) <br />f : move forward without drawing a line
      (with a pre-defined length) <br />E : draw a an ellipse (with a pre-defined length) <br />+ : turn left (by a
      pre-defined angle) <br />- : turn right (by a pre-defined angle) ~ : turn randomly every time
    </pre>
    <p>
      Thus, L-Systems can be used to draw graphics. The following L-System below has a pre-defined angle of 30°, and
      thus draws a triangle. Try changing the angle below to 90°, and seeing if you can get the L-System to draw a
      simple square.
    </p>
    <LSPreview code="F+F+F" gfxProps={{ iterations: 1, length: 25 }} />
    <h2> Drawing in 3D</h2>
    <p>
      In addition to drawing in 2D, we can also extend our Turtle graphics programs to draw in 3D. We use the following
      symbols to extend the graphics program, and give us more control over 3D space.
    </p>
    <pre>
      / : Rotate around Y axis, in the positive direction <br />\ : Rotate around Y axis in negative direction <br />& :
      Rotate around X axis, in the positive direction <br />^ : Rotate around X axis in negative direction
    </pre>
    <p>We can use these new 3D controls to draw simple shapes in 3D.</p>
    <LSPreview code="F / F + F & F" gfxProps={{ iterations: 1, length: 25 }} />
    <h2> Drawing branches</h2>
    <p>
      So far, every change we've made to our system is made to the whole system. If we rotate one aspect, the whole
      system rotates. Many plants and organic systems, however, have branches: children systems that don't follow the
      parent, but follow their own rules and can rotate independently of their parent. To do this, we can introduce the
      notion of starting and ending a branch into our system by adding two new symbols.
    </p>
    <pre>
      [ : Start branch <br />] : End branch
    </pre>
    <p>
      When a branch starts with <code>[</code> the program stores the current position, rotation and styles (colors,
      stroke widths). From that point onwards, all rotation, position, and style changes are local to the branch. When
      the branch is closed with <code>]</code> these changes are discarded, and we return to the state from where the
      branch started. This is achieving by pushing and popping transformation matrices onto a matrix stack.
    </p>
    <p>We can now use this to draw a nice shape</p>
    <LSPreview
      gfxProps={{ iterations: 2, length: 50 }}
      code="*Lets draw Hi
[H][I] 
* Draw the H with 3 lines
H: [F(200)] [f(100) +(90) F(100)] [+(90) f(100) -(90) F(200)]
* Draw the I by moving over with m, and one line and an ellipse
I: m [F(150)][f(200) E(5)]
* move right: rotate towards right, move, rotate back 
m: +(90) f(200) -(90)"
    />
    <p>
      Now that we can draw branches, we can use them to draw a simple tree. This is achieved by recursively replacing{" "}
      <code>A</code>with three key pieces: drawing a single line forward, branching, rotating left and redrawing myself,
      and then branching, rotating right and redrawing myself again.
    </p>
    <LSPreview
      code="A
A: F [+A][-A]"
      gfxProps={{ iterations: 10, length: 25 }}
    />
    <p>
    Branches are particularly used to draw complex shapes that grow over time, with branched sub-shapes that emerge from
    the main shape as it grows. In the example below, we take our circle drawing code, and extend it to also draw a
    Branch with each iteration.
    </p>
    <LSPreview
      code="A
A: A [-(90) B] + F
B: F B"
      gfxProps={{ iterations: 35, length: 10 }}
    />
    <h2> Drawing with parameters</h2>
    <p>
    In the above examples, we are restricted to only drawing the L-Systems with a default length and angle. While this
    is powerful, it is often useful to also include parameters for *each* drawing command. To do this, we can extend our
    Alphabet to allow for every symbol to also accept a parameter. For eg: <code>F(30)</code> is the Symbol <code>F</code> with the parameter <code>30</code> which translates to "draw a line that is 30 units long". Each of
    the basic symbols all accept parameters that change their meaning.
    </p>
    <pre>
      F(x) : move forward by x units and draw a line along the way <br />
      f(x) : move forward by x units *without* drawing a line along the way <br />
      +(a) : turn left by a degrees <br />
      -(a) : turn right by a degrees
    </pre>
    <p>In addition, adding parameters allows us to add a few more symbols to draw with:</p>
    <pre>
      !(s) : Change the stroke width to <br />! #(h,s,b) : Change the color to h, s, b
    </pre>
    <p>We can use parameters to now draw L-Systems with a bit more control.</p>
    <LSPreview
      code="* Simple house
-(180) B
B: #(200, 50,50) F -(90) F(70) -(90) F T
T: #(300,80,50)  -(45) F -(90) F"
      gfxProps={{ iterations: 3, length: 50 }}
    />
    <p>
      We can combine parameters and branching, to start to easily emulate organic systems with one main axis that moves
    with some default, angle and branches that branch off at their own angles.
    </p>
    <LSPreview
      gfxProps={{ iterations: 15, length: 15 }}
      code="M 
*Main axis: move forward, draw branches, rotate repeat 
M: F [L] [R] +(2) M
*Left and right branches rotate by their own angle
L: -(45) F
R: +(45) F"
    />
    <h2> Using math in parameters</h2>
    <p>Parameters in L-Systems also support basic mathematical functions, to increase their expressivity. Currently the
    L-System implementation on this website supports the following mathematical functions.
    </p>
    <pre>
      Numbers
      <br />1 : Simple integers
      <br />
      1.241241 : Decimals
      <br />
      <br />
      Mathematical expressions
      <br />
      +, -, /, *, ^ : To add, subtract,divide, multiply, exponent eg: F(2+2*3)
      <br />( , ) : To order your mathematical operations, eg: F((2+2)*3)
      <br />
      <br />
      Mathemetical constants
      <br />
      pi: Evalutes to 3.14, eg: +(pi*2);
      <br /> e: Evaluatas to 2.17, eg: F(e)
      <br />
      <br />
      Trignometry
      <br />
      sin(a),cos(a), tan(a): use trignometric functions
      <br />
      asin(a), acos(a), atan(a): use inverse trignometric functions
      <br />
      <br />
      Useful functions
      <br />
      rnd(): get a random number between 0 and 1, eg: F(rnd())
      <br />
      rnd(min,max): get a random number between min and max, eg: F(rnd(2,5))
      <br />
      sqrt(n): calculate the sqrt of n, eg: F(1 + sqrt(2))
      <br />
      ln(n): calculate the log of n
    </pre>
    <p>
    These can be useful to introduce ryhthm, balance and randomness into your L-System, and will be especially useful
    later on as we introduction parameterized productions.
    </p>
    <LSPreview
      code="M 
*Main axis: move forward, draw branches, rotate repeat 
M: F [L] [R] +(1 + sqrt(2)) M
*Left and right branches rotate by their own angle
L: -(rnd(20,45)) F
R: +(rnd(20,45)) F"
      gfxProps={{ iterations: 15, length: 15 }}
    />
    <h1> Complex rules </h1>
    <h2> Stochastic (randomized) productions</h2>
    <p>
    Currently our L-Systems are deterministic - which means that each time an L-System is run, it will produce the same
    sentence as its final output. The organic world, on the other hand, is not quite deterministic. Each type of plant
    does have a structure it follows, but plants often exhibit randomness that give them variation and diversity. To
    model this randomness, we introduce the idea of stochastic productions. A stochastic production is one where, for a
    given input, say <code>A</code> there are multiple possible outputs, say <code>AF</code>and <code>X</code> As an
    example, the L-System below models a system that grows recursively but then at a random point will stop growing.
    Each time the L-System is run, you should get a different output.
    </p>
    <LSPreview
      code="A
A:BFA
B:X
B:[+(90) F(20)]"
      gfxProps={{ iterations: 25 }}
    />
    <p>
    By default, when a production has multiple outputs, each output has an equal likelihood. This is can be altered by
    altering the weights for each production's output using the syntax <code>{"I:{weight}"}</code>where <code>I</code>
    represents the input symbol and <code>O</code>represents the output sentence, and the <code>weight</code>is any
    number. The default weight for productions is 1. In the example below, the first production has a weight of 10, the
    second has a weight of 2, and the final has the default weight of 1. This system grows a plant that 7/10 times grows
    straight, 2/10 times branches a flower, and 1/10 times will split itself into two.
    </p>
    <LSPreview
      code="A
*Grow recursively without flower, weight is 5.
A: {7} +(1) F A
*Grow flower, then continue, weight is 2
A: {2} [+(45) FE] A
*Branch into two versions of myself
A: [ +(45) A] [-(45) A]"
      gfxProps={{ iterations: 25 }}
    />
    <h2> Parametric and conditional productions</h2>
    <p>
    As a plant grows, it's state changes - for example, it gets access to more energy, often via nutrients in the soil
    or the sun or depletes that energy to grow flowers. This state change can be modelled as variables in the L-System
    that update or change over time - passed through iterations through the productions. As a simple example, consider
    the parametric production <code>A(n): !(n)F</code>. Given a variable <code>n</code> this production outputs a line
    with stroke weight <code>n</code> We can use this production in a simple L-System that draws 5 lines are various
    thicknesses.
    </p>
    <LSPreview
      code="A(5) A(4) A(3) A(2) A(1)
A(n): !(n) F"
      gfxProps={{ iterations: 10 }}
    />
    <p>
    A more complex, infinitely growing version of the same idea can be achieved through recursion. In the L-System
    below, the production draws a straight line, with stroke weight <code>n</code> and then recursively calls itself,
    reducing <code>n</code>by 1.
    </p>
    <LSPreview
      code="A(20)
A(n): !(n) F A(n-1)"
      gfxProps={{ iterations: 10 }}
    />
    <p>
    Note that in the above system, there is a point at which <code>n</code>becomes less than 0, which is not desirable
    as drawing a negative stroke weight can have unintended consequences. We can go ahead and solve issues like this, by
    introducing a **condition,** <code>{"{n>0}"}</code>****which checks if <code>n</code>is greater than 0. We can also
    introduce another production with condition <code>TODOnTODO</code>which stops the recursion and draws a single
    flower.
    </p>
    <LSPreview
      code="A(20)
A(n){n>0}: !(n) FA(n-1)
A(n){n<=0}: E"
      gfxProps={{ iterations: 100 }}
    />
    <p>
    Finally, and excitingly, you can have multiple parameters in a Production and conditions that check between these
    parameters. You can also have multiple productions that match the same conditions - and in this case, these
    productions will be chosen between stochastically. We can use these features to add complexity to our previous
    system, such that our branching, flowering L-System will stop growing once it uses up its total "energy" -{" "}
    <code>T</code> Writing L-Systems in this way allows us to run them for many iterations, as they terminate at the end
    of their energy rather than when the iterations end.
    </p>
    <h2> Context based productions </h2>
    <p>
      Need to write out this section and dbeug some stuff with context productions...
    </p>
  </>
);


export default intro;