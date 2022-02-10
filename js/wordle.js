


function init_wordle() {
    this.Wordle = new Wordle(document.getElementsByClassName("wordle")[0]);


}


class Wordle {

    constructor(wordle) {
        const numeroLetras = 5;
        const numeroIntentos = 6;

        let palabra = wordle.getElementsByClassName("word")[0];
        let letra = palabra.innerHTML;
        palabra.innerHTML = "";

        for (let i = 0; i < numeroLetras; i++)
            palabra.innerHTML += letra;

        let htmlpalabra = wordle.innerHTML;
        wordle.innerHTML = "";
        for (let i = 0; i < numeroIntentos; i++) {
            wordle.innerHTML += htmlpalabra;
        }

        this.wordle = wordle;

        let writeLetter = (key) => this.writeLetter(key);
        let eraseLetter = () => this.eraseLetter();
        let submitWord = () => this.submitWord();
        document.addEventListener('keydown', function (event) {
            if (event.key.length === 1 && event.key.match(/[a-z]/i))
                writeLetter(event.key);

            if (event.key === "Backspace")
                eraseLetter();

            if (event.key === "Enter")
                submitWord();
        });

        this.word = "";
        this.answer = "yepes";
        //this.answer = this.getWord();
        this.currentWord = 0;
        this.currentLetter = 0;

        this.letterCount = numeroLetras;
        this.tries = numeroIntentos;

    }

    submitWord() {
        if (this.currentLetter == this.answer.length && this.currentWord < this.tries) {

            let correct = true;


            let resultado = this.answer;
            let letters = this.wordle.getElementsByClassName("word")[this.currentWord].getElementsByClassName("letter");
            for (let idx = 0; idx < letters.length; idx++) {
                let letra = letters[idx];
                let color = "rgb(50, 200, 50)"
                if (letra.textContent !== resultado[idx]) {
                    correct = false;
                    color = "rgb(100, 100, 100)";

                    if (resultado.includes(letra.textContent)) {
                        
                        let newindex = resultado.indexOf(letra);
                        if(newindex >= 0){ //Another letter is found in the word
                            if (newindex >= 0 && letters[newindex].textContent !== resultado[newindex]){
                                resultado = this.replace(resultado, newindex, ' ');
                                color = "rgb(200, 200, 50)";
                            }else{
                                color = "rgb(100, 100, 100)";
                            }

                        }else{
                            color = "rgb(200, 200, 50)";

                        }
                    }
                } else {
                    resultado = this.replace(resultado, idx, ' ');
                }

                console.log(resultado);
                letra.style.backgroundColor = color;
                letra.style.color = "white";
            }


            if (correct)
                this.currentWord = this.tries + 1;
            this.currentWord++;
            this.currentLetter = 0;
        }
    }

    replace(str, idx, char) {
        if (idx > str.length - 1)
            return str;
        return str.substring(0, idx) + char + str.substring(idx + 1)
    }

    eraseLetter() {
        if (this.currentLetter > 0 && this.currentWord < this.tries) {

            this.currentLetter--;
            this.getLetter().textContent = " ";
        }
    }
    writeLetter(key) {
        key = key.toLowerCase();
        if (this.currentLetter < this.answer.length && this.currentWord < this.tries) {

            this.getLetter().textContent = key;

            this.word += key;
            this.currentLetter++;
        }
    }

    getLetter() {
        let word = this.wordle.getElementsByClassName("word")[this.currentWord];
        return word.getElementsByClassName("letter")[this.currentLetter];
    }

    hashFunction() {

    }

    getWord() {
        let day = new Date();
        console.log(day.getDate());
        const possibleWords = ["yepes", "yojhi", "novia", "sexoo"];
        return possibleWords[Math.floor(Math.random() * possibleWords.length)];
    }
}

