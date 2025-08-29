import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Torus, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

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
    const radius = 1.2;
    const tubeRadius = 0.5;

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
  return (
    <group>
      {/* Y-Axis Coils */}
      <Torus args={[1.5, 0.05, 16, 100]}>
        <meshStandardMaterial color="#4a4a5c" roughness={0.5} metalness={0.8} />
      </Torus>
      {/* X-Axis Coils */}
      <Torus args={[1.5, 0.05, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#4a4a5c" roughness={0.5} metalness={0.8} />
      </Torus>
      {/* Z-Axis Coils */}
      <Torus args={[1.5, 0.05, 16, 100]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#4a4a5c" roughness={0.5} metalness={0.8} />
      </Torus>
    </group>
  );
};

const StylizedAvatar = () => {
    const material = <meshStandardMaterial color="#3a3a4a" roughness={0.6} metalness={0.2} />;
    
    return (
        <group position={[0, -0.6, 0]}>
            {/* Torso */}
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[0.7, 1, 0.4]} />
                {material}
            </mesh>
            {/* Head */}
            <mesh position={[0, 1.3, 0]}>
                <sphereGeometry args={[0.3, 32, 32]} />
                {material}
            </mesh>
             {/* Neck */}
            <mesh position={[0, 0.95, 0]}>
                <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
                {material}
            </mesh>
            {/* Hips */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.6, 0.2, 0.35]} />
                {material}
            </mesh>
            {/* Legs */}
            <mesh position={[-0.2, -0.6, 0.1]}>
                <boxGeometry args={[0.25, 1, 0.3]} />
                {material}
            </mesh>
            <mesh position={[0.2, -0.6, 0.1]}>
                <boxGeometry args={[0.25, 1, 0.3]} />
                {material}
            </mesh>
        </group>
    );
};


interface ThreeSceneProps {
    activeChakraColor: string;
    activeFrequency: number;
    isSessionActive: boolean;
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({ activeChakraColor, activeFrequency, isSessionActive }) => {
    return (
        <div className="w-full h-full bg-black rounded-lg">
            <Canvas camera={{ position: [0, 1, 5], fov: 60 }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={Math.PI / 2} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                    <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
                    <HelmholtzCoils />
                    <StylizedAvatar />
                    <MagneticField
                        color={activeChakraColor}
                        frequency={activeFrequency}
                        isActive={isSessionActive}
                    />
                    <OrbitControls enableDamping dampingFactor={0.1} target={[0, 0, 0]} />
                </Suspense>
            </Canvas>
        </div>
    );
};