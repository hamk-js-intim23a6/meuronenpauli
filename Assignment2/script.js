document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quizContainer');
    const quizForm = document.getElementById('quizForm');
    const resultContainer = document.getElementById('result');
  
    let questionsData = [];
  
    /**
     * Fetches quiz questions from JSON and loads them into the form.
     */
    function loadQuiz() {
      fetch('questions.json')
          .then((response) => response.json())
          .then((questions) => {
            questionsData = questions;
            quizContainer.innerHTML = '';
  
            questions.forEach((questionObj, index) => {
              const questionHtml = `
                      <div class="mb-3" id="question${index}">
                          <p><strong>${index + 1}. ${questionObj.question}</strong></p>
                          ${questionObj.options.map((option) => `
                              <div class="form-check">
                                  <input class="form-check-input" type="radio" 
                                         name="q${index}" value="${option}" id="q${index}_${option}">
                                  <label class="form-check-label" for="q${index}_${option}">${option}</label>
                                  <span class="feedback"></span>
                              </div>
                          `).join('')}
                      </div>
                  `;
              quizContainer.innerHTML += questionHtml;
            });
  
            // Hide result container and reset the "Try Again" button if it exists
            resultContainer.innerHTML = '';
            const restartButton = document.getElementById('restartButton');
            if (restartButton) {
              restartButton.remove();
            }
          })
          .catch((error) => console.error('Error loading quiz questions:', error));
    }
  
    // Load the quiz when the page loads
    loadQuiz();
  
    /**
     * Handles quiz submission and evaluates answers.
     * @param {Event} event - The form submission event.
     */
    function handleQuizSubmission(event) {
      event.preventDefault();
  
      let score = 0;
      let unanswered = false;
  
      questionsData.forEach((questionObj, index) => {
        const selectedAnswer = document.querySelector(`input[name="q${index}"]:checked`);
  
        // Clear previous feedback for all options in this question
        document.querySelectorAll(`#question${index} .feedback`)
            .forEach((feedback) => feedback.textContent = '');
  
        if (!selectedAnswer) {
          unanswered = true;
          return;
        }
  
        const feedbackElement = selectedAnswer.parentElement.querySelector('.feedback');
  
        if (selectedAnswer.value === questionObj.answer) {
          score++;
          feedbackElement.textContent = '✔ Correct';
          feedbackElement.style.color = 'green';
        } else {
          feedbackElement.textContent = '✘ Wrong';
          feedbackElement.style.color = 'red';
        }
      });
  
      if (unanswered) {
        resultContainer.innerHTML = '<p class="text-danger">Please answer all questions before submitting.</p>';
      } else {
        resultContainer.innerHTML = `<p class="text-success">You got ${score} out of ${questionsData.length} correct!</p>`;
  
        // Show Restart Button
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Try Again!';
        restartButton.classList.add('btn', 'btn-secondary', 'mt-3');
        restartButton.id = 'restartButton';
        restartButton.addEventListener('click', loadQuiz);
        resultContainer.appendChild(restartButton);
      }
    }
  
    // Attach event listener to the quiz form
    quizForm.addEventListener('submit', handleQuizSubmission);
  });
  