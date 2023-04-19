function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}
export class TextureMap {

  static environment(gl){
    // Create the texture.
    let texture = gl.createTexture()

    // Bind the texture.
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

    const faceInfos = [
      {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
        url: '../assets/pos-x.jpg',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
        url: '../assets/neg-x.jpg',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
        url: '../assets/pos-y.jpg',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
        url: '../assets/neg-y.jpg',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
        url: '../assets/pos-z.jpg',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
        url: '../assets/neg-z.jpg',
      },
    ];
    faceInfos.forEach((faceInfo) => {
      const { target, url } = faceInfo;

      // Upload the canvas to the cubemap face.
      const level = 0;
      const internalFormat = gl.RGBA;
      const width = 512;
      const height = 512;
      const format = gl.RGBA;
      const type = gl.UNSIGNED_BYTE;

      // setup each face so it's immediately renderable
      gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

      // Asynchronously load an image
      const image = new Image();
      image.src = url;
      image.crossOrigin = "";   // ask for CORS permission
      image.addEventListener('load', function () {
        // Now that the image has loaded make copy it to the texture.
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.texImage2D(target, level, internalFormat, format, type, image);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
      });
    });
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    return texture;
  }

  /**
   * Use and create an environment map texture. 
   *
   * @param gl - The WebGL context. 
   * @returns - The texture.
   */
  static image(gl) {
    const url = "../assets/sun.jpg";
    
    return TextureMap.loadTexture2D(gl, url);
  }

  /**
   * Use and create an environment map texture. 
   *
   * @param gl - The WebGL context. 
   * @returns - The texture.
   */
  static bump(gl){
    const url = "../assets/bump.png";
    return TextureMap.loadTexture2D(gl, url);
  }

  /**
   * Load the texture 2D from the url and create a WebGLTexture.
   * @param gl - The WebGL context.
   * @param url - The url of the texture.
   * @returns - The texture.
   */
  static loadTexture2D(gl, url) {
    // Create a texture.
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Fill the texture with a 1x1 blue pixel.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 0, 255]);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType,
      pixel);

    // Asynchronously load an image
    var image = new Image();
    image.src = url;
    image.crossOrigin = "";   // ask for CORS permission
    image.addEventListener('load', function () {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      // Check if the image is a power of 2 in both dimensions.
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    });

    return texture;
  }
}