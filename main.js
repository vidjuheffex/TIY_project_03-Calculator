var input=(function(){
    let entryField = document.querySelector(".entry-field");
    let inputString = "";
    let curInputIndex = 0;
    
    function inputRequest(keyString){
        let key = keyString.slice(4);
        
        if(!isNaN(parseInt(key)) || key == "." )  {
            handleNumberInput(key);
        }
        else{
            handleOperatorInput(key);
        }
        entryField.innerText = inputString;
        if (inputString.length > 0){
            document.querySelectorAll(".operator").forEach((e, i, a) => {
                e.classList.remove("disabled"); 
            });
        }
        console.log(key);
    }

    function handleNumberInput(key){
        //If it wasn't in number input mode, switch to number input mode
        //reset the input index so we know were the current number starts
        if(stateManager.getState() != stateManager.states.NUMINPUT){
            stateManager.setState(stateManager.states.NUMINPUT);
            curInputIndex = inputString.length-1;
        }

        //If it's a number, go ahead and add it to the eval string
        if (key != "."){
            inputString += key;
        }

        //If its a decimal
        else {
            //check for existing decimals from the current numbers start, through the end
            //only add a decimal if an existing one isnt present in the current number
            if (inputString.substring(curInputIndex).indexOf(".") == -1){
                inputString += key;
                //now that we have one, disable the decimal key
                document.getElementById("key_.").classList.add("disabled");
            }
        }
    }

    function handleOperatorInput(key){
        let patt = new RegExp("[/*+-]");
        
        //reset the decimal key
        document.getElementById("key_.").classList.remove("disabled");

        //if backspace, clear entry
        if (key == "Backspace"){
            inputString = "";
            document.querySelectorAll(".operator").forEach(function(e, i, a){
                e.classList.add("disabled"); 
            });
        }
        else if (key == "="){
            
        }
        else if (inputString.length > 0 && patt.test(key) && key.length == 1){
            inputString += " ";
            if(stateManager.getState() != stateManager.states.OPINPUT){
                inputString += key;
            }
            else {
                inputString = inputString.slice(0, inputString.length - 3);
                inputString += key;
            }
            inputString += " ";
            stateManager.setState(stateManager.states.OPINPUT);
        
        }
    }

    return {
        inputRequest: inputRequest
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
            let keyString = "key_" + event.key;
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
        OPINPUT:  2
    };

    function init(){
        currentState = states.OPINPUT;
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
