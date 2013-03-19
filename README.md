# Connect Four

The classic game of Connect Four. Basically, I wanted to give myself a little challenge to see if I could brew up a quick game in the browser without jQuery. I also wanted to experiment with recursion and closures. This little game is the end result of that endeavor.

I've tested it it the latest builds of Chrome, Firefox, and Safari. It does use ES5's `Array.prototype.forEach` method, so it definitely won't work in browsers that don't support ES5.

Check it out [here](http://stevekinney.github.com/connect-four).

## To Do

* Come up with something a little more graceful than refreshing the page upon victory.
* Set up a shim for `Array.prototype.forEach`.
* Use callbacks where appropriate.
* Set basic AI player.
* Hook it up to Socket.io and make it multiplayer.
