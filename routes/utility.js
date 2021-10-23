

const readline = require("readline");
const fs = require("fs");  
const mkdir = require('mkdirp')
const Excel_Exports = './Excel_Exports/'

if(!fs.existsSync(Excel_Exports))
  mkdir.mkdirp(Excel_Exports,(err)=>{if(!err)console.log('folder ./Excel_Exports/ is created')})

var DELAY_MILISECOND = 1000; 

function setDelay(interval){
   DELAY_MILISECOND = interval
}


const SocketEnum = {
  DEMO_TOPIC: 'demo topic',
  EXTRACT_ACCOUNT_USERS_DONE:'extract account users done',
  EXTRACT_PROJECT_USERS_DONE:'extract users of one project done',
  EXTRACT_ALL_PROJECT_USERS_DONE:'extract all users of all projects done', 
};  
function socketNotify(topic,message,data,info){
  //notify client
  var sockketData = {message:message,data:data,info:info} 
  global.MyApp.SocketIo.emit(topic, 
    JSON.stringify(sockketData));
} 

async function readLines(prompt) {
  return new Promise(resolve => {
      let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })
      rl.question(
        '\n'+prompt,
        function(answer) {   
          resolve(answer) 
          rl.close()
      })
  }); 
 }

//to avoid the problem of 429 (too many requests in a time frame)
async function delay(t, v) {
  return new Promise(function(resolve) {
    setTimeout(resolve.bind(null, v), t);
  });
}

const wait =  async (ms) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}


function flatDeep(arr, d = 1) {
  return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), [])
               : arr.slice();
};



String.prototype.format =function () {
  var args = arguments;
  return this.replace(/\{(\d+)\}/g, function(m, i){
      return args[i];
  });
};

//from https://stackoverflow.com/questions/8495687/split-array-into-chunks
Object.defineProperty(Array.prototype, 'chunk_inefficient', {
  value: function(chunkSize) {
    var array = this;
    return [].concat.apply([],
      array.map(function(elem, i) {
        return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
      })
    );
  }
});

 
 
module.exports = {   
  readLines,
  delay,
  DELAY_MILISECOND,
  flatDeep,
  wait, 
  socketNotify,
  SocketEnum,
  setDelay
};