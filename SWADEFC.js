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
 * This module loads the rules from the Savage Worlds Adventure Edition Fantasy
 * Companion. The SWADEFC function contains methods that load rules for
 * particular parts of the rules: ancestryRules for character races,
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

SWADEFC.ANCESTRIES = {
  'Aquarian':SWADE.RACES.Aquarian,
  'Avion':SWADE.RACES.Avion,
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
  'Dwarf':SWADE.RACES.Dwarf,
  'Elemental Scion':
    'Features=' +
      '"Elemental Connection",Outsider',
  'Elf':SWADE.RACES.Elf,
  'Fairy':
    'Features=' +
      '"All Thumbs","Big Mouth",Curious+,Flight,Impulsive+,"Diminutive (Tiny)"',
  'Gnome':
    'Features=' +
      'Cunning,"Low Light Vision","Keen Senses","Size -1","Reduced Pace"',
  'Goblin':
    'Features=' +
      '"Infravision (Goblin)",Mean,Short,Sneaky,Survivors',
  'Golem':
    'Features=' +
      '"Armor +2",Big,Clueless+,Clumsy+,Construct,"No Vital Organs",' +
      '"Reduced Core Skills","Reduced Pace","Size +2"',
  'Graveborn':
    'Features=' +
      '"Animal Aversion",Bite,"Blood Drinker","Low Light Vision",Outsider+,' +
      '"Sunlight Sensitivity","Unnatural Strength","Cold Resistance"',
  'Half-Elf':SWADE.RACES['Half-Elf'],
  'Half-Folk':SWADE.RACES['Half-Folk'],
  'Half-Giant':
    'Features=' +
      'Big,Boneheaded,Clueless+,Illiterate,Outsider+,"Size +3","Very Strong",' +
      '"Very Tough"',
  'Half-Orc':
    'Features=' +
      'Infravision,Outsider,Hardened',
  'Human':SWADE.RACES.Human,
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
      '"Thin Skinned+","Size +1","Very Strong",Horns,Uneducated,Tough,Big,Mean',
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
  'Rakashan':
    SWADE.RACES.Rakashan.replace('Racial', 'Ancestral')
                        .replace('Features=', 'Features="Claws (Climbing)",'),
  'Ratling':
    'Features=' +
      'Bite,Claws,"Claws (Climbing)","Natural Resistance","Low Light Vision",' +
      'Scavenger,"Size -1",Outsider+,Craven,Greedy',
  'Saurian':SWADE.RACES.Saurian,
  'Serpentfolk':
    'Features=' +
      'Bite,Cold-Blooded,"Environmental Weakness (Cold)",Infravision,' +
      '"Pace (Serpentfolk)","Venomous Bite",Outsider',
  'Shapeshifter':
    'Features=' +
      'Charismatic,"Change Shape",Secret+'
};
SWADEFC.ARCANAS = {
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
      '"Beast Friend","Environmental Protection","Shape Change"',
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
      '"Summon Animal",Telekinesis,"Wall Walker","Warrior\'s Gift",Wish',
  'Wizard':
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
      '"Warrior\'s Gift",Wish,Zombie',
  'Cold Domain':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection",Barrier,"Beast Friend",Blast,Blessing,Bolt,' +
      '"Boost/Lower Trait",Burst,"Damage Field",Darksight,Deflection,Dispel,' +
      'Divination,"Drain Power Points","Elemental Manipulation",Entangle,' +
      '"Environmental Protection",Farsight,Fly,Growth/Shrink,Havoc,Healing,' +
      'Invisibility,Light/Darkness,"Mystic Intervention",Protection,' +
      'Sanctuary,"Shape Change",Sloth/Speed,Slumber,Smite,Sound/Silence,' +
      'Stun,"Summon Ally",Teleport,"Warrior\'s Gift",Zombie',
  'Death Domain':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection",Banish,Barrier,Blast,Blind,Bolt,' +
      '"Boost/Lower Trait",Burrow,Burst,Confusion,"Damage Field",Darksight,' +
      'Deflection,"Detect/Conceal Arcana",Disguise,Dispel,Divination,' +
      '"Drain Power Points",Entangle,Farsight,Fear,Fly,Havoc,Healing,' +
      'Intangibility,Light/Darkness,"Mystic Intervention","Object Reading",' +
      'Protection,Resurrection,Sanctuary,Sloth/Speed,Slumber,Smite,' +
      'Sound/Silence,Stun,"Summon Ally","Summon Monster","Summon Undead",' +
      'Teleport,"Warrior\'s Gift",Zombie',
  'Life Domain':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection",Banish,Barrier,"Beast Friend",Blessing,' +
      '"Boost/Lower Trait",Confusion,"Conjure Item",Darksight,Deflection,' +
      '"Detect/Conceal Arcana",Disguise,Dispel,Divination,Empathy,Entangle,' +
      '"Environmental Protection",Farsight,Fly,Growth/Shrink,Havoc,Healing,' +
      'Light/Darkness,"Mystic Intervention",Protection,Relief,Resurrection,' +
      'Sanctuary,Sloth/Speed,Slumber,Smite,Sound/Silence,"Speak Language",' +
      'Stun,"Summon Ally","Summon Animal","Warrior\'s Gift"',
  'Justice Domain':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Projection",Banish,Blast,Blind,Bolt,"Boost/Lower Trait",Burst,' +
      'Confusion,"Conjure Item","Damage Field",Darksight,Deflection,' +
      '"Detect/Conceal Arcana",Dispel,Divination,"Drain Power Points",' +
      'Empathy,Farsight,Fly,Havoc,Healing,Invisibility,Light/Darkness,' +
      '"Mind Reading","Object Reading","Mystic Intervention",Protection,' +
      'Sanctuary,Sloth/Speed,Smite,Sound/Silence,"Speak Language",Stun',
  'Knowledge Domain':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection",Banish,Barrier,Blessing,Blind,"Boost/Lower Trait",' +
      'Confusion,"Conjure Item",Darksight,Deflection,"Detect/Conceal Arcana",' +
      'Disguise,Dispel,Divination,Farsight,Fear,Havoc,Healing,Light/Darkness,' +
      '"Mind Link","Mind Reading","Mind Wipe","Mystic Intervention",' +
      '"Object Reading",Protection,Sanctuary,Slumber,Sound/Silence,' +
      '"Speak Language",Stun,"Summon Ally"',
  'Moon Domain':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection","Beast Friend",Blessing,Blind,Bolt,' +
      '"Boost/Lower Trait",Confusion,Darksight,Deflection,' +
      '"Detect/Conceal Arcana",Disguise,Dispel,Divination,' +
      '"Drain Power Points",Empathy,Farsight,Fear,Fly,Growth/Shrink,Healing,' +
      'Illusion,Intangibility,Invisibility,Light/Darkness,' +
      '"Mystic Intervention",Puppet,Relief,Sanctuary,"Shape Change",' +
      'Sloth/Speed,Slumber,Sound/Silence,Stun',
  'Nature Domain':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection",Barrier,"Beast Friend",Blessing,Bolt,' +
      '"Boost/Lower Trait",Burrow,"Conjure Item","Damage Field",Darksight,' +
      'Deflection,Disguise,Divination,"Elemental Manipulation",Entangle,' +
      '"Environmental Protection",Farsight,Fear,Fly,Growth/Shrink,Havoc,' +
      'Healing,"Mystic Intervention",Protection,Relief,Sanctuary,' +
      '"Shape Change",Sloth/Speed,Smite,Sound/Silence,Stun,"Summon Animal",' +
      '"Summon Monster","Wall Walker","Warrior\'s Gift"',
  'Sea Domain':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection","Beast Friend",Blast,Bolt,"Boost/Lower Trait",' +
      'Burst,"Damage Field",Deflection,Dispel,Divination,' +
      '"Elemental Manipulation","Environmental Protection",Farsight,Healing,' +
      'Light/Darkness,"Mystic Intervention",Protection,Relief,Sanctuary,' +
      '"Shape Change",Sloth/Speed,Smite,Sound/Silence,"Summon Ally",' +
      '"Summon Animal"',
  'Sun Domain':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection",Banish,Blast,Blessing,Blind,Bolt,' +
      '"Boost/Lower Trait",Confusion,"Damage Field",Darksight,Deflection,' +
      '"Detect/Conceal Arcana",Dispel,Divination,"Elemental Manipulation",' +
      '"Environmental Protection",Fear,Fly,Havoc,Healing,Illusion,' +
      'Light/Darkness,"Mystic Intervention",Protection,Relief,Resurrection,' +
      'Sanctuary,Sloth/Speed,Smite,Stun',
  'Thievery Domain':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection",Barrier,Blessing,Blind,"Boost/Lower Trait",' +
      'Confusion,"Conjure Item",Darksight,Deflection,"Detect/Conceal Arcana",' +
      'Disguise,Dispel,"Drain Power Points",Empathy,Growth/Shrink,Havoc,' +
      'Healing,Illusion,Intangibility,Invisibility,Light/Darkness,' +
      '"Object Reading",Protection,Sanctuary,Sloth/Speed,Slumber,' +
      'Sound/Silence,"Speak Language","Wall Walker"',
  'War Domain':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection",Barrier,Blast,Bolt,"Boost/Lower Trait",Burst,' +
      '"Conjure Item","Damage Field",Deflection,Dispel,Divination,Fear,Fly,' +
      'Growth/Shrink,Havoc,Healing,"Mystic Intervention",Protection,Relief,' +
      'Sanctuary,Sloth/Speed,Smite,Stun,"Summon Ally","Summon Monster",' +
      '"Warrior\'s Gift"'
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
  'Bard':
    'Edge="Arcane Background (Bard)" ' +
    'Attribute=Spirit ' +
    'Skill=Performance',
  'Cleric (Cold Domain)':
    'Edge="Arcane Background (Cleric (Cold Domain))" ' +
    'Attribute=Spirit ' +
    'Skill=Faith',
  'Cleric (Death Domain)':
    'Edge="Arcane Background (Cleric (Death Domain))" ' +
    'Attribute=Spirit ' +
    'Skill=Faith',
  'Cleric (Life Domain)':
    'Edge="Arcane Background (Cleric (Life Domain))" ' +
    'Attribute=Spirit ' +
    'Skill=Faith',
  'Cleric (Justice Domain)':
    'Edge="Arcane Background (Cleric (Justice Domain))" ' +
    'Attribute=Spirit ' +
    'Skill=Faith',
  'Cleric (Knowledge Domain)':
    'Edge="Arcane Background (Cleric (Knowledge Domain))" ' +
    'Attribute=Spirit ' +
    'Skill=Faith',
  'Cleric (Moon Domain)':
    'Edge="Arcane Background (Cleric (Moon Domain))" ' +
    'Attribute=Spirit ' +
    'Skill=Faith',
  'Cleric (Nature Domain)':
    'Edge="Arcane Background (Cleric (Nature Domain))" ' +
    'Attribute=Spirit ' +
    'Skill=Faith',
  'Cleric (Sea Domain)':
    'Edge="Arcane Background (Cleric (Sea Domain))" ' +
    'Attribute=Spirit ' +
    'Skill=Faith',
  'Cleric (Sun Domain)':
    'Edge="Arcane Background (Cleric (Sun Domain))" ' +
    'Attribute=Spirit ' +
    'Skill=Faith',
  'Cleric (Thievery Domain)':
    'Edge="Arcane Background (Cleric (Thievery Domain))" ' +
    'Attribute=Spirit ' +
    'Skill=Faith',
  'Cleric (War Domain)':
    'Edge="Arcane Background (Cleric (War Domain))" ' +
    'Attribute=Spirit ' +
    'Skill=Faith',
  'Diabolist':
    'Edge="Arcane Background (Diabolist)" ' +
    'Attribute=Smarts ' +
    'Skill=Spellcasting',
  'Druid':
    'Edge="Arcane Background (Druid)" ' +
    'Attribute=Spirit ' +
    'Skill=Faith',
  'Elementalist':
    'Edge="Arcane Background (Elementalist)" ' +
    'Attribute=Smarts ' +
    'Skill=Spellcasting',
  'Illusionist':
    'Edge="Arcane Background (Illusionist)" ' +
    'Attribute=Smarts ' +
    'Skill=Spellcasting',
  'Necromancer':
    'Edge="Arcane Background (Necromancer)" ' +
    'Attribute=Smarts ' +
    'Skill=Spellcasting',
  'Shaman':
    'Edge="Arcane Background (Shaman)" ' +
    'Attribute=Spirit ' +
    'Skill=Faith',
  'Sorcerer':
    'Edge="Arcane Background (Sorcerer)" ' +
    'Attribute=Smarts ' +
    'Skill=Spellcasting',
  'Summoner':
    'Edge="Arcane Background (Summoner)" ' +
    'Attribute=Smarts ' +
    'Skill=Spellcasting',
  'Tinkerer':
    'Edge="Arcane Background (Tinkerer)" ' +
    'Attribute=Smarts ' +
    'Skill=Repair',
  'Warlock/Witch':
    'Edge="Arcane Background (Warlock/Witch)" ' +
    'Attribute=Smarts ' +
    'Skill=Spellcasting',
  'Wizard':
    'Edge="Arcane Background (Wizard)" ' +
    'Attribute=Smarts ' +
    'Skill=Spellcasting'
};
SWADEFC.CONCEPTS = Object.assign(Object.fromEntries(Object.entries(SWADE.CONCEPTS).filter(([k, v]) => !v.includes('Arcane Background'))), SWADEFC.CONCEPTS_ADDED);
SWADEFC.DEITIES = {
};
SWADEFC.EDGES_ADDED = {
  'Air Scion':'Type=background Require="ancestry == \'Elemental Scion\'"',
  'Earth Scion':'Type=background Require="ancestry == \'Elemental Scion\'"',
  'Fire Scion':'Type=background Require="ancestry == \'Elemental Scion\'"',
  'Water Scion':'Type=background Require="ancestry == \'Elemental Scion\'"',
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
    'Type=combat Require="advances>=4","features.Dirty Fighter"',
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
  'Wing Gust':'Type=combat Require="advances>=4","features.Flight"',
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
  'Troubadour':
    'Type=professional ' +
    'Require="skills.Common Knowledge>=6","skills.Performance>=8"',
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
  'Arcane Background (Cleric (Cold Domain))':'Type=background',
  'Arcane Background (Cleric (Death Domain))':'Type=background',
  'Arcane Background (Cleric (Life Domain))':'Type=background',
  'Arcane Background (Cleric (Justice Domain))':'Type=background',
  'Arcane Background (Cleric (Knowledge Domain))':'Type=background',
  'Arcane Background (Cleric (Moon Domain))':'Type=background',
  'Arcane Background (Cleric (Nature Domain))':'Type=background',
  'Arcane Background (Cleric (Sea Domain))':'Type=background',
  'Arcane Background (Cleric (Sun Domain))':'Type=background',
  'Arcane Background (Cleric (Thievery Domain))':'Type=background',
  'Arcane Background (Cleric (War Domain))':'Type=background',
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
  'Arcane Background (Wizard)':'Type=background',
  // AB-dependent edges
  'Chemist':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Alchemist)",' +
      '"skills.Alchemy>=8"',
  'Master Alchemist':
    'Type=power ' +
    'Require=' +
      '"advances>=4",' +
      '"features.Arcane Background (Alchemist)",' +
      '"skills.Alchemy>=10"',
  'Dirge':
    'Type=power ' +
    'Require=' +
      '"advances>=12",' +
      '"features.Arcane Background (Bard)"',
  'Inspire Heroics':
    'Type=power ' +
    'Require=' +
      '"advances>=4",' +
      '"features.Arcane Background (Bard)",' +
      '"skills.Performance>=8"',
  'Instrument':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Bard)"',
  'Destroy Undead':
    'Type=power ' +
    'Require=' +
      '"advances>=4",' +
      '"features.Arcane Background (Cleric)"',
  'Mercy':
    'Type=power ' +
    'Require=' +
      '"advances>=4",' +
      '"features.Arcane Background (Cleric)",' +
      '"skills.Faith>=8"',
  "Hell's Wrath":
    'Type=power ' +
    'Require=' +
      '"advances>=4",' +
      '"features.Arcane Background (Diabolist)"',
  'Infernal Armor':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Diabolist)"',
  'Heartwood Staff':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Druid)"',
  'True Form':
    'Type=power ' +
    'Require=' +
      '"advances>=4",' +
      '"features.Arcane Background (Druid)"',
  'Elemental Absorption':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Elementalist)"',
  'Elemental Master':
    'Type=power ' +
    'Require=' +
      '"advances>=4",' +
      '"features.Arcane Background (Elementalist)"',
  'Deadly Illusion':
    'Type=power ' +
    'Require=' +
      '"advances>=4",' +
      '"features.Arcane Background (Illusionist)",' +
      '"skills.Spellcasting>=10"',
  'Master Of Illusion':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Illusionist)",' +
      '"skills.Spellcasting>=8"',
  'Soul Jar':
    'Type=power ' +
    'Require=' +
      '"advances>=16",' +
      '"features.Arcane Background (Necromancer)",' +
      '"skills.Occult>=10"',
  'Undead Familiar':
    'Type=power ' +
    'Require=' +
      '"advances>=4",' +
      '"features.Arcane Background (Necromancer)"',
  'Primal Magic':
    'Type=power ' +
    'Require=' +
      '"advances>=4",' +
      '"features.Arcane Background (Shaman)"',
  'Sacred Fetish':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Shaman)",' +
      '"skills.Faith>=8"',
  'Great Power':
    'Type=power ' +
    'Require=' +
      '"advances>=8",' +
      '"features.Arcane Background (Sorcerer)"',
  'Phenomenal Power':
    'Type=power ' +
    'Require=' +
      '"advances>=12",' +
      '"features.Arcane Background (Sorcerer)",' +
      '"features.Great Power"',
  'Arcane Barding':
    'Type=power ' +
    'Require=' +
      '"advances>=4",' +
      '"features.Arcane Background (Summoner)",' +
      '"powers.Summon Animal"',
  'Ferocious Summoning':
    'Type=power ' +
    'Require=' +
      '"advances>=4",' +
      '"features.Arcane Background (Summoner)",' +
      '"powers.Summon Monster"',
  'Great Summoning':
    'Type=power ' +
    'Require=' +
      '"advances>=12",' +
      '"features.Arcane Background (Summoner)",' +
      '"powers.Summon Animal",' +
      '"powers.Summon Monster"',
  'Construct Familiar':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Tinkerer)"',
  "Tinkerer's Armor":
    'Type=power ' +
    'Require=' +
      '"advances>=4",' +
      '"features.Arcane Background (Tinkerer)"',
  'The Evil Eye':
    'Type=power ' +
    'Require=' +
      '"advances>=4",' +
      '"features.Arcane Background (Warlock/Witch)"',
  'The Witching Hour':
    'Type=power ' +
    'Require=' +
      '"advances>=4",' +
      '"features.Arcane Background (Warlock/Witch)"',
  'Eldritch Inspiration':
    'Type=power ' +
    'Require=' +
      '"advances>=8",' +
      '"features.Arcane Background (Wizard)"',
  'Spellbooks':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Wizard)"'
};
SWADEFC.EDGES = Object.assign(Object.fromEntries(Object.entries(SWADE.EDGES).filter(([k, v]) => !k.includes('Arcane Background'))), SWADEFC.EDGES_ADDED);
SWADEFC.FEATURES_ADDED = {
  // Ancestry
  'Additional Actions':
    'Section=combat Note="Use of limbs reduces multi-action penalty by 2"',
  'Air Scion':
    'Section=feature ' +
    'Note="Has Environmental Resistance (Air) and Inner Air features"',
  'Ancestral Enemy':'Section=skill Note="-2 Persuasion (ancestral enemy)"',
  'Animal Aversion':
    'Section=skill ' +
    'Note="Animals keep 5\\" distance/-2 to control or ride animals"',
  'Bite Or Claw':
    'Section=combat Note="Mandibles or pincers inflict Bite or Claws damage"',
  'Blood Drinker':
    'Section=feature ' +
    'Note="May drink humanoid blood to gain a natural healing roll 1/session"',
  'Boneheaded':'Section=attribute Note="-1 Smarts"',
  'Breath Weapon':
    'Section=combat ' +
    'Note="Successful Athletics inflicts 2d6 fire damage in 9\\" cone or 12\\" line; critical failure inflicts fatigue"',
  'Brutish':'Section=attribute Note="-1 Smarts"',
  'Change Shape':
    'Section=arcana,feature ' +
    'Note=' +
      '"May use <i>Disguise</i> as a limited free action to change own appearance",' +
      '"Has Arcane Background (Gifted) feature"',
  'Claws (Climbing)':'Section=skill Note="+2 Athletics (climbing)"',
  'Cold Resistance':
    'Section=feature Note="Has Environmental Resistance (Cold) feature"',
  'Cold-Blooded':
    'Section=attribute ' +
    'Note="10 min in 60F/18C environment inflicts -1 Agility, Strength, and Vigor"',
  'Craven':'Section=feature Note="Has Yellow+ feature"',
  'Cunning':'Section=attribute Note="+1 Smarts step"',
  'Darkvision':'Section=feature Note="R10\\" Ignore illumination penalties"',
  'Devilish Nature':'Section=skill Note="+1 Intimidation"',
  'Diminutive (Tiny)':
    'Section=arcana,attribute,combat,combat,feature ' +
    'Note=' +
      '"Powers inflict -4 damage",' +
      '"Strength may not exceed d4",' +
      '"-4 Toughness",' +
      '"-4 all damage/Armor minimum strength is d4",' +
      '"Armor cost and weight is 1/4 normal"',
  'Earth Scion':
    'Section=feature ' +
    'Note="Has Environmental Resistance (Earth) and Rock Solid features"',
  'Elemental Connection':
    'Section=feature ' +
    'Note="+1 Edge Points (Choice of Air, Earth, Fire, or Water Scion)"',
  'Environmental Resistance (Air)':
    'Section=combat Note="+4 vs. air effects/-4 damage from air effects"',
  'Environmental Resistance (Earth)':
    'Section=combat Note="+4 vs. earth effects/-4 damage from earth effects"',
  'Environmental Resistance (Fire)':
    'Section=combat Note="+4 vs. fire effects/-4 damage from fire effects"',
  'Environmental Resistance (Heat)':
    'Section=combat ' +
    'Note="+4 vs. heat and fire effects/-4 damage from heat and fire"',
  'Environmental Resistance (Water)':
    'Section=combat Note="+4 vs. water effects/-4 damage from water effects"',
  'Fire Scion':
    'Section=feature ' +
    'Note="Has Environmental Resistance (Fire) and Quick features"',
  'Hardened':'Section=attribute Note="+1 Attribute Points (Strength or Vigor)"',
  'Hive Minded':
    'Section=feature Note="Has Driven+ and Loyal features wrt colony"',
  'Hooves':'Section=combat Note="Hooves are a natural weapon"',
  'Ill-Tempered':'Section=feature Note="Has Arrogant+ hindrance"',
  // Additional from New Ancestry Abilities table
  'Camouflage':
    'Section=skill Note="+2 Stealth (+4 if motionless) in chosen terrain"',
  'Echolocation':
    'Section=feature ' +
    'Note="R10\\" Hearing negates 4 points of vision penalties"',
  'Phosphorescence':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"-4 Stealth (sight-based) when glowing",' +
      '"Glow negates 2 points of illumination penalties",' +
      '"Strobing glow gives self +1 on some Tests and inflicts -1 melee attacks on foes"',
  // Changed from SWADE
  'Infravision':
    'Section=combat ' +
    'Note="Illumination penalties reduced by half when attacking targets that radiate heat"',
  'Infravision (Goblin)':
    'Section=combat ' +
    'Note="Illumination penalties reduced by half when attacking targets that radiate heat or cold"',
  'Inner Air':'Section=feature Note="Does not need to breathe"',
  'Natural Resistance':'Section=combat Note="Immune to poison and disease"',
  'Pace (Serpentfolk)':'Section=combat Note="+4 Pace/+2 Run step"',
  'Pace +4':'Section=combat Note="+4 Pace/+2 Run step"',
  'Phobia (Cats)':
    'Section=feature Note="Suffers -1 on Trait rolls in the presence of cats"',
  'Reduced Core Skills':
    'Section=skill ' +
    'Note="Has no starting Common Knowledge, Persuasion, or Stealth ability"',
  'Rock Solid':'Section=attribute Note="+1 Vigor step"',
  'Short':'Section=combat,description Note="-1 Toughness","-1 Size"',
  'Size +2':
    'Section=combat,description ' +
    'Note=' +
      '"+2 Toughness",' +
      '"+2 Size"',
  'Size +3':
    'Section=combat,description ' +
    'Note=' +
      '"+3 Toughness",' +
      '"+3 Size"',
  'Sneaky':'Section=skill Note="+1 Stealth step"',
  'Sunlight Sensitivity':
    'Section=combat Note="Suffers Distraction in sunlight or equivalent"',
  'Survivors':'Section=feature Note="+1 Edge Points"',
  'Uneducated':'Section=attribute Note="-1 Smarts"',
  'Unimposing':'Section=feature Note="Has Mild Mannered feature"',
  'Unnatural Strength':'Section=attribute Note="+1 Strength step"',
  'Unusual Body Shape':
    'Section=feature Note="Cannot use standard armor or furnishings"',
  'Unusual Form':
    'Section=feature Note="Cannot ride mounts or use some normal equipment"',
  'Venomous Bite':
    'Section=combat Note="Successful bite inflicts Mild Poison (Vigor neg)"',
  'Very Strong':'Section=attribute Note="+2 Strength step"',
  'Very Tough':'Section=attribute Note="+2 Vigor step"',
  'Water Scion':
    'Section=feature ' +
    'Note="Has Environmental Resistance (Water) and Aquatic features"',
  // Edges
  'Arcane Background (Alchemist)':
    'Section=arcana Note="3 Powers/15 Power Points"',
  'Arcane Background (Bard)':
    'Section=arcana Note="3 Powers/10 Power Points"',
  'Arcane Background (Cleric (Cold Domain))':
    'Section=arcana Note="5 Powers/10 Power Points"',
  'Arcane Background (Cleric (Death Domain))':
    'Section=arcana Note="5 Powers/10 Power Points"',
  'Arcane Background (Cleric (Life Domain))':
    'Section=arcana Note="5 Powers/10 Power Points"',
  'Arcane Background (Cleric (Justice Domain))':
    'Section=arcana Note="5 Powers/10 Power Points"',
  'Arcane Background (Cleric (Knowledge Domain))':
    'Section=arcana Note="5 Powers/10 Power Points"',
  'Arcane Background (Cleric (Moon Domain))':
    'Section=arcana Note="5 Powers/10 Power Points"',
  'Arcane Background (Cleric (Nature Domain))':
    'Section=arcana Note="5 Powers/10 Power Points"',
  'Arcane Background (Cleric (Sea Domain))':
    'Section=arcana Note="5 Powers/10 Power Points"',
  'Arcane Background (Cleric (Sun Domain))':
    'Section=arcana Note="5 Powers/10 Power Points"',
  'Arcane Background (Cleric (Thievery Domain))':
    'Section=arcana Note="5 Powers/10 Power Points"',
  'Arcane Background (Cleric (War Domain))':
    'Section=arcana Note="5 Powers/10 Power Points"',
  'Arcane Background (Diabolist)':
    'Section=arcana Note="5 Powers/10 Power Points"',
  'Arcane Background (Druid)':
    'Section=arcana Note="5 Powers/10 Power Points"',
  'Arcane Background (Elementalist)':
    'Section=arcana Note="5 Powers/10 Power Points"',
  'Arcane Background (Illusionist)':
    'Section=arcana Note="5 Powers/10 Power Points"',
  'Arcane Background (Necromancer)':
    'Section=arcana Note="5 Powers/10 Power Points"',
  'Arcane Background (Shaman)':
    'Section=arcana Note="5 Powers/10 Power Points"',
  'Arcane Background (Sorcerer)':
    'Section=arcana Note="3 Powers/15 Power Points"',
  'Arcane Background (Summoner)':
    'Section=arcana Note="5 Powers/15 Power Points"',
  'Arcane Background (Tinkerer)':
    'Section=arcana Note="2 Powers/15 Power Points"',
  'Arcane Background (Warlock/Witch)':
    'Section=arcana Note="3 Powers/10 Power Points"',
  'Arcane Background (Wizard)':
    'Section=arcana Note="6 Powers/15 Power Points"',
  'Aura Of Courage':
    'Section=combat ' +
    'Note="R10\\" Allies gain +1 on Fear checks and -1 on Fear Table results"',
  'Battle Magic':'Section=arcana Note="May cast spells on units of Extras"',
  'Beast Talker':'Section=skill Note="May speak with chosen class of animals"',
  'Blood Magic':
    'Section=arcana ' +
    'Note="Inflicting Wound on conscious, sapient being restores d6 Power Points to self"',
  'Born In The Saddle':
    'Section=skill ' +
    'Note="May take free reroll on Riding/Mount gains +2 Pace and +1 Run step"',
  'Charge':
    'Section=combat Note="Fighting attack inflicts +2 damage after 5\\" run"',
  'Chosen':
    'Section=combat,feature ' +
    'Note=' +
      '"Conviction effects last until end of encounter",' +
      '"Has Enemy+ feature/Permanent mark shows Chosen status"',
  'Close Fighting':
    'Section=combat ' +
    'Note="+%V attack and Parry with knife against more heavily-armed foe"',
  'Deceptive':
    'Section=skill ' +
    'Note="May choose whether target resists Smarts- or Spirit-linked Tests with Smarts or Spirit"',
  'Defender':
    'Section=combat Note="May share shield Parry w/chosen adjacent ally"',
  'Dirty Fighter':'Section=skill Note="+2 Fighting (performing Test)"',
  'Double Shot':'Section=combat Note="May fire or throw 2 projectiles %V/tn"',
  'Epic Mastery':'Section=arcana Note="All powers have Epic Mastery Modifiers"',
  'Explorer':
    'Section=feature ' +
    'Note="Reduce travel time by 10%/May take best of 2 Action Cards when traveling"',
  'Familiar':
    'Section=arcana ' +
    'Note="Can communicate w/magical, Wild Card pet that stores 5 Power Points"',
  'Favored Enemy':
    'Section=combat,skill ' +
    'Note="May reroll failed attacks against %V chosen creature type",' +
         '"May reroll failed Survival to track %V chosen creature type"',
  'Favored Power':
    'Section=arcana ' +
    'Note="May ignore two points of penalties when casting chosen power"',
  'Favored Terrain':
    'Section=combat,skill ' +
    'Note="Gains additional Action Card in %V chosen terrain",' +
         '"May make free Notice and Survival reroll in %V chosen terrain"',
  'Fey Blood':
    'Section=combat ' +
    'Note="May make free reroll to resist enemy powers and spell-like effects"',
  'Formation Fighter':
    'Section=combat Note="Self and allies gain +1 Gang Up bonus (+4 max)"',
  'Heirloom':'Section=feature Note="Possesses powerful magic item"',
  'Home Ground':
    'Section=feature ' +
    'Note="Within home area, may spend a Benny to recover all Power Points/10 min concentration answers 3 questions about state of home area"',
  'Improved Close Fighting':
    'Section=combat Note="Increased Close Fighting effects"',
  'Improved Double Shot':'Section=combat Note="Increased Double Shot effects"',
  'Improved Sneak Attack':
   'Section=combat Note="May use Sneak Attack on distracted foe"',
  'Knight':
    'Section=feature,skill ' +
    'Note=' +
      '"Has authority over common folk in liege\'s realm",' +
      '"+1 Intimidation and Persuasion in areas of liege authority"',
  'Martial Flexibility':
    'Section=combat ' +
    'Note="May gain effects of chosen combat edge for 5 rd 1/encounter"',
  'Master Artificer':
    'Section=arcana ' +
    'Note="Gains 1000 GP progress for each success and raise when imbuing magic items"',
  'Missile Deflection':
    'Section=combat ' +
    'Note="When armed, physical ranged attacks on self must match Parry"',
  'Mount':
    'Section=feature ' +
    'Note="Mount gains %{advances//4+1} Trait die increase, Edge, or Monstrous ability"',
  'Mystic Powers (Barbarian)':
    'Section=arcana ' +
    'Note="10 Power Points/May cast self <i>Boost Trait</i>, <i>Protection</i>, or <i>Smite</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Fighter)':
    'Section=arcana ' +
    'Note="10 Power Points/May cast self <i>Boost Trait</i>, <i>Smite</i>, or <i>Speed</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Monk)':
    'Section=arcana ' +
    'Note="10 Power Points/May cast self <i>Boost Trait</i>, <i>Deflection</i>, or <i>Smite</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Paladin)':
    'Section=arcana ' +
    'Note="10 Power Points/May cast self <i>Boost Trait</i>, <i>Healing</i>, self <i>Protection</i>, self <i>Sanctuary</i> or self <i>Smite</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Ranger)':
    'Section=arcana ' +
    'Note="10 Power Points/May cast <i>Beast Friend</i>, self <i>Boost Trait</i>, <i>Entangle</i>, or self <i>Farsight</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Rogue)':
    'Section=arcana ' +
    'Note="10 Power Points/May cast self <i>Boost Trait</i>, self <i>Darksight</i>, <i>Lock/Unlock</i> or self <i>Wall Walker</i> for 2 PP (+2 PP for Raise)"',
  'Opportunistic':
    'Section=feature ' +
    'Note="Joker gives additional +2 to Trait and damage rolls"',
  'Poisoner':
    'Section=skill ' +
    'Note="Creates poisons in half normal time/Contact poisons last 12 hr"',
  'Rapid Change':'Section=feature Note="May change form as a limited action"',
  'Really Dirty Fighter':
    'Section=skill Note="Raise on Test gives self The Drop on Test target"',
  'Relic':'Section=arcana Note="Possesses powerful magic item"',
  'Roar':
    'Section=skill ' +
    'Note="R9\\" cone May make Intimidation Test against multiple targets"',
  'Savagery':'Section=combat Note="Wild Attack inflicts additional +2 damage"',
  'Scorch':
    'Section=combat ' +
    'Note="Breath weapon inflicts 1 die type higher damage and may be inflicted in a cone or stream"',
  'Scout':
    'Section=skill ' +
    'Note="Successful Notice-2 during travel detects encounters/Always considered alert vs. Stealth/+2 Common Knowledge (Recall info about familiar route)"',
  'Shield Wall':
    'Section=combat ' +
    'Note="+1 or +2 Parry when adjacent to 1 or 2 allies w/same edge"',
  'Silent Caster':'Section=arcana Note="May cast w/out speaking"',
  'Sneak Attack':'Section=combat Note="Assassin Edge inflicts +d6 damage"',
  'Stonecunning':
    'Section=skill ' + 
    'Note="R10\' +2 Notice (detect traps and hidden doors in stonework)"',
  'Stunning Blow':
    'Section=feature ' +
    'Note="Successful attack with blunt weapon causes Stunned (Vigor neg)"',
  'Sunder':'Section=combat Note="+d6 damage when striking to break an object"',
  'Take The Hit':
    'Section=combat ' +
    'Note="May take free reroll on rolls to Soak or resist Knockout"',
  'Transfer':
    'Section=arcana Note="May transfer up to 5 PP to another in sight"',
  'Trap Sense':
    'Section=skill ' +
    'Note="R5\\" Successful automatic Notice detects mechanical and magical traps"',
  'Treasure Hunter':
    'Section=attribute,feature ' +
    'Note=' +
      '"Successful Smarts gives approximate value of goods and magic item abilities",' +
      '"May spend Benny to have GM reroll magic item treasure"',
  'Trick Shot':
    'Section=skill ' +
    'Note="May force foe to resist Athletics and Shooting Tests with Smarts instead of Agility"',
  'Troubadour':
    'Section=skill ' +
    'Note="+2 most Common Knowledge/May use Performance instead of Battle"',
  'Uncanny Reflexes':
    'Section=combat ' +
    'Note="Ignores penalty for normal Evasion; may use Evasion at -2 for any area effect"',
  'Unstoppable':'Section=combat Note="Takes at most 1 Wound per attack"',
  'Warband':
    'Section=feature ' +
    'Note="%V followers may take 1 addition Wound before becoming incapacitated"',
  'Wing Gust':
    'Section=combat ' +
    'Note="R9\\" cone Successful Athletics roll shakes creatures of same or smaller size (Vigor neg; Raise -2)"',
  // AB-dependent edges
  'Arcane Barding':'Section=arcana Note="Summoned animals gain +2 Toughness"',
  'Chemist':'Section=arcana Note="Concoctions last 1 wk"',
  'Construct Familiar':
    'Section=arcana ' +
    'Note="Can communicate w/magical, Wild Card construct that stores 5 Power Points"',
  'Deadly Illusion':'Section=arcana Note="No cost to use Dead Power Modifier"',
  'Destroy Undead':
    'Section=arcana ' +
    'Note="R6\\" May spend 1 or 2 PP to inflict 2d6 or 3d6 damage on all undead"',
  'Dirge':'Section=feature Note="R10\\" Target foe suffers -2 on Benny rolls"',
  'Eldritch Inspiration':
    'Section=arcana Note="May spend Benny to cast spell from spellbook"',
  'Elemental Absorption':
    'Section=combat Note="+2 Toughness during elemental synergy"',
  'Elemental Master':
    'Section=arcana Note="Has domain over %V elemental forces"',
  'Ferocious Summoning':
    'Section=arcana Note="Summoned monsters gain 1 combat Edge"',
  'Great Power':
    'Section=arcana ' +
    'Note="May spend a Benny to cast any power up to 20 PP at -2 penalty; failure inflicts permanent loss of 1 attribute die type"',
  'Great Summoning':
    'Section=arcana ' +
    'Note="May spend 5/7/8/8/11 PP to summon barghest/mammoth/frost mammoth/t-rex/young dragon"',
  'Heartwood Staff':
    'Section=combat ' +
    'Note="Has heartwood staff; may spend 1 PP after hit to inflict +d6 damage"',
  "Hell's Wrath":
    'Section=arcana ' +
    'Note="<i>Bolt</i>, <i>Blast</i>, and <i>Burst</i> inflict +2 damage"',
  'Infernal Armor':
    'Section=combat Note="May invoke glowing field that gives self +2 armor"',
  'Inspire Heroics':
    'Section=feature ' +
    'Note="R%{smarts}\\" May spend Benny 1/encounter to grant 5 Trait or damage rerolls"',
  'Instrument':'Section=skill Note="+1 Performance (arcane skill)"',
  'Master Alchemist':'Section=arcana Note="May create potions for half cost"',
  'Master Of Illusion':
    'Section=arcana Note="No cost to use Mobility and Sound Power Modifiers"',
  'Mercy':
    'Section=arcana ' +
    'Note="R%{spirit}\\" May spend 1 PP to remove Distracted, Vulnerable, or Shaken from target"',
  'Phenomenal Power':
    'Section=arcana ' +
    'Note="May spend Conviction to cast any power up to 20 PP at -2 penalty; failure inflicts permanent loss of 1 attribute die type"',
  'Primal Magic':
    'Section=arcana ' +
    'Note="Powers inflict +2 damage/Critical failure inflicts Stunned on all in 6\\" radius"',
  'Sacred Fetish':
    'Section=skill ' +
    'Note="May make free Faith reroll when fetish is held or prominently worn"',
  'Soul Jar':
    'Section=feature ' +
    'Note="Is Undead/2d6 days after being slain, hidden soul inhabits new corpse"',
  'Spellbooks':'Section=arcana Note="+V Power Count"',
  'The Evil Eye':
    'Section=arcana ' +
    'Note="R6\\" Target Bennies have no effect (Spirit-2 neg) for remainder of encounter 1/encounter"',
  'The Witching Hour':
    'Section=feature ' +
    'Note="Gains free Soak and cannot critically fail between midnight and 1 a.m."',
  "Tinkerer's Armor":
    'Section=combat '+
    'Note="May reduce armor Strength requirement by 1 die type and gain one of: +2 melee damage and free Strength reroll; +2 chest and back Armor; or dbl jump distance and +4 Pace/Wound has 50% chance of disabling armor"',
  'True Form':
    'Section=arcana Note="May cast powers at -2 penalty while shape changed"',
  'Undead Familiar':
    'Section=arcana ' +
    'Note="Can communicate w/magical, Wild Card undead that stores 5 Power Points"',
  // Hindrances
  'Amorous':
    'Section=skill Note="-2 on Tests by character w/Attractive feature"',
  'Arcane Sensitivity':'Section=attribute Note="-2 to resist powers"',
  'Arcane Sensitivity+':'Section=attribute Note="-4 to resist powers"',
  'Armor Interference':
    'Section=arcana,feature ' +
    'Note=' +
      '"-4 arcane skill rolls in medium or heavy armor",' +
      '"Cannot use arcane edge features in medium or heavy armor"',
  'Armor Interference+':
    'Section=arcana,feature ' +
    'Note=' +
      '"-4 arcane skill rolls in light, medium, or heavy armor",' +
      '"Cannot use arcane edge features in light, medium, or heavy armor"',
  'Blunderer+':
    'Section=skill ' +
    'Note="Skill die of 1 inflicts critical failure on chosen important skill"',
  'Corruption+':
    'Section=skill ' +
    'Note=' +
      '"Critical failure on arcane skill inflicts additional or increased hindrance until next advance"',
  'Cursed+':
    'Section=arcana ' +
    'Note="Powers cast to aid self suffer -2 arcane skill; critical failure stuns caster"',
  'Doomed+':'Section=attribute Note="-2 Vigor (soak)"',
  'Grim':
    'Section=combat ' +
    'Note="Provoked (-2 to affect other opponents) by any successful Taunt until Joker is drawn"',
  'Idealistic':
    'Section=feature Note="Approaches moral dilemmas with absolute thinking"',
  'Jingoistic':
    'Section=combat,skill ' +
    'Note=' +
      '"Command edges do not effect allies from other cultures",' +
      '"-2 Persuasion (characters from other cultures)"',
  'Jingoistic+':
    'Section=combat,skill ' +
    'Note=' +
      '"Command edges do not effect allies from other cultures",' +
      '"-4 Persuasion (characters from other cultures)"',
  'Material Components+':
    'Section=arcana ' +
    'Note="-4 arcane skill rolls when materials unavailable; critical failure exhausts materials"',
  'Selfless':'Section=feature Note="Puts others first"',
  'Selfless+':'Section=feature Note="Always puts others first"',
  'Talisman':
    'Section=arcana ' +
    'Note="-1 arcane skill rolls when talisman unavailable; critical failure inflicts Stunned"',
  'Talisman+':
    'Section=arcana ' +
    'Note="-2 arcane skill rolls when talisman unavailable; critical failure inflicts Stunned"'
};
SWADEFC.FEATURES = Object.assign({}, SWADE.FEATURES, SWADEFC.FEATURES_ADDED);
SWADEFC.HINDRANCES_ADDED = {
  'Amorous':'Severity=Minor',
  'Arcane Sensitivity':
    'Require="features.Arcane Sensitivity+ == 0" Severity=Minor',
  'Arcane Sensitivity+':
    'Require="features.Arcane Sensitivity == 0" Severity=Major',
  'Armor Interference':
    'Require="features.Armor Interference+ == 0","powerCount > 0" ' +
    'Severity=Minor',
  'Armor Interference+':
    'Require="features.Armor Interference == 0","powerCount > 0" ' +
    'Severity=Major',
  'Blunderer+':'Severity=Major',
  'Corruption+':'Require="powerCount > 0" Severity=Major',
  'Cursed+':'Severity=Major',
  'Doomed+':'Severity=Major',
  'Grim':'Severity=Minor',
  'Idealistic':'Severity=Minor',
  'Jingoistic':'Require="features.Jingoistic+ == 0" Severity=Minor',
  'Jingoistic+':'Require="features.Jingoistic == 0" Severity=Major',
  'Material Components+':'Require="powerCount > 0" Severity=Major',
  'Selfless':'Require="features.Selfless+ == 0" Severity=Minor',
  'Selfless+':'Require="features.Selfless == 0" Severity=Major',
  'Talisman':'Require="features.Talisman+ == 0" Severity=Minor',
  'Talisman+':'Require="features.Talisman == 0" Severity=Major',
};
SWADEFC.HINDRANCES =
  Object.assign({}, SWADE.HINDRANCES, SWADEFC.HINDRANCES_ADDED);
SWADEFC.POWERS_ADDED = {
  'Blessing':
    'Advances=4 ' +
    'PowerPoints=10 ' +
    'Range=community ' +
    'Description=' +
      '"1 hr ritual gives increases crops, health, and prosperity in area"',
  'Conjure Item':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP Complete set",' +
      '"+1 PP/lb Daily food",' +
      '"+1 PP/lb Lasts until dispelled" ' +
    'Description=' +
      '"1 hr process creates 2 lb (+1 PP/additional lb) mundane item for 1 hr"',
  'Curse':
    'Advances=4 ' +
    'PowerPoints=5 ' +
    'Range=touch ' +
    'Modifier=' +
      '"+5 PP Inflicts fatigue each rd (Spirit neg); incapacity turns to stone" ' +
    'Description=' +
      '"Target suffers 1 level fatigue and additional level each sunset (Spirit neg)"',
  'Locate':
    'Advances=0 ' +
    'PowerPoints=3 ' +
    'Range=self ' +
    'Modifier=' +
      '"+1 PP Self learns best path to target" ' +
    'Description=' +
      '"Gives direction of chosen item (-2 if self has never seen item, running water blocks spell) for 10 min"',
  'Lock/Unlock':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP Alerts self if unlocked" ' +
    'Description=' +
      '"Inflicts -4 to open (Raise seals shut) on target item or opens target item, ignoring 4 points of penalties (Raise disarms alarms and traps)"',
  'Mystic Intervention':
    'Advances=16 ' +
    'PowerPoints=20 ' +
    'Range=special ' +
    'Description=' +
      '"Ritual causes great event"',
  'Planar Binding':
    'Advances=8 ' +
    'PowerPoints=8 ' +
    'Range=smarts ' +
    'Description=' +
      '"Summons extraplanar creature to perform service (Spirit neg)"',
  'Plane Shift':
    'Advances=4 ' +
    'PowerPoints=4 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+1 PP Creates extra-dimensional shelter",' +
      '"+2 PP Plane shifts foe (Spirit neg) for 3 rd (Raise 5 rd)" ' +
    'Description=' +
      '"Self travels to chosen plane, w/in 10d10 miles of known location"',
  'Sanctuary':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=touch ' +
    'Modifier=' +
      '"+2/+3 PP 2\\"/3\\" radius",' +
      '"+1 PP Spirit-2" ' +
    'Description=' +
      '"Evil creatures cannot attack target (Spirit neg) for 5 rd"',
  'Scrying':
    'Advances=4 ' +
    'PowerPoints=3 ' +
    'Range=self ' +
    'Modifier=' +
      '"+1 PP Shares vision with allies in %{smarts}\\" radius" ' +
    'Description=' +
      '"Self sees chosen target (-2 unfamiliar target, Spirit neg) for 5 rd"',
  'Summon Animal':
    'Advances=0 ' +
    'PowerPoints=Special ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+Half PP Additional animals",' +
      '"+1 PP Increased Trait",' +
      '"+1 PP Mind Rider" ' +
    'Description=' +
      '"Brings chosen animal type to perform task for 5 rd"',
  'Summon Monster':
    'Advances=0 ' +
    'PowerPoints=Special ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+Half PP Additional monsters",' +
      '"+1 PP Increased Trait",' +
      '"+1 PP Mind Rider" ' +
    'Description=' +
      '"Brings chosen monster type to perform task for 5 rd"',
  'Summon Undead':
    'Advances=0 ' +
    'PowerPoints=Special ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+Half PP Additional undead",' +
      '"+1 PP Increased Trait",' +
      '"+1 PP Mind Rider" ' +
    'Description=' +
      '"Brings chosen undead type to perform task for 5 rd"',
  'Time Stop':
    'Advances=12 ' +
    'PowerPoints=10 ' +
    'Range=self ' +
    'Description=' +
      '"Self gains additional turn"'
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
  rules.defineEditorElement('race');
  rules.defineEditorElement
    ('race', 'Ancestry', 'select-one', 'races', 'imageUrl');
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
  rules.defineRule('ancestry', 'race', '=', null);
  rules.defineRule('armorMinStr', 'combatNotes.diminutive(Tiny)', 'v=', '4');
};

/*
 * Defines in #rules# the rules associated with ancestry #name# that cannot be
 * derived directly from the attributes passed to ancestryRules.
 */
SWADEFC.ancestryRulesExtra = function(rules, name) {
  if(name == 'Celestial') {
    rules.defineRule('combatNotes.flight', 'celestialAdvances', '=', '12');
  } else if(name == 'Dragonfolk') {
    rules.defineRule
      ('features.Arrogant+', 'featureNotes.ill-Tempered', '=', '1');
  } else if(name == 'Elemental Scion') {
    rules.defineRule
      ('edgePoints', 'featureNotes.elementalConnection', '+=', '1');
    QuilvynRules.prerequisiteRules
      (rules, 'validation', 'Elemental Scion', 'features.Elemental Scion',
       ['features.Air Scion || features.Earth Scion || features.Fire Scion || features.Water Scion']);
    rules.defineRule('features.Aquatic', 'features.Water Scion', '=', null);
    rules.defineRule('features.Elemental Scion',
      'race', '=', 'source=="Elemental Scion" ? 1 : null'
    );
    rules.defineRule('features.Environmental Resistance (Air)',
      'features.Air Scion', '=', null
    );
    rules.defineRule('features.Environmental Resistance (Earth)',
      'features.Earth Scion', '=', null
    );
    rules.defineRule('features.Environmental Resistance (Fire)',
      'features.Fire Scion', '=', null
    );
    rules.defineRule('features.Environmental Resistance (Water)',
      'features.Water Scion', '=', null
    );
    rules.defineRule('features.Inner Air', 'features.Air Scion', '=', null);
    rules.defineRule('features.Quick', 'features.Fire Scion', '=', null);
    rules.defineRule('features.Rock Solid', 'features.Earth Scion', '=', null);
  } else if(name == 'Fairy') {
    rules.defineRule('combatNotes.flight', 'fairyAdvances', '=', '6');
  } else if(name == 'Golem') {
    rules.defineRule('lacksCommonKnowledge',
      'skillNotes.reducedCoreSkills', '=', '1',
      'skillAllocation.Common Knowledge', '=', '0'
    );
    rules.defineRule('lacksPersuasion',
      'skillNotes.reducedCoreSkills', '=', '1',
      'skillAllocation.Persuasion', '=', '0'
    );
    rules.defineRule('lacksStealth',
      'skillNotes.reducedCoreSkills', '=', '1',
      'skillAllocation.Stealth', '=', '0'
    );
    rules.defineRule('skillStep.Common Knowledge',
      'lacksCommonKnowledge', '?', 'source != 1',
      'skillNotes.reducedCoreSkills', '+', '-1' // Reverse automatic d4
    );
    rules.defineRule('skillStep.Persuasion',
      'lacksPersuasion', '?', 'source != 1',
      'skillNotes.reducedCoreSkills', '+', '-1' // Reverse automatic d4
    );
    rules.defineRule('skillStep.Stealth',
      'lacksStealth', '?', 'source != 1',
      'skillNotes.reducedCoreSkills', '+', '-1' // Reverse automatic d4
    );
  } else if(name == 'Graveborn') {
    rules.defineRule('features.Environmental Resistance (Cold)',
      'featureNotes.coldResistance', '=', '1'
    );
  } else if(name == 'Half-Orc') {
    rules.defineRule('attributePoints', 'attributeNotes.hardened', '+=', '1');
  } else if(name == 'Insectoid') {
    rules.defineRule('features.Driven+', 'featureNotes.hiveMinded', '=', '1');
    rules.defineRule('features.Loyal', 'featureNotes.hiveMinded', '=', '1');
    rules.defineRule('weapons.Bite', 'combatNotes.biteOrClaw', '=', '1');
    rules.defineRule('weapons.Claws', 'combatNotes.biteOrClaw', '=', '1');
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
    rules.defineRule('features.Yellow+', 'featureNotes.craven', '=', '1');
  } else if(name == 'Shapeshifter') {
    rules.defineRule('features.Arcane Background (Gifted)',
      'featureNotes.changeShape', '=', '1'
    );
    rules.defineRule('powers.Disguise', 'features.Change Shape', '=', '1');
  }
  if(SWADE.raceRulesExtra)
    SWADE.raceRulesExtra(rules, name);
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
  if(name.match(/Arcane Background .Cleric/)) {
    rules.defineRule
      ('features.Arcane Background (Cleric)', 'features.' + name, '=', '1');
  } else if(name == 'Close Fighting') {
    rules.defineRule('combatNotes.closeFighting',
      '', '=', '1',
      'featureNotes.improvedCloseFighting', '+', '1'
    );
  } else if(name == 'Double Shot') {
    rules.defineRule('combatNotes.doubleShot',
      '', '=', '1',
      'featureNotes.improvedDoubleShot', '+', '1'
    );
  } else if(name == 'Elemental Master') {
    rules.defineRule('arcanaNotes.elementalMaster',
      'features.Elemental Master', '=', 'source + 1'
    );
  } else if(name == 'Favored Enemy') {
    rules.defineRule
      ('combatNotes.favoredEnemy', 'features.Favored Enemy', '=', null);
    rules.defineRule
      ('skillNotes.favoredEnemy', 'features.Favored Enemy', '=', null);
  } else if(name == 'Favored Terrain') {
    rules.defineRule
      ('combatNotes.favoredTerrain', 'features.Favored Terrain', '=', null);
    rules.defineRule
      ('skillNotes.favoredTerrain', 'features.Favored Terrain', '=', null);
  } else if(name == 'Heartwood Staff') {
    SWADEFC.weaponRules(
      rules, 'Heartwood Staff', 'Str+d8', 6, 6, '2h', null, null, null, 1
    );
    rules.defineRule
      ('weapons.Heartwood Staff', 'features.Heartwood Staff', '=', '1');
  } else if(name == 'Spellbooks') {
    rules.defineRule('arcanaNotes.spellbooks',
      '', '=', null,
      'features.New Powers', '+', null
    );
  } else if(name == 'Warband') {
    rules.defineRule
      ('combatNotes.warband', 'features.Warband', '=', 'source * 5');
  }
  if(SWADE.edgeRulesExtra)
    SWADE.edgeRulesExtra(rules, name);
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
  return SWADE.randomizeOneAttribute.apply(this, [attributes, attribute]);
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
