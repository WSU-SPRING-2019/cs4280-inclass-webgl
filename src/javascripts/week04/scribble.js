import { WebGLHelper } from "../webgl_helper"
import * as dat from 'dat.gui'

export function scribble() {
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





    let canvas = document.querySelector("#webgl-scene")
    let gl = WebGLHelper.initWebGL(canvas)
    let program = WebGLHelper.initShaders(gl, vs_script, fs_script)
    gl.useProgram(program)

    let vertices = [];
    let colors = [];
    let pointSizes = []

    let controls = {
        pointSize: 1,
        pointColor: '#FF0000',
        draw: false,
        primitive: gl.POINTS,
        clear: function (){ 
            vertices = []
            colors = []
            pointSizes = []
            WebGLHelper.clear(gl, [1, 1, 1, 1]) }
    }



    let buffers = WebGLHelper.initBuffers(gl, program, [
        {
            name: 'coordinates',
            size: 3,
            data: vertices
        },
        {
            name: 'colors',
            size: 3,
            data: colors
        },
        {
            name: 'pointSize',
            size: 1,
            data: pointSizes
        }
    ])
    
    document.onkeyup = function (e) {
        switch(e.keyCode){
            case 27: // ESC - stop drawing
                controls.draw = false
                break
        }
    }

    canvas.onmousemove = function(e){
        if(controls.draw){
            let [x, y] = WebGLHelper.toWebGLCoordinates(e)
            let [r, g, b] = WebGLHelper.getColorFromHex(controls.pointColor)

            vertices.push(x, y, 0)
            colors.push(r, g, b)
            pointSizes.push(controls.pointSize)

            // Sending vertices
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers['coordinates'])
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

            // Sending colors
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers['colors'])
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

            // Sending point sizes
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers['pointSize'])
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointSizes), gl.STATIC_DRAW);

            gl.drawArrays(controls.primitive, 0, vertices.length / 3)

        }
    }


    WebGLHelper.clear(gl, [1, 1, 1, 1])
    
    let gui = new dat.GUI()
    gui.add(controls, 'pointSize').min(1).max(10)
    gui.addColor(controls, 'pointColor')
    gui.add(controls, 'primitive', {
        points: gl.POINTS,
        lines: gl.LINES,
        line_strip: gl.LINE_STRIP,
        line_loop: gl.LINE_LOOP,
        triangles: gl.TRIANGLES,
        triangle_strip: gl.TRIANGLE_STRIP,
        triangle_fan: gl.TRIANGLE_FAN
    })
    gui.add(controls, 'draw')
    gui.add(controls, 'clear')
    
}