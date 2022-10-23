function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}
function getRandomInt_multi(max) {
  return Math.floor(Math.random() * max) + 10;
}
function getRandomInt_plus(max) {
  return Math.floor(Math.random() * max) + 100;
}

let num_question_type;
let num1;
let num2;
let num3;
let num_plus_or_minus;
let num_answer_position;
let question = document.querySelector("#question_container p:nth-child(2)");
const answer_boxes = document.querySelectorAll(".answer");
const success_popup = document.getElementById("success");
const error_popup = document.getElementById("error");
const s_close = document.getElementById("s_button");
const e_close = document.getElementById("e_button");
let count_correct = document.querySelector(
  "#count_cointainer .counts p:nth-child(1) #count_no"
);
let correct_no = 0;
count_correct.textContent = correct_no;
let count_wrong = document.querySelector(
  "#count_cointainer .counts p:nth-child(2) #count_no"
);
let wrong_no = 0;
count_wrong.textContent = wrong_no;

generateQuestion();

function generateQuestion() {
  num_question_type = getRandomInt(100);
  num1 = getRandomInt_multi(20);
  num2 = getRandomInt_multi(20);
  num3 = getRandomInt_plus(100);
  num_plus_or_minus = getRandomInt(2);
  num_answer_position = getRandomInt(3);

  if (num_question_type < 25) {
    question.textContent = `${num1} * ${num2}`;
  } else if (num_question_type < 50) {
    question.textContent = `${num1} * ${num2} + ${num3}`;
  } else if (num_question_type < 75) {
    question.textContent = `${num1} * ${num2} - ${num3}`;
  } else {
    if ((num_plus_or_minus = 1)) {
      question.textContent = `${num3} + ${num1} - ${num2}`;
    } else if ((num_plus_or_minus = 2)) {
      question.textContent = `${num3} - ${num1} + ${num2}`;
    }
  }
  if ((num_answer_position = 1)) {
    answer_boxes[0].textContent = returnAnswer();
    answer_boxes[1].textContent = returnAnswer() + 10;
    answer_boxes[2].textContent = returnAnswer() - 10;
  } else if ((num_answer_position = 2)) {
    answer_boxes[0].textContent = returnAnswer() + 10;
    answer_boxes[1].textContent = returnAnswer();
    answer_boxes[2].textContent = returnAnswer() - 10;
  } else {
    answer_boxes[0].textContent = returnAnswer() + 10;
    answer_boxes[1].textContent = returnAnswer() - 10;
    answer_boxes[2].textContent = returnAnswer();
  }
}

s_close.onclick = function () {
  success_popup.style.display = "none";
};
e_close.onclick = function () {
  error_popup.style.display = "none";
};
for (let [index, answer_box] of answer_boxes.entries()) {
  answer_box.addEventListener("click", () => {
    if (returnAnswer() == parseInt(answer_box.textContent)) {
      success_popup.style.display = "block";
      correct_no += 1;
      count_correct.textContent = correct_no;
      setTimeout(() => {
        generateQuestion();
      }, 1000);
    } else {
      error_popup.style.display = "block";
      wrong_no += 1;
      count_wrong.textContent = wrong_no;
    }
  });
}

function returnAnswer() {
  let answer;
  if (num_question_type < 25) {
    answer = num1 * num2;
  } else if (num_question_type < 50) {
    answer = num1 * num2 + num3;
  } else if (num_question_type < 75) {
    answer = num1 * num2 - num3;
  } else {
    if ((num_plus_or_minus = 1)) {
      answer = num3 + num1 - num2;
    } else if ((num_plus_or_minus = 2)) {
      answer = num3 - num1 + num2;
    }
  }
  return answer;
}
