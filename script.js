//imp variables
let state = 0; //0: num1, 1 : operator, 2: num2
let num1 = "";
let operator = "";
let num2 = "";

//setup
let operators = ["+", "-", "×", "÷"];

//selecting DOM
let buttons = document.querySelectorAll(".btns-container button");
let display = document.querySelector(".display");

//adding eventListeners
buttons.forEach(button => button.addEventListener("click", (e) => HandleInput(e)));

//main

//functions
function add(a, b)
{
    return +a + +b;
}


function multiply(a, b)
{
    return +a * +b;
}

function subtract(a, b)
{
    return +a - +b;
}

function divide(a, b)
{
    if (+b == 0)
        return 'OOPS';
    else
        return +a / +b;
}

function operate(a, operator, b)
{
    a = +a;
    b = +b;
    let result = "Invalid Operator";

    switch(operator){
        case "+":
            result = add(a, b);
            break;
        case "-":
            result = subtract(a, b);
            break;
        case "×":
            result = multiply(a, b);
            break;
        case "÷":
            result = divide(a, b);
            break;
    }
    return result;
}

function HandleInput(e)
{
    let text = e.target.textContent;
    switch(state)
    {
        case 0:
            ExecuteState0(text);
            break;
        case 1:
            ExecuteState1(text);
            break;
        case 2:
            ExecuteState2(text);
            break;
    }

    let fullText = num1 + " " + operator + " " + num2;
    display.textContent = fullText;
}


function ExecuteState0(text, substate = "execute")
{
    //entry
    if (substate == "entry")
    {
        num1 = operate(num1, operator, num2).toString();
        operator = "";
        num2 = "";
        return;
    }

    //transition condition
    if(operators.includes(text))
    {
        ExecuteState1(text, "entry");
        state = 1;
        return;
    }

    //execute
    num1 = num1 + text;
}

function ExecuteState1(text, substate = "execute")
{
    //entry
    if(substate == "entry")
    {
        operator = text;
        return;
    }

    //transition condition
    if (operators.includes(text) == false)
    {
        ExecuteState2(text, "entry");
        state = 2;
        return;
    }

    //execute
    operator = text;
}

function ExecuteState2(text, substate = "execute")
{

    //entry
    if(substate == "entry")
    {
        num2 = text;
        return;
    }

    //transition condition
    if (text == "=")
    {
        state = 0;
        ExecuteState0(text, "entry");
        return;
    }
    else if (operators.includes(text))
    {
        state = 0;
        ExecuteState0(text, "entry");
        state = 1;
        ExecuteState1(text, "entry");
        return;
    }

    //execute
    num2 += text;
}