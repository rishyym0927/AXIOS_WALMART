import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface CameraControlsProps {
  storeWidth: number;
  storeHeight: number;
}

export default function CameraControls3D({ storeWidth, storeHeight }: CameraControlsProps) {
  const controls = useRef<any>(null);
  const { camera } = useThree();
  
  useEffect(() => {
    // Position the camera to view the store in a better position - moved further back
    const maxDimension = Math.max(storeWidth, storeHeight);
    camera.position.set(
      storeWidth / 2, 
      maxDimension * 1.2, // Increased height for better overview
      storeHeight * 1.5   // Moved further back
    );
    camera.lookAt(storeWidth / 2, 0, storeHeight / 2);
    
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
  }, [storeWidth, storeHeight, camera]);

  return (
    <OrbitControls 
      ref={controls}
      enableDamping={true}
      dampingFactor={0.1}
      rotateSpeed={0.7}
      zoomSpeed={1.2}
      panSpeed={0.8}
      minDistance={3}
      maxDistance={Math.max(storeWidth, storeHeight) * 8} // Increased max distance
      maxPolarAngle={Math.PI / 2 - 0.05} // Prevent going below the ground
      target={[storeWidth / 2, 0, storeHeight / 2]} // Look at center of store
      enablePan={true} // Allow panning
      screenSpacePanning={true} // More intuitive panning
    />
  );
}
