export const unsplashConfig = {
    applicationId: "398d7e71c384ba92212d51cc4317d90945ccdbaa093400cd2f445d3a564e6b93",
    secret: "4557138090cffb041fccfc64024f863b63340bde6ee887cfc76ece0cc229956a",
    callbackUrl: "urn:ietf:wg:oauth:2.0:oob"
};

export const entities = {
    PERSON: 'People',
    NORP: 'Nationalities or Groups',
    FACILITY: 'Facilities',
    ORG: 'Organizations',
    GPE: 'Places',
    LOC: 'Locations',
    PRODUCT: 'Objects',
    EVENT: 'Events',
    WORK_OF_ART: 'Work of Art',
    LANGUAGE: 'Languages',
    TYPE: 'Types',
    DATE: 'Dates',
    TIME: 'Times',
    PERCENT: 'Percents',
    MONEY: 'Money',
    QUANTITY: 'Quantity',
    ORDINAL: 'Ordinal Numerals',
    CARDINAL: 'Other Numerals',
    FAC: 'FAC',
    LAW: 'LAW',
};

export const entitiesForEnrichment = {
    PERSON: 'People',
    NORP: 'Nationalities or Groups',
    FACILITY: 'Facilities',
    ORG: 'Organizations',
    GPE: 'Places',
    LOC: 'Locations',
    PRODUCT: 'Objects',
    EVENT: 'Events',
    WORK_OF_ART: 'Work of Art',
    TYPE: 'Types',
    FAC: 'FAC',
    LAW: 'LAW',
};

//     PERSON	People, including fictional.
//     NORP	Nationalities or religious or political groups.
//     FACILITY	Buildings, airports, highways, bridges, etc.
//     ORG	Companies, agencies, institutions, etc.
//     GPE	Countries, cities, states.
//     LOC	Non-GPE locations, mountain ranges, bodies of water.
//     PRODUCT	Objects, vehicles, foods, etc. (Not services.)
//     EVENT	Named hurricanes, battles, wars, sports events, etc.
//     WORK_OF_ART	Titles of books, songs, etc.
//     LANGUAGE	Any named language.
//
//     The following values are also annotated in a style similar to names:
//
//     TYPE	DESCRIPTION
//     DATE	Absolute or relative dates or periods.
//     TIME	Times smaller than a day.
//     PERCENT	Percentage, including "%".
//     MONEY	Monetary values, including unit.
//     QUANTITY	Measurements, as of weight or distance.
//     ORDINAL	"first", "second", etc.
//     CARDINAL	Numerals that do not fall under another type.