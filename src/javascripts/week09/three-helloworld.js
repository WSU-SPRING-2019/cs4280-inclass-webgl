import * as THREE from 'three'
import * as dat from 'dat.gui'

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

    // Add a few points
    let geometry = new THREE.Geometry()
    geometry.vertices.push(
        new THREE.Vector3(0, 10, -10), 
        new THREE.Vector3(20, 40, -30)
    )
    let material = new THREE.PointsMaterial({
        size: 3,
        color: 0xFF0000
    })
    scene.add(new THREE.Points(geometry, material))

    // Add a line
    geometry = new THREE.Geometry()
    geometry.vertices.push(
        new THREE.Vector3(50, -10, 15), 
        new THREE.Vector3(3, 40, 30),
        new THREE.Vector3(10, 10, 10)
    )
    material = new THREE.LineBasicMaterial({
        color: 0x001101
    })
    scene.add(new THREE.Line(geometry, material))

    // Add a triangle
    geometry = new THREE.Geometry()
    geometry.vertices.push(
        new THREE.Vector3(40, 20, 0), 
        new THREE.Vector3(30, 40, 0),
        new THREE.Vector3(20, 20, 0)
    )
    geometry.faces.push(new THREE.Face3(0, 1, 2))
    
    material = new THREE.MeshBasicMaterial({
        color: 0xFFFF00
    })
    let mesh = new THREE.Mesh(geometry, material)
    mesh.drawMode = THREE.TrianglesDrawMode
    scene.add(mesh)


    camera.position.x = 100
    camera.position.y = 100
    camera.position.z = 100

    camera.lookAt(scene.position)

    canvas.appendChild(renderer.domElement)
    renderer.render(scene, camera)


}