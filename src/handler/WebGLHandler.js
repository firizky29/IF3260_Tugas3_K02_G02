import CONFIG from '../global/config.js';
import Converter from '../utils/Converter.js';
import ViewOp from '../utils//ViewOp.js';
import Matrix4 from '../utils/Matrix4.js';
import Render from '../utils/render.js';

export default class WebGLHandler {
	constructor(canvas) {
		this._canvas = canvas;
		this._gl = this._canvas.getContext('webgl2');
		this._glComponent = {};
		this._buffers = [
			'vertexBuffer',
			'normalBuffer',
			'colorBuffer',
			'camPositionBuffer',
			'camIndicesBuffer',
		];

		this._uniforms = [
			'projectionMatrix',
			'viewMatrix',
			'modelMatrix',
			'normalMatrix',
			'useLighting',
		];

		this._attributes = [
			'a_position',
			'a_normal',
			'a_color'
		]

		this._drawCounter = 0;
	}

	init() {
		const shadersConfig = [
			{
				type: this._gl.VERTEX_SHADER,
				source: CONFIG.VERTEX_SHADER,
			},
			{
				type: this._gl.FRAGMENT_SHADER,
				source: CONFIG.FRAGMENT_SHADER,
			},
		];

		this._glComponent.program = this._createProgram(shadersConfig);

		this._createBuffers();
		this._createUniformLocations();
		this._createAttributeLocations();


		this._gl.enable(this._gl.DEPTH_TEST); // enabled by default, but let's be SURE.

		this._gl.useProgram(this._glComponent.program);
		// this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
		// this._gl.scissor(0, 0, this._gl.canvas.width, this._gl.canvas.height);
		return this;
	}

	drawArticulated(state) {
		this.clearBuffer();
		this._drawCounter = 0;
		const props = this.setupProperties(state);
		this.draw(state.model, props);
	}

	draw(model, props) {
		// console.log(model);
		props.modelMatrix = props.modelMatrix.clone().transform(
			model.translation,
			model.rotation,
			model.scale
		)
		props.normalMatrix = props.modelMatrix.clone().inverse().transpose();

		this._updateProperties(props);

		// console.log(props)


		this.drawModel(model, props);

		for (let i = 0; i < model.children.length; i++) {
			this.draw(model.children[i], props);
		}

		return this;
	}



	drawModel(model, props) {
		// this.clearBuffer()

		let glVertices = [];
		let glColors = [];
		let glNormals = [];
		this._initBuffers(glVertices, glColors, glNormals, model);

		props.modelMatrix = props.modelMatrix.clone().transform(
			model.translation,
			model.rotation,
			model.scale
		)
		props.normalMatrix = props.modelMatrix.clone().inverse().transpose();

		this._updateProperties(props);

		this.setVertices(glVertices);
		this.setColors(glColors);
		this.setNormals(glNormals);

		// console.log(props.projectionMatrix.clone().multiply(props.viewMatrix).multiply(props.modelMatrix))

		// console.log(glVertices);
		// console.log(glColors);
		// console.log(glNormals);
		// console.log(props);
		// console.log(this._drawCounter);

		this._gl.drawArrays(this._gl.TRIANGLE, 0, this._drawCounter);

		return this;
	}

	setupProperties(state) {
		const {
			model,
			selectedModel,
			projectionType,
			useLighting,
			fudgeFactor,
			obliqueTetha,
			obliquePhi,
			cameraRadius,
			cameraRotation
		} = state;

		const projectionMatrix = this.getProjectionMatrix(projectionType, obliqueTetha, obliquePhi);

		let cameraMatrix = new Matrix4().identity()
			.rotateY(cameraRotation)
			.translate(0, 0, cameraRadius);

		const cameraPos = [
			cameraMatrix.get(3, 0),
			cameraMatrix.get(3, 1),
			cameraMatrix.get(3, 2)
		];
		const target = [0, 0, 0];
		const up = [0, 1, 0];

		cameraMatrix = ViewOp.lookAt(cameraPos, target, up);

		const viewMatrix = cameraMatrix


		const modelMatrix = new Matrix4().identity();
		// console.log(modelMatrix)
		const normalMatrix = modelMatrix.clone()
		normalMatrix.inverse().transpose();

		const uniforms = {
			projectionMatrix,
			viewMatrix,
			modelMatrix,
			normalMatrix,
			useLighting
		}
		// console.log(uniforms)

		this._setUniforms(uniforms);

		return uniforms;
	}

	_updateProperties(props) {
		// console.log(props)
		this._setUniforms(props);
	}

	getProjectionMatrix(projectionType, state) {
		const left = state.left;
		const right = state.right;
		const bottom = state.bottom;
		const top = state.top;
		const near = state.near;
		const far = state.far;
		const obliqueTetha = state.obliqueTetha;
		const obliquePhi = state.obliquePhi;

		const fov = Converter.degToRad(60);
		const aspect = 1.0;


		switch (projectionType) {
			case 'orthographic':
				return ViewOp.orthographic(left, right, bottom, top, near, far);
			case 'perspective':
				return ViewOp.perspective(fov, aspect, near, far);
			case 'oblique':
				return ViewOp.oblique(left, right, bottom, top, near, far, obliqueTetha, obliquePhi);
			default:
				return new Matrix4().identity();
		}
	}




	_setUniforms(uniforms) {
		const {
			projectionMatrix,
			viewMatrix,
			modelMatrix,
			normalMatrix,
			useLighting
		} = uniforms;

		// console.log(projectionMatrix.flatten())

		// console.log(this._glComponent.projectionMatrix)
		this._gl.uniformMatrix4fv(
			this._glComponent.projectionMatrix,
			false,
			projectionMatrix.flatten()
		);

		this._gl.uniformMatrix4fv(
			this._glComponent.viewMatrix,
			false,
			viewMatrix.flatten()
		);

		this._gl.uniformMatrix4fv(
			this._glComponent.modelMatrix,
			false,
			modelMatrix.flatten()
		);

		this._gl.uniformMatrix4fv(
			this._glComponent.normalMatrix,
			false,
			normalMatrix.flatten()
		);

		this._gl.uniform1i(
			this._glComponent.useLighting,
			useLighting
		);

		return this;

	}

	_bindBuffers() {
		// bind vertex buffer
		this._gl.bindBuffer(
			this._gl.ARRAY_BUFFER,
			this._glComponent.vertexBuffer
		);

		this._gl.vertexAttribPointer(
			this._glComponent.positionAttributeLocation,
			3,
			this._gl.FLOAT,
			false,
			0,
			0
		);

		this._gl.enableVertexAttribArray(
			this._glComponent.positionAttributeLocation
		);

		// bind color buffer
		this._gl.bindBuffer(
			this._gl.ARRAY_BUFFER,
			this._glComponent.colorBuffer
		);

		this._gl.vertexAttribPointer(
			this._glComponent.colorAttributeLocation,
			4,
			this._gl.UNSIGNED_BYTE,
			false,
			0,
			0
		);

		this._gl.enableVertexAttribArray(
			this._glComponent.colorAttributeLocation,
		);

		// bind normal buffer
		this._gl.bindBuffer(
			this._gl.ARRAY_BUFFER,
			this._glComponent.normalBuffer
		);

		this._gl.vertexAttribPointer(
			this._glComponent.normalAttributeLocation,
			3,
			this._gl.FLOAT,
			false,
			0,
			0
		);

		this._gl.enableVertexAttribArray(
			this._glComponent.normalAttributeLocation,
		);

		return this;
	}


	_initBuffers(glVertices, glColors, glNormals, model) {
		let object = model.object;
		let vertices = object.vertices;
		let colors = object.colors;
		let indices = object.indices;

		for (let i = 0; i < object.num_indices; i++) {
			let vertex_idx = indices[i];

			let corners = [];
			corners.push(vertices[vertex_idx[0]])
			corners.push(vertices[vertex_idx[1]])
			corners.push(vertices[vertex_idx[2]])
			corners.push(vertices[vertex_idx[3]])
			let color_idx = i % colors.length;

			// console.log(corners)
			Render.rectangle(glVertices, glColors, glNormals, corners, colors[color_idx])
			this._drawCounter += 6;
		}

		// for (let i = 0; i < model.children.length; i++) {
		// 	this._initBuffers(glVertices, glColors, glNormals, model.children[i]);
		// }
	}


	setVertices(vertices) {
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.vertexBuffer);
		this._gl.bufferData(
			this._gl.ARRAY_BUFFER,
			new Float32Array(vertices),
			this._gl.STATIC_DRAW
		);

		return this;
	}

	setColors(colors) {
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.colorBuffer);
		this._gl.bufferData(
			this._gl.ARRAY_BUFFER,
			new Uint8Array(colors),
			this._gl.STATIC_DRAW
		);

		return this;
	}

	setNormals(normals) {
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.normalBuffer);
		this._gl.bufferData(
			this._gl.ARRAY_BUFFER,
			new Float32Array(normals),
			this._gl.STATIC_DRAW
		);

		return this;
	}

	getGl() {
		return this._gl;
	}

	clearBuffer() {

		this._gl.clearColor(0, 0, 0, 1.0);
		this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
		return this;
	}

	setModel(model) {
		// console.log(num_indices)

		let glVertices = [];
		let glColors = [];
		let glNormals = [];
		this._setPrimitives(glVertices, glColors, glNormals, model);

		this.setVertices(glVertices);
		this.setColors(glColors);
		this.setNormals(glNormals);

		// console.log(glVertices);

		return this;
	}

	_setPrimitives(glVertices, glColors, glNormals, model) {
		let object = model.object;
		let vertices = object.vertices;
		let colors = object.colors;
		let indices = object.indices;

		for (let i = 0; i < object.num_indices; i++) {
			let vertex_idx = indices[i];

			let corners = [];
			corners.push(vertices[vertex_idx[0]]);
			corners.push(vertices[vertex_idx[1]]);
			corners.push(vertices[vertex_idx[2]]);
			corners.push(vertices[vertex_idx[3]]);
			let color_idx = i % colors.length;

			// console.log(corners)
			Render.rectangle(
				glVertices,
				glColors,
				glNormals,
				corners,
				colors[color_idx]
			);
			this.drawCounter += 6;
		}

		for (let i = 0; i < model.children.length; i++) {
			this._setPrimitives(glVertices, glColors, glNormals, model.children[i]);
		}
	}



	render(settings, state) {
		// const positionAttributeLocation = this._gl.getAttribLocation(
		// 	this._glComponent.program,
		// 	'a_position'
		// );

		// const colorAttributeLocation = this._gl.getAttribLocation(
		// 	this._glComponent.program,
		// 	'a_color'
		// );

		// const normalAttributeLocation = this._gl.getAttribLocation(
		// 	this._glComponent.program,
		// 	'a_normal'
		// );

		// const matrixLocation = this._gl.getUniformLocation(
		// 	this._glComponent.program,
		// 	'modelMatrix'
		// );

		// const projectionMatrixLocation = this._gl.getUniformLocation(
		// 	this._glComponent.program,
		// 	'projectionMatrix'
		// );

		// const normalMatrixLocation = this._gl.getUniformLocation(
		// 	this._glComponent.program,
		// 	'normalMat'
		// );

		// const useLighting = this._gl.getUniformLocation(
		// 	this._glComponent.program,
		// 	'useLighting'
		// );

		// const fudgeFactor = this._gl.getUniformLocation(
		// 	this._glComponent.program,
		// 	'fudgeFactor'
		// );

		// Camera properties
		// const aspect = 1;
		// const near = 0.5;
		// const far = 5;
		// const radius = -state.cameraRadius;

		// const camSettings = {
		// 	camFieldOfView: 70,
		// 	camRotation: state.cameraRotation,
		// };

		// let worldMatrix = TransformationMatrix4D.yRotation(camSettings.camRotation);

		// const target = new Matrix(1, 3, [[0, 0, 0]]);
		// const up = new Matrix(1, 3, [[0, 1, 0]]);
		// let cameraMatrix = TransformationMatrix4D.yRotation(
		// 	camSettings.camRotation
		// );
		// cameraMatrix = Transform.translate(cameraMatrix, 0, 0, radius * 1.5);
		// let cameraObjData = cameraMatrix.getPropsToObj().data;

		// const cameraPos = new Matrix(1, 3, [
		// 	[cameraObjData[3][0], cameraObjData[3][1], cameraObjData[3][2]],
		// ]);

		// cameraMatrix = CameraOp.lookAt(cameraPos, target, up);

		// const viewMatrix = cameraMatrix.invert();
		// -----------------------

		this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
		this._gl.scissor(0, 0, this._gl.canvas.width, this._gl.canvas.height);

		const {
			size = 3,
			type = this._gl.FLOAT,
			normalize = false,
			stride = 0,
			offset = 0,
			primitiveType,
			drawCounter,
		} = settings;

		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.vertexBuffer);

		this._gl.enableVertexAttribArray(this._glComponent.positionAttributeLocation);
		this._gl.vertexAttribPointer(
			this._glComponent.positionAttributeLocation,
			size,
			type,
			normalize,
			stride,
			offset
		);

		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.colorBuffer);

		this._gl.enableVertexAttribArray(this._glComponent.colorAttributeLocation);
		this._gl.vertexAttribPointer(
			this._glComponent.colorAttributeLocation,
			size,
			this._gl.UNSIGNED_BYTE,
			true,
			stride,
			offset
		);

		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.normalBuffer);

		this._gl.enableVertexAttribArray(this._glComponent.normalAttributeLocation);
		this._gl.vertexAttribPointer(
			this._glComponent.normalAttributeLocation,
			size,
			type,
			normalize,
			stride,
			offset
		);

		let matrix = new Matrix4().identity()


		matrix.transform(state.model.translation, state.model.rotation, state.model.scale);
		let projectionMatrix = this.getProjectionMatrix(state.projectionType, state)

		// console.log(projectionMatrix)
		// for (let i = 0; i < state.model.object.vertices.length; i++) {
			const project = projectionMatrix.clone().transpose();
			let vertex = state.model.object.vertices[0];
			// multiply by projection matrix
			let vertex2 = []
			for (let j = 0; j < 4; j++) {
				let sum = 0;
				for (let k = 0; k < 4; k++) {
					if (k === 3) {
						sum += 0;
					} else {
						sum += project.get(j, k) * vertex[k];
					}
				}
				vertex2[j] = sum;
			}
			console.log(vertex, vertex2)
		// }
		// console.log("Projection setelah perubahan", projectionMatrix)



		// console.log(matrix, projectionMatrix)
		// let projectionMatrix = TransformationMatrix4D.projection(
		// 	state.projectionType,
		// 	state.obliqueTetha,
		// 	state.obliquePhi
		// );

		// if (state.projectionType === 'perspective') {
		// 	let perspectiveProjectionMatrix = CameraOp.perspective(
		// 		Converter.degToRad(camSettings.camFieldOfView),
		// 		aspect,
		// 		near,
		// 		far
		// 	);

		// 	projectionMatrix = MatrixOp.multiply(
		// 		viewMatrix,
		// 		perspectiveProjectionMatrix
		// 	);

		// 	projectionMatrix = Transform.scale(projectionMatrix, -1, 1, 1);
		// }

		// projectionMatrix = MatrixOp.multiply(worldMatrix, projectionMatrix);

		const normalMatrix = matrix.clone().inverse().transpose();
		// const normalMatrix = matrix.clone();

		this._gl.uniformMatrix4fv(this._glComponent.modelMatrix, false, matrix.flatten());
		this._gl.uniformMatrix4fv(
			this._glComponent.projectionMatrix,
			false,
			projectionMatrix.flatten()
		);
		this._gl.uniformMatrix4fv(
			this._glComponent.normalMatrix,
			false,
			normalMatrix.flatten()
		);

		// this._gl.uniform1i(useLighting, state.useLighting);
		// this._gl.uniform1f(fudgeFactor, state.fudgeFactor);

		// console.log(drawCounter)


		this._gl.drawArrays(primitiveType, offset, 72);


	}

	renderAnimation(settings, state) {
		window.requestAnimationFrame(() => {
			this.clearBuffer().render(settings, state);
			if (state.animation == true) {
				state.animation_rotation[0] += 0.01;
				state.animation_rotation[1] += 0.02;
				state.animation_rotation[2] += 0.03;

				this.renderAnimation(settings, state);
			}
		});
	}

	_createShader(type, source) {
		const shader = this._gl.createShader(type);
		this._gl.shaderSource(shader, source);
		this._gl.compileShader(shader);

		const isSuccess = this._gl.getShaderParameter(
			shader,
			this._gl.COMPILE_STATUS
		);

		if (!isSuccess) {
			console.error(this._gl.getShaderInfoLog(shader));
			this._gl.deleteShader(shader);
		}

		return shader;
	}

	_createProgram(shadersConfig) {
		const program = this._gl.createProgram();
		for (let shaderConfig of shadersConfig) {
			const shader = this._createShader(shaderConfig.type, shaderConfig.source);
			this._gl.attachShader(program, shader);
		}
		this._gl.linkProgram(program);

		const isSuccess = this._gl.getProgramParameter(
			program,
			this._gl.LINK_STATUS
		);

		if (!isSuccess) {
			console.log(this._gl.getProgramInfoLog(program));
			this._gl.deleteProgram(program);
		}

		return program;
	}

	_createBuffers() {
		for (let buffer of this._buffers) {
			this._glComponent[buffer] = this._gl.createBuffer();
		}
	}

	_createUniformLocations() {
		for (let uniform of this._uniforms) {
			this._glComponent[uniform] = this._gl.getUniformLocation(
				this._glComponent.program,
				uniform
			);
		}
	}

	_createAttributeLocations() {
		for (let attribute of this._attributes) {
			const attributeName = attribute.replace('a_', '') + 'AttributeLocation';
			// console.log(attributeName, attribute)
			this._glComponent[attributeName] = this._gl.getAttribLocation(
				this._glComponent.program,
				attribute
			);
		}
	}


	destroy() {
		for (let buffer of this._buffers) {
			this._gl.deleteBuffer(this._glComponent[buffer]);
		}
		this._gl.deleteProgram(this._glComponent.program);
	}
}
