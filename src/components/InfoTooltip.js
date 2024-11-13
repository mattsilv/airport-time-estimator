import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import styles from "../styles/Form.module.css";

export const InfoTooltip = ({ text }) => {
  const renderTooltip = (props) => <Tooltip {...props}>{text}</Tooltip>;

  return (
    <OverlayTrigger
      placement="right"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
    >
      <span className={styles.infoIcon}>ⓘ</span>
    </OverlayTrigger>
  );
};
