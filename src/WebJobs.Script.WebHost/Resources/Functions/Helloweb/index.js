const path = require('path');
const fs = require('fs');

module.exports = async function (context, message) {
    // Check if the request contains a filename parameter
    var res;
    try {
        const wasmCode = fs.readFileSync(path.join(__dirname, 'hello.wasm'));

        let lib = await WebAssembly.instantiate(wasmCode, {});
        let hello = lib.instance.exports.hello;
        result = hello();
        console.log(result.toString());
        res = {
            status: 200,
            body: result.toString(), // Assuming the result is a string or convertible to one
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } 
    catch (err) {
        // Return an error message if file reading fails
        console.log(err.toString());
        res = {
            status: 500,
            body: {message: err.toString()},
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
    }
   context.done(null, res)
};
