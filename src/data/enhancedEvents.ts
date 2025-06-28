import { HistoricalEvent } from '../types';

export const enhancedHistoricalEvents: HistoricalEvent[] = [
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
    learningObjectives: [
      'Understand the historical context of the Great Wall construction',
      'Learn about different dynasties that contributed to the wall',
      'Explore the engineering techniques used in ancient China',
      'Analyze the strategic importance of the wall in Chinese defense'
    ],
    keyFacts: [
      'The Great Wall is over 13,000 miles long',
      'It took over 2,000 years to build',
      'Millions of workers died during construction',
      'It\'s visible from space is actually a myth',
      'The wall served as a border control system'
    ],
    timeline: [
      {
        id: 'gw-1',
        year: -700,
        title: 'Early Fortifications Begin',
        description: 'Warring states begin building defensive walls to protect their territories from invasions.',
        type: 'major',
        coordinates: [40.4319, 116.5704],
        significance: 6,
        keyFigures: ['Various Warring States rulers'],
        impact: 'Established the foundation for future unified wall systems'
      },
      {
        id: 'gw-2',
        year: -220,
        title: 'Qin Dynasty Unification',
        description: 'Emperor Qin Shi Huang orders the connection and extension of existing walls into a unified defense system.',
        type: 'milestone',
        coordinates: [40.4319, 116.5704],
        significance: 10,
        keyFigures: ['Qin Shi Huang', 'General Meng Tian'],
        impact: 'Created the first unified Great Wall system'
      },
      {
        id: 'gw-3',
        year: 1368,
        title: 'Ming Dynasty Reconstruction',
        description: 'Major reconstruction and fortification of the wall using brick and stone, creating most of what exists today.',
        type: 'major',
        coordinates: [40.4319, 116.5704],
        significance: 8,
        keyFigures: ['Ming Dynasty emperors'],
        impact: 'Built the Great Wall that tourists visit today'
      }
    ],
    quiz: [
      {
        id: 'gw-q1',
        question: 'Which emperor is most famous for unifying the Great Wall?',
        options: ['Qin Shi Huang', 'Emperor Wu', 'Kangxi Emperor', 'Yongle Emperor'],
        correctAnswer: 0,
        explanation: 'Qin Shi Huang, the first emperor of unified China, ordered the connection and extension of existing walls built by warring states into one continuous defensive system.',
        difficulty: 'easy'
      },
      {
        id: 'gw-q2',
        question: 'What was the primary purpose of the Great Wall?',
        options: ['Tourism', 'Defense against invasions', 'Trade route', 'Religious ceremonies'],
        correctAnswer: 1,
        explanation: 'The Great Wall was primarily built as a defensive fortification to protect Chinese states and empires from invasions by nomadic groups from the north.',
        difficulty: 'easy'
      },
      {
        id: 'gw-q3',
        question: 'Which dynasty is responsible for most of the Great Wall that exists today?',
        options: ['Qin Dynasty', 'Han Dynasty', 'Ming Dynasty', 'Tang Dynasty'],
        correctAnswer: 2,
        explanation: 'The Ming Dynasty (1368-1644) rebuilt and fortified much of the Great Wall using brick and stone, creating most of the structure that tourists visit today.',
        difficulty: 'medium'
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
    learningObjectives: [
      'Trace the evolution from Roman Republic to Empire',
      'Understand the factors that led to Roman expansion',
      'Analyze the causes of the Roman Empire\'s decline',
      'Explore Roman contributions to law, engineering, and culture'
    ],
    keyFacts: [
      'Rome controlled most of the known Western world at its peak',
      'The Roman legal system influences modern law',
      'Roman engineering included aqueducts, roads, and the Colosseum',
      'Latin became the basis for Romance languages',
      'The empire lasted over 1,000 years'
    ],
    timeline: [
      {
        id: 're-1',
        year: -753,
        title: 'Founding of Rome',
        description: 'Legendary founding of Rome by Romulus and Remus, establishing the city that would become an empire.',
        type: 'milestone',
        coordinates: [41.9028, 12.4964],
        significance: 10,
        keyFigures: ['Romulus', 'Remus'],
        impact: 'Established the city that would dominate the Mediterranean'
      },
      {
        id: 're-2',
        year: -27,
        title: 'Augustus Becomes Emperor',
        description: 'Octavian becomes Augustus, the first Roman Emperor, transforming the Republic into the Empire.',
        type: 'milestone',
        coordinates: [41.9028, 12.4964],
        significance: 10,
        keyFigures: ['Augustus Caesar'],
        impact: 'Began the Roman Empire period and Pax Romana'
      },
      {
        id: 're-3',
        year: 476,
        title: 'Fall of Western Roman Empire',
        description: 'Odoacer deposes the last Western Roman Emperor, marking the end of the Western Roman Empire.',
        type: 'milestone',
        coordinates: [45.4642, 9.1900],
        significance: 10,
        keyFigures: ['Odoacer', 'Romulus Augustulus'],
        impact: 'Ended over 1,000 years of Roman rule in the West'
      }
    ],
    quiz: [
      {
        id: 're-q1',
        question: 'Who was the first Roman Emperor?',
        options: ['Julius Caesar', 'Augustus', 'Nero', 'Trajan'],
        correctAnswer: 1,
        explanation: 'Augustus (originally named Octavian) became the first Roman Emperor in 27 BC, marking the beginning of the Roman Empire period.',
        difficulty: 'easy'
      },
      {
        id: 're-q2',
        question: 'What year is traditionally given for the fall of the Western Roman Empire?',
        options: ['410 AD', '455 AD', '476 AD', '493 AD'],
        correctAnswer: 2,
        explanation: '476 AD is the traditional date for the fall of the Western Roman Empire, when Odoacer deposed the last Western Roman Emperor, Romulus Augustulus.',
        difficulty: 'medium'
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
    learningObjectives: [
      'Understand the cultural shift from medieval to Renaissance thinking',
      'Explore key Renaissance artists and their contributions',
      'Learn about scientific discoveries during the Renaissance',
      'Analyze the impact of the printing press on knowledge spread'
    ],
    keyFacts: [
      'Renaissance means "rebirth" in French',
      'It began in Italy and spread throughout Europe',
      'Leonardo da Vinci epitomized the "Renaissance man"',
      'The printing press revolutionized knowledge sharing',
      'Humanism emphasized individual potential and achievement'
    ],
    timeline: [
      {
        id: 'ren-1',
        year: 1440,
        title: 'Gutenberg\'s Printing Press',
        description: 'Johannes Gutenberg invents the printing press, revolutionizing the spread of knowledge.',
        type: 'discovery',
        coordinates: [50.0755, 8.2394],
        significance: 10,
        keyFigures: ['Johannes Gutenberg'],
        impact: 'Democratized knowledge and accelerated the spread of Renaissance ideas'
      },
      {
        id: 'ren-2',
        year: 1503,
        title: 'Leonardo paints the Mona Lisa',
        description: 'Leonardo da Vinci creates one of the most famous paintings in history.',
        type: 'major',
        coordinates: [43.7696, 11.2558],
        significance: 8,
        keyFigures: ['Leonardo da Vinci'],
        impact: 'Exemplified Renaissance artistic achievement and technique'
      }
    ],
    quiz: [
      {
        id: 'ren-q1',
        question: 'What does "Renaissance" mean?',
        options: ['Revolution', 'Rebirth', 'Reform', 'Renewal'],
        correctAnswer: 1,
        explanation: 'Renaissance is a French word meaning "rebirth," referring to the renewed interest in classical learning and culture.',
        difficulty: 'easy'
      },
      {
        id: 'ren-q2',
        question: 'Who invented the printing press around 1440?',
        options: ['Leonardo da Vinci', 'Michelangelo', 'Johannes Gutenberg', 'Galileo Galilei'],
        correctAnswer: 2,
        explanation: 'Johannes Gutenberg invented the movable-type printing press around 1440, revolutionizing the spread of knowledge.',
        difficulty: 'medium'
      }
    ]
  }
];