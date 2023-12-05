function printHighscores() {
  // either get scores from local storage or set to an empty array
  var highscores = JSON.parse(window.localStorage.getItem('highscores')) || [];

  // sort highscores by the score property in descending order
  highscores.sort(function (a, b) {
    return b.score - a.score;
  });

  // create a container for the high scores
  var scoresContainer = document.createElement('div');
  scoresContainer.classList.add('high-scores-container'); // Add a class for styling

  for (var i = 0; i < highscores.length; i += 1) {
    // create a div for each high score
    var scoreDiv = document.createElement('div');
    scoreDiv.classList.add('score-item'); // Add a class for styling

    // display initials and score
    var initialsSpan = document.createElement('span');
    initialsSpan.textContent = highscores[i].initials;
    initialsSpan.classList.add('initials'); // Add a class for styling

    var scoreSpan = document.createElement('span');
    scoreSpan.textContent = highscores[i].score;
    scoreSpan.classList.add('score'); // Add a class for styling

    // append initials and score to the score item div
    scoreDiv.appendChild(initialsSpan);
    scoreDiv.appendChild(scoreSpan);

    // append the score item div to the scores container
    scoresContainer.appendChild(scoreDiv);
  }

  // append the scores container to the page
  var scoresContainerWrapper = document.getElementById('highscores');
  scoresContainerWrapper.innerHTML = ''; // Clear existing content
  scoresContainerWrapper.appendChild(scoresContainer);
}

function clearHighscores() {
  window.localStorage.removeItem('highscores');
  window.location.reload();
}

document.getElementById('clear').onclick = clearHighscores;

// run the printHighscores function when the page loads
printHighscores();
