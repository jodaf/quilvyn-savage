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
 * This module loads the rules from the PF4SW Player's Guide. The PF4SW
 * function contains methods that load rules for particular parts of the rules:
 * ancestryRules for character ancestries, arcaneRules for powers, etc. These
 * member methods can be called independently in order to use a subset of the
 * PF4SW rules. Similarly, the constant fields of PF4SW (SKILLS, EDGES,
 * etc.) can be manipulated to modify the choices.
 */
function PF4SW(baseRules) {

  if(window.SWADE == null) {
    alert('The PF4SW module requires use of the SWADE module');
    return;
  }

  let rules = new QuilvynRules('Pathfinder for SWADE', PF4SW.VERSION);
  rules.plugin = PF4SW;
  PF4SW.rules = rules;

  rules.defineChoice('choices', PF4SW.CHOICES);
  rules.choiceEditorElements = PF4SW.choiceEditorElements;
  rules.choiceRules = PF4SW.choiceRules;
  rules.removeChoice = SWADE.removeChoice;
  rules.editorElements = SWADE.initialEditorElements();
  rules.getFormats = SWADE.getFormats;
  rules.getPlugins = PF4SW.getPlugins;
  rules.makeValid = SWADE.makeValid;
  rules.randomizeOneAttribute = PF4SW.randomizeOneAttribute;
  rules.defineChoice('random', PF4SW.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = PF4SW.ruleNotes;

  SWADE.createViewers(rules, SWADE.VIEWERS);
  rules.defineChoice('extras',
    'edges', 'edgePoints', 'hindrances', 'sanityNotes', 'validationNotes'
  );
  rules.defineChoice('preset',
    'ancestry:Ancestry,select-one,ancestrys', 'advances:Advances,text,4',
    'concepts:Concepts,set,concepts'
  );

  PF4SW.attributeRules(rules);
  PF4SW.combatRules
    (rules, PF4SW.ARMORS, PF4SW.SHIELDS, PF4SW.WEAPONS);
  PF4SW.arcaneRules(rules, PF4SW.ARCANAS, PF4SW.POWERS);
  PF4SW.talentRules
    (rules, PF4SW.EDGES, PF4SW.FEATURES, PF4SW.GOODIES,
     PF4SW.HINDRANCES, PF4SW.SKILLS, PF4SW.LANGUAGES);
  PF4SW.identityRules
    (rules, PF4SW.ANCESTRYS, PF4SW.CONCEPTS, PF4SW.DEITYS, PF4SW.ALIGNMENTS);

  Quilvyn.addRuleSet(rules);

}

PF4SW.CHOICES =
  SWADE.CHOICES.filter(x => !['Era', 'Race'].includes(x)).concat('Ancestry', 'Deity', 'Language');
// Put deity before edges so that we can randomize domain edge properly
PF4SW.RANDOMIZABLE_ATTRIBUTES =
  ['deity'].concat(SWADE.RANDOMIZABLE_ATTRIBUTES.filter(x => x != 'era').map(x => x == 'race' ? 'ancestry' : x), 'languages');

PF4SW.VERSION = '2.4.1.0';

PF4SW.ALIGNMENTS = {
  'Good':'',
  'Neutral':'',
  'Evil':''
};
PF4SW.ANCESTRYS = {
  'Dwarf':
    'Abilities=' +
      'Darkvision,"Iron Constitution","Reduced Pace",Stonecunning,Stout,Tough '+
    'Languages=Common,Dwarven',
  'Elf':
    'Abilities=' +
      'Agile,"Elven Magic",Intelligence,"Keen Senses","Low Light Vision",' +
      'Slender ' +
    'Languages=Common,Elven',
  'Gnome':
    'Abilities=' +
      '"Gnome Magic","Keen Senses","Low Light Vision",Obsessive,' +
      '"Reduced Pace","Size -1",Tough ' +
    'Languages=Common,Gnome,Sylvan',
  'Half-Elf':
    'Abilities=' +
      '"Elven Magic",Flexibility,"Low Light Vision" ' +
    'Languages=Common,Elven',
  'Half-Orc':
    'Abilities=' +
      'Darkvision,Intimidating,"Orc Ferocity",Outsider,Strong ' +
    'Languages=Common,Orc',
  'Halfling':
    'Abilities=' +
      'Agile,"Keen Senses",Lucky,"Reduced Pace","Size -1",Sure-Footed ' +
    'Languages=Common,Halfling',
  'Human':
    'Abilities=' +
      'Adaptability ' +
    'Languages=Common'
};
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
  'Civilization Domain':
    'Skill=Faith ' +
    'Powers=' +
      'Barrier,Disguise,"Environmental Protection",Locate,"Mind Link",' +
      'Protection,Puppet,"Speak Language","Summon Ally","Warrior\'s Gift"',
  'Cleric':
    'Skill=Faith ' +
    'Powers=' +
      'Blind,Bolt,Curse,"Damage Field","Drain Power Points",Fear,"Mind Wipe",' +
      '"Planar Binding",Protection,Zombie',
  'Death Domain':
    'Skill=Faith ' +
    'Powers=' +
      'Barrier,Disguise,"Environmental Protection",Locate,"Mind Link",' +
      'Protection,Puppet,"Speak Language","Summon Ally","Warrior\'s Gift"',
  'Destruction Domain':
    'Skill=Faith ' +
    'Powers=' +
      'Bolt,Confusion,Curse,"Damage Field",Deflection,"Drain Power Points",' +
      'Fear,Stun,"Summon Ally",Zombie',
  'Druid':
    'Skill=Faith ' +
    'Powers=' +
      'Banish,"Boost/Lower Trait","Conjure Item",Darksight,Dispel,Divination,' +
      'Empathy,Healing,Light/Darkness,Relief,Resurrection,Sanctuary,Slumber,' +
      'Smite,Sound/Silence,"Baleful Polymorph",Barrier,"Beast Friend",Burst,' +
      '"Elemental Manipulation",Protection,"Shape Change","Summon Ally",' +
      '"Wall Walker"',
  'Elemental Domain':
    'Skill=Faith ' +
    'Powers=' +
      'Barrier,Blast,Burrow,Burst,"Damage Field",Deflection,' +
      '"Elemental Manipulation","Environmental Protection",Havoc,Intangibility',
  'Glory Domain':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection",Barrier,"Beast Friend",Burst,"Damage Field",' +
      'Deflection,Fly,Growth/Shrink,Sloth/Speed,"Summon Ally"',
  'Knowledge Domain':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection","Detect/Conceal Arcana","Drain Power Points",' +
      'Locate,"Mind Link","Mind Reading","Object Reading",Protection,Scrying,' +
      '"Speak Language"', 
  'Luck Domain':
    'Skill=Faith ' +
    'Powers=' +
      'Blind,Confusion,Curse,Deflection,Disguise,"Drain Power Points",' +
      'Illusion,"Mind Reading","Object Reading",Puppet',
  'Magic':
    'Skill=Spellcasting ' +
    'Powers=' +
      '"Arcane Protection","Baleful Polymorph",Banish,Barrier,"Beast Friend",' +
      'Blast,Blind,Bolt,"Boost/Lower Trait",Burrow,Burst,Confusion,' +
      '"Conjure Item",Curse,"Damage Field",Darksight,Deflection,' +
      '"Detect/Conceal Arcana",Disguise,Dispel,Divination,' +
      '"Drain Power Points","Elemental Manipulation",Empathy,Entangle,' +
      '"Environmental Protection",Farsight,Fear,Fly,Growth/Shrink,Havoc,' +
      'Illusion,Intangibility,Invisibility,Light/Darkness,Locate,"Mind Link",' +
      '"Mind Reading","Mind Wipe","Object Reading","Plane Shift",Protection,' +
      'Puppet,Relief,Scrying,"Shape Change",Sloth/Speed,Slumber,Smite,' +
      'Sound/Silence,"Speak Language",Stun,"Summon Ally",Telekinesis,' +
      'Teleport,"Time Stop","Wall Walker","Warrior\'s Gift",Wish,Zombie',
  'Magic Domain':
    'Skill=Faith ' +
    'Powers=' +
      'Blast,"Detect/Conceal Arcana","Elemental Manipulation",' +
      '"Environmental Protection",Havoc,"Planar Binding","Plane Shift",' +
      'Protection,Scrying,"Summon Ally"',
  'Miracles':
    'Skill=Faith ' +
    'Powers=' +
      'Blind,Bolt,Curse,"Damage Field","Drain Power Points",Fear,"Mind Wipe",' +
      '"Planar Binding",Protection,Zombie',
  'Nature Domain':
    'Skill=Faith ' +
    'Powers=' +
      '"Baleful Polymorph",Barrier,"Beast Friend",Burst,' +
      '"Elemental Manipulation",Entangle,"Environmental Protection",' +
      'Protection,"Shape Change","Summon Ally","Wall Walker"',
  'Protection Domain':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection",Barrier,Deflection,"Detect/Conceal Arcana",' +
      '"Environmental Protection",Intangibility,Invisibility,Puppet,' +
      'Protection,"Summon Ally"',
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
  'Strength Domain':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection",Burrow,"Drain Power Points",Growth/Shrink,Havoc,' +
      'Protection,Sloth/Speed,Stun,"Wall Walker","Warrior\'s Gift"',
  'Sun Domain':
    'Skill=Faith ' +
    'Powers=' +
      'Blind,Bolt,Confusion,"Damage Field","Drain Power Points",' +
      '"Environmental Protection",Fly,Illusion,Protection,Stun',
  'Travel Domain':
    'Skill=Faith ' +
    'Powers=' +
      'Deflection,"Environmental Protection",Fly,Intangibility,Locate,' +
      '"Plane Shift",Scrying,Sloth/Speed,"Speak Language",Teleport',
  'Trickery Domain':
    'Skill=Faith ' +
    'Powers=' +
      'Blind,Confusion,Deflection,"Detect/Conceal Arcana",Disguise,Illusion,' +
      'Invisibility,Puppet,"Speak Language","Time Stop"',
  'War Domain':
    'Skill=Faith ' +
    'Powers=' +
      'Barrier,Blast,Blind,Confusion,Deflection,Fear,Sloth/Speed,Stun,' +
      '"Summon Ally","Warrior\'s Gift"',
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
  'None':'Area=Body Armor=0 MinStr=4 Weight=0',
  'Leather Jacket':'Area=Torso Armor=2 MinStr=6 Weight=11',
  'Leather Leggings':'Area=Legs Armor=2 MinStr=6 Weight=8',
  'Leather Cap':'Area=Head Armor=2 MinStr=6 Weight=1',
  'Chain Shirt':'Area=Torso Armor=3 MinStr=8 Weight=22',
  'Chain Leggings':'Area=Legs Armor=3 MinStr=8 Weight=10',
  'Chain Hood':'Area=Head Armor=3 MinStr=8 Weight=3',
  'Plate Breastplate':'Area=Torso Armor=4 MinStr=10 Weight=30',
  'Plate Vambraces':'Area=Arms Armor=4 MinStr=10 Weight=10',
  'Plate Greaves':'Area=Legs Armor=4 MinStr=10 Weight=10',
  'Plate Heavy Helm':'Area=Head Armor=4 MinStr=10 Weight=4',
  'Plate Enclosed Heavy Helm':'Area=Head Armor=4 MinStr=10 Weight=8'
};
PF4SW.CONCEPTS_ADDED = {
  'Arcane Archer':
    'Edge=Bard,"Arcane Archer" ' +
    'Skill=Shooting',
  'Arcane Trickster':
    'Edge=Bard,Rogue,"Arcane Trickster" ' +
    'Skill=Thievery',
  'Assassin':
    'Edge=Rogue,Assassin',
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
    'Skill=Faith,Occult',
  'Dragon Disciple':
    'Edge=Cleric,"Dragon Disciple" ' +
    'Skill=Occult',
  'Druid':
    'Edge=Druid ' +
    'Attribute=Spirit ' +
    'Skill=Faith,Survival',
  'Duelist':
    'Edge=Fighter,Duelist ' +
    'Attribute=Agility ' +
    'Skill=Fighting',
  'Eldritch Knight':
    'Edge=Cleric,"Eldritch Knight" ' +
    'Skill=Fighting',
  'Fighter':
    'Edge=Fighter ' +
    'Attribute=Strength ' +
    'Skill=Athletics,Fighting,Shooting',
  'Loremaster':
    'Edge=Wizard,Loremaster ' +
    'Attribute=Smarts ' +
    'Skill=Academics,"Common Knowledge",Occult',
  'Mystic Theurge':
    'Edge=Cleric,Wizard,"Mystic Theurge"',
  'Monk':
    'Edge=Monk ' +
    'Attribute=Agility,Spirit ' +
    'Skill=Fighting',
  'Paladin':
    'Edge="Paladin" ' +
    'Attribute=Spirit,Strength ' +
    'Skill=Athletics,Fighting,Shooting',
  'Pathfinder Chronicler':
    'Edge="Pathfinder Chronicler" ' +
    'Skill=Survival,"Common Knowledge",Occult',
  'Ranger':
    'Edge=Ranger ' +
    'Skill=Athletics,Fighting,Shooting,Survival',
  'Rogue':
    'Edge=Rogue ' +
    'Attribute=Agility ' +
    'Skill=Notice,Stealth,Thievery',
  'Shadowdancer':
    'Edge=Shadowdancer ' +
    'Skill=Performance,Stealth,Thievery',
  'Sorcerer':
    'Edge=Sorcerer ' +
    'Attribute=Smarts,Spirit ' +
    'Skill=Spellcasting',
  'Wizard':
    'Edge=Wizard ' +
    'Attribute=Smarts ' +
    'Skill=Occult,Spellcasting',
  // Modified
  'Investigator':SWADE.CONCEPTS.Investigator.replaceAll('Research', 'Academics')
};
PF4SW.CONCEPTS = Object.assign({}, SWADE.CONCEPTS, PF4SW.CONCEPTS_ADDED);
delete PF4SW.CONCEPTS.Gifted;
delete PF4SW.CONCEPTS['Martial Artist'];
delete PF4SW.CONCEPTS.Psionicist;
delete PF4SW.CONCEPTS['Weird Scientist'];
PF4SW.DEITYS = {
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
  'Barbarian':'Type=Class Require="strength >= 6","vigor >= 6"',
  'Powerful Blow':'Type=Class Require="advances >= 4",features.Barbarian',
  'Intimidating Glare':'Type=Class Require="advances >= 8",features.Barbarian',
  'Strength Surge':'Type=Class Require="advances >= 12",features.Barbarian',
  'Bard':'Type=Class Require="spirit >= 6","skills.Common Knowledge >= 6"',
  'Inspire Heroics':'Type=Class Require="advances >= 4",features.Bard',
  'Countersong':'Type=Class Require="advances >= 8",features.Bard',
  'Dirge Of Doom':'Type=Class Require="advances >= 12",features.Bard',
  'Cleric':'Type=Class Require="spirit >= 6","skills.Occult >= 6"',
  'Arcane Background (Civilization Domain)':
    'Type=Class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Civilization\'"',
  'Arcane Background (Death Domain)':
    'Type=Class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Death\'"',
  'Arcane Background (Destruction Domain)':
    'Type=Class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Destruction\'"',
  'Arcane Background (Elemental Domain)':
    'Type=Class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Elemental\'"',
  'Arcane Background (Glory Domain)':
    'Type=Class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Glory\'"',
  'Arcane Background (Knowledge Domain)':
    'Type=Class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Knowledge\'"',
  'Arcane Background (Luck Domain)':
    'Type=Class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Luck\'"',
  'Arcane Background (Magic Domain)':
    'Type=Class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Magic\'"',
  'Arcane Background (Nature Domain)':
    'Type=Class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Nature\'"',
  'Arcane Background (Protection Domain)':
    'Type=Class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Protection\'"',
  'Arcane Background (Strength Domain)':
    'Type=Class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Strength\'"',
  'Arcane Background (Sun Domain)':
    'Type=Class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Sun\'"',
  'Arcane Background (Travel Domain)':
    'Type=Class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Travel\'"',
  'Arcane Background (Trickery Domain)':
    'Type=Class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Trickery\'"',
  'Arcane Background (War Domain)':
    'Type=Class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'War\'"',
  'Destroy Undead':'Type=Class Require="advances >= 4",features.Cleric',
  'Favored Powers (Cleric)':
    'Type=Class Require="advances >= 8",features.Cleric',
  'Divine Mastery':
    'Type=Class Require="advances >= 12","features.Cleric || features.Druid"',
  'Druid':'Type=Class Require="spirit >= 6","skills.Survival >= 6"',
  'Attuned':'Type=Class Require=features.Druid',
  'Wild Shape':'Type=Class Require="advances >= 4",features.Druid',
  'Favored Powers (Druid)':'Type=Class Require="advances >= 8",features.Druid',
  'Fighter':'Type=Class Require="strength >= 6","skills.Fighting >= 6"',
  'Deadly Blow':'Type=Class Require="advances >= 4",features.Fighter',
  'Martial Flexibility (Improved)':
    'Type=Class Require="advances >= 7",features.Fighter',
  'Martial Prowess':'Type=Class Require="advances >= 12",features.Fighter',
  'Monk':
    'Type=Class Require="agility >= 6","spirit >= 6","skills.Fighting >= 6"',
  'Mystic Powers (Monk)': 'Type=Class Require="advances >= 4",features.Monk',
  'Great Ki':
    'Type=Class Require="advances >= 8","features.Mystic Powers (Monk)"',
  'Wholeness Of Body':
    'Type=Class Require="advances >= 12","features.Mystic Powers (Monk)"',
  'Paladin':
    'Type=Class ' +
    'Require="spirit >= 6","strength >= 6","hindrances.Vow || hindrances.Vow+"',
  'Mystic Powers (Paladin)':
    'Type=Class Require="advances >= 4",features.Paladin',
  'Mercy':'Type=Class Require="advances >= 8",features.Paladin',
  'Mount':'Type=Class Require="advances >= 12",features.Paladin',
  'Ranger':
    'Type=Class ' +
    'Require="skills.Athletics >= 6 || skills.Fighting >= 6 || skills.Shooting >= 6","skills.Survival >= 6"',
  'Quarry':'Type=Class Require="advances >= 4",features.Ranger',
  'Mystic Powers (Ranger)':'Type=Class Require="advances >= 8",features.Ranger',
  'Master Hunter':'Type=Class Require="advances >= 12",features.Ranger',
  'Rogue':
    'Type=Class ' +
    'Require="agility >= 6","skills.Notice >= 6","skills.Stealth >= 6"',
  'Trap Sense':'Type=Class Require="advances >= 4",features.Rogue',
  'Uncanny Reflexes':'Type=Class Require="advances >= 8",features.Rogue',
  'Opportunist':'Type=Class Require="advances >= 12",features.Rogue',
  'Sorcerer':'Type=Class Require="smarts >= 6","spirit >= 6"',
  'Favored Powers (Sorcerer)':
    'Type=Class Require="advances >= 4",features.Sorcerer',
  'Aberrant Bloodline':
    'Type=Class Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Abyssal Bloodline':
    'Type=Class Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Arcane Bloodline':
    'Type=Class Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Celestial Bloodline':
    'Type=Class Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Destined Bloodline':
    'Type=Class Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Draconic Bloodline':
    'Type=Class Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Elemental Bloodline (Air)':
    'Type=Class Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Elemental Bloodline (Earth)':
    'Type=Class Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Elemental Bloodline (Fire)':
    'Type=Class Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Elemental Bloodline (Water)':
    'Type=Class Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Fey Bloodline':
    'Type=Class Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Infernal Bloodline':
    'Type=Class Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Undead Bloodline':
    'Type=Class Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Arcane Mastery':
    'Type=Class Require="advances >= 8","features.Sorcerer || features.Wizard"',
  'Advanced Bloodline':'Type=Class Require="advances >= 12",features.Sorcerer',
  'Wizard':'Type=Class Require="smarts >= 6","skills.Occult >= 6"',
  'Bonded Object':
    'Type=Class Require="features.Arcane Bond || features.Arcane Bloodline"',
  'Familiar':
    'Type=Class Require="features.Arcane Bond || features.Arcane Bloodline"',
  'Favored Powers (Wizard)':
    'Type=Class Require="advances >= 4",features.Wizard',
  'Eldritch Inspiration':'Type=Class Require="advances >= 12",features.Wizard',
  // Combat
  'Formation Fighter':'Type=Combat Require="skills.Fighting >= 8"',
  'Rapid Reload':'Type=Combat Require="skills.Shooting >= 6"',
  'Rapid Shot':SWADE.EDGES['Rapid Fire'],
  'Improved Rapid Shot':
    SWADE.EDGES['Improved Rapid Fire'].replaceAll('Fire', 'Shot'),
  'Improved Trademark Weapon (%weapon)': // Changed requirements
    'Type=Combat ' +
    'Imply="weapons.%weapon" ' +
    'Require="advances >= 8","features.Trademark Weapon (%weapon)"',
  'Two-Weapon Fighting':SWADE.EDGES['Two-Fisted'],
  // Power
  'Arcane Armor':'Type=Power Require="features.Armor Interference"',
  'Holy/Unholy Warrior': // Changed requirements
    'Type=Power ' +
    'Require=' +
      '"advances >= 4",' +
      '"powerPoints >= 1",' +
      '"features.Vow || features.Vow+"',
  'Soul Drain': // Changed requirements
    'Type=Power ' +
    'Require="advances >= 4","powerPoints >= 1","spirit >= 8"',
  // Prestige
  'Arcane Archer':
    'Type=Prestige ' +
    'Require="advances >= 4","powerPoints >= 1","skills.Shooting >= 8"',
  'Arcane Archer II':
    'Type=Prestige Require="advances >= 8","features.Arcane Archer"',
  'Arcane Archer III':
    'Type=Prestige Require="advances >= 12","features.Arcane Archer II"',
  'Arcane Trickster':
    'Type=Prestige ' +
    'Require="advances >= 4","powerPoints >= 1","features.Sneak Attack","skills.Thievery >= 8"',
  'Arcane Trickster II':
    'Type=Prestige Require="advances >= 4","features.Arcane Trickster"',
  'Arcane Trickster III':
    'Type=Prestige Require="advances >= 8","features.Arcane Trickster II"',
  'Assassin':'Type=Prestige Require="advances >= 4","features.Sneak Attack"',
  'Assassin II':'Type=Prestige Require="advances >= 8","features.Assassin"',
  'Assassin III':
    'Type=Prestige Require="advances >= 12","features.Assassin II"',
  'Dragon Disciple':
    'Type=Prestige ' +
    'Require="advances >= 4","powerPoints >= 1","skills.Occult >= 6"',
  'Dragon Disciple II':
    'Type=Prestige Require="advances >= 8","features.Dragon Disciple"',
  'Dragon Disciple III':
    'Type=Prestige Require="advances >= 12","features.Dragon Disciple II"',
  'Duelist':
    'Type=Prestige ' +
    'Require="advances >= 4","agility >= 8","skills.Fighting >= 8"',
  'Duelist II':'Type=Prestige Require="advances >= 4","features.Duelist"',
  'Duelist III':'Type=Prestige Require="advances >= 8","features.Duelist II"',
  'Eldritch Knight':
    'Type=Prestige ' +
    'Require="advances >= 4","powerPoints >= 1","skills.Fighting >= 8"',
  'Eldritch Knight II':
    'Type=Prestige Require="advances >= 8","features.Eldritch Knight"',
  'Eldritch Knight III':
    'Type=Prestige Require="advances >= 12","features.Eldritch Knight II"',
  'Loremaster':
    'Type=Prestige ' +
    'Require="advances >= 4","smarts >= 8","skills.Academics >= 8 || skills.Common Knowledge >= 8 || skills.Occult >= 8"',
  'Loremaster II':'Type=Prestige Require="advances >= 8","features.Loremaster"',
  'Loremaster III':
    'Type=Prestige Require="advances >= 12","features.Loremaster II"',
  'Mystic Theurge':
    'Type=Prestige ' +
    'Require="advances >= 4","arcaneEdgeCount >= 2","powerPoints >= 1"',
  'Mystic Theurge II':
    'Type=Prestige Require="advances >= 8","features.Mystic Theurge"',
  'Mystic Theurge III':
    'Type=Prestige Require="advances >= 12","features.Mystic Theurge II"',
  'Pathfinder Chronicler':
    'Type=Prestige ' +
    'Require="advances >= 4","skills.Survival >= 6","skills.Common Knowledge >= 8 || skills.Occult >= 8"',
  'Pathfinder Chronicler II':
    'Type=Prestige Require="advances >= 4","features.Pathfinder Chronicler"',
  'Pathfinder Chronicler III':
    'Type=Prestige Require="advances >= 8","features.Pathfinder Chronicler II"',
  'Shadowdancer':
    'Type=Prestige ' +
    'Require="advances >= 4","skills.Performance >= 6","skills.Stealth >= 8","skills.Thievery >= 6"',
  'Shadowdancer II':
    'Type=Prestige Require="advances >= 4","features.Shadowdancer"',
  'Shadowdancer III':
    'Type=Prestige Require="advances >= 8","features.Shadowdancer II"',
  // Professional
  'Born In The Saddle':
    'Type=Professional Require="agility >= 8","skills.Riding >= 6"',
  'Fix It':SWADE.EDGES['Mister Fix It'],
  'Investigator': // Changed requirements
    'Type=Professional Require="smarts >= 8","skills.Academics >= 8"',
  'Scholar (Academics)': // Changed requirements
    'Type=Professional Require="smarts >= 8"',
  'Scholar (Battle)':'Type=Professional Require="smarts >= 8"',
  'Scholar (Occult)':'Type=Professional Require="smarts >= 8"',
  'Scholar (Science)':'Type=Professional Require="smarts >= 8"',
  'Troubadour':
    'Type=Professional ' +
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
for(let e in PF4SW.EDGES) {
  if(PF4SW.EDGES[e] == null)
    delete PF4SW.EDGES[e];
}
PF4SW.FEATURES_ADDED = {
  // Edges
  'Aberrant Bloodline':
    'Section=arcana,combat ' +
    'Note=' +
      '"Must cast <i>Bolt</i>, <i>Blast</i>, and <i>Burst</i> with Lingering Damage for +1 Power Point",' +
      '"+1 Toughness"',
  'Abyssal Bloodline':
    'Section=combat,combat ' +
    'Note=' +
      '"+1 Toughness",' +
      '"Claws inflict d%{strength}+d4 damage/Has Resistance to electricity"',
  'Advanced Aberrant Bloodline':
    'Section=combat,combat ' +
    'Note=' +
      '"+1 Toughness",' +
      '"Immune to surprise and The Drop"',
  'Advanced Abyssal Bloodline':
    'Section=arcana,combat ' +
    'Note=' +
      '"<i>Summon Ally</i> costs -2 Power Points/Summoned entities inflict Fear",' +
      '"Has Resistance to cold and fire"',
  'Advanced Arcane Bloodline':
    'Section=skill Note="May reroll failed Spellcasting"',
  'Advanced Bloodline':
    'Section=feature Note="Has Advanced %V Bloodline features"',
  'Advanced Celestial Bloodline':'Section=feature Note="Has Flight feature"',
  'Advanced Destined Bloodline':'Section=feature Note="+1 Benny each session"',
  'Advanced Draconic Bloodline':
    'Section=combat Note="Claws gain AP +2/Has Resistance to draconic energy"',
  'Advanced Elemental Bloodline (Air)':
    'Section=combat Note="R9\\" cone inflicts 3d6 damage 1/encounter"',
  'Advanced Elemental Bloodline (Earth)':
    'Section=combat Note="R9\\" cone inflicts 3d6 damage 1/encounter"',
  'Advanced Elemental Bloodline (Fire)':
    'Section=combat Note="R9\\" cone inflicts 3d6 damage 1/encounter"',
  'Advanced Elemental Bloodline (Water)':
    'Section=combat Note="R9\\" cone inflicts 3d6 damage 1/encounter"',
  'Advanced Fey Bloodline':
    'Section=arcana Note="Power targets suffer -2 to recover"',
  'Advanced Infernal Bloodline':'Section=feature Note="Has Flight feature"',
  'Advanced Undead Bloodline':
    'Section=feature Note="Has Undead, Outsider+, and Ugly+ features"',
  'Angel Of Death':'Section=combat Note="May disintegrate a slain victim"',
  'Arcane Archer':
    'Section=feature ' +
    'Note="May apply Enhance Arrow feature or Arrow Trapping feature to each shot"',
  'Arcane Archer II':
    'Section=feature ' +
    'Note="May apply Phase Arrow and Hail Of Arrows features 1/encounter"',
  'Arcane Archer III':
    'Section=feature ' +
    'Note="May apply Imbue Arrow feature 1/rd and Death Arrow feature 1/dy"',
  'Arcane Armor':
    'Section=arcana Note="May cast spells in %V armor w/out penalty"',
  'Arcane Background (Bard)':'Section=arcana Note="3 Powers/10 Power Points"',
  'Arcane Background (Cleric)':'Section=arcana Note="3 Powers/10 Power Points"',
  'Arcane Background (Druid)':'Section=arcana Note="3 Powers/10 Power Points"',
  'Arcane Background (Magic)': // Modified from SWADE
    'Section=arcana,feature ' +
    'Note=' +
      '"3 Powers/10 Power Points",' +
      '"Has Armor Interference feature"',
  'Arcane Background (Miracles)':
    'Section=arcana,feature ' +
    'Note=' +
      '"3 Powers/10 Power Points",' +
      '"Has Domain and Vow+ features"',
  'Arcane Background (Sorcerer)':
    'Section=arcana,skill ' +
    'Note=' +
      '"2 Powers/15 Power Points",' +
      '"Spellcasting is linked to Spirit instead of Smarts"',
  'Arcane Background (Wizard)':'Section=arcana Note="3 Powers/10 Power Points"',
  'Arcane Background (Civilization Domain)':
    'Section=arcana Note="Has access to additional Powers"',
  'Arcane Background (Death Domain)':
    'Section=arcana Note="Has access to additional Powers"',
  'Arcane Background (Destruction Domain)':
    'Section=arcana Note="Has access to additional Powers"',
  'Arcane Background (Elemental Domain)':
    'Section=arcana Note="Has access to additional Powers"',
  'Arcane Background (Glory Domain)':
    'Section=arcana Note="Has access to additional Powers"',
  'Arcane Background (Knowledge Domain)':
    'Section=arcana Note="Has access to additional Powers"',
  'Arcane Background (Luck Domain)':
    'Section=arcana Note="Has access to additional Powers"',
  'Arcane Background (Magic Domain)':
    'Section=arcana Note="Has access to additional Powers"',
  'Arcane Background (Nature Domain)':
    'Section=arcana Note="Has access to additional Powers"',
  'Arcane Background (Protection Domain)':
    'Section=arcana Note="Has access to additional Powers"',
  'Arcane Background (Strength Domain)':
    'Section=arcana Note="Has access to additional Powers"',
  'Arcane Background (Sun Domain)':
    'Section=arcana Note="Has access to additional Powers"',
  'Arcane Background (Travel Domain)':
    'Section=arcana Note="Has access to additional Powers"',
  'Arcane Background (Trickery Domain)':
    'Section=arcana Note="Has access to additional Powers"',
  'Arcane Background (War Domain)':
    'Section=arcana Note="Has access to additional Powers"',
  'Arcane Bloodline':
    'Section=feature Note="+1 Edge Points (Bonded Object or Familiar)"',
  'Arcane Bond':
    'Section=feature Note="+1 Edge Points (Bonded Object or Familiar)"',
  'Arcane Mastery':
    'Section=arcana Note="May use Epic Power modifiers on arcane spells"',
  'Arcane Trickster':
    'Section=feature ' +
    'Note="May use Impromptu Attack feature 1/encounter and Ranged Legerdemain feature"',
  'Arcane Trickster II':
    'Section=feature Note="May use Invisible Thief feature 1/dy"',
  'Arcane Trickster III':'Section=feature Note="Has Surprise Spells feature"',
  'Armor Interference':
    'Section=attribute,skill ' +
    'Note=' +
      '"-4 Agility w/%1 armor or shield",' +
      '"-4 %2 and Agility-based skills w/%1 armor or shield"',
  'Armor Restriction':
    'Section=attribute,skill ' +
    'Note=' +
      '"-4 Agility w/%1 armor or shield",' +
      '"-4 Agility-based skills w/%1 armor or shield"',
  'Arrow Trapping':'Section=combat Note="Arrow has environmental trapping"',
  'Assassin':'Section=feature Note="Has Death Attack feature"',
  'Assassin II':
    'Section=feature ' +
    'Note="Has Hide In Plain Sight and Resistance To Poison features"',
  'Assassin III':
    'Section=feature ' +
    'Note="May use Angel Of Death and Swift Death features 1/dy"',
  'Attuned':'Section=arcana Note="May reroll failed Faith to cast spell"',
  'Aura Of Courage':
    'Section=combat Note="R10\\" Allies gain +1 to resist Fear"',
  'Barbarian':
    'Section=feature Note="Has Armor Restriction, Fast, and Rage features"',
  'Bard':
    'Section=feature ' +
    'Note="Has Arcane Background (Bard), Armor Interference, and Sharp Tongued features"',
  'Bloodline':'Section=feature Note="+1 Edge Points (bloodline)"',
  'Bonded Object':
    'Section=skill ' +
    'Note="Gains +1 Spellcasting when bonded object is held or worn"',
  'Born In The Saddle':
    'Section=skill ' +
    'Note="May make a free reroll on Riding/Mount gains +2 Pace and +1 Run Step"',
  'Breath Weapon':
    'Section=combat Note="9\\" cone inflicts 3d6 damage plus energy effects"',
  'Call Down The Legends':'Section=combat Note="May summon 5 shades for 1 hr"',
  'Celestial Bloodline':
    'Section=arcana,combat ' +
    'Note=' +
      '"<i>Bolt</i>, <i>Blast</i>, and <i>Burst</i> inflict +2 damage on evil creatures",' +
      '"Has Resistance to cold and acid"',
  'Channel Energy':
    'Section=arcana ' +
    'Note="May cast <i>Healing</i> at R%{smarts}\\"; additional targets cost 1 Power Point each"',
  'Cleric':
    'Section=feature ' +
    'Note="Has Arcane Background (Cleric), Domain, Channel Energy, and Vow+ features"',
  'Combined Spells':'Section=arcana Note="May cast two spells simultaneously"',
  'Countersong':
    'Section=combat ' +
    'Note="R5\\" Self and allies gain a reroll to resist and recover from spells"',
  'Crippling Strike':
    'Section=combat ' +
    'Note="Successful attack reduces foe Pace by 2 until healed"',
  'Deadly Blow':'Section=feature Note="+1 combat damage"',
  'Death Arrow':
    'Section=combat Note="Successful arrow attack kills (Vigor neg)"',
  'Death Attack':
    'Section=combat ' +
    'Note="Wounding attack with The Drop kills (Vigor neg); incapacitating attack is silent"',
  'Deflect Arrows':'Section=combat Note="Foes suffer -2 ranged attacks"',
  'Destined Bloodline':'Section=feature Note="+1 Benny each session"',
  'Destroy Undead':
    'Section=combat ' +
    'Note="R2\\" May spend 2 Power Points to inflict a Wound on all undead (Spirit neg)"',
  'Detect Evil':
    'Section=arcana ' +
    'Note="R%{smarts}\\" May detect evil creatures and objects at will"',
  'Dirge Of Doom':
    'Section=arcana ' +
    'Note="R10\\" May inflict -2 on foe Soak attempt, Trait reroll, or damage reroll"',
  'Divine Mastery':
    'Section=arcana Note="May use Epic Power modifiers on divine spells"',
  'Domain':'Section=feature Note="+1 Edge Points (domain)"',
  'Draconic Bloodline':
    'Section=arcana,combat,combat ' +
    'Note=' +
      '"+1 damage from Powers w/draconic trappings",' +
      '"+2 Armor",' +
      '"Claws inflict d%{strength}+d4"',
  'Dragon Disciple':
    'Section=feature Note="May use Breath Weapon feature 1/encounter"',
  'Dragon Disciple II':'Section=feature Note="Has Wings feature"',
  'Dragon Disciple III':
    'Section=feature ' +
    'Note="May use Dragon Form feature for 5 min (may suffer fatigue to dbl duration) 2/dy"',
  'Dragon Form':
    'Section=combat ' +
    'Note="Gains Size 3, Strength d12, Vigor d10, Armor 4, Bite and Claw that inflict d%{strength}+d8, AP 2, and Resistance to heritage energy"',
  'Druid':
    'Section=feature ' +
    'Note="Has Arcane Background (Druid), Armor Interference, Nature Bond, Nature Sense, Secret Language (Druidic), Vow+, and Wilderness Stride features"',
  'Duelist':'Section=feature Note="Has Surgical Strike and Parry features"',
  'Duelist II':'Section=feature Note="Has Crippling Strike feature"',
  'Duelist III':'Section=feature Note="Has Deflect Arrows feature"',
  'Eldritch Inspiration':
    'Section=arcana ' +
    'Note="May spend a Benny to cast any power of an appropriate rank from spellbook"',
  'Eldritch Knight':'Section=feature Note="Has Eldritch Recharge feature"',
  'Eldritch Knight II':'Section=feature Note="Has Eldritch Strike feature"',
  'Eldritch Knight III':
    'Section=feature Note="Has Eldritch Strike (Improved) feature"',
  'Eldritch Recharge':
    'Section=arcana Note="Raise on an attack restores 1 Power Point"',
  'Eldritch Strike':
    'Section=arcana Note="May spend 2 Power Points for +2 attack"',
  'Eldritch Strike (Improved)':
    'Section=arcana Note="May spend 2 Power Points for +2 damage"',
  'Elemental Bloodline (Air)':'Section=combat Note="Has fly Pace 6"',
  'Elemental Bloodline (Earth)':'Section=combat Note="May burrow at Pace 6"',
  'Elemental Bloodline (Fire)':
    'Section=arcana Note="Powers with fire trapping inflict +2 damage"',
  'Elemental Bloodline (Water)':'Section=arcana Note="Powers hinder targets"',
  'Enhance Arrow':'Section=combat Note="Arrow gains +1 attack and damage"',
  'Enraged':
    'Section=feature ' +
    'Note="Ignores 2 points of Wound penalties and all fatigue penalties"',
  'Epic Tales':
    'Section=feature Note="May tell a story during a rest to give allies 1 Benny each"',
  'Familiar':
    'Section=arcana ' +
    'Note="Can communicate w/a magical, Wild Card pet that stores 5 Power Points"',
  'Fast':'Section=combat Note="+2 Pace"',
  'Favored Powers (Cleric)':
    'Section=arcana ' +
    'Note="Ignores two points of penalties when casting <i>Healing</i>, <i>Sanctuary</i>, or <i>Smite</i>"',
  'Favored Powers (Druid)':
    'Section=arcana ' +
    'Note="Ignores two points of penalties when casting <i>Entangle</i>, <i>Protection</i>, or <i>Smite</i>"',
  'Favored Powers (Sorcerer)':
    'Section=arcana ' +
    'Note="Ignores two points of penalties when casting <i>Bolt</i>, <i>Elemental Manipulation</i>, or <i>Protection</i>"',
  'Favored Powers (Wizard)':
    'Section=arcana ' +
    'Note="Ignores two points of penalties when casting <i>Arcane Protection</i>, <i>Deflection</i>, or <i>Dispel</i>"',
  'Favored Enemy':
    'Section=combat,skill ' +
    'Note=' +
      '"May reroll failed attacks against %{1+(combatNotes.quarry||0)} chosen creature type",' +
      '"May reroll failed Survival to track %{1+(combatNotes.quarry||0)} chosen creature type"',
  'Favored Terrain':
    'Section=combat Note="Gains an additional Action Card in %{1+(combatNotes.quarry||0)} chosen terrain"',
  'Fey Bloodline':
    'Section=combat ' +
    'Note="Ignores movement penalties for difficult ground/Touch inflicts Distracted"',
  'Fighter':'Section=feature Note="Has Martial Flexibility feature"',
  'Formation Fighter':'Section=combat Note="+1 Gang Up bonus (+4 max)"',
  'Fury':
    'Section=combat ' +
    'Note="Gains +%{combatNotes.strengthSurge?2:1} Strength Step and may only make Wild Attacks during rage"',
  'Great Ki':
    'Section=arcana ' +
    'Note="May use Mystic Powers (Monk) to cast <i>Boost Trait</i> (Strength), <i>Protection</i>, <i>Wall Walker</i>, and <i>Warrior\'s Gift</i>"',
  'Greater Darkvision':
    'Section=feature Note="R20\\" Sees clearly in pitch darkness"',
  'Greater Lore':'Section=arcana Note="+2 Power Count"',
  'Hail Of Arrows':
    'Section=combat Note="Arrow shot effects all in a 3\\" radius"',
  'Healer':'Section=skill Note="May reroll Healing"', // Modified from SWADE
  'Hide In Plain Sight':
    'Section=arcana Note="May become invisible at will when immobile"',
  'Imbue Arrow':
    'Section=arcana Note="May center area spell where an arrow shot lands"',
  'Impromptu Attack':
    'Section=combat Note="May use Sneak Attack on a non-Vulnerable foe"',
  'Infernal Bloodline':
    'Section=arcana,combat ' +
    'Note=' +
      '"Powers with fire trapping inflict +1 damage",' +
      '"Has Resistance to fire and immunity to poison"',
  'Inspire Heroics':
    'Section=combat ' +
    'Note="R%{smarts}\\" May spend a Benny 1/encounter to grant 5 Trait or damage rerolls"',
  'Intimidating Glare':
    'Section=combat ' +
    'Note="May attempt a free Intimidation when self Action card is a jack or higher"',
  'Invisible Thief':
    'Section=arcana ' +
    'Note="May spend 1 Power Point to cast <i>Invisibility</i> w/an automatic Raise"',
  'Linguist':
    'Section=skill Note="+%{smarts//2} Language Count"', // Modified from SWADE
  'Lore':
    'Section=skill ' +
    'Note="May reroll Academics, Common Knowledge, Occult, and Science"',
  'Loremaster':'Section=feature Note="Has Lore feature"',
  'Loremaster II':'Section=feature Note="Has Secret (Loremaster) feature"',
  'Loremaster III':'Section=feature Note="Has Greater Lore feature"',
  'Martial Discipline':'Section=combat Note="+1 Toughness in no armor"',
  'Martial Flexibility':
    'Section=combat ' +
    'Note="May gain the benefits of a combat edge for 5 rd %{$\'combatNotes.martialFlexibility(Improved)\'?2:1}/encounter"',
  'Martial Flexibility (Improved)':
    'Section=combat Note="Increased Martial Flexibility effects"',
  'Martial Prowess':'Section=combat Note="May reroll failed combat attacks"',
  'Master Hunter':
    'Section=feature ' +
    'Note="Successful attacks on a favored enemy inflict +d6 damage"',
  'Mercy':
    'Section=arcana ' +
    'Note="R%{spirit}\\" Removes Distracted, Shaken, or Vulnerable from target"',
  'Mobility':'Section=combat Note="+1 Run Step"',
  'Monk':
    'Section=feature ' +
    'Note="Has Armor Restriction, Martial Discipline, Mobility, Stunning Fist, and Unarmed Strike features"',
  'Mount':
    'Section=feature ' +
    'Note="Bonded mount gains Resilience and two advances and may be summoned"',
  'Mystic Powers (Monk)':
    'Section=arcana,arcana ' +
    'Note=' +
      '"10 Power Points",' +
      '"May cast <i>Boost Trait</i> (Agility, Athletics, Fighting, or Stealth), <i>Deflection</i>, <i>Smite</i>, and <i>Speed</i> on self w/automatic success (+2 Power Points for a Raise)"',
  'Mystic Powers (Paladin)':
    'Section=arcana,arcana ' +
    'Note=' +
      '"10 Power Points",' +
      '"May cast self <i>Boost Trait</i> (Fighting, Strength, or Vigor), self <i>Smite</i>, <i>Healing</i>, and <i>Relief</i> w/automatic success (+2 Power Points for a Raise)"',
  'Mystic Powers (Ranger)':
    'Section=arcana,arcana ' +
    'Note=' +
      '"10 Power Points",' +
      '"May cast <i>Beast Friend</i>, self <i>Boost Trait</i> (Athletics, Fighting, or Shooting), <i>Entangle</i>, and self <i>Warrior\'s Gift</i> w/automatic success (+2 Power Points for a Raise)"',
  'Mystic Powers (Shadow Force)':
    'Section=arcana,arcana ' +
    'Note=' +
      '"10 Power Points",' +
      '"May cast <i>Blast</i>, <i>Illusion</i>, <i>Summon Ally</i>, and self <i>Teleport</i> w/automatic success (+2 Power Points for a Raise)"',
  'Mystic Theurge':'Section=feature Note="Has Combined Spells feature"',
  'Mystic Theurge II':'Section=feature Note="Has Spell Synergy feature"',
  'Mystic Theurge III':'Section=feature Note="Has Spell Synthesis feature"',
  'Nature Bond':
    'Section=feature Note="+1 Edge Points (Attuned or Beast Master)"',
  'Nature Sense':
    'Section=skill Note="Survival is linked to Spirit instead of Smarts"',
  'Opportunist':
    'Section=combat ' +
    'Note="May attack a foe who is using Extraction during withdrawal; a foe w/out Extraction is Vulnerable"',
  'Paladin':
    'Section=feature ' +
    'Note="Has Aura Of Courage, Code Of Honor+, Detect Evil, and Smite Evil features"',
  'Parry':'Section=combat Note="+6 Parry when using the Defend maneuver"',
  'Pathfinder Chronicler':'Section=feature Note="Has Pathfinding feature"',
  'Pathfinder Chronicler II':
    'Section=feature Note="May use Epic Tales feature 1/session"',
  'Pathfinder Chronicler III':
    'Section=feature Note="May use Call Down The Legends feature 1/wk"',
  'Pathfinding':
    'Section=feature ' +
    'Note="Increases travel speed to known locations by 10%/Successful Smarts-2 during travel discards Enemies card"',
  'Phase Arrow':'Section=combat Note="Arrow passes through obstacles"',
  'Powerful Blow':'Section=combat Note="Wild Attack does +4 damage"',
  'Quarry':
    'Section=combat ' +
    'Note="Gains an additional Favored Enemy and Favored Terrain"',
  'Rage':
    'Section=combat ' +
    'Note="Has Fury, Enraged, and Reckless Abandon features for 5 rd at will or when Shaken or wounded (Smarts neg); suffers 1 level of fatigue afterward until 1 hr rest"',
  'Ranger':
    'Section=feature ' +
    'Note="Has Armor Restriction, Favored Enemy, Favored Terrain, and Wilderness Stride features"',
  'Rapid Reload':
    'Section=combat Note="Reduces reload value of chosen ranged weapon by 1"',
  'Ranged Legerdemain':'Section=skill Note="May attempt a R5\\" Thievery-2"',
  'Reckless Abandon':
    'Section=combat ' +
    'Note="Critical failure on an attack hits a random target or self"',
  'Resistance To Poison':'Section=combat Note="+4 to resist poison"',
  'Rogue':
    'Section=feature Note="Has Armor Restriction and Sneak Attack features"',
  'School':
    'Section=feature ' +
    'Note="May select a specialist school (gains free casting reroll) and two opposition schools (suffers -2 casting rolls)"',
  'Secret (Loremaster)':
    'Section=feature Note="May use a feature chosen from any core class"',
  'Secret Language (Druidic)':
    'Section=feature Note="Can converse secretly w/other druids"',
  'Shadow Cloak':
    'Section=combat ' +
    'Note="May make a free Soak attempt when wounded in dim or dark illumination"',
  'Shadowdancer':'Section=feature Note="Has Greater Darkvision feature"',
  'Shadowdancer II':'Section=feature Note="Has Shadow Cloak feature"',
  'Shadowdancer III':
    'Section=feature Note="Has Mystic Powers (Shadow Force) feature"',
  'Sharp Tongued':'Section=skill Note="May substitute Performance for Taunt"',
  'Smite Evil':
    'Section=combat ' +
    'Note="May reroll failed attacks on %{advances//4+1} chosen evil foes/encounter"',
  'Sneak Attack':
    'Section=combat ' +
    'Note="Successful attack with The Drop or on Vulnerable foe inflicts +d6 damage"',
  'Sorcerer':
    'Section=feature ' +
    'Note="Has Arcane Background (Sorcerer), Armor Interference, and Bloodline features"',
  'Spell Synergy':
    'Section=arcana ' +
    'Note="Using Combined Spells feature reduces spell cost by 1 Power Point (min 1) each"',
  'Spell Synthesis':
    'Section=arcana Note="May apply class edge abilities to all spells"',
  'Spellbooks':
    'Section=arcana Note="Must study bonded arcane book daily to cast spells"',
  'Strength Surge':'Section=combat Note="Increased Fury effects"',
  'Stunning Fist':
    'Section=combat ' +
    'Note="Raise on Unarmed Strike inflicts choice of Distracted or Vulnerable"',
  'Surgical Strike':
    'Section=combat Note="+2 damage with light weapons (MinStr <= d6)"',
  'Surprise Spells':
    'Section=arcana Note="May use Sneak Attack feature with attack spells"',
  'Swift Death':'Section=combat Note="May attack aware foe w/The Drop"',
  'Trap Sense':
    'Section=feature ' +
    'Note="R5\\" Automatically attempts Notice for traps and ignores 2 penalty points to evade and disarm"',
  'Troubadour':
    'Section=skill,skill ' +
    'Note=' +
      '"+2 Common Knowledge",' +
      '"May use Performance in place of Battle"',
  'Unarmed Strike':
    'Section=combat ' +
    'Note="+1 Unarmed attacks, AP +2, damage d%{strength}+d4, and always considered armed"',
  'Uncanny Reflexes':
    'Section=combat ' +
    'Note="Ignores penalty for normal Evasion; may attempt Evasion-2 for any area effect"',
  'Undead':
    'Section=combat ' +
    'Note="+2 Toughness/+2 Shaken recovery/Takes no additional damage from Called Shot/Ignores 1 point of Wound penalties/Doesn\'t breathe or eat/Immune to disease and poison/Doesn\'t Bleed Out or heal naturally/R10\\" Ignores illumination penalties"',
  'Undead Bloodline':
    'Section=combat Note="Has Resistance to cold/+1 on Soak attempts"',
  'Wholeness Of Body':
    'Section=arcana Note="May spend 2 Power Points to attempt a Soak"',
  'Wild Shape':
    'Section=arcana Note="May cast <i>Shape Change</i> at dbl duration"',
  'Wilderness Stride':
    'Section=combat Note="Ignores movement penalties for difficult ground"',
  'Wings':'Section=combat Note="Has fly Pace 8"',
  'Wizard':
    'Section=feature ' +
    'Note="Has Arcane Background (Wizard), Arcane Bond, Armor Interference, School, and Spellbooks features"',
  'Rapid Shot':SWADE.FEATURES['Rapid Fire'].replaceAll('Fire', 'Shot'),
  'Improved Rapid Shot':
    SWADE.FEATURES['Improved Rapid Fire'].replaceAll('Fire', 'Shot'),
  'Two-Weapon Fighting':SWADE.FEATURES['Two-Fisted'],
  'Fix It':SWADE.FEATURES['Mister Fix It'],
  // Hindrances
  'Outsider+':
    'Section=feature,skill ' +
    'Note=' +
      '"Strangers are unfriendly or hostile",' +
      '"-2 Persuasion (other ancestries)"',
  'Timid+':SWADE.FEATURES['Yellow+'],
  // Ancestries
  'Adaptability':
    'Section=attribute,feature ' +
    'Note=' +
      '"+1 Attribute Points",' +
      '"+1 Edge Points"',
  'Darkvision':'Section=feature Note="R10\\" Ignores illumination penalties"',
  'Elven Magic':'Section=combat Note="May reroll to resist Powers"',
  'Flexibility':'Section=attribute Note="+1 Attribute Points"',
  'Gnome Magic':
    'Section=arcana ' +
    'Note="Knows <i>Beast Friend</i>, <i>Light</i>, <i>Sound</i>, and <i>Telekinesis</i>/1 Power Point"',
  'Intelligence':'Section=attribute Note="+1 Smarts Step"',
  'Intimidating':'Section=skill Note="+1 Intimidation Step"',
  'Iron Constitution':
    'Section=combat ' +
    'Note="+1 to resist poison/+1 to resist and recover from Powers"',
  'Lucky':'Section=feature Note="+1 Benny each session"',
  'Obsessive':
    'Section=skill Note="+1 Skill Point (d4 in choice of Smarts skill)"',
  'Orc Ferocity':'Section=combat Note="+1 Toughness"',
  'Slender':
    'Section=attribute,combat ' +
    'Note=' +
      '"-1 Vigor",' +
      '"-1 Toughness"',
  'Stonecunning':
    'Section=skill ' +
    'Note="Automatic Notice+2 to note unusual stonework within 10\'"',
  'Sure-Footed':'Section=skill Note="+1 Athletics Step"',
  'Stout':
    'Section=attribute ' +
    'Note="+1 Strength Step (encumbrance and minimum strength requirements)"',
  'Tough':'Section=attribute Note="+1 Vigor Step"',
};
PF4SW.FEATURES =
  Object.assign({}, SWADE.FEATURES, PF4SW.FEATURES_ADDED);
PF4SW.GOODIES = Object.assign({}, SWADE.GOODIES);
PF4SW.HINDRANCES_ADDED = {
  'Timid+':SWADE.HINDRANCES['Yellow+']
};
PF4SW.HINDRANCES =
  Object.assign({}, SWADE.HINDRANCES, PF4SW.HINDRANCES_ADDED);
delete PF4SW.HINDRANCES['Doubting Thomas'];
delete PF4SW.HINDRANCES['Yellow+'];
PF4SW.POWERS_CHANGES = {
  'Arcane Protection':
    'School=Abjuration ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+2 PP -4 (Raise -6) on arcane attacks and damage"',
  'Banish':
    'School=Abjuration ' +
    'Modifier=' +
      '"+1/+2/+3 PP 1\\"/2\\"/3\\" radius"',
  'Barrier':
    'School=Conjuration ' +
    'Modifier=' +
      '"+1/+2 PP Barrier inflicts 2d4/2d6 damage",' +
      '"+1 PP Barrier has +2 hardness",' +
      '"+1 PP Shapes barrier",' +
      '"+1 PP Creates 10\\"x2\\" barrier" ' +
    'Description=' +
      '"Creates a 5\\" long (Raise 10\\") by 1\\" high wall for 5 rd"',
  'Beast Friend':
    'School=Enchantment ' +
    'Modifier=' +
      '"+2 PP Affects magical beasts",' +
      '"+1 PP Effects last for 30 min",' +
      '"+1 PP Target can use beast\'s senses"',
  'Blast':
    'School=Evocation ' +
    'Modifier=' +
      '"+1 PP 3\\" radius",' +
      '"+2 PP Inflicts 3d6 damage (Raise 4d6)",' +
      '"+4 PP Inflicts 4d6 damage (Raise 5d6) as heavy weapon"',
  'Blind':'School=Necromancy',
  'Bolt':
    'School=Evocation ' +
    'Modifier=' +
      '"+2 PP Inflicts 3d6 damage (Raise 4d6)",' +
      '"+2 PP Incapacitating damage disintegrates (Vigor neg)",' +
      '"+4 PP Inflicts 4d6 damage (Raise 5d6) as heavy weapon",' +
      '"+2 PP ROF 2"',
  'Boost/Lower Trait':
    'School=Transmutation ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+2 PP Target gains free reroll 1/rd (Raise 1/action) or suffers -2 penalty",' +
      '"+1 PP Spirit-2"',
  'Burrow':'School=Conjuration',
  'Burst':
    'School=Evocation ' +
    'Modifier=' +
      '"+2 PP Inflicts 3d6 damage (Raise 4d6)",' +
      '"+4 PP Inflicts 4d6 damage (Raise 5d6) as heavy weapon"',
  'Confusion':
    'School=Enchantment ' +
    'Modifier=' +
      '"+1 PP 3\\" radius",' +
      '"+2 PP Radius also inflicts Shaken" ' +
    'Description=' +
      '"2\\" radius inflicts Distracted or Vulnerable (Raise both) for 1 rd"',
  'Damage Field':
    'School=Abjuration ' +
    'Modifier=' +
      '"+2 PP 2\\" radius",' +
      '"+2 PP 2d6 damage",' +
      '"+4 PP Inflicts 3d6 damage as heavy weapon",' +
      '"+2 PP Moves effect %{smarts}\\"/rd"',
  'Darksight':
   'School=Transmutation ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+2 PP Target ignores all illumination penalties and 4 points from invisibility"',
  'Deflection':
    'School=Abjuration ' +
    'PowerPoints=2 ' +
    'Description=' +
      '"Foes suffer -2 ranged or melee attacks (Raise both) on target for 5 rd"',
  'Detect/Conceal Arcana':
    'School=Divination ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+1 PP Senses supernatural evil/good",' +
      '"+1/+2 PP 2\\"/3\\" radius",' +
      '"+1 PP Identifies magic item powers",' +
      '"+1 PP <i>Detect</i>-2"',
  'Disguise':'School=Illusion',
  'Dispel':
    'School=Abjuration ' +
    'Advances=0 ' +
    'Modifier=' +
      '"+8 PP 2\\" radius suppresses powers and effects for 5 rd",' +
      '"+1/+2/+3 PP 1\\"/2\\"/3\\" radius",' +
      '"+1 PP Disrupts magic item for 1 rd (Raise 2 rd)",' +
      '"+3 PP Ends all of target\'s activated powers" ' +
    'Description=' +
      '"Ends targeted power (Arcane skill neg)"',
  'Divination':
    'School=Divination ' +
    'Advances=4 ' +
    'Modifier=' +
      '"+3 PP Contact gives advice"',
  'Drain Power Points':
    'School=Necromancy ' +
    'Modifier=' +
      '"+2 PP Drains 2d6 Power Points"',
  'Elemental Manipulation':
    'School=Transmutation ' +
    'Modifier=' +
      '"+3 PP Triples effect volume",' +
      '"+5 PP Summons weather"',
  'Empathy':
    'School=Enchantment ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+2 PP Makes uncooperative or neutral target cooperative (Raise friendly)",' +
      '"+1 PP Effect lasts 5 min",' +
      '"+2 PP Self can detect target\'s lies"',
  'Entangle':
    'School=Transmutation ' +
    'Modifier=' +
      '"+2/+3 PP 2\\"/3\\" radius",' +
      '"+2/+4 PP Inflicts 2d4/2d6 damage",' +
      '"+1 PP Entangling material has Hardness 10"',
  'Environmental Protection':
    'School=Abjuration ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+1 PP Target gains resistance" ' +
    'Description=' +
      '"Target gains protection from hazards for 1 hr (Raise 8 hr)"',
  'Farsight':
    'School=Transmutation ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+2 PP Target ignores range penalties"',
  'Fear':
    'School=Necromancy ' +
    'Modifier=' +
      '"+2/+3 PP 2\\"/3\\" radius",' +
      '"+2 PP Inflicts Spirit-2 on Fear (Raise -4)"',
  'Fly':
    'School=Transmutation ' +
    'Modifier=' +
      '"+2 PP/additional target",' +
      '"+5 PP Target gains fly Pace 24 (Raise Pace 48)"',
  'Growth/Shrink':
    'School=Transmutation ' +
    'Modifier=' +
      '"+2 PP Effect lasts 5 min",' +
      '"+2 PP Target retains Strength and Toughness"',
  'Havoc':
    'School=Evocation ' +
    'Modifier=' +
      '"+1 PP 3\\" radius",' +
      '"+2 PP Throws 3d6\\""',
  'Healing':
    'School=Conjuration ' +
    'Modifier=' +
      '"+10 PP Restores older Wound",' +
      '"+15 PP Heals crippling injury",' +
      '"+2/+3 PP 2\\"/3\\" radius heals allies",' +
      '"+1 PP Neutralizes poison or disease"',
  'Illusion':
    'School=Illusion ' +
    'Modifier=' +
      '"+1 PP 3\\" radius",' +
      '"+3 PP Inflicts Shaken (Raise Wounds) (Smarts neg)",' +
      '"+2 PP Effect lasts 5 min",' +
      '"+1/+2 PP Moves effect 12\\"/24\\"/rd",' +
      '"+1 PP Illusion includes sound",' +
      '"+2 PP Smarts-2"',
  'Intangibility':
    'School=Transmutation ' +
    'Advances=8 ' +
    'Modifier=' +
      '"+3 PP/additional target",' +
      '"+3 PP Effect lasts 5 min"',
  'Invisibility':
    'School=Illusion ' +
    'Modifier=' +
      '"+3 PP/additional target",' +
      '"+3 PP Effect lasts 5 min"',
  'Light/Darkness':
    'School=Evocation ' +
    'Modifier=' +
      '"+2 PP Light occupies %{smarts}\\" radius",' +
      '"+2 PP Darkness blocks Infravision, Low-Light Vision, and Darkvision",' +
      '"+1 PP Moves effect %{arcaneSkill}\\"/rd"',
  'Mind Link':
    'School=Divination ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+2 PP Broadcasts short thought in %{smarts*4}\\" radius",' +
      '"+3 PP Self can connect with any familiar mind"',
  'Mind Reading':
    'School=Divination ' +
    'Modifier=' +
      '"+2 PP Self views entire scene or related memories"',
  'Mind Wipe':
    'School=Enchantment ' +
    'Modifier=' +
      '"+1 PP Edits memory",' +
      '"+2 PP Activate power as an action",' +
      '"+2 PP Completely removes all memory of a person, place, or thing"',
  'Object Reading':
    'School=Divination ' +
    'Description=' +
      '"Self sees visions of the history of target" ' +
    'Modifier=' +
      '"+2 PP Shares vision with others nearby"',
  'Protection':
    'School=Abjuration ' +
    'PowerPoints=2 ' +
    'Modifier=' +
      '"+1 PP/additional target" ' +
    'Description="Target gains +2 Armor (Raise +2 Toughness) for 5 rd"',
  'Puppet':
    'School=Enchantment ' +
    'Modifier=' +
      '"+2 PP/additional target",' +
      '"+2 PP Spirit-2"',
  'Relief':
    'School=Conjuration ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+3 PP Restores 1 energy-draining effect (Raise 2)",' +
      '"+1 PP Removes Stunned condition" ' +
    'Description=' +
      '"Removes Shaken, Distracted, or Vulnerable (Raise 2 of these) or numbs 1 Wound or fatigue penalty (Raise 2) for 1 hr"',
  'Resurrection':
    'School=Conjuration ' +
    'PowerPoints=20 ' +
    'Modifier=' +
      '"+20 PP Raises any dead",' +
      '"+5 PP Raises 10 yr corpse"',
  'Shape Change':
    'School=Transmutation ' +
    'Modifier=' +
      '"+1 PP Effects last 5 min",' +
      '"+2/+3 PP Effect willing target at range touch/%{smarts}\\""',
  'Sloth/Speed':
    'School=Transmutation ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+2/+3 PP 2\\"/3\\" radius",' +
      '"+2 PP Gives maximum speed result",' +
      '"+2 PP Reduces target multi-action penalty by 2",' +
      '"+1 PP Spirit-2"',
  'Slumber':'School=Enchantment',
  'Smite':
    'School=Transmutation ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+2 PP Inflicts +4 damage (Raise +6) as heavy weapon"',
  'Sound/Silence':
    'School=Illusion ' +
    'Modifier=' +
      '"+1 PP Smarts-2",' +
      '"+1 PP Moves effect %{arcaneSkill}\\"/rd",' +
      '"1 PP/target (Spirit neg)"',
  'Speak Language':
    'School=Divination ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+2 PP Target understands all languages",' +
      '"+5 PP All within %{smarts}\\" radius can understand each other"',
  'Stun':'School=Evocation',
  'Summon Ally':
    'School=Conjuration ' +
    'Modifier=' +
      '"+1+ PP/additional servant",' +
      '"+1 PP Servant can bite/claw for Str+d6",' +
      '"+1 PP Servant has combat edge",' +
      '"+2 PP Servant has fly Pace 12",' +
      '"+1 PP/trait boost",' +
      '"+1 PP Self can use servant\'s senses"',
  'Telekinesis':
    'School=Transmutation ' +
    'Modifier=' +
      '"+3 PP Moves items as Strength d12 (Raise d12+2)"',
  'Teleport':
    'School=Conjuration ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+5 PP Opens gate to destination for 5 rd",' +
      '"+5 PP Teleport great distance",' +
      '"+2 PP Touch teleports foe (Spirit neg)"',
  'Wall Walker':'School=Transmutation',
  "Warrior's Gift":
    'School=Conjuration ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+4 PP Target gains 2 combat edges"',
  'Zombie':
    'School=Necromancy ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+1 PP Target is armed",' +
      '"+1 PP Target has 2 Armor points",' +
      '"+1 PP Self can use target senses",' +
      '"+1 PP Corpse becomes animated skeleton"',

  'Baleful Polymorph':
    'Advances=8 ' +
    'PowerPoints="3+2/size change" ' +
    'Range=smarts ' +
    'School=Transmutation ' +
    'Modifier=' +
      '"+2 PP Transformation lasts for 5 min" ' +
    'Description=' +
      '"Target becomes chosen animal for 5 rd (Spirit neg, Spirit-2 ends)"',
  'Conjure Item':
    'Advances=0 ' +
    'PowerPoints=2/lb ' +
    'Range=smarts ' +
    'School=Conjuration ' +
    'Modifier=' +
      '"+1 PP Creates a set of items",' +
      '"+1 PP/dy Creates food and water",' +
      '"+1 PP/lb Item lasts until dispelled" ' +
    'Description=' +
      '"Creates a mundane item for 1 hr"',
  'Curse':
    'Advances=4 ' +
    'PowerPoints=5 ' +
    'Range=touch ' +
    'School=Necromancy ' +
    'Modifier=' +
      '"+5 PP Inflicts fatigue each rd (Spirit neg); incapacity turns to stone" ' +
    'Description=' +
      '"Target suffers 1 level fatigue and an additional level each sunset (Spirit neg)"',
  'Locate':
    'Advances=0 ' +
    'PowerPoints=3 ' +
    'Range=self ' +
    'School=Divination ' +
    'Modifier=' +
      '"+1 PP Self learns best path to target" ' +
    'Description=' +
      '"Gives direction of chosen item (-2 if self has never seen item; running water neg) for 10 min"',
  'Planar Binding':
    'Advances=8 ' +
    'PowerPoints=8 ' +
    'Range=smarts ' +
    'School=Conjuration ' +
    'Description=' +
      '"Summons and traps an extraplanar creature to perform a service (Spirit neg)"',
  'Plane Shift':
    'Advances=8 ' +
    'PowerPoints=4 ' +
    'Range=smarts ' +
    'School=Conjuration ' +
    'Modifier=' +
      '"+1 PP/additional target",' +
      '"+1 PP Creates extra-dimensional shelter",' +
      '"+2 PP Plane shifts foe (Spirit neg) for 3 rd (Raise 5 rd)" ' +
    'Description=' +
      '"Self travels to chosen plane, w/in 10d10 miles (Raise 5d10) of a known location"',
  'Sanctuary':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=touch ' +
    'School=Enchantment ' +
    'Modifier=' +
      '"+2/+3 PP 2\\"/3\\" radius",' +
      '"+1 PP Spirit-2" ' +
    'Description=' +
      '"Evil creatures cannot attack target (Spirit neg; Raise Spirit-2) for 5 rd; attacking ends"',
  'Scrying':
    'Advances=4 ' +
    'PowerPoints=3 ' +
    'Range=self ' +
    'School=Divination ' +
    'Modifier=' +
      '"+1 PP Shares vision with allies in %{smarts}\\" radius" ' +
    'Description=' +
      '"Gives view of chosen target (-2 unfamiliar target; Spirit target detects) for 5 rd"',
  'Time Stop':
    'Advances=12 ' +
    'PowerPoints=8 ' +
    'Range=self ' +
    'School=Transmutation ' +
    'Description=' +
      '"Self gains additional turn"',
  'Wish':
    'Advances=16 ' +
    'PowerPoints=20 ' +
    'Range=smarts ' +
    'School=Universal ' +
    'Description=' +
      '"Self alters reality and loses 3 PP permanently (Raise no PP loss)"'
};
PF4SW.POWERS = {};
for(let p in PF4SW.POWERS_CHANGES) {
  PF4SW.POWERS[p] = (SWADE.POWERS[p] || '') + ' ' + PF4SW.POWERS_CHANGES[p];
}
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
PF4SW.SHIELDS = {
  'None':'Parry=0 Cover=0 MinStr=0 Weight=0',
  'Light Shield':'Parry=1 Cover=0 MinStr=6 Weight=4',
  'Medium Shield':'Parry=2 Cover=2 MinStr=8 Weight=8',
  'Heavy Shield':'Parry=2 Cover=4 MinStr=10 Weight=12'
};
PF4SW.SKILLS = Object.assign({}, SWADE.SKILLS);
delete PF4SW.SKILLS.Electronics;
delete PF4SW.SKILLS.Focus;
delete PF4SW.SKILLS.Hacking;
delete PF4SW.SKILLS['Language (%language)'];
delete PF4SW.SKILLS.Psionics;
delete PF4SW.SKILLS.Research;
delete PF4SW.SKILLS['Weird Science'];
PF4SW.WEAPONS = {
  'Bastard Sword':'Damage=Str+d8 MinStr=8 Weight=6 Category=One-Handed AP=1',
  'Battle Axe':'Damage=Str+d8 MinStr=8 Weight=6 Category=One-Handed',
  'Blowgun':'Damage=d4-2 MinStr=4 Weight=1 Category=Ranged Range=3',
  'Bolas':'Damage=Str+d4 MinStr=4 Weight=2 Category=Ranged Range=3',
  'Composite Bow':
    'Damage=Str+d6 MinStr=6 Weight=3 Category=Ranged Range=12 AP=1',
  'Dagger':'Damage=Str+d4 MinStr=4 Weight=1 Category=One-Handed Range=3',
  'Falchion':'Damage=Str+d8 MinStr=8 Weight=8 Category=One-Handed AP=1',
  'Flail':'Damage=Str+d6 MinStr=6 Weight=5 Category=One-Handed',
  'Glaive':'Damage=Str+d8 MinStr=8 Weight=10 Category=Two-Handed',
  'Great Axe':
    'Damage=Str+d10 MinStr=10 Weight=12 Category=Two-Handed AP=3 Parry=-1',
  'Great Sword':'Damage=Str+d10 MinStr=10 Weight=6 Category=Two-Handed AP=2',
  'Guisarme':'Damage=Str+d6 MinStr=6 Weight=12 Category=Two-Handed AP=1',
  'Halberd':'Damage=Str+d8 MinStr=8 Weight=12 Category=Two-Handed AP=1',
  'Hand Axe':'Damage=Str+d6 MinStr=6 Weight=3 Category=One-Handed Range=3',
  'Hand Crossbow':'Damage=2d4 MinStr=4 Weight=2 Category=Ranged Range=5',
  'Hand Repeating Crossbow':
    'Damage=2d4 MinStr=4 Weight=3 Category=Ranged Range=5',
  'Heavy Club':'Damage=Str+d6 MinStr=6 Weight=5 Category=One-Handed',
  'Heavy Crossbow':'Damage=2d8 MinStr=6 Weight=8 Category=Ranged Range=15 AP=2',
  'Heavy Flail':'Damage=Str+d8 MinStr=8 Weight=10 Category=Two-Handed',
  'Heavy Mace':'Damage=Str+d8 MinStr=8 Weight=8 Category=One-Handed AP=1',
  'Heavy Repeating Crossbow':
    'Damage=2d8 MinStr=8 Weight=12 Category=Ranged Range=15 AP=2',
  'Javelin':'Damage=Str+d6 MinStr=6 Weight=3 Category=Ranged Range=4',
  'Katana':'Damage=Str+d6+1 MinStr=6 Weight=3 Category=Two-Handed',
  'Knife':'Damage=Str+d4 MinStr=4 Weight=1 Category=One-Handed Range=3',
  'Lance':'Damage=Str+d8 MinStr=8 Weight=10 Category=One-Handed',
  'Light Club':'Damage=Str+d4 MinStr=4 Weight=2 Category=One-Handed',
  'Light Crossbow':'Damage=2d6 MinStr=6 Weight=5 Category=Ranged Range=10 AP=2',
  'Light Mace':'Damage=Str+d6 MinStr=6 Weight=4 Category=One-Handed',
  'Light Repeating Crossbow':
    'Damage=2d6 MinStr=6 Weight=8 Category=Ranged Range=10 AP=2',
  'Long Bow':'Damage=2d6 MinStr=8 Weight=3 Category=Ranged Range=15 AP=1',
  'Long Sword':'Damage=Str+d8 MinStr=8 Weight=4 Category=One-Handed',
  'Maul':'Damage=Str+d10 MinStr=10 Weight=10 Category=Two-Handed AP=2',
  'Morningstar':'Damage=Str+d6 MinStr=6 Weight=6 Category=One-Handed',
  'Net':'Damage=d0 MinStr=4 Weight=8 Category=Ranged Range=3',
  'Pike':'Damage=Str+d8 MinStr=8 Weight=18 Category=Two-Handed',
  'Quarterstaff':'Damage=Str+d4 MinStr=4 Weight=4 Category=Two-Handed Parry=1',
  'Ranseur':'Damage=Str+d6 MinStr=6 Weight=12 Category=One-Handed',
  'Rapier':'Damage=Str+d4 MinStr=4 Weight=2 Category=One-Handed Parry=1',
  'Sap':'Damage=Str+d4 MinStr=4 Weight=1 Category=One-Handed',
  'Scimitar':'Damage=Str+d6 MinStr=6 Weight=4 Category=One-Handed',
  'Scythe':'Damage=Str+d6 MinStr=6 Weight=10 Category=Two-Handed',
  'Short Bow':'Damage=2d6 MinStr=6 Weight=2 Category=Ranged Range=12',
  'Short Spear':'Damage=Str+d6 MinStr=6 Weight=3 Category=One-Handed Range=4',
  'Short Sword':'Damage=Str+d6 MinStr=6 Weight=2 Category=One-Handed',
  'Shuriken':'Damage=Str+d4 MinStr=4 Weight=0 Category=Ranged Range=3',
  'Sickle':'Damage=Str+d4 MinStr=4 Weight=2 Category=One-Handed',
  'Sling':'Damage=Str+d4 MinStr=4 Weight=1 Category=Ranged Range=4',
  'Spear':'Damage=Str+d6 MinStr=6 Weight=6 Category=Two-Handed Range=3',
  'Spiked Chain':'Damage=Str+d6 MinStr=6 Weight=6 Category=Two-Handed AP=1',
  'Staff':'Damage=Str+d4 MinStr=4 Weight=4 Category=Two-Handed Parry=1',
  'Starknife':
    'Damage=Str+d4 MinStr=4 Weight=3 Category=One-Handed Range=3 Parry=1',
  'Trident':'Damage=Str+d6 MinStr=6 Weight=4 Category=One-Handed Range=3 AP=1',
  'Unarmed':'Damage=Str+d0 MinStr=0 Weight=0 Category=Unarmed',
  'Warhammer':'Damage=Str+d6 MinStr=6 Weight=5 Category=One-Handed AP=1',
  'Whip':'Damage=Str+d4 MinStr=4 Weight=2 Category=One-Handed Parry=-1',
};

/* Defines rules related to powers. */
PF4SW.arcaneRules = function(rules, arcanas, powers) {
  SWADE.arcaneRules(rules, arcanas, powers);
  let allNotes = rules.getChoices('notes');
  if('commonPowerModifiers' in allNotes)
    allNotes.commonPowerModifiers =
      allNotes.commonPowerModifiers.replace(/^/, '<b>+1 PP</b> Adaptable Caster; ');
};

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
PF4SW.identityRules = function(
  rules, ancestries, concepts, deitys, alignments)
{

  QuilvynUtils.checkAttrTable(alignments, []);
  QuilvynUtils.checkAttrTable
    (ancestries, ['Requires', 'Abilities', 'Languages']);
  QuilvynUtils.checkAttrTable(deitys, ['Alignment', 'Domain']);
  SWADE.identityRules(rules, {}, {}, concepts);

  for(let a in alignments) {
    rules.choiceRules(rules, 'Alignment', a, alignments[a]);
  }
  for(let a in ancestries) {
    rules.choiceRules(rules, 'Ancestry', a, ancestries[a]);
  }
  for(let d in deitys) {
    rules.choiceRules(rules, 'Deity', d, deitys[d]);
  }

  rules.defineEditorElement('race');
  rules.defineEditorElement
    ('ancestry', 'Ancestry', 'select-one', 'ancestrys', 'imageUrl');
  rules.defineEditorElement
    ('alignment', 'Alignment', 'select-one', 'alignments', 'origin');
  rules.defineEditorElement
    ('deity', 'Deity', 'select-one', 'deity', 'origin');
  rules.defineSheetElement('Alignment', 'Origin');
  rules.defineSheetElement('DeityInfo', 'Alignment+', '<b>Deity</b>: %V', ' ');
  rules.defineSheetElement('Deity', 'DeityInfo/', '%V');
  rules.defineSheetElement('Deity Alignment', 'DeityInfo/', '(%V)');

};

/* Defines rules related to character aptitudes. */
PF4SW.talentRules = function(
  rules, edges, features, goodies, hindrances, skills, languages
) {

  QuilvynUtils.checkAttrTable(languages, []);
  SWADE.talentRules(rules, edges, features, goodies, hindrances, skills);

  for(let l in languages) {
    PF4SW.choiceRules(rules, 'Language', l, languages[l]);
  }

  rules.defineRule('edgePoints', '', '=', '1');
  rules.defineRule
    ('languageCount', 'smarts', '=', '1 + Math.floor(source / 2)');
  rules.defineEditorElement
    ('languages', 'Languages', 'set', 'languages', 'origin');
  rules.defineSheetElement('Languages', 'Skills+', null, '; ');
  QuilvynRules.validAllocationRules
    (rules, 'language', 'languageCount', 'Sum "^languages\\."');

};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
PF4SW.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Race')
    type = 'Ancestry';
  if(type == 'Alignment')
    PF4SW.alignmentRules(rules, name);
  else if(type == 'Ancestry') {
    PF4SW.ancestryRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Abilities'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages')
    );
    PF4SW.ancestryRulesExtra(rules, name);
  } else if(type == 'Arcana')
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
    PF4SW.deityRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Alignment'),
      QuilvynUtils.getAttrValueArray(attrs, 'Domain')
    );
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
      QuilvynUtils.getAttrValue(attrs, 'Description'),
      QuilvynUtils.getAttrValue(attrs, 'School'),
      QuilvynUtils.getAttrValueArray(attrs, 'Modifier')
    );
  else if(type == 'Shield')
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
  type =
    type.charAt(0).toLowerCase() + type.substring(1).replaceAll(' ', '') + 's';
  rules.addChoice(type, name, attrs);
};

/* Defines in #rules# the rules associated with alignment #name#. */
PF4SW.alignmentRules = function(rules, name) {
  if(!name) {
    console.log('Empty alignment name');
    return;
  }
  // No rules pertain to alignment
};

/*
 * Defines in #rules# the rules associated with ancestry #name#, which has the
 * list of hard prerequisites #requires#. #abilities# list associated Abilities
 * and #languages# any automatic languages.
 */
PF4SW.ancestryRules = function(rules, name, requires, abilities, languages) {
  SWADE.raceRules(rules, name, requires, abilities);
  rules.defineRule('race', 'ancestry', '=', null); // So SWADE rules will work
};

/*
 * Defines in #rules# the rules associated with ancestry #name# that cannot be
 * derived directly from the attributes passed to ancestryRules.
 */
PF4SW.ancestryRulesExtra = function(rules, name) {
  if(name == 'Dwarf') {
    rules.defineRule
      ('armorStrengthStepShortfall', 'attributeNotes.stout', '+', '-1');
  } else if(name == 'Gnome') {
    rules.defineRule('skillPoints', 'skillNotes.obsessive', '+=', '1');
  } else if(name == 'Half-Orc') {
    rules.defineRule
      ('skillStep.Intimidation', 'skillNotes.intimidating', '+=', '1');
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
    (rules, name, ['Medieval'], areas, armor, minStr, weight);
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

/*
 * Defines in #rules# the rules associated with deity #name#, who has alignment
 * #alignment# and is associated the the list of domains #domains#.
 */
PF4SW.deityRules = function(rules, name, alignment, domains) {

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
PF4SW.edgeRules = function(rules, name, requires, implies, types) {
  SWADE.edgeRules(rules, name, requires, implies, types);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with edge #name# that cannot be
 * derived directly from the attributes passed to edgeRules.
 */
PF4SW.edgeRulesExtra = function(rules, name) {
  if(name.match(/Bloodline/) && !name.startsWith('Advanced')) {
    let bloodline = name.replace(/\s+Bloodline/, '');
    rules.defineRule('featureNotes.advancedBloodline',
      'features.' + name, '=', '"' + bloodline + '"'
    );
    rules.defineRule('features.Advanced ' + name,
      'featureNotes.advancedBloodline', '?', null,
      'features.' + name, '=', '1'
    );
    rules.defineRule('bloodlineEdgeCount', 'features.' + name, '+=', '1');
  }
  if(name == 'Arcane Armor') {
    rules.defineRule('arcanaNotes.arcaneArmor',
      'arcanaNotes.arcaneArmor.1', '=', 'source==1 ? "light" : source==2 ? "medium" : "any"'
    );
    rules.defineRule('arcanaNotes.arcaneArmor.1',
      'attributeNotes.armorInterference.1', '=',
        'source.match(/^medium/i) ? 1 : source.match(/^heavy/i) ? 2 : 0',
      'features.Arcane Armor', '+', null
    );
  } else if(name == 'Arcane Background (Magic)') {
    rules.defineRule('attributeNotes.armorInterference.1',
      'featureNotes.arcaneBackground(Magic)', '=', '"medium or heavy"'
    );
    rules.defineRule('skillNotes.armorInterference.1',
      'featureNotes.arcaneBackground(Magic)', '=', '"medium or heavy"'
    );
    rules.defineRule('skillNotes.armorInterference.2',
      'featureNotes.arcaneBackground(Magic)', '=', '"Spellcasting"'
    );
  } else if(name == 'Arcane Background (Miracles)') {
    rules.defineRule('edgePoints', 'featureNotes.domain', '+', '1');
  } else if(name == 'Arcane Bloodline') {
    rules.defineRule('edgePoints', 'featureNotes.arcaneBloodline', '+', '1');
  } else if(name == 'Assassin III') {
    rules.defineRule
      ('features.Angel Of Death', 'featureNotes.assassinIII', '=', '1');
    rules.defineRule
      ('features.Swift Death', 'featureNotes.assassinIII', '=', '1');
  } else if(name == 'Arcane Archer') {
    rules.defineRule
      ('features.Enhance Arrow', 'featureNotes.arcaneArcher', '=', '1');
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
  } else if(name == 'Barbarian') {
    rules.defineRule('attributeNotes.armorRestriction.1',
      'featureNotes.barbarian', '=', '"heavy"'
    );
    rules.defineRule('features.Enraged', 'features.Rage', '=', '1');
    rules.defineRule('features.Fury', 'features.Rage', '=', '1');
    rules.defineRule('features.Reckless Abandon', 'features.Rage', '=', '1');
    rules.defineRule('skillNotes.armorRestriction.1',
      'featureNotes.barbarian', '=', '"heavy"'
    );
  } else if(name == 'Bard') {
    rules.defineRule('attributeNotes.armorInterference.1',
      'featureNotes.bard', '=', '"medium or heavy"'
    );
    rules.defineRule('skillNotes.armorInterference.1',
      'featureNotes.bard', '=', '"medium or heavy"'
    );
    rules.defineRule('skillNotes.armorInterference.2',
      'featureNotes.bard', '=', '"Performance"'
    );
  } else if(name == 'Cleric') {
    rules.defineRule('edgePoints', 'featureNotes.domain', '+', '1');
  } else if(name == 'Draconic Bloodline') {
    rules.defineRule
      ('armorToughness', 'combatNotes.draconicBloodline', '+=', '2');
  } else if(name == 'Dragon Disciple') {
    rules.defineRule
      ('features.Breath Weapon', 'featureNotes.dragonDisciple', '=', '1');
  } else if(name == 'Dragon Disciple III') {
    rules.defineRule
      ('features.Dragon Form', 'featureNotes.dragonDiscipleIII', '=', '1');
  } else if(name == 'Druid') {
    rules.defineRule('attributeNotes.armorInterference.1',
      'featureNotes.druid', '=', '"medium or heavy"'
    );
    rules.defineRule('edgePoints', 'featureNotes.natureBond', '+', '1');
    rules.defineRule('survivalStepAdjustment',
      'skillNotes.natureSense', '?', null,
      'spiritStep', '=', null,
      'smartsStep', '+', '-source'
    );
    rules.defineRule('skillStepPastAttribute.Survival',
      'survivalStepAdjustment', '+', 'source>0 ? -source : null'
    );
    rules.defineRule('skillNotes.armorInterference.1',
      'featureNotes.druid', '=', '"medium or heavy"'
    );
    rules.defineRule('skillNotes.armorInterference.2',
      'featureNotes.druid', '=', '"Faith"'
    );
  } else if(name == 'Linguist') {
    // SWADE thinks Language Count is a skill name
    rules.defineRule('languageCount', 'skillNotes.linguist', '+', null);
  } else if(name == 'Monk') {
    rules.defineRule
      ('attackAdjustment.Unarmed', 'combatNotes.unarmedStrike', '+=', '1');
    rules.defineRule
      ('attributeNotes.armorRestriction.1', 'featureNotes.monk', '=', '"any"');
    rules.defineRule('combatNotes.martialDiscipline.1',
      'combatNotes.martialDiscipline', '?', null,
      'armor.None', '=', '1'
    );
    rules.defineRule
      ('damageStep.Unarmed', 'combatNotes.unarmedStrike', '+=', '1');
    rules.defineRule('toughness', 'combatNotes.martialDiscipline.1', '+', null);
    rules.defineRule
      ('skillNotes.armorRestriction.1', 'featureNotes.monk', '=', '"any"');
  } else if(name == 'Pathfinder Chronicler II') {
    rules.defineRule
      ('features.Epic Tales', 'featureNotes.pathfinderChroniclerII', '=', '1');
  } else if(name == 'Pathfinder Chronicler III') {
    rules.defineRule('features.Call Down The Legends',
      'featureNotes.pathfinderChroniclerIII', '=', '1'
    );
  } else if(name == 'Ranger') {
    rules.defineRule('attributeNotes.armorRestriction.1',
      'featureNotes.ranger', '=', '"heavy"'
    );
    rules.defineRule
      ('skillNotes.armorRestriction.1', 'featureNotes.ranger', '=', '"heavy"');
  } else if(name == 'Rogue') {
    rules.defineRule('attributeNotes.armorRestriction.1',
      'featureNotes.rogue', '=', '"medium or heavy"'
    );
    rules.defineRule('skillNotes.armorRestriction.1',
      'featureNotes.rogue', '=', '"medium or heavy"'
    );
  } else if(name == 'Sorcerer') {
    rules.defineRule('attributeNotes.armorInterference.1',
      'featureNotes.sorcerer', '=', '"any"'
    );
    rules.defineRule('edgePoints', 'featureNotes.bloodline', '+', '1');
    rules.defineRule('spellcastingStepAdjustment',
      'skillNotes.arcaneBackground(Sorcerer)', '?', null,
      'spiritStep', '=', null,
      'smartsStep', '+', '-source'
    );
    rules.defineRule('skillStepPastAttribute.Spellcasting',
      'spellcastingStepAdjustment', '+', 'source>0 ? -source : null'
    );
    rules.defineRule('skillNotes.armorInterference.1',
      'featureNotes.sorcerer', '=', '"any"'
    );
    rules.defineRule('skillNotes.armorInterference.2',
      'featureNotes.sorcerer', '=', '"Spellcasting"'
    );
    QuilvynRules.validAllocationRules
      (rules, 'bloodline', 'features.Sorcerer', 'bloodlineEdgeCount');
  } else if(name == 'Wizard') {
    rules.defineRule('attributeNotes.armorInterference.1',
      'featureNotes.wizard', '=', '"any"'
    );
    rules.defineRule('edgePoints', 'featureNotes.arcaneBond', '+', '1');
    rules.defineRule('skillNotes.armorInterference.1',
      'featureNotes.wizard', '=', '"any"'
    );
    rules.defineRule('skillNotes.armorInterference.2',
      'featureNotes.wizard', '=', '"Spellcasting"'
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
  if(name.startsWith('Arcane Background') && !name.includes('Domain'))
    rules.defineRule('arcaneEdgeCount', 'features.' + name, '+=', '1');
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
  if(!name) {
    console.log('Empty language name');
    return;
  }
  // No rules pertain to language
};

/*
 * Defines in #rules# the rules associated with power #name#, which may be
 * acquired only after #advances# advances, requires #powerPoints# Power Points
 * to use, and can be cast at range #range#. #description# is a concise
 * description of the power's effects and #school#, if defined, is the magic
 * school that defines the power.
 */
PF4SW.powerRules = function(
  rules, name, advances, powerPoints, range, description, school, modifiers
) {
  if(!(school + '').match(/^(Abjuration|Conjuration|Divination|Enchantment|Evocation|Illusion|Necromancy|Transmutation|Universal)$/)) {
    console.log('Bad school "' + school + '" for spell ' + name);
    return;
  }
  SWADE.powerRules
    (rules, name, advances, powerPoints, range, description, school, modifiers);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with shield #name#, which adds
 * #parry# to the character's Parry, provides #cover# cover, requires #minStr#
 * to handle, and weighs #weight#.
 */
PF4SW.shieldRules = function(rules, name, parry, cover, minStr, weight) {
  SWADE.shieldRules
    (rules, name, ['Medieval'], parry, cover, minStr, weight);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * #attribute# (one of 'agility', 'spirit', etc.).
 */
PF4SW.skillRules = function(rules, name, attribute, core) {
  SWADE.skillRules(rules, name, ['Medieval'], attribute, core);
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
    rules, name, ['Medieval'], damage, minStr, weight, category, armorPiercing,
    range, rateOfFire, parry
  );
  // No changes needed to the rules defined by base method
};

/*
 * Returns the list of editing elements needed by #choiceRules# to add a #type#
 * item to #rules#.
 */
PF4SW.choiceEditorElements = function(rules, type) {
  let result;
  if(type == 'Ancestry') {
    result = SWADE.choiceEditorElements(rules, 'Race');
    result.push(['Languages', 'Languages', 'text', [40]]);
  } else if(type == 'Deity') {
    result = [
      ['Alignment', 'Alignment', 'select-one', QuilvynUtils.getKeys(rules.getChoices('alignments'))],
      ['Domain', 'Domains', 'text', [40]]
    ];
  } else if(type == 'Edge') {
    result = SWADE.choiceEditorElements(rules, 'Edge');
    let typeIndex = result.findIndex(x => x[0] == 'Type');
    result[typeIndex][3] =
      result[typeIndex][3].concat('Class', 'Prestige').sort();
  } else if(type == 'Langauge') {
    result = [];
  } else {
    result = SWADE.choiceEditorElements(rules, type);
  }
  return result;
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
PF4SW.randomizeOneAttribute = function(attributes, attribute) {

  let attr;
  let attrs = this.applyRules(attributes);
  let choices;
  let howMany;

  if(attribute == 'alignment') {
    choices = QuilvynUtils.getKeys(this.getChoices('alignments'));
    attributes.alignment = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'edges') {
    // First, make sure class edge is assigned; otherwise, prerequisite tests
    // for other edges may fail
    let allEdges = this.getChoices('edges');
    let concepts = QuilvynUtils.getKeys(attributes, /^concepts\./);
    concepts.forEach(c => {
      if('edges.' + c in allEdges) {
        attributes['edges.' + c] = 1;
        attrs = this.applyRules(attributes);
      }
    });
    if((attributes['concepts.Cleric'] ||
        attributes['edges.Arcane Background (Cleric)'] ||
        attributes['edges.Arcane Background (Miracles)']) &&
       QuilvynUtils.sumMatching(attributes, /edges.*Domain/) == 0) {
      let deityAttrs = this.getChoices('deitys')[attributes.deity];
      if(!deityAttrs || !deityAttrs.includes('Domain')) {
        choices = QuilvynUtils.getKeys(this.getChoices('edges'), /Arcane Background.*Domain/);
      } else {
        choices = QuilvynUtils.getAttrValueArray(deityAttrs, 'Domain').map(x => 'Arcane Background (' + x + ' Domain)');
      }
      attributes['edges.' + choices[QuilvynUtils.random(0, choices.length - 1)]] = 1;
    }
    if((attributes['concepts.Druid'] ||
        attributes['edges.Arcane Background (Druid)']) &&
       (!attributes['edges.Attuned'] && !attributes['edges.Beast Master'])) {
      choices = ['Attuned', 'Beast Master'];
      attributes['edges.' + choices[QuilvynUtils.random(0, choices.length - 1)]] = 1;
    }
    if((attributes['concepts.Sorcerer'] ||
        attributes['edges.Arcane Background (Sorcerer)']) &&
       QuilvynUtils.sumMatching(attributes, /edges.*Bloodline$/) -
       QuilvynUtils.sumMatching(attributes, /edges.Advanced.*Bloodline$/) <= 0){
      choices = QuilvynUtils.getKeys(this.getChoices('edges'), /Bloodline$/).filter(x => !x.startsWith('Advanced'));
      attributes['edges.' + choices[QuilvynUtils.random(0, choices.length - 1)]] = 1;
    }
    if((attributes['concepts.Wizard'] ||
        attributes['edges.Arcane Background (Wizard)'] ||
        attributes['edges.Arcane Bloodline']) &&
       (!attributes['edges.Bonded Object'] && !attributes['edges.Familiar'])) {
      choices = ['Bonded Object', 'Familiar'];
      attributes['edges.' + choices[QuilvynUtils.random(0, choices.length - 1)]] = 1;
    }
    // Prioritize edges particular to the character's concept, if any
    if(concepts.length > 0) {
      choices = [];
      for(attr in allEdges) {
        concepts.forEach(c => {
          if(!attributes['edges.' + attr] &&
             allEdges[attr].match('Require=.*features\\.' + c))
            choices.push(attr);
        });
      }
      // Try to assign a random number of unassigned edges to concept edges
      howMany = (attrs.edgePoints || 0) -
                QuilvynUtils.sumMatching(attributes, '^edges');
      howMany = QuilvynUtils.random(0, howMany);
      while(howMany > 0 && choices.length > 0) {
        attr = choices[QuilvynUtils.random(0, choices.length - 1)];
        choices = choices.filter(x => x != attr);
        attributes['edges.' + attr] = 1;
        attrs = this.applyRules(attributes);
        let name = attr.charAt(0).toLowerCase() +
                   attr.substring(1).replaceAll(' ', '');
        if(attrs['validationNotes.' + name + 'Edge'] ||
           attrs['sanityNotes.' + name + 'Edge'])
          delete attributes['edges.' + attr];
        else
          howMany--;
      }
    }
  } else if(attribute == 'hindrances') {
    if((attributes['concepts.Paladin'] || attributes['edges.Paladin']) &&
       !attributes['hindrances.Vow'] &&
       !attributes['hindrances.Vow+'])
      attributes['hindrances.Vow'] = 1;
  } else if(attribute == 'languages') {
    howMany = attrs.languageCount || 1;
    choices = [];
    for(let l in this.getChoices('languages')) {
      if('languages.' + l in attrs)
        howMany--;
      else
        choices.push(l);
    }
    let allAncestrys = this.getChoices('ancestrys');
    let ancestralLanguages = [];
    if(allAncestrys && attrs.ancestry && allAncestrys[attrs.ancestry])
      ancestralLanguages =
        QuilvynUtils.getAttrValueArray(allAncestrys[attrs.ancestry],'Languages');
    ancestralLanguages.forEach(l => {
      if(howMany > 0 && choices.includes(l)) {
        attributes['languages.' + l] = 1;
        howMany--;
        choices = choices.filter(x => x != l);
      }
    });
    while(howMany > 0 && choices.length > 0) {
      attr = choices[QuilvynUtils.random(0, choices.length - 1)];
      attributes['languages.' + attr] = 1;
      choices = choices.filter(x => x != attr);
      howMany--;
    }
  } else if(attribute == 'powers') {
    if(attributes['concepts.Cleric'] || attributes['edges.Cleric'])
      attributes['powers.Healing'] = 1;
  }

  SWADE.randomizeOneAttribute.apply(this, [attributes, attribute]);

};

/* Returns an array of plugins upon which this one depends. */
PF4SW.getPlugins = function() {
  let result = [SWADE].concat(SWADE.getPlugins());
  return result;
};

/* Returns HTML body content for user notes associated with this rule set. */
PF4SW.ruleNotes = function() {
  return '' +
    '<h2>PF4SW Quilvyn Module Notes</h2>\n' +
    'PF4SW Quilvyn Module Version ' + PF4SW.VERSION + '\n' +
    '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Skills continue to show their normally linked attribute when a\n' +
    "    feature changes the linked attribute (e.g., the Druid's Nature\n" +
    '    feature changes the linked attribute for the Survival skill from\n' +
    '    Smarts to Spirit). Quilvyn uses the new attribute when calculating\n' +
    '    the skill rank.\n' +
    '  </li><li>\n' +
    '  Discussion of adding different types of homebrew options to the' +
    '  PF4SW rule set can be found in <a href="plugins/homebrew-pf4sw.html">PF4SW Homebrew Examples</a>.\n' +
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
    'Pathfinder Roleplaying Game for Savage Worlds Adventure Edition Core Rules © 2021 Pinnacle Entertainment Group.\n' +
    '</p>\n' +
    '<img alt="Savage Worlds Fan Logo" width="300" height="200" src="https://peginc.com/wp-content/uploads/2019/01/SW_LOGO_FP_2018.png"/>\n';
};
