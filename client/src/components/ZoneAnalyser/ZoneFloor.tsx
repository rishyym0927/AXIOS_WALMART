import React from 'react';
import * as THREE from 'three';

interface ZoneFloorProps {
  width: number;
  height: number;
}

export default function ZoneFloor({ width, height }: ZoneFloorProps) {
  return (
    <group>
      {/* Zone floor */}
      <mesh position={[width / 2, -0.1, height / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#f8f9fa" />
      </mesh>
      
      {/* Zone border/walls */}
      <mesh position={[width / 2, 0.05, height / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#e9ecef" transparent opacity={0.3} />
      </mesh>
      
      {/* Zone boundary lines */}
      <lineSegments position={[width / 2, 0.01, height / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(width, height)]} />
        <lineBasicMaterial color="#6c757d" linewidth={2} />
      </lineSegments>
    </group>
  );
}
