// HTML and data files
require.context('../', true, /\.(html|json|txt|dat)$/i)

// Images and fonts
require.context('../images/', true, /\.(gif|jpg|png|svg|eot|ttf|woff|woff2)$/i)

// SCSS files
import "../stylesheets/application.scss"

// Shaders
import vs_script from "../shaders/vertex.glsl"
import fs_script from "../shaders/fragment.glsl"

// JavaScript
// import { displayBg } from './bg'
// displayBg();

import { displayScene } from './week12/three-city'
displayScene()
