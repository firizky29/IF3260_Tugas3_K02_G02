#version 300 es

precision mediump float;

in vec4 a_position;
in vec4 a_color;
in vec3 a_normal;
in vec3 a_tangent;
in vec3 a_bitangent;
in vec2 a_texCoord;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 normalMatrix;

out vec4 v_color;
out vec3 v_modelPosition;
out vec3 v_viewModelPosition;
out vec3 v_worldNormal;
out vec2 v_textureCoord;
out mat3 v_tbn;


void main() {
  mat4 vm = viewMatrix * modelMatrix;

  gl_Position = projectionMatrix * vm * a_position;

  v_color = a_color;
  v_modelPosition = vec3(modelMatrix * a_position);
  v_viewModelPosition = vec3(vm * a_position);
  v_worldNormal = mat3(normalMatrix) * a_normal;
  v_textureCoord = a_texCoord;

  // Bump mapping variables
  vec3 t = normalize(mat3(normalMatrix) * a_tangent);
  vec3 b = normalize(mat3(normalMatrix) * a_bitangent);
  vec3 n = normalize(mat3(normalMatrix) * a_normal);
  v_tbn = transpose(mat3(t, b, n));
}