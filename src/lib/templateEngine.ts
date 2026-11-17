// ==============================================================================
// REVIEWFLOW RANDOMIZED TEMPLATE SUGGESTION ENGINE
// Generates natural, high-converting Google reviews without any paid AI API calls
// Combinatorial grammar + category-aware mad-lib sentence synthesis
// ==============================================================================

import { BusinessCategory } from '../types';

interface GenerationParams {
  businessName: string;
  category: BusinessCategory;
  selectedTags: string[];
  vibe?: 'enthusiastic' | 'concise' | 'detailed' | 'service';
}

// Category specific flavor phrases
const CATEGORY_FLAVORS: Record<string, { intros: string[]; details: string[]; closings: string[] }> = {
  restaurant: {
    intros: [
      "Had a fantastic dining experience at {name}!",
      "If you're looking for an unforgettable meal, {name} is the spot!",
      "Visited {name} today and thoroughly enjoyed everything!",
      "Outstanding visit to {name}!",
    ],
    details: [
      "The food was prepared to perfection and full of flavor.",
      "Every course was fresh, flavorful, and beautifully presented.",
      "The atmosphere was welcoming and the hospitality made us feel right at home.",
      "You can tell the kitchen and team genuinely care about quality.",
    ],
    closings: [
      "Will definitely be returning soon with family and friends!",
      "10/10 recommend to any foodie in the area!",
      "Already looking forward to our next dinner here.",
      "Easily one of my favorite spots in town!",
    ]
  },
  salon: {
    intros: [
      "I cannot say enough wonderful things about {name}!",
      "Had the most relaxing and luxurious appointment at {name}!",
      "Left {name} feeling completely pampered and refreshed!",
      "Such a fabulous experience at {name} today!",
    ],
    details: [
      "They took the time to listen to exactly what I wanted and executed it flawlessly.",
      "The attention to detail and skill level here is unmatched.",
      "The salon is spotlessly clean and has such an uplifting, calming vibe.",
      "True artists who treat their clients with the utmost care.",
    ],
    closings: [
      "Found my new go-to place! Highly recommended!",
      "5 stars all the way. Book your appointment now!",
      "I've already received so many compliments!",
      "Will definitely be coming back regularly.",
    ]
  },
  dental: {
    intros: [
      "Hands down the best dental experience I have ever had at {name}!",
      "Visiting {name} completely changed my perspective on dental appointments!",
      "Remarkable care and attention at {name} today!",
      "So grateful for the wonderful team at {name}!",
    ],
    details: [
      "The entire procedure was smooth, gentle, and virtually painless.",
      "They explained every single step thoroughly and answered all my questions.",
      "The clinic is modern, pristine, and the team goes out of their way to put you at ease.",
      "Professionalism at the highest standard from check-in to checkout.",
    ],
    closings: [
      "Highly recommend to anyone with dental anxiety!",
      "Trustworthy, gentle, and top quality. 10/10!",
      "I won't go anywhere else for my oral healthcare.",
      "Thank you for taking such good care of me!",
    ]
  },
  automotive: {
    intros: [
      "Brought my vehicle to {name} and was blown away by the honesty and speed!",
      "Finally found an auto shop I can actually trust at {name}!",
      "Great experience with {name} for my recent vehicle service!",
      "Top-tier mechanics and stellar service at {name}!",
    ],
    details: [
      "They diagnosed the issue quickly and provided clear, fair pricing upfront.",
      "Quality workmanship without any unnecessary upsells or gimmicks.",
      "My car drives like new again and they got it back to me right on schedule.",
      "Transparent communication throughout the entire repair process.",
    ],
    closings: [
      "Honest mechanics are hard to find—{name} has earned a customer for life!",
      "Highly recommend to anyone looking for dependable auto care.",
      "Fair prices and flawless work. 5 stars!",
      "Will definitely bring all my cars here moving forward.",
    ]
  },
  general: {
    intros: [
      "Had an exceptional experience with {name}!",
      "Can't say enough good things about the team at {name}!",
      "Outstanding service and professionalism at {name} today!",
      "Truly impressed with the quality and care at {name}!",
    ],
    details: [
      "Every detail was handled with precision and genuine courtesy.",
      "Prompt, reliable, and went above and beyond to ensure a great result.",
      "The standard of customer service here is rare to find these days.",
      "Seamless process from start to finish.",
    ],
    closings: [
      "Will definitely do business with them again!",
      "Deserves more than 5 stars! Strongly recommend.",
      "Do yourself a favor and choose {name}.",
      "Keep up the incredible work!",
    ]
  }
};

// Formats array of tags into natural English (e.g. "A, B, and especially C")
function formatTags(tags: string[]): string {
  if (!tags || tags.length === 0) return 'their high quality';
  if (tags.length === 1) return `the ${tags[0].toLowerCase()}`;
  if (tags.length === 2) return `both the ${tags[0].toLowerCase()} and ${tags[1].toLowerCase()}`;
  const allButLast = tags.slice(0, -1).map(t => t.toLowerCase()).join(', ');
  const last = tags[tags.length - 1].toLowerCase();
  return `the ${allButLast}, and especially the ${last}`;
}

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateReviewSuggestions(params: GenerationParams): {
  id: string;
  vibe: 'enthusiastic' | 'concise' | 'detailed';
  text: string;
}[] {
  const { businessName, category, selectedTags } = params;
  const flavor = CATEGORY_FLAVORS[category] || CATEGORY_FLAVORS.general;
  const tagSentence = formatTags(selectedTags);

  // 1. Enthusiastic Option
  const intro1 = pickRandom(flavor.intros).replace('{name}', businessName);
  const detail1 = pickRandom(flavor.details);
  const close1 = pickRandom(flavor.closings);
  const enthusiasticText = `${intro1} What really stood out was ${tagSentence}. ${detail1} ${close1}`;

  // 2. Concise Option (Quick, mobile-friendly)
  const conciseTemplates = [
    `Great experience at ${businessName}! Really appreciated ${tagSentence}. Highly recommend to anyone!`,
    `5 stars for ${businessName}! Outstanding service and ${tagSentence}. Will definitely be back.`,
    `Super impressed with ${businessName}. ${tagSentence.charAt(0).toUpperCase() + tagSentence.slice(1)} made all the difference. 10/10!`,
    `Fantastic visit to ${businessName}! Top-notch care, friendly atmosphere, and ${tagSentence}.`
  ];
  const conciseText = pickRandom(conciseTemplates);

  // 3. Detailed Option (Rich for SEO & Google Maps algorithm)
  const intro3 = pickRandom(flavor.intros).replace('{name}', businessName);
  const detail3A = pickRandom(flavor.details);
  const detail3B = pickRandom(flavor.details.filter(d => d !== detail3A));
  const close3 = pickRandom(flavor.closings);
  const detailedText = `${intro3} From the moment I arrived, I was impressed by ${tagSentence}. ${detail3A} ${detail3B} ${close3}`;

  return [
    {
      id: 'enthusiastic',
      vibe: 'enthusiastic',
      text: enthusiasticText
    },
    {
      id: 'concise',
      vibe: 'concise',
      text: conciseText
    },
    {
      id: 'detailed',
      vibe: 'detailed',
      text: detailedText
    }
  ];
}
