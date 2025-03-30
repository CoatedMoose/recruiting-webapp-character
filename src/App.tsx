import './App.css';
import Character from './characters/Character';
import {useCallback, useEffect, useState} from 'react';
import {getCharactersData, saveCharactersData} from './api';
import {DndCharacterData} from './types';
import {ATTRIBUTE_LIST, SKILL_LIST} from './consts';


const defaultCharacter: DndCharacterData = {
  skills: SKILL_LIST.map(s => {
    return {
      skillName: s.name,
      skillValue: 0,
    }
  }),
  attributes: ATTRIBUTE_LIST.map(attrName => {
    return {
      attributeName: attrName,
      attributeValue: 0,
    }
  })
}

function App() {
  const [characters, setCharacters] = useState<{ [characterName: string]: DndCharacterData }>()

  useEffect(() => {
    if (characters === undefined) {

      (async () => {
        const charData = await getCharactersData();
        setCharacters(charData ?? {CharacterNameHere: {...defaultCharacter}})
      })().catch((e) => {
        console.error("failed to load character data", e);
        setCharacters({CharacterNameHere: {...defaultCharacter}})
      })
    }
  }, [characters]);

  const onCharacterUpdate = useCallback((characterName: string, characterData: DndCharacterData) => {
    setCharacters(existingCharacters => {
      const updatedCharacters = {
        ...existingCharacters
      }
      updatedCharacters[characterName] = characterData;
      return updatedCharacters;
    })
  }, []);

  if (characters === undefined) {
    return <div>loading</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Character Sheet</h1>
      </header>

      <section className="App-section">
        <div>
          <button onClick={() => saveCharactersData(characters)}>save</button>
        </div>
        <div>
          {Object.keys(characters).map((characterName) => (
            <Character
              key={characterName}
              characterName={characterName}
              characterData={characters[characterName]}
              onCharacterUpdate={(newData) => onCharacterUpdate(characterName, newData)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
