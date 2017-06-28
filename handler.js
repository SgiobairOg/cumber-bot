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
const nameData = require('benedictr-name-data.json');

// Initialise the response object
let response = {};

module.exports.benedictr = (event, context, callback) => {
  
  // Given a word data source return a random word
  const randomName = ( source ) => {
    
    // Set the pointer to a random number between zero and the max length of the
    // source data.
    let pointer = Math.floor( Math.random() * source.length );
    
    // Return the word at that pointer
    return source[pointer];
  };
  
  // Generate potential responses and select using a weighted random
  const formResponse = ( first, last ) => {
    
    const responseOptions = [
      `Are you thinking of ${first} ${last}?`,
      `I think his name was ${first} ${last}.`,
      `I love his work; ${first} ${last}, right?`,
      `His name was something like ${first} ${last} wasn't it?`,
      `I don't know, I only have eyes for Cage.`
    ];
    
    // Return the selected response string
    return responseOptions[weightedRandom({0:0.25, 1:0.25, 2:0.25, 3:0.15, 4:0.1})];
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
  
  
  // Handle Alexa intent
  if( event.request.intent.name === "AMAZON.HelpIntent" ) { // Handle help intent with instructions
    response = {
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: 'You can ask Cumber Bot things like, "Who is the actor who played Doctor Who", or "what is that one actors name", "who played smaug", or simply "what is his name"',
        },
        shouldEndSession: false,
      },
    };
  } else { // Handle name generation intent
    response = {
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: formResponse(randomName(nameData.bwords), randomName(nameData.cwords)),
        },
        shouldEndSession: false,
      },
    };
  }
  
  callback(null, response);

};
