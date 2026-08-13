/* =========================================================
   24 HOURS AT AMAZON — Amazon Global Workforce Data (2024-2025)
   26-country BYOD dataset with major sites/cities and employee estimates.
   ========================================================= */

const AMAZON_GLOBAL_WORKFORCE = {
  label: "Amazon Global Workforce Data (2024-2025)",
  total2024: 1556000,
  total2025: 1576000,
  countries: 26
};

const AMAZON_LANDMARK_SITES = [
  { title: "Largest campus in the world", site: "Hyderabad, India", detail: "9.5 acres, 15,000+ employees" },
  { title: "Global HQ", site: "Seattle, WA", detail: "40+ buildings, 45,000+ corporate employees" },
  { title: "HQ2", site: "Arlington, Virginia", detail: "Opened 2023" },
  { title: "EU HQ", site: "Luxembourg City", detail: "European headquarters and corporate operations" },
  { title: "UK HQ", site: "Principal Place, Shoreditch, London", detail: "United Kingdom headquarters" },
  { title: "Africa HQ", site: "Cape Town, South Africa", detail: "Opened December 2023" },
  { title: "Bellevue campus", site: "Bellevue, WA", detail: "15,000 employees, includes 43-story Bellevue 600 tower" }
];

const AMAZON_DATA_SOURCES = [
  { title: "Amazon Annual Report / SEC 10-K Filing (2024)", source: "Amazon / SEC", url: "https://www.sec.gov/edgar/browse/?CIK=1018724" },
  { title: "About Amazon workforce data page", source: "About Amazon", url: "https://www.aboutamazon.com/" },
  { title: "Amazon company operations section", source: "Wikipedia", url: "https://en.wikipedia.org/wiki/Amazon_(company)" },
  { title: "Historical employee count", source: "Macrotrends", url: "https://www.macrotrends.net/stocks/charts/AMZN/amazon/number-of-employees" },
  { title: "Workforce distribution by country", source: "Revelio Labs", url: "https://www.reveliolabs.com/" }
];

function amazonSite(city, lat, lon, type, building, detail) {
  return { city, lat, lon, type, building, detail };
}

function amazonProfile(region, employees, operations, hq, sites, landmark) {
  return {
    region,
    employees,
    offices: sites.length,
    hq,
    focus: operations.join(", "),
    operations,
    majorSites: sites,
    landmark
  };
}

const COUNTRIES = [
  {
    id: "us",
    name: "United States",
    capital: "Washington D.C.",
    flag: "🇺🇸",
    lat: 39.8,
    lon: -98.5,
    timezone: -5,
    population: 333000000,
    happiness: 6.7,
    internet: 91.8,
    sleep: 8.7,
    work: 7.5,
    leisure: 4.9,
    gdp: 25.5,
    lifeExp: 76.4,
    continent: "North America",
    amazon: amazonProfile("Americas", 1100000, ["HQ", "AWS", "Retail", "Fulfillment", "Whole Foods"], "Seattle, WA", [
      amazonSite("Seattle (HQ)", 47.6062, -122.3321, "Global HQ", "Seattle global headquarters campus", "Amazon's global headquarters footprint includes 40+ buildings and 45,000+ corporate employees."),
      amazonSite("Arlington (HQ2)", 38.8799, -77.1068, "HQ2", "Arlington HQ2 campus", "Amazon's second headquarters opened in 2023 and supports policy, product, engineering, AWS, and operations teams."),
      amazonSite("Nashville", 36.1627, -86.7816, "Operations Hub", "Operations Center of Excellence", "Nashville coordinates transportation, supply chain, fulfillment operations, and customer delivery work."),
      amazonSite("Bellevue", 47.6101, -122.2015, "Corporate Campus", "Bellevue campus and Bellevue 600 tower", "Bellevue supports roughly 15,000 employees and includes the 43-story Bellevue 600 tower."),
      amazonSite("San Francisco", 37.7749, -122.4194, "Tech & AWS", "Bay Area technology office", "San Francisco connects Amazon with engineering, AWS, advertising, and customer teams in the Bay Area."),
      amazonSite("New York", 40.7128, -74.0060, "Corporate & Tech", "New York corporate and technology offices", "New York supports advertising, fashion, marketplace, engineering, and AWS customer teams."),
      amazonSite("Los Angeles", 34.0522, -118.2437, "Media & Retail", "Los Angeles media and business offices", "Los Angeles connects Prime Video, entertainment, advertising, retail, and regional operations."),
      amazonSite("Dallas", 32.7767, -96.7970, "Fulfillment & Operations", "North Texas operations network", "Dallas is a major operations, fulfillment, transportation, and enterprise cloud market."),
      amazonSite("Chicago", 41.8781, -87.6298, "Retail & Fulfillment", "Chicago corporate and operations footprint", "Chicago supports retail, fulfillment, logistics, advertising, and AWS customer work."),
      amazonSite("Phoenix", 33.4484, -112.0740, "Fulfillment & Operations", "Phoenix operations and delivery network", "Phoenix anchors fulfillment, sortation, delivery, and operations activity in the Southwest.")
    ], "Global HQ in Seattle; HQ2 in Arlington; Bellevue campus with 15,000 employees")
  },
  {
    id: "in",
    name: "India",
    capital: "New Delhi",
    flag: "🇮🇳",
    lat: 21.0,
    lon: 78.0,
    timezone: 5.5,
    population: 1408000000,
    happiness: 4.1,
    internet: 46.0,
    sleep: 8.1,
    work: 7.9,
    leisure: 2.9,
    gdp: 3.4,
    lifeExp: 70.1,
    continent: "Asia",
    amazon: amazonProfile("APAC", 435000, ["Tech Dev", "AWS", "Operations", "Fulfillment"], "Hyderabad & Bangalore", [
      amazonSite("Hyderabad (largest campus globally)", 17.4435, 78.3772, "Largest Global Campus", "Hyderabad campus", "Amazon's Hyderabad campus is listed as the largest campus globally at 9.5 acres with 15,000+ employees."),
      amazonSite("Bangalore", 12.9716, 77.5946, "Tech Dev", "Bangalore technology and operations offices", "Bangalore is a major technology development, ecommerce, payments, operations, and seller services hub."),
      amazonSite("Chennai", 13.0827, 80.2707, "Tech & Operations", "Chennai corporate and operations offices", "Chennai supports technology development, customer experience, operations, and support teams."),
      amazonSite("Mumbai", 19.0760, 72.8777, "AWS & Business", "Mumbai business offices and AWS India presence", "Mumbai connects AWS, advertising, finance, media, and enterprise customer teams."),
      amazonSite("Delhi NCR", 28.4595, 77.0266, "Corporate & Operations", "Delhi NCR corporate and operations footprint", "Delhi NCR supports retail, fulfillment, public sector, AWS, and corporate operations."),
      amazonSite("Pune", 18.5204, 73.8567, "Tech Dev", "Pune technology and support offices", "Pune adds software, support, operations, and cloud talent to Amazon India's network.")
    ], "Hyderabad is the largest Amazon campus globally")
  },
  {
    id: "gb",
    name: "United Kingdom",
    capital: "London",
    flag: "🇬🇧",
    lat: 54.0,
    lon: -2.0,
    timezone: 0,
    population: 67200000,
    happiness: 6.8,
    internet: 96.9,
    sleep: 8.2,
    work: 6.3,
    leisure: 4.6,
    gdp: 3.1,
    lifeExp: 81.3,
    continent: "Europe",
    amazon: amazonProfile("EMEA", 72000, ["EU Operations", "AWS", "Retail", "Fulfillment"], "Principal Place, London", [
      amazonSite("London (Principal Place HQ)", 51.5230, -0.0830, "UK HQ", "Principal Place, Shoreditch", "Principal Place is Amazon's UK headquarters and a major EMEA retail, AWS, Prime Video, and corporate hub."),
      amazonSite("Manchester", 53.4808, -2.2426, "Corporate & Tech", "Manchester office", "Manchester expands Amazon's UK technology, operations, advertising, and business footprint."),
      amazonSite("Edinburgh", 55.9533, -3.1883, "Development Center", "Edinburgh technology offices", "Edinburgh supports development, research, engineering, and cloud-adjacent teams."),
      amazonSite("Bristol", 51.4545, -2.5879, "Tech & Operations", "Bristol office", "Bristol supports technology, operations, marketplace, and regional business roles."),
      amazonSite("Cambridge", 52.2053, 0.1218, "Research & Development", "Cambridge development centre", "Cambridge supports machine learning, Alexa, computer vision, and product research.")
    ], "UK HQ at Principal Place, Shoreditch, London")
  },
  {
    id: "de",
    name: "Germany",
    capital: "Berlin",
    flag: "🇩🇪",
    lat: 51.2,
    lon: 10.4,
    timezone: 1,
    population: 83200000,
    happiness: 7.2,
    internet: 93.1,
    sleep: 8.1,
    work: 5.7,
    leisure: 4.7,
    gdp: 4.1,
    lifeExp: 81.2,
    continent: "Europe",
    amazon: amazonProfile("EMEA", 36000, ["EU Retail", "Fulfillment", "AWS", "R&D"], "Munich & Berlin", [
      amazonSite("Munich", 48.1351, 11.5820, "Development Center", "Amazon Development Center Germany", "Munich supports R&D, Alexa, AI, AWS, and retail technology teams."),
      amazonSite("Berlin", 52.5200, 13.4050, "Corporate & Tech", "Berlin corporate and engineering offices", "Berlin supports retail, advertising, marketplace, AWS, and engineering teams."),
      amazonSite("Dresden", 51.0504, 13.7373, "R&D", "Dresden research and development site", "Dresden adds R&D and technology talent to Amazon's German workforce."),
      amazonSite("Aachen", 50.7753, 6.0839, "R&D", "Aachen research site", "Aachen supports research, machine learning, and advanced technology work."),
      amazonSite("Leipzig", 51.3397, 12.3731, "Fulfillment", "Leipzig fulfillment and operations site", "Leipzig is part of Amazon's German fulfillment and logistics network."),
      amazonSite("Dortmund", 51.5136, 7.4653, "Fulfillment", "Dortmund fulfillment and operations site", "Dortmund supports fulfillment, sortation, delivery, and regional logistics.")
    ])
  },
  {
    id: "jp",
    name: "Japan",
    capital: "Tokyo",
    flag: "🇯🇵",
    lat: 36.2,
    lon: 138.2,
    timezone: 9,
    population: 125000000,
    happiness: 6.1,
    internet: 82.9,
    sleep: 7.2,
    work: 7.3,
    leisure: 3.4,
    gdp: 4.2,
    lifeExp: 84.5,
    continent: "Asia",
    amazon: amazonProfile("APAC", 25000, ["Retail", "AWS", "Fulfillment", "Alexa"], "Tokyo", [
      amazonSite("Tokyo", 35.6762, 139.6503, "Country HQ", "Amazon Japan corporate headquarters", "Tokyo coordinates Amazon.co.jp, Prime, AWS, devices, advertising, and entertainment teams."),
      amazonSite("Osaka", 34.6937, 135.5023, "AWS & Regional Business", "Osaka office and AWS Japan presence", "Osaka supports western Japan customers and AWS cloud infrastructure work."),
      amazonSite("Ichikawa", 35.7219, 139.9310, "Fulfillment", "Ichikawa fulfillment and logistics site", "Ichikawa represents Amazon Japan's dense fulfillment and delivery network near Tokyo.")
    ])
  },
  {
    id: "ca",
    name: "Canada",
    capital: "Ottawa",
    flag: "🇨🇦",
    lat: 56.1,
    lon: -106.3,
    timezone: -5,
    population: 38000000,
    happiness: 7.0,
    internet: 93.1,
    sleep: 8.5,
    work: 6.6,
    leisure: 4.6,
    gdp: 2.1,
    lifeExp: 82.3,
    continent: "North America",
    amazon: amazonProfile("Americas", 25000, ["AWS", "Retail", "Fulfillment", "Alexa"], "Toronto & Vancouver", [
      amazonSite("Toronto", 43.6532, -79.3832, "Corporate & AWS", "Toronto corporate and AWS office cluster", "Toronto supports AWS, retail, advertising, Alexa, fulfillment, and engineering work."),
      amazonSite("Vancouver", 49.2827, -123.1207, "Tech Hub", "Vancouver technology offices", "Vancouver is one of Amazon's largest Canadian technology hubs."),
      amazonSite("Ottawa", 45.4215, -75.6972, "AWS & Public Sector", "Ottawa cloud and public-sector office", "Ottawa supports AWS, public sector, retail, and customer teams."),
      amazonSite("Montreal", 45.5019, -73.5674, "Tech & Fulfillment", "Montreal technology and operations footprint", "Montreal adds engineering, retail, fulfillment, and support capacity in eastern Canada.")
    ])
  },
  {
    id: "fr",
    name: "France",
    capital: "Paris",
    flag: "🇫🇷",
    lat: 46.9,
    lon: 2.2,
    timezone: 1,
    population: 67400000,
    happiness: 6.5,
    internet: 92.9,
    sleep: 8.4,
    work: 5.9,
    leisure: 4.4,
    gdp: 2.8,
    lifeExp: 82.5,
    continent: "Europe",
    amazon: amazonProfile("EMEA", 20000, ["Retail", "Fulfillment", "R&D"], "Paris", [
      amazonSite("Paris", 48.8566, 2.3522, "Country HQ", "Amazon France corporate offices", "Paris coordinates Amazon.fr, retail, marketplace, advertising, and corporate teams."),
      amazonSite("Clichy", 48.9045, 2.3045, "Corporate Office", "Clichy office", "Clichy is part of Amazon's Paris-area corporate and retail presence."),
      amazonSite("Lauwin-Planque", 50.3909, 3.0628, "Fulfillment", "Lauwin-Planque fulfillment site", "Lauwin-Planque supports Amazon France fulfillment, inventory flow, and delivery operations.")
    ])
  },
  {
    id: "it",
    name: "Italy",
    capital: "Rome",
    flag: "🇮🇹",
    lat: 41.9,
    lon: 12.6,
    timezone: 1,
    population: 59000000,
    happiness: 6.5,
    internet: 88.5,
    sleep: 8.3,
    work: 6.1,
    leisure: 4.3,
    gdp: 2.1,
    lifeExp: 83.4,
    continent: "Europe",
    amazon: amazonProfile("EMEA", 18000, ["Retail", "Fulfillment", "AWS"], "Milan & Rome", [
      amazonSite("Milan", 45.4642, 9.1900, "Country HQ & AWS", "Amazon Italy corporate office and AWS Milan presence", "Milan links retail, fashion, seller services, advertising, and AWS teams."),
      amazonSite("Turin", 45.0703, 7.6869, "Tech & Operations", "Turin office and operations footprint", "Turin supports technology, retail, operations, and regional customer teams."),
      amazonSite("Rome", 41.9028, 12.4964, "Corporate & Public Sector", "Rome business and public-sector office", "Rome supports public-sector, policy, AWS, retail, and corporate teams."),
      amazonSite("Cagliari", 39.2238, 9.1217, "Customer & Operations", "Cagliari service and operations site", "Cagliari supports customer experience, operations, and regional retail work.")
    ])
  },
  {
    id: "es",
    name: "Spain",
    capital: "Madrid",
    flag: "🇪🇸",
    lat: 40.4,
    lon: -3.7,
    timezone: 1,
    population: 47400000,
    happiness: 6.4,
    internet: 93.0,
    sleep: 8.3,
    work: 6.2,
    leisure: 4.4,
    gdp: 1.4,
    lifeExp: 83.6,
    continent: "Europe",
    amazon: amazonProfile("EMEA", 18000, ["Retail", "Fulfillment"], "Madrid & Barcelona", [
      amazonSite("Madrid", 40.4168, -3.7038, "Country HQ", "Amazon Spain corporate offices", "Madrid coordinates Amazon.es, marketplace, Prime, and national retail operations."),
      amazonSite("Barcelona", 41.3874, 2.1686, "Tech & Seller Hub", "Barcelona technology and business offices", "Barcelona supports seller services, marketplace, engineering, and advertising teams."),
      amazonSite("San Fernando de Henares", 40.4239, -3.5320, "Fulfillment", "Madrid-area fulfillment site", "San Fernando de Henares is part of Amazon Spain's fulfillment and delivery network.")
    ])
  },
  {
    id: "pl",
    name: "Poland",
    capital: "Warsaw",
    flag: "🇵🇱",
    lat: 51.9,
    lon: 19.1,
    timezone: 1,
    population: 38000000,
    happiness: 6.2,
    internet: 89.0,
    sleep: 8.3,
    work: 6.7,
    leisure: 3.9,
    gdp: 0.7,
    lifeExp: 78.0,
    continent: "Europe",
    amazon: amazonProfile("EMEA", 18000, ["Fulfillment", "Tech Dev"], "Gdansk & Wroclaw", [
      amazonSite("Gdansk", 54.3520, 18.6466, "Development Center", "Amazon Development Center Poland", "Gdansk supports technology development, AI, voice, and cloud-adjacent engineering."),
      amazonSite("Wroclaw", 51.1079, 17.0385, "Fulfillment", "Western Poland fulfillment network", "Wroclaw supports fulfillment, sortation, EU logistics, and delivery operations."),
      amazonSite("Poznan", 52.4064, 16.9252, "Fulfillment", "Poznan fulfillment and operations site", "Poznan is part of Amazon Poland's fulfillment and logistics backbone."),
      amazonSite("Katowice", 50.2649, 19.0238, "Fulfillment", "Katowice operations site", "Katowice supports fulfillment, operations, and cross-border logistics.")
    ])
  },
  {
    id: "au",
    name: "Australia",
    capital: "Canberra",
    flag: "🇦🇺",
    lat: -25.0,
    lon: 134.0,
    timezone: 10,
    population: 25700000,
    happiness: 7.2,
    internet: 96.2,
    sleep: 8.6,
    work: 6.4,
    leisure: 4.5,
    gdp: 1.7,
    lifeExp: 83.3,
    continent: "Oceania",
    amazon: amazonProfile("APAC", 12000, ["Retail", "AWS", "Fulfillment"], "Sydney", [
      amazonSite("Sydney", -33.8688, 151.2093, "Country HQ & AWS", "Sydney corporate office and AWS region presence", "Sydney connects retail, advertising, entertainment, and AWS cloud teams."),
      amazonSite("Melbourne", -37.8136, 144.9631, "AWS & Fulfillment", "Melbourne office, fulfillment, and AWS footprint", "Melbourne supports cloud infrastructure, fulfillment, delivery, and retail operations."),
      amazonSite("Brisbane", -27.4698, 153.0251, "Retail & Operations", "Brisbane operations footprint", "Brisbane supports retail operations, delivery, and regional customer experience."),
      amazonSite("Perth", -31.9523, 115.8613, "Fulfillment & Delivery", "Western Australia operations footprint", "Perth extends Amazon's Australian delivery and fulfillment network.")
    ])
  },
  {
    id: "mx",
    name: "Mexico",
    capital: "Mexico City",
    flag: "🇲🇽",
    lat: 23.6,
    lon: -102.5,
    timezone: -6,
    population: 127000000,
    happiness: 6.7,
    internet: 78.6,
    sleep: 7.9,
    work: 8.9,
    leisure: 3.2,
    gdp: 1.4,
    lifeExp: 75.1,
    continent: "North America",
    amazon: amazonProfile("Americas", 10000, ["Retail", "Fulfillment", "AWS"], "Mexico City", [
      amazonSite("Mexico City", 19.4326, -99.1332, "Country HQ", "Amazon Mexico corporate office", "Mexico City coordinates Amazon.com.mx, Prime, seller services, AWS, and retail operations."),
      amazonSite("Guadalajara", 20.6597, -103.3496, "Tech & Operations", "Regional technology and operations offices", "Guadalajara supports operations planning, technology, customer experience, and seller support."),
      amazonSite("Monterrey", 25.6866, -100.3161, "Fulfillment & Operations", "Northern Mexico operations footprint", "Monterrey supports fulfillment, transportation, retail, and delivery operations.")
    ])
  },
  {
    id: "br",
    name: "Brazil",
    capital: "Brasilia",
    flag: "🇧🇷",
    lat: -10.0,
    lon: -52.0,
    timezone: -3,
    population: 213000000,
    happiness: 6.4,
    internet: 81.0,
    sleep: 8.1,
    work: 7.2,
    leisure: 3.8,
    gdp: 1.9,
    lifeExp: 75.9,
    continent: "South America",
    amazon: amazonProfile("Americas", 10000, ["Retail", "Fulfillment", "AWS"], "São Paulo", [
      amazonSite("São Paulo", -23.5505, -46.6333, "Country HQ & AWS", "Amazon Brazil corporate office and AWS São Paulo presence", "São Paulo coordinates Brazilian retail, seller services, AWS, advertising, and enterprise cloud teams."),
      amazonSite("Campinas", -22.9056, -47.0608, "Fulfillment & Operations", "Campinas operations footprint", "Campinas supports fulfillment, logistics, delivery, and regional retail operations.")
    ])
  },
  {
    id: "ie",
    name: "Ireland",
    capital: "Dublin",
    flag: "🇮🇪",
    lat: 53.4,
    lon: -8.2,
    timezone: 0,
    population: 5000000,
    happiness: 7.0,
    internet: 92.0,
    sleep: 8.3,
    work: 6.0,
    leisure: 4.5,
    gdp: 0.5,
    lifeExp: 82.3,
    continent: "Europe",
    amazon: amazonProfile("EMEA", 8000, ["AWS", "EU Operations", "Corporate"], "Dublin", [
      amazonSite("Dublin", 53.3498, -6.2603, "AWS & Corporate Hub", "Dublin corporate, AWS, and operations offices", "Dublin is a major European hub for AWS, corporate, operations, engineering, and advertising teams."),
      amazonSite("Cork", 51.8985, -8.4756, "Operations & Support", "Cork operations and support footprint", "Cork supports operations, customer experience, and regional corporate functions.")
    ])
  },
  {
    id: "lu",
    name: "Luxembourg",
    capital: "Luxembourg City",
    flag: "🇱🇺",
    lat: 49.8,
    lon: 6.1,
    timezone: 1,
    population: 640000,
    happiness: 7.1,
    internet: 97.0,
    sleep: 8.2,
    work: 6.0,
    leisure: 4.5,
    gdp: 0.08,
    lifeExp: 82.0,
    continent: "Europe",
    amazon: amazonProfile("EMEA", 6000, ["EU Headquarters", "Corporate"], "Luxembourg City", [
      amazonSite("Luxembourg City (EU HQ)", 49.6116, 6.1319, "European HQ", "Amazon European corporate headquarters", "Luxembourg City coordinates EU retail strategy, finance, legal, marketplace, and corporate operations.")
    ], "EU HQ in Luxembourg City")
  },
  {
    id: "nl",
    name: "Netherlands",
    capital: "Amsterdam",
    flag: "🇳🇱",
    lat: 52.2,
    lon: 5.3,
    timezone: 1,
    population: 17500000,
    happiness: 7.4,
    internet: 96.0,
    sleep: 8.2,
    work: 5.9,
    leisure: 4.9,
    gdp: 1.0,
    lifeExp: 82.0,
    continent: "Europe",
    amazon: amazonProfile("EMEA", 5000, ["Retail", "Fulfillment"], "Amsterdam", [
      amazonSite("Amsterdam", 52.3676, 4.9041, "Country HQ", "Amazon Netherlands corporate office", "Amsterdam supports Amazon.nl, advertising, marketplace, retail, and AWS customer teams."),
      amazonSite("The Hague", 52.0705, 4.3007, "Corporate & Operations", "The Hague business and operations footprint", "The Hague supports corporate, retail, operations, and policy-adjacent work.")
    ])
  },
  {
    id: "sg",
    name: "Singapore",
    capital: "Singapore",
    flag: "🇸🇬",
    lat: 1.35,
    lon: 103.8,
    timezone: 8,
    population: 5900000,
    happiness: 6.5,
    internet: 92.0,
    sleep: 7.8,
    work: 6.5,
    leisure: 4.1,
    gdp: 0.5,
    lifeExp: 83.9,
    continent: "Asia",
    amazon: amazonProfile("APAC", 4000, ["AWS", "Retail", "Prime Video"], "Singapore", [
      amazonSite("Singapore", 1.3521, 103.8198, "APAC Hub", "Singapore corporate, AWS, retail, and Prime Video offices", "Singapore supports AWS, retail, Prime Video, advertising, finance, and regional operations.")
    ])
  },
  {
    id: "za",
    name: "South Africa",
    capital: "Pretoria",
    flag: "🇿🇦",
    lat: -29.0,
    lon: 24.0,
    timezone: 2,
    population: 59000000,
    happiness: 5.4,
    internet: 72.0,
    sleep: 9.1,
    work: 7.0,
    leisure: 3.0,
    gdp: 0.4,
    lifeExp: 65.3,
    continent: "Africa",
    amazon: amazonProfile("Africa", 4000, ["AWS", "Corporate", "Tech Dev"], "Cape Town", [
      amazonSite("Cape Town (Africa HQ)", -33.9249, 18.4241, "Africa HQ", "Cape Town Africa HQ, AWS, corporate, and tech offices", "Cape Town is Amazon's Africa headquarters, opened December 2023, and supports AWS, corporate, and technology development work.")
    ], "Africa HQ in Cape Town, opened December 2023")
  },
  {
    id: "sa",
    name: "Saudi Arabia",
    capital: "Riyadh",
    flag: "🇸🇦",
    lat: 24.0,
    lon: 45.0,
    timezone: 3,
    population: 35000000,
    happiness: 6.4,
    internet: 95.0,
    sleep: 8.1,
    work: 7.2,
    leisure: 3.6,
    gdp: 1.1,
    lifeExp: 77.0,
    continent: "Middle East",
    amazon: amazonProfile("Middle East", 3500, ["Retail", "AWS", "Fulfillment"], "Riyadh", [
      amazonSite("Riyadh", 24.7136, 46.6753, "Country HQ & AWS", "Amazon Saudi Arabia corporate and AWS customer offices", "Riyadh coordinates Amazon.sa, AWS customers, public-sector, retail, and marketplace teams."),
      amazonSite("Jeddah", 21.4858, 39.1925, "Retail & Logistics", "Western Saudi logistics and business footprint", "Jeddah supports fulfillment, retail operations, delivery, and seller support.")
    ])
  },
  {
    id: "ae",
    name: "United Arab Emirates",
    capital: "Abu Dhabi",
    flag: "🇦🇪",
    lat: 23.4,
    lon: 53.8,
    timezone: 4,
    population: 10000000,
    happiness: 6.6,
    internet: 97.0,
    sleep: 8.0,
    work: 7.0,
    leisure: 3.8,
    gdp: 0.5,
    lifeExp: 78.0,
    continent: "Middle East",
    amazon: amazonProfile("Middle East", 3500, ["Retail", "AWS", "Fulfillment"], "Dubai", [
      amazonSite("Dubai", 25.2048, 55.2708, "Middle East HQ", "Amazon Middle East corporate headquarters", "Dubai coordinates Amazon.ae, regional retail, marketplace, advertising, AWS, and operations."),
      amazonSite("Abu Dhabi", 24.4539, 54.3773, "AWS & Corporate", "Abu Dhabi cloud and business footprint", "Abu Dhabi supports AWS, enterprise cloud, government cloud, corporate, and regional business work.")
    ])
  },
  {
    id: "se",
    name: "Sweden",
    capital: "Stockholm",
    flag: "🇸🇪",
    lat: 60.1,
    lon: 18.6,
    timezone: 1,
    population: 10400000,
    happiness: 7.3,
    internet: 95.0,
    sleep: 8.2,
    work: 5.8,
    leisure: 4.8,
    gdp: 0.6,
    lifeExp: 83.0,
    continent: "Europe",
    amazon: amazonProfile("EMEA", 3000, ["Retail", "Fulfillment"], "Stockholm", [
      amazonSite("Stockholm", 59.3293, 18.0686, "Nordics HQ & AWS", "Stockholm corporate and AWS Nordic offices", "Stockholm anchors Amazon's Swedish retail and AWS Nordic business.")
    ])
  },
  {
    id: "tr",
    name: "Turkey",
    capital: "Ankara",
    flag: "🇹🇷",
    lat: 39.0,
    lon: 35.2,
    timezone: 3,
    population: 85000000,
    happiness: 5.2,
    internet: 81.0,
    sleep: 8.2,
    work: 7.5,
    leisure: 3.4,
    gdp: 0.9,
    lifeExp: 78.0,
    continent: "Europe",
    amazon: amazonProfile("EMEA", 3000, ["Retail", "Fulfillment"], "Istanbul", [
      amazonSite("Istanbul", 41.0082, 28.9784, "Country HQ", "Amazon Turkey corporate office", "Istanbul coordinates Amazon.com.tr, marketplace, retail, seller services, and fulfillment operations.")
    ])
  },
  {
    id: "eg",
    name: "Egypt",
    capital: "Cairo",
    flag: "🇪🇬",
    lat: 26.8,
    lon: 30.8,
    timezone: 2,
    population: 102000000,
    happiness: 4.1,
    internet: 71.9,
    sleep: 8.5,
    work: 8.1,
    leisure: 2.5,
    gdp: 0.4,
    lifeExp: 70.2,
    continent: "Africa",
    amazon: amazonProfile("Africa", 3000, ["Retail", "Fulfillment (ex-Souq)"], "Cairo", [
      amazonSite("Cairo", 30.0444, 31.2357, "Retail & Fulfillment", "Cairo retail, fulfillment, and operations offices", "Cairo supports Amazon Egypt retail, fulfillment, customer experience, and ex-Souq operations.")
    ])
  },
  {
    id: "be",
    name: "Belgium",
    capital: "Brussels",
    flag: "🇧🇪",
    lat: 50.5,
    lon: 4.5,
    timezone: 1,
    population: 11700000,
    happiness: 6.9,
    internet: 94.0,
    sleep: 8.2,
    work: 5.8,
    leisure: 4.7,
    gdp: 0.6,
    lifeExp: 82.0,
    continent: "Europe",
    amazon: amazonProfile("EMEA", 2500, ["Retail", "Fulfillment"], "Brussels", [
      amazonSite("Brussels", 50.8503, 4.3517, "Country Office", "Brussels corporate and business office", "Brussels supports retail, marketplace, business, and regional corporate operations."),
      amazonSite("Antwerp", 51.2194, 4.4025, "Fulfillment & Logistics", "Antwerp operations footprint", "Antwerp supports fulfillment, logistics, delivery, and port-linked operations.")
    ])
  },
  {
    id: "cn",
    name: "China",
    capital: "Beijing",
    flag: "🇨🇳",
    lat: 35.0,
    lon: 103.8,
    timezone: 8,
    population: 1412000000,
    happiness: 5.8,
    internet: 73.1,
    sleep: 7.6,
    work: 8.3,
    leisure: 3.1,
    gdp: 17.9,
    lifeExp: 77.3,
    continent: "Asia",
    amazon: amazonProfile("APAC", 2000, ["AWS", "Kindle", "Cross-border"], "Beijing & Shanghai", [
      amazonSite("Beijing", 39.9042, 116.4074, "Corporate & AWS", "Beijing corporate and cloud customer offices", "Beijing supports AWS customers, Kindle, corporate functions, technology partnerships, and cross-border work."),
      amazonSite("Shanghai", 31.2304, 121.4737, "Cross-border & Tech", "Shanghai business and technology offices", "Shanghai connects Chinese sellers, supply chains, Kindle, AWS customers, and cross-border marketplace work.")
    ])
  },
  {
    id: "cr",
    name: "Costa Rica",
    capital: "San José",
    flag: "🇨🇷",
    lat: 9.7489,
    lon: -83.7534,
    timezone: -6,
    population: 5200000,
    happiness: 6.6,
    internet: 81.0,
    sleep: 8.2,
    work: 7.8,
    leisure: 3.7,
    gdp: 0.07,
    lifeExp: 80.5,
    continent: "North America",
    amazon: amazonProfile("Americas", 2000, ["Customer Service", "AWS Support"], "San José", [
      amazonSite("San José", 9.9281, -84.0907, "Customer Service & AWS Support", "San José customer service and AWS support offices", "San José supports customer service, AWS support, operations, and regional customer experience teams.")
    ])
  }
];

const AMAZON_COUNTRY_ESTIMATE_TOTAL = COUNTRIES.reduce((sum, country) => sum + ((country.amazon && country.amazon.employees) ? country.amazon.employees : 0), 0);
const AMAZON_DASHBOARD_SCALE = AMAZON_COUNTRY_ESTIMATE_TOTAL
  ? AMAZON_GLOBAL_WORKFORCE.total2025 / AMAZON_COUNTRY_ESTIMATE_TOTAL
  : 1;

/* Helper: format population / employees like "1.6M", "435K", or "3.5K" */
function formatPop(p) {
  if (p >= 1e9) return (p / 1e9).toFixed(1) + "B";
  if (p >= 1e6) {
    const millions = p / 1e6;
    return (millions < 10 ? millions.toFixed(1) : Math.round(millions)) + "M";
  }
  if (p >= 1e3) {
    const thousands = p / 1e3;
    return (thousands < 10 ? thousands.toFixed(1) : Math.round(thousands)) + "K";
  }
  return p + "";
}

/* Helper: describe time of day based on hour (0-24) */
function timeOfDay(hour) {
  const h = hour % 24;
  if (h >= 5 && h < 9) return { label: "dawning", emoji: "🌅", color: 0xff8e5a, word: "waking up" };
  if (h >= 9 && h < 16) return { label: "day", emoji: "☀️", color: 0xffd166, word: "working & living" };
  if (h >= 16 && h < 19) return { label: "dusk", emoji: "🌇", color: 0xff8e5a, word: "heading home" };
  if (h >= 19 && h < 23) return { label: "dusk", emoji: "🌆", color: 0x7c5cff, word: "relaxing" };
  return { label: "night", emoji: "🌙", color: 0x5360a8, word: "sleeping" };
}

/* Helper: format hour to 12-hour clock */
function formatHour(h) {
  const hour = Math.floor(h);
  const min = Math.round((h - hour) * 60);
  const period = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return {
    time: String(h12).padStart(2, "0") + ":" + String(min).padStart(2, "0"),
    period: period,
    hour: hour,
    min: min
  };
}

/* Helper: local time at a country given UTC hour */
function localHourAt(country, utcHour) {
  return (utcHour + country.timezone + 24) % 24;
}

/* Helper: country's share of Amazon's 2025 global workforce total */
function amazonShare(country) {
  const totalAmzn = AMAZON_GLOBAL_WORKFORCE.total2025;
  return (country.amazon && country.amazon.employees) ? country.amazon.employees / totalAmzn : 0;
}

/* Helper: normalize rough country estimates back to Amazon's 2025 global total */
function amazonDashboardEmployees(country) {
  const employees = country.amazon && country.amazon.employees ? country.amazon.employees : 0;
  return employees * AMAZON_DASHBOARD_SCALE;
}

/* Helper: total number of featured major sites/cities in the BYOD dataset */
function amazonFeaturedSiteCount() {
  return COUNTRIES.reduce((sum, country) => sum + ((country.amazon && country.amazon.majorSites) ? country.amazon.majorSites.length : 0), 0);
}

/* Helper: country's share of world population */
function worldShare(country) {
  const total = 8.1e9; // ~8.1 billion world population
  return country.population / total;
}
