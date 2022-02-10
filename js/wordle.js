function init_wordle() {
    this.Wordle = new Wordle(document.getElementsByClassName("wordle")[0]);
}


class Wordle {
    constructor(wordle) {
        this.wordleClass = wordle;

        this.initializeHtml(wordle);

        this.setListener();

        this.word = "";
        this.answer = this.getWord();
        this.currentWord = 0;
        this.currentLetter = 0;
    }

    /**
     * Creates the html elements to be used for the game
     */
    initializeHtml(wordle) {
        const letterCount = 5;
        const numTries = 6;

        let word = wordle.getElementsByClassName("word")[0];
        let letter = word.innerHTML;
        word.innerHTML = "";

        //Initialize letters
        for (let i = 0; i < letterCount; i++)
            word.innerHTML += letter;

        //Initialize words
        let wordHtml = wordle.innerHTML;
        wordle.innerHTML = "";
        for (let i = 0; i < numTries; i++) {
            wordle.innerHTML += wordHtml;
        }

        this.letterCount = letterCount;
        this.tries = numTries;
    }

    /**
     * initialize the listener to listen to the key presses
     */
    setListener() {
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

    }

    /**
     * Process the word when the enter key has been pressed
     */
    submitWord() {
        if (this.currentLetter == this.answer.length && this.currentWord < this.tries) {
            let correct = true;

            let tempAnswer = this.answer;
            let letters = this.wordleClass.getElementsByClassName("word")[this.currentWord].getElementsByClassName("letter");

            for (let idx = 0; idx < letters.length; idx++) {

                /*
                    While we iterate through the letters, we will remove the letter from the temporal answer, to avoid repetitions
                */

                let letter = letters[idx];
                let color = "rgb(50, 200, 50)"   //Green color by default
                if (letter.textContent === tempAnswer[idx]) {  //If the letter is right
                    tempAnswer = this.string_replace(tempAnswer, idx, ' ');

                } else {

                    correct = false;   //If one is incorrect, then the word is wrong
                    color = "rgb(100, 100, 100)";

                    if (tempAnswer.includes(letter.textContent)) {  //If it is wrong, but the letter is in the word

                        let newindex = tempAnswer.indexOf(letter.textContent);
                        if (newindex >= 0) { //Another letter is found in the word

                            if (letters[newindex].textContent !== tempAnswer[newindex]) {
                                tempAnswer = this.string_replace(tempAnswer, newindex, ' ');
                                color = "rgb(200, 200, 50)";
                            } else
                                color = "rgb(100, 100, 100)";
                        }
                    }
                }

                letter.style.backgroundColor = color;
                letter.style.color = "white";
            }


            if (correct)
                this.currentWord = this.tries + 1;
            this.currentWord++;
            this.currentLetter = 0;
        }
    }

    /**
     * Erase the last letter when the backspace key has been pressed
     */
    eraseLetter() {
        if (this.currentLetter > 0 && this.currentWord < this.tries) {

            this.currentLetter--;
            this.getLetter().textContent = " ";
        }
    }

    /**
     *  Writes the next letter of the word
     * @param {char} key letter to be written
     */
    writeLetter(key) {
        if (this.currentLetter < this.answer.length && this.currentWord < this.tries) {
            key = key.toLowerCase();

            this.getLetter().textContent = key;

            this.word += key;
            this.currentLetter++;
        }
    }

    /**
     *  Get the html element of the current word
     * @returns doc element
     */
    getLetter() {
        let word = this.wordleClass.getElementsByClassName("word")[this.currentWord];
        return word.getElementsByClassName("letter")[this.currentLetter];
    }

    /**
     * Returns a number between cero and a value using certain conditions
     * @param {number} size max number, exclusive, 
     */
    hashFunction(size) {

    }

    /**
     * Gets a word from a list of possible candidates
     * @returns the word to be played
     */
    getWord() {
        const possibleWords = ["yepes", "yojhi", "novia", "sexoo"];
        return possibleWords[Math.floor(Math.random() * possibleWords.length)];
    }

    /**
     * Replace a char inside a string
     * @param {string} str string to be replaced
     * @param {number} idx index of the position to be replaced
     * @param {char} char character to be included in the string
     * @returns 
     */
    string_replace(str, idx, char) {
        if (idx > str.length - 1)
            return str;
        return str.substring(0, idx) + char + str.substring(idx + 1)
    }

}

