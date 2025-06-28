import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder, Environment, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Box as BoxIcon, RotateCw, Eye, Maximize, Camera } from 'lucide-react';
import { Artifact } from '../types';
import * as THREE from 'three';

interface Enhanced3DViewProps {
  artifacts: Artifact[];
  currentYear: number;
  eventTitle: string;
}

// 3D Model Components
const AncientBuilding: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Base */}
      <Box ref={meshRef} args={[4, 0.5, 4]} position={[0, 0.25, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      
      {/* Columns */}
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
        <Cylinder key={i} args={[0.2, 0.2, 3]} position={[x, 2, 1.5]}>
          <meshStandardMaterial color="#D2B48C" />
        </Cylinder>
      ))}
      
      {/* Roof */}
      <Box args={[5, 0.3, 5]} position={[0, 4, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      
      {/* Text Label */}
      <Text
        position={[0, 5, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Ancient Temple
      </Text>
    </group>
  );
};

const MedievalCastle: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Main Keep */}
      <Box args={[2, 4, 2]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#696969" />
      </Box>
      
      {/* Towers */}
      {[[-2, 0, -2], [2, 0, -2], [-2, 0, 2], [2, 0, 2]].map((pos, i) => (
        <Cylinder key={i} args={[0.5, 0.5, 3]} position={[pos[0], 1.5, pos[2]]}>
          <meshStandardMaterial color="#708090" />
        </Cylinder>
      ))}
      
      {/* Walls */}
      <Box args={[5, 1, 0.2]} position={[0, 0.5, -2.5]}>
        <meshStandardMaterial color="#696969" />
      </Box>
      <Box args={[5, 1, 0.2]} position={[0, 0.5, 2.5]}>
        <meshStandardMaterial color="#696969" />
      </Box>
      <Box args={[0.2, 1, 5]} position={[-2.5, 0.5, 0]}>
        <meshStandardMaterial color="#696969" />
      </Box>
      <Box args={[0.2, 1, 5]} position={[2.5, 0.5, 0]}>
        <meshStandardMaterial color="#696969" />
      </Box>
      
      <Text
        position={[0, 5, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Medieval Castle
      </Text>
    </group>
  );
};

const TradingShip: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const shipRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (shipRef.current) {
      shipRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.2;
      shipRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={shipRef} position={position}>
      {/* Hull */}
      <Box args={[4, 0.5, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      
      {/* Mast */}
      <Cylinder args={[0.1, 0.1, 3]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#654321" />
      </Cylinder>
      
      {/* Sail */}
      <Box args={[0.1, 2, 1.5]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#F5F5DC" />
      </Box>
      
      <Text
        position={[0, 4, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Trading Vessel
      </Text>
    </group>
  );
};

const Scene: React.FC<{ artifacts: Artifact[]; currentYear: number }> = ({ artifacts, currentYear }) => {
  const [models, setModels] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const newModels: JSX.Element[] = [];
    
    artifacts.forEach((artifact, index) => {
      const position: [number, number, number] = [
        (index % 3 - 1) * 8,
        0,
        Math.floor(index / 3) * 8
      ];

      if (artifact.name.toLowerCase().includes('temple') || artifact.name.toLowerCase().includes('building')) {
        newModels.push(<AncientBuilding key={artifact.id} position={position} />);
      } else if (artifact.name.toLowerCase().includes('castle') || artifact.name.toLowerCase().includes('fortress')) {
        newModels.push(<MedievalCastle key={artifact.id} position={position} />);
      } else if (artifact.name.toLowerCase().includes('ship') || artifact.name.toLowerCase().includes('vessel')) {
        newModels.push(<TradingShip key={artifact.id} position={position} />);
      } else {
        // Generic artifact
        newModels.push(
          <group key={artifact.id} position={position}>
            <Box args={[1, 1, 1]}>
              <meshStandardMaterial color="#FFD700" />
            </Box>
            <Text
              position={[0, 2, 0]}
              fontSize={0.3}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {artifact.name}
            </Text>
          </group>
        );
      }
    });

    setModels(newModels);
  }, [artifacts]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[10, 10, 10]} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      {/* Environment */}
      <Environment preset="sunset" />
      
      {/* Ground */}
      <Box args={[50, 0.1, 50]} position={[0, -0.05, 0]}>
        <meshStandardMaterial color="#228B22" />
      </Box>
      
      {/* Models */}
      {models}
      
      {/* Year Display */}
      <Text
        position={[0, 15, 0]}
        fontSize={2}
        color="gold"
        anchorX="center"
        anchorY="middle"
      >
        {currentYear < 0 ? `${Math.abs(currentYear)} BC` : `${currentYear} AD`}
      </Text>
    </>
  );
};

export const Enhanced3DView: React.FC<Enhanced3DViewProps> = ({
  artifacts,
  currentYear,
  eventTitle
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraMode, setCameraMode] = useState<'orbit' | 'fly' | 'first-person'>('orbit');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const captureScreenshot = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `historical-scene-${currentYear}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-black'
    : 'bg-slate-800/90 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 h-full';

  return (
    <motion.div
      className={containerClass}
      initial={false}
      animate={isFullscreen ? { scale: 1 } : { scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <BoxIcon className="w-6 h-6 text-purple-400 mr-3" />
          <h2 className="text-xl font-bold text-white">3D Historical Scene</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCameraMode(prev => 
              prev === 'orbit' ? 'fly' : prev === 'fly' ? 'first-person' : 'orbit'
            )}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg transition-colors"
            title="Camera Mode"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <button
            onClick={captureScreenshot}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg transition-colors"
            title="Screenshot"
          >
            <Camera className="w-4 h-4" />
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg transition-colors"
            title="Fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className={`relative rounded-xl overflow-hidden ${isFullscreen ? 'h-full' : 'h-96'}`}>
        <Canvas
          ref={canvasRef}
          shadows
          camera={{ position: [10, 10, 10], fov: 60 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <Suspense fallback={null}>
            <Scene artifacts={artifacts} currentYear={currentYear} />
          </Suspense>
        </Canvas>
        
        {/* Loading Overlay */}
        {artifacts.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
            <div className="text-center text-gray-400">
              <BoxIcon className="w-12 h-12 mx-auto mb-3 opacity-50 animate-pulse" />
              <p className="text-sm">Loading 3D models...</p>
              <p className="text-xs mt-1">Models will appear as you progress through time</p>
            </div>
          </div>
        )}

        {/* Controls Overlay */}
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-xs">
          <div className="space-y-1">
            <div>Left Click + Drag: Rotate</div>
            <div>Right Click + Drag: Pan</div>
            <div>Scroll: Zoom</div>
            <div>Mode: {cameraMode}</div>
          </div>
        </div>

        {/* Info Overlay */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
          <h3 className="text-white font-medium text-sm">{eventTitle}</h3>
          <p className="text-gray-300 text-xs mt-1">
            {artifacts.length} artifacts • {currentYear < 0 ? `${Math.abs(currentYear)} BC` : `${currentYear} AD`}
          </p>
        </div>
      </div>

      {/* Artifact Timeline */}
      {artifacts.length > 0 && !isFullscreen && (
        <div className="mt-4 border-t border-slate-700 pt-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">3D Models Timeline</h4>
          <div className="flex space-x-2 overflow-x-auto">
            {artifacts.map((artifact, index) => (
              <div
                key={artifact.id}
                className="flex-shrink-0 p-2 bg-slate-700/50 rounded-lg text-xs"
              >
                <div className="text-white font-medium">{artifact.name}</div>
                <div className="text-gray-400">
                  {artifact.year < 0 ? `${Math.abs(artifact.year)} BC` : `${artifact.year} AD`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};