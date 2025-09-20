// ==========================================
// THREE-SCENE.JS - Elementos 3D para el hero
// ==========================================

let scene, camera, renderer, cubes = [];
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function initThreeScene() {
    const container = document.getElementById('three-scene');
    if (!container) return;

    // Configurar escena
    scene = new THREE.Scene();
    
    // Configurar cámara
    camera = new THREE.PerspectiveCamera(
        75, 
        container.offsetWidth / container.offsetHeight, 
        0.1, 
        1000
    );
    camera.position.z = 5;

    // Configurar renderer
    renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
    });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Crear geometría de cubos (representando IA/cerebro)
    createFloatingCubes();
    
    // Crear partículas de conexión
    createConnectionParticles();
    
    // Iluminación
    const ambientLight = new THREE.AmbientLight(0x4a90e2, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x6bb6ff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Eventos
    document.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('resize', onWindowResize);

    // Iniciar animación
    animate();
}

function createFloatingCubes() {
    const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const materials = [
        new THREE.MeshLambertMaterial({ color: 0x4a90e2, transparent: true, opacity: 0.8 }),
        new THREE.MeshLambertMaterial({ color: 0x6bb6ff, transparent: true, opacity: 0.8 }),
        new THREE.MeshLambertMaterial({ color: 0x2d3748, transparent: true, opacity: 0.6 })
    ];

    // Crear formación de cubos que simula un cerebro/circuito
    const positions = [
        // Núcleo central
        [0, 0, 0],
        // Conexiones laterales
        [-1.2, 0.5, 0.2], [1.2, 0.5, 0.2],
        [-0.8, -0.8, 0.5], [0.8, -0.8, 0.5],
        // Elementos flotantes
        [-2, 1, -0.5], [2, 1, -0.5],
        [0, 1.5, 0.3], [0, -1.5, 0.3],
        // Partículas adicionales
        [-1.5, -0.3, 0.8], [1.5, -0.3, 0.8]
    ];

    positions.forEach((pos, i) => {
        const material = materials[i % materials.length];
        const cube = new THREE.Mesh(geometry, material);
        
        cube.position.set(pos[0], pos[1], pos[2]);
        cube.rotation.x = Math.random() * Math.PI;
        cube.rotation.y = Math.random() * Math.PI;
        cube.rotation.z = Math.random() * Math.PI;
        
        // Propiedades para animación
        cube.userData = {
            originalPosition: { x: pos[0], y: pos[1], z: pos[2] },
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            floatSpeed: Math.random() * 0.02 + 0.01,
            floatOffset: Math.random() * Math.PI * 2
        };
        
        scene.add(cube);
        cubes.push(cube);
    });
}

function createConnectionParticles() {
    // Crear líneas de conexión entre cubos
    const material = new THREE.LineBasicMaterial({ 
        color: 0x4a90e2, 
        transparent: true, 
        opacity: 0.3 
    });

    // Conectar algunos cubos selectivamente
    const connections = [
        [0, 1], [0, 2], [0, 3], [0, 4], // Del centro a laterales
        [1, 5], [2, 6], [3, 7], [4, 8], // Extensiones
        [5, 9], [6, 10] // Conexiones adicionales
    ];

    connections.forEach(connection => {
        if (cubes[connection[0]] && cubes[connection[1]]) {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array([
                cubes[connection[0]].position.x, 
                cubes[connection[0]].position.y, 
                cubes[connection[0]].position.z,
                cubes[connection[1]].position.x, 
                cubes[connection[1]].position.y, 
                cubes[connection[1]].position.z
            ]);
            
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const line = new THREE.Line(geometry, material);
            scene.add(line);
        }
    });
}

function animate() {
    requestAnimationFrame(animate);

    // Animar cubos
    cubes.forEach((cube, i) => {
        // Rotación continua
        cube.rotation.x += cube.userData.rotationSpeed.x;
        cube.rotation.y += cube.userData.rotationSpeed.y;
        cube.rotation.z += cube.userData.rotationSpeed.z;

        // Movimiento flotante
        const time = Date.now() * cube.userData.floatSpeed;
        cube.position.y = cube.userData.originalPosition.y + 
                         Math.sin(time + cube.userData.floatOffset) * 0.1;
        cube.position.x = cube.userData.originalPosition.x + 
                         Math.cos(time + cube.userData.floatOffset) * 0.05;
    });

    // Efecto de seguimiento del mouse
    camera.position.x += (mouseX * 0.0005 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.0005 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function onWindowResize() {
    const container = document.getElementById('three-scene');
    if (!container) return;

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.offsetWidth, container.offsetHeight);
}

// Inicializar cuando se cargue Three.js
if (typeof THREE !== 'undefined') {
    initThreeScene();
} else {
    window.addEventListener('load', initThreeScene);
}