import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';

/// escena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );
renderer.xr.enabled = true;
renderer.xr.setReferenceSpaceType( 'local' );
document.body.appendChild( VRButton.createButton( renderer ) );

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/// HDRI
const loader = new THREE.CubeTextureLoader();
loader.setPath( 'cubemap1/' );
const textureCube = loader.load( [
	'px.png', 'nx.png',
	'py.png', 'ny.png',
	'pz.png', 'nz.png'
] );
scene.background = textureCube;

/// manager + FBX
const manager = new THREE.LoadingManager();
const loaderFBX = new FBXLoader( manager );

const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0, 0 );
controls.update();

/// luces
const light = new THREE.PointLight( 0x40E9FF, 1, 100 );
light.position.set( 0, 10, 0 );
light.castShadow = true;
light.shadow.mapSize.set(512, 512);
light.shadow.camera.near = 0.5; 
light.shadow.camera.far = 500;
scene.add( light );

const light2 = new THREE.AmbientLight( 0xE6C35A );
scene.add( light2 );

/// cargar modelo FBX
loaderFBX.load("m1.fbx", function(object) {
  object.scale.set(0.001, 0.001, 0.001);
  scene.add(object);
});

camera.position.z = 5;

/// --- Raycaster ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
  // Normalizar coordenadas del ratón en el rango [-1, 1]
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

// Escuchar movimiento del mouse
window.addEventListener('mousemove', onMouseMove, false);

function animate() {
  // Crear un rayo desde la cámara usando el vector2 normalizado
  raycaster.setFromCamera(mouse, camera);

  // Calcular intersecciones con objetos de la escena
  const intersects = raycaster.intersectObjects(scene.children, true);

  // Ejemplo: cambiar color si el rayo toca algo
  if (intersects.length > 0) {
    document.body.style.cursor = 'pointer';
  } else {
    document.body.style.cursor = 'default';
  }

  renderer.render(scene, camera);
}
