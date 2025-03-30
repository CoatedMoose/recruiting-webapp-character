import {DndCharacterData} from './types';


const url = 'https://recruiting.verylongdomaintotestwith.ca/api/{coatedmoose}/character'

function isValidCharacterData(obj: any): obj is { body: { [characterName: string]: DndCharacterData } } {
  if (obj.message === 'Item not found') {
    console.info("response is item missing")
    return false;
  }

  if (!('body' in obj)) {
    console.info("api response missing body")
    return false;
  }

  if (!(Object.keys(obj.body).map(objKey => obj.body[objKey]).every(maybeChar => 'skills' in maybeChar && 'attributes' in maybeChar))) {
    console.info("At least one character is missing a required field")
    return false;
  }
  // TODO: Better validation
  return true;
}


export async function saveCharactersData(data: { [characterName: string]: DndCharacterData }) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (error) {
    console.error('failed to save character data', error)
  }
  console.info("Character data saved")
}

export async function getCharactersData(): Promise<{ [characterName: string]: DndCharacterData } | undefined> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    const responseObj = await response.json();
    if (!isValidCharacterData(responseObj)) {
      console.warn("saved character data not valid")
      // return responseObj.body;
      return undefined;
    }
    return responseObj.body;
  } catch (error) {
    console.warn('failed to fetch character data', error);
    return undefined;
  }
}
