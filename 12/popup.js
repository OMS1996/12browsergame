class Game {
    constructor(targetNumber, opponent) {
      this.targetNumber = targetNumber;
      this.opponent = opponent;
      this.currentSum = 0;
      this.currentPlayer = Math.random() < 0.5 ? 'You' : 'Opponent';
      this.winner = null;
    }
  
    play(choice) {
      const [lower, upper] = choice;
      this.currentSum = upper;
  
      if (this.currentSum === this.targetNumber) {
        this.winner = this.currentPlayer;
      } else {
        this.currentPlayer = this.currentPlayer === 'You' ? 'Opponent' : 'You';
      }
  
      return true;
    }
  
    getChoices() {
      const lowerChoice = this.currentSum + 1;
      const upperChoice = Math.min(this.currentSum + 2, this.targetNumber);
  
      if (lowerChoice === upperChoice) {
        return [[lowerChoice, lowerChoice]];
      } else {
        return [[lowerChoice, lowerChoice], [lowerChoice, upperChoice]];
      }
    }
  
    computerPlay() {
      if (this.opponent === 'computer-easy') {
        return this.computerPlayEasy();
      } else if (this.opponent === 'computer-impossible') {
        return this.computerPlayImpossible();
      }
    }
  
    computerPlayEasy() {
      const choices = this.getChoices();
      return choices[Math.floor(Math.random() * choices.length)];
    }
  
    computerPlayImpossible() {
      const choices = this.getChoices();
      const targetMod3 = this.targetNumber % 3;
  
      if (choices.length === 1) {
        return choices[0];
      }
  
      const [lower, upper] = choices[1];
      const sumAfterLower = lower;
      const sumAfterUpper = upper;
  
      if (sumAfterUpper % 3 === targetMod3) {
        return choices[1]; // Choose upper (two numbers)
      } else if (sumAfterLower % 3 === targetMod3) {
        return choices[0]; // Choose lower (one number)
      } else {
        // If no winning move, choose randomly
        return choices[Math.floor(Math.random() * choices.length)];
      }
    }
  }
  
  let game;
  
  function initGame() {
    const targetNumber = parseInt(document.getElementById('target').value);
    const opponent = document.getElementById('opponent').value;
    game = new Game(targetNumber, opponent);
    updateUI();
    let opponentType = opponent === 'friend' ? 'Local Friend' : 'Computer';
    let difficulty = opponent.includes('impossible') ? '(Impossible)' : opponent.includes('easy') ? '(Easy)' : '';
    updateCommentary(`Game started! The target is ${targetNumber}. You're playing against ${opponentType} ${difficulty}. ${game.currentPlayer} goes first.`);
    
    // Trigger computer move if computer goes first
    if (game.currentPlayer === 'Opponent' && game.opponent.startsWith('computer')) {
      const computerChoice = game.computerPlay();
      playMove(computerChoice);
    }
  }
  
  function updateUI() {
    document.getElementById('target-number').textContent = game.targetNumber;
    document.getElementById('current-sum').textContent = game.currentSum;
    document.getElementById('current-player').textContent = game.currentPlayer;
  
    const choicesElement = document.getElementById('choices');
    choicesElement.innerHTML = '';
  
    if (game.currentPlayer === 'You' && !game.winner) {
      const choices = game.getChoices();
      choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice[0] === choice[1] ? choice[0] : `${choice[0]},${choice[1]}`;
        button.addEventListener('click', () => playMove(choice));
        choicesElement.appendChild(button);
      });
    } else if (game.currentPlayer === 'Opponent' && !game.winner) {
      choicesElement.textContent = 'Opponent is thinking...';
    }
  
    document.getElementById('result').textContent = game.winner ? `${game.winner} wins!` : '';
  }
  
  function updateCommentary(message) {
    document.getElementById('commentary').textContent = message;
  }
  
  function playMove(choice) {
    const previousSum = game.currentSum;
    const previousPlayer = game.currentPlayer;
  
    if (game.play(choice)) {
      let commentary = `${previousPlayer} chose `;
      commentary += choice[0] === choice[1] ? choice[0] : `${choice[0]},${choice[1]}`;
      commentary += `. The sum increased from ${previousSum} to ${game.currentSum}. `;
      
      if (game.winner) {
        commentary += `${game.winner} wins!`;
        document.getElementById('choices').innerHTML = '';
        showWinAnimation();
      } else {
        commentary += `It's now ${game.currentPlayer}'s turn.`;
      }
      
      updateCommentary(commentary);
      updateUI();
  
      // Schedule computer's move only if it's the computer's turn and the game hasn't ended
      if (!game.winner && game.currentPlayer === 'Opponent' && game.opponent.startsWith('computer')) {
        const computerChoice = game.computerPlay();
        playMove(computerChoice);
      }
    }
  }
  
  function showWinAnimation() {
    const winAnimation = document.getElementById('win-animation');
    winAnimation.style.display = 'block';
    setTimeout(() => {
      winAnimation.style.display = 'none';
    }, 3000);
  }
  
  document.getElementById('start-game').addEventListener('click', () => {
    document.getElementById('setup').style.display = 'none';
    document.getElementById('game-play').style.display = 'block';
    initGame();
  });
  
  document.getElementById('new-game').addEventListener('click', () => {
    document.getElementById('setup').style.display = 'block';
    document.getElementById('game-play').style.display = 'none';
  });
  