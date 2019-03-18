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

    // Add a cube
    let geometry = new THREE.BoxGeometry(10, 10, 10)
    let material = new THREE.MeshBasicMaterial({ color: 0xFF00FF })
    let cube = new THREE.Mesh(geometry, material)

    // loop goes here
    for(let i = 0; i < 20; i++){
        for(let j = 0; j < 20; j++){
            let box = cube.clone()
            box.position.x = i * 15;
            box.position.z = j * 15;
            scene.add(box)
        }
    }

    
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