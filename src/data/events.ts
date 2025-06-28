import { HistoricalEvent } from '../types';

export const historicalEvents: HistoricalEvent[] = [
  {
    id: 'great-wall',
    title: 'The Great Wall of China',
    description: 'A monumental fortification built across the historical northern borders of ancient Chinese states and Imperial China.',
    period: '7th Century BC - 17th Century AD',
    startYear: -700,
    endYear: 1644,
    category: 'military',
    image: 'https://images.pexels.com/photos/2412603/pexels-photo-2412603.jpeg',
    color: '#D4AF37',
    difficulty: 'intermediate',
    tags: ['architecture', 'defense', 'china', 'ancient'],
    timeline: [
      {
        id: 'gw-1',
        year: -700,
        title: 'Early Fortifications Begin',
        description: 'Warring states begin building defensive walls to protect their territories from invasions.',
        type: 'major',
        coordinates: [40.4319, 116.5704],
        significance: 6
      },
      {
        id: 'gw-2',
        year: -220,
        title: 'Qin Dynasty Unification',
        description: 'Emperor Qin Shi Huang orders the connection and extension of existing walls into a unified defense system.',
        type: 'milestone',
        coordinates: [40.4319, 116.5704],
        significance: 10
      },
      {
        id: 'gw-3',
        year: 1368,
        title: 'Ming Dynasty Reconstruction',
        description: 'Major reconstruction and fortification of the wall using brick and stone, creating most of what exists today.',
        type: 'major',
        coordinates: [40.4319, 116.5704],
        significance: 8
      },
      {
        id: 'gw-4',
        year: 1644,
        title: 'End of Major Construction',
        description: 'The fall of the Ming Dynasty marks the end of major construction and maintenance of the Great Wall.',
        type: 'milestone',
        coordinates: [40.4319, 116.5704],
        significance: 7
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
        ]
      },
      {
        year: -220,
        territories: [
          {
            id: 'qin-empire',
            name: 'Qin Empire',
            coordinates: [[30, 105], [45, 105], [45, 125], [30, 125]],
            color: '#D4AF37',
            opacity: 0.7,
            type: 'empire',
            population: 20000000
          }
        ],
        routes: [
          {
            id: 'wall-route',
            name: 'Great Wall Route',
            path: [[40.4, 116.6], [40.5, 117.2], [40.3, 118.1]],
            color: '#8B4513',
            animated: false,
            type: 'defense'
          }
        ],
        cities: [
          { id: 'beijing', name: 'Beijing', coordinates: [39.9042, 116.4074], size: 8, importance: 9, type: 'capital' },
          { id: 'xian', name: "Xi'an", coordinates: [34.3416, 108.9398], size: 7, importance: 8, type: 'capital' }
        ]
      }
    ],
    artifacts: [
      {
        id: 'gw-tower',
        name: 'Ming Dynasty Watchtower',
        description: 'Defensive tower structure with advanced architectural features from the Ming period.',
        year: 1400,
        type: '3d-model',
        location: [40.4319, 116.5704],
        material: 'Brick and Stone',
        dimensions: { width: 10, height: 15, depth: 10 },
        culturalSignificance: 9,
        condition: 'good',
        currentLocation: 'Badaling Section, China'
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
    timeline: [
      {
        id: 're-1',
        year: -753,
        title: 'Founding of Rome',
        description: 'Legendary founding of Rome by Romulus and Remus, establishing the city that would become an empire.',
        type: 'milestone',
        coordinates: [41.9028, 12.4964],
        significance: 10
      },
      {
        id: 're-2',
        year: -509,
        title: 'Roman Republic Established',
        description: 'Overthrow of the last Roman king and establishment of the Roman Republic with its complex political system.',
        type: 'major',
        coordinates: [41.9028, 12.4964],
        significance: 9
      },
      {
        id: 're-3',
        year: -264,
        title: 'First Punic War Begins',
        description: 'Rome begins its conflict with Carthage for control of the Mediterranean, marking the start of imperial expansion.',
        type: 'battle',
        coordinates: [37.0, 14.0],
        significance: 8,
        casualties: 100000
      },
      {
        id: 're-4',
        year: -27,
        title: 'Augustus Becomes Emperor',
        description: 'Octavian becomes Augustus, the first Roman Emperor, transforming the Republic into the Empire.',
        type: 'milestone',
        coordinates: [41.9028, 12.4964],
        significance: 10
      },
      {
        id: 're-5',
        year: 117,
        title: 'Empire at Greatest Extent',
        description: 'Under Emperor Trajan, the Roman Empire reaches its greatest territorial extent.',
        type: 'milestone',
        coordinates: [41.9028, 12.4964],
        significance: 9
      },
      {
        id: 're-6',
        year: 476,
        title: 'Fall of Western Roman Empire',
        description: 'Odoacer deposes the last Western Roman Emperor, marking the end of the Western Roman Empire.',
        type: 'milestone',
        coordinates: [45.4642, 9.1900],
        significance: 10
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
        ]
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
            population: 65000000
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
        ]
      }
    ],
    artifacts: [
      {
        id: 're-colosseum',
        name: 'Colosseum',
        description: 'Iconic Roman amphitheater, symbol of Imperial Rome and architectural marvel.',
        year: 80,
        type: '3d-model',
        location: [41.8902, 12.4922],
        material: 'Travertine, Tuff, Brick',
        dimensions: { width: 189, height: 50, depth: 156 },
        culturalSignificance: 10,
        condition: 'fair',
        currentLocation: 'Rome, Italy'
      }
    ]
  },
  {
    id: 'silk-road',
    title: 'The Silk Road Trade Network',
    description: 'Ancient network of trade routes connecting East and West, facilitating cultural and economic exchange across continents.',
    period: '130 BC - 1453 AD',
    startYear: -130,
    endYear: 1453,
    category: 'exploration',
    image: 'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg',
    color: '#4169E1',
    difficulty: 'intermediate',
    tags: ['trade', 'exploration', 'cultural-exchange', 'economics'],
    timeline: [
      {
        id: 'sr-1',
        year: -130,
        title: 'Zhang Qian\'s Mission',
        description: 'Chinese explorer Zhang Qian opens trade routes to Central Asia, establishing the foundation of the Silk Road.',
        type: 'milestone',
        coordinates: [34.3416, 108.9398],
        significance: 9
      },
      {
        id: 'sr-2',
        year: 100,
        title: 'Peak Trade Period',
        description: 'Silk Road reaches its golden age with extensive trade networks connecting China to the Mediterranean.',
        type: 'major',
        coordinates: [40.0583, 64.4056],
        significance: 8
      },
      {
        id: 'sr-3',
        year: 1271,
        title: 'Marco Polo\'s Journey',
        description: 'Venetian explorer Marco Polo travels the Silk Road to China, bringing detailed knowledge of Asia to Europe.',
        type: 'discovery',
        coordinates: [39.9042, 116.4074],
        significance: 7
      },
      {
        id: 'sr-4',
        year: 1453,
        title: 'Ottoman Control',
        description: 'Ottoman Empire gains control of key trade routes, leading to the decline of traditional Silk Road trade.',
        type: 'major',
        coordinates: [41.0082, 28.9784],
        significance: 8
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
        ]
      }
    ],
    artifacts: [
      {
        id: 'sr-caravan',
        name: 'Silk Road Caravan',
        description: 'Trading caravan with camels carrying precious goods across the desert routes.',
        year: 200,
        type: '3d-model',
        location: [39.6542, 66.9597],
        material: 'Various trade goods',
        dimensions: { width: 50, height: 3, depth: 200 },
        culturalSignificance: 8,
        condition: 'excellent',
        currentLocation: 'Museum reconstruction'
      }
    ]
  },
  {
    id: 'renaissance',
    title: 'The Renaissance',
    description: 'A period of renewed interest in art, science, and learning that transformed European culture and society.',
    period: '14th - 17th Century',
    startYear: 1300,
    endYear: 1600,
    category: 'cultural',
    image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg',
    color: '#9932CC',
    difficulty: 'intermediate',
    tags: ['art', 'science', 'culture', 'innovation'],
    timeline: [
      {
        id: 'ren-1',
        year: 1300,
        title: 'Renaissance Begins in Italy',
        description: 'The Renaissance movement begins in Italian city-states, marking a revival of classical learning.',
        type: 'milestone',
        coordinates: [43.7696, 11.2558],
        significance: 9
      },
      {
        id: 'ren-2',
        year: 1440,
        title: 'Gutenberg\'s Printing Press',
        description: 'Johannes Gutenberg invents the printing press, revolutionizing the spread of knowledge.',
        type: 'discovery',
        coordinates: [50.0755, 8.2394],
        significance: 10
      },
      {
        id: 'ren-3',
        year: 1503,
        title: 'Leonardo paints the Mona Lisa',
        description: 'Leonardo da Vinci creates one of the most famous paintings in history.',
        type: 'major',
        coordinates: [43.7696, 11.2558],
        significance: 8
      },
      {
        id: 'ren-4',
        year: 1543,
        title: 'Copernican Revolution',
        description: 'Nicolaus Copernicus publishes his heliocentric theory, revolutionizing astronomy.',
        type: 'discovery',
        coordinates: [54.3520, 18.6466],
        significance: 10
      }
    ],
    mapData: [
      {
        year: 1300,
        territories: [
          {
            id: 'italian-states',
            name: 'Italian City-States',
            coordinates: [[36, 6], [47, 6], [47, 19], [36, 19]],
            color: '#9932CC',
            opacity: 0.6,
            type: 'republic',
            population: 10000000
          }
        ],
        routes: [
          {
            id: 'trade-routes',
            name: 'Mediterranean Trade Routes',
            path: [[43.7, 11.3], [40.8, 14.3], [37.9, 23.7]],
            color: '#FFD700',
            animated: true,
            type: 'trade'
          }
        ],
        cities: [
          { id: 'florence', name: 'Florence', coordinates: [43.7696, 11.2558], size: 8, importance: 10, type: 'cultural' },
          { id: 'venice', name: 'Venice', coordinates: [45.4408, 12.3155], size: 7, importance: 9, type: 'trade' },
          { id: 'rome', name: 'Rome', coordinates: [41.9028, 12.4964], size: 9, importance: 9, type: 'religious' }
        ]
      }
    ],
    artifacts: [
      {
        id: 'ren-workshop',
        name: 'Renaissance Artist Workshop',
        description: 'A typical Renaissance artist\'s workshop with tools and artworks.',
        year: 1500,
        type: '3d-model',
        location: [43.7696, 11.2558],
        material: 'Wood, Canvas, Paint',
        dimensions: { width: 15, height: 4, depth: 20 },
        culturalSignificance: 9,
        condition: 'excellent',
        currentLocation: 'Museum reconstruction'
      }
    ]
  },
  {
    id: 'age-exploration',
    title: 'Age of Exploration',
    description: 'European maritime exploration and colonization that connected the world and changed global history.',
    period: '15th - 17th Century',
    startYear: 1400,
    endYear: 1700,
    category: 'exploration',
    image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg',
    color: '#20B2AA',
    difficulty: 'advanced',
    tags: ['exploration', 'maritime', 'colonization', 'discovery'],
    timeline: [
      {
        id: 'ae-1',
        year: 1492,
        title: 'Columbus Reaches the Americas',
        description: 'Christopher Columbus lands in the Caribbean, beginning European exploration of the Americas.',
        type: 'milestone',
        coordinates: [25.0343, -77.3963],
        significance: 10
      },
      {
        id: 'ae-2',
        year: 1498,
        title: 'Vasco da Gama Reaches India',
        description: 'Portuguese explorer Vasco da Gama reaches India by sea, opening the sea route to Asia.',
        type: 'discovery',
        coordinates: [11.2588, 75.7804],
        significance: 9
      },
      {
        id: 'ae-3',
        year: 1519,
        title: 'Magellan\'s Circumnavigation',
        description: 'Ferdinand Magellan begins the first circumnavigation of the globe.',
        type: 'discovery',
        coordinates: [-52.5024, -70.0000],
        significance: 10
      },
      {
        id: 'ae-4',
        year: 1607,
        title: 'Jamestown Founded',
        description: 'The first permanent English settlement in North America is established.',
        type: 'major',
        coordinates: [37.2138, -76.7795],
        significance: 8
      }
    ],
    mapData: [
      {
        year: 1492,
        territories: [],
        routes: [
          {
            id: 'columbus-route',
            name: 'Columbus\'s Route',
            path: [[36.7, -6.3], [28.1, -15.4], [25.0, -77.4]],
            color: '#FF6347',
            animated: true,
            type: 'exploration'
          },
          {
            id: 'da-gama-route',
            name: 'Da Gama\'s Route',
            path: [[38.7, -9.1], [-34.9, 18.4], [11.3, 75.8]],
            color: '#32CD32',
            animated: true,
            type: 'exploration'
          }
        ],
        cities: [
          { id: 'lisbon', name: 'Lisbon', coordinates: [38.7223, -9.1393], size: 7, importance: 9, type: 'port' },
          { id: 'seville', name: 'Seville', coordinates: [37.3886, -5.9823], size: 6, importance: 8, type: 'port' },
          { id: 'calicut', name: 'Calicut', coordinates: [11.2588, 75.7804], size: 5, importance: 7, type: 'trade' }
        ]
      }
    ],
    artifacts: [
      {
        id: 'ae-caravel',
        name: 'Portuguese Caravel',
        description: 'A fast, maneuverable sailing ship used for exploration.',
        year: 1450,
        type: '3d-model',
        location: [38.7223, -9.1393],
        material: 'Wood, Canvas, Rope',
        dimensions: { width: 8, height: 12, depth: 25 },
        culturalSignificance: 9,
        condition: 'good',
        currentLocation: 'Maritime Museum'
      }
    ]
  }
];