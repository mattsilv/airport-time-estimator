import React from 'react';
import { Input } from 'tamagui';

export default function TimeInput({ label }) {
  return (
    <Input placeholder={label} type="time" />
  );
}
