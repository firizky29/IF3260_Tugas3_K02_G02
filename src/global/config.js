const CONFIG = {
    VERTEX_SHADER: `#version 300 es
  
          in vec4 a_position;
          in vec4 a_color;
          in vec4 a_normal;
  
          uniform mat4 projection, modelView, normalMat;
  
          uniform int useLighting;
          uniform float fudgeFactor;
  
          out vec3 lighting;
  
  
          out vec4 v_color;
  
          void main() {
              vec4 pos = projection * modelView * a_position;
              if(fudgeFactor > 0.0){
                  float zToDivideBy = 1.0 + pos.z * fudgeFactor;
                   gl_Position = vec4(pos.xy / zToDivideBy, pos.zw);
              } else {
                  gl_Position = pos;
              }
  
              vec3 ambientLight = vec3(0.5, 0.5, 0.5);
              vec3 diffuseColor = vec3(1, 1, 1);
              vec3 lightPosition = normalize(vec3(0.5, 1, -1));
  
              vec4 transformedNormal = normalMat * a_normal;
  
              float cos = max(dot(transformedNormal.xyz, lightPosition), 0.0);
              lighting = ambientLight + (diffuseColor * cos);
              
              if(useLighting == 0){
                  v_color = a_color;
              } else{
                  v_color = vec4(a_color.rgb * lighting, 1.0);
              }
  
          }
      `,
    FRAGMENT_SHADER: `#version 300 es
  
    precision highp float;
    in vec4 v_color;
    
    out vec4 outColor;
    
    void main() {
      outColor = v_color;
    }
    `,
  };
  
  export default CONFIG;
  