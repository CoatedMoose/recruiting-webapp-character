import React from 'react';

interface Props {
  className: string;
  attributeValues: { [attribute: string]: number };
  classMinimums: { [className: string]: number };
  onClick?: () => void;
}

export default function CharacterClass(
  {
    className,
    attributeValues,
    classMinimums,
    onClick
  }: Props): React.ReactElement {

  return <div
    onClick={onClick}
    style={
      {
        color: Object.keys(classMinimums).every(
          className => attributeValues[className] >= classMinimums[className]
        ) ? 'red' : 'blue'
      }
    }>{className}</div>;
}
