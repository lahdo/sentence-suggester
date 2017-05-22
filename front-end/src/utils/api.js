import fetch from 'isomorphic-fetch';

const SERVER = 'http://127.0.0.1:8000';
const VERSION = '/api/v1/';
const BASE = SERVER + VERSION;
const ENDPOINTS = {
    suggestions: 'suggestions/',
    jargons: 'jargons/',
    default_jargon: 'jargons/default',
};

function getApiAddress(endpoint) {
    return BASE + endpoint;
}

export function getSuggestions(searchObject) {
    const endpoint = getApiAddress(ENDPOINTS['suggestions']);

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    return fetch(`${endpoint}`, {
            method: 'POST',
            body: JSON.stringify(searchObject),//this.state.words
            headers: myHeaders
        }
    )
}

export function getJargons() {
    const endpoint = getApiAddress(ENDPOINTS['jargons']);

    return fetch(`${endpoint}`)
}

export function getDefaultJargon() {
    const endpoint = getApiAddress(ENDPOINTS['default_jargon']);

    return fetch(`${endpoint}`)
}