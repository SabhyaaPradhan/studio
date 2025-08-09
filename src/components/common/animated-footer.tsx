
"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function AnimatedFooter() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!mountRef.current || typeof window === 'undefined') return;

    const currentMount = mountRef.current;
    
    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.position.y = 2;
    camera.rotation.x = -0.5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Plane for water effect
    const geometry = new THREE.PlaneGeometry(30, 30, 50, 50);
    
    const waveColor = resolvedTheme === 'dark' 
        ? new THREE.Color(`hsl(${getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()})`)
        : new THREE.Color('#000000');


    const material = new THREE.MeshBasicMaterial({
      color: waveColor,
      wireframe: true,
    });
    
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);
    
    const clock = new THREE.Clock();

    // Animation loop
    const animate = () => {
      if (!mountRef.current) return;
      
      const t = clock.getElapsedTime();
      const positions = plane.geometry.attributes.position;

      for (let i = 0; i < positions.count; i++) {
        const y = positions.getY(i);
        const x = positions.getX(i);
        const waveX = 0.3 * Math.sin(x * 0.5 + t * 2);
        const waveY = 0.3 * Math.sin(y * 0.5 + t * 2);
        positions.setZ(i, waveX + waveY);
      }
      positions.needsUpdate = true;
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // GSAP animations for text
    gsap.fromTo(
      ".footer-content > *",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
    );

    // Handle resize
    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [resolvedTheme]);

  return (
    <footer className="relative bg-black border-t border-border/20 overflow-hidden h-64 flex items-center justify-center text-center">
      <div ref={mountRef} className="absolute inset-0 z-0 opacity-20" />
      <div className="relative z-10 container mx-auto px-4 md:px-6 footer-content">
        <div className="flex justify-center items-center gap-2">
            <span className="text-2xl font-semibold text-primary">Savrii</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Savrii. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-4">
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
