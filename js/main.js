import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';

///scene
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

//texture HDRI
const loader = new THREE.CubeTextureLoader();
loader.setPath( 'cubemap1/' );
const textureCube = loader.load( [
	'px.png', 'nx.png',
	'py.png', 'ny.png',
	'pz.png', 'nz.png'
] );
scene.background=textureCube
//manager
const manager = new THREE.LoadingManager();
const loaderFBX = new FBXLoader( manager );

const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0, 0 );
controls.update();

///luces
const light = new THREE.PointLight( 0x40E9FF, 1, 100 );
light.position.set( 0, 10, 0 );
light.castShadow = true;

light.shadow.mapSize.width = 512;
light.shadow.mapSize.height = 512;
light.shadow.camera.near = 0.5; 
light.shadow.camera.far = 500;

scene.add( light );

const light2 = new THREE.AmbientLight( 0xE6C35A); // soft white light
scene.add( light2 );

//load fbx 
loaderFBX.load("m1.fbx",function(object){
  object.scale.x=0.001
  object.scale.y=0.001
  object.scale.z=0.001
  scene.add(object)
})



camera.position.z = 5;

function animate() {

  renderer.render( scene, camera );

}

