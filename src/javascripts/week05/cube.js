import { WebGLHelper } from '../webgl_helper'
import * as dat from 'dat.gui'
export function displayCube() {
    let canvas = document.querySelector("#webgl-scene")
    let gl = WebGLHelper.initWebGL(canvas)

}
