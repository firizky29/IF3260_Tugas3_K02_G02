let currentNodeCount = 0;


// to be deleted
const cubeModel = {
  num_vertices: 8,
  vertices: [
    [0.5, 0.5, 0.5],
    [-0.5, 0.5, 0.5],
    [-0.5, -0.5, 0.5],
    [0.5, -0.5, 0.5],
    [0.5, 0.5, -0.5],
    [-0.5, 0.5, -0.5],
    [-0.5, -0.5, -0.5],
    [0.5, -0.5, -0.5],
  ],
  num_indices: 6,
  indices: [
    [0, 1, 2, 3], // Front
    [5, 4, 7, 6], // Back
    [4, 0, 3, 7], // Right
    [1, 5, 6, 2], // Left
    [0, 4, 5, 1], // Top
    [2, 6, 7, 3], // Bottom
  ],
  colors: [
    [255, 0, 0, 255],
    [255, 0, 0, 255],
    [255, 0, 0, 255],
    [255, 0, 0, 255],
    [255, 0, 0, 255],
    [255, 0, 0, 255],
  ],
};

const cubeModel2 = {
  num_vertices: 8,
  vertices: [
    [1, 0.5, 0.5],
    [0, 0.5, 0.5],
    [0, -0.5, 0.5],
    [1, -0.5, 0.5],
    [1, 0.5, -0.5],
    [0, 0.5, -0.5],
    [0, -0.5, -0.5],
    [1, -0.5, -0.5],
  ],
  num_indices: 6,
  indices: [
    [0, 1, 2, 3], // Front
    [5, 4, 7, 6], // Back
    [4, 0, 3, 7], // Right
    [1, 5, 6, 2], // Left
    [0, 4, 5, 1], // Top
    [2, 6, 7, 3], // Bottom
  ],
  colors: [
    [255, 255, 255, 255],
    [255, 255, 255, 255],
    [255, 255, 255, 255],
    [255, 255, 255, 255],
    [255, 255, 255, 255],
    [255, 255, 255, 255],
  ],
};

let webgl = await new WebGLHandler(document.querySelector('canvas')).init();

let builder = new AnimationBuilder(webgl);

let currentModel = {
  object: cubeModel,
  part: 'Part 1',
  textureType: 'NONE',
  translation: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
  subtree_translate: [0, 0, 0],
  subtree_rotate: [0, 0, 0],
  subtree_scale: [1, 1, 1],
  children: [],
};

let currentModel2 = {
  object: cubeModel2,
  part: 'Part 2',
  textureType: 'NONE',
  translation: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
  subtree_translate: [0, 0, 0],
  subtree_rotate: [0, 0, 0],
  subtree_scale: [1, 1, 1],
  children: [],
};

const initialState = {
  model: currentModel,
  selectedModel: currentModel,
  projectionType: 'orthographic',
  isShading: true,
  textureType: -1,
  fudgeFactor: 0,
  obliqueTetha: Converter.degToRad(45),
  obliquePhi: Converter.degToRad(45),
  far: -1,
  near: 1,
  top: 1,
  bottom: -1,
  left: -1,
  right: 1,
  zfar: 1,
  znear: 0.01,
  cameraRadius: -0.01,
  cameraRotation: Converter.degToRad(0),
};

let state = {
  model: currentModel,
  selectedModel: currentModel,
  projectionType: 'orthographic',
  isShading: true,
  textureType: -1,
  fudgeFactor: 0,
  obliqueTetha: Converter.degToRad(45),
  obliquePhi: Converter.degToRad(45),
  far: -1,
  near: 1,
  top: 1,
  bottom: -1,
  left: -1,
  right: 1,
  zfar: 1,
  znear: 0.01,
  cameraRadius: -0.01,
  cameraRotation: Converter.degToRad(0),
};

// console.log(renderSettings.drawCounter)

const eventHandler = {
  updatePosition(index) {
    return (event, value) => {
      builder.setIsPlaying(false);
      state.selectedModel.translation[index] = value;
      webgl.drawArticulated(state);
    };
  },

  updateRotation(index) {
    return (event, value) => {
      builder.setIsPlaying(false);
      const angleInDegrees = value;
      const angleInRadians = Converter.degToRad(angleInDegrees);
      state.selectedModel.rotation[index] = angleInRadians;
      webgl.drawArticulated(state);
    };
  },

  updateScale(index) {
    return (event, value) => {
      builder.setIsPlaying(false);
      state.selectedModel.scale[index] = value;
      webgl.drawArticulated(state);
    };
  },

  updateCompPosition(index) {
    return (event, value) => {
      builder.setIsPlaying(false);
      state.selectedModel.subtree_translate[index] = value;
      webgl.drawArticulated(state);
    };
  },

  updateCompRotation(index) {
    return (event, value) => {
      builder.setIsPlaying(false);
      const angleInDegrees = value;
      const angleInRadians = Converter.degToRad(angleInDegrees);
      state.selectedModel.subtree_rotate[index] = angleInRadians;
      webgl.drawArticulated(state);
    };
  },

  updateCompScale(index) {
    return (event, value) => {
      builder.setIsPlaying(false);
      state.selectedModel.subtree_scale[index] = value;
      webgl.drawArticulated(state);
    };
  },

  loadModel() {
    return (event) => {
      console.log('load model');
      var input = document.createElement('input');
      input.type = 'file';
      input.setAttribute('accept', 'application/json, .txt');
      input.onchange = (e) => {
        var file = e.target.files[0];

        if (!file) {
          return;
        }

        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');

        reader.onload = async (readerEvent) => {
          var content = readerEvent.target.result;
          content = JSON.parse(content);
          state.model = content;
          state.selectedModel = content;

          webgl.destroy();
          webgl = await new WebGLHandler(
            document.querySelector('canvas')
          ).init();

          webgl.clearCanvas().drawArticulated(state);

          setComponentTree(state.model);
        };
      };
      input.click();
    };
  },

  saveModel() {
    return (event) => {
      builder.setIsPlaying(false);      

      var dataStr =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(state.model));

      var dlAnchorElem = document.createElement('a');
      dlAnchorElem.setAttribute('href', dataStr);
      dlAnchorElem.setAttribute('download', 'model.json');
      dlAnchorElem.click();
    };
  },

  loadModelAsChild() {
    return (event) => {
      builder.setIsPlaying(false);

      console.log('load model as child');
      var input = document.createElement('input');
      input.type = 'file';
      input.setAttribute('accept', 'application/json, .txt');
      input.onchange = (e) => {
        var file = e.target.files[0];

        if (!file) {
          return;
        }

        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');

        reader.onload = (readerEvent) => {
          var content = readerEvent.target.result;
          content = JSON.parse(content);
          // set all to default
          state.selectedModel.children.push(content);

          webgl.drawArticulated(state);

          setComponentTree(state.model);
        };
      };
      input.click();
    };
  },

  updateProjectionType() {
    return (event) => {
      state.projectionType = event.target.value;
      webgl.drawArticulated(state);
    };
  },

  updateShadingState() {
    return (event) => {
      state.isShading = event.target.checked;
      webgl.drawArticulated(state);
    };
  },

  updateCameraRadius() {
    return (event, value) => {
      builder.setIsPlaying(false);
      
      state.cameraRadius = value;
      webgl.drawArticulated(state);
    };
  },

  updateCameraRotation() {
    return (event, value) => {
      builder.setIsPlaying(false);

      state.cameraRotation = Converter.degToRad(value);
      webgl.drawArticulated(state);
    };
  },

    selectModel(model){
        return (event) => {
            state.selectedModel = model;
            document.querySelector('#chosen-component-name').innerHTML = model.part;
        }
    },

    saveFrame() {
        return (event) => {
            if(builder.isPlaying){
              builder.setIsPlaying(false);
            } else {
              builder.addState(state.model);
            }
        }
    },

    playButton(){
        return (event) => {
            builder.setIsPlaying(true);
            builder.playFrames(state);
        }
    },

    pauseButton(){
        return (event) => {
            builder.setIsPlaying(false);
        }
    },

    updateTextureType(){
        return (event) => {
            if(event.target.value === 'none'){
              state.textureType = -1;
            } else if(event.target.value === 'image'){
              state.textureType = 0;
            } else if(event.target.value === 'environment'){
              state.textureType = 1;
            } else if(event.target.value === 'bump'){
              state.textureType = 2;
            }
            console.log(state.textureType)
            webgl.drawArticulated(state);
        }
    }


  // toDefaultButtonHandler() {
  //     return (event) => {
  //         document.querySelector('#projection').value = initialState.projectionType;
  //         document.querySelector('#projection').dispatchEvent(new Event('input'));
  //         document.querySelector('#shading').value = initialState.isShading;
  //         const cameraRadius = document.querySelector('#cameraRadius');
  //         cameraRadius.value = initialState.cameraRadius;
  //         cameraRadius.nextElementSibling.value = initialState.cameraRadius;

  //         const cameraRotation = document.querySelector('#cameraRotation');
  //         cameraRotation.value = initialState.cameraRotation;
  //         cameraRotation.nextElementSibling.value = initialState.cameraRotation;

  //         document.querySelectorAll('.translation').forEach((el, idx) => {
  //             el.value = initialState.translation[idx];
  //             el.nextElementSibling.value = initialState.translation[idx];
  //         });
  //         document.querySelectorAll('.rotation').forEach((el, idx) => {
  //             el.value = initialState.rotation[idx];
  //             el.nextElementSibling.value = initialState.rotation[idx];
  //         });
  //         document.querySelectorAll('.scaling').forEach((el, idx) => {
  //             el.value = initialState.scale[idx];
  //             el.nextElementSibling.value = initialState.scale[idx];
  //         });
  //         document.querySelector('#shading').checked = initialState.isShading;
  //         state = { ...initialState, model: state.model };
  //         webgl.clearBuffer().render(renderSettings, state);
  //     };
  // },
};

UIHandler.initSlider('#obj-translation-x', {
  initialValue: state.model.translation[0],
  handlerFn: eventHandler.updatePosition(0),
});

UIHandler.initSlider('#obj-translation-y', {
  initialValue: state.model.translation[1],
  handlerFn: eventHandler.updatePosition(1),
});

UIHandler.initSlider('#obj-translation-z', {
  initialValue: state.model.translation[2],
  handlerFn: eventHandler.updatePosition(2),
});

UIHandler.initSlider('#obj-rotation-x', {
  initialValue: state.model.rotation[0],
  handlerFn: eventHandler.updateRotation(0),
});

UIHandler.initSlider('#obj-rotation-y', {
  initialValue: state.model.rotation[1],
  handlerFn: eventHandler.updateRotation(1),
});

UIHandler.initSlider('#obj-rotation-z', {
  initialValue: state.model.rotation[2],
  handlerFn: eventHandler.updateRotation(2),
});

UIHandler.initSlider('#obj-scaling-x', {
  initialValue: state.model.scale[0],
  handlerFn: eventHandler.updateScale(0),
});

UIHandler.initSlider('#obj-scaling-y', {
  initialValue: state.model.scale[1],
  handlerFn: eventHandler.updateScale(1),
});

UIHandler.initSlider('#obj-scaling-z', {
  initialValue: state.model.scale[2],
  handlerFn: eventHandler.updateScale(2),
});

UIHandler.initSlider('#comp-translation-x', {
  initialValue: state.model.translation[0],
  handlerFn: eventHandler.updateCompPosition(0),
});

UIHandler.initSlider('#comp-translation-y', {
  initialValue: state.model.translation[1],
  handlerFn: eventHandler.updateCompPosition(1),
});

UIHandler.initSlider('#comp-translation-z', {
  initialValue: state.model.translation[2],
  handlerFn: eventHandler.updateCompPosition(2),
});

UIHandler.initSlider('#comp-rotation-x', {
  initialValue: state.model.rotation[0],
  handlerFn: eventHandler.updateCompRotation(0),
});

UIHandler.initSlider('#comp-rotation-y', {
  initialValue: state.model.rotation[1],
  handlerFn: eventHandler.updateCompRotation(1),
});

UIHandler.initSlider('#comp-rotation-z', {
  initialValue: state.model.rotation[2],
  handlerFn: eventHandler.updateCompRotation(2),
});

UIHandler.initSlider('#comp-scaling-x', {
  initialValue: state.model.scale[0],
  handlerFn: eventHandler.updateCompScale(0),
});

UIHandler.initSlider('#comp-scaling-y', {
  initialValue: state.model.scale[1],
  handlerFn: eventHandler.updateCompScale(1),
});

UIHandler.initSlider('#comp-scaling-z', {
  initialValue: state.model.scale[2],
  handlerFn: eventHandler.updateCompScale(2),
});

UIHandler.initRadio('#projection', {
  initialValue: state.projectionType,
  handlerFn: eventHandler.updateProjectionType(),
});

UIHandler.initRadio('#texture', {
  initialValue: 'none',
  handlerFn: eventHandler.updateTextureType(),
});

UIHandler.initButton('#load-model', {
  handlerFn: eventHandler.loadModel(),
});

UIHandler.initButton('#save-model', {
  handlerFn: eventHandler.saveModel(),
});

UIHandler.initButton('#load-model-as-children', {
  handlerFn: eventHandler.loadModelAsChild(),
});

UIHandler.initButton('#play-button', {
    handlerFn: eventHandler.playButton(),
});

UIHandler.initButton('#save-animation', {
    handlerFn: eventHandler.saveFrame(),
});


UIHandler.initButton('#pause-button', {
  handlerFn: eventHandler.pauseButton(),
});

UIHandler.initCheckbox('#shading', {
  initialValue: state.isShading,
  handlerFn: eventHandler.updateShadingState(),
});

UIHandler.initSlider('#camera-view', {
  initialValue: state.cameraRadius,
  handlerFn: eventHandler.updateCameraRadius(),
});

UIHandler.initSlider('#camera-rotate', {
  initialValue: state.cameraRotation,
  handlerFn: eventHandler.updateCameraRotation(),
});

// generate button tree
const setComponentTree = (model) => {
  const componentTree = document.querySelector('#component-tree');
  componentTree.innerHTML = '';
  generateComponentTree(model);
};

const generateComponentTree = (model, depth = 0) => {
  currentNodeCount++;
  const componentTree = document.querySelector('#component-tree');
  const button = document.createElement('button');

  let id =
    model.part.toLowerCase().replaceAll(' ', '-') + '-' + currentNodeCount;
  button.id = id;
  button.style.marginLeft = `${depth * 10}px`;
  button.style.display = 'block';

  button.innerHTML = model.part;
  componentTree.appendChild(button);

  UIHandler.initButton(`#${button.id}`, {
    handlerFn: eventHandler.selectModel(model),
  });

  if (model.children.length > 0) {
    for (let i = 0; i < model.children.length; i++) {
      generateComponentTree(model.children[i], depth + 1);
    }
  }
};



state.model.children.push(currentModel2);

setComponentTree(state.model);

webgl.drawArticulated(state);
