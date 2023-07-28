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
/* globals ObjectViewer, Quilvyn, QuilvynRules, QuilvynUtils */
"use strict";

/*
 * This module loads the rules from the Savage Worlds Adventure Edition Fantasy
 * Companion. The SWADEFC function contains methods that load rules for
 * particular parts of the rules: ancestryRules for character ancestries,
 * arcaneRules for powers, etc. These member methods can be called
 * independently in order to use a subset of the SWADEFC rules. Similarly, the
 * constant fields of SWADE (SKILLS, EDGES, etc.) can be manipulated to modify
 * the choices.
 */
function SWADEFC(edition, rules) {
function SWADEFC(baseRules) {

  if(window.SWADE == null) {
    alert('The SWADEFC module requires use of the SWADE module');
    return;
  }

  var rules = new QuilvynRules('SWADE Fantasy', SWADEFC.VERSION);
  SWADEFC.rules = rules;

  rules.defineChoice('choices', SWADEFC.CHOICES);
  rules.choiceEditorElements = SWADEFC.choiceEditorElements;
  rules.choiceRules = SWADEFC.choiceRules;
  rules.editorElements = SWADE.initialEditorElements();
  rules.getFormats = SWADE.getFormats;
  rules.getPlugins = SWADEFC.getPlugins;
  rules.makeValid = SWADE.makeValid;
  rules.randomizeOneAttribute = SWADEFC.randomizeOneAttribute;
  rules.defineChoice('random', SWADEFC.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = SWADEFC.ruleNotes;

  SWADE.createViewers(rules, SWADE.VIEWERS);
  rules.defineChoice('extras',
    'edges', 'edgePoints', 'hindrances', 'sanityNotes', 'validationNotes'
  );
  rules.defineChoice('preset',
    'race:Ancestry,select-one,races', 'advances:Advances,text,4',
    'concepts:Concepts,set,concepts'
  );

  SWADEFC.attributeRules(rules);
  SWADEFC.combatRules
    (rules, SWADEFC.ARMORS, SWADEFC.SHIELDS, SWADEFC.WEAPONS);
  SWADEFC.arcaneRules(rules, SWADEFC.ARCANAS, SWADEFC.POWERS);
  SWADEFC.talentRules
    (rules, SWADEFC.EDGES, SWADEFC.FEATURES, SWADEFC.GOODIES,
     SWADEFC.HINDRANCES, SWADEFC.LANGUAGES, SWADEFC.SKILLS);
  SWADEFC.identityRules
    (rules, SWADEFC.RACES, SWADEFC.CONCEPTS, SWADEFC.DEITIES,
     SWADEFC.ALIGNMENTS);

  Quilvyn.addRuleSet(rules);

}

SWADEFC.VERSION = '2.3.1.0';

// Throughout the plugin we take steps to show 'Ancestry' to the user to match
// the rule book, but under the hood we use 'race' for the character attribute
// so that we can easily reuse SWADE rules.
SWADEFC.CHOICES =
  SWADE.CHOICES.map(x => x == 'Race' ? 'Ancestry' : x);
PF4SW.RANDOMIZABLE_ATTRIBUTES =
  SWADE.RANDOMIZABLE_ATTRIBUTES.map(x => x == 'race' ? 'ancestry' : x);

SWADEFC.ARCANAS = {
  'Civilization Domain':
    'Skill=Alchemy ' +
    'Powers=' +
      'Banish,"Beast Friend",Blast,Blind,"Boost/Lower Trait",Burst,Confusion,' +
      'Darksight,Deflection,"Detect/Conceal Arcana",Empathy,Entangle,' +
      '"Environmental Protection",Farsight,Fear,Fly,Growth/Shrink,Healing,' +
      'Intangibility,Invisibility,Light/Darkness,Protection,Puppet,Relief,' +
      'Resurrection,"Shape Change",Sloth/Speed,Slumber,Smite,' +
      '"Speak Language","Wall Walker","Warrior\'s Gift"',
  'Bard':
    'Skill=Performance ' +
    'Powers=' +
      '"Arcane Protection",Banish,"Beast Friend","Boost/Lower Trait",' +
      'Confusion,"Detect/Conceal Arcana",Dispel,Divination,' +
      '"Drain Power Points",Empathy,Fear,Healing,"Mind Link","Mind Reading",' +
      'Puppet,Relief,Sloth/Speed,Slumber,Smite,Sound/Silence,' +
      '"Speak Language",Stun,"Warrior\'s Gift"',
  'Diabolist':
    'Skill=Spellcasting ' +
    'Powers=' +
      '"Arcane Protection",Banish,Barrier,Blast,Blind,Bolt,"Lower Trait",' +
      'Burst,Confusion,Curse,"Damage Field",Darksight,Deflection,' +
      '"Detect/Conceal Arcana",Disguise,Dispel,Divination,' +
      '"Drain Power Points","Elemental Manipulation",Entangle,' +
      '"Environmental Protection",Farsight,Fear,Fly,Havoc,Illusion,' +
      '"Light/Darkness","Lock/Unlock",Locate,"Plane Shift",Protection,Puppet,' +
      'Scrying,Sloth/Speed,Smite,Sound/Silence,"Speak Language",' +
      '"Summon Ally",Telekinesis,Teleport,"Wall Walker","Warrior\'s Gift",' +
      'Zombie',
  'Druid':
    'Skill=Faith ' +
    'Powers=' +
      '"Beast Friend","Environmental Protetion","Shape Change",
  'Elementalist':
    'Skill=Spellcasting ' +
    'Powers=' +
      'Barrier,Blast,Bolt,Burrow,Burst,Confusion,"Damage Field",Deflection,' +
      'Divination,"Environmental Manipulation",Entangle,' +
      '"Environmental Protection",Fly,Havoc,Healing,"Plane Shift",Protection,' +
      'Relief,"Summon Monster",Telekinesis',
  'Illusionist':
    'Skill=Spellcasting ' +
    'Powers=' +
      'Confusion,Deflection,"Detect/Conceal Arcana",Disguise,Fear,Illusion,' +
      'Invisibility,Light/Darkness,Sound/Silence',
  'Necromancer':
    'Skill=Spellcasting ' +
    'Powers=' +
      '"Arcane Protection",Banish,Barrier,Blind,Bolt,"Boost/Lower Trait",' +
      'Confusion,Darksight,Deflection,"Detect/Conceal Arcana",Dispel,' +
      'Divination,"Drain Power Points",Empathy,Entangle,Farsight,Fear,Fly,' +
      'Havoc,Healing,Intangibility,Invisibility,Light/Darkness,' +
      'Lock/Unlock,"Mind Link","Mind Reading","Mind Wipe","Object Reading",' +
      'Protection,Relief,Resurrection,Sloth/Speed,Slumber,Smite,' +
      'Sound/Silence,Stun,"Summon Undead",Telekinesis,Teleport,"Wall Walker",' +
      '"Warrior\'s Gift",Zombie',
  'Shaman':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection",Banish,Barrier,"Beast Friend",Blast,Blessing,' +
      'Blind,Bolt,"Boost/Lower Trait",Burrow,Burst,Confusion,"Damage Field",' +
      'Darksight,Deflection,"Detect/Conceal Arcana",Disguise,Dispel,' +
      'Divination,"Drain Power Points","Environmental Manipulation",Empathy,' +
      'Entangle,"Environmental Protection",Farsight,Fear,Havoc,Healing,' +
      '"Mystic Intervention","Object Reading",Protection,Relief,Resurrection,' +
      '"Shape Change",Sloth/Speed,Slumber,Smite,Sound/Silence,' +
      '"Speak Language",Stun,"Summon Animal","Summon Monster","Wall Walker",' +
      '"Warrior\'s Gift"',
  'Sorcerer':
    'Skill=Spellcasting ' +
    'Powers=' +
      '"Arcane Protection",Banish,Barrier,"Beast Friend",Blast,Blessing,' +
      'Blind,Bolt,"Boost/Lower Trait",Burrow,Burst,Confusion,"Damage Field",' +
      'Darksight,Deflection,"Detect/Conceal Arcana",Disguise,Dispel,' +
      'Divination,"Drain Power Points","Elemental Manipulation",Empathy,' +
      'Entangle,"Environmental Protection",Farsight,Fear,Havoc,Healing,' +
      '"Mystic Intervention","Object Reading",Protection,Relief,Resurrection,' +
      '"Shape Change",Sloth/Speed,Slumber,Smite,Sound/Silence,' +
      '"Speak Language",Stun,"Summon Ally","Summon Animal","Summon Monster",' +
      '"Wall Walker","Warrior\'s Gift"',
  'Summoner':
    'Skill=Spellcasting ' +
    'Powers=' +
      '"Arcane Protection","Boost/Lower Trait",Burrow,Darksight,' +
      '"Detect/Conceal Arcana",Farsight,Fly,Growth/Shrink,Healing,Locate,' +
      '"Shape Change",Sloth/Speed,"Summon Ally","Summon Animal",' +
      '"Summon Monster","Wall Walker"',
  'Tinkerer':
    'Skill=Repair ' +
    'Powers=' +
      'Blind,Bolt,Blast,Burst,Confusion,"Damage Field",Darksight,' +
      '"Detect/Conceal Arcana",Entangle,"Environmental Protection",Farsight,' +
      'Fly,Light/Darkness,Lock/Unlock,Slumber,Stun,"Wall Walker"',
  'Warlock/Witch':
    'Skill=Spellcasting ' +
    'Powers=' +
      '"Arcane protection",Banish,Barrier,"Beast Friend",Blast,Blessing,' +
      'Blind,Bolt,"Boost/Lower Trait",Burrow,Burst,Confusion,"Conjure Item",' +
      'Curse,Darksight,Deflection,"Detect/Conceal Arcana",Disguise,Dispel,' +
      'Divination,"Drain Power Points","Elemental Manipulation",Empathy,' +
      'Entangle,"Environmental Protection",Farsight,Fear,Fly,Growth/Shrink,' +
      'Havoc,Healing,Illusion,Invisibility,Light/Darkness,Lock/Unlock,Locate,' +
      '"Mystic Intervention","Object Reading","Mind Reading","Mind Wipe",' +
      'Protection,Puppet,Relief,Scrying,"Shape Change",Sloth/Speed,Slumber,' +
      'Smite,Sound/Silence,"Speak Language",Stun,"Summon Ally",' +
      '"Summon Animal",Telekinesis,"Wall Walker,"Warrior\’s Gift",Wish',
  'WizardWitch':
    'Skill=Spellcasting ' +
    'Powers=' +
      '"Arcane protection",Barrier,"Beast Friend",Blast,Blind,Bolt,' +
      '"Boost/Lower Trait",Burrow,Burst,Confusion,"Conjure Item",Curse,' +
      '"Damage Field",Darksight,Deflection,"Detect/Conceal Arcana",Disguise,' +
      'Dispel,"Drain Power Points","Elemental Manipulation",Empathy,' +
      '"Environmental Protection",Entangle,Farsight,Fear,Fly,Growth/Shrink,' +
      'Havoc,Illusion,Intangibility,Invisibility,Light/Darkness,Locate,' +
      'Lock/Unlock,"Mind Reading","Mind Wipe","Mystic Intervention",' +
      '"Object Reading","Planar Binding","Plane Shift",Protection,Puppet,' +
      'Scrying,"Shape Change",Sloth/Speed,Slumber,Smite,"Speak Language",' +
      'Stun,"Summon Ally",Telekinesis,Teleport,"Time Stop","Wall Walker",' +
      '"Warrior\’s Gift",Wish,Zombie'
};
SWADEFC.ARMORS = {
  'None':'Area=Body Armor=0 MinStr=4 Weight=0',
  'Cloak With Hood':'Area=Torso,Head Armor=1 MinStr=d4 Weight=5',
  'Leggings':'Area=Legs Armor=1 MinStr=d4 Weight=5',
  'Tunic':'Area=Torso,Arms Armor=1 MinStr=d4 Weight=5',
  'Robe With Hooded Cloak':'Area=Torso,Arms,Head Armor=1 MinStr=d4 Weight=8',
  'Leather Tunic':'Area=Torso,Arms Armor=2 MinStr=d6 Weight=11',
  'Leather Jacket':'Area=Torso,Arms Armor=2 MinStr=d6 Weight=11',
  'Leather Leggings':'Area=Legs Armor=2 MinStr=d6 Weight=8',
  'Leather Cap':'Area=Head Armor=2 MinStr=d6 Weight=1',
  'Natural Shirt':'Area=Torso,Arms Armor=2 MinStr=d6 Weight=10',
  'Natural Leggings':'Area=Legs Armor=2 MinStr=d6 Weight=7',
  'Chain Shirt':'Area=Torso,Arms Armor=3 MinStr=d8 Weight=22',
  'Chain Leggings':'Area=Legs Armor=3 MinStr=d8 Weight=10',
  'Chain Hood':'Area=Legs Armor=3 MinStr=d8 Weight=3',
  'Pot Helm':'Area=Legs Armor=3 MinStr=d8 Weight=3',
  'Bronze Corselet':'Area=Torso Armor=3 MinStr=d8 Weight=13',
  'Bronze Greaves':'Area=Legs Armor=3 MinStr=d8 Weight=6',
  'Bronze Vambraces':'Area=Arms Armor=3 MinStr=d8 Weight=5',
  'Bronze Helmet':'Area=Arms Armor=3 MinStr=d8 Weight=6',
  'Breastplate':'Area=Torso Armor=4 MinStr=d10 Weight=30',
  'Greaves':'Area=Legs Armor=4 MinStr=d10 Weight=10',
  'Vambraces':'Area=Legs Armor=4 MinStr=d10 Weight=10',
  'Gauntlets':'Area=Arms Armor=4 MinStr=d10 Weight=10',
  'Heavy Helm':'Area=Head Armor=4 MinStr=d10 Weight=4',
  'Enclosed Heavy Helm':'Area=Head Armor=4 MinStr=d10 Weight=8'
};
SWADEFC.CONCEPTS = {
};
SWADEFC.DEITIES = {
};
SWADEFC.EDGES = {
};
SWADEFC.FEATURES = {
  // Ancestry
  'Additional Actions':'Section=feature Note="FILL"',
  'Animal Aversion':'Section=feature Note="FILL"',
  'Bite Or Claw':'Section=feature Note="FILL"',
  'Blood Drinker':'Section=feature Note="FILL"',
  'Boneheaded':'Section=feature Note="FILL"',
  'Breath Weapon':'Section=feature Note="FILL"',
  'Brutish':'Section=feature Note="FILL"',
  'Change Shape':'Section=feature Note="FILL"',
  'Cold Resistance':'Section=feature Note="FILL"',
  'Cold-Blooded':'Section=feature Note="FILL"',
  'Craven':'Section=feature Note="FILL"',
  'Cunning':'Section=feature Note="FILL"',
  'Darkvision':'Section=feature Note="FILL"',
  'Devilish Nature':'Section=feature Note="FILL"',
  'Diminutive':'Section=feature Note="FILL"',
  'Environmental Resistance (Air)':'Section=feature Note="FILL"',
  'Environmental Resistance (Earth)':'Section=feature Note="FILL"',
  'Environmental Resistance (Fire)':'Section=feature Note="FILL"',
  'Environmental Resistance (Heat)':'Section=feature Note="FILL"',
  'Environmental Resistance (Water)':'Section=feature Note="FILL"',
  'Hardened':'Section=feature Note="FILL"',
  'Hive Minded':'Section=feature Note="FILL"',
  'Hooves':'Section=feature Note="FILL"',
  'Ill-Tempered':'Section=feature Note="FILL"',
  'Inner Air':'Section=feature Note="FILL"',
  'Natural Resistance':'Section=feature Note="FILL"',
  'Pace +4':'Section=feature Note="FILL"',
  'Phobia (Cats)':'Section=feature Note="FILL"',
  'Reduced Core Skills':'Section=feature Note="FILL"',
  'Rock Solid':'Section=feature Note="FILL"',
  'Short':'Section=feature Note="FILL"',
  'Size +2':'Section=feature Note="FILL"',
  'Size +3':'Section=feature Note="FILL"',
  'Sneaky':'Section=feature Note="FILL"',
  'Sunlight Sensitivity':'Section=feature Note="FILL"',
  'Survivors':'Section=feature Note="FILL"',
  'Uneducated':'Section=feature Note="FILL"',
  'Unimposing':'Section=feature Note="FILL"',
  'Unnatural Strength':'Section=feature Note="FILL"',
  'Unusual Body Shape':'Section=feature Note="FILL"',
  'Unusual Form':'Section=feature Note="FILL"',
  'Venomous Bite':'Section=feature Note="FILL"',
  'Very Strong':'Section=feature Note="FILL"',
  'Very Tough':'Section=feature Note="FILL"'
};
SWADEFC.HINDRANCES = {
};
SWADEFC.POWERS = {
};
SWADEFC.RACES = {
  'Celestial':
    'Features=' +
      'Flight,Attractive,"Code Of Honor+",Vow+',
  'Centaur':
    'Features=' +
      'Dependency,Hooves,"Size +1","Pace +4","Unusual Form"',
  'Dragonfolk':
    'Features=' +
      '"Armor +2",Bite,Claws,"Breath Weapon",Cold-Blooded,' +
      '"Environmental Resistance (Heat)","Environmental Weakness (Cold)",' +
      'Ill-Tempered',
  'Elemental Scion':
    'Features=' +
      '"features.Air Scion ? Environmental Resistance (Air)",' +
      '"features.Earth Scion ? Environmental Resistance (Earth)",' +
      '"features.Fire Scion ? Environmental Resistance (Fire)",' +
      '"features.Water Scion ? Environmental Resistance (Water)",' +
      '"features.Water Scion ? Aquatic",' +
      '"features.Air Scion ? Inner Air",' +
      'Outsider,' +
      '"features.Fire Scion ? Quick",' +
      '"features.Earth Scion ? Rock Solid"',
  'Fairies':
    'Features=' +
      '"All Thumbs","Big Mouth",Curious+,Flight,Impulsive+,Diminutive',
  'Gnome':
    'Features=' +
      'Cunning,"Low Light Vision","Keen Senses","Size -1","Reduced Pace"',
  'Goblin':
    'Features=' +
      'Infravision,Mean,Short,Sneaky,Survivors',
  'Golem':
    'Features=' +
      '"Armor +2",Big,Clueless+,Clumsy+,Construct,"No Vital Organs",' +
      '"Reduced Core Skills","Reduced Pace","Size +2"',
  'Graveborn':
    'Features=' +
      '"Animal Aversion",Bite,"Blood Drinker","Low Light Vision",Outsider+,' +
      '"Sunlight Sensitivity","Unnatural Strength","Cold Resistance"',
  'Half-Giant':
    'Features=' +
      'Big,Boneheaded,Clueless+,Illiterate,Outsider+,"Size +3","Very Strong",' +
      '"Very Tough"',
  'Half-Orc':
    'Features=' +
      'Infravision,Outsider,Hardened',
  'Infernal':
    'Features=' +
      'Darkvision,"Devilish Nature","Environmental Resistance (Heat)",' +
      '"Environmental Weakness (Cold)",Horns,Outsider',
  'Insectoid':
    'Features=' +
      '"Additional Actions","Armor +2","Hive Minded","Bite Or Claw",Outsider,' +
      '"Unusual Body Shape","Wall Walker"',
  'Minotaur':
    'Features=' +
      '"Thin Skinned","Size +1","Very Strong",Horns,Uneducated,Tough,Big,Mean',
  'Mouseling':
    'Features=' +
      'Diminutive,"Low Light Vision",Outsider+,"Phobia (Cats)",' +
      '"Reduced Pace",Unimposing',
  'Ogre':
    'Features=' +
      'Arrogant+,Big,Clueless+,Clumsy+,Outsider,Hardy,"Size +1",' +
      '"Very Strong","Very Tough"',
  'Orc':
    'Features=' +
      'Brutish,Infravision,Outsider+,"Size +1",Strong,Tough',
  'Ratling':
    'Features=' +
      'Bite,Claws,"Natural Resistance","Low Light Vision",Scavenger,' +
      '"Size -1",Outsider+,Craven,Greedy',
  'Serpentfolk':
    'Features=' +
      'Bite,Cold-Blooded,"Environmental Weakness (Cold)",Infravision,Pace,' +
      '"Venomous Bite",Outsider',
  'Shapeshifter':
    'Features=' +
      'Charismatic,"Change Shape",Secret'
};
SWADEFC.SHIELDS = {
  'None':'Parry=0 Cover=0 MinStr=0 Weight=0',
  'Small Shield':'Parry=1 Cover=0 MinStr=6 Weight=4',
  'Medium Shield':'Parry=2 Cover=2 MinStr=8 Weight=8',
  'Large Shield':'Parry=2 Cover=4 MinStr=10 Weight=12'
};
SWADEFC.SKILLS = {
};
SWADEFC.WEAPONS = {
};

/* Defines rules related to powers. */
SWADEFC.arcaneRules = function(rules, arcanas, powers) {
  SWADE.arcaneRules(rules, arcanas, powers);
};

/* Defines the rules related to combat. */
SWADEFC.combatRules = function(rules, armors, shields, weapons) {
  SWADE.combatRules(rules, armors, shields, weapons);
};

/* Defines rules related to basic character identity. */
SWADEFC.identityRules = function(rules, races, concepts, deitys) {
  SWADE.identityRules(rules, races, concepts, deitys);
};

/* Defines rules related to character aptitudes. */
SWADEFC.talentRules = function(
  rules, edges, features, goodies, hindrances, skills
) {
  SWADE.talentRules(rules, edges, features, goodies, hindrances, {}, skills);
};

/*
 * Defines in #rules# the rules associated with edge #name# that cannot be
 * derived directly from the attributes passed to edgeRules.
 */
SWADEFC.edgeRulesExtra = function(rules, name) {
};

/*
 * Defines in #rules# the rules associated with hindrance #name# that cannot be
 * derived directly from the attributes passed to hindranceRules.
 */
SWADEFC.hindranceRulesExtra = function(rules, name) {
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
SWADEFC.raceRulesExtra = function(rules, name) {
};

/* Returns HTML body content for user notes associated with this rule set. */
SWADEFC.ruleNotes = function() {
  return '' +
    '<h2>SWADE Fantasy Companion Quilvyn Module Notes</h2>\n' +
    'SWADE Fantasy Companion Quilvyn Module Version ' + SWADEFC.VERSION + '\n' +
    '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Major hindrances are noted by a "+" after the name. For example,\n' +
    '    "Greedy" is a minor hindrance and "Greedy+" a major one.\n' +
    '  </li><li>\n' +
    '    Common power modifiers (Lingering Damage, Selective, etc.) are not\n' +
    '    included in power descriptions\n' +
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
