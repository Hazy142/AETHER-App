import React, { useRef, useMemo, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Torus, Points, PointMaterial, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { ChakraPoints } from './ChakraPoints';
import { CHAKRAS } from '../constants/chakras';
import { Chakra } from '@/types';

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
    <Points ref={pointsRef} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={isActive ? 1.0 : 0.0}
      />
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
      <mesh>
        <torusGeometry args={[R, T, 16, 100]} />
        <meshStandardMaterial color="#b87333" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Äußerer Rahmen */}
      <mesh>
        <torusGeometry args={[R, T + 0.01, 16, 100]} />
        <meshStandardMaterial color="#222222" roughness={0.5} metalness={0.2} side={THREE.BackSide} />
      </mesh>
    </group>
  );

  return (
    <group scale={2.0}>
      {/* Y-Achsen-Paar (horizontal) */}
      <Coil position={[0, distance / 2, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <Coil position={[0, -distance / 2, 0]} rotation={[Math.PI / 2, 0, 0]} />

      {/* X-Achsen-Paar (vertikal) */}
      <Coil position={[distance / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <Coil position={[-distance / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} />

      {/* Z-Achsen-Paar (vertikal) */}
      <Coil position={[0, 0, distance / 2]} rotation={[0, 0, 0]} />
      <Coil position={[0, 0, -distance / 2]} rotation={[0, 0, 0]} />
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
        <primitive 
            object={scene} 
            scale={2.475} // 1.65 * 1.5
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
        />
    );
};
interface ThreeSceneProps {
    activeChakra: Chakra;
    activeFrequency: number;
    isSessionActive: boolean;
    intensity: number;
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({ activeChakra, activeFrequency, isSessionActive, intensity }) => {
    const activeChakraColor = activeChakra.color;
    return (
        <div className="w-full h-full bg-black rounded-lg">
            <Canvas 
                camera={{ position: [0, 0, 5], fov: 75 }}
                shadows
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={1} />
                    <directionalLight 
                        position={[5, 5, 5]} 
                        intensity={2}
                        castShadow
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                    />
                    <spotLight 
                        position={[-5, 5, 0]} 
                        intensity={1.5}
                        castShadow
                        angle={0.3}
                        penumbra={1}
                    />
                    <HelmholtzCoils />
                    <AvatarModel />
                    <ChakraPoints 
                        // === HIER IST DIE KORREKTUR ===
                        activeChakra={CHAKRAS.findIndex(c => c.name === activeChakra.name)}
                        intensity={intensity}
                    />
                    <MagneticField
                        color={activeChakraColor}
                        frequency={activeFrequency}
                        isActive={isSessionActive}
                    />
                    <OrbitControls 
                        enableDamping 
                        dampingFactor={0.1} 
                        target={[0, 0, 0]}
                        maxPolarAngle={Math.PI / 1.5}
                        minPolarAngle={Math.PI / 3}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
};