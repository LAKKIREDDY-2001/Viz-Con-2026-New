/* =========================================================
   24 HOURS ON EARTH — 3D Globe (Three.js)
   Renders a rotating Earth with country hotspots, day/night
   terminator, and cinematic lighting.
   ========================================================= */

// Global reference to the globe group so app.js can interact
let globe = {};
let GScene, GCamera, GRenderer, GGroup, GStars, GControls, GTerminator;
let GSelected = null;
let GTargetRot = { x: 0, y: 0 };
let GAnimFrame = null;

// Dependencies
const THREE = window.THREE;

let globeInitialized = false;
function initGlobe() {
  if (globeInitialized) return;
  globeInitialized = true;
  const canvas = document.getElementById("globe-canvas");
  const w = window.innerWidth;
  const h = window.innerHeight;

  GScene = new THREE.Scene();
  GCamera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
  GCamera.position.set(0, 0, 4.2);

  GRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  GRenderer.setSize(w, h);
  GRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Ambient + directional light
  const ambient = new THREE.AmbientLight(0x8899ff, 0.5);
  GScene.add(ambient);
  const sunLight = new THREE.DirectionalLight(0xfff4d0, 1.4);
  sunLight.position.set(5, 2, 4);
  GScene.add(sunLight);
  const rimLight = new THREE.DirectionalLight(0x4df0ff, 0.6);
  rimLight.position.set(-4, -1, -3);
  GScene.add(rimLight);
  globe.ambient = ambient;
  globe.sunLight = sunLight;

  // Starfield background
  GStars = createStars();
  GScene.add(GStars);

  // Globe group
  GGroup = new THREE.Group();
  GScene.add(GGroup);

// Earth sphere
  const earthRadius = 1.5;
  const geo = new THREE.SphereGeometry(earthRadius, 64, 64);

  // Realistic Earth texture (blue marble world map)
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load(
    "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
    undefined,
    undefined,
    () => {
      // Fallback if texture fails to load: keep a colored sphere
      earth.material.color.setHex(0x1a2a5a);
    }
  );
  const earthMap = new THREE.MeshPhongMaterial({
    map: earthTexture,
    specular: 0x333333,
    shininess: 15,
    bumpMap: earthTexture,
    bumpScale: 0.05
  });
  const earth = new THREE.Mesh(geo, earthMap);
  GGroup.add(earth);

  // Atmosphere glow
  const glowGeo = new THREE.SphereGeometry(earthRadius * 1.03, 64, 64);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x4df0ff,
    transparent: true,
    opacity: 0.08,
    side: THREE.BackSide
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  GGroup.add(glow);

// Grid lines (lat/lon)
  const grid = createGrid(earthRadius);
  GGroup.add(grid);

  // Solar terminator (day/night boundary)
  GTerminator = createTerminator(earthRadius);
  GGroup.add(GTerminator);

// Country markers
  const markers = createCountryMarkers(earthRadius);
  GGroup.add(markers);

  // Office location markers (all OFFICE_LOCATIONS with site names)
  const officeMarkers = createOfficeMarkers(earthRadius);
  GGroup.add(officeMarkers);

  // Arc connections
  const arcs = createArcs(earthRadius);
  GGroup.add(arcs);

  // Store refs
  globe.earth = earth;
  globe.radius = earthRadius;
  globe.group = GGroup;
  globe.markers = markers;
  globe.officeMarkers = officeMarkers;
  globe.arcs = arcs;
  globe.storyMode = false;

// Orbit damping via manual rotation
let targetRotY = 0;
  let targetRotX = 0;
  let rotY = 0;
  let rotX = 0;
  let autoRotate = true;

  let rotationTween = null;

  // Store for external control — bring the country/office at (lat, lon) to face the camera (+z)
  globe.setTargetRotation = (lat, lon) => {
    let tRotY = THREE.MathUtils.degToRad(-90 - lon);
    let tRotX = THREE.MathUtils.degToRad(lat);
    
    // Shortest path interpolation for Y (longitude)
    const twoPi = Math.PI * 2;
    let diffY = (tRotY - rotY) % twoPi;
    if (diffY < -Math.PI) diffY += twoPi;
    if (diffY > Math.PI) diffY -= twoPi;
    let finalTargetY = rotY + diffY;

    // Shortest path interpolation for X (latitude)
    let diffX = (tRotX - rotX) % twoPi;
    if (diffX < -Math.PI) diffX += twoPi;
    if (diffX > Math.PI) diffX -= twoPi;
    let finalTargetX = rotX + diffX;
    finalTargetX = Math.max(-1.2, Math.min(1.2, finalTargetX));

    autoRotate = false;

    if (rotationTween) {
      rotationTween.kill();
      rotationTween = null;
    }

    if (window.gsap) {
      const tempRotObj = { y: rotY, x: rotX };
      rotationTween = window.gsap.to(tempRotObj, {
        y: finalTargetY,
        x: finalTargetX,
        duration: 1.8,
        ease: "power3.out",
        onUpdate: () => {
          rotY = tempRotObj.y;
          rotX = tempRotObj.x;
          targetRotY = rotY;
          targetRotX = rotX;
        }
      });
    } else {
      targetRotY = finalTargetY;
      targetRotX = finalTargetX;
    }
  };

  globe.resumeAutoRotate = () => {
    autoRotate = true;
  };

// --- Drag to rotate controls (with inertia + click-vs-drag suppression) ---
  let isDragging = false;
  let prevX = 0, prevY = 0;
  let dragVelY = 0;
  let dragVelX = 0;
let dragSensitivity = 0.0015;
  let inertiaEnabled = true;
  let lastMoveTime = 0;
  let dragDistance = 0;          // total px moved while down
  let didDrag = false;           // becomes true only if user actually dragged
  let suppressClick = false;     // true when a drag happened, click should be ignored

  function isInertiaGesture(e) {
    return (e.pointerType === "mouse" || e.pointerType === "touch");
  }

  canvas.addEventListener("pointerdown", (e) => {
    isDragging = true;
    didDrag = false;
    suppressClick = false;
    dragDistance = 0;
    prevX = e.clientX;
    prevY = e.clientY;
    dragVelY = 0;
    dragVelX = 0;
    autoRotate = false;

    if (rotationTween) {
      rotationTween.kill();
      rotationTween = null;
    }

    // Free the globe from any previously-set target so a manual drag
    // doesn't snap back to the searched country afterwards.
    targetRotY = rotY;
    targetRotX = rotX;
    canvas.style.cursor = "grabbing";
  });
  window.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - prevX;
    const dy = e.clientY - prevY;
    dragDistance += Math.abs(dx) + Math.abs(dy);
    // Only treat as drag when beyond small threshold (>= 6px) — avoids
    // interpreting a simple click as a drag.
    if (dragDistance > 6) didDrag = true;
    if (didDrag) {
      suppressClick = true;
    }
    rotY += dx * dragSensitivity;
    rotX += dy * dragSensitivity;
    rotX = Math.max(-1.2, Math.min(1.2, rotX));
    dragVelY = dx * dragSensitivity;
    dragVelX = dy * dragSensitivity;
    lastMoveTime = Date.now();
    prevX = e.clientX;
    prevY = e.clientY;
  });
  window.addEventListener("pointerup", (e) => {
    isDragging = false;
    canvas.style.cursor = "grab";
    // Apply inertia — keep spinning briefly after release
    if (didDrag && inertiaEnabled && Math.abs(dragVelY) > 0.0004) {
      setTimeout(() => { if (globe) globe.resumeAutoRotate(); }, 600);
    } else {
      // Resume auto-rotate after a pause
      setTimeout(() => { if (globe) globe.resumeAutoRotate(); }, 3000);
    }
  });
  // Suppress the click event if a drag occurred — so clicks on the globe
  // (which should select a country/office marker) are not blocked by drags.
  canvas.addEventListener("click", (e) => {
    if (suppressClick) {
      e.stopImmediatePropagation();
      e.preventDefault();
      suppressClick = false;
    }
  }, true);
  canvas.style.cursor = "grab";

  // Expose inertia toggler
  globe.setInertia = (on) => { inertiaEnabled = on; };

  // Animation loop
  function animate() {
    GAnimFrame = requestAnimationFrame(animate);

    if (autoRotate) {
      rotY += 0.0005;
    } else if (globe.storyMode && !isDragging) {
      // Slow cinematic story rotation
      rotY += 0.0015;
      rotX += (targetRotX - rotX) * 0.04;
      rotX = Math.max(-1.2, Math.min(1.2, rotX));
      targetRotY = rotY;
    } else if (!isDragging) {
      // Apply inertia (momentum) after drag release
      if (inertiaEnabled && (Math.abs(dragVelY) > 0.0002 || Math.abs(dragVelX) > 0.0002)) {
        rotY += dragVelY;
        rotX += dragVelX;
        rotX = Math.max(-1.2, Math.min(1.2, rotX));
        // Friction
        dragVelY *= 0.95;
        dragVelX *= 0.95;
      } else {
        // smooth toward target (if set) — both Y (longitude) and X (latitude)
        rotY += (targetRotY - rotY) * 0.04;
        rotX += (targetRotX - rotX) * 0.04;
        rotX = Math.max(-1.2, Math.min(1.2, rotX));
      }
    }

    GGroup.rotation.y = rotY;
    // Smooth rotation on X
    GGroup.rotation.x += (rotX - GGroup.rotation.x) * 0.1;
    // Add a slight default tilt
    GGroup.rotation.z = 0.1;

    // Slight float
    GGroup.position.y = Math.sin(Date.now() * 0.001) * 0.05;

    // Rotate stars slowly
    GStars.rotation.y += 0.0002;

// Pulse selected markers
markers.children.forEach((m) => {
      if (m.userData.selected && m.userData.isFlag) {
        const s = 1 + Math.sin(Date.now() * 0.006) * 0.25;
        m.scale.set(m.userData.baseScale * s, m.userData.baseScale * s, 1);
      }
    });

    // Pulse office markers slightly (subtle breathing even when not selected)
    if (officeMarkers) {
      officeMarkers.children.forEach((m) => {
        if (m.userData.selected) {
          const s = 1 + Math.sin(Date.now() * 0.008) * 0.3;
          m.scale.set(s, s, s);
        } else if (m.isMesh && m.geometry.type === "SphereGeometry") {
          const s = 1 + Math.sin(Date.now() * 0.002 + m.userData.basePos.x) * 0.15;
          m.scale.set(s, s, s);
        }
      });
    }

    // Animate arcs
    arcs.children.forEach((arc) => {
      if (arc.userData.animate) {
        arc.material.opacity = 0.15 + Math.abs(Math.sin(Date.now() * 0.002 + arc.userData.phase)) * 0.3;
      }
    });

    GRenderer.render(GScene, GCamera);
  }
  animate();

  // Resize
  window.addEventListener("resize", () => {
    const nw = window.innerWidth;
    const nh = window.innerHeight;
    GCamera.aspect = nw / nh;
    GCamera.updateProjectionMatrix();
    GRenderer.setSize(nw, nh);
  });
}

/* Create starfield using points */
function createStars() {
  const count = 1200;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 30 + Math.random() * 30;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.06,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  });
  return new THREE.Points(geo, mat);
}

/* Create lat/lon grid lines */
function createGrid(radius) {
  const group = new THREE.Group();
  const mat = new THREE.LineBasicMaterial({ color: 0x4df0ff, transparent: true, opacity: 0.12 });

  // Latitude lines
  for (let lat = -60; lat <= 60; lat += 30) {
    const phi = THREE.MathUtils.degToRad(90 - lat);
    const points = [];
    for (let lon = 0; lon <= 360; lon += 5) {
      const theta = THREE.MathUtils.degToRad(lon);
      points.push(new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      ));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    group.add(new THREE.Line(geo, mat));
  }

  // Longitude lines
  for (let lon = 0; lon < 360; lon += 30) {
    const theta = THREE.MathUtils.degToRad(lon);
    const points = [];
    for (let lat = -90; lat <= 90; lat += 5) {
      const phi = THREE.MathUtils.degToRad(90 - lat);
      points.push(new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      ));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    group.add(new THREE.Line(geo, mat));
  }
  return group;
}

/* Solar terminator — glowing line showing day/night boundary */
function createTerminator(radius) {
  const group = new THREE.Group();
  const lineMat = new THREE.LineBasicMaterial({
    color: 0xffd166,
    transparent: true,
    opacity: 0.6
  });
  const points = [];
  for (let i = 0; i <= 360; i += 2) {
    const lat = Math.sin(i * Math.PI / 180) * 90;
    const lon = i;
    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(-lon);
    points.push(new THREE.Vector3(
      radius * 1.002 * Math.sin(phi) * Math.cos(theta),
      radius * 1.002 * Math.cos(phi),
      radius * 1.002 * Math.sin(phi) * Math.sin(theta)
    ));
  }
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMat);
  group.add(line);
  return group;
}

/* Create arc connections between countries */
function createArcs(radius) {
  const group = new THREE.Group();
const arcPairs = [
    ["us", "gb"], ["us", "in"], ["gb", "in"], ["us", "jp"], ["in", "jp"],
    ["cn", "us"], ["de", "br"], ["fr", "ca"], ["au", "gb"], ["sg", "us"],
    ["br", "co"], ["ae", "in"], ["se", "us"], ["nl", "au"], ["sa", "in"]
  ];
  arcPairs.forEach((pair, idx) => {
    const a = COUNTRIES.find((c) => c.id === pair[0]);
    const b = COUNTRIES.find((c) => c.id === pair[1]);
    if (!a || !b) return;
    const start = latLonToVec3(a.lat, a.lon, radius * 1.02);
    const end = latLonToVec3(b.lat, b.lon, radius * 1.02);
    const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(radius * 1.4);
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const points = curve.getPoints(40);
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: 0x4df0ff,
      transparent: true,
      opacity: 0.15
    });
    const line = new THREE.Line(geo, mat);
    line.userData = { animate: true, phase: idx * 0.5, countries: pair };
    group.add(line);
  });
  return group;
}

/* Create a small Amazon "smile" logo texture drawn on a canvas */
function createAmazonLogoTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const cx = size / 2;

  // Circular orange badge
  ctx.beginPath();
  ctx.arc(cx, cx, size * 0.46, 0, Math.PI * 2);
  ctx.fillStyle = "#FF9900";
  ctx.fill();
  // subtle inner shadow ring
  ctx.beginPath();
  ctx.arc(cx, cx, size * 0.4, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(19,26,34,0.25)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // White lowercase "a"
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold " + Math.round(size * 0.42) + "px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("a", cx, size * 0.4);

  // Orange smile swoosh (the Amazon arrow smile)
  ctx.beginPath();
  ctx.arc(cx, size * 0.68, size * 0.2, Math.PI * 0.15, Math.PI * 0.98);
  ctx.strokeStyle = "#131A22";
  ctx.lineWidth = size * 0.055;
  ctx.lineCap = "round";
  ctx.stroke();

  // Arrow tip at the right end of the smile
  const tipAngle = Math.PI * 0.98;
  const tipX = cx + Math.cos(tipAngle) * size * 0.2;
  const tipY = size * 0.68 + Math.sin(tipAngle) * size * 0.2;
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(tipX - size * 0.07, tipY - size * 0.05);
  ctx.lineTo(tipX - size * 0.02, tipY + size * 0.06);
  ctx.closePath();
  ctx.fillStyle = "#131A22";
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/* Create office location markers (all OFFICE_LOCATIONS with site names) */
function createOfficeMarkers(radius) {
  const group = new THREE.Group();
  const markerRadius = radius * 1.045;
  if (typeof OFFICE_LOCATIONS === "undefined") return group;

  const logoTexture = createAmazonLogoTexture();

  Object.keys(OFFICE_LOCATIONS).forEach((countryId) => {
    const country = COUNTRIES.find((c) => c.id === countryId);
    OFFICE_LOCATIONS[countryId].forEach((officeData) => {
      const office = Object.assign({ countryId }, officeData);
      const lat = office.lat;
      const lon = office.lon;
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(-lon);
      const pos = new THREE.Vector3(
        markerRadius * Math.sin(phi) * Math.cos(theta),
        markerRadius * Math.cos(phi),
        markerRadius * Math.sin(phi) * Math.sin(theta)
      );

      // Amazon-logo badge (sphere with textured smile logo)
      const sphereGeo = new THREE.SphereGeometry(0.023, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({
        map: logoTexture,
        transparent: true
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.copy(pos);
      sphere.userData = { office, country, isOffice: true, basePos: pos.clone(), selected: false };
      group.add(sphere);

      // Orange ring
      const ringGeo = new THREE.RingGeometry(0.034, 0.054, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xff9900,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(0, 0, 0);
      ring.userData = { office, country, isOffice: true, basePos: pos.clone(), selected: false };
      group.add(ring);
    });
  });
  return group;
}

/* Helper: convert lat/lon to 3D vector */
function latLonToVec3(lat, lon, radius) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(-lon);
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/* Create a flag emoji texture drawn on a canvas (no background circle) */
function createFlagTexture(emoji) {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.font = size * 0.85 + "px 'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, size / 2, size / 2 + size * 0.02);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/* Create country markers — each shown as a flag raised on a small pole
   rising straight out of the globe surface (flag-pole look). */
function createCountryMarkers(radius) {
  const group = new THREE.Group();
  const surfaceRadius = radius * 1.005; // pole base sits just above the globe surface
  const poleHeight = 0.13;              // how far the pole rises
  const poleBase = surfaceRadius;
  const poleTop = surfaceRadius + poleHeight;

  COUNTRIES.forEach((c) => {
    const lat = c.lat;
    const lon = c.lon;
    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(-lon);
    const dir = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.cos(phi),
      Math.sin(phi) * Math.sin(theta)
    );

    // Base point on the surface
    const basePos = dir.clone().multiplyScalar(poleBase);
    // Top point (where the flag sits)
    const topPos = dir.clone().multiplyScalar(poleTop);

    // --- Pole (thin vertical line from base to top) ---
    const poleMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
    const poleGeo = new THREE.BufferGeometry().setFromPoints([basePos, topPos]);
    const pole = new THREE.Line(poleGeo, poleMat);
    pole.userData = { country: c, basePos: basePos.clone(), selected: false, isPole: true };
    group.add(pole);

    // --- Gold tip (small sphere at the top of the pole) ---
    const tipGeo = new THREE.SphereGeometry(0.008, 10, 10);
    const tipMat = new THREE.MeshBasicMaterial({ color: 0xffd166 });
    const tip = new THREE.Mesh(tipGeo, tipMat);
    tip.position.copy(topPos);
    tip.userData = { country: c, basePos: basePos.clone(), selected: false, isTip: true };
    group.add(tip);

    // --- Flag emoji sprite at the top of the pole ---
    const flagTexture = createFlagTexture(c.flag);
    const spriteMat = new THREE.SpriteMaterial({ map: flagTexture, transparent: true, depthTest: false });
const sprite = new THREE.Sprite(spriteMat);
    const scale = 0.07;
    sprite.scale.set(scale, scale, 1);
    sprite.position.copy(topPos.clone().add(dir.clone().multiplyScalar(scale * 0.5)));
    sprite.userData = { country: c, basePos: basePos.clone(), selected: false, isFlag: true, mat: spriteMat, baseScale: scale };
    group.add(sprite);
  });
  return group;
}

/* Raycast to find clicked marker — checks office markers first (they are smaller/more precise), then country markers */
function pickCountry(clientX, clientY) {
  const rect = document.getElementById("globe-canvas").getBoundingClientRect();
  const mouse = new THREE.Vector2(
    ((clientX - rect.left) / rect.width) * 2 - 1,
    -((clientY - rect.top) / rect.height) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, GCamera);

  // Check office markers first
  if (globe.officeMarkers) {
    const officeMeshes = globe.officeMarkers.children.filter((m) => m.isMesh && m.geometry.type === "SphereGeometry");
    const officeIntersects = raycaster.intersectObjects(officeMeshes, false);
    if (officeIntersects.length > 0) {
      return officeIntersects[0].object.userData.country;
    }
  }

// Check country markers (flag sprites + gold pole tips)
  const countryTargets = globe.markers.children.filter((m) => m.isSprite || (m.userData && m.userData.isTip));
  const countryIntersects = raycaster.intersectObjects(countryTargets, false);
  if (countryIntersects.length > 0) {
    return countryIntersects[0].object.userData.country;
  }
  return null;
}

/* Raycast to find clicked OFFICE marker specifically */
function pickOfficeMarker(clientX, clientY) {
  const rect = document.getElementById("globe-canvas").getBoundingClientRect();
  const mouse = new THREE.Vector2(
    ((clientX - rect.left) / rect.width) * 2 - 1,
    -((clientY - rect.top) / rect.height) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, GCamera);
  if (!globe.officeMarkers) return null;
  const meshes = globe.officeMarkers.children.filter((m) => m.isMesh && m.geometry.type === "SphereGeometry");
  const intersects = raycaster.intersectObjects(meshes, false);
  if (intersects.length > 0) {
    const ud = intersects[0].object.userData;
    return ud.office || null;
  }
  return null;
}

/* Highlight / unhighlight a marker */
function highlightCountry(countryId, on) {
  if (on && countryId) {
    // 1. Country markers: only show selected country
    globe.markers.children.forEach((m) => {
      if (!m.userData.country) return;
      if (m.userData.country.id === countryId) {
        m.visible = true;
        m.userData.selected = true;
        if (m.material) m.material.color.setHex(0xffd166);
      } else {
        m.visible = false;
        m.userData.selected = false;
      }
    });

    // 2. Office markers: only show offices of selected country
    if (globe.officeMarkers) {
      globe.officeMarkers.children.forEach((m) => {
        if (!m.userData.country) return;
        if (m.userData.country.id === countryId) {
          m.visible = true;
        } else {
          m.visible = false;
        }
      });
    }

    // 3. Arcs: only show arcs connected to selected country
    if (globe.arcs) {
      globe.arcs.children.forEach((m) => {
        if (m.userData.countries && m.userData.countries.includes(countryId)) {
          m.visible = true;
          if (m.material) m.material.opacity = 0.45;
        } else {
          m.visible = false;
        }
      });
    }
  } else {
    // Restore everything
    globe.markers.children.forEach((m) => {
      m.visible = true;
      m.userData.selected = false;
      if (m.material) m.material.color.setHex(0xffffff);
    });

    if (globe.officeMarkers) {
      globe.officeMarkers.children.forEach((m) => {
        m.visible = true;
        m.userData.selected = false;
        if (m.material) {
          if (m.geometry.type === "RingGeometry") {
            m.material.color.setHex(0xff9900);
            m.material.opacity = 0.5;
          } else {
            m.material.color.setHex(0xffffff);
          }
        }
      });
    }

    if (globe.arcs) {
      globe.arcs.children.forEach((m) => {
        m.visible = true;
        if (m.material) m.material.opacity = 0.15;
      });
    }
  }
}

/* Highlight / unhighlight an office marker */
function highlightOffice(officeId, on) {
  if (!globe.officeMarkers) return;
  globe.officeMarkers.children.forEach((m) => {
    if (m.userData.office && m.userData.office.id === officeId) {
      m.userData.selected = on;
      if (on) {
        m.material.color.setHex(0x4df0ff);
        if (m.geometry.type === "RingGeometry") m.material.opacity = 0.95;
      } else {
        m.material.color.setHex(0xffd166);
        if (m.geometry.type === "RingGeometry") m.material.opacity = 0.4;
      }
    } else if (m.userData.office) {
      m.userData.selected = false;
      if (m.material) {
        if (m.geometry.type === "RingGeometry") {
          m.material.color.setHex(0xff9900);
          m.material.opacity = 0.5;
        } else {
          m.material.color.setHex(0xffffff);
        }
      }
    }
  });
}

/* Set the globe's daytime coloring based on time slider */
function updateGlobeTime(hour) {
  // Adjust lighting based on time of day
  const h = hour % 24;
  // Day 12:00 brightest, night 0:00 darkest
  const sunAngle = ((h - 12) / 24) * Math.PI * 2;
  const dayFactor = (Math.cos(sunAngle) + 1) / 2; // 0 (night) to 1 (noon)
  if (globe.sunLight) {
    globe.sunLight.intensity = 0.4 + dayFactor * 1.4;
  }
  if (globe.ambient) {
    globe.ambient.intensity = 0.3 + dayFactor * 0.5;
  }
  // Rotate terminator with time
  if (GTerminator) {
    GTerminator.rotation.y = (h / 24) * Math.PI * 2;
  }
}

/* Initialize when DOM ready (also called from app.js after loader) */
document.addEventListener("DOMContentLoaded", () => {
  if (window.THREE) {
    initGlobe();
  }
});
