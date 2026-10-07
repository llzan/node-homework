const fs = require('fs');
const path = require('path');


// Write a sample file for demonstration
const samplePath = path.join(__dirname, 'sample-files', 'sample.txt');
fs.writeFileSync(samplePath, 'Hello, async world!');

// 1. Callback style
fs.readFile(samplePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});

  // Callback hell example (test and leave it in comments):
  // Callback hell occurs when you have multiple nested callbacks, making the code hard to read and maintain. Here's an example of callback hell:
  /*
  fs.readFile(samplePath, 'utf8', (err, data) => {
      if (err) {
          console.error(err);
          return;
      }
      console.log(data);
      fs.writeFile(path.join(__dirname, 'sample-files', 'output.txt'), data, (err) => {
          if (err) {
              console.error(err);
              return;
          }
          console.log('File written successfully!');
          fs.unlink(samplePath, (err) => {
              if (err) {
                  console.error(err);
                  return;
              }
              console.log('Sample file deleted!');
          });
      });
  });
  */


  // 2. Promise style
  fs.promises.readFile(samplePath, 'utf8')
      .then(data => {
          console.log(data);
      })
      .catch(err => {
          console.error(err);
      });


      // 3. Async/Await style
      async function readFileAsync() {
          try {
              const data = await fs.promises.readFile(samplePath, 'utf8');
              console.log(data);
          } catch (err) {
              console.error(err);
          }
      }

      readFileAsync();
