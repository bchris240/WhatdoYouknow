// Quiz state variables
var currentQuestionIndex = 0; // Index to track the current question
var time = questions.length * 15; // Initial time for the quiz
var timerId; // Variable to store the timer ID

// DOM element references
var questionsEl = document.getElementById('questions'); // Questions section container
var timerEl = document.getElementById('time'); // Timer display
var choicesEl = document.getElementById('choices'); // Choices container
var submitBtn = document.getElementById('submit'); // Submit button
var startBtn = document.getElementById('start'); // Start button
var initialsEl = document.getElementById('initials'); // Input for user initials
var feedbackEl = document.getElementById('feedback'); // Feedback display

// Sound effects
var sfxRight = new Audio('Assets/Sound/correct.wav'); // Sound for correct answer
var sfxWrong = new Audio('Assets/Sound/incorrect.wav'); // Sound for incorrect answer

// Function to start the quiz
function startQuiz() {
  // Hide the start screen
  var startScreenEl = document.getElementById('start-screen');
  startScreenEl.setAttribute('class', 'hide');

  // Un-hide the questions section
  questionsEl.removeAttribute('class');

  // Start the timer
  timerId = setInterval(clockTick, 1000);

  // Display starting time
  timerEl.textContent = time;

  // Load the first question
  getQuestion();
}

// Function to load a question
function getQuestion() {
  // Get the current question object from the array
  var currentQuestion = questions[currentQuestionIndex];

  // Update title with the current question
  var titleEl = document.getElementById('question-title');
  titleEl.textContent = currentQuestion.title;

  // Clear out any old question choices
  choicesEl.innerHTML = '';

  // Loop over choices and create buttons
  for (var i = 0; i < currentQuestion.choices.length; i++) {
    var choice = currentQuestion.choices[i];
    var choiceNode = document.createElement('button');
    choiceNode.setAttribute('class', 'choice');
    choiceNode.setAttribute('value', choice);
    choiceNode.textContent = i + 1 + '. ' + choice;

    // Display on the page
    choicesEl.appendChild(choiceNode);
  }
}

// Function to handle user's choice
function questionClick(event) {
  var buttonEl = event.target;

  // If the clicked element is not a choice button, do nothing
  if (!buttonEl.matches('.choice')) {
    return;
  }

  // Check if the user guessed wrong
  if (buttonEl.value !== questions[currentQuestionIndex].answer) {
    // Penalize time for wrong answers
    time -= 15;

    // Ensure time doesn't go below zero
    if (time < 0) {
      time = 0;
    }

    // Display new time on the page
    timerEl.textContent = time;

    // Play "wrong" sound effect
    sfxWrong.play();

    // Display wrong feedback
    feedbackEl.textContent = 'Wrong!';
  } else {
    // Play "right" sound effect
    sfxRight.play();

    // Display correct feedback
    feedbackEl.textContent = 'Correct!';
  }

  // Flash right/wrong feedback on the page for half a second
  feedbackEl.setAttribute('class', 'feedback');
  setTimeout(function () {
    feedbackEl.setAttribute('class', 'feedback hide');
  }, 1000);

  // Move to the next question
  currentQuestionIndex++;

  // Check if we've run out of questions
  if (time <= 0 || currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

// Function to end the quiz
function quizEnd() {
  // Stop the timer
  clearInterval(timerId);

  // Show the end screen
  var endScreenEl = document.getElementById('end-screen');
  endScreenEl.removeAttribute('class');

  // Display the final score
  var finalScoreEl = document.getElementById('final-score');
  finalScoreEl.textContent = time;

  // Hide the questions section
  questionsEl.setAttribute('class', 'hide');

  // Display high scores
  displayHighscores();
}

// Function to update the timer
function clockTick() {
  // Update the time every second
  time--;

  // Display the updated time on the page
  timerEl.textContent = time;

  // Check if the user ran out of time
  if (time <= 0) {
    quizEnd();
  }
}

// Function to save the user's highscore
function saveHighscore() {
  // Get the value of the input box (user's initials)
  var initials = initialsEl.value.trim();

  // Make sure the value wasn't empty
  if (initials !== '') {
    // Get saved scores from local storage, or if none, set to an empty array
    var highscores = JSON.parse(window.localStorage.getItem('highscores')) || [];

    // Create a new high score object
    var newHighscore = {
      initials: initials,
      score: time
    };

    // Add the new high score to the array
    highscores.push(newHighscore);

    // Sort the high scores in descending order
    highscores.sort(function (a, b) {
      return b.score - a.score;
    });

    // Store the high scores in local storage
    window.localStorage.setItem('highscores', JSON.stringify(highscores));

    // Display high scores
    displayHighscores();
  }
}

// Function to display high scores
function displayHighscores() {
  // Get the high scores container element
  var highscoresContainer = document.getElementById('highscores-container');

  // Clear existing content in the container
  highscoresContainer.innerHTML = '';

  // Get saved scores from local storage, or if none, set to an empty array
  var highscores = JSON.parse(window.localStorage.getItem('highscores')) || [];

  // Create a list element for each high score and append it to the container
  highscores.forEach(function (score) {
    var scoreItem = document.createElement('li');
    scoreItem.textContent = score.initials + ' - ' + score.score;
    highscoresContainer.appendChild(scoreItem);
  });
}

// Event listener for the start button to initiate the quiz
startBtn.addEventListener('click', startQuiz);

// Event delegation for the choices container
choicesEl.addEventListener('click', questionClick);

// Event listener for the submit button to save high score
submitBtn.addEventListener('click', saveHighscore);
