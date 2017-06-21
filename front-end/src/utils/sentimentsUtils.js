const POL_RESULTS = {
    positive: 'positive',
    negative: 'negative',
    neutral: 'neutral'
};

const SUB_RESULTS = {
    subjective: 'subjective',
    objective: 'objective',
    neutral: 'neutral'
};

export function normalizeValue(value) {
    return (Math.round((value * 100) / 2)/10).toFixed(2);
}

export function normalizePolarity(sentiment) {
    let value = this.normalizeValue(sentiment);
    let result = POL_RESULTS.negative;

    if (sentiment > 0) {
        result = POL_RESULTS.positive;
    }
    else if (sentiment < 0) {
        result = POL_RESULTS.negative;
        value = -value
    }
    else {
        result = POL_RESULTS.neutral;
    }

    return [value, result]
}

export function normalizeSubjectivity(sentiment) {
    let value = this.normalizeValue(sentiment);
    let result = SUB_RESULTS.objective;

    if (value > 2.65) {
        result = SUB_RESULTS.subjective;
    }
    else if (value < 2.35) {
        result = SUB_RESULTS.objective;
    }
    else {
        result = SUB_RESULTS.neutral;
    }

    return [value, result]
}