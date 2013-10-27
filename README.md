Minesweeper
---------
### [Demo](http://codr.github.io/minesweeper)

This is a simple minesweeper game.
It alows you to:

- Create a new game.
- Validate your game. (Though this is done automatically)
- Cheat. This lets you peek at the the hidden squares.
- Flag a square at a potential mine. Do this by right clicking.

## Implementation

This game was made using backbone.js. It is laid out such that the board 
is a collection of squares. Each square knows of it's neighbours. This is
useful because all higher level tasks (such as "have we won", "did we
espose a mine", and "lets peek at the values") are handled on a
collection of squares.


## Future

- Save game state.
- Add the ability to change game size.
- Add timer.
