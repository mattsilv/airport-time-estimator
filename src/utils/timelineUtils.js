import { parseTimeString, formatTime } from './timeUtils';

// Timeline step configuration with icons and logical ordering
export const TIMELINE_STEPS = {
  TRAVEL_TO_AIRPORT: {
    id: 'travel_to_airport',
    order: 1,
    icon: '🚗',
    label: (formValues) => 
      formValues?.airport?.code 
        ? `Travel to ${formValues.airport.code}`
        : 'Travel to airport',
    getMinutes: (formValues, routeInfo) => {
      const baseTravelTime = parseInt(formValues?.drivingTime || 0);
      return baseTravelTime;
    },
  },
  ARRIVE_AT_AIRPORT: {
    id: 'arrive_at_airport',
    order: 2,
    icon: '✈️',
    label: (formValues) =>
      formValues?.airport?.code
        ? `Arrive at ${formValues.airport.code}`
        : 'Arrive at airport',
    getMinutes: () => 0, // Milestone
  },
  PARKING: {
    id: 'parking',
    order: 3,
    icon: '🅿️',
    label: 'Find parking',
    getMinutes: (formValues) => (formValues?.needParking ? 15 : 0),
    condition: (formValues) => formValues?.needParking,
  },
  CHECK_IN_BAGS: {
    id: 'check_in_bags',
    order: 4,
    icon: '🧳',
    label: 'Check in bags',
    getMinutes: (formValues) => (formValues?.checkingBags ? 20 : 0),
    condition: (formValues) => formValues?.checkingBags,
  },
  SECURITY_CHECKPOINT: {
    id: 'security_checkpoint',
    order: 5,
    icon: '🔒',
    label: 'Security checkpoint',
    getMinutes: (formValues) => {
      let securityTime = 30; // Base security time always included
      if (formValues?.noTSAPre) securityTime += 15;
      if (formValues?.tsaArgument) securityTime += 3;
      return securityTime;
    },
  },
  GET_SNACKS: {
    id: 'get_snacks',
    order: 6,
    icon: '🍿',
    label: 'Get airport snacks',
    getMinutes: (formValues) => (formValues?.needSnacks ? 10 : 0),
    condition: (formValues) => formValues?.needSnacks,
  },
  NAVIGATE_TO_GATE: {
    id: 'navigate_to_gate',
    order: 7,
    icon: '🚶',
    label: 'Navigate to gate',
    getMinutes: (formValues) => {
      const baseBuffer = 15; // Reduced from 30 to 15 minutes
      const internationalBuffer = formValues?.isInternational ? 40 : 0;
      return baseBuffer + internationalBuffer;
    },
  },
  BOARDING_TIME: {
    id: 'boarding_time',
    order: 8,
    icon: '🎫',
    label: 'Boarding begins',
    getMinutes: () => 0, // End point
  },
};

// Non-timeline modifiers that affect overall calculation
export const TIMELINE_MODIFIERS = {
  ANXIETY_BUFFER: {
    id: 'anxiety_buffer',
    icon: '😰',
    label: (formValues) => `Anxiety buffer (Level ${formValues?.anxietyLevel || 0})`,
    getMinutes: (formValues) => (parseInt(formValues?.anxietyLevel) || 0) * 5,
    condition: (formValues) => parseInt(formValues?.anxietyLevel) > 0,
  },
  KIDS_BUFFER: {
    id: 'kids_buffer',
    icon: '👶',
    label: 'Kids buffer (15%)',
    getPercentage: () => 0.15,
    condition: (formValues) => formValues?.withKids,
  },
};

/**
 * Calculate timeline with timestamps for each step
 * @param {Object} formValues - Form values from useFlightForm
 * @param {Object} routeInfo - Route information from TomTom API
 * @param {Date|string} selectedDate - Selected flight date
 * @returns {Object} Timeline data with steps, modifiers, and totals
 */
export function calculateTimeline(formValues, routeInfo, selectedDate) {
  if (!formValues?.boardingTime) {
    return { steps: [], modifiers: [], totals: {} };
  }

  // Parse boarding time
  const { hours: boardingHours, minutes: boardingMinutes } = parseTimeString(
    formValues.boardingTime
  );

  // Create boarding time date
  let boardingDate;
  if (typeof selectedDate === 'string') {
    boardingDate = new Date(selectedDate);
  } else {
    boardingDate = new Date(selectedDate);
  }
  boardingDate.setHours(boardingHours, boardingMinutes, 0, 0);

  // Calculate timeline steps in reverse order (working backwards from boarding)
  const timelineSteps = [];
  const stepOrder = Object.values(TIMELINE_STEPS).sort((a, b) => b.order - a.order);
  
  let currentTime = new Date(boardingDate);
  let totalMinutesBeforeModifiers = 0;

  for (const step of stepOrder) {
    // Check if step should be included
    if (step.condition && !step.condition(formValues)) {
      continue;
    }

    const minutes = step.getMinutes(formValues, routeInfo);
    
    // For steps that take time, subtract from current time
    if (minutes > 0) {
      currentTime.setMinutes(currentTime.getMinutes() - minutes);
      totalMinutesBeforeModifiers += minutes;
    }

    const label = typeof step.label === 'function' 
      ? step.label(formValues) 
      : step.label;

    timelineSteps.unshift({
      id: step.id,
      order: step.order,
      icon: step.icon,
      label,
      minutes,
      timestamp: formatTime(currentTime),
      timestampDate: new Date(currentTime),
    });
  }

  // Calculate modifiers
  const modifiers = [];
  for (const modifier of Object.values(TIMELINE_MODIFIERS)) {
    if (modifier.condition && !modifier.condition(formValues)) {
      continue;
    }

    const label = typeof modifier.label === 'function'
      ? modifier.label(formValues)
      : modifier.label;

    if (modifier.id === 'kids_buffer') {
      const kidsBufferMinutes = Math.ceil(totalMinutesBeforeModifiers * modifier.getPercentage());
      modifiers.push({
        id: modifier.id,
        icon: modifier.icon,
        label,
        percentage: modifier.getPercentage(),
        minutes: kidsBufferMinutes,
      });
    } else {
      const minutes = modifier.getMinutes(formValues);
      if (minutes > 0) {
        modifiers.push({
          id: modifier.id,
          icon: modifier.icon,
          label,
          minutes,
        });
      }
    }
  }

  // Calculate totals
  const modifierMinutes = modifiers.reduce((sum, mod) => sum + (mod.minutes || 0), 0);
  
  // Apply kids buffer to base time before adding other modifiers
  const baseTimeWithKidsBuffer = formValues.withKids
    ? Math.ceil(totalMinutesBeforeModifiers * 1.15)
    : totalMinutesBeforeModifiers;
    
  const finalTotalMinutes = baseTimeWithKidsBuffer + modifierMinutes;

  // Calculate final leave time
  const leaveTime = new Date(boardingDate);
  leaveTime.setMinutes(leaveTime.getMinutes() - finalTotalMinutes);

  // Update the first step's timestamp to reflect final leave time
  if (timelineSteps.length > 0) {
    timelineSteps[0].timestamp = formatTime(leaveTime);
    timelineSteps[0].timestampDate = new Date(leaveTime);
  }

  return {
    steps: timelineSteps,
    modifiers,
    totals: {
      beforeModifiers: totalMinutesBeforeModifiers,
      baseWithKidsBuffer: baseTimeWithKidsBuffer,
      modifiers: modifierMinutes,
      final: finalTotalMinutes,
      leaveTime: formatTime(leaveTime),
      leaveTimeDate: leaveTime,
    },
  };
}

/**
 * Format time duration for display
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration (e.g., "1h 30m" or "45m")
 */
export function formatDuration(minutes) {
  if (minutes === 0) return '0m';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes}m`;
  }
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Generate timeline description for calendar integration
 * @param {Object} timeline - Timeline data from calculateTimeline
 * @param {Object} formValues - Form values
 * @returns {string} Text description of timeline for calendar
 */
export function generateTimelineDescription(timeline, formValues) {
  const { steps, modifiers } = timeline;
  
  let description = 'Flight Timeline:\n\n';
  
  // Add timeline steps
  steps.forEach((step, index) => {
    if (step.minutes > 0 || step.id === 'leave_home' || step.id === 'boarding_time') {
      description += `${step.timestamp} - ${step.icon} ${step.label}`;
      if (step.minutes > 0) {
        description += ` (${formatDuration(step.minutes)})`;
      }
      description += '\n';
    }
  });
  
  // Add modifiers if any
  if (modifiers.length > 0) {
    description += '\nAdditional buffers applied:\n';
    modifiers.forEach(modifier => {
      description += `• ${modifier.icon} ${modifier.label}`;
      if (modifier.minutes) {
        description += ` (+${formatDuration(modifier.minutes)})`;
      }
      description += '\n';
    });
  }
  
  description += `\nTotal travel time: ${formatDuration(timeline.totals.final)}`;
  
  return description;
}