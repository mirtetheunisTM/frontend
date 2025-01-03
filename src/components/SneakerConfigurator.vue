<template>
  <div class="flex flex-col min-h-screen bg-black text-white">
    <!-- Main Content -->
    <div class="flex flex-grow">
      <!-- Three.js Canvas -->
      <div ref="threeCanvas" class="flex-1">
        <!-- This is the Three.js canvas area -->
      </div>

      <!-- Customization Sidebar -->
      <div class="w-[400px] p-6 bg-black">
        <h2 class="text-xl font-bold mb-6 text-customGreen">Customize your sneaker</h2>

        <!-- Color Options -->
        <div class="mb-6">
          <p class="font-semibold mb-3">Choose a color</p>
          <div class="grid grid-cols-5 gap-4">
            <div
              v-for="(color, index) in colorOptions"
              :key="index"
              :style="{ backgroundColor: color }"
              class="w-10 h-10 rounded-full border-2 border-white cursor-pointer hover:border-customGreen"
              @click="selectColor(color)"
            ></div>
          </div>
        </div>

        <!-- Material Options -->
        <div class="mb-6">
          <p class="font-semibold mb-3">Choose a material</p>
          <div class="flex flex-col gap-4">
            <button
              v-for="(material, index) in materials"
              :key="index"
              class="bg-gray-700 py-2 px-4 rounded-3xl text-white hover:bg-customGreen hover:text-black transition duration-300"
            >
              {{ material }}
            </button>
          </div>
        </div>

        <!-- Name Input -->
        <div class="mb-6">
          <p class="font-semibold mb-3">Give it a name</p>
          <input
            type="text"
            placeholder="Enter name"
            class="w-full py-2 px-4 rounded-3xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-customGreen"
          />
        </div>

        <!-- Toggles -->
        <div class="mb-6">
          <p class="font-bold mb-2 text-customGreen text-xl">Change settings</p>
          <div class="flex items-center justify-between mb-4">
            <span>Rotate shoe</span>
            <button
              class="w-14 h-8 bg-gray-700 rounded-full flex items-center justify-start p-1"
              :class="{'justify-end': toggles.rotateShoe}"
              @click="toggle('rotateShoe')"
            >
              <div class="w-6 h-6 bg-white rounded-full"></div>
            </button>
          </div>
          <div class="flex items-center justify-between">
            <span>Skateboard</span>
            <button
              class="w-14 h-8 bg-gray-700 rounded-full flex items-center justify-start p-1"
              :class="{'justify-end': toggles.skateboard}"
              @click="toggle('skateboard')"
            >
              <div class="w-6 h-6 bg-white rounded-full"></div>
            </button>
          </div>
        </div>

        <!-- Order Button -->
        <button
          class="w-full mt-8 py-2 px-4 bg-customGreen rounded-3xl text-black font-bold hover:bg-green-600"
        >
          Order
        </button>
      </div>
    </div>
  </div>
</template>
  
  <script>
  import * as THREE from "three";
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
  
  export default {
    name: "SneakerConfigurator",
    data() {
      return {
        updatableParts: [
          "inside",
          "laces",
          "outside_1",
          "outside_2",
          "outside_3",
          "sole_bottom",
          "sole_top",
        ],
        colorOptions: [
        "#000000",
        "#FFFFFF",
        "#C90000",
        "#D85700",
        "#D1CE04",
        "#69FF47",
        "#00821C",
        "#4EB7D4",
        "#000763",
        "#E073BF",
        ],
        materials: ["Fabric", "Leather", "Rubber"],
        toggles: {
          rotateShoe: false,
          skateboard: false,
        },
        currentIntersect: null,
        partColors: {},
        partMaterials: {},
      };
    },
    mounted() {
      this.initThreeJS();
    },
    methods: {
      initThreeJS() {
        // Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          75,
          this.$refs.threeCanvas.offsetWidth / this.$refs.threeCanvas.offsetHeight,
          0.1,
          1000
        );
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(
          this.$refs.threeCanvas.offsetWidth,
          this.$refs.threeCanvas.offsetHeight
        );
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.$refs.threeCanvas.appendChild(renderer.domElement);

        // Orbit Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;
  
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Soft light everywhere
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true; 
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        scene.add(directionalLight);

        // Pedestal
        const pedestalGeometry = new THREE.BoxGeometry(3, 1.5, 5);
        const pedestalMaterial = new THREE.MeshStandardMaterial({
          color: 0x555555, 
        });
        const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
        pedestal.position.y = -0.25;
        pedestal.rotation.set(0, -Math.PI / 2, 0);
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
                        color: 0xffffff,
                        emissive: 0x000000,
                    });
                    child.material.needsUpdate = true;
                    child.castShadow = true;
                }
            });

            model.scale.set(10,10,10);
            model.position.set(0, 0.75, 0);
            model.rotation.set(0, -Math.PI / 2, 0);
            scene.add(model);
          }
          
        );

        // Camera
        camera.position.set(0, 1, 5);
        camera.lookAt(0, 0, 0);

        // Raycaster and Mouse
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // Store the current highlighted part
        let currentPart = null;

        // Event listeners
        window.addEventListener('click', (event) => {
          const { left, top, width, height } = this.$refs.threeCanvas.getBoundingClientRect();
          mouse.x = ((event.clientX - left) / width) * 2 - 1;
          mouse.y = -((event.clientY - top) / height) * 2 + 1;
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(scene.children, true);

          if (intersects.length > 0) {
            const firstIntersect = intersects[0];
            if (this.updatableParts.includes(firstIntersect.object.name)) {
              this.currentIntersect = firstIntersect;
              console.log("currentIntersect: " + this.currentIntersect.object.name);
              if (currentPart !== firstIntersect.object) {
                // Reset the previous part's outline
                if (currentPart) {
                  currentPart.material.emissive.set(0x000000);
                }

                currentPart = firstIntersect.object;
                console.log("Part clicked: " + currentPart.name);
                currentPart.material.emissive.set(0x00ff00); 
              }
            }
          } else {
            // Remove higlight
            if (currentPart) {
              currentPart.material.emissive.set(0x000000);
              currentPart = null;
              this.currentIntersect = null;
            }
          }
      });
  
        // Animation
        const animate = () => {
          requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };
        animate();
      },

      toggle(option) {
        this.toggles[option] = !this.toggles[option];
      },

      getPartColor(partName) {
        return this.partColors[partName] || 0xffffff;
      },

      getPartMaterial(partName) {
        return this.partMaterials[partName] || null;
      },

      selectColor(selectedColor) {
        if(this.currentIntersect && this.updatableParts.includes(this.currentIntersect.object.name)) {
          const material = this.currentIntersect.object.material;
          if (material && material.color) {
            material.color.set(selectedColor);
            this.partColors[this.currentIntersect.object.name] = material.color.getHex();
          }
        }
      },
    },
  };
  </script>
  
  <style scoped>

  </style>
  