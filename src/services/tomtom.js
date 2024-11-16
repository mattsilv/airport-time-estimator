import { tomtomRateLimiter } from "./rateLimiter";

const TOMTOM_API_BASE = "https://api.tomtom.com/routing/1";
const TOMTOM_API_KEY = process.env.REACT_APP_TOMTOM_API_KEY;

export const calculateRoute = async (origin, destination) => {
  if (!TOMTOM_API_KEY) {
    console.error("TomTom API key is not configured");
    return null;
  }

  try {
    const response = await fetch(
      `https://api.tomtom.com/routing/1/calculateRoute/${origin.lat},${origin.long}:${destination.lat},${destination.long}/json?key=${TOMTOM_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const route = data.routes[0];

    return {
      travelTimeMinutes: Math.ceil(route.summary.travelTimeInSeconds / 60),
      distanceKm: Math.round(route.summary.lengthInMeters / 1000),
      route: route,
    };
  } catch (error) {
    console.error("Error calculating route:", error);
    return null;
  }
};
