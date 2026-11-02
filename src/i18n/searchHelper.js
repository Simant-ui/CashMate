// Comprehensive Bilingual (English <-> Nepali) Semantic Search Dictionary & Engine

export const BILINGUAL_SYNONYMS = [
  {
    category: 'cat-grocery',
    en: ['grocery', 'groceries', 'grocery store', 'supermarket', 'mart', 'rice', 'dal', 'oil', 'vegetables', 'bhatbhateni', 'market'],
    ne: ['किराना', 'किराना पसल', 'रासन', 'खाद्य', 'चामल', 'दाल', 'तेल', 'तरकारी', 'भाटभटेनी', 'बजार', 'सामान']
  },
  {
    category: 'cat-rent',
    en: ['rent', 'room rent', 'house rent', 'flat', 'apartment', 'room', 'landlord'],
    ne: ['भाडा', 'कोठा भाडा', 'घर भाडा', 'फ्ल्याट', 'अपार्टमेन्ट', 'कोठा', 'घरबेटी', 'रूम']
  },
  {
    category: 'cat-elec',
    en: ['electricity', 'electricity bill', 'light', 'power', 'nea', 'current', 'energy'],
    ne: ['बिजुली', 'बिजुली बत्ती', 'बत्ती', 'विद्युत', 'नेआ', 'लाइन', 'बिजुली बिल']
  },
  {
    category: 'cat-food',
    en: ['food', 'dining', 'restaurant', 'hotel', 'cafe', 'snacks', 'lunch', 'dinner', 'breakfast', 'momo', 'khaja', 'canteen'],
    ne: ['खाना', 'खाजा', 'रेस्टुरेन्ट', 'होटल', 'होटेल', 'नास्ता', 'डिनर', 'लन्च', 'मःम', 'मोमो', 'खाजाघर', 'क्यान्टिन']
  },
  {
    category: 'cat-net',
    en: ['internet', 'wifi', 'broadband', 'worldlink', 'vianet', 'subisu', 'data', 'router'],
    ne: ['इन्टरनेट', 'नेट', 'वाइफाइ', 'वाइफाई', 'वर्ल्डलिंक', 'भायनेट', 'सुबिसु', 'राउटर', 'डाटा']
  },
  {
    category: 'cat-water',
    en: ['water', 'drinking water', 'water jar', 'tanker', 'mineral water', 'supply'],
    ne: ['पानी', 'खानेपानी', 'जार', 'पानीको जार', 'ट्याङ्कर', 'धारा', 'खाने पानी']
  },
  {
    category: 'cat-gas',
    en: ['gas', 'cooking gas', 'cylinder', 'lpg', 'stove', 'kitchen gas'],
    ne: ['ग्यास', 'खाना पकाउने ग्यास', 'सिलिन्डर', 'सिलिन्डर ग्यास', 'चुलो', 'एलपीजी']
  },
  {
    category: 'cat-trans',
    en: ['transportation', 'travel', 'bus', 'taxi', 'petrol', 'fuel', 'diesel', 'pathao', 'indrive', 'bike', 'fare', 'vehicle'],
    ne: ['यातायात', 'गाडी', 'गाडी भाडा', 'बस', 'ट्याक्सी', 'पठाओ', 'इनड्राइभ', 'पेट्रोल', 'डिजेल', 'इन्धन', 'भाडा', 'सवारी']
  },
  {
    category: 'cat-health',
    en: ['health', 'medicine', 'hospital', 'doctor', 'clinic', 'pharmacy', 'medical', 'chemist', 'checkup'],
    ne: ['स्वास्थ्य', 'औषधि', 'अस्पताल', 'डाक्टर', 'क्लिनिक', 'मेडिकल', 'फार्मेसी', 'उपचार', 'दवाई', 'चेकअप']
  },
  {
    category: 'cat-edu',
    en: ['school', 'education', 'college', 'books', 'stationery', 'tuition', 'copy', 'pen', 'fees'],
    ne: ['विद्यालय', 'स्कुल', 'कलेज', 'शिक्षा', 'किताब', 'कापी', 'स्टेसनरी', 'ट्युसन', 'शुल्क']
  },
  {
    category: 'cat-mobile',
    en: ['mobile', 'mobile shop', 'phone', 'recharge', 'sim', 'ncell', 'ntc', 'namaste'],
    ne: ['मोबाइल', 'मोबाइल पसल', 'फोन', 'रिचार्ज', 'सिम', 'एनसेल', 'नमस्ते', 'एनटिसी']
  },
  {
    category: 'cat-ent',
    en: ['entertainment', 'movie', 'film', 'cinema', 'hall', 'qfx', 'party', 'picnic', 'outing', 'game'],
    ne: ['मनोरञ्जन', 'चलचित्र', 'फिल्म', 'सिनेमा', 'हल', 'क्युएफएक्स', 'पार्टी', 'पिकनिक', 'घुमघाम', 'खेल']
  },
  {
    category: 'cat-shop',
    en: ['shopping', 'clothes', 'clothing', 'shoes', 'dress', 'daraz', 'mall', 'fashion'],
    ne: ['सपिङ', 'लुगा', 'कपडा', 'जुत्ता', 'पोसाक', 'दराज', 'मल', 'किनमेल']
  },
  {
    category: 'cat-maint',
    en: ['maintenance', 'repair', 'plumber', 'electrician', 'cleaning', 'sweep', 'tools'],
    ne: ['मर्मत', 'मर्मत सम्भार', 'प्लम्बर', 'इलेक्ट्रिसियन', 'सरसफाइ', 'सफाइ', 'सामान']
  },
  {
    category: 'cat-misc',
    en: ['miscellaneous', 'other', 'general', 'extra', 'misc'],
    ne: ['अन्य', 'विविध', 'साधारण', 'अरु', 'थप']
  }
];

// Helper to normalize strings for comparison (Devanagari & English)
export function normalizeQuery(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Intelligent Bilingual Matcher
 * Checks if a given expense or item matches a search query across English & Nepali semantic equivalence.
 *
 * @param {Object} expense - The expense item ({ title, categoryName, categoryId, description, etc. })
 * @param {string} query - The search query typed by the user (can be Nepali or English)
 * @param {string} language - Current app language ('en' | 'ne')
 * @returns {boolean} Whether the item matches the query
 */
export function matchExpenseBilingual(expense, query, language = 'en') {
  if (!query || !query.trim()) return true;

  const cleanQuery = normalizeQuery(query);
  if (!cleanQuery) return true;

  const cleanTitle = normalizeQuery(expense.title || '');
  const cleanCategory = normalizeQuery(expense.categoryName || '');
  const cleanDesc = normalizeQuery(expense.description || '');

  // 1. Direct textual match in whatever text is on the expense
  if (
    cleanTitle.includes(cleanQuery) ||
    cleanCategory.includes(cleanQuery) ||
    cleanDesc.includes(cleanQuery)
  ) {
    return true;
  }

  // 2. Multi-word submatch: If user types "किराना पसल", match if query words intersect
  const queryTokens = cleanQuery.split(' ').filter(Boolean);
  const titleTokens = cleanTitle.split(' ').filter(Boolean);
  const categoryTokens = cleanCategory.split(' ').filter(Boolean);

  const directTokenMatch = queryTokens.some(qToken =>
    titleTokens.some(tToken => tToken.includes(qToken) || qToken.includes(tToken)) ||
    categoryTokens.some(cToken => cToken.includes(qToken) || qToken.includes(cToken))
  );
  if (directTokenMatch) return true;

  // 3. Semantic Synonym & Concept Matching
  // Look up if any token in cleanQuery belongs to a synonym group
  for (const group of BILINGUAL_SYNONYMS) {
    // Check if query matches either EN or NE synonyms of this group
    const matchesGroup =
      group.en.some(syn => cleanQuery.includes(syn) || syn.includes(cleanQuery)) ||
      group.ne.some(syn => cleanQuery.includes(syn) || syn.includes(cleanQuery));

    if (matchesGroup) {
      // Check if this expense matches this group by category ID
      if (expense.categoryId && expense.categoryId === group.category) {
        return true;
      }

      // Check if expense title or category text matches any synonym in this group
      const expenseMatchesGroup =
        group.en.some(syn => cleanTitle.includes(syn) || cleanCategory.includes(syn)) ||
        group.ne.some(syn => cleanTitle.includes(syn) || cleanCategory.includes(syn));

      if (expenseMatchesGroup) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Translate dynamic Category Names based on the currently selected language
 */
export function getTranslatedCategoryName(cat, language = 'en') {
  if (!cat) return '';
  const name = typeof cat === 'string' ? cat : (cat.name || '');
  const id = typeof cat === 'object' ? (cat.id || '') : '';

  // Match by ID first
  const idMap = {
    'cat-rent': { en: 'Rent', ne: 'कोठा भाडा' },
    'cat-groc': { en: 'Grocery', ne: 'किराना तथा खाद्य' },
    'cat-grocery': { en: 'Grocery', ne: 'किराना तथा खाद्य' },
    'cat-elec': { en: 'Electricity', ne: 'बिजुली बत्ती' },
    'cat-food': { en: 'Food & Dining', ne: 'खाना तथा खाजा' },
    'cat-net': { en: 'Internet & WiFi', ne: 'इन्टरनेट तथा वाइफाइ' },
    'cat-water': { en: 'Water', ne: 'खानेपानी' },
    'cat-gas': { en: 'Cooking Gas', ne: 'खाना पकाउने ग्यास' },
    'cat-trans': { en: 'Transportation', ne: 'यातायात भाडा' },
    'cat-ent': { en: 'Entertainment', ne: 'मनोरञ्जन' },
    'cat-health': { en: 'Health & Medicine', ne: 'स्वास्थ्य र औषधि' },
    'cat-shop': { en: 'Shopping', ne: 'सपिङ तथा सामान' },
    'cat-edu': { en: 'Education', ne: 'शिक्षा तथा पुस्तक' },
    'cat-maint': { en: 'Maintenance', ne: 'मर्मत सम्भार' },
    'cat-misc': { en: 'Miscellaneous', ne: 'अन्य विविध' }
  };

  if (id && idMap[id]) {
    return idMap[id][language] || idMap[id].en;
  }

  // Fallback match by Name
  const lowerName = name.toLowerCase();
  for (const group of BILINGUAL_SYNONYMS) {
    if (group.en.some(enWord => lowerName.includes(enWord)) || group.ne.some(neWord => name.includes(neWord))) {
      if (idMap[group.category]) {
        return idMap[group.category][language] || name;
      }
    }
  }

  return name;
}

