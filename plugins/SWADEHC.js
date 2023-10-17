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
 * Companion. The SWADEHC function contains methods that load rules for
 * particular parts of the rules: ancestryRules for character ancestries,
 * arcaneRules for powers, etc. These member methods can be called
 * independently in order to use a subset of the SWADEHC rules. Similarly, the
 * constant fields of SWADE (SKILLS, EDGES, etc.) can be manipulated to modify
 * the choices.
 */
function SWADEHC(baseRules) {

  if(window.SWADE == null) {
    alert('The SWADEHC module requires use of the SWADE module');
    return;
  }

  var rules = new QuilvynRules('SWADE Horror', SWADEHC.VERSION);
  rules.plugin = SWADEHC;
  SWADEHC.rules = rules;

  rules.defineChoice('choices', SWADEHC.CHOICES);
  rules.choiceEditorElements = SWADEHC.choiceEditorElements;
  rules.choiceRules = SWADEHC.choiceRules;
  rules.removeChoice = SWADE.removeChoice;
  rules.editorElements = SWADE.initialEditorElements();
  rules.getFormats = SWADE.getFormats;
  rules.getPlugins = SWADEHC.getPlugins;
  rules.makeValid = SWADE.makeValid;
  rules.randomizeOneAttribute = SWADEHC.randomizeOneAttribute;
  rules.defineChoice('random', SWADEHC.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = SWADEHC.ruleNotes;

  SWADE.createViewers(rules, SWADE.VIEWERS);
  rules.defineChoice('extras',
    'edges', 'edgePoints', 'hindrances', 'sanityNotes', 'validationNotes'
  );
  rules.defineChoice('preset',
    'race:Race,select-one,races', 'advances:Advances,text,4',
    'concepts:Concepts,set,concepts'
  );

  SWADEHC.attributeRules(rules);
  SWADEHC.combatRules
    (rules, SWADEHC.ARMORS, SWADEHC.SHIELDS, SWADEHC.WEAPONS);
  SWADEHC.arcaneRules(rules, SWADEHC.ARCANAS, SWADEHC.POWERS);
  SWADEHC.talentRules
    (rules, SWADEHC.EDGES, SWADEHC.FEATURES, SWADEHC.GOODIES,
     SWADEHC.HINDRANCES, SWADEHC.SKILLS);
  SWADEHC.identityRules(rules, SWADEHC.RACES, SWADEHC.CONCEPTS);

  Quilvyn.addRuleSet(rules);

}

SWADEHC.VERSION = '2.4.1.0';

SWADEHC.CHOICES = [].concat(SWADE.CHOICES);
SWADEHC.RANDOMIZABLE_ATTRIBUTES = [].concat(SWADE.RANDOMIZABLE_ATTRIBUTES);

SWADEHC.ARCANAS = {
  // FILL
};
SWADEHC.ARMORS = {
  // FILL
};
SWADEHC.CONCEPTS_ADDED = {
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
    'Edge=Werewolf'
};
SWADEHC.CONCEPTS = Object.assign({}, SWADE.CONCEPTS, SWADEHC.CONCEPTS_ADDED);
SWADEHC.EDGES_ADDED = {
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
  'Aggravated Damage':'Type=Monstrous Require="monstrousHero"',
  'Fear -2':'Type=Monstrous Require="monstrousHero"',
  'Old':'Type=Monstrous Require="monstrousHero"',
  'Savagery':'Type=Monstrous Require="monstrousHero"',
  // Angel
  'Angel':'Type=Monstrous Require="monstrousTypeCount==1"',
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
  'Speed (Angel)':'Type=Monstrous Require="advances >= 4","features.Angel"',
  'Tongues':'Type=Monstrous Require="advances >= 4","features.Angel"',
  'Toughness (Angel)':'Type=Monstrous Require="advances >= 4","features.Angel"',
  'Divine Toughness':
    'Type=Monstrous Require="advances >= 4","features.Toughness"',
  'Wing Strike':'Type=Monstrous Require="advances >= 4","features.Angel"',
  // Demon
  'Demon':'Type=Monstrous Require="monstrousTypeCount==1"',
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
  'Mummy':'Type=Monstrous Require="monstrousTypeCount==1"',
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
  'Patchwork Monster':'Type=Monstrous Require="monstrousTypeCount==1"',
  'Detachable Parts':
    'Type=Monstrous ' +
    'Require="advances >= 4","features.Patchwork Monster || feaures.Revenant"',
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
  'Phantom':'Type=Monstrous Require="monstrousTypeCount==1"',
  'Chilling Touch':
    'Type=Monstrous Require="advances >= 4","features.Phantom","spirit >= 8"',
  'Crossover':'Type=Monstrous Require="advances >= 4","features.Phantom"',
  'Invisibility':
    'Type=Monstrous Require="advances >= 4","features.Phantom","spirit >= 8"',
  'Mystic Powers (Phantom)':
    'Type=Monstrous Require="advances >= 4","features.Phantom"',
  // Roar as Patchwork Monster
  // Revenant
  'Revenant':'Type=Monstrous Require="monstrousTypeCount==1"',
  'Death Touch':'Type=Monstrous Require="advances >= 12","features.Revenant"',
  // Detachable Parts as Patchwork Monster
  'Relentless Tracker':
    'Type=Monstrous Require="advances >= 8","features.Revenant"',
  'Stench':'Type=Monstrous Require="features.Revenant"',
  'Thought Eater':'Type=Monstrous Require="advances >= 4","features.Revenant"',
  'Zombie Master':'Type=Monstrous Require="features.Revenant"',
  // Vampire
  'Vampire':'Type=Monstrous Require="monstrousTypeCount==1"',
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
  'Werewolf':'Type=Monstrous Require="monstrousTypeCount==1"',
  'Alpha':'Type=Monstrous Require="features.Werewolf"',
  'Bite & Claws':'Type=Monstrous Require="advances >= 4","features.Werewolf"',
  // Regeneration (Fast) as Mummy
  // Roar as Patchwork Monster
  'Speech':'Type=Monstrous Require="advances >= 4","features.Werewolf"',
  'Tough (Werewolf)':
    'Type=Monstrous Require="advances >= 4","features.Werewolf"'
  // Wall Walker as Vampire
};
SWADEHC.EDGES = Object.assign({}, SWADE.EDGES, SWADEHC.EDGES_ADDED);
SWADEHC.FEATURES_ADDED = {
  'Ageless':'Section=feature Note="Does not age"',
  'Aggravated Damage':
    'Section=combat ' +
    'Note="Attacks can hurt supernatural creatures; foe regeneration suffers -4 penalty"',
  'Amorous':
    'Section=skill Note="-2 on Tests by a foe w/the Attractive feature"',
  'Alpha':'Section=feature Note="FILL"',
  'Angel':
    'Section=feature ' +
    'Note="Has Ageless, Beautify, Divine Might, Faith, Flight, Immune To Disease And Poison, and Servant Of Heaven features"',
  'Animal Form':'Section=feature Note="FILL"',
  'Armored Hide':'Section=combat Note="+4 Armor"',
  'Beautify':'Section=arcana Note="May create minor beauty effects"',
  'Berserk':'Section=feature Note="FILL"',
  'Bespoil':'Section=arcana Note="May create minor ugliness effects"',
  'Bite/Claws':'Section=feature Note="FILL"',
  'Bite & Claws':'Section=feature Note="FILL"',
  'Bleeder+':
    'Section=combat ' +
    'Note="Taking a Wound inflicts a level of fatigue each rd (Vigor neg 1 rd; Raise or Healing ends)"',
  'Blunderer+':'Section=feature Note="FILL"',
  'Bullet Magnet':
    'Section=combat ' +
    'Note="Hit by accidental fire by single-shot weapons on a 1-2 and shotguns and full-auto weapons on a 1-3"',
  'Bully':'Section=feature Note="Frequently belittles others"',
  'Bully+':
    'Section=feature Note="Frequently belittles others and may turn violent"',
  'Burrow':'Section=combat Note="Burrow Pace %{pace/2}"',
  'Cannot Speak':'Section=feature Note="Cannot speak while transformed"',
  'Charm':'Section=feature Note="FILL"',
  'Children Of The Night':'Section=feature Note="FILL"',
  'Chilling Touch':'Section=feature Note="FILL"',
  'Corruption+':
    'Section=arcana ' +
    'Note=' +
      '"Critical failure on arcane skill inflicts additional or increased hindrance until next advance"',
  'Courage':
    'Section=combat ' +
    'Note="R%{commandRange} Allies may reroll failed fear checks"',
  'Crossover':'Section=feature Note="FILL"',
  'Cursed+':
    'Section=arcana ' +
    'Note="Powers cast to aid self suffer -2 arcane skill; critical failure stuns caster"',
  'Darkvision':'Section=feature Note="FILL"',
  'Deal Maker':'Section=feature Note="FILL"',
  "Death's Haze":'Section=feature Note="FILL"',
  'Daywalker':'Section=feature Note="FILL"',
  'Death Touch':'Section=feature Note="FILL"',
  'Demon':
    'Section=feature ' +
    'Note="Has Ageless, Bespoil, Darkvision, Deal Maker, Doesn\'t Breathe, Environmental Resistance (Cold, Electricity, Heat), Immune To Disease And Poison, Infernal Stamina, Spirited, and Weakness (Cold Iron) features"',
  'Demonic Immortality':'Section=combat Note="Reforms d4 dy after being slain"',
  'Detachable Parts':'Section=feature Note="FILL"',
  'Discharge':'Section=feature Note="FILL"',
  'Divine Blade':
    'Section=combat ' +
    'Note="Has a magical weapon that inflicts +d6 damage and ignores Immortality edge"',
  'Divine Might':'Section=attribute Note="+2 Strength Step/+2 Vigor Step"',
  'Divine Toughness':'Section=feature Note="+2 Toughness"',
  "Doesn't Breathe":'Section=feature Note="Does not require oxygen"',
  'Doomed+':'Section=attribute Note="-2 Vigor (soak)"',
  'Dread':'Section=feature Note="+2 rolls on Fear Effects"',
  'Environmental Resistance (Cold, Electricity, Heat)':'Section=feature Note="FILL"',
  'Ethereal':'Section=feature Note="FILL"',
  'Faith':'Section=skill Note="+1 Faith Step"',
  'Favored Power':
    'Section=arcana ' + 
    'Note="May ignore 2 points of penalties when casting chosen power"',
  'Fear -2':
    'Section=combat Note="Inflicts -2 penalty on others\' first Fear check"',
  'Feed':'Section=feature Note="FILL"',
  'Ferocity':
    'Section=attribute Note="+2 Agility Step/+2 Strength Step/+2 Vigor Step"',
  'Final Girl/Guy':
    'Section=combat ' +
    'Note="R%{smarts}\\" May spend a Benny 1/encounter to grant 5 Trait or damage rerolls"',
  'Fire Bad!':'Section=feature Note="Has Phobia+ hindrance (fire)"',
  'Flashbacks':'Section=feature Note="FILL"',
  'Flight': // Modified from SWADE
    'Section=combat Note="Fly Pace %V"',
  'Gallows Humor':
    'Section=skill ' +
    'Note="May use Taunt vs. fear instead of spirit; Raise gives +1 to allies"',
  'Gorge':'Section=feature Note="FILL"',
  // Hardy as SWADE
  'Heavy Sleeper':
    'Section=attribute,skill ' +
    'Note="-4 Vigor (stay awake)","-4 Notice (wake up)"',
  'Hellfire':
    'Section=combat ' +
    'Note="R12\\" May create and move a 1\\" radius fire that inflicts %{combatNotes.scorch?2:1}d6 damage or attack with a 9\\" cone%{combatNotes.scorch?\' or 12\\" stream\':\'\'} that inflicts 2d4 damage"',
  'Holy Light':
    'Section=combat ' +
    'Note="R12\\" May create and move a dim or bright light or attack with a 9\\" cone or 12\\" stream that inflicts 2d%{combatNotes.searingBlast?6:4} damage"',
  'Immortality':'Section=combat Note="Reforms d4 dy after being slain"',
  'Immune To Disease And Poison':
    'Section=combat Note="Has immunity to disease and poiton"',
  'Incorporeal':
    'Section=feature ' +
    'Note="Unaffected by the physical world; successful Spirit allows becoming corporeal for 1 rd"',
  'Infernal Stamina':'Section=attribute Note="+1 Vigor Step"',
  'Infravision':'Section=feature Note="FILL"',
  'Invisibility':'Section=feature Note="FILL"',
  'Jumpy':'Section=attribute Note="Must attempt Fear check whenever startled"',
  'Material Components+':
    'Section=arcana ' +
    'Note="Suffers -4 arcane skill rolls when materials are unavailable; critical failure exhausts materials"',
  'Mist Form':'Section=feature Note="FILL"',
  'Monster Hunter':'Section=combat Note="Immune to fear from %V creature type"',
  'Mummy':
    'Section=feature ' +
    'Note="Has Ageless, Slow, The Strenth Of Ages, Undead, and Weakness (Fire) features"',
  'Mummy Rot':
    'Section=combat ' +
    'Note="Touch causes a Wound (Vigor neg); death may convert target into a mummy"',
  'Mystic Powers (Angel (Death))':
    'Section=arcana ' +
    'Note="10 Power Points/May cast self <i>Boost Trait</i>, <i>Deflection</i>, self <i>Protection</i>, or <i>Smite</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Angel (Herald))':
    'Section=arcana ' +
    'Note="10 Power Points/May cast <i>Boost/Lower Trait</i>, <i>Divination</i>, <i>Healing</i>, or <i>Scrying</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Demon (Possessor))':
    'Section=arcana ' +
    'Note="10 Power Points/May cast <i>Boost/Lower Trait</i>, <i>Curse</i>, <i>Nightmares</i>, or <i>Puppet</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Demon (Summoner))':
    'Section=arcana ' +
    'Note="10 Power Points/May cast <i>Protection</i>, <i>Summon Ally</i>, <i>Sumon Demon</i>, or <i>Zombie</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Demon (Tempter))':
    'Section=arcana ' +
    'Note="10 Power Points/May cast <i>Boost/Lower Trait</i>, <i>Disguise</i>, <i>Empathy</i>, or <i>Mind Reading</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Demon (Trickster))':
    'Section=arcana ' +
    'Note="10 Power Points/May cast self <i>Deflection</i>, <i>Disguise</i>, <i>Fear</i>, or <i>Illusionary Horrors</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Mummy (Architect))':
    'Section=arcana ' +
    'Note="10 Power Points/May cast <i>Blade Barrier</i>, <i>Detect/Conceal Arcana</i>, <i>Lock/Unlock</i>, or <i>Telekinesis</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Mummy (Royal))':
    'Section=arcana ' +
    'Note="10 Power Points/May cast <i>Blast</i>, <i>Burst</i>, or <i>Spite</i> for 2 PP (+2 PP for Raise)"',
  'Mystic Powers (Phantom)':'Section=feature Note="FILL"',
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
  'Parts':'Section=feature Note="FILL"',
  'Patchwork Monster':
    'Section=feature ' +
    'Note="Has Ageless, Berserk, Death\'s Haze, Fire Bad!, Parts, Science!, Undead,  and Weakness (Fire) features"',
  'Phantom':
    'Section=feature ' +
    'Note="Has Ageless, Darkvision, Doesn\'t Breathe, Ethereal, Flight, Immune To Disease And Poison, Strong Spirit, and Weakness (Salt) features"',
  'Regeneration (Fast)':
    'Section=combat ' +
    'Note="Successful Vigor removes incapacitation or restores 1 Wound (Raise 2 Wounds)"',
  'Regeneration (Slow)':
    'Section=skill Note="May make a natural healing roll 1/dy"',
  'Relentless Tracker':'Section=feature Note="FILL"',
  'Relentless':
    'Section=combat,feature ' +
    'Note=' +
      '"May take an action at -2 when shaken",' +
      '"Driven to pursue and defeat evil"',
  'Revenant':
    'Section=feature ' +
    'Note="Has Ageless, Hardy, Regeneration (Slow), Strength Of The Dead, Undead, and Vengeance features"',
  'Roar':'Section=feature Note="FILL"',
  'Savagery':'Section=feature Note="FILL"',
  'Science!':'Section=feature Note="FILL"',
  'Scorch':'Section=combat Note="Increased Hellfire effects"',
  'Scream Queen/King':'Section=attribute Note="May reroll Fear Effects"',
  'Screamer':
    'Section=attribute Note="Screams in reponse to a failed Fear check"',
  'Screamer+':
    'Section=attribute,combat ' +
    'Note=' +
      '"Screams in reponse to a failed Fear check",' +
      '"Scream after failed Fear check inflicts Distracted on self an allies in a 3\\" radius; successful smarts ends"',
  'Searing Blast':'Section=combat Note="Increased Holy Light effects"',
  'Sense Supernatural':
    'Section=feature ' +
    'Note="R10\\" May sense presense of superatural beings and effects"',
  'Servant Of Heaven':'Section=feature Note="Has Vow+ feature"',
  'Silent Caster':'Section=arcana Note="May use Powers w/out speech"',
  'Sire':'Section=feature Note="FILL"',
  'Slow':'Section=feature Note="FILL"',
  'Speech':'Section=feature Note="FILL"',
  'Speed':'Section=combat Note="+2 Pace/+1 Run Step"',
  'Speed (Angel)':'Section=combat Note="Increased Flight speed"',
  // Spirited as SWADE
  'Stench':'Section=feature Note="FILL"',
  'Strength Of The Damned':'Section=feature Note="FILL"',
  'Strength Of The Dead':
    'Section=attribute Note="+1 Spirit Step/+1 Vigor Step"',
  'Strong Spirit':'Section=attribute Note="+1 Spirit Step"',
  'Summon Great Swarm':
    'Section=arcana ' +
    'Note="Summoned swarm splits into two medium swarms when slain"',
  'Summon Storm':
    'Section=arcana ' +
    'Note="Sandstorm several miles in diameter causes darkness and Fatigue (Vigor or shelter neg) 1/min"',
  'Summon Swarm':
    'Section=arcana ' +
    'Note="May summon a %{$\'edges.Summon Great Swarm\'?\'large\':\'medium\'} swarm 1/dy"',
  'Superstitious':
    'Section=feature ' +
    'Note="-1 on all Trait rolls if focus object or routine is disturbed"',
  'The Strenth Of Ages':'Section=feature Note="FILL"',
  'Thought Eater':'Section=feature Note="FILL"',
  'Thrall':'Section=feature Note="FILL"',
  'Tongues':'Section=feature Note="Is fluent in every human language"',
  'Tough (Werewolf)':'Section=combat Note="+2 Toughness"',
  'Toughness (Angel)':'Section=combat Note="+2 Toughness"',
  'Transformation':'Section=feature Note="FILL"',
  'True Demon':
    'Section=combat ' +
    'Note="Suffers half damage from nonmagical attacks other than cold iron"',
  'Undead':
    'Section=combat ' +
    'Note="+2 Toughness/+2 Shaken recovery/Takes no additional damage from Called Shot/Ignores 1 point of Wound penalties/Doesn\'t breathe/Immune to disease and poison"',
  'Unnatural Appetite':
    'Section=skill Note="-2 Persuasion when eating habits are known"',
  'Vampire':
    'Section=feature ' +
    'Note="Has Ageless, Bite, Darkvision, Feed, Regeneration (Slow), Strength Of The Damned, Undead, and Weakness features"',
  'Vengeance':'Section=feature Note="Has Vow+ feature"',
  'Veteran Of The Dark World':
     'Section=description,feature ' +
     'Note="+4 Advances","Has an additional hindrance"',
  'Victim+':'Section=combat Note="Frequently chosen as random target"',
  'Visions':'Section=feature Note="Receives a vision 1/session"',
  'Wall Walker':
    'Section=combat ' +
    'Note="May move on vertical and inverted surfaces at half Pace"',
  'Weakness (Cold Iron)':
    'Section=combat Note="Suffers +4 damage from cold iron weapons"',
  'Weakness (Fire)':'Section=feature Note="FILL"',
  'Weakness (Salt)':'Section=feature Note="FILL"',
  'Weakness':'Section=feature Note="FILL"',
  'Werewolf':
    'Section=feature ' +
    'Note="Has Bite/Claws, Cannot Speak, Ferocity, Infravision, Regeneration (Slow), Speed, Transformation, and Weakness features"',
  'Wing Strike':
    'Section=combat ' +
    'Note="Wings inflict d%{strength}+d8; 5\\" charge inflicts an additional +4/+2 Toughness when wings extended (Called Shot-2 neg)"',
  'Wings':
    'Section=combat Note="Fly Pace %{edges.Wings>2?48:edges.Wings>1?24:12}"',
  'Zombie Master':'Section=feature Note="FILL"'
};
SWADEHC.FEATURES = Object.assign({}, SWADE.FEATURES, SWADEHC.FEATURES_ADDED);
SWADEHC.HINDRANCES_ADDED = {
  'Amorous':'Severity=Minor',
  'Bleeder+':'Severity=Major',
  'Blunderer+':'Severity=Major',
  'Bullet Magnet':'Severity=Minor',
  'Bully':'Severity=Minor',
  'Bully+':'Severity=Major',
  'Corruption+':'Require="powerCount > 0" Severity=Major',
  'Cursed+':'Severity=Major',
  'Doomed+':'Severity=Major',
  'Dread':'Severity=Minor',
  'Heavy Sleeper':'Severity=Minor',
  'Jumpy':'Severity=Minor',
  'Material Components+':'Require="powerCount > 0" Severity=Major',
  'Night Terrors+':'Severity=Major',
  'Screamer':'Severity=Minor',
  'Screamer+':'Severity=Major',
  'Superstitious':'Severity=Minor',
  'Unnatural Appetite':'Severity=Minor',
  'Victim+':'Severity=Major'
};
SWADEHC.HINDRANCES =
  Object.assign({}, SWADE.HINDRANCES, SWADEHC.HINDRANCES_ADDED);
SWADEHC.POWERS_ADDED = {
  // FILL
};
SWADEHC.POWERS = Object.assign({}, SWADE.POWERS, SWADEHC.POWERS_ADDED);
SWADEHC.RACES = Object.assign({}, SWADE.RACES);
SWADEHC.SHIELDS = {
  // FILL
};
SWADEHC.SKILLS_ADDED = {
  'Alchemy':'Attribute=smarts'
};
SWADEHC.SKILLS = Object.assign({}, SWADE.SKILLS, SWADEHC.SKILLS_ADDED);
SWADEHC.WEAPONS_ADDED = {
};
SWADEHC.WEAPONS = Object.assign({}, SWADE.WEAPONS, SWADEHC.WEAPONS_ADDED);

/* Defines rules related to powers. */
SWADEHC.arcaneRules = function(rules, arcanas, powers) {
  SWADE.arcaneRules(rules, arcanas, powers);
  // No changes needed to the rules defined by base method
};

/* Defines the rules related to character attributes and description. */
SWADEHC.attributeRules = function(rules) {
  SWADE.attributeRules(rules);
  // No changes needed to the rules defined by base method
};

/* Defines the rules related to combat. */
SWADEHC.combatRules = function(rules, armors, shields, weapons) {
  SWADE.combatRules(rules, armors, shields, weapons);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to basic character identity. */
SWADEHC.identityRules = function(rules, races, concepts) {
  SWADE.identityRules(rules, races, {}, concepts);
};

/* Defines rules related to character aptitudes. */
SWADEHC.talentRules = function(
  rules, edges, features, goodies, hindrances, skills
) {
  SWADE.talentRules
    (rules, edges, features, goodies, hindrances, skills);
  // No changes needed to the rules defined by base method
};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
SWADEHC.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Arcana')
    SWADEHC.arcanaRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValueArray(attrs, 'Powers')
    );
  else if(type == 'Armor')
    SWADEHC.armorRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Area'),
      QuilvynUtils.getAttrValue(attrs, 'Armor'),
      QuilvynUtils.getAttrValue(attrs, 'MinStr'),
      QuilvynUtils.getAttrValue(attrs, 'Weight')
    );
  else if(type == 'Concept')
    SWADEHC.conceptRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Edge'),
      QuilvynUtils.getAttrValueArray(attrs, 'Skill')
    );
  else if(type == 'Edge') {
    SWADEHC.edgeRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValueArray(attrs, 'Type')
    );
    SWADEHC.edgeRulesExtra(rules, name);
  } else if(type == 'Feature')
    SWADEHC.featureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Goody')
    SWADEHC.goodyRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Pattern'),
      QuilvynUtils.getAttrValue(attrs, 'Effect'),
      QuilvynUtils.getAttrValue(attrs, 'Value'),
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Hindrance') {
    SWADEHC.hindranceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'Severity')
    );
    SWADEHC.hindranceRulesExtra(rules, name);
  } else if(type == 'Power')
    SWADEHC.powerRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Advances'),
      QuilvynUtils.getAttrValue(attrs, 'PowerPoints'),
      QuilvynUtils.getAttrValue(attrs, 'Range'),
      QuilvynUtils.getAttrValue(attrs, 'Description'),
      QuilvynUtils.getAttrValue(attrs, 'School'),
      QuilvynUtils.getAttrValueArray(attrs, 'Modifier')
    );
  else if(type == 'Race') {
    SWADEHC.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Abilities')
    );
    SWADEHC.raceRulesExtra(rules, name);
  } else if(type == 'Shield')
    SWADEHC.shieldRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Parry'),
      QuilvynUtils.getAttrValue(attrs, 'Cover'),
      QuilvynUtils.getAttrValue(attrs, 'MinStr'),
      QuilvynUtils.getAttrValue(attrs, 'Weight')
    );
  else if(type == 'Skill')
    SWADEHC.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Attribute'),
      QuilvynUtils.getAttrValue(attrs, 'Core')
    );
  else if(type == 'Weapon')
    SWADEHC.weaponRules(rules, name,
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
  type =
    type.charAt(0).toLowerCase() + type.substring(1).replaceAll(' ', '') + 's';
  rules.addChoice(type, name, attrs);
};

/*
 * Defines in #rules# the rules associated with arcane power source #name#,
 * which draws on skill #skill# when casting and allows access to the list of
 * powers #powers#.
 */
SWADEHC.arcanaRules = function(rules, name, skill, powers) {
  SWADE.arcanaRules(rules, name, skill);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with armor #name#, which covers the
 * body areas listed in #areas#, adds #armor# to the character's Toughness,
 * requires a strength of #minStr# to use effectively, and weighs #weight#.
 */
SWADEHC.armorRules = function(rules, name, areas, armor, minStr, weight) {
  SWADE.armorRules
    (rules, name, ['Medieval'], areas, armor, minStr, weight);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with concept #name#. #attributes#,
 * #edges#, and #skills# list the names of attributes, edges, and skills
 * associated with the concept.
 */
SWADEHC.conceptRules = function(rules, name, attributes, edges, skills) {
  SWADE.conceptRules(rules, name, attributes, edges, skills); 
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with edge #name#. #require# and
 * #implies# list any hard and soft prerequisites for the edge, and #types#
 * lists the categories of the edge.
 */
SWADEHC.edgeRules = function(rules, name, requires, implies, types) {
  SWADE.edgeRules(rules, name, requires, implies, types);
  if(types[0] == 'Monstrous' &&
     requires.length == 1 &&
     requires[0].includes('monstrousTypeCount'))
    rules.defineRule('monstrousTypeCount', 'edges.' + name, '+=', '1');
};

/*
 * Defines in #rules# the rules associated with edge #name# that cannot be
 * derived directly from the attributes passed to edgeRules.
 */
SWADEHC.edgeRulesExtra = function(rules, name) {
  let monstrousFeatures = [];
  if(name == 'Angel') {
    monstrousFeatures = [
      'Ageless', 'Beautify', 'Divine Might', 'Faith', 'Flight',
      'Immune To Disease And Poison', 'Servant Of Heaven'
    ];
    rules.defineRule('features.Vow+', 'featureNotes.servantOfHeaven', '=', '1');
    rules.defineRule('combatNotes.flight',
      'features.Angel', '=', '12',
      'features.Speed (Angel)', '+', 'source==1 ? 12 : 36',
      'combatNotes.speed(Angel)', '+', 'null'
    );
  } else if(name == 'Demon') {
    monstrousFeatures = [
      'Ageless', 'Bespoil', 'Darkvision', 'Deal Maker', 'Doesn\'t Breathe',
      'Environmental Resistance (Cold, Electricity, Heat)',
      'Immune To Disease And Poison', 'Infernal Stamina', 'Spirited',
      'Weakness (Cold Iron)'
    ];
    let allNotes = rules.getChoices('notes');
    if(allNotes && 'weapons.Bite' in allNotes)
      allNotes['weapons.Bite'] =
        allNotes['weapons.Bite'].replace(')', '%{edges.Bite>1 ? \' AP 2\':\'\'})');
    if(allNotes && 'weapons.Claws' in allNotes)
      allNotes['weapons.Claws'] =
        allNotes['weapons.Claws'].replace(')', '%{edges.Claws>1 ? \' AP 2\':\'\'})');
    rules.defineRule('damageStep.Bite', 'edges.Bite', '^=', '2');
    rules.defineRule
      ('damageStep.Claws', 'edges.Claws', '^=', 'source>1 ? 2 : null');
  } else if(name == 'Demon')
    monstrousFeatures = [
      'Ageless', 'Slow', 'The Strenth Of Ages', 'Undead', 'Weakness (Fire)'
    ];
  else if(name == 'Patchwork Monster')
    monstrousFeatures = [
      'Ageless', 'Berserk', "Death's Haze", 'Fire Bad!', 'Parts', 'Science!',
      'Undead', 'Weakness (Fire)', 'Phobia+'
    ];
  else if(name == 'Phantom')
    monstrousFeatures = [
      'Ageless', 'Darkvision', "Doesn't Breathe", 'Ethereal', 'Flight',
      'Immune To Disease And Poison', 'Strong Spirit', 'Weakness (Salt)'
    ];
  else if(name == 'Revenant') {
    monstrousFeatures = [
      'Ageless', 'Hardy', 'Regeneration (Slow)', 'Strength Of The Dead',
      'Undead', 'Vengeance'
    ];
    rules.defineRule('features.Vow+', 'featureNotes.vengeance', '=', '1');
  } else if(name == 'Vampire')
    monstrousFeatures = [
      'Ageless', 'Bite', 'Darkvision', 'Feed', 'Regeneration (Slow)',
      'Strength Of The Damned', 'Undead', 'Weakness'
    ];
  else if(name == 'Werewolf')
    monstrousFeatures = [
      'Bite/Claws', 'Cannot Speak', 'Ferocity', 'Infravision',
      'Regeneration (Slow)', 'Speed', 'Transformation', 'Weakness'
    ];
  let note =
    'featureNotes.' + name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  monstrousFeatures.forEach(f => {
    rules.defineRule('features.' + f, note, '=', '1');
  });
  if(SWADE.edgeRulesExtra)
    SWADE.edgeRulesExtra(rules, name);
};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
SWADEHC.featureRules = function(rules, name, sections, notes) {
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
SWADEHC.goodyRules = function(
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
SWADEHC.hindranceRules = function(rules, name, requires, severity) {
  SWADE.hindranceRules(rules, name, requires, severity);
  // No changes needed to the rules defined by base method
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

/*
 * Defines in #rules# the rules associated with power #name#, which may be
 * acquired only after #advances# advances, requires #powerPoints# Power Points
 * to use, and can be cast at range #range#. #description# is a concise
 * description of the power's effects and #school#, if defined, is the magic
 * school that defines the power.
 */
SWADEHC.powerRules = function(
  rules, name, advances, powerPoints, range, description, school, modifiers
) {
  SWADE.powerRules
    (rules, name, advances, powerPoints, range, description, school, modifiers);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with race #name#, which has the
 * list of hard prerequisites #requires#. #abilities# list associated abilities.
 */
SWADEHC.raceRules = function(rules, name, requires, abilities) {
  SWADE.raceRules(rules, name, requires, abilities);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
SWADEHC.raceRulesExtra = function(rules, name) {
  if(SWADE.raceRulesExtra)
    SWADE.raceRulesExtra(rules, name);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with shield #name#, which adds
 * #parry# to the character's Parry, provides #cover# cover, requires #minStr#
 * to handle, and weighs #weight#.
 */
SWADEHC.shieldRules = function(rules, name, parry, cover, minStr, weight) {
  SWADE.shieldRules
    (rules, name, ['Medieval'], parry, cover, minStr, weight);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * #attribute# (one of 'agility', 'spirit', etc.).
 */
SWADEHC.skillRules = function(rules, name, attribute, core) {
  SWADE.skillRules(rules, name, ['Medieval'], attribute, core);
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
SWADEHC.weaponRules = function(
  rules, name, damage, minStr, weight, category, armorPiercing, range,
  rateOfFire, parry
) {
  SWADE.weaponRules(
    rules, name, ['Medieval'], damage, minStr, weight, category, armorPiercing,
    range, rateOfFire, parry
  );
};

/*
 * Returns the list of editing elements needed by #choiceRules# to add a #type#
 * item to #rules#.
 */
SWADEHC.choiceEditorElements = function(rules, type) {
  return SWADE.choiceEditorElements(rules, type == 'Ancestry' ? 'Race' : type);
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
SWADEHC.randomizeOneAttribute = function(attributes, attribute) {
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
  return SWADE.randomizeOneAttribute.apply(this, [attributes, attribute]);
};

/* Returns an array of plugins upon which this one depends. */
SWADEHC.getPlugins = function() {
  var result = [SWADE].concat(SWADE.getPlugins());
  return result;
};

/* Returns HTML body content for user notes associated with this rule set. */
SWADEHC.ruleNotes = function() {
  return '' +
    '<h2>SWADE Fantasy Companion Quilvyn Module Notes</h2>\n' +
    'SWADE Fantasy Companion Quilvyn Module Version ' + SWADEHC.VERSION + '\n' +
    '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '  Quilvyn assumes that the skills Driving, Electronics, Hacking, and ' +
    "  Piloting are not meaningful in a fantasy setting, and so doesn't " +
    '  include them in the SWADEHC list of skills. You can add any of these ' +
    '  as homebrew choices if they are appropriate to your game.\n' +
    '  </li><li>\n' +
    '  The SWADEHC plugin supports all the same homebrew choices as the SWADE' +
    '  plugin, the one difference being that SWADE Races are called ' +
    '  Ancestries in SWADEHC. See the <a href="plugins/homebrew-swade.html">' +
    '  SWADE Homebrew documentation</a> for details.\n' +
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
    'Savage Worlds Adventure Edition Fantasy Companion ' +
    '© 2022 Pinnacle Entertainment Group.\n' +
    '</p>\n' +
    '<img alt="Savage Worlds Fan Logo" width="300" height="200" src="https://peginc.com/wp-content/uploads/2019/01/SW_LOGO_FP_2018.png"/>\n';
};
