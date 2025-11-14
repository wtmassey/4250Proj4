// A.I. Disclaimer: All work for this assignment was completed by myself and entirely without the 
// use of artificial intelligence tools such as ChatGPT, MS Copilot, other LLMs, etc. 

// Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000022);

// Camera
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 20;
const camera = new THREE.OrthographicCamera(
    frustumSize * aspect / -2,
    frustumSize * aspect / 2,
    frustumSize / 2,
    frustumSize / -2,
    0.1,
    1000
);
camera.position.set(20, 15, 20);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Add grid for reference
const grid = new THREE.GridHelper(100, 40, 0x666666, 0x444444);
grid.position.y = 0.001;
scene.add(grid);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

const backLight = new THREE.DirectionalLight(0x4444ff, 0.3);
backLight.position.set(-10, -5, -10);
scene.add(backLight);

// Materials
const matDarkGrey = new THREE.MeshBasicMaterial({ color: 0x444b52 });
const matLightGrey = new THREE.MeshBasicMaterial({ color: 0xa0a8b0 });
const matAccent = new THREE.MeshBasicMaterial({ color: 0xf0c040 });
const matBlack = new THREE.MeshBasicMaterial({ color: 0x222222 });
const matBlue = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
const matRed = new THREE.MeshBasicMaterial({ color: 0xff4444 });
const matGreen = new THREE.MeshBasicMaterial({ color: 0x44ff44 });

/*
    Space Station- Composite Object
*/
function createSpaceStation() {
    const station = new THREE.Group();

    // 1. Central Hub - Sphere
    const hubGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const hub = new THREE.Mesh(hubGeometry, matLightGrey);
    station.add(hub);

    // 2. Connecting Modules - Cylinders
    const moduleGeometry = new THREE.CylinderGeometry(0.4, 0.4, 3, 16);

    for (let i = 0; i < 4; i++) {
        const module = new THREE.Mesh(moduleGeometry, matDarkGrey);
        const angle = (i * Math.PI) / 2;
        module.position.x = Math.cos(angle) * 2.5;
        module.position.z = Math.sin(angle) * 2.5;
        module.rotation.z = Math.PI / 2;
        module.rotation.y = angle;
        station.add(module);

        // Add end caps (small cubes) at the end of each module
        const capGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
        const cap = new THREE.Mesh(capGeometry, matBlue);
        cap.position.x = Math.cos(angle) * 4;
        cap.position.z = Math.sin(angle) * 4;
        station.add(cap);
    }

    // 3. Communication Antenna - Cone
    const antennaGeometry = new THREE.ConeGeometry(0.3, 2, 8);
    const antenna = new THREE.Mesh(antennaGeometry, matRed);
    antenna.position.y = 2.5;
    station.add(antenna);

    // 4. Docking Port - Cone (inverted)
    const dockGeometry = new THREE.ConeGeometry(0.5, 1.5, 8);
    const dock = new THREE.Mesh(dockGeometry, matGreen);
    dock.position.y = -2.2;
    dock.rotation.x = Math.PI;
    station.add(dock);

    // 5. Ring Structure - Torus
    const ringGeometry = new THREE.TorusGeometry(2.5, 0.2, 16, 100);
    const ring = new THREE.Mesh(ringGeometry, matAccent);
    ring.rotation.x = Math.PI / 2;
    station.add(ring);

    // 6. Additional detail - Small cubes as solar panel mounts
    const mountGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    
    for (let i = 0; i < 8; i++) {
        const mount = new THREE.Mesh(mountGeometry, matDarkGrey);
        const angle = (i * Math.PI) / 4;
        mount.position.x = Math.cos(angle) * 2.5;
        mount.position.z = Math.sin(angle) * 2.5;
        mount.position.y = 0.5;
        station.add(mount);
    }

    return station;
}

/*
    Satelite - Polygonal Mesh Object
*/
function createSatellite() {
    const satellite = new THREE.Group();

    // Main body
    const vertices = new Float32Array([
        // Top hexagon
        1.0, 1.0, 0.0,      // 0
        0.5, 1.0, 0.866,    // 1
        -0.5, 1.0, 0.866,   // 2
        -1.0, 1.0, 0.0,     // 3
        -0.5, 1.0, -0.866,  // 4
        0.5, 1.0, -0.866,   // 5
        
        // Bottom hexagon
        1.0, -1.0, 0.0,     // 6
        0.5, -1.0, 0.866,   // 7
        -0.5, -1.0, 0.866,  // 8
        -1.0, -1.0, 0.0,    // 9
        -0.5, -1.0, -0.866, // 10
        0.5, -1.0, -0.866,  // 11
    ]);

    // Define faces using vertex indices (each face is a triangle)
    const indices = [
        // Top face
        0, 1, 2,
        0, 2, 3,
        0, 3, 4,
        0, 4, 5,
        
        // Bottom face
        6, 8, 7,
        6, 9, 8,
        6, 10, 9,
        6, 11, 10,
        
        // Side faces
        0, 6, 7,  0, 7, 1,   // Face 1
        1, 7, 8,  1, 8, 2,   // Face 2
        2, 8, 9,  2, 9, 3,   // Face 3
        3, 9, 10, 3, 10, 4,  // Face 4
        4, 10, 11, 4, 11, 5, // Face 5
        5, 11, 6, 5, 6, 0,   // Face 6
    ];

    const bodyGeometry = new THREE.BufferGeometry();
    bodyGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    bodyGeometry.setIndex(indices);
    bodyGeometry.computeVertexNormals();

    const body = new THREE.Mesh(bodyGeometry, matLightGrey);
    satellite.add(body);

    // Solar Panels
    const panelVertices = new Float32Array([
        -2.5, 0, 0,
        2.5, 0, 0,
        2.5, 1.5, 0,
        -2.5, 1.5, 0
    ]);

    const panelIndices = [
        0, 1, 2,
        0, 2, 3
    ];

    const panelGeometry = new THREE.BufferGeometry();
    panelGeometry.setAttribute('position', new THREE.BufferAttribute(panelVertices, 3));
    panelGeometry.setIndex(panelIndices);
    panelGeometry.computeVertexNormals();

    // Left panel
    const leftPanel = new THREE.Mesh(panelGeometry, matBlue);
    leftPanel.position.x = -1.5;
    leftPanel.rotation.y = Math.PI / 2;
    satellite.add(leftPanel);

    // Right panel
    const rightPanel = new THREE.Mesh(panelGeometry, matBlue);
    rightPanel.position.x = 1.5;
    rightPanel.rotation.y = Math.PI / 2;
    satellite.add(rightPanel);

    // Add antenna on top
    const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const antenna = new THREE.Mesh(antennaGeometry, matAccent);
    antenna.position.y = 2;
    satellite.add(antenna);

    // Add small dish antenna
    const dishGeometry = new THREE.ConeGeometry(0.4, 0.3, 16);
    const dish = new THREE.Mesh(dishGeometry, matLightGrey);
    dish.position.y = 3;
    satellite.add(dish);

    return satellite;
}

/*
    Add stars to the background
 */
function addStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ 
        color: 0xffffff,
        size: 0.1
    });

    const starVertices = [];
    for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * 100;
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

// Create and add objects to scene
const spaceStation = createSpaceStation();
spaceStation.position.set(-8, 2, 0);
scene.add(spaceStation);

const satellite = createSatellite();
satellite.position.set(8, 2, 0);
scene.add(satellite);

//Add stars
addStars();

// Handle window resize
function onResize() {
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 20;
    
    camera.left = frustumSize * aspect / -2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = frustumSize / -2;
    
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onResize);

// Animation loop
renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
});
