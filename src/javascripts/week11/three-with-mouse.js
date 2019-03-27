import * as THREE from 'three'
window.THREE = THREE
let OrbitControls = require("threejs-controls/OrbitControls")
import * as dat from 'dat.gui'

export function displayScene() {
    let canvas = document.querySelector("#webgl-scene")
    let scene = new THREE.Scene()
    let renderer = new THREE.WebGLRenderer()
    let camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, .1, 1000)

    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setClearColor(0xEEEEEE)

    // Display x, y, z axes
    let axes = new THREE.AxesHelper(100)
    scene.add(axes)

    // Loading Textures
    let texLoader = new THREE.TextureLoader()
    let textures = {
        crate: texLoader.load("./images/crate0.png", function () {
            renderer.render(scene, camera)
        }),
        crate_bump: texLoader.load("./images/crate0_bump.png", function () {
            renderer.render(scene, camera)
        }),
        crate_normal: texLoader.load("./images/crate0_normal.png", function () {
            renderer.render(scene, camera)
        }),
        earth: texLoader.load("./images/earth.jpg", function () {
            renderer.render(scene, camera)
        }),
        wall: texLoader.load("./images/stone.jpg", function (texture) {
            texture.wrapS = THREE.RepeatWrapping
            texture.wrapT = THREE.RepeatWrapping
            texture.repeat.set(3, 1)
            renderer.render(scene, camera)
        }),
        floor: texLoader.load("./images/floor.jpg", function () {
            renderer.render(scene, camera)
        })
    }
    let controls = {
        radius: 400,
        theta: 1,
        phi: 1,
        ambient: false,
        directional: false,
        point: false,
        spotLight: false,
        material: 'Basic',
        intensity: 1,
        spotLight_target: "Cube",
        enable_shadows: false,
        enable_bump_map: false,
        bump_scale: .2,
        enable_normal_map: false
    }

    // Add a plane
    let geometry = new THREE.PlaneGeometry(500, 300)
    let plane = new THREE.Mesh(geometry)
    plane.materialParams = { side: THREE.DoubleSide }
    plane.rotateX(Math.PI / 2)
    plane.receiveShadow = true
    plane.name = 'floor'
    scene.add(plane)


    // Add a cube
    geometry = new THREE.BoxGeometry(100, 100, 100)
    let cube = new THREE.Mesh(geometry)
    cube.materialParams = {}
    cube.position.set(-200, 50, -100)
    cube.name = 'crate'
    cube.castShadow = true
    scene.add(cube)

    // Add a wall
    geometry = new THREE.BoxGeometry(500, 100, 5)
    let wall = new THREE.Mesh(geometry)
    wall.materialParams = {}
    wall.position.set(0, 50, 150)
    wall.name = 'wall'
    wall.castShadow = true
    scene.add(wall)

    // Add sphere
    geometry = new THREE.SphereGeometry(50, 40, 40)
    let sphere = new THREE.Mesh(geometry)
    sphere.materialParams = {}
    sphere.position.set(200, 70, -50)
    sphere.name = 'earth'
    sphere.castShadow = true
    scene.add(sphere)

    // Add a torus
    geometry = new THREE.TorusGeometry(50, 20, 50, 50)
    let tube = new THREE.Mesh(geometry)
    tube.materialParams = {}
    tube.position.y = 20
    tube.rotateX(Math.PI / 2)
    tube.castShadow = true
    scene.add(tube)


    // Light sources
    // Ambient Light
    let ambientLight = new THREE.AmbientLight(0x333333)


    let directionalLight = new THREE.DirectionalLight(0x777777)


    let pointLight = new THREE.PointLight(0x888888)
    pointLight.position.set(0, 100, 0)
    pointLight.castShadow = true

    let spotLight = new THREE.SpotLight(0x999999)
    spotLight.position.set(0, 100, 0)
    spotLight.castShadow = true

    canvas.appendChild(renderer.domElement)


    let cameraConrols = new OrbitControls(camera, renderer.domElement)
    cameraConrols.addEventListener("change", function(){
        renderer.render(scene, camera)
    })
    
    camera.position.x = controls.radius * Math.sin(controls.theta) * Math.cos(controls.phi)
    camera.position.y = controls.radius * Math.cos(controls.theta)
    camera.position.z = controls.radius * Math.sin(controls.theta) * Math.sin(controls.phi)

    function animate() {
        renderer.shadowMapEnabled = controls.enable_shadows

        for (let obj of scene.children) {
            if (controls.material === "Lambert") {
                if (obj.materialParams !== undefined) {
                    obj.material = new THREE.MeshLambertMaterial(obj.materialParams)
                }
            } else if (controls.material === "Phong") {

                if (obj.materialParams !== undefined) {
                    obj.material = new THREE.MeshPhongMaterial(obj.materialParams)
                }

            } else if (controls.material === "Standard") {
                if (obj.materialParams !== undefined) {
                    obj.material = new THREE.MeshStandardMaterial(obj.materialParams)
                }
            } else {
                if (obj.materialParams !== undefined) {
                    obj.material = new THREE.MeshBasicMaterial(obj.materialParams)
                }
            }

            if (textures[obj.name]) {
                obj.material.map = textures[obj.name]

                if(obj.name === "crate"){
                    if(controls.enable_bump_map){
                        obj.material.bumpMap = textures['crate_bump']
                        obj.material.bumpScale = controls.bump_scale
                    }else{
                        obj.material.bumpMap = null
                    }

                    if(controls.enable_normal_map){
                        obj.material.normalMap = textures['crate_normal']
                    }else{
                        obj.material.normalMap = null
                    }
                }
            }
        }


        if (controls.ambient) {
            ambientLight.intensity = controls.intensity
            scene.add(ambientLight)
        } else {
            scene.remove(ambientLight)
        }

        if (controls.directional) {
            directionalLight.intensity = controls.intensity
            scene.add(directionalLight)
        } else {
            scene.remove(directionalLight)
        }

        if (controls.point) {
            pointLight.intensity = controls.intensity
            scene.add(pointLight)
        } else {
            scene.remove(pointLight)
        }

        if (controls.spotLight) {
            spotLight.intensity = controls.intensity
            if (controls.spotLight_target === "Tube") {
                spotLight.target = tube
            } else if (controls.spotLight_target === "Sphere") {
                spotLight.target = sphere
            } else {
                spotLight.target = cube
            }

            scene.add(spotLight)
        } else {
            scene.remove(spotLight)
        }

        //requestAnimationFrame(animate)
        camera.lookAt(scene.position)
        renderer.render(scene, camera)
        cameraConrols.update()
    }

    animate();

    let gui = new dat.GUI()
    let f = gui.addFolder("Camera")
    f.add(controls, 'radius').min(50).max(900).onChange(animate)
    f.add(controls, 'theta').min(-1 * Math.PI).max(Math.PI).onChange(animate)
    f.add(controls, 'phi').min(-1 * Math.PI).max(Math.PI).onChange(animate)
    //f.open()

    f = gui.addFolder("Material")
    f.add(controls, 'material', ["Basic", "Lambert", "Phong", "Standard"]).onChange(animate)
    //f.open()

    f = gui.addFolder("Light sources")
    f.add(controls, 'ambient').onChange(animate)
    f.add(controls, 'directional').onChange(animate)
    f.add(controls, 'point').onChange(animate)
    f.add(controls, 'spotLight').onChange(animate)
    f.add(controls, 'intensity').min(0).max(10).onChange(animate)
    f.add(controls, 'spotLight_target', ["Cube", "Tube", "Sphere"]).onChange(animate)
    f.add(controls, "enable_shadows").onChange(animate)
    f.add(controls, "enable_bump_map").onChange(animate)
    f.add(controls, 'bump_scale').min(0).max(1).step(.1).onChange(animate)
    f.add(controls, "enable_normal_map").onChange(animate)
    //f.open()

}