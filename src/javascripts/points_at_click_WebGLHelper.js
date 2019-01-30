import { WebGLHelper } from "./webgl_helper";

export function displayPoints(vs_script, fs_script){
    let canvas = document.querySelector("#webgl-scene")
    let gl = WebGLHelper.initWebGL(canvas)
    let program = WebGLHelper.initShaders(gl, vs_script, fs_script);
    gl.useProgram(program)

    WebGLHelper.initBuffers(gl, program, [
        {
            name: "coordinates",
            size: 3,
            data: []
        }
    ])
    
    let vertices = []

    canvas.onmouseup = (e) => {
        let [x, y] = WebGLHelper.toWebGLCoordinates(e)

        vertices.push(x)
        vertices.push(y)
        vertices.push(0.0)

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
        gl.drawArrays(gl.LINES, 0, vertices.length / 3)
    }
    // Clear the canvas
    WebGLHelper.clear(gl, [1.0, 1.0, 1.0, 1.0])  
}