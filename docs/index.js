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

const iterations = (2 ** 7);
let makeViewsSamples = new Array(iterations);
let fillRandomSamples = new Array(iterations);
let copyViewSamples = new Array(iterations);
const length = (2 ** 20);
const view1 = new Uint8Array(length);
const view1_32 = new Uint32Array(view1.buffer);

class HTMLStatScaleElement extends HTMLElement {
  #mainDiv;
  #maxDiv;
  #scaleCanvas;
  constructor() {
    super();
    this.#maxDiv = document.createElement("div");
    this.#scaleCanvas = document.createElement("canvas");
    this.#maxDiv.innerHTML = "Max: ";
    this.#maxDiv.style.width = 1000 + "px";
    this.#maxDiv.style.textAlign = "right";
    this.#scaleCanvas.width = 1000;
    this.#scaleCanvas.height = 50;
    this.#scaleCanvas.style.width = this.#scaleCanvas.width + "px";
    this.#scaleCanvas.style.height = this.#scaleCanvas.height + "px";
  }
  connectedCallback() {
    const width = this.getAttribute("width");
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(this.#maxDiv);
    this.shadowRoot.appendChild(this.#scaleCanvas);
//    this.reset();
  }
  disconnectedCallback() {
  }
  adoptedCallback() {
  }
  #clear() {
    const ctx = this.#scaleCanvas.getContext("2d");
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#FFFFFF";
    const width = this.getAttribute("width");
    ctx.fillRect(0, 0, width, 50);
  }
  #drawTicks(newValue) {
    const ctx = this.#scaleCanvas.getContext("2d");
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#FFFFFF";
    const width = this.getAttribute("width");
    ctx.fillRect(0, 0, width, 25);
    ctx.strokeStyle = "#000000";
    for (let i = 0; i <= newValue; ++i) {
      const x = (width / newValue) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 25);
      ctx.stroke();
    }
  }
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "data-max":
        this.#maxDiv.innerHTML = "Max: " + newValue;
        this.#clear();
        break;
      case "data-ticks":
        if (newValue < 1) {
          this.#clear();
          break;
        }
        this.#drawTicks(newValue);
        break;
      case "width":
        this.#clear();
        break;
      default:
        throw new Error("Unexpected Attribute");
        break;
    }
  }
  static get observedAttributes() {
    return ["data-max", "data-ticks", "width"];
  }
  addDataPoint(value) {
    const ctx = this.#scaleCanvas.getContext("2d");
    ctx.globalAlpha = 0.1;
    const max = this.getAttribute("data-max");
    const width = this.getAttribute("width");
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    const x = (value / max) * width;
    ctx.moveTo(x, 25);
    ctx.lineTo(x, 50);
    ctx.stroke();
  }
  reset() {
    const ticks = this.getAttribute("data-ticks");
    this.#clear();
    this.#drawTicks(ticks);
  }
};

window.customElements.define("stat-scale", HTMLStatScaleElement);

const testCopyNoRandomMakeViews = document.createElement("stat-scale");
testCopyNoRandomMakeViews.setAttribute("data-max", 2.0);
testCopyNoRandomMakeViews.setAttribute("data-ticks", 20);
testCopyNoRandomMakeViews.setAttribute("width", 1000);
const testCopyNoRandomMakeViewsMean = document.createElement("stat-scale");
testCopyNoRandomMakeViewsMean.setAttribute("data-max", 2.0);
testCopyNoRandomMakeViewsMean.setAttribute("data-ticks", 20);
testCopyNoRandomMakeViewsMean.setAttribute("width", 1000);
const testCopyNoRandomMakeViewsVar = document.createElement("stat-scale");
testCopyNoRandomMakeViewsVar.setAttribute("data-max", 1.0);
testCopyNoRandomMakeViewsVar.setAttribute("data-ticks", 10);
testCopyNoRandomMakeViewsVar.setAttribute("width", 1000);
const testCopyNoRandomFillRandom = document.createElement("stat-scale");
testCopyNoRandomFillRandom.setAttribute("data-max", 1.0);
testCopyNoRandomFillRandom.setAttribute("data-ticks", 10);
testCopyNoRandomFillRandom.setAttribute("width", 1000);
const testCopyNoRandomFillRandomMean = document.createElement("stat-scale");
testCopyNoRandomFillRandomMean.setAttribute("data-max", 1.0);
testCopyNoRandomFillRandomMean.setAttribute("data-ticks", 10);
testCopyNoRandomFillRandomMean.setAttribute("width", 1000);
const testCopyNoRandomFillRandomVar = document.createElement("stat-scale");
testCopyNoRandomFillRandomVar.setAttribute("data-max", 0.1);
testCopyNoRandomFillRandomVar.setAttribute("data-ticks", 10);
testCopyNoRandomFillRandomVar.setAttribute("width", 1000);
const testCopyNoRandomCopyView = document.createElement("stat-scale");
testCopyNoRandomCopyView.setAttribute("data-max", 2.0);
testCopyNoRandomCopyView.setAttribute("data-ticks", 20);
testCopyNoRandomCopyView.setAttribute("width", 1000);
const testCopyNoRandomCopyViewMean = document.createElement("stat-scale");
testCopyNoRandomCopyViewMean.setAttribute("data-max", 2.0);
testCopyNoRandomCopyViewMean.setAttribute("data-ticks", 20);
testCopyNoRandomCopyViewMean.setAttribute("width", 1000);
const testCopyNoRandomCopyViewVar = document.createElement("stat-scale");
testCopyNoRandomCopyViewVar.setAttribute("data-max", 0.2);
testCopyNoRandomCopyViewVar.setAttribute("data-ticks", 20);
testCopyNoRandomCopyViewVar.setAttribute("width", 1000);

const testCopyCryptoRandomMakeViews = document.createElement("stat-scale");
testCopyCryptoRandomMakeViews.setAttribute("data-max", 2.0);
testCopyCryptoRandomMakeViews.setAttribute("data-ticks", 20);
testCopyCryptoRandomMakeViews.setAttribute("width", 1000);
const testCopyCryptoRandomMakeViewsMean = document.createElement("stat-scale");
testCopyCryptoRandomMakeViewsMean.setAttribute("data-max", 2.0);
testCopyCryptoRandomMakeViewsMean.setAttribute("data-ticks", 20);
testCopyCryptoRandomMakeViewsMean.setAttribute("width", 1000);
const testCopyCryptoRandomMakeViewsVar = document.createElement("stat-scale");
testCopyCryptoRandomMakeViewsVar.setAttribute("data-max", 1.0);
testCopyCryptoRandomMakeViewsVar.setAttribute("data-ticks", 10);
testCopyCryptoRandomMakeViewsVar.setAttribute("width", 1000);
const testCopyCryptoRandomFillRandom = document.createElement("stat-scale");
testCopyCryptoRandomFillRandom.setAttribute("data-max", 2.0);
testCopyCryptoRandomFillRandom.setAttribute("data-ticks", 20);
testCopyCryptoRandomFillRandom.setAttribute("width", 1000);
const testCopyCryptoRandomFillRandomMean = document.createElement("stat-scale");
testCopyCryptoRandomFillRandomMean.setAttribute("data-max", 2.0);
testCopyCryptoRandomFillRandomMean.setAttribute("data-ticks", 20);
testCopyCryptoRandomFillRandomMean.setAttribute("width", 1000);
const testCopyCryptoRandomFillRandomVar = document.createElement("stat-scale");
testCopyCryptoRandomFillRandomVar.setAttribute("data-max", 0.05);
testCopyCryptoRandomFillRandomVar.setAttribute("data-ticks", 5);
testCopyCryptoRandomFillRandomVar.setAttribute("width", 1000);
const testCopyCryptoRandomCopyView = document.createElement("stat-scale");
testCopyCryptoRandomCopyView.setAttribute("data-max", 2.0);
testCopyCryptoRandomCopyView.setAttribute("data-ticks", 20);
testCopyCryptoRandomCopyView.setAttribute("width", 1000);
const testCopyCryptoRandomCopyViewMean = document.createElement("stat-scale");
testCopyCryptoRandomCopyViewMean.setAttribute("data-max", 2.0);
testCopyCryptoRandomCopyViewMean.setAttribute("data-ticks", 20);
testCopyCryptoRandomCopyViewMean.setAttribute("width", 1000);
const testCopyCryptoRandomCopyViewVar = document.createElement("stat-scale");
testCopyCryptoRandomCopyViewVar.setAttribute("data-max", 0.2);
testCopyCryptoRandomCopyViewVar.setAttribute("data-ticks", 20);
testCopyCryptoRandomCopyViewVar.setAttribute("width", 1000);

const testCopyMathRandomMakeViews = document.createElement("stat-scale");
testCopyMathRandomMakeViews.setAttribute("data-max", 2.0);
testCopyMathRandomMakeViews.setAttribute("data-ticks", 20);
testCopyMathRandomMakeViews.setAttribute("width", 1000);
const testCopyMathRandomMakeViewsMean = document.createElement("stat-scale");
testCopyMathRandomMakeViewsMean.setAttribute("data-max", 2.0);
testCopyMathRandomMakeViewsMean.setAttribute("data-ticks", 20);
testCopyMathRandomMakeViewsMean.setAttribute("width", 1000);
const testCopyMathRandomMakeViewsVar = document.createElement("stat-scale");
testCopyMathRandomMakeViewsVar.setAttribute("data-max", 1.0);
testCopyMathRandomMakeViewsVar.setAttribute("data-ticks", 10);
testCopyMathRandomMakeViewsVar.setAttribute("width", 1000);
const testCopyMathRandomFillRandom = document.createElement("stat-scale");
testCopyMathRandomFillRandom.setAttribute("data-max", 20);
testCopyMathRandomFillRandom.setAttribute("data-ticks", 20);
testCopyMathRandomFillRandom.setAttribute("width", 1000);
const testCopyMathRandomFillRandomMean = document.createElement("stat-scale");
testCopyMathRandomFillRandomMean.setAttribute("data-max", 20);
testCopyMathRandomFillRandomMean.setAttribute("data-ticks", 20);
testCopyMathRandomFillRandomMean.setAttribute("width", 1000);
const testCopyMathRandomFillRandomVar = document.createElement("stat-scale");
testCopyMathRandomFillRandomVar.setAttribute("data-max", 5.0);
testCopyMathRandomFillRandomVar.setAttribute("data-ticks", 50);
testCopyMathRandomFillRandomVar.setAttribute("width", 1000);
const testCopyMathRandomCopyView = document.createElement("stat-scale");
testCopyMathRandomCopyView.setAttribute("data-max", 2.0);
testCopyMathRandomCopyView.setAttribute("data-ticks", 20);
testCopyMathRandomCopyView.setAttribute("width", 1000);
const testCopyMathRandomCopyViewMean = document.createElement("stat-scale");
testCopyMathRandomCopyViewMean.setAttribute("data-max", 2.0);
testCopyMathRandomCopyViewMean.setAttribute("data-ticks", 20);
testCopyMathRandomCopyViewMean.setAttribute("width", 1000);
const testCopyMathRandomCopyViewVar = document.createElement("stat-scale");
testCopyMathRandomCopyViewVar.setAttribute("data-max", 0.2);
testCopyMathRandomCopyViewVar.setAttribute("data-ticks", 20);
testCopyMathRandomCopyViewVar.setAttribute("width", 1000);

function start( [ evtWindow ] ) {
  document.body.appendChild(document.createTextNode("Copy - No Random - Make Views"));
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyNoRandomMakeViews);
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyNoRandomMakeViewsMean);
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyNoRandomMakeViewsVar);
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(document.createTextNode("Copy - No Random - Fill Random"));
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyNoRandomFillRandom);
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyNoRandomFillRandomMean);
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyNoRandomFillRandomVar);
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(document.createTextNode("Copy - No Random - Copy View"));
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyNoRandomCopyView);
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyNoRandomCopyViewMean);
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyNoRandomCopyViewVar);
  document.body.appendChild(document.createElement("br"));

  document.body.appendChild(document.createTextNode("Copy - Crypto Random - Make Views"));
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyCryptoRandomMakeViews);
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyCryptoRandomMakeViewsMean);
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyCryptoRandomMakeViewsVar);
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(document.createTextNode("Copy - Crypto Random - Fill Random"));
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyCryptoRandomFillRandom);
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyCryptoRandomFillRandomMean);
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyCryptoRandomFillRandomVar);
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(document.createTextNode("Copy - Crypto Random - Copy View"));
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyCryptoRandomCopyView);
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyCryptoRandomCopyViewMean);
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyCryptoRandomCopyViewVar);
  document.body.appendChild(document.createElement("br"));

  document.body.appendChild(document.createTextNode("Copy - Math Random - Make Views"));
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyMathRandomMakeViews);
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyMathRandomMakeViewsMean);
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyMathRandomMakeViewsVar);
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(document.createTextNode("Copy - Math Random - Fill Random"));
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyMathRandomFillRandom);
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyMathRandomFillRandomMean);
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyMathRandomFillRandomVar);
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(document.createTextNode("Copy - Math Random - Copy View"));
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyMathRandomCopyView);
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyMathRandomCopyViewMean);
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(testCopyMathRandomCopyViewVar);
  document.body.appendChild(document.createElement("br"));

  testCopyCryptoRandom();
  
  const divTimedResults = document.createElement("div");
  document.body.appendChild(divTimedResults);
  function update(timeRemaining) {
    console.log(timeRemaining);
    divTimedResults.innerHTML = "Remaining: " + (timeRemaining / 1000) + " sec";
  }
  timedResults(testCopyNoRandom, 10 * 1000, update, 10).then(function (results) {
    divTimedResults.innerHTML = JSON.stringify(results) + "<br>";
    for (const category of Object.getOwnPropertyNames(results)) {
      const categoryResults = results[category];
      divTimedResults.innerHTML += category + "<br>";
      for (const property of Object.getOwnPropertyNames(categoryResults)) {
        divTimedResults.innerHTML += "_" + property + ": " + categoryResults[property].toFixed(3) + "<br>";
      }
      const categoryAnalysis = skewAnalysis(categoryResults);
      for (const property of Object.getOwnPropertyNames(categoryAnalysis)) {
        divTimedResults.innerHTML += "_" + property + ": " + categoryAnalysis[property].toFixed(3) + "<br>";
      }
    }
  });
/*
  let testFunctionNumber = 0;
  setInterval(function () {
    switch (testFunctionNumber) {
      case 0:
        console.log("testCopyNoRandom");
        report(testCopyNoRandom,
               testCopyNoRandomMakeViewsMean, 
               testCopyNoRandomMakeViewsVar,
               testCopyNoRandomFillRandomMean,
               testCopyNoRandomFillRandomVar,
               testCopyNoRandomCopyViewMean,
               testCopyNoRandomCopyViewVar,
               testCopyNoRandomMakeViews, 
               testCopyNoRandomFillRandom,
               testCopyNoRandomCopyView);
        break;
      case 1:
        console.log("testCopyCryptoRandom");
        report(testCopyCryptoRandom,
               testCopyCryptoRandomMakeViewsMean, 
               testCopyCryptoRandomMakeViewsVar,
               testCopyCryptoRandomFillRandomMean,
               testCopyCryptoRandomFillRandomVar,
               testCopyCryptoRandomCopyViewMean,
               testCopyCryptoRandomCopyViewVar,
               testCopyCryptoRandomMakeViews, 
               testCopyCryptoRandomFillRandom,
               testCopyCryptoRandomCopyView);
        break;
      case 2:
        console.log("testCopyMathRandom");
        report(testCopyMathRandom,
               testCopyMathRandomMakeViewsMean, 
               testCopyMathRandomMakeViewsVar,
               testCopyMathRandomFillRandomMean,
               testCopyMathRandomFillRandomVar,
               testCopyMathRandomCopyViewMean,
               testCopyMathRandomCopyViewVar,
               testCopyMathRandomMakeViews, 
               testCopyMathRandomFillRandom,
               testCopyMathRandomCopyView);
        break;
      default:
        break;
    }
    ++testFunctionNumber;
    if (testFunctionNumber > 2) {
      testFunctionNumber = 0;
    }
  }, 1000);
*/
}
function report(testCopy, testCopyMakeViewsMean, testCopyMakeViewsVar, testCopyFillRandomMean, testCopyFillRandomVar, testCopyCopyViewMean, testCopyCopyViewVar, testCopyMakeViews, testCopyFillRandom, testCopyCopyView) {
  const start = performance.now();
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

  testCopyMakeViewsMean.addDataPoint(makeViewsAvg);
  testCopyMakeViewsVar.addDataPoint(makeViewsVar);
  testCopyFillRandomMean.addDataPoint(fillRandomAvg);
  testCopyFillRandomVar.addDataPoint(fillRandomVar);
  testCopyCopyViewMean.addDataPoint(copyViewAvg);
  testCopyCopyViewVar.addDataPoint(copyViewVar);
  
  testCopyMakeViews.reset();
  for (const sample of makeViewsSamples) {
    testCopyMakeViews.addDataPoint(sample);
  }
  testCopyFillRandom.reset();
  for (const sample of fillRandomSamples) {
    testCopyFillRandom.addDataPoint(sample);
  }
  testCopyCopyView.reset();
  for (const sample of copyViewSamples) {
    testCopyCopyView.addDataPoint(sample);
  }
  
  const end = performance.now();
  console.log("test time:", (end - start), "ms");

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
  for (let elem of view1_32) {
    elem = Math.random() * (2 ** 32);
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

function timedResults(testFunc, timingLimit, updateFunc, batchSize) {
  const start = performance.now();
  const end = start + timingLimit;
  const rawResultsMap = new Map();
  const resultsMap = new Map();
  const logResultsMap = new Map();
  const batchMap = new Map();
  const firstRun = testFunc();
  for (const category of Object.getOwnPropertyNames(firstRun)) {
    rawResultsMap.set(category, new Array(0));
    resultsMap.set(category, new Array(0));
    logResultsMap.set(category, new Array(0));
    batchMap.set(category, new Array(batchSize));
  }
  const intervalHandle = setInterval(function () {
    if (updateFunc) {
      updateFunc(end - performance.now());
    }
    const startCycle = performance.now();
    const endCycle = start + 500;
    while (performance.now() < endCycle) {
      for (let i = 0; i < batchSize; ++i) {
        const results = testFunc();
        for (const category of Object.getOwnPropertyNames(results)) {
          const batchArray = batchMap.get(category);
          batchArray[i] = results[category];
          const resultsArray = rawResultsMap.get(category);
          resultsArray.push(results[category]);
        }
      }
      for (const [category, _] of resultsMap) {
        const batchArray = batchMap.get(category);
        const resultsArray = resultsMap.get(category);
        const logResultsArray = logResultsMap.get(category);
        let mean = 0;
        let logMean = 0;
        for (const sample of batchArray) {
          mean += sample;
          logMean += Math.log(sample);
        }
        mean /= batchSize;
        logMean /= batchSize;
        resultsArray.push(mean);
        logResultsArray.push(logMean);
      }
    }
  }, 1000);
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, timingLimit);
  }).then(function () {
    clearInterval(intervalHandle);
    let ret = {};
    for (const [category, _] of resultsMap) {
      const resultsArray = resultsMap.get(category);
      const rawResultsArray = rawResultsMap.get(category);
      ret[category] = {};
      ret[category].batches = resultsArray.length;
      ret[category].batchSize = batchSize;
      rawResultsArray.sort(function compareFn(a, b) {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      });
      resultsArray.sort(function compareFn(a, b) {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      });
      ret[category].mean = 0;
      for (const sample of resultsArray) {
        ret[category].mean += sample;
      }
      ret[category].mean /= ret[category].batches;
      ret[category].variance = 0;
      for (const sample of resultsArray) {
        ret[category].variance += (sample - ret[category].mean) ** 2;
      }
      ret[category].variance /= (ret[category].batches - 1);
      ret[category].fullVariance = ret[category].variance * Math.sqrt(batchSize);
      const logResultsArray = logResultsMap.get(category);
      ret[category].mu = 0;
      for (const sample of logResultsArray) {
        ret[category].mu += sample;
      }
      ret[category].mu /= ret[category].batches;
      ret[category].sigma_2 = 0;
      for (const sample of logResultsArray) {
        ret[category].sigma_2 += (sample - ret[category].mu) ** 2;
      }
      ret[category].sigma_2 /= (ret[category].batches - 1);
      ret[category].fullSigma_2 = ret[category].sigma_2 * Math.sqrt(batchSize);
      const first10Index = fractionIndex((1 / 10), ret[category].batches);
      ret[category].first10 = interpolate(first10Index, resultsArray);
      const firstQuartileIndex = fractionIndex((1 / 4), ret[category].batches);
      ret[category].firstQuartile = interpolate(firstQuartileIndex, resultsArray);
      const medianIndex = fractionIndex((1 / 2), ret[category].batches);
      ret[category].median = interpolate(medianIndex, resultsArray);
      const thirdQuartileIndex = fractionIndex((3 / 4), ret[category].batches);
      ret[category].thirdQuartile = interpolate(thirdQuartileIndex, resultsArray);
      const last10Index = fractionIndex((9 / 10), ret[category].batches);
      ret[category].last10 = interpolate(last10Index, resultsArray);
    }
    return ret;
  });
}
function fractionIndex(fraction, numElements) {
  return (fraction * (numElements - 1)) + (1 / 2);
}
function interpolate(x, resultsArray) {
  const x1 = Math.floor(x);
  const x2 = x1 + 1;
  const y1 = resultsArray[x1];
  const y2 = resultsArray[x2];
  return ((y2 - y1) / (x2 - x1)) * (x - x1) + y1;
}
function skewAnalysis(args) {
  let ret = {};
  const erf_const_25 = 0.476936276689031;
  const erf_const_10 = 0.906193802436823;
  const erf_const_5 = 1.16308715367668;
  ret.normFirst5 = args.mean - (erf_const_5 * Math.sqrt(2 * args.variance));
  ret.normFirst10 = args.mean - (erf_const_10 * Math.sqrt(2 * args.variance));
  ret.normFirstQuartile = args.mean - (erf_const_25 * Math.sqrt(2 * args.variance));
  ret.normMedian = args.mean;
  ret.normThirdQuartile = args.mean + (erf_const_25 * Math.sqrt(2 * args.variance));
  ret.normLast10 = args.mean + (erf_const_10 * Math.sqrt(2 * args.variance));
  ret.normLast5 = args.mean + (erf_const_5 * Math.sqrt(2 * args.variance));
  ret.logNormFirst5 = Math.exp(args.mu - (erf_const_5 * Math.sqrt(2 * args.sigma_2)));
  ret.logNormFirst10 = Math.exp(args.mu - (erf_const_10 * Math.sqrt(2 * args.sigma_2)));
  ret.logNormFirstQuartile = Math.exp(args.mu - (erf_const_25 * Math.sqrt(2 * args.sigma_2)));
  ret.logNormMedian = Math.exp(args.mu);
  ret.logNormThirdQuartile = Math.exp(args.mu + (erf_const_25 * Math.sqrt(2 * args.sigma_2)));
  ret.logNormLast10 = Math.exp(args.mu + (erf_const_10 * Math.sqrt(2 * args.sigma_2)));
  ret.logNormLast5 = Math.exp(args.mu + (erf_const_5 * Math.sqrt(2 * args.sigma_2)));
  return ret;
}
