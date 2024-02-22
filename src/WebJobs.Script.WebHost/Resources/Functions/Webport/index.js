function cross_product(type, operations){
    var results = []
    for (t of type){
        for (o of operations){
        results.push(`${t}.${o}`)
        }
    }
    return results
}


function get_input_output(cvop){
var io_type_re = /([if][0-9]{2}).[a-z_]*([if][0-9]{2})(_[us]){0,1}/;
var io_type_res = io_type_re.exec(cvop);
input_type = io_type_res[1]
output_type = io_type_res[2]
return {input_type: input_type, output_type: output_type}
}

function parseVShape(vShape){
var vShape_re = /([if][0-9]{1,2})x([0-9]{1,2})/
var vShape_res = vShape_re.exec(vShape)
numType = vShape_res[1]
paramCount = vShape_res[2]
return {numType: numType, paramCount: paramCount}
}
/*                             Numeric Instructions                           */
const ITYPE = ["i32","i64"]
const FTYPE = ["f32", "f64"]

const IUNOP = ["clz", "ctz", "popcnt"]
const IBINOP = ["add", "sub", "mul", "div_s", "div_u", "rem_s", "rem_u", "and", "or", "xor", "shl", "shr_s", "shr_u", "rotl", "rotr"]
const FUNOP = ["abs", "neg", "sqrt", "ceil", "floor", "trunc", "nearest"]
const FBINOP = ["add", "sub", "mul", "div", "min", "max", "copysign"]
const IRELOP = ["eq", "ne", "lt_s", "lt_u", "gt_s", "gt_u", "le_s", "le_u", "ge_s", "ge_u"]
const FRELOP = ["eq", "ne", "lt", "gt", "le", "ge"]

const UNOP = [].concat(cross_product(ITYPE, IUNOP), cross_product(FTYPE, FUNOP), ["i32.extend8_s", "i32.extend16_s", "i64.extend8_s", "i64.extend16_s", "i64.extend32_s"])

const BINOP = [].concat(cross_product(ITYPE,IBINOP), cross_product(FTYPE, FBINOP))

const RELOP = [].concat(cross_product(ITYPE, IRELOP), cross_product(FTYPE, FRELOP))

const CVTOP = ["i32.wrap_i64", "i64.extend_i32_s", "i64.extend_i32_u", "i32.trunc_f32_s", "i32.trunc_f32_u", "i32.trunc_f64_s", "i32.trunc_f64_u", "i64.trunc_f32_s", "i64.trunc_f32_u", "i64.trunc_f64_s", "i64.trunc_f64_u", "i32.trunc_sat_f32_s", "i32.trunc_sat_f32_u", "i32.trunc_sat_f64_s", "i32.trunc_sat_f64_u", "i64.trunc_sat_f32_s", "i64.trunc_sat_f32_u", "i64.trunc_sat_f64_s", "i64.trunc_sat_f64_u", "f32.demote_f64", "f64.promote_f32", "f32.convert_i32_s", "f32.convert_i32_u", "f32.convert_i64_s", "f32.convert_i64_u", "f64.convert_i32_s", "f64.convert_i32_u", "f64.convert_i64_s", "f64.convert_i64_u", "i32.reinterpret_f32", "i64.reinterpret_f64", "f32.reinterpret_i32", "f64.reinterpret_i64"]

const PUNOP = [['i32.wrap_i64', 'i64.extend_i32_s'], ['i32.wrap_i64', 'i64.extend_i32_u'], ['i32.trunc_f32_s', 'f32.convert_i32_s'], ['i32.trunc_f32_s', 'f32.convert_i32_u'], ['i32.trunc_f32_s', 'f32.reinterpret_i32'], ['i32.trunc_f32_u', 'f32.convert_i32_s'], ['i32.trunc_f32_u', 'f32.convert_i32_u'], ['i32.trunc_f32_u', 'f32.reinterpret_i32'], ['i32.trunc_f64_s', 'f64.convert_i32_s'], ['i32.trunc_f64_s', 'f64.convert_i32_u'], ['i32.trunc_f64_u', 'f64.convert_i32_s'], ['i32.trunc_f64_u', 'f64.convert_i32_u'], ['i64.trunc_f32_s', 'f32.convert_i64_s'], ['i64.trunc_f32_s', 'f32.convert_i64_u'], ['i64.trunc_f32_u', 'f32.convert_i64_s'], ['i64.trunc_f32_u', 'f32.convert_i64_u'], ['i64.trunc_f64_s', 'f64.convert_i64_s'], ['i64.trunc_f64_s', 'f64.convert_i64_u'], ['i64.trunc_f64_s', 'f64.reinterpret_i64'], ['i64.trunc_f64_u', 'f64.convert_i64_s'], ['i64.trunc_f64_u', 'f64.convert_i64_u'], ['i64.trunc_f64_u', 'f64.reinterpret_i64'], ['i32.trunc_sat_f32_s', 'f32.convert_i32_s'], ['i32.trunc_sat_f32_s', 'f32.convert_i32_u'], ['i32.trunc_sat_f32_s', 'f32.reinterpret_i32'], ['i32.trunc_sat_f32_u', 'f32.convert_i32_s'], ['i32.trunc_sat_f32_u', 'f32.convert_i32_u'], ['i32.trunc_sat_f32_u', 'f32.reinterpret_i32'], ['i32.trunc_sat_f64_s', 'f64.convert_i32_s'], ['i32.trunc_sat_f64_s', 'f64.convert_i32_u'], ['i32.trunc_sat_f64_u', 'f64.convert_i32_s'], ['i32.trunc_sat_f64_u', 'f64.convert_i32_u'], ['i64.trunc_sat_f32_s', 'f32.convert_i64_s'], ['i64.trunc_sat_f32_s', 'f32.convert_i64_u'], ['i64.trunc_sat_f32_u', 'f32.convert_i64_s'], ['i64.trunc_sat_f32_u', 'f32.convert_i64_u'], ['i64.trunc_sat_f64_s', 'f64.convert_i64_s'], ['i64.trunc_sat_f64_s', 'f64.convert_i64_u'], ['i64.trunc_sat_f64_s', 'f64.reinterpret_i64'], ['i64.trunc_sat_f64_u', 'f64.convert_i64_s'], ['i64.trunc_sat_f64_u', 'f64.convert_i64_u'], ['i64.trunc_sat_f64_u', 'f64.reinterpret_i64'], ['f32.demote_f64', 'f64.promote_f32'], ['f32.convert_i32_s', 'i32.reinterpret_f32'], ['f32.convert_i32_u', 'i32.reinterpret_f32'], ['f64.convert_i64_s', 'i64.reinterpret_f64'], ['f64.convert_i64_u', 'i64.reinterpret_f64'], ['i32.reinterpret_f32', 'f32.reinterpret_i32'], ['i64.reinterpret_f64', 'f64.reinterpret_i64']]


const NOP = UNOP.concat(UNOP,BINOP,PUNOP)


/*                              Vector Instructions                           */

const VSHAPE = ["v128"]
const ISHAPE = ["i8x16", "i16x8", "i32x4", "i64x2"]
const FSHAPE = ["f32x4", "f64x2"]
const SHAPE = ISHAPE+FSHAPE

const half = ["low", "high"]

const VVUNOP = ["not"]
const VVBINOP = ["and", "andnot", "or", "xor"]
const VVVTERNOP = ["bitselect"]
const VIRELOP = ["eq", "ne", "lt_s", "lt_u", "gt_s", "gt_u", "le_s", "le_u", "ge_s", "ge_u"]
const VFRELOP = ["eq", "ne", "lt", "gt", "le", "ge"]
const VIUNOP = ["abs","neg"]
const VIBINOP = ["add", "sub"]
const VIMINMAXOP = ["min_s", "min_u", "max_s", "max_u"]
const VISATBINOP = ["add_sat_s", "add_sat_u", "sub_sat_s", "sub_sat_u"]
const VISHITOP = ["shl", "shr_s", "shr_u"]
const VFUNOP = ["abs", "neg", "sqrt", "ceil", "floor", "trunc", "nearest"]
const VFBINOP = ["add", "sub", "mul", "div", "min", "max", "pmin", "pmax"]


const VUNOP = [].concat(cross_product(VSHAPE, VVUNOP), cross_product(ISHAPE, VIUNOP), cross_product(FSHAPE, VFUNOP), ["i8x16.popcnt"])

const VBINOP = [].concat(cross_product(VSHAPE, VVBINOP), cross_product(ISHAPE, VIBINOP), cross_product(FSHAPE, VFBINOP), cross_product(["i8x16","i16x8","i32x4"], VIMINMAXOP), cross_product(["i8x16","i16x8"], VISATBINOP), cross_product(["i16x8","i32x4","i64x2"],["mul"]), cross_product(["i8x16","i16x8"], ["avgr_u"]), ["i16x8.q15mulr_sat_s"])

const VRELOP = [].concat(cross_product(["i8x16", "i16x8", "i32x4"], VIRELOP), cross_product(["i64x2"], ["eq", "ne", "lt_s", "gt_s", "le_s", "ge_s"]), cross_product(FSHAPE, VFRELOP))

const VOP = VUNOP.concat(VBINOP,VRELOP)
/*                             Memory Instructions                            */


const ALLOP = NOP.concat(VOP)
/**
* This module contains the web-components of PC-Detector.
* These functions are meant to be used by the selenium-controlled browser.
* They contain test to measure contention on specific instructions.
*
**/


const TEST_NUMBER = 1000 // Number of test per setting per instruction

const path = require('path');
const fs = require('fs');
/* --------------------------------------------------------------------------
                                      MISC
   -------------------------------------------------------------------------- */


/**
 * getRandomInt - Creates a random int comprised in [0,max[
 *
 * @param  {Number} max Maximum value
 * @return {Number}     Random integer
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}



/**
 * getRandomFloat - Creates a random float comprised in [0,max[
 *
 * @param  {Number} max Maximum value
 * @return {Number}     Random Float
 */
function getRandomFloat(max) {
  return Math.floor(Math.random() * max);
}




/* --------------------------------------------------------------------------
                              Init WASM functions
   -------------------------------------------------------------------------- */


/**
 * initUnopSpam - Instantiate and export a WebAssembly function that spams a UNOP.
 * This is an async function. Use it with await.
 *
 * @param  {String} instruction The name of the UNOP
 * @return {Function}           Function repeatedly calling the UNOP
 */
async function initUnopSpam(instruction) {
  const wasm = fs.readFileSync(path.join(__dirname, `build/${instruction}_spam.wasm`));
  let instance = await WebAssembly.instantiateStreaming(wasm);
  var spam = await instance.exports.spam;
  return spam;
}


/**
 * initPunopSpam - Instantiate and export a WebAssembly function that spams a PUNOP.
 * This is an async function. Use it with await.
 *
 * @param  {Array(String)} instructions Both instruction of the PUNOP
 * @return {Function}           Function repeatedly calling the PUNOP
 */
async function initPunopSpam(instructions) {
  const wasm = fs.readFileSync(path.join(__dirname, `build/${instructions[0]}_${instructions[1]}_spam.wasm`));
  let instance = await WebAssembly.instantiateStreaming(wasm);
  var spam = await instance.exports.spam;
  return spam;
}


/**
 * initUnopSpam - Instantiate and export a WebAssembly function that spams a MEMOP.
 * The main difference is that it is initialized with a memory.
 * This is an async function. Use it with await.
 *
 *
 * @param  {String} instruction The name of the MEMOP
 * @return {Function}           Function repeatedly calling the MEMOP
 */
async function initMemopSpam(instruction) {
  var SZ = 2048;
  var memory = new WebAssembly.Memory({
    initial: SZ,
    maximum: SZ,
    shared: false
  });
  // Don't forget to clean memory or regularly close the browser.
  // Who knew you could have memory leaks in the browser :D
  var wasm = await fs.readFileSync(path.join(__dirname, `build/${instruction}_spam.wasm`));
  let instance = await WebAssembly.instantiateStreaming(wasm, {env: {mem: memory}});
  var spam = await instance.exports.spam;
  return spam;
}



/* --------------------------------------------------------------------------
                                Test instruction
   -------------------------------------------------------------------------- */


/**
 * testInstruction - Time the execution of a function repeatedly calling an
 * instruction.
 *
 * This is the main function of the web-component of PC-Detector.
 * By calling it in the different setting (P1 contention, p5 contention or control),
 * we can determine if the tested isntruciton creates contention.
 *
 * This is an async function. Use it with await.
 *
 * @param  {String} instruction The name of the tested instruction.
 * @return {Array[Number]}      All the timings of the experiment.
 */
async function testInstruction(instruction) {

  // First, we instantiate the spam function, i.e the function repeatedly
  // calling our instruction
  if ((UNOP.includes(instruction)) || (BINOP.includes(instruction)))  {
    var type = instruction.slice(0,3); // type of the instr, can be i32/64 or f32/64
    var spam = await initUnopSpam(instruction);
  }
  else if (Array.isArray(instruction)) {
    var type = instruction[1].slice(0,3); // here we have two different types
    // we need the input/output of the function.
    var spam = await initPunopSpam(instruction);
  }
//   else if (MEMOP.includes(instruction)) {
//     var type = instruction.slice(0,3);
//     var spam = await initMemopSpam(instruction);
//   }
  else if (VOP.includes(instruction)) {
    if (instruction[0]=='v') {
      var numType = "i64";
      var paramCount = "2";
    }
    else {
      var {numType, paramCount} = parseVShape(instruction);
    }
    var spam = await initUnopSpam(instruction);

  }
  var param;

  if (VOP.includes(instruction)) {
    param = []
    switch (numType) { // As we have different types, we instantiate the proper parameter
      case 'i8':
        for (var i = 0; i < Number(paramCount); i++) {
          param.push(getRandomInt(Math.pow(2,7)))
        }
        break;
      case 'i16':
        for (var i = 0; i < Number(paramCount); i++) {
          param.push(getRandomInt(Math.pow(2,15)))
        }
        break;
      case 'i32':
        for (var i = 0; i < Number(paramCount); i++) {
          param.push(getRandomInt(Math.pow(2,31)))
        }
        break;
      case 'i64':
        for (var i = 0; i < Number(paramCount); i++) {
          param.push(BigInt(getRandomInt(Math.pow(2,63))));
        }
        break;

      case 'f32':
        for (var i = 0; i < Number(paramCount); i++) {
          param.push(getRandomFloat(Math.pow(2,31)));
        }
        break;

      case 'f64':
        for (var i = 0; i < Number(paramCount); i++) {
          param.push(getRandomFloat(Math.pow(2,63)));
        }
        break;
      default:
        console.log("Invalid type");
    }
  }
  else {
    switch (type) { // As we have different types, we instantiate the proper parameter
      case 'i32':
        param = getRandomInt(Math.pow(2,31));
        break;
      case 'i64':
        param = BigInt(getRandomInt(Math.pow(2,63)));
        break;

      case 'f32':
        param = getRandomFloat(Math.pow(2,30));
        break;

      case 'f64':
        param = getRandomFloat(Math.pow(2,30));
        break;
      default:
        console.log("Invalid type");
    }
  }

  var timings = [];
  var start, end;
  /*
  * We use performance.now for these measurements.
  * That is because, although it grants a poor resolution and jitter compared to
  * shared array buffers, it is way more constant and resilient to noise.
  *
  * In particular, since we control the number of instruction in a spam function
  * we can put it to a high value (1,000,000), resulting in an execution time in
  * the order of the ms.
  *
  * As performance.now typically has a resolution of 5+-5us on Firefox and 20us
  * on Chrome, it is highly sufficient to measure the differences in this case.
  */
  if (VOP.includes(instruction)) {
    for (var i = 0; i < TEST_NUMBER; i++ ) {
      start = performance.now();
      spam(...param);
      end = performance.now();
      timings.push(end-start);
    }
  }
  else {
    for (var i = 0; i < TEST_NUMBER; i++ ) {
      start = performance.now();
      spam(param);
      end = performance.now();
      timings.push(end-start);
    }
  }
  return timings;
}

module.exports = async function (context, message) {
    var res;
    var timing;
    var timinglist;
    console.log('Executing');
    timinglist = [];
    try{
        for (instruction in ALLOP) {
            console.log(`Trying instruction ${ALLOP[instruction]}`);
            timing = await testInstruction(ALLOP[instruction]);
            timinglist.concat(timing);
        }
        res = {
            status:200,
            body: timinglist,
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
    catch (err) {
        console.log(err.toString());
        res = {
            status: 500,
            body: {message: err.toString()},
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
        
    context.done(null, res);
};