import { account1, account2 } from "./data.js";
import { formatCurreny, formatMovementDate } from "./helperFunctions.js";

const movements = document.querySelector(".movements");
const balance = document.querySelector(".balance");
const summaryIn = document.querySelector(".in");
const summaryOut = document.querySelector(".out");
const summaryRate = document.querySelector(".interest");
const timerEl = document.querySelector(".timer");
const app = document.querySelector("main");

const accounts = [account1, account2];

export const displayTransactions = function (acc, sort = false) {
  // emptying placeholder data before inserting new data
  movements.innerHTML = "";

  const data = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  data.forEach(function (item, i) {
    const type = item > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[i]);
    const formatedDate = formatMovementDate(date, acc.location);
    const html = `
      <div class="row">
        <div class="type ${type}">${i + 1} ${type}</div>
        <div class="date">${formatedDate}</div>
        <div class="value">${formatCurreny(
          item,
          acc.location,
          acc.currency
        )}</div>
      </div>
    `;

    movements.insertAdjacentHTML("afterbegin", html);
  });
};

const displayBalance = function (account) {
  account.balance = account.movements.reduce(
    (accumulator, item) => (accumulator += item),
    0
  );

  balance.textContent = formatCurreny(
    account.balance,
    account.location,
    account.currency
  );
};

const displaySummary = function (account) {
  const balanceIn = account.movements
    .filter(val => val > 0)
    .reduce((accumulator, item) => accumulator + item, 0);
  const balanceOut = account.movements
    .filter(val => val < 0)
    .reduce((accumulator, item) => accumulator + item, 0);
  const balanceInterest = account.movements
    .filter(val => val > 0)
    .map(val => (val * account.interestRate) / 100)
    .filter(val => {
      // returning over 1s
      return val >= 1;
    })
    .reduce((accumulator, item) => accumulator + item, 0);

  // adding values to DOM
  summaryIn.textContent = formatCurreny(
    Math.abs(balanceIn),
    account.location,
    account.currency
  );
  summaryOut.textContent = formatCurreny(
    Math.abs(balanceOut),
    account.location,
    account.currency
  );
  summaryRate.textContent = formatCurreny(
    Math.abs(balanceInterest),
    account.location,
    account.currency
  );
};

const createUsernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map(name => name[0])
      .join("");
  });
};
createUsernames(accounts);

export const logoutTimer = function () {
  const start = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // displaying time on every fn call
    timerEl.textContent = `${min}:${sec}`;

    // when 0 seconds, stop timer & logout user
    if (time === 0) {
      // this is JS internal fn
      clearInterval(timer);
      app.style.opacity = 0;
    }

    time--;
  };
  let time = 5 * 60;

  start();

  // this is JS internal fn
  const timer = setInterval(start, 1000);
  return timer;
};

export const updateUI = function (account) {
  displaySummary(account);
  displayBalance(account);
  displayTransactions(account);
};
