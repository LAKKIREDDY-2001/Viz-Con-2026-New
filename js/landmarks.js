/* =========================================================
   24 HOURS AT AMAZON — City Landmark Layer
   Famous nearby places for each major Amazon site/city.
   Images hydrate from Wikipedia page summaries, with curated
   Wikimedia fallbacks for contest-critical landmarks.
   ========================================================= */

function commonsImage(fileName, width = 900) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=${width}`;
}

function wikiUrl(title) {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(title).replace(/%20/g, "_")}`;
}

function landmark(siteId, countryId, city, name, lat, lon, wikipediaTitle, caption, imageFile, spotlight) {
  return {
    key: siteId,
    siteId,
    countryId,
    city,
    name,
    lat,
    lon,
    wikipediaTitle,
    sourceUrl: wikiUrl(wikipediaTitle),
    image: imageFile ? commonsImage(imageFile) : "",
    caption,
    spotlight: !!spotlight
  };
}

const LANDMARKS_BY_SITE_ID = {
  "us-seattle-hq": landmark("us-seattle-hq", "us", "Seattle", "Space Needle", 47.6205, -122.3493, "Space Needle", "Seattle's skyline icon gives the headquarters story an instant sense of place.", "Seattle Space needle.jpg", true),
  "us-arlington-hq2": landmark("us-arlington-hq2", "us", "Arlington", "Air Force Memorial", 38.8686, -77.0669, "Air Force Memorial", "Three soaring spires mark the skyline near HQ2 and the Washington, D.C. region.", "", true),
  "us-nashville": landmark("us-nashville", "us", "Nashville", "Ryman Auditorium", 36.1613, -86.7785, "Ryman Auditorium", "A landmark of Nashville's music history beside Amazon's operations story.", ""),
  "us-bellevue": landmark("us-bellevue", "us", "Bellevue", "Bellevue Downtown Park", 47.6101, -122.2015, "Bellevue Downtown Park", "A calm civic landmark near Amazon's growing Bellevue campus.", ""),
  "us-san-francisco": landmark("us-san-francisco", "us", "San Francisco", "Golden Gate Bridge", 37.8199, -122.4783, "Golden Gate Bridge", "The bridge turns the Bay Area tech marker into a recognizable world icon.", ""),
  "us-new-york": landmark("us-new-york", "us", "New York", "Empire State Building", 40.7484, -73.9857, "Empire State Building", "A vertical landmark for Amazon's advertising, fashion, and tech work in New York.", ""),
  "us-los-angeles": landmark("us-los-angeles", "us", "Los Angeles", "Griffith Observatory", 34.1184, -118.3004, "Griffith Observatory", "A cinematic Los Angeles landmark for Prime Video, media, and retail teams.", ""),
  "us-dallas": landmark("us-dallas", "us", "Dallas", "Reunion Tower", 32.7753, -96.8090, "Reunion Tower", "Dallas's skyline sphere pairs well with operations and logistics data.", ""),
  "us-chicago": landmark("us-chicago", "us", "Chicago", "Cloud Gate", 41.8827, -87.6233, "Cloud Gate", "Chicago's reflective icon mirrors the movement of retail and fulfillment systems.", ""),
  "us-phoenix": landmark("us-phoenix", "us", "Phoenix", "Camelback Mountain", 33.5145, -111.9618, "Camelback Mountain", "A desert landmark that grounds the Phoenix operations footprint.", ""),

  "in-hyderabad-largest-campus-globally": landmark("in-hyderabad-largest-campus-globally", "in", "Hyderabad", "Charminar", 17.3616, 78.4747, "Charminar", "Hyderabad's Charminar connects Amazon's largest global campus to the city's historic identity.", "Charminar_Hyderabad_1.jpg", true),
  "in-bangalore": landmark("in-bangalore", "in", "Bangalore", "Vidhana Soudha", 12.9796, 77.5907, "Vidhana Soudha", "Bangalore's civic landmark gives the technology hub a powerful local anchor.", "Vidhansoudha.jpg", true),
  "in-chennai": landmark("in-chennai", "in", "Chennai", "Marina Beach", 13.0500, 80.2824, "Marina Beach", "Chennai's famous waterfront adds a human city layer to the operations story.", ""),
  "in-mumbai": landmark("in-mumbai", "in", "Mumbai", "Gateway of India", 18.9220, 72.8347, "Gateway of India", "Mumbai's waterfront monument pairs naturally with AWS, finance, media, and business teams.", "Gateway-of-India.jpg", true),
  "in-delhi-ncr": landmark("in-delhi-ncr", "in", "Delhi NCR", "India Gate", 28.6129, 77.2295, "India Gate", "India Gate makes the Delhi NCR marker instantly recognizable.", ""),
  "in-pune": landmark("in-pune", "in", "Pune", "Shaniwar Wada", 18.5195, 73.8553, "Shaniwar Wada", "Pune's historic fort adds a heritage layer to the tech and support footprint.", ""),

  "gb-london-principal-place-hq": landmark("gb-london-principal-place-hq", "gb", "London", "Tower Bridge", 51.5055, -0.0754, "Tower Bridge", "Tower Bridge ties Amazon's UK HQ to one of London's most recognizable views.", "Tower Bridge in London.JPG", true),
  "gb-manchester": landmark("gb-manchester", "gb", "Manchester", "Manchester Town Hall", 53.4790, -2.2446, "Manchester Town Hall", "Manchester's civic landmark grounds the northern UK tech and operations story.", ""),
  "gb-edinburgh": landmark("gb-edinburgh", "gb", "Edinburgh", "Edinburgh Castle", 55.9486, -3.1999, "Edinburgh Castle", "The castle places Amazon's development work inside Edinburgh's dramatic city identity.", ""),
  "gb-bristol": landmark("gb-bristol", "gb", "Bristol", "Clifton Suspension Bridge", 51.4545, -2.6278, "Clifton Suspension Bridge", "Bristol's bridge mirrors the connectivity story of cloud and operations work.", ""),
  "gb-cambridge": landmark("gb-cambridge", "gb", "Cambridge", "King's College Chapel", 52.2043, 0.1166, "King's College Chapel, Cambridge", "A research-city landmark for Amazon's AI, machine learning, and product development work.", ""),

  "de-munich": landmark("de-munich", "de", "Munich", "Marienplatz", 48.1372, 11.5755, "Marienplatz", "Munich's central square anchors Amazon's R&D and AWS story in the city.", ""),
  "de-berlin": landmark("de-berlin", "de", "Berlin", "Brandenburg Gate", 52.5163, 13.3777, "Brandenburg Gate", "Berlin's landmark gate gives the German retail and engineering hub a clear visual identity.", ""),
  "de-dresden": landmark("de-dresden", "de", "Dresden", "Frauenkirche Dresden", 51.0519, 13.7415, "Frauenkirche, Dresden", "A rebuilt landmark that gives Dresden's R&D story a memorable civic context.", ""),
  "de-aachen": landmark("de-aachen", "de", "Aachen", "Aachen Cathedral", 50.7748, 6.0839, "Aachen Cathedral", "Aachen Cathedral connects Amazon's research site to a UNESCO landmark.", ""),
  "de-leipzig": landmark("de-leipzig", "de", "Leipzig", "Monument to the Battle of the Nations", 51.3122, 12.4131, "Monument to the Battle of the Nations", "A monumental Leipzig icon near the fulfillment and logistics story.", ""),
  "de-dortmund": landmark("de-dortmund", "de", "Dortmund", "Dortmunder U", 51.5142, 7.4538, "Dortmunder U", "A former brewery turned cultural symbol for Dortmund's operations marker.", ""),

  "jp-tokyo": landmark("jp-tokyo", "jp", "Tokyo", "Tokyo Tower", 35.6586, 139.7454, "Tokyo Tower", "Tokyo Tower makes Amazon Japan's retail, devices, and AWS hub instantly legible.", ""),
  "jp-osaka": landmark("jp-osaka", "jp", "Osaka", "Osaka Castle", 34.6873, 135.5262, "Osaka Castle", "Osaka Castle adds historic scale to Amazon's western Japan business marker.", ""),
  "jp-ichikawa": landmark("jp-ichikawa", "jp", "Ichikawa", "Nakayama Hokekyō-ji", 35.7157, 139.9580, "Nakayama Hokekyō-ji", "A local landmark close to the Tokyo-area fulfillment corridor.", ""),

  "ca-toronto": landmark("ca-toronto", "ca", "Toronto", "CN Tower", 43.6426, -79.3871, "CN Tower", "The CN Tower gives Toronto's AWS, retail, and Alexa hub an unmistakable skyline marker.", ""),
  "ca-vancouver": landmark("ca-vancouver", "ca", "Vancouver", "Canada Place", 49.2887, -123.1110, "Canada Place", "Canada Place connects Vancouver's tech hub to the city's waterfront identity.", ""),
  "ca-ottawa": landmark("ca-ottawa", "ca", "Ottawa", "Parliament Hill", 45.4248, -75.6992, "Parliament Hill", "Parliament Hill adds a public-sector context to Ottawa's AWS and customer work.", ""),
  "ca-montreal": landmark("ca-montreal", "ca", "Montreal", "Notre-Dame Basilica", 45.5045, -73.5561, "Notre-Dame Basilica (Montreal)", "Montreal's landmark basilica anchors the eastern Canada site visually.", ""),

  "fr-paris": landmark("fr-paris", "fr", "Paris", "Eiffel Tower", 48.8584, 2.2945, "Eiffel Tower", "The Eiffel Tower gives Amazon France's headquarters a universal visual cue.", ""),
  "fr-clichy": landmark("fr-clichy", "fr", "Clichy", "Arc de Triomphe", 48.8738, 2.2950, "Arc de Triomphe", "A Paris-area landmark that makes the Clichy corporate footprint feel connected to the capital.", ""),
  "fr-lauwin-planque": landmark("fr-lauwin-planque", "fr", "Lauwin-Planque", "Louvre-Lens", 50.4306, 2.8047, "Louvre-Lens", "A regional cultural landmark near northern France's fulfillment story.", ""),

  "it-milan": landmark("it-milan", "it", "Milan", "Milan Cathedral", 45.4642, 9.1916, "Milan Cathedral", "The Duomo gives Milan's retail, fashion, and AWS marker a powerful sense of place.", ""),
  "it-turin": landmark("it-turin", "it", "Turin", "Mole Antonelliana", 45.0691, 7.6932, "Mole Antonelliana", "Turin's skyline landmark adds visual identity to its operations and tech footprint.", ""),
  "it-rome": landmark("it-rome", "it", "Rome", "Colosseum", 41.8902, 12.4922, "Colosseum", "The Colosseum frames Amazon's Roman public-sector and corporate work in a global landmark city.", ""),
  "it-cagliari": landmark("it-cagliari", "it", "Cagliari", "Bastione di Saint Remy", 39.2174, 9.1166, "Bastione di Saint Remy", "A Cagliari landmark for customer experience and operations work on Sardinia.", ""),

  "es-madrid": landmark("es-madrid", "es", "Madrid", "Royal Palace of Madrid", 40.4179, -3.7143, "Royal Palace of Madrid", "Madrid's royal landmark anchors the Spanish retail and corporate story.", ""),
  "es-barcelona": landmark("es-barcelona", "es", "Barcelona", "Sagrada Família", 41.4036, 2.1744, "Sagrada Família", "Barcelona's famous basilica makes the seller and tech hub visually unforgettable.", ""),
  "es-san-fernando-de-henares": landmark("es-san-fernando-de-henares", "es", "San Fernando de Henares", "Puerta de Alcalá", 40.4200, -3.6888, "Puerta de Alcalá", "A Madrid-area landmark near the fulfillment network.", ""),

  "pl-gdansk": landmark("pl-gdansk", "pl", "Gdansk", "Neptune's Fountain, Gdańsk", 54.3484, 18.6532, "Neptune's Fountain, Gdańsk", "Gdansk's landmark square adds civic identity to the development center story.", ""),
  "pl-wroclaw": landmark("pl-wroclaw", "pl", "Wroclaw", "Market Square, Wrocław", 51.1107, 17.0319, "Market Square, Wrocław", "The market square anchors Wroclaw's European fulfillment role.", ""),
  "pl-poznan": landmark("pl-poznan", "pl", "Poznan", "Poznań Town Hall", 52.4082, 16.9347, "Poznań Town Hall", "Poznan's town hall gives the operations site a recognizable historic center.", ""),
  "pl-katowice": landmark("pl-katowice", "pl", "Katowice", "Spodek", 50.2663, 19.0253, "Spodek", "Spodek brings a futuristic local icon to the Katowice logistics marker.", ""),

  "au-sydney": landmark("au-sydney", "au", "Sydney", "Sydney Opera House", -33.8568, 151.2153, "Sydney Opera House", "The Opera House gives Amazon Australia's retail and AWS story an iconic harbor image.", ""),
  "au-melbourne": landmark("au-melbourne", "au", "Melbourne", "Flinders Street railway station", -37.8183, 144.9671, "Flinders Street railway station", "Melbourne's station helps visitors orient the southern Australia footprint.", ""),
  "au-brisbane": landmark("au-brisbane", "au", "Brisbane", "Story Bridge", -27.4632, 153.0350, "Story Bridge", "The Story Bridge pairs neatly with the site's regional operations story.", ""),
  "au-perth": landmark("au-perth", "au", "Perth", "Elizabeth Quay", -31.9566, 115.8575, "Elizabeth Quay", "Perth's waterfront landmark places the west-coast delivery footprint in context.", ""),

  "mx-mexico-city": landmark("mx-mexico-city", "mx", "Mexico City", "Palacio de Bellas Artes", 19.4352, -99.1412, "Palacio de Bellas Artes", "A cultural landmark for Amazon.com.mx, Prime, seller services, AWS, and retail teams.", ""),
  "mx-guadalajara": landmark("mx-guadalajara", "mx", "Guadalajara", "Guadalajara Cathedral", 20.6767, -103.3469, "Guadalajara Cathedral", "The cathedral places Guadalajara's tech ecosystem inside the city's historic center.", ""),
  "mx-monterrey": landmark("mx-monterrey", "mx", "Monterrey", "Cerro de la Silla", 25.6298, -100.2400, "Cerro de la Silla", "The mountain silhouette grounds Monterrey's northern operations footprint.", ""),

  "br-sao-paulo": landmark("br-sao-paulo", "br", "São Paulo", "São Paulo Museum of Art", -23.5614, -46.6559, "São Paulo Museum of Art", "MASP gives Brazil's retail, AWS, and advertising hub a bold architectural signal.", ""),
  "br-campinas": landmark("br-campinas", "br", "Campinas", "Metropolitan Cathedral of Campinas", -22.9052, -47.0608, "Metropolitan Cathedral of Campinas", "A downtown Campinas landmark for the operations and logistics footprint.", ""),

  "ie-dublin": landmark("ie-dublin", "ie", "Dublin", "Trinity College Dublin", 53.3438, -6.2546, "Trinity College Dublin", "Trinity College gives Dublin's AWS and corporate hub a knowledge-city context.", ""),
  "ie-cork": landmark("ie-cork", "ie", "Cork", "Saint Fin Barre's Cathedral", 51.8945, -8.4807, "Saint Fin Barre's Cathedral", "Cork's cathedral anchors operations and support work in a distinct city image.", ""),

  "lu-luxembourg-city-eu-hq": landmark("lu-luxembourg-city-eu-hq", "lu", "Luxembourg City", "Adolphe Bridge", 49.6090, 6.1267, "Adolphe Bridge", "The bridge gives Amazon's EU headquarters a memorable Luxembourg City landmark.", "", true),
  "nl-amsterdam": landmark("nl-amsterdam", "nl", "Amsterdam", "Rijksmuseum", 52.3600, 4.8852, "Rijksmuseum", "The Rijksmuseum gives Amsterdam's retail and marketplace work a strong visual anchor.", ""),
  "nl-the-hague": landmark("nl-the-hague", "nl", "The Hague", "Peace Palace", 52.0866, 4.2955, "Peace Palace", "The Peace Palace adds civic identity to the Hague business footprint.", ""),

  "sg-singapore": landmark("sg-singapore", "sg", "Singapore", "Marina Bay Sands", 1.2834, 103.8607, "Marina Bay Sands", "Marina Bay Sands gives Singapore's AWS, retail, and Prime Video hub instant recognition.", ""),
  "za-cape-town-africa-hq": landmark("za-cape-town-africa-hq", "za", "Cape Town", "Table Mountain", -33.9628, 18.4098, "Table Mountain", "Table Mountain makes Amazon's Africa HQ marker one of the globe's most visual moments.", "", true),

  "sa-riyadh": landmark("sa-riyadh", "sa", "Riyadh", "Kingdom Centre", 24.7113, 46.6744, "Kingdom Centre", "The tower anchors Amazon.sa, AWS, public-sector, and marketplace work in Riyadh.", ""),
  "sa-jeddah": landmark("sa-jeddah", "sa", "Jeddah", "King Fahd's Fountain", 21.5155, 39.1457, "King Fahd's Fountain", "Jeddah's fountain gives the Red Sea logistics and retail marker a dramatic image.", ""),

  "ae-dubai": landmark("ae-dubai", "ae", "Dubai", "Burj Khalifa", 25.1972, 55.2744, "Burj Khalifa", "The Burj Khalifa gives Amazon's Middle East hub a global skyline signal.", "", true),
  "ae-abu-dhabi": landmark("ae-abu-dhabi", "ae", "Abu Dhabi", "Sheikh Zayed Grand Mosque", 24.4128, 54.4749, "Sheikh Zayed Grand Mosque", "A landmark for Abu Dhabi's AWS and corporate footprint.", ""),
  "se-stockholm": landmark("se-stockholm", "se", "Stockholm", "Stockholm City Hall", 59.3275, 18.0542, "Stockholm City Hall", "Stockholm City Hall grounds the Nordics retail and AWS story.", ""),
  "tr-istanbul": landmark("tr-istanbul", "tr", "Istanbul", "Hagia Sophia", 41.0086, 28.9802, "Hagia Sophia", "Hagia Sophia makes Istanbul's retail and fulfillment marker culturally vivid.", ""),
  "eg-cairo": landmark("eg-cairo", "eg", "Cairo", "Pyramids of Giza", 29.9792, 31.1342, "Giza pyramid complex", "The pyramids give Cairo's retail and ex-Souq operations a powerful regional landmark.", ""),

  "be-brussels": landmark("be-brussels", "be", "Brussels", "Grand-Place", 50.8467, 4.3525, "Grand-Place", "Grand-Place gives Brussels's retail and corporate footprint a civic centerpiece.", ""),
  "be-antwerp": landmark("be-antwerp", "be", "Antwerp", "Cathedral of Our Lady", 51.2204, 4.4010, "Cathedral of Our Lady (Antwerp)", "Antwerp's cathedral pairs with logistics, fulfillment, and port-linked operations.", ""),

  "cn-beijing": landmark("cn-beijing", "cn", "Beijing", "Forbidden City", 39.9163, 116.3972, "Forbidden City", "The Forbidden City makes Beijing's AWS, Kindle, and cross-border work geographically clear.", ""),
  "cn-shanghai": landmark("cn-shanghai", "cn", "Shanghai", "Oriental Pearl Tower", 31.2397, 121.4998, "Oriental Pearl Tower", "Shanghai's skyline icon reinforces the global selling and cross-border story.", ""),
  "cr-san-jose": landmark("cr-san-jose", "cr", "San José", "National Theatre of Costa Rica", 9.9337, -84.0777, "National Theatre of Costa Rica", "San José's theatre gives the customer service and AWS support hub a local landmark.", "")
};

const LANDMARK_LOCATIONS = Object.values(LANDMARKS_BY_SITE_ID);

function getLandmarkForOffice(office) {
  if (!office || !office.id) return null;
  return LANDMARKS_BY_SITE_ID[office.id] || null;
}

function getLandmarksForCountry(countryId) {
  return LANDMARK_LOCATIONS.filter((item) => item.countryId === countryId);
}

function getSpotlightLandmarks() {
  return LANDMARK_LOCATIONS.filter((item) => item.spotlight);
}
