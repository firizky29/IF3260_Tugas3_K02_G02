import { getWebGLContext, createProgram } from './utils/webglUtils.js';
import { Model } from './utils/model/Model.js';
import { Butterfly } from './models/butterfly.js';



const helpbtn = document.querySelector('#help');
const closebtn = document.querySelector('#close');


// initialize canvas
let canvas = document.querySelector('#canvas');
let gl = getWebGLContext(canvas);

let articulatedModel = null;

function setModel(model) {
  articulatedModel = new Model(gl, program, model);
}

const main = () => {
  // initialize program
  let program = createProgram(gl);

  // initialize (default) model
  const defaultModel = Butterfly;
  setModel(defaultModel);

  eventHandler();
  render();
}

const render = () => {
  clearCanvas();

  // set up matrix
  let projectionMat = mat4.create();
  let viewMat = mat4.create();
  let modelMat = mat4.create();
  
  // set up camera
  let cameraPos = vec3.fromValues(0, 0, 5);
  mat4.lookAt(viewMat, cameraPos, [0, 0, 0], [0, 1, 0]);

  // set up shading
  let isShading = true;

  articulatedModel.drawModel(projectionMat, viewMat, modelMat, cameraPos, isShading);

  requestAnimationFrame(render);
}


function clearCanvas() {
  function resizeCanvasToDisplaySize(canvas, multiplier) {
    multiplier = multiplier || 1;
    const width = (canvas.clientWidth * multiplier) | 0;
    const height = (canvas.clientHeight * multiplier) | 0;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      return true;
    }
    return false;
  }

  // resize canvas to match screen size
  resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, canvas.width, canvas.height);

  gl.clearColor(0, 0, 0, 1); // clear to canvas default color (#3b3b3b)
  gl.clearDepth(1);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

const eventHandler = () => {
  // help button
  helpbtn.addEventListener('click', () => {
    document.querySelector('#help-container').style.display = 'inline';
  });
  
  closebtn.addEventListener('click', () => {
    document.querySelector('#help-container').style.display = 'none';
  });
}


// RUN MAIN FUNCTION WHEN PAGE IS LOADED
window.onload = main;