export type Attributes = {
  Strength: number;
  Dexterity: number;
  Constitution: number;
  Intelligence: number;
  Wisdom: number;
  Charisma: number;
};

export type Class = "Barbarian" | "Wizard" | "Bard";

export type DndCharacterData = {
  skills: { skillName: string, skillValue: number }[];
  attributes: { attributeName: string, attributeValue: number }[];
}
