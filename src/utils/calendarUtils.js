/**
 * Utility functions for calendar integration
 */

/**
 * Generate a detailed breakdown of time calculation for calendar description
 * @param {Object} formValues - Form values object
 * @param {Object} routeInfo - Route information object
 * @returns {string} Formatted breakdown text for calendar description
 */
export function generateCalendarDescription(formValues, routeInfo) {
  const items = [];

  // Airport Buffer Time
  items.push({
    label: "Airport Buffer Time",
    minutes: parseInt(formValues?.arriveEarly || 0),
    info: "Security, check-in, walking to gate",
  });

  // Travel Time
  const hasAirport = formValues?.airport?.code;
  if (hasAirport) {
    items.push({
      label: `Travel time to ${formValues.airport.code}`,
      minutes: parseInt(formValues.drivingTime || 0),
      info: routeInfo && routeInfo.distance
        ? `Distance: ${(routeInfo.distance / 1609.34).toFixed(1)} miles`
        : `Estimated travel time to ${formValues.airport.code}`,
    });

    if (routeInfo && routeInfo.distance) {
      items.push({
        label: `Travel buffer to ${formValues.airport.code}`,
        minutes: 5,
        info: "Extra buffer added to TomTom travel estimate",
      });
    }
  } else {
    items.push({
      label: "Manual travel time",
      minutes: parseInt(formValues?.drivingTime || 0),
      info: "Based on manually entered travel time",
    });
  }

  // Anxiety buffer
  items.push({
    label: `Anxiety buffer (Level ${formValues.anxietyLevel || 0})`,
    minutes: (parseInt(formValues.anxietyLevel) || 0) * 5,
  });

  // Optional buffers
  if (formValues.isInternational) {
    items.push({ label: "International flight", minutes: 40 });
  }
  if (formValues.noTSAPre) {
    items.push({ label: "No TSA PreCheck", minutes: 15 });
  }
  if (formValues.needSnacks) {
    items.push({ label: "Airport snacks", minutes: 10 });
  }
  if (formValues.needParking) {
    items.push({ label: "Airport parking", minutes: 15 });
  }
  if (formValues.tsaArgument) {
    items.push({ label: "TSA argument time", minutes: 3 });
  }
  if (formValues.checkingBags) {
    items.push({ label: "Checking bags", minutes: 20 });
  }

  // Calculate totals
  const totalMinutes = items.reduce((sum, item) => sum + item.minutes, 0);
  const finalTotal = formValues.withKids
    ? Math.ceil(totalMinutes * 1.15)
    : totalMinutes;

  // Format breakdown for calendar
  let description = "Departure Time Calculation:\n\n";
  
  items.forEach((item) => {
    if (item.minutes > 0) {
      description += `• ${item.label}: +${item.minutes} min`;
      if (item.info) {
        description += ` (${item.info})`;
      }
      description += "\n";
    }
  });

  description += `\nSubtotal: ${formatTimeHrMin(totalMinutes)}`;
  
  if (formValues.withKids) {
    description += `\nKids buffer (15%): +${Math.ceil(totalMinutes * 0.15)} min`;
  }
  
  description += `\nTotal Buffer: ${formatTimeHrMin(finalTotal)}`;
  description += "\n\nCreated by https://airportcalc.silv.app/";

  return description;
}

/**
 * Generate calendar event title based on airport
 * @param {Object} formValues - Form values object
 * @returns {string} Event title
 */
export function generateCalendarTitle(formValues) {
  const airportCode = formValues?.airport?.code;
  return airportCode 
    ? `Time to leave for ${airportCode}`
    : "Time to leave for airport";
}

/**
 * Get airport code for calendar location field
 * @param {Object} formValues - Form values object
 * @returns {string} Airport code or empty string
 */
export function getCalendarLocation(formValues) {
  return formValues?.airport?.code || "";
}

/**
 * Format time in hours and minutes
 * @param {number} minutes - Total minutes
 * @returns {string} Formatted time string
 */
function formatTimeHrMin(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) {
    return `${remainingMinutes}m`;
  }
  return `${hours}h ${remainingMinutes}m`;
}