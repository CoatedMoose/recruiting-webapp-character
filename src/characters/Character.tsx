import React, {useCallback, useMemo, useState} from 'react';
import {CLASS_LIST, SKILL_LIST} from '../consts';
import CharacterClass from './CharacterClass';
import SkillComponent from './Skill';
import {Class, DndCharacterData} from '../types';
import CharacterAttributeView from './CharacterAttributeView';

function attrListToObject(attributes: { attributeName: string, attributeValue: number }[]): {
  [attributeName: string]: number
} {
  return attributes.reduce(((agg, attr) => {
    const newAgg = {
      ...agg
    }
    newAgg[attr.attributeName] = attr.attributeValue;
    return newAgg;
  }), {});
}

function calculateModifier(attributeValue: number): number {
  // Spec doesn't specify behaviour for 8, 6, etc, but this is probably correct (8 gives -1, 6 gives -2, etc)
  return Math.floor((attributeValue - 10) / 2)
}

function calculateSkillModifier(skill: { skillName: string }, attributes: {
  attributeName: string,
  attributeValue: number
}[]): number {
  return Math.max(calculateModifier(
    attributes.find(
      attr => attr.attributeName === SKILL_LIST.find(
        s => s.name === skill.skillName
      ).attributeModifier
    ).attributeValue
  ), 0);
}

interface Props {
  characterName: string;
  characterData: DndCharacterData;
  onCharacterUpdate: (character: DndCharacterData) => void;
}

export default function Character({characterName, characterData, onCharacterUpdate}: Props): React.ReactElement {
  const [selectedClass, setSelectedClass] = useState<Class>();

  const availablePoints = useMemo(() => {
    return Math.max(
      10 + 4 * calculateModifier(
        characterData.attributes.find(attr => attr.attributeName === 'Intelligence').attributeValue),
      0
    );
  }, [characterData]);

  const onAttributeChange = useCallback((name: string, value: number) => {
    onCharacterUpdate({
      attributes: characterData.attributes.map((attr) => {
        if (attr.attributeName === name) {
          return {
            attributeName: name,
            attributeValue: value,
          }
        } else {
          return attr;
        }
      }),
      skills: characterData.skills
    })
  }, [onCharacterUpdate, characterData]);

  const onSkillChange = useCallback((name: string, value: number) => {
    onCharacterUpdate({
      attributes: characterData.attributes,
      skills: characterData.skills.map(skill => {
        if (skill.skillName === name) {
          return {
            skillName: name,
            skillValue: value,
          }
        } else {
          return skill
        }
      }),
    })
  }, [onCharacterUpdate, characterData]);

  return (
    <div>
      <div>
        <h2>{characterName}</h2>
        {characterData.attributes.map(attribute => (
          <CharacterAttributeView
            key={attribute.attributeName}
            attributeName={attribute.attributeName}
            attributeModifier={calculateModifier(attribute.attributeValue)}
            attributeValue={attribute.attributeValue}
            onIncrement={() => onAttributeChange(attribute.attributeName, attribute.attributeValue + 1)}
            onDecrement={() => onAttributeChange(attribute.attributeName, attribute.attributeValue - 1)}
          />
        ))}
      </div>
      <h3>Character Classes</h3>
      {Object.keys(CLASS_LIST).map((className: Class) => (
          <CharacterClass
            key={className}
            className={className}
            attributeValues={attrListToObject(characterData.attributes)}
            classMinimums={CLASS_LIST[className]}
            onClick={() => setSelectedClass((curClassName) => curClassName === className ? undefined : className)}
          />
        )
      )}
      {selectedClass !== undefined && (
        <div>
          { /* This isn't really associated with any specific character, but associating it with the character is consistent with the provided video */}
          <h3>Class Requirement</h3>
          {Object.keys(CLASS_LIST[selectedClass]).map(attr => (
            <div key={attr}>{attr}: {CLASS_LIST[selectedClass][attr]}</div>))
          }
        </div>
      )}
      <div>
        <h3>Skills</h3>
        <div>Total skill points available: {availablePoints}</div>
        {characterData.skills.map((skill) => (
          <SkillComponent
            key={skill.skillName}
            name={skill.skillName}
            value={skill.skillValue}
            modifierName={SKILL_LIST.find(s => s.name === skill.skillName).attributeModifier}
            modifierValue={calculateSkillModifier(skill, characterData.attributes)}
            pointsAvailable={availablePoints > characterData.skills.reduce((agg, skillPoint) => agg + skillPoint.skillValue, 0)}
            onIncrement={() => onSkillChange(skill.skillName, skill.skillValue + 1)}
            onDecrement={() => onSkillChange(skill.skillName, skill.skillValue - 1)} />
        ))}
      </div>
    </div>
  )
}
