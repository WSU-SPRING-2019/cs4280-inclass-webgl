/*
 * File: webgl_helper.js 
 * Description: a helper class for the webgl programs of cs4280
 * Version: 0.0.1
 * By: Abdulmalek Al-Gahmi
 */
export class WebGLHelper {
  /**
   * Initializes WebGL
   * Returns a WebGLRenderingContext object
   */
  static initWebGL(canvas) {
    canvas.width = canvas.getClientRects()[0].width;
    canvas.height = canvas.getClientRects()[0].height;
    let ctx = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!ctx) {
      alert("Unable to initialize WebGL; your browser may not support it.");
    }

    return ctx;
  }

  /**
   * Creates and compiles a shader based on the given kind and script.
   * Return the shader object that was created
   */
  static getShader(gl, kind, script) {
    let shader = gl.createShader(kind);
    gl.shaderSource(shader, script);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw (kind == gl.VERTEX_SHADER ? "vertex" : "fragment") + " compile error: " + gl.getShaderInfoLog(shader);
    }

    return shader;
  }

  /** 
   * Creates and links a program using the given scripts.
   * Returns the program that the shaders are attached to.
   */
  static initShaders(gl, vs_script, fs_script) {
    let v_shader = WebGLHelper.getShader(gl, gl.VERTEX_SHADER, vs_script);
    let f_shader = WebGLHelper.getShader(gl, gl.FRAGMENT_SHADER, fs_script);

    let program = gl.createProgram();
    gl.attachShader(program, v_shader);
    gl.attachShader(program, f_shader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw ("Linking error: " + gl.getProgramInfoLog(program));
    }

    return program;
  }

  /** 
   * Initializes and enables one or more buffers for the given 
   * attributes data which is expected to be of the following form:
   * 
   *  data[{
   *    name: "attribute_name",
   *    size: 3,
   *    data: vertices array or number of vertices to reserve memory 
   *          for or undefined if buffer was defined in a previous element,
   *    indices: indicies array to use with drawElements.
   *    stride: how many floats in per vertex data,
   *    offset: at what index within the per vertex 
   *            data the item's portion of data starts
   *  }]
   * 
   * Returns an array of buffers one for each attribute
   */
  static initBuffers(gl, program, data) {
    let buffers = {}
    let fSize = Float32Array.BYTES_PER_ELEMENT;
    data.forEach(function (item) {
      if (item.data !== undefined) {
        // Create the buffer
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        buffers[item.name] = buffer;

        if (typeof (item.data) !== 'number') {
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(item.data), gl.STATIC_DRAW);
        } else {
          gl.bufferData(gl.ARRAY_BUFFER, fSize * item.size * item.data, gl.STATIC_DRAW);
        }

        if (item.indices !== undefined) {
          var indexBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(item.indices), gl.STATIC_DRAW);
        }
      }

      // Get the location of and enable the attribute
      let attribute = gl.getAttribLocation(program, item.name);
      let stride = fSize * (item.stride || 0);
      let offset = fSize * (item.offset || 0);
      gl.vertexAttribPointer(attribute, item.size, gl.FLOAT, false, stride, offset);
      gl.enableVertexAttribArray(attribute);
    });

    program["buffers"] = buffers;

    return buffers;
  }

  /**
   * Reset array buffers initially created by initBuffers() and and resend their data.
   * 
   *  data = [{
   *    name: "attribute_name",
   *    size: 3,
   *    data: vertices array or number of vertices to reserve memory 
   *          for or undefined if buffer was defined in a previous element,
   *    indices: indicies array to use with drawElements.
   *    stride: how many floats in per vertex data,
   *    offset: at what index within the per vertex 
   *            data the item's portion of data starts
   *  }]
   * 
   */
  static resetBuffers(gl, program, data) {
    let fSize = Float32Array.BYTES_PER_ELEMENT;
    data.forEach(function (item) {
      if (item.data !== undefined) {
        gl.bindBuffer(gl.ARRAY_BUFFER, program.buffers[item.name]);

        if (typeof (item.data) !== 'number') {
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(item.data), gl.STATIC_DRAW);
        } else {
          gl.bufferData(gl.ARRAY_BUFFER, fSize * item.size * item.data, gl.STATIC_DRAW);
        }

        if (item.indices !== undefined) {
          let indexBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(item.indices), gl.STATIC_DRAW);
        }
      }

      // Get the location of and enable the attribute
      let attribute = gl.getAttribLocation(program, item.name);
      let stride = fSize * (item.stride || 0);
      let offset = fSize * (item.offset || 0);
      gl.vertexAttribPointer(attribute, item.size, gl.FLOAT, false, stride, offset);
      gl.enableVertexAttribArray(attribute);
    });
  }

  /**
   * Clears the canvas and sets the background color.
   */
  static clear(gl, color) {
    gl.clearColor(...color);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  /**
   * Calculates a floating-point color from a given hexadecimal color.
   * Returns a webgl color.
   */
  static getColorFromHex(hexStr) {
    let hex = parseInt(hexStr.charAt(0) == "#" ? hexStr.substring(1) : hexStr, 16)
    let r = hex >> 16;
    let g = hex >> 8 & 0xFF;
    let b = hex & 0xFF;
    return [r / 255, g / 255, b / 255];
  }

  /**
   * Converts from screen coordinates to webgl coordinates.
   */
  static toWebGLCoordinates(e){
    let rect = e.target.getBoundingClientRect();
    // x = (2u - w) / w
    let x = (2 * (e.clientX - rect.left) - rect.width) / rect.width;
    // y = (h - 2v) / h
    let y = (rect.height - 2 * (e.clientY - rect.top)) / rect.height;

    return [x, y];
  }
}