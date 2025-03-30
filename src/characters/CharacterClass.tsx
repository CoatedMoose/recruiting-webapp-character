import React from 'react';

interface Props {
  className: string;
  attributeValues: { [attribute: string]: number };
  classMinimums: { [className: string]: number }
}

export default function CharacterClass({className, attributeValues, classMinimums}: Props): React.ReactElement {
  return <div
    style={
      {
        color: Object.keys(classMinimums).every(
          className => attributeValues[className] >= classMinimums[className]
        ) ? 'red' : 'blue'
      }
    }>{className}</div>;
}
