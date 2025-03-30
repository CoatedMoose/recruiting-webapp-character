import React, {useCallback, useState} from 'react';
import CharacterAttribute from './CharacterAttribute';
import {ATTRIBUTE_LIST, CLASS_LIST} from '../consts';
import CharacterClass from './CharacterClass';
import {Attributes, Class} from '../types';


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
  const [selectedClass, setSelectedClass] = useState<Class>();

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
      {Object.keys(CLASS_LIST).map((className: Class) => (
          <CharacterClass
            className={className}
            attributeValues={attrListToObject(attributes)}
            classMinimums={CLASS_LIST[className]}
            onClick={() => setSelectedClass((curClassName) => curClassName === className ? undefined : className)}
          />
        )
      )}
      {selectedClass !== undefined && (
        <div>
          <h3>Class Requirement</h3>
          {Object.keys(CLASS_LIST[selectedClass]).map(attr => (<div>{attr}: {CLASS_LIST[selectedClass][attr]}</div>))
          }
        </div>
      )}
    </div>
  )
}
