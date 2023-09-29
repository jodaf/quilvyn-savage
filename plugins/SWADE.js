/*
Copyright 2021, James J. Hayes

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program; if not, write to the Free Software Foundation, Inc., 59 Temple
Place, Suite 330, Boston, MA 02111-1307 USA.
*/

/*jshint esversion: 6 */
/* jshint forin: false */
/* globals Expr, ObjectViewer, Quilvyn, QuilvynRules, QuilvynUtils */
"use strict";

/*
 * This module loads the rules from the Savage Worlds Adventure Edition Core
 * Rules. The SWADE function contains methods that load rules for particular
 * parts of the rules: raceRules for character races, arcaneRules for powers,
 * etc. These member methods can be called independently in order to use a
 * subset of the SWADE rules. Similarly, the constant fields of SWADE
 * (SKILLS, EDGES, etc.) can be manipulated to modify the choices.
 */
function SWADE() {

  let rules =
    new QuilvynRules('Savage Worlds Adventure Edition', SWADE.VERSION);
  SWADE.rules = rules;

  rules.defineChoice('choices', SWADE.CHOICES);
  rules.choiceEditorElements = SWADE.choiceEditorElements;
  rules.choiceRules = SWADE.choiceRules;
  rules.editorElements = SWADE.initialEditorElements();
  rules.getFormats = SWADE.getFormats;
  rules.getPlugins = SWADE.getPlugins;
  rules.makeValid = SWADE.makeValid;
  rules.randomizeOneAttribute = SWADE.randomizeOneAttribute;
  rules.defineChoice('random', SWADE.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = SWADE.ruleNotes;

  SWADE.createViewers(rules, SWADE.VIEWERS);
  rules.defineChoice('extras',
    'edges', 'edgePoints', 'hindrances', 'sanityNotes', 'validationNotes'
  );
  rules.defineChoice('preset',
    'race:Race,select-one,races', 'era:Era,select-one,eras',
    'advances:Advances,text,4', 'concepts:Concepts,set,concepts'
  );

  SWADE.attributeRules(rules);
  SWADE.combatRules(rules, SWADE.ARMORS, SWADE.SHIELDS, SWADE.WEAPONS);
  SWADE.arcaneRules(rules, SWADE.ARCANAS, SWADE.POWERS);
  SWADE.talentRules
    (rules, SWADE.EDGES, SWADE.FEATURES, SWADE.GOODIES, SWADE.HINDRANCES,
     SWADE.LANGUAGES, SWADE.SKILLS);
  SWADE.identityRules
    (rules, SWADE.RACES, SWADE.ERAS, SWADE.CONCEPTS, SWADE.DEITIES);

  Quilvyn.addRuleSet(rules);

}

SWADE.VERSION = '2.3.3.1';

/* List of items handled by choiceRules method. */
SWADE.CHOICES = [
  'Arcana', 'Armor', 'Concept', 'Edge', 'Era', 'Feature', 'Hindrance',
  'Language', 'Power', 'Race', 'Shield', 'Skill', 'Weapon'
];
/*
 * List of items handled by randomizeOneAttribute method. The order handles
 * dependencies among attributes when generating random characters.
 */
SWADE.RANDOMIZABLE_ATTRIBUTES = [
  'era', 'race', 'gender', 'name', 'advances', 'hindrances', 'improvements',
  'concepts', 'attributes', 'edges', 'skills', 'armor', 'weapons', 'shield',
  'deity', 'powers'
];
SWADE.VIEWERS = ['Collected Notes', 'Compact', 'Standard', 'Stat Block'];

SWADE.ARCANAS = {
  'Gifted':'Skill=Focus',
  'Magic':'Skill=Spellcasting',
  'Miracles':'Skill=Faith',
  'Psionics':'Skill=Psionics',
  'Weird Science':'Skill="Weird Science"'
};
SWADE.ATTRIBUTES = {
  'agility':'',
  'smarts':'',
  'spirit':'',
  'strength':'',
  'vigor':''
};
SWADE.ARMORS = {

  'None':
    'Era=Ancient,Medieval,Modern,Future Area=Body Armor=0 MinStr=0 Weight=0',

  'Cloth Jacket':'Era=Medieval Area=Torso,Arms Armor=1 MinStr=4 Weight=5',
  'Cloth Robes':'Era=Medieval Area=Torso,Arms,Legs Armor=1 MinStr=4 Weight=8',
  'Cloth Leggings':'Era=Medieval Area=Legs Armor=1 MinStr=4 Weight=5',
  'Cloth Cap':'Era=Medieval Area=Head Armor=1 MinStr=4 Weight=1',

  'Leather Jacket':'Era=Medieval Area=Torso,Arms Armor=2 MinStr=6 Weight=8',
  'Leather Leggings':'Era=Medieval Area=Legs Armor=2 MinStr=6 Weight=7',
  'Leather Cap':'Era=Medieval Area=Head Armor=2 MinStr=6 Weight=1',

  'Chain Shirt':'Era=Medieval Area=Torso,Arms Armor=3 MinStr=8 Weight=25',
  'Chain Leggings':'Era=Medieval Area=Legs Armor=3 MinStr=8 Weight=10',
  'Chain Hood':'Era=Medieval Area=Head Armor=3 MinStr=8 Weight=4',

  'Bronze Corselet':'Era=Ancient Area=Torso Armor=3 MinStr=8 Weight=13',
  'Bronze Vambraces':'Era=Ancient Area=Arms Armor=3 MinStr=8 Weight=5',
  'Bronze Greaves':'Era=Ancient Area=Legs Armor=3 MinStr=8 Weight=6',
  'Bronze Helmet':'Era=Ancient Area=Head Armor=3 MinStr=8 Weight=6',

  'Plate Corselet':'Era=Medieval Area=Torso Armor=4 MinStr=10 Weight=30',
  'Plate Vambraces':'Era=Medieval Area=Arms Armor=4 MinStr=10 Weight=10',
  'Plate Greaves':'Era=Medieval Area=Legs Armor=4 MinStr=10 Weight=10',
  'Plate Heavy Helm':'Era=Medieval Area=Head Armor=4 MinStr=10 Weight=8',

  'Thick Coat':'Era=Modern Area=Torso,Arms Armor=1 MinStr=4 Weight=5',
  'Leather Riding Chaps':'Era=Modern Area=Legs Armor=1 MinStr=4 Weight=5',
  'Kevlar Riding Jacket':'Era=Modern Area=Torso,Arms Armor=2 MinStr=4 Weight=8',
  'Kevlar Riding Jeans':'Era=Modern Area=Legs Armor=2 MinStr=4 Weight=4',
  'Bike Helmet':'Era=Modern Area=Head Armor=2 MinStr=4 Weight=1',
  'Motorcycle Helmet':'Era=Modern Area=Head Armor=3 MinStr=4 Weight=3',

  'Flak Jacket':'Era=Modern Area=Torso Armor=2 MinStr=6 Weight=10',
  'Kevlar Vest':'Era=Modern Area=Torso Armor=2 MinStr=6 Weight=5',
  'Kevlar Vest With Ceramic Inserts':
     'Era=Modern Area=Torso Armor=4 MinStr=8 Weight=17',
  'Kevlar Helmet':'Era=Modern Area=Head Armor=4 MinStr=4 Weight=5',
  'Bombproof Suit':
    'Era=Modern Area=Torso,Arms,Legs Armor=10 MinStr=12 Weight=80',

  'Body Armor':'Era=Future Area=Torso,Arms,Legs Armor=4 MinStr=4 Weight=4',
  'Infantry Battle Suit':
    'Era=Future Area=Torso,Arms,Legs Armor=6 MinStr=6 Weight=12',
  'Battle Helmet':'Era=Future Area=Head Armor=6 MinStr=6 Weight=2'

};
SWADE.CONCEPTS = {
  'Adventurer':'',
  'Aristocrat':
    'Edge=Aristocrat',
  'Assassin':
    'Edge=Assassin ' +
    'Attribute=Agility ' +
    'Skill=Fighting,Stealth',
  'Brute':
    'Edge=Brute ' +
    'Attribute=Strength,Vigor',
  'Commander':
    'Edge=Command ' +
    'Attribute=Smarts',
  'Gifted':
    'Edge="Arcane Background (Gifted)" ' +
    'Attribute=Spirit ' +
    'Skill=Focus',
  'Investigator':
    'Edge=Investigator ' +
    'Attribute=Smarts ' +
    'Skill=Research',
  'Linguist':
    'Edge=Linguist ' +
    'Attribute=Smarts',
  'Magician':
    'Edge="Arcane Background (Magic)" ' +
    'Attribute=Smarts ' +
    'Skill=Spellcasting',
  'Martial Artist':
    'Edge="Martial Artist" ' +
    'Skill=Fighting',
  'Miracle Worker':
    'Edge="Arcane Background (Miracles)" ' +
    'Attribute=Spirit ' +
    'Skill=Faith',
  'Psionicist':
    'Edge="Arcane Background (Psionics)" ' +
    'Attribute=Smarts ' +
    'Skill=Psionics',
  'Thief':
    'Edge=Thief ' +
    'Attribute=Agility ' +
    'Skill=Stealth,Thievery',
  'Weird Scientist':
    'Edge="Arcane Background (Weird Science)" ' +
    'Attribute=Smarts ' +
    'Skill="Weird Science"',
  'Woodsman':
    'Edge=Woodsman ' +
    'Attribute=Spirit ' +
    'Skill=Survival'
};
SWADE.DEITIES = {
  'None':''
};
SWADE.EDGES = {
  // Background
  'Alertness':'Type=Background',
  'Ambidextrous':'Type=Background Require="agility >= 8"',
  'Arcane Background (Gifted)':'Type=Background',
  'Arcane Background (Magic)':'Type=Background',
  'Arcane Background (Miracles)':'Type=Background',
  'Arcane Background (Psionics)':'Type=Background',
  'Arcane Background (Weird Science)':'Type=Background',
  'Arcane Resistance':'Type=Background Require="spirit >= 8"',
  'Improved Arcane Resistance':
    'Type=Background Require="features.Arcane Resistance"',
  'Aristocrat':'Type=Background',
  'Attractive':'Type=Background Require="vigor >= 6"',
  'Very Attractive':'Type=Background Require="features.Attractive"',
  'Berserk':'Type=Background',
  'Brave':'Type=Background Require="spirit >= 6"',
  'Brawny':'Type=Background Require="strength >= 6","vigor >= 6"',
  'Brute':'Type=Background Require="strength >= 6","vigor >= 6"',
  'Charismatic':'Type=Background Require="spirit >= 8"',
  'Elan':'Type=Background Require="spirit >= 8"',
  'Fame':'Type=Background',
  'Famous':'Type=Background Require="advances >= 4","features.Fame"',
  'Fast Healer':'Type=Background Require="vigor >= 8"',
  'Fleet-Footed':'Type=Background Require="agility >= 6"',
  'Linguist':'Type=Background Require="smarts >= 6"',
  'Luck':'Type=Background',
  'Great Luck':'Type=Background Require="features.Luck"',
  'Quick':'Type=Background Require="agility >= 8"',
  'Rich':'Type=Background',
  'Filthy Rich':'Type=Background Require="features.Rich"',
  // Combat
  'Block':'Type=Combat Require="advances >= 4","skills.Fighting >= 8"',
  'Improved Block':'Type=Combat Require="advances >= 8","features.Block"',
  'Brawler':'Type=Combat Require="strength >= 8","vigor >= 8"',
  'Bruiser':'Type=Combat Require="advances >= 4","features.Brawler"',
  'Calculating':'Type=Combat Require="smarts >= 8"',
  'Combat Reflexes':'Type=Combat Require="advances >= 4"',
  'Counterattack':'Type=Combat Require="advances >= 4","skills.Fighting >= 8"',
  'Improved Counterattack':
    'Type=Combat Require="advances >= 8","features.Counterattack"',
  'Dead Shot':
    'Type=Combat Require="skills.Athletics >= 8 || skills.Shooting >= 8"',
  'Dodge':'Type=Combat Require="advances >= 4","agility >= 8"',
  'Improved Dodge':'Type=Combat Require="advances >= 4","features.Dodge"',
  'Double Tap':'Type=Combat Require="advances >= 4","skills.Shooting >= 6"',
  'Extraction':'Type=Combat Require="agility >= 8"',
  'Improved Extraction':
    'Type=Combat Require="advances >= 4","features.Extraction"',
  'Feint':'Type=Combat Require="skills.Fighting >= 8"',
  'First Strike':'Type=Combat Require="agility >= 8"',
  'Improved First Strike':
    'Type=Combat Require="advances >= 12","features.First Strike"',
  'Free Runner':'Type=Combat Require="agility >= 8","skills.Athletics >= 6"',
  'Frenzy':'Type=Combat Require="advances >= 4","skills.Fighting >= 8"',
  'Improved Frenzy':'Type=Combat Require="advances >= 8","features.Frenzy"',
  'Giant Killer':'Type=Combat Require="advances >= 8"',
  'Hard To Kill':'Type=Combat Require="spirit >= 8"',
  'Harder To Kill':
    'Type=Combat Require="advances >= 8","features.Hard To Kill"',
  'Improvisational Fighter':'Type=Combat Require="advances >= 4","smarts >= 6"',
  'Iron Jaw':'Type=Combat Require="vigor >= 8"',
  'Killer Instinct':'Type=Combat Require="advances >= 4"',
  'Level Headed':'Type=Combat Require="advances >= 4","smarts >= 8"',
  'Improved Level Headed':
    'Type=Combat Require="advances >= 4","features.Level Headed"',
  'Marksman':
    'Type=Combat ' +
    'Require="advances >= 4","skills.Athletics >= 8 || skills.Shooting >= 8"',
  'Martial Artist':'Type=Combat Require="skills.Fighting >= 6"',
  'Martial Warrior':
    'Type=Combat Require="advances >= 4","features.Martial Artist"',
  'Mighty Blow':'Type=Combat Require="skills.Fighting >= 8"',
  'Nerves Of Steel':'Type=Combat Require="vigor >= 8"',
  'Improved Nerves Of Steel':'Type=Combat Require="features.Nerves Of Steel"',
  'No Mercy':'Type=Combat Require="advances >= 4"',
  'Rapid Fire':'Type=Combat Require="advances >= 4","skills.Shooting >= 6"',
  'Improved Rapid Fire':
    'Type=Combat Require="advances >= 8","features.Rapid Fire"',
  'Rock And Roll':'Type=Combat Require="advances >= 4","skills.Shooting >= 8"',
  'Steady Hands':'Type=Combat Require="agility >= 8"',
  'Sweep':'Type=Combat Require="strength >= 8","skills.Fighting >= 8"',
  'Improved Sweep':'Type=Combat Require="advances >= 8","features.Sweep"',
  'Trademark Weapon (%melee)':
    'Type=Combat ' +
    'Imply="weapons.%melee" ' +
    'Require="skills.Fighting >= 8"',
  'Trademark Weapon (%ranged)':
    'Type=Combat ' +
    'Imply="weapons.%ranged" ' +
    'Require="skills.Shooting >= 8"',
  'Improved Trademark Weapon (%weapon)':
    'Type=Combat ' +
    'Imply="weapons.%weapon" ' +
    'Require="advances >= 4","features.Trademark Weapon (%weapon)"',
  'Two-Fisted':'Type=Combat Require="agility >= 8"',
  'Two-Gun Kid':'Type=Combat Require="agility >= 8"',
  // Leadership
  'Command':'Type=leadership Require="smarts >= 6"',
  'Command Presence':
    'Type=leadership Require="advances >= 4","features.Command"',
  'Fervor':
    'Type=leadership Require="advances >= 8","spirit >= 8","features.Command"',
  'Hold The Line!':
    'Type=leadership Require="advances >= 4","smarts >= 8","features.Command"',
  'Inspire':'Type=leadership Require="advances >= 4","features.Command"',
  'Natural Leader':
    'Type=leadership Require="advances >= 4","spirit >= 8","features.Command"',
  'Tactician':
    'Type=leadership ' +
    'Require=' +
      '"advances >= 4",' +
      '"smarts >= 8",' +
      '"features.Command",' +
      '"skills.Battle >= 6"',
  'Master Tactician':'Type=Combat Require="advances >= 8","features.Tactician"',
  // Power
  'Artificer':'Type=Power Require="advances >= 4","powerPoints >= 1"',
  'Channeling':'Type=Power Require="advances >= 4","powerPoints >= 1"',
  'Concentration':'Type=Power Require="advances >= 4","powerPoints >= 1"',
  'Extra Effort':
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Gifted)",' +
      '"skills.Focus >= 6"',
  'Gadgeteer':
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Weird Science)",' +
      '"skills.Weird Science >= 6"',
  'Holy/Unholy Warrior':
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Miracles)",' +
      '"skills.Faith >= 6"',
  'Mentalist':
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Psionics)",' +
      '"skills.Psionics >= 6"',
  'New Powers':'Type=Power Require="powerPoints >= 1"',
  'Power Points':'Type=Power Require="powerPoints >= 1"',
  'Power Surge':'Type=Power Require="powerPoints >= 1","arcaneSkill >= 8"',
  'Rapid Recharge':
    'Type=Power Require="advances >= 4","spirit >= 6","powerPoints >= 1"',
  'Improved Rapid Recharge':
    'Type=Power Require="advances >= 8","features.Rapid Recharge"',
  'Soul Drain':
    'Type=Power ' +
    'Require="advances >= 4","powerPoints >= 1","arcaneSkill >= 10"',
  'Wizard':
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Magic)",' +
      '"skills.Spellcasting >= 6"',
  // Professional
  'Ace':'Type=Professional Require="agility >= 8"',
  'Acrobat':'Type=Professional Require="agility >= 8","skills.Athletics >= 8"',
  'Combat Acrobat':
    'Type=Professional Require="advances >= 4","features.Acrobat"',
  'Assassin':
    'Type=Professional ' +
    'Require="agility >= 8","skills.Fighting >= 6","skills.Stealth >= 8"',
  'Investigator':
    'Type=Professional Require="smarts >= 8","skills.Research >= 8"',
  'Jack-Of-All-Trades':'Type=Professional Require="smarts >= 10"',
  'McGyver':
    'Type=Professional ' +
    'Require="smarts >= 6","skills.Notice >= 8","skills.Repair >= 6"',
  'Mister Fix It':'Type=Professional Require="skills.Repair >= 8"',
  'Scholar (Academics)':'Type=Professional Require="skills.Research >= 8"',
  'Scholar (Battle)':'Type=Professional Require="skills.Research >= 8"',
  'Scholar (Occult)':'Type=Professional Require="skills.Research >= 8"',
  'Scholar (Science)':'Type=Professional Require="skills.Research >= 8"',
  'Soldier':'Type=Professional Require="strength >= 6","vigor >= 6"',
  'Thief':
    'Type=Professional ' +
    'Require="agility >= 8","skills.Stealth >= 6","skills.Thievery >= 6"',
  'Woodsman':'Type=Professional Require="spirit >= 6","skills.Survival >= 8"',
  // Social
  'Bolster':'Type=Social Require="spirit >= 8"',
  'Common Bond':'Type=Social Require="spirit >= 8"',
  'Connections':'Type=Social',
  'Humiliate':'Type=Social Require="skills.Taunt >= 8"',
  'Menacing':
    'Type=Social ' +
    'Imply=skills.Intimidation ' +
    'Require=' +
      '"features.Bloodthirsty+ || features.Mean || features.Ruthless || ' +
      'features.Ugly"',
  'Provoke':'Type=Social Require="skills.Taunt >= 6"',
  'Rabble-Rouser':'Type=Social Require="spirit >= 8"',
  'Reliable':'Type=Social Require="spirit >= 8"',
  'Retort':'Type=Social Require="skills.Taunt >= 6"',
  'Streetwise':'Type=Social Require="smarts >= 6"',
  'Strong Willed':'Type=Social Require="spirit >= 8"',
  'Iron Will':
    'Type=Social ' +
    'Require="advances >= 4","features.Brave","features.Strong Willed"',
  'Work The Room':'Type=Social Require="spirit >= 8"',
  'Work The Crowd':
    'Type=Social Require="advances >= 4","features.Work The Room"',
  // Weird
  'Beast Bond':'Type=Weird',
  'Beast Master':'Type=Weird Require="spirit >= 8"',
  'Champion':'Type=Weird Require="spirit >= 8","skills.Fighting >= 6"',
  'Chi':'Type=Weird Require="advances >= 8","features.Martial Warrior"',
  'Danger Sense':'Type=Weird',
  'Healer':'Type=Weird Imply=skills.Healing Require="spirit >= 8"',
  'Liquid Courage':'Type=Weird Require="vigor >= 8"',
  'Scavenger':'Type=Weird Require="features.Luck"',
  // Legendary
  'Followers':'Type=Legendary Require="advances >= 16"',
  'Professional (Agility)':
    'Type=Legendary Require="advances >= 16","agility >= 12"',
  'Professional (Smarts)':
    'Type=Legendary Require="advances >= 16","smarts >= 12"',
  'Professional (Spirit)':
    'Type=Legendary Require="advances >= 16","spirit >= 12"',
  'Professional (Strength)':
    'Type=Legendary Require="advances >= 16","strength >= 12"',
  'Professional (Vigor)':
    'Type=Legendary Require="advances >= 16","vigor >= 12"',
  'Professional (%skill)':
    'Type=Legendary Require="advances >= 16","skills.%skill >= 12"',
  'Expert (%trait)':
    'Type=Legendary Require="advances >= 16","features.Professional (%trait)"',
  'Master (%trait)':
    'Type=Legendary Require="advances >= 16","features.Expert (%trait)"',
  'Sidekick':'Type=Legendary Require="advances >= 16"',
  'Tough As Nails':'Type=Legendary Require="advances >= 16","vigor >= 8"',
  'Tougher Than Nails':
    'Type=Legendary ' +
    'Require="advances >= 16","features.Tough As Nails","vigor >= 12"',
  'Weapon Master':
    'Type=Legendary Require="advances >= 16","skills.Fighting >= 12"',
  'Master Of Arms':
    'Type=Legendary Require="advances >= 16","features.Weapon Master"'
};
SWADE.ERAS = {
  'Ancient':'',
  'Medieval':'',
  'Modern':'',
  'Future':''
};
SWADE.FEATURES = {

  // Edges
  'Ace':
    'Section=skill ' +
    'Note="Ignores 2 penalty points on Boating, Driving, and Piloting; may spend Benny to Soak vehicle damage"',
  'Acrobat':
    'Section=skill Note="May reroll Athletics (balance, tumble, or grapple)"',
  'Alertness':'Section=skill Note="+2 Notice"',
  'Ambidextrous':
    'Section=combat ' +
    'Note="Has no off-hand penalty/Parry bonuses from two weapons stack"',
  'Arcane Background (Gifted)':
    'Section=arcana Note="1 Powers/15 Power Points"',
  'Arcane Background (Magic)':
    'Section=arcana Note="3 Powers/10 Power Points"',
  'Arcane Background (Miracles)':
    'Section=arcana Note="3 Powers/10 Power Points"',
  'Arcane Background (Psionics)':
    'Section=arcana Note="3 Powers/10 Power Points"',
  'Arcane Background (Weird Science)':
    'Section=arcana Note="2 Powers/15 Power Points"',
  'Arcane Resistance':
    'Section=combat ' +
    'Note="Foes suffer %V arcane skill and arcane damage when targeting self"',
  'Aristocrat':
    'Section=skill ' +
    'Note="+2 Persuasion (networking with aristocrats)/+2 Common Knowledge (etiquette, heraldry, gossip)"',
  'Artificer':'Section=arcana Note="May give items arcane powers"',
  'Assassin':
    'Section=combat Note="+%V damage to Vulnerable foes and with The Drop"',
  'Attractive':
    'Section=skill ' +
    'Note="+%V Performance (attracted target)/+%V Persuasion (attracted target)"',
  'Beast Bond':'Section=feature Note="May spend Bennies on companion animals"',
  'Beast Master':
    'Section=feature ' +
    'Note="Has animal companion; other animals will not attack first"',
  'Berserk':
    'Section=combat ' +
    'Note="Injury causes +1 Strength step, wild attacks, +2 Toughness, ignore 1 Wound penalty, and random hits on critical failure for up to 10 rd (Smarts-2 neg)"',
  'Block':'Section=combat Note="+%V Parry/-%V foe Gang Up bonus"',
  'Bolster':
    'Section=combat ' +
    'Note="Successful foe Test removes Distracted or Vulnerable from ally"',
  'Brave':'Section=attribute Note="+2 Spirit vs. fear, -2 fear table roll"',
  'Brawler':'Section=combat Note="+%V Toughness/+%1 Unarmed damage step"',
  'Brawny':
    'Section=attribute,combat,description ' +
    'Note=' +
      '"+1 Strength step (encumbrance and minimum strength requirements)",' +
      '"+1 Toughness",' +
      '"+1 Size"',
  'Bruiser':'Section=combat Note="Increased Brawler effects"',
  'Brute':
    'Section=combat,skill ' +
    'Note=' +
      '"+1/+2/+4 thrown weapon range",' +
      '"Advance Athletics relative to Strength/Use Strength vs. Athletics Tests"',
  'Calculating':
    'Section=combat ' +
    'Note="Ignores 2 points of penalties on 1 action when Action Card is 5 or less"',
  'Champion':
   'Section=combat Note="Gains +2 damage on supernaturally opposed alignment"',
  'Channeling':
    'Section=arcana ' +
    'Note="Raise on arcane skill roll reduces Power Point cost by 1"',
  'Charismatic':'Section=skill Note="May reroll Persuasion"',
  'Chi':
    'Section=combat ' +
    'Note="May reroll failed attack, force foe attack reroll, or gain +d6 natural weapon damage 1/encounter"',
  'Combat Acrobat':
    'Section=combat ' +
    'Note="Foes suffer -1 attack when self aware of attack and unrestrained"',
  'Combat Reflexes':
    'Section=combat Note="+2 on Shaken and Stunned recovery rolls"',
  'Command':
    'Section=feature ' +
    'Note="R%{commandRange}\\" Commanded gain +1 to recover from Shaken or Stunned"',
  'Command Presence':'Section=feature Note="Increased Command effects"',
  'Common Bond':
    'Section=feature Note="Communication allows transfer of Bennies to allies"',
  'Concentration':'Section=arcana Note="Power duration doubled"',
  'Connections':
    'Section=feature ' +
    'Note="May call in favors from acquaintance or organization"',
  'Counterattack':
    'Section=combat Note="Free attack after failed foe attack %V/rd"',
  'Danger Sense':
    'Section=skill ' +
    'Note="+2 Notice (surprise)/Rolls Notice-2 in circumstances not normally subject to Notice"',
  'Dead Shot':
    'Section=combat ' +
    'Note="Joker Action Card gives dbl damage from first successful ranged attack"',
  'Dodge':'Section=combat Note="-2 foe ranged attacks"',
  'Double Tap':'Section=combat Note="+1 firearm attack and damage"',
  'Elan':'Section=feature Note="+2 on Benny-purchased Trait rerolls"',
  'Expert (%attribute)':
    'Section=attribute Note="Increased Professional effects"',
  'Expert (%skill)':'Section=skill Note="Increased Professional effects"',
  'Extra Effort':
    'Section=arcana ' +
    'Note="May spend 1 or 3 Power Points to gain +1 or +2 Focus"',
  'Extraction':
    'Section=combat Note="Negate attack of %V foes when withdrawing"',
  'Fame':
    'Section=feature,skill ' +
    'Note=' +
      '"%Vx fee from performing",' +
      '"+%V Persuasion (influence friendly individuals)"',
  'Famous':'Section=feature Note="Increased Fame effects"',
  'Fast Healer':
    'Section=combat Note="+2 Vigor (natural healing) and check every 3 dy"',
  'Feint':
    'Section=skill ' +
    'Note="Force foe to oppose Fighting test with Smarts instead of Agility"',
  'Fervor':
    'Section=combat ' +
    'Note="R%{commandRange}\\" Commanded gain +1 Fighting damage"',
  'Filthy Rich':'Section=feature Note="Increased Rich effects"',
  'First Strike':
    'Section=combat Note="Free attack when foe moves into reach %V/rd"',
  'Fleet-Footed':'Section=combat Note="+2 Pace/+1 Run step"',
  'Followers':'Section=feature Note="Has 5 soldier followers"',
  'Free Runner':
    'Section=combat,skill ' +
    'Note=' +
      '"Move full Pace on difficult ground",' +
      '"+2 Athletics (climbing)/+2 on foot chases"',
  'Frenzy':'Section=combat Note="Extra Fighting die on %V attacks/rd"',
  'Gadgeteer':
    'Section=arcana Note="May jury rig arcane device from available parts"',
  'Giant Killer':
    'Section=combat Note="+1d6 damage vs. foes of size %{size+3} or greater"',
  'Great Luck':'Section=feature Note="Increased Luck effects"',
  'Hard To Kill':
    'Section=combat ' +
    'Note="Ignores Wound penalties on Vigor tests to avoid bleeding out"',
  'Harder To Kill':'Section=combat Note="50% chance to cheat death"',
  'Healer':'Section=skill Note="+2 Healing"',
  'Hold The Line!':
    'Section=combat Note="R%{commandRange}\\" Commanded gain +1 Toughness"',
  'Holy/Unholy Warrior':
    'Section=arcana ' +
    'Note="May spend 1-4 Power Points to add equal amount to Soak roll"',
  'Humiliate':'Section=skill Note="May reroll Taunt"',
  'Improved Arcane Resistance':
    'Section=combat Note="Increased Arcane Resistance effects"',
  'Improved Block':'Section=combat Note="Increased Block effects"',
  'Improved Counterattack':
    'Section=combat Note="Increased Counterattack effects"',
  'Improved Dodge':'Section=combat Note="+2 evading area attacks"',
  'Improved Extraction':'Section=combat Note="Increased Extraction effects"',
  'Improved First Strike':
    'Section=combat Note="Increased First Strike effects"',
  'Improved Frenzy':'Section=combat Note="Increased Frenzy effects"',
  'Improved Level Headed':
    'Section=combat Note="Increased Level Headed effects"',
  'Improved Nerves Of Steel':
    'Section=combat Note="Increased Nerves Of Steel effects"',
  'Improved Rapid Fire':'Section=combat Note="Increased Rapid Fire effects"',
  'Improved Rapid Recharge':
    'Section=arcana Note="Increased Rapid Recharge effects"',
  'Improved Sweep':'Section=combat Note="Increased Sweep effects"',
  'Improved Trademark Weapon (%weapon)':
    'Section=combat Note="Increased Trademark Weapon effects"',
  'Improvisational Fighter':
    'Section=combat Note="No penalty w/improvised weapons"',
  'Inspire':
    'Section=skill ' +
    'Note="R%{commandRange}\\" May use Battle to Support all Extras on any Trait 1/rd"',
  'Investigator':
    'Section=skill Note="+2 Research/+2 Notice (sifting for information)"',
  'Iron Jaw':'Section=combat Note="+2 Soak rolls/+2 Vigor vs. knockout"',
  'Iron Will':'Section=combat Note="+2 to resist Powers"',
  'Jack-Of-All-Trades':
    'Section=skill ' +
    'Note="Successful Smarts roll gives d4 (Raise d6) on chosen skill"',
  'Killer Instinct':
    'Section=skill Note="May reroll self-initiated opposed Test"',
  'Level Headed':'Section=combat Note="Choose best of %V Action Cards"',
  'Linguist':
    'Section=skill ' +
    'Note="+%V Skill Points (d6 in in %{smarts//2} Language skills)"',
  'Liquid Courage':
    'Section=attribute ' +
    'Note="Drinking alcohol gives +1 Vigor step, -1 Smarts, Agility and associated skills for 1 hr"',
  'Luck':'Section=feature Note="+%V Benny each session"',
  'Marksman':
    'Section=combat ' +
    'Note="May forego move for +1 ranged attack or to ignore 2 ranged attack penalties"',
  'Martial Artist':
    'Section=combat Note="+%1 Unarmed attack/+%V Unarmed damage step"',
  'Martial Warrior':'Section=combat Note="Increased Martial Artist effects"',
  'Master Of Arms':'Section=combat Note="Increased Weapon Master effects"',
  'Master (%attribute)':
    'Section=attribute Note="Uses d10 for %attribute Wild Die"',
  'Master (%skill)':'Section=skill Note="Uses d10 for %skill Wild Die"',
  'Master Tactician':'Section=combat Note="Increased Tactician effects"',
  'McGyver':
    'Section=skill ' +
    'Note="Use Repair to create improvised weapon, explosive, or tool"',
  'Menacing':'Section=skill Note="+2 Intimidation"',
  'Mentalist':'Section=skill Note="+2 opposed Psionics"',
  'Mighty Blow':
    'Section=combat ' +
    'Note="Joker Action Card gives dbl damage on first successful melee attack"',
  'Mister Fix It':'Section=skill Note="+2 Repair/Raise cuts time by half"',
  'Natural Leader':
    'Section=feature Note="May apply leadership edges to Wild Cards"',
  'Nerves Of Steel':
    'Section=combat Note="Ignores %V points of Wound penalties"',
  'New Powers':'Section=arcana Note="+%V Power Count"',
  'No Mercy':'Section=combat Note="+2 on Benny damage reroll"',
  'Power Points':'Section=arcana Note="+%V Power Points"',
  'Power Surge':
    'Section=arcana Note="Joker Action Card restores 10 Power Points"',
  'Professional (Agility)':'Section=attribute Note="+%V Agility step"',
  'Professional (Smarts)':'Section=attribute Note="+%V Smarts step"',
  'Professional (Spirit)':'Section=attribute Note="+%V Spirit step"',
  'Professional (Strength)':'Section=attribute Note="+%V Strength step"',
  'Professional (Vigor)':'Section=attribute Note="+%V Vigor step"',
  'Professional (%skill)':'Section=skill Note="+%V %skill step"',
  'Provoke':
    'Section=skill ' +
    'Note="Raise on Taunt inflicts -2 on foe attacks on other targets; joker Action Card ends"',
  'Quick':'Section=combat Note="May redraw Action Cards lower than 6"',
  'Rabble-Rouser':
    'Section=skill Note="May Taunt or Intimidate all foes in 2\\" radius"',
  'Rapid Fire':'Section=combat Note="Increase ROF by 1 %V/rd"',
  'Rapid Recharge':'Section=arcana Note="Recovers %V Power Points/hr"',
  'Reliable':'Section=skill Note="May reroll Support"',
  'Retort':
    'Section=skill ' +
    'Note="Raise on resisting Intimidation or Taunt Test causes foe to be Distracted"',
  'Rich':'Section=feature Note="%Vx starting funds"',
  'Rock And Roll':'Section=combat Note="May trade move for ignoring recoil"',
  'Scavenger':
    'Section=combat Note="May recover knowledge or equipment 1/encounter"',
  'Scholar (Academics)':'Section=skill Note="+2 Academics"',
  'Scholar (Battle)':'Section=skill Note="+2 Battle"',
  'Scholar (Occult)':'Section=skill Note="+2 Occult"',
  'Scholar (Science)':'Section=skill Note="+2 Science"',
  'Sidekick':'Section=feature Note="Has special bond with companion"',
  'Soldier':
    'Section=attribute ' +
    'Note="+1 Strength step (encumbrance)/May reroll Vigor (environmental hazards)"',
  'Soul Drain':
    'Section=arcana Note="May suffer fatigue to recover 5 Power Points"',
  'Steady Hands':
    'Section=combat ' +
    'Note="No penalty for shot from unstable platform; reduces running shot penalty by 1"',
  'Streetwise':
    'Section=skill ' +
    'Note="+2 Intimidation (criminal network)/+2 Persuasion (criminal network)/+2 Common Knowledge (criminals)"',
  'Strong Willed':
    'Section=attribute Note="+2 Smarts (resist Tests)/+2 Spirit (resist Tests)"',
  'Sweep':'Section=combat Note="May make %1attack on all within reach"',
  'Tactician':
    'Section=combat ' +
    'Note="R%{commandRange}\\" May distribute %V Action Cards to commanded each rd"',
  'Thief':
    'Section=skill ' +
    'Note="+1 Athletics (urban climbing)/+1 Stealth (urban)/+1 Thievery"',
  'Tough As Nails':'Section=combat Note="Takes %V Wounds before incapacitated"',
  'Tougher Than Nails':'Section=combat Note="Increased Tough As Nails effects"',
  'Trademark Weapon (%melee)':
    'Section=combat Note="+%V attack and Parry with %melee"',
  'Trademark Weapon (%ranged)':
    'Section=combat Note="+%V attack and Parry with %ranged"',
  'Two-Fisted':
    'Section=combat ' +
    'Note="No multi-action penalty for melee attack with each hand"',
  'Two-Gun Kid':
    'Section=combat ' +
    'Note="No multi-action penalty for ranged attack with each hand"',
  'Very Attractive':'Section=skill Note="Increased Attractive effects"',
  'Weapon Master':
    'Section=combat Note="+%V Parry/+d%1 damage on melee attack Raise"',
  'Wizard':
    'Section=arcana Note="May spend 1 Power Point to change Power trapping"',
  'Woodsman':'Section=skill Note="+2 Survival/+2 Stealth (wilds)"',
  'Work The Crowd':'Section=skill Note="Increased Work The Room effects"',
  'Work The Room':
    'Section=skill ' +
    'Note="Roll additional Performance or Persuasion die in Support %V/rd"',

  // Hindrances
  'All Thumbs':
    'Section=skill ' +
    'Note="Suffers -2 using mechanical and electrical devices; critical failure breaks device"',
  'Anemic':
    'Section=attribute ' +
    'Note="-2 Vigor (resist disease, sickness, fatigue, and environment)"',
  'Arrogant+':'Section=combat Note="Always takes on the biggest threat"',
  'Bad Eyes':'Section=skill Note="-1 on visual Trait rolls"',
  'Bad Eyes+':'Section=skill Note="-2 on visual Trait rolls"',
  'Bad Luck+':'Section=feature Note="-1 Benny each session"',
  'Big Mouth':'Section=feature Note="Cannot keep secrets"',
  'Blind+':'Section=feature,skill Note="+1 Edge Points","-6 on visual tasks"',
  'Bloodthirsty+':
    'Section=combat Note="Treats foes cruelly; never takes prisoners"',
  "Can't Swim":
    'Section=combat,skill ' +
    'Note="Moves 1/3 Pace through water","-2 Athletics (swimming)"',
  'Cautious':'Section=feature Note="Requires detailed plan before acting"',
  'Clueless+':'Section=skill Note="-1 Common Knowledge/-1 Notice"',
  'Clumsy+':'Section=skill Note="-2 Athletics/-2 Stealth"',
  'Code Of Honor+':'Section=feature Note="Always insists on acting nobly"',
  'Curious+':
    'Section=feature Note="Insists on investigating every mystery and secret"',
  'Death Wish':'Section=feature Note="Will risk death for valued goal"',
  'Delusional':'Section=feature Note="Has harmless conspiracy belief"',
  'Delusional+':'Section=feature Note="Frequently acts on conspiracy belief"',
  'Doubting Thomas':
    'Section=feature Note="Insists on rationalizing supernatural events"',
  'Driven':'Section=feature Note="Personal goal affects decision-making"',
  'Driven+':
    'Section=feature Note="Has overwhelming need to fulfill personal goal"',
  'Elderly+':
    'Section=attribute,combat,skill ' +
    'Note="-1 Agility/-1 Strength/-1 Vigor",' +
         '"-1 Pace/-1 Run",' +
         '"+5 Skill Points (smarts skills)"',
  'Enemy':
    'Section=feature ' +
    'Note="Individual or remote group wants character eliminated"',
  'Enemy+':
    'Section=feature ' +
    'Note="Powerful individual or group wants character eliminated"',
  'Greedy':'Section=feature Note="Demands more than a fair share"',
  'Greedy+':
    'Section=feature ' +
    'Note="Violently insists on getting more than a fair share"',
  'Habit':'Section=feature Note="Has irritating but harmless compulsion"',
  'Habit+':'Section=feature Note="Has dangerous physical or mental addiction"',
  'Hard Of Hearing':'Section=skill Note="-4 Notice (hearing)"',
  'Hard Of Hearing+':
    'Section=skill Note="Deaf; automatically fails Notice (hearing)"',
  'Heroic+':'Section=feature Note="Always tries to help others"',
  'Hesitant':'Section=combat Note="Uses lowest of 2 Action Cards"',
  'Illiterate':'Section=feature Note="Cannot read or write"',
  'Impulsive+':'Section=feature Note="Always acts without thinking"',
  'Jealous':'Section=feature Note="Has focused envy about one topic or person"',
  'Jealous+':
    'Section=feature ' +
    'Note="Feels envious about others\' accomplishments and possessions"',
  'Loyal':'Section=feature Note="Always takes risks for friends"',
  'Mean':
    'Section=feature,skill ' +
    'Note="Ill-tempered and disagreeable","-1 Persuasion"',
  'Mild Mannered':'Section=skill Note="-2 Intimidation"',
  'Mute+':'Section=feature Note="Cannot speak"',
  'Obese':
    'Section=attribute,combat,description ' +
    'Note=' +
      '"-1 Strength step (worn gear)",' +
      '"-1 Pace/-1 Run step/+1 Toughness",' +
      '"+1 Size"',
  'Obligation':
    'Section=feature Note="Has regular responsibility that occupies 20 hr/wk"',
  'Obligation+':
    'Section=feature Note="Has regular responsibility that occupies 40+ hr/wk"',
  'One Arm+':'Section=skill Note="Suffers -4 on two-handed tasks"',
  'One Eye+':'Section=feature Note="Suffers -2 on visual tasks 5\\" distant"',
  'Outsider':'Section=skill Note="-2 Persuasion (other races)"',
  'Outsider+':
    'Section=feature,skill ' +
    'Note="Has no legal rights","-2 Persuasion (other races)"',
  'Overconfident+':
    'Section=feature Note="Has excessive opinion of own capabilities"',
  'Pacifist':
    'Section=combat ' +
    'Note="Will harm others only when no other option available"',
  'Pacifist+':
    'Section=combat ' +
    'Note="Will not fight living creatures, uses nonlethal methods only in defense"',
  'Phobia':
    'Section=feature ' +
    'Note="Suffers -1 on Trait rolls in presence of phobia subject"',
  'Phobia+':
    'Section=feature ' +
    'Note="Suffers -2 on Trait rolls in presence of phobia subject"',
  'Poverty':
    'Section=feature Note="Starts with half funds, loses half funds each wk"',
  'Quirk':
    'Section=feature ' +
    'Note="Has minor compulsion that occasionally causes trouble"',
  'Ruthless':'Section=combat Note="Attacks those opposing personal goal"',
  'Ruthless+':'Section=combat Note="Attacks any who impede personal goal"',
  'Secret':
    'Section=feature ' +
    'Note="Hides knowledge to protect self or others from minor trouble"',
  'Secret+':
    'Section=feature ' +
    'Note="Hides knowledge to protect self or others from major trouble"',
  'Shamed':'Section=feature Note="Past event causes self-doubt"',
  'Shamed+':'Section=feature Note="Past event causes social antagonism"',
  'Slow':'Section=combat Note="-1 Pace/-1 Run step"',
  'Slow+':'Section=combat,skill Note="-2 Pace/-1 Run step","-2 Athletics"',
  'Small':'Section=combat,description Note="-1 Toughness","-1 Size"',
  'Stubborn':'Section=feature Note="Never admits error"',
  'Suspicious':'Section=feature Note="Trusts no one"',
  'Suspicious+':'Section=feature Note="Allies suffer -2 on Support rolls"',
  'Thin Skinned':'Section=skill Note="-2 vs. Taunt"',
  'Thin Skinned+':'Section=skill Note="-4 vs. Taunt"',
  'Tongue-Tied+':
    'Section=skill ' +
    'Note="-1 Intimidation (speech)/-1 Performance (speech)/-1 Persuasion (speech)/-1 Taunt (speech)"',
  'Ugly':'Section=skill Note="-1 Persuasion"',
  'Ugly+':'Section=skill Note="-2 Persuasion"',
  'Vengeful':'Section=feature Note="Seeks revenge legally"',
  'Vengeful+':'Section=feature Note="Seeks revenge by any means"',
  'Vow':
    'Section=feature Note="Has broad restrictions on behavior and decisions"',
  'Vow+':
    'Section=feature Note="Has strict restrictions on behavior and decisions"',
  'Wanted':
    'Section=feature Note="Has trouble with distant law or minor infractions"',
  'Wanted+':
    'Section=feature Note="Has significant trouble with local law enforcement"',
  'Yellow+':
    'Section=attribute Note="-2 Spirit to resist fear and Intimidation"',
  'Young':
    'Section=attribute,feature,skill ' +
    'Note="-1 Attribute Points","+1 Benny each session","-2 Skill Points"',
  'Young+':
    'Section=attribute,feature,skill ' +
    'Note="-2 Attribute Points",' +
          '"Has Small feature/+2 Benny each session",' +
          '"-2 Skill Points"',

  // Races
  'Adaptable':'Section=feature Note="+1 Edge Points"',
  'Additional Action':
    'Section=combat Note="Ignores 2 points of Multi-Action penalties"',
  'Agile':'Section=attribute Note="+1 Agility step"',
  'Aquatic':'Section=combat,feature Note="Swim Pace %{pace}","Cannot drown"',
  'Armor +2':'Section=combat Note="+2 Armor"',
  'Big':
    'Section=feature ' +
    'Note=' +
      '"Has difficulty finding armor and clothing that fits; suffers -2 on all Trait rolls when using standard equipment"',
  'Bite':'Section=combat Note="Fangs are a natural weapon"',
  'Burrowing':
    'Section=feature Note="Can burrow into loose earth and surprise foes"',
  'Cannot Speak':'Section=feature Note="Cannot talk to other species"',
  'Claws':'Section=combat Note="Claws are a natural weapon"',
  'Construct':
    'Section=attribute,combat,feature ' +
    'Note=' +
      '"+2 Shaken recovery",' +
      '"Immune to poison and disease/Ignores one level of Wound modifiers/Requires Repair to heal",' +
      '"Does not need to breathe"',
  'Dependency':
    'Section=feature ' +
    'Note="Must spend 1 hr/dy in native environment or become fatigued"',
  "Doesn't Breathe":
    'Section=combat Note="Has immunity to inhaled toxins and suffocation"',
  'Environmental Resistance (Cold)':
    'Section=combat Note="+4 vs. cold effects/-4 damage from cold"',
  'Environmental Weakness (Cold)':
    'Section=combat Note="-4 vs. cold effects/+4 damage from cold"',
  'Flight':
    'Section=combat,skill ' +
    'Note="Fly Pace %V","Uses Athletics for flight maneuvers"',
  'Frail':'Section=combat Note="-1 Toughness"',
  'Hardy':'Section=combat Note="Does not suffer Wound from 2nd Shaken result"',
  'Heritage':
    'Section=description Note="+2 Improvement Points (Agility or edge)"',
  'Horns':'Section=combat Note="Horns are a natural weapon"',
  'Immune To Disease':'Section=combat Note="Has immunity to disease"',
  'Immune To Poison':'Section=attribute Note="Has immunity to poison"',
  'Infravision':
    'Section=combat ' +
    'Note="Half illumination penalties when attacking warm targets"',
  'Keen Senses':'Section=skill Note="+1 Notice step"',
  'Keen Senses (Saurian)':'Section=feature Note="Has Alertness feature"',
  'Leaper':
    'Section=combat,skill ' +
    'Note="+4 damage when leaping during Wild Attack","x2 Jump distance"',
  'Low Light Vision':
    'Section=feature Note="Ignores penalties for dim and dark illumination"',
  'Luck (Half-Folk)':'Section=feature Note="+1 Benny each session"',
  'No Vital Organs':
    'Section=combat Note="Takes no extra damage from Called Shot"',
  'Pace':'Section=combat Note="+1 Pace/+1 Run step"',
  'Parry':'Section=combat Note="+1 Parry"',
  'Poisonous Touch':
    'Section=combat Note="Touch causes Mild Poison effects (Vigor neg)"',
  'Poor Parry':'Section=combat Note="-1 Parry"',
  'Racial Enemy':'Section=skill Note="-2 Persuasion (racial enemy)"',
  'Reach':'Section=combat Note="+1 Reach"',
  'Reduced Pace':'Section=combat Note="-1 Pace/-1 Run step"',
  'Regeneration':'Section=attribute Note="Make natural healing roll 1/dy"',
  'Semi-Aquatic':'Section=feature Note="Can hold breath for 15 min"',
  'Size -1':'Section=combat,description Note="-1 Toughness","-1 Size"',
  'Size +1':'Section=combat,description Note="+1 Toughness","+1 Size"',
  'Sleep Reduction':'Section=feature Note="Needs only 4 hr sleep/dy"',
  'Smart':'Section=attribute Note="+1 Smarts step"',
  'Spirited':'Section=attribute Note="+1 Spirit step"',
  'Strong':'Section=attribute Note="+1 Strength step"',
  'Tail':'Section=combat Note="Tail is a natural weapon"',
  'Tough':'Section=attribute Note="+1 Vigor step"',
  'Toughness':'Section=combat Note="+1 Toughness"',
  'Wall Walker':
    'Section=combat ' +
    'Note="May move full Pace on vertical surfaces, half Pace on inverted"'

};
SWADE.GOODIES = {
  'Agility':
    'Pattern="([-+]\\d+)\\s+agi(?:lity)?(?:$|\\s+$|\\s+[^d])|agi(?:lity)?\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=agilityModifier ' +
    'Section=attribute Note="%V Agility"',
  'Agility Step':
    'Pattern="([-+]\\d)\\s+agi(?:lity)?\\s+step|agi(?:lity)?\\s+step\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=agilityStep ' +
    'Section=attribute Note="%V Agility step"',
  'Armor':
    'Pattern="([-+]\\d+)\\s+armor(?:$|\\s+$|\\s+[^d])|armor\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=armorToughness ' +
    'Section=combat Note="%V Toughness"',
  'Attribute Points':
    'Pattern="([-+]\\d+)\\s+attribute\\s+points|attribute\\s+points\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=attributePoints ' +
    'Section=attribute Note="%V Attribute Points"',
  'Cover':
    'Pattern="([-+]\\d+)\\s+cover(?:$|\\s+$|\\s+[^d])|cover\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=cover ' +
    'Section=combat Note="%V Cover"',
  'Edge Points':
    'Pattern="([-+]\\d+)\\s+edge\\s+points|edge\\s+points\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=edgePoints ' +
    'Section=feature Note="%V Edge Points"',
  'Improvement Points':
    'Pattern="([-+]\\d+)\\s+improvement\\s+points|improvement\\s+points\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=improvementPoints ' +
    'Section=description Note="%V Improvement Points"',
  'Pace':
    'Pattern="([-+]\\d+)\\s+pace(?:$|\\s+$|\\s+[^d])|pace\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=pace ' +
    'Section=combat Note="%V Pace"',
  'Parry':
    'Pattern="([-+]\\d+)\\s+parry(?:$|\\s+$|\\s+[^d])|parry\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=parry ' +
    'Section=combat Note="%V Parry"',
  'Power Count':
    'Pattern="([-+]\\d+)\\s+power\\s+count|power\\s+count\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=powerCount ' +
    'Section=arcana Note="%V Power Count"',
  'Power Points':
    'Pattern="([-+]\\d+)\\s+power\s+points|power\s+points\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=powerPoints ' +
    'Section=arcana Note="%V Power Points"',
  'Run':
    'Pattern="([-+]\\d+)\\s+run(?:$|\\s+$|\\s+[^d])|run\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=runModifier ' +
    'Section=combat Note="%V Run"',
  'Run Step':
    'Pattern="([-+]\\d)\\s+run\\s+step|run\\s+step\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=runStep ' +
    'Section=combat Note="%V Run step"',
  'Skill Points':
    'Pattern="([-+]\\d+)\\s+skill\\s+points|skill\\s+points\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=skillPoints ' +
    'Section=skill Note="%V Skill Points"',
  'Smarts':
    'Pattern="([-+]\\d+)\\s+sma(?:rts)?(?:$|\\s+$|\\s+[^d])|sma(?:rts)?\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=smartsModifier ' +
    'Section=attribute Note="%V Smarts"',
  'Smarts Step':
    'Pattern="([-+]\\d)\\s+sma(?:rts)?\\s+step|sma(?:rts)?\\s+step\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=smartsStep ' +
    'Section=attribute Note="%V Smarts step"',
  'Spirit':
    'Pattern="([-+]\\d+)\\s+spi(?:rit)?(?:$|\\s+$|\\s+[^d])|spi(?:rit)?\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=spiritModifier ' +
    'Section=attribute Note="%V Spirit"',
  'Spirit Step':
    'Pattern="([-+]\\d)\\s+spi(?:rit)?\\s+step|spi(?:rit)?\\s+step\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=spiritStep ' +
    'Section=attribute Note="%V Spirit step"',
  'Strength':
    'Pattern="([-+]\\d+)\\s+str(?:ength)?(?:$|\\s+$|\\s+[^d])|str(?:ength)?\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=strengthModifier ' +
    'Section=attribute Note="%V Strength"',
  'Strength Step':
    'Pattern="([-+]\\d)\\s+str(?:ength)?\\s+step|str(?:ength)?\\s+step\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=strengthStep ' +
    'Section=attribute Note="%V Strength step"',
  'Toughness':
    'Pattern="([-+]\\d+)\\s+toughness(?:$|\\s+$|\\s+[^d])|toughness\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=toughness ' +
    'Section=combat Note="%V Toughness"',
  'Vigor':
    'Pattern="([-+]\\d+)\\s+vig(?:or)?(?:$|\\s+$|\\s+[^d])|vig(?:or)?\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=vigorModifier ' +
    'Section=attribute Note="%V Vigor"',
  'Vigor Step':
    'Pattern="([-+]\\d)\\s+vig(?:or)?\\s+step|vig(?:or)?\\s+step\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=vigorStep ' +
    'Section=attribute Note="%V Vigor step"'
};
SWADE.HINDRANCES = {
  'All Thumbs':'Severity=Minor',
  'Anemic':'Severity=Minor',
  'Arrogant+':'Severity=Major',
  'Bad Eyes':'Require="features.Bad Eyes+ == 0" Severity=Minor',
  'Bad Eyes+':'Require="features.Bad Eyes == 0" Severity=Major',
  'Bad Luck+':'Severity=Major',
  'Big Mouth':'Severity=Minor',
  'Blind+':'Severity=Major',
  'Bloodthirsty+':'Severity=Major',
  "Can't Swim":'Severity=Minor',
  'Cautious':'Severity=Minor',
  'Clueless+':'Severity=Major',
  'Clumsy+':'Severity=Major',
  'Code Of Honor+':'Severity=Major',
  'Curious+':'Severity=Major',
  'Death Wish':'Severity=Minor',
  'Delusional':'Require="features.Delusional+ == 0" Severity=Minor',
  'Delusional+':'Require="features.Delusional == 0" Severity=Major',
  'Doubting Thomas':'Severity=Minor',
  'Driven':'Require="features.Driven+ == 0" Severity=Minor',
  'Driven+':'Require="features.Driven == 0" Severity=Major',
  'Elderly+':'Severity=Major',
  'Enemy':'Require="features.Enemy+ == 0" Severity=Minor',
  'Enemy+':'Require="features.Enemy == 0" Severity=Major',
  'Greedy':'Require="features.Greedy+ == 0" Severity=Minor',
  'Greedy+':'Require="features.Greedy == 0" Severity=Major',
  'Habit':'Require="features.Habit+ == 0" Severity=Minor',
  'Habit+':'Require="features.Habit == 0" Severity=Major',
  'Hard Of Hearing':'Require="features.Hard Of Hearing+ == 0" Severity=Minor',
  'Hard Of Hearing+':'Require="features.Hard Of Hearing == 0" Severity=Major',
  'Heroic+':'Severity=Major',
  'Hesitant':'Severity=Minor',
  'Illiterate':'Severity=Minor',
  'Impulsive+':'Severity=Major',
  'Jealous':'Require="features.Jealous+ == 0" Severity=Minor',
  'Jealous+':'Require="features.Jealous == 0" Severity=Major',
  'Loyal':'Severity=Minor',
  'Mean':'Severity=Minor',
  'Mild Mannered':'Severity=Minor',
  'Mute+':'Severity=Major',
  'Obese':'Severity=Minor',
  'Obligation':'Require="features.Obligation+ == 0" Severity=Minor',
  'Obligation+':'Require="features.Obligation == 0" Severity=Major',
  'One Arm+':'Severity=Major',
  'One Eye+':'Severity=Major',
  'Outsider':'Require="features.Outsider+ == 0" Severity=Minor',
  'Outsider+':'Require="features.Outsider == 0" Severity=Major',
  'Overconfident+':'Severity=Major',
  'Pacifist':'Require="features.Pacifist+ == 0" Severity=Minor',
  'Pacifist+':'Require="features.Pacifist == 0" Severity=Major',
  'Phobia':'Require="features.Phobia+ == 0" Severity=Minor',
  'Phobia+':'Require="features.Phobia == 0" Severity=Major',
  'Poverty':'Severity=Minor',
  'Quirk':'Severity=Minor',
  'Ruthless':'Require="features.Ruthless+ == 0" Severity=Minor',
  'Ruthless+':'Require="features.Ruthless == 0" Severity=Major',
  'Secret':'Require="features.Secret+ == 0" Severity=Minor',
  'Secret+':'Require="features.Secret == 0" Severity=Major',
  'Shamed':'Require="features.Shamed+ == 0" Severity=Minor',
  'Shamed+':'Require="features.Shamed == 0" Severity=Major',
  'Slow':'Require="features.Slow+ == 0" Severity=Minor',
  'Slow+':'Require="features.Slow == 0" Severity=Major',
  'Small':'Severity=Minor',
  'Stubborn':'Severity=Minor',
  'Suspicious':'Require="features.Suspicious+ == 0" Severity=Minor',
  'Suspicious+':'Require="features.Suspicious == 0" Severity=Major',
  'Thin Skinned':'Require="features.Thin Skinned+ == 0" Severity=Minor',
  'Thin Skinned+':'Require="features.Thin Skinned == 0" Severity=Major',
  'Tongue-Tied+':'Severity=Major',
  'Ugly':'Require="features.Ugly+ == 0" Severity=Minor',
  'Ugly+':'Require="features.Ugly == 0" Severity=Major',
  'Vengeful':'Require="features.Vengeful+ == 0" Severity=Minor',
  'Vengeful+':'Require="features.Vengeful == 0" Severity=Major',
  'Vow':'Require="features.Vow+ == 0" Severity=Minor',
  'Vow+':'Require="features.Vow == 0" Severity=Major',
  'Wanted':'Require="features.Wanted+ == 0" Severity=Minor',
  'Wanted+':'Require="features.Wanted == 0" Severity=Major',
  'Yellow+':'Severity=Major',
  'Young':'Require="features.Young+ == 0" Severity=Minor',
  'Young+':'Require="features.Young == 0" Severity=Major'
};
SWADE.POWERS = {
  'Arcane Protection':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP/additional target" ' +
    'Description=' +
      '"Foes suffer -2 (Raise -4) on arcane attacks and damage against target for 5 rd"',
  'Banish':
    'Advances=8 ' +
    'PowerPoints=3 ' +
    'Range=smarts ' +
    'Description=' +
      '"Target suffers Shaken (Raise 1 Wound; Spirit neg), returns to native plane if incapacitated"',
  'Barrier':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP Barrier inflicts 2d4 damage",' +
      '"+1 PP Barrier has +2 hardness",' +
      '"+2 PP Shapes barrier",' +
      '"+1 PP Creates 10\\"x2\\" barrier" ' +
    'Description="Creates a 5\\" long by 1\\" high wall w/hardness 10 for 5 rd"',
  'Beast Friend':
    'Advances=0 ' +
    'PowerPoints=1/Size ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP Target can use beast\'s senses" ' +
    'Description="Target can speak with and control beast actions for 10 min"',
  'Blast':
    'Advances=4 ' +
    'PowerPoints=3 ' +
    'Range=smarts*2 ' +
    'Modifier=' +
      '"+0/+1 PP 1\\"/3\\" radius",' +
      '"+2 PP Inflicts 3d6 damage (Raise 4d6)" ' +
    'Description="2\\" radius inflicts 2d6 damage (Raise 3d6)"',
  'Blind':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+2/+3 PP 2\\"/3\\" radius",' +
      '"+1 PP Vigor-2" ' +
    'Description=' +
      '"Target suffers -2 on vision tasks (Raise -4) (Vigor neg 2 points (Raise 4) each rd)"',
  'Bolt':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Range=smarts*2 ' +
    'Modifier=' +
      '"+2 PP Inflicts 3d6 damage (Raise 4d6)" ' +
    'Description="Inflicts 2d6 damage (Raise 3d6)"',
  'Boost/Lower Trait':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+1 PP Spirit-2" ' +
    'Description=' +
      '"Target gains +1 Trait step (Raise +2) for 5 rd or suffers -1 Trait step (Raise -2) (Spirit recovers 1 step (Raise all) each rd)"',
  'Burrow':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+1 PP Allows burrowing through stone" ' +
    'Description="Allows target to merge into earth and move half Pace (Raise full) for 5 rd"',
  'Burst':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=9 ' +
    'Modifier=' +
      '"+2 PP Inflicts 3d6 damage (Raise 4d6)" ' +
    'Description="Cone inflicts 2d6 damage (Raise 3d6)"',
  'Confusion':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+2/+3 PP 2\\"/3\\" radius" ' +
    'Description=' +
      '"Target suffers Distracted and Vulnerable for 1 rd (Smarts neg (Raise Smarts-2))"',
  'Damage Field':
    'Advances=4 ' +
    'PowerPoints=4 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+2 PP 2d6 damage" ' +
    'Description="Creatures adjacent to target suffer 2d4 damage for 5 rd"',
  'Darksight':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP/additional target" ' +
    'Description=' +
      '"Target ignores 4 points (Raise 6 points) of illumination penalties for 1 hr"',
  'Deflection':
    'Advances=0 ' +
    'PowerPoints=3 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP/additional target" ' +
    'Description="Foes suffer -2 attacks (Raise -4) on target for 5 rd"',
  'Detect/Conceal Arcana':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+1/+2 PP 2\\"/3\\" radius",' +
      '"+1 PP <i>Detect</i>-2" ' +
    'Description=' +
      '"Target can detect supernatural effects (Raise also type) for 5 rd or conceals target aura (<i>Detect</i> neg) for 1 hr"',
  'Disguise':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+1 PP Allows changing size by 2 steps" ' +
    'Description="Target assumes another\'s appearance (familiar Notice-2 sees through (Raise Notice-4)) for 10 min"',
  'Dispel':
    'Advances=4 ' +
    'PowerPoints=1 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP Disrupts magic item for 1 rd (Raise 2 rd)"' +
    'Description="Ends targeted power (Casting suffers -2 if backgrounds differ; opposed arcane skill neg)"',
  'Divination':
    'Advances=12 ' +
    'PowerPoints=5 ' +
    'Range=self ' +
    'Description=' +
      '"1 min contact with otherworld force grants arcane skill roll to gain information"',
  'Drain Power Points':
    'Advances=8 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Description="Drains 1d6 Power Points (Cast suffers -2 if backgrounds differ; Raise adds drained Power Points to self; Spirit neg)"',
  'Elemental Manipulation':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Range=smarts ' +
    'Description="Self performs minor elemental manipulation for 5 rd"',
  'Empathy':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Range=smarts ' +
    'Description="Self learns target emotions and surface thoughts, gaining +1 Intimidation, Persuasion, Performance, and Taunt (Raise +2; Spirit neg) for 5 rd"',
  'Entangle':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+2/+3 PP 2\\"/3\\" radius",' +
      '"+2 PP Athletics-2, Hardness 7" ' +
    'Description="Restrains target (Raise binds; Athletics or breaking Hardness 5 frees)"',
  'Environmental Protection':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP/additional target" ' +
    'Description=' +
      '"Target gains protection from hazards and -4 damage from like sources (Raise -6) for 1 hr"',
  'Farsight':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP/additional target" ' +
    'Description=' +
      '"Target sees up to 1 mile for 5 rd (Raise halves range penalties)"',
  'Fear':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+2/+3 PP 2\\"/3\\" radius" ' +
    'Description=' +
      '"Target Extra flees, Wild Card rolls on fear table (Spirit neg; Raise Spirit-2, fear table +2)"',
  'Fly':
    'Advances=8 ' +
    'PowerPoints=3 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+2 PP/additional target" ' +
    'Description="Target gains fly Pace 12 (Raise Pace 24) for 5 rd"',
  'Growth/Shrink':
    'Advances=4 ' +
    'PowerPoints=2/Size ' +
    'Range=smarts ' +
    'Description=' +
      '"Target gains or loses Toughness and Strength step (Spirit neg) for 5 rd"',
  'Havoc':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP 3\\" radius",' +
      '"+1 PP Strength-2" ' +
    'Description=' +
      '"Distracts and throws 2d6\\" creatures in 2\\" radius or 9\\" cone (Strength neg)"',
  'Healing':
    'Advances=0 ' +
    'PowerPoints=3 ' +
    'Range=touch ' +
    'Modifier=' +
      '"+10 PP Restores older Wound",' +
      '"+20 PP Heals crippling injury",' +
      '"+1 PP Neutralizes poison or disease" ' +
    'Description="Restores 1 Wound (Raise 2) suffered in past hr"',
  'Illusion':
    'Advances=0 ' +
    'PowerPoints=3 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP Illusion includes sound",' +
      '"+2 PP Smarts-2" ' +
    'Description="Creates 2\\" radius visual illusion (Smarts neg; Raise Smarts-2) for 5 rd"',
  'Intangibility':
    'Advances=12 ' +
    'PowerPoints=5 ' +
    'Range=smarts ' +
    'Description=' +
      '"Target becomes unaffected by physical world (Spirit neg) for 5 rd"',
  'Invisibility':
    'Advances=4 ' +
    'PowerPoints=5 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+3 PP/additional target" ' +
    'Description=' +
      '"Target becomes invisible; foes suffer -4 sight-based actions (Raise -6) for 5 rd"',
  'Light/Darkness':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP Attaches to object or moves effect %{arcaneSkill}\\"/rd" ' +
    'Description="Creates 3\\" radius (Raise or 5\\" beam) bright light or darkness for 10 min"',
  'Mind Link':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP/additional target" ' +
    'Description=' +
      '"Two targets may communicate up to 1 mile telepathically (Raise 5 miles) for 30 min; Wound to one shakes the other (Smarts neg)"',
  'Mind Reading':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Description="Self gains 1 truthful answer from target (Smarts neg)"',
  'Mind Wipe':
    'Advances=8 ' +
    'PowerPoints=3 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP Edits memory",' +
      '"+2 PP Activate power as an action" ' +
    'Description="Target forgets up to 30 min (Raise several hour) event (Smarts neg) after 1 min activation"',
  'Object Reading':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Range=touch ' +
    'Modifier=' +
      '"+2 PP Self sees events beginning with target creation" ' +
    'Description=' +
      '"Self sees five yr of events that occurred w/in 10 yd of target (Raise 100 yr and 20 yd)"',
  'Protection':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+1 PP +4 Armor (Raise +6)",' +
      '"+1 PP Target gains Toughness instead of Armor" ' +
    'Description="Target gains +2 Armor (Raise +4) for 5 rd"',
  'Puppet':
    'Advances=8 ' +
    'PowerPoints=3 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+2 PP/additional target" ' +
    'Description=' +
      '"Target obeys self (Raise complete control; Spirit neg) for 5 rd"',
  'Relief':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP/additional target" ' +
    'Description=' +
      '"Target recovers 1 fatigue level or Shaken (Raise 2 levels or Stunned)"',
  'Resurrection':
    'Advances=12 ' +
    'PowerPoints=30 ' +
    'Range=touch ' +
    'Modifier=' +
      '"+5 PP Raises 10 yr corpse" ' +
    'Description=' +
      '"Successful -8 casting roll returns 1 yr corpse to life with 3 Wounds and 2 fatigue (Raise 0 Wounds)"',
  'Shape Change':
    'Advances=0 ' +
    'PowerPoints=3+ ' +
    'Range=self ' +
    'Modifier=' +
      '"+1 PP Allows speech while changed" ' +
    'Description="transforms into animal form (Raise +1 Strength and Vigor) for 5 rd"',
  'Sloth/Speed':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP/additional Speed target",' +
      '"+2/+3 PP Sloth slows all in 2\\"/3\\" radius",' +
      '"+2 PP Speed reduces target multi-action penalty by 2",' +
      '"+1 PP Sloth Spirit-2" ' +
    'Description=' +
      '"Target suffers half Pace (Raise movement is an action; Spirit ends) or gains dbl Pace (Raise ignores -2 running penalty) for 5 rd"',
  'Slumber':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+2/+3 PP 2\\"/3\\" radius" ' +
    'Description="Target sleeps (Spirit neg; Raise Spirit-2) for 1 hr"',
  'Smite':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP/additional target" ' +
    'Description="Target weapon inflicts +2 damage (Raise +4) for 5 rd"',
  'Sound/Silence':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Range=smarts*5 ' +
    'Modifier=' +
      '"+1 PP May move effect %{arcaneSkill}\\"/rd",' +
      '"+0 PP Affects target (Spirit neg)",' +
      '"+1 PP/additional targets" ' +
    'Description=' +
      '"Creates sound up to shout (Smarts neg) or R%{smarts}\\" mutes 3\\" radius for 5 rd"',
  'Speak Language':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP/additional target" ' +
    'Description="Target speaks unknown language for 10 min"',
  'Stun':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+2/+3 PP 2\\"/3\\" radius" ' +
    'Description="Stuns target (Vigor neg; Raise Vigor-2)"',
  'Summon Ally':
    'Advances=0 ' +
    'PowerPoints=2+ ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP Servant can bite/claw for Str+d6 damage",' +
      '"+2 PP Servant has fly Pace 12",' +
      '"+1 PP Self can use servant\'s senses" ' +
    'Description=' +
      '"Creates obedient servant (Raise servant may take 1 Wound) for 5 rd"',
  'Telekinesis':
    'Advances=4 ' +
    'PowerPoints=5 ' +
    'Range=smarts*2 ' +
    'Description=' +
      '"Moves items remotely as Strength d10 (Raise d12; Spirit neg) for 5 rd"',
  'Teleport':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+2 PP Touch teleports foe (Spirit neg)" ' +
    'Description="Target teleports 12\\" (Raise 24\\")"',
  'Wall Walker':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP/additional target" ' +
    'Description=' +
      '"Target moves at half Pace (Raise full Pace) on vertical and inverted surfaces for 5 rd"',
  "Warrior's Gift":
    'Advances=4 ' +
    'PowerPoints=4 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP/additional target" ' +
    'Description="Target gains combat edge effects (Raise improved version) for 5 rd"',
  'Zombie':
    'Advances=8 ' +
    'PowerPoints=3+ ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+1 PP Target is armed",' +
      '"+1 PP Target has 2 Armor points",' +
      '"+1 PP Self can use target senses" ' +
    'Description=' +
      '"Animates and controls corpse for 1 hr or stores PP for permanent"'
};
SWADE.RACES = {
  'Android':
    'Features=' +
      'Construct,"Outsider+","Pacifist+","Vow+"',
  'Aquarian':
    'Features=' +
      'Aquatic,Dependency,"Low Light Vision",Toughness',
  'Avion':
    'Features=' +
      '"Can\'t Swim",Flight,Frail,"Keen Senses","Reduced Pace"',
  'Dwarf':
    'Features=' +
      '"Low Light Vision","Reduced Pace",Tough',
  'Elf':
    'Features=' +
      'Agile,"All Thumbs","Low Light Vision"',
  'Half-Elf':
    'Features=' +
      'Heritage,"Low Light Vision",Outsider',
  'Half-Folk':
    'Features=' +
      '"Luck (Half-Folk)","Reduced Pace","Size -1",Spirited',
  'Human':
    'Features=' +
      'Adaptable',
  'Rakashan':
    'Features=' +
      'Agile,Bite,Claws,Bloodthirsty+,"Can\'t Swim","Low Light Vision",' +
      '"Racial Enemy"',
  'Saurian':
    'Features=' +
      '"Armor +2",Bite,"Environmental Weakness (Cold)",' +
      '"Keen Senses (Saurian)",Outsider'
};
SWADE.LANGUAGES = {};
SWADE.SHIELDS = {
  'None':'Era=Ancient,Medieval,Modern,Future Parry=0 Cover=0 MinStr=0 Weight=0',
  'Small Shield':'Era=Ancient,Medieval Parry=1 Cover=0 MinStr=4 Weight=4',
  'Medium Shield':'Era=Ancient,Medieval Parry=2 Cover=2 MinStr=6 Weight=8',
  'Large Shield':'Era=Ancient,Medieval Parry=3 Cover=4 MinStr=8 Weight=12',
  'Riot Shield':'Era=Modern Parry=3 Cover=4 MinStr=4 Weight=5',
  'Ballistic Shield':'Era=Modern Parry=3 Cover=4 MinStr=6 Weight=9',
  'Small Polymer Shield':'Era=Future Parry=1 Cover=0 MinStr=4 Weight=2',
  'Medium Polymer Shield':'Era=Future Parry=2 Cover=2 MinStr=4 Weight=4',
  'Large Polymer Shield':'Era=Future Parry=3 Cover=4 MinStr=6 Weight=6'
};
SWADE.SKILLS = {
  'Academics':'Attribute=Smarts',
  'Athletics':'Attribute=Agility Core=Y',
  'Battle':'Attribute=Smarts',
  'Boating':'Attribute=Agility',
  'Common Knowledge':'Attribute=Smarts Core=Y',
  'Driving':'Attribute=Agility Era=Modern,Future',
  'Electronics':'Attribute=Smarts Era=Modern,Future',
  'Faith':'Attribute=Spirit',
  'Fighting':'Attribute=Agility',
  'Focus':'Attribute=Spirit',
  'Gambling':'Attribute=Smarts',
  'Hacking':'Attribute=Smarts Era=Modern,Future',
  'Healing':'Attribute=Smarts',
  'Intimidation':'Attribute=Spirit',
  'Notice':'Attribute=Smarts Core=Y',
  'Occult':'Attribute=Smarts',
  'Performance':'Attribute=Spirit',
  'Persuasion':'Attribute=Spirit Core=Y',
  'Piloting':'Attribute=Agility Era=Modern,Future',
  'Psionics':'Attribute=Smarts',
  'Repair':'Attribute=Smarts',
  'Research':'Attribute=Smarts',
  'Riding':'Attribute=Agility',
  'Science':'Attribute=Smarts',
  'Shooting':'Attribute=Agility',
  'Spellcasting':'Attribute=Smarts',
  'Stealth':'Attribute=Agility Core=Y',
  'Survival':'Attribute=Smarts',
  'Taunt':'Attribute=Smarts',
  'Thievery':'Attribute=Agility',
  'Weird Science':'Attribute=Smarts'
};
SWADE.WEAPONS = {

  'Unarmed':
    'Era=Ancient,Medieval,Modern,Future ' +
    'Damage=Str+d0 MinStr=0 Weight=0 Category=Unarmed',
  'Hand Axe':
    'Era=Ancient,Medieval Damage=Str+d6 MinStr=6 Weight=2 Category=One-Handed',
  'Battle Axe':
    'Era=Medieval Damage=Str+d8 MinStr=8 Weight=4 Category=One-Handed AP=2',
  'Great Axe':
    'Era=Medieval Damage=Str+d10 MinStr=10 Weight=7 Category=Two-Handed ' +
    'Parry=-1 AP=2',
  'Light Club':
    'Era=Ancient,Medieval Damage=Str+d4 MinStr=4 Weight=2 Category=One-Handed',
  'Heavy Club':
    'Era=Ancient,Medieval Damage=Str+d6 MinStr=6 Weight=5 Category=One-Handed',
  'Dagger':
    'Era=Ancient,Medieval,Modern ' +
    'Damage=Str+d4 MinStr=4 Weight=1 Category=One-Handed Range=3',
  'Knife':
    'Era=Ancient,Medieval,Modern ' +
    'Damage=Str+d4 MinStr=4 Weight=1 Category=One-Handed Range=3',
  'Flail':'Era=Medieval Damage=Str+d6 MinStr=6 Weight=3 Category=One-Handed',
  'Halberd':'Era=Medieval Damage=Str+d8 MinStr=8 Weight=6 Category=Two-Handed',
  'Javelin':
    'Era=Ancient,Medieval Damage=Str+d6 MinStr=6 Weight=3 Category=Ranged ' +
    'Range=3',
  'Katana':'Era=Medieval Damage=Str+d6+1 MinStr=8 Weight=3 Category=Two-Handed',
  'Lance':
    'Era=Medieval Damage=Str+d8 MinStr=8 Weight=6 Category=One-Handed AP=2',
  'Mace':'Era=Medieval Damage=Str+d6 MinStr=6 Weight=4 Category=One-Handed',
  'Maul':'Era=Medieval Damage=Str+d10 MinStr=10 Weight=10 Category=Two-Handed',
  'Pike':'Era=Medieval Damage=Str+d8 MinStr=8 Weight=18 Category=Two-Handed',
  'Rapier':
    'Era=Medieval Damage=Str+d4 MinStr=4 Weight=2 Category=One-Handed Parry=1',
  'Spear':
    'Era=Ancient,Medieval ' +
    'Damage=Str+d6 MinStr=6 Weight=3 Category=Two-Handed Range=3 Parry=1',
  'Staff':
    'Era=Ancient,Medieval Damage=Str+d4 MinStr=4 Weight=4 ' +
    'Category=Two-Handed Parry=1',
  'Great Sword':
    'Era=Medieval Damage=Str+d10 MinStr=10 Weight=6 Category=Two-Handed',
  'Long Sword':
    'Era=Medieval Damage=Str+d8 MinStr=8 Weight=3 Category=One-Handed',
  'Short Sword':
    'Era=Ancient,Medieval Damage=Str+d6 MinStr=6 Weight=2 Category=One-Handed',
  'Warhammer':
    'Era=Medieval Damage=Str+d6 MinStr=6 Weight=2 Category=One-Handed AP=1',
  'Bangstick':'Era=Modern Damage=3d6 MinStr=6 Weight=2 Category=One-Handed',
  'Bayonet':
    'Era=Modern Damage=Str+d4 MinStr=4 Weight=1 Category=One-Handed Parry=1',
  'Billy Club':
    'Era=Modern Damage=Str+d4 MinStr=4 Weight=1 Category=One-Handed',
  'Baton':'Era=Modern Damage=Str+d4 MinStr=4 Weight=1 Category=One-Handed',
  'Brass Knuckles':
    'Era=Modern Damage=Str+d4 MinStr=4 Weight=1 Category=One-Handed',
  'Chainsaw':'Era=Modern Damage=2d6+4 MinStr=6 Weight=20 Category=One-Handed',
  'Switchblade':
    'Era=Modern Damage=Str+d4 MinStr=4 Weight=1 Category=One-Handed',
  'Survival Knife':
    'Era=Modern Damage=Str+d4 MinStr=4 Weight=1 Category=One-Handed',
  'Molecular Knife':
    'Era=Future Damage=Str+d4+2 MinStr=4 Weight=1 Category=One-Handed AP=2',
  'Molecular Sword':
    'Era=Future Damage=Str+d8+2 MinStr=6 Weight=2 Category=One-Handed AP=4',
  'Laser Sword':
    'Era=Future Damage=Str+d6+8 MinStr=4 Weight=2 Category=One-Handed AP=12',

  'Throwing Axe':
    'Era=Ancient,Medieval Damage=Str+d6 MinStr=6 Weight=3 Category=Ranged ' +
    'Range=3',
  'Bow':
    'Era=Ancient,Medieval Damage=2d6 MinStr=6 Weight=3 Category=Ranged ' +
    'Range=12',
  'Hand Drawn Crossbow':
    'Era=Medieval Damage=2d6 MinStr=6 Weight=5 Category=Ranged AP=2 Range=10',
  'Heavy Crossbow':
    'Era=Medieval Damage=2d8 MinStr=6 Weight=8 Category=Ranged AP=2 Range=10',
  'Long Bow':
    'Era=Medieval Damage=2d6 MinStr=8 Weight=3 Category=Ranged AP=1 Range=15',
  'Net':
    'Era=Ancient,Medieval Damage=None MinStr=4 Weight=8 Category=Ranged ' +
    'Range=3',
  'Sling':
    'Era=Ancient,Medieval Damage=Str+d4 MinStr=4 Weight=1 Category=Ranged ' +
    'Range=4',
  'Compound Bow':
    'Era=Modern Damage=Str+d6 MinStr=6 Weight=3 Category=Ranged AP=1 Range=12',
  'Crossbow':
    'Era=Modern Damage=2d6 MinStr=6 Weight=7 Category=Ranged AP=2 Range=15',

  'Flintlock Pistol':
    'Era=Medieval Damage=2d6+1 MinStr=4 Weight=3 Category=Ranged Range=5',
  'Brown Bess':
    'Era=Medieval Damage=2d8 MinStr=6 Weight=15 Category=Ranged Range=10',
  'Blunderbuss':
    'Era=Medieval Damage=3d6 MinStr=6 Weight=12 Category=Ranged Range=10',
  'Kentucky Rifle':
    'Era=Medieval Damage=2d8 MinStr=6 Weight=8 Category=Ranged AP=2 Range=15',
  'Springfield Model 1861':
    'Era=Medieval Damage=2d8 MinStr=6 Weight=11 Category=Ranged Range=15',

  'Derringer':'Era=Modern Damage=2d4 MinStr=4 Weight=1 Category=Ranged Range=3',
  'Police Revolver':
    'Era=Modern Damage=2d6 MinStr=4 Weight=2 Category=Ranged Range=10',
  'Colt Peacemaker':
    'Era=Modern Damage=2d6+1 MinStr=4 Weight=4 Category=Ranged AP=1 Range=12',
  'Smith & Wesson':
    'Era=Modern Damage=2d6+1 MinStr=4 Weight=5 Category=Ranged AP=1 Range=12',
  'Colt 1911':
    'Era=Modern Damage=2d6+1 MinStr=4 Weight=4 Category=Ranged AP=1 Range=12',
  'Desert Eagle':
    'Era=Modern Damage=2d8 MinStr=6 Weight=8 Category=Ranged AP=2 Range=15',
  'Glock':
    'Era=Modern Damage=2d6 MinStr=4 Weight=3 Category=Ranged AP=1 Range=12',
  'Ruger':'Era=Modern Damage=2d4 MinStr=4 Weight=2 Category=Ranged Range=10',

  'H&K MP5':
    'Era=Modern Damage=2d6 MinStr=6 Weight=10 Category=Ranged AP=1 Range=12 ' +
    'ROF=3',
  'Tommy Gun':
    'Era=Modern Damage=2d6+1 MinStr=6 Weight=13 Category=Ranged AP=1 ' +
    'Range=12 ROF=3',
  'Uzi':
    'Era=Modern Damage=2d6 MinStr=4 Weight=9 Category=Ranged AP=1 Range=12 ' +
    'ROF=3',

  'Double-Barrel Shotgun':
    'Era=Modern Damage=3d6 MinStr=6 Weight=11 Category=Ranged Range=12',
  'Pump Action Shotgun':
    'Era=Modern Damage=3d6 MinStr=4 Weight=8 Category=Ranged Range=12',
  'Sawed-Off Shotgun':
    'Era=Modern Damage=3d6 MinStr=4 Weight=6 Category=Ranged Range=5',
  'Streetsweeper':
    'Era=Modern Damage=3d6 MinStr=6 Weight=10 Category=Ranged Range=12',

  'Barrett Rifle':
    'Era=Modern Damage=2d10 MinStr=8 Weight=35 Category=Ranged AP=4 Range=50',
  'M1 Garand':
    'Era=Modern Damage=2d8 MinStr=6 Weight=10 Category=Ranged AP=2 Range=24',
  'Hunting Rifle':
    'Era=Modern Damage=2d8 MinStr=6 Weight=8 Category=Ranged AP=2 Range=24',
  'Sharps Big 50':
    'Era=Modern Damage=2d10 MinStr=8 Weight=11 Category=Ranged AP=2 Range=30',
  'Spencer Carbine':
    'Era=Modern Damage=2d8 MinStr=4 Weight=8 Category=Ranged AP=2 Range=20',
  "Winchester '73":
    'Era=Modern Damage=2d8 MinStr=6 Weight=10 Category=Ranged AP=2 Range=24',
  'AK47':
    'Era=Modern Damage=2d8+1 MinStr=6 Weight=10 Category=Ranged AP=2 ' +
    'Range=24 ROF=3',
  'M-16':
    'Era=Modern Damage=2d8 MinStr=6 Weight=8 Category=Ranged AP=2 Range=24 ' +
    'ROF=3',
  'Steyr AUG':
    'Era=Modern Damage=2d8 MinStr=6 Weight=8 Category=Ranged AP=2 Range=24 ' +
    'ROF=3',

  'Browning Automatic Rifle':
    'Era=Modern Damage=2d8 MinStr=8 Weight=17 Category=Ranged AP=2 Range=20 ' +
    'ROF=3',
  'Gatling':
    'Era=Modern Damage=2d8 MinStr=0 Weight=170 Category=Ranged AP=2 Range=24 ' +
    'ROF=3',
  'Minigun':
    'Era=Modern Damage=2d8+1 MinStr=10 Weight=85 Category=Ranged AP=2 ' +
    'Range=30 ROF=5',
  'M2 Browning':
    'Era=Modern Damage=2d10 MinStr=0 Weight=84 Category=Ranged AP=4 Range=50 ' +
    'ROF=3',
  'M60':
    'Era=Modern Damage=2d8+1 MinStr=8 Weight=33 Category=Ranged AP=2 ' +
    'Range=30 ROF=3',
  'MG42':
    'Era=Modern Damage=2d8+1 MinStr=10 Weight=26 Category=Ranged AP=2 ' +
    'Range=30 ROF=4',
  'SAW':
    'Era=Modern Damage=2d8 MinStr=8 Weight=20 Category=Ranged AP=2 Range=30 ' +
    'ROF=4',

  'Laser Pistol':
    'Era=Future Damage=2d6 MinStr=4 Weight=2 Category=Ranged AP=2 Range=15',
  'Laser SMG':
    'Era=Future Damage=2d6 MinStr=4 Weight=4 Category=Ranged AP=2 Range=15 ' +
    'ROF=4',
  'Laser Rifle':
    'Era=Future Damage=3d6 MinStr=6 Weight=8 Category=Ranged AP=2 Range=30 ' +
    'ROF=3',
  'Gatling Laser':
    'Era=Future Damage=3d6+4 MinStr=8 Weight=20 Category=Ranged AP=2 ' +
    'Range=50 ROF=4'
 
};

/* Defines rules related to powers. */
SWADE.arcaneRules = function(rules, arcanas, powers) {
  QuilvynUtils.checkAttrTable(arcanas, ['Skill', 'Powers']);
  QuilvynUtils.checkAttrTable
    (powers, ['Advances', 'PowerPoints', 'Range', 'Description', 'School', 'Modifier']);
  for(let arcana in arcanas) {
    rules.choiceRules(rules, 'Arcana', arcana, arcanas[arcana]);
  }
  for(let power in powers) {
    rules.choiceRules(rules, 'Power', power, powers[power]);
  }
  rules.defineChoice('notes', 'commonPowerModifiers:<b>+1/+2/+3 PP</b> Armor Piercing; <b>+2 PP</b> Fatigue; <b>+1 PP</b> Glow/Shroud; <b>+2 PP</b> Heavy Weapon; <b>+1 PP</b> Hinder/Hurry; <b>+2 PP</b> Lingering Damage; <b>+1/+2 PP</b> Dbl/Tpl Range; <b>+1 PP</b> Selective');
  rules.defineRule('commonPowerModifiers', 'powerPoints', '=', '1');
};

/* Defines the rules related to character attributes and description. */
SWADE.attributeRules = function(rules) {

  for(let a in SWADE.ATTRIBUTES) {
    rules.defineRule(a + 'Step',
      '', '=', '1',
      a + 'Allocation', '+', null
    );
    rules.defineRule(a,
      a + 'Step', '=', 'Math.max(Math.min(2 + source * 2, 12), 4)'
    );
    rules.defineRule
      (a + 'Modifier', a + 'Step', '=', 'source>5 ? source - 5 : 0');
    rules.defineChoice('notes', a + ':d%V%1');
    rules.defineRule(a + '.1',
      a + 'Modifier', '=', 'source==0 ? "" : QuilvynUtils.signed(source)'
    );
    rules.defineChoice
      ('attributes', a.charAt(0).toUpperCase() + a.substring(1));
    rules.defineChoice('traits', a.charAt(0).toUpperCase() + a.substring(1));
  }
  rules.defineChoice('notes',
    'attributeNotes.armorAgilityPenalty:-%V Agility (d%{armorMinStr} required)'
  );
  rules.defineRule('advances', '', '^=', '0');
  rules.defineRule
    ('agilityModifier', 'attributeNotes.armorAgilityPenalty', '+=', '-source');
  rules.defineRule('attributeNotes.armorAgilityPenalty',
    'armorStrengthStepShortfall', '=', 'source > 0 ? source : null'
  );
  rules.defineRule('improvementPoints', 'advances', '=', 'source * 2');
  // Define inch marker for use with spell descriptions and feature texts
  rules.defineRule('in', 'advances', '=' ,'\'"\'');
  rules.defineRule('attributePoints',
    '', '=', '5',
    'improvementPointsAllocation.Attribute', '+', 'Math.floor(source / 2)'
  );
  rules.defineRule('rank',
    'advances', '=', 'source<4 ? "Novice" : source<8 ? "Seasoned" : source<12 ? "Veteran" : source<16 ? "Heroic" : "Legendary"'
  );
  rules.defineRule('size',
    '', '=', '0',
    'race', '^', '-1'
  );
  QuilvynRules.validAllocationRules
    (rules, 'attribute', 'attributePoints', 'Sum "^(agility|smarts|spirit|strength|vigor)Allocation$"');
  QuilvynRules.validAllocationRules
    (rules, 'improvement', 'improvementPoints', 'Sum "^improvementPointsAllocation.(Attribute|Edge|Skill|Hindrance)$"');

};

/* Defines the rules related to combat. */
SWADE.combatRules = function(rules, armors, shields, weapons) {

  QuilvynUtils.checkAttrTable
    (armors, ['Era', 'Area', 'Armor', 'MinStr', 'Weight']);
  QuilvynUtils.checkAttrTable
    (shields, ['Era', 'Parry', 'Cover', 'MinStr', 'Weight']);
  QuilvynUtils.checkAttrTable
    (weapons, ['Era', 'Damage', 'MinStr', 'Weight', 'Category', 'Range', 'AP', 'ROF', 'Parry']);

  for(let armor in armors) {
    rules.choiceRules(rules, 'Armor', armor, armors[armor]);
  }
  for(let shield in shields) {
    rules.choiceRules(rules, 'Shield', shield, shields[shield]);
  }
  for(let weapon in weapons) {
    let pattern = weapon.replace(/  */g, '\\s+');
    rules.choiceRules(rules, 'Goody', weapon,
      // To avoid triggering additional weapons with a common suffix (e.g.,
      // "* compound bow +2" also makes regular bow +2), require that weapon
      // goodies with a trailing value have no preceding word or be enclosed in
      // parentheses.
      'Pattern="([-+]\\d)\\s+' + pattern + '|(?:^\\W*|\\()' + pattern + '\\s+([-+]\\d)" ' +
      'Effect=add ' +
      'Attribute="attackAdjustment.' + weapon + '","damageAdjustment.' + weapon + '" ' +
      'Value="$1 || $2" ' +
      'Section=combat Note="%V attack and damage"'
    );
    rules.choiceRules(rules, 'Weapon', weapon, weapons[weapon]);
  }

  rules.defineChoice('notes',
    'combatNotes.armorPacePenalty:-%V Pace (d%{armorMinStr} minimum required)',
    'combatNotes.fightingParryModifier:+%V Parry'
  );
  rules.defineRule('armorStrengthStepShortfall',
    'armorMinStr', '=', 'source / 2 - 1',
    'strengthStep', '+', '-source',
    '', '^', '0'
  );
  rules.defineRule('combatNotes.armorPacePenalty',
    'armorStrengthStepShortfall', '=', 'source > 0 ? source : null'
  );
  rules.defineRule('combatNotes.fightingParryModifier',
    'skills.Fighting', '=', 'Math.floor(source / 2)',
    'skillModifier.Fighting', '+', 'Math.floor(source / 2)'
  );
  rules.defineRule
    ('combatNotes.vigorToughnessModifier', 'vigor', '=', 'source / 2');
  rules.defineRule('cover', 'shieldCover', '=', null);
  rules.defineRule('pace',
    '', '=', '6',
    'combatNotes.armorPacePenalty', '+', '-source'
  );
  rules.defineRule('parry',
    '', '=', '2',
    'shieldParry', '+', null,
    'combatNotes.fightingParryModifier', '+', null
  );
  rules.defineRule
    ('run', 'runStep', '=', 'Math.max(Math.min(2 + source * 2, 12), 4)');
  rules.defineRule
    ('runModifier', 'runStep', '=', 'source>5 ? "+" + (source - 5) : ""');
  rules.defineRule('runStep', '', '=', '2');
  rules.defineRule('toughness',
    '', '=', '2',
    'armorToughness', '+', null,
    'combatNotes.vigorToughnessModifier', '+', null
  );
  rules.defineRule('weaponStrength', 'strength', '=', null);
  rules.defineRule('weapons.Unarmed', '', '=', '1');

  SWADE.weaponRules(
    rules, 'Bite', ['Ancient', 'Medieval', 'Modern', 'Future'], 'Str+d4', 0, 0,
    'Un', null, null, null, null
  );
  SWADE.weaponRules(
    rules, 'Claws', ['Ancient', 'Medieval', 'Modern', 'Future'], 'Str+d4', 0, 0,
    'Un', null, null, null, null
  );
  SWADE.weaponRules(
    rules, 'Horns', ['Ancient', 'Medieval', 'Modern', 'Future'], 'Str+d4', 0, 0,
    'Un', null, null, null, null
  );
  SWADE.weaponRules(
    rules, 'Tail', ['Ancient', 'Medieval', 'Modern', 'Future'], 'Str+d4', 0, 0,
    'Un', null, null, null, null
  );
  rules.defineRule('weapons.Bite', 'combatNotes.bite', '=', null);
  rules.defineRule('weapons.Claws', 'combatNotes.claws', '=', null);
  rules.defineRule('weapons.Horns', 'combatNotes.horns', '=', null);
  rules.defineRule('weapons.Tail', 'combatNotes.tail', '=', null);
  // Add defense for Stat Block character sheet format
  for(let a in armors) {
    if(a != 'None')
      rules.defineRule('defense.' + a, 'armor.' + a, '=', null);
  }
  for(let s in shields) {
    if(s != 'None')
      rules.defineRule('defense.' + s + ' Shield',
        'shield', '=', 'source == "' + s + '" ? 1 : null'
      );
  }

};

/* Defines rules related to basic character identity. */
SWADE.identityRules = function(rules, races, eras, concepts, deitys) {

  QuilvynUtils.checkAttrTable(concepts, ['Attribute', 'Edge', 'Skill']);
  QuilvynUtils.checkAttrTable(deitys, ['Alignment', 'Domain']);
  QuilvynUtils.checkAttrTable(eras, []);
  QuilvynUtils.checkAttrTable(races, ['Requires', 'Features', 'Languages']);

  for(let concept in concepts) {
    rules.choiceRules(rules, 'Concept', concept, concepts[concept]);
  }
  for(let deity in deitys) {
    rules.choiceRules(rules, 'Deity', deity, deitys[deity]);
  }
  for(let era in eras) {
    rules.choiceRules(rules, 'Era', era, eras[era]);
  }
  for(let race in races) {
    rules.choiceRules(rules, 'Race', race, races[race]);
  }

};

/* Defines rules related to character aptitudes. */
SWADE.talentRules = function(
  rules, edges, features, goodies, hindrances, languages, skills
) {

  let c;
  let matchInfo;

  QuilvynUtils.checkAttrTable(edges, ['Require', 'Imply', 'Type']);
  QuilvynUtils.checkAttrTable(features, ['Section', 'Note']);
  QuilvynUtils.checkAttrTable
    (goodies, ['Pattern', 'Effect', 'Value', 'Attribute', 'Section', 'Note']);
  QuilvynUtils.checkAttrTable(hindrances, ['Require', 'Severity']);
  QuilvynUtils.checkAttrTable(languages, []);
  QuilvynUtils.checkAttrTable(skills, ['Era', 'Attribute', 'Core']);

  for(let goody in goodies) {
    rules.choiceRules(rules, 'Goody', goody, goodies[goody]);
  }
  for(let hindrance in hindrances) {
    rules.choiceRules(rules, 'Hindrance', hindrance, hindrances[hindrance]);
  }
  for(let language in languages) {
    rules.choiceRules(rules, 'Language', language, languages[language]);
  }
  for(let skill in skills) {
    if((matchInfo = skill.match(/(%(\w+))/)) != null) {
      for(c in rules.getChoices(matchInfo[2] + 's')) {
        rules.choiceRules
          (rules, 'Skill', skill.replace(matchInfo[1], c), skills[skill].replaceAll(matchInfo[1], c));
      }
    } else {
      rules.choiceRules(rules, 'Skill', skill, skills[skill]);
      rules.choiceRules(rules, 'Goody', skill,
        'Pattern="([-+]\\d).*\\s+' + skill + '\\s+Skill|' + skill + '\\s+skill\\s+([-+]\\d)"' +
        'Effect=add ' +
        'Value="$1 || $2" ' +
        'Attribute="skills.' + skill + '" ' +
        'Section=skill Note="%V ' + skill + '"'
      );
      rules.defineChoice('traits', skill);
    }
  }
  for(let edge in edges) {
    if((matchInfo = edge.match(/(%(\w+))/)) != null) {
      for(c in rules.getChoices(matchInfo[2] + 's')) {
        rules.choiceRules
          (rules, 'Edge', edge.replace(matchInfo[1], c), edges[edge].replaceAll(matchInfo[1], c));
      }
    } else {
      rules.choiceRules(rules, 'Edge', edge, edges[edge]);
    }
  }
  for(let feature in features) {
    if((matchInfo = feature.match(/(%(\w+))/)) != null) {
      for(c in rules.getChoices(matchInfo[2] + 's')) {
        rules.choiceRules
          (rules, 'Feature', feature.replace(matchInfo[1], c), features[feature].replaceAll(matchInfo[1], c));
      }
    } else {
      rules.choiceRules(rules, 'Feature', feature, features[feature]);
    }
  }

  rules.defineChoice('notes',
    'skillNotes.armorAgilityPenalty:-%V Agility-linked skills (d%{armorMinStr} required)'
  );
  rules.defineRule('edgePoints',
    '', '=', '0',
    'improvementPointsAllocation.Edge', '+', 'Math.floor(source / 2)'
  );
  rules.defineRule('hindrancePoints', '', 'v', '4');
  rules.defineRule('improvementPoints', 'hindrancePoints', '+=', null);
  rules.defineRule('skillPoints',
    '', '=', '12',
    'improvementPointsAllocation.Skill', '+', 'source'
  );
  rules.defineRule('skillNotes.armorAgilityPenalty',
    'armorStrengthStepShortfall', '=', 'source > 0 ? source : null'
  );
  QuilvynRules.validAllocationRules
    (rules, 'edge', 'edgePoints', 'Sum "^edges\\."');
  QuilvynRules.validAllocationRules
    (rules, 'skill', 'skillPoints', 'Sum "^skillAllocation\\."');

};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
SWADE.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Arcana')
    SWADE.arcanaRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValueArray(attrs, 'Powers')
    );
  else if(type == 'Armor')
    SWADE.armorRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Era'),
      QuilvynUtils.getAttrValueArray(attrs, 'Area'),
      QuilvynUtils.getAttrValue(attrs, 'Armor'),
      QuilvynUtils.getAttrValue(attrs, 'MinStr'),
      QuilvynUtils.getAttrValue(attrs, 'Weight')
    );
  else if(type == 'Concept')
    SWADE.conceptRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Edge'),
      QuilvynUtils.getAttrValueArray(attrs, 'Skill')
    );
  else if(type == 'Deity')
    SWADE.deityRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Alignment'),
      QuilvynUtils.getAttrValueArray(attrs, 'Domain')
    );
  else if(type == 'Edge') {
    SWADE.edgeRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValueArray(attrs, 'Type')
    );
    SWADE.edgeRulesExtra(rules, name);
  } else if(type == 'Era')
    SWADE.eraRules(rules, name);
  else if(type == 'Feature')
    SWADE.featureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Goody')
    SWADE.goodyRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Pattern'),
      QuilvynUtils.getAttrValue(attrs, 'Effect'),
      QuilvynUtils.getAttrValue(attrs, 'Value'),
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Hindrance') {
    SWADE.hindranceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'Severity')
    );
    SWADE.hindranceRulesExtra(rules, name);
  } else if(type == 'Language')
    SWADE.languageRules(rules, name);
  else if(type == 'Power')
    SWADE.powerRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Advances'),
      QuilvynUtils.getAttrValue(attrs, 'PowerPoints'),
      QuilvynUtils.getAttrValue(attrs, 'Range'),
      QuilvynUtils.getAttrValue(attrs, 'Description'),
      QuilvynUtils.getAttrValue(attrs, 'School'),
      QuilvynUtils.getAttrValueArray(attrs, 'Modifier')
    );
  else if(type == 'Race') {
    SWADE.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages')
    );
    SWADE.raceRulesExtra(rules, name);
  } else if(type == 'Shield')
    SWADE.shieldRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Era'),
      QuilvynUtils.getAttrValue(attrs, 'Parry'),
      QuilvynUtils.getAttrValue(attrs, 'Cover'),
      QuilvynUtils.getAttrValue(attrs, 'MinStr'),
      QuilvynUtils.getAttrValue(attrs, 'Weight')
    );
  else if(type == 'Skill')
    SWADE.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Attribute'),
      QuilvynUtils.getAttrValue(attrs, 'Core'),
      QuilvynUtils.getAttrValueArray(attrs, 'Era')
    );
  else if(type == 'Weapon')
    SWADE.weaponRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Era'),
      QuilvynUtils.getAttrValue(attrs, 'Damage'),
      QuilvynUtils.getAttrValue(attrs, 'MinStr'),
      QuilvynUtils.getAttrValue(attrs, 'Weight'),
      QuilvynUtils.getAttrValue(attrs, 'Category'),
      QuilvynUtils.getAttrValue(attrs, 'AP'),
      QuilvynUtils.getAttrValue(attrs, 'Range'),
      QuilvynUtils.getAttrValue(attrs, 'ROF'),
      QuilvynUtils.getAttrValue(attrs, 'Parry')
    );
  else {
    console.log('Unknown choice type "' + type + '"');
    return;
  }
  if(type != 'Feature') {
    type =
      type.charAt(0).toLowerCase() + type.substring(1).replaceAll(' ', '') + 's';
    rules.addChoice(type, name, attrs);
  }
};

/*
 * Defines in #rules# the rules associated with arcane power source #name#,
 * which draws on skill #skill# when casting and allows access to the list of
 * powers #powers#.
 */
SWADE.arcanaRules = function(rules, name, skill, powers) {
  let compactName = name.replaceAll(' ', '');
  // Define arcaneSkill for use in power effects
  rules.defineRule('arcaneSkill', 'arcaneSkill' + compactName, '^=', null);
  rules.defineRule('arcaneSkill' + compactName,
    'features.Arcane Background (' + name + ')', '?', null,
    'skills.' + skill, '=', null
  );
  // No checking of powers list here, but randomizeOneAttribute restricts
  // selected powers to those in the list.
};

/*
 * Defines in #rules# the rules associated with armor #name#, found during era
 * #eras#, which covers the body areas listed in #areas#, adds #armor# to the
 * character's Toughness, requires a strength of #minStr# to use effectively,
 * and weighs #weight#.
 */
SWADE.armorRules = function(rules, name, eras, areas, armor, minStr, weight) {

  if(!name) {
    console.log('Empty armor name');
    return;
  }
  if(!Array.isArray(eras)) {
    console.log('Bad eras "' + eras + '" for armor ' + name);
    return;
  }
  if(!Array.isArray(areas)) {
    console.log('Bad areas "' + areas + '" for armor ' + name);
    return;
  }
  if(typeof armor != 'number') {
    console.log('Bad armor "' + armor + '" for armor ' + name);
    return;
  }
  if(typeof minStr != 'number') {
    console.log('Bad min str "' + minStr + '" for armor ' + name);
    return;
  }
  if(typeof weight != 'number') {
    console.log('Bad weight "' + weight + '" for armor ' + name);
    return;
  }

  if(areas.includes('Torso') || areas.includes('Body'))
    rules.defineRule('armorToughness', 'armor.' + name, '+=', armor);
  rules.defineRule('armorMinStr', 'armor.' + name, '^=', minStr);
  rules.defineRule('armorWeight', 'armor.' + name, '+=', weight);

};

/*
 * Defines in #rules# the rules associated with concept #name#. #attributes#,
 * #edges#, and #skills# list the names of attributes, edges, and skills
 * associated with the concept.
 */
SWADE.conceptRules = function(rules, name, attributes, edges, skills) {
  if(!name) {
    console.log('Empty concept name');
    return;
  }
  if(!Array.isArray(attributes)) {
    console.log('Bad attributes "' + attributes + '" for concept ' + name);
    return;
  }
  if(!Array.isArray(edges)) {
    console.log('Bad edges "' + edges + '" for concept ' + name);
    return;
  }
  if(!Array.isArray(skills)) {
    console.log('Bad skills "' + edges + '" for concept ' + name);
    return;
  }
  let i, ith;
  for(i = 0; i < attributes.length; i++) {
    ith = attributes[i];
    if(!rules.getChoices('attributes') ||
       !(ith in rules.getChoices('attributes'))) {
      console.log('Bad attribute "' + ith + '" for concept ' + name);
      return;
    }
  }
  for(i = 0; i < edges.length; i++) {
    ith = edges[i];
    if(!rules.getChoices('edges') || !(ith in rules.getChoices('edges'))) {
      console.log('Bad edge "' + ith + '" for concept ' + name);
      return;
    }
  }
  for(i = 0; i < skills.length; i++) {
    ith = skills[i];
    if(!rules.getChoices('skills') || !(ith in rules.getChoices('skills'))) {
      console.log('Bad skill "' + ith + '" for concept ' + name);
      return;
    }
  }
  // No rules pertain to concept
};

/*
 * Defines in #rules# the rules associated with deity #name#. The optional
 * #alignment# gives the deity's alignment, and #domains# lists any domains
 * connected to the deity.
 */
SWADE.deityRules = function(rules, name, alignment, domains) {
  if(!name) {
    console.log('Empty deity name');
    return;
  }
  // No rules pertain to deity
};

/*
 * Defines in #rules# the rules associated with edge #name#. #require# and
 * #implies# list any hard and soft prerequisites for the edge, and #types#
 * lists the categories of the edge.
 */
SWADE.edgeRules = function(rules, name, requires, implies, types) {

  if(!name) {
    console.log('Empty edge name');
    return;
  }
  if(!Array.isArray(requires)) {
    console.log('Bad requires list "' + requires + '" for edge ' + name);
    return;
  }
  if(!Array.isArray(implies)) {
    console.log('Bad implies list "' + implies + '" for edge ' + name);
    return;
  }
  if(!Array.isArray(types)) {
    console.log('Bad types list "' + types + '" for edge ' + name);
    return;
  }

  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');

  if(requires.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'validation', prefix + 'Edge', 'edges.' + name, requires);
  if(implies.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'sanity', prefix + 'Edge', 'edges.' + name, implies);
  rules.defineRule('features.' + name, 'edges.' + name, '=', null);
  for(let i = 0; i < types.length; i++) {
    rules.defineRule(types[i] + 'EdgeCount', 'features.' + name, '+=', '1');
  }

};

/*
 * Defines in #rules# the rules associated with edge #name# that cannot be
 * derived directly from the attributes passed to edgeRules.
 */
SWADE.edgeRulesExtra = function(rules, name) {
  let matchInfo;
  let note;
  if(name == 'Arcane Resistance') {
    rules.defineRule('combatNotes.arcaneResistance',
      '', '=', '-2',
      'combatNotes.improvedArcaneResistance', '+', '-2'
    );
  } else if(name == 'Assassin') {
    rules.defineRule('combatNotes.assassin', '', '=', '2');
  } else if(name == 'Attractive') {
    rules.defineRule('skillNotes.attractive',
      '', '=', '1',
      'skillNotes.veryAttractive', '+', '1'
    );
  } else if(name == 'Block') {
    rules.defineRule('combatNotes.block',
      '', '=', '1',
      'combatNotes.improvedBlock', '+', '1'
    );
  } else if(name == 'Brawler') {
    rules.defineRule('combatNotes.brawler',
      '', '=', '1',
      'combatNotes.bruiser', '+', '1'
    );
    rules.defineRule('combatNotes.brawler.1',
      'features.Brawler', '=', '1',
      'combatNotes.bruiser', '+', '1'
    );
    rules.defineRule('damageStep.Unarmed', 'combatNotes.brawler.1', '+=', null);
  } else if(name == 'Brawny') {
    rules.defineRule
      ('armorStrengthStepShortfall', 'attributeNotes.brawny', '+', '-1');
  } else if(name == 'Brute') {
    rules.defineRule('bruteAthleticsStepModifier',
      'skillNotes.brute', '?', null,
      'strengthStep', '=', null,
      'agilityStep', '+', '-source',
      '', '^', '0'
    );
    rules.defineRule('skillStepPastAttribute.Athletics',
      'bruteAthleticsStepModifier', '+', '-source'
    );
  } else if(name == 'Command') {
    rules.defineRule('commandRange',
      'features.Command', '=', '5',
      'featureNotes.commandPresence', '+', '5'
    );
  } else if(name == 'Counterattack') {
    rules.defineRule('combatNotes.counterattack',
      '', '=', '1',
      'combatNotes.improvedCounterattack', '+', '2'
    );
  } else if(name == 'Extraction') {
    rules.defineRule('combatNotes.extraction',
      '', '=', '1',
      'combatNotes.improvedExtraction', '+', '2'
    );
  } else if(name == 'Fame') {
    rules.defineRule('featureNotes.fame',
      '', '=', '2',
      'featureNotes.famous', '+', '3'
    );
    rules.defineRule('skillNotes.fame',
      '', '=', '1',
      'featureNotes.famous', '+', '1'
    );
  } else if(name == 'First Strike') {
    rules.defineRule('combatNotes.firstStrike',
      '', '=', '1',
      'combatNotes.improvedFirstStrike', '+', '2'
    );
  } else if(name == 'Frenzy') {
    rules.defineRule('combatNotes.frenzy',
      '', '=', '1',
      'combatNotes.improvedFrenzy', '+', '1'
    );
  } else if(name == 'Level Headed') {
    rules.defineRule('combatNotes.levelHeaded',
      '', '=', '2',
      'combatNotes.improvedLevelHeaded', '+', '1'
    );
  } else if(name == 'Linguist') {
    rules.defineRule
      ('skillNotes.linguist', 'smarts', '=', 'Math.floor(source/2) * 2');
    rules.defineRule('skillPoints', 'skillNotes.linguist', '+', null);
  } else if(name == 'Luck') {
    rules.defineRule('featureNotes.luck',
      '', '=', '1',
      'featureNotes.greatLuck', '+', '1'
    );
  } else if(name == 'Martial Artist') {
    rules.defineRule('combatNotes.martialArtist',
      '', '=', '1',
      'combatNotes.martialWarrior', '+', '1'
    );
    rules.defineRule('combatNotes.martialArtist.1',
      'features.Martial Artist', '=', '1',
      'combatNotes.martialWarrior', '+', '1'
    );
    rules.defineRule
      ('attackAdjustment.Unarmed', 'combatNotes.martialArtist.1', '+', null);
    rules.defineRule
      ('damageStep.Unarmed', 'combatNotes.martialArtist', '+=', null);
  } else if(name == 'Nerves Of Steel') {
    rules.defineRule('combatNotes.nervesOfSteel',
      '', '=', '1',
      'combatNotes.improvedNervesOfSteel', '+', '1'
    );
  } else if(name == 'New Powers') {
    rules.defineRule
      ('arcanaNotes.newPowers', 'edges.New Powers', '=', 'source * 2');
  } else if(name == 'Power Points') {
    rules.defineRule
      ('arcanaNotes.powerPoints', 'edges.Power Points', '=', 'source * 5');
  } else if((matchInfo = name.match(/^Professional \(([\w\s]*)\)$/)) != null) {
    let focus = matchInfo[1];
    note = (focus.toLowerCase() in SWADE.ATTRIBUTES ? 'attribute' : 'skill') +
           'Notes.professional(' + matchInfo[1].replaceAll(' ', '') + ')';
    rules.defineRule(note,
      '', '=', '1',
      note.replace('professional', 'expert'), '+', '1'
    );
  } else if(name == 'Rapid Fire') {
    rules.defineRule('combatNotes.rapidFire',
      '', '=', '1',
      'combatNotes.improvedRapidFire', '+', '1'
    );
  } else if(name == 'Rapid Recharge') {
    rules.defineRule('arcanaNotes.rapidRecharge',
      '', '=', '10',
      'arcanaNotes.improvedRapidRecharge', '+', '10'
    );
  } else if(name == 'Rich') {
    rules.defineRule('featureNotes.rich',
      '', '=', '3',
      'featureNotes.filthyRich', '^', '5'
    );
  } else if(name == 'Soldier') {
    rules.defineRule
      ('armorStrengthStepShortfall', 'attributeNotes.soldier', '+', '-1');
    rules.defineRule('weaponStrength', 'attributeNotes.soldier', '+', '2');
  } else if(name == 'Sweep') {
    rules.defineRule('combatNotes.sweep.1',
      'features.Sweep', '=', '"-2 "',
      'combatNotes.improvedSweep', '=', '""'
    );
  } else if(name == 'Tactician') {
    rules.defineRule('combatNotes.tactician',
      '', '=', '1',
      'combatNotes.masterTactician', '+', '1'
    );
  } else if(name == 'Tough As Nails') {
    rules.defineRule('combatNotes.toughAsNails',
      '', '=', '4',
      'combatNotes.tougherThanNails', '+', '1'
    );
  } else if((matchInfo = name.match(/^Trademark Weapon \((.*)\)$/)) != null) {
    let weapon = matchInfo[1];
    note = 'combatNotes.trademarkWeapon(' + weapon.replaceAll(' ', '') + ')';
    rules.defineRule(note,
      '', '=', '1',
      note.replace('trademark', 'improvedTrademark'), '+', '1'
    );
    rules.defineRule('attackAdjustment.' + weapon, note, '+', null);
  } else if(name == 'Weapon Master') {
    rules.defineRule('combatNotes.weaponMaster',
      '', '=', '1',
      'combatNotes.masterOfArms', '+', '1'
    );
    rules.defineRule('combatNotes.weaponMaster.1',
      '', '=', '8',
      'combatNotes.masterOfArms', '=', '10'
    );
  } else if(name == 'Work The Room') {
    rules.defineRule('skillNotes.workTheRoom',
      '', '=', '1',
      'skillNotes.workTheCrowd', '+', '1'
    );
  }
};

/* Defines in #rules# the rules associated with era #name#. */
SWADE.eraRules = function(rules, name) {
  if(!name) {
    console.log('Empty era name');
    return;
  }
  // No rules pertain to era
};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
SWADE.featureRules = function(rules, name, sections, notes) {

  if(!name) {
    console.log('Empty feature name');
    return;
  }
  if(!Array.isArray(sections) || sections.length == 0) {
    console.log('Bad sections list "' + sections + '" for feature ' + name);
    return;
  }
  if(!Array.isArray(notes)) {
    console.log('Bad notes list "' + notes + '" for feature ' + name);
    return;
  }
  if(sections.length != notes.length) {
    console.log(sections.length + ' sections, ' + notes.length + ' notes for feature ' + name);
    return;
  }

  // Test for QR.wVCS (v2.4 feature) for backward compatibility
  if(QuilvynRules.wrapVarsContainingSpace)
    notes = notes.map(x => QuilvynRules.wrapVarsContainingSpace(x));

  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');

  for(let i = 0; i < sections.length; i++) {

    let section = sections[i];
    let effects = notes[i];
    let matchInfo;
    let maxSubnote =
      effects.includes('%1') ? effects.match(/%\d/g).sort().pop().replace('%') - 0 : 0;
    let note = section + 'Notes.' + prefix;
    let priorInSection = sections.slice(0, i).filter(x => x == section).length;
    if(priorInSection > 0)
      note += '-' + priorInSection;

    rules.defineChoice('notes', note + ':' + effects);
    rules.defineRule
      (note, 'features.' + name, effects.indexOf('%V') >= 0 ? '?' : '=', null);

    let pieces = effects.split('/');

    for(let j = 0; j < pieces.length; j++) {

      matchInfo = pieces[j].match(/^(\d+)\s+powers?$/i);
      if(matchInfo)
        rules.defineRule('powerCount', note, '+=', matchInfo[1]);
      matchInfo = pieces[j].match(/^(\d+)\s+power\s+points?$/i);
      if(matchInfo)
        rules.defineRule('powerPoints', note, '+=', matchInfo[1]);

      matchInfo = pieces[j].match(/^([-+x](\d+(\.\d+)?|%[V1-9]))\s+(.*)$/);
      if(!matchInfo)
        continue;

      let adjust = matchInfo[1];
      let adjusted = matchInfo[4]=='Armor' ? 'Armor Toughness' : matchInfo[4];

      // Support +%{expr} by evaling expr for each id it contains
      if(adjust.match(/%{/)) {
        let expression = adjust.substring(3, adjust.length - 1);
        let sn = ++maxSubnote;
        rules.defineRule(note + '.' + sn, 'features.' + name, '?', null);
        new Expr(expression).identifiers().forEach(id => {
          if(expression.trim() == id)
            rules.defineRule(note + '.' + sn, id, '=', null);
          else
            rules.defineRule(note + '.' + sn, id,
              '=', 'new Expr("' + expression + '").eval(dict)'
            );
        });
        adjust = '%' + sn;
      }

      let adjuster =
        adjust.match(/%\d/) ? note + '.' + adjust.replace(/.*%/, '') : note;
      let op = adjust.startsWith('x') ? '*' : '+';
      if(op == '*')
        adjust = adjust.substring(1);

      if(section == 'skill' && adjusted != 'Skill Points' && adjusted != 'Charisma' &&
         adjusted.match(/^[A-Z][a-z]*(\s[A-Z][a-z]*)*(\s\([A-Z][a-z]*(\s[A-Z][a-z]*)*\))?$/)) {
        adjusted = 'skillModifier.' + adjusted;
      } else if(adjusted == 'Run' ||
                adjusted.toLowerCase() in SWADE.ATTRIBUTES) {
        adjusted = adjusted.toLowerCase() + 'Modifier';
      } else if(adjusted.match(/^[A-Z]\w+ step$/)) {
        adjusted = adjusted.replace(' step', '');
        if(section == 'attribute' || adjusted == 'Run')
          adjusted = adjusted.toLowerCase() + 'Step';
        else if(sections == 'skill')
          adjusted = 'skillStep.' + adjusted;
        else
          adjusted = adjusted.charAt(0).toLowerCase() + adjusted.substring(1);
      } else if(adjusted.match(/^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/)) {
        adjusted = adjusted.charAt(0).toLowerCase() + adjusted.substring(1).replaceAll(' ', '');
      } else {
        continue;
      }
      rules.defineRule(adjusted,
        adjuster, op, !adjust.includes('%') ? adjust : adjust.startsWith('-') ? '-source' : 'source'
      );

    }

  }

};

/*
 * Defines in #rules# the rules associated with goody #name#, triggered by
 * a starred line in the character notes that matches #pattern#. #effect#
 * specifies the effect of the goody on each attribute in list #attributes#.
 * This is one of "increment" (adds #value# to the attribute), "set" (replaces
 * the value of the attribute by #value#), "lower" (decreases the value to
 * #value#), or "raise" (increases the value to #value#). #value#, if null,
 * defaults to 1; occurrences of $1, $2, ... in #value# reference capture
 * groups in #pattern#. #sections# and #notes# list the note sections
 * ("attribute", "combat", "companion", "feature", "power", or "skill")
 * and formats that show the effects of the goody on the character sheet.
 */
SWADE.goodyRules = function(
  rules, name, pattern, effect, value, attributes, sections, notes
) {
  QuilvynRules.goodyRules
    (rules, name, pattern, effect, value, attributes, sections, notes);
};

/*
 * Defines in #rules# the rules associated with hindrance #name#, which has
 * the list of hard prerequisites #requires# and level #severity# (Major or
 * Minor).
 */
SWADE.hindranceRules = function(rules, name, requires, severity) {
  if(!name) {
    console.log('Empty hindrance name');
    return;
  }
  if(!Array.isArray(requires)) {
    console.log('Bad requires "' + requires + '" for hindrance ' + name);
    return;
  }
  if(!(severity + '').match(/major|minor/i)) {
    console.log('Bad severity "' + severity + '" for hindrance ' + name);
    return;
  }
  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  if(requires.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'validation', prefix+'Hindrance', 'hindrances.'+name, requires);
  rules.defineRule('features.' + name, 'hindrances.' + name, '=', null);
  rules.defineRule('hindrancePoints',
    'hindrances.' + name, '+=', severity.match(/major/i) ? '2' : '1'
  );
};

/*
 * Defines in #rules# the rules associated with hindrance #name# that cannot be
 * derived directly from the attributes passed to hindranceRules.
 */
SWADE.hindranceRulesExtra = function(rules, name) {
  if(name == 'Elderly+') {
    rules.defineRule('skillPoints', 'skillNotes.elderly+', '+', '5');
  } else if(name == 'Obese') {
    rules.defineRule
      ('armorStrengthStepShortfall', 'attributeNotes.obese', '+', '1');
  } else if(name == 'Small') {
    rules.defineRule('descriptionNotes.small', 'features.Size -1', 'v', '0');
  } else if(name == 'Young+') {
    rules.defineRule('features.Small', 'featureNotes.young+', '=', '1');
  }
};

/* Defines in #rules# the rules associated with language #name#. */
SWADE.languageRules = function(rules, name) {
  if(!name) {
    console.log('Empty language name');
    return;
  }
  SWADE.skillRules(rules, 'Language (' + name + ')', 'smarts', false, []);
};

/*
 * Defines in #rules# the rules associated with power #name#, which may be
 * acquired only after #advances# advances, requires #powerPoints# Power Points
 * to use, and can be cast at range #range#. #description# is a concise
 * description of the power's effects and #school#, if defined, is the magic
 * school that defines the power, and #modifiers# lists the power point cost
 * and effects of any power-specific modifiers.
 */
SWADE.powerRules = function(
  rules, name, advances, powerPoints, range, description, school, modifiers
) {
  if(!name) {
    console.log('Empty power name');
    return;
  }
  if(typeof advances != 'number') {
    console.log('Bad advances "' + advances + '" for power ' + name);
  }
  if(!powerPoints) {
    console.log('Bad powerPoints "' + powerPoints + '" for power ' + name);
  }
  if(!description) {
    console.log('Empty description for power ' + name);
  }
  // TODO Default value for modifiers for backward-compatibility
  if(modifiers == null)
    modifiers = [];
  if(!Array.isArray(modifiers)) {
    console.log('Bad modifiers "' + modifiers + '" for power ' + name);
  }
  if(!range)
    range = '';
  else if((range+'').match(/^\d+$/))
    range = 'R' + range + '" ';
  else if(range.match(/\b(agility|smarts|spirit|strength|vigor)\b/))
    range = 'R%{' + range + '}" ';
  else if(range.match(/^(self|sight|special|touch)$/i))
    range = 'R' + range.charAt(0).toUpperCase() + range.substring(1).toLowerCase() + ' ';
  else
    range = 'R' + range + ' ';
  // NOTE: Not presently including advances in power description
  // NOTE: Test for QR.wVCS (v2.4 feature) for backward compatibility
  if(QuilvynRules.wrapVarsContainingSpace)
    description = QuilvynRules.wrapVarsContainingSpace(description);
  let powerAttrs = powerPoints + ' PP';
  if(school)
    powerAttrs += ' ' + school.substring(0, 4);
  if(modifiers.length > 0)
    description += ' (' + modifiers.map(x => x.replace(/(\+?\d+(\/\+?\d+)* PP)/, '<b>$1</b>')).join('; ') + ')';
  rules.defineChoice
    ('notes', 'powers.' + name + ':(' + powerAttrs + ') ' + range + description);
};

/*
 * Defines in #rules# the rules associated with race #name#, which has the list
 * of hard prerequisites #requires#. #features# lists associated features and
 * #languages# any automatic languages.
 */
SWADE.raceRules = function(rules, name, requires, features, languages) {

  if(!name) {
    console.log('Empty race name');
    return;
  }
  if(!Array.isArray(requires)) {
    console.log('Bad requires list "' + requires + '" for race ' + name);
    return;
  }
  if(!Array.isArray(features)) {
    console.log('Bad features list "' + features + '" for race ' + name);
    return;
  }
  if(!Array.isArray(languages)) {
    console.log('Bad languages list "' + languages + '" for race ' + name);
    return;
  }

  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  let raceAdvances = prefix + 'Advances';

  rules.defineRule(raceAdvances,
    'race', '?', 'source == "' + name + '"',
    'advances', '=', null
  );

  if(requires.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'validation', prefix + 'Race', raceAdvances, requires);

  SWADE.featureListRules(rules, features, name, raceAdvances, false);
  rules.defineSheetElement(name + ' Features', 'Hindrances+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');

  if(languages.length > 0) {
    for(let i = 0; i < languages.length; i++) {
      if(languages[i] != 'any')
        rules.defineRule
          ('skillStep.Language ('+languages[i]+')', raceAdvances, '+=', '3');
    }
  }

};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
SWADE.raceRulesExtra = function(rules, name) {
  if(name == 'Avion') {
    rules.defineRule('combatNotes.flight', 'avionAdvances', '=', '12');
  } if(name == 'Half-Elf') {
    rules.defineRule
      ('improvementPoints', 'descriptionNotes.heritage', '+', '2');
  } else if(name == 'Saurian') {
    rules.defineRule
      ('features.Alertness', 'featureNotes.keenSenses(Saurian)', '=', '1');
  }
};

/*
 * Defines in #rules# the rules associated with shield #name#, found during
 * eras #eras#, which adds #parry# to the character's Parry, provides #cover#
 * cover, requires #minStr# to handle, and weighs #weight#.
 */
SWADE.shieldRules = function(rules, name, eras, parry, cover, minStr, weight) {

  if(!name) {
    console.log('Empty shield name');
    return;
  }
  if(!Array.isArray(eras)) {
    console.log('Bad eras "' + eras + '" for shield ' + name);
    return;
  }
  if(typeof parry != 'number') {
    console.log('Bad parry "' + parry + '" for shield ' + name);
    return;
  }
  if(typeof cover != 'number') {
    console.log('Bad cover "' + cover + '" for shield ' + name);
    return;
  }
  if(typeof minStr != 'number') {
    console.log('Bad minStr "' + minStr + '" for shield ' + name);
    return;
  }
  if(typeof weight != 'number') {
    console.log('Bad weight "' + weight + '" for shield ' + name);
    return;
  }

  if(rules.shieldStats == null) {
    rules.shieldStats = {
      parry:{},
      cover:{},
      minStr:{},
      weight:{}
    };
  }
  rules.shieldStats.parry[name] = parry;
  rules.shieldStats.cover[name] = cover;
  rules.shieldStats.minStr[name] = minStr;
  rules.shieldStats.weight[name] = weight;

  rules.defineRule(
    'armorMinStr', 'shield', '^=', QuilvynUtils.dictLit(rules.shieldStats.minStr) + '[source]'
  );
  rules.defineRule('shieldCover',
    'shield', '=', QuilvynUtils.dictLit(rules.shieldStats.cover) + '[source]'
  );
  rules.defineRule('shieldParry',
    'shield', '=', QuilvynUtils.dictLit(rules.shieldStats.parry) + '[source]'
  );

};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * #attribute# (one of 'agility', 'spirit', etc.). #core# indicates whether or
 * not the character automatically gets a d4 in the skill. If specified, the
 * skill is available only in the eras listed in #eras#.
 */
SWADE.skillRules = function(rules, name, attribute, core, eras) {

  if(!name) {
    console.log('Empty skill name');
    return;
  }
  if(attribute) {
    attribute = attribute.toLowerCase();
    if(!(attribute in SWADE.ATTRIBUTES)) {
      console.log('Bad attribute "' + attribute + '" for skill ' + name);
      return;
    }
  }
  if(!Array.isArray(eras)) {
    console.log('Bad eras "' + eras + '" for skill ' + name);
  }

  if(core && core != 'n' && core != 'N') {
    rules.defineRule('skillStep.' + name, '', '=', '1');
    rules.defineRule('skillStepPastAttribute.' + name, '', '=', '1');
  }
  rules.defineRule('skillStepPastAttribute.' + name,
    'skillAllocation.' + name, '+=', null,
    attribute + 'Step', '+', '-source'
  );
  rules.defineRule('skillStep.' + name,
    'skillAllocation.' + name, '+=', null,
    'skillStepPastAttribute.' + name, '+', 'source>0 ? -Math.ceil(source / 2) : null'
  );
  rules.defineRule('skills.' + name,
    'skillStep.' + name, '=', 'Math.max(Math.min(2 + source * 2, 12), 4)'
  );
  rules.defineRule('skillModifier.' + name,
    'skillStep.' + name, '=', 'source<1 ? source-2 : source>5 ? source-5 : 0'
  );
  if(attribute == 'agility') {
    rules.defineRule('skillModifier.' + name,
      'skillNotes.armorAgilityPenalty', '+', 'source > 0 ? -source : null'
    );
  }
  rules.defineChoice
    ('notes', 'skills.' + name + ':(' + attribute.substring(0, 3) + ') d%V%1');
  rules.defineRule('skills.' + name + '.1',
    'skillModifier.' + name, '=', 'source==0 ? "" : QuilvynUtils.signed(source)'
  );

};

/*
 * Defines in #rules# the rules associated with weapon #name#, found during
 * eras #eras#, which belongs to category #category#, requires #minStr# to use
 * effectively, and weighs #weight#. The weapon does #damage# HP on a
 * successful attack. If specified, the weapon bypasses #armorPiercing# points
 * of armor. Also if specified, the weapon can be used as a ranged weapon with
 * a range increment of #range# feet, firing #rateOfFire# per round. Parry, if
 * specified, indicates the parry bonus from wielding the weapon.
 */
SWADE.weaponRules = function(
  rules, name, eras, damage, minStr, weight, category, armorPiercing, range,
  rateOfFire, parry
) {

  if(!name) {
    console.log('Empty weapon name');
    return;
  }
  if(!Array.isArray(eras)) {
    console.log('Bad eras "' + eras + '" for weapon ' + name);
    return;
  }
  let matchInfo = (damage + '').match(/^((Str\+)?((\d*)d\d+)([\-+]\d+)?)$/i);
  if(!matchInfo && damage != 'None') {
    console.log('Bad damage "' + damage + '" for weapon ' + name);
    return;
  }
  if(typeof minStr != 'number') {
    console.log('Bad minStr "' + minStr + '" for weapon ' + name);
  }
  if(typeof weight != 'number') {
    console.log('Bad minStr "' + minStr + '" for weapon ' + name);
  }
  if(!(category + '').match(/^(1h|2h|R|Un|one-handed|two-handed|ranged|unarmed)$/i)) {
    console.log('Bad category "' + category + '" for weapon ' + name);
    return;
  }
  if(armorPiercing && typeof armorPiercing != 'number') {
    console.log('Bad AP "' + armorPiercing + '" for weapon ' + name);
  }
  if(range && typeof range != 'number') {
    console.log('Bad range "' + range + '" for weapon ' + name);
  }
  if(rateOfFire && typeof rateOfFire != 'number') {
    console.log('Bad ROF "' + rateOfFire + '" for weapon ' + name);
  }
  if(parry && typeof parry != 'number') {
    console.log('Bad parry "' + parry + '" for weapon ' + name);
  }

  let isRanged = category.match(/^(r|ranged)$/i);

  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  let weaponName = 'weapons.' + name;
  let format =
    '%V (%1%2%3%4%5' + (range ? ' R%6"' : '') +
    (armorPiercing ? ' AP ' + armorPiercing : '') + ')';
  let strDamage = damage.startsWith('Str+');
  if(strDamage)
    damage = damage.substring(4);

  rules.defineChoice('notes',
    weaponName + ':' + format,
    isRanged ?
      ('combatNotes.' + prefix + 'StrengthPenalty:-%V attack') :
      ('combatNotes.' + prefix + 'StrengthPenalty:Lowers damage to d%V')
  );
  rules.defineRule('attackAdjustment.' + name, weaponName, '=', '0');
  if(isRanged)
    rules.defineRule('attackAdjustment.' + name,
      'combatNotes.' + prefix + 'StrengthPenalty', '+', '-source'
    );
  rules.defineRule('combatNotes.' + prefix + 'StrengthPenalty',
    weaponName, '?', null,
    'weaponStrength', '=', 'source >= ' + minStr + ' ? null : ' +
      (isRanged ? '(' + minStr / 2 + ' - source / 2)' : 'source')
  );
  rules.defineRule('damageAdjustment.' + name, weaponName, '=', '0');
  rules.defineRule(weaponName + '.1',
    weaponName, '=', '""',
    'attackAdjustment.' + name, '=', 'source!=0 ? QuilvynUtils.signed(source) + " " : ""'
  );
  rules.defineRule(weaponName + '.2',
    weaponName, '?', null,
    '', '=', '""'
  );
  rules.defineRule(weaponName + '.3',
    weaponName, '?', null,
    '', '=', '""'
  );
  if(strDamage) {
    rules.defineRule(weaponName + '.2', 'strength', '=', '"d" + source');
    rules.defineRule(weaponName + '.3',
      'strengthModifier', '=', 'source!=0 ? QuilvynUtils.signed(source) + "+" : "+"'
    );
  } 
  rules.defineRule(weaponName + '.4',
    weaponName, '=', '"' + damage + '"',
    'damageStep.' + name, '^', '"d" + Math.max(Math.min(2+source*2, 12), 4) + (source<1 ? source - 2 : source>5 ? "+" + (source - 5) : "")'
  );
  if(!isRanged)
    rules.defineRule(weaponName + '.4',
      'combatNotes.' + prefix + 'StrengthPenalty', '=', '"' + damage.replace(/d.*/, 'd') + '" + source'
    );
  rules.defineRule(weaponName + '.5',
    weaponName, '?', null,
    '', '=', '""',
    'damageAdjustment.' + name, '=', 'source==0 ? "" : QuilvynUtils.signed(source)'
  );
  if(range) {
    rules.defineRule('range.' + name,
      weaponName, '=', range,
      'rangeAdjustment.' + name, '+', null
    );
    rules.defineRule(weaponName + '.6', 'range.' + name, '=', null);
  }
  if(parry) {
    let note = 'combatNotes.' + prefix + 'ParryModifier';
    rules.defineChoice
      ('notes', note+':' + QuilvynUtils.signed(parry) + ' Parry when wielded');
    rules.defineRule(note, 'weapons.' + name, '=', '1');
  }
  rules.defineChoice(isRanged ? 'rangeds' : 'melees', name + ':');

};

/*
 * Defines in #rules# the rules associated with with the list #features#. Rules
 * add each feature to #setName# if the value of #levelAttr# is at least equal
 * to the value required for the feature. If #selectable# is true, the user is
 * allowed to select these features for the character, rather than having them
 * assigned automatically.
 */
SWADE.featureListRules = function(
  rules, features, setName, levelAttr, selectable
) {
  QuilvynRules.featureListRules
    (rules, features, setName, levelAttr, selectable);
};

/*
 * Returns the dictionary of attribute formats associated with character sheet
 * format #viewer# in #rules#.
 */
SWADE.getFormats = function(rules, viewer) {
  let format;
  let formats = rules.getChoices('notes');
  let result = {};
  if(viewer == 'Compact') {
    for(format in formats) {
      if(!format.startsWith('powers.'))
        result[format] = formats[format];
    }
  } else if(viewer == 'Stat Block') {
    result = Object.assign({}, formats);
    for(format in rules.getChoices('powers')) {
      result['powers.' + format] = '%V';
    }
    for(format in rules.getChoices('skills')) {
      result['skills.' + format] = 'd%V%1';
    }
  } else {
    result = formats;
  }
  return result;
};

/* Returns an ObjectViewer loaded with the default character sheet format. */
SWADE.createViewers = function(rules, viewers) {
  for(let i = 0; i < viewers.length; i++) {
    let name = viewers[i];
    let viewer = new ObjectViewer();
    if(name == 'Compact') {
      viewer.addElements(
        {name: '_top', separator: '\n'},
          {name: 'Section 1', within: '_top', separator: '; '},
            {name: 'Identity', within: 'Section 1', format: '%V',
             separator: ''},
              {name: 'Name', within: 'Identity', format: '<b>%V</b>'},
              {name: 'Gender', within: 'Identity', format: ' -- <b>%V</b>'},
              {name: 'Race', within: 'Identity', format: ' <b>%V</b>'},
              {name: 'Era', within: 'Identity', format: ' <b>%V</b>'},
              {name: 'Rank', within: 'Identity', format: ' <b>%V</b>'},
              {name: 'Concepts', within: 'Identity', format: ' <b>%V</b>',
               separator: '/'},
            {name: 'Speed', within: 'Section 1', separator:''},
              {name: 'Pace', within: 'Speed', format: '<b>Pace/Run</b> %V'},
              {name: 'Run', within: 'Speed', format: '/+d%V'},
              {name: 'Run Modifier', within: 'Speed', format: '%V'},
            {name: 'Parry', within: 'Section 1', format: '<b>Parry</b> %V'},
            {name: 'Cover', within: 'Section 1', format: '<b>Cover</b> %V'},
            {name: 'Toughness', within: 'Section 1', format: '<b>Toughness</b> %V'},
            {name: 'Weapons', within: 'Section 1', format: '<b>%N</b> %V',
             separator: '/'},
            {name: 'Attributes', within: 'Section 1',
             format: '<b>Agi/Sma/Spi/Str/Vig</b> %V', separator: '/'},
              {name: 'Agility', within: 'Abilities', format: '%V'},
              {name: 'Smarts', within: 'Abilities', format: '%V'},
              {name: 'Spirit', within: 'Abilities', format: '%V'},
              {name: 'Strength', within: 'Abilities', format: '%V'},
              {name: 'Vigor', within: 'Abilities', format: '%V'},
            {name: 'Skills', within: 'Section 1', separator: '/'},
          {name: 'Section 2', within: '_top', separator: '; '},
            {name: 'Edges', within: 'Section 2', separator: '/'},
            {name: 'Hindrances', within: 'Section 2', separator: '/'},
            {name: 'Power Points', within: 'Section 2', separator: '/'},
            {name: 'Powers', within: 'Section 2', separator: '/'},
            {name: 'Notes', within: 'Section 2'},
            {name: 'Hidden Notes', within: 'Section 2', format: '%V'}
      );
    } else if(name == 'Collected Notes' || name == 'Standard') {
      let innerSep = null;
      let listSep = '; ';
      let noteSep = listSep;
      noteSep = '\n';
      let outerSep = name == '\n';
      viewer.addElements(
        {name: '_top', borders: 1, separator: '\n'},
        {name: 'Header', within: '_top'},
          {name: 'Image Url', within: 'Header', format: '<img src="%V" alt="No Image" style="height:75px; vertical-align:middle"/>&nbsp;&nbsp;'},
          {name: 'Identity', within: 'Header', separator: ''},
            {name: 'Name', within: 'Identity', format: '<b>%V</b>'},
            {name: 'Gender', within: 'Identity', format: ' -- <b>%V</b>'},
            {name: 'Race', within: 'Identity', format: ' <b>%V</b>'},
            {name: 'Era', within: 'Identity', format: ' <b>%V</b>'},
            {name: 'Rank', within: 'Identity', format: ' <b>%V</b>'},
            {name: 'Concepts', within: 'Identity', format: ' <b>%V</b>',
             separator: '/'},
        {name: 'Characteristics', within: '_top', separator: outerSep},
          {name: 'Attribute Points', within: 'Characteristics', format: '<b>Attributes</b> (%V Points):'},
          {name: 'Attributes', within: 'Characteristics', separator: innerSep},
            {name: 'Agility', within: 'Attributes'},
            {name: 'Smarts', within: 'Attributes'},
            {name: 'Spirit', within: 'Attributes'},
            {name: 'Strength', within: 'Attributes'},
            {name: 'Vigor', within: 'Attributes'}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
            {name: 'Attribute Notes', within: 'Characteristics', separator:noteSep}
        );
      }
      viewer.addElements(
          {name: 'Skill Points', within: 'Characteristics', format: '<b>Skills</b> (%V Points):'},
          {name: 'Skills', within: 'Characteristics', format: '%V', columns: '3LE', separator: null}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
            {name: 'Skill Notes', within: 'Characteristics', separator:noteSep}
        );
      }
      viewer.addElements(
          {name: 'Description', within: 'Characteristics', separator: innerSep},
            {name: 'Size', within: 'Description'},
            {name: 'Deity', within: 'Description'},
            {name: 'Origin', within: 'Description'},
            {name: 'Player', within: 'Description'},
          {name: 'AdvanceStats', within: 'Characteristics', separator: innerSep},
            {name: 'Advances', within: 'AdvanceStats'},
            {name: 'Improvement Points', within: 'AdvanceStats'},
            {name: 'Improvement Points Allocation', within: 'AdvanceStats', separator: listSep}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
          {name: 'Description Notes', within: 'Characteristics', separator: noteSep}
        );
      }
      viewer.addElements(
        {name: 'FeatureSection', within: '_top', separator: outerSep,
         format: '<b>Features</b><br/>%V'},
          {name: 'FeaturePart', within: 'FeatureSection', separator: innerSep},
            {name: 'EdgePart', within: 'FeaturePart', separator: ' '},
              {name: 'EdgeStats', within: 'EdgePart', separator: ''},
                {name: 'Edge Points', within: 'EdgeStats', format: '<b>Edges</b> (%V points):'},
              {name: 'Edges', within: 'EdgePart', format: '%V', separator: listSep},
            {name: 'Hindrances', within: 'FeaturePart', separator: listSep}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
            {name: 'Feature Notes', within: 'FeatureSection', separator: noteSep}
        );
      } else {
        viewer.addElements(
          {name: 'AllNotes', within: 'FeatureSection', separator: '\n', columns: "1L"},
            {name: 'Attribute Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Skill Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Description Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Feature Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Combat Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Arcane Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"}
        );
      }
      viewer.addElements(
        {name: 'Combat', within: '_top', separator: outerSep,
         format: '<b>Combat</b><br/>%V'},
          {name: 'CombatPart', within: 'Combat', separator: '\n'},
            {name: 'CombatStats', within: 'CombatPart', separator: innerSep},
              {name: 'ParryInfo', within: 'CombatStats', separator: ''},
                {name: 'Parry', within: 'ParryInfo'},
                {name: 'Shield Parry', within: 'ParryInfo', format: ' (%V)'},
              {name: 'Cover', within: 'CombatStats'},
              {name: 'ToughnessInfo', within: 'CombatStats', separator: ''},
                {name: 'Toughness', within: 'ToughnessInfo'},
                {name: 'Armor Toughness', within: 'ToughnessInfo', format: ' (%V)'},
              {name: 'Speed', within: 'CombatStats', separator: ''},
                {name: 'Pace', within: 'Speed', format: '<b>Pace/Run</b>: %V'},
                {name: 'Run', within: 'Speed', format: '/+d%V'},
                {name: 'Run Modifier', within: 'Speed', format: '%V'},
            {name: 'Gear', within: 'CombatPart', separator: innerSep},
              {name: 'Armor', within: 'Gear'},
              {name: 'Shield', within: 'Gear'},
              {name: 'Weapons', within: 'Gear', separator: listSep}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
            {name: 'Combat Notes', within: 'CombatPart', separator: noteSep}
        );
      }
      viewer.addElements(
        {name: 'Arcana', within: '_top', separator: outerSep,
         format: '<b>Arcana</b><br/>%V'},
          {name: 'PowerStats', within: 'Arcana', separator: innerSep},
            {name: 'Power Count', within: 'PowerStats'},
            {name: 'Power Points', within: 'PowerStats'},
          {name: 'Powers', within: 'Arcana', columns: '1L', separator: null},
          {name: 'Common Power Modifiers', within: 'Arcana'}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
          {name: 'Arcana Notes', within: 'Arcana', separator: noteSep}
        );
      }
      viewer.addElements(
        {name: 'Notes Area', within: '_top', separator: outerSep,
         format: '<b>Notes</b><br/>%V'},
          {name: 'NotesPart', within: 'Notes Area', separator: '\n'},
            {name: 'Notes', within: 'NotesPart', format: '%V'},
            {name: 'Hidden Notes', within: 'NotesPart', format: '%V'},
          {name: 'ValidationPart', within: 'Notes Area', separator: '\n'},
            {name: 'Sanity Notes', within: 'ValidationPart', separator:noteSep},
            {name: 'Validation Notes', within: 'ValidationPart',
             separator: noteSep}
      );
    } else if(name == 'Stat Block') {
      viewer.addElements(
        {name: '_top', separator: '\n', columns: '1L'},
          {name: 'Name', within: '_top', format: '<div style="font-size:2em"><b>%V</b></div>'},
          {name: 'GenderRaceAndRank', within: '_top', separator: ' '},
            {name: 'Gender', within: 'GenderRaceAndRank', format: '%V'},
            {name: 'Race', within: 'GenderRaceAndRank', format: '%V'},
            {name: 'Rank', within: 'GenderRaceAndRank', format: '%V'},
            {name: 'Concepts', within: 'GenderRaceAndRank', format: '%V',
             separator: '/'},
          {name: 'Attributes', within: '_top', format: '<b>%N</b>: %V',
           separator: ', '},
            {name: 'Agility', within: 'Attributes', format: '%N %V'},
            {name: 'Smarts', within: 'Attributes', format: '%N %V'},
            {name: 'Spirit', within: 'Attributes', format: '%N %V'},
            {name: 'Strength', within: 'Attributes', format: '%N %V'},
            {name: 'Vigor', within: 'Attributes', format: '%N %V'},
          {name: 'Skills', within: '_top', separator: ', '},
          {name: 'Combat', within: '_top', separator: '; '},
            {name: 'Pace', within: 'Combat'},
            {name: 'ParryInfo', within: 'Combat', separator: ''},
              {name: 'Parry', within: 'ParryInfo'},
              {name: 'Shield Parry', within: 'ParryInfo', format: ' (%V)'},
            {name: 'Cover', within: 'Combat'},
            {name: 'ToughnessInfo', within: 'Combat', separator: ''},
              {name: 'Toughness', within: 'ToughnessInfo'},
              {name: 'Armor Toughness', within: 'ToughnessInfo', format: ' (%V)'},
          {name: 'Hindrances', within: '_top', separator: ', '},
          {name: 'Edges', within: '_top', separator: ', '},
          {name: 'Gear', within: '_top', separator: ', ',
           format: '<b>%N</b>: %V'},
            {name: 'Defense', within: 'Gear', separator: ', ', format: '%V'},
            {name: 'Weapons', within: 'Gear', separator: ', ', format: '%V'},
          {name: 'Powers', within: '_top', separator: ', ',
           format: '<b>%N</b>: %V'}
      );
    } else
      continue;
    rules.defineViewer(name, viewer);
  }
};

/*
 * Returns the list of editing elements needed by #choiceRules# to add a #type#
 * item to #rules#.
 */
SWADE.choiceEditorElements = function(rules, type) {
  let result = [];
  let dieTypes = ['4', '6', '8', '10', '12'];
  let zeroToTen = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  if(type == 'Arcana')
    result.push(
      ['Skill', 'Skill', 'select-one', QuilvynUtils.getKeys(rules.getChoices('skills'))],
      ['Powers', 'Powers', 'text', [60]]
    );
  else if(type == 'Armor') {
    result.push(
      ['Era', 'Era', 'text', [30]],
      ['Area', 'Area Covered', 'text', [30]],
      ['Armor', 'Armor', 'select-one', zeroToTen],
      ['MinStr', 'Min Strength', 'select-one', dieTypes],
      ['Weight', 'Weight', 'text', [2]]
    );
  } else if(type == 'Concept')
    result.push(
      ['Attribute', 'Attribute', 'text', [30]],
      ['Skill', 'Skill', 'text', [30]],
      ['Edge', 'Edge', 'text', [30]]
    );
  else if(type == 'Deity')
    result.push(
      // empty
    );
  else if(type == 'Edge') {
    let edgeTypes = [
      'Background', 'Combat', 'Leadership', 'Legendary', 'Power',
      'Professional', 'Social', 'Weird'
    ];
    result.push(
      ['Type', 'Type', 'select-one', edgeTypes],
      ['Require', 'Prerequisite', 'text', [40]],
      ['Imply', 'Implies', 'text', [40]]
    );
  } else if(type == 'Feature') {
    result.push(
      ['Section', 'Section', 'text', [40]],
      ['Note', 'Note', 'text', [60]]
    );
  } else if(type == 'Hindrance') {
    result.push(
      ['Severity', 'Severity', 'select-one', ['Major', 'Minor']],
      ['Require', 'Prerequisite', 'text', [40]]
    );
  } else if(type == 'Language')
    result.push(
      // empty
    );
  else if(type == 'Power') {
    let zeroToSixteen =
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    result.push(
      ['Advances', 'Advances', 'select-one', zeroToSixteen],
      ['PowerPoints', 'Power Points', 'select-one', zeroToTen],
      ['Range', 'Range', 'text', [15]],
      ['Description', 'Description', 'text', [60]],
      ['Modifier', 'Modifier', 'text', [60]]
    );
  } else if(type == 'Race')
    result.push(
      ['Require', 'Prerequisite', 'text', [40]],
      ['Features', 'Features', 'text', [60]],
      ['Languages', 'Languages', 'text', [30]]
    );
  else if(type == 'Shield')
    result.push(
      ['Era', 'Era', 'text', [30]],
      ['Parry', 'Parry', 'select-one', zeroToTen],
      ['Cover', 'Cover', 'select-one', zeroToTen],
      ['MinStr', 'Min Strength', 'select-one', dieTypes],
      ['Weight', 'Weight', 'text', [2]]
    );
  else if(type == 'Skill')
    result.push(
      ['Era', 'Era', 'text', [30]],
      ['Attribute', 'Attribute', 'select-one', QuilvynUtils.getKeys(rules.getChoices('attributes'))],
      ['Core', 'Core', 'select-one', ['N', 'Y']]
    );
  else if(type == 'Weapon') {
    let zeroToOneFifty =
     [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
    result.push(
      ['Era', 'Era', 'text', [30]],
      ['Category', 'Category', 'select-one', ['Unarmed', 'One-Handed', 'Two-Handed', 'Ranged']],
      ['Damage', 'Damage', 'text', [10]],
      ['MinStr', 'Min Strength', 'select-one', dieTypes],
      ['Weight', 'Weight', 'text', [2]],
      ['AP', 'Armor Piercing', 'select-one', zeroToTen],
      ['Range', 'Range in Yards', 'select-one', zeroToOneFifty],
      ['ROF', 'Rate of Fire', 'select-one', zeroToTen],
      ['Parry', 'Parry', 'text', [2]]
    );
  }
  return result;
};

/* Returns the elements in a basic SWADE character editor. */
SWADE.initialEditorElements = function() {
  let allocations = [0, 1, 2, 3, 4, 5, 6];
  let improvementTypes = ['Attribute', 'Edge', 'Hindrance', 'Skill'];
  let editorElements = [
    ['name', 'Name', 'text', [20]],
    ['era', 'Era', 'select-one', 'eras'],
    ['race', 'Race', 'select-one', 'races'],
    ['imageUrl', 'Image URL', 'text', [20]],
    ['gender', 'Gender', 'text', [10]],
    ['concepts', 'Concepts', 'set', 'concepts'],
    ['agilityAllocation', 'Agility', 'select-one', allocations],
    ['smartsAllocation', 'Smarts', 'select-one', allocations],
    ['spiritAllocation', 'Spirit', 'select-one', allocations],
    ['strengthAllocation', 'Strength', 'select-one', allocations],
    ['vigorAllocation', 'Vigor', 'select-one', allocations],
    ['skillAllocation', 'Skills', 'bag', 'skills'],
    ['origin', 'Origin', 'text', [20]],
    ['player', 'Player', 'text', [20]],
    ['advances', 'Advances', 'text', [4]],
    ['improvementPointsAllocation', 'Improvement Points Allocation', 'bag', improvementTypes],
    ['edges', 'Edges', 'setbag', 'edges'],
    ['hindrances', 'Hindrances', 'set', 'hindrances'],
    ['armor', 'Armor', 'set', 'armors'],
    ['shield', 'Shield', 'select-one', 'shields'],
    ['weapons', 'Weapons', 'setbag', 'weapons'],
    ['powers', 'Powers', 'fset', 'powers'],
    ['notes', 'Notes', 'textarea', [40,10]],
    ['hiddenNotes', 'Hidden Notes', 'textarea', [40,10]]
  ];
  return editorElements;
};

/* Returns a random name for a character of race #race#. */
SWADE.randomName = function(race) {

  /* Return a random character from #string#. */
  function randomChar(string) {
    return string.charAt(QuilvynUtils.random(0, string.length - 1));
  }

  if(race == null)
    race = 'Human';
  else if(race == 'Half-Elf')
    race = QuilvynUtils.random(0, 99) < 50 ? 'Elf' : 'Human';
  else if(race.match(/Dwarf/))
    race = 'Dwarf';
  else if(race.match(/Elf/))
    race = 'Elf';
  else if(race.match(/Half-Folk/))
    race = 'Half-Folk';
  else
    race = 'Human';

  let clusters = {
    B:'lr', C:'hlr', D:'r', F:'lr', G:'lnr', K:'lnr', P:'lr', S:'chklt', T:'hr',
    W:'h',
    c:'hkt', l:'cfkmnptv', m: 'p', n:'cgkt', r: 'fv', s: 'kpt', t: 'h'
  };
  let consonants = {
    'Dwarf':'dgkmnprst', 'Elf':'fhlmnpqswy',
    'Half-Folk':'bdfghlmnprst',
    'Human': 'bcdfghjklmnprstvwz'
  }[race];
  let endConsonant = '';
  let leading = 'ghjqvwy';
  let vowels = {
    'Dwarf':'aeiou', 'Elf':'aeioy', 'Half-Folk':'aeiou', 'Human':'aeiou'
  }[race];
  let diphthongs = {a:'wy', e:'aei', o: 'aiouy', u: 'ae'};
  let syllables = QuilvynUtils.random(0, 99);
  syllables = syllables < 50 ? 2 :
              syllables < 75 ? 3 :
              syllables < 90 ? 4 :
              syllables < 95 ? 5 :
              syllables < 99 ? 6 : 7;
  let result = '';
  let vowel;

  for(let i = 0; i < syllables; i++) {
    if(QuilvynUtils.random(0, 99) <= 80) {
      endConsonant = randomChar(consonants).toUpperCase();
      if(clusters[endConsonant] != null && QuilvynUtils.random(0, 99) < 15)
        endConsonant += randomChar(clusters[endConsonant]);
      result += endConsonant;
      if(endConsonant == 'Q')
        result += 'u';
    }
    else if(endConsonant.length == 1 && QuilvynUtils.random(0, 99) < 10) {
      result += endConsonant;
      endConsonant += endConsonant;
    }
    vowel = randomChar(vowels);
    if(endConsonant.length > 0 && diphthongs[vowel] != null &&
       QuilvynUtils.random(0, 99) < 15)
      vowel += randomChar(diphthongs[vowel]);
    result += vowel;
    endConsonant = '';
    if(QuilvynUtils.random(0, 99) <= 60) {
      while(leading.indexOf((endConsonant = randomChar(consonants))) >= 0)
        ; /* empty */
      if(clusters[endConsonant] != null && QuilvynUtils.random(0, 99) < 15)
        endConsonant += randomChar(clusters[endConsonant]);
      result += endConsonant;
    }
  }
  return result.substring(0, 1).toUpperCase() +
         result.substring(1).toLowerCase();

};

/* Sets #attributes#'s #attribute# attribute to a random value. */
SWADE.randomizeOneAttribute = function(attributes, attribute) {

  function collectConceptAttrs(allConcepts, attributes, name) {
    let result = [];
    QuilvynUtils.getKeys(attributes, /^concepts\./).forEach(c => {
      c = c.replace(/^concepts./, '');
      if(c in allConcepts)
        result =
          result.concat(QuilvynUtils.getAttrValueArray(allConcepts[c], name));
    });
    return result;
  }

  /*
   * Randomly selects #howMany# elements of the array #choices#, prepends
   * #prefix# to each, and sets those attributes in #attributes# to #value#.
   */
  function pickAttrs(attributes, prefix, choices, howMany, value) {
    let remaining = [].concat(choices);
    for(let i = 0; i < howMany && remaining.length > 0; i++) {
      let which = QuilvynUtils.random(0, remaining.length - 1);
      attributes[prefix + remaining[which]] = value;
      remaining = remaining.slice(0, which).concat(remaining.slice(which + 1));
    }
  }

  let attr;
  let attrs;
  let choices;
  let era;
  let howMany;
  let matchInfo;
  let minStr;

  if(attribute == 'advances') {
    if(attributes.advances === null) {
      howMany = QuilvynUtils.random(0, 9);
      attributes.advances = howMany<5 ? 0 : howMany<8 ? 1 : howMany<9 ? 2 : 3;
      if(QuilvynUtils.random(0, 9) >= 7)
        attributes.advances += 4;
    }
  } else if(attribute == 'armor') {
    attrs = this.applyRules(attributes);
    let allArmors = this.getChoices('armors');
    era = attributes.era || 'Modern';
    choices = [];
    howMany = 1;
    for(attr in allArmors) {
      let torsoArmor = allArmors[attr].match(/Body|Torso/);
      if(attributes[attr]) {
        if(torsoArmor)
          howMany = 0;
        continue;
      }
      minStr = QuilvynUtils.getAttrValue(allArmors[attr], 'MinStr');
      if(torsoArmor &&
         (!minStr || attrs.strength >= minStr) &&
         (!allArmors[attr].includes('Era') || allArmors[attr].includes(era)))
        choices.push(attr);
    }
    pickAttrs(attributes, 'armor.', choices, howMany, 1);
  } else if(attribute == 'attributes') {
    attrs = this.applyRules(attributes);
    let conceptAttributes =
      collectConceptAttrs(this.getChoices('concepts'), attributes, 'Attribute').map(x => x.toLowerCase());
    for(attr in SWADE.ATTRIBUTES) {
      attributes[attr + 'Allocation'] = 0;
    }
    howMany = attrs.attributePoints;
    while(howMany > 0) {
      attr = QuilvynUtils.randomKey(SWADE.ATTRIBUTES);
      if(conceptAttributes.length > 0 && QuilvynUtils.random(0, 9) < 6)
        attr =
          conceptAttributes[QuilvynUtils.random(0, conceptAttributes.length-1)];
      if(QuilvynUtils.random(0, 9) < 3)
        attr = 'vigor';
      if(attributes[attr + 'Allocation'] < 4 || attrs.attributePoints > 20) {
        attributes[attr + 'Allocation']++;
        howMany--;
      }
    }
  } else if(attribute == 'concepts') {
    if(QuilvynUtils.getKeys(attributes, /^concepts./).length == 0) {
      choices = QuilvynUtils.getKeys(this.getChoices('concepts'));
      attributes['concepts.' + choices[QuilvynUtils.random(0, choices.length - 1)]] = 1;
    }
  } else if(attribute == 'edges' || attribute == 'hindrances') {
    attrs = this.applyRules(attributes);
    if(attribute == 'edges') {
      let conceptEdges =
        collectConceptAttrs(this.getChoices('concepts'), attributes, 'Edge');
      for(let i = 0; i < conceptEdges.length; i++) {
        attr = conceptEdges[i];
        if(!attrs['features.' + attr]) {
          attributes['edges.' + attr] = 1;
          attrs = this.applyRules(attributes);
        }
      }
    }
    howMany = attribute == 'edges' ? attrs.edgePoints || 0 : 4;
    let allChoices = this.getChoices(attribute);
    choices = [];
    for(attr in allChoices) {
      if(attrs[attribute + '.' + attr] != null) {
        howMany -= (attr.endsWith('+') ? 2 : 1) * attrs[attribute + '.' + attr];
        continue;
      }
      choices.push(attr);
    }
    while(howMany > 0) {
      let pick;
      if(attribute == 'hindrances') {
        let subChoices;
        if(howMany > 1 && QuilvynUtils.random(0, 9) > 7)
          subChoices =
            choices.filter(x => allChoices[x].match(/severity=major/i));
        else
          subChoices =
            choices.filter(x => !allChoices[x].match(/severity=major/i));
        pick = subChoices[QuilvynUtils.random(0, subChoices.length - 1)];
      } else {
        pick = choices[QuilvynUtils.random(0, choices.length - 1)];
      }
      attributes[attribute + '.' + pick] =
        (attributes[attribute + '.' + pick] || 0) + 1;
      choices = choices.filter(x => x != pick);
      let validate = this.applyRules(attributes);
      let name = pick.charAt(0).toLowerCase() +
                 pick.substring(1).replaceAll(' ', '').
                 replace(/\(/g, '\\(').replace(/\)/g, '\\)');
      if(QuilvynUtils.sumMatching
           (validate,
            new RegExp('^(sanity|validation)Notes.' + name)) != 0) {
        delete attributes[attribute + '.' + pick];
      } else {
        // For casters, override 70% of edges with Power Points or New Powers
        if(attrs.powerCount &&
           QuilvynUtils.random(0, 9) < 7 &&
           ('New Power' in allChoices || 'New Powers' in allChoices)) {
          delete attributes[attribute + '.' + pick];
          pick = QuilvynUtils.random(0, 1) == 0 && 'Power Points' in allChoices ? 'Power Points' : 'New Power' in allChoices ? 'New Power' : 'New Powers';
          attributes[attribute + '.' + pick] =
            (attributes[attribute + '.' + pick] || 0) + 1;
        }
        howMany -= pick.endsWith('+') ? 2 : 1;
        attrs = this.applyRules(attributes);
      }
    }
  } else if(attribute == 'gender') {
    attributes.gender = QuilvynUtils.random(0, 99) < 50 ? 'Female' : 'Male';
  } else if(attribute == 'improvements') {
    attrs = this.applyRules(attributes);
    howMany = (attrs.improvementPoints || 0) -
              (attrs['improvementPointsAllocation.Attribute'] || 0) -
              (attrs['improvementPointsAllocation.Edge'] || 0) -
              (attrs['improvementPointsAllocation.Hindrance'] || 0) -
              (attrs['improvementPointsAllocation.Skill'] || 0);
    // Note: not allocating improvements to removing hindrances
    while(howMany > 0) {
      attr = howMany == 1 || QuilvynUtils.random(0, 2) == 0 ? 'Skill' :
             QuilvynUtils.random(0, 1) == 0 ? 'Edge' : 'Attribute';
      let allocation = attr == 'Skill' ? 1 : 2;
      if(attributes['improvementPointsAllocation.' + attr] == null)
        attributes['improvementPointsAllocation.' + attr] = allocation;
      else
        attributes['improvementPointsAllocation.' + attr] = // Force number
          attributes['improvementPointsAllocation.' + attr] - 0 + allocation;
      howMany -= allocation;
    }
  } else if(attribute == 'name') {
    attributes.name = SWADE.randomName(attributes.race);
  } else if(attribute == 'powers') {
    attrs = this.applyRules(attributes);
    howMany = attrs.powerCount || 0;
    choices = [];
    let advances = attributes.advances || 0;
    let allPowers = this.getChoices('powers');
    let allArcanas = this.getChoices('arcanas');
    let allowedPowers = null;
    for(attr in allArcanas) {
      if(attrs['features.Arcane Background (' + attr + ')'] != null &&
         allArcanas[attr].includes('Powers=')) {
        allowedPowers = {};
        QuilvynUtils.getAttrValueArray(allArcanas[attr], 'Powers')
          .forEach(x => allowedPowers[x] = allPowers[x] || console.log('Unknown power "' + x + '"') || '');
      }
    }
    if(allowedPowers)
      allPowers = allowedPowers;
    for(attr in allPowers) {
      if(attributes['powers.' + attr]) {
        howMany--;
        continue;
      }
      matchInfo = allPowers[attr].match(/Advances=(\d+)/);
      if(!matchInfo || advances >= matchInfo[1] - 0)
        choices.push(attr);
    }
    pickAttrs(attributes, 'powers.', choices, howMany, 1);
  } else if(attribute == 'shield') {
    attrs = this.applyRules(attributes);
    era = attributes.era || 'Modern';
    let allShields = this.getChoices('shields');
    choices = [];
    for(attr in allShields) {
      minStr = QuilvynUtils.getAttrValue(allShields[attr], 'MinStr');
      if((!minStr || attrs.strength >= minStr) &&
         (!allShields[attr].includes('Era') || allShields[attr].includes(era)))
        choices.push(attr);
    }
    attributes.shield = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'skills') {
    attrs = this.applyRules(attributes);
    let allSkills = this.getChoices('skills');
    let conceptSkills =
      collectConceptAttrs(this.getChoices('concepts'), attributes, 'Skill');
    era = attributes.era;
    howMany = attrs.skillPoints;
    for(attr in attrs) {
      if(attr.match(/^skillAllocation\./))
        howMany -= attributes[attr];
    }
    let knowledgePicked = null;
    let languagePicked = null;
    while(howMany > 0) {
      attr = QuilvynUtils.randomKey(allSkills);
      if(allSkills[attr].includes('Era') && !allSkills[attr].includes(era))
        continue;
      if(conceptSkills.length > 0 && QuilvynUtils.random(0, 9) < 6)
        attr =
          conceptSkills[QuilvynUtils.random(0, conceptSkills.length - 1)];
      if(attr.startsWith('Knowledge')) {
        if(knowledgePicked && attr != knowledgePicked)
          continue;
        knowledgePicked = attr;
      }
      if(attr.startsWith('Language')) {
        if(languagePicked && attr != languagePicked)
          continue;
        languagePicked = attr;
      }
      attr = 'skillAllocation.' + attr;
      if(attributes[attr] && attributes[attr] >= 5)
        continue;
      attributes[attr] = (attributes[attr] || 0) - 0 + 1; // Force number
      howMany--;
    }
  } else if(attribute == 'weapons') {
    attrs = this.applyRules(attributes);
    era = attributes.era || 'Modern';
    let allWeapons = this.getChoices('weapons');
    choices = [];
    howMany = 3;
    for(attr in attributes)
      if(attr.startsWith('weapons.'))
        howMany--;
    for(attr in allWeapons) {
      minStr = QuilvynUtils.getAttrValue(allWeapons[attr], 'MinStr');
      if((!minStr || attrs.strength >= minStr) &&
         (!allWeapons[attr].includes('Era') || allWeapons[attr].includes(era)))
        choices.push(attr);
    }
    pickAttrs(attributes, 'weapons.', choices, howMany, 1);
  } else if(this.getChoices(attribute + 's') != null) {
    attributes[attribute] =
      QuilvynUtils.randomKey(this.getChoices(attribute + 's'));
  }

};

/* Fixes as many validation errors in #attributes# as possible. */
SWADE.makeValid = function(attributes) {

  let attributesChanged = {};
  let debug = [];
  let notes = this.getChoices('notes');

  // If 8 passes don't get rid of all repairable problems, give up
  for(let pass = 0; pass < 8; pass++) {

    let applied = this.applyRules(attributes);
    let fixedThisPass = 0;

    // Try to fix each sanity/validation note w/a non-zero value
    for(let attr in applied) {

      let attrValue = applied[attr];

      if(!attr.match(/^(sanity|validation)Notes\./) ||
         !attrValue || notes[attr] == null)
        continue;

      let requirements =
        notes[attr].replace(/^(Implies|Requires)\s/, '').split(/\s*\/\s*/);

      for(let i = 0; i < requirements.length; i++) {

        // Find a random requirement choice w/the format "name [op value]"
        let choices = requirements[i].split(/\s*\|\|\s*/);
        let matchInfo = null;
        while(matchInfo == null && choices.length > 0) {
          let index = QuilvynUtils.random(0, choices.length - 1);
          matchInfo = choices[index].match(/^([^<>!=]+)(([<>!=~]+)(.*))?/);
          choices.splice(index, 1);
        }
        if(matchInfo == null)
          continue; // No workable alternatives

        let toFixAttr =
          matchInfo[1].replace(/\s*$/, '').replace('features', 'edges');
        let toFixCombiner = null;
        let toFixOp = matchInfo[3] == null ? '>=' : matchInfo[3];
        let toFixValue =
          matchInfo[4] == null ? 1 : matchInfo[4].replace(/^\s+/, '');
        if(toFixAttr.match(/^(Max|Sum)/)) {
          toFixCombiner = toFixAttr.substring(0, 3);
          toFixAttr = toFixAttr.substring(4).replace(/^\s+/, '');
        }

        // See if this attr has a set of choices (e.g., race)
        choices = this.getChoices(toFixAttr + 's');
        if(choices != null) {
          // Find the set of choices that satisfy the requirement
          let possibilities = [];
          for(let choice in choices) {
            if((toFixOp.match(/[^!]=/) && choice == toFixAttr) ||
               (toFixOp == '!=' && choice != toFixAttr) ||
               (toFixCombiner != null && choice.indexOf(toFixAttr) == 0) ||
               (toFixOp == '=~' && choice.match(new RegExp(toFixAttr))) ||
               (toFixOp == '!~' && !choice.match(new RegExp(toFixAttr)))) {
              possibilities.push(choice);
            }
          }
          if(possibilities.length == 0) {
            continue; // No fix possible
          }
          toFixValue =
            possibilities[QuilvynUtils.random(0, possibilities.length - 1)];
        }
        if(toFixAttr in attributesChanged)
          continue;
        if((toFixOp == '>=' || toFixOp == '>') &&
           attributes[toFixAttr] > toFixValue)
          continue;
        if(toFixAttr in attributes || toFixAttr.match(/^\w+\./)) {
          if(toFixAttr in SWADE.ATTRIBUTES) {
            toFixValue = toFixValue / 2 - 2;
            toFixAttr += 'Allocation';
          } else if(toFixAttr.startsWith('skills.')) {
            toFixValue = toFixValue / 2 - (this.getChoices('skills')[toFixAttr.replace('skills.', '')].match(/Core=([Yy1]|true)/i) ? 2 : 1);
            toFixAttr = toFixAttr.replace('skills', 'skillAllocation');
          }
          debug.push(
            attr + " '" + toFixAttr + "': '" + attributes[toFixAttr] +
            "' => '" + toFixValue + "'"
          );
          if(toFixValue == 0) {
            delete attributes[toFixAttr];
          } else {
            attributes[toFixAttr] = toFixValue;
          }
          attributesChanged[toFixAttr] = toFixValue;
          fixedThisPass++;
        } else if(attr.endsWith('Allocation')) {
          let problemSource = attr.replace(/.*\.(.*)Allocation/, '$1s');
          if(problemSource == 'skills')
            problemSource = 'skillAllocation';
          let available = applied[attr + '.1'];
          let allocated = applied[attr + '.2'];
          if(allocated > available) {
            choices = [];
            for(let k in attributes) {
              if(k.match('^' + problemSource + '\\.') &&
                 attributesChanged[k] == null) {
                 choices.push(k);
              }
            }
            while(choices.length > 0 && attrValue > 0) {
              let index = QuilvynUtils.random(0, choices.length - 1);
              toFixAttr = choices[index];
              choices = choices.slice(0, index).concat(choices.slice(index+1));
              let current = attributes[toFixAttr];
              toFixValue = current > attrValue ? current - attrValue : 0;
              debug.push(
                attr + " '" + toFixAttr + "': '" + attributes[toFixAttr] +
                "' => '" + toFixValue + "'"
              );
              if(toFixValue == 0) {
                delete attributes[toFixAttr];
              } else {
                attributes[toFixAttr] = toFixValue;
              }
              attrValue -= current - toFixValue;
              // Don't do this: attributesChanged[toFixAttr] = toFixValue;
              fixedThisPass++;
            }
          } else if(allocated < available) {
            this.randomizeOneAttribute(attributes, problemSource);
            debug.push(attr + ' Allocate additional ' + problemSource);
            fixedThisPass++;
          }
        }

      }

    }

    debug.push('-----');
    if(fixedThisPass == 0) {
      break;
    }

  }

  if(window.DEBUG)
    attributes.notes =
      (attributes.notes ? attributes.notes + '\n' : '') + debug.join('\n');

};

/* Returns an array of plugins upon which this one depends. */
SWADE.getPlugins = function() {
  return [];
};

/* Returns HTML body content for user notes associated with this rule set. */
SWADE.ruleNotes = function() {
  return '' +
    '<h2>SWADE Quilvyn Module Notes</h2>\n' +
    'SWADE Quilvyn Module Version ' + SWADE.VERSION + '\n' +
    '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Major hindrances are noted by a "+" after the name. For example,\n' +
    '    "Greedy" is a minor hindrance and "Greedy+" a major one.\n' +
    '  </li><li>\n' +
    '    The rule book doesn\'t indicate which weapons are appropriate for\n' +
    '    an ancient setting. Quilvyn considers these weapons valid when\n' +
    '    randomly assigning weapons to an ancient-era character: hand axe,\n' +
    '    light club, heavy club, dagger, knife, javelin, spear, staff,\n' +
    '    short sword, throwing axe, bow, net, and sling.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '<h3>Copyrights and Licensing</h3>\n' +
    '<p>\n' +
    'All copyrights to character, vehicle, and other rules and settings are\n' +
    'owned by their respective copyright holders. This application makes no\n' +
    'claim against any properties.\n' +
    '</p><p>\n' +
    'This game references the Savage Worlds game system, available from\n' +
    'Pinnacle Entertainment Group at www.peginc.com. Savage Worlds and all\n' +
    'associated logos and trademarks are copyrights of Pinnacle\n' +
    'Entertainment Group. Used with permission. Pinnacle makes no\n' +
    'representation or warranty as to the quality, viability, or\n' +
    'suitability for purpose of this product.\n' +
    '</p><p>\n' +
    'Savage Worlds Adventure Edition © 2020 Great White Games, LLC; DBA\n' +
    'Pinnacle Entertainment Group.\n' +
    '</p>\n' +
    '<img alt="Savage Worlds Fan Logo" width="300" height="200" src="https://peginc.com/wp-content/uploads/2019/01/SW_LOGO_FP_2018.png"/>\n';
};
