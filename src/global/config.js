const CONFIG = {
    // VERTEX_SHADER: `#version 300 es
  
    //       in vec4 a_position;
    //       in vec4 a_color;
    //       in vec4 a_normal;
  
    //       uniform mat4 projection, modelView, normalMat;
  
    //       uniform int useLighting;
    //       uniform float fudgeFactor;
  
    //       out vec3 lighting;
  
  
    //       out vec4 v_color;
  
    //       void main() {
    //           vec4 pos = projection * modelView * a_position;
    //           if(fudgeFactor > 0.0){
    //               float zToDivideBy = 1.0 + pos.z * fudgeFactor;
    //                gl_Position = vec4(pos.xy / zToDivideBy, pos.zw);
    //           } else {
    //               gl_Position = pos;
    //           }
  
    //           vec3 ambientLight = vec3(0.5, 0.5, 0.5);
    //           vec3 diffuseColor = vec3(1, 1, 1);
    //           vec3 lightPosition = normalize(vec3(0.5, 0.5, 1));
  
    //           vec4 transformedNormal = normalMat * a_normal;
  
    //           float cos = max(dot(transformedNormal.xyz, lightPosition), 0.0);
    //           lighting = ambientLight + (diffuseColor * cos);
              
    //           if(useLighting == 0){
    //               v_color = a_color;
    //           } else{
    //               v_color = vec4(a_color.rgb * lighting, 1.0);
    //           }
  
    //       }
    //   `,
    VERTEX_SHADER: `#version 300 es

        in vec4 a_position;
        in vec4 a_color;
        in vec3 a_normal;

        uniform mat4 projectionMatrix, viewMatrix, modelMatrix, normalMatrix;

        uniform int useLighting;
        // uniform float fudgeFactor;

        out vec3 lighting;


        out vec4 v_color;
        // out vec3 v_modelPosition;
        // out vec3 v_viewModelPosition;
        // out vec3 v_worldNormal;

        void main() {
            mat4 viewModelMatrix = viewMatrix * modelMatrix;

            // Multiply the position by the matrix.
            gl_Position = projectionMatrix * viewModelMatrix * a_position;
    
            // send the view position to the fragment shader
            // v_modelPosition = vec3(u_modelMatrix * a_position);
            // v_viewModelPosition = vec3(viewModelMatrix * a_position);
    
            // orient the normals and pass to the fragment shader
            // v_worldNormal = mat3(modelMatrix) * a_normal;

            vec3 ambientLight = vec3(0.5, 0.5, 0.5);
            vec3 diffuseColor = vec3(1, 1, 1);
            vec3 lightPosition = normalize(vec3(0.2, 0.4, 1));

            vec3 transformedNormal = mat3(normalMatrix) * a_normal;
            // vec4 worldNormal = normalize(viewModelMatrix * a_normal);

            float cos = max(dot(transformedNormal.xyz, lightPosition), 0.0);
            lighting = ambientLight + (diffuseColor * cos);
            
            v_color = vec4(a_color.rgb * lighting, 1.0);
            
    
            // // // Pass the color to the fragment shader.
            // // v_color = a_color;

            // v_modelPosition = vec3(modelMatrix * a_position);
            // v_viewModelPosition = vec3(viewModelMatrix * a_position);

            // // orient the normals and pass to the fragment shader
            // v_worldNormal = mat3(modelMatrix) * a_normal;

            // // Pass the color to the fragment shader.
            // v_color = a_color;
        }

    `,

    FRAGMENT_SHADER: `#version 300 es
  
    precision highp float;
    in vec4 v_color;
    // in vec3 v_modelPosition;
    // in vec3 v_viewModelPosition;

    // The normal of object.
    // in vec3 v_worldNormal;
    
    out vec4 outColor;
    
    void main() {
        // vec3 worldNormal = normalize(v_worldNormal);

        // Lighting Effect.
        // vec3 ambientLight = vec3(0.3, 0.3, 0.3);
        // vec3 lightPosition = normalize(vec3(0.2, 0.4, 1));
        // float directionalLight = dot(worldNormal, lightPosition);
        // vec3 light = ambientLight + directionalLight;
     
        // Default color is from buffer.
        outColor = v_color;

        // Multiply by light.
        // outColor.rgb *= light;
    }
    `,

    
  };
  
  export default CONFIG;
  