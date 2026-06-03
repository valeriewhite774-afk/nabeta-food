/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem } from './types';
import bangaSoupImg from './assets/images/banga_soup_dish_1780300824477.png';
import fishermanSoupImg from './assets/images/fisherman_soup_1780300845776.png';
import owoSoupImg from './assets/images/owo_soup_1780302250456.png';
import egusiSoupImg from './assets/images/egusi_soup_1780302266589.png';
import okroSoupImg from './assets/images/okro_soup_1780302285781.png';
import vegetableSoupImg from './assets/images/vegetable_soup_1780302300775.png';
import obelataSoupImg from './assets/images/obelata_soup_1780302318055.png';
import gbagbaFiaSoupImg from './assets/images/gbagba_fia_soup_1780302334984.png';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'banga-soup',
    name: 'Banga Soup',
    description: 'Taste our Banga Soup and feel the difference with your first swallow. Rich, tasty, and garnished with bush meat, fish, periwinkle, and African traditional spices.',
    rating: 4.9,
    reviewsCount: 312,
    basePrice: 4999,
    image: bangaSoupImg,
    defaultProteins: ['2× Beef', 'River Fish', '2× Starch'],
    defaultSwallow: 'Starch',
    bulletPoints: [
      'Vitamins in every swallow: real palm fruit, real Vitamin A and E.',
      'Serious protein: bush meat, fish, and periwinkle in one bowl.',
      'Rich, deep, and full: the taste that stays with you after the last swallow.'
    ],
    review: {
      stars: 5,
      text: '"Delicious, tasty and very fast in delivery. I love NabetaFood and will keep on enjoying their foods."',
      author: 'Felix Birinumugha',
      location: 'Warri'
    },
    reviews: [
      {
        stars: 5,
        text: '"Delicious, tasty and very fast in delivery. I love NabetaFood and will keep on enjoying their foods."',
        author: 'Felix Birinumugha',
        location: 'Warri'
      },
      {
        stars: 5,
        text: '"The palm fruit concentrate flavor is so fresh and authentic. Thick, rich, and tastes exactly like home."',
        author: 'Ovie Okpako',
        location: 'Effurun'
      },
      {
        stars: 5,
        text: '"Generous portions of bush meat and fresh periwinkles. Absolutely worth every single Naira!"',
        author: 'Ese Oghene',
        location: 'Warri South'
      }
    ],
    proteins: [
      { id: 'river-fish', name: 'River Fish', price: 800 },
      { id: 'beef', name: 'Beef', price: 600 },
      { id: 'periwinkle', name: 'Periwinkle', price: 500 },
      { id: 'boiled-egg', name: 'Boiled Egg', price: 300 }
    ],
    swallows: [
      { id: 'starch', name: 'Starch', price: 0 },
      { id: 'eba', name: 'Eba', price: 0 },
      { id: 'fufu', name: 'Fufu', price: 0 }
    ],
    faqs: [
      {
        question: "What is NabetaFood's Banga Soup made of?",
        answer: "Our authentic Banga Soup is slow-cooked using 100% natural palm fruit concentrate, infused with traditional Delta spices like Beletete leaves, Oburunbebe stick, and loaded with fresh river fish, beef, and periwinkles."
      },
      {
        question: "What is the best swallow for Banga Soup?",
        answer: "Traditional Delta yellow starch is the absolute best companion for Banga Soup. The velvety sweetness of starch balances the rich, robust flavor of the palm oil soup perfectly. We also offer Eba and Fufu as custom options."
      },
      {
        question: "Is your palm fruit fresh or canned?",
        answer: "We use only freshly extracted palm fruit concentrate prepared from local Delta groves daily, ensuring you get the authentic, rich home taste with zero artificial preservatives."
      }
    ]
  },
  {
    id: 'fisherman-soup',
    name: 'Fisherman Soup',
    description: 'A premium rich culinary dish celebrating the fresh seafood bounty of coastal Warri waters, loaded with succulent king prawns, fresh crab claws, red snapper, and seasoned with local herbs.',
    rating: 4.8,
    reviewsCount: 184,
    basePrice: 5500,
    image: fishermanSoupImg,
    defaultProteins: ['2× Prawns', 'Crab Claw', 'Snapper Filet'],
    defaultSwallow: 'Eba',
    bulletPoints: [
      'Fresh oceanic harvest: straight from delta waters into your bowl.',
      'Antioxidant rich: cooked with genuine Uziza seeds and sweet scent leaves.',
      'Satisfying depth: local spices that evoke the true coastal fisherman legacy.'
    ],
    review: {
      stars: 5,
      text: '"Simply exceptional seafood density! The broth tastes like pure liquid gold. 10/10 level delivery."',
      author: 'Amaju Pinnick',
      location: 'Effurun, Warri'
    },
    reviews: [
      {
        stars: 5,
        text: '"Simply exceptional seafood density! The broth tastes like pure liquid gold. 10/10 level delivery."',
        author: 'Amaju Pinnick',
        location: 'Effurun, Warri'
      },
      {
        stars: 5,
        text: '"The king prawns are massive and the crab claws are cooked to perfection. Truly premium stuff."',
        author: 'Tamara Okoro',
        location: 'Ekpan'
      },
      {
        stars: 5,
        text: '"Love the local scent leaf finish. Spicy without being overwhelming. Best fisherman soup online!"',
        author: 'Boma Harrison',
        location: 'Winston Estate, Warri'
      }
    ],
    proteins: [
      { id: 'jumbo-prawn', name: 'Jumbo Prawn', price: 1200 },
      { id: 'crab-claw', name: 'Crab Claw', price: 1000 },
      { id: 'snapper-filet', name: 'Snapper Filet', price: 900 },
      { id: 'periwinkle', name: 'Periwinkle', price: 500 }
    ],
    swallows: [
      { id: 'eba', name: 'Eba', price: 0 },
      { id: 'starch', name: 'Starch', price: 0 },
      { id: 'fufu', name: 'Fufu', price: 0 }
    ],
    faqs: [
      {
        question: "Is your Fisherman Soup made with real fresh seafood?",
        answer: "Yes! Our Fisherman Soup is a luxurious, ocean-fresh Delta dish. We use premium king prawns, whole crab claws, and fresh red snapper, carefully cleaned and cooked in a spicy, light herb broth with Uziza and scent leaves."
      },
      {
        question: "Is Fisherman Soup very spicy?",
        answer: "It has a warming, spicy kick from red habaneros and Uziza seeds, which balances the sweetness of the seafood. You can request a milder version in your order custom notes!"
      }
    ]
  },
  {
    id: 'owo-soup',
    name: 'Owo Soup',
    description: 'An ancestral Urhobo classic made with pure palm oil, native potash (unle), and blended spices, creating an incredibly rich, golden-yellow velvety stew enjoyed with yellow starch.',
    rating: 4.9,
    reviewsCount: 224,
    basePrice: 4200,
    image: owoSoupImg,
    defaultProteins: ['Bush Fish', 'Shaki (Tripe)', 'Cow Foot'],
    defaultSwallow: 'Starch',
    bulletPoints: [
      'Traditional recipe: made without pepper or tomatoes, relying purely on palm oil depth.',
      'Rich in minerals: native unle minerals prepared to perfection.',
      'Starch companion: the absolute ultimate soup pairing for yellow starch.'
    ],
    review: {
      stars: 5,
      text: '"This is exactly how my grandmother used to make Owo Soup in Warri! The consistency is perfectly thick and luxurious."',
      author: 'Oghenetega Mukoro',
      location: 'Warri South'
    },
    reviews: [
      {
        stars: 5,
        text: '"This is exactly how my grandmother used to make Owo Soup in Warri! The consistency is perfectly thick and luxurious."',
        author: 'Oghenetega Mukoro',
        location: 'Warri South'
      },
      {
        stars: 5,
        text: '"Starch and Owo is life. NabetaFood nailed the native potash ratio. Perfectly yellow and smooth."',
        author: 'Uruemu Clark',
        location: 'Enerhen'
      },
      {
        stars: 5,
        text: '"Very fresh dried bush fish and shaki. Extremely sanitary and well packaged. Highly recommended!"',
        author: 'Faith Jemine',
        location: 'Jeddo, Warri'
      }
    ],
    proteins: [
      { id: 'dry-fish', name: 'Bush Fish', price: 800 },
      { id: 'shaki', name: 'Shaki (Tripe)', price: 700 },
      { id: 'cow-foot', name: 'Cow Foot', price: 600 },
      { id: 'kpomo', name: 'Kpomo', price: 450 }
    ],
    swallows: [
      { id: 'starch', name: 'Starch', price: 0 },
      { id: 'eba', name: 'Eba', price: 0 },
      { id: 'fufu', name: 'Fufu', price: 0 }
    ],
    faqs: [
      {
        question: "What makes Urhobo Owo Soup unique?",
        answer: "Owo Soup is a celebrated Urhobo classic made without tomatoes or peppers. Its unique golden-yellow appearance and rich, velvety texture come from slow-emulsifying pure palm oil with native potash (unle) and native crayfish. It is a pure heritage recipe."
      },
      {
        question: "What swallow is traditionally eaten with Owo soup?",
        answer: "Traditionally, Urhobo Owo Soup is served with fresh yellow starch or boiled sweet plantains/yams."
      }
    ]
  },
  {
    id: 'egusi-soup',
    name: 'Egusi Soup',
    description: 'Richly textured ground melon seed soup simmered with native oil, scent leaves, and choice spices, bursting with fluffy golden egusi lumps and succulent protein chunks.',
    rating: 4.7,
    reviewsCount: 156,
    basePrice: 4500,
    image: egusiSoupImg,
    defaultProteins: ['Assorted Beef', 'Stockfish', 'Spinach Greens'],
    defaultSwallow: 'Fufu',
    bulletPoints: [
      'Fluffy egg-like clusters: slow cooked egusi lumps that melt in the mouth.',
      'Iron & fiber rich: tossed with fresh spinach and fluted pumpkin leaves.',
      'Stockfish aroma: infused with heavily boiled cod stockfish for premium scent.'
    ],
    review: {
      stars: 5,
      text: '"The egusi lumps are so huge and fluffy, it feels like gourmet gold coins in a sea of rich greens. Simply amazing!"',
      author: 'Valerie White',
      location: 'Airport Road, Effurun'
    },
    reviews: [
      {
        stars: 5,
        text: '"The egusi lumps are so huge and fluffy, it feels like gourmet gold coins in a sea of rich greens. Simply amazing!"',
        author: 'Valerie White',
        location: 'Airport Road, Effurun'
      },
      {
        stars: 4,
        text: '"Aromatic stockfish flavor is incredible and there is plenty of assorted meat inside. Wonderful texture."',
        author: 'Chinedu Okafor',
        location: 'Jakpa Road'
      },
      {
        stars: 5,
        text: '"Very authentic Delta taste. Served piping hot with very smooth fufu. Will order again!"',
        author: 'Kevwe Dafinone',
        location: 'Jeddo'
      }
    ],
    proteins: [
      { id: 'beef-assorted', name: 'Assorted Meat', price: 800 },
      { id: 'stockfish', name: 'Stockfish Bolt', price: 950 },
      { id: 'smoked-fish', name: 'Smoked Catfish', price: 750 },
      { id: 'boiled-egg', name: 'Boiled Egg', price: 300 }
    ],
    swallows: [
      { id: 'fufu', name: 'Fufu', price: 0 },
      { id: 'eba', name: 'Eba', price: 0 },
      { id: 'starch', name: 'Starch', price: 0 }
    ],
    faqs: [
      {
        question: "What is the secret to NabetaFood's Egusi Soup texture?",
        answer: "Our Egusi Soup is prepared using the traditional frying and boiling method to produce large, fluffy, egg-like melon seed clusters (egusi lumps). It is simmered with rich stockfish broth, native palm oil, and fresh spinach greens."
      },
      {
        question: "Is your Egusi Soup gluten-free?",
        answer: "Yes, our Egusi Soup is 100% gluten-free, prepared using ground melon seeds, native spices, beef stock, and organic leafy greens."
      }
    ]
  },
  {
    id: 'okro-soup',
    name: 'Okro Soup',
    description: 'A beautifully drawing seafood okra soup packed with chopped crunch and smooth viscosity, stewed with delta spices, fresh crabs, periwinkles, and red snappers.',
    rating: 4.8,
    reviewsCount: 209,
    basePrice: 4800,
    image: okroSoupImg,
    defaultProteins: ['Fresh Crab', 'Periwinkle', 'Shelled Prawns'],
    defaultSwallow: 'Eba',
    bulletPoints: [
      'Viscous texture: prepared to keep the okra perfectly drawing and fresh.',
      'Scent leaf finish: garnished with Uziza and fresh scent leaves.',
      'Seafood overload: every spoonful guarantees a piece of crab or prawn.'
    ],
    review: {
      stars: 5,
      text: '"Perfect viscosity! It draws so beautiful and is loaded with seafood. Nabeta is the king of okro!"',
      author: 'Efe Okojie',
      location: 'Refinery Gate, Warri'
    },
    reviews: [
      {
        stars: 5,
        text: '"Perfect viscosity! It draws so beautiful and is loaded with seafood. Nabeta is the king of okro!"',
        author: 'Efe Okojie',
        location: 'Refinery Gate, Warri'
      },
      {
        stars: 5,
        text: '"The okro is crunchy and not overcooked. The red snapper inside is so sweet. Love it!"',
        author: 'Oghenekevwe Mary',
        location: 'Ogunu'
      },
      {
        stars: 5,
        text: '"Packed with fresh crabs and shrimps. A true coastal delight that will leave you wanting more."',
        author: 'Ebi Akpos',
        location: 'Pessu, Warri'
      }
    ],
    proteins: [
      { id: 'crab', name: 'Fresh Crab', price: 900 },
      { id: 'jumbo-shrimp', name: 'Jumbo Shrimp', price: 1100 },
      { id: 'smoked-snapper', name: 'Red Snapper', price: 1000 },
      { id: 'periwinkle-shelled', name: 'Periwinkles', price: 500 }
    ],
    swallows: [
      { id: 'eba', name: 'Eba', price: 0 },
      { id: 'starch', name: 'Starch', price: 0 },
      { id: 'fufu', name: 'Fufu', price: 0 }
    ],
    faqs: [
      {
        question: "How do you ensure your Okro Soup has the perfect draw?",
        answer: "We chop our okra fresh for every single order and cook it gently on a timed simmer. This retains the satisfying, crunchy texture and ensures it remains highly viscous and perfectly drawing, the true mark of authentic Delta Okro."
      },
      {
        question: "What seafood is included in the Okro Soup?",
        answer: "Our signature seafood Okro is packed with fresh crabs, jumbo prawns, periwinkles, and chunks of red snapper."
      }
    ]
  },
  {
    id: 'vegetable-soup',
    name: 'Vegetable Soup',
    description: 'Efo Riro and Afang-style premium leafy greens sauteed in smoked shrimp paste, palm oil, and native peppers with rich, chewable soft proteins.',
    rating: 4.8,
    reviewsCount: 142,
    basePrice: 4700,
    image: vegetableSoupImg,
    defaultProteins: ['Goat Meat', 'Dried Shrimp', 'Snail Chunks'],
    defaultSwallow: 'Fufu',
    bulletPoints: [
      'Vitamins packed: 100% freshly hand-plucked green leaves.',
      'Traditional base: fried thoroughly in rich, native palm oil and red tatashe.',
      'Crunchy proteins: high in snails and smoked prawns.'
    ],
    review: {
      stars: 5,
      text: '"The crunchiness of the greens is preserved so well. Smells heavenly with the dried shrimp paste flavor!"',
      author: 'Preye Alapa',
      location: 'Udu Road'
    },
    reviews: [
      {
        stars: 5,
        text: '"The crunchiness of the greens is preserved so well. Smells heavenly with the dried shrimp paste flavor!"',
        author: 'Preye Alapa',
        location: 'Udu Road'
      },
      {
        stars: 5,
        text: '"The snail pieces are thick and properly cleaned. Scented beautifully with local Uziza. Excellent job!"',
        author: 'Eseoghene Mukoro',
        location: 'Main Market Area'
      },
      {
        stars: 5,
        text: '"Very deep flavors. The palm oil and tatashe frying method they use yields an authentic home taste."',
        author: 'Adebayo Tunde',
        location: 'DSC Aladja'
      }
    ],
    proteins: [
      { id: 'goat-meat', name: 'Goat Meat', price: 1000 },
      { id: 'snail-gourmet', name: 'Snail Piece', price: 1200 },
      { id: 'smoked-shrimp', name: 'Dried Shrimp', price: 600 },
      { id: 'beef-cubes', name: 'Beef Cubes', price: 500 }
    ],
    swallows: [
      { id: 'fufu', name: 'Fufu', price: 0 },
      { id: 'eba', name: 'Eba', price: 0 },
      { id: 'starch', name: 'Starch', price: 0 }
    ],
    faqs: [
      {
        question: "What style of Vegetable Soup does NabetaFood serve?",
        answer: "We cook a rich, high-fidelity combination of Efo Riro (stewed spinach) and Afang-style green soups, sautéed thoroughly in smoked shrimp paste, native palm oil, and loaded with soft chews of goat meat, snail pieces and cow hide."
      },
      {
        question: "Are the vegetables fresh?",
        answer: "Yes, we source our fluted pumpkin leaves (Ugu), waterleaves, and spinach daily from organic local farms and clean them thoroughly in sanitary ozonated water."
      }
    ]
  },
  {
    id: 'obelata-soup',
    name: 'Obelata Soup',
    description: 'An extremely fiery and rich native pepper and tomato oil stew simmered with deep assorted offals (shaki, liver, roundabout, kidney) that delivers intense, memorable spice bursts.',
    rating: 4.6,
    reviewsCount: 98,
    basePrice: 4300,
    image: obelataSoupImg,
    defaultProteins: ['Assorted Offal', 'Tripe', 'Tendon Shaki'],
    defaultSwallow: 'Eba',
    bulletPoints: [
      'Fiery heat: packed with fresh habaneros and native alligator pepper.',
      'Chewy texture assortment: the dream bowl for extreme lovers of organ meats.',
      'Smokey undertones: cooked on local charcoal chimney fire simulation.'
    ],
    review: {
      stars: 5,
      text: '"Oh my God, the spice level is absolutely marvelous! It is hot, flavorful, and the offals are cooked till they melt."',
      author: 'Harrison Gbagi',
      location: 'Ogunu Road, Warri'
    },
    reviews: [
      {
        stars: 5,
        text: '"Oh my God, the spice level is absolutely marvelous! It is hot, flavorful, and the offals are cooked till they melt."',
        author: 'Harrison Gbagi',
        location: 'Ogunu Road, Warri'
      },
      {
        stars: 4,
        text: '"Not for the faint-hearted! Very rich and spicy. The kidney and shaki assortment is generous."',
        author: 'Onome Egblewoghe',
        location: 'Agbarho'
      },
      {
        stars: 5,
        text: '"If you love real native Warri heat and rich organ stews, this is the gold standard right here!"',
        author: 'Ebiere Tamara',
        location: 'NPA Express'
      }
    ],
    proteins: [
      { id: 'shaki-extra', name: 'Extra Tripe', price: 700 },
      { id: 'cow-tongue', name: 'Cow Tongue', price: 800 },
      { id: 'liver-strip', name: 'Liver Strips', price: 600 },
      { id: 'kpomo-dice', name: 'Diced Kpomo', price: 400 }
    ],
    swallows: [
      { id: 'eba', name: 'Eba', price: 0 },
      { id: 'fufu', name: 'Fufu', price: 0 },
      { id: 'starch', name: 'Starch', price: 0 }
    ],
    faqs: [
      {
        question: "What is Obelata Soup and is it very spicy?",
        answer: "Obelata Soup is a fiery, pepper-forward native Urhobo soup made with blended fresh yellow peppers, tomatoes, palm oil, and cooked with rich, assorted organ meats (liver, tripe, kidney, cow tongue) simmered until tender."
      },
      {
        question: "Are the organ meats properly cleaned?",
        answer: "Absolutely. We adhere to the highest international kitchen sanitation standards. All offals and tripe are scraped, salted, washed multiple times, and pressure-boiled with garlic and ginger before soup integration."
      }
    ]
  },
  {
    id: 'gbagba-fia-soup',
    name: 'Gbagba Fia Soup',
    description: 'The legendary Urhobo light spicy palm oil soup brewed with fresh-caught catfish, local scent leaf sprigs, alligator pepper, and traditional dry-blended native bark spices.',
    rating: 4.9,
    reviewsCount: 167,
    basePrice: 5100,
    image: gbagbaFiaSoupImg,
    defaultProteins: ['Catfish Round', 'Mudfish Filet', 'Periwinkles'],
    defaultSwallow: 'Starch',
    bulletPoints: [
      'Medicinal flavor: brewed with native aromatic tree bark and scent leaves.',
      'Fresh river catfish: incredibly sweet and soft fish slices that soak up the light palm soup.',
      'Deeply warming: ideal for clearing the chest and body on cool evening hours.'
    ],
    review: {
      stars: 5,
      text: '"Gbagba Fia is the soul of Itsekiri/Urhobo culture! The pepper level and native catfish combination is unmatched!"',
      author: 'Ochuko Esiri',
      location: 'Main Market, Warri'
    },
    reviews: [
      {
        stars: 5,
        text: '"Gbagba Fia is the soul of Itsekiri/Urhobo culture! The pepper level and native catfish combination is unmatched!"',
        author: 'Ochuko Esiri',
        location: 'Main Market, Warri'
      },
      {
        stars: 5,
        text: '"The catfish rounds are extremely fresh, sweet, and non-slurry. Real traditional spices used here."',
        author: 'Esosa Igbinedion',
        location: 'Agbassa'
      },
      {
        stars: 5,
        text: '"My chest is completely clear after sipping this spicy, aromatic broth. Outstanding medicinal quality!"',
        author: 'Benson Utomi',
        location: 'Osubi'
      }
    ],
    proteins: [
      { id: 'catfish-rnd', name: 'Catfish Round', price: 1200 },
      { id: 'mudfish-filet', name: 'Mudfish Filet', price: 1000 },
      { id: 'river-shrimp', name: 'River Shrimp', price: 850 },
      { id: 'kpomo-diced', name: 'Diced Kpomo', price: 400 }
    ],
    swallows: [
      { id: 'starch', name: 'Starch', price: 0 },
      { id: 'eba', name: 'Eba', price: 0 },
      { id: 'fufu', name: 'Fufu', price: 0 }
    ],
    faqs: [
      {
        question: "What are the medicinal benefits of Gbagba Fia Soup?",
        answer: "Gbagba Fia is a traditional Urhobo light palm oil soup brewed with fresh river catfish, local scent leaf sprigs, alligator pepper, and native barks. It is widely enjoyed for its incredibly warming, chest-clearing, and invigorating properties."
      },
      {
        question: "Is the catfish fresh or frozen?",
        answer: "We use only fresh-caught river catfish supplied directly by local Delta fishermen every single morning. We never use frozen or imported catfish rounds."
      }
    ]
  }
];
