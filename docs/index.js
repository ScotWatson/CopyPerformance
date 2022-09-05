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
  }
  connectedCallback() {
    console.log("connectedCallback");
    this.attachShadow({mode: 'open'});
    this.#maxDiv = document.createElement("div");
    this.#scaleCanvas = document.createElement("canvas");
    this.#maxDiv.innerHTML = "Max:";
    this.shadowRoot.appendChild(this.#maxDiv);
    this.#scaleCanvas.width = 1000;
    this.#scaleCanvas.height = 50;
    this.#scaleCanvas.style.width = this.#scaleCanvas.width + "px";
    this.#scaleCanvas.style.height = this.#scaleCanvas.height + "px";
    this.shadowRoot.appendChild(this.#scaleCanvas);
  }
  disconnectedCallback() {
  }
  adoptedCallback() {
  }
  #clear() {
    const ctx = this.#scaleCanvas.getContext("2d");
    ctx.globalAlpha = 1;
    ctx.fillColor = "#FFFFFF";
    ctx.strokeColor = "#FFFFFF";
    const width = this.getAttribute("width");
    ctx.fillRect(0, 0, width, 50);
  }
  #drawTicks(newValue) {
    const ctx = this.#scaleCanvas.getContext("2d");
    ctx.globalAlpha = 1;
    ctx.fillColor = "#FFFFFF";
    ctx.strokeColor = "#FFFFFF";
    const width = this.getAttribute("width");
    ctx.fillRect(0, 0, width, 25);
    ctx.fillColor = "#FFFFFF";
    ctx.strokeColor = "#000000";
    ctx.beginPath();
    for (let i = 0; i <= newValue; ++i) {
      const x = (width / newValue) * i;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 25);
    }
    ctx.stroke();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    ctx.globalAlpha = 0.1;
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
    return ["data-max", "data-interval", "width"];
  }
  addDataPoint(value) {
    const ctx = this.#scaleCanvas.getContext("2d");
    ctx.globalAlpha = 0.1;
    const max = this.getAttribute("data-max");
    const width = this.getAttribute("width");
    ctx.fillColor = "#FFFFFF";
    ctx.strokeColor = "#000000";
    ctx.beginPath();
    const x = (value / max) * width;
    ctx.moveTo(x, 25);
    ctx.lineTo(x, 50);
    ctx.stroke();
  }
};

window.customElements.define("stat-scale", HTMLStatScaleElement);

const testCopyNoRandomMakeViewsMean = document.createElement("stat-scale");
testCopyNoRandomMakeViewsMean.setAttribute("data-max", 0.10);
testCopyNoRandomMakeViewsMean.setAttribute("data-ticks", 10);
testCopyNoRandomMakeViewsMean.setAttribute("width", 1000);
const testCopyNoRandomMakeViewsVar = document.createElement("stat-scale");
testCopyNoRandomMakeViewsVar.setAttribute("data-max", 0.10);
testCopyNoRandomMakeViewsVar.setAttribute("data-ticks", 10);
testCopyNoRandomMakeViewsVar.setAttribute("width", 1000);
const testCopyNoRandomFillRandomMean = document.createElement("stat-scale");
testCopyNoRandomFillRandomMean.setAttribute("data-max", 0.10);
testCopyNoRandomFillRandomMean.setAttribute("data-ticks", 10);
testCopyNoRandomFillRandomMean.setAttribute("width", 1000);
const testCopyNoRandomFillRandomVar = document.createElement("stat-scale");
testCopyNoRandomFillRandomVar.setAttribute("data-max", 0.10);
testCopyNoRandomFillRandomVar.setAttribute("data-ticks", 10);
testCopyNoRandomFillRandomVar.setAttribute("width", 1000);
const testCopyNoRandomCopyViewMean = document.createElement("stat-scale");
testCopyNoRandomCopyViewMean.setAttribute("data-max", 0.50);
testCopyNoRandomCopyViewMean.setAttribute("data-ticks", 10);
testCopyNoRandomCopyViewMean.setAttribute("width", 1000);
const testCopyNoRandomCopyViewVar = document.createElement("stat-scale");
testCopyNoRandomCopyViewVar.setAttribute("data-max", 0.50);
testCopyNoRandomCopyViewVar.setAttribute("data-ticks", 10);
testCopyNoRandomCopyViewVar.setAttribute("width", 1000);

const testCopyCryptoRandomMakeViewsMean = document.createElement("stat-scale");
testCopyCryptoRandomMakeViewsMean.setAttribute("data-max", 0.10);
testCopyCryptoRandomMakeViewsMean.setAttribute("data-ticks", 10);
testCopyCryptoRandomMakeViewsMean.setAttribute("width", 1000);
const testCopyCryptoRandomMakeViewsVar = document.createElement("stat-scale");
testCopyCryptoRandomMakeViewsVar.setAttribute("data-max", 0.10);
testCopyCryptoRandomMakeViewsVar.setAttribute("data-ticks", 10);
testCopyCryptoRandomMakeViewsVar.setAttribute("width", 1000);
const testCopyCryptoRandomFillRandomMean = document.createElement("stat-scale");
testCopyCryptoRandomFillRandomMean.setAttribute("data-max", 3.50);
testCopyCryptoRandomFillRandomMean.setAttribute("data-ticks", 10);
testCopyCryptoRandomFillRandomMean.setAttribute("width", 1000);
const testCopyCryptoRandomFillRandomVar = document.createElement("stat-scale");
testCopyCryptoRandomFillRandomVar.setAttribute("data-max", 0.10);
testCopyCryptoRandomFillRandomVar.setAttribute("data-ticks", 10);
testCopyCryptoRandomFillRandomVar.setAttribute("width", 1000);
const testCopyCryptoRandomCopyViewMean = document.createElement("stat-scale");
testCopyCryptoRandomCopyViewMean.setAttribute("data-max", 0.50);
testCopyCryptoRandomCopyViewMean.setAttribute("data-ticks", 10);
testCopyCryptoRandomCopyViewMean.setAttribute("width", 1000);
const testCopyCryptoRandomCopyViewVar = document.createElement("stat-scale");
testCopyCryptoRandomCopyViewVar.setAttribute("data-max", 0.50);
testCopyCryptoRandomCopyViewVar.setAttribute("data-ticks", 10);
testCopyCryptoRandomCopyViewVar.setAttribute("width", 1000);

const testCopyMathRandomMakeViewsMean = document.createElement("stat-scale");
testCopyMathRandomMakeViewsMean.setAttribute("data-max", 0.10);
testCopyMathRandomMakeViewsMean.setAttribute("data-ticks", 10);
testCopyMathRandomMakeViewsMean.setAttribute("width", 1000);
const testCopyMathRandomMakeViewsVar = document.createElement("stat-scale");
testCopyMathRandomMakeViewsVar.setAttribute("data-max", 0.10);
testCopyMathRandomMakeViewsVar.setAttribute("data-ticks", 10);
testCopyMathRandomMakeViewsVar.setAttribute("width", 1000);
const testCopyMathRandomFillRandomMean = document.createElement("stat-scale");
testCopyMathRandomFillRandomMean.setAttribute("data-max", 12);
testCopyMathRandomFillRandomMean.setAttribute("data-ticks", 10);
testCopyMathRandomFillRandomMean.setAttribute("width", 1000);
const testCopyMathRandomFillRandomVar = document.createElement("stat-scale");
testCopyMathRandomFillRandomVar.setAttribute("data-max", 1.00);
testCopyMathRandomFillRandomVar.setAttribute("data-ticks", 10);
testCopyMathRandomFillRandomVar.setAttribute("width", 1000);
const testCopyMathRandomCopyViewMean = document.createElement("stat-scale");
testCopyMathRandomCopyViewMean.setAttribute("data-max", 0.50);
testCopyMathRandomCopyViewMean.setAttribute("data-ticks", 10);
testCopyMathRandomCopyViewMean.setAttribute("width", 1000);
const testCopyMathRandomCopyViewVar = document.createElement("stat-scale");
testCopyMathRandomCopyViewVar.setAttribute("data-max", 0.50);
testCopyMathRandomCopyViewVar.setAttribute("data-ticks", 10);
testCopyMathRandomCopyViewVar.setAttribute("width", 1000);

function start( [ evtWindow ] ) {
  document.body.appendChild(testCopyNoRandomMakeViewsMean);
  document.body.appendChild(testCopyNoRandomMakeViewsVar);
  document.body.appendChild(testCopyNoRandomFillRandomMean);
  document.body.appendChild(testCopyNoRandomFillRandomVar);
  document.body.appendChild(testCopyNoRandomCopyViewMean);
  document.body.appendChild(testCopyNoRandomCopyViewVar);

  document.body.appendChild(testCopyCryptoRandomMakeViewsMean);
  document.body.appendChild(testCopyCryptoRandomMakeViewsVar);
  document.body.appendChild(testCopyCryptoRandomFillRandomMean);
  document.body.appendChild(testCopyCryptoRandomFillRandomVar);
  document.body.appendChild(testCopyCryptoRandomCopyViewMean);
  document.body.appendChild(testCopyCryptoRandomCopyViewVar);

  document.body.appendChild(testCopyMathRandomMakeViewsMean);
  document.body.appendChild(testCopyMathRandomMakeViewsVar);
  document.body.appendChild(testCopyMathRandomFillRandomMean);
  document.body.appendChild(testCopyMathRandomFillRandomVar);
  document.body.appendChild(testCopyMathRandomCopyViewMean);
  document.body.appendChild(testCopyMathRandomCopyViewVar);

  testCopyCryptoRandom();
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
               testCopyNoRandomCopyViewVar);
        break;
      case 1:
        console.log("testCopyCryptoRandom");
        report(testCopyCryptoRandom,
               testCopyCryptoRandomMakeViewsMean, 
               testCopyCryptoRandomMakeViewsVar,
               testCopyCryptoRandomFillRandomMean,
               testCopyCryptoRandomFillRandomVar,
               testCopyCryptoRandomCopyViewMean,
               testCopyCryptoRandomCopyViewVar);
        break;
      case 2:
        console.log("testCopyMathRandom");
        report(testCopyMathRandom,
               testCopyMathRandomMakeViewsMean, 
               testCopyMathRandomMakeViewsVar,
               testCopyMathRandomFillRandomMean,
               testCopyMathRandomFillRandomVar,
               testCopyMathRandomCopyViewMean,
               testCopyMathRandomCopyViewVar);
        break;
      default:
        break;
    }
    ++testFunctionNumber;
    if (testFunctionNumber > 2) {
      testFunctionNumber = 0;
    }
  }, 1000);
}
function report(testCopy, testCopyMakeViewsMean, testCopyMakeViewsVar, testCopyFillRandomMean, testCopyFillRandomVar, testCopyCopyViewMean, testCopyCopyViewVar) {
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
