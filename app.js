const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello Express!');
  });

app.get('/burgers', (req, res) => {
  res.send('We have juicy cheese burgers!');
})

app.get('/pizza/pepperoni', (req, res) => {
  res.send('Your pizza is on the way!');
})

app.get('/pizza/pineapple', (req, res) => {
  res.send('We don\'t serve that here. Sorry!');
})

app.get('/echo', (req, res) => {
    const responseText = `Here are some details of your request:
      Base URL: ${req.baseUrl}
      Host: ${req.hostname}
      Path: ${req.path}
    `;
    res.send(responseText);
  });

app.get('/queryViewer', (req, res) => {
  console.log(req.query);
  res.end(); //do not send any data back to the client
});

app.get('/sum', (req, res) => {
  const a = req.query.a;
  const numA = parseFloat(a);
  const b = req.query.b;
  const numB = parseFloat(b);

  if(!a) {
    return res.status(400).send('Please provide a');
  }

  if(!b) {
    return res.status(400).send('Please provide b');
  }

  const c = numA+numB;

  const responseString = `The sum of ${numA} and ${numB} is ${c}`;

  res
    .status(200)
    .send(responseString);
})

app.get('/cipher', (req, res) => {
    const { text, shift } = req.query;

    if(!text) {
        return res
              .status(400)
              .send('text is required');
    }
    
    if(!shift) {
        return res
                .status(400)
                .send('shift is required');
    }          

    const numShift = parseFloat(shift);

    if(Number.isNaN(numShift)) {
        return res
              .status(400)
              .send('shift must be a number');
    }

    const base = 'A'.charCodeAt(0);  // get char code 

    const cipher = text
        .toUpperCase()
        .split('') // create an array of characters
        .map(char => { // map each original char to a converted char
            const code = char.charCodeAt(0); //get the char code

            // if it is not one of the 26 letters ignore it
            if(code < base || code > (base + 26)) {
                return char;
            }
      
            // otherwise convert it
            // get the distance from A
            let diff = code - base;
            diff = diff + numShift; 
      
            // in case shift takes the value past Z, cycle back to the beginning
            diff = diff % 26;

            // convert back to a character
            const shiftedChar = String.fromCharCode(base + diff);
            return shiftedChar;
        })
        .join(''); // construct a String from the array

  // Return the response
  res
    .status(200)
    .send(cipher);  
});

app.get('/lotto', (req, res) => {
    const { numbers } = req.query;
    
    if(!numbers) {
        return res
          .status(400)
          .send("numbers is required");
    }

    if(!Array.isArray(numbers)) {
        return res
          .status(400)
          .send("numbers must be an array");
    }

    const guesses = numbers
        .map(n => parseInt(n))
        .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));

    if(guesses.length != 6) {
        return res
            .status(400)
            .send("numbers must contain 6 integers between 1 and 20");
     }     

    const stockNumbers = Array(20).fill(1).map((_, i) => i + 1);
    
    const winningNumbers = [];

    for(let i = 0; i < 6; i++) {
        const ran = Math.floor(Math.random() * stockNumbers.length);
        winningNumbers.push(stockNumbers[ran]);
        stockNumbers.splice(ran, 1);
    }

    let diff = winningNumbers.filter(n => !guesses.includes(n));

    let responseText;

    switch(diff.length){
        case 0: 
          responseText = 'Wow! Unbelievable! You could have won the mega millions!';
          break;
        case 1:   
          responseText = 'Congratulations! You win $100!';
          break;
        case 2:
          responseText = 'Congratulations, you win a free ticket!';
          break;
        default:
          responseText = 'Sorry, you lose';  
    }

    // uncomment below to see how the results ran

    // res.json({
    //   guesses,
    //   winningNumbers,
    //   diff,
    //   responseText
    // });

    res.send(responseText);
});

app.listen(8000, () => {
  console.log('Express server is listening on port 8000!');
});