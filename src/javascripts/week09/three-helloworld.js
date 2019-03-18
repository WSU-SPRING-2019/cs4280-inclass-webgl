import * as THREE from 'three'
import * as dat from 'dat.gui'
import { METHODS } from 'http';

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


    // Add plane
    geometry = new THREE.PlaneGeometry(200, 70, 20, 20)
    material = new THREE.MeshBasicMaterial({ color: 0x00FFFF, wireframe: true })
    mesh = new THREE.Mesh(geometry, material)
    mesh.rotateX(Math.PI / 2)
    scene.add(mesh)

    // Add a cube
    geometry = new THREE.BoxGeometry(30, 30, 30)
    material = new THREE.MeshNormalMaterial({ color: 0xFF00FF })
    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    let box = mesh.clone()
    box.translateZ(40)
    scene.add(box)


    // Add sphere
    geometry = new THREE.SphereGeometry(20, 40, 40)
    material = new THREE.MeshNormalMaterial({ color: 0xFF77FF, wireframe: true })
    mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = 30;
    mesh.position.y = 30;
    mesh.position.z = 30;

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