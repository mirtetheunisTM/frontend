<template>
    <div ref="threeCanvas" class="three-canvas"></div>
  </template>
  
  <script>
  import * as THREE from "three";
  
  export default {
    name: "SneakerConfigurator",
    mounted() {
      this.initThreeJS();
    },
    methods: {
      initThreeJS() {
        // Setup scene, camera, renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          75,
          this.$refs.threeCanvas.clientWidth /
            this.$refs.threeCanvas.clientHeight,
          0.1,
          1000
        );
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(
          this.$refs.threeCanvas.clientWidth,
          this.$refs.threeCanvas.clientHeight
        );
        this.$refs.threeCanvas.appendChild(renderer.domElement);
  
        // Add a basic cube (to test rendering)
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
  
        camera.position.z = 5;
  
        const animate = () => {
          requestAnimationFrame(animate);
          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;
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
  