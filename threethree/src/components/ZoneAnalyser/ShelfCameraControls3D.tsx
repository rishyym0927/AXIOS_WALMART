import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface ShelfCameraControls3DProps {
  zoneWidth: number;
  zoneHeight: number;
}

export default function ShelfCameraControls3D({ zoneWidth, zoneHeight }: ShelfCameraControls3DProps) {
  const controls = useRef<any>(null);
  const { camera } = useThree();
  
  useEffect(() => {
    // Position the camera to view the zone in a better position
    const maxDimension = Math.max(zoneWidth, zoneHeight);
    camera.position.set(
      zoneWidth / 2, 
      maxDimension * 1.5, // Height for good overview
      zoneHeight * 1.2   // Distance back
    );
    camera.lookAt(zoneWidth / 2, 0, zoneHeight / 2);
    
    // Ensure the camera and controls are updated
    if (controls.current) {
      controls.current.update();
    }
    
    // Return to clean up
    return () => {
      // Reset camera position
      camera.position.set(0, 0, 0);
      camera.lookAt(0, 0, 0);
    };
  }, [zoneWidth, zoneHeight, camera]);

  return (
    <OrbitControls 
      ref={controls}
      enableDamping={true}
      dampingFactor={0.1}
      rotateSpeed={0.7}
      zoomSpeed={1.2}
      panSpeed={0.8}
      minDistance={2}
      maxDistance={Math.max(zoneWidth, zoneHeight) * 6} // Max distance for zone
      maxPolarAngle={Math.PI / 2 - 0.05} // Prevent going below the ground
      target={[zoneWidth / 2, 0, zoneHeight / 2]} // Look at center of zone
      enablePan={true}
      screenSpacePanning={true}
    />
  );
}
