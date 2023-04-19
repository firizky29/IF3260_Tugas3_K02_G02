import { Butterfly } from './models/butterfly.js';


const helpbtn = document.querySelector('#help');
const closebtn = document.querySelector('#close');


// initialize canvas
let canvas = document.querySelector('#canvas');
let gl = getWebGLContext(canvas);

let articulatedModel = null;

function setModel(gl, program, model) {
  articulatedModel = new Model(gl, program, model);
}

const main = async () => {
  // initialize program
  let program = await createProgram(gl);

  // initialize (default) model
  const defaultModel = Butterfly;
  setModel(gl, program, defaultModel);

  eventHandler();
  render();
}

const render = () => {
  clearCanvas();

  // set up matrix
  let projectionMat = new Matrix4().identity();
  let viewMat = new Matrix4().identity();
  let modelMat = new Matrix4().identity();
  
  // set up camera
  let cameraPos = [0, 0, 5];
  
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

  gl.clearColor(255, 255, 255, 1); // clear to canvas default color (#3b3b3b)
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