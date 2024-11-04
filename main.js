let correct = 0;
let divDifi = 0;
let multDifi = 0;
let div = 0;
let mult = 0;
let numQuestions = 1;

const questions = document.querySelector(".questions");

function getRandom(uptoIncluding, zeroOrOne) {
    if (zeroOrOne === 0) {
        return Math.floor(Math.random() * (uptoIncluding + 1));   
    } else if (zeroOrOne === 1) {
        return Math.floor(Math.random() * uptoIncluding) + 1;
    }
}

function checkAnswer(correctAnswer, userAnswer) {
    if (userAnswer === correctAnswer) {
        return true;
    } else {
        return false;
    }
}

function getRandomExpression() {
    let num = getRandom(100, 1);
    const lever = getRandom(7, 1) + 1;

    const divOrMult = getRandom(4, 1);
    
    let step = 0;
    let question = "";
    if (divOrMult === 1) {
        mult++;
        question = `${Math.round(num / lever)} x ${lever}`;
        num = Math.round(num / lever) * lever;
    } else if (divOrMult === 2) {
        step = getRandom(9, 1);
        mult++;
        question = `(${Math.round((num - step) / lever)} x ${lever}) + ${step}`;
        num = (Math.round((num - step) / lever) * lever) + step;
    } else if (divOrMult === 3) {
        step = getRandom(9, 1);
        div++;
        question = `(${Math.round((num + step) * lever)} / ${lever}) - ${step}`;
    } else {
        div++;
        question = `${Math.round(num * lever)} / ${lever}`;
    }
    
    console.log(`Number is ${num}`);

    return {"question": question, "answer": num, "type": divOrMult};
}

class Cell {
    constructor() {
        this.questionNumber = document.createElement("h2");
        this.questionNumber.textContent = numQuestions;

        this.cell = document.createElement("div");
        this.cell.classList.add("cell");

        this.question = document.createElement("h1");
        this.question.classList.add("question");

        this.questionBundle = getRandomExpression();
        this.question.textContent = this.questionBundle.question;

        this.answer = document.createElement("input");
        this.answer.classList.add("answer");
        this.answer.setAttribute("type", "number");
        this.answer.setAttribute("placeholder", "Answer...")

        this.theSubmitBtn = new submitBtnContainer(this.questionBundle.answer, this.questionBundle.type).get();

        this.cell.appendChild(this.question);
        this.cell.appendChild(this.answer);
        this.cell.appendChild(this.theSubmitBtn);
    }

    get() {
        return this.cell;
    }
}

class submitBtnContainer {
    constructor(answer, divOrMult) {
        this.btnContainer = document.createElement("div");
        this.btnContainer.classList.add("submit-btn-container");

        this.submitBtn = document.createElement("button");
        this.submitBtn.classList.add("submit-btn");
        this.submitBtn.textContent = "Submit";

        this.btnContainer.appendChild(this.submitBtn);

        this.submitBtn.addEventListener("click", (event) => {
            let btnClicked = event.target;
            const answerInput = event.target.parentNode.parentNode.querySelector(".answer");
            if (btnClicked.textContent === "Submit") {
                if (answerInput.value === "") {
                    answerInput.classList.toggle("red");
                    answerInput.setAttribute("placeholder", "Answer can't be blank")
                    setTimeout(() => {
                        answerInput.classList.toggle("red");
                        answerInput.setAttribute("placeholder", "Answer...")
                    }, 2500);
                } else {
                    this.result = document.createElement("p");
                    this.result.classList.add("result");
                    const userGotItRight = checkAnswer(answer, Math.round(answerInput.value));
                    if (userGotItRight) {
                        correct++;
                        this.result.textContent = "Correct!";
                        this.result.classList.add("correct");
                    } else {
                        if (divOrMult === 1 || divOrMult === 2) {
                            multDifi++;
                        } else if (divOrMult === 3 || divOrMult === 4) {
                            divDifi++;
                        }
                        this.result.textContent = "Wrong!";
                        this.result.classList.add("wrong");
                    }
                    if (numQuestions === 10) {
                        btnClicked.textContent = "Show Summary";
                    } else {
                        btnClicked.textContent = "Next";
                    }
                    this.btnContainer.appendChild(this.result);
                }
            } else if (btnClicked.textContent === "Next") {
                numQuestions++;
                console.log(numQuestions);
                questions.appendChild(new Cell().get());
                answerInput.classList.add("disabled");
                btnClicked.classList.add("disabled");
                btnClicked.textContent = " Next";
            } else if (btnClicked.textContent === "Show Summary") {
                this.totalSummary = document.createElement("p");
                this.totalSummary.innerHTML = `<strong>${correct}/${numQuestions}</strong> Questions Correct!`;
                this.totalSummary.classList.add("summary-para");

                this.multDifiPara = document.createElement("p");
                this.multDifiPara.innerHTML = `<strong>${mult - multDifi}/${mult}</strong> Multiplication Questions Correct!`;
                this.multDifiPara.classList.add("summary-para");

                this.divDifiPara = document.createElement("p");
                this.divDifiPara.innerHTML = `<strong>${div - divDifi}/${div}</strong> Division Questions Correct!`;
                this.divDifiPara.classList.add("summary-para");

                this.summanryCell = document.createElement("div");
                this.summanryCell.classList.add("cell");

                this.summanryCell.appendChild(this.totalSummary);
                this.summanryCell.appendChild(this.divDifiPara);
                this.summanryCell.appendChild(this.multDifiPara);

                this.feedback = [];

                if (multDifi > 3) {
                    this.feedback.push("You need to work on your Multiplication!");
                } else if ((mult - multDifi) > 3) {
                    this.feedback.push("Your Multiplication is great!");
                }

                if (divDifi > 3) {
                    this.feedback.push("You need to work on your Division!");
                } else if ((div - divDifi) > 3) {
                    this.feedback.push("Your Division is great!");
                }

                if (correct > 8) {
                    this.feedback.push("Amazing!!!");
                }

                for (let feedbac of this.feedback) {
                    this.feedbackPara = document.createElement("p");
                    this.feedbackPara.textContent = feedbac;
                    this.feedbackPara.classList.add("summary-para");
                    this.summanryCell.appendChild(this.feedbackPara);
                    btnClicked.classList.add("disabled");
                    btnClicked.textContent = " Show Summary";
                }

                questions.appendChild(this.summanryCell);
            }
        });
    }

    get() {
        return this.btnContainer;
    }
}

questions.appendChild(new Cell().get());
