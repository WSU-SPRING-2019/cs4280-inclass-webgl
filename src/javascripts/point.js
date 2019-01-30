export function displayPoint(vs_script, fs_script){
    let canvas = document.querySelector("#webgl-scene")
    canvas.width = canvas.getClientRects()[0].width;
    canvas.height = canvas.getClientRects()[0].height;
    let gl = canvas.getContext("webgl")

    if(!gl){
        alert("Unable to intialize webgl; your browser may not support it.")
    }

    let v_shader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(v_shader, vs_script)
    gl.compileShader(v_shader)

    let f_shader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(f_shader, fs_script)
    gl.compileShader(f_shader)

    let program = gl.createProgram()
    gl.attachShader(program, v_shader)
    gl.attachShader(program, f_shader)
    gl.linkProgram(program)

    gl.useProgram(program)


    // Sending coordinates to GPU
    let coordinates = gl.getAttribLocation(program, "coordinates")
    gl.vertexAttrib3f(coordinates, .0, .0, .0)


    // Clear the canvas
    gl.clearColor(1.0, 1.0, 1.0, 1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)


    gl.drawArrays(gl.POINTS, 0, 1)
}