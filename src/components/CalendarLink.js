import React from 'react';

const CalendarLink = ({link}) => {
  return (
    <div className="text-center mt-3">
      <a href={link} target="_blank" rel="noopener noreferrer">
        Add to Calendar
      </a>
    </div>
  );
};

export default CalendarLink;
