import React from 'react';

interface StoreFloorProps {
  width: number;
  height: number;
}

export default function StoreFloor({ width, height }: StoreFloorProps) {
  return (
    <group>
      {/* Main floor */}
      <mesh position={[width / 2, -0.1, height / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      
      {/* Surrounding floor area */}
      <mesh position={[width / 2, -0.2, height / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width + 10, height + 10]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
    </group>
  );
}
