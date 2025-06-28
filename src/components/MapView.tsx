import React, { useEffect, useRef } from 'react';
import { Map, Navigation, Compass } from 'lucide-react';
import { MapData } from '../types';

interface MapViewProps {
  mapData: MapData | null;
  currentYear: number;
  eventTitle: string;
}

export const MapView: React.FC<MapViewProps> = ({ mapData, currentYear, eventTitle }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !mapData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2);

    // Draw world map background (simplified)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);

    // Convert coordinates to canvas coordinates
    const toCanvasCoords = (lat: number, lng: number): [number, number] => {
      const x = ((lng + 180) / 360) * (canvas.width / 2);
      const y = ((90 - lat) / 180) * (canvas.height / 2);
      return [x, y];
    };

    // Draw territories
    mapData.territories.forEach(territory => {
      if (territory.coordinates.length < 3) return;

      ctx.globalAlpha = territory.opacity;
      ctx.fillStyle = territory.color;
      ctx.strokeStyle = territory.color;
      ctx.lineWidth = 2;

      ctx.beginPath();
      const [startX, startY] = toCanvasCoords(territory.coordinates[0][0], territory.coordinates[0][1]);
      ctx.moveTo(startX, startY);

      for (let i = 1; i < territory.coordinates.length; i++) {
        const [x, y] = toCanvasCoords(territory.coordinates[i][0], territory.coordinates[i][1]);
        ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

    // Draw routes
    mapData.routes.forEach(route => {
      if (route.path.length < 2) return;

      ctx.globalAlpha = 1;
      ctx.strokeStyle = route.color;
      ctx.lineWidth = 3;
      ctx.setLineDash(route.animated ? [10, 5] : []);

      ctx.beginPath();
      const [startX, startY] = toCanvasCoords(route.path[0][0], route.path[0][1]);
      ctx.moveTo(startX, startY);

      for (let i = 1; i < route.path.length; i++) {
        const [x, y] = toCanvasCoords(route.path[i][0], route.path[i][1]);
        ctx.lineTo(x, y);
      }

      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw cities
    mapData.cities.forEach(city => {
      const [x, y] = toCanvasCoords(city.coordinates[0], city.coordinates[1]);
      
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;

      const radius = Math.max(3, city.size);
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // City name
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(city.name, x, y - radius - 5);
    });

    ctx.globalAlpha = 1;
  }, [mapData]);

  const formatYear = (year: number) => {
    if (year < 0) return `${Math.abs(year)} BC`;
    return `${year} AD`;
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Map className="w-6 h-6 text-blue-400 mr-3" />
          <h2 className="text-xl font-bold text-white">Geographic View</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-400">
            <Compass className="w-4 h-4 mr-2" />
            {formatYear(currentYear)}
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative bg-slate-900 rounded-xl overflow-hidden" style={{ height: '400px' }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {/* Overlay Info */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
          <h3 className="text-white font-medium text-sm">{eventTitle}</h3>
          <p className="text-gray-300 text-xs mt-1">
            {mapData ? `${mapData.territories.length} territories, ${mapData.cities.length} cities` : 'Loading...'}
          </p>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 space-y-2">
          <div className="flex items-center text-xs text-gray-300">
            <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2" />
            Cities
          </div>
          <div className="flex items-center text-xs text-gray-300">
            <div className="w-3 h-1 bg-blue-400 mr-2" />
            Trade Routes
          </div>
          <div className="flex items-center text-xs text-gray-300">
            <div className="w-3 h-3 bg-red-400/50 mr-2" />
            Territories
          </div>
        </div>

        {/* Loading state */}
        {!mapData && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <Navigation className="w-8 h-8 mx-auto mb-2 animate-spin" />
              <p className="text-sm">Loading map data...</p>
            </div>
          </div>
        )}
      </div>

      {/* Map Controls */}
      <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
        <span>Interactive historical map visualization</span>
        <span>Zoom and pan to explore</span>
      </div>
    </div>
  );
};