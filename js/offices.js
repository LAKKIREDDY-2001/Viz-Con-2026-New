/* =========================================================
   24 HOURS AT AMAZON — Clickable Office & Site Locations
   Generated from the 2024-2025 BYOD major sites/cities dataset.
   ========================================================= */

const AMAZON_JOBS_LOCATION_SLUGS = {
  us: "united-states",
  in: "india",
  gb: "united-kingdom",
  de: "germany",
  jp: "japan",
  ca: "canada",
  fr: "france",
  it: "italy",
  es: "spain",
  pl: "poland",
  au: "australia",
  mx: "mexico",
  br: "brazil",
  ie: "ireland",
  lu: "luxembourg",
  nl: "netherlands",
  sg: "singapore",
  za: "south-africa",
  sa: "saudi-arabia",
  ae: "united-arab-emirates",
  se: "sweden",
  tr: "turkey",
  eg: "egypt",
  be: "belgium",
  cn: "china",
  cr: "costa-rica"
};

function slugifyOfficeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function countrySourceLinks(country) {
  const slug = AMAZON_JOBS_LOCATION_SLUGS[country.id] || slugifyOfficeText(country.name);
  const byodSources = (typeof AMAZON_DATA_SOURCES !== "undefined") ? AMAZON_DATA_SOURCES.slice(0, 3) : [];
  return [
    { title: `Amazon ${country.name} jobs and locations`, source: "Amazon Jobs", url: `https://www.amazon.jobs/en/locations/${slug}` },
    { title: "Amazon corporate offices and facilities", source: "About Amazon", url: "https://www.aboutamazon.com/workplace/corporate-offices" },
    ...byodSources
  ];
}

function createOfficeLocation(country, site, index) {
  const operations = country.amazon && country.amazon.operations ? country.amazon.operations : [];
  const region = country.amazon && country.amazon.region ? country.amazon.region : country.continent;
  const focus = country.amazon ? country.amazon.focus : operations.join(", ");
  return {
    id: `${country.id}-${slugifyOfficeText(site.city)}`,
    city: site.city,
    type: site.type || "Amazon Site",
    lat: site.lat,
    lon: site.lon,
    building: site.building || `${site.city} Amazon site`,
    works: operations,
    detail: site.detail || `${site.city} is one of Amazon's listed ${country.name} sites in the 2024-2025 workforce dataset, supporting ${focus} across the ${region} region.`,
    news: countrySourceLinks(country),
    rank: index + 1
  };
}

const OFFICE_LOCATIONS = COUNTRIES.reduce((locations, country) => {
  const sites = country.amazon && country.amazon.majorSites ? country.amazon.majorSites : [];
  locations[country.id] = sites.map((site, index) => createOfficeLocation(country, site, index));
  return locations;
}, {});

function getOfficeLocations(countryId) {
  return OFFICE_LOCATIONS[countryId] || [];
}

function officeTotalLabel(country) {
  const listed = getOfficeLocations(country.id).length;
  if (listed === 1) return "1 featured site/city";
  return `${listed} featured sites/cities`;
}
