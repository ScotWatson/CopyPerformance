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

function start( [ evtWindow ] ) {
  setInterval(report, 1000);
}
function report() {
  let total = 0;
  const iterations = 100;
  for (let i = 0; i < iterations; ++i) {
    const runtime = testCopy();
    total += runtime;
  }
  console.log(total / iterations);
}
function testCopy() {
  const view = new Uint8Array(1000000);
  for (let elem of view) {
    elem = Math.random() * 255;
  }
  const view2 = new Uint8Array(1000000);
  const start = self.performance.now();
  view2.set(view);
  const end = self.performance.now();
  return (end - start);
}
