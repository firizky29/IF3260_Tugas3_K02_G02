#version 300 es

precision mediump float;

in vec4 a_position;
in vec4 a_color;
in vec3 a_normal;
// attribute vec3 a_tangent;
// attribute vec3 a_bitangent;
// attribute vec2 a_texCoord;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 normalMatrix;

out vec4 v_color;
out vec3 v_modelPosition;
out vec3 v_viewModelPosition;
out vec3 v_worldNormal;
// varying vec2 v_textureCoord;

// varying mat3 v_tbn;

// mat3 transpose(in mat3 inMatrix)
// {
//     vec3 i0 = inMatrix[0];
//     vec3 i1 = inMatrix[1];
//     vec3 i2 = inMatrix[2];

//     mat3 outMatrix = mat3(
//         vec3(i0.x, i1.x, i2.x),
//         vec3(i0.y, i1.y, i2.y),
//         vec3(i0.z, i1.z, i2.z)
//     );

//     return outMatrix;
// }

void main() {
  mat4 vm = viewMatrix * modelMatrix;

  gl_Position = projectionMatrix * vm * a_position;

  v_color = a_color;
  v_modelPosition = vec3(modelMatrix * a_position);
  v_viewModelPosition = vec3(vm * a_position);
  v_worldNormal = mat3(normalMatrix) * a_normal;
  // v_textureCoord = a_texCoord;

  // Bump mapping variables
  // vec3 t = normalize(mat3(normalMatrix) * a_tangent);
  // vec3 b = normalize(mat3(normalMatrix) * a_bitangent);
  // vec3 n = normalize(mat3(normalMatrix) * a_normal);
  // v_tbn = transpose(mat3(t, b, n));
}