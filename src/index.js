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
  textureType: 'image',
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

let initialState = {
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

let currentPart = document.querySelector('#chosen-component-name');
currentPart.innerHTML = state.selectedModel.part;

const eventHandler = {
  updatePosition(index, uiText) {
    return (event, value) => {
      const valueUIElmt = document.querySelector('#' + uiText);
      builder.setIsPlaying(false);
      state.selectedModel.translation[index] = value;
      valueUIElmt.innerHTML = value;
      webgl.drawArticulated(state);
    };
  },

  updateRotation(index, uiText) {
    return (event, value) => {
      const valueUIElmt = document.querySelector('#' + uiText);
      builder.setIsPlaying(false);
      const angleInDegrees = value;
      const angleInRadians = Converter.degToRad(angleInDegrees);
      state.selectedModel.rotation[index] = angleInRadians;
      valueUIElmt.innerHTML = angleInDegrees;
      webgl.drawArticulated(state);
    };
  },

  updateScale(index, uiText) {
    return (event, value) => {
      const valueUIElmt = document.querySelector('#' + uiText);
      builder.setIsPlaying(false);
      state.selectedModel.scale[index] = value;
      valueUIElmt.innerHTML = value;
      webgl.drawArticulated(state);
    };
  },

  updateCompPosition(index, uiText) {
    return (event, value) => {
      const valueUIElmt = document.querySelector('#' + uiText);
      builder.setIsPlaying(false);
      state.selectedModel.subtree_translate[index] = value;
      valueUIElmt.innerHTML = value;
      webgl.drawArticulated(state);
    };
  },

  updateCompRotation(index, uiText) {
    return (event, value) => {
      const valueUIElmt = document.querySelector('#' + uiText);
      builder.setIsPlaying(false);
      const angleInDegrees = value;
      const angleInRadians = Converter.degToRad(angleInDegrees);
      state.selectedModel.subtree_rotate[index] = angleInRadians;
      valueUIElmt.innerHTML = angleInDegrees;
      webgl.drawArticulated(state);
    };
  },

  updateCompScale(index, uiText) {
    return (event, value) => {
      const valueUIElmt = document.querySelector('#' + uiText);
      builder.setIsPlaying(false);
      state.selectedModel.subtree_scale[index] = value;
      valueUIElmt.innerHTML = value;
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
          const contentToState = JSON.parse(content);

          state.model = contentToState;
          state.selectedModel = contentToState;
          initialState = JSON.stringify(state);
          currentPart.innerHTML = state.selectedModel.part;

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

      state.cameraRotation = -Converter.degToRad(value);
      webgl.drawArticulated(state);
    };
  },

  selectModel(model) {
    return (event) => {
      state.selectedModel = model;
      document.querySelector('#chosen-component-name').innerHTML = model.part;
      setInitialUITransformation();
    };
  },

  saveFrame() {
    return (event) => {
      if (builder.isPlaying) {
        builder.setIsPlaying(false);
      } else {
        builder.addState(state.model);
      }
    };
  },

  playButton() {
    return (event) => {
      builder.setIsPlaying(true);
      builder.playFrames(state);
    };
  },

  pauseButton() {
    return (event) => {
      builder.setIsPlaying(false);
    };
  },

  updateTextureType() {
    return (event) => {
      if (event.target.value === 'none') {
        state.textureType = -1;
      } else if (event.target.value === 'image') {
        state.textureType = 0;
      } else if (event.target.value === 'environment') {
        state.textureType = 1;
      } else if (event.target.value === 'bump') {
        state.textureType = 2;
      }
      console.log(state.textureType);
      webgl.drawArticulated(state);
    };
  },

  saveAnimation() {
    return (event) => {
      builder.setIsPlaying(false);

      var dataStr =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(builder.frames));

      var dlAnchorElem = document.createElement('a');
      dlAnchorElem.setAttribute('href', dataStr);
      dlAnchorElem.setAttribute('download', 'animation.json');
      dlAnchorElem.click();
    };
  },

  loadAnimation() {
    return (event) => {
      builder.setIsPlaying(false);
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
          builder.frames = content;

          builder.setIsPlaying(true);

          // setComponentTree(state.model);
        };
      };
      input.click();
    };
  },

  closeHelp() {
    return (event) => {
      const helpModal = document.querySelector('#modal-help');
      helpModal.style.display = 'none';
      helpModal.style.opacity = 0;
    };
  },

  resetModel() {
    return (event) => {
      state = JSON.parse(initialState);
      state.selectedModel = state.model;

      document.querySelector('#projection').value = state.projectionType;
      document.querySelector('#shading').checked = state.isShading;
      document.querySelector('#texture').value = 'none';
      document.querySelector('#camera-rotate').value = state.cameraRotation;
      document.querySelector('#camera-view').value = state.cameraRadius;

      setComponentTree(state.model);
      setInitialUITransformation();
    };
  },

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

{
  UIHandler.initSlider('#obj-translation-x', {
    initialValue: state.model.translation[0],
    handlerFn: eventHandler.updatePosition(0, 'obj-translation-x-value'),
  });
  
  UIHandler.initSlider('#obj-translation-y', {
    initialValue: state.model.translation[1],
    handlerFn: eventHandler.updatePosition(1, 'obj-translation-y-value'),
  });
  
  UIHandler.initSlider('#obj-translation-z', {
    initialValue: state.model.translation[2],
    handlerFn: eventHandler.updatePosition(2, 'obj-translation-z-value'),
  });
  
  UIHandler.initSlider('#obj-rotation-x', {
    initialValue: state.model.rotation[0],
    handlerFn: eventHandler.updateRotation(0, 'obj-rotation-x-value'),
  });
  
  UIHandler.initSlider('#obj-rotation-y', {
    initialValue: state.model.rotation[1],
    handlerFn: eventHandler.updateRotation(1, 'obj-rotation-y-value'),
  });
  
  UIHandler.initSlider('#obj-rotation-z', {
    initialValue: state.model.rotation[2],
    handlerFn: eventHandler.updateRotation(2, 'obj-rotation-z-value'),
  });
  
  UIHandler.initSlider('#obj-scaling-x', {
    initialValue: state.model.scale[0],
    handlerFn: eventHandler.updateScale(0, 'obj-scaling-x-value'),
  });
  
  UIHandler.initSlider('#obj-scaling-y', {
    initialValue: state.model.scale[1],
    handlerFn: eventHandler.updateScale(1, 'obj-scaling-y-value'),
  });
  
  UIHandler.initSlider('#obj-scaling-z', {
    initialValue: state.model.scale[2],
    handlerFn: eventHandler.updateScale(2, 'obj-scaling-z-value'),
  });
  
  UIHandler.initSlider('#comp-translation-x', {
    initialValue: state.model.translation[0],
    handlerFn: eventHandler.updateCompPosition(0, 'comp-translation-x-value'),
  });
  
  UIHandler.initSlider('#comp-translation-y', {
    initialValue: state.model.translation[1],
    handlerFn: eventHandler.updateCompPosition(1, 'comp-translation-y-value'),
  });
  
  UIHandler.initSlider('#comp-translation-z', {
    initialValue: state.model.translation[2],
    handlerFn: eventHandler.updateCompPosition(2, 'comp-translation-z-value'),
  });
  
  UIHandler.initSlider('#comp-rotation-x', {
    initialValue: state.model.rotation[0],
    handlerFn: eventHandler.updateCompRotation(0, 'comp-rotation-x-value'),
  });
  
  UIHandler.initSlider('#comp-rotation-y', {
    initialValue: state.model.rotation[1],
    handlerFn: eventHandler.updateCompRotation(1, 'comp-rotation-y-value'),
  });
  
  UIHandler.initSlider('#comp-rotation-z', {
    initialValue: state.model.rotation[2],
    handlerFn: eventHandler.updateCompRotation(2, 'comp-rotation-z-value'),
  });
  
  UIHandler.initSlider('#comp-scaling-x', {
    initialValue: state.model.scale[0],
    handlerFn: eventHandler.updateCompScale(0, 'comp-scaling-x-value'),
  });
  
  UIHandler.initSlider('#comp-scaling-y', {
    initialValue: state.model.scale[1],
    handlerFn: eventHandler.updateCompScale(1, 'comp-scaling-y-value'),
  });
  
  UIHandler.initSlider('#comp-scaling-z', {
    initialValue: state.model.scale[2],
    handlerFn: eventHandler.updateCompScale(2, 'comp-scaling-z-value'),
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
    handlerFn: eventHandler.saveAnimation(),
  });
  
  UIHandler.initButton('#load-animation', {
    handlerFn: eventHandler.loadAnimation(),
  });
  
  UIHandler.initButton('#save-frame', {
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
  
  UIHandler.initButton('#help-close-btn', {
    handlerFn: eventHandler.closeHelp(),
  });
  
  UIHandler.initButton('#clear', {
    handlerFn: eventHandler.resetModel(),
  });
}

// generate button tree
function setComponentTree(model) {
  const componentTree = document.querySelector('#component-tree');
  componentTree.innerHTML = '';
  generateComponentTree(model);
  setInitialUITransformation();
}

function generateComponentTree(model, depth = 0) {
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
}

function setInitialUITransformation() {
  const modelSettings = state.selectedModel;

  const setInitialSliderValue = (toolId) => {
    const objTransformationTool = document.querySelector(toolId);
    const transformationType =
      toolId.split('-')[1] === 'scaling' ? 'scale' : toolId.split('-')[1];

    let modelPropName = transformationType;

    if (!toolId.split('-')[0].includes('obj')) {
      modelPropName = 'subtree_';
      switch (transformationType) {
        case 'translation':
          modelPropName += 'translate';
          break;
        case 'rotation':
          modelPropName += 'rotate';
          break;
        default:
          modelPropName += 'scale';
          break;
      }
    }

    const objTransformationInput =
      objTransformationTool.querySelectorAll('input');
    for (let i = 0; i < objTransformationInput.length; i++) {
      let modelValue = modelSettings[modelPropName][i];
      if (modelPropName.includes('rotat')) {
        modelValue = Converter.radToDeg(modelValue);
      }
      objTransformationInput[i].value = modelValue.toString();
      objTransformationInput[i].dispatchEvent(new Event('input'));
    }
  };

  setInitialSliderValue('#obj-translation-tool');
  setInitialSliderValue('#obj-rotation-tool');
  setInitialSliderValue('#obj-scaling-tool');
  setInitialSliderValue('#comp-scaling-tool');
  setInitialSliderValue('#comp-rotation-tool');
  setInitialSliderValue('#comp-translation-tool');
}

state.model.children.push(currentModel2);

setComponentTree(state.model);
setInitialUITransformation();

webgl.drawArticulated(state);
