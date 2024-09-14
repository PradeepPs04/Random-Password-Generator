let input_slider = document.querySelector("[data-pass-len-slider]");
let length_display = document.querySelector("[data-pass-len]");

let password_display = document.querySelector("[data-password-display]");
let copy_btn = document.querySelector("[data-copy-btn]");
let copy_msg = document.querySelector("[data-copy-message]");

let uppercase_check = document.querySelector("#uppercase");
let lowercase_check = document.querySelector("#lowercase");
let numbers_check = document.querySelector("#numbers");
let symbols_check = document.querySelector("#symbols");
let all_checkbox = document.querySelectorAll("input[type=checkbox]");

let password_indicator = document.querySelector('[data-pass-indicator]');

let generate_btn = document.querySelector(".generate-pass-btn");

let password = '';
let password_length = 8;
let checked_count = 1;

let symbols = [
  "`",
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "-",
  "_",
  "=",
  "+",
  '[',
  '{',
  ']',
  '}',
  '\\',
  '|',
  ';',
  ':',
  `'`,
  `"`,
  ",",
  "<",
  ".",
  ">",
  '/',
  '?'
];

handle_slider();

// to display the count of selected password length in screen
function handle_slider() {
  input_slider.value = password_length;
  length_display.textContent = password_length;

  let min = input_slider.min;
  let max = input_slider.max;
  input_slider.style.backgroundSize = ((password_length - min) * 100 / (max - min)) + "% 100%";
}

// set the indicator color according to password strength
function set_indicator(color) {
    // console.log('changing color');
    password_indicator.style.backgroundColor = color;
    password_indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}

function get_random_integer(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function get_random_uppercase() {
  return String.fromCharCode(get_random_integer(65, 92)); // generate random number between 65-91
  //  and convert that ASCII value to character
}

function get_random_lowercase() {
  return String.fromCharCode(get_random_integer(97, 124)); // generate random number between 97-123
  // and convert that ASCII value to character
}

function get_random_number() {
  return get_random_integer(0, 10); // generate random number between 0-9
}

function get_random_symbol() {
  return symbols[get_random_integer(0,symbols.length)];
}

// calculate password strength
function calc_pass_strength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    // checking if checkboxes are checked or not
    if(uppercase_check.checked) hasUpper = true;
    if(lowercase_check.checked) hasLower = true;
    if(numbers_check.checked)   hasNumber = true;
    if(symbols_check.checked)   hasSymbol = true;

    // clculating strength of password according to 
    // seleceted checked box and length of password

    if(hasUpper && hasLower && (hasNumber || hasSymbol) && password_length >= 8)    set_indicator('#0f0');
    else if((hasLower || hasUpper) && (hasNumber || hasSymbol) && password_length >= 6) set_indicator('#ff0');
    else    set_indicator('#f00');
}


// function to copy generated password to clipboard
async function copy_password() {
  try {
    await navigator.clipboard.writeText(password_display.value);
    copy_msg.innerText = 'Copied';
    // make copied message visible
    copy_msg.style.scale = 1;
  }
  catch {
    copy_msg.innerText = 'Failed';
  }

  // make copied message invisible after 2 seconds
  setTimeout(function() {
    copy_msg.style.scale = '0';
  }, 2000);
}


input_slider.addEventListener('input', function(e) {
  // console.log(e.target.value);
  password_length = e.target.value;
  handle_slider();
});


copy_btn.addEventListener('click', function() {
  // if something is there in password display box
  if(password_display.value.length > 0) {
    copy_password();
  }
  // else {
  //   console.log("abhi kuch nahi likha hai uspe bhai");
  // }
})


function handle_checkbox_change() {
  checked_count = 0;
  all_checkbox.forEach((checkbox) => {
    if(checkbox.checked) {
      checked_count++;
    }
  });

  // if password length is less than number of checked options
  if(password_length < checked_count) {
    password_length = checked_count;
    handle_slider();
  }
}

all_checkbox.forEach((checkbox) => {
  checkbox.addEventListener('change', handle_checkbox_change);
});


function shuffle_password(array) {
  for(let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;  
  }

  let str = '';
  array.forEach((character) => str += character);
  return str;
}


generate_btn.addEventListener('click', function() {
  if(checked_count == 0)  return;

  password = '';
  // creating an array of functions according to checkboxes
  let funcArr = [];
  if(uppercase_check.checked) funcArr.push(get_random_uppercase);
  if(lowercase_check.checked) funcArr.push(get_random_lowercase);
  if(numbers_check.checked) funcArr.push(get_random_number);
  if(symbols_check.checked) funcArr.push(get_random_symbol);
  // console.log(funcArr[0]());

  // first generate the password according to checkboxes single character for each checkbox 
  for(let i = 0; i < checked_count; i++) {
    password += funcArr[i]();
  }
  // console.log(password);
  
  
  // add all remaining functions to function array
  if(funcArr.includes(get_random_uppercase) === false)  funcArr.push(get_random_uppercase);
  if(funcArr.includes(get_random_lowercase) === false)  funcArr.push(get_random_lowercase);
  if(funcArr.includes(get_random_number) === false)  funcArr.push(get_random_number);
  if(funcArr.includes(get_random_symbol) === false)  funcArr.push(get_random_symbol);
  

  // now generate the remaining characters randomly
  for(let i = 0; i < password_length - checked_count; i++) {
    let random_index = get_random_integer(0, funcArr.length);
    password += funcArr[random_index]();
  }
  // console.log(password);

  password = shuffle_password(Array.from(password));
  password_display.value = password;
  calc_pass_strength();
});