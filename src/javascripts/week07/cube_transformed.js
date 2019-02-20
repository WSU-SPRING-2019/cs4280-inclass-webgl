import { WebGLHelper } from '../webgl_helper'
import * as dat from 'dat.gui'
import * as THREE from 'three'
import { Cube } from './cube'

function getTRSTransformation(controls){
    let rx = new THREE.Matrix4().makeRotationX(controls.r_x * Math.PI / 180)
    let ry = new THREE.Matrix4().makeRotationY(controls.r_y * Math.PI / 180)
    let rz = new THREE.Matrix4().makeRotationZ(controls.r_z * Math.PI / 180)
    let ryz = new THREE.Matrix4().multiplyMatrices(ry, rz)
    let r = new THREE.Matrix4().multiplyMatrices(rx, ryz)

    let t = new THREE.Matrix4().makeTranslation(controls.t_x, controls.t_y, controls.t_z)
    let s = new THREE.Matrix4().makeScale(controls.s_x, controls.s_y, controls.s_z)

    return new THREE.Matrix4().multiplyMatrices(t, new THREE.Matrix4().multiplyMatrices(r, s))
}

function getEulerTransformation(controls){
    let e = new THREE.Euler(controls.r_x * Math.PI / 180, controls.r_y * Math.PI / 180, controls.r_z * Math.PI / 180)
    let r = new THREE.Matrix4().makeRotationFromEuler(e)
    let t = new THREE.Matrix4().makeTranslation(controls.t_x, controls.t_y, controls.t_z)
    let s = new THREE.Matrix4().makeScale(controls.s_x, controls.s_y, controls.s_z)

    return new THREE.Matrix4().multiplyMatrices(t, new THREE.Matrix4().multiplyMatrices(r, s))
}

function getQuaternionEulerTransformation(controls){
    let e = new THREE.Euler(controls.r_x * Math.PI / 180, controls.r_y * Math.PI / 180, controls.r_z * Math.PI / 180)
    let q = new THREE.Quaternion().setFromEuler(e)
    let r = new THREE.Matrix4().makeRotationFromQuaternion(q)
    let t = new THREE.Matrix4().makeTranslation(controls.t_x, controls.t_y, controls.t_z)
    let s = new THREE.Matrix4().makeScale(controls.s_x, controls.s_y, controls.s_z)

    return new THREE.Matrix4().multiplyMatrices(t, new THREE.Matrix4().multiplyMatrices(r, s))
}

function getQuaternionTransformation(controls){
    let q = new THREE.Quaternion(controls.q_x, controls.q_y, controls.q_z, controls.q_w)
    let r = new THREE.Matrix4().makeRotationFromQuaternion(q)
    //let t = new THREE.Matrix4().makeTranslation(controls.t_x, controls.t_y, controls.t_z)
    //let s = new THREE.Matrix4().makeScale(controls.s_x, controls.s_y, controls.s_z)
    return r
    //return new THREE.Matrix4().multiplyMatrices(t, new THREE.Matrix4().multiplyMatrices(r, s))
}

function getFPRTransformation(controls){

    let t1 = new THREE.Matrix4().makeTranslation(-controls.p_x, -controls.p_y, -controls.p_z)
    let rz = new THREE.Matrix4().makeRotationZ(controls.r_z * Math.PI / 180)
    let t2 = new THREE.Matrix4().makeTranslation(controls.p_x, controls.p_y, controls.p_z)

    return new THREE.Matrix4().multiplyMatrices(t2, new THREE.Matrix4().multiplyMatrices(rz, t1))
}
export function displayCube() {
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

    let cube = new Cube()

    WebGLHelper.initBuffers(gl, program, [
        {
            name: 'coordinates',
            size: 3,
            data: cube.v_out,
        }, {
            name: 'colors',
            size: 3,
            data: cube.c_out
        }
    ])

    let tranformedByLoc = gl.getUniformLocation(program, 'transformedBy')

    let controls = {
        t_x: 0,
        t_y: 0,
        t_z: 0,
        r_x: 0,
        r_y: 0,
        r_z: 0,
        s_x: 1,
        s_y: 1,
        s_z: 1,
        p_x: 0,
        p_y: 0,
        p_z: 0,
        q_x: 0,
        q_y: 0,
        q_z: 0,
        q_w: 0
    }

    function animate(){

        WebGLHelper.clear(gl, [1, 1, 1, 1])
        gl.uniformMatrix4fv(tranformedByLoc, false, getQuaternionEulerTransformation(controls).elements)
        gl.drawArrays(gl.TRIANGLES, 0, cube.v_out.length / 3)

        gl.uniformMatrix4fv(tranformedByLoc, false, getQuaternionTransformation(controls).elements)
        gl.drawArrays(gl.TRIANGLES, 0, cube.v_out.length / 3)

        //requestAnimationFrame(animate)

    }

    animate()

    let gui = new dat.GUI()
    let f = gui.addFolder("Translation")
    f.add(controls, 't_x').min(-1).max(1).onChange(animate)
    f.add(controls, 't_y').min(-1).max(1).onChange(animate)
    f.add(controls, 't_z').min(-1).max(1).onChange(animate)
    f.open()

    f = gui.addFolder("Rotation")
    f.add(controls, 'r_x').min(0).max(360).onChange(animate)
    f.add(controls, 'r_y').min(0).max(360).onChange(animate)
    f.add(controls, 'r_z').min(0).max(360).onChange(animate)
    f.open()

    f = gui.addFolder("Scaling")
    f.add(controls, 's_x').min(-2).max(2).onChange(animate)
    f.add(controls, 's_y').min(-2).max(2).onChange(animate)
    f.add(controls, 's_z').min(-2).max(2).onChange(animate)
    f.open()

    f = gui.addFolder("Fixed point rotation")
    f.add(controls, 'p_x').min(-1).max(1).onChange(animate)
    f.add(controls, 'p_y').min(-1).max(1).onChange(animate)
    f.add(controls, 'p_z').min(-1).max(1).onChange(animate)
    f.add(controls, 'r_z').min(0).max(360).onChange(animate)
    f.open()

    f = gui.addFolder("Quarernion rotation")
    f.add(controls, 'q_x').min(-1).max(1).onChange(animate)
    f.add(controls, 'q_y').min(-1).max(1).onChange(animate)
    f.add(controls, 'q_z').min(-1).max(1).onChange(animate)
    f.add(controls, 'q_w').min(-1).max(1).onChange(animate)
    f.open()

}
