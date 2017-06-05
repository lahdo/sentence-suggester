export function getWords(sentence, limit=2) {
    const separator = ' ';
    // const arrayOfWords = sentence.trim().split(separator);
    let arrayOfWords = sentence.split(/(\s+)/);

    if(arrayOfWords.length && arrayOfWords[0] === '') {
        arrayOfWords = arrayOfWords.slice(1, 0);
    }

    const arrayLength = arrayOfWords.length;

    // const words = arrayOfWords.slice(arrayLength-limit, arrayLength).map(word => word.trim());
    const words = arrayOfWords.map(word => word.trim());

    words.forEach( (word, index, words) => {
        if (words[index] === words[index+1]) {
            words.splice(index, 1);
        }
    });

    console.log("array: ", words);

    return words;
}