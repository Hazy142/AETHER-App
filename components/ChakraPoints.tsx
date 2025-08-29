import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CHAKRAS } from '../constants/chakras';

interface ChakraPointsProps {
    activeChakra: number;
    intensity: number;
}

export const ChakraPoints: React.FC<ChakraPointsProps> = ({ activeChakra, intensity }) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            const activeChakraData = activeChakra >= 0 ? CHAKRAS[activeChakra] : null;

            groupRef.current.children.forEach((group, index) => {
                const isActive = index === activeChakra;
                
                // Finde die drei Komponenten des Chakra-Punktes
                const mainSphere = group.children[0] as THREE.Mesh;
                const glowRing = group.children[1] as THREE.Mesh;
                const core = group.children[2] as THREE.Mesh;

                if (mainSphere && glowRing && core) {
                    // Sichtbarkeit des Rings steuern
                    glowRing.visible = isActive;

                    // Materialien aktualisieren
                    const mainMaterial = mainSphere.material as THREE.MeshStandardMaterial;
                    const coreMaterial = core.material as THREE.MeshBasicMaterial;
                    
                    // Aktualisiere Materialien mit needsUpdate flag
                    mainMaterial.opacity = isActive ? 1 : 0.4;
                    mainMaterial.emissiveIntensity = isActive ? intensity * 3 : 0.5;
                    mainMaterial.needsUpdate = true;
                    
                    coreMaterial.opacity = isActive ? 0.9 : 0.3;
                    coreMaterial.needsUpdate = true;

                    // Animation für das aktive Chakra
                    if (isActive && activeChakraData) {
                        const pulse = 1 + Math.sin(state.clock.elapsedTime * activeChakraData.frequency * 0.5) * 0.1;
                        group.scale.setScalar(pulse);

                        const ringMaterial = glowRing.material as THREE.MeshBasicMaterial;
                        ringMaterial.opacity = 0.5 + Math.sin(state.clock.elapsedTime * activeChakraData.frequency) * 0.2;
                        ringMaterial.needsUpdate = true;
                    } else {
                        group.scale.setScalar(1);
                    }
                }
            });
        }
    });

    return (
        <group ref={groupRef}>
            {CHAKRAS.map((chakra, index) => (
                <group key={chakra.name} position={[
                    chakra.position[0] * 1.5,
                    chakra.position[1] * 1.5,
                    chakra.position[2] * 1.5
                ]}>
                    {/* Hauptkugel des Chakras */}
                    <mesh name="main-sphere">
                        <sphereGeometry args={[0.12, 32, 32]} />
                        <meshStandardMaterial
                            color={chakra.color}
                            transparent
                            opacity={0.4}
                            emissive={chakra.color}
                            emissiveIntensity={0.5}
                            toneMapped={false}
                        />
                    </mesh>
                    
                    {/* Leuchtender Ring um aktives Chakra */}
                    <mesh name="glow-ring" visible={false}>
                        <torusGeometry args={[0.2, 0.02, 16, 32]} />
                        <meshBasicMaterial
                            color={chakra.color}
                            transparent
                            opacity={0.7}
                        />
                    </mesh>
                    
                    {/* Innerer heller Kern */}
                    <mesh name="core">
                        <sphereGeometry args={[0.06, 16, 16]} />
                        <meshBasicMaterial
                            color="white"
                            transparent
                            opacity={0.3}
                        />
                    </mesh>
                </group>
            ))}
        </group>
    );
};
