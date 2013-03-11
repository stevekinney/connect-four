var slots = document.getElementsByClassName('slot');

(function initialize() {
  Array.prototype.forEach.call(slots, function(slot) {
    slot.addEventListener('click', function() {
      playSpot(this);
    });
  });
})();

function isArray(object) {
  return Object.prototype.toString.call(object) === "[object Array]"
}

// Wrap current player status in a closure.
var players = (function() {
  var currentTurn = 1;
  
  return {
    currentPlayer: function() {
      return currentTurn % 2
    },
    nextPlayer: function() {
      return currentTurn++ % 2
    }
  }
})();

function findByCoordinates(x, y) {
  if ( isArray(x) ) {
    y = x[1];
    x = x[0];
  }
  return document.getElementsByClassName('row' + y + ' col' + x)[0];
}

function getCoordinates(element) {
  var coordinates = element.className.match(/col(\d) row(\d)/).slice(1);
  return coordinates.map(function(coordinate) {return parseInt(coordinate)});
}

function playSpot(element) {
  // Dig down recusively if there is an empty slot below
  var below = move.south(element);
  if ( below && isEmpty(below) ) {
    return playSpot(below);
  }
  
  if ( !isPlayed(element) ) {
    markPlayed(element, players.nextPlayer());
  } else {
    console.log('This spot has been played!')
  }
}

function markPlayed(element, player) {
  element.className = element.className.replace('unplayed', 'player' + player);
}

function isPlayed(element) {
  var player = element.className.match(/(player\d)/);
  if ( player ) {
    return player[0];
  } else {
    return false;
  }
}

function isEmpty(element) {
  return !!element.className.match('unplayed');
}

var move = (function() {
 
  var getAdjacent = function(offsetx, offsety, element) {
    var coordinates = getCoordinates(element);
    coordinates[0] = coordinates[0] + offsetx;
    coordinates[1] = coordinates[1] + offsety;
    return findByCoordinates(coordinates);
  }
  
  return {
    northwest: getAdjacent.bind(null, -1, -1),
    north: getAdjacent.bind(null, 0, -1),
    northeast: getAdjacent.bind(null, +1, -1),
    west: getAdjacent.bind(null, -1, 0),
    east: getAdjacent.bind(null, +1, 0),
    southwest: getAdjacent.bind(null, -1, +1),
    south: getAdjacent.bind(null, 0, +1),
    southeast: getAdjacent.bind(null, +1, +1)
  }
})();

function findRoot(element, direction, step) {
  
  if ( !step ) step = 0;
  
  var player = isPlayed(element),
      adjacentSlot = move[direction](element);
      
  if ( adjacentSlot && isPlayed(adjacentSlot) === player && step < 4 ) {
    step += step;
    findRoot(element, direction, step);
  } else {
    return element;
  }
  
}