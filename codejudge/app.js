const apiURL = 'http://3.88.27.174:4060'; 


function fetchQuizzes() {
  fetch(apiURL + '/api/quiz/all', {
    headers: {
      'auth-token': '19c4ff12-e027-4320-b844-2cda768714e8',
      'content-type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => displayQuizzes(data))
    .catch(error => console.error('Error:', error));
}

function displayQuizzes(quizzes) {
  const quizList = document.getElementById('quiz-list');

  quizzes.forEach(quiz => {
    const li = document.createElement('li');
    li.innerText = quiz.name;
    li.addEventListener('click', () => startQuiz(quiz.id));
    quizList.appendChild(li);
  });
}

// Start a quiz
function startQuiz(quizId) {
  // Hide the quiz list and show the quiz questions
  document.querySelector('.quiz-list').style.display = 'none';
  document.querySelector('.quiz-questions').style.display = 'block';

  // Fetch quiz questions from the backend
  fetch(apiURL + '/api/quiz-questions/all/' + quizId, {
    headers: {
      'auth-token': '19c4ff12-e027-4320-b844-2cda768714e8',
      'content-type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => displayQuizQuestions(data))
    .catch(error => console.error('Error:', error));
}

// Display quiz questions on the page
function displayQuizQuestions(quiz) {
  const quizName = document.getElementById('quiz-name');
  const questionContainer = document.getElementById('question-container');
  const timer = document.getElementById('timer');
  const nextBtn = document.getElementById('next-btn');
  const scoreValue = document.getElementById('score-value');

  let currentQuestionIndex = 0;
  let score = 0;
  let timeLeft = 15;

  function startTimer() {
    const timerInterval = setInterval(() => {
      timeLeft--;
      timer.innerText = `Time Left: ${timeLeft}s`;

      if (timeLeft === 0) {
        clearInterval(timerInterval);
        showNextQuestion();
      }
    }, 1000);
  }

  function showNextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < quiz.questions.length) {
      displayQuestion();
      timeLeft = 15;
      startTimer();
    } else {
      // All questions answered, show the final score
      questionContainer.innerHTML = '';
      timer.innerText = '';
      nextBtn.style.display = 'none';
      scoreValue.innerText = score;
    }
  }

  function displayQuestion() {
    const question = quiz.questions[currentQuestionIndex];
    const options = question.options.split(',');

    quizName.innerText = quiz.name;
    questionContainer.innerHTML = '';

    const questionElement = document.createElement('h3');
    questionElement.innerText = question.name;
    questionContainer.appendChild(questionElement);

    options.forEach((option, index) => {
      const optionElement = document.createElement('div');
      optionElement.classList.add('answer-value-' + (index + 1));
      optionElement.innerText = option;
      optionElement.addEventListener('click', () => {
        score += question.points;
        scoreValue.innerText = score;
        showNextQuestion();
      });
      questionContainer.appendChild(optionElement);
    });
  }

  displayQuestion();
  startTimer();
}

// Fetch quizzes when the page loads
document.addEventListener('DOMContentLoaded', fetchQuizzes);
