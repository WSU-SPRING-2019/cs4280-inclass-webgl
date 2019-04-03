import * as THREE from 'three'
window.THREE = THREE
require('../physi')
Physijs.scripts.worker = '/javascripts/physijs_worker.js'
Physijs.scripts.ammo = '/javascripts/ammo.js'

function getPoints(){
    let points = []
    let r = 27, cx = 0, cy = 0
    let circleOffset = 0

    for(let i = 0; i < 1000; i += 6 + circleOffset){
        circleOffset = 4.5 * ( i / 360)

        let y = 0
        let x =  (r / 1400) * (1400 - i) * Math.cos(i * Math.PI / 180) + cx
        let z =  (r / 1400) * (1400 - i) * Math.sin(i * Math.PI / 180) + cy

        points.push(new THREE.Vector3(x, y, z))
    }

    return points;
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

    // Add board
    let board = getBoard()
    scene.add(board)

    // Add domino pieces
    let points = getPoints()
    let pieces = []
    let c = new THREE.Color(0xFFFFFF)
    for(let p of points){
        let geometry = new THREE.BoxGeometry(.6, 6, 2)
        c.setHex(Math.random() * 0xFFFFFF)
        let piece = new Physijs.BoxMesh(geometry, 
            Physijs.createMaterial(new THREE.MeshPhongMaterial({ color: c.getHex()})))
        piece.position.copy(p)
        piece.lookAt(scene.position)
        piece.__dirtyRotation = true;
        piece.position.y = 3.5
        scene.add(piece)
        pieces.push(piece)
    }

    // pieces[0].rotation.x = .2
    // pieces[0].__dirtyRotation = true
    // board.rotation.x = .2
    // board.__dirtyRotation = true

    canvas.appendChild(renderer.domElement)
    requestAnimationFrame(animate)

    let raycaster = new THREE.Raycaster()
    let mouse = new THREE.Vector2()

    canvas.addEventListener("mouseup", e => {
        let rect = e.target.getBoundingClientRect()

        // x = (2u - w) / w
        mouse.x = (2 * (e.clientX - rect.left) - rect.width) / rect.width
        // y = (h - 2v) / h
        mouse.y = (rect.height - 2 * (e.clientY - rect.top)) / rect.height

        raycaster.setFromCamera(mouse, camera)
        let intersects = raycaster.intersectObjects(scene.children)
        for(let intersect of intersects){
            let obj = intersect.object
            obj.rotation.x += .2
            obj.__dirtyRotation = true
            break
        }
    })
    function animate() {
        scene.simulate()

        renderer.render(scene, camera)
        requestAnimationFrame(animate)
    }

}