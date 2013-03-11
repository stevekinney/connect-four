(function () {
  'use strict';
  var slots = document.getElementsByClassName('slot');

  (function initialize() {
    Array.prototype.forEach.call(slots, function(slot) {
      slot.addEventListener('click', function() {
        playSpot(this);
      });
    });
  })();

  function isArray(object) {
    return Object.prototype.toString.call(object) === "[object Array]";
  }

  // Wrap current player status in a closure.
  var players = (function() {
    var currentTurn = 2;
  
    return {
      currentPlayer: function() {
        return currentTurn % 2 + 1;
      },
      nextPlayer: function() {
        return currentTurn++ % 2 + 1;
      }
    };
  })();

  function findByCoordinates(x, y) {
    if ( isArray(x) ) {
      y = x[1];
      x = x[0];
    }
    return document.getElementsByClassName('col' + x + ' row' + y)[0];
  }

  function getCoordinates(element) {
    var coordinates = element.className.match(/col(\d) row(\d)/).slice(1);
    return coordinates.map(function(coordinate) {return parseInt(coordinate, 10);});
  }

  function playSpot(element) {
    // Dig down recusively if there is an empty slot below
    var below = move.south(element);
    if ( below && !isPlayed(below) ) {
      return playSpot(below);
    }
  
    if ( !isPlayed(element) ) {
      markPlayed(element, players.nextPlayer());
      checkForVictory(element);
    } else {
      console.log('This spot has been played!');
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

  var move = (function() {
    var getAdjacent = function(offsetx, offsety, element) {
      var coordinates = getCoordinates(element);
      coordinates[0] = coordinates[0] + offsetx;
      coordinates[1] = coordinates[1] + offsety;
      return findByCoordinates(coordinates);
    };
  
    return {
      northwest: getAdjacent.bind(null, -1, -1),
      north: getAdjacent.bind(null, 0, -1),
      northeast: getAdjacent.bind(null, +1, -1),
      west: getAdjacent.bind(null, -1, 0),
      east: getAdjacent.bind(null, +1, 0),
      southwest: getAdjacent.bind(null, -1, +1),
      south: getAdjacent.bind(null, 0, +1),
      southeast: getAdjacent.bind(null, +1, +1)
    };
  })();

  var root = (function () {
    function followToRoot(direction, element) {
      var adjacent = move[direction](element),
          player = isPlayed(element);
  
      // Recursively look for the beginning of a streak
      if ( adjacent && isPlayed(adjacent) === player) {
        return followToRoot(direction, adjacent);
      } else {
        return element;
      }
    }
  
    return {
        horizontal: followToRoot.bind(null, 'west'),
        vertical: followToRoot.bind(null, 'south'),
        diagonalForward: followToRoot.bind(null, 'southwest'),
        diagonalBackward: followToRoot.bind(null, 'southeast')
      };
  })();

  var checkForVictory = (function() {
  
    var directions = {
      horizontal: 'east',
      vertical: 'north',
      diagonalBackward: 'northwest',
      diagonalForward: 'northeast'
    };
  
    function walk(direction, element, step) {
      if ( step >= 3 ) { return proclaimVictory(); }
    
      var next = move[direction](element);
    
      if ( adjacentIsValid(element, next) ) {
        return walk(direction, next, ++step);
      }
    }
  
    function beginWalk(angle, element) {
      var rootCell = root[angle](element);
      walk(directions[angle], rootCell, 0);
    }
  
    function checkEachAngle(element) {
      beginWalk('vertical', element);
      beginWalk('horizontal', element);
      beginWalk('diagonalForward', element);
      beginWalk('diagonalBackward', element);
    }
  
    function adjacentIsValid(current, next) {
      return typeof next !== 'undefined' && isPlayed(current) === isPlayed(next);
    }
  
    function proclaimVictory() {
      alert('Victory!');
      window.location('http://www.youtube.com/watch?v=oHg5SJYRHA0');
    }
  
    return checkEachAngle;
  })();
})();