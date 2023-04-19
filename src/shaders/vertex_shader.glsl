attribute vec4 a_position;
attribute vec4 a_color;
attribute vec3 a_normal;
attribute vec3 a_tangent;
attribute vec3 a_bitangent;

attribute vec2 a_textureCoord;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;
uniform mat4 u_normalMatrix;

varying vec4 v_color;

varying vec3 v_modelPosition;
varying vec3 v_viewModelPosition;
varying vec3 v_worldNormal;
varying vec2 v_textureCoord;

// All variables for Bump Mapping
varying mat3 v_tbn;

mat3 transpose(in mat3 inMatrix) {
  vec3 i0 = inMatrix[0];
  vec3 i1 = inMatrix[1];
  vec3 i2 = inMatrix[2];

  mat3 outMatrix = mat3(vec3(i0.x, i1.x, i2.x), vec3(i0.y, i1.y, i2.y), vec3(i0.z, i1.z, i2.z));

  return outMatrix;
}

void main() {
  // View model matrix.
  mat4 viewModelMatrix = u_viewMatrix * u_modelMatrix;

  // Multiply the position by the matrix.
  gl_Position = u_projectionMatrix * viewModelMatrix * a_position;

  // send the view position to the fragment shader
  v_modelPosition = vec3(u_modelMatrix * a_position);
  v_viewModelPosition = vec3(viewModelMatrix * a_position);

  // orient the normals and pass to the fragment shader
  v_worldNormal = mat3(u_modelMatrix) * a_normal;

  // Pass the color to the fragment shader.
  v_color = a_color;

  // Pass the texcoord to the fragment shader.
  v_textureCoord = a_textureCoord;

  // Bump mapping variables. 
  vec3 t = normalize(mat3(u_normalMatrix) * a_tangent);
  vec3 b = normalize(mat3(u_normalMatrix) * a_bitangent);
  vec3 n = normalize(mat3(u_normalMatrix) * a_normal);
  v_tbn = transpose(mat3(t, b, n));
}