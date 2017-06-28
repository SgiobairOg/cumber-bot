'use strict';

/*
* Benedictr
* - A useless Alexa skill to return random guesses at Benedict Cumberbatch's
*   name from dictionaries of three-syllable B and C words. Because why not?
*
* Authored by Jason Wilson @wilsonuponsea
* https://www.wilsons.io
* Deployed with Serverless!
*
*/

// Require dictionary data
const
  nameData = require('benedictr-name-data.json'),
  Alexa = require('alexa-sdk');

const APP_ID = undefined;

const getRandomName = ( source ) => {
  
  console.log( "Random Name Called");
  // Set the pointer to a random number between zero and the max length of the
  // source data.
  let pointer = Math.floor( Math.random() * source.length );
  // Return the word at that pointer
  return source[pointer];
};

//Set random name for the response
let first = getRandomName(nameData.bwords);
let last = getRandomName(nameData.cwords);


const languageStrings = {
  'en-US': {
    translation: {
      RESPONSES: [
        `Are you thinking of ${first} ${last}?`,
        `I think his name was ${first} ${last}.`,
        `I love his work; ${first} ${last}, right?`,
        `His name was something like ${first} ${last} wasn't it?`,
        `I don't know, I only have eyes for Cage.`
      ],
      SKILL_NAME: 'Cumber Bot',
      HELP_MESSAGE: 'You can ask who played smaug, who is the actor who played Khan, what is that one actor\'s name, or give me a name, or, you can say exit... What can I help you with?',
      HELP_REPROMPT: 'What can I help you with?',
      STOP_MESSAGE: `Goodbye! See you at the next ${last} movie!`
    },
  },
  'de-DE': {
    translation: {
      RESPONSES: [
        `Denkst du an ${first} ${last}?`,
        `Ich denke dass sein Name war ${first} ${last}.`,
        `Ich leibe seine Arbeit; ${first} ${last}, richtig?`,
        `Sein Name war so etwas wie ${first} ${last} war es nicht?`,
        `Ich kenne nichts, Ich habe nur Augen für Nicholas Cage.`
      ],
      SKILL_NAME: 'Cumber Bot',
      HELP_MESSAGE: 'Sie können fragen, wer Smaug gespielt hat, wer ist der Schauspieler, der Khan gespielt hat, was ist der Name eines Schauspielers, oder geben Sie mir einen Namen, oder Sie können sagen, Ausfahrt ... Was kann ich Ihnen helfen?',
      HELP_REPROMPT: 'Womit kann ich dir helfen?',
      STOP_MESSAGE: `Bis später! Ich werde dich am nächsten ${last} movie!`
    },
  }
};

// Given a specification object return a weighted random value
const weightedRandom = ( spec ) => {
  // Initialise values
  let
    i,
    sum=0,
    r=Math.random();
  
  // Tally up the specification weights and return once the random value is exceeded
  for (i in spec) {
    sum += spec[i];
    if (r <= sum) return i;
  }
};

const handlers = {
  'LaunchRequest': function () {
    this.emit('GetAName');
  },
  'GetANameIntent': function () {
    this.emit('GetAName');
  },
  'GetAName': function () {
    
    // Select response from the Response data
    const responseList    = this.t('RESPONSES');
    const responsePointer = weightedRandom({0: 0.25, 1: 0.25, 2: 0.25, 3: 0.15, 4: 0.1});
    const randomNamePhrase      = responseList[responsePointer];
    
    this.emit(':tellWithCard', randomNamePhrase, this.t('SKILL_NAME'), randomNamePhrase);
    first = getRandomName(nameData.bwords);
    last = getRandomName(nameData.cwords);
  },
  'AMAZON.HelpIntent': function () {
    const speechOutput = this.t('HELP_MESSAGE');
    const reprompt     = this.t('HELP_MESSAGE');
    this.emit(':ask', speechOutput, reprompt);
  },
  'AMAZON.CancelIntent': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'));
  },
  'AMAZON.StopIntent': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'));
  },
};

exports.benedictr = function (event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  // To enable string internationalization (i18n) features, set a resources object.
  alexa.resources = languageStrings;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
