
"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Github, Twitter, Linkedin } from "lucide-react";
import { Button } from "../ui/button";

export default function AnimatedFooter() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const footerRef = useRef<HTMLDivElement>(null);

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
        ? new THREE.Color('hsl(130 90% 45%)')
        : new THREE.Color('hsl(0 0% 3.9%)');


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

    const ctx = gsap.context(() => {
        // GSAP animations for text
        gsap.fromTo(
          ".footer-content > *",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
        );

        gsap.utils.toArray<HTMLAnchorElement>('.footer-link').forEach(link => {
            gsap.fromTo(link, { y: 0 }, { y: -3, duration: 0.2, paused: true, ease: 'power1.inOut' });
            link.addEventListener('mouseenter', () => gsap.getTweensOf(link)[0].play());
            link.addEventListener('mouseleave', () => gsap.getTweensOf(link)[0].reverse());
        });

         gsap.utils.toArray<HTMLAnchorElement>('.social-icon').forEach(icon => {
            gsap.to(icon, { rotation: 360, duration: 0.4, paused: true, ease: 'power1.inOut' });
            icon.addEventListener('mouseenter', () => gsap.getTweensOf(icon)[0].play());
            icon.addEventListener('mouseleave', () => gsap.getTweensOf(icon)[0].reverse());
        });
    }, footerRef);


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
      ctx.revert();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [resolvedTheme]);

  const footerLinkClasses = "footer-link text-sm transition-colors text-muted-foreground hover:text-foreground";
  const socialIconClasses = "social-icon text-muted-foreground transition-colors hover:text-primary";

  return (
    <footer 
        ref={footerRef}
        className={cn(
            "relative border-t overflow-hidden py-16 text-center md:text-left",
            resolvedTheme === 'dark' ? 'bg-black' : 'bg-white'
        )}
    >
      <div ref={mountRef} className="absolute inset-0 z-0 opacity-40" />
      <div className="relative z-10 container mx-auto px-4 md:px-6 footer-content">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Left side */}
            <div className="space-y-4">
                <Link href="/" className="text-2xl font-bold text-primary">Savrii</Link>
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Savrii. All rights reserved.
                </p>
            </div>

            {/* Center */}
            <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Quick Links</h4>
                <ul className="space-y-2">
                    <li><Link href="/dashboard" className={footerLinkClasses}>Dashboard</Link></li>
                    <li><Link href="/billing" className={footerLinkClasses}>Upgrade Plan</Link></li>
                    <li><Link href="/support" className={footerLinkClasses}>Support</Link></li>
                    <li><Link href="/privacy" className={footerLinkClasses}>Privacy Policy</Link></li>
                    <li><Link href="/terms" className={footerLinkClasses}>Terms of Service</Link></li>
                </ul>
            </div>

            {/* Right side */}
            <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Get in Touch</h4>
                 <ul className="space-y-2">
                    <li><Link href="/contact" className={footerLinkClasses}>Contact Support</Link></li>
                    <li><Button variant="link" className={cn(footerLinkClasses, "p-0 h-auto")}>Send Feedback</Button></li>
                </ul>
                <div className="flex justify-center md:justify-start items-center gap-4 mt-4">
                    <a href="#" className={socialIconClasses}><Github className="h-5 w-5" /></a>
                    <a href="#" className={socialIconClasses}><Twitter className="h-5 w-5" /></a>
                    <a href="#" className={socialIconClasses}><Linkedin className="h-5 w-5" /></a>
                </div>
            </div>

        </div>
      </div>
    </footer>
  );
}
