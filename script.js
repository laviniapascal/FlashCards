const addQuestionBtn = document.getElementById("show-btn");
const questionCard = document.querySelector(".question-card");
const closeFormBtn = document.querySelector(".close-btn");
const questionForm = document.getElementById("question-form");
const errorMessage = document.querySelector(".feedback");
const questionInput = document.getElementById("question-input");
const answerInput = document.getElementById("answer-input");
const questionList = document.getElementById("questions-list");

function getDataLocalStorage() {
  return JSON.parse(localStorage.getItem("flash-cards")) || {};
}

function updateLocalStorage(data) {
  localStorage.setItem("flash-cards", JSON.stringify(data));
}

addQuestionBtn.addEventListener("click", () => {
  questionCard.classList.add("showItem");
});

closeFormBtn.addEventListener("click", () => {
  questionCard.classList.remove("showItem");
});

let questions = getDataLocalStorage(); // {}
let questionId = null;

questionForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const qValue = questionInput.value.trim();
  const aValue = answerInput.value.trim();

  if (qValue !== "" || aValue !== "") {
    if (questionId) {
      questions[questionId].question = qValue;
      questions[questionId].answer = aValue;
    } else {
      const newId = Object.keys(questions).length
        ? Math.max(...Object.keys(questions)) + 1
        : 1;

      const newQuestion = {
        question: qValue,
        answer: aValue,
      };

      questions[newId] = newQuestion;
    }

    updateLocalStorage(questions);
    generateQuestionList();
    clearFields();
    questionId = null;
  } else {
    errorMessage.classList.add("showItem", "alert-danger");
    errorMessage.textContent = "cannot add empty values";

    setTimeout(() => {
      errorMessage.classList.remove("showItem", "alert-danger");
    }, 2000);
  }
});

function clearFields() {
  questionInput.value = "";
  answerInput.value = "";
}

function generateQuestionList() {
  questionList.innerHTML = "";

  for (const [key, value] of Object.entries(questions)) {
    generateQuestionListItem(key, value);
  }
}

function generateQuestionListItem(id, value) {
  const { question, answer } = value;

  const newQItem = `
        <div class="col-md-4">
          <div class="card card-body flashcard my-3">
            <h4 class="text-capitalize">${question}</h4>
            <a href="#" onclick="toggleShowAnswer(event)" class="text-capitalize my-3 show-answer"
              >show/hide answer</a
            >
            <h5 class="answer mb-3">${answer}</h5>
            <div class="flashcard-btn d-flex justify-content-between">
              <a
                href="#"
                onclick="editQuestion(${id})"
                id="edit-flashcard"
                class="btn my-1 edit-flashcard text-uppercase"
                data-id=""
                >edit</a
              >
              <a
                href="#"
                onclick="deleteQuestion(${id})"
                id="delete-flashcard"
                class="btn my-1 delete-flashcard text-uppercase"
                >delete</a
              >
            </div>
          </div>
        </div>
    `;

  questionList.innerHTML += newQItem;
}

function deleteQuestion(id) {
  delete questions[id];

  updateLocalStorage(questions);
  generateQuestionList();
}

function editQuestion(id) {
  questionCard.classList.add("showItem");

  questionId = id;

  questionInput.value = questions[id].question;
  answerInput.value = questions[id].answer;
}

generateQuestionList();

function toggleShowAnswer(e) {
  e.target.nextElementSibling.classList.toggle("showItem");
}
