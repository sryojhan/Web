function init_wordle() {
    this.wordle = new Wordle(document.getElementsByClassName("wordle")[0]);
}

function colorblindMode(){
    this.wordle.toggleColors();
    ColorValues.toggleColorBlindness();
}
/**
 * Manage the wordle colors, and has support for colorblindness mode
 */
class ColorValues {
    static colorblindness = false;
    static correct() { return !this.colorblindness ? this.colors[0] : this.colors[1]; }
    static incorrect() { return !this.colorblindness ? this.colors[2] : this.colors[3]; }
    static almost() { return !this.colorblindness ? this.colors[4] : this.colors[5]; }

    //It is neccesary to use rgb because that is how color is internally stored
    static colors = [
        "rgb(255, 93, 115)", "rgb(0, 0, 153)",
        "rgb(100, 100, 100)", "rgb(100, 100, 100)",
        "rgb(140, 33, 85)", "rgb(204, 153, 0)"
    ];

    static toggleColorBlindness(value = null) {
        if (value === null)
            this.colorblindness = !this.colorblindness;
        else this.colorblindness = value;
    }

    /**
     * Given a color, return the other version of the color for colorblindness
     */
    static getOtherColor(givenColor) {

        for (let i = 0; i < 3; i++) {
            if (givenColor === this.colors[2 * i])
                return this.colors[2 * i + 1];
            else
            if (givenColor === this.colors[2 * i + 1])
                    return this.colors[2 * i ];
        }

        return givenColor;
    }
}

class Wordle {
    constructor(wordle) {
        this.wordleClass = wordle;

        this.initializeHtml(wordle);

        this.setListener();

        this.setupWordle();
    }

    /**
     * Setup wordle basic configuration
     */
    setupWordle() {
        this.wordleClass.innerHTML = this.initialHtml;

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

        this.initialHtml = wordle.innerHTML;
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

    toggleColors() {
        for (let word of this.wordleClass.getElementsByClassName("word"))
            for (let letter of word.getElementsByClassName("letter")) {
                let style = getComputedStyle(letter);
                letter.style.backgroundColor = ColorValues.getOtherColor(style.backgroundColor);
            }
    }

    /**
     * Processes the word when the enter key has been pressed
     */
    submitWord() {
        //If the worlde has been completed, pressing enter will restart it
        if (this.currentWord > this.tries) {
            this.setupWordle();
            return;
        }

        if (this.currentLetter == this.answer.length) {

            //Check if the given word exists 
            if( !isAValidWord( this.word ) ){

                console.log("The given word does not exist");
                return;
            }


            let correct = true;

            let tempAnswer = this.answer;
            let letters = this.wordleClass.getElementsByClassName("word")[this.currentWord].getElementsByClassName("letter");

            for (let idx = 0; idx < letters.length; idx++) {

                /*
                    While we iterate through the letters, we will remove the letter from the temporal answer, to avoid repetitions
                */

                let letter = letters[idx];
                let color = ColorValues.correct();


                if (letter.textContent === tempAnswer[idx]) {  //If the letter is right
                    tempAnswer = this.string_replace(tempAnswer, idx, ' ');

                } else {

                    correct = false;   //If one is incorrect, then the word is wrong
                    color = ColorValues.incorrect();

                    if (tempAnswer.includes(letter.textContent)) {  //If it is wrong, but the letter is in the word

                        let newindex = tempAnswer.indexOf(letter.textContent);
                        if (newindex >= 0) { //Another letter is found in the word

                            if (letters[newindex].textContent !== tempAnswer[newindex]) {
                                tempAnswer = this.string_replace(tempAnswer, newindex, ' ');
                                color = ColorValues.almost();
                            } else
                                color = ColorValues.incorrect();
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
            this.word = "";
        }
    }

    /**
     * Erase the last letter when the backspace key has been pressed
     */
    eraseLetter() {
        if (this.currentLetter > 0 && this.currentWord < this.tries) {

            this.currentLetter--;
            this.getLetter().textContent = " ";
            this.word = this.word.slice(0,  this.word.length - 1);
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
        return Math.floor(Math.random() * size);
    }

    /**
     * Gets a word from a list of possible candidates
     * @returns the word to be played
     */
    getWord() {
        return dictionary[this.hashFunction(dictionary.length)];
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

