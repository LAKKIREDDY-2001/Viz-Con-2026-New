// @ts-nocheck
/* =========================================================
   24 HOURS AT AMAZON — Country Stories
   Generated from the 2024-2025 Amazon global workforce dataset.
   ========================================================= */

function formatExactMillions(value) {
  return (value / 1e6).toFixed(3).replace(/0+$/, "").replace(/\.$/, "") + "M";
}

function siteList(country, limit = 4) {
  const sites = country.amazon && country.amazon.majorSites ? country.amazon.majorSites : [];
  const names = sites.slice(0, limit).map((site) => site.city);
  if (sites.length > limit) names.push(`+${sites.length - limit} more`);
  return names.join(", ");
}

function countryEvidence(country) {
  const sharedSources = (typeof AMAZON_DATA_SOURCES !== "undefined") ? AMAZON_DATA_SOURCES.slice(0, 4) : [];
  return [
    { title: `Amazon ${country.name} jobs and locations`, source: "Amazon Jobs", url: "https://www.amazon.jobs/en/locations" },
    ...sharedSources
  ];
}

function operationsPhrase(country) {
  return country.amazon && country.amazon.operations ? country.amazon.operations.join(", ") : "Amazon operations";
}

function workforcePhrase(country) {
  return country.amazon && country.amazon.employees ? formatPop(country.amazon.employees) : "estimated";
}

function firstSite(country) {
  const sites = country.amazon && country.amazon.majorSites ? country.amazon.majorSites : [];
  return sites[0] || { city: country.capital, type: "Amazon Site" };
}

function fulfillmentSceneText(country) {
  const ops = operationsPhrase(country).toLowerCase();
  if (ops.includes("fulfillment")) {
    return `Fulfillment and delivery teams connect digital orders to physical movement across ${siteList(country, 3)}.`;
  }
  if (ops.includes("aws")) {
    return `AWS teams keep cloud customers moving while corporate and support teams coordinate from ${siteList(country, 3)}.`;
  }
  if (ops.includes("customer")) {
    return `Customer service and support teams help customers and internal teams across regional timezones.`;
  }
  return `Teams coordinate the day's operational handoffs across ${siteList(country, 3)}.`;
}

function buildCountryStory(country) {
  const site = firstSite(country);
  const sites = country.amazon && country.amazon.majorSites ? country.amazon.majorSites : [];
  const region = country.amazon && country.amazon.region ? country.amazon.region : country.continent;
  const siteCount = sites.length;
  const siteLabel = siteCount === 1 ? "major site/city" : "major sites/cities";
  const landmark = country.amazon && country.amazon.landmark;
  return {
    geoName: country.name,
    mapQuery: country.name,
    intro: `${country.name} is part of the ${AMAZON_GLOBAL_WORKFORCE.label} layer with ~${workforcePhrase(country)} estimated employees across ${siteCount} ${siteLabel}. Key operations: ${operationsPhrase(country)}.`,
    scenes: [
      { time: "06:00", icon: "🌅", title: `${site.city} Wakes`, text: `${site.city} comes online as Amazon teams prepare ${region} operations for the day.` },
      { time: "09:00", icon: "💼", title: "Core Teams Start", text: `${operationsPhrase(country)} teams coordinate from ${siteList(country, 4)}.` },
      { time: "12:00", icon: "📊", title: "Midday Flow", text: `${country.name}'s ~${workforcePhrase(country)} Amazonians are in the thick of retail, cloud, support, and operations work.` },
      { time: "15:00", icon: "📦", title: "Operations Handoff", text: fulfillmentSceneText(country) },
      { time: "18:00", icon: "🌇", title: "Regional Rhythm", text: `As the local day winds down, ${country.name}'s teams hand work across Amazon's global ${region} network.` },
      { time: "22:00", icon: "🌙", title: "Around the Clock", text: `Monitoring, customer support, fulfillment planning, and cloud operations keep moving after office hours.` }
    ],
    funFact: landmark || `Listed sites for ${country.name}: ${siteList(country, 8)}.`,
    evidence: countryEvidence(country)
  };
}

const GLOBAL_STORY = {
  geoName: "World",
  mapQuery: "World",
  intro: `${formatExactMillions(AMAZON_GLOBAL_WORKFORCE.total2025)} Amazonians in 2025, ${AMAZON_GLOBAL_WORKFORCE.countries} countries, and ${amazonFeaturedSiteCount()} featured sites/cities power Amazon's global store, cloud, and delivery network around the clock.`,
  scenes: [
    { time: "06:00", icon: "🌅", title: "APAC Wakes First", text: `Hyderabad, Bangalore, Tokyo, Sydney, Singapore, and Beijing bring the day online, led by India's ~${workforcePhrase(COUNTRIES.find((c) => c.id === "in"))} employee footprint.` },
    { time: "09:00", icon: "💼", title: "EMEA Logs On", text: "London, Luxembourg City, Munich, Paris, Milan, Madrid, Dublin, and Cape Town connect retail, corporate, AWS, and fulfillment teams." },
    { time: "12:00", icon: "📊", title: "Global Peak", text: `Amazon's reported workforce moved from ~${formatExactMillions(AMAZON_GLOBAL_WORKFORCE.total2024)} in 2024 to ~${formatExactMillions(AMAZON_GLOBAL_WORKFORCE.total2025)} in 2025.` },
    { time: "15:00", icon: "📦", title: "Fulfillment Rush", text: "Fulfillment and logistics sites from Dallas to Lauwin-Planque, San Fernando de Henares, Wroclaw, Campinas, and Jeddah keep orders moving." },
    { time: "18:00", icon: "🌇", title: "Americas Peak", text: `Seattle, Arlington, Bellevue, Mexico City, São Paulo, Toronto, and San José carry the day as the Americas reach full speed.` },
    { time: "22:00", icon: "🏛️", title: "Anchor Sites", text: "Hyderabad, Seattle, Arlington, Luxembourg City, London, Cape Town, and Bellevue anchor the story behind the numbers." }
  ],
  funFact: "The BYOD country estimates are approximate and are paired with Amazon's reported 2024 and 2025 global workforce totals.",
  evidence: (typeof AMAZON_DATA_SOURCES !== "undefined") ? AMAZON_DATA_SOURCES : []
};

const COUNTRY_STORIES = COUNTRIES.reduce((stories, country) => {
  stories[country.id] = buildCountryStory(country);
  return stories;
}, {});
