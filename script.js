/* ════════════════════════════════════════════════════════
   CARDS DATA
   ─────────────────────────────────────────────────────
   HOW TO CUSTOMIZE:
   1. Palitan ang "img" ng URL ng picture mo
      - Pwede local file:  img: "images/iyong-picture.jpg"
      - Pwede online URL:  img: "https://..."
   2. Palitan ang "label" ng pangalan ng card
   3. Palitan ang "question" ng tanong mo
   4. Palitan ang "choices" — laging 4 ang choices
   5. Palitan ang "answer" — dapat exactly same sa isa sa choices
   6. Para dagdag ng card, kopyahin ang isang { } block,
      dagdagan ng bagong id, at i-paste sa loob ng array.
      (Dapat EVEN ang bilang ng cards: 2, 4, 6, 8...)
════════════════════════════════════════════════════════ */

const cardsData = [
  {
    id: 1,
    img: "1.jpg",
    label: "Honey Net",
    question: "What is a Honey Net?",
    choices: ["A wireless network", "A collection of connected honey pots", "A firewall rule", "An encrypted network"],
    answer: "A collection of connected honey pots"
  },
  {
    id: 2,
    img: "2.jpg",
    label: "Authentication",
    question: "Authentication is the process of:",
    choices: ["Encrypting files", "Validating a user's identity", "Installing software", "Backing up data"],
    answer: "Validating a user's identity"
  },
  {
    id: 3,
    img: "3.jpg",
    label: "FRR",
    question: "What does False Reject Rate (FRR) mean in biometrics?",
    choices: ["Unknown users are accepted", "Legitimate users are rejected", "Passwords are incorrect", "Systems are offline"],
    answer: "Legitimate users are rejected"
  },
  {
    id: 4,
    img: "4.jpg",
    label: "Footprinting",
    question: "What is footprinting?",
    choices: ["Scanning for open ports", "Creating backups", "Researching Internet addresses owned by a target organization", "Installing operating systems"],
    answer: "Researching Internet addresses owned by a target organization"
  },
  {
    id: 5,
    img: "5.jpg",
    label: "Packet Sniffer",
    question: "Which tool collects and analyzes copies of network packets?",
    choices: ["Packet Sniffer", "Firewall", "Antivirus", "Router"],
    answer: "Packet Sniffer"
  },
  {
    id: 6,
    img: "6.jpg",
    label: "Log File Monitor",
    question: "What is a Log File Monitor (LFM) used for?",
    choices: ["Creating user accounts", "Monitoring battery usage", "Reviewing log files for attack patterns", "Encrypting data"],
    answer: "Reviewing log files for attack patterns"
  },
  {
    id: 7,
    img: "7.jpg",
    label: "Passive Response",
    question: "Which response type simply reports an intrusion without taking direct action?",
    choices: ["Active Response", "Automatic Response", "Passive Response", "Aggressive Response"],
    answer: "Passive Response"
  },
  {
    id: 8,
    img: "8.jpg",
    label: "Honey Pot",
    question: "What is a Honey Pot?",
    choices: ["A firewall", "A decoy system designed to attract attackers", "A network switch", "A password manager"],
    answer: "A decoy system designed to attract attackers"
  }
];

/* ════════════════════════════
   GAME STATE
════════════════════════════ */
let cards = [...cardsData, ...cardsData];
cards.sort(() => Math.random() - 0.5);

let firstCard = null, secondCard = null, lockBoard = false;
let score1 = 0, score2 = 0;
let currentTeam = 1;
let currentQuestion = null;
let stealMode = false, stealingTeam = null;
let pointsPerQ = 3;
let team1Name = "Team 1", team2Name = "Team 2";

// 3-attempt system
let answeringTeam = 1;
let attemptCount = 0;
const MAX_ATTEMPTS = 3;

/* ════════════════════════════
   BOARD
════════════════════════════ */
function createBoard(){
  const board = document.getElementById("board");
  board.innerHTML = "";

  cards.forEach(cardData => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.id = cardData.id;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-back"></div>
        <div class="card-front">
          <img src="${cardData.img}" alt="${cardData.label}" loading="lazy">
        </div>
      </div>`;

    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });
}

/* ════════════════════════════
   FLIP
════════════════════════════ */
function flipCard(){
  if(lockBoard) return;
  if(this.classList.contains("matched")) return;
  if(this === firstCard) return;
  if(this.classList.contains("flipped")) return;

  this.classList.add("flipped");

  if(!firstCard){
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;
  checkMatch();
}

/* ════════════════════════════
   MATCH CHECK
════════════════════════════ */
function checkMatch(){
  const isMatch = firstCard.dataset.id === secondCard.dataset.id;

  if(isMatch){
    firstCard.classList.add("matched","match-flash");
    secondCard.classList.add("matched","match-flash");

    const data = cardsData.find(d => d.id == firstCard.dataset.id);
    currentQuestion = data;
    updatePreview(data.img);
    setTimeout(() => showQuestion(data), 500);

  }else{
    setTimeout(() => {
      firstCard.classList.add("shake");
      secondCard.classList.add("shake");
      setTimeout(() => {
        firstCard.classList.remove("flipped","shake");
        secondCard.classList.remove("flipped","shake");
        resetTurn();
        switchTurn();
        lockBoard = false;
      }, 400);
    }, 700);
  }
}

/* ════════════════════════════
   PREVIEW
════════════════════════════ */
function updatePreview(imgSrc){
  const side = currentTeam === 1 ? "team1Preview" : "team2Preview";
  const el = document.getElementById(side);
  el.innerHTML = `<img src="${imgSrc}" alt="matched card">`;
}

/* ════════════════════════════
   QUESTION MODAL
════════════════════════════ */
function showQuestion(data){
  stealMode = false;
  stealingTeam = null;
  answeringTeam = currentTeam;
  attemptCount = 0;

  const modal = document.getElementById("questionModal");
  const header = document.getElementById("qHeader");
  const banner = document.getElementById("stealBanner");
  const name = currentTeam === 1 ? team1Name : team2Name;

  header.textContent = `${name}'s Turn`;
  header.className = `q-header team${currentTeam}`;
  banner.classList.remove("show");
  updateAttemptDots(0);

  document.getElementById("qImage").src = data.img;
  document.getElementById("questionText").textContent = data.question;

  buildChoices(data.choices, data.answer);

  modal.classList.remove("hidden");
}

function buildChoices(choices, answer){
  const grid = document.getElementById("choicesGrid");
  grid.innerHTML = "";

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice;
    btn.onclick = () => handleChoice(choice, answer, btn);
    grid.appendChild(btn);
  });
}

/* ════════════════════════════
   HANDLE CHOICE
════════════════════════════ */
function handleChoice(chosen, correct, btn){
  // disable all buttons immediately
  document.querySelectorAll(".choice-btn").forEach(b => b.onclick = null);

  const isCorrect = chosen === correct;
  btn.classList.add(isCorrect ? "correct" : "wrong");

  // only reveal correct answer if ALL attempts are used up
  const isLastAttempt = (attemptCount + 1) >= MAX_ATTEMPTS;
  if(!isCorrect && isLastAttempt){
    document.querySelectorAll(".choice-btn").forEach(b => {
      if(b.textContent === correct) b.classList.add("correct");
    });
  }

  setTimeout(() => {
    if(isCorrect){
      // ── CORRECT ──
      addScore(answeringTeam);
      celebrate(answeringTeam);
      const winName = answeringTeam === 1 ? team1Name : team2Name;
      showToast(`✅ Tama! ${winName} +${pointsPerQ} pts`);
      currentTeam = answeringTeam;
      switchTurn();
      closeQuestion();

    }else{
      // ── WRONG ──
      attemptCount++;
      updateAttemptDots(attemptCount);

      if(attemptCount >= MAX_ATTEMPTS){
        // 3 wrong — no points, reveal answer then close
        showToast("❌ 3 beses na mali! Walang points!");
        stealMode = false;
        switchTurn();
        setTimeout(() => closeQuestion(), 1200);
        return;
      }

      // switch answering team for steal
      const nextTeam = answeringTeam === 1 ? 2 : 1;
      answeringTeam = nextTeam;
      stealMode = true;

      const nextName = nextTeam === 1 ? team1Name : team2Name;
      const remaining = MAX_ATTEMPTS - attemptCount;

      const banner = document.getElementById("stealBanner");
      banner.textContent = `🔥 Mali! ${nextName} pwedeng sumagot! (${remaining} pagkakataon pa)`;
      banner.classList.add("show");

      const header = document.getElementById("qHeader");
      header.textContent = `${nextName} – Steal! (Attempt ${attemptCount + 1}/${MAX_ATTEMPTS})`;
      header.className = `q-header team${nextTeam}`;

      buildChoices(currentQuestion.choices, currentQuestion.answer);
      showToast(`❌ Mali! ${nextName} pwede magnakaw! (${remaining} left)`);
    }
  }, 900);
}

/* ════════════════════════════
   ATTEMPT DOTS UI
════════════════════════════ */
function updateAttemptDots(wrongCount){
  const el = document.getElementById("attemptDots");
  if(!el) return;
  el.innerHTML = "";
  for(let i = 0; i < MAX_ATTEMPTS; i++){
    const dot = document.createElement("span");
    dot.className = "attempt-dot " + (i < wrongCount ? "used" : "avail");
    dot.textContent = i < wrongCount ? "❌" : "🔵";
    el.appendChild(dot);
  }
}

/* ════════════════════════════
   CLOSE QUESTION
════════════════════════════ */
function closeQuestion(){
  document.getElementById("questionModal").classList.add("hidden");
  resetTurn();
  lockBoard = false;
  checkWinner();
}

/* ════════════════════════════
   SCORE
════════════════════════════ */
function addScore(team){
  if(team === 1){
    score1 += pointsPerQ;
    const el = document.getElementById("score1");
    el.textContent = score1;
    el.classList.add("score-pop");
    setTimeout(() => el.classList.remove("score-pop"), 600);
  }else{
    score2 += pointsPerQ;
    const el = document.getElementById("score2");
    el.textContent = score2;
    el.classList.add("score-pop");
    setTimeout(() => el.classList.remove("score-pop"), 600);
  }
}

/* ════════════════════════════
   CELEBRATE
════════════════════════════ */
function celebrate(team){
  const flash = document.createElement("div");
  flash.classList.add("flash");
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 500);

  confetti({
    particleCount: 80,
    spread: 60,
    origin: { x: team === 1 ? 0.15 : 0.85, y: 0.6 },
    colors: team === 1 ? ['#ff6b6b','#ffd700','#fff'] : ['#4ecdc4','#ffd700','#fff']
  });
}

/* ════════════════════════════
   TOAST
════════════════════════════ */
function showToast(msg){
  const existing = document.querySelector(".toast");
  if(existing) existing.remove();

  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2100);
}

/* ════════════════════════════
   TURN SYSTEM
════════════════════════════ */
function switchTurn(){
  currentTeam = currentTeam === 1 ? 2 : 1;
  updateTurnUI();
}

function updateTurnUI(){
  const p1 = document.getElementById("teamPanel1");
  const p2 = document.getElementById("teamPanel2");
  p1.classList.toggle("active-team", currentTeam === 1);
  p2.classList.toggle("active-team", currentTeam === 2);

  const name = currentTeam === 1 ? team1Name : team2Name;
  document.getElementById("turnDisplay").innerHTML =
    `Current Turn: <span>${name}</span>`;
}

/* ════════════════════════════
   RESET TURN
════════════════════════════ */
function resetTurn(){
  firstCard = null;
  secondCard = null;
}

/* ════════════════════════════
   WINNER CHECK
════════════════════════════ */
function checkWinner(){
  const matched = document.querySelectorAll(".matched");
  if(matched.length < cards.length) return;

  setTimeout(() => {
    const modal = document.getElementById("winnerModal");
    const trophy = document.getElementById("winnerTrophy");
    const text = document.getElementById("winnerText");
    const scores = document.getElementById("winnerScores");

    if(score1 > score2){
      trophy.textContent = "🏆";
      text.textContent = `${team1Name} Wins!`;
      confetti({ particleCount:200, spread:120, origin:{y:0.5} });
    }else if(score2 > score1){
      trophy.textContent = "🏆";
      text.textContent = `${team2Name} Wins!`;
      confetti({ particleCount:200, spread:120, origin:{y:0.5} });
    }else{
      trophy.textContent = "🤝";
      text.textContent = "It's a Draw!";
    }

    scores.textContent = `${team1Name}: ${score1} pts  |  ${team2Name}: ${score2} pts`;
    modal.classList.remove("hidden");

  }, 400);
}

/* ════════════════════════════
   SETTINGS
════════════════════════════ */
document.getElementById("settingsBtn").addEventListener("click", () => {
  document.getElementById("setTeam1").value = team1Name;
  document.getElementById("setTeam2").value = team2Name;
  document.getElementById("setPoints").value = pointsPerQ;
  document.getElementById("settingsModal").classList.remove("hidden");
});

function saveSettings(){
  const n1 = document.getElementById("setTeam1").value.trim();
  const n2 = document.getElementById("setTeam2").value.trim();
  team1Name = n1 || "Team 1";
  team2Name = n2 || "Team 2";
  pointsPerQ = parseInt(document.getElementById("setPoints").value);
  document.getElementById("team1Name").textContent = team1Name;
  document.getElementById("team2Name").textContent = team2Name;
  updateTurnUI();
  closeSettings();
}

function closeSettings(){
  document.getElementById("settingsModal").classList.add("hidden");
}

/* ════════════════════════════
   RESET
════════════════════════════ */
document.getElementById("resetBtn").addEventListener("click", () => {
  if(confirm("Reset the game?")) location.reload();
});

/* ════════════════════════════
   START
════════════════════════════ */
createBoard();
updateTurnUI();
document.getElementById("teamPanel1").classList.add("active-team");