// A.I. Disclaimer: All work for this assignment was completed by myself and entirely without the 
// use of artificial intelligence tools such as ChatGPT, MS Copilot, other LLMs, etc. 

// Setup
const scene = new THREE.Scene();
//scene.background = new THREE.Color(0x000022);

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

// Enable shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 50;

//const backLight = new THREE.DirectionalLight(0x4444ff, 0.3);
//backLight.position.set(-10, -5, -10);
//scene.add(backLight);

// Materials
const matDarkGrey = new THREE.MeshStandardMaterial({ color: 0x444b52, metalness: 0.7, roughness: 0.4 });
const matLightGrey = new THREE.MeshStandardMaterial({ color: 0xa0a8b0, metalness: 0.9, roughness: 0.3 });
const matAccent = new THREE.MeshStandardMaterial({ color: 0xf0c040, metalness: 0.5, roughness: 0.2 });
const matBlack = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.5 });
const matBlue = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.6, roughness: 0.3 });
const matRed = new THREE.MeshStandardMaterial({ color: 0xff4444, metalness: 0.7, roughness: 0.3 });
const matGreen = new THREE.MeshStandardMaterial({ color: 0x44ff44, metalness: 0.7, roughness: 0.3 });

/*
    Space Station- Composite Object
*/
function createSpaceStation() {
    const station = new THREE.Group();

    // 1. Central Hub - Sphere
    const hubGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const hub = new THREE.Mesh(hubGeometry, matShipMetal);
    station.add(hub);

    // 2. Connecting Modules - Cylinders
    const moduleGeometry = new THREE.CylinderGeometry(0.4, 0.4, 3, 16);

    for (let i = 0; i < 4; i++) {
        const module = new THREE.Mesh(moduleGeometry, matShipMetal);
        const angle = (i * Math.PI) / 2;
        module.position.x = Math.cos(angle) * 2.5;
        module.position.z = Math.sin(angle) * 2.5;
        module.rotation.z = Math.PI / 2;
        module.rotation.y = angle;
        station.add(module);

        // Add end caps at the end of each module
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

    // Define faces using vertex indices
    const indices = [
        // Top face
        0, 2, 1,
        0, 3, 2,
        0, 4, 3,
        0, 5, 4,
        
        // Bottom face
        6, 7, 8,
        6, 8, 9,
        6, 9, 10,
        6, 10, 11,
        
        // Side faces
        0, 7, 6,  0, 1, 7,   // Face 1
        1, 8, 7,  1, 2, 8,   // Face 2
        2, 9, 8,  2, 3, 9,   // Face 3
        3, 10, 9, 3, 4, 10,  // Face 4
        4, 11, 10, 4, 5, 11, // Face 5
        5, 6, 11, 5, 0, 6,   // Face 6
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
        0, 2, 3,
        1, 0, 2,
        2, 0, 3
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

//Add stars to the background
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

//Metallic ship material
const textureLoader = new THREE.TextureLoader();
const metalAlbedo = textureLoader.load("metal-compartments_albedo.png");
const metalRoughness = textureLoader.load("metal-compartments_roughness.png");
const metalNormal = textureLoader.load("metal-compartments_normal-ogl.png");
const matShipMetal = new THREE.MeshStandardMaterial({
    map: metalAlbedo,
    roughnessMap: metalRoughness,
    normalMap: metalNormal,
    metalness: 0.8,
    roughness: 0.4
});

// 360 Background
const skyGeo = new THREE.SphereGeometry(50, 60, 40);  // HUGE sphere
const skyTexture = new THREE.TextureLoader().load("360spacebackground.jpg");

skyTexture.mapping = THREE.EquirectangularReflectionMapping;

const skyMat = new THREE.MeshBasicMaterial({
    map: skyTexture,
    side: THREE.BackSide // IMPORTANT — render inside of sphere!
});

const skySphere = new THREE.Mesh(skyGeo, skyMat);
scene.add(skySphere);


// Create and add objects to scene
const spaceStation = createSpaceStation();
spaceStation.position.set(-8, 2, 0);
scene.add(spaceStation);
spaceStation.traverse(obj => { if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; }});

const satellite = createSatellite();
satellite.position.set(8, 2, 0);
scene.add(satellite);
satellite.traverse(obj => { if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; }});

//Add stars
addStars();

// Adds spaceship custom mesh object
const userVertices = new Float32Array([
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

const userIndices = [
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

const userGeometry = new THREE.BufferGeometry();
userGeometry.setAttribute('position', new THREE.BufferAttribute(userVertices, 3));
userGeometry.setIndex(userIndices);
userGeometry.computeVertexNormals();



// Temporary UVs: project texture from the top (simple fix)
const uvs = [];

for (let i = 0; i < userVertices.length; i += 3) {
    const x = userVertices[i];
    const y = userVertices[i + 1];
    const z = userVertices[i + 2];

    // Simple planar projection (XZ -> UV)
    const u = (x + 10) / 20;
    const v = (z + 10) / 20;

    uvs.push(u, v);
}

userGeometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));


const userMesh = new THREE.Mesh(userGeometry, matShipMetal);
userMesh.position.set(0, 2, 8); // Offset to avoid overlap
userMesh.scale.set(0.5, 0.5, 0.5); // Scale down spaceship
scene.add(userMesh);
userMesh.castShadow = true;
userMesh.receiveShadow = true;


// Asteroid
function createAsteroid(radius = 1, detail = 2) {
    const geometry = new THREE.IcosahedronGeometry(radius, detail);
    // Randomly perturb vertices for a rocky look
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(position, i);
        v.multiplyScalar(1 + (Math.random() - 0.5) * 0.3);
        position.setXYZ(i, v.x, v.y, v.z);
    }
    geometry.computeVertexNormals();
    return geometry;
}
const asteroidGeometry = createAsteroid(1, 2);
const asteroidMaterial = new THREE.MeshPhongMaterial({ color: 0x888888, flatShading: true });
const asteroidMesh = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
asteroidMesh.position.set(8, 2, -8);
scene.add(asteroidMesh);
asteroidMesh.castShadow = true;
asteroidMesh.receiveShadow = true;

// Earth and Moon textured spheres
const earthTexture = textureLoader.load('earth.png');
const moonTexture = textureLoader.load('moon.jpg');

const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });
const earthGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
earthMesh.position.set(-12, 3, 8);
earthMesh.castShadow = true;
earthMesh.receiveShadow = true;
scene.add(earthMesh);

const moonMaterial = new THREE.MeshPhongMaterial({ map: moonTexture });
const moonGeometry = new THREE.SphereGeometry(0.8, 32, 32);
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
moonMesh.position.set(-10, 4, 10);
moonMesh.castShadow = true;
moonMesh.receiveShadow = true;
scene.add(moonMesh);

// Glowing sphere (visual only)
const glowSphereGeometry = new THREE.SphereGeometry(1.4, 32, 32);
const glowSphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffee
});
const glowSphere = new THREE.Mesh(glowSphereGeometry, glowSphereMaterial);
glowSphere.position.set(-15, 8, -10);
glowSphere.castShadow = false;
glowSphere.receiveShadow = false;
scene.add(glowSphere);

// Point light (actual lighting)
const glowLight = new THREE.PointLight(0xffffee, 8, 50, 1.5);
glowLight.position.copy(glowSphere.position);
glowLight.castShadow = true;

glowLight.shadow.mapSize.set(2048, 2048);
glowLight.shadow.bias = -0.0005;
glowLight.shadow.normalBias = 0.02;

scene.add(glowLight);

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
    if (animateKnot) {
        knotMesh.rotation.x += 0.02;
        knotMesh.rotation.y += 0.03;
    }
    if (animateEarth) {
        earthMesh.rotation.y += 0.01;
    }
    renderer.render(scene, camera);
});

let animateKnot = false;
let animateEarth = false;

// Sound effect for animation
const audio = new Audio('spacesound.mp3');
audio.preload = 'auto';

// Store default positions and rotations for restoration
const defaultState = {
    cameraPosition: new THREE.Vector3(20, 15, 20),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    earthRotationY: 0,
    userMeshPosition: new THREE.Vector3(0, 2, 8),
    userMeshScale: new THREE.Vector3(0.5, 0.5, 0.5),
    asteroidPosition: new THREE.Vector3(8, 2, -8),
    moonPosition: new THREE.Vector3(-10, 4, 10),
    earthPosition: new THREE.Vector3(-12, 3, 8),
    glowSpherePosition: new THREE.Vector3(-15, 8, -10)
};

window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'a') {
        animateEarth = !animateEarth;
        if (animateEarth) {
            audio.currentTime = 0;
            try {
                audio.play();
            } catch (err) {
                console.warn('Audio play failed:', err);
            }
        } else {
            audio.pause();
            audio.currentTime = 0;
        }
    }
    if (e.key.toLowerCase() === 'b') {
        // Restore camera position and controls
        camera.position.copy(defaultState.cameraPosition);
        camera.lookAt(defaultState.cameraTarget);
        controls.target.copy(defaultState.cameraTarget);
        controls.update();
        // Reset animated object rotation and positions
        if (typeof knotMesh !== 'undefined') {
            knotMesh.rotation.x = 0;
            knotMesh.rotation.y = 0;
        }
        animateKnot = false;
        animateEarth = false;
        earthMesh.rotation.y = defaultState.earthRotationY;
        userMesh.position.copy(defaultState.userMeshPosition);
        userMesh.scale.copy(defaultState.userMeshScale);
        asteroidMesh.position.copy(defaultState.asteroidPosition);
        moonMesh.position.copy(defaultState.moonPosition);
        earthMesh.position.copy(defaultState.earthPosition);
        glowSphere.position.copy(defaultState.glowSpherePosition);
        glowLight.position.copy(defaultState.glowSpherePosition);

        //Reset sound
        audio.pause();
        audio.currentTime = 0;
    }
});