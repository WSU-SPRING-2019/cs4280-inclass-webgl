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
        spotLight_target: "Cube"
    }

    // Add a plane
    let geometry = new THREE.PlaneGeometry(500, 300)
    let plane = new THREE.Mesh(geometry)
    plane.materialParams = { color: 0x777777, side: THREE.DoubleSide }
    plane.rotateX(Math.PI / 2)
    scene.add(plane)


    // Add a cube
    geometry = new THREE.BoxGeometry(40, 40, 40)
    let cube = new THREE.Mesh(geometry)
    cube.materialParams = { color: 0x00FF00 }
    cube.position.set(-100, 40, 100)
    scene.add(cube)

    // Add sphere
    geometry = new THREE.SphereGeometry(30, 40, 40)
    let sphere = new THREE.Mesh(geometry)
    sphere.materialParams = { color: 0xFF0000 }
    sphere.position.set(100, 50, 60)
    scene.add(sphere)

    // Add a torus
    geometry = new THREE.TorusGeometry(50, 20, 50, 50)
    let tube = new THREE.Mesh(geometry)
    tube.materialParams = { color: 0x0000FF }
    tube.position.y = 20
    tube.rotateX(Math.PI / 2)
    scene.add(tube)


    // Light sources
    // Ambient Light
    let ambientLight = new THREE.AmbientLight(0x333333)


    let directionalLight = new THREE.DirectionalLight(0x777777)


    let pointLight = new THREE.PointLight(0x888888)
    pointLight.position.set(0, 100, 0)

    let spotLight = new THREE.SpotLight(0x999999)
    spotLight.position.set(0, 100, 0)

    canvas.appendChild(renderer.domElement)



    function animate(){
        if(controls.material === "Lambert"){
            for(let obj of scene.children){
                if(obj.materialParams !== undefined){
                    obj.material = new THREE.MeshLambertMaterial(obj.materialParams)
                }
            }
        }else if(controls.material === "Phong"){
            for(let obj of scene.children){
                if(obj.materialParams !== undefined){
                    obj.material = new THREE.MeshPhongMaterial(obj.materialParams)
                }
            } 
        }else {
            for(let obj of scene.children){
                if(obj.materialParams !== undefined){
                    obj.material = new THREE.MeshBasicMaterial(obj.materialParams)
                }
            }
        }

        if(controls.ambient){
            ambientLight.intensity = controls.intensity
            scene.add(ambientLight)
        }else{
            scene.remove(ambientLight)
        }

        if(controls.directional){
            directionalLight.intensity = controls.intensity
            scene.add(directionalLight)
        }else{
            scene.remove(directionalLight)
        }

        if(controls.point){
            pointLight.intensity = controls.intensity
            scene.add(pointLight)
        }else{
            scene.remove(pointLight)
        }

        if(controls.spotLight){
            spotLight.intensity = controls.intensity
            if(controls.spotLight_target === "Tube"){
                spotLight.target = tube
            }else if(controls.spotLight_target === "Sphere"){
                spotLight.target = sphere
            }else{
                spotLight.target = cube
            }

            scene.add(spotLight)
        }else{
            scene.remove(spotLight)
        }

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

    f = gui.addFolder("Material")
    f.add(controls, 'material', ["Basic", "Lambert", "Phong"]).onChange(animate)
    f.open()

    f = gui.addFolder("Light sources")
    f.add(controls, 'ambient').onChange(animate)
    f.add(controls, 'directional').onChange(animate)
    f.add(controls, 'point').onChange(animate)
    f.add(controls, 'spotLight').onChange(animate)
    f.add(controls, 'intensity').min(0).max(10).onChange(animate)
    f.add(controls, 'spotLight_target', ["Cube", "Tube", "Sphere"]).onChange(animate)
    f.open()

}