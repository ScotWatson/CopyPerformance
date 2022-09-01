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


let makeViewsAvg = 0;
let fillRandomAvg = 0;
let copyViewAvg = 0;
const timeConstant = 0.125;
const samples = new Array(10);

function start( [ evtWindow ] ) {
  setInterval(report, 1000);
}
function report() {
  let total = 0;
  const iterations = 100;
  let makeViewsTotal = 0;
  let fillRandomTotal = 0;
  let copyViewTotal = 0;
  for (let i = 0; i < iterations; ++i) {
    const runtimes = testCopy();
    makeViewsTotal += runtimes.makeViews;
    fillRandomTotal += runtimes.fillRandom;
    copyViewTotal += runtimes.copyView;
    total += runtime;
  }
  makeViewsAvg = (1 - timeConstant) * makeViewsAvg + timeConstant * (makeViewsTotal / iterations);
  fillRandomAvg = (1 - timeConstant) * fillRandomAvg + timeConstant * (fillRandomTotal / iterations);
  copyViewAvg = (1 - timeConstant) * copyViewAvg + timeConstant * (copyViewTotal / iterations);
  console.log(makeViewsAvg, "ms", fillRandomAvg, "ms", copyViewAvg, "ms");
}
function testCopy() {
  const length = 1000000;
  const time0 = self.performance.now();
  const view = new Uint8Array(length);
  const view2 = new Uint8Array(length);
  const time1 = self.performance.now();
  for (let elem of view) {
    elem = Math.random() * 255;
  }
  const time2 = self.performance.now();
  view2.set(view);
  const time3 = self.performance.now();
  return {
    makeViews: time1 - time0,
    fillRandom: time2 - time1,
    copyView: time3 - time2,
  };
}
