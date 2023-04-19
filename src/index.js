import WebGLHandler from './handler/WebGLHandler.js';
import Converter from './utils/Converter.js';
import UIHandler from './handler/UIHandler.js';

// to be deleted
const cubeModel = {
    "num_vertices": 8,
    "vertices": [
        [0.5, 0.5, 0.5],
        [-0.5, 0.5, 0.5],
        [-0.5, -0.5, 0.5],
        [0.5, -0.5, 0.5],
        [0.5, 0.5, -0.5],
        [-0.5, 0.5, -0.5],
        [-0.5, -0.5, -0.5],
        [0.5, -0.5, -0.5],
    ],
    "num_indices": 6,
    "indices": [
        [0, 1, 2, 3], // Front
        [5, 4, 7, 6], // Back
        [4, 0, 3, 7], // Right
        [1, 5, 6, 2], // Left
        [0, 4, 5, 1], // Top
        [2, 6, 7, 3] // Bottom
    ],
    "colors": [
        [255, 0, 0, 255],
        [255, 0, 0, 255],
        [255, 0, 0, 255],
        [255, 0, 0, 255],
        [255, 0, 0, 255],
        [255, 0, 0, 255]
    ]
}

const cubeModel2 = {
    "num_vertices": 8,
    "vertices": [
        [1, 0.5, 0.5],
        [0, 0.5, 0.5],
        [0, -0.5, 0.5],
        [1, -0.5, 0.5],
        [1, 0.5, -0.5],
        [0, 0.5, -0.5],
        [0, -0.5, -0.5],
        [1, -0.5, -0.5],
    ],
    "num_indices": 6,
    "indices": [
        [0, 1, 2, 3], // Front
        [5, 4, 7, 6], // Back
        [4, 0, 3, 7], // Right
        [1, 5, 6, 2], // Left
        [0, 4, 5, 1], // Top
        [2, 6, 7, 3] // Bottom
    ],
    "colors": [
        [255, 255, 255, 255],
        [255, 255, 255, 255],
        [255, 255, 255, 255],
        [255, 255, 255, 255],
        [255, 255, 255, 255],
        [255, 255, 255, 255]
    ]
}


let webgl = new WebGLHandler(document.querySelector('canvas')).init();

let currentModel = {
    object: cubeModel,
    part: "Part 1",
    textureType: "NONE",
    translation: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    child_translate: [0, 0, 0],
    child_rotate: [0, 0, 0],
    child_scale: [1, 1, 1],
    children: []
}

let currentModel2 = {
    object: cubeModel2,
    part: "Part 2",
    textureType: "NONE",
    translation: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    child_translate: [0, 0, 0],
    child_rotate: [0, 0, 0],
    child_scale: [1, 1, 1],
    children: []
}


let state = {
    model: currentModel,
    selectedModel: currentModel,
    projectionType: 'orthographic',
    useLighting: true,
    fudgeFactor: 0,
    obliqueTetha: Converter.degToRad(63.5),
    obliquePhi: Converter.degToRad(63.5),
    far: -1,
    near : 1,
    top: 1,
    bottom: -1,
    left: -1,
    right: 1,
    cameraRadius: 0,
    cameraRotation: Converter.degToRad(0),
};

const renderSettings = {
    primitiveType: webgl.getGl().TRIANGLES,
    drawCounter: state.model.object.indices.length * 6,
};

// console.log(renderSettings.drawCounter)

const eventHandler = {
    updatePosition(index) {
        return (event, value) => {
            // state.animation = false;
            state.model.translation[index] = value;
            webgl
                .clearBuffer()
                .render(renderSettings, state);
        };
    },

    updateRotation(index) {
        return (event, value) => {
            // state.animation = false;
            const angleInDegrees = value;
            const angleInRadians = Converter.degToRad(angleInDegrees);
            state.model.rotation[index] = angleInRadians;
            webgl
                .clearBuffer()
                .render(renderSettings, state);
        };
    },

    updateScale(index) {
        return (event, value) => {
            // state.animation = false;
            state.model.scale[index] = value;
            webgl
                .clearBuffer()
                .render(renderSettings, state);
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

                reader.onload = (readerEvent) => {
                    var content = readerEvent.target.result;
                    content = JSON.parse(content);
                    // set all to default
                    state.model = content;
                    renderSettings.drawCounter = content.vertices.length;

                    webgl.destroy();
                    webgl = new WebGLHandler(document.querySelector('canvas')).init();

                    webgl
                        .clearBuffer()
                        .setVertices(state.model.vertices)
                        .setColors(state.model.colors)
                        .setNormals(state.model.normals)
                        .render(renderSettings, state);
                };
            };
            input.click();
        };
    },

    saveModel(){
        return (event) => {
            // console.log('save model');
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.model));

            var dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute("href", dataStr);
            dlAnchorElem.setAttribute("download", "model.json");
            dlAnchorElem.click();
        }
    },

    loadModelAsChild() {
        return (event) => {
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
                    state.model = content;
                    renderSettings.drawCounter = content.vertices.length;

                    webgl.destroy();
                    webgl = new WebGLHandler(document.querySelector('canvas')).init();

                    webgl
                        .clearBuffer()
                        .setVertices(state.model.vertices)
                        .setColors(state.model.colors)
                        .setNormals(state.model.normals)
                        .render(renderSettings, state);
                };
            };
            input.click();
        };
    },


    updateProjectionType() {
        return (event) => {
            state.projectionType = event.target.value;

            if (state.projectionType === 'perspective') {
                state.fudgeFactor = 0.3;
            } else {
                state.fudgeFactor = 0;
            }

            if (state.projectionType === 'oblique') {
                state.obliqueTetha = Converter.degToRad(63.5);
                state.obliquePhi = Converter.degToRad(63.5);
            } else {
                state.obliqueTetha = 0;
                state.obliquePhi = 0;
            }

            webgl.clearBuffer().render(renderSettings, state);
        };
    },

    updateShadingState() {
        return (event) => {
            state.useLighting = event.target.checked;
            webgl.clearBuffer().render(renderSettings, state);
        };
    },

    updateCameraRadius() {
        return (event, value) => {
            state.cameraRadius = value;
            webgl.clearBuffer().render(renderSettings, state);
        };
    },

    updateCameraRotation() {
        return (event, value) => {
            state.cameraRotation = Converter.degToRad(value);
            webgl.clearBuffer().render(renderSettings, state);
        };
    },

    selectModel(model){
        return (event) => {
            console.log(model)
            state.selectedModel = model;
            document.querySelector('#chosen-component-name').innerHTML = model.part;
            // renderSettings.drawCounter = model.vertices.length;
            // webgl.clearBuffer().render(renderSettings, state);
        }
    },

    toDefaultButtonHandler() {
        return (event) => {
            const initialState = {
                translation: [0, 0, 0],
                rotation: [
                    Converter.degToRad(0),
                    Converter.degToRad(0),
                    Converter.degToRad(0),
                ],
                animation_rotation: [
                    Converter.degToRad(0),
                    Converter.degToRad(0),
                    Converter.degToRad(0),
                ],
                scale: [1, 1, 1],
                projectionType: 'orthographic',
                useLighting: true,
                fudgeFactor: 0,
                obliqueTetha: 0,
                obliquePhi: 0,
                cameraRadius: -1.3,
                cameraRotation: Converter.degToRad(0),
                animation: false,
            };
            document.querySelector('#projection').value = initialState.projectionType;
            document.querySelector('#projection').dispatchEvent(new Event('input'));
            document.querySelector('#shading').value = initialState.useLighting;
            const cameraRadius = document.querySelector('#cameraRadius');
            cameraRadius.value = initialState.cameraRadius;
            cameraRadius.nextElementSibling.value = initialState.cameraRadius;

            const cameraRotation = document.querySelector('#cameraRotation');
            cameraRotation.value = initialState.cameraRotation;
            cameraRotation.nextElementSibling.value = initialState.cameraRotation;

            document.querySelectorAll('.translation').forEach((el, idx) => {
                el.value = initialState.translation[idx];
                el.nextElementSibling.value = initialState.translation[idx];
            });
            document.querySelectorAll('.rotation').forEach((el, idx) => {
                el.value = initialState.rotation[idx];
                el.nextElementSibling.value = initialState.rotation[idx];
            });
            document.querySelectorAll('.scaling').forEach((el, idx) => {
                el.value = initialState.scale[idx];
                el.nextElementSibling.value = initialState.scale[idx];
            });
            document.querySelector('#shading').checked = initialState.useLighting;
            state = { ...initialState, model: state.model };
            webgl.clearBuffer().render(renderSettings, state);
        };
    },
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


UIHandler.initRadio('#projection', {
    initialValue: state.projectionType,
    handlerFn: eventHandler.updateProjectionType(),
});

// UIHandler.initButton('#load-model', {
//     handlerFn: eventHandler.loadModel(),
// });
// UIHandler.initButton('#save-model', {
//     handlerFn: eventHandler.saveModel(),
// });

// generate button tree
const setComponentTree = (model) => {
    const componentTree = document.querySelector('#component-tree');
    componentTree.innerHTML = '';  
    generateComponentTree(model); 
}

const generateComponentTree = (model, depth = 0) => {
    const componentTree = document.querySelector('#component-tree');
    const button = document.createElement('button');

    button.id = model.part.toLowerCase().replace(' ', '-');
    button.style.marginLeft = `${depth * 10}px`;
    button.style.display = 'block';

    button.innerHTML = model.part;
    componentTree.appendChild(button);

    UIHandler.initButton(`#${button.id}`, {
        handlerFn: eventHandler.selectModel(model),
    });

    if (model.children.length > 0) {
        for(let i = 0; i < model.children.length; i++) {
            generateComponentTree(model.children[i], depth + 1);
        }
    }
}


setComponentTree(state.model);

// UIHandler.initCheckbox('#shading', {
//     initialValue: state.useLighting,
//     handlerFn: eventHandler.updateShadingState(),
// });

// UIHandler.initSlider('#camera-view', {
//     initialValue: state.cameraRadius,
//     handlerFn: eventHandler.updateCameraRadius(),
// });

// UIHandler.initSlider('#camera-rotate', {
//     initialValue: state.cameraRotation,
//     handlerFn: eventHandler.updateCameraRotation(),
// });

// UIHandler.initButton('button#toDefault', {
//   handlerFn: eventHandler.toDefaultButtonHandler(),
// });
// console.log(state.model)
// state.model.children.push(currentModel2);
// renderSettings.drawCounter += currentModel2.object.indices.length*6;

setComponentTree(state.model);

// console.log(state.model);
// webgl.drawArticulated(state)

webgl
    .clearBuffer()
    .setModel(state.model)
    .render(renderSettings, state);
// state.model.object = cubeModel2;
// renderSettings.drawCounter += cubeModel2.indices.length*6;
// console.log(renderSettings.drawCounter)
// const saveToJSON = () => {
//     let { vertices, colors, normals } = state.model;

//     const json = JSON.stringify({ vertices, colors, normals });
//     const data = new Blob([json], { type: 'text/plain' });
//     const textFile = window.URL.createObjectURL(data);
//     const link = document.createElement('a');
//     link.setAttribute('download', 'shapes.json');
//     link.href = textFile;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
// };
// document.getElementById('save').addEventListener('click', saveToJSON);

// const startAnimation = () => {
//     state.animation = true;
//     webgl.clearBuffer().renderAnimation(renderSettings, state);
// };
// document.getElementById('animate').addEventListener('click', startAnimation);

// const stopAnimation = () => {
//     state.animation = false;
//     webgl.clearBuffer().renderAnimation(renderSettings, state);
// };

// document
//   .getElementById('stop_animate')
//   .addEventListener('click', stopAnimation);
