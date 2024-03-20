 precision mediump float;

 uniform float u_time;
 uniform vec2 u_resolution;
//  uniform vec2 u_mouse;
//  varying vec2 vUv;


void main(){
    vec2 uv = gl_FragCoord.xy / u_resolution.xy; // Normalize UV coordinates

    // Normalize UV to a square space
    vec2 center = vec2(0.5, 0.5); // Center of the screen
    float radius = distance(uv, center); // Distance from the center
    // create fish eye effect
    float fishEyeFactor = -0.2  ;
    uv = uv + (uv - center) * (radius * fishEyeFactor);
    // convertthe uv to a square
    vec2 squareUV = uv * vec2(u_resolution.x / u_resolution.y, 1.0);\
    // Calculate the grid size based on the resolution
    // Use the smaller dimension to ensure even squares
    float gridSize = min(u_resolution.x, u_resolution.y) / 80.0 ; // Adjust the divisor to change the grid size
    gridSize = floor(gridSize);



    // Animate the grid on the Y-axis
    float animatedY = squareUV.y + u_time * 0.2;
    float animatedX = squareUV.x + cos(u_time * 0.2) * 0.5;
    // Calculate the grid lines
    // Use mod function to create repeating patterns
    float gridX = step(fract(animatedX * gridSize), 0.03);
    float gridY = step(fract(animatedY * gridSize), 0.03);
vec4 grid = vec4(1.,3.,0.4,2.);
    
    // Create a green color for the grid lines
    vec3 color = vec3(0.05, 0.33, 0.05);


    // Create a black background
    vec3 backgroundColor = vec3(0.0, 0.0, 0.0);

    // Combine the grid lines with the background
    vec3 finalColor = mix(backgroundColor, color.rgb, gridX + gridY);

    gl_FragColor = vec4(finalColor, 1);
}