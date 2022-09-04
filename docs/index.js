/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const loadWindow = new Promise(function (resolve, reject) {
  window.addEventListener("load", function (evt) {
    resolve(evt);
  });
});

Promise.all( [ loadWindow ] ).then(start, fail);

function fail(e) {
  console.error("loadFail");
  console.error(e);
}

const iterations = 10;
let makeViewsSamples = new Array(iterations);
let fillRandomSamples = new Array(iterations);
let copyViewSamples = new Array(iterations);
const length = (2 ** 22);
const view1 = new Uint8Array(length);

function start( [ evtWindow ] ) {
  testCopyCryptoRandom();
  let timerHandle = 0;
  const btnNoRandom = document.createElement("button");
  btnNoRandom.innerHTML = "Test No Random";
  btnNoRandom.addEventListener("click", function () {
    clearInterval(timerHandle);
    console.log("Test No Random");
    timerHandle = setInterval(function () {
      report(testCopyNoRandom);
    }, 1000);
  });
  document.body.appendChild(btnNoRandom);
  const btnCryptoRandom = document.createElement("button");
  btnCryptoRandom.innerHTML = "Test Crypto Random";
  btnCryptoRandom.addEventListener("click", function () {
    clearInterval(timerHandle);
    console.log("Test Crypto Random");
    timerHandle = setInterval(function () {
      report(testCopyCryptoRandom);
    }, 1000);
  });
  document.body.appendChild(btnCryptoRandom);
  const btnMathRandom = document.createElement("button");
  btnMathRandom.innerHTML = "Test Math Random";
  btnMathRandom.addEventListener("click", function () {
    clearInterval(timerHandle);
    console.log("Test Math Random");
    timerHandle = setInterval(function () {
      report(testCopyMathRandom);
    }, 1000);
  });
  document.body.appendChild(btnMathRandom);
}
function report(testCopy) {
  let total = 0;
  let makeViewsTotal = 0;
  let fillRandomTotal = 0;
  let copyViewTotal = 0;
  for (let i = 0; i < iterations; ++i) {
    const runtimes = testCopy();
    makeViewsSamples[i] = runtimes.makeViews;
    fillRandomSamples[i] = runtimes.fillRandom;
    copyViewSamples[i] = runtimes.copyView;
  }
  makeViewsAvg = 0;
  for (const sample of makeViewsSamples) {
    makeViewsAvg += sample;
  }
  makeViewsAvg /= iterations;
  makeViewsVar = 0;
  for (const sample of makeViewsSamples) {
    makeViewsVar += (sample - makeViewsAvg) * (sample - makeViewsAvg);
  }
  makeViewsVar /= iterations;
  
  fillRandomAvg = 0;
  for (const sample of fillRandomSamples) {
    fillRandomAvg += sample;
  }
  fillRandomAvg /= iterations;
  fillRandomVar = 0;
  for (const sample of fillRandomSamples) {
    fillRandomVar += (sample - fillRandomAvg) * (sample - fillRandomAvg);
  }
  fillRandomVar /= iterations;
  
  copyViewAvg = 0;
  for (const sample of copyViewSamples) {
    copyViewAvg += sample;
  }
  copyViewAvg /= iterations;
  copyViewVar = 0;
  for (const sample of copyViewSamples) {
    copyViewVar += (sample - copyViewAvg) * (sample - copyViewAvg);
  }
  copyViewVar /= iterations;
  
  console.log(makeViewsAvg.toFixed(3) + " ms (" + makeViewsVar.toFixed(3) + " ms^2), " + 
              fillRandomAvg.toFixed(3) + " ms (" + fillRandomVar.toFixed(3) + " ms^2), " + 
              copyViewAvg.toFixed(3) + " ms (" + copyViewVar.toFixed(3) + " ms^2)");
}
function testCopyNoRandom() {
  const time0 = self.performance.now();
  const view2 = new Uint8Array(length);
  const time1 = self.performance.now();
  const time2 = self.performance.now();
  view2.set(view1);
  const time3 = self.performance.now();
  return {
    makeViews: time1 - time0,
    fillRandom: time2 - time1,
    copyView: time3 - time2,
  };
}
function testCopyCryptoRandom() {
  const time0 = self.performance.now();
  const view2 = new Uint8Array(length);
  const time1 = self.performance.now();
  for (let i = 0; i < Math.ceil(length / 65536); ++i) {
    self.crypto.getRandomValues(new Uint8Array(view1.buffer, 65536 * i, 65536));
  }
  const time2 = self.performance.now();
  view2.set(view1);
  const time3 = self.performance.now();
  return {
    makeViews: time1 - time0,
    fillRandom: time2 - time1,
    copyView: time3 - time2,
  };
}
function testCopyMathRandom() {
  const time0 = self.performance.now();
  const view2 = new Uint8Array(length);
  const time1 = self.performance.now();
  for (let elem of view1) {
    elem = Math.random() * 255;
  }
  const time2 = self.performance.now();
  view2.set(view1);
  const time3 = self.performance.now();
  return {
    makeViews: time1 - time0,
    fillRandom: time2 - time1,
    copyView: time3 - time2,
  };
}
