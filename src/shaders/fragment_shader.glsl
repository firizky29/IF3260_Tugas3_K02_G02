precision mediump float;

uniform vec3 u_reverseLightDirection;

// Shading parameters.
uniform bool u_shadingOn;

// Texture parameters.
uniform int u_textureMode;
varying vec2 v_textureCoord;

// The position of the camera
uniform vec3 u_worldCameraPosition;

// The position of object.
varying vec3 v_modelPosition;
varying vec3 v_viewModelPosition;

// The normal of object.
varying vec3 v_worldNormal;

// Passed in from the vertex shader.
varying vec4 v_color;

// The texture.
uniform sampler2D u_texture_image;
uniform samplerCube u_texture_environment;
uniform sampler2D u_texture_bump;

// All variables for Bump Mapping
varying mat3 v_tbn;

void main() {
   // Normalize the normal.
   vec3 worldNormal = normalize(v_worldNormal);

   // Lighting Effect.
   vec3 ambientLight = vec3(0.3, 0.3, 0.3);
   float directionalLight = dot(worldNormal, u_reverseLightDirection);
   vec3 light = ambientLight + directionalLight;

   // Default color is from buffer.
   gl_FragColor = v_color;

   // Set the color to the texture.
   if(u_textureMode == 0) {
      gl_FragColor = texture2D(u_texture_image, v_textureCoord);
   } else if(u_textureMode == 1) {
      // Reflection direction.
      vec3 eyeToSurfaceDir = normalize(v_modelPosition - u_worldCameraPosition);
      vec3 reflectionDir = reflect(eyeToSurfaceDir, worldNormal);

      gl_FragColor = textureCube(u_texture_environment, reflectionDir);
   } else if(u_textureMode == 2) {
      // Fragment position and lighting position.
      vec3 fragPos = v_tbn * v_viewModelPosition;
      vec3 lightPos = v_tbn * u_reverseLightDirection;

      // Lighting direction and ambient.
      vec3 lightDir = normalize(lightPos - fragPos);
      vec3 albedo = texture2D(u_texture_bump, v_textureCoord).rgb;
      vec3 ambient = 0.3 * albedo;
      // Lighting diffuse.
      vec3 norm = normalize(texture2D(u_texture_bump, v_textureCoord).rgb * 2.0 - 1.0);
      float diffuse = max(dot(lightDir, norm), 0.0);

      gl_FragColor = vec4(diffuse * albedo + ambient, 1.0);
   }

   // Set the shading.
   if(u_shadingOn) {
      gl_FragColor.rgb *= light;
   }

}