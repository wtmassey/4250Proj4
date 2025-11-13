// A.I. Disclaimer: All work for this assignment was completed by myself and entirely without the 
// use of artificial intelligence tools such as ChatGPT, MS Copilot, other LLMs, etc. 
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// setup
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(12, 6, 14);
camera.lookAt(0, 2, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 2, 0);
controls.update();

const grid = new THREE.GridHelper(100, 40, 0x666666, 0x444444);
grid.position.y = 0.001;
scene.add(grid);

// materials
const matDarkGrey  = new THREE.MeshBasicMaterial({ color: 0x444b52 });
const matLightGrey = new THREE.MeshBasicMaterial({ color: 0xa0a8b0 });
const matAccent    = new THREE.MeshBasicMaterial({ color: 0xf0c040 });
const matBlack     = new THREE.MeshBasicMaterial({ color: 0x222222 });
const matBlue      = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });



const vertices = new Float32Array([
  0, 0, 1,    // 0 middle bottom
  
-6, 0, 1,   // 1 bottom left upper
  -6, 8, 0,   // 2 left wing tip
  -5, 5, 0,   // 3
  -4, 4, 0,   // 4 left wing dip
  -3, 5, 0,   // 5
  -1, 11, 0,  // 6
  0, 13, 0,   // 7 nose tip
  1, 11, 0,   // 8
  3, 5, 0,   // 9
  4, 4, 0,   // 10
  5, 5, 0,   // 11
  6, 8, 0,   // 12
  6, 0, 1,   // 13 bottom right upper
  0, 0, -1,  // 14 middle bottom lower
  -6, 0, -1, // 15 bottom left lower
  6, 0, -1,  // 16 bottom right lower
  -1, 2, 2,  // 17 back left cockpit
  -2, 5, 2,  // 18
  -1, 8, 2,  // 19 front left cockpit
  -1, 4, 3,  // 20
  1, 4, 3,   // 21
  1, 8, 2,   // 22 front right cockpit
  2, 5, 2,   // 23
  1, 2, 2,   // 24 back right cockpit
  0,5,-1    // 25
]);

// define triangles by vertex indices (two faces per side)
const indices = [
  2, 1, 3,
  3, 1, 4,
  1,0,4,
  4, 0, 5,
  5,0,17,
  6,5,19,
  7,6,19,
  9, 0, 10,
  10, 0, 13,
  11,10,13,
  13, 12, 11,
  1, 15, 16,
  13, 1, 16,
  18, 17, 20, //cock pit start
  19,18,20,
  19,20,21,
  19,21,22,
  22,21,23,
  23,21,24,
  21,20,24,
  20,17,24, //cock pit end
  7,19,22,
  24,17,0,
  5,17,0,
  5,17,18,
  5,18,19,
  6,5,19,
  7,6,19,
  19,7,22,
  8,7,22,
  9,8,22,
  9,22,23,
  9,23,24,
  0,9,24,
  12,13,16,
  1,2,15,
  2,3,15,
  3,4,15,
  4,14,15,
  4,5,14,
  14,5,25,
  5,6,25,
  6,7,25,
  7,8,25,
  8,9,25,
  9,14,25,
  9,10,14,
  14,10,16,
  10,11,16,
  11,12,16
];

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
geometry.setIndex(indices);
geometry.computeVertexNormals();

// material — make it stand out
const matBlueWire = new THREE.MeshBasicMaterial({
  color: 0x3b82f6,
  wireframe: true
});

const triangleMesh = new THREE.Mesh(geometry, matBlueWire);
triangleMesh.position.y = 2; // lift it above the ground a bit
scene.add(triangleMesh);

// Render loop & resize
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onResize);

renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});