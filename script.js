//parameters
let zeroDivText = "OOPS";

//imp variables
let state = 0; //0: num1, 1 : operator, 2: num2
let isVolatile = false;
let num1 = "";
let operator = "";
let num2 = "";

//setup
let operators = ["+", "-", "×", "÷"];

//selecting DOM
let buttons = document.querySelectorAll(".btn");
let display = document.querySelector(".display");

//adding eventListeners
buttons.forEach(btn => btn.addEventListener("click", (e) => HandleInput(e)));

//main
document.querySelector(".ac-btn").addEventListener("click", () => reset());


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
    {
        isVolatile = true;
        return zeroDivText;
    }
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

    if(result == zeroDivText)
        return result;
    else
        return Number.parseFloat(result.toFixed(6));

}

function HandleInput(e)
{

    let text = e.target.textContent;
    console.log(text);

    if(isVolatile)
    {
        if(display.textContent.trim() == zeroDivText)
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
    if (isNaN(Number(text)) == false)
        num1 = num1 + text;
    else if (text == ".")
    {
        if(num1 === "")
            num1 = "0.";
        else
            num1 += ".";
    }
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
        num2 = num2 + text;
    else if (text == ".")
    {
        if(num2 === "")
            num2 = "0.";
        else
            num2 += ".";
    }
}


function reset()
{
    display.textContent = "";
    state = 0;
    num1 = "";
    operator = "";
    num2 = "";
}