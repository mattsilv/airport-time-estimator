let airports = [];

// Load airports data
const loadAirports = async () => {
  if (airports.length === 0) {
    try {
      console.log("Fetching airports data...");
      const response = await fetch("/data/airports-min.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Loaded airports:", data.length);
      airports = data; // Keep original format
    } catch (error) {
      console.error("Error loading airports:", error);
      return [];
    }
  }
  return airports;
};

export const filterAirports = async (query) => {
  const airportList = await loadAirports();
  console.log("Filtering airports, total:", airportList.length);

  if (!query) {
    const initial = airportList.slice(0, 10);
    console.log("Initial airports:", initial);
    return initial;
  }

  const filtered = airportList
    .filter(
      (airport) =>
        airport.code.toLowerCase().includes(query.toLowerCase()) ||
        airport.display.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 10);

  console.log("Filtered airports:", filtered);
  return filtered;
};

export const getNearestAirports = async (userLocation) => {
  if (!userLocation) return [];

  const airportList = await loadAirports();
  return airportList
    .map((airport) => ({
      ...airport,
      distance: calculateDistance(
        userLocation.lat,
        userLocation.long,
        airport.lat,
        airport.long
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10);
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
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
  // Existing departure time calculation if you have it
  return new Date();
};
