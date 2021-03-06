console.log("Race For Knowledge 2018");

// JavaScript logic
var Game = {
  newBoard: function(n) {
    // Creates a new board of n x n filled with marker '.'
    this.board = this.board || Array(n);
    for (var i = 0; i < this.board.length; i++) {
      this.board[i] = Array(n).fill('.');
    }
    // Reset game finish as false and selected player as undefined
    this.finish = false;
    this.lastPlayer = 'undefined';
    console.log("newBoard created: " + n + " by " + n);
  },
  winCount: function(n) {
    this.countWin = n;
    console.log("Game of connect " + n);
  },
  addMark: function(playerChosen, row, col) {
	this.board[row][col] = playerChosen;
	this["lastPlayer"] = playerChosen;
	console.log("Player: " + playerChosen + " addMark to row: " + row + ", col: " + col);
  },
  checkRows: function(playerChosen) {
    for (var row = 0; row < this.board.length; row++) {
      var count = 0;
      this.winArray = [];
      for (var col = 0; col < this.board.length; col++) {
        if (this.board[row][col] === playerChosen) {
          count++;
          this.winArray.push(Array(row, col));
        } else {
          count = 0;
          this.winArray = [];
        }
        if (count === this.countWin) {
          console.log("checkRow true on row: " + row);
          this["finish"] = true;
          console.log("Start", row);
          console.log("End", col);
          return true;
        }
      }
    }
  },
  checkCols: function(playerChosen) {
    for (var col = 0; col < this.board.length; col++) {
      var count = 0;
      this.winArray = [];
      for (var row = 0; row < this.board.length; row++) {
        if (this.board[row][col] === playerChosen) {
          count++;
          this.winArray.push(Array(row, col));
        } else {
          count = 0;
          this.winArray = [];
        }
        if (count === this.countWin) {
          console.log("checkCol true on col " + col);
          this["finish"] = true;
          return true;
        }
      }
    }
  },
  checkDiagLR: function(playerChosen) {
    var length = this.board.length;
    var maxLength = length - this.countWin + 1;
    // Run Bottom Half diagonal Top Left to Bottom Right (incl middle)
    for (var rowStart = 0; rowStart < maxLength; rowStart++) {
      var count = 0;
      this.winArray = [];
      for (var row = rowStart, col = 0; row < length && col < length; row++, col++) {
        if (this.board[row][col] === playerChosen) {
          count++;
          this.winArray.push(Array(row, col));
        } else {
          count = 0;
          this.winArray = [];
        }
        if (count === this.countWin) {
          console.log("Win diagonal TL to BR");
          this["finish"] = true;
          return true;
        }
      }
    }
    // Run Top Half diagonal Top Left to Bottom Right (excl middle)
    for (var colStart = 1; colStart < maxLength; colStart++) {
      var count = 0;
      this.winArray = [];
      for (var col = colStart, row = 0; col < length && row < length; col++, row++) {
        if (this.board[row][col] === playerChosen) {
          count++;
          this.winArray.push(Array(row, col));
        } else {
          count = 0;
          this.winArray = [];
        }
        if (count === this.countWin) {
          console.log("Win diagonal TL to BR");
          this["finish"] = true;
          return true;
        }
      }
    }
  },
  checkDiagRL: function(playerChosen) {
    var length = this.board.length;
    var maxLength = length - this.countWin + 1;
    // Run Bottom half diagonal Top Right to Botom Left (incl middle)

    for (var rowStart = 0; rowStart < maxLength; rowStart++) {
      var count = 0;
      this.winArray = [];
      for (var row = rowStart, col = (length - 1); row < length && col >= 0; row++, col--) {
        if (this.board[row][col] === playerChosen) {
          count++;
          this.winArray.push(Array(row, col));
        } else {
          count = 0;
          this.winArray = [];
        }
        if (count === this.countWin) {
          console.log("Win diagonal TR to BL");
          this["finish"] = true;
          return true;
        }
      }
    }
    // Run Top half diagonal Top Right to Botom Left (excl middle)
    for (var colStart = (length - 2); colStart > (this.countWin - 2); colStart--) {
      var count = 0;
      this.winArray = [];
      for (var col = colStart, row = 0; col >= 0 && row <= (length - 2);
        (col-- && row++)) {
        if (this.board[row][col] === playerChosen) {
          count++;
          this.winArray.push(Array(row, col));
        } else {
          count = 0;
          this.winArray = [];
        }
        if (count === this.countWin) {
          console.log("Win diagonal TR to BL");
          this["finish"] = true;
          return true;
        }
      }
    }
  },
  isEmpty: function() {
    var check = true;
    for (var i = 0; i < this.board.length; i++) {
      if (this.board[i].includes('.')) {
        return false;
      }
    }
    return check;
  },
  checkAll: function(playerChosen) {
    if (this.checkRows(playerChosen)) {
      return true;
    }
    if (this.checkCols(playerChosen)) {
      return true;
    }
    if (this.checkDiagLR(playerChosen)) {
      return true;
    }
    if (this.checkDiagRL(playerChosen)) {
      return true;
    }
    if (!this.finish && this.isEmpty()) {
      console.log("Draw game no winner");
      return true;
    }
  }
};

// jQuery..................................................
$(document).ready(function() {
  // Declare global event listeners used more than once
  var $select = $('select'); // Select dropdown form game setup
  var $msg = $('#msg'); // Container to print instructions
  var $cell; // Assign event after buildBoard creates cell
  var $buildButton = $('button').filter('.build-board');
  var $document = $(document);
  var $body = $('body');
  var $players = $('.players');
  var $buttonReset = $('button').filter('.reset');

  // Declare and cache global Game condition variables
  var size; // board dimensions size x size
  var winCount; // length condition to achieve in a row
  var maxScore; // first player to score maxScore wins

  var cacheValues = function() {
    size = parseInt($(".board-size option:selected").val());
    maxScore = parseInt($(".board-round option:selected").val());
    var el = parseInt($(".board-count option:selected").val());
    if (el > size) {
      swal("Length cannot be bigger than board size");
    } else {
      winCount = el;
    }
    console.log("size: " + size + " winCount: " + winCount + " maxScore: " + maxScore);
  };
  $select.change(cacheValues);
  cacheValues();

  // Function to hide set up and show board and title with cached values
  var showBoard = function() {
    $('.game-setup').hide();
    $('.game-play').css("display", "inline-flex");
    $buttonReset.hide();
  };

  // Create function for building a new board
  var buildBoard = function() {
    // Execute game logic based on cached select values
    Game.newBoard(size);
    Game.winCount(winCount);

    var dimension = (100 / size) + '%'; // To set cell width
    var count = 0; // To number cells
    var list = ''; // Use string to store appended values
    // Loop create new board divs and append to div container. Assign row and col attributes for future access
    for (var row = 0; row < size; row++) {
      for (var col = 0; col < size; col++) {
        count++;
        list += "<div class='cell' row=" + "'" + row + "' col='" + col + "'>" + count + "</div>";
      }
    }
    $('.container').html(list);
    // Cache event listener on board after build
    $cell = $('.cell');
    $cell.css({
      "width": dimension,
      "height": dimension
    });
    $cell.on('click', takeMove);
    // showBoard callback;
    showBoard();
    return true;
  };

  $buildButton.on('click', buildBoard);

  // Selecting players
  var player;

  // Function to assign player and update msg div
  var pickPlayer = function(name) {
    player = name;
    console.log(player + " chosen");
    $msg.html(player + " chosen").removeClass().addClass(player);
  };

  // Shortcut keys: for choosing players
  $document.on('keypress', function(event) {
    // Number 1 shortcut
    if (event.keyCode === 49) {
      pickPlayer('player1');
    }
    // Number 2 shortcut
    if (event.keyCode === 50) {
      pickPlayer('player2');
    }
    // Number 2 shortcut
    if (event.keyCode === 51) {
      pickPlayer('player3');
    }
    // Number 2 shortcut
    if (event.keyCode === 52) {
      pickPlayer('player4');
    }
    // Spacebar shortcut
    if (event.keyCode === 32) {
      if (player === 'player1') {
        pickPlayer('player2')
      } else if (player === 'player2') {
        pickPlayer('player3')
      } else if (player === 'player3') {
        pickPlayer('player4')
      } else if (player === 'player4') {
        pickPlayer('incorrect')
      } else if (player === 'incorrect') {
        pickPlayer('player1')
      }
    }
  });

  // Cache value of button when player button clicked
  var buttonPlayer = function() {
    var el = $(this).attr('class');
    pickPlayer(el);
  };
  $players.on('click', 'button', buttonPlayer);

  var printWin = function() {
    var winArray = Game.winArray;
    var length = winArray.length;

    for (var i = 0; i < length; i++) {
      $(".cell[row=" + winArray[i][0] + "][col=" + winArray[i][1] + "]").addClass('win');
    }
  };

  // Create object to keep track of player scores
  var playerScores = {
    player1: 0,
    player2: 0,
    player3: 0,
    player4: 0
  };

  // Check round score and record value
  var checkRound = function(player) {
    // Player wins round
    if (Game.finish && Game.lastPlayer === player) {
      playerScores[player]++;
      $msg.html("Winner is" + player + "<br/> Reset Board");
      $body.removeClass().addClass(player);
      console.log('player1Score:' + playerScores["player1"], 'player2Score ' + playerScores["player2"], 'player3Score ' + playerScores["player3"], 'player4Score ' + playerScores["player4"]);
      $cell.off('click');
      printWin();
      $buttonReset.show();
      // Draw round
    } else if (Game.isEmpty() && !Game.finish) {
      $msg.html('Game draw. No points. <br/> Reset Board').removeClass().addClass('msg');
      $cell.off('click');
      $body.removeClass().addClass('msg');
      $buttonReset.show();
    }
    // Append round score
    $('button.player1 span').html(playerScores["player1"]);
    $('button.player2 span').html(playerScores["player2"]);
    $('button.player3 span').html(playerScores["player3"]);
    $('button.player4 span').html(playerScores["player4"]);
    $('button.incorrect span').html(playerScores["incorrect"]);
  };

  // Check total round wins
  var checkGame = function() {
    if (playerScores["player1"] === maxScore || playerScores["player2"] === maxScore || playerScores["player3"] === maxScore || playerScores["player4"] === maxScore) {
      if (playerScores["player1"] > playerScores["player2"] && playerScores["player1"] > playerScores["player3"] && playerScores["player1"] > playerScores["player4"]) {
        swal("player1 WINS!", "Click ok to play again!", "success");
      } else if (playerScores["player1"] < playerScores["player2"] && playerScores["player3"] < playerScores["player2"] && playerScores["player4"] < playerScores["player2"]) {
        swal("player2 WINS!", "Click ok to play again!", "success");
      } else if (playerScores["player1"] < playerScores["player3"] && playerScores["player2"] < playerScores["player3"] && playerScores["player4"] < playerScores["player3"]) {
        swal("player3 WINS!", "Click ok to play again!", "success");
      } else if (playerScores["player1"] < playerScores["player4"] && playerScores["player3"] < playerScores["player4"] && playerScores["player2"] < playerScores["player4"]) {
        swal("player4 WINS!", "Click ok to play again!", "success");
      }
      $('.sweet-alert').on('click', 'button', function() {
        location.reload();
      });
    }
  };

  // Create callback function when cell is clicked
  var takeMove = function() {

    // Find position of click
    var el = $(this);
    var row = el.attr('row');
    var col = el.attr('col');
    // Check conditions
    if (player === undefined) {
      $msg.html("Please select a player");
    } else if (player !== "incorrect"){
		Game.addMark(player, row, col);
		Game.checkAll(player);
		el.removeClass('player1');
		el.removeClass('player2');
		el.removeClass('player3');
		el.removeClass('player4');
		el.removeClass('incorrect');
		el.addClass(player);
		checkRound("player1");
		checkRound("player2");
		checkRound("player3");
		checkRound("player4");
		checkGame();
    } else {
		el.removeClass('player1');
		el.removeClass('player2');
		el.removeClass('player3');
		el.removeClass('player4');
		el.removeClass('incorrect');
		el.addClass(player);
	}
    return true;
  };

  var resetBoard = function() {
    Game.newBoard(size); // Store the new board in a variable
    $cell.removeClass('player1');
    $cell.removeClass('player2');
    $cell.removeClass('player3');
    $cell.removeClass('player4');
    $cell.removeClass('incorrect');
    $cell.removeClass('win');
    $cell.on('click', takeMove);

    player = undefined;
    $players.on('click', 'button', buttonPlayer);

    $body.addClass('reset');
    $msg.html("Board reset. Pick who goes first").removeClass().addClass('.msg');
    $buttonReset.hide();
  };

  $('button.reset').on('click', resetBoard);
  //
  // $document.on('keypress', function(event) {
  //   if (event.keyCode === 114) {
  //     resetBoard();
  //   }
  // });

}); // jQuery document ready function
