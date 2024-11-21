let airports = [];
let nearestAirportsCache = new Map();
let preloadPromise = null;

const loadAirports = async () => {
  if (airports.length > 0) {
    return airports;
  }

  if (preloadPromise) {
    return preloadPromise;
  }

  preloadPromise = fetch("/data/airports-min.json")
    .then((response) => {
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      airports = data;
      return airports;
    })
    .catch((error) => {
      console.error("Error loading airports:", error);
      return [];
    });

  return preloadPromise;
};

export const preloadAirports = loadAirports;

const isWithinBoundingBox = (lat1, lon1, lat2, lon2, maxDistanceKm = 150) => {
  const latDiff = Math.abs(lat1 - lat2) * 111;
  const lonDiff =
    Math.abs(lon1 - lon2) * Math.cos((lat1 * Math.PI) / 180) * 111;

  return latDiff < maxDistanceKm && lonDiff < maxDistanceKm;
};

export const getNearestAirports = async (userLocation) => {
  if (!userLocation) return [];

  const cacheKey = `${userLocation.lat},${userLocation.long}`;
  if (nearestAirportsCache.has(cacheKey)) {
    return nearestAirportsCache.get(cacheKey);
  }

  const airportList = await loadAirports();

  const roughlyNearbyAirports = airportList.filter((airport) =>
    isWithinBoundingBox(
      userLocation.lat,
      userLocation.long,
      airport.lat,
      airport.long,
      150
    )
  );

  const nearest = roughlyNearbyAirports
    .map((airport) => ({
      ...airport,
      distance: calculateDistance(
        userLocation.lat,
        userLocation.long,
        airport.lat,
        airport.long
      ),
    }))
    .filter((airport) => airport.distance <= 150)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10);

  nearestAirportsCache.set(cacheKey, nearest);
  return nearest;
};

export const filterAirports = async (query) => {
  const airportList = await loadAirports();

  if (!query) {
    return airportList.slice(0, 10);
  }

  query = query.toLowerCase();
  return airportList
    .filter(
      (airport) =>
        airport.code.toLowerCase().includes(query) ||
        airport.display.toLowerCase().includes(query)
    )
    .slice(0, 10);
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const calculateDepartureTime = (boardingTime, drivingTime, buffer) => {
  return new Date();
};
