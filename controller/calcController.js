class CalcController {
    constructor(){
        this.local = "pt-BR";
        this._operation = [];
        this._lastOperator = "";
        this._lastNumber = "";
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");

        this._currentDate;
        this.inicializer();
        this.initButtonsEvents();
        this.initKeyboard();
    }

    // metodo chamado no contrutor para sempre ser chamado ao iniciar
    inicializer(){
        this.setDisplayTime(); 
        setInterval( () => {
            this.setDisplayTime(); 
        }, 1000);
        this.setLastNumberToDisplay();
    }

    initKeyboard(){
        document.addEventListener("keyup", e => {
            console.log(e.key);

            switch (e.key) {
                case "Escape":
                    this.clearAll();
                    break;
                
                case "Backspace":
                    this.cancelEntry();
                    break;
                
                case "+":
                case "-":
                case "/":
                case "*":
                case "%":
                    this.addOperation(e.key);
                    break;
    
                case "Enter":
                case "=":
                    this.calc();
                break;
    
                case ".":
                case ",":
                    this.addDot(".");
                    break;
    
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    this.addOperation(parseInt(e.key));
                    break;
    
                default:
                    break;
            }
        })
    }

    // metodo criado para adicionar mais de um evento a um elemento
    addEventListenerAll(element,  events, fn){
        events.split(" ").forEach(event => {
            element.addEventListener(event, fn, false);
        })
    }

    // limpar todas as operações da calculadora
    clearAll(){
        this._operation = [];
        this._lastNumber = "";
        this._lastOperator = "";
        this.setLastNumberToDisplay();
    }

    // limpar apenas a ultima operação
    cancelEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    // metodo de erro 
    setError(){
        this.displayCalc = "Error";
    }

    // pegar a ultima operação digitada na calculadora
    getLastOperation(){
        return this._operation[this._operation.length -1];
    }

    setLastOperation(value){
        this._operation[this._operation.length -1] = value;
    }

    // verificar se o valor é uma operação
    isOperator(value){ 
        return (["+", "-", "*", "/", "%"].indexOf(value) > -1);
    }

    // fazer o push e verificar se ja pode ser calculado
    pushOperation(value){
        this._operation.push(value);
        if(this._operation.length > 3){
            this.calc();
        }
    }

    getResult(){
        return eval(this._operation.join(""));
    }


    // fazer o calculo da operação
    calc(){ 
        let last = "";
        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3) {
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if(this._operation.length > 3){
            last = this._operation.pop();
            this._lastNumber = this.getResult();

        }else if(this._operation.length == 3){
            this._lastNumber = this.getLastItem(false);
        }

        let result = this.getResult();

        if(last === "%"){
           result /= 100;
           this._operation = [result];
        } else {
            this._operation = [result];

            if(last) {
                this._operation.push(last);
            }
        }

        this.setLastNumberToDisplay();
    }

    // pegar o ultimo operador ou numero na memoria da calculadora
    getLastItem (isOperator = true) {
        let lastItem;

        for(let i = this._operation.length-1; i>=0; i--){

          if (this.isOperator(this._operation[i]) == isOperator) {
              lastItem = this._operation[i];
              break;
          }

        }

        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    //mostrar os numeros digitados no display
    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false);

        !lastNumber ? lastNumber = 0 : "";

        this.displayCalc = lastNumber;
    }

    // adicionar uma nova operação na calculadora
    addOperation(value){
        if(isNaN(this.getLastOperation())) { //verificar se a ultima operação digitada não é num numero
            // se for uma string
            if(this.isOperator(value)){ //trocar o operador ja digitado por um novo
               this.setLastOperation(value)

            } else {
                //primeiro elemento da operação
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }

        }else {
            // se for um número
            if(this.isOperator(value)){ // verificar se for uma string
                this.pushOperation(value);
            } else { // se for um número
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                this.setLastNumberToDisplay(); //exibir no display as operações
            }
        }
        console.log(this._operation);
    }

    /// metodo para adicionar ponto ao calculo
    addDot(){
        let lastOperation = this.getLastOperation();

        if(typeof lastOperation == "string" && lastOperation.split("").indexOf(".") > -1) return;

        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation("0.");
        } else {
            this.setLastOperation(lastOperation.toString() + ".");
        }
        this.setLastNumberToDisplay();
    }

    
    // case com todas as operações possiveis
    execBtn(value){
        switch (value) {
            case "ac":
                this.clearAll();
                break;
            
            case "ce":
                this.cancelEntry();
                break;
            
            case "soma":
                this.addOperation("+");
                break;
            
            case "subtracao":
                this.addOperation("-");
                break;

            case "divisao":
                this.addOperation("/");
            break;

            case "multiplicacao":
                this.addOperation("*");
            break;

            case "porcento":
                this.addOperation("%");
            break;

            case "igual":
                this.calc();
            break;

            case "ponto":
                this.addDot(".");
                break;

            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;
        }
    }

    // adicionar os eventos nos botões da calculadora
    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        buttons.forEach((btn) => {
            this.addEventListenerAll(btn, "click drag", e => {
                let textBtn = btn.className.baseVal.replace("btn-", "");
                this.execBtn(textBtn);
            })
        })

    }

    // adicionar dada e hora no display da calculadora
    setDisplayTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this.local,{
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this.local);
    }

    // set e get da hora no display
    get displayTime(){
        return this._timeEl.innerHTML;
    }
    set displayTime(value){
        return this._timeEl.innerHTML = value;
    }

    // get e set da data no display
    get displayDate(){
        return this._dateEl.innerHTML;
    }
    set displayDate(value){
        return this._dateEl.innerHTML = value;
    }

    // get e set DisplayCalc
    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }
    set displayCalc(value){
        this._displayCalcEl.innerHTML = value;
    }

    // get e set currentDate
    get currentDate(){
        return new Date();
    }
    set currentDate(value){
        this._currentDate = value;
    }
}