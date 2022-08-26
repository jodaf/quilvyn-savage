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
  'Bard':
    'Skill=Performance ' +
    'Powers=' +
      '"Arcane Protection",Banish,"Beast Friend","Boost/Lower Trait",' +
      'Confusion,Deflection,"Detect/Conceal Arcana","Conjure Item",Dispel,' +
      'Divination,"Drain Power Points",Empathy,Fear,Healing,Illusion,' +
      '"Mind Link","Mind Reading","Object Reading",Puppet,Sloth/Speed,' +
      'Slumber,Sound/Silence,"Speak Language",Stun,"Summon Ally",Teleport,' +
      '"Warrior\'s Gift"',
  'Cleric':
    'Skill=Faith ' +
    'Powers=' +
      'Banish,"Boost/Lower Trait","Conjure Item",Darksight,Dispel,Divination,' +
      'Empathy,Healing,Light/Darkness,Relief,Resurrection,Sanctuary,Slumber,' +
      'Smite,Sound/Silence',
  'Druid':
    'Skill=Faith ' +
    'Powers=' +
      'Banish,"Boost/Lower Trait","Conjure Item",Darksight,Dispel,Divination,' +
      'Empathy,Healing,Light/Darkness,Relief,Resurrection,Sanctuary,Slumber,' +
      'Smite,Sound/Silence,"Baleful Polymorph",Barrier,"Beast Friend",Burst,' +
      '"Elemental Manipulation",Protection,"Shape Change","Summon Ally",' +
      '"Wall Walker"',
  'Sorcerer':
    'Skill=Spellcasting ' +
    'Powers=' +
      '"Arcane Protection","Baleful Polymorph",Banish,Barrier,"Beast Friend",' +
      'Blast,Blind,Bolt,"Boost/Lower Trait",Burrow,Burst,Confusion,' +
      '"Conjure Item",Curse,"Damage Field",Darksight,Deflection,' +
      '"Detect/Conceal Arcana",Disguise,Dispel,Divination,' +
      '"Drain Power Points","Elemental Manipulation",Empathy,Entangle,' +
      '"Environmental Protection",Farsight,Fear,Fly,Growth/Shrink,Havoc,' +
      'Illusion,Intangibility,Invisibility,Light/Darkness,Locate,"Mind Link",' +
      '"Mind Reading","Mind Wipe","Object Reading","Planar Binding",' +
      '"Plane Shift",Protection,Puppet,Scrying,"Shape Change",Sloth/Speed,' +
      'Slumber,Smite,Sound/Silence,"Speak Language",Stun,"Summon Ally",' +
      'Telekinesis,Teleport,"Time Stop","Wall Walker","Warrior\'s Gift",Wish,' +
      'Zombie',
  'Wizard':
    'Skill=Spellcasting ' +
    'Powers=' +
      '"Arcane Protection","Baleful Polymorph",Banish,Barrier,"Beast Friend",' +
      'Blast,Blind,Bolt,"Boost/Lower Trait",Burrow,Burst,Confusion,' +
      '"Conjure Item",Curse,"Damage Field",Darksight,Deflection,' +
      '"Detect/Conceal Arcana",Disguise,Dispel,Divination,' +
      '"Drain Power Points","Elemental Manipulation",Empathy,Entangle,' +
      '"Environmental Protection",Farsight,Fear,Fly,Growth/Shrink,Havoc,' +
      'Illusion,Intangibility,Invisibility,Light/Darkness,Locate,"Mind Link",' +
      '"Mind Reading","Mind Wipe","Object Reading","Planar Binding",' +
      '"Plane Shift",Protection,Puppet,Scrying,"Shape Change",Sloth/Speed,' +
      'Slumber,Smite,Sound/Silence,"Speak Language",Stun,"Summon Ally",' +
      'Telekinesis,Teleport,"Time Stop","Wall Walker","Warrior\'s Gift",Wish,' +
      'Zombie'
};
PF4SW.ARMORS = {
  'None':'Area=Body Armor=0 MinStr=4 Weight=0'
};
PF4SW.CONCEPTS_ADDED = {
  'Barbarian':
    'Edge=Barbarian ' +
    'Attribute=Strength,Vigor ' +
    'Skill=Fighting',
  'Bard':
    'Edge=Bard ' +
    'Attribute=Spirit ' +
    'Skill="Common Knowledge",Performance',
  'Cleric':
    'Edge=Cleric ' +
    'Attribute=Spirit ' +
    'Skill=Occult',
  'Druid':
    'Edge=Druid ' +
    'Attribute=Spirit ' +
    'Skill=Survival',
  'Fighter':
    'Edge=Fighter ' +
    'Attribute=Strength ' +
    'Skill=Fighting',
  'Monk':
    'Edge=Monk ' +
    'Attribute=Agility,Spirit ' +
    'Skill=Fighting',
  'Paladin':
    'Edge="Paladin" ' +
    'Attribute=Spirit,Strength',
  'Ranger':
    'Edge=Ranger ' +
    'Skill=Athletics,Fighting,Shooting,Survival',
  'Rogue':
    'Edge=Rogue ' +
    'Attribute=Agility ' +
    'Skill=Notice,Stealth,Thievery',
  'Sorcerer':
    'Edge=Sorcerer ' +
    'Attribute=Smarts,Spirit ' +
    'Skill=Fighting',
  'Wizard':
    'Edge=Wizard ' +
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
  'Abadar':'Alignment=Neutral Domain=Earth,Nobility,Protection,Travel',
  'Asmodeus':'Alignment=Evil Domain=Evil,Fire,Magic,Trickery',
  'Calistria':'Alignment=Neutral Domain=Knowledge,Luck,Trickery',
  'Cayden Cailean':'Alignment=Good Domain=Good,Strength,Travel',
  'Desna':'Alignment=Good Domain=Good,Luck,Travel',
  'Erastil':'Alignment=Good Domain=Animal,Community,Good,Plant',
  'Gorum':'Alignment=Neutral Domain=Destruction,Glory,Strength,War',
  'Gozreh':'Alignment=Neutral Domain=Air,Animal,Plant,Water,Weather',
  'Iomedae':'Alignment=Good Domain=Glory,Good,Sun,War',
  'Irori':'Alignment=Neutral Domain=Healing,Knowledge,Run,Strength',
  'Lamashtu':'Alignment=Evil Domain=Evil,Madness,Strength,Trickery',
  'Nethys':
    'Alignment=Neutral Domain=Destruction,Knowledge,Magic,Protection,Rune',
  'None':'',
  'Norgorber':'Alignment=Evil Domain=Death,Evil,Knowledge,Trickery',
  'Pharasma':'Alignment=Neutral Domain=Death,Healing,Knowledge,Water',
  'Rovagug':'Alignment=Evil Domain=Destruction,Evil,War,Weather',
  'Sarenrae':'Alignment=Good Domain=Fire,Glory,Good,Healing,Sun',
  'Shelyn':'Alignment=Good Domain=Air,Good,Luck,Protection',
  'Torag':'Alignment=Good Domain=Earth,Good,Protection',
  'Urgathoa':'Alignment=Evil Domain=Death,Evil,Magic,Strength,War',
  'Zon-Kuthon':'Alignment=Evil Domain=Death,Destruction,Evil'
};
PF4SW.EDGES_ADDED = {
  // Class
  'Barbarian':'Type=class Require="strength >= 6","vigor >= 6"',
  'Powerful Blow':
    'Type=class,Barbarian Require="advances >= 4",features.Barbarian',
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
  'Mystic Powers (Ranger)':'Type=class Require="advances >= 8",features.Ranger',
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
  'Troubadour':
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
  'Angel Of Death':'Section=combat Note="May disintegrate slain victim 1/dy"',
  'Arcane Background (Bard)':
    'Section=arcana Note="3 Powers/10 Power Points"',
  'Arcane Background (Cleric)':
    'Section=arcana Note="3 Powers/10 Power Points"',
  'Arcane Background (Druid)':
    'Section=arcana Note="3 Powers/10 Power Points"',
  'Arcane Background (Sorcerer)':
    'Section=arcana Note="2 Powers/15 Power Points"',
  'Arcane Background (Wizard)':
    'Section=arcana Note="3 Powers/10 Power Points"',
  'Advanced Bloodline':'Section=feature Note="FILL"',
  'Arcane Archer':
    'Section=feature Note="Has Enhance Arrow and Arrow Trapping features"',
  'Arcane Archer II':
    'Section=feature ' +
    'Note="May use Phase Arrow and Hail Of Arrows features 1/encounter"',
  'Arcane Archer III':
    'Section=feature ' +
    'Note="May use Imbue Arrow feature 1/tn and Death Arrow feature 1/dy"',
  'Arcane Armor':'Section=arcana Note="May cast in armor"',
  'Arcane Mastery':'Section=feature Note="FILL"',
  'Arcane Trickster':
    'Section=feature ' +
    'Note="Has Ranged Legerdemain and Impromptu Attack features"',
  'Arcane Trickster II':
    'Section=feature Note="May use Invisible Thief feature 1/dy"',
  'Arcane Trickster III':'Section=feature Note="Has Surprise Spells feature"',
  'Armor Restriction (Medium)':
    'Section=attribute,skill ' +
    'Note="-4 Ability (heavy armor or shield)",' +
         '"-4 Ability-based skills (heavy armor or shield)"',
  'Arrow Trapping':'Section=combat Note="Arrows have environmental trapping"',
  'Assassin':'Section=feature Note="Gains Death Attack feature"',
  'Assassin II':
    'Section=feature ' +
    'Note="Gains Hide In Plain Sight and Resistance To Poison features"',
  'Assassin III':
    'Section=feature Note="Gains Angel Of Death and Swift Death features"',
  'Aura Of Courage':'Section=arcana Note="R10\\" Allies +1 vs. Fear"',
  'Barbarian':
    'Section=feature ' +
    'Note="Has Armor Restriction (Medium), Fast, and Rage features"',
  'Bard':
    'Section=feature ' +
    'Note="Has Arcane Background (Bard) and Sharp Tongued feature"',
  'Born In The Saddle':
    'Section=skill Note="Free reroll on Riding; +2 mount pace, +1 mount run"',
  'Breath Weapon':'Section=combat Note="9\\" cone inflicts 3d6 damage"',
  'Call Down The Legends':
    'Section=combat Note="May summon shadowy allies for 1 hr"',
  'Cleric':'Section=feature Note="Has Arcane Background (Cleric)"',
  'Combined Spells':'Section=arcana Note="May cast two spells simultaneously"',
  'Countersong':
    'Section=combat ' +
    'Note="R5\\" Allies gain reroll to resist and recover from spells"',
  'Crippling Strike':
    'Section=combat ' +
    'Note="Successful attack reduces foe Pace by 2 until healed"',
  'Deadly Blow':'Section=feature Note="+1 combat damage"',
  'Death Arrow':
    'Section=combat Note="Successful arrow attack kills (Vigor neg)"',
  'Death Attack':
    'Section=combat ' +
    'Note="Wounding attack with the Drop kills (Vigor neg), incapacitating attack is silent"',
  'Deflect Arrows':'Section=combat Note="Foes -2 on ranged attacks"',
  'Destroy Undead':
    'Section=combat ' +
    'Note="R3\\" May spend 2 PP to inflict Wound on all undead (Spirit neg)"',
  'Detect Evil':
    'Section=arcana ' +
    'Note="R%{smarts}\\" Detect evil creature or object at will"',
  'Dirge Of Doom':
    'Section=arcana Note="R10\\" May inflict -2 on foe Soak or Trait reroll"',
  'Divine Mastery':'Section=feature Note="FILL"',
  'Dragon Disciple':
    'Section=feature Note="May use Breath Weapon feature 1/encounter"',
  'Dragon Disciple II':'Section=feature Note="May use Wings feature"',
  'Dragon Disciple III':
    'Section=feature Note="May use Dragon Form feature 2/dy"',
  'Dragon Form':
    'Section=attribute,combat ' +
    'Note="Size 3, Strength d12, Vigor d10",' +
         '"Bite and Claw attack does d%{strength}+d8, AP 2"',
  'Druid':'Section=feature Note="Has Arcane Background (Druid)"',
  'Duelist':'Section=feature Note="Has Surgical Strike and Parry features"',
  'Duelist II':'Section=feature Note="Has Crippling Strike feature"',
  'Duelist III':'Section=feature Note="Has Deflect Arrows feature"',
  'Eldritch Inspiration':
    'Section=arcana Note="May spend Benny to cast spell from spellbook"',
  'Eldritch Knight':'Section=feature Note="Has Eldritch Recharge feature"',
  'Eldritch Knight II':'Section=feature Note="Has Eldritch Strike feature"',
  'Eldritch Knight III':
    'Section=feature Note="Has Eldritch Strike (Improved) feature"',
  'Eldritch Recharge':'Section=arcana Note="Raise on attack restores 1 PP"',
  'Eldritch Strike':'Section=arcana Note="May spend 2 PP for +2 attack"',
  'Eldritch Strike (Improved)':
    'Section=arcana Note="May spend 2 PP for +2 damage"',
  'Enhance Arrow':'Section=combat Note="+1 attack and damage with arrows"',
  'Enraged':
    'Section=feature ' +
    'Note="Ignores 2 points of wound penalties and all fatigue"',
  'Epic Tales':
    'Section=feature Note="Allies hearing story gain 1 Benny during rest"',
  'Fast':'Section=combat Note="+2 Pace"',
  'Favored Powers (Cleric)':
    'Section=arcana ' +
    'Note="May ignore two points of penalties when casting <i>Healing</i>, <i>Sanctuary</i>, or <i>Smite</i>"',
  'Favored Powers (Druid)':
    'Section=arcana ' +
    'Note="May ignore two points of penalties when casting <i>Entangle</i>, <i>Protection</i>, or <i>Smite</i>"',
  'Favored Powers (Sorcerer)':
    'Section=arcana ' +
    'Note="May ignore two points of penalties when casting <i>Bolt</i>, <i>Elemental Manipulation</i>, or <i>Protection</i>"',
  'Favored Powers (Wizard)':
    'Section=arcana ' +
    'Note="May ignore two points of penalties when casting <i>Arcane Protection</i>, <i>Deflection</i>, or <i>Dispel</i>"',
  'Favored Enemy':
    'Section=combat,skill ' +
    'Note="May reroll failed attacks against chosen creature type",' +
         '"May reroll failed Survival to track chosen creature type"',
  'Favored Terrain':
    'Section=combat Note="Gains additional Action Card in chosen terrain"',
  'Fighter':'Section=feature Note="Has Martial Flexibility feature"',
  'Fix It':SWADE.FEATURES['Mister Fix It'],
  'Formation Fighter':'Section=combat Note="+1 Gang Up bonus (+4 max)"',
  'Fury':
    'Section=combat ' +
    'Note="+1 Strength step; every attack must be a wild attack"',
  'Great Ki':
    'Section=arcana ' +
    'Note="May cast <i>Boost Trait</i>, <i>Protection</i>, <i>Wall Walker</i>, and <i>Warrior\'s Gift</i>"',
  'Greater Darkvision':
    'Section=feature Note="R20\\" Sees clearly in pitch darkness"',
  'Greater Lore':'Section=arcana Note="+2 Power Count"',
  'Hail Of Arrows':'Section=combat Note="Fired arrow effects 3\\" radius"',
  'Hide In Plain Sight':
    'Section=arcana Note="May become invisible at will when immobile"',
  'Imbue Arrow':'Section=arcana Note="Cast spell via arrow"',
  'Impromptu Attack':
    'Section=combat Note="May use Sneak Attack vs. non-Vulnerable foe"',
  'Improved Rapid Shot':SWADE.FEATURES['Improved Rapid Fire'],
  'Inspire Heroics':
    'Section=feature ' +
    'Note="R%{smarts}\\" May spend Benny to grant 5 Trait or damage rerolls 1/encounter"',
  'Intimidating Glare':
    'Section=combat ' +
    'Note="May take free Intimidation action when Action card is jack or better"',
  'Invisible Thief':
    'Section=arcana Note="Spend 1 PP to cast <i>Invisibility</i> with a raise"',
  'Lore':
    'Section=skill ' +
    'Note="May reroll Academics, Common Knowledge, Occult, and Science"',
  'Loremaster':'Section=feature Note="Has Lore feature"',
  'Loremaster II':'Section=feature Note="Has Secret feature"',
  'Loremaster III':'Section=feature Note="Has Greater Lore feature"',
  'Martial Discipline':'Section=combat Note="+1 Toughness in no armor"',
  'Martial Flexibility':
    'Section=combat ' +
    'Note="May gain benefits of 1 combat edge for 5 rd 1/encounter"',
  'Martial Flexibility (Improved)':
    'Section=combat ' +
    'Note="May gain benefits of 2 combat edges for 5 rd 1/encounter"',
  'Martial Prowess':'Section=combat Note="May reroll failed combat attacks"',
  'Master Hunter':
    'Section=feature ' +
    'Note="Inflicts additional d6 damage on attacks vs. favored enemy"',
  'Mercy':
    'Section=arcana ' +
    'Note="R%{spirit}\\" Remove Distracted, Shaken, or Vulnerable from target"',
  'Mobility':'Section=combat Note="+1 Run step"',
  'Monk':
    'Section=feature ' +
    'Note="Has Martial Discipline, Mobility, Stunning Fist, and Unarmed Strike features"',
  'Mount':
    'Section=feature ' +
    'Note="Bonded mount gains two advances and may be summoned"',
  'Mystic Powers (Monk)':
    'Section=arcana ' +
    'Note="10 Power Points/May cast <i>Boost Trait</i>, <i>Deflection</i>, <i>Smite</i>, and <i>Speed</i>"',
  'Mystic Powers (Paladin)':
    'Section=arcana ' +
    'Note="10 Power Points/May cast <i>Boost Trait</i>, <i>Healing</i>, <i>Relief</i>, and <i>Smite</i>"',
  'Mystic Powers (Ranger)':
    'Section=arcana ' +
    'Note="10 Power Points/May cast <i>Beast Friend</i>, <i>Boost Trait</i>, <i>Entangle</i>, and <i>Warrior\'s Gift</i>"',
  'Mystic Powers (Shadow Force)':
    'Section=arcana ' +
    'Note="10 Power Points/May cast <i>Blast</i>, <i>Illusion</i>, <i>Summon Ally</i>, and <i>Teleport</i>"',
  'Mystic Theurge':'Section=feature Note="Has Combined Spells feature"',
  'Mystic Theurge II':'Section=feature Note="Has Spell Synergy feature"',
  'Mystic Theurge III':'Section=feature Note="Has Spell Synthesis feature"',
  'Opportunist':
    'Section=combat ' +
    'Note="Attack foe w/Extraction on Withdraw; foe w/out Extraction is Vulnerable"',
  'Paladin':
    'Section=feature ' +
    'Note="Has Aura Of Courage, Code Of Honor, Detect Evil, and Smite Evil features"',
  'Parry':'Section=combat Note="May use Defend at +6 Parry"',
  'Pathfinder Chronicler':'Section=feature Note="Has Pathfinding feature"',
  'Pathfinder Chronicler II':
    'Section=feature Note="May use Epic Tales feature 1/session"',
  'Pathfinder Chronicler III':
    'Section=feature Note="May use Call Down The Legends feature 1/wk"',
  'Pathfinding':
    'Section=feature ' +
    'Note="Increased travel speed through known locations by 10%; may make Smarts-2 to discard Enemies card"',
  'Phase Arrow':'Section=combat Note="Fire arrow through obstacles"',
  'Powerful Blow':'Section=combat Note="Wild attacks inflict +4 damage"',
  'Quarry':
    'Section=feature Note="Gains additional Favored Enemy and Favored Terrain"',
  'Rage':
    'Section=combat ' +
    'Note="Has Fury, Enraged, and Reckless Abandon features for 5 rd at will or when Shaken or Wounded (Smarts neg), afterwards fatigued until 1 hr rest"',
  'Ranger':
    'Section=feature ' +
    'Note="Has Favored Enemy, Favored Terrain, and Wilderness Stride features"',
  'Rapid Reload':
    'Section=combat Note="Reduces reload value of chosen ranged weapon by 1"',
  'Rapid Shot':SWADE.FEATURES['Rapid Fire'],
  'Ranged Legerdemain':'Section=skill Note="R5\\" Thievery at -2"',
  'Reckless Abandon':
    'Section=combat Note="Critical failure hits random target or self"',
  'Resistance To Poison':'Section=combat Note="+4 vs. poison"',
  'Rogue':'Section=feature Note="Gains Sneak Attack feature"',
  'Secret':'Section=feature Note="May use chosen feature from another class"',
  'Shadow Cloak':
    'Section=combat ' +
    'Note="Gains free Soak when wounded in dim or dark illumination"',
  'Shadowdancer':'Section=feature Note="Has Greater Darkvision feature"',
  'Shadowdancer II':'Section=feature Note="Has Shadow Cloak feature"',
  'Shadowdancer III':
    'Section=feature Note="Has Mystic Powers (Shadow Force) feature"',
  'Sharp Tongued':'Section=skill Note="May substitute Performance for Taunt"',
  'Smite Evil':
    'Section=combat ' +
    'Note="May reroll failed attacks vs. %{advances//4+1} chosen evil foes/encounter"',
  'Sneak Attack':
    'Section=combat ' +
    'Note="Gain additional d6 when attacking with the Drop or Vulnerable foe"',
  'Sorcerer':'Section=feature Note="Has Arcane Background (Sorcerer)"',
  'Spell Synergy':
    'Section=arcana ' +
    'Note="Combined Spells reduces power cost of spells to 1 PP (min 1)"',
  'Spell Synthesis':
    'Section=arcana Note="May apply class edge abilities to all spells"',
  'Strength Surge':'Section=combat Note="Rage increases Strength step by 2"',
  'Stunning Fist':
    'Section=combat ' +
    'Note="Raise on Unarmed Strike makes foe choice of Distracted or Vulnerable"',
  'Surgical Strike':
    'Section=combat Note="+2 damage with light weapons (MinStr <= d6)"',
  'Surprise Spells':
    'Section=arcana Note="May use Sneak Attack feature with attack spells"',
  'Swift Death':'Section=combat Note="May attack w/the Drop 1/dy"',
  'Trap Sense':
    'Section=feature ' +
    'Note="R5\\" Automatic Notice for traps; ignore 2 points penalty to disarm"',
  'Troubadour':
    'Section=feature ' +
    'Note="+2 Common Knowledge/May use Performance in place of Battle"',
  'Two-Weapon Fighting':SWADE.FEATURES['Two-Fisted'],
  'Unarmed Strike':
    'Section=combat Note="+1 Unarmed attacks, AP +2, damage %d{strength}+d4"',
  'Uncanny Reflexes':
    'Section=combat ' +
    'Note="No -2 penalty for normal Evasion; may use Evasion at -2 for any area effect"',
  'Wholeness Of Body':
    'Section=arcana Note="May spend 2 Power Points to make Soak roll"',
  'Wild Shape':
    'Section=arcana Note="May cast <i>Shape Change</i> at double duration"',
  'Wilderness Stride':
    'Section=attribute Note="No movement penalties for difficult ground"',
  'Wings':'Section=combat Note="Fly speed 8"',
  'Wizard':'Section=feature Note="Has Arcane Background (Wizard)"',
  // Hindrances
  'Timid+':SWADE.FEATURES['Yellow+'],
  // Races
  'Adaptability':
    'Section=attribute,feature Note="+1 Attribute Points","+1 Edge Points"',
  'Darkvision':'Section=skill Note="No illumination penalties up to 10\\""',
  'Elven Magic':'Section=combat Note="May reroll vs. powers"',
  'Flexibility':'Section=attribute Note="+1 Attribute Points"',
  'Gnome Magic':
    'Section=arcana ' +
    'Note="Know <i>Beast Friend</i>, <i>Light</i>, <i>Sound</i>, and <i>Telkinesis</i>/1 Power Point"',
  'Intelligence':'Section=attribute Note="+1 Smarts step"',
  'Intimidating':'Section=skill Note="+1 Intimidation step"',
  'Iron Constitution':'Section=combat Note="+1 vs. poison/+1 vs. powers"',
  'Lucky':'Section=feature Note="+1 Benny each session"',
  'Obsessive':
    'Section=skill Note="+1 Skill Point (d4 in choice of Smarts skill)"',
  'Orc Ferocity':'Section=combat Note="+1 Toughness"',
  'Slender':'Section=attribute,combat Note="-1 Vigor","-1 Toughness"',
  'Stonecunning':
    'Section=skill ' +
    'Note="Automatic Notice+2 to note unusual stonework within 10\'"',
  'Sure-Footed':'Section=skill Note="+1 Athletics step"',
  'Stout':
    'Section=attribute Note="+1 Strength step (encumbrance and equipment use)"',
  'Tough':'Section=attribute Note="+1 Vigor step"',
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
  'Baleful Polymorph':
    'Advances=8 ' +
    'PowerPoints=3+2/size ' +
    'Range=smarts ' +
    'Description=' +
      '"Target becomes chosen animal for 5 rd (Spirit neg, Spirt-2 ends early)"',
  'Conjure Item':
    'Advances=0 ' +
    'PowerPoints=2/lb ' +
    'Range=smarts ' +
    'Description=' +
      '"Creates mundane item that lasts 1 hr"',
  'Curse':
    'Advances=4 ' +
    'PowerPoints=5 ' +
    'Range=touch ' +
    'Description=' +
      '"Target suffers 1 level fatigue and additional level each sunset (Spirit neg)"',
  'Locate':
    'Advances=0 ' +
    'PowerPoints=3 ' +
    'Range=self ' +
    'Description=' +
      '"Gives direction of chosen item (-2 if caster has never seen item, running water blocks spell)"',
  'Planar Binding':
    'Advances=8 ' +
    'PowerPoints=8 ' +
    'Range=smarts ' +
    'Description=' +
      '"Summons and traps extraplanar creature to perform service (Spirit neg)"',
  'Plane Shift':
    'Advances=8 ' +
    'PowerPoints=4 ' +
    'Range=smarts ' +
    'Description=' +
      '"Self travels to chosen plane, w/in 10d10 miles of known location"',
  'Sanctuary':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=touch ' +
    'Description=' +
      '"Evil creatures cannot attack target (Spirit neg) for 5 rd"',
  'Scrying':
    'Advances=4 ' +
    'PowerPoints=3 ' +
    'Range=self ' +
    'Description=' +
      '"Self sees chosen target (-2 unfamiliar target, Spirit neg) for 5 rd"',
  'Time Stop':
    'Advances=12 ' +
    'PowerPoints=8 ' +
    'Range=self ' +
    'Description=' +
      '"Self gains additional turn"',
  'Wish':
    'Advances=16 ' +
    'PowerPoints=20 ' +
    'Range=smarts ' +
    'Description=' +
      '"Target can alter reality in exchange for self permanently losing 3 PP"'
};
PF4SW.POWERS = Object.assign({}, SWADE.POWERS, PF4SW.POWERS_ADDED);
PF4SW.RACES = {
  'Dwarf':
    'Features=' +
      'Darkvision,"Iron Constitution","Reduced Pace",Stonecunning,Stout,Tough '+
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
  // TODO deities have attributes that are unsupported by SWADE
  SWADE.identityRules(rules, races, {}, concepts, {});
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
  if(name == 'Assassin') {
    rules.defineRule
      ('features.Death Attack', 'featureNotes.assassin', '=', '1');
  } else if(name == 'Assassin II') {
    rules.defineRule
      ('features.Hide In Plain Sight', 'featureNotes.assassinII', '=', '1');
    rules.defineRule
      ('features.Resistance To Poison', 'featureNotes.assassinII', '=', '1');
  } else if(name == 'Assassin III') {
    rules.defineRule
      ('features.Angel Of Death', 'featureNotes.assassinIII', '=', '1');
    rules.defineRule
      ('features.Swift Death', 'featureNotes.assassinIII', '=', '1');
  } else if(name == 'Barbarian') {
    rules.defineRule('features.Armor Restriction (Medium)',
      'featureNotes.barbarian', '=', '1'
    );
    rules.defineRule('features.Fast', 'featureNotes.barbarian', '=', '1');
    rules.defineRule('features.Rage', 'featureNotes.barbarian', '=', '1');
  } else if(name == 'Arcane Archer') {
    rules.defineRule
      ('features.Enhance Arrows', 'featureNotes.arcaneArcher', '=', '1');
    rules.defineRule
      ('features.Arrow Trapping', 'featureNotes.arcaneArcher', '=', '1');
  } else if(name == 'Arcane Archer II') {
    rules.defineRule
      ('features.Hail Of Arrows', 'featureNotes.arcaneArcherII', '=', '1');
    rules.defineRule
      ('features.Phase Arrow', 'featureNotes.arcaneArcherII', '=', '1');
  } else if(name == 'Arcane Archer III') {
    rules.defineRule
      ('features.Imbue Arrow', 'featureNotes.arcaneArcherIII', '=', '1');
    rules.defineRule
      ('features.Death Arrow', 'featureNotes.arcaneArcherIII', '=', '1');
  } else if(name == 'Arcane Trickster') {
    rules.defineRule
      ('features.Impromptu Attack', 'featureNotes.arcaneTrickster', '=', '1');
    rules.defineRule
      ('features.Ranged Legerdemain', 'featureNotes.arcaneTrickster', '=', '1');
  } else if(name == 'Arcane Trickster II') {
    rules.defineRule
      ('features.Invisible Thief', 'featureNotes.arcaneTricksterII', '=', '1');
  } else if(name == 'Arcane Trickster III') {
    rules.defineRule
      ('features.Surprise Spells', 'featureNotes.arcaneTricksterIII', '=', '1');
  } else if(name == 'Bard') {
    rules.defineRule
      ('features.Arcane Background (Bard)', 'featureNotes.bard', '=', '1');
    rules.defineRule('features.Sharp Tongued', 'featureNotes.bard', '=', '1');
  } else if(name == 'Cleric') {
    rules.defineRule
      ('features.Arcane Background (Cleric)', 'featureNotes.cleric', '=', '1');
  } else if(name == 'Dragon Disciple') {
    rules.defineRule
      ('features.Breath Weapon', 'featureNotes.dragonDisciple', '=', '1');
  } else if(name == 'Dragon Disciple II') {
    rules.defineRule
      ('features.Wings', 'featureNotes.dragonDiscipleII', '=', '1');
  } else if(name == 'Dragon Disciple III') {
    rules.defineRule
      ('features.Dragon Form', 'featureNotes.dragonDiscipleIII', '=', '1');
  } else if(name == 'Druid') {
    rules.defineRule
      ('features.Arcane Background (Druid)', 'featureNotes.druid', '=', '1');
  } else if(name == 'Duelist') {
    rules.defineRule
      ('features.Surgical Strike', 'featureNotes.duelist', '=', '1');
    rules.defineRule('features.Parry', 'featureNotes.duelist', '=', '1');
  } else if(name == 'Duelist II') {
    rules.defineRule
      ('features.Crippling Strike', 'featureNotes.duelistII', '=', '1');
  } else if(name == 'Duelist III') {
    rules.defineRule
      ('features.Deflect Arrows', 'featureNotes.duelistII', '=', '1');
  } else if(name == 'Eldritch Knight') {
    rules.defineRule
      ('features.Eldritch Recharge', 'featureNotes.eldritchKnight', '=', '1');
  } else if(name == 'Eldritch Knight II') {
    rules.defineRule
      ('features.Eldritch Strike', 'featureNotes.eldritchKnightII', '=', '1');
  } else if(name == 'Eldritch Knight III') {
    rules.defineRule('features.Eldritch Strike (Improved)',
      'featureNotes.eldritchKnightIII', '=', '1'
    );
  } else if(name == 'Fighter') {
    rules.defineRule
      ('features.Martial Flexibility', 'featureNotes.fighter', '=', '1');
  } else if(name == 'Loremaster') {
    rules.defineRule('features.Lore', 'featureNotes.loremaster', '=', '1');
  } else if(name == 'Loremaster II') {
    rules.defineRule('features.Secret', 'featureNotes.loremasterII', '=', '1');
  } else if(name == 'Loremaster III') {
    rules.defineRule
      ('features.Greater Lore', 'featureNotes.loremasterIII', '=', '1');
  } else if(name == 'Monk') {
    rules.defineRule
      ('features.Martial Discipline', 'featureNotes.monk', '=', '1');
    rules.defineRule('features.Mobility', 'featureNotes.monk', '=', '1');
    rules.defineRule('features.Stunning Fist', 'featureNotes.monk', '=', '1');
    rules.defineRule('features.Unarmed Strike', 'featureNotes.monk', '=', '1');
  } else if(name == 'Mystic Theurge') {
    rules.defineRule
      ('features.Combined Spells', 'featureNotes.mysticTheurge', '=', '1');
  } else if(name == 'Mystic Theurge II') {
    rules.defineRule
      ('features.Spell Synergy', 'featureNotes.mysticTheurgeII', '=', '1');
  } else if(name == 'Mystic Theurge II') {
    rules.defineRule
      ('features.Spell Synthesis', 'featureNotes.mysticTheurgeIII', '=', '1');
  } else if(name == 'Paladin') {
    rules.defineRule
      ('features.Aura Of Courage', 'featureNotes.paladin', '=', '1');
    rules.defineRule
      ('features.Code Of Honor', 'featureNotes.paladin', '=', '1');
    rules.defineRule('features.Detect Evil', 'featureNotes.paladin', '=', '1');
    rules.defineRule('features.Smite Evil', 'featureNotes.paladin', '=', '1');
  } else if(name == 'Pathfinder Chronicler') {
    rules.defineRule
      ('features.Pathfinding', 'featureNotes.pathfinderChronicler', '=', '1');
  } else if(name == 'Pathfinder Chronicler II') {
    rules.defineRule
      ('features.Epic Tales', 'featureNotes.pathfinderChroniclerII', '=', '1');
  } else if(name == 'Pathfinder Chronicler II') {
    rules.defineRule('features.Call Down The Legends',
      'featureNotes.pathfinderChroniclerIII', '=', '1'
    );
  } else if(name == 'Ranger') {
    rules.defineRule('features.Favored Enemy', 'featureNotes.ranger', '=', '1');
    rules.defineRule
      ('features.Favored Terrain', 'featureNotes.ranger', '=', '1');
    rules.defineRule
      ('features.Wilderness Stride', 'featureNotes.ranger', '=', '1');
  } else if(name == 'Shadowdancer') {
    rules.defineRule
      ('features.Greater Darkvision', 'featureNotes.shadowdancer', '=', '1');
  } else if(name == 'Shadowdancer II') {
    rules.defineRule
      ('features.Shadow Cloak', 'featureNotes.shadowdancerII', '=', '1');
  } else if(name == 'Shadowdancer III') {
    rules.defineRule('features.Mystic Powers (Shadow Force)',
      'featureNotes.shadowdancerIII', '=', '1'
    );
  } else if(name == 'Sorcerer') {
    rules.defineRule('features.Arcane Background (Sorcerer)',
      'featureNotes.sorcerer', '=', '1'
    );
  } else if(name == 'Wizard') {
    rules.defineRule
      ('features.Arcane Background (Wizard)', 'featureNotes.wizard', '=', '1');
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
    rules.defineRule('skillPoints', 'skillNotes.obsessive', '+=', '1');
  } else if(name == 'Half-Orc') {
    rules.defineRule
      ('skillStep.Intimidation', 'skillNotes.intimidating', '+=', '1');
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
    'Pathfinder Roleplaying Game for Savage Worlds Adventure Edition Core Rules © 2021 Pinnacle Entertainment Group.\n' +
    '</p>\n' +
    '<img alt="Savage Worlds Fan Logo" width="300" height="200" src="https://peginc.com/wp-content/uploads/2019/01/SW_LOGO_FP_2018.png"/>\n';
};
