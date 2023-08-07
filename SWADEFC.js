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
    (rules, SWADEFC.ANCESTRIES, SWADEFC.CONCEPTS, SWADEFC.DEITIES,
     SWADEFC.ALIGNMENTS);

  Quilvyn.addRuleSet(rules);

}

SWADEFC.VERSION = '2.3.1.0';

// Throughout the plugin we take steps to show 'Ancestry' to the user to match
// the rule book, but under the hood we use 'race' for the character attribute
// so that we can easily reuse SWADE rules.
SWADEFC.CHOICES =
  SWADE.CHOICES.map(x => x == 'Race' ? 'Ancestry' : x);
SWADEFC.RANDOMIZABLE_ATTRIBUTES =
  SWADE.RANDOMIZABLE_ATTRIBUTES.map(x => x == 'race' ? 'ancestry' : x);

SWADEFC.ANCESTRIES_ADDED = {
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
      '"features.Earth Scion ? Rock Solid" ' +
    'Selectables=' +
      '"1:Air Scion:Element","1:Earth Scion:Element","1:Fire Scion:Element",' +
      '"1:Water Scion:Element"',
  'Fairy':
    'Features=' +
      '"All Thumbs","Big Mouth",Curious+,Flight,Impulsive+,"Diminutive (Tiny)"',
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
      '"Diminutive (Tiny)","Low Light Vision",Outsider+,"Phobia (Cats)",' +
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
SWADEFC.ANCESTRIES = Object.assign({}, SWADE.RACES, SWADEFC.ANCESTRIES_ADDED);
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
      '"Beast Friend","Environmental Protetion","Shape Change"',
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
      '"Summon Animal",Telekinesis,"Wall Walker","Warrior\’s Gift",Wish',
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
  'Cloak With Hood':'Area=Torso,Head Armor=1 MinStr=4 Weight=5',
  'Leggings':'Area=Legs Armor=1 MinStr=4 Weight=5',
  'Tunic':'Area=Torso,Arms Armor=1 MinStr=4 Weight=5',
  'Robe With Hooded Cloak':'Area=Torso,Arms,Head Armor=1 MinStr=4 Weight=8',
  'Leather Tunic':'Area=Torso,Arms Armor=2 MinStr=6 Weight=11',
  'Leather Jacket':'Area=Torso,Arms Armor=2 MinStr=6 Weight=11',
  'Leather Leggings':'Area=Legs Armor=2 MinStr=6 Weight=8',
  'Leather Cap':'Area=Head Armor=2 MinStr=6 Weight=1',
  'Natural Shirt':'Area=Torso,Arms Armor=2 MinStr=6 Weight=10',
  'Natural Leggings':'Area=Legs Armor=2 MinStr=6 Weight=7',
  'Chain Shirt':'Area=Torso,Arms Armor=3 MinStr=8 Weight=22',
  'Chain Leggings':'Area=Legs Armor=3 MinStr=8 Weight=10',
  'Chain Hood':'Area=Legs Armor=3 MinStr=8 Weight=3',
  'Pot Helm':'Area=Legs Armor=3 MinStr=8 Weight=3',
  'Bronze Corselet':'Area=Torso Armor=3 MinStr=8 Weight=13',
  'Bronze Greaves':'Area=Legs Armor=3 MinStr=8 Weight=6',
  'Bronze Vambraces':'Area=Arms Armor=3 MinStr=8 Weight=5',
  'Bronze Helmet':'Area=Arms Armor=3 MinStr=8 Weight=6',
  'Breastplate':'Area=Torso Armor=4 MinStr=10 Weight=30',
  'Greaves':'Area=Legs Armor=4 MinStr=10 Weight=10',
  'Vambraces':'Area=Legs Armor=4 MinStr=10 Weight=10',
  'Gauntlets':'Area=Arms Armor=4 MinStr=10 Weight=10',
  'Heavy Helm':'Area=Head Armor=4 MinStr=10 Weight=4',
  'Enclosed Heavy Helm':'Area=Head Armor=4 MinStr=10 Weight=8'
};
SWADEFC.CONCEPTS_ADDED = {
};
SWADEFC.CONCEPTS = Object.assign(Object.fromEntries(Object.entries(SWADE.CONCEPTS).filter(([k, v]) => !v.includes('Arcane Background'))), SWADEFC.CONCEPTS_ADDED);
SWADEFC.DEITIES = {
};
SWADEFC.EDGES_ADDED = {
  'Arcane Resistance':'Type=background Require="spirit>=8"',
  'Improved Arcane Resistance':
    'Type=background Require="features.Arcane Resistance"',
  'Chosen':'Type=background',
  'Fey Blood':'Type=background',
  'Favored Enemy':
    'Type=background ' +
    'Require="skills.Athletics>=6 || skills.Fighting>=6 || skills.Shooting>=6"',
  'Favored Terrain':'Type=background Require="skills.Survival>=6"',
  'Heirloom':'Type=background',
  'Charge':'Type=combat Require="advances>=4","skills.Fighting>=8"',
  'Close Fighting':'Type=combat Require="agility>=8","skills.Fighting>=8"',
  'Improved Close Fighting':
    'Type=combat Require="advances>=8","features.Close Fighting"',
  'Defender':'Type=combat Require="advances>=4","skills.Fighting>=6"',
  'Dirty Fighter':'Type=combat Require="advances>=4"',
  'Really Dirty Fighter':
    'Type=combat Require="advances>=4","feature.Dirty Fighter"',
  'Double Shot':
    'Type=combat ' +
    'Require="advances>=4","skills.Athletics>=8 || skills.Shooting>=8"',
  'Improved Double Shot':
    'Type=combat ' +
    'Require=' +
      '"advances>=12",' +
      '"features.Double Shot",' +
      '"skills.Athletics>=10 || skills.Shooting>=10"',
  'Formation Fighter':'Type=combat Require="skills.Fighting>=8"',
  'Shield Wall':
    'Type=combat Require="features.Formation Fighter","skills.Fighting>=8"',
  'Martial Flexibility':
    'Type=combat Require="advances>=4","skills.Fighting>=8"',
  'Missile Deflection':
    'Type=combat Require="advances>=12","skills.Fighting>=10"',
  'Opportunistic':'Type=combat Require="advances>=8"',
  'Roar':'Type=combat Require="advances>=4","spirit>=8"',
  'Savagery':'Type=combat Require="skills.Fighting>=6"',
  'Scorch':
    'Type=combat Require="advances>=4","vigor>=8","features.Breath Weapon"',
  'Sneak Attack':'Type=combat Require="advances>=4","features.Assassin"',
  'Improved Sneak Attack':
    'Type=combat Require="advances>=8","features.Sneak Attack"',
  'Stunning Blow':'Type=combat Require="advances>=4","strength>=8"',
  'Sunder':'Type=combat Require="strength>=8"',
  'Take The Hit':
    'Type=combat Require="advances>=4","features.Iron Jaw","vigor>=10"',
  'Trick Shot':
    'Type=combat ' +
    'Require="advances>=4","skills.Athletics>=8 || skills.Shooting>=8"',
  'Uncanny Reflexes':
    'Type=combat Require="advances>=8","agility>=8","skills.Athletics>=8"',
  'Wing Gust':'Type=combat Require="advances>=4","features.Wings"',
  'Artificer':'Type=power Require="advances>=4","powerPoints>0"',
  'Master Artificer':
    'Type=power ' +
    'Require="advances>=12","features.Artificer","skills.Occult>=10"',
  'Battle Magic':
    'Type=power Require="advances>=8","powerPoints>0","arcaneSkill>=10"',
  // NOTE: Also requires "evil disposition"
  'Blood Magic':'Type=power Require="powerPoints>0"',
  'Epic Mastery':
    'Type=power Require="advances>=8","powerPoints>0","arcaneSkill>=6"',
  'Familiar':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Diabolist) || ' +
       'features.Arcane Background (Druid) || ' +
       'features.Arcane Background (Elementalist) || ' +
       'features.Arcane Background (Necromancer) || ' +
       'features.Arcane Background (Shaman) || ' +
       'features.Arcane Background (Sorcerer) || ' +
       'features.Arcane Background (Warlock/Witch) || ' +
       'features.Arcane Background (Wizard)"',
  'Favored Power':
    'Type=power Require="advances>=4","powerPoints>0","arcaneSkill>=8"',
  'Mystic Powers (Barbarian)':
    'Type=power Require="advances>=4","strength>=8"',
  'Mystic Powers (Fighter)':
    'Type=power Require="advances>=4","skills.Fighting>=8"',
  'Mystic Powers (Monk)':
    'Type=power Require="advances>=4","skills.Athletics>=8"',
  'Mystic Powers (Paladin)':
    'Type=power Require="advances>=4","spirit>=8"',
  'Mystic Powers (Ranger)':
    'Type=power Require="advances>=4","skills.Survival>=8"',
  'Mystic Powers (Rogue)':
    'Type=power Require="advances>=4","skills.Thievery>=8"',
  'Silent Caster':
    'Type=power Require="powerPoints>=0","features.Bard==0","skills.Occult>=8"',
  'Transfer':'Type=power Require="powerPoints>=0"',
  'Born In The Saddle':
    'Type=professional Require="agility>=8","skills.Riding>=6"',
  'Explorer':'Type=professional Require="vigor>=6","skills.Survival>=8"',
  'Knight':
    'Type=professional ' +
    'Require=' +
      '"spirit>=6",' +
      '"strength>=8",' +
      '"vigor>=8",' +
      '"skills.Fighting>=8",' +
      '"skills.Riding>=6",' +
      '"features.Obligation+"',
  'Mount':'Type=professional Require="skills.Riding>=6"',
  'Poisoner':
    'Type=professional ' +
    'Require="skills.Alchemy>=6 || skills.Healing>=6 || skills.Survival>=6"',
  'Scout':'Type=professional Require="skills.Survival>=6"',
  'Stonecunning':'Type=professional Require="skills.Repair>=6"',
  'Trap Sense':'Type=professional Require="advances>=4","skills.Repair>=6"',
  'Treasure Hunter':
    'Type=professional Require="skills.Notice>=8","skills.Occult>=8"',
  'Troubador':
    'Type=professional ' +
    'Require="skills.Common Knowledge>=6","skills.Perfromance>=8"',
  'Deceptive':'Type=social Require="advances>=4","smarts>=8"',
  'Aura Of Courage':'Type=weird Require="spirit>=8"',
  'Beast Talker':'Type=weird',
  'Rapid Change':'Type=weird Require="features.Lycanthropy"',
  'Home Ground':
    'Type=legendary Require="advances>=16","spirit>=8","powerPoints>=0"',
  'Relic':'Type=legendary',
  'Unstoppable':
    'Type=legendary ' +
    'Require="vigor>=10","features.Iron Jaw","features.Nerves Of Steel"',
  'Warband':
    'Type=legendary ' +
    'Require="features.Command","sumLeadershipEdges>=3","features.Followers"',
  // Arcane Backgrounds
  'Arcane Background (Alchemist)':'Type=background',
  'Arcane Background (Bard)':'Type=background',
  'Arcane Background (Cleric)':'Type=background',
  'Arcane Background (Diabolist)':'Type=background',
  'Arcane Background (Druid)':'Type=background',
  'Arcane Background (Elementalist)':'Type=background',
  'Arcane Background (Illusionist)':'Type=background',
  'Arcane Background (Necromancer)':'Type=background',
  'Arcane Background (Shaman)':'Type=background',
  'Arcane Background (Sorcerer)':'Type=background',
  'Arcane Background (Summoner)':'Type=background',
  'Arcane Background (Tinkerer)':'Type=background',
  'Arcane Background (Warlock/Witch)':'Type=background',
  'Arcane Background (Wizard)':'Type=background'
};
SWADEFC.EDGES = Object.assign(Object.fromEntries(Object.entries(SWADE.EDGES).filter(([k, v]) => !k.includes('Arcane Background'))), SWADEFC.EDGES_ADDED);
SWADEFC.FEATURES_ADDED = {
  // Ancestry
  'Additional Actions':
    'Section=combat Note="Use of limbs reduces multi-action penalty by 2"',
  'Animal Aversion':
    'Section=skill ' +
    'Note="Animals keep 5\\" distance/-2 to control or ride animals"',
  'Bite Or Claw':
    'Section=combat Note="Mandibles or pincers inflict Bite or Claw damage"',
  'Blood Drinker':
    'Section=feature ' +
    'Note="May drink humanoid blood to gain a natural healing roll 1/session"',
  'Boneheaded':'Section=attribute Note="-1 Smarts"',
  'Breath Weapon':
    'Section=combat Note="Cone or R12\' line inflicts 2d6 fire damage"',
  'Brutish':'Section=attribute Note="-1 Smarts"',
  'Change Shape':
    'Section=feature,power ' +
    'Note=' +
      '"Has Arcane Background (Gifted) feature",' +
      '"May use <i>Disguise</i> as a free action to change own appearance"',
  'Cold Resistance':
    'Section=feature Note="Has Environmental Resistance (Cold) feature"',
  'Cold-Blooded':
    'Section=attribute ' +
    'Note="10 min in 60F/18C environment inflicts -1 Agility, Strength, and Vigor"',
  'Craven':'Section=feature Note="Has Yellow feature"',
  'Cunning':'Section=attribute Note="+1 Smarts step"',
  'Darkvision':'Section=feature Note="R10\' Ignore illumination penalties"',
  'Devilish Nature':'Section=skill Note="+1 Intimidation"',
  'Diminutive (Tiny)':
    'Section=attribute,combat,combat,combat,feature,power ' +
    'Note=' +
      '"Strength may not exceed d4",' +
      '"-2 Toughness",' +
      '"-2 all damage",' +
      '"Armor minimum strength is d4",' +
      '"Armor cost and weight is 1/4 normal",' +
      '"Powers inflict -2 damage"',
  'Environmental Resistance (Air)':
    'Section=combat Note="-4 damage from air effects/+4 vs. air effects"',
  'Environmental Resistance (Earth)':
    'Section=combat Note="-4 damage from earth effects/+4 vs. earth effects"',
  'Environmental Resistance (Fire)':
    'Section=combat Note="-4 damage from fire effects/+4 vs. fire effects"',
  'Environmental Resistance (Heat)':
    'Section=combat ' +
    'Note="-4 damage from heat and fire/+4 vs. heat and fire effects"',
  'Environmental Resistance (Water)':
    'Section=combat Note="-4 damage from cold effects/+4 vs. cold effects"',
  'Hardened':'Section=feature Note="+2 Attribute Points (Strength or Vigor)"',
  'Hive Minded':
    'Section=feature Note="Has Driven+ and Loyal features wrt colony"',
  'Hooves':'Section=combat Note="Hooves are a natural weapon"',
  'Ill-Tempered':'Section=feature Note="Has Arrogant+ hindrance"',
  'Inner Air':'Section=feature Note="Does not need to breathe"',
  'Natural Resistance':'Section=combat Note="Immune to poison and disease"',
  'Pace':'Section=combat Note="+2 Pace step/+2 Run step"',
  'Pace +4':'Section=combat Note="+2 Pace step"',
  'Phobia (Cats)':
    'Section=feature Note="Suffers -1 on trait rolls in the presence of cats"',
  'Reduced Core Skills':
    'Section=skill ' +
    'Note="-1 Common Knowledge step/-1 Persuasion step/-1 Stealth step"',
  'Rock Solid':'Section=attribute Note="+1 Vigor step"',
  'Short':'Section=combat,description Note="-1 Toughness","-1 Size"',
  'Size +2':'Section=combat,feature Note="+2 Toughness","Weighs 900 lb"',
  'Size +3':'Section=combat,feature Note="+3 Toughness","10\' tall"',
  'Sneaky':'Section=skill Note="+1 Stealth step"',
  'Sunlight Sensitivity':
    'Section=combat Note="Suffers Distraction in sunlight or equivalent"',
  'Survivors':'Section=feature Note="+1 Edge Points"',
  'Uneducated':'Section=attribute Note="-1 Smarts"',
  'Unimposing':'Section=feature Note="Has Mild Mannered features"',
  'Unnatural Strength':'Section=attribute Note="+1 Strength step"',
  'Unusual Body Shape':
    'Section=feature Note="Cannot use standard armor or furnishings"',
  'Unusual Form':
    'Section=feature Note="Cannot ride mounts or use normal armor"',
  'Venomous Bite':'Section=combat Note="Bite inflicts Mild Poison (Vigor neg)"',
  'Very Strong':'Section=feature Note="+2 Strength step"',
  'Very Tough':'Section=feature Note="+2 Vigor step"',
  // Edges
  'Arcane Resistance':'Section=feature Note="FILL"',
  'Artificer':'Section=feature Note="FILL"',
  'Aura Of Courage':'Section=feature Note="FILL"',
  'Battle Magic':'Section=feature Note="FILL"',
  'Beast Talker':'Section=feature Note="FILL"',
  'Blood Magic':'Section=feature Note="FILL"',
  'Born In The Saddle':'Section=feature Note="FILL"',
  'Charge':'Section=feature Note="FILL"',
  'Chosen':'Section=feature Note="FILL"',
  'Close Fighting':'Section=feature Note="FILL"',
  'Deceptive':'Section=feature Note="FILL"',
  'Defender':'Section=feature Note="FILL"',
  'Dirty Fighter':'Section=feature Note="FILL"',
  'Double Shot':'Section=feature Note="FILL"',
  'Epic Mastery':'Section=feature Note="FILL"',
  'Explorer':'Section=feature Note="FILL"',
  'Familiar':'Section=feature Note="FILL"',
  'Favored Enemy':'Section=feature Note="FILL"',
  'Favored Power':'Section=feature Note="FILL"',
  'Favored Terrain':'Section=feature Note="FILL"',
  'Fey Blood':'Section=feature Note="FILL"',
  'Formation Fighter':'Section=feature Note="FILL"',
  'Heirloom':'Section=feature Note="FILL"',
  'Home Ground':'Section=feature Note="FILL"',
  'Improved Arcane Resistance':'Section=feature Note="FILL"',
  'Improved Close Fighting':'Section=feature Note="FILL"',
  'Improved Double Shot':'Section=feature Note="FILL"',
  'Improved Sneak Attack':'Section=feature Note="FILL"',
  'Knight':'Section=feature Note="FILL"',
  'Martial Flexibility':'Section=feature Note="FILL"',
  'Master Artificer':'Section=feature Note="FILL"',
  'Missile Deflection':'Section=feature Note="FILL"',
  'Mount':'Section=feature Note="FILL"',
  'Mystic Powers (Barbarian)':'Section=feature Note="FILL"',
  'Mystic Powers (Fighter)':'Section=feature Note="FILL"',
  'Mystic Powers (Monk)':'Section=feature Note="FILL"',
  'Mystic Powers (Paladin)':'Section=feature Note="FILL"',
  'Mystic Powers (Ranger)':'Section=feature Note="FILL"',
  'Mystic Powers (Rogue)':'Section=feature Note="FILL"',
  'Opportunistic':'Section=feature Note="FILL"',
  'Poisoner':'Section=feature Note="FILL"',
  'Rapid Change':'Section=feature Note="FILL"',
  'Really Dirty Fighter':'Section=feature Note="FILL"',
  'Relic':'Section=feature Note="FILL"',
  'Roar':'Section=feature Note="FILL"',
  'Savagery':'Section=feature Note="FILL"',
  'Scorch':'Section=feature Note="FILL"',
  'Scout':'Section=feature Note="FILL"',
  'Shield Wall':'Section=feature Note="FILL"',
  'Silent Caster':'Section=feature Note="FILL"',
  'Sneak Attack':'Section=feature Note="FILL"',
  'Stonecunning':'Section=feature Note="FILL"',
  'Stunning Blow':'Section=feature Note="FILL"',
  'Sunder':'Section=feature Note="FILL"',
  'Take The Hit':'Section=feature Note="FILL"',
  'Transfer':'Section=feature Note="FILL"',
  'Trap Sense':'Section=feature Note="FILL"',
  'Treasure Hunter':'Section=feature Note="FILL"',
  'Trick Shot':'Section=feature Note="FILL"',
  'Troubador':'Section=feature Note="FILL"',
  'Uncanny Reflexes':'Section=feature Note="FILL"',
  'Unstoppable':'Section=feature Note="FILL"',
  'Warband':'Section=feature Note="FILL"',
  'Wing Gust':'Section=feature Note="FILL"',
  // Hindrances
  'Amorous':'Section=skill Note="-2 on Tests vs. Attractive character"',
  'Arcane Sensitivity':'Section=attribute Note="-2 to resist powers"',
  'Arcane Sensitivity+':'Section=feature Note="-4 to resist powers"',
  'Armor Interference':
    'Section=feature,power ' +
    'Note=' +
      '"Cannot use arcane edge features in medium or heavy armor",' +
      '"-4 arcane skill rolls in medium or heavy armor"',
  'Armor Interference':
    'Section=feature,power ' +
    'Note=' +
      '"Cannot use arcane edge features in any armor",' +
      '"-4 arcane skill rolls in any armor"',
  'Blunderer+':
    'Section=skill ' +
    'Note="Skill die of 1 inflicts critical failure on chosen central skill"',
  'Corruption+':
    'Section=skill ' +
    'Note=' +
      '"Critical failure on arcane skill inflicts additional or increased hindrance until next advance"',
  'Cursed+':
    'Section=power ' +
    'Note="Ally and self suffer -2 arcane skill to to aid self; critical failure stuns"',
  'Doomed+':'Section=attribute Note="-2 Vigor (soak)"',
  'Grim':'Section=feature Note="FILL"',
  'Idealistic':
    'Section=feature Note="Approaches moral dilemmas with absolute thinking"',
  'Jingoistic':
    'Section=combat,skill ' +
    'Note=' +
      '"Command edges do not effect allies from other cultures",' +
      '"-2 Persuasion (other cultures)"',
  'Jingoistic+':
    'Section=combat,skill ' +
    'Note=' +
      '"Command edges do not effect allies from other cultures",' +
      '"-4 Persuasion (other cultures)"',
  'Material Components+':
    'Section=power ' +
    'Note="-4 arcane skill rolls when materials are not available/Critical failure exhausts materials"',
  'Selfless':'Section=feature Note="Puts others first"',
  'Selfless+':'Section=feature Note="Always puts others first"',
  'Talisman':
    'Section=power ' +
    'Note="-1 arcane skill rolls when talisman not available/Critical failure inflicts Stunned"',
  'Talisman+':
    'Section=power ' +
    'Note="-2 arcane skill rolls when talisman not available/Critical failure inflicts Stunned"'
};
SWADEFC.FEATURES = Object.assign({}, SWADE.FEATURES, SWADEFC.FEATURES_ADDED);
SWADEFC.HINDRANCES_ADDED = {
  'Amorous':'Severity=Minor',
  'Arcane Sensitivity':
    'Require="features.Arcane Sensitivity+ == 0" Severity=Minor',
  'Arcane Sensitivity+':
    'Require="features.Arcane Sensitivity == 0" Severity=Major',
  'Armor Interference':
    'Require="features.Armor Interference+ == 0" Severity=Minor',
  'Armor Interference+':
    'Require="features.Armor Interference == 0" Severity=Major',
  'Blunderer+':'Severity=Major',
  'Corruption+':'Severity=Major',
  'Cursed+':'Severity=Major',
  'Doomed+':'Severity=Major',
  'Grim':'Severity=Minor',
  'Idealistic':'Severity=Minor',
  'Jingoistic':'Require="features.Jingoistic+ == 0" Severity=Minor',
  'Jingoistic+':'Require="features.Jingoistic == 0" Severity=Major',
  'Material Components+':'Severity=Major',
  'Selfless':'Require="features.Selfless+ == 0" Severity=Minor',
  'Selfless+':'Require="features.Selfless == 0" Severity=Major',
  'Talisman':'Require="features.Talisman+ == 0" Severity=Minor',
  'Talisman+':'Require="features.Talisman == 0" Severity=Major',
};
SWADEFC.HINDRANCES =
  Object.assign({}, SWADE.HINDRANCES, SWADEFC.HINDRANCES_ADDED);
SWADEFC.POWERS_ADDED = {
};
SWADEFC.POWERS = Object.assign({}, SWADE.POWERS, SWADEFC.POWERS_ADDED);
SWADEFC.SHIELDS = {
  'None':'Parry=0 Cover=0 MinStr=0 Weight=0',
  'Small Shield':'Parry=1 Cover=0 MinStr=6 Weight=4',
  'Medium Shield':'Parry=2 Cover=2 MinStr=8 Weight=8',
  'Large Shield':'Parry=2 Cover=4 MinStr=10 Weight=12'
};
SWADEFC.SKILLS_ADDED = {
  'Alchemy':'Attribute=smarts'
};
SWADEFC.SKILLS = Object.assign(Object.fromEntries(Object.entries(SWADE.SKILLS).filter(([k, v]) => !v.includes('Era') || v.match(/Era=[\w,]*Medieval/))), SWADEFC.SKILLS_ADDED);
SWADEFC.WEAPONS_ADDED = {
  'Chakram':'Damage=Str+d4 MinStr=4 Weight=1 Category=1h Range=4',
  'Cutlass':'Damage=Str+d6 MinStr=4 Weight=4 Category=1h',
  'Heavy Flail':'Damage=Str+d6 MinStr=8 Weight=10 Category=2h',
  'Falchion':'Damage=Str+d8 MinStr=8 Weight=8 Category=1h AP=1',
  'Glaive':'Damage=Str+d8 MinStr=8 Weight=10 Category=2h AP=1',
  'Guisarme':'Damage=Str+d6 MinStr=6 Weight=12 Category=2h',
  'Light Mace':SWADE.WEAPONS.Mace,
  'Heavy Mace':'Damage=Str+d8 MinStr=8 Weight=8 Category=1h AP=1',
  'Mancatcher':'Damage=Str+d4 MinStr=6 Weight=10 Category=2h',
  'Meteor Hammer':'Damage=Str+d6 MinStr=6 Weight=5 Category=2h',
  'Morningstar':'Damage=Str+d6 MinStr=6 Weight=6 Category=2h',
  'Ranseur':'Damage=Str+d6 MinStr=6 Weight=12 Category=1h AP=1',
  'Sap':'Damage=Str+d4 MinStr=4 Weight=1 Category=1h',
  'Scimitar':'Damage=Str+d6 MinStr=6 Weight=4 Category=1h',
  'Scythe':'Damage=Str+d6 MinStr=6 Weight=10 Category=2h',
  'Sickle':'Damage=Str+d4 MinStr=4 Weight=2 Category=1h',
  'Short Spear':'Damage=Str+d6 MinStr=6 Weight=3 Category=1h Range=4',
  'Spiked Chain':'Damage=Str+d6 MinStr=6 Weight=6 Category=2h AP=1',
  'Quarterstaff':'Damage=Str+d4 MinStr=4 Weight=4 Category=2h Parry=1',
  'Bastard Sword':'Damage=Str+d8 MinStr=8 Weight=6 Category=1h AP=1',
  'Hook Sword':'Damage=Str+d6 MinStr=6 Weight=3 Category=1h AP=1',
  'Trident':'Damage=Str+d6 MinStr=6 Weight=5 Category=1h Range=3',
  'Whip':'Damage=Str+d4 MinStr=4 Weight=2 Category=1h Parry=-1',
  'Bolas':'Damage=Str+d4 MinStr=4 Weight=2 Category=R Range=3',
  'Blowgun':'Damage=d4-2 MinStr=4 Weight=1 Category=R Range=3',
  'Short Bow':SWADE.WEAPONS.Bow,
  'Composite Bow':SWADE.WEAPONS['Compound Bow'],
  'Hand Crossbow':'Damage=2d4 MinStr=4 Weight=2 Category=R Range=5',
  'Repeating Hand Crossbow':'Damage=2d4 MinStr=4 Weight=3 Category=R Range=5',
  'Light Crossbow':SWADE.WEAPONS.Crossbow,
  'Repeating Light Crossbow':SWADE.WEAPONS.Crossbow + ' Weight=8',
  'Heavy Crossbow':'Damage=2d8 MinStr=8 Weight=8 Category=R Range=15 AP=2',
  'Shuriken':'Damage=Str+d4 MinStr=4 Weight=0 Category=R Range=3'
};
SWADEFC.WEAPONS = Object.assign(Object.fromEntries(Object.entries(SWADE.WEAPONS).filter(([k, v]) => !v.includes('Era') || v.match(/Era=[\w,]*Medieval/))), SWADEFC.WEAPONS_ADDED);

/* Defines the rules related to character attributes and description. */
SWADEFC.attributeRules = function(rules) {
  SWADE.attributeRules(rules);
  // No changes needed to the rules defined by base method
};

/* Defines the rules related to combat. */
SWADEFC.combatRules = function(rules, armors, shields, weapons) {
  SWADE.combatRules(rules, armors, shields, weapons);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to powers. */
SWADEFC.arcaneRules = function(rules, arcanas, powers) {
  SWADE.arcaneRules(rules, arcanas, powers);
  // No changes needed to the rules defined by base method
};

/* Defines the rules related to combat. */
SWADEFC.combatRules = function(rules, armors, shields, weapons) {
  SWADE.combatRules(rules, armors, shields, weapons);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to basic character identity. */
SWADEFC.identityRules = function(rules, races, concepts, deitys) {
  SWADE.identityRules(rules, races, {}, concepts, deitys);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to character aptitudes. */
SWADEFC.talentRules = function(
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
SWADEFC.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Ancestry' || type == 'Race') {
    SWADEFC.ancestryRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages')
    );
    SWADEFC.ancestryRulesExtra(rules, name);
  } else if(type == 'Arcana')
    SWADEFC.arcanaRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValueArray(attrs, 'Powers')
    );
  else if(type == 'Armor')
    SWADEFC.armorRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Area'),
      QuilvynUtils.getAttrValue(attrs, 'Armor'),
      QuilvynUtils.getAttrValue(attrs, 'MinStr'),
      QuilvynUtils.getAttrValue(attrs, 'Weight')
    );
  else if(type == 'Concept')
    SWADEFC.conceptRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Edge'),
      QuilvynUtils.getAttrValueArray(attrs, 'Skill')
    );
  else if(type == 'Deity')
    SWADEFC.deityRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Alignment'),
      QuilvynUtils.getAttrValueArray(attrs, 'Domain')
    );
  else if(type == 'Edge') {
    SWADEFC.edgeRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValueArray(attrs, 'Type')
    );
    SWADEFC.edgeRulesExtra(rules, name);
  } else if(type == 'Feature')
    SWADEFC.featureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Goody')
    SWADEFC.goodyRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Pattern'),
      QuilvynUtils.getAttrValue(attrs, 'Effect'),
      QuilvynUtils.getAttrValue(attrs, 'Value'),
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Hindrance') {
    SWADEFC.hindranceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'Severity')
    );
    SWADEFC.hindranceRulesExtra(rules, name);
  } else if(type == 'Language')
    SWADEFC.languageRules(rules, name);
  else if(type == 'Power')
    SWADEFC.powerRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Advances'),
      QuilvynUtils.getAttrValue(attrs, 'PowerPoints'),
      QuilvynUtils.getAttrValue(attrs, 'Range'),
      QuilvynUtils.getAttrValue(attrs, 'Description'),
      QuilvynUtils.getAttrValue(attrs, 'School'),
      QuilvynUtils.getAttrValueArray(attrs, 'Modifier')
    );
  else if(type == 'Shield')
    SWADEFC.shieldRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Parry'),
      QuilvynUtils.getAttrValue(attrs, 'Cover'),
      QuilvynUtils.getAttrValue(attrs, 'MinStr'),
      QuilvynUtils.getAttrValue(attrs, 'Weight')
    );
  else if(type == 'Skill')
    SWADEFC.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Attribute'),
      QuilvynUtils.getAttrValue(attrs, 'Core')
    );
  else if(type == 'Weapon')
    SWADEFC.weaponRules(rules, name,
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
 * Defines in #rules# the rules associated with ancestry #name#, which has the
 * list of hard prerequisites #requires#. #features# list associated features
 * and #languages# any automatic languages.
 */
SWADEFC.ancestryRules = function(rules, name, requires, features, languages) {
  SWADE.raceRules(rules, name, requires, features, languages);
  rules.defineRule('armorMinStr', 'combatNotes.diminutive(Tiny)', 'v=', '4');
};

/*
 * Defines in #rules# the rules associated with ancestry #name# that cannot be
 * derived directly from the attributes passed to ancestryRules.
 */
SWADEFC.ancestryRulesExtra = function(rules, name) {
  if(name == 'Dragonfolk') {
    rules.defineRule
      ('features.Arrogant+', 'featureNotes.ill-Tempered', '=', '1');
  } else if(name == 'Elemental Scion') {
    rules.defineRule('selectableFeatureCount.Elemental Scion (Element)',
      'race', '=', 'source=="Elemental Scion" ? 1 : null'
    );
  } else if(name == 'Graveborn') {
    rules.defineRule('features.Environmental Resistance (Cold)',
      'featureNotes.coldResistance', '=', '1'
    );
  } else if(name == 'Insectoid') {
    rules.defineRule('features.Driven+', 'featureNotes.hiveMinded', '=', '1');
    rules.defineRule('features.Loyal', 'featureNotes.hiveMinded', '=', '1');
    rules.defineRule('weapons.Bite', 'combatNotes.biteOrClaw', '=', '1');
    rules.defineRule('weapons.Claw', 'combatNotes.biteOrClaw', '=', '1');
  } else if(name == 'Minotaur') {
    SWADE.weaponRules(
      rules, 'Hooves', ['Ancient', 'Medieval'], 'Str+d4', 0, 0,
      'Un', null, null, null, null
    );
    rules.defineRule('weapons.Hooves', 'combatNotes.hooves', '=', null);
  } else if(name == 'Mouseling') {
    rules.defineRule
      ('features.Mild Mannered', 'featureNotes.unimposing', '=', '1');
  } else if(name == 'Ratling') {
    rules.defineRule('features.Yellow', 'featureNotes.craven', '=', '1');
  } else if(name == 'Shapeshifter') {
    rules.defineRule('features.Arcane Background (Gifted)',
      'featureNotes.changeShape', '=', '1'
    );
  }
};

/*
 * Defines in #rules# the rules associated with arcane power source #name#,
 * which draws on skill #skill# when casting and allows access to the list of
 * powers #powers#.
 */
SWADEFC.arcanaRules = function(rules, name, skill, powers) {
  SWADE.arcanaRules(rules, name, skill);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with armor #name#, which covers the
 * body areas listed in #areas#, adds #armor# to the character's Toughness,
 * requires a strength of #minStr# to use effectively, and weighs #weight#.
 */
SWADEFC.armorRules = function(rules, name, areas, armor, minStr, weight) {
  SWADE.armorRules
    (rules, name, ['Medieval'], areas, armor, minStr, weight);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with concept #name#. #attributes#,
 * #edges#, and #skills# list the names of attributes, edges, and skills
 * associated with the concept.
 */
SWADEFC.conceptRules = function(rules, name, attributes, edges, skills) {
  SWADE.conceptRules(rules, name, attributes, edges, skills); 
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with deity #name#, who has alignment
 * #alignment# and is associated the the list of domains #domains#.
 */
SWADEFC.deityRules = function(rules, name, alignment, domains) {

  SWADE.deityRules(rules, name, alignment, domains);

  if(rules.deityStats == null) {
    rules.deityStats = {
      alignment:{},
      domains:{}
    };
  }

  rules.deityStats.alignment[name] = alignment;
  rules.deityStats.domains[name] = domains.join('/');

  rules.defineRule('deityAlignment',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.alignment) + '[source]'
  );
  rules.defineRule('deityDomains',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.domains) + '[source]'
  );

};

/*
 * Defines in #rules# the rules associated with edge #name#. #require# and
 * #implies# list any hard and soft prerequisites for the edge, and #types#
 * lists the categories of the edge.
 */
SWADEFC.edgeRules = function(rules, name, requires, implies, types) {
  SWADE.edgeRules(rules, name, requires, implies, types);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with edge #name# that cannot be
 * derived directly from the attributes passed to edgeRules.
 */
SWADEFC.edgeRulesExtra = function(rules, name) {
};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
SWADEFC.featureRules = function(rules, name, sections, notes) {
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
SWADEFC.goodyRules = function(
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
SWADEFC.hindranceRules = function(rules, name, requires, severity) {
  SWADE.hindranceRules(rules, name, requires, severity);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with hindrance #name# that cannot be
 * derived directly from the attributes passed to hindranceRules.
 */
SWADEFC.hindranceRulesExtra = function(rules, name) {
};

/* Defines in #rules# the rules associated with language #name#. */
SWADEFC.languageRules = function(rules, name) {
  SWADE.languageRules(rules, name);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with power #name#, which may be
 * acquired only after #advances# advances, requires #powerPoints# Power Points
 * to use, and can be cast at range #range#. #description# is a concise
 * description of the power's effects and #school#, if defined, is the magic
 * school that defines the power.
 */
SWADEFC.powerRules = function(
  rules, name, advances, powerPoints, range, description, school, modifiers
) {
  SWADE.powerRules
    (rules, name, advances, powerPoints, range, description, school, modifiers);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with shield #name#, which adds
 * #parry# to the character's Parry, provides #cover# cover, requires #minStr#
 * to handle, and weighs #weight#.
 */
SWADEFC.shieldRules = function(rules, name, parry, cover, minStr, weight) {
  SWADE.shieldRules
    (rules, name, ['Medieval'], parry, cover, minStr, weight);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * #attribute# (one of 'agility', 'spirit', etc.).
 */
SWADEFC.skillRules = function(rules, name, attribute, core) {
  SWADE.skillRules(rules, name, attribute, core, ['Medieval']);
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
SWADEFC.weaponRules = function(
  rules, name, damage, minStr, weight, category, armorPiercing, range,
  rateOfFire, parry
) {
  SWADE.weaponRules(
    rules, name, ['Medieval'], damage, minStr, weight, category, armorPiercing,
    range, rateOfFire, parry
  );
  // No changes needed to the rules defined by base method
};

/*
 * Returns the list of editing elements needed by #choiceRules# to add a #type#
 * item to #rules#.
 */
SWADEFC.choiceEditorElements = function(rules, type) {
  return SWADE.choiceEditorElements(rules, type == 'Ancestry' ? 'Race' : type);
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
SWADEFC.randomizeOneAttribute = function(attributes, attribute) {
  return SWADE.randomizeOneAttribute.apply(
    this, [attributes, attribute=='ancestry' ? 'race' : attribute]
  );
};

/* Returns an array of plugins upon which this one depends. */
SWADEFC.getPlugins = function() {
  var result = [SWADE].concat(SWADE.getPlugins());
  return result;
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
