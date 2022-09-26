import { updateUI } from "./modules/updatingUI.js";
import { account1, account2 } from "./modules/data.js";
import { logoutTimer, displayTransactions } from "./modules/updatingUI.js";

const loginBtn = document.querySelector(".btn-login");
const usernameEl = document.querySelector(".username-input");
const pinEl = document.querySelector(".pin-input");
const wellcomeEl = document.querySelector(".wellcome");
const app = document.querySelector("main");
const dateEl = document.querySelector(".date-value");
const transferBtn = document.querySelector(".btn-transfer");
const loanBtn = document.querySelector(".btn-loan");
const closeBtn = document.querySelector(".btn-close");
const sortBtn = document.querySelector(".btn-sort");
const transferToEl = document.querySelector(".input-transfer-to");
const transferAmountEl = document.querySelector(".input-transfer-amount");
const loanAmountEl = document.querySelector(".input-loan-amount");
const closeUsernameEl = document.querySelector(".input-close-username");
const closePinEl = document.querySelector(".input-close-pin");

const accounts = [account1, account2];
let currentAccount, timer;

// login
loginBtn.addEventListener("click", function (event) {
  event.preventDefault();

  currentAccount = accounts.find(item => item.username == usernameEl.value);

  // checking if account exists
  if (currentAccount?.pin === Number(pinEl.value)) {
    // display UI & wellcome message
    wellcomeEl.textContent = `Wellcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    app.style.opacity = 100;
  }

  const displayDate = function () {
    const now = new Date();
    // create current date and time
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      // weekday: 'long',
    };

    // Intl => ECMAScript Internationalization API
    dateEl.textContent = new Intl.DateTimeFormat(
      currentAccount.location,
      options
    ).format(now);
  };
  displayDate();

  // clear user inputs
  usernameEl.value = "";
  pinEl.value = "";
  // removes focus from pin input
  pinEl.blur();

  // resetting timer
  if (timer) clearInterval(timer);
  timer = logoutTimer();

  // updating UI
  updateUI(currentAccount);
});

// transfer funds
transferBtn.addEventListener("click", function (event) {
  event.preventDefault();

  const amount = Number(transferAmountEl.value);
  const receiverAcc = accounts.find(acc => acc.username == transferToEl.value);

  // resetting input fields
  transferAmountEl.value = transferToEl.value = "";

  // transfer
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance > amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // move funds
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // add transaction date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // update UI
    updateUI(currentAccount);
    clearInterval(timer);
  }
});

// loan requirest
loanBtn.addEventListener("click", function (event) {
  event.preventDefault();

  const amount = Math.floor(loanAmountEl.value);

  if (
    amount > 0 &&
    amount > currentAccount.movements.some(val => val >= amount * 0.1)
  ) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 3 * 1000);
  }
  loanAmountEl.value = "";
  loanAmountEl.blur();
});

// close account
closeBtn.addEventListener("click", function (event) {
  event.preventDefault();

  // check credentials
  const index = accounts.findIndex(
    acc => acc.username === currentAccount.username
  );
  console.log("index: " + index);

  if (
    currentAccount.username === closeUsernameEl.value &&
    currentAccount.pin === Number(closePinEl.value)
  ) {
    console.log("success");
    // delete user
    accounts.splice(index, 1);

    // hide UI
    app.style.opacity = 0;

    // clear input fields
    closeUsernameEl.value = closePinEl.value = "";
    closePinEl.blur();
  }
});

//
let sorted = false;
sortBtn.addEventListener("click", function (event) {
  event.preventDefault();

  displayTransactions(currentAccount, !sorted);
  // flips sort on/off
  sorted = !sorted;
});
