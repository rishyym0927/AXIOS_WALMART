import React, { useMemo } from 'react';
import * as THREE from 'three';

export default function GridLines({ width, height }: { width: number; height: number }) {
  const lines = useMemo(() => {
    const points: THREE.Vector3[] = [];
    
    for (let i = 0; i <= width; i++) {
      points.push(new THREE.Vector3(i, 0, 0));
      points.push(new THREE.Vector3(i, 0, height));
    }
    
    for (let i = 0; i <= height; i++) {
      points.push(new THREE.Vector3(0, 0, i));
      points.push(new THREE.Vector3(width, 0, i));
    }
    
    return points;
  }, [width, height]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={lines.length}
          array={new Float32Array(lines.flatMap(v => [v.x, v.y, v.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#cbd5e1" linewidth={0.5} /> {/* Softer grid line color */}
    </line>
  );
}
