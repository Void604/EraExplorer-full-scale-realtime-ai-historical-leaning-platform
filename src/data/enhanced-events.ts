import { HistoricalEvent } from '../types';

export const enhancedHistoricalEvents: HistoricalEvent[] = [
  {
    id: 'great-wall',
    title: 'The Great Wall of China',
    description: 'A monumental fortification built across the historical northern borders of ancient Chinese states and later unified China.',
    period: '7th Century BC - 17th Century AD',
    startYear: -700,
    endYear: 1644,
    category: 'military',
    image: 'https://images.pexels.com/photos/2412603/pexels-photo-2412603.jpeg',
    color: '#D4AF37',
    difficulty: 'intermediate',
    tags: ['architecture', 'defense', 'china', 'ancient'],
    popularity: 95,
    lastUpdated: '2024-01-15',
    relatedEvents: ['mongol-invasions', 'qin-dynasty'],
    timeline: [
      {
        id: 'gw-1',
        year: -700,
        title: 'Early Fortifications Begin',
        description: 'Warring states begin building defensive walls to protect their territories',
        detailedDescription: 'During the Warring States period, various Chinese states began constructing defensive walls to protect their borders from neighboring states and nomadic invasions.',
        type: 'major',
        coordinates: [40.4319, 116.5704],
        significance: 6,
        sources: [
          {
            id: 'gw-source-1',
            title: 'Records of the Grand Historian',
            author: 'Sima Qian',
            year: -100,
            type: 'book',
            reliability: 8
          }
        ]
      },
      {
        id: 'gw-2',
        year: -220,
        title: 'Qin Dynasty Unification',
        description: 'Emperor Qin Shi Huang orders the connection and extension of existing walls',
        detailedDescription: 'The first Emperor of China ordered the connection of existing walls built by former warring states, creating the first unified wall system.',
        type: 'milestone',
        coordinates: [40.4319, 116.5704],
        significance: 10,
        participants: ['Qin Shi Huang', 'General Meng Tian'],
        sources: [
          {
            id: 'gw-source-2',
            title: 'The First Emperor of China',
            author: 'Jonathan Clements',
            year: 2006,
            type: 'book',
            reliability: 9
          }
        ]
      },
      {
        id: 'gw-3',
        year: 1368,
        title: 'Ming Dynasty Reconstruction',
        description: 'Major reconstruction and fortification of the wall using brick and stone',
        detailedDescription: 'The Ming Dynasty undertook massive reconstruction efforts, creating most of the wall that exists today.',
        type: 'major',
        coordinates: [40.4319, 116.5704],
        significance: 8,
        sources: []
      }
    ],
    mapData: [
      {
        year: -700,
        territories: [
          {
            id: 'warring-states',
            name: 'Warring States',
            coordinates: [[35, 110], [40, 110], [40, 120], [35, 120]],
            color: '#8B4513',
            opacity: 0.6,
            type: 'kingdom',
            population: 50000000
          }
        ],
        routes: [],
        cities: [
          { 
            id: 'beijing-ancient', 
            name: 'Ancient Beijing', 
            coordinates: [39.9042, 116.4074], 
            size: 5, 
            importance: 8,
            type: 'capital',
            population: 100000,
            founded: -1000
          }
        ],
        battles: [],
        movements: [],
        resources: [
          {
            id: 'iron-deposits',
            name: 'Iron Deposits',
            coordinates: [40.0, 116.0],
            type: 'iron',
            importance: 8,
            discovered: -800
          }
        ]
      }
    ],
    artifacts: [
      {
        id: 'gw-tower',
        name: 'Ming Dynasty Watchtower',
        description: 'Defensive tower structure with advanced architectural features',
        year: 1400,
        type: '3d-model',
        location: [40.4319, 116.5704],
        material: 'Brick and Stone',
        dimensions: { width: 10, height: 15, depth: 10 },
        culturalSignificance: 9,
        condition: 'good',
        currentLocation: 'Badaling Section, China'
      }
    ],
    multimedia: [
      {
        id: 'gw-video-1',
        type: 'video',
        url: '/videos/great-wall-construction.mp4',
        title: 'Great Wall Construction Techniques',
        description: 'Documentary showing ancient construction methods',
        duration: 300,
        source: 'National Geographic',
        license: 'Educational Use',
        tags: ['construction', 'engineering', 'history']
      }
    ],
    historicalFigures: [
      {
        id: 'qin-shi-huang',
        name: 'Qin Shi Huang',
        birth: -259,
        death: -210,
        role: 'First Emperor of China',
        description: 'Unified China and ordered the construction of the Great Wall',
        achievements: ['Unified China', 'Standardized currency', 'Built Great Wall'],
        relationships: [],
        locations: [[34.3416, 108.9398]]
      }
    ],
    sources: [
      {
        id: 'gw-main-source',
        title: 'The Great Wall of China: A Comprehensive History',
        author: 'Julia Lovell',
        year: 2006,
        type: 'book',
        reliability: 9,
        description: 'Comprehensive academic study of the Great Wall'
      }
    ]
  },
  {
    id: 'roman-empire',
    title: 'Rise and Fall of the Roman Empire',
    description: 'The expansion, consolidation, and eventual decline of Roman power across the Mediterranean world.',
    period: '753 BC - 476 AD',
    startYear: -753,
    endYear: 476,
    category: 'empire',
    image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg',
    color: '#DC143C',
    difficulty: 'advanced',
    tags: ['empire', 'military', 'politics', 'culture'],
    popularity: 98,
    lastUpdated: '2024-01-15',
    relatedEvents: ['punic-wars', 'fall-of-constantinople'],
    timeline: [
      {
        id: 're-1',
        year: -753,
        title: 'Founding of Rome',
        description: 'Legendary founding of Rome by Romulus and Remus',
        detailedDescription: 'According to Roman mythology, Rome was founded by the twin brothers Romulus and Remus, who were raised by a she-wolf.',
        type: 'milestone',
        coordinates: [41.9028, 12.4964],
        significance: 10,
        sources: []
      },
      {
        id: 're-2',
        year: -509,
        title: 'Roman Republic Established',
        description: 'Overthrow of the last Roman king and establishment of the Republic',
        detailedDescription: 'The Roman Republic was established after the overthrow of Tarquin the Proud, the last Roman king.',
        type: 'major',
        coordinates: [41.9028, 12.4964],
        significance: 9,
        sources: []
      },
      {
        id: 're-3',
        year: -264,
        title: 'First Punic War Begins',
        description: 'Rome begins its conflict with Carthage for control of the Mediterranean',
        detailedDescription: 'The First Punic War marked Rome\'s first major overseas conflict and the beginning of its imperial expansion.',
        type: 'battle',
        coordinates: [37.0, 14.0],
        significance: 8,
        casualties: 100000,
        participants: ['Rome', 'Carthage'],
        outcome: 'Roman Victory',
        sources: []
      },
      {
        id: 're-4',
        year: -27,
        title: 'Augustus Becomes Emperor',
        description: 'Octavian becomes Augustus, the first Roman Emperor',
        detailedDescription: 'The Roman Republic transforms into the Roman Empire under Augustus Caesar.',
        type: 'milestone',
        coordinates: [41.9028, 12.4964],
        significance: 10,
        sources: []
      },
      {
        id: 're-5',
        year: 476,
        title: 'Fall of Western Roman Empire',
        description: 'Odoacer deposes the last Western Roman Emperor',
        detailedDescription: 'The Germanic chieftain Odoacer deposes Romulus Augustulus, marking the end of the Western Roman Empire.',
        type: 'milestone',
        coordinates: [45.4642, 9.1900],
        significance: 10,
        sources: []
      }
    ],
    mapData: [
      {
        year: -753,
        territories: [
          {
            id: 'early-rome',
            name: 'Early Rome',
            coordinates: [[41.5, 12], [42, 12], [42, 13], [41.5, 13]],
            color: '#DC143C',
            opacity: 0.7,
            type: 'city-state',
            population: 50000
          }
        ],
        routes: [],
        cities: [
          { 
            id: 'rome', 
            name: 'Rome', 
            coordinates: [41.9028, 12.4964], 
            size: 10, 
            importance: 10,
            type: 'capital',
            population: 50000,
            founded: -753
          }
        ],
        battles: [],
        movements: [],
        resources: []
      },
      {
        year: 117,
        territories: [
          {
            id: 'roman-empire-peak',
            name: 'Roman Empire at Peak',
            coordinates: [
              [60, -10], [60, 50], [30, 50], [30, 40], [35, 35], [40, 30], [30, -10]
            ],
            color: '#DC143C',
            opacity: 0.6,
            type: 'empire',
            population: 65000000,
            ruler: 'Trajan'
          }
        ],
        routes: [
          {
            id: 'via-appia',
            name: 'Via Appia',
            path: [[41.9, 12.5], [40.6, 14.3], [40.9, 17.1]],
            color: '#8B4513',
            animated: false,
            type: 'trade',
            active: true,
            importance: 9
          }
        ],
        cities: [
          { id: 'rome', name: 'Rome', coordinates: [41.9028, 12.4964], size: 15, importance: 10, type: 'capital', population: 1000000 },
          { id: 'alexandria', name: 'Alexandria', coordinates: [31.2001, 29.9187], size: 12, importance: 9, type: 'trade', population: 400000 },
          { id: 'antioch', name: 'Antioch', coordinates: [36.2, 36.15], size: 10, importance: 8, type: 'trade', population: 300000 }
        ],
        battles: [],
        movements: [],
        resources: []
      }
    ],
    artifacts: [
      {
        id: 're-colosseum',
        name: 'Colosseum',
        description: 'Iconic Roman amphitheater, symbol of Imperial Rome',
        year: 80,
        type: '3d-model',
        location: [41.8902, 12.4922],
        material: 'Travertine, Tuff, Brick',
        dimensions: { width: 189, height: 50, depth: 156 },
        culturalSignificance: 10,
        condition: 'fair',
        currentLocation: 'Rome, Italy'
      },
      {
        id: 're-forum',
        name: 'Roman Forum',
        description: 'Center of political, commercial and judicial life in ancient Rome',
        year: -500,
        type: '3d-model',
        location: [41.8925, 12.4853],
        material: 'Marble, Travertine',
        dimensions: { width: 160, height: 20, depth: 130 },
        culturalSignificance: 10,
        condition: 'poor',
        currentLocation: 'Rome, Italy'
      }
    ],
    multimedia: [],
    historicalFigures: [
      {
        id: 'julius-caesar',
        name: 'Julius Caesar',
        birth: -100,
        death: -44,
        role: 'Roman General and Dictator',
        description: 'Conquered Gaul and crossed the Rubicon, leading to the end of the Roman Republic',
        achievements: ['Conquered Gaul', 'Crossed the Rubicon', 'Reformed the calendar'],
        relationships: [
          { type: 'enemy', personId: 'pompey' },
          { type: 'ally', personId: 'mark-antony' }
        ],
        locations: [[41.9028, 12.4964], [48.8566, 2.3522]]
      },
      {
        id: 'augustus',
        name: 'Augustus Caesar',
        birth: -63,
        death: 14,
        role: 'First Roman Emperor',
        description: 'First Roman Emperor, established the Principate and Pax Romana',
        achievements: ['First Emperor', 'Established Pax Romana', 'Administrative reforms'],
        relationships: [
          { type: 'family', personId: 'julius-caesar' }
        ],
        locations: [[41.9028, 12.4964]]
      }
    ],
    sources: [
      {
        id: 're-source-1',
        title: 'The History of the Decline and Fall of the Roman Empire',
        author: 'Edward Gibbon',
        year: 1776,
        type: 'book',
        reliability: 8,
        description: 'Classic work on the fall of Rome'
      }
    ]
  },
  {
    id: 'silk-road',
    title: 'The Silk Road Trade Network',
    description: 'Ancient network of trade routes connecting East and West, facilitating cultural and economic exchange.',
    period: '130 BC - 1453 AD',
    startYear: -130,
    endYear: 1453,
    category: 'exploration',
    image: 'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg',
    color: '#4169E1',
    difficulty: 'intermediate',
    tags: ['trade', 'exploration', 'cultural-exchange', 'economics'],
    popularity: 87,
    lastUpdated: '2024-01-15',
    relatedEvents: ['mongol-empire', 'marco-polo'],
    timeline: [
      {
        id: 'sr-1',
        year: -130,
        title: 'Zhang Qian\'s Mission',
        description: 'Chinese explorer Zhang Qian opens trade routes to Central Asia',
        detailedDescription: 'Emperor Wu of Han sent Zhang Qian on a diplomatic mission that established the foundation of the Silk Road.',
        type: 'milestone',
        coordinates: [34.3416, 108.9398],
        significance: 9,
        sources: []
      },
      {
        id: 'sr-2',
        year: 100,
        title: 'Peak Trade Period',
        description: 'Silk Road reaches its golden age with extensive trade networks',
        detailedDescription: 'The Silk Road flourished during the Han Dynasty and Roman Empire, facilitating unprecedented cultural exchange.',
        type: 'major',
        coordinates: [40.0583, 64.4056],
        significance: 8,
        sources: []
      },
      {
        id: 'sr-3',
        year: 1271,
        title: 'Marco Polo\'s Journey',
        description: 'Venetian explorer Marco Polo travels the Silk Road to China',
        detailedDescription: 'Marco Polo\'s famous journey brought detailed knowledge of Asia to Europe.',
        type: 'discovery',
        coordinates: [39.9042, 116.4074],
        significance: 7,
        sources: []
      },
      {
        id: 'sr-4',
        year: 1453,
        title: 'Ottoman Control',
        description: 'Ottoman Empire gains control of key trade routes, leading to decline',
        detailedDescription: 'The fall of Constantinople to the Ottomans disrupted traditional trade routes.',
        type: 'major',
        coordinates: [41.0082, 28.9784],
        significance: 8,
        sources: []
      }
    ],
    mapData: [
      {
        year: -130,
        territories: [],
        routes: [
          {
            id: 'silk-route-main',
            name: 'Main Silk Route',
            path: [
              [34.3416, 108.9398], // Xi'an
              [43.2551, 76.9126], // Almaty
              [39.6542, 66.9597], // Samarkand
              [35.6892, 51.3890], // Tehran
              [33.3152, 44.3661], // Baghdad
              [41.0082, 28.9784]  // Constantinople
            ],
            color: '#4169E1',
            animated: true,
            type: 'trade',
            active: true,
            importance: 10
          }
        ],
        cities: [
          { id: 'xian', name: "Xi'an", coordinates: [34.3416, 108.9398], size: 8, importance: 9, type: 'trade', population: 200000 },
          { id: 'samarkand', name: 'Samarkand', coordinates: [39.6542, 66.9597], size: 7, importance: 8, type: 'trade', population: 100000 },
          { id: 'constantinople', name: 'Constantinople', coordinates: [41.0082, 28.9784], size: 9, importance: 9, type: 'trade', population: 300000 }
        ],
        battles: [],
        movements: [],
        resources: [
          {
            id: 'silk-production',
            name: 'Silk Production',
            coordinates: [34.3416, 108.9398],
            type: 'silk',
            importance: 10,
            discovered: -2700
          },
          {
            id: 'spice-trade',
            name: 'Spice Markets',
            coordinates: [39.6542, 66.9597],
            type: 'spices',
            importance: 9,
            discovered: -500
          }
        ]
      }
    ],
    artifacts: [
      {
        id: 'sr-caravan',
        name: 'Silk Road Caravan',
        description: 'Trading caravan with camels carrying precious goods',
        year: 200,
        type: '3d-model',
        location: [39.6542, 66.9597],
        material: 'Various trade goods',
        dimensions: { width: 50, height: 3, depth: 200 },
        culturalSignificance: 8,
        condition: 'excellent',
        currentLocation: 'Museum reconstruction'
      }
    ],
    multimedia: [],
    historicalFigures: [
      {
        id: 'zhang-qian',
        name: 'Zhang Qian',
        birth: -164,
        death: -113,
        role: 'Chinese Explorer and Diplomat',
        description: 'Opened the Silk Road trade routes for the Han Dynasty',
        achievements: ['Established Silk Road', 'Diplomatic missions to Central Asia'],
        relationships: [],
        locations: [[34.3416, 108.9398], [40.0583, 64.4056]]
      },
      {
        id: 'marco-polo',
        name: 'Marco Polo',
        birth: 1254,
        death: 1324,
        role: 'Venetian Explorer',
        description: 'Famous for his travels along the Silk Road to China',
        achievements: ['Traveled to China', 'Wrote detailed accounts of Asia'],
        relationships: [],
        locations: [[45.4408, 12.3155], [39.9042, 116.4074]]
      }
    ],
    sources: []
  }
];

export { enhancedHistoricalEvents as historicalEvents };