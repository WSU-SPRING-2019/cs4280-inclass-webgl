import { WebGLHelper } from '../webgl_helper'
import * as dat from 'dat.gui'
export function runMultiplePrograms() {
    let canvas = document.querySelector("#webgl-scene")
    let gl = WebGLHelper.initWebGL(canvas)

    let objects = [
        {
            name: "triangle",
            vs_script: `
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
                }`,
            fs_script: `
                varying mediump vec4 vColor;
                void main(void) {
                    gl_FragColor = vColor;
                }`,
            vertices: [ -1, 1, 0,   -0.5, 1, 0,   -1, 0.5, 0 ],
            controls: {
                color: '#FF0000',
                speed: 0.01,
                theta: 0,
                direction: 1,
                primitive: gl.TRIANGLES
            }
        }, {
            name: "rectangle",
            vs_script: `
                attribute vec3 coordinates;
                attribute vec3 colors;
                varying vec4 vColor;
                uniform float theta;
                void main(void) {
                    gl_Position.x = coordinates.x  * sin(theta);
                    gl_Position.y = coordinates.y  * cos(theta);
                    gl_Position.z = coordinates.z;
                    gl_Position.w = 1.0;
                    vColor = vec4(colors, 1.0);
                }`,
            fs_script: `
                varying mediump vec4 vColor;
                void main(void) {
                    gl_FragColor = vColor;
                }`,
            vertices: [ .5, -1, 0,    1, -0.5, 0,    1, -1, 0,
                        .5, -1, 0,    1, -0.5, 0,    .5, -.5, 0 ],
            controls: {
                color: '#00FF00',
                speed: 0.02,
                theta: 0,
                direction: -1,
                primitive: gl.TRIANGLES
            }
        }, {
            name: "circle",
            vs_script: `
                attribute vec3 coordinates;
                attribute vec3 colors;
                varying vec4 vColor;
                uniform float theta;
                void main(void) {
                    gl_Position.x = coordinates.x  * sin(theta);
                    gl_Position.y = coordinates.y  * cos(theta);
                    gl_Position.z = coordinates.z;
                    gl_Position.w = 1.0;
                    vColor = vec4(colors, 1.0);
                }`,
            fs_script: `
                varying mediump vec4 vColor;
                void main(void) {
                    gl_FragColor = vColor;
                }`,
            vertices: (function(){
                    let vertices = [0, 0, 0]
                    let points = 40
                    let th = 2 * Math.PI / points
                    let r = .3
                    for(let i = 0; i <= points; i++){
                        vertices.push(r * Math.cos(th * i) + .45, r * Math.sin(th * i) - .45, 0)
                    }

                    return vertices
                })(),
            controls: {
                color: '#0000FF',
                speed: 0.005,
                theta: 0,
                direction: 1,
                primitive: gl.TRIANGLE_FAN
            }
        }
    ]

    for(let o of objects){
        o.program = WebGLHelper.initShaders(gl, o.vs_script, o.fs_script)
        gl.useProgram(o.program)
        WebGLHelper.initBuffers(gl, o.program, [
            {
                name: "coordinates",
                size: 3,
                data: o.vertices
            }
        ])

        o.program.theta = 0.0

    }

    function animate(){
        WebGLHelper.clear(gl, [1, 1, 1, 1])
        for(let o of objects){
            gl.useProgram(o.program)
            WebGLHelper.resetBuffers(gl, o.program, [
                {
                    name: "coordinates",
                    size: 3,
                    data: o.vertices
                }
            ])

            WebGLHelper.loadAttributeF(gl, o.program, 'colors', ...WebGLHelper.getColorFromHex(o.controls.color))
            o.program.theta = (o.program.theta + o.controls.speed) % (Math.PI * 2)
            WebGLHelper.loadUniformF(gl, o.program, 'theta', o.program.theta * o.controls.direction)
            gl.drawArrays(o.controls.primitive, 0, o.vertices.length / 3)
        }

        requestAnimationFrame(animate)

    }

    animate()

    let gui = new dat.GUI()
    for(let o of objects){
        let f = gui.addFolder(o.name)

        f.addColor(o.controls, 'color')
        f.add(o.controls, 'speed').min(.001).max(.1)
        f.add(o.controls, 'theta').min(0).max(2 * Math.PI)
        f.add(o.controls, 'direction', {clockwise: 1, counterclockwise: -1})
        f.add(o.controls, 'primitive', {
            points: gl.POINTS,
            lines: gl.LINES,
            line_strip: gl.LINE_STRIP,
            line_loop: gl.LINE_LOOP,
            triangles: gl.TRIANGLES,
            triangle_strip: gl.TRIANGLE_STRIP,
            triangle_fan: gl.TRIANGLE_FAN
        })

        f.open()
    }

}