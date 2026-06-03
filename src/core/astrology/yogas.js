// Yoga Detection Engine
// Detects classical Vedic astrology yogas from planet positions and lagna.
//
// Inputs follow the same shape used across this module:
//   planets : [{ planet:'Sun', rasi_number:1..12, degrees, is_retrograde }, ...]
//   lagna   : { rasi_number:1..12, degrees, rasi }

// Sign (rasi) lords, keyed by rasi_number 1..12
const SIGN_LORDS = {
  1:'Mars', 2:'Venus', 3:'Mercury', 4:'Moon', 5:'Sun', 6:'Mercury',
  7:'Venus', 8:'Mars', 9:'Jupiter', 10:'Saturn', 11:'Saturn', 12:'Jupiter'
};

const KENDRAS  = [1, 4, 7, 10]; // angular houses
const TRIKONAS = [1, 5, 9];     // trinal houses

// Special graha drishti (planetary aspects) in addition to the universal 7th aspect.
const SPECIAL_ASPECTS = {
  Mars:    [4, 8],
  Jupiter: [5, 9],
  Saturn:  [3, 10]
};

// Wealth-giving houses used for Dhana Yoga.
const DHANA_HOUSES = [1, 2, 5, 9, 11];

// Malefic (dusthana) houses used for Viparita Raja Yoga, with the classical
// variant named after which dusthana lord forms it.
const DUSTHANA_HOUSES = [6, 8, 12];
const VIPARITA_VARIANTS = { 6:'Harsha', 8:'Sarala', 12:'Vimala' };

// Pancha Mahapurusha Yoga: each of the five Tara grahas in its own or
// exaltation sign while in a kendra. own/exalt are rasi_numbers 1..12.
const MAHAPURUSHA = {
  Mars:    { yoga:'Ruchaka', own:[1, 8],   exalt:10 },
  Mercury: { yoga:'Bhadra',  own:[3, 6],   exalt:6  },
  Jupiter: { yoga:'Hamsa',   own:[9, 12],  exalt:4  },
  Venus:   { yoga:'Malavya', own:[2, 7],   exalt:12 },
  Saturn:  { yoga:'Sasa',    own:[10, 11], exalt:7  }
};

// Debilitation (neecha) sign, keyed by planet (rasi_number 1..12).
const DEBILITATION_SIGN = {
  Sun:7, Moon:8, Mars:4, Mercury:12, Jupiter:10, Venus:6, Saturn:1
};

// Planet that attains exaltation in a given sign (rasi_number -> planet).
// Scorpio (8) has no classical exaltation lord.
const EXALTATION_LORD = {
  1:'Sun', 2:'Moon', 4:'Jupiter', 6:'Mercury', 7:'Saturn', 10:'Mars', 12:'Venus'
};

// Reverse lookups derived from the tables above: planet -> the signs it owns,
// and planet -> the sign of its exaltation.
const OWN_SIGNS = {};
Object.entries(SIGN_LORDS).forEach(([r, p]) => { (OWN_SIGNS[p] = OWN_SIGNS[p] || []).push(Number(r)); });
const EXALT_SIGN = {};
Object.entries(EXALTATION_LORD).forEach(([r, p]) => { EXALT_SIGN[p] = Number(r); });

// --- helpers ---------------------------------------------------------------

// Rasi of a given planet (1..12) or null if absent.
const rasiOf = (planets, name) => {
  const p = planets.find(pl => pl.planet === name);
  return p ? p.rasi_number : null;
};

// House (1..12) occupied by `rasiNum`, counted from `fromRasi`.
const houseFrom = (rasiNum, fromRasi) => ((rasiNum - fromRasi + 12) % 12) + 1;

// Rasi sitting in house `house`, counted from the lagna rasi.
const rasiInHouse = (house, lagnaRasi) => ((lagnaRasi - 1 + house - 1) % 12) + 1;

// Lord (planet) of house `house` from the lagna.
const lordOfHouse = (house, lagnaRasi) => SIGN_LORDS[rasiInHouse(house, lagnaRasi)];

// Does the planet at `fromRasi` cast a graha drishti onto `toRasi`?
const aspects = (planetName, fromRasi, toRasi) => {
  const houses = [7, ...(SPECIAL_ASPECTS[planetName] || [])];
  return houses.includes(houseFrom(toRasi, fromRasi));
};

// Two planets occupy the same rasi (conjunction).
const conjunct = (planets, a, b) => {
  const ra = rasiOf(planets, a), rb = rasiOf(planets, b);
  return ra !== null && rb !== null && ra === rb;
};

// Mutual graha drishti between two planets.
const mutualAspect = (planets, a, b) => {
  const ra = rasiOf(planets, a), rb = rasiOf(planets, b);
  if (ra === null || rb === null) return false;
  return aspects(a, ra, rb) && aspects(b, rb, ra);
};

// Parivartana (sign exchange): planet `a` sits in a sign owned by `b`, and vice versa.
const exchange = (planets, a, b) => {
  const ra = rasiOf(planets, a), rb = rasiOf(planets, b);
  if (ra === null || rb === null) return false;
  return SIGN_LORDS[ra] === b && SIGN_LORDS[rb] === a;
};

// --- individual yoga detectors ---------------------------------------------

// Raja Yoga: association between a kendra lord and a trikona lord, either as a
// single yogakaraka planet, or two lords joined by conjunction / mutual aspect /
// sign exchange.
const detectRajaYoga = (planets, lagna) => {
  const lagnaRasi = lagna.rasi_number;
  const kendraLords  = [...new Set(KENDRAS.map(h => lordOfHouse(h, lagnaRasi)))];
  const trikonaLords = [...new Set(TRIKONAS.map(h => lordOfHouse(h, lagnaRasi)))];

  const combinations = [];
  const seenPairs = new Set();

  // Yogakaraka: one planet ruling both a kendra and a trikona.
  kendraLords.filter(p => trikonaLords.includes(p)).forEach(p => {
    if (rasiOf(planets, p) === null) return;
    combinations.push({ planets: [p], type: 'yogakaraka', via: 'rules both kendra and trikona' });
    seenPairs.add(p);
  });

  // Pairs of distinct kendra & trikona lords in relationship.
  kendraLords.forEach(k => {
    trikonaLords.forEach(t => {
      if (k === t) return;
      const key = [k, t].sort().join('|');
      if (seenPairs.has(key)) return;
      let via = null;
      if (conjunct(planets, k, t))         via = 'conjunction';
      else if (mutualAspect(planets, k, t)) via = 'mutual aspect';
      else if (exchange(planets, k, t))     via = 'sign exchange';
      if (via) {
        combinations.push({ planets: [k, t], type: 'lord-association', via });
        seenPairs.add(key);
      }
    });
  });

  return {
    name: 'Raja Yoga',
    name_ta: 'Raja Yogam',
    present: combinations.length > 0,
    description: 'Combination of kendra (angular) and trikona (trinal) lords conferring power and authority.',
    combinations
  };
};

// Gajakesari Yoga: Jupiter in a kendra (1/4/7/10) from the Moon.
const detectGajakesariYoga = (planets) => {
  const moon = rasiOf(planets, 'Moon');
  const jupiter = rasiOf(planets, 'Jupiter');
  const house = (moon !== null && jupiter !== null) ? houseFrom(jupiter, moon) : null;
  const present = house !== null && KENDRAS.includes(house);
  return {
    name: 'Gajakesari Yoga',
    name_ta: 'Gajakesari Yogam',
    present,
    description: 'Jupiter positioned in a kendra from the Moon, granting fame, intelligence and prosperity.',
    details: present ? { planets: ['Moon', 'Jupiter'], jupiter_house_from_moon: house } : null
  };
};

// Budhaaditya Yoga: Sun and Mercury conjunct in the same rasi.
const detectBudhaadityaYoga = (planets) => {
  const present = conjunct(planets, 'Sun', 'Mercury');
  const rasi = present ? rasiOf(planets, 'Sun') : null;
  return {
    name: 'Budhaaditya Yoga',
    name_ta: 'Budhaditya Yogam',
    present,
    description: 'Conjunction of the Sun and Mercury, bestowing intelligence, eloquence and learning.',
    details: present ? { planets: ['Sun', 'Mercury'], rasi_number: rasi } : null
  };
};

// Chandra Mangala Yoga: Moon and Mars conjunct in the same rasi.
const detectChandraMangalaYoga = (planets) => {
  const present = conjunct(planets, 'Moon', 'Mars');
  const rasi = present ? rasiOf(planets, 'Moon') : null;
  return {
    name: 'Chandra Mangala Yoga',
    name_ta: 'Chandra Mangala Yogam',
    present,
    description: 'Conjunction of the Moon and Mars, indicating wealth, enterprise and material gains.',
    details: present ? { planets: ['Moon', 'Mars'], rasi_number: rasi } : null
  };
};

// Dhana Yoga: association between lords of the wealth houses (1/2/5/9/11),
// formed by a single planet ruling two of them, or two lords joined by
// conjunction / mutual aspect / sign exchange.
const detectDhanaYoga = (planets, lagna) => {
  const lagnaRasi = lagna.rasi_number;

  // Map each lord to the wealth houses it rules.
  const lordHouses = {};
  DHANA_HOUSES.forEach(h => {
    const lord = lordOfHouse(h, lagnaRasi);
    (lordHouses[lord] = lordHouses[lord] || []).push(h);
  });

  const combinations = [];
  const seenPairs = new Set();

  // Single planet ruling two or more wealth houses.
  Object.keys(lordHouses).forEach(p => {
    if (lordHouses[p].length >= 2 && rasiOf(planets, p) !== null) {
      combinations.push({ planets: [p], houses: lordHouses[p], type: 'dual-lordship', via: 'rules multiple wealth houses' });
      seenPairs.add(p);
    }
  });

  // Pairs of distinct wealth-house lords in relationship.
  const lords = Object.keys(lordHouses);
  for (let i = 0; i < lords.length; i++) {
    for (let j = i + 1; j < lords.length; j++) {
      const a = lords[i], b = lords[j];
      const key = [a, b].sort().join('|');
      if (seenPairs.has(key)) continue;
      let via = null;
      if (conjunct(planets, a, b))          via = 'conjunction';
      else if (mutualAspect(planets, a, b))  via = 'mutual aspect';
      else if (exchange(planets, a, b))      via = 'sign exchange';
      if (via) {
        combinations.push({ planets: [a, b], houses: [...lordHouses[a], ...lordHouses[b]], type: 'lord-association', via });
        seenPairs.add(key);
      }
    }
  }

  return {
    name: 'Dhana Yoga',
    name_ta: 'Dhana Yogam',
    present: combinations.length > 0,
    description: 'Association of the lords of wealth houses (1/2/5/9/11) conferring prosperity and financial gain.',
    combinations
  };
};

// Neecha Bhanga Yoga: cancellation of a planet's debilitation when classical
// conditions are met, often turning the affliction into a Raja Yoga.
const detectNeechaBhangaYoga = (planets, lagna) => {
  const lagnaRasi = lagna.rasi_number;
  const moonRasi = rasiOf(planets, 'Moon');

  // Is `name` in a kendra (1/4/7/10) from the lagna or the Moon?
  // The kendra-from-Moon test is skipped when the planet is the Moon itself,
  // since a planet is trivially in the 1st from its own position.
  const inKendra = (name) => {
    const r = rasiOf(planets, name);
    if (r === null) return false;
    if (KENDRAS.includes(houseFrom(r, lagnaRasi))) return true;
    if (name !== 'Moon' && moonRasi !== null && KENDRAS.includes(houseFrom(r, moonRasi))) return true;
    return false;
  };

  const cancellations = [];

  planets.forEach(p => {
    const debSign = DEBILITATION_SIGN[p.planet];
    if (debSign === undefined || p.rasi_number !== debSign) return; // not debilitated

    const dispositor = SIGN_LORDS[debSign];          // lord of the debilitation sign
    const exaltLord  = EXALTATION_LORD[debSign];     // planet exalted in that sign (may be undefined)
    const reasons = [];

    // 1. Dispositor sits in a kendra from lagna or Moon.
    if (inKendra(dispositor)) reasons.push(`dispositor ${dispositor} in a kendra from lagna/Moon`);
    // 2. The planet exalted in this sign sits in a kendra from lagna or Moon.
    if (exaltLord && inKendra(exaltLord)) reasons.push(`exaltation lord ${exaltLord} in a kendra from lagna/Moon`);
    // 3. The debilitated planet is conjunct / mutually aspected by its dispositor.
    if (conjunct(planets, p.planet, dispositor) || mutualAspect(planets, p.planet, dispositor))
      reasons.push(`associated with dispositor ${dispositor}`);
    // 4. The debilitated planet is conjunct / mutually aspected by the exaltation lord.
    if (exaltLord && (conjunct(planets, p.planet, exaltLord) || mutualAspect(planets, p.planet, exaltLord)))
      reasons.push(`associated with exaltation lord ${exaltLord}`);
    // 5. Sign exchange (parivartana) with the dispositor.
    if (exchange(planets, p.planet, dispositor)) reasons.push(`sign exchange with dispositor ${dispositor}`);
    // 6. The debilitated planet is retrograde.
    if (p.is_retrograde) reasons.push('debilitated planet is retrograde');

    if (reasons.length > 0) {
      cancellations.push({ planet: p.planet, debilitation_sign: debSign, reasons });
    }
  });

  return {
    name: 'Neecha Bhanga Yoga',
    name_ta: 'Neecha Bhanga Yogam',
    present: cancellations.length > 0,
    description: 'Cancellation of planetary debilitation by classical conditions, often yielding a Raja Yoga.',
    cancellations
  };
};

// Viparita Raja Yoga: a dusthana lord (6/8/12) placed in a dusthana house,
// turning adversity into eventual success. Variants: Harsha (6th lord),
// Sarala (8th lord), Vimala (12th lord).
const detectViparitaRajaYoga = (planets, lagna) => {
  const lagnaRasi = lagna.rasi_number;
  const combinations = [];

  DUSTHANA_HOUSES.forEach(h => {
    const lord = lordOfHouse(h, lagnaRasi);
    const r = rasiOf(planets, lord);
    if (r === null) return;
    const placedHouse = houseFrom(r, lagnaRasi);
    if (DUSTHANA_HOUSES.includes(placedHouse)) {
      combinations.push({
        planet: lord,
        variant: VIPARITA_VARIANTS[h],
        lord_of_house: h,
        placed_in_house: placedHouse
      });
    }
  });

  return {
    name: 'Viparita Raja Yoga',
    name_ta: 'Viparita Raja Yogam',
    present: combinations.length > 0,
    description: 'A dusthana lord (6/8/12) occupying a dusthana house, turning misfortune into success and rise after adversity.',
    combinations
  };
};

// Pancha Mahapurusha Yoga: Ruchaka (Mars), Bhadra (Mercury), Hamsa (Jupiter),
// Malavya (Venus) or Sasa (Saturn) — the planet in its own or exaltation sign
// and simultaneously in a kendra (1/4/7/10) from the lagna.
const detectPanchaMahapurushaYoga = (planets, lagna) => {
  const lagnaRasi = lagna.rasi_number;
  const combinations = [];

  Object.keys(MAHAPURUSHA).forEach(name => {
    const cfg = MAHAPURUSHA[name];
    const r = rasiOf(planets, name);
    if (r === null) return;
    if (!KENDRAS.includes(houseFrom(r, lagnaRasi))) return;

    let dignity = null;
    if (r === cfg.exalt) dignity = 'exalted';
    else if (cfg.own.includes(r)) dignity = 'own sign';
    if (!dignity) return;

    combinations.push({
      planet: name,
      yoga: cfg.yoga,
      dignity,
      rasi_number: r,
      house: houseFrom(r, lagnaRasi)
    });
  });

  return {
    name: 'Pancha Mahapurusha Yoga',
    name_ta: 'Pancha Mahapurusha Yogam',
    present: combinations.length > 0,
    description: 'A Tara graha (Mars/Mercury/Jupiter/Venus/Saturn) in its own or exaltation sign in a kendra, marking a person of great character and distinction.',
    combinations
  };
};

// Kemadruma Yoga: an isolated Moon — no planet (Sun/nodes excluded) in the
// 2nd or 12th from the Moon, nor conjoined with it — indicating struggle and
// instability. Reported as cancelled (Kemadruma Bhanga) when nullifying
// conditions are present.
const detectKemadrumaYoga = (planets, lagna) => {
  const moon = rasiOf(planets, 'Moon');
  if (moon === null) {
    return {
      name: 'Kemadruma Yoga', name_ta: 'Kemadruma Yogam',
      present: false,
      description: 'Isolated Moon with no planets adjacent, indicating hardship and instability.',
      details: null
    };
  }

  // Only the Tara grahas count toward the Moon's company; luminaries and nodes excluded.
  const TARA = ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const occupied = (house) => TARA.some(name => {
    const r = rasiOf(planets, name);
    return r !== null && houseFrom(r, moon) === house;
  });

  const inSecond  = occupied(2);
  const inTwelfth = occupied(12);
  const withMoon  = occupied(1);
  const isolated  = !inSecond && !inTwelfth && !withMoon;

  // Kemadruma Bhanga: conditions that cancel the yoga.
  const cancellations = [];
  [4, 7, 10].forEach(h => { if (occupied(h)) cancellations.push(`planet in the ${h}th from the Moon`); });
  if (KENDRAS.includes(houseFrom(moon, lagna.rasi_number))) cancellations.push('Moon in a kendra from the lagna');

  return {
    name: 'Kemadruma Yoga', name_ta: 'Kemadruma Yogam',
    present: isolated && cancellations.length === 0,
    description: 'Isolated Moon with no planets in the 2nd/12th from it or conjoined, indicating hardship and instability.',
    details: isolated ? { moon_isolated: true, cancelled: cancellations.length > 0, cancellations } : null
  };
};

// Kala Sarpa Yoga: all seven planets hemmed within one half of the zodiac
// bounded by the Rahu-Ketu axis. Uses full longitudes (rasi + degrees).
const detectKalaSarpaYoga = (planets) => {
  const lonOf = (name) => {
    const p = planets.find(pl => pl.planet === name);
    return p ? (p.rasi_number - 1) * 30 + (p.degrees || 0) : null;
  };

  const result = {
    name: 'Kala Sarpa Yoga', name_ta: 'Kala Sarpa Yogam',
    present: false,
    description: 'All seven planets hemmed on one side of the Rahu-Ketu axis, indicating struggle, delays and karmic intensity.',
    details: null
  };

  const rahu = lonOf('Rahu');
  if (rahu === null || lonOf('Ketu') === null) return result;

  const SEVEN = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const EPS = 1e-6;
  let forward = 0, backward = 0, onAxis = 0, total = 0;

  SEVEN.forEach(name => {
    const lon = lonOf(name);
    if (lon === null) return;
    total++;
    const delta = (((lon - rahu) % 360) + 360) % 360; // angle ahead of Rahu (zodiacal)
    if (delta < EPS || Math.abs(delta - 180) < EPS) onAxis++; // conjunct a node -> on the boundary
    else if (delta < 180) forward++;  // arc from Rahu toward Ketu
    else backward++;                  // arc from Ketu toward Rahu
  });

  const formed = total === SEVEN.length && (forward === 0 || backward === 0);
  if (!formed) return result;

  // Kala Sarpa Bhanga: conditions that nullify the dosha.
  const rahuR = rasiOf(planets, 'Rahu');
  const ketuR = rasiOf(planets, 'Ketu');
  const onNode = (name) => {
    const r = rasiOf(planets, name);
    return r !== null && (r === rahuR || r === ketuR);
  };
  const aspectsNode = (name) => {
    const r = rasiOf(planets, name);
    return r !== null && (aspects(name, r, rahuR) || aspects(name, r, ketuR));
  };

  const cancellations = [];
  if (onAxis > 0) cancellations.push('a planet is conjunct Rahu/Ketu, breaking the axis');
  if (onNode('Jupiter')) cancellations.push('Jupiter conjoins a node');
  else if (aspectsNode('Jupiter')) cancellations.push('Jupiter aspects a node');
  if (onNode('Venus')) cancellations.push('Venus conjoins a node');

  result.present = cancellations.length === 0;
  result.details = {
    hemmed_between: ['Rahu', 'Ketu'],
    direction: backward === 0 ? 'Rahu to Ketu' : 'Ketu to Rahu',
    planets_on_axis: onAxis,
    cancelled: cancellations.length > 0,
    cancellations
  };
  return result;
};

// Amala Yoga: a natural benefic (Jupiter / Venus / Mercury) occupying the 10th
// house from the lagna or the Moon, conferring lasting fame and a spotless name.
const detectAmalaYoga = (planets, lagna) => {
  const moon = rasiOf(planets, 'Moon');
  const tenthFromLagna = rasiInHouse(10, lagna.rasi_number);
  const tenthFromMoon = moon !== null ? rasiInHouse(10, moon) : null;

  const combinations = [];
  ['Jupiter', 'Venus', 'Mercury'].forEach(name => {
    const r = rasiOf(planets, name);
    if (r === null) return;
    const from = [];
    if (r === tenthFromLagna) from.push('lagna');
    if (tenthFromMoon !== null && r === tenthFromMoon) from.push('Moon');
    if (from.length) combinations.push({ planet: name, in_tenth_from: from, rasi_number: r });
  });

  return {
    name: 'Amala Yoga',
    name_ta: 'Amala Yogam',
    present: combinations.length > 0,
    description: 'A natural benefic in the 10th from the lagna or the Moon, granting lasting fame, reputation and unblemished character.',
    combinations
  };
};

// Parivartana Yoga: mutual exchange of signs between two planets (each sits in
// a sign owned by the other). Classified by the houses involved: Dainya when a
// dusthana (6/8/12) lord takes part, Khala when the 3rd lord does, else Maha.
const detectParivartanaYoga = (planets, lagna) => {
  const lagnaRasi = lagna.rasi_number;
  const SIGN_OWNERS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

  const combinations = [];
  const seen = new Set();

  for (let i = 0; i < SIGN_OWNERS.length; i++) {
    for (let j = i + 1; j < SIGN_OWNERS.length; j++) {
      const a = SIGN_OWNERS[i], b = SIGN_OWNERS[j];
      if (!exchange(planets, a, b)) continue;
      const key = [a, b].sort().join('|');
      if (seen.has(key)) continue;
      seen.add(key);

      const ha = houseFrom(rasiOf(planets, a), lagnaRasi);
      const hb = houseFrom(rasiOf(planets, b), lagnaRasi);
      let type;
      if (DUSTHANA_HOUSES.includes(ha) || DUSTHANA_HOUSES.includes(hb)) type = 'Dainya';
      else if (ha === 3 || hb === 3) type = 'Khala';
      else type = 'Maha';

      combinations.push({ planets: [a, b], houses: [ha, hb], type });
    }
  }

  return {
    name: 'Parivartana Yoga',
    name_ta: 'Parivartana Yogam',
    present: combinations.length > 0,
    description: 'Mutual exchange of signs between two planets — Maha (auspicious), Dainya (dusthana-involved) or Khala (3rd-house-involved).',
    combinations
  };
};

// Saraswati Yoga: Jupiter, Venus and Mercury all occupying benefic houses
// (1/2/4/5/7/9/10) from the lagna, with Jupiter in its own, exaltation or a
// friendly sign — conferring wisdom, learning, arts and eloquence.
const detectSaraswatiYoga = (planets, lagna) => {
  const lagnaRasi = lagna.rasi_number;
  const SARASWATI_HOUSES = [1, 2, 4, 5, 7, 9, 10];
  // Jupiter's own (9,12), exaltation (4) and friendly signs (Sun/Moon/Mars: 5,4,1,8).
  const JUPITER_GOOD_SIGNS = [1, 4, 5, 8, 9, 12];

  const placements = {};
  let allPlaced = true;
  ['Jupiter', 'Venus', 'Mercury'].forEach(name => {
    const r = rasiOf(planets, name);
    if (r === null) { allPlaced = false; return; }
    const h = houseFrom(r, lagnaRasi);
    placements[name] = h;
    if (!SARASWATI_HOUSES.includes(h)) allPlaced = false;
  });

  const jr = rasiOf(planets, 'Jupiter');
  const jupiterStrong = jr !== null && JUPITER_GOOD_SIGNS.includes(jr);
  const present = allPlaced && jupiterStrong;

  return {
    name: 'Saraswati Yoga',
    name_ta: 'Saraswati Yogam',
    present,
    description: 'Jupiter, Venus and Mercury in benefic houses (1/2/4/5/7/9/10) with Jupiter well-placed, granting wisdom, learning, arts and eloquence.',
    details: present ? { placements, jupiter_sign: jr } : null
  };
};

// Adhi Yoga: benefics (Mercury, Jupiter, Venus) occupying the 6th, 7th and 8th
// houses from the Moon (Chandra Adhi) or the lagna (Lagnadhi), conferring
// leadership, wealth, health and influence.
const detectAdhiYoga = (planets, lagna) => {
  const BENEFICS = ['Mercury', 'Jupiter', 'Venus'];

  // From a reference rasi, which benefics fill houses 6/7/8?
  const fillFrom = (refRasi) => {
    if (refRasi === null) return null;
    const houses = {};
    [6, 7, 8].forEach(h => {
      const targetRasi = rasiInHouse(h, refRasi);
      const occ = BENEFICS.filter(b => rasiOf(planets, b) === targetRasi);
      if (occ.length) houses[h] = occ;
    });
    return { houses, complete: Object.keys(houses).length === 3 };
  };

  const variants = [];
  [['Moon', rasiOf(planets, 'Moon')], ['lagna', lagna.rasi_number]].forEach(([ref, rasi]) => {
    const fill = fillFrom(rasi);
    if (fill && fill.complete) variants.push({ reference: ref, benefics: fill.houses });
  });

  return {
    name: 'Adhi Yoga',
    name_ta: 'Adhi Yogam',
    present: variants.length > 0,
    description: 'Benefics (Mercury, Jupiter, Venus) in the 6th, 7th and 8th from the Moon or lagna, conferring leadership, wealth, health and influence.',
    variants
  };
};

// Vesi / Vasi / Ubhayachari Yoga: planets other than the Moon (nodes excluded)
// flanking the Sun. Vesi = 2nd from Sun, Vasi = 12th from Sun, Ubhayachari =
// both sides occupied.
const detectVesiVasiYoga = (planets) => {
  const sun = rasiOf(planets, 'Sun');
  const result = {
    name: 'Vesi Vasi Ubhayachari Yoga', name_ta: 'Vesi Vasi Ubhayachari Yogam',
    present: false,
    description: 'Planets (other than the Moon) flanking the Sun — Vesi (2nd from Sun), Vasi (12th from Sun) or Ubhayachari (both sides) — granting eloquence, fortune and renown.',
    details: null
  };
  if (sun === null) return result;

  // Exclude the Sun itself, the Moon, and the nodes.
  const CONSIDERED = ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const inSecond  = CONSIDERED.filter(n => rasiOf(planets, n) === rasiInHouse(2, sun));
  const inTwelfth = CONSIDERED.filter(n => rasiOf(planets, n) === rasiInHouse(12, sun));

  let variant = null;
  if (inSecond.length && inTwelfth.length) variant = 'Ubhayachari';
  else if (inSecond.length) variant = 'Vesi';
  else if (inTwelfth.length) variant = 'Vasi';

  result.present = variant !== null;
  if (result.present) {
    result.details = { variant };
    if (inSecond.length) result.details.in_second_from_sun = inSecond;
    if (inTwelfth.length) result.details.in_twelfth_from_sun = inTwelfth;
  }
  return result;
};

// Sunapha / Anapha / Durudhara Yoga: planets other than the Sun (nodes
// excluded) flanking the Moon. Sunapha = 2nd from Moon, Anapha = 12th from
// Moon, Durudhara = both sides occupied. (Lunar counterpart of Vesi/Vasi.)
const detectSunaphaYoga = (planets) => {
  const moon = rasiOf(planets, 'Moon');
  const result = {
    name: 'Sunapha Anapha Durudhara Yoga', name_ta: 'Sunapha Anapha Durudhara Yogam',
    present: false,
    description: 'Planets (other than the Sun) flanking the Moon — Sunapha (2nd from Moon), Anapha (12th from Moon) or Durudhara (both sides) — granting wealth, self-reliance and reputation.',
    details: null
  };
  if (moon === null) return result;

  // Exclude the Moon itself, the Sun, and the nodes.
  const CONSIDERED = ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const inSecond  = CONSIDERED.filter(n => rasiOf(planets, n) === rasiInHouse(2, moon));
  const inTwelfth = CONSIDERED.filter(n => rasiOf(planets, n) === rasiInHouse(12, moon));

  let variant = null;
  if (inSecond.length && inTwelfth.length) variant = 'Durudhara';
  else if (inSecond.length) variant = 'Sunapha';
  else if (inTwelfth.length) variant = 'Anapha';

  result.present = variant !== null;
  if (result.present) {
    result.details = { variant };
    if (inSecond.length) result.details.in_second_from_moon = inSecond;
    if (inTwelfth.length) result.details.in_twelfth_from_moon = inTwelfth;
  }
  return result;
};

// Lakshmi Yoga: the 9th (fortune) lord in its own or exaltation sign and placed
// in a kendra or trikona, with the lagna lord strong — conferring great wealth,
// fortune, fame and prosperity.
const detectLakshmiYoga = (planets, lagna) => {
  const lagnaRasi = lagna.rasi_number;

  const inOwnOrExalt = (planet, rasi) =>
    (OWN_SIGNS[planet] || []).includes(rasi) || EXALT_SIGN[planet] === rasi;
  const inKendraOrTrikona = (rasi) => {
    const h = houseFrom(rasi, lagnaRasi);
    return KENDRAS.includes(h) || TRIKONAS.includes(h);
  };

  const ninthLord = lordOfHouse(9, lagnaRasi);
  const lagnaLord = lordOfHouse(1, lagnaRasi);
  const nr = rasiOf(planets, ninthLord);
  const lr = rasiOf(planets, lagnaLord);

  const result = {
    name: 'Lakshmi Yoga', name_ta: 'Lakshmi Yogam',
    present: false,
    description: 'The 9th lord in its own or exaltation sign in a kendra/trikona with a strong lagna lord, conferring wealth, fortune and prosperity.',
    details: null
  };
  if (nr === null || lr === null) return result;

  const ninthStrong = inOwnOrExalt(ninthLord, nr) && inKendraOrTrikona(nr);
  const lagnaStrong = inOwnOrExalt(lagnaLord, lr) || inKendraOrTrikona(lr);
  result.present = ninthStrong && lagnaStrong;
  if (result.present) {
    result.details = {
      ninth_lord: ninthLord, ninth_lord_sign: nr,
      lagna_lord: lagnaLord, lagna_lord_sign: lr
    };
  }
  return result;
};

// --- aggregate -------------------------------------------------------------

const detectYogas = (planets, lagna) => {
  const all = [
    detectRajaYoga(planets, lagna),
    detectGajakesariYoga(planets),
    detectBudhaadityaYoga(planets),
    detectChandraMangalaYoga(planets),
    detectDhanaYoga(planets, lagna),
    detectNeechaBhangaYoga(planets, lagna),
    detectViparitaRajaYoga(planets, lagna),
    detectPanchaMahapurushaYoga(planets, lagna),
    detectKemadrumaYoga(planets, lagna),
    detectKalaSarpaYoga(planets),
    detectAmalaYoga(planets, lagna),
    detectParivartanaYoga(planets, lagna),
    detectSaraswatiYoga(planets, lagna),
    detectAdhiYoga(planets, lagna),
    detectVesiVasiYoga(planets),
    detectSunaphaYoga(planets),
    detectLakshmiYoga(planets, lagna)
  ];
  return {
    yogas: all,
    present: all.filter(y => y.present).map(y => y.name)
  };
};

module.exports = {
  detectYogas,
  detectRajaYoga,
  detectGajakesariYoga,
  detectBudhaadityaYoga,
  detectChandraMangalaYoga,
  detectDhanaYoga,
  detectNeechaBhangaYoga,
  detectViparitaRajaYoga,
  detectPanchaMahapurushaYoga,
  detectKemadrumaYoga,
  detectKalaSarpaYoga,
  detectAmalaYoga,
  detectParivartanaYoga,
  detectSaraswatiYoga,
  detectAdhiYoga,
  detectVesiVasiYoga,
  detectSunaphaYoga,
  detectLakshmiYoga,
  SIGN_LORDS
};
