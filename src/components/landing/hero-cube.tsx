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
    camera.position.z = 2;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x7cfc00,
      transparent: true,
      opacity: 0.15,
      roughness: 0.2,
      metalness: 0.8,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Edges
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x7cfc00, linewidth: 2 });
    const lineSegments = new THREE.LineSegments(edges, lineMaterial);
    scene.add(lineSegments);

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
      lineSegments.rotation.x += 0.005;
      lineSegments.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 opacity-50" />;
}