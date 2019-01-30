import { WebGLHelper } from "../webgl_helper"
import * as dat from 'dat.gui'

export function displaySierpinski() {
    const vs_script = `
        attribute vec3 coordinates;
        attribute vec3 colors;
        uniform float pointSize;
        varying vec4 vColor;
        void main(void) {
            gl_Position = vec4(coordinates, 1.0);
            gl_PointSize = pointSize;
            vColor = vec4(colors, 1.0);
        }`

    const fs_script = `
        varying mediump vec4 vColor;
        void main(void) {
            gl_FragColor = vColor; 
        }`

    let controls = {
        pointSize: 1,
        pointsCount: 1000,
        pointColor: '#FF0000'
    }



    let canvas = document.querySelector("#webgl-scene")
    let gl = WebGLHelper.initWebGL(canvas)
    let program = WebGLHelper.initShaders(gl, vs_script, fs_script)
    gl.useProgram(program)

    let points = [[-1, -1, 0], [1, -1, 0], [0, 1, 0]]
    let vertices = [];
    let p = [.3, .5, 0]
    WebGLHelper.initBuffers(gl, program, [
        {
            name: 'coordinates',
            size: 3,
            data: vertices
        }
    ])
    
    let colors = gl.getAttribLocation(program, 'colors')
    let pointSize = gl.getUniformLocation(program, 'pointSize')
    function redraw() {
        vertices = []
        
        for (let i = 0; i < controls.pointsCount; i++) {
            let q = points[Math.floor(Math.random() * 3)]

            p = [(q[0] + p[0]) / 2, (q[1] + p[1]) / 2, 0.0]
            vertices.push(p[0], p[1], p[2])
        }
        
        gl.vertexAttrib3f(colors, ...WebGLHelper.getColorFromHex(controls.pointColor))
        gl.uniform1f(pointSize, controls.pointSize)

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


        WebGLHelper.clear(gl, [1, 1, 1, 1])
        gl.drawArrays(gl.POINTS, 0, vertices.length / 3)
    }

    redraw()

    let gui = new dat.GUI()
    gui.add(controls, 'pointSize').min(1).max(10).onChange(redraw)
    gui.add(controls, 'pointsCount').min(1000).max(100000).onChange(redraw)
    gui.addColor(controls, 'pointColor').onChange(redraw)
}