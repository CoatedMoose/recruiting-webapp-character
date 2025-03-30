import React from 'react';

interface Props {
  attributeName: string;
  attributeValue: number;
  attributeModifier: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function CharacterAttributeView(
  {
    attributeName,
    attributeValue,
    attributeModifier,
    onIncrement,
    onDecrement
  }: Props): React.ReactElement {

  return (
    <div>
      {attributeName}:{attributeValue} (Modifier: {attributeModifier})
      <button onClick={onIncrement}>+</button>
      <button disabled={attributeValue <= 0} onClick={onDecrement}>-</button>
    </div>
  )
}
