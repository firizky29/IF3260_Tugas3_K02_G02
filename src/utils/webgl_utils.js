// set gl on canvas
function getWebGLContext(canvas) {
  const gl = canvas.getContext("webgl");
  if (!gl) alert("WebGL isn't available on current browser.");

  return gl;
}