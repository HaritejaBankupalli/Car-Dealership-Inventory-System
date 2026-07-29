import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeCarBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.03);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3, 10);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // ----------------------------------------------------
    // LIGHTS
    // ----------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x38bdf8, 2);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0x818cf8, 1.5);
    rimLight.position.set(-5, 5, -5);
    scene.add(rimLight);

    const groundLight = new THREE.DirectionalLight(0x06b6d4, 0.8);
    groundLight.position.set(0, -5, 0);
    scene.add(groundLight);

    // ----------------------------------------------------
    // CAR GROUP
    // ----------------------------------------------------
    const carGroup = new THREE.Group();
    scene.add(carGroup);

    // Materials
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.85,
      roughness: 0.2,
      envMapIntensity: 1.5,
    });

    const roofMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85,
    });

    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
    });

    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.95,
      roughness: 0.1,
    });

    const headlightMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
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

    // Emissive Light Beams
    const pLight1 = new THREE.PointLight(0x38bdf8, 2, 8);
    pLight1.position.set(-0.8, 0.6, 2.6);
    carGroup.add(pLight1);

    const pLight2 = new THREE.PointLight(0x38bdf8, 2, 8);
    pLight2.position.set(0.8, 0.6, 2.6);
    carGroup.add(pLight2);

    // Taillights
    const tlLeft = new THREE.Mesh(hlGeo, taillightMaterial);
    tlLeft.position.set(-0.8, 0.6, -2.41);
    carGroup.add(tlLeft);

    const tlRight = tlLeft.clone();
    tlRight.position.set(0.8, 0.6, -2.41);
    carGroup.add(tlRight);

    // ----------------------------------------------------
    // PARTICLES GRID
    // ----------------------------------------------------
    const particleCount = 200;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 30;
      pPos[i + 1] = Math.random() * 10 - 2;
      pPos[i + 2] = (Math.random() - 0.5) * 30;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Ground Grid
    const grid = new THREE.GridHelper(40, 40, 0x0284c7, 0x1e293b);
    grid.position.y = -0.05;
    scene.add(grid);

    // ----------------------------------------------------
    // ANIMATION LOOP
    // ----------------------------------------------------
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate car smooth 360 loop
      carGroup.rotation.y += 0.008;
      carGroup.position.y = Math.sin(Date.now() * 0.0015) * 0.1;

      // Rotate wheels
      wheels.forEach((w) => {
        w.rotation.x += 0.03;
      });

      // Float particles
      particles.rotation.y += 0.0005;

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
      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-slate-950/60 to-slate-950/95 backdrop-blur-[1px]" />
    </div>
  );
}
