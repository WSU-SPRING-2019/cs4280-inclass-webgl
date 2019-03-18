import * as THREE from 'three'
import * as dat from 'dat.gui'
import {data256} from './honolulu'

function sombrero(R, C){
    let data = []
    let x0 = -2, z0 = -2, dx = 4 / R, dz = 4 / C
    for(let i = 0; i < R; i++){
        let x = x0 + dx * i
        for(let j = 0; j < C; j++){
            let z = z0 + dz * j
            let r = Math.sqrt(x * x + z * z)
            let y = Math.sin(Math.PI * r) / (Math.PI * r) * 300
            data.push(y)
        }
    }

    return data
}

function sphere(R, C){
    let data = []
    let r = 200
    let theta_arc = 2 * Math.PI / R
    let phi_arc = 2 * Math.PI / C

    for(let i = 0; i < R; i++){
        for(let j = 0; j < C; j++){
            data.push([
                r * Math.sin(theta_arc * i) * Math.cos(j * phi_arc),
                r * Math.cos(theta_arc * i),
                r * Math.sin(theta_arc * i) * Math.sin(j * phi_arc)
            ])
        }
    }

    return data
}

function loadMeshGeometry(geometry, data, R, C){
    let x0 = 0, y0 = 0, z0 = 0
    let dx = 2, dz = 2
    let yscale = .4
    for(let i = 0; i < R; i++){
        for(let j = 0; j < C; j++){
            if(typeof(data[i]) === 'object'){
                geometry.vertices.push(new THREE.Vector3(
                    data[i * R + j][0],
                    data[i * R + j][1],
                    data[i * R + j][2]
                ))
            }else {
                geometry.vertices.push(new THREE.Vector3(
                    x0 + i * dx,
                    y0 + data[i * R + j] * yscale,
                    z0 + j * dz
                ))
            }
        }
    }

    for(let i = 0; i < R - 1; i++){
        for(let j = 0; j < C - 1; j++){
            geometry.faces.push(new THREE.Face3(
                i * R + j,
                i * R + j + 1,
                (i + 1) * R + j + 1
            ))

            geometry.faces.push(new THREE.Face3(
                i * R + j,
                (i + 1) * R + j + 1,
                (i + 1) * R + j
            ))
        }
    }

}
export function displayScene(){
    let canvas = document.querySelector("#webgl-scene")
    let scene = new THREE.Scene()
    let renderer = new THREE.WebGLRenderer()
    let camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, .1, 1000)

    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setClearColor(0xEEEEEE)

    // Display x, y, z axes
    let axes = new THREE.AxesHelper(100)
    scene.add(axes)

    // Add a 
    let geometry = new THREE.Geometry()
    //loadMeshGeometry(geometry, data256, 256, 256)
    loadMeshGeometry(geometry, sombrero(64, 64), 64, 64)
    //loadMeshGeometry(geometry, sphere(64, 64), 64, 64)
    geometry.computeFaceNormals()
    let material = new THREE.MeshNormalMaterial({
        color: 0x0000FF
    })

    let mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    
    
    canvas.appendChild(renderer.domElement)

    let controls = {
        radius: 400,
        theta: 1, 
        phi: 1
    }

    function animate(){
        camera.position.x = controls.radius * Math.sin(controls.theta) * Math.cos(controls.phi)
        camera.position.y = controls.radius * Math.cos(controls.theta)
        camera.position.z = controls.radius * Math.sin(controls.theta) * Math.sin(controls.phi)

        camera.lookAt(scene.position)
        renderer.render(scene, camera)
    }

    animate();

    let gui = new dat.GUI()
    let f = gui.addFolder("Camera")
    f.add(controls, 'radius').min(50).max(900).onChange(animate)
    f.add(controls, 'theta').min(-1 * Math.PI).max(Math.PI).onChange(animate)
    f.add(controls, 'phi').min(-1 * Math.PI).max(Math.PI).onChange(animate)
    f.open()


}