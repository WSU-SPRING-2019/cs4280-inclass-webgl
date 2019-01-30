import { WebGLHelper } from "../webgl_helper";

export function displayDiamond(){
    const vs_script = `
        attribute vec3 coordinates;
        attribute vec3 colors;
        varying vec4 vColor;
        uniform float theta;
        void main(void) {
            gl_Position.x = coordinates.x  * cos(theta);
            gl_Position.y = coordinates.y  * sin(theta);
            gl_Position.z = coordinates.z;
            gl_Position.w = 1.0;
            vColor = vec4(colors, 1.0);
        }`
    const fs_script = `
        varying mediump vec4 vColor;
        void main(void) {
            gl_FragColor = vColor;
        }`
    let canvas = document.querySelector("#webgl-scene")
    let gl = WebGLHelper.initWebGL(canvas)

    let program = WebGLHelper.initShaders(gl, vs_script, fs_script)
    gl.useProgram(program)

    WebGLHelper.initBuffers(gl, program, [
        {
            name: "coordinates",
            size: 3,
            data: [
                0, 1, 0, // coordinates
                1, 0, 0, // color
                1, 0, 0, 
                0, 1, 0,
                -1, 0, 0, 
                0, 0, 1,
                0, -1, 0,
                1, 1, 0
            ],
            offset: 0,
            stride: 6
        }, {
            name: "colors",
            size: 3,
            offset: 3,
            stride: 6
        }
    ])

    let theta = gl.getUniformLocation(program, 'theta');
    let th = 0.0;
    function animate(){
        th = (th + .01) % ( 2 * Math.PI)
        gl.uniform1f(theta, th);

        WebGLHelper.clear(gl, [1.0, 1.0, 1.0, 1.0])
        gl.drawArrays(gl.LINE_STRIP, 0, 4)

        window.requestAnimationFrame(animate)
    }

    //setInterval(animate, 10)

    animate()
}