// ===== NUMBER GUESSING GAME =====

let secretNumber = 0;
let attempts = 0;
let bestScore = null;
let gameOver = false;
let guessHistory = [];
let low = 1;
let high = 100;

// Initialize on page load
window.addEventListener('DOMContentLoaded', function () {
  startNewGame();

  // Allow Enter key to submit
  const input = document.getElementById('guess-input');
  if (input) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') submitGuess();
    });
  }
});

function startNewGame() {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  gameOver = false;
  guessHistory = [];
  low = 1;
  high = 100;

  // Reset UI
  updateAttempts(0);
  updateRange(1, 100);
  setHint('default', '?', 'Make your first guess to get started!');
  setTempMeter(0);
  clearHistory();
  clearError();

  document.getElementById('guess-input').value = '';
  document.getElementById('guess-input').disabled = false;
  document.getElementById('submit-btn').disabled = false;
  document.getElementById('win-state').style.display = 'none';
  document.getElementById('guess-area').style.display = 'flex';
  document.getElementById('game-actions').style.display = 'flex';
  document.getElementById('guess-input').focus();

  // Update best score display
  const bestEl = document.getElementById('best-score');
  bestEl.textContent = bestScore !== null ? bestScore + ' tries' : '--';
}

function submitGuess() {
  if (gameOver) return;

  const input = document.getElementById('guess-input');
  const rawValue = input.value.trim();
  const guess = parseInt(rawValue);

  // Validation
  clearError();
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

  const distance = Math.abs(guess - secretNumber);
  const warmth = getWarmth(distance);

  if (guess < secretNumber) {
    // Too low
    if (guess > low) low = guess;
    updateRange(low, high);
    setHint('low', 'up', 'Too low! Try a higher number.');
    addToHistory(guess, 'low', 'up');
    setTempMeter(warmth);
  } else if (guess > secretNumber) {
    // Too high
    if (guess < high) high = guess;
    updateRange(low, high);
    setHint('high', 'dn', 'Too high! Try a lower number.');
    addToHistory(guess, 'high', 'dn');
    setTempMeter(warmth);
  } else {
    // Correct!
    setHint('win', 'win', 'You found it! The number was ' + secretNumber + '.');
    addToHistory(guess, 'correct', 'ok');
    setTempMeter(100);
    handleWin();
  }

  input.value = '';
  input.focus();
}

function handleWin() {
  gameOver = true;

  if (bestScore === null || attempts < bestScore) {
    bestScore = attempts;
  }

  const bestEl = document.getElementById('best-score');
  bestEl.textContent = bestScore + ' tries';

  let rating = '';
  if (attempts <= 4) rating = 'Incredible! Expert level.';
  else if (attempts <= 7) rating = 'Great job! Very impressive.';
  else if (attempts <= 10) rating = 'Good work! You figured it out.';
  else rating = 'Well done! You got there in the end.';

  document.getElementById('win-message').textContent =
    'You guessed the number ' + secretNumber + ' in ' + attempts + ' attempt' + (attempts === 1 ? '' : 's') + '. ' + rating;

  document.getElementById('win-state').style.display = 'block';
  document.getElementById('guess-area').style.display = 'none';
  document.getElementById('game-actions').style.display = 'none';
  document.getElementById('guess-input').disabled = true;
  document.getElementById('submit-btn').disabled = true;
}

function resetGame() {
  startNewGame();
}

// ===== HELPERS =====

function getWarmth(distance) {
  // 0 = cold (distance 50+), 100 = hot (distance 0)
  if (distance === 0) return 100;
  if (distance >= 50) return 0;
  return Math.round(((50 - distance) / 50) * 100);
}

function setTempMeter(warmth) {
  const fill = document.getElementById('temp-fill');
  fill.style.width = warmth + '%';

  if (warmth < 25) {
    fill.style.background = '#90c8f0'; // cold blue
  } else if (warmth < 50) {
    fill.style.background = '#b5ead7'; // lukewarm mint
  } else if (warmth < 75) {
    fill.style.background = '#fdd9b5'; // warm peach
  } else {
    fill.style.background = '#f9c6d0'; // hot pink
  }
}

function setHint(type, iconText, message) {
  const box = document.getElementById('hint-box');
  const icon = document.getElementById('hint-icon');
  const text = document.getElementById('hint-text');

  box.className = 'hint-box';
  icon.textContent = '?';

  if (type === 'high') {
    box.classList.add('hint-high');
    icon.textContent = 'v';
    icon.style.transform = 'rotate(0deg)';
  } else if (type === 'low') {
    box.classList.add('hint-low');
    icon.textContent = '^';
  } else if (type === 'win') {
    box.classList.add('hint-win');
    icon.textContent = 'ok';
    icon.style.fontSize = '0.75rem';
  } else {
    icon.style.fontSize = '1.1rem';
    icon.style.transform = '';
  }

  text.textContent = message;
}

function updateAttempts(n) {
  document.getElementById('attempts').textContent = n;
}

function updateRange(lo, hi) {
  document.getElementById('range-display').textContent = lo + ' - ' + hi;
}

function clearHistory() {
  const list = document.getElementById('history-list');
  list.innerHTML = '<p class="no-guesses">No guesses yet. Give it a try!</p>';
}

function addToHistory(guess, type, arrow) {
  const list = document.getElementById('history-list');

  // Remove the "no guesses" placeholder if present
  const placeholder = list.querySelector('.no-guesses');
  if (placeholder) placeholder.remove();

  const chip = document.createElement('div');
  chip.className = 'history-chip ' + type;

  let arrowChar = '';
  if (type === 'low') arrowChar = ' ^';
  else if (type === 'high') arrowChar = ' v';
  else arrowChar = ' ok';

  chip.innerHTML = '<span>' + guess + '</span><span class="chip-arrow">' + arrowChar + '</span>';
  list.appendChild(chip);
}

function showError(msg) {
  document.getElementById('input-error').textContent = msg;
}

function clearError() {
  document.getElementById('input-error').textContent = '';
  const input = document.getElementById('guess-input');
  if (input) input.classList.remove('input-err');
}
