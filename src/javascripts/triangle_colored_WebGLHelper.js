import { WebGLHelper } from "./webgl_helper";

export function displayColorTriangle(vs_script, fs_script){
    let canvas = document.querySelector("#webgl-scene")
    let gl = WebGLHelper.initWebGL(canvas)

    let program = WebGLHelper.initShaders(gl, vs_script, fs_script)
    gl.useProgram(program)

    WebGLHelper.initBuffers(gl, program, [
        {
            name: "coordinates",
            size: 3,
            data: [0, 0, 0, .5, .5, 0, .5, -.5, 0]
        },
        {
            name: "colors",
            size: 3,
            data: [1, 0, 0,  0, 1, 0, 0, 0, 1]
        }
    ])

    WebGLHelper.clear(gl, [1.0, 1.0, 1.0, 1.0])


    gl.drawArrays(gl.TRIANGLES, 0, 3)
}