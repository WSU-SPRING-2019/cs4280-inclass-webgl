export function displayBg(){
    let canvas = document.querySelector("#webgl-scene")
    let gl = canvas.getContext("webgl")

    if(!gl){
        alert("Unable to intialize webgl; your browser may not support it.")
    }

    // Clear the canvas
    gl.clearColor(1.0, .5, .3, 1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}