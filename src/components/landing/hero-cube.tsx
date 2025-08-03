"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

export default function HeroCube() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 3.5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Material
    const material = new THREE.MeshStandardMaterial({
      color: 0x7cfc00, // Neon green tint
      transparent: true,
      opacity: 0.35, // Semi-transparent
      roughness: 0.2,
      metalness: 0.8,
    });

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x7cfc00, linewidth: 2 });
    
    // Cube
    const cubeGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const cube = new THREE.Mesh(cubeGeometry, material);
    const cubeEdges = new THREE.EdgesGeometry(cubeGeometry);
    const cubeLineSegments = new THREE.LineSegments(cubeEdges, lineMaterial);
    cube.add(cubeLineSegments); // Attach edges to the cube
    scene.add(cube);
    
    // Sphere
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 16);
    const sphere = new THREE.Mesh(sphereGeometry, material);
    const sphereEdges = new THREE.EdgesGeometry(sphereGeometry);
    const sphereLineSegments = new THREE.LineSegments(sphereEdges, lineMaterial);
    sphere.add(sphereLineSegments); // Attach edges to the sphere
    scene.add(sphere);

    // Cone
    const coneGeometry = new THREE.ConeGeometry(0.5, 1, 32);
    const cone = new THREE.Mesh(coneGeometry, material);
    const coneEdges = new THREE.EdgesGeometry(coneGeometry);
    const coneLineSegments = new THREE.LineSegments(coneEdges, lineMaterial);
    cone.add(coneLineSegments);
    scene.add(cone);

    const updateObjectPositions = () => {
        const aspect = currentMount.clientWidth / currentMount.clientHeight;
        const xOffset = aspect > 1 ? 2.2 : aspect * 1.5;
        sphere.position.set(-xOffset, 1.2, 0);
        cone.position.set(xOffset, 1.2, 0);
    }
    updateObjectPositions();


    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);


    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.005;
      cube.rotation.y += 0.005;
      sphere.rotation.x += 0.006;
      sphere.rotation.y += 0.006;
      cone.rotation.x += 0.007;
      cone.rotation.y += 0.007;
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        updateObjectPositions();
      }
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      cubeGeometry.dispose();
      sphereGeometry.dispose();
      coneGeometry.dispose();
      material.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 opacity-50" />;
}
