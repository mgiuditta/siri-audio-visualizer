varying vec2 vUv;

uniform float uTime;

void main() {

    vec3 modelPosition = position.xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(modelPosition, 1.0);
    vUv = uv;
}
