// ===== NUMBER GUESSING GAME =====

// Game state variables
var secretNumber = 0;   // the number the player must guess
var attempts     = 0;   // how many guesses so far
var bestScore    = null; // fewest guesses ever (saved during the session)
var gameOver     = false;
var low  = 1;   // lowest possible answer (narrows as player guesses)
var high = 100; // highest possible answer

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', function () {
  startNewGame();

  // Also allow pressing Enter key to submit a guess
  document.getElementById('guess-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') submitGuess();
  });
});

// ===== START / RESET =====
function startNewGame() {
  // Pick a random number between 1 and 100
  secretNumber = Math.floor(Math.random() * 100) + 1;

  // Reset all tracking variables
  attempts = 0;
  gameOver = false;
  low  = 1;
  high = 100;

  // Reset the UI
  updateAttempts(0);
  updateRange(1, 100);
  setHint('default', '?', 'Make your first guess to get started!');
  clearHistory();
  clearError();

  document.getElementById('guess-input').value    = '';
  document.getElementById('guess-input').disabled = false;
  document.getElementById('submit-btn').disabled  = false;
  document.getElementById('win-state').style.display    = 'none';
  document.getElementById('guess-area').style.display   = 'flex';
  document.getElementById('game-actions').style.display = 'flex';
  document.getElementById('guess-input').focus();

  // Show best score (or dash if no games finished yet)
  document.getElementById('best-score').textContent =
    bestScore !== null ? bestScore + ' tries' : '—';
}

// ===== HANDLE A GUESS =====
function submitGuess() {
  if (gameOver) return; // ignore clicks after game ends

  var input    = document.getElementById('guess-input');
  var rawValue = input.value.trim();
  var guess    = parseInt(rawValue); // convert text to number

  clearError();

  // Validate: must be a number between 1 and 100
  if (rawValue === '' || isNaN(guess)) {
    showError('Please enter a number.');
    input.classList.add('input-err');
    input.focus();
    return;
  }
  if (guess < 1 || guess > 100) {
    showError('Number must be between 1 and 100.');
    input.classList.add('input-err');
    input.focus();
    return;
  }

  input.classList.remove('input-err');
  attempts++;
  updateAttempts(attempts);

  // Compare guess to secret number
  if (guess < secretNumber) {
    if (guess > low) low = guess; // narrow the range
    updateRange(low, high);
    setHint('low', '↑', 'Too low! Try a higher number.');
    addToHistory(guess, 'low', '↑');

  } else if (guess > secretNumber) {
    if (guess < high) high = guess; // narrow the range
    updateRange(low, high);
    setHint('high', '↓', 'Too high! Try a lower number.');
    addToHistory(guess, 'high', '↓');

  } else {
    // Correct!
    setHint('win', '✓', 'You found it!');
    addToHistory(guess, 'correct', '✓');
    handleWin();
  }

  input.value = '';
  input.focus();
}

// ===== HANDLE WIN =====
function handleWin() {
  gameOver = true;

  // Update best score if this game was better
  if (bestScore === null || attempts < bestScore) {
    bestScore = attempts;
  }
  document.getElementById('best-score').textContent = bestScore + ' tries';

  // Choose a rating message based on number of attempts
  var rating;
  if      (attempts <= 4)  rating = 'Incredible! Expert level! 🎉';
  else if (attempts <= 7)  rating = 'Great job! Very impressive! 👏';
  else if (attempts <= 10) rating = 'Well done! You figured it out! 😊';
  else                     rating = 'You got there in the end! 💪';

  var plural = attempts === 1 ? '' : 's'; // "1 attempt" vs "2 attempts"
  document.getElementById('win-message').textContent =
    'You found ' + secretNumber + ' in ' + attempts + ' attempt' + plural + '. ' + rating;

  // Show win banner, hide input area
  document.getElementById('win-state').style.display    = 'block';
  document.getElementById('guess-area').style.display   = 'none';
  document.getElementById('game-actions').style.display = 'none';
  document.getElementById('guess-input').disabled       = true;
  document.getElementById('submit-btn').disabled        = true;
}

// Called by the "Play Again" and "Start New Game" buttons
function resetGame() {
  startNewGame();
}

// ===== HELPER FUNCTIONS =====

// Update the hint box colour and message
function setHint(type, iconText, message) {
  var box  = document.getElementById('hint-box');
  var icon = document.getElementById('hint-icon');
  var text = document.getElementById('hint-text');

  // Reset classes, then add the right one
  box.className    = 'hint-box';
  icon.textContent = iconText;
  text.textContent = message;

  if (type === 'high') box.classList.add('hint-high');
  if (type === 'low')  box.classList.add('hint-low');
  if (type === 'win')  box.classList.add('hint-win');
}

function updateAttempts(n) {
  document.getElementById('attempts').textContent = n;
}

function updateRange(lo, hi) {
  document.getElementById('range-display').textContent = lo + ' – ' + hi;
}

function clearHistory() {
  document.getElementById('history-list').innerHTML =
    '<p class="no-guesses">No guesses yet — give it a try!</p>';
}

// Add a new chip to the guess history list
function addToHistory(guess, type, symbol) {
  var list = document.getElementById('history-list');

  // Remove the placeholder text on the first guess
  var placeholder = list.querySelector('.no-guesses');
  if (placeholder) placeholder.remove();

  var chip = document.createElement('div');
  chip.className = 'history-chip ' + type;
  chip.innerHTML = '<span>' + guess + '</span><span>' + symbol + '</span>';
  list.appendChild(chip);
}

function showError(msg) {
  document.getElementById('input-error').textContent = msg;
}

function clearError() {
  document.getElementById('input-error').textContent = '';
  document.getElementById('guess-input').classList.remove('input-err');
}