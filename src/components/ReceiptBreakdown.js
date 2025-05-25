import React, { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import styles from "../styles/ReceiptBreakdown.module.css";
import { calculateTimeline, formatDuration } from "../utils/timelineUtils";

export function ReceiptBreakdown({ formValues, routeInfo, selectedDate }) {
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'breakdown'
  
  console.log("ReceiptBreakdown formValues:", {
    airport: formValues?.airport || "No airport selected",
    drivingTime: formValues?.drivingTime || "No driving time",
    arriveEarly: formValues?.arriveEarly || "No arrival buffer",
  });

  console.log(
    "ReceiptBreakdown routeInfo:",
    routeInfo || "No route info available"
  );

  const getTimeBreakdown = () => {
    const items = [];

    items.push({
      label: "Airport Buffer Time",
      minutes: parseInt(formValues?.arriveEarly || 0),
      info: "How long it takes you from arrival to airport to getting to your gate. Security, check-in, walking to gate.",
    });

    const hasAirport = formValues?.airport?.code;
    console.log(
      "Airport status:",
      hasAirport
        ? `Selected: ${formValues.airport.code}`
        : "No airport selected"
    );

    if (hasAirport) {
      items.push({
        label: `Travel time to ${formValues.airport.code}`,
        minutes: parseInt(formValues.drivingTime || 0),
        info:
          routeInfo && routeInfo.distance
            ? `Historical traffic data for ${
                formValues.airport.code
              }. Distance: ${(routeInfo.distance / 1609.34).toFixed(1)} miles`
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
      console.log("Using manual travel time (no airport selected)");
      items.push({
        label: "Manual travel time",
        minutes: parseInt(formValues?.drivingTime || 0),
        info: "Based on manually entered travel time",
      });
    }

    items.push({
      label: (
        <span className="d-flex align-items-center gap-2">
          Anxiety buffer{" "}
          <span className={styles.anxietyLevel}>
            LVL {formValues.anxietyLevel || 0}
          </span>
        </span>
      ),
      minutes: (parseInt(formValues.anxietyLevel) || 0) * 5,
    });

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

    return items;
  };

  const InfoIcon = ({ tooltip }) => (
    <OverlayTrigger placement="top" overlay={<Tooltip>{tooltip}</Tooltip>}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        fill="currentColor"
        viewBox="0 0 16 16"
        className={styles.infoIcon}
      >
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
      </svg>
    </OverlayTrigger>
  );

  const formatTimeHrMin = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) {
      return `${remainingMinutes}m`;
    }
    return `${hours}h ${remainingMinutes}m`;
  };

  // Calculate timeline data
  const timeline = calculateTimeline(formValues, routeInfo, selectedDate);
  
  // Legacy breakdown for comparison/fallback
  const timeBreakdown = getTimeBreakdown();
  const totalMinutes = timeBreakdown.reduce(
    (sum, item) => sum + item.minutes,
    0
  );
  const finalTotal = formValues.withKids
    ? Math.ceil(totalMinutes * 1.15)
    : totalMinutes;

  const ViewToggle = () => (
    <div className={styles.viewToggle}>
      <button
        className={`${styles.toggleButton} ${viewMode === 'timeline' ? styles.active : ''}`}
        onClick={() => setViewMode('timeline')}
      >
        📅 Timeline
      </button>
      <button
        className={`${styles.toggleButton} ${viewMode === 'breakdown' ? styles.active : ''}`}
        onClick={() => setViewMode('breakdown')}
      >
        📄 Breakdown
      </button>
    </div>
  );

  const TimelineView = () => (
    <div className={styles.timeline}>
      <div className={styles.timelineSteps}>
        {timeline.steps.map((step, index) => (
          <div key={step.id} className={styles.timelineStep}>
            <div className={styles.timelineTime}>
              {step.timestamp}
            </div>
            <div className={styles.timelineIcon}>
              {step.icon}
            </div>
            <div className={styles.timelineContent}>
              <div className={styles.timelineLabel}>
                {step.label}
              </div>
              {step.minutes > 0 && (
                <div className={styles.timelineDuration}>
                  {formatDuration(step.minutes)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {timeline.modifiers.length > 0 && (
        <div className={styles.timelineModifiers}>
          <h6 className={styles.modifiersTitle}>Additional Buffers</h6>
          {timeline.modifiers.map((modifier, index) => (
            <div key={modifier.id} className={styles.modifier}>
              <span className={styles.modifierIcon}>{modifier.icon}</span>
              <span className={styles.modifierLabel}>{modifier.label}</span>
              <span className={styles.modifierMinutes}>
                {modifier.percentage 
                  ? `+${Math.round(modifier.percentage * 100)}%`
                  : `+${formatDuration(modifier.minutes)}`
                }
              </span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.timelineSummary}>
        <div className={styles.summaryItem}>
          <span>Total Journey Time</span>
          <span>{formatDuration(timeline.totals.final)}</span>
        </div>
        <div className={styles.summaryItem}>
          <span>Leave at</span>
          <span className={styles.leaveTime}>{timeline.totals.leaveTime}</span>
        </div>
      </div>
    </div>
  );

  const BreakdownView = () => (
    <div className={styles.items}>
      {timeBreakdown.map((item, index) => (
        <div key={index} className={styles.item}>
          <span className={styles.label}>
            {item.label}
            {item.info && <InfoIcon tooltip={item.info} />}
          </span>
          <span className={styles.minutes}>+{item.minutes} min</span>
        </div>
      ))}
      <div className={styles.subtotal}>
        <span>Subtotal</span>
        <span>{formatTimeHrMin(totalMinutes)}</span>
      </div>
      {formValues.withKids && (
        <div className={styles.kidsBuffer}>
          <span>Kids buffer (15%)</span>
          <span>+{Math.ceil(totalMinutes * 0.15)} min</span>
        </div>
      )}
      <div className={styles.total}>
        <span>Total Buffer</span>
        <span>{formatTimeHrMin(finalTotal)}</span>
      </div>
    </div>
  );

  return (
    <div className={styles.receipt}>
      <div className={styles.header}>
        <h6 className={styles.receiptTitle}>
          {viewMode === 'timeline' ? 'Flight Timeline' : 'Time Breakdown'}
        </h6>
        <ViewToggle />
      </div>
      {viewMode === 'timeline' ? <TimelineView /> : <BreakdownView />}
    </div>
  );
}
