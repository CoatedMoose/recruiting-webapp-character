import React, {useEffect, useState} from 'react';
import CharacterAttributeView from './CharacterAttributeView';

interface Props {
  attributeName: string;
  initialAttributeValue: number;
  modifierValue: number;
  onValueChange: (value: number) => void;
}

export default function CharacterAttribute(
  {
    attributeName,
    initialAttributeValue,
    modifierValue,
    onValueChange
  }: Props): React.ReactElement {

  const [attributeValue, setAttributeValue] = useState<number>(initialAttributeValue);

  useEffect(() => {
    onValueChange(attributeValue)
  }, [attributeValue, onValueChange]);

  return (
    <CharacterAttributeView
      attributeName={attributeName}
      attributeValue={attributeValue}
      attributeModifier={modifierValue}
      onIncrement={() => setAttributeValue(curVal => curVal + 1)}
      onDecrement={() => setAttributeValue(curVal => curVal - 1)}
    />
  );
}
