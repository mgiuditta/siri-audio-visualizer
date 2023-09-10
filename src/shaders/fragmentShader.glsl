varying vec2 vUv;
varying float vPattern;
uniform float uTime;
uniform float uAudioFrequency;

struct ColorStop {
    vec3 color;
    float position;
};

#define COLOR_RAMP(colors, factor, finalColor) { \
    int index = 0; \
 for (int i = 0; i < colors.length() - 1; i++){ \
       ColorStop currentColor = colors[i]; \
       bool isInBetween = currentColor.position <= factor; \
       index = isInBetween ? i : index; \
 } \
    ColorStop currentColor = colors[index]; \
    ColorStop nextColor = colors[index + 1]; \
    float range = nextColor.position - currentColor.position; \
    float lerpFactor = (factor - currentColor.position) / range; \
    finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
 }



void main() {

    float time = uTime * (1.0 + uAudioFrequency * 10.0);

    vec3 color;
    vec3 mainColor = vec3(0.0, 0.0, 0.0);
    mainColor.r = 0.0 / 255.0;
    mainColor.g = 217.0 / 255.0;
    mainColor.b = 255.0 / 255.0;


    vec3 roseColor = vec3(0.76, 0.25, 0.51);
    vec3 bluColor = vec3(0.42352941176, 0.74509803921, 0.99607843137);

    ColorStop[4] colors = ColorStop[](
    ColorStop(vec3(1), 0.0),
    ColorStop(mainColor, 0.1),
    ColorStop(roseColor, 1.0),
    ColorStop(vec3(0.01, 0.05, 0.2), 1.0)
    );
    COLOR_RAMP(colors, vPattern, color);
    gl_FragColor = vec4(color, 1);
}