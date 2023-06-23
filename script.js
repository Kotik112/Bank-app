'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
	owner: 'Arman Iqbal',
	movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300, -100],
	interestRate: 1.2, // %
	pin: 1111,

	movementsDates: [
		'2019-11-18T21:31:17.178Z',
		'2019-12-23T07:42:02.383Z',
		'2020-01-28T09:15:04.904Z',
		'2022-04-01T10:17:24.185Z',
		'2022-05-08T14:11:59.604Z',
		'2022-05-27T17:01:17.194Z',
		'2023-04-11T23:36:17.929Z',
		'2023-05-12T10:51:36.790Z',
		'2023-06-22T10:51:36.790Z',
	],
	currency: 'EUR',
	locale: 'en-SE', // de-DE
};

const account2 = {
	owner: 'Myra Khan',
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30, 3225],
	interestRate: 1.5,
	pin: 2222,

	movementsDates: [
		'2019-11-01T13:15:33.035Z',
		'2019-11-30T09:48:16.867Z',
		'2019-12-25T06:04:23.907Z',
		'2020-01-25T14:18:46.235Z',
		'2020-02-05T16:33:06.386Z',
		'2020-04-10T14:43:26.374Z',
		'2020-06-25T18:49:59.371Z',
		'2020-07-26T12:01:20.894Z',
		'2023-06-20T10:51:36.790Z',
	],
	currency: 'USD',
	locale: 'en-US',
};

const account3 = {
	owner: 'Imran Iqbal',
	movements: [200, -200, 340, -300, -20, 50, 400, -460],
	interestRate: 1.5,
	pin: 3333,

	movementsDates: [
		'2019-11-01T13:15:33.035Z',
		'2019-11-30T09:48:16.867Z',
		'2019-12-25T06:04:23.907Z',
		'2020-01-25T14:18:46.235Z',
		'2020-02-05T16:33:06.386Z',
		'2020-04-10T14:43:26.374Z',
		'2020-06-25T18:49:59.371Z',
		'2020-07-26T12:01:20.894Z',
	],
	currency: 'EUR',
	locale: 'en-SE',
};

const account4 = {
	owner: 'Abdullah Khan',
	movements: [430, 1000, -550, 700, 50, 90, -120],
	interestRate: 1.5,
	pin: 3333,

	movementsDates: [
		'2019-11-01T13:15:33.035Z',
		'2019-11-30T09:48:16.867Z',
		'2019-12-25T06:04:23.907Z',
		'2020-01-25T14:18:46.235Z',
		'2020-02-05T16:33:06.386Z',
		'2020-04-10T14:43:26.374Z',
		'2020-06-25T18:49:59.371Z',
	],
	currency: 'USD',
	locale: 'sv',
};

// "accounts" simulates a database containing all accounts
const accounts = [account1, account2, account3, account4];

const LOGOUT_TIMER = 5;
let currentAccount;
let timerId;

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const createUsernames = function (accounts) {
	accounts.forEach(
		acc =>
			(acc.username = acc.owner
				.toLocaleLowerCase()
				.split(' ')
				.map(name => name[0])
				.join(''))
	);
};

//run once
createUsernames(accounts);

const formatMovementDate = function (date, locale) {
	const calcDaysPassed = (date1, date2) =>
		Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);
	const daysPassed = Math.round(calcDaysPassed(new Date(), date));
	let printedString;
	switch (daysPassed) {
		case 0:
			printedString = 'Today';
			break;
		case 1:
			printedString = 'Yesterday';
			break;
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
		case 7:
			printedString = `${daysPassed} days ago`;
			break;
		default:
			const options = {
				day: 'numeric',
				month: 'numeric',
				year: 'numeric',
			};
			printedString = new Intl.DateTimeFormat(locale, options).format(date);
			break;
	}
	return printedString;
};

const displayMovements = function (account, sort = false) {
	containerMovements.innerHTML = '';
	const movements = sort
		? account.movements.slice().sort((a, b) => a - b)
		: account.movements;

	movements.forEach(function (element, i) {
		const type = element > 0 ? 'deposit' : 'withdrawal';
		const date = new Date(account.movementsDates[i]);
		const displayDate = formatMovementDate(date, account.locale);
		const formattedMovement = formatCurrency(
			element,
			account.locale,
			account.currency
		);
		const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
			i + 1
		} ${type}</div>
		<div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMovement}</div>
        </div>
		`;
		containerMovements.insertAdjacentHTML('afterbegin', html);
	});
};

const calcDisplayBalance = function (account) {
	account.balance = account.movements.reduce((acc, cur) => acc + cur, 0);
	const formattedMovement = formatCurrency(
		account.balance,
		account.locale,
		account.currency
	);
	labelBalance.textContent = `${formattedMovement}`;
};

const formatCurrency = function (number, locale, currency) {
	const options = {
		style: 'currency',
		currency: currency,
	};
	return new Intl.NumberFormat(locale, options).format(number);
};

const calcDisplaySummary = function (account) {
	const incomes = account.movements
		.filter(e => e > 0)
		.reduce((acc, curr, i, arr) => acc + curr, 0);
	const formattedIncomes = formatCurrency(
		incomes,
		account.locale,
		account.currency
	);
	labelSumIn.textContent = `${formattedIncomes}`;

	const out = account.movements
		.filter(e => e < 0)
		.reduce((acc, curr) => acc + curr, 0);
	const formattedOut = formatCurrency(
		Math.abs(out),
		account.locale,
		account.currency
	);
	labelSumOut.textContent = `${formattedOut}`;

	const interest = account.movements
		.filter(e => e > 0)
		.map(deposit => (deposit * account.interestRate) / 100)
		.reduce((acc, curr) => acc + curr, 0);
	const formattedInterest = formatCurrency(
		interest,
		account.locale,
		account.currency
	);
	labelSumInterest.textContent = `${formattedInterest}`;
};

const calcDisplayDate = function (locale) {
	const now = new Date();
	const options = {
		hour: 'numeric',
		minutes: 'numeric',
		day: 'numeric',
		month: 'numeric',
		year: 'numeric',
		//weekday: 'long',
	};
	//const locale = navigator.language;
	//console.log(locale);
	labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);
};

const updateUI = function (account) {
	// Display and calculate the balance
	calcDisplayBalance(account);
	// Display and calculate the Summary
	calcDisplaySummary(account);
	// Display and calculate the movements
	displayMovements(account);
	// Display and calculate the current date
	calcDisplayDate(account.locale);
};

// Event Listeners!
btnLogin.addEventListener('click', function (event) {
	event.preventDefault();
	currentAccount = accounts.find(
		account => account.username === inputLoginUsername.value
	);
	if (currentAccount?.pin === +inputLoginPin.value) {
		// Display UI and welcome message
		labelWelcome.textContent = `Welcome back, ${
			currentAccount.owner.split(' ')[0]
		}`;

		// Add opacity to show account info
		containerApp.style.opacity = 100;
		inputLoginUsername.value = inputLoginPin.value = '';
		inputLoginPin.blur();
		updateUI(currentAccount);
		if (timerId) clearInterval(timerId);
		timerId = startLogoutTimer();
	}
});

btnTransfer.addEventListener('click', function (event) {
	event.preventDefault();
	const amount = +inputTransferAmount.value;
	const receiverAccount = accounts.find(
		account => account.username === inputTransferTo.value
	);
	if (
		receiverAccount &&
		amount > 0 &&
		currentAccount.balance >= amount &&
		currentAccount.username !== receiverAccount.username
	) {
		currentAccount.movements.push(-amount);
		currentAccount.movementsDates.push(new Date().toISOString());
		receiverAccount.movements.push(amount);
		receiverAccount.movementsDates.push(new Date().toISOString());
		updateUI(currentAccount);

		clearInterval(timerId);
		timerId = startLogoutTimer();
	}
});

btnClose.addEventListener('click', function (event) {
	event.preventDefault();
	if (
		inputCloseUsername.value === currentAccount.username &&
		+inputClosePin.value === currentAccount.pin
	) {
		inputCloseUsername.value = inputClosePin.value = '';
		const index = accounts.findIndex(
			acc => acc.username === currentAccount.username
		);
		accounts.splice(index, 1);
		alert(`Bye ${currentAccount.owner}, your account was deleted!`);

		//Hide UI
		containerApp.style.opacity = 0;
	}
});

btnLoan.addEventListener('click', function (event) {
	event.preventDefault();
	const input = Math.floor(inputLoanAmount.value);
	setTimeout(function () {
		if (
			currentAccount.movements.some(e => e > input * 0.1 && input < 2000) &&
			input > 0
		) {
			currentAccount.movements.push(input);
			currentAccount.movementsDates.push(new Date().toISOString());
			updateUI(currentAccount);
		} else
			alert(`${currentAccount.owner}, your loan was denied.
		Your balance remains ${currentAccount.balance}`);
		inputLoanAmount.value = '';
	}, 2500);
	clearInterval(timerId);
	timerId = startLogoutTimer();
});

labelBalance.addEventListener('click', function (event) {
	const movementsUI = Array.from(
		document.querySelectorAll('.movements__value'),
		el => el.textContent.replace(' €', '')
	);
	[...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
		if (i % 2 === 0) row.style.backgroundColor = 'grey';
	});
});

let sorted = false;
btnSort.addEventListener('click', function (event) {
	event.preventDefault();
	sorted = !sorted;
	displayMovements(currentAccount, sorted);
});

const logoutUser = function () {
	currentAccount = null;
	containerApp.style.opacity = 0;
	labelWelcome.textContent = 'Log in to get started';
};

const startLogoutTimer = function (time = LOGOUT_TIMER) {
	let minute = LOGOUT_TIMER;
	let second = 0;
	let timer;
	const updateTime = () => {
		if (second === 0 && minute === 0) {
			clearInterval(intervalId);
			logoutUser();
		}
		if (second == 0) {
			minute--;
			second = 59;
		} else {
			second--;
		}
		const min = String(minute).padStart(2, 0);
		const sec = String(second).padStart(2, 0);
		labelTimer.textContent = `${min}:${sec}`;
	};
	updateTime();
	const intervalId = setInterval(updateTime, 1000);
	return intervalId;
};

//FAKE ALWAYS LOGGED IN
/* currentAccount = account1;
updateUI(account1);
containerApp.style.opacity = 100;
startLogoutTimer(); */
