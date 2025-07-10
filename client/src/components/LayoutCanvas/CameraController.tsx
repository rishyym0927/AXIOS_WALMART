import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function CameraController({ storeWidth, storeHeight, onZoomChange }: { storeWidth: number; storeHeight: number; onZoomChange?: (zoom: number) => void }) {
  const { camera, size } = useThree();

  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      const padding = 5;
      const aspect = size.width / size.height;
      
      const maxSize = Math.max(storeWidth + padding * 2, storeHeight + padding * 2);
      const frustumSize = maxSize;
      
      camera.left = (frustumSize * aspect) / -2;
      camera.right = (frustumSize * aspect) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = frustumSize / -2;
      
      camera.position.set(storeWidth / 2, 25, storeHeight / 2);
      camera.lookAt(storeWidth / 2, 0, storeHeight / 2);
      camera.updateProjectionMatrix();

      if (onZoomChange) {
        const zoomLevel = camera.zoom;
        onZoomChange(zoomLevel);
      }
    }
  }, [camera, storeWidth, storeHeight, size, onZoomChange]);

  return null;
}
