import React, {useCallback, useState} from 'react';
import CharacterAttribute from './CharacterAttribute';
import {ATTRIBUTE_LIST, CLASS_LIST} from '../consts';
import CharacterClass from './CharacterClass';
import {Attributes} from '../types';


interface Attribute {
  name: string;
  value: number;
}

function attrListToObject(attributes: Attribute[]): { [attributeName: string]: number } {
  return attributes.reduce(((agg, attr) => {
    const newAgg = {
      ...agg
    }
    newAgg[attr.name] = attr.value;
    return newAgg;
  }), {});
}


export default function Character(): React.ReactElement {

  const [attributes, setAttributes] = useState<Attribute[]>(
    ATTRIBUTE_LIST.map((attribute) => {
      return {
        name: attribute,
        value: 0,
      }
    })
  );

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
      <div>
        {attributes.map(attribute => (
          <CharacterAttribute
            key={attribute.name}
            attributeName={attribute.name}
            initialAttributeValue={attribute.value}
            onValueChange={(value) => onAttributeChange(attribute.name, value)}
          />
        ))}
      </div>
      <h3>Character Classes</h3>
      {Object.keys(CLASS_LIST).map((className) => (
          <CharacterClass
            className={className} attributeValues={attrListToObject(attributes)} classMinimums={CLASS_LIST[className]}
          />
        )
      )}
    </div>
  )
}
