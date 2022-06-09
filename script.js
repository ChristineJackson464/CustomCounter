const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;


// SET DATE INPUT MIN W? TODAY"S DATE
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

// POPULATE COUNTDOWN / COMPLETE UI
function updateDOM() {
    countdownActive = setInterval( () => {
    const now = new Date().getTime();
    const distance = countdownValue - now;

    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    // HIDE INPUT
    inputContainer.hidden = true;

    // IF COUNTDWN ENDED, SHOW COMPLETE
    if (distance < 0) {
        completeEl.hidden = true;
        clearInterval(countdownActive);
        completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
        completeEl.hidden = false;
    } else {
        // ELSE, SHOW THE COUNTDWN IN PROGRESS
        countdownElTitle.textContent = `${countdownTitle}`;
        timeElements[0].textContent = `${days}`;
        timeElements[1].textContent = `${hours}`;
        timeElements[2].textContent = `${minutes}`;
        timeElements[3].textContent = `${seconds}`;
        completeEl.hidden = true;
        countdownEl.hidden = false;
    }
  }, second);
}

// TAKE VALUES from FORM INPUT
function updateCountdown(e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
 // CHECK FOR ENTERED DATE
 if (countdownDate === '') {
     alert('OOPS you forgot to choose a countdown date!')
 } else {
    // GET NUMBER VERSION OF CURRENT DATE, UPDATE DOM
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
 }
}

// RESET ALL VALUES 
function reset() {
    // HIDE COUNTDWNS, SHOW INPUT
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;
    // STOP COUNTDWN
    clearInterval(countdownActive);
    // RESET VALUES 
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

function restorePreviousCountdown() {
    // GET COUNTDOWN FROM LOCALSTORAGE IF AVAILABLE
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    } 
}

// EVENT LISTENER
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// ON LOAD CHECK LOCALSTORAGE
restorePreviousCountdown();