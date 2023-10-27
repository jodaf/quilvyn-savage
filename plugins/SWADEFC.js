/*
Copyright 2023, James J. Hayes

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
 * particular parts of the rules: ancestryRules for character ancestries,
 * arcaneRules for powers, etc. These member methods can be called
 * independently in order to use a subset of the SWADEFC rules. Similarly, the
 * constant fields of SWADE (SKILLS, EDGES, etc.) can be manipulated to modify
 * the choices.
 */
function SWADEFC(baseRules, rules) {

  if(window.SWADE == null) {
    alert('The SWADEFC module requires use of the SWADE module');
    return;
  }
  if(rules == null)
    rules = SWADE.rules;
  rules.fcReplacedRandomizer = rules.randomizeOneAttribute;
  rules.randomizeOneAttribute = SWADEFC.randomizeOneAttribute;
  SWADEFC.combatRules
    (rules, SWADEFC.ARMORS, SWADEFC.SHIELDS, SWADEFC.WEAPONS);
  SWADEFC.arcaneRules(rules, SWADEFC.ARCANAS, SWADEFC.POWERS);
  SWADEFC.talentRules
    (rules, SWADEFC.EDGES, SWADEFC.FEATURES, SWADEFC.GOODIES,
     SWADEFC.HINDRANCES, SWADEFC.SKILLS);
  SWADEFC.identityRules
    (rules, SWADEFC.ANCESTRYS, SWADEFC.ERAS, SWADEFC.CONCEPTS);

  Quilvyn.addRuleSet(rules);

}

SWADEFC.VERSION = '2.4.1.0';

SWADEFC.ANCESTRYS = {
  'Aquarian':SWADE.RACES.Aquarian,
  'Avion':SWADE.RACES.Avion,
  'Celestial':
    'Abilities=' +
      'Flight,Attractive,"Code Of Honor+",Vow+',
  'Centaur':
    'Abilities=' +
      'Dependency,Hooves,"Size +1","Pace +4","Unusual Form"',
  'Dragonfolk':
    'Abilities=' +
      '"Armor +2",Bite,Claws,"Breath Weapon",Cold-Blooded,' +
      '"Environmental Resistance (Heat)","Environmental Weakness (Cold)",' +
      'Ill-Tempered',
  'Dwarf':SWADE.RACES.Dwarf,
  'Elemental Scion':
    'Abilities=' +
      '"Elemental Connection",Outsider',
  'Elf':SWADE.RACES.Elf,
  'Fairy':
    'Abilities=' +
      '"All Thumbs","Big Mouth",Curious+,Flight,Impulsive+,"Diminutive (Tiny)"',
  'Gnome':
    'Abilities=' +
      'Cunning,"Low Light Vision","Keen Senses","Size -1","Reduced Pace"',
  'Goblin':
    'Abilities=' +
      '"Infravision (Goblin)",Mean,Short,Sneaky,Survivors',
  'Golem':
    'Abilities=' +
      '"Armor +2",Big,Clueless+,Clumsy+,Construct,"No Vital Organs",' +
      '"Reduced Core Skills","Reduced Pace","Size +2"',
  'Graveborn':
    'Abilities=' +
      '"Animal Aversion",Bite,"Blood Drinker","Low Light Vision",Outsider+,' +
      '"Sunlight Sensitivity","Unnatural Strength","Cold Resistance"',
  'Half-Elf':SWADE.RACES['Half-Elf'],
  'Half-Folk':SWADE.RACES['Half-Folk'],
  'Half-Giant':
    'Abilities=' +
      'Big,Boneheaded,Clueless+,Illiterate,Outsider+,"Size +3","Very Strong",' +
      '"Very Tough"',
  'Half-Orc':
    'Abilities=' +
      'Infravision,Outsider,Hardened',
  'Human':SWADE.RACES.Human,
  'Infernal':
    'Abilities=' +
      'Darkvision,"Devilish Nature","Environmental Resistance (Heat)",' +
      '"Environmental Weakness (Cold)",Horns,Outsider',
  'Insectoid':
    'Abilities=' +
      '"Additional Actions","Armor +2","Hive Minded","Bite Or Claw",Outsider,' +
      '"Unusual Body Shape","Wall Walker"',
  'Minotaur':
    'Abilities=' +
      '"Thin Skinned+","Size +1","Very Strong",Horns,Uneducated,Tough,Big,Mean',
  'Mouseling':
    'Abilities=' +
      '"Diminutive (Tiny)","Low Light Vision",Outsider+,"Phobia (Cats)",' +
      '"Reduced Pace",Unimposing',
  'Ogre':
    'Abilities=' +
      'Arrogant+,Big,Clueless+,Clumsy+,Outsider,Hardy,"Size +1",' +
      '"Very Strong","Very Tough"',
  'Orc':
    'Abilities=' +
      'Brutish,Infravision,Outsider+,"Size +1",Strong,Tough',
  'Rakashan':
    SWADE.RACES.Rakashan.replace('Racial', 'Ancestral')
                        .replace('Abilities=', 'Abilities="Claws (Climbing)",'),
  'Ratling':
    'Abilities=' +
      'Bite,Claws,"Claws (Climbing)","Natural Resistance","Low Light Vision",' +
      'Scavenger,"Size -1",Outsider+,Craven,Greedy',
  'Saurian':SWADE.RACES.Saurian,
  'Serpentfolk':
    'Abilities=' +
      'Bite,Cold-Blooded,"Environmental Weakness (Cold)",Infravision,' +
      '"Pace (Serpentfolk)","Venomous Bite",Outsider',
  'Shapeshifter':
    'Abilities=' +
      'Charismatic,"Change Shape",Secret+'
};
SWADEFC.ARCANAS = {
  'Alchemist':
    'Skill=Alchemy ' +
    'Powers=' +
      'Banish,"Beast Friend",Blast,Blind,"Boost/Lower Trait",Burst,Confusion,' +
      'Darksight,Deflection,"Detect/Conceal Arcana",Empathy,Entangle,' +
      '"Environmental Protection",Farsight,Fear,Fly,Growth/Shrink,Healing,' +
      'Intangibility,Light/Darkness,Protection,Puppet,Relief,Resurrection,' +
      '"Shape Change",Sloth/Speed,Slumber,Smite,"Speak Language",' +
      '"Wall Walker","Warrior\'s Gift"',
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
      '"Arcane Protection","Beast Friend",Blessing,Blind,Bolt,' +
      '"Boost/Lower Trait",Confusion,Darksight,Deflection,' +
      '"Detect/Conceal Arcana",Disguise,Dispel,Divination,' +
      '"Drain Power Points",Empathy,"Environmental Protection",Farsight,Fear,' +
      'Fly,"Growth/Shrink",Healing,Illusion,Intangibility,Invisibility,' +
      'Light/Darkness,"Mystic Intervention",Puppet,Relief,Sanctuary,' +
      '"Shape Change",Sloth/Speed,Slumber,Sound/Silence,Stun',
  'Elementalist':
    'Skill=Spellcasting ' +
    'Powers=' +
      'Barrier,Blast,Bolt,Burrow,Burst,Confusion,"Damage Field",Deflection,' +
      'Divination,"Elemental Manipulation",Entangle,' +
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
      'Divination,"Drain Power Points","Elemental Manipulation",Empathy,' +
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
      '"Arcane Protection",Banish,Barrier,"Beast Friend",Blast,Blessing,' +
      'Blind,Bolt,"Boost/Lower Trait",Burrow,Burst,Confusion,"Conjure Item",' +
      'Curse,Darksight,Deflection,"Detect/Conceal Arcana",Disguise,Dispel,' +
      'Divination,"Drain Power Points","Elemental Manipulation",Empathy,' +
      'Entangle,"Environmental Protection",Farsight,Fear,Fly,Growth/Shrink,' +
      'Havoc,Healing,Illusion,Invisibility,Light/Darkness,Locate,Lock/Unlock,' +
      '"Mystic Intervention","Mind Reading","Mind Wipe","Object Reading",' +
      'Protection,Puppet,Relief,Scrying,"Shape Change",Sloth/Speed,Slumber,' +
      'Smite,Sound/Silence,"Speak Language",Stun,"Summon Ally",' +
      '"Summon Animal",Telekinesis,"Wall Walker","Warrior\'s Gift",Wish',
  'Wizard':
    'Skill=Spellcasting ' +
    'Powers=' +
      '"Arcane Protection",Barrier,"Beast Friend",Blast,Blind,Bolt,' +
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
  'Cleric (Cold Domain)':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection",Barrier,"Beast Friend",Blast,Blessing,Bolt,' +
      '"Boost/Lower Trait",Burst,"Damage Field",Darksight,Deflection,Dispel,' +
      'Divination,"Drain Power Points","Elemental Manipulation",Entangle,' +
      '"Environmental Protection",Farsight,Fly,Growth/Shrink,Havoc,Healing,' +
      'Invisibility,Light/Darkness,"Mystic Intervention",Protection,' +
      'Sanctuary,"Shape Change",Sloth/Speed,Slumber,Smite,Sound/Silence,' +
      'Stun,"Summon Ally",Teleport,"Warrior\'s Gift",Zombie',
  'Cleric (Death Domain)':
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
  'Cleric (Life Domain)':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection",Banish,Barrier,"Beast Friend",Blessing,' +
      '"Boost/Lower Trait",Confusion,"Conjure Item",Darksight,Deflection,' +
      '"Detect/Conceal Arcana",Disguise,Dispel,Divination,Empathy,Entangle,' +
      '"Environmental Protection",Farsight,Fly,Growth/Shrink,Havoc,Healing,' +
      'Light/Darkness,"Mystic Intervention",Protection,Relief,Resurrection,' +
      'Sanctuary,Sloth/Speed,Slumber,Smite,Sound/Silence,"Speak Language",' +
      'Stun,"Summon Ally","Summon Animal","Warrior\'s Gift"',
  'Cleric (Justice Domain)':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Projection",Banish,Blast,Blind,Bolt,"Boost/Lower Trait",Burst,' +
      'Confusion,"Conjure Item","Damage Field",Darksight,Deflection,' +
      '"Detect/Conceal Arcana",Dispel,Divination,"Drain Power Points",' +
      'Empathy,Farsight,Fly,Havoc,Healing,Invisibility,Light/Darkness,' +
      '"Mind Reading","Object Reading","Mystic Intervention",Protection,' +
      'Sanctuary,Sloth/Speed,Smite,Sound/Silence,"Speak Language",Stun',
  'Cleric (Knowledge Domain)':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection",Banish,Barrier,Blessing,Blind,"Boost/Lower Trait",' +
      'Confusion,"Conjure Item",Darksight,Deflection,"Detect/Conceal Arcana",' +
      'Disguise,Dispel,Divination,Farsight,Fear,Havoc,Healing,Light/Darkness,' +
      '"Mind Link","Mind Reading","Mind Wipe","Mystic Intervention",' +
      '"Object Reading",Protection,Sanctuary,Slumber,Sound/Silence,' +
      '"Speak Language",Stun,"Summon Ally"',
  'Cleric (Moon Domain)':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection","Beast Friend",Blessing,Blind,Bolt,' +
      '"Boost/Lower Trait",Confusion,Darksight,Deflection,' +
      '"Detect/Conceal Arcana",Disguise,Dispel,Divination,' +
      '"Drain Power Points",Empathy,Farsight,Fear,Fly,Growth/Shrink,Healing,' +
      'Illusion,Intangibility,Invisibility,Light/Darkness,' +
      '"Mystic Intervention",Puppet,Relief,Sanctuary,"Shape Change",' +
      'Sloth/Speed,Slumber,Sound/Silence,Stun',
  'Cleric (Nature Domain)':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection",Barrier,"Beast Friend",Blessing,Bolt,' +
      '"Boost/Lower Trait",Burrow,"Conjure Item","Damage Field",Darksight,' +
      'Deflection,Disguise,Divination,"Elemental Manipulation",Entangle,' +
      '"Environmental Protection",Farsight,Fear,Fly,Growth/Shrink,Havoc,' +
      'Healing,"Mystic Intervention",Protection,Relief,Sanctuary,' +
      '"Shape Change",Sloth/Speed,Smite,Sound/Silence,Stun,"Summon Animal",' +
      '"Summon Monster","Wall Walker","Warrior\'s Gift"',
  'Cleric (Sea Domain)':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection","Beast Friend",Blast,Bolt,"Boost/Lower Trait",' +
      'Burst,"Damage Field",Deflection,Dispel,Divination,' +
      '"Elemental Manipulation","Environmental Protection",Farsight,Healing,' +
      'Light/Darkness,"Mystic Intervention",Protection,Relief,Sanctuary,' +
      '"Shape Change",Sloth/Speed,Smite,Sound/Silence,"Summon Ally",' +
      '"Summon Animal"',
  'Cleric (Sun Domain)':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection",Banish,Blast,Blessing,Blind,Bolt,' +
      '"Boost/Lower Trait",Confusion,"Damage Field",Darksight,Deflection,' +
      '"Detect/Conceal Arcana",Dispel,Divination,"Elemental Manipulation",' +
      '"Environmental Protection",Fear,Fly,Havoc,Healing,Illusion,' +
      'Light/Darkness,"Mystic Intervention",Protection,Relief,Resurrection,' +
      'Sanctuary,Sloth/Speed,Smite,Stun',
  'Cleric (Thievery Domain)':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection",Barrier,Blessing,Blind,"Boost/Lower Trait",' +
      'Confusion,"Conjure Item",Darksight,Deflection,"Detect/Conceal Arcana",' +
      'Disguise,Dispel,"Drain Power Points",Empathy,Growth/Shrink,Havoc,' +
      'Healing,Illusion,Intangibility,Invisibility,Light/Darkness,' +
      '"Object Reading",Protection,Sanctuary,Sloth/Speed,Slumber,' +
      'Sound/Silence,"Speak Language","Wall Walker"',
  'Cleric (War Domain)':
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
SWADEFC.CONCEPTS = {
  'Alchemist':
    'Edge="Arcane Background (Alchemist)" ' +
    'Attribute=Smarts ' +
    'Skill=Alchemy',
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
SWADEFC.EDGES = {
  'Air Scion':'Type=Background Require="ancestry == \'Elemental Scion\'"',
  'Earth Scion':'Type=Background Require="ancestry == \'Elemental Scion\'"',
  'Fire Scion':'Type=Background Require="ancestry == \'Elemental Scion\'"',
  'Water Scion':'Type=Background Require="ancestry == \'Elemental Scion\'"',
  'Chosen':'Type=Background',
  'Fey Blood':'Type=Background',
  'Favored Enemy':
    'Type=Background ' +
    'Require=' +
      '"skills.Athletics >= 6 || skills.Fighting >= 6 || skills.Shooting >= 6"',
  'Favored Terrain':'Type=Background Require="skills.Survival >= 6"',
  'Heirloom':'Type=Background',
  'Charge':'Type=Combat Require="advances >= 4","skills.Fighting >= 8"',
  'Close Fighting':'Type=Combat Require="agility >= 8","skills.Fighting >= 8"',
  'Improved Close Fighting':
    'Type=Combat Require="advances >= 8","features.Close Fighting"',
  'Defender':'Type=Combat Require="advances >= 4","skills.Fighting >= 6"',
  'Dirty Fighter':'Type=Combat Require="advances >= 4"',
  'Really Dirty Fighter':
    'Type=Combat Require="advances >= 4","features.Dirty Fighter"',
  'Double Shot':
    'Type=Combat ' +
    'Require="advances >= 4","skills.Athletics >= 8 || skills.Shooting >= 8"',
  'Improved Double Shot':
    'Type=Combat ' +
    'Require=' +
      '"advances >= 12",' +
      '"features.Double Shot",' +
      '"skills.Athletics >= 10 || skills.Shooting >= 10"',
  'Formation Fighter':'Type=Combat Require="skills.Fighting >= 8"',
  'Shield Wall':
    'Type=Combat Require="features.Formation Fighter","skills.Fighting >= 8"',
  'Martial Flexibility':
    'Type=Combat Require="advances >= 4","skills.Fighting >= 8"',
  'Missile Deflection':
    'Type=Combat Require="advances >= 12","skills.Fighting >= 10"',
  'Opportunistic':'Type=Combat Require="advances >= 8"',
  'Roar':'Type=Combat Require="advances >= 4","spirit >= 8"',
  'Savagery':'Type=Combat Require="skills.Fighting >= 6"',
  'Scorch':
    'Type=Combat Require="advances >= 4","vigor >= 8","features.Breath Weapon"',
  'Sneak Attack':'Type=Combat Require="advances >= 4","features.Assassin"',
  'Improved Sneak Attack':
    'Type=Combat Require="advances >= 8","features.Sneak Attack"',
  'Stunning Blow':'Type=Combat Require="advances >= 4","strength >= 8"',
  'Sunder':'Type=Combat Require="strength >= 8"',
  'Take The Hit':
    'Type=Combat Require="advances >= 4","features.Iron Jaw","vigor >= 10"',
  'Trick Shot':
    'Type=Combat ' +
    'Require="advances >= 4","skills.Athletics >= 8 || skills.Shooting >= 8"',
  'Uncanny Reflexes':
    'Type=Combat ' +
    'Require="advances >= 8","agility >= 8","skills.Athletics >= 8"',
  'Wing Gust':'Type=Combat Require="advances >= 4","features.Flight"',
  'Artificer':'Type=Power Require="advances >= 4","powerPoints >= 1"',
  'Master Artificer':
    'Type=Power ' +
    'Require="advances >= 12","features.Artificer","skills.Occult >= 10"',
  'Battle Magic':
    'Type=Power Require="advances >= 8","powerPoints > 0","arcaneSkill >= 10"',
  // NOTE: Also requires "evil disposition"
  'Blood Magic':'Type=Power Require="powerPoints > 0"',
  'Epic Mastery':
    'Type=Power Require="advances >= 8","powerPoints > 0","arcaneSkill >= 6"',
  'Familiar':
    'Type=Power ' +
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
    'Type=Power Require="advances >= 4","powerPoints > 0","arcaneSkill >= 8"',
  'Mystic Powers (Barbarian)':
    'Type=Power Require="advances >= 4","strength >= 8"',
  'Mystic Powers (Fighter)':
    'Type=Power Require="advances >= 4","skills.Fighting >= 8"',
  'Mystic Powers (Monk)':
    'Type=Power Require="advances >= 4","skills.Athletics >= 8"',
  'Mystic Powers (Paladin)':
    'Type=Power Require="advances >= 4","spirit >= 8"',
  'Mystic Powers (Ranger)':
    'Type=Power Require="advances >= 4","skills.Survival >= 8"',
  'Mystic Powers (Rogue)':
    'Type=Power Require="advances >= 4 ","skills.Thievery >= 8"',
  'Silent Caster':
    'Type=Power ' +
    'Require="powerPoints > 0","features.Bard == 0","skills.Occult >= 8"',
  'Transfer':'Type=Power Require="powerPoints > 0"',
  'Born In The Saddle':
    'Type=Professional Require="agility >= 8","skills.Riding >= 6"',
  'Explorer':'Type=Professional Require="vigor >= 6","skills.Survival >= 8"',
  'Knight':
    'Type=Professional ' +
    'Require=' +
      '"spirit >= 6",' +
      '"strength >= 8",' +
      '"vigor >= 8",' +
      '"skills.Fighting >= 8",' +
      '"skills.Riding >= 6",' +
      '"features.Obligation+"',
  'Mount':'Type=Professional Require="skills.Riding >= 6"',
  'Poisoner':
    'Type=Professional ' +
    'Require=' +
      '"skills.Alchemy >= 6 || skills.Healing >= 6 || skills.Survival >= 6"',
  'Scout':'Type=Professional Require="skills.Survival >= 6"',
  'Stonecunning':'Type=Professional Require="skills.Repair >= 6"',
  'Trap Sense':'Type=Professional Require="advances >= 4","skills.Repair >= 6"',
  'Treasure Hunter':
    'Type=Professional Require="skills.Notice >= 8","skills.Occult >= 8"',
  'Troubadour':
    'Type=Professional ' +
    'Require="skills.Common Knowledge >= 6","skills.Performance >= 8"',
  'Deceptive':'Type=Social Require="advances >= 4","smarts >= 8"',
  'Aura Of Courage':'Type=Weird Require="spirit >= 8"',
  'Beast Talker':'Type=Weird',
  'Rapid Change':'Type=Weird Require="features.Lycanthropy"',
  'Home Ground':
    'Type=Legendary Require="advances >= 16","spirit >= 8","powerPoints > 0"',
  'Relic':'Type=Legendary',
  'Unstoppable':
    'Type=Legendary ' +
    'Require="vigor >= 10","features.Iron Jaw","features.Nerves Of Steel"',
  'Warband':
    'Type=Legendary ' +
    'Require="features.Command","sumLeadershipEdges >= 3","features.Followers"',
  // Arcane Backgrounds
  'Arcane Background (Alchemist)':'Type=Background Require="smarts >= 6"',
  'Arcane Background (Bard)':'Type=Background Require="spirit >= 6"',
  'Arcane Background (Cleric (Cold Domain))':
    'Type=Background Require="spirit >= 6"',
  'Arcane Background (Cleric (Death Domain))':
    'Type=Background Require="spirit >= 6"',
  'Arcane Background (Cleric (Life Domain))':
    'Type=Background Require="spirit >= 6"',
  'Arcane Background (Cleric (Justice Domain))':
    'Type=Background Require="spirit >= 6"',
  'Arcane Background (Cleric (Knowledge Domain))':
    'Type=Background Require="spirit >= 6"',
  'Arcane Background (Cleric (Moon Domain))':
    'Type=Background Require="spirit >= 6"',
  'Arcane Background (Cleric (Nature Domain))':
    'Type=Background Require="spirit >= 6"',
  'Arcane Background (Cleric (Sea Domain))':
    'Type=Background Require="spirit >= 6"',
  'Arcane Background (Cleric (Sun Domain))':
    'Type=Background Require="spirit >= 6"',
  'Arcane Background (Cleric (Thievery Domain))':
    'Type=Background Require="spirit >= 6"',
  'Arcane Background (Cleric (War Domain))':
    'Type=Background Require="spirit >= 6"',
  'Arcane Background (Diabolist)':'Type=Background Require="smarts >= 6"',
  'Arcane Background (Druid)':'Type=Background Require="spirit >= 6"',
  'Arcane Background (Elementalist)':'Type=Background Require="smarts >= 6"',
  'Arcane Background (Illusionist)':'Type=Background Require="smarts >= 6"',
  'Arcane Background (Necromancer)':'Type=Background Require="smarts >= 6"',
  'Arcane Background (Shaman)':'Type=Background Require="spirit >= 6"',
  'Arcane Background (Sorcerer)':'Type=Background Require="smarts >= 6"',
  'Arcane Background (Summoner)':'Type=Background Require="smarts >= 6"',
  'Arcane Background (Tinkerer)':'Type=Background Require="smarts >= 6"',
  'Arcane Background (Warlock/Witch)':'Type=Background Require="smarts >= 6"',
  'Arcane Background (Wizard)':'Type=Background Require="smarts >= 6"',
  // AB-dependent edges
  'Chemist':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Alchemist)",' +
      '"skills.Alchemy >= 8"',
  'Master Alchemist':
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Alchemist)",' +
      '"skills.Alchemy >= 10"',
  'Dirge':
    'Type=Power ' +
    'Require=' +
      '"advances >= 12",' +
      '"features.Arcane Background (Bard)"',
  'Inspire Heroics':
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Bard)",' +
      '"skills.Performance >= 8"',
  'Instrument':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Bard)"',
  'Destroy Undead':
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Cleric)"',
  'Mercy':
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Cleric)",' +
      '"skills.Faith >= 8"',
  "Hell's Wrath":
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Diabolist)"',
  'Infernal Armor':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Diabolist)"',
  'Heartwood Staff':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Druid)"',
  'True Form':
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Druid)"',
  'Elemental Absorption':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Elementalist)"',
  'Elemental Master':
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Elementalist)"',
  'Deadly Illusion':
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Illusionist)",' +
      '"skills.Spellcasting >= 10"',
  'Master Of Illusion':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Illusionist)",' +
      '"skills.Spellcasting >= 8"',
  'Soul Jar':
    'Type=Power ' +
    'Require=' +
      '"advances >= 16",' +
      '"features.Arcane Background (Necromancer)",' +
      '"skills.Occult >= 10"',
  'Undead Familiar':
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Necromancer)"',
  'Primal Magic':
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Shaman)"',
  'Sacred Fetish':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Shaman)",' +
      '"skills.Faith >= 8"',
  'Great Power':
    'Type=Power ' +
    'Require=' +
      '"advances >= 8",' +
      '"features.Arcane Background (Sorcerer)"',
  'Phenomenal Power':
    'Type=Power ' +
    'Require=' +
      '"advances >= 12",' +
      '"features.Arcane Background (Sorcerer)",' +
      '"features.Great Power"',
  'Arcane Barding':
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Summoner)",' +
      '"powers.Summon Animal"',
  'Ferocious Summoning':
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Summoner)",' +
      '"powers.Summon Monster"',
  'Great Summoning':
    'Type=Power ' +
    'Require=' +
      '"advances >= 12",' +
      '"features.Arcane Background (Summoner)",' +
      '"powers.Summon Animal",' +
      '"powers.Summon Monster"',
  'Construct Familiar':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Tinkerer)"',
  "Tinkerer's Armor":
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Tinkerer)"',
  'The Evil Eye':
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Warlock/Witch)"',
  'The Witching Hour':
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Warlock/Witch)"',
  'Eldritch Inspiration':
    'Type=Power ' +
    'Require=' +
      '"advances >= 8",' +
      '"features.Arcane Background (Wizard)"',
  'Spellbooks':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Wizard)"'
};
SWADEFC.ERAS = {
  // empty
};
SWADEFC.FEATURES = {
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
  // Armor +2 as SWADE
  // Attractive as SWADE
  // Big as SWADE
  // Bite as SWADE
  'Bite Or Claw':
    'Section=combat Note="Mandibles or pincers inflict Bite or Claws damage"',
  'Blood Drinker':
    'Section=feature ' +
    'Note="May drink humanoid blood to gain a natural healing roll 1/session"',
  'Boneheaded':'Section=attribute Note="-1 Smarts"',
  'Breath Weapon':
    'Section=combat ' +
    'Note="Successful Athletics inflicts 2d6 fire damage in a 9\\" cone or 12\\" line; critical failure inflicts Fatigue on self"',
  'Brutish':'Section=attribute Note="-1 Smarts"',
  'Change Shape':
    'Section=arcana,feature ' +
    'Note=' +
      '"May use <i>Disguise</i> as a limited free action to change own appearance",' +
      '"Has Arcane Background (Gifted) feature"',
  // Charismatic as SWADE
  // Claws as SWADE
  'Claws (Climbing)':'Section=skill Note="+2 Athletics (climbing)"',
  'Cold Resistance':
    'Section=feature Note="Has Environmental Resistance (Cold) feature"',
  'Cold-Blooded':
    'Section=attribute ' +
    'Note="10 min in 60F/18C or below inflicts -1 Agility, Strength, and Vigor"',
  // Construct as SWADE
  'Craven':'Section=feature Note="Has Yellow+ feature"',
  'Cunning':'Section=attribute Note="+1 Smarts Step"',
  'Darkvision':'Section=feature Note="R10\\" Ignores illumination penalties"',
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
  // Environmental Resistance (Cold) as SWADE
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
  // Flight as SWADE
  'Hardened':'Section=attribute Note="+1 Attribute Points (Strength or Vigor)"',
  // Hardy as SWADE
  'Hive Minded': 'Section=feature Note="Has Driven+ and Loyal features"',
  'Hooves':'Section=combat Note="Hooves are a natural weapon"',
  // Horns as SWADE
  'Ill-Tempered':'Section=feature Note="Has Arrogant+ feature"',
  'Infravision (Goblin)':
    'Section=combat ' +
    'Note="Illumination penalties reduced by half when attacking targets that radiate heat or cold"',
  'Inner Air':'Section=feature Note="Does not need to breathe"',
  // Low Light Vision as SWADE
  // Keen Senses as SWADE
  'Natural Resistance':'Section=combat Note="Immune to poison and disease"',
  // No Vital Organs as SWADE
  'Pace (Serpentfolk)':'Section=combat Note="+4 Pace/+2 Run Step"',
  'Pace +4':'Section=combat Note="+4 Pace/+2 Run Step"',
  'Phobia (Cats)':
    'Section=feature Note="Suffers -1 on Trait rolls in the presence of cats"',
  'Reduced Core Skills':
    'Section=skill ' +
    'Note="Has no starting Common Knowledge, Persuasion, or Stealth ability"',
  // Reduced Pace as SWADE
  'Rock Solid':'Section=attribute Note="+1 Vigor Step"',
  // Scavenger as SWADE
  'Short':'Section=combat,description Note="-1 Toughness","-1 Size"',
  // Size -1 as SWADE
  // Size +1 as SWADE
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
  'Sneaky':'Section=skill Note="+1 Stealth Step"',
  'Sunlight Sensitivity':
    'Section=combat Note="Suffers Distraction in sunlight or equivalent"',
  'Survivors':'Section=feature Note="+1 Edge Points"',
  // Tough as SWADE
  'Uneducated':'Section=attribute Note="-1 Smarts"',
  'Unimposing':'Section=feature Note="Has Mild Mannered feature"',
  'Unnatural Strength':'Section=attribute Note="+1 Strength Step"',
  'Unusual Body Shape':
    'Section=feature Note="Cannot use standard armor or furnishings"',
  'Unusual Form':
    'Section=feature Note="Cannot ride mounts or use some standard equipment"',
  'Venomous Bite':
    'Section=combat Note="Successful bite inflicts Mild Poison (Vigor neg)"',
  'Very Strong':'Section=attribute Note="+2 Strength Step"',
  'Very Tough':'Section=attribute Note="+2 Vigor Step"',
  // Wall Walker as SWADE
  'Water Scion':
    'Section=feature ' +
    'Note="Has Environmental Resistance (Water) and Aquatic features"',
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
      '"Flashing glow gives self +1 on some Tests and inflicts -1 melee attacks on foes"',
  // Edges
  'Arcane Background (Alchemist)':
    'Section=arcana,arcana,feature ' +
    'Note=' +
      '"3 Powers/15 Power Points",' +
      '"May make alchemical items/Concoctions given to others have specific aspects, use self Alchemy to activate, and must be used w/in 48 hr",' +
      '"Has Material Components+ feature"',
  'Arcane Background (Bard)':
    'Section=arcana,feature ' +
    'Note=' +
      '"3 Powers/10 Power Points",' +
      '"Has Armor Interference, Magic, and Sharp Tongued features"',
  'Arcane Background (Cleric)':
    'Section=arcana,feature ' +
    'Note=' +
      '"5 Powers/10 Power Points",' +
      '"Has Holy Symbol, Miracles, and Vow+ features"',
  'Arcane Background (Diabolist)':
    'Section=arcana,feature ' +
    'Note=' +
      '"5 Powers/10 Power Points",' +
      '"Has Armor Interference+, Corruption+, Magic, and Summoning features"',
  'Arcane Background (Druid)':
    'Section=arcana,feature ' +
    'Note=' +
      '"5 Powers/10 Power Points",' +
      '"Has Armor Interference, Material Components+, Miracles, One With Nature, Vow+, and Wilderness Stride features"',
  'Arcane Background (Elementalist)':
    'Section=arcana,feature ' +
    'Note=' +
      '"5 Powers/10 Power Points",' +
      '"Has Armor Interference+, Elemental Origin, Elemental Synergy, and Magic features"',
  'Arcane Background (Illusionist)':
    'Section=arcana,feature ' +
    'Note=' +
      '"5 Powers/10 Power Points",' +
      '"Has Armor Interference+, Magic, and Strong Illusions features"',
  'Arcane Background (Necromancer)':
    'Section=arcana,feature ' +
    'Note=' +
      '"5 Powers/10 Power Points",' +
      '"Has Corruption+, Magic, and Raise The Dead features"',
  'Arcane Background (Shaman)':
    'Section=arcana,feature ' +
    'Note=' +
      '"5 Powers/10 Power Points",' +
      '"Has Armor Interference, Favored Power, Fetish, Miracles, and Quirk features"',
  'Arcane Background (Sorcerer)':
    'Section=arcana,arcana,feature ' +
    'Note=' +
      '"3 Powers/15 Power Points",' +
      '"Critical failure on Spellcasting inflicts Fatigued, Stunned, and Corruption",' +
      '"Has Armor Interference, Corruption+, and Overpower features"',
  'Arcane Background (Summoner)':
    'Section=arcana,feature ' +
    'Note=' +
      '"5 Powers/15 Power Points",' +
      '"Has Armor Interference, Magic, and Master Summoner features"',
  'Arcane Background (Tinkerer)':
    'Section=arcana,arcana,arcana,feature ' +
    'Note=' +
      '"2 Powers/15 Power Points",' +
      '"Critical failure disables device; requires 1 hr and successful Repair to mend",' +
      '"Devices given to others use self Repair skill and PP to activate",' +
      '"Has Jinx, Tools, and Weird Science features"',
  'Arcane Background (Warlock/Witch)':
    'Section=arcana,feature ' +
    'Note=' +
      '"3 Powers/10 Power Points",' +
      '"Has Armor Interference+, Corruption+, Coven, Familiar, Magic, Material Components+, and Prepared Powers features"',
  'Arcane Background (Wizard)':
    'Section=arcana,feature ' +
    'Note=' +
      '"6 Powers/15 Power Points",' +
      '"Has Armor Interference+, Magic, and Material Components+ features"',
  'Assassin': // Changed from SWADE
    'Section=combat Note="+d6 damage to Vulnerable foes and with The Drop"',
  'Aura Of Courage':
    'Section=combat ' +
    'Note="R10\\" Allies gain +1 vs. fear and -1 on fear table results"',
  'Battle Magic':'Section=arcana Note="May cast spells on units of Extras"',
  'Beast Talker':'Section=skill Note="May speak with chosen class of animals"',
  'Blood Magic':
    'Section=arcana ' +
    'Note="Inflicting a Wound on a conscious, sapient being restores d6 Power Points to self"',
  'Born In The Saddle':
    'Section=skill ' +
    'Note="May reroll Riding/Mount gains +2 Pace and +1 Run Step"',
  'Charge':
    'Section=combat Note="Fighting attack after 5\\" run inflicts +2 damage"',
  'Chosen':
    'Section=combat,feature,feature ' +
    'Note=' +
      '"Conviction effects last until the end of the encounter",' +
      '"Has Enemy+ feature",' +
      '"Permanent mark shows Chosen status"',
  'Close Fighting':
    'Section=combat ' +
    'Note="+%{combatNotes.improvedCloseFighting?2:1} attack and Parry with a knife against a more heavily-armed foe"',
  'Coven':
    'Section=arcana Note="R12\\" May freely transfer PP w/other coven members"',
  'Deceptive':
    'Section=skill ' +
    'Note="May choose whether target resists Smarts- or Spirit-linked Tests with Smarts or Spirit"',
  'Defender':
    'Section=combat Note="May share shield Parry w/chosen adjacent ally"',
  'Dirty Fighter':'Section=skill Note="+2 Fighting (performing Test)"',
  'Double Shot':
    'Section=combat ' +
    'Note="May fire or throw 2 projectiles %{combatNotes.improvedDoubleShot?2:1}/tn"',
  'Elemental Origin':
    'Section=arcana Note="Powers must use trappings of chosen element"',
  'Elemental Synergy':
    'Section=arcana ' +
    'Note="May reroll arcane skill near a significant source of chosen element/-2 arcane skill where chosen element is scarce"',
  'Epic Mastery':'Section=arcana Note="May use Epic Power Modifiers"',
  'Explorer':
    'Section=feature ' +
    'Note="Reduces travel time by 10%/May choose from 2 Action Cards when traveling"',
  'Familiar':
    'Section=arcana ' +
    'Note="Can communicate w/a magical, Wild Card pet that stores 5 Power Points"',
  'Favored Enemy':
    'Section=combat,skill ' +
    'Note=' +
      '"May reroll attacks against %{$\'features.Favored Enemy\'} chosen creature type",' +
      '"May reroll Survival to track %{$\'features.Favored Enemy\'} chosen creature type"',
  'Favored Power':
    'Section=arcana ' +
    'Note="Ignores 2 points of penalties when casting chosen power"',
  'Favored Terrain':
    'Section=combat,skill ' +
    'Note=' +
      '"Gains an additional Action Card in %{$\'features.Favored Terrain\'} chosen terrain",' +
      '"May reroll Notice and Survival in %{$\'features.Favored Terrain\'} chosen terrain"',
  'Fetish':
    'Section=arcana Note="-2 arcane skill rolls when fetish is unavailable"',
  'Fey Blood':
    'Section=combat ' +
    'Note="May reroll when resisting enemy powers and spell-like effects"',
  'Formation Fighter':
    'Section=combat Note="Self and allies gain +1 Gang Up bonus (+4 max)"',
  'Heirloom':'Section=feature Note="Possesses a powerful magic item"',
  'Holy Symbol':
    'Section=skill Note="May reroll Faith when holding holy symbol"',
  'Home Ground':
    'Section=arcana ' +
    'Note=' +
      '"Within home area, may spend a Benny to recover all Power Points/10 min concentration answers 3 questions about state of home area"',
  'Improved Close Fighting':
    'Section=combat Note="Increased Close Fighting effects"',
  'Improved Double Shot':'Section=combat Note="Increased Double Shot effects"',
  'Improved Sneak Attack':
   'Section=combat Note="May use Sneak Attack on a distracted foe"',
  'Jinx':
    'Section=skill ' +
    'Note="May disable any mechanical device with a successful Repair"',
  'Knight':
    'Section=feature,skill ' +
    'Note=' +
      '"Has authority over common folk in liege\'s realm",' +
      '"+1 Intimidation and Persuasion in areas of liege authority"',
  'Magic':
    'Section=feature ' +
    'Note="May take edges particular to Arcane Background (Magic)"',
  'Martial Flexibility':
    'Section=combat ' +
    'Note="May gain the benefits of a combat edge for 5 rd 1/encounter"',
  'Master Artificer':
    'Section=arcana ' +
    'Note="Gains 1000 GP progress for each success and raise when imbuing magic items"',
  'Master Summoner':
    'Section=arcana ' +
    'Note="Reduces cost of <i>Summon Ally/Animal/Monster</i> by 2 PP (minimum 1 PP) and increases duration by 10x"',
  'Miracles':
    'Section=feature ' +
    'Note="May take edges particular to Arcane Background (Miracles)"',
  'Missile Deflection':
    'Section=combat ' +
    'Note="When armed, physical ranged attacks on self must match Parry to succeed"',
  'Mount':
    'Section=feature ' +
    'Note="Mount gains %{advances//4+1} choice of Trait die increase, edge, or monstrous ability"',
  'Mystic Powers (Barbarian)':
    'Section=arcana,arcana ' +
    'Note=' +
      '"10 Power Points",' +
      '"May cast self <i>Boost Trait</i>, <i>Smite</i>, or <i>Speed</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Fighter)':
    'Section=arcana,arcana ' +
    'Note=' +
      '"10 Power Points",' +
      '"May cast self <i>Boost Trait</i>, <i>Protection</i>, or <i>Smite</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Monk)':
    'Section=arcana,arcana ' +
    'Note=' +
      '"10 Power Points",' +
      '"May cast self <i>Boost Trait</i>, <i>Deflection</i>, or <i>Smite</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Paladin)':
    'Section=arcana,arcana ' +
    'Note=' +
      '"10 Power Points",' +
      '"May cast self <i>Boost Trait</i>, <i>Healing</i>, self <i>Protection</i>, self <i>Sanctuary</i> or self <i>Smite</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Ranger)':
    'Section=arcana,arcana ' +
    'Note=' +
      '"10 Power Points",' +
      '"May cast <i>Beast Friend</i>, self <i>Boost Trait</i>, <i>Entangle</i>, or self <i>Farsight</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Rogue)':
    'Section=arcana,arcana ' +
    'Note=' +
      '"10 Power Points",' +
      '"May cast self <i>Boost Trait</i>, self <i>Darksight</i>, <i>Lock/Unlock</i> or self <i>Wall Walker</i> for 2 PP (+2 PP for Raise)"',
  'One With Nature':
    'Section=arcana ' +
    'Note="<i>Summon Animal</i> and <i>Shape Change</i> (natural animal) last 1 hr"',
  'Opportunistic':
    'Section=feature ' +
    'Note="Joker gives an additional +2 to Trait and damage rolls"',
  'Overpower':
    'Section=arcana ' +
    'Note="May spend 1/3/5 PP to improve a Spellcasting roll (but not a critical failure) by +1/+2/+3"',
  'Poisoner':
    'Section=skill ' +
    'Note="Creates poisons in half normal time/Contact poisons last 12 hr"',
  'Prepared Powers':
    'Section=arcana ' +
    'Note="May use hex bag to cast 2 prepared powers/dy w/out spending PP; critical failure empties bag"',
  'Raise The Dead':
    'Section=arcana ' +
    'Note="May cast <i>Zombie</i>, lasting 4 hr, at novice level"',
  'Rapid Change':'Section=feature Note="May change form as a limited action"',
  'Really Dirty Fighter':
    'Section=combat ' +
    'Note="Raise on a Test gives The Drop on target until target unshakes"',
  'Relic':'Section=arcana Note="Possesses a powerful magic item"',
  'Roar':
    'Section=combat ' +
    'Note="May make an Intimidation Test against all targets in a 9\\" cone"',
  'Savagery':
    'Section=combat Note="Wild Attack inflicts an additional +2 damage"',
  'Scorch':
    'Section=combat ' +
    'Note="Breath weapon inflicts 1 die type higher damage; may choose to affect a cone or line"',
  'Scout':
    'Section=skill ' +
    'Note="Successful Notice-2 detects encounters/Always considered alert vs. Stealth/+2 Common Knowledge (recall info about a familiar route)"',
  'Sharp Tongued':
    'Section=skill ' +
    'Note="May use Performance in place of Taunt and may repeat using different words"',
  'Shield Wall':
    'Section=combat Note="+1/+2 Parry when adjacent to 1/2 allies w/this edge"',
  'Silent Caster':'Section=arcana Note="May use powers w/out speaking"',
  'Sneak Attack':'Section=combat Note="Increased Assassin effects"',
  'Stonecunning':
    'Section=skill ' +
    'Note="R10\\" Successful automatic Notice+2 notes unusual stonework"',
  'Strong Illusions':
    'Section=arcana ' +
    'Note="<i>Illusion</i> affects a 3\\" radius and gains the Strong Power Modifier (Strength-2 to disbelieve) for free; those who successfully disbelieve see through self <i>Illusion</i> effects for the remainder of the encounter"',
  'Stunning Blow':
    'Section=combat ' +
    'Note="Successful attack with a blunt weapon stuns (Vigor neg)"',
  'Summoning':
    'Section=arcana ' +
    'Note="May use <i>Summon Ally</i> to conjure demonic soldiers for 4 PP%{advances>=8 ? \', hellhounds for 5 PP, or nightmares for 7 PP\' : advances>=4 ? \' or hellhounds for 5 PP\' : \'\'}"',
  'Sunder':'Section=combat Note="+d6 damage when striking to break an object"',
  'Take The Hit':
    'Section=combat Note="May reroll when Soaking or resisting Knockout"',
  'Tools':'Section=arcana Note="Must have tool kit to use Power Modifiers"',
  'Transfer':
    'Section=arcana Note="May transfer up to 5 PP to another in sight"',
  'Trap Sense':
    'Section=skill ' +
    'Note="R5\\" Successful automatic Notice detects mechanical and magical traps and ignores 2 penalty points to evade and disarm"',
  'Treasure Hunter':
    'Section=attribute,feature ' +
    'Note=' +
      '"Successful Smarts gives approximate value of goods and magic item abilities",' +
      '"May spend a Benny to have the GM reroll magic item treasure"',
  'Trick Shot':
    'Section=combat ' +
    'Note="May force foe to resist Athletics and Shooting Tests with Smarts instead of Agility"',
  'Troubadour':
    'Section=skill,skill ' +
    'Note=' +
      '"+2 Common Knowledge",' +
      '"May use Performance for edges requiring Battle"',
  'Uncanny Reflexes':
    'Section=combat ' +
    'Note="Ignores penalty for normal Evasion; may attempt Evasion-2 for any area effect"',
  'Unstoppable':'Section=combat Note="Takes at most 1 Wound per attack"',
  'Warband':
    'Section=combat ' +
    'Note="%{features.Warband*5} followers may take an additional Wound before becoming incapacitated"',
  'Weird Science':
    'Section=feature ' +
    'Note="May take edges particular to Arcane Background (Weird Science)"',
  'Wilderness Stride':
    'Section=combat ' +
    'Note="Suffers no movement penalty for difficult ground in natural terrain"',
  'Wing Gust':
    'Section=combat ' +
    'Note="Successful Athletics shakes creatures of same size or smaller in a 9\\" cone (Vigor neg; Raise -2)"',
  // AB-dependent edges
  'Arcane Barding':'Section=arcana Note="Summoned animals gain +2 Toughness"',
  'Chemist':'Section=arcana Note="Concoctions given to others last 1 wk"',
  'Construct Familiar':
    'Section=arcana ' +
    'Note="Can communicate w/a magical, Wild Card construct that stores 5 Power Points"',
  'Deadly Illusion':
    'Section=arcana ' +
    'Note="May use the Deadly Illusion Power Modifier on <i>Illusion</i> for free"',
  'Destroy Undead':
    'Section=arcana ' +
    'Note="May spend 1 PP to inflict 2d6 damage (or 2 PP for 3d6) on all undead in a 3\\" radius"',
  'Dirge':'Section=arcana Note="R10\\" Target suffers -2 on Benny roll"',
  'Eldritch Inspiration':
    'Section=arcana ' +
    'Note="May spend a Benny to cast any power of an appropriate rank from spellbook"',
  'Elemental Absorption':
    'Section=combat Note="+2 Toughness near significant source of chosen element"',
  'Elemental Master':
    'Section=arcana Note="May use trappings of %{$\'features.Elemental Master\'+1} chosen elements"',
  'Ferocious Summoning':
    'Section=arcana Note="May grant summoned monsters 1 combat edge"',
  'Great Power':
    'Section=arcana ' +
    'Note="May spend a Benny to cast any power up to 20 PP at a -2 penalty; failure inflicts permanent loss of 1 attribute die type"',
  'Great Summoning':
    'Section=arcana ' +
    'Note="May spend 5/7/8/8/11 PP to summon a barghest/mammoth/frost mammoth/tyrannosaurus rex/young dragon"',
  'Heartwood Staff':
    'Section=combat ' +
    'Note="Has a heartwood staff; may spend 1 PP after a hit w/it to inflict +d6 damage"',
  "Hell's Wrath":
    'Section=arcana ' +
    'Note="<i>Bolt</i>, <i>Blast</i>, and <i>Burst</i> inflict +2 damage"',
  'Infernal Armor':
    'Section=arcana ' +
    'Note="May cover apparel with a glow that gives self +2 Armor"',
  'Inspire Heroics':
    'Section=combat ' +
    'Note="R%{smarts}\\" May spend a Benny 1/encounter to grant allies 5 Trait or damage rerolls"',
  'Instrument':'Section=arcana Note="+1 Performance to cast spell"',
  'Master Alchemist':'Section=arcana Note="May create potions for half cost"',
  'Master Of Illusion':
    'Section=arcana ' +
    'Note="May use the Mobility and Sound Power Modifiers on <i>Illusion</i> for free"',
  'Mercy':
    'Section=arcana ' +
    'Note="R%{spirit}\\" May spend 1 PP to remove Distracted, Vulnerable, or Shaken from target"',
  'Phenomenal Power':
    'Section=arcana ' +
    'Note="May spend Conviction to cast any power up to 20 PP at -2 penalty; failure inflicts permanent loss of 1 attribute die type"',
  'Primal Magic':
    'Section=arcana ' +
    'Note="Powers inflict +2 damage/Critical failure stuns all in a 3\\" radius"',
  'Sacred Fetish':
    'Section=skill ' +
    'Note="May reroll Faith when fetish is held or prominently worn"',
  'Soul Jar':
    'Section=feature ' +
    'Note="Is undead/2d6 days after being slain, hidden soul inhabits a new corpse"',
  'Spellbooks':'Section=arcana Note="+%V Power Count"',
  'The Evil Eye':
    'Section=arcana ' +
    'Note="R6\\" Target Bennies have no effect (Spirit-2 neg) for the remainder of the encounter 1/encounter"',
  'The Witching Hour':
    'Section=feature ' +
    'Note="Gains free Soak and cannot critically fail between midnight and 1 a.m."',
  "Tinkerer's Armor":
    'Section=combat '+
    'Note="Successful Repair reduces armor Strength requirement by 1 die type and gains one of: +2 melee damage and free Strength reroll; +2 chest and back Armor; or dbl jump distance and +4 Pace/Wound has 50% chance of disabling armor"',
  'True Form':
    'Section=arcana Note="May cast powers at -2 penalty while shape changed"',
  'Undead Familiar':
    'Section=arcana ' +
    'Note="Can communicate w/a magical, Wild Card undead animal that stores 5 Power Points"',
  // Hindrances
  // All Thumbs as SWADE
  'Amorous':
    'Section=skill Note="-2 on Tests by a foe w/the Attractive feature"',
  'Arcane Sensitivity':'Section=combat Note="-2 to resist powers"',
  'Arcane Sensitivity+':'Section=combat Note="-4 to resist powers"',
  'Armor Interference':
    'Section=arcana ' +
    'Note=' +
      '"In medium or heavy armor, suffers -4 arcane skill rolls and cannot use arcane edge features"',
  'Armor Interference+':
    'Section=arcana ' +
    'Note=' +
      '"In light, medium, or heavy armor, suffers -4 arcane skill rolls and cannot use arcane edge features"',
  // Arrogant+ as SWADE
  // Big Mouth as SWADE
  'Blunderer+':
    'Section=skill ' +
    'Note="Skill die of 1 on chosen essential skill inflicts critical failure"',
  // Clueless+ as SWADE
  // Clumsy+ as SWADE
  // Code Of Honor+ as SWADE
  'Corruption+':
    'Section=arcana ' +
    'Note=' +
      '"Critical failure on arcane skill inflicts additional or increased hindrance until next advance"',
  // Curious as SWADE
  'Cursed+':
    'Section=arcana ' +
    'Note="Powers cast to aid self suffer -2 arcane skill; critical failure stuns caster"',
  // Dependency as SWADE
  'Doomed+':'Section=attribute Note="-2 Vigor (soak)"',
  'Grim':
    'Section=combat ' +
    'Note="Provoked (-2 to affect other opponents) by any successful Taunt; lasts until a Joker is drawn"',
  'Idealistic':
    'Section=feature Note="Approaches moral dilemmas with absolute thinking"',
  // Illiterate as SWADE
  // Impulsive as SWADE
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
    'Note="Suffers -4 arcane skill rolls when materials are unavailable; critical failure exhausts materials"',
  // Mean as SWADE
  // Outsider as SWADE
  // Outsider+ as SWADE
  // Secret+ as SWADE
  'Selfless':'Section=feature Note="Puts others first"',
  'Selfless+':'Section=feature Note="Always puts others first"',
  'Talisman':
    'Section=arcana ' +
    'Note="-1 casting when talisman is unavailable; critical failure stuns"',
  'Talisman+':
    'Section=arcana ' +
    'Note="-2 casting when talisman is unavailable; critical failure stuns"'
  // Thin Skinned+ as SWADE
};
SWADEFC.GOODIES = {
  // empty
};
SWADEFC.HINDRANCES = {
  'Amorous':'Severity=Minor',
  'Arcane Sensitivity':
    'Require="features.Arcane Sensitivity+ == 0" Severity=Minor',
  'Arcane Sensitivity+':
    'Require="features.Arcane Sensitivity == 0" Severity=Major',
  'Armor Interference':
    'Require="features.Armor Interference+ == 0","arcaneSkill" ' +
    'Severity=Minor',
  'Armor Interference+':
    'Require="features.Armor Interference == 0","arcaneSkill" ' +
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
  'Talisman+':'Require="features.Talisman == 0" Severity=Major'
  // Vow+ as SWADE
};
SWADEFC.POWERS = {
  'Arcane Protection':
    'Modifier=' +
      '"Epic +2 PP foes suffer -4 (Raise -6)"',
  'Banish':
    'Modifier=' +
      '"Epic +1/+2/+3 PP 1\\"/2\\"/3\\" radius"',
  'Barrier':
    SWADE.POWERS.Barrier + ' ' +
    'Modifier=' +
      '"+0 PP Immaterial barrier",' +
      '"+0/+1 PP Immaterial/material barrier inflicts 2d4 damage",' +
      '"+1 PP Barrier has hardness 12 (Raise 14)",' +
      '"+1 PP Shapes barrier",' +
      '"+1 PP Dbl dimensions",' +
      '"Epic +1/+2 PP Immaterial/material barrier inflicts 2d6 damage" ' +
    'Description="Creates a 5\\" long (Raise 10\\") by 1\\" high wall w/hardness 10 for 5 rd"',
  'Beast Friend':
    'Modifier=' +
      '"+1 PP Duration 30 min",' +
      '"Epic +2 PP Effects magical beasts"',
  'Blast':
    'Modifier=' +
      '"Epic +4 PP Inflicts 4d6 damage (Raise 5d6) as Heavy Weapon"',
  'Blessing':
    'Advances=4 ' +
    'PowerPoints=10 ' +
    'Range=Community ' +
    'Description=' +
      '"1 hr ritual increases crops, health, and prosperity in area"',
  'Bolt':
    'Modifier=' +
      '"Epic +2 PP Turns target to dust (Vigor neg)",' +
      '"Epic +4 PP Inflicts 4d6 damage (Raise 5d6) as Heavy Weapon",' +
      '"Epic +2 PP ROF 2"',
  'Boost/Lower Trait':
    SWADE.POWERS['Boost/Lower Trait'] + ' ' +
    'PowerPoints=3 ' +
    'Modifier=' +
      '"+2 PP/additional target",' +
      '"+1 PP Spirit-2",' +
      '"Epic +2 PP Free reroll of affected Trait 1/rd or -2 affected Trait"',
  'Burst':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range= ' +
    'Description="9\\" Cone or 12\\" stream inflicts 2d6 damage (Raise 3d6)" ' +
    'Modifier=' +
      '"+2 PP Inflicts 3d6 damage (Raise 4d6)",' +
      '"+1 PP Pushes 2d6\\" (large or greater d4\\")",' +
      '"Epic +4 PP Inflicts 4d6 damage (Raise 5d6) as Heavy Weapon"',
  'Confusion':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Description=' +
      '"2\\" radius inflicts Distracted or Vulnerable (Raise both) for 1 rd" ' +
    'Modifier=' +
      '"+0/+1 1\\"/3\\" radius",' +
      '"Epic +2 PP Also inflicts Shaken"',
  'Conjure Item':
    'Advances=0 ' +
    'PowerPoints=2/lb ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP Complete set",' +
      '"+1 PP/lb Daily food",' +
      '"+1 PP/lb Lasts until dispelled" ' +
    'Description=' +
      '"Creates a mundane item for 1 hr"',
  'Curse':
    'Advances=4 ' +
    'PowerPoints=5 ' +
    'Range=touch ' +
    'Modifier=' +
      '"Epic +5 PP Inflicts Fatigue each rd (Spirit neg); incapacity turns to stone" ' +
    'Description=' +
      '"Target suffers 1 level of Fatigue and an additional level each sunset (Spirit neg)"',
  'Damage Field':
    'Modifier=' +
      '"+2 PP 2\\" radius",' +
      '"+2 PP May move area of effect %{smarts}\\"/rd",' +
      '"Epic +4 PP Inflicts 3d6 damage as Heavy Weapon"',
  'Darksight':
    'Modifier=' +
      '"Epic +2 PP Target ignores all illumination penalties and 4 points from invisibility"',
  'Deflection':
    SWADE.POWERS.Deflection + ' ' +
    'PowerPoints=2 ' +
    'Description=' +
      '"Foes suffer -2 on choice of ranged or melee attacks (Raise both) on target for 5 rd"',
  'Detect/Conceal Arcana':
    'Modifier=' +
      '"+1 PP Detect supernatural good or evil",' +
      '"+1 PP Identify magic item properties (Raise also any curse)"',
  'Dispel':
    'Modifier=' +
      '"+1/+2/+3 PP 1\\"/2\\"/3\\" radius",' +
      '"+3 PP Affects all active powers",' +
      '"Epic +8 PP Affects all in a 2\\" radius around self for 5 rd, summoned creatures take 1 Wound/rd (Spirit neg)"',
  'Divination':
    'Modifier=' +
      '"Epic +3 PP on sacred ground gives advice"',
  'Drain Power Points':
    'Modifier=' +
      '"+2 PP Drains 2d6 PP"',
  'Elemental Manipulation':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"Epic +3 PP Inflict 2d6 damage (Raise 3d6), affect 3x volume, or inflict Push w/-2 to resist",' +
      '"+5 PP Summon weather" ' +
    'Description=' +
      '"Self uses element to attack for 2d4 damage (Raise 3d4), move 1\' cu object %{smarts}\', push target, or perform a special effect for 5 rd"',
  'Empathy':
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+2 PP Charm target",' +
      '"+1 PP Lasts 5 min",' +
      '"Epic +2 PP Discerns lies"',
  'Entangle':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+2/+3 PP 2\\"/3\\" radius",' +
      '"+2 PP Inflicts 2d4 damage",' +
      '"+2 PP Hardness 10",' +
      '"Epic +1 Inflicts 2d6 damage" ' +
    'Description=' +
      '"Restrains target (Raise binds; Athletics or breaking Hardness 8 frees)"',
  'Environmental Protection':
    SWADE.POWERS['Environmental Protection'] + ' ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+1 PP Reduces environmental damage by 4 (Raise 6)" ' +
    'Description=' +
      '"Target gains protection from hazards for 1 hr (Raise 8 hr)"',
  'Farsight':
    'Modifier=' +
      '"Epic +2 PP Removes all range penalties (Raise dbl sight range)"',
  'Fear':
    'Modifier=' +
      '"Epic +2 PP Spirit-2 (Raise Spirit-4)"',
  'Fly':
    'Modifier=' +
      '"+5 PP Pace 24 (Raise Pace 48)"',
  'Growth/Shrink':
    'Modifier=' +
      '"Epic +2 Lasts 5 min",' +
      '"Epic +2 Shrink retains Toughness and Strength"',
  'Havoc':
    SWADE.POWERS.Havoc.replace('radius or', 'radius, 12\\" stream, or') + ' ' +
    'Modifier=' +
      '"+1 PP 3\\" radius",' +
      '"Epic +2 PP Throws 3d6\\""',
  'Healing':
    'Modifier=' +
      '"Epic +2/+3 PP Affects a 2\\"/3\\" radius"',
  'Illusion':
    'Modifier=' +
      '"+1 PP 3\\" radius",' +
      '"+1/+2 PP May move illusion 12/24 each rd",' +
      '"Epic +3 PP Arcane skill vs. Smarts (Raise Smarts-2) Shakes target (Raise Wounds)",' +
      '"Epic +2 Lasts 5 min"',
  'Intangibility':
    'Modifier=' +
      '"Epic +3 PP/additional target",' +
      '"Epic +3 PP Lasts 5 min"',
  'Invisibility':
    'Modifier=' +
      '"Epic +2 PP Lasts 5 min or until attacks"',
  'Light/Darkness':
    'Modifier=' +
      '"+1 PP Illuminates object, negating 2 points (Raise 4 points) of vision penalties",' +
      '"Epic +2 PP Light affects a %{smarts}\\" radius, range %{smarts*2}\\"",' +
      '"Epic +2 PP Darkness blocks infravision, low light vision, and darkvision"',
  'Locate':
    'Advances=0 ' +
    'PowerPoints=3 ' +
    'Range=self ' +
    'Modifier=' +
      '"+1 PP Self learns best path to target" ' +
    'Description=' +
      '"Gives direction of chosen item (-2 if self has never seen item; running water neg) for 10 min"',
  'Lock/Unlock':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP Alerts self if unlocked" ' +
    'Description=' +
      '"Inflicts -4 to open on target item (Raise seals shut) or opens target item, ignoring 4 points of penalties (Raise disarms alarms and traps)"',
  'Lower Trait': // Diabolist cannot Boost Trait
    'Advances=0 ' +
    'PowerPoints=3 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+2 PP/additional target",' +
      '"+1 PP Spirit-2",' +
      '"Epic +2 PP -2 affected Trait" ' +
    'Description=' +
      '"Target suffers -1 Trait Step (Raise -2) (Spirit recovers 1 Step (Raise all) each rd)"',
  'Mind Link':
    'Modifier=' +
      '"Epic +2 PP Broadcast telepathic message in a %{smarts*4}\\" radius (Raise %{smarts*8}\\" radius)",' +
      '"Epic +3 PP Self may link to any familiar mind on same plane"',
  'Mind Reading':
    'Modifier=' +
      '"+2 PP Extended access to target\'s mind"',
  'Mind Wipe':
    'Modifier=' +
      '"+2 PP Completely remove topic from target memory"',
  'Mystic Intervention':
    'Advances=16 ' +
    'PowerPoints=20 ' +
    'Range=special ' +
    'Description=' +
      '"Ritual causes great event"',
  'Object Reading':
    SWADE.POWERS['Object Reading'] + ' ' +
    'Modifier=' +
      '"Epic +2 PP Share w/others nearby" ' +
    'Description=' +
      '"Self sees history of target related to desired information"',
  'Planar Binding':
    'Advances=8 ' +
    'PowerPoints=8 ' +
    'Range=smarts ' +
    'Description=' +
      '"Summons and traps an extraplanar creature to perform a service (Spirit neg)"',
  'Plane Shift':
    'Advances=4 ' +
    'PowerPoints=4 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"Epic +1 PP Creates extra-dimensional shelter",' +
      '"Epic +2 PP Plane shifts foe (Spirit neg) for 3 rd (Raise 5 rd)" ' +
    'Description=' +
      '"Self travels to chosen plane, w/in 10d10 miles (Raise 5d10) of a known location"',
  'Protection':
    SWADE.POWERS.Protection + ' ' +
    'Description="Target gains +2 Armor (Raise +2 Toughness) for 5 rd" ' +
    'Modifier=' +
      '"+1 PP/additional target"',
  'Puppet':
    'Modifier=' +
      '"+2 PP Spirit-2"',
  'Relief':
    SWADE.POWERS.Relief + ' ' +
    'Description=' +
      '"Removes choice of Shaken, Distracted, or Vulnerable (Raise 2 choices) from target, or reduces penalties due to Wounds and Fatigue by 1 (Raise 2) for 1 hr" ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+3 PP Restore 1 die type from energy drain (Raise 2 die types)",' +
      '"+1 PP Also removes Stunned"',
  'Resurrection'
    :SWADE.POWERS.Resurrection.replace('-8', '-4') + ' ' +
    'Modifier=' +
      '"+5 PP Raises 10 yr corpse",' +
      '"Epic +10 PP 12-hr ritual raises corpse of any age"',
  'Sanctuary':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=touch ' +
    'Modifier=' +
      '"+2/+3 PP 2\\"/3\\" radius",' +
      '"Epic +1 PP Spirit-2 (Raise Spirit-4)" ' +
    'Description=' +
      '"Evil creatures cannot attack target (Spirit neg; Raise Spirit-2) for 5 rd; attacking ends"',
  'Scrying':
    'Advances=4 ' +
    'PowerPoints=3 ' +
    'Range=self ' +
    'Modifier=' +
      '"+1 PP Shares with allies in a %{smarts}\\" radius" ' +
    'Description=' +
      '"Gives view of chosen target (-2 unfamiliar target; Spirit target detects) for 5 rd"',
  'Shape Change':
    SWADE.POWERS['Shape Change'] + ' ' +
    'Modifier=' +
      '"+1 PP Lasts 5 min",' +
      '"Epic +3 PP Transforms touched target (Raise Smarts lowered to animal; Spirit neg, Spirit-2 recover (Raise Spirit-4))",' +
      '"Epic +2/+3 PP Transforms willing touched/R%{smarts}\\" target"',
  'Sloth/Speed':
    'Modifier=' +
      '"+2 PP Speed target runs maximum speed"',
  'Smite':
    'Modifier=' +
      '"+2 PP +4 damage (Raise +6) as Heavy Weapon"',
  'Sound/Silence':
    'Modifier=' +
      '"Epic +1 PP Target audible for 1 mile",' +
      '"Epic +1 PP Smarts-2"',
  'Speak Language':
    'Modifier=' +
      '"Epic +2 PP Speak, read, and write all languages",' +
      '"Epic +5 PP All in a %{smarts*2}\\" radius can understand each other"',
  'Summon Ally':
    SWADE.POWERS['Summon Ally'] + ' ' +
    'PowerPoints=1+ ' +
    'Modifier=' +
      '"+1 PP Servant gains combat edge",' +
      '"+2 PP Servant can fly Pace\\"/rd",' +
      '"+1 PP Servant gains +1 Trait Step",' +
      '"+1 PP Self can use servant\'s senses",' +
      '"Epic +Half PP/additional servant"',
  'Summon Animal':
    'Advances=0 ' +
    'PowerPoints=Special ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP Increased Trait",' +
      '"+1 PP Self can use animal\'s senses",' +
      '"Epic +Half/additional animal" ' +
    'Description=' +
      '"Brings chosen animal type to perform a task for 5 rd"',
  'Summon Monster':
    'Advances=0 ' +
    'PowerPoints=Special ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP Increased Trait",' +
      '"+1 PP Self can use monster\'s senses",' +
      '"Epic +Half PP/additional monster" ' +
    'Description=' +
      '"Brings chosen monster type to perform a task for 5 rd"',
  'Summon Undead':
    'Advances=0 ' +
    'PowerPoints=Special ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP Increased Trait",' +
      '"+1 PP Self can use undead\'s senses",' +
      '"Epic +Half PP/additional undead" ' +
    'Description=' +
      '"Brings chosen undead type to perform a task for 5 rd"',
  'Telekinesis':
    'Modifier=' +
      '"Epic +3 PP Strength d12 (Raise d12+2)"',
  'Teleport':
    'Modifier=' +
      '"Epic +5 PP Opens portal to destination for 5 rd",' +
      '"Epic +5 PP Teleport up to 1000 miles"',
  'Time Stop':
    'Advances=12 ' +
    'PowerPoints=10 ' +
    'Range=self ' +
    'Description=' +
      '"Self gains 1d4+1 additional turns"',
  "Warrior's Gift":
    'Modifier=' +
      '"Epic +4 PP Two combat edges"',
  'Wish':
    'Advances=12 ' +
    'PowerPoints=20 ' +
    'Range=smarts ' +
    'Description=' +
      '"Self alters reality and loses 3 PP permanently (Raise no PP loss)"',
  'Zombie':
    SWADE.POWERS.Zombie + ' ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+1 PP Target is armed and has 2 Armor points",' +
      '"+1 PP Self can use target senses",' +
      '"+1 PP Target becomes animated skeleton"'
};
for(let p in SWADEFC.POWERS) {
  if(p in SWADE.POWERS && !SWADEFC.POWERS[p].includes('Description=')) {
    let swadeModifiers =
      QuilvynUtils.getAttrValueArray(SWADE.POWERS[p], 'Modifier');
    let swadefcModifiers =
      QuilvynUtils.getAttrValueArray(SWADEFC.POWERS[p], 'Modifier');
    SWADEFC.POWERS[p] =
      SWADE.POWERS[p] + SWADEFC.POWERS[p] +
      ' Modifier="' + swadeModifiers.concat(swadefcModifiers).map(x => x.replaceAll('"', '\\"')).join('","') + '"';
  }
}
SWADEFC.SHIELDS = {
  'None':'Parry=0 Cover=0 MinStr=0 Weight=0',
  'Small Shield':'Parry=1 Cover=0 MinStr=6 Weight=4',
  'Medium Shield':'Parry=2 Cover=2 MinStr=8 Weight=8',
  'Large Shield':'Parry=2 Cover=4 MinStr=10 Weight=12'
};
SWADEFC.SKILLS = {
  'Alchemy':'Attribute=smarts'
};
SWADEFC.WEAPONS = {
  'Hand Axe':SWADE.WEAPONS['Hand Axe'] + ' Range=3',
  'Great Axe':SWADE.WEAPONS['Great Axe'] + ' AP=3',
  'Chakram':
    'Damage=Str+d4 MinStr=4 Weight=1 Category=One-Handed Range=4 Parry=1',
  'Cutlass':'Damage=Str+d6 MinStr=4 Weight=4 Category=One-Handed',
  'Heavy Flail':'Damage=Str+d8 MinStr=8 Weight=10 Category=Two-Handed',
  'Falchion':'Damage=Str+d8 MinStr=8 Weight=8 Category=One-Handed AP=1',
  'Glaive':'Damage=Str+d8 MinStr=8 Weight=10 Category=Two-Handed',
  'Guisarme':'Damage=Str+d6 MinStr=6 Weight=12 Category=Two-Handed AP=1',
  'Halberd':SWADE.WEAPONS.Halberd + ' AP=1',
  'Light Mace':SWADE.WEAPONS.Mace,
  'Heavy Mace':'Damage=Str+d8 MinStr=8 Weight=8 Category=One-Handed AP=1',
  'Mancatcher':'Damage=Str+d4 MinStr=6 Weight=10 Category=Two-Handed',
  'Meteor Hammer':'Damage=Str+d6 MinStr=6 Weight=5 Category=Two-Handed',
  'Morningstar':'Damage=Str+d6 MinStr=6 Weight=6 Category=Two-Handed',
  'Maul':SWADE.WEAPONS.Maul + ' AP=2',
  'Ranseur':'Damage=Str+d6 MinStr=6 Weight=12 Category=One-Handed AP=1',
  'Sap':'Damage=Str+d4 MinStr=4 Weight=1 Category=One-Handed',
  'Scimitar':'Damage=Str+d6 MinStr=6 Weight=4 Category=One-Handed',
  'Scythe':'Damage=Str+d6 MinStr=6 Weight=10 Category=Two-Handed',
  'Sickle':'Damage=Str+d4 MinStr=4 Weight=2 Category=One-Handed',
  'Short Spear':'Damage=Str+d6 MinStr=6 Weight=3 Category=One-Handed Range=4',
  'Spiked Chain':'Damage=Str+d6 MinStr=6 Weight=6 Category=Two-Handed AP=1',
  'Spiked Gauntlet':'Damage=Str+d4 MinStr=6 Weight=1 Category=Unarmed',
  'Quarterstaff':SWADE.WEAPONS.Staff,
  'Bastard Sword':'Damage=Str+d8 MinStr=8 Weight=6 Category=One-Handed AP=1',
  'Great Sword':SWADE.WEAPONS['Great Sword'] + ' AP=2',
  'Hook Sword':'Damage=Str+d6 MinStr=6 Weight=3 Category=One-Handed AP=1',
  'Trident':'Damage=Str+d6 MinStr=6 Weight=5 Category=One-Handed Range=3',
  'Whip':'Damage=Str+d4 MinStr=4 Weight=2 Category=One-Handed Parry=-1',

  'Bolas':'Damage=Str+d4 MinStr=4 Weight=2 Category=Ranged Range=3',
  'Blowgun':'Damage=d4-2 MinStr=4 Weight=1 Category=Ranged Range=3',
  'Short Bow':SWADE.WEAPONS.Bow,
  'Composite Bow':SWADE.WEAPONS['Compound Bow'],
  'Hand Crossbow':'Damage=2d4 MinStr=4 Weight=2 Category=Ranged Range=5',
  'Repeating Hand Crossbow':
    'Damage=2d4 MinStr=4 Weight=3 Category=Ranged Range=5',
  'Light Crossbow':SWADE.WEAPONS['Hand Drawn Crossbow'],
  'Repeating Light Crossbow':SWADE.WEAPONS['Hand Drawn Crossbow'] + ' Weight=8',
  'Heavy Crossbow':'Damage=2d8 MinStr=8 Weight=8 Category=Ranged Range=15 AP=2',
  'Repeating Heavy Crossbow':
    'Damage=2d8 MinStr=8 Weight=12 Category=Ranged Range=15 AP=2',
  'Shuriken':'Damage=Str+d4 MinStr=4 Weight=0 Category=Ranged Range=3'
};

/* Defines rules related to powers. */
SWADEFC.arcaneRules = function(rules, arcanas, powers) {
  let allNotes = rules.getChoices('notes');
  let allPowers = rules.getChoices('powers');
  for(let p in powers) {
    if(p in allPowers) {
      delete allPowers[p];
      delete allNotes['powers.' + p];
    }
  }
  SWADE.arcaneRules(rules, arcanas, powers);
  // No changes needed to the rules defined by base method
};

/* Defines the rules related to combat. */
SWADEFC.combatRules = function(rules, armors, shields, weapons) {
  let allArmors = rules.getChoices('armors');
  let allNotes = rules.getChoices('notes');
  let allShields = rules.getChoices('shields');
  let allWeapons = rules.getChoices('weapons');
  for(let a in armors) {
    if(a in allArmors)
      delete allArmors[a];
  }
  for(let s in shields) {
    if(s in allShields)
      delete allShields[s];
  }
  for(let w in weapons) {
    if(w in allWeapons) {
      delete allWeapons[w];
      delete allNotes['weapons.' + w];
    }
  }
  SWADE.combatRules(rules, armors, shields, weapons);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to basic character identity. */
SWADEFC.identityRules = function(rules, ancestries, eras, concepts) {
  let allRaces = rules.getChoices('races');
  for(let a in ancestries) {
    if(a in allRaces)
      delete allRaces[a];
  }
  SWADE.identityRules(rules, ancestries, eras, concepts);
  rules.defineEditorElement('race');
  rules.defineEditorElement
    ('ancestry', 'Ancestry', 'select-one', 'races', 'imageUrl');
  rules.defineRule('race', 'ancestry', '=', null);
  rules.defineRule('armorMinStr', 'combatNotes.diminutive(Tiny)', 'v=', '4');
  for(let a in ancestries)
    SWADEFC.ancestryRulesExtra(rules, a, ancestries[a]);
  rules.defineRule('rakashanFeatures.Racial Enemy', 'ancestry', '?', '0');
};

/* Defines rules related to character aptitudes. */
SWADEFC.talentRules = function(
  rules, edges, features, goodies, hindrances, skills)
{
  delete rules.getChoices('features').Assassin;
  delete rules.getChoices('notes')['combatNotes.assassin'];
  SWADE.talentRules(rules, edges, features, goodies, hindrances, skills);
  for(let e in edges)
    SWADEFC.edgeRulesExtra(rules, e, edges[e]);
  for(let h in hindrances)
    SWADEFC.hindranceRulesExtra(rules, h, hindrances[h]);
  // Handle new Arcane Background features that allow characters to select
  // edges particular to one of the core ABs by giving them that AB feature,
  // but make sure that associated notes only show for those with the base edge.
  rules.defineRule
    ('features.Arcane Background (Magic)', 'features.Magic', '=', '1');
  rules.defineRule('arcanaNotes.arcaneBackground(Magic)',
    'edges.Arcane Background (Magic)', '?', null
  );
  rules.defineRule
    ('features.Arcane Background (Miracles)', 'features.Miracles', '=', '1');
  rules.defineRule('arcanaNotes.arcaneBackground(Miracles)',
    'edges.Arcane Background (Miracles)', '?', null
  );
  rules.defineRule
    ('features.Arcane Background (Weird Science)', 'features.Weird Science', '=', '1');
  rules.defineRule('arcanaNotes.arcaneBackground(WeirdScience)',
    'edges.Arcane Background (Weird Science)', '?', null
  );
};

/*
 * Defines in #rules# the rules associated with ancestry #name# that cannot be
 * derived directly from the attributes passed to ancestryRules.
 */
SWADEFC.ancestryRulesExtra = function(rules, name) {
  let advanceAttr = name.toLowerCase() + 'Advances';
  if(name == 'Avion' || name == 'Celestial') {
    rules.defineRule('combatNotes.flight', advanceAttr, '=', '12');
  } else if(name == 'Elemental Scion') {
    rules.defineRule
      ('edgePoints', 'featureNotes.elementalConnection', '+=', '1');
    QuilvynRules.prerequisiteRules
      (rules, 'validation', 'Elemental Scion', 'features.Elemental Scion',
       ['features.Air Scion || features.Earth Scion || features.Fire Scion || features.Water Scion']);
    rules.defineRule('features.Elemental Scion',
      'ancestry', '=', 'source=="Elemental Scion" ? 1 : null'
    );
  } else if(name == 'Fairy') {
    rules.defineRule('combatNotes.flight', advanceAttr, '=', '6');
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
  } else if(name == 'Half-Orc') {
    rules.defineRule('attributePoints', 'attributeNotes.hardened', '+=', '1');
  } else if(name == 'Insectoid') {
    rules.defineRule('weapons.Bite', 'combatNotes.biteOrClaw', '=', '1');
    rules.defineRule('weapons.Claws', 'combatNotes.biteOrClaw', '=', '1');
    rules.defineRule('insectoidPace',
      'ancestry', '?', 'source == "Insectoid"',
      'pace', '=', null
    );
    rules.defineRule('combatNotes.wallWalker', 'insectoidPace', '=', null);
    rules.defineRule('combatNotes.wallWalker.1',
      'insectoidPace', '=', 'Math.floor(source / 2)'
    );
  } else if(name == 'Minotaur') {
    SWADE.weaponRules(
      rules, 'Hooves', [], 'Str+d4', 0, 0, 'Unarmed', null, null, null, null
    );
    rules.defineRule('weapons.Hooves', 'combatNotes.hooves', '=', null);
  } else if(name == 'Shapeshifter') {
    rules.defineRule('powers.Disguise', 'features.Change Shape', '=', '1');
  }
};

/*
 * Defines in #rules# the rules associated with edge #name# that cannot be
 * derived directly from the attributes passed to edgeRules.
 */
SWADEFC.edgeRulesExtra = function(rules, name) {
  if(name == 'Arcane Background (Bard)') {
    // NOTE: The substitution of Performance for Taunt presently only affects
    // validation for the SWADE Humiliate, Provoke, and Retort edges. In
    // theory, it could also affect Hindrance and Ancestry requirements, but in
    // practice this seems unlikely--a minimum Taunt value to be an Elf?
    rules.defineRule('sharpTonguedPerformance',
      'features.Sharp Tongued', '?', null,
      'skills.Performance', '=', null
    );
    let allEdges = rules.getChoices('edges');
    for(let e in allEdges) {
      let m = allEdges[e].match(/skills\.Taunt(\s*(>=?\s*\d+))?/);
      if(m)
        rules.defineRule('validationNotes.' + e.charAt(0).toLowerCase() + e.substring(1).replaceAll(' ', '') + 'Edge',
          'sharpTonguedPerformance', '+', 'source ' + m[1] + ' ? 1 : null',
          '', 'v', '0'
        );
    }
  } else if(name.match(/Arcane Background .Cleric/)) {
    rules.defineRule
      ('features.Arcane Background (Cleric)', 'features.' + name, '=', '1');
  } else if(name == 'Heartwood Staff') {
    SWADE.weaponRules(
      rules, 'Heartwood Staff', [], 'Str+d8', 6, 6, 'Two-Handed', null, null,
      null, 1
    );
    rules.defineRule
      ('weapons.Heartwood Staff', 'features.Heartwood Staff', '=', '1');
  } else if(name == 'Sneak Attack') {
    rules.defineRule
      ('combatNotes.assassin', 'combatNotes.sneakAttack', '=', '"d6"');
  } else if(name == 'Spellbooks') {
    rules.defineRule('arcanaNotes.spellbooks',
      '', '=', '1',
      'features.New Powers', '+', null
    );
  } else if(name == 'Warband') {
    rules.defineRule('sumLeadershipEdges', 'features.Warband', '^=', '0');
    let allEdges = rules.getChoices('edges');
    for(let e in allEdges) {
      if(allEdges[e].match(/leadership/i))
        rules.defineRule('sumLeadershipEdges', 'edges.' + e, '+', '1');
    }
  }
};

/*
 * Defines in #rules# the rules associated with hindrance #name# that cannot be
 * derived directly from the attributes passed to hindranceRules.
 */
SWADEFC.hindranceRulesExtra = function(rules, name) {
  if(name == 'Grim') {
    // Fulfills prereq for Menacing edge
    rules.defineRule
      ('validationNotes.menacingEdgeAlt.0', 'features.Grim', '+', '1');
  }
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
SWADEFC.randomizeOneAttribute = function(attributes, attribute) {
  if(attribute=='powers') {
    let startingPowers = {
      'Bard': ['Boost/Lower Trait', 'Sound/Silence'],
      'Cleric': ['Healing', 'Sanctuary'],
      'Diabolist': ['Banish', 'Havoc', 'Summon Ally'],
      'Druid': ['Beast Friend', 'Environmental Protection', 'Shape Change'],
      'Elementalist': ['Elemental Manipulation', 'Environmental Protection'],
      'Illusionist': ['Illusion', 'Light/Darkness', 'Sound/Silence'],
      'Necromancer': ['Detect/Conceal Arcana', 'Dispel', 'Zombie'],
      'Shaman': ['Arcane Protection', 'Relief'],
      'Summoner': ['Beast Friend', 'Boost/Lower Trait', 'Summon Ally'],
      'Wizard': ['Detect/Conceal Arcana', 'Dispel', 'Lock/Unlock']
    };
    let allPowers = this.getChoices('powers');
    for(let ab in startingPowers) {
      if('edges.Arcane Background (' + ab + ')' in attributes ||
         (ab == 'Cleric' && QuilvynUtils.sumMatching(attributes, /Arcane Background..Cleric/) > 0)) {
        startingPowers[ab].forEach(p => {
          if(p in allPowers)
            attributes['powers.' + p] = 1;
          else
            console.log('Unknown power "' + p + '"');
        });
      }
    }
  }
  return this.fcReplacedRandomizer(attributes, attribute);
};

/* Returns HTML body content for user notes associated with this rule set. */
SWADEFC.ruleNotes = function() {
  return '' +
    '<h2>SWADE Fantasy Companion Quilvyn Module Notes</h2>\n' +
    'SWADE Fantasy Companion Quilvyn Module Version ' + SWADEFC.VERSION + '\n' +
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
    'Savage Worlds Adventure Edition Fantasy Companion ' +
    '© 2022 Pinnacle Entertainment Group.\n' +
    '</p>\n' +
    '<img alt="Savage Worlds Fan Logo" width="300" height="200" src="https://peginc.com/wp-content/uploads/2019/01/SW_LOGO_FP_2018.png"/>\n';
};
