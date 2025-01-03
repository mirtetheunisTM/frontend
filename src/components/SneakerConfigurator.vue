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
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight1.position.set(10, 10, 10);
        directionalLight1.castShadow = true;
        scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight2.position.set(-10, 10, -10);
        directionalLight2.castShadow = true;
        scene.add(directionalLight2);

        const pointLight = new THREE.PointLight(0xffffff, 0.8);
        pointLight.position.set(0, 5, 0);
        scene.add(pointLight);

        // Pedestal
        const pedestalGeometry = new THREE.BoxGeometry(3, 1.5, 5);
        const pedestalMaterial = new THREE.MeshStandardMaterial({
          color: 0x555555, 
        });
        const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
        pedestal.position.y = -1;
        pedestal.receiveShadow = true;
        scene.add(pedestal);
  
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

        // Camera
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
  