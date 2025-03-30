import React, {useCallback, useState} from 'react';
import CharacterAttribute from './CharacterAttribute';
import {ATTRIBUTE_LIST} from '../consts';

interface Attribute {
  name: string;
  value: number;
}

export default function Character(): React.ReactElement {

  const [attributes, setAttributes] = useState<Attribute[]>(ATTRIBUTE_LIST.map(attributeName => {
    return {
      name: attributeName,
      value: 0,
    }
  }));

  const onAttributeChange = useCallback((name: string, value: number) => {
    setAttributes(attrs => attrs.map((attr) => {
      if (attr.name === name) {
        return {
          name: attr.name,
          value,
        }
      } else {
        return attr;
      }
    }))
  }, []);

  return (
    <div>
      {attributes.map(attribute => (
        <CharacterAttribute
          key={attribute.name}
          attributeName={attribute.name}
          initialAttributeValue={attribute.value}
          onValueChange={(value) => onAttributeChange(attribute.name, value)}
        />
      ))}
    </div>)
}
