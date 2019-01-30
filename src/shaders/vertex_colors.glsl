attribute vec3 coordinates;
attribute vec3 colors;
varying vec4 vColor;
void main(void) {
  gl_Position = vec4(coordinates, 1.0);
  vColor = vec4(colors, 1.0);
}