import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeCarBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf8fafc, 0.03);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(2.5, 2.2, 8.5);
    camera.lookAt(0, 0.4, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // ----------------------------------------------------
    // LIGHTS FOR LIGHT WHITE ENVIRONMENT
    // ----------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(6, 12, 8);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xcbd5e1, 1.0);
    fillLight.position.set(-6, 6, -6);
    scene.add(fillLight);

    // ----------------------------------------------------
    // STATIONARY 3D CAR MODEL (STATIONARY - NO ROTATION)
    // ----------------------------------------------------
    const carGroup = new THREE.Group();
    // Fixed stationary angle
    carGroup.rotation.y = Math.PI / 5;
    scene.add(carGroup);

    // Metallic Graphite Silver Body Material
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.9,
      roughness: 0.2,
    });

    // Dark Tinted Glass
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.95,
      roughness: 0.05,
      transparent: true,
      opacity: 0.85,
    });

    // Rubber Tires
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
    });

    // Silver Alloy Rims
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
      roughness: 0.1,
    });

    const headlightMaterial = new THREE.MeshBasicMaterial({ color: 0xe2e8f0 });
    const taillightMaterial = new THREE.MeshBasicMaterial({ color: 0xef4444 });

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

    wheelPositions.forEach(([x, y, z]) => {
      const wMesh = new THREE.Mesh(wheelGeo, wheelMaterial);
      const rMesh = new THREE.Mesh(rimGeo, rimMaterial);
      const wGroup = new THREE.Group();
      wGroup.add(wMesh);
      wGroup.add(rMesh);
      wGroup.position.set(x, y, z);
      carGroup.add(wGroup);
    });

    // 6. Headlights & Taillights
    const hlGeo = new THREE.BoxGeometry(0.5, 0.15, 0.1);
    const hlLeft = new THREE.Mesh(hlGeo, headlightMaterial);
    hlLeft.position.set(-0.8, 0.6, 2.41);
    carGroup.add(hlLeft);

    const hlRight = hlLeft.clone();
    hlRight.position.set(0.8, 0.6, 2.41);
    carGroup.add(hlRight);

    const tlLeft = new THREE.Mesh(hlGeo, taillightMaterial);
    tlLeft.position.set(-0.8, 0.6, -2.41);
    carGroup.add(tlLeft);

    const tlRight = tlLeft.clone();
    tlRight.position.set(0.8, 0.6, -2.41);
    carGroup.add(tlRight);

    // Subtle Ground Shadow Disk
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.25,
    });
    const groundShadow = new THREE.Mesh(shadowGeo, shadowMat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = 0.01;
    scene.add(groundShadow);

    // Render static frame (NO ROTATION LOOP)
    renderer.render(scene, camera);

    // ----------------------------------------------------
    // RESIZE HANDLER
    // ----------------------------------------------------
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-slate-50 opacity-40">
      <div ref={mountRef} className="absolute inset-0" />
    </div>
  );
}
