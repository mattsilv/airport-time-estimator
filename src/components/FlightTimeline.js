import React from "react";
import styles from "../styles/FlightTimeline.module.css";
import { calculateTimeline, formatDuration } from "../utils/timelineUtils";

export function FlightTimeline({ formValues, routeInfo, selectedDate }) {
  const timeline = calculateTimeline(formValues, routeInfo, selectedDate);

  return (
    <div className={styles.timeline}>
      <h5 className={styles.title}>Airport Timeline</h5>
      
      <div className={styles.steps}>
        {timeline.steps.map((step) => (
          <div key={step.id} className={styles.step}>
            <div className={styles.time}>
              <div className={styles.singleTime}>{step.timestamp}</div>
            </div>
            <div className={styles.icon}>{step.icon}</div>
            <div className={styles.content}>
              <div className={styles.label}>{step.label}</div>
              {step.minutes > 0 && (
                <div className={styles.duration}>{formatDuration(step.minutes)}</div>
              )}
            </div>
          </div>
        ))}
        
        {timeline.modifiers.length > 0 && (
          <div className={styles.modifiers}>
            <div className={styles.modifiersTitle}>
              Buffers Accounted For ({timeline.modifiers.reduce((sum, mod) => sum + (mod.minutes || 0), 0)}min)
            </div>
            {timeline.modifiers.map((modifier) => (
              <div key={modifier.id} className={styles.modifier}>
                <span className={styles.modifierIcon}>{modifier.icon}</span>
                <span className={styles.modifierLabel}>{modifier.label}</span>
                <span className={styles.modifierTime}>
                  +{formatDuration(modifier.minutes)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span>Total Journey Time</span>
            <span>{formatDuration(timeline.totals.final)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Leave at</span>
            <span className={styles.leaveTime}>{timeline.totals.leaveTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}