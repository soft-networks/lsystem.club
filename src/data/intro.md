
# Intro 

## What are L-Systems

Formally, L-Systems, or Lindenmeyer Systems, are a mathematical and computational language, intended to aide in the description and drawing of cells, plants, organic structures and their growth process. They were introduced by a Botanist named Astrid Lindenmeyer in 1968, who they are named after. 

Personally, I think that L-Systems are a language to look anew at the world and its plant life. When I learnt how to write L-Systems to describe plants, I really learnt to pay attention closely to plants and their structures. I began to walk through the world and see more deeply the patterns and beauty in organic life around me. Furthermore, the outputs of L-Systems are not constant in time - they grow and change with every iteration. They've shown me that all life is in motion, and to draw organic life is to really be understanding where it's coming from and where its going.

I am grateful to the mathematicians, botanists and computer scientists who have developed L-Systems for many years. I also recognize that L-Systems, and in general the scientific ways of looking at plants are only one part of the story. I am deeply also grateful to indigeneous knowledge, many writers, thinkers and artists, and most importantly the plants themselves  who have taught me to look, speak and draw in new ways.

## Writing your first L-Ssystem

### An alphabet, productions and axioms

An LSystem, or Lindenmeyer System, is a type of programming language that takes a sentence of special symbols and changes and grows this sentence over time. The goal of many L-Systems, is for the changing sentence to represent the structure and growth of an organic object, like a plant or a cell. L-Systems achieve this magical feat using three main components: an alphabet, a set of productions, and an axiom.

Alphabet 
The alphabet is all the symbols that can be used to write L-Systems. ****Often, the alphabet is simply the English letters (ie: every letter from `A-Z`, their non-capitalized verisons `a-z`), every number (`0-9`) as well as most symbols (like `!,@,#, $` and so on). The symbols in the alphabet join together to form sentences - for eg: `Az#` is a valid sentence for L-Systems. 

Productions
Productions are a list of rules that convert symbols over time. A production rule, or production, takes in a single symbol as an input and produces a sentence of symbols as its output. For eg: `A : BA` is a production that will swap the symbol `A` with two symbols `BA` over time. 

Axiom

Finally, the L-System needs a place to start - the first symbol, or sentence from which to begin its journey of swapping, converting, and growing symbols. This starting point is known as an Axiom, ****and can be as small as one symbol like `A` or any sentence like `A#BFf!`.  

Putting this all together in the L-System below, notice how the L-System starts at `AB` and turns into `FXZ`. At this point there are no more swaps to do, as there are no Productions for `F` , `X`, or `Z`, so the L-System stops.

<LSCode code='AB 
A:F
B:XZ' iterations={10} asText/>

### Iterations and recursions

In the above example, the L-System stops immediately because there are no more swaps to do. This is rare. More commonly L-Systems, like plants, continue growing for a long time by continuing to swap symbols and generating longer sentences. 

Each time an L-System is run, or performs a set of swaps, is known as an "iteration". You need to specify the number of iterations you'd like an L-System to run for when you define it, otherwise the L-System can run forever. 

To model long term growth across many iterations, we can use a Production that employs recursion. Recursion here just means swapping a symbol with itself. In the example below, every instance of `A` becomes `AF`, so with each iteration the L-System adds an additional `F` to the output, generating sentences that grow linearly.

<LSCode code='A
A:AF' iterations={10} asText>

The following L-System replaces every symbol A with itself twice, as well as other symbols. This L-System below models exponential growth, doubling in length in each iteration and very quickly generates extremely long sentences.  

<LSCode code='A
A: A F A' iterations={5} asText>

# Drawing with L-Systems

### Turtle Graphics and L-Systems

Turtle graphics programs are computer drawing programs that execute on a set of instructions to draw pictures. If you're not familiar with them, imagine a turtle holding a pen, sitting on  your computer screen. Each time you give the turtle an instruction, like "Go forward by 10 inches", the turtle draws a line as it walks across the screen. 

### Drawing in 2D

If you start to look at the symbols in the L-System alphabet as inputs to a turtle graphics program, then you can start to visualize L-Systems as graphical pictures. There are many ways to convert each symbols to drawing instructions, but a common rule of thumb is as follows.

```
F -> move forward and draw a line (with some pre-defined length)
f -> move forward without drawing a line (with a pre-defined length)
E -> draw a an ellipse (with a pre-defined length) 
+ -> turn left (by a pre-defined angle)
- -> turn right (by a pre-defined angle)
~ -> turn randomly every time 
```

Thus, L-Systems can be used to draw graphics. The following L-System below has a pre-defined angle of 30°, and thus draws a triangle. Try changing the angle below to 90°, and  seeing if you can get the L-System to draw a simple square. 

<LSCode code='F+F+F' iterations={1} length={25}>