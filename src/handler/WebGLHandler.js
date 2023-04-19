import CONFIG from '../global/config.js';
import CameraOp from '../utils/CameraOp.js';
import Converter from '../utils/Converter.js';
import MatrixOp from '../utils//MatrixOp.js';
import ViewOp from '../utils//ViewOp.js';
import Matrix4 from '../utils/Matrix4.js';
import Matrix from '../utils/Matrix.js';
import { Transform, TransformationMatrix4D } from '../utils/Transformation4D.js';
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
		this._drawCounter = 0;


		this._gl.enable(this._gl.DEPTH_TEST); // enabled by default, but let's be SURE.

		this._gl.useProgram(this._glComponent.program);
		this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
		this._gl.scissor(0, 0, this._gl.canvas.width, this._gl.canvas.height);
		return this;
	}

	draw(model, props) {


		props.modelMatrix = props.modelMatrix.clone().transform(
			model.translation,
			model.rotation,
			model.scale
		)
		props.normalMatrix = props.modelMatrix.clone().inverse().transpose();

		this._updateProperties(props);

		// console.log(props);

		// console.log(props)

		this.drawModel(model, props);

		for (let i = 0; i < model.children.length; i++) {
			this.draw(model.children[i], props);
		}

		return this;
	}



	drawModel(model, props) {
		this.clearBuffer()

		let glVertices = [];
		let glColors = [];
		let glNormals = [];
		this._initBuffers(glVertices, glColors, glNormals, model);
		// console.log(model.model.transl)
		props.modelMatrix = props.modelMatrix.clone().transform(
			model.translation,
			model.rotation,
			model.scale
		)
		props.normalMatrix = props.modelMatrix.clone().inverse().transpose();

		this._updateProperties(model, props);

		this.setVertices(glVertices);
		this.setColors(glColors);
		this.setNormals(glNormals);

		this._gl.drawArrays(this._gl.TRIANGLE, 0, this.drawCounter);

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
		console.log("HELLOE", uniforms)

		this._setUniforms(uniforms);

		return uniforms;
	}

	_updateProperties(props) {
		this._setUniforms(props);
	}

	getProjectionMatrix(projectionType, obliqueTetha, obliquePhi) {
		const left = 0;
		const right = this._gl.canvas.clientWidth;
		const bottom = 0;
		const top = this._gl.canvas.clientHeight;
		const near = 850;
		const far = -850;

		const fov = Converter.degToRad(60);
		const aspect = this._gl.canvas.clientWidth / this._gl.canvas.clientHeight;
		const zNear = 0.1;
		const zFar = 2000;

		switch (projectionType) {
			case 'orthographic':
				return ViewOp.orthographic(left, right, bottom, top, near, far);
			case 'perspective':
				return ViewOp.perspective(fov, aspect, zNear, zFar);
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
			this.drawCounter += 6;
		}

		for (let i = 0; i < model.children.length; i++) {
			this._initBuffers(glVertices, glColors, glNormals, model.children[i]);
		}
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


	render(settings, state) {
		const positionAttributeLocation = this._gl.getAttribLocation(
			this._glComponent.program,
			'a_position'
		);

		const colorAttributeLocation = this._gl.getAttribLocation(
			this._glComponent.program,
			'a_color'
		);

		const normalAttributeLocation = this._gl.getAttribLocation(
			this._glComponent.program,
			'a_normal'
		);

		const matrixLocation = this._gl.getUniformLocation(
			this._glComponent.program,
			'modelView'
		);

		const projectionMatrixLocation = this._gl.getUniformLocation(
			this._glComponent.program,
			'projection'
		);

		const normalMatrixLocation = this._gl.getUniformLocation(
			this._glComponent.program,
			'normalMat'
		);

		const useLighting = this._gl.getUniformLocation(
			this._glComponent.program,
			'useLighting'
		);

		const fudgeFactor = this._gl.getUniformLocation(
			this._glComponent.program,
			'fudgeFactor'
		);

		// Camera properties
		const aspect = 1;
		const near = 0.5;
		const far = 5;
		const radius = -state.cameraRadius;

		const camSettings = {
			camFieldOfView: 70,
			camRotation: state.cameraRotation,
		};

		let worldMatrix = TransformationMatrix4D.yRotation(camSettings.camRotation);

		const target = new Matrix(1, 3, [[0, 0, 0]]);
		const up = new Matrix(1, 3, [[0, 1, 0]]);
		let cameraMatrix = TransformationMatrix4D.yRotation(
			camSettings.camRotation
		);
		cameraMatrix = Transform.translate(cameraMatrix, 0, 0, radius * 1.5);
		let cameraObjData = cameraMatrix.getPropsToObj().data;

		const cameraPos = new Matrix(1, 3, [
			[cameraObjData[3][0], cameraObjData[3][1], cameraObjData[3][2]],
		]);

		cameraMatrix = CameraOp.lookAt(cameraPos, target, up);

		const viewMatrix = cameraMatrix.invert();
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

		this._gl.enableVertexAttribArray(positionAttributeLocation);
		this._gl.vertexAttribPointer(
			positionAttributeLocation,
			size,
			type,
			normalize,
			stride,
			offset
		);

		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.colorBuffer);

		this._gl.enableVertexAttribArray(colorAttributeLocation);
		this._gl.vertexAttribPointer(
			colorAttributeLocation,
			size,
			this._gl.UNSIGNED_BYTE,
			true,
			stride,
			offset
		);

		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.normalBuffer);

		this._gl.enableVertexAttribArray(normalAttributeLocation);
		this._gl.vertexAttribPointer(
			normalAttributeLocation,
			size,
			type,
			normalize,
			stride,
			offset
		);

		let matrix = TransformationMatrix4D.projection(
			this._gl.canvas.clientWidth,
			this._gl.canvas.clientHeight,
			400
		);


		matrix = Transform.translate(matrix, ...state.model.translation);
		matrix = Transform.xRotate(matrix, state.model.rotation[0]);
		matrix = Transform.yRotate(matrix, state.model.rotation[1]);
		matrix = Transform.zRotate(matrix, state.model.rotation[2]);
		// matrix = Transform.xRotate(matrix, state.model.animation_rotation[0]);
		// matrix = Transform.yRotate(matrix, state.model.animation_rotation[1]);
		// matrix = Transform.zRotate(matrix, state.model.animation_rotation[2]);
		matrix = Transform.scale(matrix, ...state.model.scale);
		let projectionMatrix = TransformationMatrix4D.projection(
			state.projectionType,
			state.obliqueTetha,
			state.obliquePhi
		);

		if (state.projectionType === 'perspective') {
			let perspectiveProjectionMatrix = CameraOp.perspective(
				Converter.degToRad(camSettings.camFieldOfView),
				aspect,
				near,
				far
			);

			projectionMatrix = MatrixOp.multiply(
				viewMatrix,
				perspectiveProjectionMatrix
			);

			projectionMatrix = Transform.scale(projectionMatrix, -1, 1, 1);
		}

		projectionMatrix = MatrixOp.multiply(worldMatrix, projectionMatrix);

		const normalMatrix = MatrixOp.copy(matrix).invert().transpose();

		this._gl.uniformMatrix4fv(matrixLocation, false, matrix.flatten());
		this._gl.uniformMatrix4fv(
			projectionMatrixLocation,
			false,
			projectionMatrix.flatten()
		);
		this._gl.uniformMatrix4fv(
			normalMatrixLocation,
			false,
			normalMatrix.flatten()
		);

		this._gl.uniform1i(useLighting, state.useLighting);
		this._gl.uniform1f(fudgeFactor, state.fudgeFactor);

		// console.log(drawCounter)


		this._gl.drawArrays(primitiveType, offset, drawCounter);


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
			attribute = attribute.replace('a_', '') + 'AttributeLocation';
			this._glComponent[attribute] = this._gl.getAttribLocation(
				this._glComponent.program,
				attribute
			);
		}
	}


	_draw(projectionMatrix, worldMatrix, viewMatrix) { }

	destroy() {
		for (let buffer of this._buffers) {
			this._gl.deleteBuffer(this._glComponent[buffer]);
		}
		this._gl.deleteProgram(this._glComponent.program);
	}
}
