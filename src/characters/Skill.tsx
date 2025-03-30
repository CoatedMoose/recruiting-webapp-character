import {SKILL_LIST} from '../consts';
import React from 'react';

interface Props {
  name: string;
  value: number;
  modifierName: string;
  modifierValue: number;
  pointsAvailable: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function Skill(
  {
    name,
    value,
    modifierName,
    modifierValue,
    pointsAvailable,
    onIncrement,
    onDecrement,
  }: Props): React.ReactElement {
  return (
    <div>
      {name}: {value} (Modifier: {modifierName}: {modifierValue})
      <button disabled={!pointsAvailable} onClick={onIncrement}>+</button>
      <button disabled={value <= 0} onClick={onDecrement}>-</button>
      Total: {value + modifierValue}
    </div>
  )
};
