import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeCarBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.025);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2.8, 9.5);
    camera.lookAt(0, 0.4, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // ----------------------------------------------------
    // NEUTRAL STUDIO LIGHTING (NO BLUE LIGHTS)
    // ----------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(6, 12, 8);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe2e8f0, 1.2);
    fillLight.position.set(-6, 6, -6);
    scene.add(fillLight);

    const warmRim = new THREE.DirectionalLight(0xfef08a, 0.6);
    warmRim.position.set(0, 4, -8);
    scene.add(warmRim);

    // ----------------------------------------------------
    // 3D CAR MODEL GROUP (ELEGANT GUNMETAL SILVER)
    // ----------------------------------------------------
    const carGroup = new THREE.Group();
    scene.add(carGroup);

    // Metallic Gunmetal Silver Material
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x9ca3af,
      metalness: 0.92,
      roughness: 0.15,
      envMapIntensity: 2.0,
    });

    // Dark Tinted Glass
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.95,
      roughness: 0.05,
      transparent: true,
      opacity: 0.9,
    });

    // Rubber Tire Material
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.85,
    });

    // Silver Alloy Rim Material
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0xf3f4f6,
      metalness: 0.95,
      roughness: 0.1,
    });

    // Warm White Headlights & Red Taillights
    const headlightMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    const taillightMaterial = new THREE.MeshBasicMaterial({
      color: 0xef4444,
    });

    // 1. Lower Body / Chassis
    const chassisGeo = new THREE.BoxGeometry(2.4, 0.6, 4.8);
    const chassis = new THREE.Mesh(chassisGeo, bodyMaterial);
    chassis.position.y = 0.5;
    carGroup.add(chassis);

    // 2. Cabin / Roof
    const cabinGeo = new THREE.BoxGeometry(1.9, 0.5, 2.2);
    const cabin = new THREE.Mesh(cabinGeo, roofMaterial);
    cabin.position.set(0, 1.0, -0.2);
    carGroup.add(cabin);

    // 3. Hood slope
    const hoodGeo = new THREE.BoxGeometry(2.2, 0.15, 1.4);
    const hood = new THREE.Mesh(hoodGeo, bodyMaterial);
    hood.position.set(0, 0.75, 1.3);
    hood.rotation.x = -0.1;
    carGroup.add(hood);

    // 4. Rear Spoiler
    const spoilerWingGeo = new THREE.BoxGeometry(2.3, 0.08, 0.5);
    const spoilerWing = new THREE.Mesh(spoilerWingGeo, bodyMaterial);
    spoilerWing.position.set(0, 1.25, -2.2);
    carGroup.add(spoilerWing);

    const spoilerLeg1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.1), bodyMaterial);
    spoilerLeg1.position.set(-0.8, 1.05, -2.2);
    carGroup.add(spoilerLeg1);

    const spoilerLeg2 = spoilerLeg1.clone();
    spoilerLeg2.position.set(0.8, 1.05, -2.2);
    carGroup.add(spoilerLeg2);

    // 5. Wheels & Rims
    const wheelRadius = 0.42;
    const wheelWidth = 0.28;
    const wheelGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 24);
    wheelGeo.rotateZ(Math.PI / 2);

    const rimGeo = new THREE.CylinderGeometry(wheelRadius * 0.6, wheelRadius * 0.6, wheelWidth + 0.02, 16);
    rimGeo.rotateZ(Math.PI / 2);

    const wheelPositions = [
      [-1.25, 0.42, 1.5],  // Front Left
      [1.25, 0.42, 1.5],   // Front Right
      [-1.25, 0.42, -1.5], // Rear Left
      [1.25, 0.42, -1.5],  // Rear Right
    ];

    const wheels = [];

    wheelPositions.forEach(([x, y, z]) => {
      const wMesh = new THREE.Mesh(wheelGeo, wheelMaterial);
      const rMesh = new THREE.Mesh(rimGeo, rimMaterial);
      const wGroup = new THREE.Group();
      wGroup.add(wMesh);
      wGroup.add(rMesh);
      wGroup.position.set(x, y, z);
      carGroup.add(wGroup);
      wheels.push(wGroup);
    });

    // 6. Headlights & Taillights
    const hlGeo = new THREE.BoxGeometry(0.5, 0.15, 0.1);
    const hlLeft = new THREE.Mesh(hlGeo, headlightMaterial);
    hlLeft.position.set(-0.8, 0.6, 2.41);
    carGroup.add(hlLeft);

    const hlRight = hlLeft.clone();
    hlRight.position.set(0.8, 0.6, 2.41);
    carGroup.add(hlRight);

    // Headlight Light Beams
    const pLight1 = new THREE.PointLight(0xffffff, 1.5, 6);
    pLight1.position.set(-0.8, 0.6, 2.6);
    carGroup.add(pLight1);

    const pLight2 = new THREE.PointLight(0xffffff, 1.5, 6);
    pLight2.position.set(0.8, 0.6, 2.6);
    carGroup.add(pLight2);

    // Taillights
    const tlLeft = new THREE.Mesh(hlGeo, taillightMaterial);
    tlLeft.position.set(-0.8, 0.6, -2.41);
    carGroup.add(tlLeft);

    const tlRight = tlLeft.clone();
    tlRight.position.set(0.8, 0.6, -2.41);
    carGroup.add(tlRight);

    // Subtle Ground Reflection Disk
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.4,
    });
    const groundShadow = new THREE.Mesh(shadowGeo, shadowMat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = 0.01;
    scene.add(groundShadow);

    // ----------------------------------------------------
    // ANIMATION LOOP (CONTINUOUS 3D CAR ROTATION)
    // ----------------------------------------------------
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate 3D car continuously in background
      carGroup.rotation.y += 0.007;
      carGroup.position.y = Math.sin(Date.now() * 0.0015) * 0.08;

      // Rotate wheels smoothly
      wheels.forEach((w) => {
        w.rotation.x += 0.025;
      });

      renderer.render(scene, camera);
    };

    animate();

    // ----------------------------------------------------
    // RESIZE HANDLER
    // ----------------------------------------------------
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-slate-950">
      <div ref={mountRef} className="absolute inset-0" />
      {/* Clean Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-slate-950/50 to-slate-950/90" />
    </div>
  );
}
