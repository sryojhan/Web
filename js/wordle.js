


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
        this.currentWord = 0;
        this.currentLetter = 0;

        this.letterCount = numeroLetras;
        this.tries = numeroIntentos;
    }

    submitWord() {
        if (this.currentLetter == this.answer.length  && this.currentWord < this.tries) {

            let correct = true;

            let idx = 0;
            for(let letra of this.wordle.getElementsByClassName("word")[this.currentWord].getElementsByClassName("letter"))
            {
                let color = "rgb(50, 200, 50)"
                if(letra.textContent !== this.answer[idx]){
                    correct = false;
                    color = "rgb(100, 100, 100)";

                    if(this.answer.includes(letra.textContent)){
                        color = "rgb(200, 200, 50)";
                    }
                }
                letra.style.backgroundColor = color;
                letra.style.color = "white";
                idx++;
            }

            if(correct)
            this.currentWord = this.tries + 1;
            this.currentWord++;
            this.currentLetter = 0;
        }
    }

    eraseLetter() {
        if (this.currentLetter > 0 && this.currentWord < this.tries) {

            this.currentLetter--;
            this.getLetter().textContent = " ";
        }
    }
    writeLetter(key) {
        key = key.toLowerCase();
        if (this.currentLetter < this.answer.length  && this.currentWord < this.tries) {

            this.getLetter().textContent = key;

            this.word += key;
            this.currentLetter++;
        }
    }

    getLetter() {
        let word = this.wordle.getElementsByClassName("word")[this.currentWord];
        return word.getElementsByClassName("letter")[this.currentLetter];
    }
}

