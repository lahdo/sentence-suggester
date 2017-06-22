import fetch from 'isomorphic-fetch';

const SERVER = 'http://127.0.0.1:8000';
const VERSION = '/api/v1/';
const BASE = SERVER + VERSION;
const ENDPOINTS = {
    suggestions: 'suggestions/',
    sentiment: 'sentiment/',
    keywords: 'keywords/',
    jargons: 'jargons/',
    defaultJargon: 'jargons/default',
    entities: 'entities/',
    summary: 'summary/',
    contentEnrichment: 'content-enrichment/',
};

function getApiAddress(endpoint) {
    return BASE + endpoint;
}

function fetchData(endpoint, searchObject) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    return fetch(`${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(searchObject),
        headers: myHeaders
    });
}

function makeRequest(endpoint) {
    return function(searchObject) {
        const url = getApiAddress(endpoint);

        return fetchData(url, searchObject)
    };
}

export const fetchSuggestions = makeRequest(ENDPOINTS['suggestions']);
export const fetchKeywords = makeRequest(ENDPOINTS['keywords']);
export const fetchSentiments = makeRequest(ENDPOINTS['sentiment']);
export const fetchEntities = makeRequest(ENDPOINTS['entities']);
export const fetchSummary = makeRequest(ENDPOINTS['summary']);
export const fetchContentEnrichment = makeRequest(ENDPOINTS['contentEnrichment']);

export function getJargons() {
    const endpoint = getApiAddress(ENDPOINTS['jargons']);

    return fetch(`${endpoint}`)
}

export function getDefaultJargon() {
    const endpoint = getApiAddress(ENDPOINTS['defaultJargon']);

    return fetch(`${endpoint}`)
}