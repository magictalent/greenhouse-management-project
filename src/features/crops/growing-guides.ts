export type GrowingGuide = {
  id: string;
  speciesId: string;
  name: string;
  category: string;
  emoji: string;
  description: string;
  temperature: string;
  watering: string;
  stages: string[];
  tips: string[];
};

export const GROWING_GUIDES: GrowingGuide[] = [
  {
    id: 'tomato',
    speciesId: 'sp-tomato',
    name: 'Tomato',
    category: 'Fruit vegetable',
    emoji: '🍅',
    description:
      'A popular greenhouse crop that benefits from good ventilation, support, and consistent care.',
    temperature: 'Use a locally appropriate day and night temperature target.',
    watering:
      'Water near the root zone. Keep moisture consistent without waterlogging the growing medium.',
    stages: [
      'Seed starting',
      'Seedling development',
      'Transplanting',
      'Vegetative growth',
      'Flowering and fruit set',
      'Harvesting',
    ],
    tips: [
      'Provide suitable plant support.',
      'Monitor flowering and fruit development.',
      'Check leaves regularly for pests and disease.',
    ],
  },
  {
    id: 'cucumber',
    speciesId: 'sp-cucumber',
    name: 'Cucumber',
    category: 'Fruit vegetable',
    emoji: '🥒',
    description:
      'A fast-growing vine crop commonly grown vertically in greenhouses.',
    temperature: 'Choose a temperature range suited to the variety and growth stage.',
    watering:
      'Maintain even root-zone moisture and avoid prolonged waterlogging.',
    stages: [
      'Seed starting',
      'Seedling development',
      'Transplanting',
      'Vine growth',
      'Flowering and fruit development',
      'Harvesting',
    ],
    tips: [
      'Provide suitable trellising.',
      'Monitor humidity and airflow.',
      'Harvest at the size recommended for your variety.',
    ],
  },
  {
    id: 'lettuce',
    speciesId: 'sp-lettuce',
    name: 'Lettuce',
    category: 'Leafy vegetable',
    emoji: '🥬',
    description:
      'A leafy crop suited to many protected growing systems, including beds and hydroponics.',
    temperature: 'Generally prefers cooler conditions than heat-loving fruit crops.',
    watering:
      'Keep the root zone evenly moist while maintaining drainage.',
    stages: [
      'Seed starting',
      'Seedling development',
      'Transplanting',
      'Leaf development',
      'Harvesting',
    ],
    tips: [
      'Choose a variety suited to your growing season.',
      'Watch for heat stress and premature bolting.',
      'Keep growing equipment clean.',
    ],
  },
  {
    id: 'pepper',
    speciesId: 'sp-pepper',
    name: 'Bell Pepper',
    category: 'Fruit vegetable',
    emoji: '🫑',
    description:
      'A warm-season crop that can produce multiple harvests under suitable greenhouse conditions.',
    temperature: 'Use variety-specific temperature targets, especially during flowering.',
    watering:
      'Maintain consistent moisture and avoid sudden large changes in water supply.',
    stages: [
      'Seed starting',
      'Seedling development',
      'Transplanting',
      'Vegetative growth',
      'Flowering and fruit set',
      'Harvesting',
    ],
    tips: [
      'Support plants when needed.',
      'Monitor flowering and fruit set.',
      'Inspect for pests and nutrient-related symptoms.',
    ],
  },
];

export function getGrowingGuide(id: string): GrowingGuide | undefined {
  return GROWING_GUIDES.find((guide) => guide.id === id);
}
