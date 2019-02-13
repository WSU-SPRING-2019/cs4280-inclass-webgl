import { WebGLHelper } from '../webgl_helper'
import * as dat from 'dat.gui'
import * as THREE from 'three'
class Pyramid {
    constructor(){
        this.vertices = [
            -.5, -.5, -.5,
             .5, -.5, -.5,
             .5,  .5, -.5,
            -.5,  .5, -.5,
              0,   0,   0
        ]

        this.indices = []

        this.face(0, 1, 2) 
        this.face(0, 2, 3) 
        this.face(0, 1, 4) 
        this.face(1, 2, 4) 
        this.face(2, 3, 4) 
        this.face(3, 0, 4)

        this.colors = [
            [ 1, 0, 0 ],
            [ 1, 0, 0 ],
            [ 0, 1, 0 ],
            [ 0, 0, 1 ],
            [ 1, 1, 0 ],
            [ 1, 0, 1 ]
        ]

        this.v_out = []
        for(let i of this.indices){
            this.v_out.push(
                this.vertices[3 * i],
                this.vertices[3 * i + 1],
                this.vertices[3 * i + 2]
            )
        }

        this.c_out = []
        for(let c of this.colors){
            for(let i = 0 ; i < 3; i++){
                this.c_out.push(c[0], c[1], c[2])
            }
        }
    }

    face(a, b, c){
        this.indices.push(a, b, c)
    }
}

export function displayPyramid() {
    const vs_script = `
        attribute vec3 coordinates;
        attribute vec3 colors;
        varying vec4 vColor;
        uniform mat4 transformedBy;
        void main(void) {
            gl_Position = transformedBy * vec4(coordinates, 1.0);
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

    let pyramid = new Pyramid()

    WebGLHelper.initBuffers(gl, program, [
        {
            name: 'coordinates',
            size: 3,
            data: pyramid.v_out,
        }, {
            name: 'colors',
            size: 3,
            data: pyramid.c_out
        }
    ])

    let tranformedByLoc = gl.getUniformLocation(program, 'transformedBy')

    let controls = {
        axis: 0,
        theta: 30
    }

    let theta = [0, 0, 0]

    function animate(){
        theta[controls.axis] += 2

        let t = new THREE.Matrix4().makeTranslation(-.4, .5, .1)
        let s = new THREE.Matrix4().makeScale(3, 2, 1)
        let rx = new THREE.Matrix4().makeRotationX(theta[0] * Math.PI / 180)
        let ry = new THREE.Matrix4().makeRotationY(theta[1] * Math.PI / 180)
        let rz = new THREE.Matrix4().makeRotationZ(theta[2] * Math.PI / 180)

        let ryz = new THREE.Matrix4().multiplyMatrices(ry, rz)
        let rxyz = new THREE.Matrix4().multiplyMatrices(rx, ryz)

        let m = new THREE.Matrix4().multiplyMatrices(t, new THREE.Matrix4().multiplyMatrices(rxyz, s))
        
        WebGLHelper.clear(gl, [1, 1, 1, 1])
        gl.uniformMatrix4fv(tranformedByLoc, false, m.elements)
        gl.drawArrays(gl.TRIANGLES, 0, pyramid.v_out.length / 3)

        requestAnimationFrame(animate)

    }

    animate()

    let gui = new dat.GUI()
    gui.add(controls, 'axis', {x: 0, y: 1, z: 2})
    

}
