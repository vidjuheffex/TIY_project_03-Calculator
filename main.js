var utils = (function(){
    /** Reset the Calculator
     * @param {Object} input - The input object that contains the expression string 
     **/
    function resetCalc(){
        input.setInputString("");
        input.setCurrentIndex(0);

        document.querySelectorAll(".operator").forEach((e, i, a) => {
            e.classList.add("disabled");
            stateManager.setState(stateManager.states.OPINPUT);
        });
    };
    return {
        resetCalc: resetCalc
    };
}());


var input=(function(){
    let entryField = document.querySelector(".entry-field");
    //input is stored as an object so it can be passed by reference
    let input = {
        string: "",
        index: 0
    };
    
    /**
     *  Handles input once it has been captured by Mouse or Keyboard
     *  @param {string} keyString - the value of the key as a string
    **/
    function inputRequest(keyString){
        let key = keyString.slice(4);
        
        if(!isNaN(parseInt(key)) || key == "." || key == "plusMinus")  {
            //if the last state was evaluation, and numbers are entered, start over.
            if(stateManager.getState() == stateManager.states.EVALRES){
                utils.resetCalc(input);
            }
            handleNumberInput(key);
        }
        else{
            handleOperatorInput(key);
        }

        //update the entry field text with the current state of our input string
        entryField.innerText = input.string.trim();

        //if our string now has a value, enable operator buttons
        if (input.string.length > 0){
            document.querySelectorAll(".operator").forEach((e, i, a) => {
                e.classList.remove("disabled"); 
            });
        }

        //if our string is in an operator state, disable solving
        if (stateManager.getState() == stateManager.states.OPINPUT){
            let eqbtn = document.querySelector(".equals");
            let sqrbtn = document.querySelector(".sqr");
            eqbtn.classList.add("disabled");
            sqrbtn.classList.add("disabled");
        }
        if (stateManager.getState() == stateManager.states.EVALRES){
            let eqbtn = document.querySelector(".equals");            
            eqbtn.classList.add("disabled");
        }
    }
                                   
    function handleNumberInput(key){
        //If it wasn't in number input mode, switch to number input mode
        //reset the input index so we know were the current number starts
        if(stateManager.getState() != stateManager.states.NUMINPUT){
            stateManager.setState(stateManager.states.NUMINPUT);
            input.index  = input.string.length;
        }

        //If it's a number, go ahead and add it to the eval string
        if (key != "." && key != "plusMinus"){
            input.string += key;
            console.log(input.index);
        }

        //If its a decimal
        else if(key == "."){
            //check for existing decimals from the current numbers start, through the end
            //only add a decimal if an existing one isnt present in the current number
            if (input.string.substring(input.index).indexOf(".") == -1){
                input.string += key;
                //now that we have one, disable the decimal key
                document.getElementById("key_.").classList.add("disabled");
            }
        }
        else if(key == "plusMinus"){
            if (stateManager.getState() == stateManager.states.NUMINPUT){
                if(input.string.charAt(input.index-1) !=  "-"){
                    let firstPart = input.string.substring(0, input.index-1);
                    let secondPart = input.string.substring(input.index);
                    input.string = (firstPart + " -" + secondPart).trim();
                    input.index += 1;
                }
                else if(input.string.charAt(input.index - 1) == "-"){
                    let firstPart = input.string.substring(0, input.index-1);
                    let secondPart = input.string.substring(input.index);
                    input.string = firstPart + secondPart;
                    input.index -= 1;
                }
            }
        }
    }

    function handleOperatorInput(key){
        let patt = new RegExp(/[\\/\\*\\+\\%-]/);
        
        //reset the decimal key
        document.getElementById("key_.").classList.remove("disabled");

        //if backspace, clear entry
        if (key == "Backspace"){
            utils.resetCalc(input);    
        }
        else if (key == "=" && stateManager.getState() == stateManager.states.NUMINPUT){
            let result = eval(input.string);
            input.string = String(result);
            stateManager.setState(stateManager.states.EVALRES);
        }
        else if ((key == "sqr") && (stateManager.getState() == stateManager.states.NUMINPUT || stateManager.getState() == stateManager.states.EVALRES)) {
            let result = Math.sqrt(eval(input.string));
            input.string = String(result);
            stateManager.setState(stateManager.states.EVALRES);
        }
        else if (input.string.length > 0 && patt.test(key) && key.length == 1){
            input.string += " ";
            if(stateManager.getState() != stateManager.states.OPINPUT){
                input.string += key;
            }
            else {
                input.string = input.string.slice(0, input.string.length - 3);
                input.string += key;
            }
            input.string += " ";
            stateManager.setState(stateManager.states.OPINPUT);        
        }
    }

    function getInput(){
        return input;
    }

    function setInputString(str){
        input.string = str;
    }

    function setCurrentIndex(num){
        input.index = num;
    }

    return {
        inputRequest: inputRequest,
        getInput: getInput,
        setInputString: setInputString,
        setCurrentIndex: setCurrentIndex
    };
}());

var mouse=(function(){
    function init(){
        document.querySelectorAll(".inner.btn").forEach((e, i, a) => {
            e.addEventListener("click", mouseManager);
        });
    }

    function mouseManager(event){
        input.inputRequest(event.currentTarget.id);
    }

    return {
        init : init
    };
}());


var keyboard=(function(){
    function init () {
        window.addEventListener("keyup", keyManager);
    }

    function keyManager(event){
        if (event.key != "Shift"){
            let keyString = "";
            if(event.key == "Enter"){
                keyString = "key_=";
            }
            else{
                keyString = "key_" + event.key;
            }
            input.inputRequest(keyString);
        }
    }
    
    return {
        init: init
    };
}());

var stateManager = (function(){
    let currentState;
    
    const states = {
        NUMINPUT: 1,
        OPINPUT:  2,
        EVALRES: 3
    };

    function init(){
        currentState = states.EVALRES;
    }
    
   

    function getState(){
        return currentState;
    }

    function setState(state){
        currentState = state;
        if (currentState) {
            
        }
    }

    return {
        init: init,
        states: states,
        getState: getState,
        setState: setState
    };
    
}());

var core =(function() {
    function init (){
        keyboard.init();
        mouse.init();
        stateManager.init();
    }

    return {
        init: init
    };
}());

core.init();




