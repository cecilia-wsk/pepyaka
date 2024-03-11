import '../css/style.css';
import * as THREE from 'three'; 
import * as dat from 'dat.gui'; 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import vertex from './shader/vertex.glsl'; 
import fragment from './shader/fragment.glsl'; 
import vertexParticles from './shader/vertexParticles.glsl'; 
import fragmentParticles from './shader/fragmentParticles.glsl'; 

// canvas
const canvas = document.querySelector('canvas.webgl')
// scene
const scene = new THREE.Scene()
// sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
// mouse
const mouse = new THREE.Vector2(0,0);

/**
 * Renderer
 */
 const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
})

// ==================
// main geometry
// ==================

const geometry = new THREE.SphereGeometry(1, 462, 462)

const material = new THREE.ShaderMaterial({ 
    uniforms: {
        uTime: { value: 0 }
    },
    vertexShader: vertex,
    fragmentShader: fragment,
    // transparent: true,
    side: THREE.DoubleSide,
})

const mesh = new THREE.Mesh(geometry, material) 
scene.add(mesh)

// ==================
// particles
// ==================

let N = 60000;
let positions = new Float32Array(N*3);
let pointsGeometry = new THREE.BufferGeometry();

let inc = Math.PI*(3 - Math.sqrt(5));
let offset = 2/N; 
let rad = 1.6;

for (let i = 0; i < N; i++) {
    let y = i * offset - 1 + (offset / 2);
    let r = Math.sqrt(1 - y*y);
    let phi = i * inc; 

    positions[3*i] = rad * Math.cos(phi)*r;
    positions[3*i+1] = rad * y;
    positions[3*i+2] = rad * Math.sin(phi)*r;
}

pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions,3));

const pointsMaterial = new THREE.ShaderMaterial({ 
    uniforms: {
        uTime: { value: 0 },
        uSize: { value: 10 * renderer.getPixelRatio() },
        uMouse: { value: new THREE.Vector2() },
        uResolution: { value: new THREE.Vector4(window.width, window.height, 1, 1) },
    },
    vertexColors: true,
    vertexShader: vertexParticles,
    fragmentShader: fragmentParticles,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
})

const pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial)
pointsMesh.rotation.z -= 190;
pointsMesh.rotation.y += 190;
scene.add(pointsMesh)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.001, 1000 )
camera.position.set(0,0,4);
scene.add(camera)
scene.background = new THREE.Color('#141718');


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX - sizes.width/2;
    mouse.y = sizes.height/2 - event.clientY;
})

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderers
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Update material
    material.uniforms.uTime.value = elapsedTime;
    pointsMaterial.uniforms.uTime.value = elapsedTime;

    // Update mesh
    // pointsMesh.rotation.y += 0.002;
    // pointsMesh.rotation.x -= 0.004;

    // Render
    renderer.render(scene, camera);
    
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()