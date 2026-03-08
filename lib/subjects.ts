/**
 * Detects dominant subjects/elements in an image using MobileNet (TensorFlow.js).
 * Maps ImageNet predictions to friendly design-relevant categories.
 */

export interface Subject {
  category: string
  label: string       // e.g. "Bird"
  emoji: string
  confidence: number  // 0–1
  copyHeadline: string
  copySub: string
}

interface CategoryDef {
  id: string
  keywords: string[]
  label: string
  emoji: string
  copyHeadline: string
  copySub: string
}

const CATEGORIES: CategoryDef[] = [
  {
    id: 'bird',
    keywords: [
      'bird', 'eagle', 'hawk', 'owl', 'swan', 'flamingo', 'peacock', 'parrot',
      'robin', 'sparrow', 'finch', 'crane', 'heron', 'pelican', 'seagull', 'gull',
      'dove', 'pigeon', 'toucan', 'kingfisher', 'hen', 'rooster', 'duck', 'goose',
      'ostrich', 'albatross', 'condor', 'vulture', 'hummingbird', 'magpie', 'jay',
      'crow', 'raven', 'cockatoo', 'macaw', 'lorikeet', 'warbler', 'wren',
      'oriole', 'starling', 'martin', 'swift', 'sandpiper', 'plover', 'stork',
      'ibis', 'spoonbill', 'booby', 'tern', 'puffin', 'cormorant', 'grebe',
      'pheasant', 'grouse', 'quail', 'partridge', 'turkey', 'guineafowl',
    ],
    label: 'Bird',
    emoji: '🦅',
    copyHeadline: 'Take flight with your brand',
    copySub: 'Soar above the ordinary with a design system built for those who aim higher.',
  },
  {
    id: 'flower',
    keywords: [
      'flower', 'rose', 'daisy', 'sunflower', 'lily', 'orchid', 'tulip', 'poppy',
      'peony', 'lotus', 'hibiscus', 'jasmine', 'lavender', 'blossom', 'bloom',
      'petal', 'bouquet', 'floral', 'chrysanthemum', 'dahlia', 'zinnia', 'aster',
      'carnation', 'anemone', 'buttercup', 'primrose', 'violet', 'pansy', 'fuchsia',
      'geranium', 'begonia', 'snapdragon', 'foxglove', 'delphinium', 'marigold',
    ],
    label: 'Flower',
    emoji: '🌸',
    copyHeadline: 'Where beauty blooms',
    copySub: "Cultivated from nature's palette — a design system as alive as your vision.",
  },
  {
    id: 'person',
    keywords: [
      'person', 'woman', 'man', 'people', 'human', 'face', 'portrait', 'model',
      'fashion', 'bikini', 'dress', 'suit', 'silhouette', 'girl', 'boy', 'child',
      'adult', 'hair', 'eyes', 'lips', 'skin', 'hands', 'body', 'figure',
    ],
    label: 'Portrait',
    emoji: '✦',
    copyHeadline: 'Define your era. Own your identity.',
    copySub: 'An editorial design system crafted for brands that move culture forward.',
  },
  {
    id: 'coastal',
    keywords: [
      'ocean', 'sea', 'wave', 'beach', 'coast', 'shore', 'surf', 'water', 'lake',
      'river', 'reef', 'coral', 'tropical', 'island', 'sand', 'tide', 'bay',
      'cove', 'harbor', 'lighthouse', 'boat', 'yacht', 'ship', 'sailboat',
      'kayak', 'surfboard', 'snorkel', 'scuba', 'underwater', 'marine',
    ],
    label: 'Coastal',
    emoji: '🌊',
    copyHeadline: 'Ride the wave of great design',
    copySub: 'Fluid, beautiful, and built for motion — your brand in its element.',
  },
  {
    id: 'landscape',
    keywords: [
      'mountain', 'hill', 'valley', 'forest', 'tree', 'wood', 'jungle', 'nature',
      'landscape', 'scenery', 'panorama', 'meadow', 'field', 'glacier', 'waterfall',
      'canyon', 'desert', 'dune', 'cliff', 'rock', 'stone', 'moss', 'grass',
      'leaf', 'leaves', 'branch', 'bark', 'root', 'fern', 'pine', 'oak',
    ],
    label: 'Landscape',
    emoji: '🏔',
    copyHeadline: 'Rooted in something real',
    copySub: 'Grounded, organic, and authentic — a design system that feels like the earth.',
  },
  {
    id: 'urban',
    keywords: [
      'building', 'architecture', 'city', 'urban', 'skyline', 'skyscraper', 'tower',
      'bridge', 'street', 'road', 'alley', 'facade', 'window', 'door', 'wall',
      'concrete', 'steel', 'glass', 'structure', 'church', 'cathedral', 'temple',
      'monument', 'statue', 'museum', 'gallery', 'downtown',
    ],
    label: 'Architecture',
    emoji: '🏛',
    copyHeadline: 'Built with precision. Designed with purpose.',
    copySub: 'Every detail intentional. Every element earning its place in the system.',
  },
  {
    id: 'food',
    keywords: [
      'food', 'fruit', 'vegetable', 'dish', 'meal', 'restaurant', 'cuisine',
      'chef', 'cook', 'bread', 'cake', 'dessert', 'coffee', 'tea', 'wine',
      'cocktail', 'juice', 'smoothie', 'bowl', 'plate', 'spoon', 'fork',
      'pizza', 'pasta', 'salad', 'soup', 'sandwich', 'burger', 'sushi',
    ],
    label: 'Culinary',
    emoji: '🍃',
    copyHeadline: 'Made with care. Served with intention.',
    copySub: 'From source to table — a design system that celebrates craft and origin.',
  },
  {
    id: 'animal',
    keywords: [
      'cat', 'dog', 'horse', 'deer', 'fox', 'wolf', 'bear', 'lion', 'tiger',
      'elephant', 'giraffe', 'zebra', 'leopard', 'cheetah', 'jaguar', 'puma',
      'rabbit', 'hare', 'squirrel', 'raccoon', 'bat', 'snake', 'lizard', 'turtle',
      'fish', 'dolphin', 'whale', 'shark', 'octopus', 'jellyfish',
    ],
    label: 'Wildlife',
    emoji: '🌿',
    copyHeadline: 'Wild by nature. Refined by design.',
    copySub: 'Instinctive, authentic, alive — a design language that truly connects.',
  },
]

function mapPrediction(className: string, probability: number): Subject | null {
  const lower = className.toLowerCase()
  for (const cat of CATEGORIES) {
    if (cat.keywords.some(kw => lower.includes(kw))) {
      return {
        category: cat.id,
        label: cat.label,
        emoji: cat.emoji,
        confidence: probability,
        copyHeadline: cat.copyHeadline,
        copySub: cat.copySub,
      }
    }
  }
  return null
}

// Cache model across calls — typed as any because TF.js model types require @types/tfjs
// biome-ignore lint: needs any
let _model: unknown = null

export async function detectSubjects(imageEl: HTMLImageElement): Promise<Subject[]> {
  try {
    if (!_model) {
      // Lazy-load — keeps initial bundle small
      await import('@tensorflow/tfjs')
      const mobilenet = await import('@tensorflow-models/mobilenet')
      // version 2, alpha 0.5 = ~1.5MB model; good balance of speed vs accuracy
      _model = await mobilenet.load({ version: 2, alpha: 0.5 })
    }

    // eslint-disable-next-line
    const predictions: Array<{ className: string; probability: number }> =
      await (_model as { classify: (img: HTMLImageElement, n: number) => Promise<Array<{ className: string; probability: number }>> }).classify(imageEl, 10)

    const subjects: Subject[] = []
    const seen = new Set<string>()

    for (const pred of predictions) {
      if (pred.probability < 0.05) continue
      const subject = mapPrediction(pred.className, pred.probability)
      if (subject && !seen.has(subject.category)) {
        subjects.push(subject)
        seen.add(subject.category)
        if (subjects.length >= 3) break
      }
    }

    return subjects
  } catch (err) {
    console.warn('[InspoKit] Subject detection unavailable:', err)
    return []
  }
}

/** SVG decorative motif strings keyed by category id */
export const SUBJECT_SVG_MOTIFS: Record<string, string> = {
  bird: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-70 -50 140 90" width="320" height="200"
    style="position:absolute;top:6%;right:6%;opacity:0.055;pointer-events:none;color:inherit" aria-hidden="true">
    <path fill="currentColor" d="M 0,0 C -14,-16 -42,-10 -62,8 C -36,2 -16,14 0,0 C 16,14 36,2 62,8 C 42,-10 14,-16 0,0 Z"/>
    <path fill="currentColor" d="M 0,0 C -5,8 -7,22 0,27 C 7,22 5,8 0,0 Z"/>
  </svg>`,

  flower: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-55 -55 110 110" width="270" height="270"
    style="position:absolute;bottom:8%;right:4%;opacity:0.05;pointer-events:none;color:inherit" aria-hidden="true">
    ${[0,45,90,135,180,225,270,315].map(a =>
      `<ellipse fill="currentColor" cx="0" cy="-30" rx="10" ry="24" transform="rotate(${a})"/>`
    ).join('')}
    <circle fill="currentColor" cx="0" cy="0" r="13"/>
  </svg>`,

  person: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-32 -72 64 130" width="160" height="280"
    style="position:absolute;top:5%;right:8%;opacity:0.05;pointer-events:none;color:inherit" aria-hidden="true">
    <circle fill="currentColor" cx="0" cy="-57" r="14"/>
    <path fill="currentColor" d="M -14,-42 C -14,-22 -22,12 -28,55 L 28,55 C 22,12 14,-22 14,-42 Z"/>
  </svg>`,

  coastal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="100%" height="130"
    style="position:absolute;bottom:0;left:0;opacity:0.06;pointer-events:none;color:inherit" aria-hidden="true">
    <path fill="currentColor" d="M 0,85 C 55,50 110,105 165,72 C 220,38 275,95 330,62 C 360,44 385,70 400,55 L 400,120 L 0,120 Z"/>
  </svg>`,

  landscape: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200" width="100%" height="210"
    style="position:absolute;bottom:0;left:0;opacity:0.05;pointer-events:none;color:inherit" aria-hidden="true">
    <path fill="currentColor" d="M 0,200 L 0,150 L 80,65 L 155,125 L 240,35 L 320,105 L 380,55 L 500,135 L 500,200 Z"/>
  </svg>`,

  urban: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 200" width="300" height="200"
    style="position:absolute;bottom:0;right:5%;opacity:0.05;pointer-events:none;color:inherit" aria-hidden="true">
    <rect fill="currentColor" x="10" y="50" width="55" height="150"/>
    <rect fill="currentColor" x="75" y="90" width="38" height="110"/>
    <rect fill="currentColor" x="123" y="25" width="65" height="175"/>
    <rect fill="currentColor" x="198" y="70" width="48" height="130"/>
    <rect fill="currentColor" x="256" y="10" width="75" height="190"/>
  </svg>`,

  food: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100" width="220" height="220"
    style="position:absolute;bottom:8%;right:6%;opacity:0.05;pointer-events:none;color:inherit" aria-hidden="true">
    <circle fill="currentColor" cx="0" cy="0" r="42"/>
    <circle fill="none" stroke="currentColor" stroke-width="4" cx="0" cy="0" r="30"/>
    <circle fill="none" stroke="currentColor" stroke-width="3" cx="0" cy="0" r="18"/>
  </svg>`,

  animal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100" width="250" height="250"
    style="position:absolute;top:5%;right:5%;opacity:0.05;pointer-events:none;color:inherit" aria-hidden="true">
    <ellipse fill="currentColor" cx="0" cy="-15" rx="18" ry="28"/>
    <ellipse fill="currentColor" cx="-22" cy="-5" rx="10" ry="16" transform="rotate(-30 -22 -5)"/>
    <ellipse fill="currentColor" cx="22" cy="-5" rx="10" ry="16" transform="rotate(30 22 -5)"/>
    <ellipse fill="currentColor" cx="-10" cy="22" rx="10" ry="15" transform="rotate(-15 -10 22)"/>
    <ellipse fill="currentColor" cx="10" cy="22" rx="10" ry="15" transform="rotate(15 10 22)"/>
  </svg>`,
}

/** Get the SVG motif for a subject, or empty string if none */
export function getSubjectMotif(subjects: Subject[]): string {
  if (!subjects.length) return ''
  return SUBJECT_SVG_MOTIFS[subjects[0].category] ?? ''
}

/** Get personalized hero copy from detected subjects */
export function getSubjectCopy(subjects: Subject[]): { headline: string; sub: string } {
  if (!subjects.length) {
    return {
      headline: 'Design systems that inspire',
      sub: 'From one image to a complete design kit in seconds.',
    }
  }
  return {
    headline: subjects[0].copyHeadline,
    sub: subjects[0].copySub,
  }
}
