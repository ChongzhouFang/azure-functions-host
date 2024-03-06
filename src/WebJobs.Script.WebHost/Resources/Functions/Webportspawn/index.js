const { fork } = require('child_process');
const os = require('os');
const { finished } = require('stream');

// fork child workers
function forkWorker() {
  return new Promise((resolve, reject) => {
    const worker = fork(__dirname + '/child.js');
    
    worker.on('message', result => {
      resolve(result);
    });

    worker.on('error', error => {
      reject(error);
    });
  });
}

module.exports = async function (context, message) {
  const promises = [];
  var results = {};
  var finished = 0;
  for (let i = 0; i < os.cpus().length; i++) {
    promises.push(forkWorker().then(result => {
          results[finished] = result;
          finished ++;
          console.log('One result arrives.');
        }
      )
    );
    console.log('Created worker', i);
  }
  try {
      const status = await Promise.all(promises);
  } 
  catch (error) {
    console.error('Error occurred:', error);
    throw error;
  }
  response = {
    status:200,
    body: results,
    headers: { 
        'Content-Type': 'application/json'
    }
  };
  context.done(null, response);
}