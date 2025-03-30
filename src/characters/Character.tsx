import React, {useCallback, useMemo, useState} from 'react';
import CharacterAttribute from './CharacterAttribute';
import {ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST} from '../consts';
import CharacterClass from './CharacterClass';
import SkillComponent from './Skill';
import {Attributes, Class} from '../types';


interface Attribute {
  name: string;
  value: number;
}

interface Skill {
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

function calculateModifier(attributeValue: number): number {
  // Spec doesn't specify behaviour for 8, 6, etc, but this is probably correct (8 gives -1, 6 gives -2, etc)
  return Math.floor((attributeValue - 10) / 2)
}

function calculateSkillModifier(skill: Skill, attributes: Attribute[]): number {
  return Math.max(calculateModifier(
    attributes.find(
      attr => attr.name === SKILL_LIST.find(
        s => s.name === skill.name
      ).attributeModifier
    ).value
  ), 0);
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

  const [skillPoints, setSkillPoints] = useState<Skill[]>(SKILL_LIST.map(skill => {
    return {
      name: skill.name,
      value: 0,
    }
  }))

  const availablePoints = useMemo(() => {
    return Math.max(10 + 4 * calculateModifier(attributes.find(attr => attr.name === 'Intelligence').value), 0);
  }, [attributes]);

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
            modifierValue={calculateModifier(attribute.value)}
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
          { /* This isn't really associated with any specific character, but associating it with the character is consistent with the provided video */}
          <h3>Class Requirement</h3>
          {Object.keys(CLASS_LIST[selectedClass]).map(attr => (<div>{attr}: {CLASS_LIST[selectedClass][attr]}</div>))
          }
        </div>
      )}
      <div>
        <h3>Skills</h3>
        <div>Total skill points available: {availablePoints}</div>
        {skillPoints.map((skill) => (
          <SkillComponent
            name={skill.name}
            value={skill.value}
            modifierName={SKILL_LIST.find(s => s.name === skill.name).attributeModifier}
            modifierValue={calculateSkillModifier(skill, attributes)}
            pointsAvailable={availablePoints > skillPoints.reduce((agg, skillPoint) => agg + skillPoint.value, 0)}
            onIncrement={() => setSkillPoints(skills => skills.map(s => {
              if (s.name === skill.name) {
                return {
                  name: s.name,
                  value: s.value + 1
                }
              }
              return s;
            }))}
            onDecrement={() => setSkillPoints(skills => skills.map(s => {
              if (s.name === skill.name) {
                return {
                  name: s.name,
                  value: s.value - 1
                }
              }
              return s;
            }))} />
        ))}
      </div>
    </div>
  )
}
