class WebGLHandler {

	constructor(canvas) {
		this._canvas = canvas;
		this._gl = this._canvas.getContext('webgl2');
		this._glComponent = {
			program : null,
			// vertexBuffer : this._gl.createBuffer(),
			// colorBuffer : this._gl.createBuffer(),
			// normalBuffer : this._gl.createBuffer(),
			// tangentBuffer : this._gl.createBuffer(),
			// bitangentBuffer : this._gl.createBuffer(),
			// textureCoordBuffer : this._gl.createBuffer(),
			textures : {
				image: TextureMap.image(this._gl),
				environment: TextureMap.environment(this._gl),
				bump: TextureMap.bump(this._gl)
			}
		};
		this._buffers = [
			"vertexBuffer",
			"colorBuffer",
			"normalBuffer",
			"tangentBuffer",
			"bitangentBuffer",
			"textureCoordBuffer"
		]
		this._uniforms = [
			// // vertex shader uniforms
			'projectionMatrix',
			'viewMatrix',
			'modelMatrix',
			'normalMatrix',
			// // fragment shader uniforms
			'isShading',
			// 'textureMode',
			'u_reverseLightDirection',
			'u_worldCameraPosition',
			// 'u_texture_image',
			// 'u_texture_environment',
			// 'u_texture_bump'
		];

		this._attributes = [
			'a_position',
			'a_color',
			'a_normal',
			// 'a_tangent',
			// 'a_bitangent',
			// 'a_texCoord'
		]

		this._drawCounter = 0;
	}

	async init() {
		this._glComponent.program = await this._createProgram();

		this._createBuffers();
		// set shaders uniform and attribute locations
		this._createUniformLocations();
		this._createAttributeLocations();

		this._gl.useProgram(this._glComponent.program);

		return this;
	}

	clearCanvas() {
		const resizeCanvasToDisplaySize = (canvas, multiplier) => {
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
		resizeCanvasToDisplaySize(this._gl.canvas);
		
		this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
		this._gl.scissor(0, 0, this._gl.canvas.width, this._gl.canvas.height);

		this._gl.clearColor(0, 0, 0, 1); // clear to canvas default color (white)
		this._gl.clearDepth(1);
		this._gl.enable(this._gl.DEPTH_TEST);
		this._gl.depthFunc(this._gl.LEQUAL);
		this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);

		return this;
	}

	drawArticulated(state) {
		this.clearCanvas();

		this._drawCounter = 0;
		this._setBuffers();
		
		const props = this._setupProperties(state);
		this.drawModel(state.model, props);
	}

	drawModel(model, props) {
		// this._updateProperties(model, props);
		this.drawComponent(model, props);

		// draw children model
		for (let i = 0; i < model.children.length; i++) {
			this.drawModel(model.children[i], props);
		}

		return this;
	}

	drawComponent(model, props) {
		let glProps = {
			glVertices: [],
			glColors: [],
			glNormals: [],
			tangents: [],
			bitangents: [],
			glTexCoords: [],
		}

		this._initBuffers(model, glProps);
		this._bindBuffers(glProps);

		// clone all attribute on props
		const newProps = {};
		for (let key in props) {
			// console.log(key)
			if(key.includes("Matrix")){
				newProps[key] = props[key].clone();
			} else {
				newProps[key] = props[key];
			}
		}

		this._updateProperties(model, newProps);
		// console.log("props", newProps)
		this._gl.drawArrays(this._gl.TRIANGLES, 0, this._drawCounter);

		return this;
	}

	_getVectorInfo(glVertices) {
    let normals = [];
    let tangents = [];
    let bitangents = [];

    for(let i = 0; i < glVertices.length; i += 18){
        const u = glVertices.slice(i, i + 3);
        const v = glVertices.slice(i + 3, i + 6);
        const w = glVertices.slice(i + 6, i + 9);

        const uv = GeometryOp.subtract(v, u);
        const uw = GeometryOp.subtract(w, u);

        const n = GeometryOp.normalize(GeometryOp.cross(uv, uw));
        const t = GeometryOp.normalize(uv);
        const b = GeometryOp.normalize(uw);

        for(let j = 0; j < 6; j++){
            normals = normals.concat(n);
            tangents = tangents.concat(t);
            bitangents = bitangents.concat(b);
        }
    }
    return {
        normals: normals,
        tangents: tangents,
        bitangents: bitangents
    }
}

	_initBuffers(model, glProps) {
		let glVertices = glProps.glVertices;
		let glColors = glProps.glColors;
		let glNormals = glProps.glNormals;
		let tangents = glProps.tangents;
		let bitangents = glProps.bitangents;
		let glTexCoords = glProps.glTexCoords;

		let object = model.object;
		let vertices = object.vertices;
		let colors = object.colors;
		let indices = object.indices;

		for (let i = 0; i < object.num_indices; i++) {
			// set vertex
			let index = indices[i];
			// set 1st part of triangle
			glVertices = glVertices.concat(vertices[index[0]]);
			glVertices = glVertices.concat(vertices[index[1]]);
			glVertices = glVertices.concat(vertices[index[2]]);
			// set 2nd part of triangle
			glVertices = glVertices.concat(vertices[index[0]]);
			glVertices = glVertices.concat(vertices[index[2]]);
			glVertices = glVertices.concat(vertices[index[3]]);

			// set color
			let colorIdx = i % colors.length;
			for (let j = 0; j < 6; j++) {
				glColors = glColors.concat(colors[colorIdx]);
			}

			// set texture coordinates
			glTexCoords = glTexCoords.concat([
				0, 0,
				0, 1,
				1, 1,
				1, 0,
				0, 0,
				1, 1
			]);

			this._drawCounter += 6;
    	}

		let vectorinfo = this._getVectorInfo(glVertices);

		glNormals = vectorinfo.normals;
		tangents = vectorinfo.tangents;
		bitangents = vectorinfo.bitangents;

		glProps.glVertices = glVertices;
		glProps.glColors = glColors;
		glProps.glNormals = glNormals;
		glProps.tangents = tangents;
		glProps.bitangents = bitangents;
		glProps.glTexCoords = glTexCoords;

		// console.log("glVertices : ",  glProps)
	}

	_setupProperties(state) {
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

		let modelMatrix = new Matrix4().identity()

		modelMatrix.transform(model.translation, model.rotation, model.scale);
		let projectionMatrix = this.getProjectionMatrix(projectionType, state)

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
		const viewMatrix = cameraMatrix.clone().inverse()


		const viewModelMatrix = modelMatrix.clone()
			.multiply(viewMatrix.clone());
		const normalMatrix = viewModelMatrix.inverse().transpose();
		const isShading = state.isShading;

		const uniforms = {projectionMatrix, viewMatrix, modelMatrix, normalMatrix, cameraPos, isShading}
		this._setUniforms(uniforms);

		return uniforms;
	}

	_updateProperties(model, props) {
		props.modelMatrix.identity().transform(model.translation, model.rotation, model.scale)
		props.normalMatrix = props.modelMatrix.clone().multiply(props.viewMatrix).inverse().transpose();
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

	_setUniforms(props) {
		const {projectionMatrix, viewMatrix, modelMatrix, normalMatrix, cameraPos, isShading} = props;
		// set uniforms on vertex shader
		this._gl.uniformMatrix4fv(this._glComponent.projectionMatrix, false, projectionMatrix.flatten());
		this._gl.uniformMatrix4fv(this._glComponent.viewMatrix, false, viewMatrix.flatten());
		this._gl.uniformMatrix4fv(this._glComponent.modelMatrix, false, modelMatrix.flatten());
		this._gl.uniformMatrix4fv(this._glComponent.normalMatrix, false, normalMatrix.flatten());
		
		// set uniforms on fragment shader
		this._gl.uniform1i(this._glComponent.isShading, isShading);
		// this._gl.uniform1i(this._glComponent.textureMode, Number(this.textureMode));
		this._gl.uniform3fv(this._glComponent.u_reverseLightDirection, GeometryOp.normalize([0, 0, -1.0]));
		// this._gl.uniform3fv(this._glComponent.u_worldCameraPosition, cameraPos);

		// Set texture
		// image
		// this._gl.uniform1i(this._glComponent.u_texture_image, 0);
		// this._gl.activeTexture(this._gl.TEXTURE0);
		// this._gl.bindTexture(this._gl.TEXTURE_2D, this.textures.image);
		// // environment
		// this._gl.uniform1i(this._glComponent.u_texture_env, 1);
		// this._gl.activeTexture(this._gl.TEXTURE1);
		// this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, this.textures.environment);
		// // bump
		// this._gl.uniform1i(this._glComponent.u_texture_bump, 2);
		// this._gl.activeTexture(this._gl.TEXTURE2);
		// this._gl.bindTexture(this._gl.TEXTURE_2D, this.textures.bump);

		return this;
	}

	_bindBuffers(glProps) {
		const vertices = glProps.glVertices;
		const colors = glProps.glColors;
		const normals = glProps.glNormals;
		const tangents = glProps.tangents;
		const bitangents = glProps.bitangents;
		const textureCoords = glProps.glTexCoords;

    // bind Position buffer
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.vertexBuffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(vertices), this._gl.STATIC_DRAW);
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);

    // bind Color buffer
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.colorBuffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Uint8Array(colors), this._gl.STATIC_DRAW);
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);

    // bind Normal buffer
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.normalBuffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(normals), this._gl.STATIC_DRAW);
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);

    // // bind Tangent buffer
    // this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.tangentBuffer);
    // this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(tangents), this._gl.STATIC_DRAW);
		// this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);

    // // bind Bitangent buffer
    // this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.bitangentBuffer);
    // this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(bitangents), this._gl.STATIC_DRAW);
		// this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);

    // // bind TextureCoord buffer
    // this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.textureCoordBuffer);
    // this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(textureCoords), this._gl.STATIC_DRAW);
		// this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
		
		return this;
  }

	_setBuffers() {
    // set Position buffer
    this._gl.enableVertexAttribArray(this._glComponent.positionAttribLoc);
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.vertexBuffer);
    this._gl.vertexAttribPointer(
      this._glComponent.positionAttribLoc,    	// location
      3,                                        // size
      this._gl.FLOAT,                           // type
      false,                                    // normalized
      0,                                        // stride
      0                                         // offset
    );

    // set Color buffer
    this._gl.enableVertexAttribArray(this._glComponent.colorAttribLoc);
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.colorBuffer);
		this._gl.vertexAttribPointer(
			this._glComponent.colorAttribLoc,
			4,
			this._gl.UNSIGNED_BYTE,
			true,
			0,
			0
		);

    // set Normal buffer
    this._gl.enableVertexAttribArray(this._glComponent.normalAttribLoc);
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.normalBuffer);
		this._gl.vertexAttribPointer(
			this._glComponent.normalAttribLoc,
			3,
			this._gl.FLOAT,
			false,
			0,
			0
		);

    // // set Tangent buffer
    // this._gl.enableVertexAttribArray(this._glComponent.tangentAttribLoc);
    // this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this.tangentBuffer);
    // this._gl.vertexAttribPointer(
    //   this._glComponent.tangentAttribLoc,
    //   3,
    //   this._gl.FLOAT,
    //   false,
    //   0,
    //   0
    // );

    // // set Bitangent buffer
    // this._gl.enableVertexAttribArray(this._glComponent.bitangentAttribLoc);
    // this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this.bitangentBuffer);
    // this._gl.vertexAttribPointer(
    //   this._glComponent.bitangentAttribLoc,
    //   3,
    //   this._gl.FLOAT,
    //   false,
    //   0,
    //   0
    // );

    // // set TextureCoord buffer
    // this._gl.enableVertexAttribArray(this._glComponent.textureCoordAttribLoc);
    // this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this.textureCoordBuffer);
    // this._gl.vertexAttribPointer(
    //   this._glComponent.textureCoordAttribLoc,
    //   2,
    //   this._gl.FLOAT,
    //   false,
    //   0,
    //   0
    // );

		return this;
  }

	getGl() {
		return this._gl;
	}


	// _setPrimitives(glVertices, glColors, glNormals, model) {
	// 	let object = model.object;
	// 	let vertices = object.vertices;
	// 	let colors = object.colors;
	// 	let indices = object.indices;

	// 	for (let i = 0; i < object.num_indices; i++) {
	// 		let vertex_idx = indices[i];

	// 		let corners = [];
	// 		corners.push(vertices[vertex_idx[0]]);
	// 		corners.push(vertices[vertex_idx[1]]);
	// 		corners.push(vertices[vertex_idx[2]]);
	// 		corners.push(vertices[vertex_idx[3]]);
	// 		let color_idx = i % colors.length;

	// 		// console.log(corners)
	// 		Render.rectangle(
	// 			glVertices,
	// 			glColors,
	// 			glNormals,
	// 			corners,
	// 			colors[color_idx]
	// 		);
	// 		this.drawCounter += 6;
	// 	}

	// 	for (let i = 0; i < model.children.length; i++) {
	// 		this._setPrimitives(glVertices, glColors, glNormals, model.children[i]);
	// 	}
	// }

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

		// const {
		// 	size = 3,
		// 	type = this._gl.FLOAT,
		// 	normalize = false,
		// 	stride = 0,
		// 	offset = 0,
		// 	primitiveType,
		// 	drawCounter,
		// } = settings;

		// this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.vertexBuffer);

		// this._gl.enableVertexAttribArray(this._glComponent.positionAttributeLocation);
		// this._gl.vertexAttribPointer(
		// 	this._glComponent.positionAttributeLocation,
		// 	size,
		// 	type,
		// 	normalize,
		// 	stride,
		// 	offset
		// );

		// this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.colorBuffer);

		// this._gl.enableVertexAttribArray(this._glComponent.colorAttributeLocation);
		// this._gl.vertexAttribPointer(
		// 	this._glComponent.colorAttributeLocation,
		// 	4,
		// 	this._gl.UNSIGNED_BYTE,
		// 	true,
		// 	stride,
		// 	offset
		// );

		// this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.normalBuffer);

		// this._gl.enableVertexAttribArray(this._glComponent.normalAttributeLocation);
		// this._gl.vertexAttribPointer(
		// 	this._glComponent.normalAttributeLocation,
		// 	size,
		// 	type,
		// 	normalize,
		// 	stride,
		// 	offset
		// );
		this._setBuffers();
		this.setupProperties(state);
		// let matrix = new Matrix4().identity()


		// matrix.transform(state.model.translation, state.model.rotation, state.model.scale);
		// let projectionMatrix = this.getProjectionMatrix(state.projectionType, state)



		// let cameraMatrix = new Matrix4().identity()
		// 	.rotateY(state.cameraRotation)
		// 	.translate(0, 0, state.cameraRadius);

		// const cameraPos = [
		// 	cameraMatrix.get(3, 0),
		// 	cameraMatrix.get(3, 1),
		// 	cameraMatrix.get(3, 2)
		// ];
		// const target = [0, 0, 0];
		// const up = [0, 1, 0];

		// // console.log(ViewOp.lookAt(cameraPos, target, up));

		// cameraMatrix = ViewOp.lookAt(cameraPos, target, up);

		// const viewMatrix = cameraMatrix.clone().inverse()


		// // projectionMatrix.multiply(worldMatrix)


		// // console.log(matrix, projectionMatrix)
		// // let projectionMatrix = TransformationMatrix4D.projection(
		// // 	state.projectionType,
		// // 	state.obliqueTetha,
		// // 	state.obliquePhi
		// // );

		// // if (state.projectionType === 'perspective') {
		// // 	let perspectiveProjectionMatrix = CameraOp.perspective(
		// // 		Converter.degToRad(camSettings.camFieldOfView),
		// // 		aspect,
		// // 		near,
		// // 		far
		// // 	);

		// // 	projectionMatrix = MatrixOp.multiply(
		// // 		viewMatrix,
		// // 		perspectiveProjectionMatrix
		// // 	);

		// // 	projectionMatrix = Transform.scale(projectionMatrix, -1, 1, 1);
		// // }

		// // projectionMatrix = MatrixOp.multiply(worldMatrix, projectionMatrix);
		// // console.log(viewMatrix)
		// const viewModelMatrix = matrix.clone()
		// 								.multiply(viewMatrix.clone());
		// const normalMatrix = viewModelMatrix.inverse().transpose();


		// // const normalMatrix = matrix.clone();

		// this._gl.uniformMatrix4fv(
		// 	this._glComponent.modelMatrix, 
		// 	false, 
		// 	matrix.flatten()
		// );
		// this._gl.uniformMatrix4fv(
		// 	this._glComponent.projectionMatrix,
		// 	false,
		// 	projectionMatrix.flatten()
		// );
		// this._gl.uniformMatrix4fv(
		// 	this._glComponent.normalMatrix,
		// 	false,
		// 	normalMatrix.flatten()
		// );
		// this._gl.uniformMatrix4fv(
		// 	this._glComponent.viewMatrix,
		// 	false,
		// 	viewMatrix.flatten()
		// );

		// this._gl.uniform1i(useLighting, state.useLighting);
		// this._gl.uniform1f(fudgeFactor, state.fudgeFactor);

		// console.log(drawCounter)


		this._gl.drawArrays(this._gl.TRIANGLES, 0, 72);


	}

	renderAnimation(settings, state) {
		window.requestAnimationFrame(() => {
			this.clearCanvas().render(settings, state);
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

		if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
			console.log("An error occurred compiling the shaders: " + this._gl.getShaderInfoLog(shader));
			this._gl.deleteShader(shader);
			return -1;
		}
		return shader;
	}

	async _fetchShader(filename) {
		try {
			const res = await fetch(`./shaders/${filename}`);
			const shader = await res.text();
			return shader;
	
		} catch (e) {
			console.log(`Failed to fetch shader at ${url}: ${e}`);
		}
	}

	async _createProgram() {
		// set up vertex shader
		const vertexShaderPath = "vertex_shader.glsl";
		const vertexShaderScript = await this._fetchShader(vertexShaderPath);
		var vertexShader = this._createShader(this._gl.VERTEX_SHADER, vertexShaderScript);
	
		// set up fragment shader
		const fragmentShaderPath = "fragment_shader.glsl";
		const fragmentShaderScript = await this._fetchShader(fragmentShaderPath);
		var fragmentShader = this._createShader(this._gl.FRAGMENT_SHADER, fragmentShaderScript);
	
		// create program
		const program = this._gl.createProgram();
	
		// attach shader to program
		this._gl.attachShader(program, vertexShader);
		this._gl.attachShader(program, fragmentShader);
		this._gl.linkProgram(program);
	
		if (!this._gl.getProgramParameter(program, this._gl.LINK_STATUS)) {
			alert("Shader program failed to link.\nError log :" + this._gl.getProgramInfoLog(program));
			return -1;
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
			this._glComponent[uniform] = this._gl.getUniformLocation(this._glComponent.program, uniform);
		}
	}

	_createAttributeLocations() {
		for (let attribute of this._attributes) {
			const attributeName = attribute.replace('a_', '') + 'AttribLoc';
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
