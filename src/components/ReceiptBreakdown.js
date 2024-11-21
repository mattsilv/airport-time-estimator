import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { format, subMinutes } from "date-fns";
import styles from "../styles/ReceiptBreakdown.module.css";

export function ReceiptBreakdown({ formValues, routeInfo }) {
  const getTimeBreakdown = () => {
    const items = [];

    // Base time - use arriveEarly as the base buffer
    items.push({
      label: "Base arrival buffer",
      minutes: parseInt(formValues.arriveEarly || 0),
    });

    // Travel time - always show, but with different context
    if (formValues.airport?.code) {
      // If we have an airport selected
      if (routeInfo && formValues.boardingTime) {
        // Calculate travel time date (2 hours before boarding)
        const [hours, minutes] = formValues.boardingTime.split(":").map(Number);
        const boardingDate = new Date(formValues.departAt);
        boardingDate.setHours(hours);
        boardingDate.setMinutes(minutes);
        const travelDate = subMinutes(boardingDate, 120); // 2 hours before boarding
        const formattedDate = format(travelDate, "EEE MMM d 'at' h:mm a");

        items.push({
          label: `Travel to ${formValues.airport.code} w/ Traffic`,
          minutes: Math.ceil(routeInfo.duration / 60), // Convert seconds to minutes
          info: `Historical traffic data for ${formattedDate}. Distance: ${(
            routeInfo.distance / 1609.34
          ).toFixed(1)} miles`,
        });
      } else {
        items.push({
          label: `Historic traffic estimate`,
          minutes: parseInt(formValues.drivingTime || 0),
          info: `Estimated travel time to ${formValues.airport.code}`,
        });
      }
    } else {
      items.push({
        label: "Manual travel time",
        minutes: parseInt(formValues.drivingTime || 0),
        info: "Based on manually entered travel time",
      });
    }

    // Anxiety level (always shown)
    items.push({
      label: `Anxiety buffer (level ${formValues.anxietyLevel || 0})`,
      minutes: (parseInt(formValues.anxietyLevel) || 0) * 5,
    });

    // Conditional buffers
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

  const timeBreakdown = getTimeBreakdown();
  const totalMinutes = timeBreakdown.reduce(
    (sum, item) => sum + item.minutes,
    0
  );
  const finalTotal = formValues.withKids
    ? Math.ceil(totalMinutes * 1.15)
    : totalMinutes;

  return (
    <div className={styles.receipt}>
      <h6 className={styles.receiptTitle}>Time Breakdown</h6>
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
    </div>
  );
}
