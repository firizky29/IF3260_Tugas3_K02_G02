precision mediump float;

uniform bool isShading;
uniform int textureMode;

uniform vec3 u_reverseLightDirection;
uniform vec3 u_worldCameraPosition;

// Textures option
uniform sampler2D u_texture_image;
uniform samplerCube u_texture_environment;
uniform sampler2D u_texture_bump;

varying vec4 v_color;
varying vec3 v_modelPosition;
varying vec3 v_viewModelPosition;
varying vec3 v_worldNormal;
varying vec2 v_textureCoord;

varying mat3 v_tbn;

void main() {
   vec3 worldNormal = normalize(v_worldNormal);

   vec3 ambientLight = vec3(0.3, 0.3, 0.3);
   float directionalLight = dot(worldNormal, u_reverseLightDirection);
   vec3 light = ambientLight + directionalLight;

   gl_FragColor = v_color;

   if(textureMode == 0) {
      gl_FragColor = texture2D(u_texture_image, v_textureCoord);

   } else if(textureMode == 1) {
      vec3 eyeToSurfaceDir = normalize(v_modelPosition - u_worldCameraPosition);
      vec3 reflectionDir = reflect(eyeToSurfaceDir, worldNormal);

      gl_FragColor = textureCube(u_texture_environment, reflectionDir);

   } else if(textureMode == 2) {
      vec3 fragPos = v_tbn * v_viewModelPosition;
      vec3 lightPos = v_tbn * u_reverseLightDirection;

      vec3 lightDir = normalize(lightPos - fragPos);
      vec3 albedo = texture2D(u_texture_bump, v_textureCoord).rgb;
      vec3 ambient = 0.3 * albedo;

      vec3 norm = normalize(texture2D(u_texture_bump, v_textureCoord).rgb * 2.0 - 1.0);
      float diffuse = max(dot(lightDir, norm), 0.0);

      gl_FragColor = vec4(diffuse * albedo + ambient, 1.0);
   }

   if(isShading) {
      gl_FragColor.rgb *= light;
   }

}