//parameters
let zeroDivText = "OOPS";
const MAX_LENGTH = 15;

//imp variables
let state = 0; //0: num1, 1 : operator, 2: num2
let isVolatile = false;
let num1 = "";
let operator = "";
let num2 = "";

//setup
let operators = ["+", "-", "×", "÷"];
let validKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+", "-", "×", "÷", "=", ".", "CE"];

//selecting DOM
const buttons = document.querySelectorAll(".btn");
const display = document.querySelector(".display");

//adding eventListeners
buttons.forEach(btn => btn.addEventListener("click", (e) => HandleInput(e.target.textContent)));
document.addEventListener("keydown", (e) => HandleInput(e.key));
document.querySelector(".ac-btn").addEventListener("click", () => reset());


function HandleInput(text)
{
    //mapping keys to value
    if(text === "Enter")
        text = "=";
    
    if (text === "Backspace")
        text = "CE";

    if(text === "/")
        text = "÷";

    if(text === "*")
        text = "×"

    if(validKeys.includes(text) === false)
    {
        return;
    }

    if (text === "CE")
    {
        HandleBackspace();
        return;
    }

    if(isVolatile && text !== "=")
    {
        if(display.textContent.trim() === zeroDivText)
            reset();
        else if (operators.includes(text))
            state = 1;
        else
            reset();

        isVolatile = false;
    }

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

    UpdateDisplay();
}

function ExecuteState0(text, substate = "execute")
{
    if (text === ".")
    {
        num1 = AddDot(num1);
        return;
    }

    //entry
    if (substate === "entry")
    {
        num1 = operate(num1, operator, num2).toString();
        operator = "";
        num2 = "";
        return;
    }

    //transition condition
    if(operators.includes(text))
    {
        if(num1 === "")
        {
            return;
        }
        else
        {
            ExecuteState1(text, "entry");
            state = 1;
            return;
        }
    }

    //execute
    if (isNaN(Number(text)) === false)
    {
        num1 = num1 + text;
    }
}

function ExecuteState1(text, substate = "execute")
{

    //entry
    if(substate === "entry")
    {
        operator = text;
        return;
    }

    //transition condition
    if (operators.includes(text) === false)
    {
        if(text !== "=")
        {
            state = 2;
            ExecuteState2(text, "entry");
        }
        return;
    }

    //execute
    operator = text;    
}

function ExecuteState2(text, substate = "execute")
{
    if (text === ".")
    {
        num2 = AddDot(num2);
        return;
    }

    //entry
    if(substate === "entry")
    {
        num2 = text;
        return;
    }

    //transition condition
    if (text === "=")
    {
        isVolatile = true;
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
    if (isNaN(Number(text)) == false)
    {
        num2 = num2 + text;
    }
}


//functions
function HandleBackspace()
{
    if(state === 0)
    {
        num1 = num1.slice(0, -1);
        UpdateDisplay();
    }
    else if (state === 1)
    {
        operator = "";
        state = 0;
        UpdateDisplay();
    }
    else if (state === 2)
    {
        num2 = num2.slice(0, -1);
        if(num2 === "")
        {
            state = 1;
        }
        UpdateDisplay();
    }
}

function reset()
{
    clearDisplay();
    resetVariables();
}

function resetVariables()
{
    state = 0;
    num1 = "";
    operator = "";
    num2 = "";
}

function clearDisplay()
{
    display.textContent = "";
}

function UpdateDisplay()
{
    let fullText = num1 + " " + operator + " " + num2;
    while(fullText.trim().length > MAX_LENGTH)
    {
        HandleBackspace();
        fullText = num1 + " " + operator + " " + num2;
    }

    display.textContent = fullText;
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

    if(result === zeroDivText)
        return result;
    else
        return Number.parseFloat(result.toFixed(6));
}

function AddDot(num)
{
    if(num.includes("."))
    {
        return num;
    }
    else if(num === "")
        return "0.";
    else
        return num + ".";
}



//helper functions
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
    {
        isVolatile = true;
        return zeroDivText;
    }
    else
        return +a / +b;
}