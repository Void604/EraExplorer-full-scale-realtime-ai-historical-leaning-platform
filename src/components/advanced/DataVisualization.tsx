import React, { useMemo, useState } from 'react';
import { BarChart3, TrendingUp, PieChart, Activity, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { HistoricalEvent, TimelineEvent } from '../../types';

interface DataVisualizationProps {
  event: HistoricalEvent;
  currentEvents: TimelineEvent[];
  currentYear: number;
}

interface ChartData {
  year: number;
  events: number;
  battles: number;
  treaties: number;
  discoveries: number;
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({
  event,
  currentEvents,
  currentYear
}) => {
  const [activeChart, setActiveChart] = useState<'timeline' | 'types' | 'significance' | 'casualties'>('timeline');
  const [timeRange, setTimeRange] = useState<'all' | 'century' | 'decade'>('all');

  // Process data for visualizations
  const chartData = useMemo(() => {
    const data: ChartData[] = [];
    const yearRange = event.endYear - event.startYear;
    const interval = timeRange === 'decade' ? 10 : timeRange === 'century' ? 100 : Math.max(1, Math.floor(yearRange / 20));

    for (let year = event.startYear; year <= event.endYear; year += interval) {
      const eventsInRange = event.timeline.filter(e => 
        e.year >= year && e.year < year + interval
      );

      data.push({
        year,
        events: eventsInRange.length,
        battles: eventsInRange.filter(e => e.type === 'battle').length,
        treaties: eventsInRange.filter(e => e.type === 'treaty').length,
        discoveries: eventsInRange.filter(e => e.type === 'discovery').length
      });
    }

    return data;
  }, [event, timeRange]);

  const eventTypeData = useMemo(() => {
    const types = currentEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(types).map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count,
      percentage: (count / currentEvents.length) * 100
    }));
  }, [currentEvents]);

  const significanceData = useMemo(() => {
    return currentEvents.map(event => ({
      year: event.year,
      significance: event.significance || 5,
      title: event.title
    })).sort((a, b) => b.significance - a.significance);
  }, [currentEvents]);

  const casualtyData = useMemo(() => {
    return currentEvents
      .filter(event => event.casualties && event.casualties > 0)
      .map(event => ({
        year: event.year,
        casualties: event.casualties!,
        title: event.title
      }))
      .sort((a, b) => b.casualties - a.casualties);
  }, [currentEvents]);

  const formatYear = (year: number) => {
    if (year < 0) return `${Math.abs(year)} BC`;
    return `${year} AD`;
  };

  const getMaxValue = (data: any[], key: string) => {
    return Math.max(...data.map(d => d[key]));
  };

  const renderTimelineChart = () => {
    const maxEvents = getMaxValue(chartData, 'events');
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-white">Events Over Time</h4>
          <div className="flex space-x-2">
            {['all', 'century', 'decade'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  timeRange === range
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-48 flex items-end space-x-1 overflow-x-auto">
          {chartData.map((data, index) => (
            <motion.div
              key={data.year}
              initial={{ height: 0 }}
              animate={{ height: `${(data.events / maxEvents) * 100}%` }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg min-w-[20px] relative group cursor-pointer"
            >
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <div>{formatYear(data.year)}</div>
                <div>{data.events} events</div>
                <div>{data.battles} battles</div>
                <div>{data.treaties} treaties</div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-between text-xs text-gray-400">
          <span>{formatYear(event.startYear)}</span>
          <span>{formatYear(event.endYear)}</span>
        </div>
      </div>
    );
  };

  const renderEventTypesChart = () => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    
    return (
      <div className="space-y-4">
        <h4 className="font-medium text-white">Event Types Distribution</h4>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Pie Chart Representation */}
          <div className="space-y-2">
            {eventTypeData.map((item, index) => (
              <motion.div
                key={item.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg"
              >
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="text-sm text-white">{item.type}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{item.count}</div>
                  <div className="text-xs text-gray-400">{item.percentage.toFixed(1)}%</div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Visual Bars */}
          <div className="space-y-2">
            {eventTypeData.map((item, index) => (
              <div key={item.type} className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{item.type}</span>
                  <span>{item.count}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSignificanceChart = () => {
    const maxSignificance = getMaxValue(significanceData, 'significance');
    
    return (
      <div className="space-y-4">
        <h4 className="font-medium text-white">Event Significance Ranking</h4>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {significanceData.slice(0, 10).map((item, index) => (
            <motion.div
              key={`${item.year}-${item.title}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center space-x-3 p-2 bg-slate-700/30 rounded-lg"
            >
              <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-black">
                {index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{item.title}</div>
                <div className="text-xs text-gray-400">{formatYear(item.year)}</div>
              </div>
              
              <div className="flex-shrink-0 flex items-center space-x-2">
                <div className="w-16 h-2 bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                    style={{ width: `${(item.significance / maxSignificance) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-8 text-right">{item.significance}/10</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderCasualtyChart = () => {
    if (casualtyData.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No casualty data available for current events</p>
        </div>
      );
    }

    const maxCasualties = getMaxValue(casualtyData, 'casualties');
    
    return (
      <div className="space-y-4">
        <h4 className="font-medium text-white">Battle Casualties</h4>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {casualtyData.map((item, index) => (
            <motion.div
              key={`${item.year}-${item.title}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center space-x-3 p-2 bg-slate-700/30 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{item.title}</div>
                <div className="text-xs text-gray-400">{formatYear(item.year)}</div>
              </div>
              
              <div className="flex-shrink-0 flex items-center space-x-2">
                <div className="w-20 h-2 bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full"
                    style={{ width: `${(item.casualties / maxCasualties) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-16 text-right">
                  {item.casualties.toLocaleString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const charts = {
    timeline: { icon: BarChart3, label: 'Timeline', render: renderTimelineChart },
    types: { icon: PieChart, label: 'Event Types', render: renderEventTypesChart },
    significance: { icon: TrendingUp, label: 'Significance', render: renderSignificanceChart },
    casualties: { icon: Activity, label: 'Casualties', render: renderCasualtyChart }
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BarChart3 className="w-6 h-6 text-green-400 mr-3" />
          <h2 className="text-xl font-bold text-white">Data Analytics</h2>
        </div>
        
        <div className="flex items-center space-x-1 bg-slate-700/50 rounded-lg p-1">
          {Object.entries(charts).map(([key, chart]) => {
            const IconComponent = chart.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveChart(key as any)}
                className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeChart === key
                    ? 'bg-green-400 text-black'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {chart.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Content */}
      <div className="min-h-[300px]">
        {charts[activeChart].render()}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{currentEvents.length}</div>
          <div className="text-xs text-gray-400">Total Events</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {Math.round(((currentYear - event.startYear) / (event.endYear - event.startYear)) * 100)}%
          </div>
          <div className="text-xs text-gray-400">Progress</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {new Set(currentEvents.map(e => e.type)).size}
          </div>
          <div className="text-xs text-gray-400">Event Types</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {currentEvents.filter(e => e.type === 'milestone').length}
          </div>
          <div className="text-xs text-gray-400">Milestones</div>
        </div>
      </div>
    </div>
  );
};