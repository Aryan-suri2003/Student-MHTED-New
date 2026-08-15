import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function RobotMascot() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const WIDTH = 200;
    const HEIGHT = 200;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(WIDTH, HEIGHT);
    // CRITICAL — omitting this washes out/dulls the baked textures
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Ensure the canvas absolutely fills the fixed container
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    renderer.domElement.style.left = '0px';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    containerRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, WIDTH / HEIGHT, 0.1, 100);
    // Move the camera further back and slightly higher so the model fits in the 200x200 box
    camera.position.set(0, 0.25, 5.8);
    camera.lookAt(0, 0.12, 0);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(2, 3, 4);
    scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    let head: THREE.Object3D | undefined;
    let eyeLeft: THREE.Object3D | undefined;
    let eyeRight: THREE.Object3D | undefined;
    const eyeLeftBase = new THREE.Vector3();
    const eyeRightBase = new THREE.Vector3();

    const loader = new GLTFLoader();
    loader.load('/models/robot_rigged.glb', (gltf) => {
      scene.add(gltf.scene);
      head = gltf.scene.getObjectByName("Head");
      eyeLeft = gltf.scene.getObjectByName("EyeLeft");
      eyeRight = gltf.scene.getObjectByName("EyeRight");
      if (eyeLeft) eyeLeftBase.copy(eyeLeft.position);
      if (eyeRight) eyeRightBase.copy(eyeRight.position);
    });

    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    const MAX_YAW = 0.5, MAX_PITCH = 0.28, EYE_SHIFT = 0.018, DAMPING = 0.08;

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetX = THREE.MathUtils.clamp(((e.clientX - cx) / window.innerWidth) * 2.4, -1, 1);
      targetY = THREE.MathUtils.clamp(((e.clientY - cy) / window.innerHeight) * 2.4, -1, 1);
    };

    window.addEventListener("mousemove", onMouseMove);

    let rafId: number;
    function animate() {
      rafId = requestAnimationFrame(animate);
      currentX = THREE.MathUtils.lerp(currentX, targetX, DAMPING);
      currentY = THREE.MathUtils.lerp(currentY, targetY, DAMPING);
      
      if (head) {
        head.rotation.y = currentX * MAX_YAW;
        head.rotation.x = currentY * MAX_PITCH;
      }
      if (eyeLeft) {
        eyeLeft.position.x = eyeLeftBase.x + currentX * EYE_SHIFT;
        eyeLeft.position.y = eyeLeftBase.y - currentY * EYE_SHIFT;
      }
      if (eyeRight) {
        eyeRight.position.x = eyeRightBase.x + currentX * EYE_SHIFT;
        eyeRight.position.y = eyeRightBase.y - currentY * EYE_SHIFT;
      }
      
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      pmrem.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return createPortal(
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        right: '16px',
        bottom: '16px',
        width: '200px',
        height: '200px',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />,
    document.body
  );
}
