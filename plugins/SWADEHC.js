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
/* globals QuilvynUtils, SWADE */
"use strict";

/*
 * This module loads the rules from the Savage Worlds Adventure Edition Horror
 * Companion. The SWADEHC function contains methods that load rules for
 * particular parts of the rules: ancestryRules for character ancestries,
 * arcaneRules for powers, etc. These member methods can be called
 * independently in order to use a subset of the SWADEHC rules. Similarly, the
 * constant fields of SWADE (SKILLS, EDGES, etc.) can be manipulated to modify
 * the choices.
 */
function SWADEHC(baseRules, rules) {

  if(window.SWADE == null) {
    alert('The SWADEHC module requires use of the SWADE module');
    return;
  }

  if(rules == null)
    rules = SWADE.rules;
  rules.hcReplacedRandomizer = rules.randomizeOneAttribute;
  rules.randomizeOneAttribute = SWADEHC.randomizeOneAttribute;
  SWADEHC.combatRules(rules, SWADEHC.ARMORS, SWADEHC.SHIELDS, SWADEHC.WEAPONS);
  SWADEHC.arcaneRules(rules, SWADEHC.ARCANAS, SWADEHC.POWERS);
  SWADEHC.talentRules
    (rules, SWADEHC.EDGES, SWADEHC.FEATURES, SWADEHC.GOODIES,
     SWADEHC.HINDRANCES, SWADEHC.SKILLS);
  SWADEHC.identityRules
    (rules, SWADEHC.ANCESTRYS, SWADEHC.ERAS, SWADEHC.CONCEPTS);

}

SWADEHC.VERSION = '2.4.1.0';

SWADEHC.ANCESTRYS = {
  // empty
};
SWADEHC.ARCANAS = {
  'Alchemist':
    'Skill=Alchemy ' +
    'Powers=' +
      'Banish,"Beast Friend",Blast,Blind,"Boost/Lower Trait",Burst,Confusion,' +
      'Darksight,Deflection,"Detect/Conceal Arcana",Empathy,Entangle,' +
      '"Environmental Protection",Farsight,Fear,Fly,Growth/Shrink,Healing,' +
      'Intangibility,Light/Darkness,Protection,Puppet,Relief,Resurrection,' +
      '"Shape Change",Sloth/Speed,Slumber,Smite,"Speak Language",' +
      '"Wall Walker","Warrior\'s Gift"',
  'Blighted':
    'Skill=Focus',
  'Demonologist':
    'Skill=Spellcasting ' +
    'Powers=' +
      '"Arcane Protection",Banish,Barrier,Blast,Bolt,Burst,' +
      '"Consecrate Ground",Curse,"Damage Field",Darksight,' +
      '"Detect/Conceal Arcana",Dispel,Divination,"Drain Power Points",' +
      '"Environmental Protection",Exorcism,Fear,Havoc,Illusion,' +
      '"Illusionary Horrors",Light/Darkness,Nightmares,Puppet,Seance,Smite,' +
      '"Speak Language",Spite,"Summon Ally","Summon Demon","Wall Walker"',
  'Fortune Teller':
    'Skill=Spellcasting ' +
    'Powers=' +
      'Darksight,Deflection,"Detect Arcana",Divination,Empathy,Farsight,' +
      'Locate,"Object Reading",Protection,Scrying,Seance',
  'Medium':
    'Skill=Spellcasting ' +
    'Powers=' +
      '"Arcane Protection",Banish,"Beast Friend","Consecrate Ground",' +
      '"Corpse Sense",Darksight,"Detect/Conceal Arcana",Dispel,Divination,' +
      'Empathy,Exorcism,"Grave Shroud",Locate,"Object Reading",Sanctuary,' +
      'Scrying,Seance,"Speak Language"',
  'Occultist':
    'Skill=Spellcasting ' +
    'Powers=' +
      '"Arcane Protection",Banish,Barrier,"Beast Friend",Blast,Blind,Bolt,' +
      '"Boost/Lower Trait",Burst,Confusion,"Corpse Sense",Curse,' +
      '"Damage Field",Darksight,Deflection,"Detect/Conceal Arcana",Disguise,' +
      'Dispel,Divination,"Drain Power Points","Elemental Manipulation",' +
      'Entangle,"Environmental Protection",Exorcism,Farsight,Fear,' +
      '"Grave Shroud",Havoc,Illusion,Intangibility,Invisibility,' +
      'Light/Darkness,Locate,Lock/Unlock,Nightmares,"Object Reading",' +
      'Protection,Puppet,Sanctuary,Scrying,Seance,Sloth/Speed,Slumber,Smite,' +
      'Sound/Silence,"Speak Language",Spite,Stun,"Summon Ally",' +
      '"Summon Demon","Suppress Transformation",Telekinesis,Teleport,' +
      '"Wall Walker","Warrior\'s Gift",Zombie',
  'Priest':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection",Banish,Barrier,"Beast Friend","Boost/Lower Trait",' +
      'Confusion,"Consecrate Ground",Darksight,Deflection,' +
      '"Detect/Conceal Arcana",Dispel,Divination,Empathy,Entangle,' +
      '"Environmental Protection",Exorcism,Farsight,Havoc,Healing,' +
      'Light/Darkness,Protection,Relief,Resurrection,Sanctuary,Scrying,' +
      'Sloth/Speed,Slumber,Smite,Sound/Silence,"Speak Language",Stun,' +
      '"Warrior\'s Gift"',
  'Psychic Investigator':
    'Skill=Psionics ' +
    'Powers=' +
      '"Beast Friend",Blind,"Boost/Lower Trait",Confusion,Curse,Divination,' +
      'Empathy,Fear,"Illusionary Horrors","Mind Link","Mind Reading",' +
      '"Mind Wipe",Locate,"Object Reading",Puppet,Scrying,Slumber,' +
      'Sound/Silence,"Suppress Transformation"',
  'Voodooist':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection","Aspect Of The Rada Loa",Banish,Barrier,' +
      '"Beast Friend",Blind,"Boost/Lower Trait",Confusion,' +
      '"Consecrate Ground","Corpse Sense",Curse,Darksight,Deflection,' +
      '"Detect/Conceal Arcana",Dispel,Divination,Empathy,Exorcism,Fear,' +
      '"Fury Of The Petro Loa",Havoc,Healing,"Illusionary Horrors",Locate,' +
      'Nightmares,"Object Reading",Protection,Puppet,Relief,Sanctuary,' +
      'Seance,Sloth/Speed,Smite,"Speak Language",Stun,"Warrior\'s Gift",' +
      'Zombie',
  'Warlock/Witch':
    'Skill=Spellcasting ' +
    'Powers=' +
      '"Arcane Protection",Banish,Barrier,"Beast Friend",Blast,Blind,Bolt,' +
      '"Boost/Lower Trait",Burrow,Burst,Confusion,"Corpse Sense",Curse,' +
      'Darksight,Deflection,"Detect/Conceal Arcana",Disguise,Dispel,' +
      'Divination,"Drain Power Points","Elemental Manipulation",Empathy,' +
      'Entangle,"Environmental Protection",Exorcism,Farsight,Fear,Fly,' +
      '"Grave Shroud",Growth/Shrink,Havoc,Healing,Illusion,' +
      '"Illusionary Horrors",Invisibility,Light/Darkness,Locate,Lock/Unlock,' +
      '"Mind Reading","Mind Wipe",Nightmares,"Object Reading",Protection,' +
      'Puppet,Relief,Scrying,Seance,"Shape Change",Sloth/Speed,Slumber,Smite,' +
      'Sound/Silence,"Speak Language",Spite,Stun,"Summon Ally",' +
      '"Summon Demon","Suppress Transformation",Telekinesis,"Wall Walker",' +
      '"Warrior\'s Gift"'
};
SWADEHC.ARMORS = {
  // empty
};
SWADEHC.CONCEPTS = {
  'Angel':
    'Edge=Angel',
  'Demon':
    'Edge=Demon',
  'Mummy':
    'Edge=Mummy',
  'Patchwork Monster':
    'Edge="Patchwork Monster"',
  'Phantom':
    'Edge=Phantom',
  'Revenant':
    'Edge=Revenant',
  'Vampire':
    'Edge=Vampire',
  'Werewolf':
    'Edge=Werewolf',
  'Alchemist':
    'Edge="Arcane Background (Alchemist)" ' +
    'Attribute=Smarts ' +
    'Skill=Alchemy',
  'Blighted':
    'Edge="Arcane Background (Blighted)" ' +
    'Attribute=Spirit ' +
    'Skill=Focus',
  'Demonologist':
    'Edge="Arcane Background (Demonologist)" ' +
    'Attribute=Smarts ' +
    'Skill=Spellcasting',
  'Fortune Teller':
    'Edge="Arcane Background (Fortune Teller)" ' +
    'Attribute=Smarts ' +
    'Skill=Spellcasting',
  'Medium':
    'Edge="Arcane Background (Medium)" ' +
    'Attribute=Smarts,Spirit ' +
    'Skill=Spellcasting',
  'Occultist':
    'Edge="Arcane Background (Occultist)" ' +
    'Attribute=Smarts ' +
    'Skill=Spellcasting',
  'Priest':
    'Edge="Arcane Background (Priest)" ' +
    'Attribute=Spirit ' +
    'Skill=Faith',
  'Psychic Investigator':
    'Edge="Arcane Background (Psychic Investigator)" ' +
    'Attribute=Smarts ' +
    'Skill=Psionics',
  'Voodooist':
    'Edge="Arcane Background (Voodooist)" ' +
    'Attribute=Spirit ' +
    'Skill=Faith',
  'Warlock/Witch':
    'Edge="Arcane Background (Warlock/Witch)" ' +
    'Attribute=Smarts ' +
    'Skill=Spellcasting'
};
SWADEHC.EDGES = {
  'Gallows Humor':'Type=Background Require="skills.Taunt >= 6"',
  'Relentless':'Type=Background Require="spirit >= 8"',
  'Veteran Of The Dark World':'Type=Background Require="smarts >= 8"',
  'Courage':
    'Type=Leadership ' +
    'Require="advances >= 4",features.Command,"skills.Persuasion >= 8"',
  'Favored Power':
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Blighted) || features.Arcane Background (Occultist) || features.Arcane Background (Warlock/Witch)",' +
      '"arcaneSkill >= 8"',
  'Silent Caster':'Type=Power Require="powerPoints > 0","skills.Occult >= 8"',
  'Monster Hunter':'Type=Professional Require="advances >= 4","spirit >= 6"',
  'Scream Queen/King':'Type=Professional Require="advances >= 8"',
  'Final Girl/Guy':'Type=Social',
  'Visions':'Type=Weird',
  // Monstrous Heroes
  'Aggravated Damage':
    'Type=Monstrous Require=monstrousHero,"advances >= 4"',
  'Fear -2':'Type=Monstrous Require=monstrousHero,"spirit >= 8"',
  'Old':'Type=Monstrous Require="monstrousHero"',
  'Savagery':
    'Type=Monstrous ' +
    'Require=monstrousHero,"advances >= 4","strength >= 10"',
  // Angel
  'Angel':'Type=Monstrous Require="monstrousHero == 1"',
  'Divine Blade':'Type=Monstrous Require="advances >= 8","features.Angel"',
  'Holy Light':'Type=Monstrous Require="features.Angel"',
  'Searing Blast':'Type=Monstrous Require="advances >= 8","features.Angel"',
  'Immortality':'Type=Monstrous Require="advances >= 12","features.Angel"',
  'Mystic Powers (Angel (Death))':
    'Type=Monstrous Require="advances >= 4","features.Angel"',
  'Mystic Powers (Angel (Herald))':
    'Type=Monstrous Require="advances >= 4","features.Angel"',
  'Sense Supernatural':
    'Type=Monstrous Require="features.Angel||features.Demon"',
  'Speed Flight':'Type=Monstrous Require="advances >= 4","features.Angel"',
  'Tongues':'Type=Monstrous Require="advances >= 4","features.Angel"',
  'Toughness +2':
    'Type=Monstrous ' +
    'Require="advances >= 4","features.Angel || features.Werewolf"',
  'Divine Toughness':
    'Type=Monstrous Require="advances >= 4","features.Toughness +2"',
  'Wing Strike':'Type=Monstrous Require="advances >= 4","features.Angel"',
  // Demon
  'Demon':'Type=Monstrous Require="monstrousHero == 1"',
  'Armored Hide':'Type=Monstrous Require="advances >= 4","features.Demon"',
  'Bite':'Type=Monstrous Require="features.Demon"',
  'Claws':'Type=Monstrous Require="features.Demon || features.Vampire"',
  'Demonic Immortality':
    'Type=Monstrous Require="advances >= 8","features.Demon"',
  'Hellfire':'Type=Monstrous Require="advances >= 4","features.Demon"',
  'Scorch':'Type=Monstrous Require="advances >= 8","features.Hellfire"',
  'Incorporeal':'Type=Monstrous Require="features.Demon"',
  'Mystic Powers (Demon (Possessor))':
    'Type=Monstrous Require="advances >= 4","features.Demon"',
  'Mystic Powers (Demon (Summoner))':
    'Type=Monstrous Require="advances >= 4","features.Demon"',
  'Mystic Powers (Demon (Tempter))':
    'Type=Monstrous Require="advances >= 4","features.Demon"',
  'Mystic Powers (Demon (Trickster))':
    'Type=Monstrous Require="advances >= 4","features.Demon"',
  // Sense Supernatural as Angel
  'True Demon':'Type=Monstrous Require="advances >= 8","features.Demon"',
  'Wings':'Type=Monstrous Require="features.Demon"',
  // Mummy
  'Mummy':'Type=Monstrous Require="monstrousHero == 1"',
  'Burrow':'Type=Monstrous Require="advances >= 4","features.Mummy"',
  'Mummy Rot':'Type=Monstrous Require="advances >= 8","features.Mummy"',
  'Mystic Powers (Mummy (Architect))':
    'Type=Monstrous Require="advances >= 4","features.Mummy"',
  'Mystic Powers (Mummy (Royal))':
    'Type=Monstrous Require="advances >= 4","features.Mummy"',
  'Regeneration (Slow)':
    'Type=Monstrous Require="advances >= 4","features.Mummy"',
  'Regeneration (Fast)':
    'Type=Monstrous ' +
    'Require=' +
      '"advances >= 16",' +
      '"features.Regeneration (Slow) || features.Vampire || features.Werewolf"',
  'Summon Storm':'Type=Monstrous Require="advances >= 4","features.Mummy"',
  'Summon Swarm':'Type=Monstrous Require="advances >= 4","features.Mummy"',
  'Summon Great Swarm':
    'Type=Monstrous Require="advances >= 12","features.Mummy"',
  // Patchwork Monster
  'Patchwork Monster':'Type=Monstrous Require="monstrousHero == 1"',
  'Detachable Parts':
    'Type=Monstrous ' +
    'Require="advances >= 4","features.Patchwork Monster || features.Revenant"',
  'Discharge':
    'Type=Monstrous Require="advances >= 8","features.Patchwork Monster"',
  'Flashbacks':'Type=Monstrous Require="features.Patchwork Monster"',
  'Hardy':'Type=Monstrous Require="advances >= 4","features.Patchwork Monster"',
  'Roar':
    'Type=Monstrous ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Patchwork Monster || features.Phantom || features.Werewolf"',
  // Phantom
  'Phantom':'Type=Monstrous Require="monstrousHero == 1"',
  'Chilling Touch':
    'Type=Monstrous Require="advances >= 4","features.Phantom","spirit >= 8"',
  'Crossover':'Type=Monstrous Require="advances >= 4","features.Phantom"',
  'Invisibility':
    'Type=Monstrous Require="advances >= 4","features.Phantom","spirit >= 8"',
  'Mystic Powers (Phantom (Poltergeist))':
    'Type=Monstrous Require="advances >= 4","features.Phantom"',
  'Mystic Powers (Phantom (Shade))':
    'Type=Monstrous Require="advances >= 4","features.Phantom"',
  'Mystic Powers (Phantom (Wraith))':
    'Type=Monstrous Require="advances >= 4","features.Phantom"',
  // Roar as Patchwork Monster
  // Revenant
  'Revenant':'Type=Monstrous Require="monstrousHero == 1"',
  'Death Touch':'Type=Monstrous Require="advances >= 12","features.Revenant"',
  // Detachable Parts as Patchwork Monster
  'Relentless Tracker':
    'Type=Monstrous Require="advances >= 8","features.Revenant"',
  'Stench':'Type=Monstrous Require="features.Revenant"',
  'Thought Eater':'Type=Monstrous Require="advances >= 4","features.Revenant"',
  'Zombie Master':'Type=Monstrous Require="features.Revenant"',
  // Vampire
  'Vampire':'Type=Monstrous Require="monstrousHero == 1"',
  'Animal Form':'Type=Monstrous Require="features.Vampire"',
  'Charm':'Type=Monstrous Require="features.Vampire"',
  'Children Of The Night':'Type=Monstrous Require="features.Vampire"',
  // Claws as Demon
  'Daywalker':'Type=Monstrous Require="features.Vampire"',
  'Gorge':'Type=Monstrous Require="features.Vampire"',
  'Mist Form':'Type=Monstrous Require="features.Vampire"',
  // Regeneration (Fast) as Mummy
  'Sire':'Type=Monstrous Require="features.Vampire"',
  'Thrall':'Type=Monstrous Require="advances >= 4","features.Vampire"',
  'Wall Walker':
    'Type=Monstrous Require="features.Vampire || features.Werewolf"',
  // Werewolf
  'Werewolf':'Type=Monstrous Require="monstrousHero == 1"',
  'Alpha':'Type=Monstrous Require="features.Werewolf"',
  'Bite & Claws':'Type=Monstrous Require="advances >= 4","features.Werewolf"',
  // Regeneration (Fast) as Mummy
  // Roar as Patchwork Monster
  'Speech':'Type=Monstrous Require="advances >= 4","features.Werewolf"',
  // Toughness +2 as Angel
  // Wall Walker as Vampire
  // Arcane Backgrounds
  'Arcane Background (Alchemist)':'Type=Background Require="smarts >= 6"',
  'Arcane Background (Blighted)':'Type=Background Require="spirit >= 6"',
  'Arcane Background (Demonologist)':'Type=Background Require="smarts >= 6"',
  'Arcane Background (Fortune Teller)':'Type=Background Require="smarts >= 6"',
  'Arcane Background (Medium)':'Type=Background Require="spirit >= 6"',
  'Arcane Background (Occultist)':'Type=Background Require="smarts >= 6"',
  'Arcane Background (Priest)':'Type=Background Require="spirit >= 6"',
  'Arcane Background (Psychic Investigator)':
    'Type=Background Require="smarts >= 6"',
  'Arcane Background (Voodooist)':'Type=Background Require="spirit >= 6"',
  'Arcane Background (Warlock/Witch)':'Type=Background Require="smarts >= 6"',
  // AB-dependent edges
  'Chemist':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Alchemist) || features.Arcane Background (Blighted)",' +
      '"skills.Alchemy >= 8"',
  'Discerning':
    'Type=Power ' +
    'Require=' +
      '"advances >= 8",' +
      '"features.Arcane Background (Alchemist) || features.Arcane Background (Blighted)",' +
      '"skills.Alchemy >= 10"',
  "Hell's Wrath":
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Demonologist) || features.Arcane Background (Blighted)"',
  'Infernal Armor':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Demonologist) || features.Arcane Background (Blighted)"',
  'Forewarning':
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Fortune Teller) || features.Arcane Background (Blighted)"',
  'Sixth Sense':
    'Type=Power ' +
    'Require=' +
      '"advances >= 8",' +
      '"features.Arcane Background (Fortune Teller) || features.Arcane Background (Blighted)"',
  'Spirit Friend':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Medium) || features.Arcane Background (Blighted)"',
  'This House Is Clean':
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Medium) || features.Arcane Background (Blighted)"',
  'Eldritch Inspiration':
    'Type=Power ' +
    'Require=' +
      '"advances >= 12",' +
      '"features.Arcane Background (Occultist) || features.Arcane Background (Blighted)"',
  'Universal Ward':
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Occultist) || features.Arcane Background (Blighted)"',
  'Aura Of Courage':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Priest) || features.Arcane Background (Blighted)",' +
      '"spirit >= 8"',
  'Mercy':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Priest) || features.Arcane Background (Blighted)"',
  'Scan':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Psychic Investigator) || features.Arcane Background (Blighted)",' +
      '"skills.Psionics >= 8"',
  'Tower Of Will':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Psychic Investigator) || features.Arcane Background (Blighted)",' +
      '"smarts >= 8"',
  'Been To The Crossroads':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Voodooist) || features.Arcane Background (Blighted)",' +
      '"spirit >= 8",' +
      '"skills.Faith >= 8"',
  'Favored':
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Voodooist) || features.Arcane Background (Blighted)",' +
      '"spirit >= 8",' +
      '"skills.Faith >= 8"',
  'Consort':
    'Type=Power ' +
    'Require=' +
      '"advances >= 8",' +
      '"features.Arcane Background (Warlock/Witch) || features.Arcane Background (Blighted)"',
  'The Witching Hour':
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Arcane Background (Warlock/Witch) || features.Arcane Background (Blighted)"'
};
SWADEHC.ERAS = {
  // empty
};
SWADEHC.FEATURES = {
  'Ageless':'Section=feature Note="Does not age"',
  'Aggravated Damage':
    'Section=combat ' +
    'Note="Natural and inherent power attacks can hurt supernatural creatures; foe regeneration suffers -4 penalty"',
  'Amorous':
    'Section=skill Note="-2 on Tests by a foe w/the Attractive feature"',
  'Alpha':
    'Section=skill ' +
    'Note="Successful Intimidation vs. Spirit controls natural canine creatures until the end of the encounter"',
  'Angel':
    'Section=feature ' +
    'Note="Has Ageless, Beautify, Divine Might, Faith, Flight, Immune To Disease And Poison, Rage, and Servant Of Heaven features"',
  'Animal Form':
    'Section=feature ' +
    'Note="Successful Smarts-2 allows transformation to or from a wolf or bat"',
  'Arcane Background (Alchemist)':
    'Section=arcana,arcana,feature ' +
    'Note=' +
      '"3 Powers/15 Power Points",' +
      '"May make alchemical items/Concoctions given to others have specific aspects, use self Alchemy to activate, and must be used w/in 48 hr",' +
      '"Has Material Components+ feature"',
  'Arcane Background (Blighted)':
    'Section=arcana,feature ' +
    'Note=' +
      '"2 Powers/15 Power Points",' +
      '"Has Corruption+, Favored Power, and Power features"',
  'Arcane Background (Demonologist)':
    'Section=arcana,feature ' +
    'Note=' +
      '"5 Powers/10 Power Points",' +
      '"Has Corruption+, Magic, and Summoning features"',
  'Arcane Background (Fortune Teller)':
    'Section=arcana,feature ' +
    'Note=' +
      '"2 Powers/15 Power Points",' +
      '"Has Magic and The Sight features"',
  'Arcane Background (Medium)':
    'Section=arcana,feature ' +
    'Note=' +
      '"3 Powers/15 Power Points",' +
      '"Has I See Dead People and Magic features"',
  'Arcane Background (Occultist)':
    'Section=arcana,feature ' +
    'Note=' +
      '"5 Powers/10 Power Points",' +
      '"Has Corruption+ and Magic features"',
  'Arcane Background (Priest)':
    'Section=arcana,feature ' +
    'Note=' +
      '"5 Powers/10 Power Points",' +
      '"Has Holy Symbol, Miracles, and Vow+ features"',
  'Arcane Background (Psychic Investigator)':
    'Section=arcana,feature ' +
    'Note=' +
      '"3 Powers/10 Power Points",' +
      '"Has Psionics feature"',
  'Arcane Background (Voodooist)':
    'Section=arcana,feature ' +
    'Note=' +
      '"2 Powers/15 Power Points",' +
      '"Has Material Components+ and Miracles feature"',
  'Arcane Background (Warlock/Witch)':
    'Section=arcana,feature ' +
    'Note=' +
      '"3 Powers/10 Power Points",' +
      '"Has Corruption+, Familiar, Magic, and Material Components+ features"',
  'Armored Hide':'Section=combat Note="+4 Armor"',
  'Aura Of Courage':
    'Section=combat ' +
    'Note="R10\\" Allies gain +1 vs. fear and -1 on fear table results"',
  'Beautify':'Section=arcana Note="May create minor beauty effects"',
  'Been To The Crossroads':'Section=skill Note="May reroll Faith"',
  // Berserk as SWADE
  'Bespoil':'Section=arcana Note="May create minor ruinous effects"',
  // Bite as SWADE
  'Bite & Claws':'Section=combat Note="Increased Bite and Claw effects"',
  'Bleeder+':
    'Section=combat ' +
    'Note="Taking a Wound inflicts a level of Fatigue each rd (Vigor neg 1 rd; Raise or Healing ends)"',
  'Bullet Magnet':
    'Section=combat ' +
    'Note="Hit by accidental fire by single-shot weapons on a 1-2 and shotguns and full-auto weapons on a 1-3"',
  'Bully':'Section=feature Note="Frequently belittles others"',
  'Bully+':
    'Section=feature Note="Frequently belittles others and may turn violent"',
  'Burrow':'Section=combat Note="Burrow Pace %{pace//2}"',
  'Cannot Speak (Werewolf)':
    'Section=feature Note="Cannot speak while transformed"',
  'Charm':
    'Section=arcana ' +
    'Note="Successful Persuasion plus spending a Benny allows use of <i>Puppet</i> effects on an unwary target for 1 dy"',
  'Chemist':'Section=arcana Note="Concoctions given to others last 1 wk"',
  'Children Of The Night':
    'Section=arcana ' +
    'Note="May summon 1 dire wolf, 1d4 normal wolves, or a medium swarm of bats or rats 1/night"',
  'Chilling Touch':
    'Section=combat ' +
    'Note="Touch ignores nonmagical armor and inflicts d%{strength}+d4 damage"',
  // Claws as SWADE
  'Claws (Climbing)':'Section=skill Note="+2 Athletics (climbing)"',
  'Consort':
    'Section=arcana ' +
    'Note="May spend a Benny to cast any power via a ritual; failure triggers Corruption+"',
  'Corruption+':
    'Section=arcana ' +
    'Note=' +
      '"Critical failure on arcane skill inflicts additional or increased hindrance until next advance"',
  'Courage':
    'Section=combat ' +
    'Note="R%{commandRange}\\" Allies may reroll failed fear checks"',
  'Crossover':'Section=feature Note="May network with other spirits"',
  'Cursed+':
    'Section=arcana ' +
    'Note="Powers cast to aid self suffer -2 arcane skill; critical failure stuns caster"',
  'Darkvision':
    'Section=feature ' +
    'Note="R10\\" Ignores illumination penalties and 2 points from invisibility"',
  'Daywalker':'Section=feature Note="Suffers no harm from sunlight"',
  'Deal Maker':
    'Section=feature ' +
    'Note="May grant a boon in exchange for a hindrance and a later favor"',
  'Death Touch':
    'Section=combat ' +
    'Note="Touch inflicts d%{strength}+d4 damage vs. living; d%{strength}+2d6 vs. vengeance target"',
  "Death's Haze":
    'Section=attribute,feature ' +
    'Note="Smarts may only be advanced once","Has Clueless+ feature"',
  'Demon':
    'Section=feature ' +
    'Note="Has Ageless, Bespoil, Darkvision, Deal Maker, Doesn\'t Breathe, Environmental Resistance (Cold, Electricity, Heat), Immune To Disease And Poison, Infernal Stamina, Rage, Spirited, and Weakness (Cold Iron) features"',
  'Demonic Immortality':'Section=combat Note="Reforms d4 dy after being slain"',
  'Detachable Parts':
    'Section=feature ' +
    'Note="May detach and remotely control (up to 1 mile) body parts/May regrow destroyed body parts"',
  'Discerning':
    'Section=arcana Note="Increases concoction duration from 5 to 8"',
  'Discharge':
    'Section=combat ' +
    'Note="May suffer Fatigue to inflict 4d6 electrical damage in a 3\\" radius"',
  'Divine Blade':
    'Section=combat ' +
    'Note="Has a magical weapon that inflicts +d6 damage and negates the Immortality edge"',
  'Divine Might':'Section=attribute Note="+2 Strength Step/+2 Vigor Step"',
  'Divine Toughness':'Section=combat Note="+2 Toughness"',
  // Doesn't Breathe as SWADE
  'Doomed+':'Section=attribute Note="-2 Vigor (soak)"',
  'Dread':'Section=feature Note="+2 rolls on Fear Effects"',
  'Eldritch Inspiration':
    'Section=arcana ' +
    'Note="May spend a Benny to cast any power of an appropriate rank from spellbook"',
  'Environmental Resistance (Cold, Electricity, Heat)':
    'Section=combat ' +
    'Note="+4 vs. cold, electricity, and heat effects/-4 damage from cold, electricity, and heat"',
  'Ethereal':
    'Section=feature ' +
    'Note="Unaffected by the physical world; may change to or from corporeal 1/rd"',
  'Faith':'Section=skill Note="+1 Faith Step"',
  'Familiar':
    'Section=arcana ' +
    'Note="Can communicate w/a magical, Wild Card pet that stores 5 Power Points"',
  'Favored':
    'Section=arcana ' +
    'Note="Reduces cost of <i>Aspect Of The Rada Loa</i> and <i>Fury Of The Petra Loa</i> to 3 PP"',
  'Favored Power':
    'Section=arcana ' + 
    'Note="Ignores 2 points of penalties when casting chosen power"',
  'Fear -2':
    'Section=combat ' +
    'Note="Other characters suffer -2 penalty on initial encounter Fear check"',
  'Feed':'Section=feature Note="Has Habit+ feature"',
  'Ferocity':
    'Section=attribute Note="+2 Agility Step/+2 Strength Step/+2 Vigor Step"',
  'Final Girl/Guy':
    'Section=combat ' +
    'Note="R%{smarts}\\" May spend a Benny 1/encounter to grant 5 Trait or damage rerolls"',
  'Fire Bad!':'Section=feature Note="Has Phobia+ feature"',
  'Flashbacks':
    'Section=skill ' +
    'Note="May increase any skill one step (linked attribute maximum) 1/encounter"',
  'Flashbacks+':
    'Section=combat Note="Drawing a club Action Card inflicts Distracted"',
  // Flight as SWADE
  'Forlorn+':'Section=attribute Note="-2 Spirit"',
  'Forewarning':
    'Section=combat ' +
    'Note="May spend a Benny to force a foe to redraw a non-joker Action Card"',
  'Gallows Humor':
    'Section=skill Note="May use Taunt vs. fear; Raise gives +1 to allies"',
  'Gorge':
    'Section=attribute ' +
    'Note="Draining a human of blood gives +1 Strength Step and +1 Vigor Step for 1 hr 1/dy"',
  // Hardy as SWADE
  'Heavy Sleeper':
    'Section=attribute,skill ' +
    'Note="-4 Vigor (stay awake)","-4 Notice (wake up)"',
  "Hell's Wrath":
    'Section=arcana ' +
    'Note="<i>Bolt</i>, <i>Blast</i>, and <i>Burst</i> inflict +2 damage"',
  'Hellfire':
    'Section=combat ' +
    'Note="R12\\" May create and move a 1\\" radius fire that inflicts %{combatNotes.scorch?2:1}d6 damage or attack with a 9\\" cone%{combatNotes.scorch?\' or 12\\" stream\':\'\'} that inflicts 2d%{combatNotes.scorch?6:4} damage"',
  'Holy Light':
    'Section=combat ' +
    'Note="R12\\" May create and move a 3\\" radius dim or bright light or attack with a 9\\" cone or 12\\" stream that inflicts 2d%{combatNotes.searingBlast?6:4} damage; critical fail inflicts Fatigue"',
  'Holy Symbol':
    'Section=skill Note="May reroll Faith when holding holy symbol"',
  'I See Dead People':
    'Section=arcana ' +
    'Note="Has continuous <i>Detect Arcana</i> effects for incorporeal and invisible creatures"',
  'Immortality':'Section=combat Note="Reforms d4 dy after being slain"',
  'Immune To Disease And Poison':
    'Section=combat Note="Has immunity to disease and poison"',
  'Incorporeal':
    'Section=feature ' +
    'Note="Unaffected by the physical world; successful Spirit allows becoming corporeal for 1 rd"',
  'Infernal Armor':
    'Section=arcana ' +
    'Note="May cover apparel with a glow that gives self +2 Armor"',
  'Infernal Stamina':'Section=attribute Note="+1 Vigor Step"',
  // Infravision as SWADE
  'Invisibility':'Section=feature Note="May become invisible while ethereal"',
  'Jumpy':'Section=attribute Note="Must attempt Fear check whenever startled"',
  'Magic':
    'Section=feature ' +
    'Note="May take edges particular to Arcane Background (Magic)"',
  'Material Components+':
    'Section=arcana ' +
    'Note="Suffers -4 arcane skill rolls when materials are unavailable; critical failure exhausts materials"',
  'Mercy':
    'Section=arcana ' +
    'Note="R%{spirit}\\" May spend 1 PP to remove Distracted, Vulnerable, or Shaken from target"',
  'Miracles':
    'Section=feature ' +
    'Note="May take edges particular to Arcane Background (Miracles)"',
  'Mist Form':
    'Section=feature ' +
    'Note="Successful Smarts-2 allows transformation into mist 1/night; failure inflicts Fatigue and critical failure prevents retry"',
  'Monster Hunter':
    'Section=combat ' +
    'Note="Immune to fear from %{$\'edges.Monster Hunter\'} creature type"',
  'Mummy':
    'Section=feature ' +
    'Note="Has Ageless, Rage, Slow, The Strength Of Ages, Undead, and Weakness (Fire) features"',
  'Mummy Rot':
    'Section=combat ' +
    'Note="Touch causes a Wound (Vigor neg); death allows using <i>Zombie</i> to convert target into a mummy"',
  'Mystic Powers (Angel (Death))':
    'Section=arcana,arcana ' +
    'Note=' +
      '"10 Power Points",' +
      '"May cast self <i>Boost Trait</i>, <i>Deflection</i>, self <i>Protection</i>, or <i>Smite</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Angel (Herald))':
    'Section=arcana,arcana ' +
    'Note=' +
      '"10 Power Points",' +
      '"May cast <i>Boost/Lower Trait</i>, <i>Divination</i>, <i>Healing</i>, or <i>Scrying</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Demon (Possessor))':
    'Section=arcana,arcana ' +
    'Note=' +
      '"10 Power Points",' +
      '"May cast <i>Boost/Lower Trait</i>, <i>Curse</i>, <i>Nightmares</i>, or <i>Puppet</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Demon (Summoner))':
    'Section=arcana,arcana ' +
    'Note=' +
      '"10 Power Points",' +
      '"May cast <i>Protection</i>, <i>Summon Ally</i>, <i>Summon Demon</i>, or <i>Zombie</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Demon (Tempter))':
    'Section=arcana,arcana ' +
    'Note=' +
      '"10 Power Points",' +
      '"May cast <i>Boost/Lower Trait</i>, <i>Disguise</i>, <i>Empathy</i>, or <i>Mind Reading</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Demon (Trickster))':
    'Section=arcana,arcana ' +
    'Note=' +
      '"10 Power Points",' +
      '"May cast self <i>Deflection</i>, <i>Disguise</i>, <i>Fear</i>, or <i>Illusionary Horrors</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Mummy (Architect))':
    'Section=arcana,arcana ' +
    'Note=' +
      '"10 Power Points",' +
      '"May cast <i>Barrier</i>, <i>Detect/Conceal Arcana</i>, <i>Lock/Unlock</i>, or <i>Telekinesis</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Mummy (Royal))':
    'Section=arcana,arcana ' +
    'Note=' +
      '"10 Power Points",' +
      '"May cast <i>Blast</i>, <i>Burst</i>, or <i>Spite</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Phantom (Poltergeist))':
    'Section=arcana,arcana ' +
    'Note=' +
      '"10 Power Points",' +
      '"May cast <i>Havoc</i>, <i>Illusionary Horrors</i>, <i>Sound/Silence</i>, or <i>Telekinesis</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Phantom (Shade))':
    'Section=arcana,arcana ' +
    'Note=' +
      '"10 Power Points",' +
      '"May cast <i>Confusion</i>, <i>Elemental Manipulation</i>, <i>Fear</i>, or <i>Puppet</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Phantom (Wraith))':
    'Section=arcana,arcana ' +
    'Note=' +
      '"10 Power Points",' +
      '"May cast <i>Blind</i>, <i>Light/Darkness</i>, <i>Sloth</i>, or <i>Stun</i> for 2 PP (+2 PP for Raise)"',
  'Night Terrors+':
    'Section=attribute,feature ' +
    'Note=' +
      '"-1 Spirit",' +
      '"Disturbs the sleep of others nearby"',
  'Old':
    'Section=attribute,skill ' +
    'Note=' +
      '"+2 Smarts",' +
      '"+2 Common Knowledge"',
  'Parts':
    'Section=attribute,skill ' +
    'Note=' +
      '"+2 Strength Step/+2 Vigor Step",' +
      '"Successful Healing-4 or Weird Science reattaches severed body part"',
  'Patchwork Monster':
    'Section=feature ' +
    'Note="Has Ageless, Berserk, Death\'s Haze, Fire Bad!, Parts, Rage, Science!, Undead,  and Weakness (Fire) features"',
  'Phantom':
    'Section=feature ' +
    'Note="Has Ageless, Darkvision, Doesn\'t Breathe, Ethereal, Flight, Immune To Disease And Poison, Rage, Strong Spirit, and Weakness (Salt) features"',
  'Power':
    'Section=feature ' +
    'Note="May take edges particular to other arcane backgrounds"',
  'Psionics':
    'Section=feature ' +
    'Note="May take edges particular to Arcane Background (Psionics)"',
  'Rage':
    'Section=combat ' +
    'Note="May spend a Benny to gain supernatural powers 1/session; suffers a major psychosis afterward (Spirit-2 neg)"',
  'Regeneration (Fast)':
    'Section=combat ' +
    'Note="Successful healing removes incapacitation or restores 1 Wound (Raise 2 Wounds)%1 1/rd"',
  'Regeneration (Slow)':
    'Section=combat Note="May attempt a natural healing roll 1/dy"',
  'Relentless':
    'Section=combat,feature ' +
    'Note=' +
      '"May take an action at a -2 penalty when Shaken",' +
      '"Driven to pursue and defeat evil"',
  'Relentless Tracker':
    'Section=skill ' +
    'Note="+2 Survival (tracking) vs. revenge target and regains trail after 2d6 hr if lost"',
  'Revenant':
    'Section=feature ' +
    'Note="Has Ageless, Hardy, Rage, Regeneration (Slow), Strength Of The Dead, Undead, and Vengeance features"',
  'Roar':
    'Section=combat ' +
    'Note="May make an Intimidation Test against all targets in a 9\\" cone"',
  'Savagery':
    'Section=combat Note="Wild Attack inflicts an additional +2 damage"',
  'Scan':
    'Section=arcana ' +
    'Note="R10\\" May sense presence of minds and strong emotions"',
  'Science!':'Section=feature Note="Has Arcane Resistance feature"',
  'Scorch':'Section=combat Note="Increased Hellfire effects"',
  'Scream Queen/King':'Section=attribute Note="May reroll Fear Effects"',
  'Screamer':
    'Section=attribute Note="Screams in response to a failed Fear check"',
  'Screamer+':
    'Section=attribute,combat ' +
    'Note=' +
      '"Screams in response to a failed Fear check",' +
      '"Scream after failed Fear check inflicts Distracted on self and allies in a 3\\" radius; successful Smarts ends"',
  'Searing Blast':'Section=combat Note="Increased Holy Light effects"',
  'Sense Supernatural':
    'Section=feature ' +
    'Note="R10\\" May sense presence of supernatural beings and effects"',
  'Servant Of Heaven':'Section=feature Note="Has Vow+ feature"',
  'Silent Caster':'Section=arcana Note="May use powers w/out speaking"',
  'Sire':
    'Section=feature ' +
    'Note="d4-hr process transforms target into a vampire (<i>Healing</i> w/Neutralize Disease neg)"',
  'Sixth Sense':
    'Section=combat ' +
    'Note="May spend up to 4 Power Points to increase Evasion or reduce damage by an equal amount"',
  'Slow':'Section=combat Note="-1 Pace/-1 Run Step"',
  'Speech':
    'Section=feature ' +
    'Note="May speak haltingly in werewolf form; suffers a -2 penalty on spoken Trait checks"',
  'Speed':'Section=combat Note="+2 Pace/+1 Run Step"',
  'Speed Flight':'Section=combat Note="Increases Flight speed"',
  'Spirit Friend':
    'Section=arcana ' +
    'Note="Can communicate w/a magical, Wild Card ethereal spirit that stores 5 Power Points"',
  // Spirited as SWADE
  'Stench':
    'Section=combat Note="Smell inflicts Distracted on adjacent creatures"',
  'Strength Of The Damned':
    'Section=attribute Note="+2 Strength Step and +2 Vigor Step when turned"',
  'Strength Of The Dead':
    'Section=attribute Note="+1 Spirit Step/+1 Vigor Step"',
  'Strong Spirit':'Section=attribute Note="+1 Spirit Step"',
  'Summon Great Swarm':
    'Section=arcana ' +
    'Note="Summoned swarm splits into two medium swarms when slain"',
  'Summon Storm':
    'Section=arcana ' +
    'Note="May create a sandstorm several miles in diameter that causes darkness and Fatigue (Vigor or shelter neg) 1/wk"',
  'Summon Swarm':
    'Section=arcana ' +
    'Note="May summon a %{$\'edges.Summon Great Swarm\'?\'large\':\'medium\'} swarm of pests 1/dy"',
  'Summoning':
    'Section=arcana ' +
    'Note="May use <i>Summon Ally</i> to conjure demonic legionnaires for 4 PP%{advances>=4?\', hellhounds for 5 PP\':\'\'}%{advances>=8?\', a demonic steed for 7 PP\':\'\'}"',
  'Superstitious':
    'Section=feature ' +
    'Note="-1 on all Trait rolls if focus object or routine is disturbed"',
  'The Sight':
    'Section=combat ' +
    'Note="May spend a Benny to rearrange allies\' Action Cards as desired"',
  'The Strength Of Ages':
    'Section=attribute Note="+2 Strength Step/+2 Vigor Step"',
  'The Witching Hour':
    'Section=feature ' +
    'Note="Gains free Soak and cannot critically fail between midnight and 1 a.m."',
  'This House Is Clean':
    'Section=arcana Note="+2 Spellcasting when casting <i>Banish</i>"',
  'Thought Eater':
    'Section=feature Note="Gains memories from eating a fresh brain"',
  'Thrall':'Section=feature Note="Has %{edges.Thrall} devoted servant of %{advances<8 ? \'novice\' : advances<12 ? \'seasoned\' : advances<16 ? \'veteran\' : \'heroic\'} rank"',
  'Tongues':'Section=feature Note="Speaks every human language fluently"',
  'Toughness +2':'Section=combat Note="+2 Toughness"',
  'Tower Of Will':'Section=combat Note="+4 vs. mental intrusion"',
  'Transformation':
    'Section=feature ' +
    'Note="May change between normal and werewolf forms at will; must remain a werewolf during the full moon"',
  'True Demon':
    'Section=combat ' +
    'Note="Suffers half damage from nonmagical attacks other than cold iron"',
  'Undead':
    'Section=combat,combat ' +
    'Note=' +
      '"+2 Toughness",' +
      '"+2 Shaken recovery/Takes no additional damage from a Called Shot/Ignores 1 point of Wound penalties/Doesn\'t breathe/Immune to disease and poison"',
  'Universal Ward':
   'Section=combat ' +
   'Note="Supernatural creatures cannot attack self (Spirit-4 neg)"',
  'Unnatural Appetite':
    'Section=skill Note="-2 Persuasion when eating habits are known"',
  'Vampire':
    'Section=feature ' +
    'Note="Has Ageless, Bite, Darkvision, Feed, Rage, Regeneration (Slow), Strength Of The Damned, Undead, and Weakness features"',
  'Vengeance':'Section=feature Note="Has Vow+ feature"',
  'Veteran Of The Dark World':
     'Section=description,feature ' +
     'Note="+4 Advances","Has an additional hindrance"',
  'Victim+':'Section=combat Note="Frequently chosen as the random target"',
  'Visions':'Section=feature Note="Receives a portentous vision 1/session"',
  // Wall Walker as SWADE
  'Weakness':
    'Section=feature ' +
    'Note="Suffers negative effects from particular objects or situations"',
  'Weakness (Cold Iron)':
    'Section=combat Note="Suffers +4 damage from cold iron weapons"',
  'Weakness (Fire)':'Section=combat Note="Suffers +4 damage from fire"',
  'Weakness (Salt)':
    'Section=feature ' +
    'Note="Cannot cross a salt barrier and suffers Shaken on contact"',
  'Weakness (Silver)':
    'Section=combat ' +
    'Note="Suffers +4 damage from silvered weapons while in werewolf form"',
  'Werewolf':
    'Section=feature ' +
    'Note="Has Bite, Claws, Cannot Speak (Werewolf), Ferocity, Infravision, Rage, Regeneration (Slow), Speed, Transformation, and Weakness (Silver) features"',
  'Wing Strike':
    'Section=combat ' +
    'Note="Wings inflict d%{strength}+d8 damage; 5\\" charge inflicts an additional +4 damage/+2 Toughness when wings extended (Called Shot-2 neg)"',
  'Wings':
    'Section=combat Note="Fly Pace %{edges.Wings>2?48:edges.Wings>1?24:12}"',
  'Zombie Master':
    'Section=skill ' +
    'Note="Successful Intimidation vs. Spirit gives control of mindless skeletons and zombies until the end of the encounter"'
};
SWADEHC.GOODIES = {
  // empty
};
SWADEHC.HINDRANCES = {
  'Amorous':'Severity=Minor',
  'Bleeder+':'Severity=Major',
  'Bullet Magnet':'Severity=Minor',
  'Bully':'Severity=Minor Require="features.Bully+ == 0"',
  'Bully+':'Severity=Major Require="features.Bully == 0"',
  'Corruption+':'Require="powerCount > 0" Severity=Major',
  'Cursed+':'Severity=Major',
  'Doomed+':'Severity=Major',
  'Dread':'Severity=Minor',
  'Flashbacks+':'Severity=Major', // Veteran Of The Dark World
  'Forlorn+':'Severity=Major',    // Veteran Of The Dark World
  'Heavy Sleeper':'Severity=Minor',
  'Jumpy':'Severity=Minor',
  'Material Components+':'Require="powerCount > 0" Severity=Major',
  'Night Terrors+':'Severity=Major',
  'Screamer':'Severity=Minor Require="features.Screamer+ == 0"',
  'Screamer+':'Severity=Major Require="features.Screamer == 0"',
  'Superstitious':'Severity=Minor',
  'Unnatural Appetite':'Severity=Minor',
  'Victim+':'Severity=Major'
};
SWADEHC.POWERS = {
  'Aspect Of The Rada Loa':
    'Advances=0 ' +
    'PowerPoints=5 ' +
    'Range=Self ' +
    'Description="Gives use of spirit-specific abilities for 1 hr"',
  'Consecrate Ground':
    'Advances=4 ' +
    'PowerPoints=5 ' +
    'Range=Touch ' +
    'Modifier=' +
      '"+5 PP Lasts until sunset" ' +
    'Description="3\\" radius gives supernaturally good entities +2 Toughness and inflicts Distracted and Vulnerable (Raise also 2d4 damage) on evil entities for 1 hr"',
  'Corpse Sense':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=Self ' +
    'Modifier=' +
      '"+1 PP Caster can speak through nonsentient corpses" ' +
    'Description="Detects and allows vision and hearing through corpses in 1 mile radius (Raise 5 miles; Spirit neg for sentient undead)"',
  'Curse':
    'Advances=4 ' +
    'PowerPoints=5 ' +
    'Range=Touch ' +
    'Modifier=' +
      '"+2 PP Inflicts minor hindrance (Raise major)" ' +
    'Description=' +
      '"Target suffers 1 level of Fatigue and an additional level each sunset (Spirit neg)"',
  'Exorcism':
    'Advances=8 ' +
    'PowerPoints=3+ ' +
    'Range=Smarts ' +
    'Modifier=' +
      '"+4 PP May exorcise unseen spirit" ' +
    'Description="Ritual banishes or destroys otherworldly being (Spirit neg)"',
  'Fury Of The Petro Loa':
    'Advances=0 ' +
    'PowerPoints=5 ' +
    'Range=Self ' +
    'Description="Gives use of spirit-specific abilities for 5 rd"',
  'Grave Shroud':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Range=Smarts ' +
    'Modifier=' +
      '"+1 PP/additional target" ' +
    'Description="Target appears undead for 10 min (Spirit neg)"',
  'Illusionary Horrors':
    'Advances=4 ' +
    'PowerPoints=5 ' +
    'Range=Touch ' +
    'Modifier=' +
      '"+2 PP/additional target" ' +
    'Description="Visions distract and influence target for 1 dy"',
  'Locate':
    'Advances=0 ' +
    'PowerPoints=3 ' +
    'Range=Self ' +
    'Modifier=' +
      '"+1 PP Know best route to target" ' +
    'Description=' +
      '"Gives direction of chosen item (-2 if self has never seen item) for 10 min"',
  'Lock/Unlock':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP Alerts self if unlocked" ' +
    'Description=' +
      '"Inflicts -4 to open on target item (Raise seals shut) or opens target item, ignoring 4 points of penalties (Raise disarms alarms and traps)"',
  'Nightmares':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=Unlimited ' +
    'Modifier=' +
      '"+1 PP Add specific themes" ' +
    'Description="Target suffers Night Terrors+ for 1 wk"',
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
    'Range=Self ' +
    'Modifier=' +
      '"+1 PP Shares with allies in a %{smarts}\\" radius" ' +
    'Description=' +
      '"Gives view of chosen target (-2 unfamiliar target; Spirit target detects) for 5 rd"',
  'Seance':
    'Advances=4 ' +
    'PowerPoints=5 ' +
    'Range=Self ' +
    'Modifier=' +
      '"+2 PP Speak w/demons","+2 PP Spirit performs a simple task" ' +
    'Description="Allows asking a spirit 3 questions"',
  'Spite':
    'Advances=4 ' +
    'PowerPoints=3 ' +
    'Range=Self ' +
    'Description=' +
      '"Successful attackers suffer 1d6 damage per Wound inflicted for 5 rd"',
  'Summon Ally': // Changed from SWADE
    'Advances=0 ' +
    'PowerPoints=1+ ' +
    'Range=Smarts ' +
    'Modifier=' +
      '"+1 PP Servant gains combat edge",' +
      '"+2 PP Servant can fly Pace\\"/rd",' +
      '"+1 PP Servant gains +1 Trait Step",' +
      '"+1 PP Self can use servant\'s senses",' +
      '"Epic +Half PP/additional servant" ' +
    'Description=' +
      '"Creates an obedient servant (Raise servant may take 1 Wound) for 5 rd"',
  'Summon Demon':
    'Advances=8 ' +
    'PowerPoints=3+ ' +
    'Range=Smarts ' +
    'Description=' +
      '"Ritual transports and binds a demon (Spirit neg) to perform a task"',
  'Suppress Transformation':
    'Advances=8 ' +
    'PowerPoints=3 ' +
    'Range=Touch ' +
    'Modifier=' +
      '"+4 PP Permanent cure" ' +
    'Description="Suppresses lycanthropy in target for 1 dy"',
  'Detect Arcana': // For Fortune Teller power list
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=Smarts ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+1/+2 PP 2\\"/3\\" radius" ' +
    'Description=' +
      '"Target can detect the presence of supernatural effects (Raise also the type) for 5 rd"'
};
SWADEHC.SHIELDS = {
  // empty
};
SWADEHC.SKILLS = {
  'Alchemy':'Attribute=smarts'
};
SWADEHC.WEAPONS = {
  'Atomic Ghost Pack':'Damage=2d8 MinStr=6 Weight=15 Category=Ranged Range=5',
  'Mini Crossbow':'Damage=2d4 MinStr=4 Weight=3 Category=Ranged Range=6 AP=1',
  'Repeating Crossbow':
    'Damage=2d6 MinStr=6 Weight=15 Category=Ranged Range=15 ROF=3 AP=2',
  'Winch Crossbow':'Damage=2d6 MinStr=6 Weight=15 Category=Ranged Range=5 AP=2',
  'Flare Gun':'Damage=2d4 MinStr=4 Weight=4 Category=Ranged Range=3',
  'Holy Water Grenade':'Damage=None MinStr=4 Weight=2 Category=Ranged Range=5',
  'Holy Water Pistol':'Damage=None MinStr=4 Weight=4 Category=Ranged Range=1',
  'Holy Water Spray':'Damage=None MinStr=4 Weight=1 Category=Ranged Range=1',
  'Stake':'Damage=Str+d4 MinStr=4 Weight=2 Category=One-Handed Range=2',
  'UV Grenade':'Damage=3d6 MinStr=4 Weight=2 Category=Ranged Range=5',
  'Corpse Catcher':'Damage=None MinStr=6 Weight=4 Category=Two-Handed',
  'Silver-tipped Stake':
    'Damage=Str+d4 MinStr=4 Weight=2 Category=One-Handed Range=2'
};

/* Defines rules related to powers. */
SWADEHC.arcaneRules = function(rules, arcanas, powers) {
  // Suppress redefinition warnings for replaced powers
  let allNotes = rules.getChoices('notes');
  let allPowers = rules.getChoices('powers');
  for(let p in powers) {
    if(p in allPowers) {
      delete allPowers[p];
      delete allNotes['powers.' + p];
    }
  }
  SWADE.arcaneRules(rules, arcanas, powers);
};

/* Defines the rules related to combat. */
SWADEHC.combatRules = function(rules, armors, shields, weapons) {
  SWADE.combatRules(rules, armors, shields, weapons);
  // Add placeholders for Bite and Claw AP values.
  let allNotes = rules.getChoices('notes');
  if(allNotes && 'weapons.Bite' in allNotes)
    allNotes['weapons.Bite'] = allNotes['weapons.Bite'].replace(')', '%6)');
  if(allNotes && 'weapons.Claws' in allNotes)
    allNotes['weapons.Claws'] = allNotes['weapons.Claws'].replace(')', '%6)');
  rules.defineRule('weapons.Bite.6', 'weapons.Bite', '=', '""');
  rules.defineRule('weapons.Claws.6', 'weapons.Claws', '=', '""');
};

/* Defines rules related to basic character identity. */
SWADEHC.identityRules = function(rules, ancestries, eras, concepts) {
  SWADE.identityRules(rules, ancestries, eras, concepts);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to character aptitudes. */
SWADEHC.talentRules = function(
  rules, edges, features, goodies, hindrances, skills)
{
  SWADE.talentRules(rules, edges, features, goodies, hindrances, skills);
  for(let e in edges)
    SWADEHC.edgeRulesExtra(rules, e, edges[e]);
  for(let h in hindrances)
    SWADEHC.hindranceRulesExtra(rules, h, hindrances[h]);
  for(let e in edges) {
    // Monstrous hero edges are free; add an edge point to compensate
    let types = QuilvynUtils.getAttrValueArray(edges[e], 'Type');
    let requires = QuilvynUtils.getAttrValueArray(edges[e], 'Require');
    if(types[0] == 'Monstrous' &&
       requires.length == 1 &&
       requires[0].match(/^monstrousHero\s*==\s*1$/))
      rules.defineRule('monstrousHero', 'edges.' + e, '+=', '1');
  }
  rules.defineRule('edgePoints', 'monstrousHero', '+=', '1');
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
    ('features.Arcane Background (Psionics)', 'features.Psionics', '=', '1');
  rules.defineRule('arcanaNotes.arcaneBackground(Psionics)',
    'edges.Arcane Background (Psionics)', '?', null
  );
};

/*
 * Defines in #rules# the rules associated with edge #name# that cannot be
 * derived directly from the attributes passed to edgeRules.
 */
SWADEHC.edgeRulesExtra = function(rules, name) {
  if(name == 'Angel') {
    rules.defineRule('combatNotes.flight',
      'features.Angel', '^=', '12',
      'features.Speed Flight', '+', 'source==1 ? 12 : 36',
      'combatNotes.speedFlight', '+', 'null' // Italics noop
    );
  } else if(name == 'Bite') {
    rules.defineRule('damageStep.Bite', 'edges.Bite', '^=', '2');
    rules.defineRule
      ('weapons.Bite.6', 'edges.Bite', '=', 'source>1 ? " AP 2" : null');
  } else if(name == 'Bite & Claws') {
    rules.defineRule('damageStep.Bite', 'combatNotes.bite&Claws', '^=', '3');
    rules.defineRule('damageStep.Claws', 'combatNotes.bite&Claws', '^=', '3');
    rules.defineRule
      ('weapons.Bite.6', 'combatNotes.bite&Claws', '=', '" AP 4"');
    rules.defineRule
      ('weapons.Claws.6', 'combatNotes.bite&Claws', '=', '" AP 4"');
  } else if(name == 'Claws') {
    rules.defineRule
      ('damageStep.Claws', 'edges.Claws', '^=', 'source>1 ? 2 : null');
    rules.defineRule('features.Claws (Climbing)', 'edges.Claws', '=', '1');
    rules.defineRule
      ('weapons.Claws.6', 'edges.Claws', '=', 'source>1 ? " AP 2" : null');
  } else if(name == 'Mummy') {
    rules.defineRule('combatNotes.regeneration(Fast).1',
      'features.Mummy', '=', '" not caused by fire or holy water"'
    );
  } else if(name == 'Phantom') {
    rules.defineRule('combatNotes.flight', 'features.Phantom', '=', '12');
  } else if(name == 'Regeneration (Fast)') {
    rules.defineRule('combatNotes.regeneration(Fast).1',
      'features.Regeneration (Fast)', '?', null,
      '', '=', '""'
    );
  } else if(name == 'Vampire') {
    rules.defineRule('combatNotes.regeneration(Fast).1',
      'features.Vampire', '=', '" not caused by decapitation, holy water or weapons, sunlight, or a stake through the heart"'
    );
    rules.defineRule('vampireWallPace',
      'edges.Vampire', '?', null,
      'pace', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('combatNotes.wallWalker', 'vampireWallPace', '^=', null);
    rules.defineRule('combatNotes.wallWalker.1', 'vampireWallPace', '^=', null);
    rules.defineRule('damageStep.Claws', 'edges.Vampire', '^=', '2');
  } else if(name == 'Werewolf') {
    rules.defineRule('combatNotes.regeneration(Fast).1',
      'features.Werewolf', '=', '" not caused by silver"'
    );
    rules.defineRule('werewolfWallPace',
      'edges.Werewolf', '?', null,
      'pace', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('combatNotes.wallWalker', 'werewolfWallPace', '^=', null);
    rules.defineRule
      ('combatNotes.wallWalker.1', 'werewolfWallPace', '^=', null);
    rules.defineRule('damageStep.Bite', 'edges.Werewolf', '^=', '2');
    rules.defineRule('weapons.Bite.6', 'edges.Werewolf', '=', '" AP 2"');
    rules.defineRule('damageStep.Claws', 'edges.Werewolf', '^=', '2');
    rules.defineRule('weapons.Claws.6', 'edges.Werewolf', '=', '" AP 2"');
  } else if(name == 'Wing Strike') {
    SWADE.weaponRules(
      rules, 'Wings', ['Ancient', 'Medieval', 'Modern', 'Future'], 'Str+d8', 0,
      0, 'Unarmed', null, null, null, null
    );
    rules.defineRule('weapons.Wings', 'features.Wing Strike', '=', '1');
  }
};

/*
 * Defines in #rules# the rules associated with hindrance #name# that cannot be
 * derived directly from the attributes passed to hindranceRules.
 */
SWADEHC.hindranceRulesExtra = function(rules, name) {
  if(name == 'Grim') {
    // Fulfills prereq for Menacing edge
    rules.defineRule
      ('validationNotes.menacingEdgeAlt.0', 'features.Grim', '+', '1');
  }
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
SWADEHC.randomizeOneAttribute = function(attributes, attribute) {
  if(attribute=='powers') {
    let startingPowers = {
      'Demonologist': ['Banish', 'Havoc', 'Summon Ally'],
      'Medium': ['Banish', 'Detect/Conceal Arcana'],
      'Occultist': ['Detect/Conceal Arcana', 'Dispel', 'Lock/Unlock'],
      'Priest': ['Healing', 'Sanctuary']
    };
    let allPowers = this.getChoices('powers');
    for(let ab in startingPowers) {
      if('edges.Arcane Background (' + ab + ')' in attributes) {
        startingPowers[ab].forEach(p => {
          if(p in allPowers)
            attributes['powers.' + p] = 1;
          else
            console.log('Unknown power "' + p + '"');
        });
      }
    }
  }
  return this.hcReplacedRandomizer(attributes, attribute);
};

/* Returns HTML body content for user notes associated with this rule set. */
SWADEHC.ruleNotes = function() {
  return '' +
    '<h2>SWADE Horror Companion Quilvyn Module Notes</h2>\n' +
    'SWADE Horror Companion Quilvyn Module Version ' + SWADEHC.VERSION + '\n' +
    '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '  Quilvyn allows the creation of monstrous heroes through the selection ' +
    '  of additional edges named Angel, Demon, Mummy, etc. Selecting any one ' +
    '  of these edges gives the character an additional edge point, and so ' +
    '  does not reduce the number of other edges that can be selected.\n' +
    '  </li><li>\n' +
    '  To avoid confusion with core features, Quilvyn combines the Angel ' +
    '  Toughness edge and the Werewolf Tough edge into an edge named ' +
    '  Toughness +2 and renames the Angel Speed edge as Speed Flight.\n' +
    '  </li><li>\n' +
    '  Quilvyn supports the effects of the Veteran Of The Dark World ' +
    '  hindrance by adding Flashbacks+ and Forlorn+ hindrances.\n' +
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
    'Savage Worlds Adventure Edition Horror Companion ' +
    '© 2023 Pinnacle Entertainment Group.\n' +
    '</p>\n' +
    '<img alt="Savage Worlds Fan Logo" width="300" height="200" src="https://peginc.com/wp-content/uploads/2019/01/SW_LOGO_FP_2018.png"/>\n';
};
