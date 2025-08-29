import React, { useRef, useMemo, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Torus, Points, PointMaterial, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { ChakraPoints } from './ChakraPoints';
import { CHAKRAS } from '../constants/chakras';

interface MagneticFieldProps {
  color: string;
  frequency: number;
  isActive: boolean;
}

const MagneticField: React.FC<MagneticFieldProps> = ({ color, frequency, isActive }) => {
  const pointsRef = useRef<THREE.Points>(null!);
  
  const particles = useMemo(() => {
    const temp = [];
    const count = 2000;
    const radius = 2.7; // 1.8 * 1.5
    const tubeRadius = 1.125; // 0.75 * 1.5

    for (let i = 0; i < count; i++) {
      const u = Math.random() * 2 * Math.PI;
      const v = Math.random() * 2 * Math.PI;

      const x = (radius + tubeRadius * Math.cos(v)) * Math.cos(u);
      const y = (radius + tubeRadius * Math.cos(v)) * Math.sin(u);
      const z = tubeRadius * Math.sin(v);
      
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current && isActive) {
      const speed = frequency * 0.1;
      pointsRef.current.rotation.x += delta * speed * 0.3;
      pointsRef.current.rotation.y += delta * speed * 0.5;
      pointsRef.current.rotation.z += delta * speed * 0.2;
    }
  });

  return (
    <Points ref={pointsRef} positions={particles}>
      <PointMaterial transparent color={color} size={0.015} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
};


const HelmholtzCoils = () => {
  const R = 1.2; // Radius der Spulen
  const T = 0.05; // Dicke der Spulen
  const distance = R; // Abstand der Spulen = Radius (Helmholtz-Bedingung)

  const Coil = ({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) => (
    <group position={position} rotation={rotation}>
      {/* Kupferwicklung */}
      <Torus args={[R, T, 16, 100]}>
        <meshPhongMaterial color="#B87333" />
      </Torus>
      
      {/* Äußerer Rahmen */}
      <Torus args={[R + T + 0.05, 0.02, 8, 100]}>
        <meshPhongMaterial color="#444444" />
      </Torus>
    </group>
  );

  return (
    <group>
      {/* Y-Achsen-Paar (horizontal) */}
      <Coil position={[0, distance/2, 0]} rotation={[0, 0, 0]} />
      <Coil position={[0, -distance/2, 0]} rotation={[0, 0, 0]} />

      {/* X-Achsen-Paar (vertikal) */}
      <Coil position={[distance/2, 0, 0]} rotation={[0, 0, Math.PI/2]} />
      <Coil position={[-distance/2, 0, 0]} rotation={[0, 0, Math.PI/2]} />

      {/* Z-Achsen-Paar (vertikal) */}
      <Coil position={[0, 0, distance/2]} rotation={[Math.PI/2, 0, 0]} />
      <Coil position={[0, 0, -distance/2]} rotation={[Math.PI/2, 0, 0]} />
    </group>
  );
};

const AvatarModel = () => {
  const { scene } = useGLTF('/Man_with_VR_glasses_o_0829172703_texture.glb');

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <primitive object={scene} scale={[1, 1, 1]} position={[0, -0.5, 0]} />
  );
};

interface ThreeSceneProps {
  activeChakra: number;
  activeFrequency: number;
  isSessionActive: boolean;
  intensity: number;
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({ activeChakra, activeFrequency, isSessionActive, intensity }) => {
  const activeChakraColor = activeChakra >= 0 ? CHAKRAS[activeChakra].color : '#ffffff';
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [3, 2, 3], fov: 75 }}
        shadows
        className="bg-black"
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.4} />
        
        <Suspense fallback={null}>
          <AvatarModel />
          <ChakraPoints 
            activeChakra={activeChakra}
            intensity={intensity}
          />
        </Suspense>
        
        <HelmholtzCoils />
        
        <MagneticField 
          color={activeChakraColor}
          frequency={activeFrequency}
          isActive={isSessionActive}
        />
        
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};