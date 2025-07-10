import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ShelfCameraControllerProps {
  zoneWidth: number;
  zoneHeight: number;
}

export default function ShelfCameraController({ zoneWidth, zoneHeight }: ShelfCameraControllerProps) {
  const { camera, size } = useThree();

  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      const padding = 2;
      const aspect = size.width / size.height;
      
      const maxSize = Math.max(zoneWidth + padding * 2, zoneHeight + padding * 2);
      const frustumSize = maxSize;
      
      camera.left = (frustumSize * aspect) / -2;
      camera.right = (frustumSize * aspect) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = frustumSize / -2;
      
      camera.position.set(zoneWidth / 2, 15, zoneHeight / 2);
      camera.lookAt(zoneWidth / 2, 0, zoneHeight / 2);
      camera.updateProjectionMatrix();
    }
  }, [camera, zoneWidth, zoneHeight, size]);

  return null;
}
