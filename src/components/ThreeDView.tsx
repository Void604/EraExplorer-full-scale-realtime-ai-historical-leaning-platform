import React, { useRef, useEffect, useState } from 'react';
import { Box, Layers, RotateCw, Eye } from 'lucide-react';
import { Artifact } from '../types';

interface ThreeDViewProps {
  artifacts: Artifact[];
  currentYear: number;
  eventTitle: string;
}

export const ThreeDView: React.FC<ThreeDViewProps> = ({ artifacts, currentYear, eventTitle }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isAutoRotate, setIsAutoRotate] = useState(true);

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotate) return;

    const interval = setInterval(() => {
      setRotation(prev => ({
        x: prev.x + 0.5,
        y: prev.y + 0.3
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [isAutoRotate]);

  // Select the most recent artifact
  useEffect(() => {
    if (artifacts.length > 0) {
      const mostRecent = artifacts[artifacts.length - 1];
      setSelectedArtifact(mostRecent);
    } else {
      setSelectedArtifact(null);
    }
  }, [artifacts]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || isAutoRotate) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientY - rect.top - rect.height / 2) / rect.height * 180;
    const y = (e.clientX - rect.left - rect.width / 2) / rect.width * 180;
    
    setRotation({ x, y });
  };

  const formatYear = (year: number) => {
    if (year < 0) return `${Math.abs(year)} BC`;
    return `${year} AD`;
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Box className="w-6 h-6 text-purple-400 mr-3" />
          <h2 className="text-xl font-bold text-white">3D Artifacts</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`p-2 rounded-lg transition-colors ${
              isAutoRotate 
                ? 'bg-purple-400 text-black' 
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="relative bg-slate-900 rounded-xl overflow-hidden mb-4" style={{ height: '300px' }}>
        {selectedArtifact ? (
          <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center cursor-pointer"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsAutoRotate(true)}
            onMouseEnter={() => setIsAutoRotate(false)}
          >
            {/* 3D Model Simulation */}
            <div
              className="relative"
              style={{
                transform: `perspective(800px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transition: isAutoRotate ? 'none' : 'transform 0.1s ease-out'
              }}
            >
              {/* Simulate 3D artifact based on type */}
              {selectedArtifact.name.toLowerCase().includes('tower') && (
                <div className="relative">
                  {/* Tower structure */}
                  <div className="w-16 h-32 bg-gradient-to-b from-stone-400 to-stone-600 transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
                    <div className="absolute inset-0 bg-stone-500" style={{ transform: 'rotateY(-90deg) translateZ(8px)' }} />
                    <div className="absolute inset-0 bg-stone-700" style={{ transform: 'rotateY(90deg) translateZ(-8px)' }} />
                    <div className="absolute top-0 w-full h-8 bg-stone-300" />
                  </div>
                  {/* Windows */}
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-3 h-4 bg-black"
                      style={{
                        top: `${20 + i * 25}px`,
                        left: '6px',
                        transform: 'translateZ(1px)'
                      }}
                    />
                  ))}
                </div>
              )}

              {selectedArtifact.name.toLowerCase().includes('colosseum') && (
                <div className="relative">
                  {/* Colosseum structure */}
                  <div className="w-24 h-16 bg-gradient-to-b from-amber-200 to-amber-600 rounded-full transform-gpu overflow-hidden">
                    {/* Arches */}
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-3 bg-black rounded-t-full"
                        style={{
                          left: `${3 + i * 2.5}px`,
                          top: '4px'
                        }}
                      />
                    ))}
                    {/* Second level */}
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-black rounded-t-full"
                        style={{
                          left: `${5 + i * 2.5}px`,
                          top: '8px'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedArtifact.name.toLowerCase().includes('caravan') && (
                <div className="relative flex items-center space-x-2">
                  {/* Camels */}
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="relative">
                      <div className="w-4 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-lg" />
                      <div className="absolute -top-2 left-1 w-2 h-3 bg-amber-500 rounded-full" />
                      <div className="absolute -bottom-1 left-0 w-1 h-2 bg-amber-700" />
                      <div className="absolute -bottom-1 right-0 w-1 h-2 bg-amber-700" />
                    </div>
                  ))}
                </div>
              )}

              {/* Fallback generic artifact */}
              {!selectedArtifact.name.toLowerCase().includes('tower') && 
               !selectedArtifact.name.toLowerCase().includes('colosseum') && 
               !selectedArtifact.name.toLowerCase().includes('caravan') && (
                <div className="w-20 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
                  <Layers className="w-8 h-8 text-gray-200" />
                </div>
              )}
            </div>

            {/* Controls hint */}
            <div className="absolute bottom-4 left-4 text-xs text-gray-400">
              <Eye className="w-3 h-3 inline mr-1" />
              {isAutoRotate ? 'Auto-rotating' : 'Mouse to rotate'}
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Box className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No artifacts available yet</p>
              <p className="text-xs mt-1">Artifacts will appear as you progress through time</p>
            </div>
          </div>
        )}
      </div>

      {/* Artifact Info */}
      {selectedArtifact && (
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-white">{selectedArtifact.name}</h3>
            <span className="text-xs text-purple-400 bg-purple-400/20 px-2 py-1 rounded">
              {formatYear(selectedArtifact.year)}
            </span>
          </div>
          <p className="text-sm text-gray-300">{selectedArtifact.description}</p>
        </div>
      )}

      {/* Artifact Timeline */}
      {artifacts.length > 1 && (
        <div className="mt-4 border-t border-slate-700 pt-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Available Artifacts</h4>
          <div className="flex space-x-2 overflow-x-auto">
            {artifacts.map(artifact => (
              <button
                key={artifact.id}
                onClick={() => setSelectedArtifact(artifact)}
                className={`flex-shrink-0 p-2 rounded-lg text-xs transition-colors ${
                  selectedArtifact?.id === artifact.id
                    ? 'bg-purple-400 text-black'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {artifact.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};