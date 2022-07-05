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
/* globals Quilvyn, QuilvynRules, QuilvynUtils, SWADE */
"use strict";

/*
 * This module loads the rules from the PF4SW Player's Guide. The PF4SW
 * function contains methods that load rules for particular parts of the rules:
 * raceRules for character races, arcaneRules for powers, etc. These member
 * methods can be called independently in order to use a subset of the
 * PF4SW rules. Similarly, the constant fields of PF4SW (SKILLS, EDGES,
 * etc.) can be manipulated to modify the choices.
 */
function PF4SW(baseRules) {

  if(window.SWADE == null) {
    alert('The PF4SW module requires use of the SWADE module');
    return;
  }

  var rules = new QuilvynRules('Pathfinder for SWADE', PF4SW.VERSION);
  PF4SW.rules = rules;

  rules.defineChoice('choices', SWADE.CHOICES);
  rules.choiceEditorElements = SWADE.choiceEditorElements;
  rules.choiceRules = PF4SW.choiceRules;
  rules.editorElements = SWADE.initialEditorElements();
  rules.getFormats = SWADE.getFormats;
  rules.getPlugins = PF4SW.getPlugins;
  rules.makeValid = SWADE.makeValid;
  rules.randomizeOneAttribute = PF4SW.randomizeOneAttribute;
  rules.defineChoice('random', SWADE.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = PF4SW.ruleNotes;

  SWADE.createViewers(rules, SWADE.VIEWERS);
  rules.defineChoice('extras',
    'edges', 'edgePoints', 'hindrances', 'sanityNotes', 'validationNotes'
  );
  rules.defineChoice('preset',
    'race:Race,select-one,races', 'advances:Advances,text,4',
    'concept:Concept,select-one,concepts'
  );

  PF4SW.attributeRules(rules);
  PF4SW.combatRules
    (rules, PF4SW.ARMORS, PF4SW.SHIELDS, PF4SW.WEAPONS);
  PF4SW.arcaneRules(rules, PF4SW.ARCANAS, PF4SW.POWERS);
  PF4SW.talentRules
    (rules, PF4SW.EDGES, PF4SW.FEATURES, PF4SW.GOODIES,
     PF4SW.HINDRANCES, PF4SW.LANGUAGES, PF4SW.SKILLS);
  PF4SW.identityRules
    (rules, PF4SW.RACES, PF4SW.CONCEPTS, PF4SW.DEITIES);

  Quilvyn.addRuleSet(rules);

}

PF4SW.VERSION = '2.3.2.0';

PF4SW.ARCANAS = {
  'Blessed':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection",Banish,Barrier,"Beast Friend",Blind,' +
      '"Boost/Lower Trait",Confusion,Deflection,"Detect Arcana",Dispel,' +
      'Divination,"Elemental Manipulation",Empathy,' +
      '"Environmental Protection",Havoc,Healing,"Holy Symbol",Light,Numb,' +
      'Protection,Relief,Resurrection,Sanctify,Sloth/Speed,Smite,' +
      '"Speak Language",Stun,"Warrior\'s Gift"',
  'Chi Master':
    'Skill=Focus ' +
    'Powers=' +
      '"Arcane Protection","Boost/Lower Trait",Burrow,Curse,Darksight,' +
      'Deflection,"Detect Arcana",Empathy,"Environmental Protection",' +
      'Farsight,Healing,Numb,Protection,Relief,Sloth/Speed,Smite,' +
      '"Wall Walker","Warrior\'s Gift"',
  'Huckster':
    'Skill=Spellcasting ' +
    'Powers=' +
      '"Ammo Whammy","Arcane Protection",Barrier,"Beast Friend",Blind,' +
      'Bolt,"Boost/Lower Trait",Burst,Confusion,"Damage Field",Deflection,' +
      '"Detect/Conceal Arcana",Disguise,Dispel,Divination,' +
      '"Elemental Manipulation",Empathy,Entangle,"Environmental Protection",' +
      'Farsight,Fear,Havoc,Illusion,Intangibility,Invisibility,' +
      'Light/Darkness,Numb,"Object Reading",Protection,Puppet,Sloth/Speed,' +
      'Slumber,Sound/Silence,"Speak Language",Stun,"Summon Ally",Telekinesis,' +
      'Teleport,Trinkets,"Wall Walker"',
  'Mad Scientist':
    'Skill="Weird Science" ' +
    'Powers=' +
      '"Arcane Protection",Barrier,"Beast Friend",Blast,Blind,Bolt,' +
      '"Boost/Lower Trait",Burrow,Burst,Confusion,"Damage Field",Darksight,' +
      'Deflection,"Detect/Conceal Arcana",Disguise,Dispel,' +
      '"Drain Power Points","Elemental Manipulation",Empathy,Entangle,' +
      '"Environmental Protection",Farsight,Fear,Fly,Havoc,Healing,Illusion,' +
      'Intangibility,Invisibility,Light/Darkness,"Mind Wipe",Numb,Protection,' +
      'Puppet,Relief,Shrink,Sloth/Speed,Slumber,Smite,Sound/Silence,' +
      '"Speak Language",Stun,Telekinesis,Teleport,"Wall Walker",' +
      '"Warrior\'s Gift",Zombie',
  'Shaman':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection",Banish,"Beast Friend",Blind,"Boost/Lower Trait",' +
      'Burrow,Confusion,Curse,Darksight,Deflection,"Detect/Conceal Arcana",' +
      'Disguise,Dispel,Divination,"Drain Power Points",' +
      '"Elemental Manipulation",Empathy,Entangle,"Environmental Protection",' +
      'Farsight,Fear,Growth,Havoc,Healing,"Holy Symbol",Intangibility,Numb,' +
      'Protection,Relief,Resurrection,Sanctify,"Shape Change",Sloth/Speed,' +
      'Slumber,Smite,"Speak Language","Summon Ally",Teleport,"Wall Walker",' +
      '"Warrior\'s Gift","Wilderness Walk"'
};
PF4SW.ARMORS = {
  'None':'Area=Body Armor=0 MinStr=4 Weight=0'
};
PF4SW.CONCEPTS_ADDED = {
  'Barbarian':
    'Edge="Barbarian" ' +
    'Attribute=Strength,Vigor ' +
    'Skill=Fighting',
  'Bard':
    'Edge="Barbarian" ' +
    'Attribute=Spirit ' +
    'Skill="Common Knowledge",Performance',
  'Cleric':
    'Edge="Cleric" ' +
    'Attribute=Spirit ' +
    'Skill=Occult',
  'Druid':
    'Edge="Druid" ' +
    'Attribute=Spirit ' +
    'Skill=Survival',
  'Fighter':
    'Edge="Fighter" ' +
    'Attribute=Strength ' +
    'Skill=Fighting',
  'Monk':
    'Edge="Monk" ' +
    'Attribute=Agility,Spirit ' +
    'Skill=Fighting',
  'Paladin':
    'Edge="Paladin" ' +
    'Attribute=Spirit,Strength',
  'Ranger':
    'Edge="Ranger" ' +
    'Skill=Athletics,Fighting,Shooting,Survival',
  'Rogue':
    'Edge="Rogue" ' +
    'Attribute=Agility ' +
    'Skill=Notice,Stealth,Thievery',
  'Sorcerer':
    'Edge="Sorcerer" ' +
    'Attribute=Smarts,Spirit ' +
    'Skill=Fighting',
  'Wizard':
    'Edge="Wizard" ' +
    'Attribute=Smarts ' +
    'Skill=Occult',
  // Modified
  'Investigator':SWADE.CONCEPTS.Investigator.replaceAll('Research', 'Academics')
};
PF4SW.CONCEPTS = Object.assign({}, SWADE.CONCEPTS, PF4SW.CONCEPTS_ADDED);
delete PF4SW.CONCEPTS['Gifted'];
delete PF4SW.CONCEPTS['Martial Artist'];
delete PF4SW.CONCEPTS['Psionicist'];
delete PF4SW.CONCEPTS['Weird Scientist'];
PF4SW.DEITIES = {
  'None':'',
};
PF4SW.EDGES_ADDED = {
  // Class
  'Barbarian':'Type=class Require="strength >= 6","vigor >= 6"',
  'Powerful Blow':'Type=class Require="advances >= 4",features.Barbarian',
  'Intimidating Glare':'Type=class Require="advances >= 8",features.Barbarian',
  'Strength Surge':'Type=class Require="advances >= 12",features.Barbarian',
  'Bard':'Type=class Require="spirit >= 6","skills.Common Knowledge >= 6"',
  'Inspire Heroics':'Type=class Require="advances >= 4",features.Bard',
  'Countersong':'Type=class Require="advances >= 8",features.Bard',
  'Dirge Of Doom':'Type=class Require="advances >= 12",features.Bard',
  'Cleric':'Type=class Require="spirit >= 6","skills.Occult >= 6"',
  'Destroy Undead':'Type=class Require="advances >= 4",features.Cleric',
  'Favored Powers (Cleric)':
    'Type=class Require="advances >= 8",features.Cleric',
  'Divine Mastery':'Type=class Require="advances >= 12",features.Cleric',
  'Druid':'Type=class Require="spirit >= 6","skills.Survival >= 6"',
  'Wild Shape':'Type=class Require="advances >= 4",features.Druid',
  'Favored Powers (Druid)':'Type=class Require="advances >= 8",features.Druid',
  'Divine Mastery':'Type=class Require="advances >= 12",features.Druid',
  'Fighter':'Type=class Require="strength >= 6","skills.Fighting >= 6"',
  'Deadly Blow':'Type=class Require="advances >= 4",features.Fighter',
  'Improved Martial Flexibility':
    'Type=class Require="advances >= 8",features.Fighter',
  'Martial Prowess':'Type=class Require="advances >= 12",features.Fighter',
  'Monk':
    'Type=class Require="agility >= 6","spirit >= 6","skills.Fighting >= 6"',
  'Mystic Powers (Monk)':'Type=class Require="advances >= 4",features.Monk',
  'Great Ki':
    'Type=class Require="advances >= 8","features.Mystic Powers (Monk)"',
  'Wholeness Of Body':
    'Type=class Require="advances >= 12","features.Mystic Powers (Monk)"',
  'Paladin':
    'Type=class ' +
    'Require="spirit >= 6","strength >= 6","features.Vow || features.Vow+"',
  'Mystic Powers (Paladin)':
    'Type=class Require="advances >= 4",features.Paladin',
  'Mercy':'Type=class Require="advances >= 8",features.Paladin',
  'Mount':'Type=class Require="advances >= 12",features.Paladin',
  'Ranger':
    'Type=class ' +
    'Require="skills.Athletics >= 6 || skills.Fighting >= 6 || skills.Shooting >= 6","skills.Survival >= 6"',
  'Quarry':'Type=class Require="advances >= 4",features.Ranger',
  'Mysic Powers (Ranger)':'Type=class Require="advances >= 8",features.Ranger',
  'Master Hunter':'Type=class Require="advances >= 12",features.Ranger',
  'Rogue':
    'Type=class ' +
    'Require="agility >= 6","skills.Notice >= 6","skills.Stealth >= 6"',
  'Trap Sense':'Type=class Require="advances >= 4",features.Rogue',
  'Uncanny Reflexes':'Type=class Require="advances >= 8",features.Rogue',
  'Opportunist':'Type=class Require="advances >= 12",features.Rogue',
  'Sorcerer':'Type=class Require="smarts >= 6","spirit >= 6"',
  'Favored Powers (Sorcerer)':
    'Type=class Require="advances >= 4",features.Sorcerer',
  'Arcane Mastery':'Type=class Require="advances >= 8",features.Sorcerer',
  'Advanced Bloodline':'Type=class Require="advances >= 12",features.Sorcerer',
  'Wizard':'Type=class Require="smarts >= 6","skills.Occult >= 6"',
  'Favored Powers (Wizard)':
    'Type=class Require="advances >= 4",features.Wizard',
  'Arcane Mastery':'Type=class Require="advances >= 8",features.Wizard',
  'Eldritch Inspiration':'Type=class Require="advances >= 12",features.Wizard',
  // Combat
  'Formation Fighter':'Type=combat Require="skills.Fighting >= 8"',
  'Rapid Reload':'Type=combat Require="skills.Shooting >= 6"',
  'Rapid Shot':SWADE.EDGES['Rapid Fire'],
  'Improved Rapid Shot':
    SWADE.EDGES['Improved Rapid Fire'].replaceAll('Fire', 'Shot'),
  'Two-Weapon Fighting':SWADE.EDGES['Two-Fisted'],
  // Power
  'Arcane Armor':'Type=power Require="features.Armor Interference"',
  'Holy/Unholy Warrior': // Changed requirements
    'Type=power ' +
    'Require=' +
      '"advances >= 4",' +
      '"powerPoints >= 1",' +
      '"features.Vow || features.Vow+"',
  'Soul Drain': // Changed requirements
    'Type=power ' +
    'Require="advances >= 4","powerPoints >= 1","spirit >= 8"',
  // Prestige
  'Arcane Archer':
    'Type=prestige ' +
    'Require="advances >= 4","powerPoints >= 1","skills.Shooting >= 8"',
  'Arcane Archer II':
    'Type=prestige Require="advances >= 8","features.Arcane Archer"',
  'Arcane Archer III':
    'Type=prestige Require="advances >= 12","features.Arcane Archer II"',
  'Arcane Trickster':
    'Type=prestige ' +
    'Require="advances >= 4","powerPoints >= 1","features.Sneak Attack","skills.Thievery >= 8"',
  'Arcane Trickster II':
    'Type=prestige Require="advances >= 4","features.Arcane Trickster"',
  'Arcane Trickster III':
    'Type=prestige Require="advances >= 8","features.Arcane Trickster II"',
  'Assassin':'Type=prestige Require="advances >= 4","features.Sneak Attack"',
  'Assassin II':'Type=prestige Require="advances >= 8","features.Assassin"',
  'Assassin III':
    'Type=prestige Require="advances >= 12","features.Assassin II"',
  'Dragon Disciple':
    'Type=prestige ' +
    'Require="advances >= 4","powerPoints >= 1","skills.Occult >= 6"',
  'Dragon Disciple II':
    'Type=prestige Require="advances >= 8","features.Dragon Disciple"',
  'Dragon Disciple III':
    'Type=prestige Require="advances >= 12","features.Dragon Disciple II"',
  'Duelist':
    'Type=prestige ' +
    'Require="advances >= 4","agility >= 8","skills.Fighting >= 8"',
  'Duelist II':'Type=prestige Require="advances >= 4","features.Duelist"',
  'Duelist III':'Type=prestige Require="advances >= 8","features.Duelist II"',
  'Eldritch Knight':
    'Type=prestige ' +
    'Require="advances >= 4","powerPoints >= 1","skills.Fighting >= 8"',
  'Eldritch Knight II':
    'Type=prestige Require="advances >= 8","features.Eldritch Knight"',
  'Eldritch Knight III':
    'Type=prestige Require="advances >= 12","features.Eldritch Knight II"',
  'Loremaster':
    'Type=prestige ' +
    'Require="advances >= 4","smarts >= 8","skills.Academics >= 8 || skills.Common Knowledge >= 8 || skills.Occult >= 8"',
  'Loremaster II':'Type=prestige Require="advances >= 8","features.Loremaster"',
  'Loremaster III':
    'Type=prestige Require="advances >= 12","features.Loremaster II"',
  // TODO Two different arcane backgrounds
  'Mystic Theurge':
    'Type=prestige ' +
    'Require="advances >= 4","powerPoints >= 1"',
  'Mystic Theurge II':
    'Type=prestige Require="advances >= 8","features.Mystic Theurge"',
  'Mystic Theurge III':
    'Type=prestige Require="advances >= 12","features.Mystic Theurge II"',
  'Pathfinder Chronicler':
    'Type=prestige ' +
    'Require="advances >= 4","skills.Survival >= 6","skills.Common Knowledge >= 8 || skills.Occult >= 8"',
  'Pathfinder Chronicler II':
    'Type=prestige Require="advances >= 4","features.Pathfinder Chronicler"',
  'Pathfinder Chronicler III':
    'Type=prestige Require="advances >= 8","features.Pathfinder Chronicler II"',
  'Shadowdancer':
    'Type=prestige ' +
    'Require="advances >= 4","skills.Performance >= 6","skills.Stealth >= 8","skills.Thievery >= 6"',
  'Shadowdancer II':
    'Type=prestige Require="advances >= 4","features.Shadowdancer"',
  'Shadowdancer III':
    'Type=prestige Require="advances >= 8","features.Shadowdancer II"',
  // Professional
  'Born In The Saddle':
    'Type=professional Require="agility >= 8","skills.Riding >= 6"',
  'Fix It':SWADE.EDGES['Mister Fix It'],
  'Investigator': // Changed requirements
    'Type=professional Require="smarts >= 8","skills.Academics >= 8"',
  'Troubador':
    'Type=professional ' +
    'Require="skills.Common Knowledge >= 6","skills.Performance >- 8"',
  // Removed
  'Arcane Background (Gifted)':null,
  'Arcane Background (Psionics)':null,
  'Arcane Background (Weird Science)':null,
  'Berserk':null,
  'Rich':null,
  'Filthy Rich':null,
  'Double Tap':null,
  'Martial Artist':null,
  'Martial Warrior':null,
  'Rapid Fire':null,
  'Improved Rapid Fire':null,
  'Rock And Roll':null,
  'Two-Fisted':null,
  'Two-Gun Kid':null,
  'Extra Effort':null,
  'Gadgeteer':null,
  'Mentalist':null,
  'Rapid Recharge':null,
  'Improved Rapid Recharge':null,
  'Mister Fix It':null,
  'McGyver':null,
  'Chi':null,
  'Liquid Courage':null
};
PF4SW.EDGES = Object.assign({}, SWADE.EDGES, PF4SW.EDGES_ADDED);
for(var e in PF4SW.EDGES) {
  if(PF4SW.EDGES[e] == null)
    delete PF4SW.EDGES[e];
}
PF4SW.FEATURES_ADDED = {
  // Edges
  'Advanced Bloodline':'Section=feature Note="FILL"',
  'Arcane Archer II':'Section=feature Note="FILL"',
  'Arcane Archer III':'Section=feature Note="FILL"',
  'Arcane Archer':'Section=feature Note="FILL"',
  'Arcane Armor':'Section=feature Note="FILL"',
  'Arcane Mastery':'Section=feature Note="FILL"',
  'Arcane Mastery':'Section=feature Note="FILL"',
  'Arcane Trickster II':'Section=feature Note="FILL"',
  'Arcane Trickster III':'Section=feature Note="FILL"',
  'Arcane Trickster':'Section=feature Note="FILL"',
  'Assassin II':'Section=feature Note="FILL"',
  'Assassin III':'Section=feature Note="FILL"',
  'Assassin':'Section=feature Note="FILL"',
  'Barbarian':'Section=feature Note="FILL"',
  'Bard':'Section=feature Note="FILL"',
  'Born In The Saddle':'Section=feature Note="FILL"',
  'Cleric':'Section=feature Note="FILL"',
  'Countersong':'Section=feature Note="FILL"',
  'Deadly Blow':'Section=feature Note="FILL"',
  'Destroy Undead':'Section=feature Note="FILL"',
  'Dirge Of Doom':'Section=feature Note="FILL"',
  'Divine Mastery':'Section=feature Note="FILL"',
  'Divine Mastery':'Section=feature Note="FILL"',
  'Dragon Disciple II':'Section=feature Note="FILL"',
  'Dragon Disciple III':'Section=feature Note="FILL"',
  'Dragon Disciple':'Section=feature Note="FILL"',
  'Druid':'Section=feature Note="FILL"',
  'Duelist II':'Section=feature Note="FILL"',
  'Duelist III':'Section=feature Note="FILL"',
  'Duelist':'Section=feature Note="FILL"',
  'Eldritch Inspiration':'Section=feature Note="FILL"',
  'Eldritch Knight II':'Section=feature Note="FILL"',
  'Eldritch Knight III':'Section=feature Note="FILL"',
  'Eldritch Knight':'Section=feature Note="FILL"',
  'Favored Powers (Cleric)':'Section=feature Note="FILL"',
  'Favored Powers (Druid)':'Section=feature Note="FILL"',
  'Favored Powers (Sorcerer)':'Section=feature Note="FILL"',
  'Favored Powers (Wizard)':'Section=feature Note="FILL"',
  'Fighter':'Section=feature Note="FILL"',
  'Fix It':SWADE.FEATURES['Mister Fix It'],
  'Formation Fighter':'Section=feature Note="FILL"',
  'Great Ki':'Section=feature Note="FILL"',
  'Improved Martial Flexibility':'Section=feature Note="FILL"',
  'Improved Rapid Shot':SWADE.FEATURES['Improved Rapid Fire'],
  'Inspire Heroics':'Section=feature Note="FILL"',
  'Intimidating Glare':'Section=feature Note="FILL"',
  'Loremaster II':'Section=feature Note="FILL"',
  'Loremaster III':'Section=feature Note="FILL"',
  'Loremaster':'Section=feature Note="FILL"',
  'Martial Prowess':'Section=feature Note="FILL"',
  'Master Hunter':'Section=feature Note="FILL"',
  'Mercy':'Section=feature Note="FILL"',
  'Monk':'Section=feature Note="FILL"',
  'Mount':'Section=feature Note="FILL"',
  'Mysic Powers (Ranger)':'Section=feature Note="FILL"',
  'Mystic Powers (Monk)':'Section=feature Note="FILL"',
  'Mystic Powers (Paladin)':'Section=feature Note="FILL"',
  'Mystic Theurge II':'Section=feature Note="FILL"',
  'Mystic Theurge III':'Section=feature Note="FILL"',
  'Mystic Theurge':'Section=feature Note="FILL"',
  'Opportunist':'Section=feature Note="FILL"',
  'Paladin':'Section=feature Note="FILL"',
  'Pathfinder Chronicler II':'Section=feature Note="FILL"',
  'Pathfinder Chronicler III':'Section=feature Note="FILL"',
  'Pathfinder Chronicler':'Section=feature Note="FILL"',
  'Powerful Blow':'Section=feature Note="FILL"',
  'Quarry':'Section=feature Note="FILL"',
  'Ranger':'Section=feature Note="FILL"',
  'Rapid Reload':'Section=feature Note="FILL"',
  'Rapid Shot':SWADE.FEATURES['Rapid Fire'],
  'Rogue':'Section=feature Note="FILL"',
  'Shadowdancer II':'Section=feature Note="FILL"',
  'Shadowdancer III':'Section=feature Note="FILL"',
  'Shadowdancer':'Section=feature Note="FILL"',
  'Sorcerer':'Section=feature Note="FILL"',
  'Strength Surge':'Section=feature Note="FILL"',
  'Trap Sense':'Section=feature Note="FILL"',
  'Troubador':'Section=feature Note="FILL"',
  'Two-Weapon Fighting':SWADE.FEATURES['Two-Fisted'],
  'Uncanny Reflexes':'Section=feature Note="FILL"',
  'Wholeness Of Body':'Section=feature Note="FILL"',
  'Wild Shape':'Section=feature Note="FILL"',
  'Wizard':'Section=feature Note="FILL"',
  // Hindrances
  'Timid+':SWADE.FEATURES['Yellow+'],
  // Races
  'Adaptability':'Section=feature Note="FILL"',
  'Darkvision':'Section=skill Note="No illumination penalties up to 10\\""',
  'Elven Magic':'Section=save Note="May reroll vs. powers"',
  'Flexibility':'Section=ability Note="+1 step in choice of ability"',
  'Gnome Magic':
    'Section=magic ' +
    'Note="Know <i>Beast Friend</i>, <i>Light</i>, <i>Sound</i>, and <i>Telkinesis</i>/1 Power Point"',
  'Intelligence':'Section=ability Note="+1 Smarts step"',
  'Intimidating':'Section=feature Note="+1 Intimidation step"',
  'Iron Constitution':'Section=save Note="+1 vs. poison/+1 vs. powers"',
  'Lucky':'Section=feature Note="+1 Benny each session"',
  'Obsessive':'Section=skill Note="d4 in choice of Smarts skill"',
  'Orc Ferocity':'Section=feature Note="FILL"',
  'Slender':'Section=ability,combat Note="-1 Vigor","-1 Toughness"',
  'Stonecunning':
    'Section=skill ' +
    'Note="Automatic Notice+2 to note unusual stonework within 10\'"',
  'Sure-Footed':'Section=skill Note="+1 Athletics step"',
  'Tough':
    'Section=attribute ' +
    'Note="+1 Vigor step/+1 Strength step (encumbrance and equipment use)"',
};
PF4SW.FEATURES =
  Object.assign({}, SWADE.FEATURES, PF4SW.FEATURES_ADDED);
PF4SW.GOODIES = Object.assign({}, SWADE.GOODIES);
PF4SW.HINDRANCES_ADDED = {
  'Timid':SWADE.HINDRANCES['Yellow+']
};
PF4SW.HINDRANCES =
  Object.assign({}, SWADE.HINDRANCES, PF4SW.HINDRANCES_ADDED);
delete PF4SW.HINDRANCES['Doubting Thomas'];
delete PF4SW.HINDRANCES['Yellow+'];
PF4SW.POWERS_ADDED = {
};
PF4SW.POWERS = Object.assign({}, SWADE.POWERS, PF4SW.POWERS_ADDED);
PF4SW.RACES = {
  'Dwarf':
    'Features=' +
      'Darkvision,"Iron Constitution","Reduced Pace",Stonecunning,Tough ' +
    'Languages=Common,Dwarven',
  'Elf':
    'Features=' +
      'Agile,"Elven Magic",Intelligence,"Keen Senses","Low Light Vision",' +
      'Slender ' +
    'Languages=Common,Elven',
  'Gnome':
    'Features=' +
      '"Gnome Magic","Keen Senses","Low Light Vision",Obsessive,' +
      '"Reduced Pace","Size -1",Tough ' +
    'Languages=Common,Gnome,Sylvan',
  'Half-Elf':
    'Features=' +
      '"Elven Magic",Flexibility,"Low Light Vision" ' +
    'Languages=Common,Elven',
  'Half-Orc':
    'Features=' +
      'Darkvision,Intimidating,"Orc Ferocity",Outsider,Strong ' +
    'Languages=Common,Orc',
  'Halfling':
    'Features=' +
      'Agile,"Keen Senses",Lucky,"Reduced Pace","Size -1",Sure-Footed ' +
    'Languages=Halfling',
  'Human':
    'Features=' +
      'Adaptability ' +
    'Languages=Common'
};
PF4SW.LANGUAGES = {
  'Abyssal':'',
  'Aklo':'',
  'Aquan':'',
  'Auran':'',
  'Celestial':'',
  'Common':'',
  'Draconic':'',
  'Druidic':'',
  'Dwarven':'',
  'Elven':'',
  'Giant':'',
  'Gnome':'',
  'Goblin':'',
  'Gnoll':'',
  'Halfling':'',
  'Ignan':'',
  'Infernal':'',
  'Orc':'',
  'Sylvan':'',
  'Terran':'',
  'Undercommon':''
};
PF4SW.SHIELDS = Object.assign({}, SWADE.SHIELDS);
PF4SW.SKILLS = Object.assign({}, SWADE.SKILLS);
delete PF4SW.SKILLS['Electronics'];
delete PF4SW.SKILLS['Focus'];
delete PF4SW.SKILLS['Hacking'];
delete PF4SW.SKILLS['Language (%language)'];
delete PF4SW.SKILLS['Psionics'];
delete PF4SW.SKILLS['Research'];
delete PF4SW.SKILLS['Weird Science'];
PF4SW.WEAPONS = Object.assign({}, SWADE.WEAPONS);

/* Defines the rules related to character attributes and description. */
PF4SW.attributeRules = function(rules) {
  SWADE.attributeRules(rules);
  // No changes needed to the rules defined by base method
};

/* Defines the rules related to combat. */
PF4SW.combatRules = function(rules, armors, shields, weapons) {
  SWADE.combatRules(rules, armors, shields, weapons);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to basic character identity. */
PF4SW.identityRules = function(rules, races, concepts, deities) {
  SWADE.identityRules(rules, races, {}, concepts, deities);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to powers. */
PF4SW.arcaneRules = function(rules, arcanas, powers) {
  SWADE.arcaneRules(rules, arcanas, powers);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to character aptitudes. */
PF4SW.talentRules = function(
  rules, edges, features, goodies, hindrances, languages, skills
) {
  SWADE.talentRules
    (rules, edges, features, goodies, hindrances, languages, skills);
  // No changes needed to the rules defined by base method
};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
PF4SW.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Arcana')
    PF4SW.arcanaRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValueArray(attrs, 'Powers')
    );
  else if(type == 'Armor')
    PF4SW.armorRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Area'),
      QuilvynUtils.getAttrValue(attrs, 'Armor'),
      QuilvynUtils.getAttrValue(attrs, 'MinStr'),
      QuilvynUtils.getAttrValue(attrs, 'Weight')
    );
  else if(type == 'Concept')
    PF4SW.conceptRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Edge'),
      QuilvynUtils.getAttrValueArray(attrs, 'Skill')
    );
  else if(type == 'Deity')
    PF4SW.deityRules(rules, name);
  else if(type == 'Edge') {
    PF4SW.edgeRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValueArray(attrs, 'Type')
    );
    PF4SW.edgeRulesExtra(rules, name);
  } else if(type == 'Feature')
    PF4SW.featureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Goody')
    PF4SW.goodyRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Pattern'),
      QuilvynUtils.getAttrValue(attrs, 'Effect'),
      QuilvynUtils.getAttrValue(attrs, 'Value'),
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Hindrance') {
    PF4SW.hindranceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'Severity')
    );
    PF4SW.hindranceRulesExtra(rules, name);
  } else if(type == 'Language')
    PF4SW.languageRules(rules, name);
  else if(type == 'Power')
    PF4SW.powerRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Advances'),
      QuilvynUtils.getAttrValue(attrs, 'PowerPoints'),
      QuilvynUtils.getAttrValue(attrs, 'Range'),
      QuilvynUtils.getAttrValue(attrs, 'Description')
    );
  else if(type == 'Race') {
    PF4SW.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages')
    );
    PF4SW.raceRulesExtra(rules, name);
  } else if(type == 'Shield')
    PF4SW.shieldRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Parry'),
      QuilvynUtils.getAttrValue(attrs, 'Cover'),
      QuilvynUtils.getAttrValue(attrs, 'MinStr'),
      QuilvynUtils.getAttrValue(attrs, 'Weight')
    );
  else if(type == 'Skill')
    PF4SW.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Attribute'),
      QuilvynUtils.getAttrValue(attrs, 'Core')
    );
  else if(type == 'Weapon')
    PF4SW.weaponRules(rules, name,
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
PF4SW.arcanaRules = function(rules, name, skill, powers) {
  SWADE.arcanaRules(rules, name, skill);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with armor #name#, which covers the
 * body areas listed in #areas#, adds #armor# to the character's Toughness,
 * requires a strength of #minStr# to use effectively, and weighs #weight#.
 */
PF4SW.armorRules = function(rules, name, areas, armor, minStr, weight) {
  SWADE.armorRules
    (rules, name, ['Victorian'], areas, armor, minStr, weight);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with concept #name#. #attributes#,
 * #edges#, and #skills# list the names of attributes, edges, and skills
 * associated with the concept.
 */
PF4SW.conceptRules = function(rules, name, attributes, edges, skills) {
  SWADE.conceptRules(rules, name, attributes, edges, skills); 
  // No changes needed to the rules defined by base method
};

/* Defines in #rules# the rules associated with deity #name#. */
PF4SW.deityRules = function(rules, name) {
  SWADE.deityRules(rules, name);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with edge #name#. #require# and
 * #implies# list any hard and soft prerequisites for the edge, and #types#
 * lists the categories of the edge.
 */
PF4SW.edgeRules = function(rules, name, requires, implies, types) {
  SWADE.edgeRules(rules, name, requires, implies, types);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with edge #name# that cannot be
 * derived directly from the attributes passed to edgeRules.
 */
PF4SW.edgeRulesExtra = function(rules, name) {
  if(name == 'Agency Promotion') {
    rules.defineRule
      ('featureNotes.agencyPromotion', 'edges.Agency Promotion', '=', null);
  } else if(name == 'Cat Eyes') {
    rules.defineRule('featureNotes.catEyes',
      '', '=', '"dim or dark"',
      'featureNotes.improvedCatEyes', '=', '"any"'
    );
  } else if(name == 'Celestial Kung Fu') {
    rules.defineRule('edgePoints', 'combatNotes.celestialKungFu', '+=', '1');
  } else if(name == 'Claws') {
    rules.defineRule('damageStep.Claws',
      'combatNotes.claws', '+=', '2',
      'combatNotes.improvedClaws', '+', '1'
    );
  } else if(name == 'Fan The Hammer') {
    rules.defineRule('combatNotes.fanTheHammer',
      '', '=', '-4',
      'combatNotes.improvedFanTheHammer', '+', '2'
    );
  } else if(name == 'Harrowed') {
    rules.defineRule('edgePoints', 'featureNotes.harrowed', '+=', '1');
  } else if(name == 'High Roller') {
    rules.defineRule('powerNotes.highRoller',
      '', '=', '1',
      'powerNotes.improvedHighRoller', '+', '1'
    );
  } else if(name == 'Ranger Promotion') {
    rules.defineRule
      ('featureRules.rangerPromotion', 'edges.Ranger Promotion', '=', null);
  } else if(name == "Stitchin'") {
    rules.defineRule("combatNotes.stitchin'",
      "features.Stitchin'", '=', '"dy"',
      "combatNotes.improvedStitchin'", '=', '"hr"'
    );
  } else if(name == 'Supernatural Attribute') {
    rules.defineRule('attributeNotes.supernaturalAttribute',
      'edges.Supernatural Attribute', '=', 'source * 2'
    );
  } else {
    SWADE.edgeRulesExtra(rules, name);
  }
};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
PF4SW.featureRules = function(rules, name, sections, notes) {
  SWADE.featureRules(rules, name, sections, notes);
  // No changes needed to the rules defined by base method
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
PF4SW.goodyRules = function(
  rules, name, pattern, effect, value, attributes, sections, notes
) {
  SWADE.goodyRules
    (rules, name, pattern, effect, value, attributes, sections, notes);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with hindrance #name#, which has
 * the list of hard prerequisites #requires# and level #severity# (Major or
 * Minor).
 */
PF4SW.hindranceRules = function(rules, name, requires, severity) {
  SWADE.hindranceRules(rules, name, requires, severity);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with hindrance #name# that cannot be
 * derived directly from the attributes passed to hindranceRules.
 */
PF4SW.hindranceRulesExtra = function(rules, name) {
  SWADE.hindranceRulesExtra(rules, name);
};

/* Defines in #rules# the rules associated with language #name#. */
PF4SW.languageRules = function(rules, name) {
  SWADE.languageRules(rules, name);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with power #name#, which may be
 * acquired only after #advances# advances, requires #powerPoints# Power Points
 * to use, and can be cast at range #range#. #description# is a concise
 * description of the power's effects.
 */
PF4SW.powerRules = function(
  rules, name, advances, powerPoints, range, description
) {
  SWADE.powerRules
    (rules, name, advances, powerPoints, range, description);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with race #name#, which has the list
 * of hard prerequisites #requires#. #features# list associated features and
 * #languages# any automatic languages.
 */
PF4SW.raceRules = function(rules, name, requires, features, languages) {
  SWADE.raceRules(rules, name, requires, features, languages);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
PF4SW.raceRulesExtra = function(rules, name) {
  if(name == 'Gnome') {
    rules.defineRule('powerPoints', 'magicRules.gnomeMagic', '+=', '1');
  }
};

/*
 * Defines in #rules# the rules associated with shield #name#, which adds
 * #parry# to the character's Parry, provides #cover# cover, requires #minStr#
 * to handle, and weighs #weight#.
 */
PF4SW.shieldRules = function(rules, name, parry, cover, minStr, weight) {
  SWADE.shieldRules
    (rules, name, ['Victorian'], parry, cover, minStr, weight);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * #attribute# (one of 'agility', 'spirit', etc.).
 */
PF4SW.skillRules = function(rules, name, attribute, core) {
  SWADE.skillRules(rules, name, attribute, core, []);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with weapon #name#, which belongs
 * to category #category#, requires #minStr# to use effectively, and weighs
 * #weight#. The weapon does #damage# HP on a successful attack. If specified,
 * the weapon bypasses #armorPiercing# points of armor. Also if specified, the
 * weapon can be used as a ranged weapon with a range increment of #range#
 * feet, firing #rateOfFire# per round. Parry, if specified, indicates the
 * parry bonus from wielding the weapon.
 */
PF4SW.weaponRules = function(
  rules, name, damage, minStr, weight, category, armorPiercing, range,
  rateOfFire, parry
) {
  SWADE.weaponRules(
    rules, name, ['Victorian'], damage, minStr, weight, category, armorPiercing,
    range, rateOfFire, parry
  );
  // No changes needed to the rules defined by base method
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
PF4SW.randomizeOneAttribute = function(attributes, attribute) {
  SWADE.randomizeOneAttribute.apply(this, [attributes, attribute]);
};

/* Returns an array of plugins upon which this one depends. */
PF4SW.getPlugins = function() {
  var result = [SWADE].concat(SWADE.getPlugins());
  return result;
};

/* Returns HTML body content for user notes associated with this rule set. */
PF4SW.ruleNotes = function() {
  return '' +
    '<h2>PF4SW Quilvyn Module Notes</h2>\n' +
    'PF4SW Quilvyn Module Version ' + PF4SW.VERSION + '\n' +
    '\n' +
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
    'Deadlands The Weird West © 2020 Pinnacle Entertainment Group.\n' +
    '</p>\n' +
    '<img alt="Savage Worlds Fan Logo" width="300" height="200" src="https://peginc.com/wp-content/uploads/2019/01/SW_LOGO_FP_2018.png"/>\n';
};
