<template>
    <div ref="threeCanvas" class="three-canvas"></div>
  </template>
  
  <script>
  import * as THREE from "three";
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
  
  export default {
    name: "SneakerConfigurator",
    mounted() {
      this.initThreeJS();
    },
    methods: {
      initThreeJS() {
        // Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          75,
          this.$refs.threeCanvas.clientWidth / this.$refs.threeCanvas.clientHeight,
          0.1,
          1000
        );
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(
          this.$refs.threeCanvas.clientWidth,
          this.$refs.threeCanvas.clientHeight
        );
        this.$refs.threeCanvas.appendChild(renderer.domElement);

        // Orbit Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;
  
        // Lighting
        const light = new THREE.DirectionalLight(0xffffff, 3); 
        light.position.set(10, 10, 10); // Position the light
        light.castShadow = true;
        scene.add(light);
  
        // Load model
        const gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("/draco/");
        gltfLoader.setDRACOLoader(dracoLoader);
  
        gltfLoader.load(
          "/shoe.glb", 
          (gltf) => {
            console.log(gltf);
            console.log(gltf.scene);
            const model = gltf.scene;
            model.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0xffffff
                    });
                    child.material.needsUpdate = true;
                    child.castShadow = true;
                }
            });

            model.scale.set(10,10,10);
            scene.add(model);
          }
          
        );

        /* Ground plane
        const planeGeometry = new THREE.PlaneGeometry(10, 10);
        const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2; 
        scene.add(plane); */

  
        camera.position.set(0, 1, 5);
        camera.lookAt(0, 0, 0);
  
        const animate = () => {
          requestAnimationFrame(animate);
          renderer.render(scene, camera);
        };
        animate();
      },
    },
  };
  </script>
  
  <style scoped>
  .three-canvas {
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
  </style>
  