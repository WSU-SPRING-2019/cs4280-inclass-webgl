import * as THREE from 'three'
window.THREE = THREE
require('../physi')
Physijs.scripts.worker = '/javascripts/physijs_worker.js'
Physijs.scripts.ammo = '/javascripts/ammo.js'

function getPoints(){

}

function getBoard(){
    let material = new Physijs.createMaterial(
        new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load('./images/floor.jpg')
        }), .9, .1
    )

    let floor = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 1, 60), material, 0)
    let left = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 3, 60), material, 0)
    left.position.x = -31
    left.position.y = 2
    floor.add(left)

    let right = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 3, 60), material, 0)
    right.position.x = 31
    right.position.y = 2
    floor.add(right)

    let top = new Physijs.BoxMesh(new THREE.BoxGeometry(64, 3, 2), material, 0)
    top.position.z = -30
    top.position.y = 2
    floor.add(top)

    let bottom = new Physijs.BoxMesh(new THREE.BoxGeometry(64, 3, 2), material, 0)
    bottom.position.z = 30
    bottom.position.y = 2
    floor.add(bottom)

    return floor
}

export function displayScene() {
    let canvas = document.querySelector("#webgl-scene")
    let renderer = new THREE.WebGLRenderer()
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setClearColor(0xEEEEEE)

    let scene = new Physijs.Scene()
    scene.setGravity(new THREE.Vector3(0, -50, 0))

    let camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, .1, 1000)
    camera.position.set(50, 30, 50)
    camera.lookAt(scene.position)
    scene.add(camera)

    let spotLight = new THREE.SpotLight(0xFFFFFF)
    spotLight.position.set(20, 100, 50)
    scene.add(spotLight)

    let ball = new Physijs.BoxMesh(
        new THREE.SphereGeometry(4, 40, 40),
        Physijs.createMaterial(new THREE.MeshPhongMaterial({color: 0xAAAAAA}), .1, .9)
    )

    scene.add(ball)
    scene.add(getBoard())

    canvas.appendChild(renderer.domElement)
    requestAnimationFrame(animate)

    function animate() {
        scene.simulate()

        renderer.render(scene, camera)
        requestAnimationFrame(animate)
    }

}