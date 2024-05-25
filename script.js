'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

////////////////////////////////////////////
///////////////////////////////////////////


const addMovement= function(movements){
  const balance = movements.reduce((acc,cur) => acc + cur ,0)
   
  labelBalance.textContent = `\u20B9 ${balance}`
 
 }

  const calcDisplaySummary = function(acc){

    const addToIn= acc.movements
    .filter(mov => mov>0)
    .reduce((acc,mov)=> acc+mov,0)

    const addToOut= acc.movements
    .filter(mov => mov<0)
    .reduce((acc,mov)=> acc+mov,0)

    const interestRate= acc.movements
    .filter(mov => mov>0)
    .map(deposite => (deposite* acc.interestRate) / 100)
    .filter(int=> int>=1)
    .reduce((acc,int)=> acc+int,0)

    labelSumInterest.textContent = `\u20B9 ${interestRate}`
    labelSumIn.textContent = `\u20B9 ${addToIn}`
    labelSumOut.textContent = `\u20B9 ${Math.abs(addToOut)}`


  }


 

 ///////////////////////////////////////////
 ///////////////////////////////////////////
 
// Adding UserName

const makingUserName = function (acc){

  acc.forEach(function(accs){
    
    accs.userName = accs.owner
    .toLowerCase()
      .split(' ')
      .map(function(name){
        return name[0]
      }).join('')

  });
};

makingUserName(accounts)


////////////////////////////////////////////
////////////////////////////////////////////


const displayMovements = function(movements,sort=false){

  containerMovements.innerHTML = '';

  const movs = sort? movements.slice().sort((a,b)=>a-b): movements;

  movs.forEach(function(mov,i){
  const type = mov>0? 'deposit':'withdrawal';
    
  const html = `
  
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
          ${i+1} ${type}
        </div>
        <div class="movements__date">24/01/2037</div>
        <div class="movements__value">\u20B9 ${Math.abs(mov)}</div>
        </div>
        `
        containerMovements.insertAdjacentHTML('afterbegin',html);
        // containerMovements.innerHTML = html;
  });
  
};
/// Update UI

const updateUI = function (accounts){
  // Display Movement
  displayMovements(accounts.movements)
  
  // Display Balance
  addMovement(accounts.movements)

  //Display Summary
  calcDisplaySummary(accounts)
};

const setLogoutTimer= function(){
  // set time to 5 minute
  let time = 300;

 let timer = setInterval(function(){
    const min = String(Math.trunc(time/60)).padStart(2,0);

    const sec = String(Math.trunc(time%60)).padStart(2,0);


    labelTimer.textContent = `${min}:${sec}`;
   

    if(time===0){
    clearInterval(timer);  

    labelWelcome.textContent=`Login to get started`;
     containerApp.style.opacity= 0;
    
    }
     // Decrease timer
     time--;

     return timer;
  }, 1000);
}

// Event Listner
let currentAccount, timer;

// Fake Always Login
// currentAccount = account1;
// updateUI(currentAccount)
// containerApp.style.opacity=100;

const now = new Date();
const day = now.getDate();
const month = now.getMonth()+1;
const year = now.getFullYear();
const hour = now.getHours();
const minutes = now.getMinutes();

labelDate.textContent = `${day}/${month}/${year},${hour}:${minutes}`;

// day/month/year


btnLogin.addEventListener('click', function(ev){
  ev.preventDefault()
  
  currentAccount = accounts.find(acc=> acc.userName===inputLoginUsername.value)
  if(currentAccount?.pin===Number(inputLoginPin.value)){
    
    // Display UI and Messages

     labelWelcome.textContent=`Welcome back, ${currentAccount.owner.split(' ')[0]}`;
     containerApp.style.opacity=100;

    // Display Movements
    displayMovements(currentAccount.movements);

    // Clear Input field
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // Display Balance
    addMovement(currentAccount.movements);

    // Display Summary
    calcDisplaySummary(currentAccount);

    // set timeout 
    if(timer) clearInterval(timer)
    timer = setLogoutTimer();

    // Update Ui
    updateUI(currentAccount)

  }

  
  
});

btnTransfer.addEventListener('click', function(ev){
  ev.preventDefault()
  if(accounts.find(acc=>acc.userName===inputTransferTo.value) && inputTransferAmount.value >0){

    const amountOf = Number(inputTransferAmount.value);
    const amountTo = accounts.find(acc=>acc.userName===inputTransferTo.value);
    //transfer balance
    currentAccount.movements.push(-amountOf)
    amountTo.movements.push(amountOf);
    //hide input field
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();
    inputTransferTo.blur();

    //Update UI
    updateUI(currentAccount)
  }
   
})


btnClose.addEventListener('click', function(ev){
  ev.preventDefault()
  
 if(currentAccount.userName===inputCloseUsername.value && currentAccount.pin===Number(inputClosePin.value)){
     const index = accounts.findIndex(acc=>currentAccount.userName===inputCloseUsername.value)
     //hide input field
     inputLoginUsername.value = inputLoginPin.value = '';
     inputLoginPin.blur();

     // Deleting Account
     accounts.splice(index,1)

    // Hide ui
    containerApp.style.opacity=0;
  // Update Ui
    updateUI(currentAccount)

 }
  
});


btnLoan.addEventListener('click', function(ev){
  ev.preventDefault()
  
  const amount = Number(inputLoanAmount.value);

  if(amount > 0  && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    //Add Movement
   setTimeout(function(){currentAccount.movements.push(amount);
    // Update UI
    updateUI(currentAccount)},2500)
    // empty field
    inputLoanAmount.value = ''
  }
})

let shorted = false;

btnSort.addEventListener('click', function(ev){
  ev.preventDefault()
  displayMovements(currentAccount.movements,!shorted);
  shorted = !shorted;
})
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// const euroToUSD = 1.1;
// const euroToINR = 89.10;

// const toINR = movements.map(function(mov){
//   return mov*euroToINR
// })

// console.log(toINR)

// const toINR = movements.map(mov=>mov*euroToINR)
// console.log(toINR);


// Map Method

// movements.map(function(dogs,i){
//   if(dogs>=3){
//     console.log(`Dog number ${i+1} is an adult🐶, and is ${dogs} years olds`)
//   }else{
//   console.log(`Dog number ${i+1} is an Puppy 🐷, and is ${dogs} years olds`)
// }});

// const d = movements.map((dogs,i)=>`Dog number ${i+1} is an ${dogs>=3? 'adult🐶' : 'Puppy🐷'}, and is ${dogs} years olds`)
// console.log(d);



// Chining filter,reduce,map

// const totalDeposit = movements
//   .filter(age => age>0)
//   .map((mov) => { mov * euroToUSD})
  
//   .reduce((acc,mov) => acc+mov,0)
// console.log(totalDeposit);


// Find method
// const f =  accounts.find(mov=>mov.userName==='js')
// console.log(f);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

