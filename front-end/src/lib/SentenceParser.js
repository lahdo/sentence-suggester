

export function getWords(sentence, limit=2) {
    const separator = ' ';
    const arrayOfWords = sentence.split(separator);

    const arrayLength = arrayOfWords.length;

    const words = arrayOfWords.slice(arrayLength-limit, arrayLength).map(word => word.trim());

    console.log("array: ", words);

    return words;
}