/* =========================================================
   24 HOURS ON EARTH — Main Application Logic
   Unified country panel: Overview | Compare | News & Story
   Time slider, story mode, search, live dashboard, world clock.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // ---- Loader ----
  const loader = document.getElementById("loader");
  const loaderFill = document.getElementById("loader-fill");
  let loadProgress = 0;
  const loadTimer = setInterval(() => {
    loadProgress += Math.random() * 18;
    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(loadTimer);
      loaderFill.style.width = "100%";
      setTimeout(() => {
        loader.classList.add("hidden");
        showScreen("opening");
        if (window.THREE && typeof initGlobe === "function") initGlobe();
      }, 400);
    } else {
      loaderFill.style.width = loadProgress + "%";
    }
  }, 180);

  // ---- Screen management ----
  const screens = document.querySelectorAll(".screen");
  function showScreen(id) {
    screens.forEach((s) => s.classList.remove("active"));
    const target = document.getElementById(id);
    if (target) target.classList.add("active");
  }

  // ---- Opening ----
  const beginBtn = document.getElementById("begin-btn");
  const storyBtn = document.getElementById("story-btn");
  if (beginBtn) {
    beginBtn.addEventListener("click", () => {
      showScreen("globe-screen");
      if (globe && globe.group) {
        globe.group.position.z = 2;
        gsap.to(globe.group.position, { z: 0, duration: 1.5, ease: "power2.out" });
      }
    });
  }
if (storyBtn) {
    storyBtn.addEventListener("click", () => {
      showScreen("globe-screen");
      startStoryMode();
    });
  }

// ---- Global Story (from main page + topbar) ----
  document.querySelectorAll(".global-story-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      showScreen("globe-screen");
      if (globe && globe.group) {
        globe.group.position.z = 2;
        gsap.to(globe.group.position, { z: 0, duration: 1.2, ease: "power2.out" });
      }
      startGlobalStory();
    });
  });

  // ---- Time slider ----
  const slider = document.getElementById("time-slider");
  const timeLabel = document.getElementById("time-label");
  const timePeriod = document.getElementById("time-period");
  const timeIcon = document.getElementById("time-icon");
  const dayWord = document.getElementById("daytime-word");
  const utcClock = document.getElementById("utc-clock");
  const timePlay = document.getElementById("time-play");

  let currentHour = 12;
  let autoTime = false;
  let autoInterval = null;

  function updateAmbientGlow(hour) {
    const ambientGlow = document.getElementById("ambient-glow");
    if (!ambientGlow) return;
    let startColor, endColor;
    if (hour >= 5 && hour < 11) {
      startColor = "rgba(130, 95, 30, 0.15)";
      endColor = "rgba(10, 8, 22, 0.96)";
    } else if (hour >= 11 && hour < 16) {
      startColor = "rgba(77, 240, 255, 0.12)";
      endColor = "rgba(12, 10, 30, 0.96)";
    } else if (hour >= 16 && hour < 20) {
      startColor = "rgba(255, 107, 107, 0.14)";
      endColor = "rgba(14, 8, 24, 0.96)";
    } else {
      startColor = "rgba(10, 15, 35, 0.18)";
      endColor = "rgba(2, 3, 8, 0.98)";
    }
    ambientGlow.style.background = `radial-gradient(circle at 50% 50%, ${startColor} 0%, ${endColor} 100%)`;
  }

  function updateTime(hour) {
    currentHour = hour;
    const f = formatHour(hour);
    const tod = timeOfDay(hour);
    if (timeLabel) timeLabel.textContent = f.time;
    if (timePeriod) timePeriod.textContent = f.period;
    if (timeIcon) timeIcon.textContent = tod.emoji;
    if (dayWord) dayWord.textContent = tod.word;
    if (globe && globe.earth) updateGlobeTime(hour);
    const utcH = Math.floor(hour);
    const utcM = Math.round((hour - utcH) * 60);
    if (utcClock) utcClock.textContent = String(utcH).padStart(2, "0") + ":" + String(utcM).padStart(2, "0") + ":00 UTC";
    updateLiveDashboard(hour);
    updateSelectedCountryTime();
    updatePanelLocalTime();
    updateAmbientGlow(hour);
  }

  if (slider) {
    slider.addEventListener("input", () => {
      updateTime(parseFloat(slider.value));
      stopAutoTime();
    });
  }

  function startAutoTime() {
    if (autoTime) return;
    autoTime = true;
    if (timePlay) timePlay.textContent = "⏸";
    autoInterval = setInterval(() => {
      let h = parseFloat(slider.value) + 0.05;
      if (h >= 24) h = 0;
      slider.value = h;
      updateTime(h);
    }, 200);
  }
  function stopAutoTime() {
    autoTime = false;
    if (timePlay) timePlay.textContent = "▶";
    if (autoInterval) clearInterval(autoInterval);
  }
if (timePlay) {
    timePlay.addEventListener("click", () => {
      // The play button launches the cinematic GLOBAL story
      if (autoTime) stopAutoTime();
      startGlobalStory();
    });
  }

  // ---- Globe click handling ----
  const canvas = document.getElementById("globe-canvas");
  const toolbarTip = document.getElementById("tooltip");

if (canvas) {
    canvas.addEventListener("click", (e) => {
      if (!document.getElementById("globe-screen").classList.contains("active")) return;
      // Check for office marker first (more precise / priority)
const office = (typeof pickOfficeMarker === "function") ? pickOfficeMarker(e.clientX, e.clientY) : null;
      if (office) {
        const c = COUNTRIES.find((cc) => cc.id === office.countryId);
        if (c) {
          selectedOfficeByCountry[c.id] = office.id;
          showCountry(c);
          openPanelTab("story");
          renderStoryContent(c, office.id);
          moveGlobeToOffice(office);
        }
        return;
      }
      const country = pickCountry(e.clientX, e.clientY);
      if (country) showCountry(country);
      else closeCountry();
    });

    canvas.addEventListener("mousemove", (e) => {
      if (!document.getElementById("globe-screen").classList.contains("active")) return;
      const office = (typeof pickOfficeMarker === "function") ? pickOfficeMarker(e.clientX, e.clientY) : null;
      if (office && toolbarTip) {
        toolbarTip.textContent = "🏢 " + office.city + " · " + office.type;
        toolbarTip.style.left = (e.clientX + 14) + "px";
        toolbarTip.style.top = (e.clientY + 14) + "px";
        toolbarTip.classList.add("show");
        canvas.classList.add("is-hovering-target");
        if (canvas.style.cursor !== "grabbing") canvas.style.cursor = "pointer";
        return;
      }
      const country = pickCountry(e.clientX, e.clientY);
      if (country && toolbarTip) {
        toolbarTip.textContent = country.flag + " " + country.name;
        toolbarTip.style.left = (e.clientX + 14) + "px";
        toolbarTip.style.top = (e.clientY + 14) + "px";
        toolbarTip.classList.add("show");
        canvas.classList.add("is-hovering-target");
        if (canvas.style.cursor !== "grabbing") canvas.style.cursor = "pointer";
      } else if (toolbarTip) {
        toolbarTip.classList.remove("show");
        canvas.classList.remove("is-hovering-target");
        if (canvas.style.cursor !== "grabbing") canvas.style.cursor = "grab";
      }
    });
    if (canvas) canvas.addEventListener("mouseleave", () => {
      if (toolbarTip) toolbarTip.classList.remove("show");
      canvas.classList.remove("is-hovering-target");
      if (canvas.style.cursor !== "grabbing") canvas.style.cursor = "grab";
    });
  }

  // ---- Unified Country Panel ----
  const countryPanel = document.getElementById("country-panel");
  const panelTabs = document.querySelectorAll(".ptab");
  const panelContents = document.querySelectorAll(".panel-content");
  let currentCountry = null;
  let compareSelection = [null, null];
  let compareChart = null;
  const selectedOfficeByCountry = {};
  function countryWorkState(localHour) {
    if (localHour >= 5 && localHour < 8) return "Waking up";
    if (localHour >= 8 && localHour < 12) return "Morning shift";
    if (localHour >= 12 && localHour < 15) return "Midday flow";
    if (localHour >= 15 && localHour < 19) return "Peak handoff";
    if (localHour >= 19 && localHour < 23) return "Evening support";
    return "Night operations";
  }

  function updateSelectedCountryTime() {
    if (!utcClock) return;
    if (!currentCountry) {
      const utcH = Math.floor(currentHour);
      const utcM = Math.round((currentHour - utcH) * 60);
      const utcTime = String(utcH).padStart(2, "0") + ":" + String(utcM).padStart(2, "0") + ":00 UTC";
      utcClock.innerHTML = `🌍 Global Workforce Clock · ${utcTime}`;
      return;
    }
    const localHour = localHourAt(currentCountry, currentHour);
    const formatted = formatHour(localHour);
    const state = countryWorkState(localHour);
    utcClock.innerHTML = `<span class="clock-flag">${currentCountry.flag}</span> <span class="clock-highlight-country">${currentCountry.name}</span> · Local Time: ${formatted.time} ${formatted.period} <span class="clock-rhythm-badge">${state}</span>`;
  }

  // Tab switching
  panelTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      panelTabs.forEach((t) => t.classList.remove("active"));
      panelContents.forEach((c) => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("panel-" + tab.dataset.tab).classList.add("active");
      // Init charts lazily
      if (tab.dataset.tab === "compare" && !compareChart) initCompareChart("radar");
      if (tab.dataset.tab === "compare" && currentCountry && !compareSelection[0]) {
        // Pre-select current country as A
        compareSelection[0] = currentCountry;
        setCompareCol(0, currentCountry);
        renderCompareChart();
      }
      if (tab.dataset.tab === "story" && currentCountry) {
        renderStoryContent(currentCountry);
      }
    });
  });

  const cardOfficeBtn = document.getElementById("card-office-btn");
  if (cardOfficeBtn) {
    cardOfficeBtn.addEventListener("click", () => {
      if (currentCountry) openPanelTab("story");
    });
  }

  // Panel close
  const panelClose = document.getElementById("panel-close");
  if (panelClose) panelClose.addEventListener("click", closeCountry);

  // Show country (populates overview + story + compare)
  function showCountry(country) {
    currentCountry = country;
    
    // Reset explorer panel tab back to Overview and clear active office highlights
    if (typeof openPanelTab === "function") openPanelTab("overview");
    if (typeof highlightOffice === "function") highlightOffice(null, false);

    document.getElementById("card-name").textContent = country.name;
    document.getElementById("card-capital").textContent = country.capital + " · " + (country.amazon ? country.amazon.region : country.continent);
    document.getElementById("flag-box").textContent = country.flag;
document.getElementById("card-pop").textContent = formatPop(country.population);
    document.getElementById("card-happy").textContent = country.happiness.toFixed(1);
    document.getElementById("card-internet").textContent = country.internet.toFixed(1) + "%";
    if (document.getElementById("card-amzn-emp")) document.getElementById("card-amzn-emp").textContent = formatPop(country.amazon ? country.amazon.employees : 0);
    if (document.getElementById("card-amzn-off")) document.getElementById("card-amzn-off").textContent = country.amazon ? country.amazon.offices : "—";
    if (document.getElementById("card-amzn-share")) document.getElementById("card-amzn-share").textContent = (amazonShare(country) * 100).toFixed(1) + "%";
    if (document.getElementById("card-amzn-focus")) document.getElementById("card-amzn-focus").textContent = country.amazon ? `${country.amazon.hq} · ${country.amazon.region} · ${country.amazon.focus}` : "—";
    if (document.getElementById("card-local-time")) document.getElementById("card-local-time").textContent = "Local: " + formatHour(localHourAt(country, currentHour)).time + " " + formatHour(localHourAt(country, currentHour)).period;

    document.getElementById("bar-sleep").style.width = (country.sleep / 10 * 100) + "%";
    document.getElementById("bar-work").style.width = (country.work / 10 * 100) + "%";
    document.getElementById("bar-leisure").style.width = (country.leisure / 6 * 100) + "%";
    document.getElementById("num-sleep").textContent = country.sleep.toFixed(1) + "h";
    document.getElementById("num-work").textContent = country.work.toFixed(1) + "h";
    document.getElementById("num-leisure").textContent = country.leisure.toFixed(1) + "h";

    // Pre-fill compare A with this country unless A already chosen by user
    if (!compareSelection[0] || compareSelection[0].id === country.id) {
      compareSelection[0] = country;
      setCompareCol(0, country);
      renderCompareChart();
    } else if (compareSelection[0].id !== country.id && compareSelection[1] && compareSelection[1].id === country.id) {
      // already B
    } else if (compareSelection[1] && compareSelection[1].id !== country.id) {
      compareSelection[1] = country;
      setCompareCol(1, country);
      renderCompareChart();
    } else if (!compareSelection[1]) {
      compareSelection[1] = country;
      setCompareCol(1, country);
      renderCompareChart();
    }

// Also render story content
    renderStoryContent(country);

    // Render buildings list in overview
    renderBuildingsList(country);
    renderOverviewPlaces(country);
    updateSelectedCountryTime();

    countryPanel.classList.add("show");
    if (globe) {
      highlightCountry(country.id, true);
      globe.setTargetRotation(country.lat, country.lon);
    }
  }

  // Render the buildings/office list in the Overview tab
  function renderBuildingsList(country) {
    const listEl = document.getElementById("buildings-list");
    const countEl = document.getElementById("buildings-count");
    if (!listEl) return;
    listEl.innerHTML = "";
    const offices = officesForCountry(country);
    if (countEl) countEl.textContent = (typeof officeTotalLabel === "function") ? officeTotalLabel(country) : offices.length + " sites";
    if (!offices.length) {
      listEl.innerHTML = `<div class="building-empty">Site details being researched for ${country.name}.</div>`;
      return;
    }
    offices.forEach((office) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "building-item";
      item.innerHTML = `
        <span class="building-icon">🏢</span>
        <span class="building-info">
          <strong>${office.city}</strong>
          <small>${office.type}</small>
          <em>${office.building}</em>
        </span>
        <span class="building-arrow">➜</span>`;
      item.addEventListener("click", () => {
        selectedOfficeByCountry[country.id] = office.id;
        openPanelTab("story");
        renderStoryContent(country, office.id);
        moveGlobeToOffice(office);
      });
      listEl.appendChild(item);
    });
  }

  function placesForCountry(country) {
    return (typeof getLandmarksForCountry === "function") ? getLandmarksForCountry(country.id) : [];
  }

  function setCountryMoment(country, place) {
    const moment = document.getElementById("country-moment");
    const photo = document.getElementById("country-moment-photo");
    const img = document.getElementById("country-moment-img");
    const kicker = document.getElementById("country-moment-kicker");
    const title = document.getElementById("country-moment-title");
    const text = document.getElementById("country-moment-text");
    if (!moment || !photo || !img || !kicker || !title || !text) return;

    if (!place) {
      moment.classList.add("is-empty");
      img.removeAttribute("src");
      img.alt = "";
      kicker.textContent = country.flag + " " + country.name;
      title.textContent = country.amazon ? country.amazon.hq : country.capital;
      text.textContent = country.amazon
        ? `${country.amazon.focus} teams shape the local Amazon story.`
        : `${country.capital} anchors this country's overview.`;
      return;
    }

    moment.classList.remove("is-empty");
    photo.classList.remove("is-loaded", "no-image", "is-loading");
    img.alt = `${place.name}, ${place.city}`;
    if (place.image) img.src = place.image;
    else img.removeAttribute("src");
    kicker.textContent = `${place.city} · ${country.name}`;
    title.textContent = place.name;
    text.textContent = place.caption;
    hydratePlaceImage(place, img, photo);
  }

  function renderOverviewPlaces(country) {
    const strip = document.getElementById("place-strip");
    const places = placesForCountry(country);
    const featured = places.find((place) => place.spotlight) || places[0] || null;
    setCountryMoment(country, featured);
    if (!strip) return;
    strip.innerHTML = "";
    if (!places.length) return;

    places.slice(0, 6).forEach((place) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "place-chip" + (place.key === (featured && featured.key) ? " active" : "");
      chip.innerHTML = `
        <span class="place-chip-photo">
          <img alt="${place.name}" loading="lazy" />
          <em>📍</em>
        </span>
        <span class="place-chip-copy">
          <strong>${place.name}</strong>
          <small>${place.city}</small>
        </span>`;
      const chipPhoto = chip.querySelector(".place-chip-photo");
      const chipImg = chip.querySelector("img");
      if (place.image) chipImg.src = place.image;
      hydratePlaceImage(place, chipImg, chipPhoto);
      chip.addEventListener("click", () => {
        strip.querySelectorAll(".place-chip").forEach((item) => item.classList.remove("active"));
        chip.classList.add("active");
        setCountryMoment(country, place);
        const office = officesForCountry(country).find((item) => item.id === place.siteId);
        if (office) {
          selectedOfficeByCountry[country.id] = office.id;
          if (typeof highlightOffice === "function") highlightOffice(office.id, true);
          if (globe) globe.setTargetRotation(office.lat, office.lon);
        }
      });
      strip.appendChild(chip);
    });
  }

  function closeCountry() {
    countryPanel.classList.remove("show");
    if (globe) {
      highlightCountry(null, false);
      if (typeof highlightOffice === "function") highlightOffice(null, false);
      globe.resumeAutoRotate();
    }
    currentCountry = null;
    updateSelectedCountryTime();
    // Reset active tab to overview on close
    panelTabs.forEach((t) => t.classList.remove("active"));
    panelContents.forEach((c) => c.classList.remove("active"));
    document.querySelector('.ptab[data-tab="overview"]').classList.add("active");
    document.getElementById("panel-overview").classList.add("active");
  }

  function updatePanelLocalTime() {
    if (!currentCountry) return;
    const local = formatHour(localHourAt(currentCountry, currentHour));
    const localText = `${local.time} ${local.period}`;
    const cardLocal = document.getElementById("card-local-time");
    const officeLocal = document.getElementById("office-local-time");
    if (cardLocal) cardLocal.textContent = "Local: " + localText;
    if (officeLocal) officeLocal.textContent = localText;
  }

  // ---- Compare implementation ----
  function initCompareChart(type) {
    const ctx = document.getElementById("compare-chart");
    if (!ctx) return;
    const isRadar = type === "radar";
    if (compareChart) { compareChart.destroy(); compareChart = null; }
    compareChart = new Chart(ctx, {
      type: isRadar ? "radar" : "bar",
      data: {
        labels: ["Sleep", "Work", "Leisure"],
        datasets: [
          { label: "Country A", data: [0, 0, 0], backgroundColor: isRadar ? "rgba(77,240,255,0.2)" : "rgba(77,240,255,0.7)", borderColor: "#4df0ff", borderWidth: 2, pointBackgroundColor: "#4df0ff" },
          { label: "Country B", data: [0, 0, 0], backgroundColor: isRadar ? "rgba(255,107,107,0.2)" : "rgba(255,107,107,0.7)", borderColor: "#ff6b6b", borderWidth: 2, pointBackgroundColor: "#ff6b6b" }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: "#eaf6ff" } } },
        scales: isRadar ? {
          r: { beginAtZero: true, ticks: { color: "#8fa3c0", backdropColor: "transparent" }, grid: { color: "rgba(255,255,255,0.1)" }, angleLines: { color: "rgba(255,255,255,0.1)" }, pointLabels: { color: "#eaf6ff" } }
        } : {
          y: { beginAtZero: true, ticks: { color: "#8fa3c0" }, grid: { color: "rgba(255,255,255,0.08)" } },
          x: { ticks: { color: "#eaf6ff" }, grid: { display: false } }
        }
      }
    });
  }

  function setCompareCol(idx, country) {
    const colName = idx === 0 ? "comp-a-name" : "comp-b-name";
    const colFlag = idx === 0 ? "compare-a" : "compare-b";
    const nameEl = document.getElementById(colName);
    const flagEl = document.querySelector("#" + colFlag + " .compare-flag");
    if (flagEl) flagEl.textContent = country.flag;
    if (nameEl) nameEl.textContent = country.name;
    const col = document.getElementById(colFlag);
    if (col) {
      col.dataset.id = country.id;
      col.classList.add("selected");
    }
  }

  function renderCompareChart() {
    if (!compareChart) return;
    const a = compareSelection[0];
    const b = compareSelection[1];
    if (a) { compareChart.data.datasets[0].data = [a.sleep, a.work, a.leisure]; compareChart.data.datasets[0].label = a.name; }
    if (b) { compareChart.data.datasets[1].data = [b.sleep, b.work, b.leisure]; compareChart.data.datasets[1].label = b.name; }
    compareChart.update();
  }

  // Compare column click -> rotate country
  const compareCols = document.querySelectorAll(".compare-col");
  compareCols.forEach((col, idx) => {
    col.addEventListener("click", () => {
      const list = COUNTRIES;
      const cur = col.dataset.id ? list.findIndex((c) => c.id === col.dataset.id) : -1;
      const next = list[(cur + 1) % list.length];
      compareSelection[idx] = next;
      setCompareCol(idx, next);
      // If one side is the current selected country, swap the other
      if (currentCountry) {
        if (idx === 0 && next.id !== currentCountry.id) {
          // ensure other side holds currentCountry
          if (compareSelection[1] && compareSelection[1].id !== currentCountry.id) {
            compareSelection[1] = currentCountry;
            setCompareCol(1, currentCountry);
          } else if (!compareSelection[1]) {
            compareSelection[1] = currentCountry;
            setCompareCol(1, currentCountry);
          }
        }
      }
      renderCompareChart();
    });
  });

  // Compare tabs (radar/bar)
  document.querySelectorAll(".ctab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".ctab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      initCompareChart(tab.dataset.chart);
      renderCompareChart();
    });
  });

  // ---- Compare top-bar button (opens panel with compare tab) ----
  const compareBtn = document.getElementById("compare-btn");
  if (compareBtn) {
    compareBtn.addEventListener("click", () => {
      closeCountry();
      openPanelTab("compare");
    });
  }

  const officesBtn = document.getElementById("offices-btn");
  if (officesBtn) {
    officesBtn.addEventListener("click", () => {
      showScreen("explore-screen");
      buildExploreGrid();
    });
  }

  function openPanelTab(tabName) {
    countryPanel.classList.add("show");
    panelTabs.forEach((t) => t.classList.remove("active"));
    panelContents.forEach((c) => c.classList.remove("active"));
    document.querySelector('.ptab[data-tab="' + tabName + '"]').classList.add("active");
    document.getElementById("panel-" + tabName).classList.add("active");
    if (tabName === "compare") {
      if (!compareChart) initCompareChart("radar");
      if (currentCountry && !compareSelection[0]) {
        compareSelection[0] = currentCountry;
        setCompareCol(0, currentCountry);
      }
      renderCompareChart();
    }
    if (tabName === "story" && currentCountry) {
      renderStoryContent(currentCountry);
    }
  }

  // ---- Story rendering inside panel ----
  function mapEmbed(lat, lon, spanLon = 1.8, spanLat = 1.2) {
    const bbox = [
      (lon - spanLon).toFixed(4),
      (lat - spanLat).toFixed(4),
      (lon + spanLon).toFixed(4),
      (lat + spanLat).toFixed(4)
    ].join("%2C");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;
  }

function officesForCountry(country) {
    return (typeof getOfficeLocations === "function") ? getOfficeLocations(country.id) : [];
  }

  function placeForOffice(office) {
    return (typeof getLandmarkForOffice === "function") ? getLandmarkForOffice(office) : null;
  }

  function moveGlobeToOffice(office) {
    if (!globe || !office) return;
    if (typeof highlightOffice === "function") highlightOffice(office.id, true);
    globe.setTargetRotation(office.lat, office.lon);
  }

  // Map office type to a visual emoji
  function officeTypeEmoji(type) {
    const t = (type || "").toLowerCase();
    if (t.includes("hq") || t.includes("headquarter")) return "🏛️";
    if (t.includes("aws") || t.includes("cloud") || t.includes("region")) return "☁️";
    if (t.includes("fulfill") || t.includes("logistic") || t.includes("delivery")) return "📦";
    if (t.includes("dev") || t.includes("research") || t.includes("tech")) return "💻";
    if (t.includes("ads") || t.includes("media")) return "🎬";
    if (t.includes("campus")) return "🏢";
    return "📍";
  }

  // Assign a hue for the banner based on office type
  function officeHue(type) {
    const t = (type || "").toLowerCase();
    if (t.includes("hq") || t.includes("headquarter")) return 48;
    if (t.includes("aws") || t.includes("cloud") || t.includes("region")) return 190;
    if (t.includes("fulfill") || t.includes("logistic") || t.includes("delivery")) return 4;
    if (t.includes("dev") || t.includes("research") || t.includes("tech")) return 260;
    if (t.includes("ads") || t.includes("media")) return 320;
    return 210;
  }

  function renderPlaceCard(place) {
    if (!place) {
      return `
        <div class="place-card place-empty">
          <div class="place-copy">
            <span class="place-kicker">Nearby place</span>
            <h5>Local place coming soon</h5>
            <p>This site still has place research to add.</p>
          </div>
        </div>`;
    }

    return `
      <div class="place-card" data-place-key="${place.key}">
        <div class="place-photo${place.image ? "" : " no-image"}">
          <img class="place-img" ${place.image ? `src="${place.image}"` : ""} alt="${place.name}" loading="lazy" />
          <span class="place-fallback">📸</span>
        </div>
        <div class="place-copy">
          <span class="place-kicker">Nearby famous place</span>
          <h5>${place.name}</h5>
          <p>${place.caption}</p>
          <div class="place-actions">
            <a class="place-link" href="${place.sourceUrl}" target="_blank" rel="noopener">Wikipedia ↗</a>
          </div>
        </div>
      </div>`;
  }

  function hydratePlaceCard(place) {
    if (!place) return;
    const card = document.querySelector(`.place-card[data-place-key="${place.key}"]`);
    if (!card) return;
    const imageWrap = card.querySelector(".place-photo");
    const img = card.querySelector(".place-img");
    if (!imageWrap || !img) return;
    hydratePlaceImage(place, img, imageWrap);
  }

  function hydratePlaceImage(place, img, imageWrap) {
    if (!place || !img || !imageWrap) return;
    const markLoaded = () => {
      imageWrap.classList.remove("no-image", "is-loading");
      imageWrap.classList.add("is-loaded");
    };
    const markMissing = () => {
      imageWrap.classList.add("no-image");
      imageWrap.classList.remove("is-loading");
    };

    imageWrap.classList.add("is-loading");
    img.addEventListener("load", markLoaded, { once: true });
    img.addEventListener("error", markMissing, { once: true });
    if (place.image && img.complete && img.naturalWidth) markLoaded();

    if (place.wikipediaTitle && window.fetch) {
      const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(place.wikipediaTitle)}`;
      fetch(summaryUrl)
        .then((response) => response.ok ? response.json() : null)
        .then((data) => {
          const source = data && ((data.originalimage && data.originalimage.source) || (data.thumbnail && data.thumbnail.source));
          if (source) img.src = source;
          else if (!place.image) markMissing();
        })
        .catch(() => {
          if (!place.image) markMissing();
        });
    } else if (!place.image) {
      markMissing();
    }
  }

  function renderStoryContent(country, requestedOfficeId) {
    const story = COUNTRY_STORIES && COUNTRY_STORIES[country.id];
    const offices = officesForCountry(country);
    const selectedId = requestedOfficeId || selectedOfficeByCountry[country.id] || (offices[0] && offices[0].id);
    const selectedOffice = offices.find((office) => office.id === selectedId) || offices[0] || null;
    if (selectedOffice) selectedOfficeByCountry[country.id] = selectedOffice.id;

const mapFrame = document.getElementById("story-map-frame");
    document.getElementById("story-intro").textContent = story ? story.intro : "Story coming soon for " + country.name + ".";
    // Populate story banner
    const bannerFlag = document.getElementById("story-country-flag");
    const bannerName = document.getElementById("story-country-name");
    if (bannerFlag) bannerFlag.textContent = country.flag;
    if (bannerName) bannerName.textContent = country.name;
    mapFrame.title = selectedOffice ? `${selectedOffice.city} site map` : `${country.name} country map`;
    mapFrame.src = selectedOffice
      ? mapEmbed(selectedOffice.lat, selectedOffice.lon)
      : mapEmbed(country.lat, country.lon, 25, 18);

    renderOfficeExplorer(country, story, offices, selectedOffice);

    const scenesWrap = document.getElementById("story-scenes");
    scenesWrap.innerHTML = "";
    if (story) {
      story.scenes.forEach((s) => {
        const scene = document.createElement("div");
        scene.className = "story-scene";
        scene.innerHTML = `
          <div class="story-scene-time">🕐 ${s.time}</div>
          <div class="story-scene-title"><span class="em">${s.icon}</span>${s.title}</div>
          <div class="story-scene-text">${s.text}</div>`;
        scenesWrap.appendChild(scene);
      });
    }
    document.getElementById("story-funfact").innerHTML = story
      ? `✨ <strong>Did you know?</strong> ${story.funFact}`
      : "";

    const evList = document.getElementById("story-evidence-list");
    evList.innerHTML = "";
    if (story) {
      story.evidence.forEach((ev) => {
        const a = document.createElement("a");
        a.className = "evidence-item";
        a.href = ev.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.innerHTML = `
          <div>
            <div class="ev-title">${ev.title}</div>
            <div class="ev-source">${ev.source}</div>
          </div>
          <span class="ev-link">↗</span>`;
        evList.appendChild(a);
      });
    }
  }

  function renderOfficeExplorer(country, story, offices, selectedOffice) {
    const officeExplorer = document.getElementById("office-explorer");
    const officeSummary = document.getElementById("office-summary");
    const officeList = document.getElementById("office-list");
    const officeDetail = document.getElementById("office-detail");
    if (!officeExplorer || !officeSummary || !officeList || !officeDetail) return;

    officeList.innerHTML = "";
    officeDetail.innerHTML = "";

    if (!offices.length || !selectedOffice) {
      officeExplorer.classList.add("is-empty");
      officeSummary.textContent = "Site details are being researched for this country.";
      return;
    }

    officeExplorer.classList.remove("is-empty");
    officeSummary.textContent = (typeof officeTotalLabel === "function")
      ? officeTotalLabel(country)
      : `${offices.length} featured sites/cities`;

    offices.forEach((office) => {
      const btn = document.createElement("button");
      btn.className = "office-pill" + (office.id === selectedOffice.id ? " active" : "");
      btn.type = "button";
      btn.innerHTML = `<span>${office.city}</span><small>${office.type}</small>`;
      btn.addEventListener("click", () => renderStoryContent(country, office.id));
      officeList.appendChild(btn);
    });

    const workTags = selectedOffice.works.map((work) => `<span class="work-tag">${work}</span>`).join("");
    const place = placeForOffice(selectedOffice);
    const news = [
      ...(selectedOffice.news || []),
      ...((story && story.evidence) ? story.evidence.slice(0, 2) : [])
    ];
    const uniqueNews = news.filter((item, idx, arr) => arr.findIndex((other) => other.url === item.url) === idx).slice(0, 4);
    const newsHtml = uniqueNews.map((item) => `
      <a class="office-news-link" href="${item.url}" target="_blank" rel="noopener">
        <span>
          <strong>${item.title}</strong>
          <small>${item.source}</small>
        </span>
        <em>↗</em>
      </a>
    `).join("");

// Determine a visual emoji based on office type for the banner
    const typeEmoji = officeTypeEmoji(selectedOffice.type);
    const idx = offices.findIndex((o) => o.id === selectedOffice.id) + 1;
    const rankLabel = idx ? `Site #${idx} of ${offices.length}` : "";

    officeDetail.innerHTML = `
      <div class="office-banner" style="--banner-hue:${officeHue(selectedOffice.type)}">
        <div class="office-banner-emoji">${typeEmoji}</div>
        <div class="office-banner-meta">
          <span class="office-banner-type">${selectedOffice.type}</span>
          <span class="office-banner-rank">${rankLabel}</span>
        </div>
      </div>
      <div class="office-detail-head">
        <h4>${selectedOffice.city}</h4>
        <p>${selectedOffice.building}</p>
      </div>
      <div class="office-detail-grid">
        <div class="office-metric">
          <span>Local Now</span>
          <strong id="office-local-time">${formatHour(localHourAt(country, currentHour)).time} ${formatHour(localHourAt(country, currentHour)).period}</strong>
        </div>
        <div class="office-metric">
          <span>Country Staff</span>
          <strong>${formatPop(country.amazon ? country.amazon.employees : 0)}</strong>
        </div>
      </div>
      <p class="office-copy">${selectedOffice.detail}</p>
      ${renderPlaceCard(place)}
      <div class="work-tags">${workTags}</div>
      <div class="office-news">
        <h5>📰 Clickable News & Sources</h5>
        <div class="office-news-list">${newsHtml}</div>
      </div>
    `;
    hydratePlaceCard(place);
  }

  // ---- Search ----
  const searchInput = document.getElementById("country-search");
  const searchResults = document.getElementById("search-results");
  function matchingOffice(country, q) {
    return officesForCountry(country).find((office) => {
      const haystack = [
        office.city,
        office.type,
        office.building,
        office.detail,
        ...(office.works || [])
      ].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) { searchResults.classList.remove("show"); return; }
      const matches = COUNTRIES.map((c) => {
        const office = matchingOffice(c, q);
        const countryMatch = [
          c.name,
          c.capital,
          c.continent,
          c.amazon ? c.amazon.region : "",
          c.amazon ? c.amazon.hq : "",
          c.amazon ? c.amazon.focus : "",
          ...(c.amazon && c.amazon.operations ? c.amazon.operations : []),
          ...(c.amazon && c.amazon.majorSites ? c.amazon.majorSites.map((site) => site.city) : [])
        ].join(" ").toLowerCase().includes(q);
        return countryMatch || office ? { country: c, office } : null;
      }).filter(Boolean).slice(0, 8);
      if (matches.length === 0) { searchResults.classList.remove("show"); return; }
      searchResults.innerHTML = "";
      matches.forEach((match) => {
        const c = match.country;
        const item = document.createElement("div");
        item.className = "search-result-item";
        item.innerHTML = `
          <span class="flag">${c.flag}</span>
          <span class="search-result-main">
            <strong>${c.name}</strong>
            ${match.office ? `<small>🏢 ${match.office.city} · ${match.office.type}</small>` : `<small>${c.capital} · ${c.amazon ? c.amazon.region : c.continent}</small>`}
            <small class="search-result-emp">👥 ${formatPop(c.amazon ? c.amazon.employees : 0)} Amazonians · ${c.amazon ? c.amazon.offices : "—"} sites</small>
          </span>
          <span class="search-result-arrow">➜</span>`;
item.addEventListener("click", () => {
          showCountry(c);
          const selectedOffice = match.office;
          if (selectedOffice) {
            selectedOfficeByCountry[c.id] = selectedOffice.id;
            openPanelTab("story");
            renderStoryContent(c, selectedOffice.id);
            moveGlobeToOffice(selectedOffice);
          }
          searchResults.classList.remove("show");
          searchInput.value = "";
        });
        searchResults.appendChild(item);
      });
      searchResults.classList.add("show");
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-box")) searchResults.classList.remove("show");
    });
  }

// ---- Live Dashboard ----
  function updateLiveDashboard(hour) {
    const dashAwake = document.getElementById("dash-awake");
    if (!dashAwake) return;
    let awake = 0, asleep = 0, noon = 0, breakfast = 0, bed = 0;
    COUNTRIES.forEach((c) => {
      const lh = localHourAt(c, hour);
      const employees = (typeof amazonDashboardEmployees === "function")
        ? amazonDashboardEmployees(c)
        : (c.amazon ? c.amazon.employees : 0);
      // Amazon work hours ~9am-6pm local
      if (lh >= 8 && lh < 19) awake += employees;
      else asleep += employees;
      if (lh >= 11 && lh < 13) noon += employees;
      if (lh >= 8 && lh < 10) breakfast += employees;
      if (lh >= 18 && lh < 20) bed += employees;
    });
    document.getElementById("dash-awake").textContent = formatPop(awake);
    document.getElementById("dash-asleep").textContent = formatPop(asleep);
    document.getElementById("dash-noon").textContent = formatPop(noon);
    document.getElementById("dash-breakfast").textContent = formatPop(breakfast);
    document.getElementById("dash-bed").textContent = formatPop(bed);
  }

  // ---- Insights ----
  const insightsBtn = document.getElementById("insights-btn");
  const insightsBack = document.getElementById("insights-back");
  let insightChart = null, barRaceChart = null;

function initInsightChart() {
    const ctx = document.getElementById("insight-chart");
    if (!ctx) return;
    insightChart = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [{
          label: "Workforce vs Internet",
          data: COUNTRIES.map((c) => ({ x: c.internet, y: (c.amazon ? c.amazon.employees : 0), c: c })),
          backgroundColor: COUNTRIES.map((c) => (c.continent === "Asia" ? "rgba(255,209,102,0.8)" : c.continent === "Europe" ? "rgba(77,240,255,0.8)" : "rgba(124,92,255,0.8)")),
          pointRadius: 8, pointHoverRadius: 12
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: "#eaf6ff" } },
          tooltip: { callbacks: { label: (ctx) => `${ctx.raw.c.name}: ${ctx.raw.y.toLocaleString()} employees · ${ctx.raw.x}% internet` } }
        },
        scales: {
          x: { title: { display: true, text: "Internet Access (%)", color: "#8fa3c0" }, ticks: { color: "#8fa3c0" }, grid: { color: "rgba(255,255,255,0.08)" } },
          y: { title: { display: true, text: "Amazon Employees", color: "#8fa3c0" }, ticks: { color: "#8fa3c0", callback: (v) => formatPop(v) }, grid: { color: "rgba(255,255,255,0.08)" } }
        }
      }
    });
  }

  function initBarRaceChart() {
    const ctx = document.getElementById("barrace-chart");
    if (!ctx) return;
    const top = [...COUNTRIES].sort((a, b) => (b.amazon ? b.amazon.employees : 0) - (a.amazon ? a.amazon.employees : 0)).slice(0, 10);
    barRaceChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: top.map((c) => c.name),
        datasets: [{
          label: "Amazon Employees",
          data: top.map((c) => (c.amazon ? c.amazon.employees : 0)),
          backgroundColor: top.map((c) => c.continent === "Asia" ? "rgba(255,209,102,0.8)" : c.continent === "Europe" ? "rgba(77,240,255,0.8)" : "rgba(124,92,255,0.8)"),
          borderColor: "rgba(255,255,255,0.2)", borderWidth: 1
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: "y",
        plugins: { legend: { labels: { color: "#eaf6ff" } } },
        scales: {
          x: { beginAtZero: true, ticks: { color: "#8fa3c0", callback: (v) => formatPop(v) }, grid: { color: "rgba(255,255,255,0.08)" } },
          y: { ticks: { color: "#eaf6ff" }, grid: { display: false } }
        }
      }
    });
  }

  if (insightsBtn) {
    insightsBtn.addEventListener("click", () => {
      showScreen("insights-screen");
      if (!insightChart) initInsightChart();
      if (!barRaceChart) initBarRaceChart();
    });
  }
  if (insightsBack) insightsBack.addEventListener("click", () => showScreen("globe-screen"));

  // ---- Story Mode (auto cinematic) ----
  const storyOverlay = document.getElementById("story-overlay");
  const storyText = document.getElementById("story-text");
  const storySkip = document.getElementById("story-skip");
  let storyTimer = null;

  const indiaWorkforce = COUNTRIES.find((country) => country.id === "in");
  const totalWorkforceLabel = formatPop((typeof AMAZON_GLOBAL_WORKFORCE !== "undefined") ? AMAZON_GLOBAL_WORKFORCE.total2025 : 1576000);
  const STORY = [
    { text: `As the sun rises over <em>APAC</em>, Amazon's ${formatPop(indiaWorkforce.amazon.employees)} Indian employees begin their day…`, hour: 6 },
    { text: "By <em>9 AM</em>, EMEA Amazon sites are at work while Seattle is still waking up.", hour: 9 },
    { text: "At <em>noon</em>, the global workforce is at its busiest — packages, code, and cloud in motion worldwide.", hour: 12 },
    { text: "By <em>3 PM</em>, India's tech hubs are deep in engineering while the Americas move toward lunch.", hour: 15 },
    { text: "As <em>evening</em> falls on Asia, EMEA sites wind down and the Americas enter peak hours.", hour: 18 },
    { text: "At <em>midnight</em>, fulfillment centers keep sorting — because Amazon never sleeps.", hour: 0 },
    { text: `One workforce. <em>${totalWorkforceLabel} stories.</em> Every hour, a different timezone at work.`, hour: 12 }
  ];

  function startStoryMode() {
    let step = 0;
    if (storyOverlay) storyOverlay.classList.add("show");
    function nextStep() {
      if (step >= STORY.length) {
        if (storyOverlay) storyOverlay.classList.remove("show");
        startAutoTime();
        return;
      }
      const s = STORY[step];
      if (storyText) storyText.innerHTML = s.text;
      slider.value = s.hour;
      updateTime(s.hour);
      step++;
      storyTimer = setTimeout(nextStep, 3500);
    }
    nextStep();
  }

  if (storySkip) {
    storySkip.addEventListener("click", () => {
      storyOverlay.classList.remove("show");
      if (storyTimer) clearTimeout(storyTimer);
      if (globe) {
        globe.storyMode = false;
        globe.resumeAutoRotate();
      }
    });
  }

  // ---- Global Story (cinematic tour of all countries) ----
  function startGlobalStory() {
    if (typeof GLOBAL_STORY === "undefined") { startStoryMode(); return; }
    if (storyTimer) { clearTimeout(storyTimer); storyTimer = null; }
    let step = 0;
    const scenes = GLOBAL_STORY.scenes;
    if (storyOverlay) storyOverlay.classList.add("show");
    if (globe) globe.storyMode = true;

    const focusCoords = [
      { lat: 21.0, lon: 78.0 },    // APAC (India)
      { lat: 51.5, lon: -0.1 },    // EMEA (London)
      { lat: 10.0, lon: 40.0 },    // Center (looking at East Africa/Mid East/Europe)
      { lat: 46.9, lon: 2.2 },     // Europe (France/Spain/Poland)
      { lat: 39.8, lon: -98.5 },   // Americas (US)
      { lat: 47.6, lon: -122.3 }   // Seattle
    ];

    function nextStep() {
      if (step >= scenes.length) {
        if (storyOverlay) storyOverlay.classList.remove("show");
        if (globe) {
          globe.storyMode = false;
          globe.resumeAutoRotate();
        }
        startAutoTime();
        return;
      }
      const s = scenes[step];
      if (storyText) storyText.innerHTML = s.icon + " " + s.title + " — " + s.text;
      slider.value = s.time.split(":")[0];
      updateTime(parseFloat(s.time.split(":")[0]));

      const coords = focusCoords[step];
      if (coords && globe && typeof globe.setTargetRotation === "function") {
        globe.setTargetRotation(coords.lat, coords.lon);
      }

      step++;
      storyTimer = setTimeout(nextStep, 3500);
    }
    nextStep();
  }

  // ---- Country Story Player (cinematic narration of a country's scenes) ----
  function startCountryStory(country) {
    const story = COUNTRY_STORIES && COUNTRY_STORIES[country.id];
    const scenes = story ? story.scenes : [];
    if (!scenes.length) return;
    // Stop any running global story
    if (storyTimer) { clearTimeout(storyTimer); storyTimer = null; }
    let step = 0;
    if (storyOverlay) storyOverlay.classList.add("show");
    if (globe) {
      globe.storyMode = true;
      globe.setTargetRotation(country.lat, country.lon);
    }
    function nextStep() {
      if (step >= scenes.length) {
        if (storyOverlay) storyOverlay.classList.remove("show");
        if (globe) {
          globe.storyMode = false;
          globe.resumeAutoRotate();
        }
        return;
      }
      const s = scenes[step];
      if (storyText) {
        storyText.innerHTML = `<span style="font-size:1.6em">${s.icon}</span><br>`
          + `<span style="color:var(--accent-3)">${country.flag} ${country.name} · ${s.time}</span><br>`
          + `${s.title} — ${s.text}`;
      }
      // Advance the time slider to the scene's hour
      const hrs = parseFloat(s.time.split(":")[0]);
      if (slider) slider.value = hrs;
      updateTime(hrs);

      // Immersive orbit zoom: rotate to focus on actual office locations one by one
      const offices = officesForCountry(country);
      const sceneOffice = offices[step % offices.length];
      if (sceneOffice && globe && typeof globe.setTargetRotation === "function") {
        globe.setTargetRotation(sceneOffice.lat, sceneOffice.lon);
      }

      // Highlight the matching scene card in the panel
      const cards = document.querySelectorAll("#story-scenes .story-scene");
      cards.forEach((card, i) => {
        card.style.opacity = (i === step) ? "1" : "0.45";
        card.style.borderLeftColor = (i === step) ? "var(--accent-3)" : "var(--accent)";
      });
      step++;
      storyTimer = setTimeout(nextStep, 3200);
    }
    nextStep();
  }

  // Wire the country story Play button
  const storyPlayBtn = document.getElementById("story-play-btn");
  if (storyPlayBtn) {
    storyPlayBtn.addEventListener("click", () => {
      if (currentCountry) startCountryStory(currentCountry);
    });
  }

  // ---- Explore Screen (Scroll to Explore) ----
  const exploreBtn = document.getElementById("scroll-explore");
  const exploreBack = document.getElementById("explore-back");
  const exploreGrid = document.getElementById("explore-grid");

function buildExploreGrid() {
    if (!exploreGrid || exploreGrid.children.length > 0) return;
    // India first, then the rest in dataset order
    const ordered = [
      ...COUNTRIES.filter((c) => c.id === "in"),
      ...COUNTRIES.filter((c) => c.id !== "in")
    ];
    ordered.forEach((c) => {
      const offices = officesForCountry(c);
      const officePreview = offices.slice(0, 3).map((office) => `
        <button class="explore-office-chip" type="button" data-office-id="${office.id}">
          <span>${office.city}</span>
          <small>${office.type}</small>
        </button>
      `).join("");
      const remaining = offices.length > 3 ? `<span class="explore-office-more">+${offices.length - 3} more</span>` : "";
      const card = document.createElement("div");
      card.className = "explore-card";
      card.innerHTML = `
        <iframe class="explore-map" loading="lazy"
          src="https://www.openstreetmap.org/export/embed.html?bbox=${c.lon - 20}%2C${c.lat - 15}%2C${c.lon + 20}%2C${c.lat + 15}&amp;layer=mapnik&amp;marker=${c.lat}%2C${c.lon}"></iframe>
        <div class="explore-card-body">
          <div class="explore-card-head">
            <div class="explore-card-flag">${c.flag}</div>
            <div>
              <h3>${c.name}</h3>
              <p>${c.capital} · ${c.amazon ? c.amazon.region : c.continent}</p>
            </div>
          </div>
          <div class="explore-card-stats">
            <div class="stat"><span class="stat-label">Amazon Staff</span><span class="stat-value">${formatPop(c.amazon ? c.amazon.employees : 0)}</span></div>
            <div class="stat"><span class="stat-label">Sites</span><span class="stat-value">${c.amazon ? c.amazon.offices : "—"}</span></div>
            <div class="stat"><span class="stat-label">Internet</span><span class="stat-value">${c.internet.toFixed(1)}%</span></div>
          </div>
          <div class="explore-office-list">${officePreview}${remaining}</div>
          <div class="explore-card-actions">
            <button class="btn btn-sm" data-explore-story="${c.id}">▶ Story</button>
            <button class="btn btn-sm" data-explore-view="${c.id}">On Globe</button>
          </div>
        </div>
      `;
card.querySelector('[data-explore-story]').addEventListener("click", (e) => {
        e.stopPropagation();
        showScreen("globe-screen");
        showCountry(c);
        openPanelTab("story");
        renderStoryContent(c);
        // Scroll the panel to the top so the story scenes are visible
        countryPanel.scrollTop = 0;
        // Auto-play this country's cinematic story
        if (typeof startCountryStory === "function") startCountryStory(c);
      });
      card.querySelectorAll(".explore-office-chip").forEach((officeBtn) => {
        officeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const office = offices.find((item) => item.id === officeBtn.dataset.officeId);
          if (!office) return;
          selectedOfficeByCountry[c.id] = office.id;
          showScreen("globe-screen");
          showCountry(c);
          openPanelTab("story");
          renderStoryContent(c, office.id);
          moveGlobeToOffice(office);
        });
      });
      card.querySelector('[data-explore-view]').addEventListener("click", (e) => {
        e.stopPropagation();
        showScreen("globe-screen");
        if (globe) {
          globe.setTargetRotation(c.lat, c.lon);
          showCountry(c);
        }
      });
      exploreGrid.appendChild(card);
    });
  }

  if (exploreBtn) exploreBtn.addEventListener("click", () => {
    showScreen("explore-screen");
    buildExploreGrid();
  });
  if (exploreBack) exploreBack.addEventListener("click", () => showScreen("globe-screen"));

  // ---- Conclusion ----
  const restartBtn = document.getElementById("restart-btn");
  if (restartBtn) restartBtn.addEventListener("click", () => showScreen("globe-screen"));

  const observer = new MutationObserver(() => {
    if (document.getElementById("conclusion-screen").classList.contains("active")) {
      animateCounters();
    }
  });
  observer.observe(document.getElementById("conclusion-screen"), { attributes: true, attributeFilter: ["class"] });

  function animateCounters() {
    document.querySelectorAll(".cstat-num").forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const isLarge = target >= 1e6;
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 2, ease: "power2.out",
        onUpdate: () => {
          if (isLarge) el.textContent = formatPop(obj.v);
          else el.textContent = Math.round(obj.v);
        }
      });
    });
  }

  // ---- Initial state ----
  updateTime(12);
  if (slider) slider.value = 12;
});
