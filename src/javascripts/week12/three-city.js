import * as THREE from 'three'
window.THREE = THREE
import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader'
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

    // Load city
    let mtlLoader = new MTLLoader()
    let objLoader = new OBJLoader()
    let city = null
    mtlLoader.load("./assets/city.mtl", function(material){
        material.preload()
        objLoader.setMaterials(material)
        objLoader.load("./assets/city.obj", function(object){
            for(let o of object.children){
                let c = new THREE.Color(0xFFFFFF)
                c.setHex(Math.random() * 0xFFFFFF)
                o.material = new THREE.MeshLambertMaterial({
                    color: c
                })
            }

            city = object
            scene.add(object)

            renderer.render(scene, camera)
        })

    })
    
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

    



   

    

    


    // Light sources
    // Ambient Light
    let ambientLight = new THREE.AmbientLight(0x333333)
    scene.add(ambientLight)

    let directionalLight = new THREE.DirectionalLight(0x777777)
    scene.add(directionalLight)

    let pointLight = new THREE.PointLight(0x888888)
    pointLight.position.set(0, 100, 0)
    pointLight.castShadow = true
    scene.add(pointLight)

    let spotLight = new THREE.SpotLight(0x999999)
    spotLight.position.set(0, 100, 0)
    spotLight.castShadow = true
    scene.add(spotLight)

    canvas.appendChild(renderer.domElement)


    let cameraConrols = new OrbitControls(camera, renderer.domElement)
    cameraConrols.addEventListener("change", function(){
        renderer.render(scene, camera)
    })
    
    camera.position.x = controls.radius * Math.sin(controls.theta) * Math.cos(controls.phi)
    camera.position.y = controls.radius * Math.cos(controls.theta)
    camera.position.z = controls.radius * Math.sin(controls.theta) * Math.sin(controls.phi)

    let raycaster = new THREE.Raycaster()
    let mouse = new THREE.Vector2()     

    canvas.addEventListener("mouseup", e => {
        let rect = e.target.getBoundingClientRect()

        // x = (2u - w) / w
        mouse.x = (2 * (e.clientX - rect.left) - rect.width) / rect.width
        // y = (h - 2v) / h
        mouse.y = (rect.height - 2 * (e.clientY - rect.top)) / rect.height

        raycaster.setFromCamera(mouse, camera)
        let intersects = raycaster.intersectObjects(city.children)
        for(let intersect of intersects){
            let obj = intersect.object
            city.remove(obj)
        }

        renderer.render(scene, camera)
    })

    window.onkeyup = function(e){
        let t = cameraConrols.target
        console.log(e.key)
        console.log(e.keyCode)
        switch(e.keyCode){
            case 40: // down
            break;
            case 38: //up
            break;
            case 39: // right
            t.position.set(t.x - 5, t.y, t.z)
            break
            case 37: // left
            t.position.set(t.x + 5, t.y, t.z)
            break

        }
        renderer.render(scene, camera)

    }
    function animate() {

        camera.lookAt(scene.position)
        renderer.render(scene, camera)
        cameraConrols.update()
    }

    animate();

    // let gui = new dat.GUI()
    // let f = gui.addFolder("Camera")
    // f.add(controls, 'radius').min(50).max(900).onChange(animate)
    // f.add(controls, 'theta').min(-1 * Math.PI).max(Math.PI).onChange(animate)
    // f.add(controls, 'phi').min(-1 * Math.PI).max(Math.PI).onChange(animate)
    // //f.open()

    // f = gui.addFolder("Material")
    // f.add(controls, 'material', ["Basic", "Lambert", "Phong", "Standard"]).onChange(animate)
    // //f.open()

    // f = gui.addFolder("Light sources")
    // f.add(controls, 'ambient').onChange(animate)
    // f.add(controls, 'directional').onChange(animate)
    // f.add(controls, 'point').onChange(animate)
    // f.add(controls, 'spotLight').onChange(animate)
    // f.add(controls, 'intensity').min(0).max(10).onChange(animate)
    // f.add(controls, 'spotLight_target', ["Cube", "Tube", "Sphere"]).onChange(animate)
    // f.add(controls, "enable_shadows").onChange(animate)
    // f.add(controls, "enable_bump_map").onChange(animate)
    // f.add(controls, 'bump_scale').min(0).max(1).step(.1).onChange(animate)
    // f.add(controls, "enable_normal_map").onChange(animate)
    //f.open()

}