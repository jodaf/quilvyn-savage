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

  rules.defineChoice('choices', PF4SW.CHOICES);
  rules.choiceEditorElements = PF4SW.choiceEditorElements;
  rules.choiceRules = PF4SW.choiceRules;
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
    'race:Ancestry,select-one,races', 'advances:Advances,text,4',
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
    (rules, PF4SW.RACES, PF4SW.CONCEPTS, PF4SW.DEITIES, PF4SW.ALIGNMENTS);

  Quilvyn.addRuleSet(rules);

}

// Throughout the plugin we take steps to show 'Ancestry' to the user to match
// the rule book, but under the hood we use 'race' for the character attribute
// so that we can easily reuse SWADE rules.
PF4SW.CHOICES =
  SWADE.CHOICES.map(x => x == 'Race' ? 'Ancestry' : x).concat('Alignment');
// Put deity before edges so that we can randomize domain edge properly
PF4SW.RANDOMIZABLE_ATTRIBUTES =
  ['deity'].concat(SWADE.RANDOMIZABLE_ATTRIBUTES.filter(x => x != 'deity').map(x => x == 'race' ? 'ancestry' : x), 'languages', 'alignment');

PF4SW.VERSION = '2.3.1.2';

PF4SW.ALIGNMENTS = {
  'Good':'',
  'Neutral':'',
  'Evil':''
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
  'Intimidating Glare':
    'Type=class,Barbarian Require="advances >= 8",features.Barbarian',
  'Strength Surge':
    'Type=class,Barbarian Require="advances >= 12",features.Barbarian',
  'Bard':'Type=class Require="spirit >= 6","skills.Common Knowledge >= 6"',
  'Inspire Heroics':'Type=class,Bard Require="advances >= 4",features.Bard',
  'Countersong':'Type=class,Bard Require="advances >= 8",features.Bard',
  'Dirge Of Doom':'Type=class,Bard Require="advances >= 12",features.Bard',
  'Cleric':'Type=class Require="spirit >= 6","skills.Occult >= 6"',
  'Arcane Background (Civilization Domain)':
    'Type=class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Civilization\'"',
  'Arcane Background (Death Domain)':
    'Type=class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Death\'"',
  'Arcane Background (Destruction Domain)':
    'Type=class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Destruction\'"',
  'Arcane Background (Elemental Domain)':
    'Type=class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Elemental\'"',
  'Arcane Background (Glory Domain)':
    'Type=class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Glory\'"',
  'Arcane Background (Knowledge Domain)':
    'Type=class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Knowledge\'"',
  'Arcane Background (Luck Domain)':
    'Type=class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Luck\'"',
  'Arcane Background (Magic Domain)':
    'Type=class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Magic\'"',
  'Arcane Background (Nature Domain)':
    'Type=class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Nature\'"',
  'Arcane Background (Protection Domain)':
    'Type=class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Protection\'"',
  'Arcane Background (Strength Domain)':
    'Type=class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Strength\'"',
  'Arcane Background (Sun Domain)':
    'Type=class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Sun\'"',
  'Arcane Background (Travel Domain)':
    'Type=class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Travel\'"',
  'Arcane Background (Trickery Domain)':
    'Type=class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'Trickery\'"',
  'Arcane Background (War Domain)':
    'Type=class ' +
    'Require="features.Cleric || features.Arcane Background (Miracles)",' +
            '"deity == \'None\' || deityDomains =~ \'War\'"',
  'Destroy Undead':'Type=class,Cleric Require="advances >= 4",features.Cleric',
  'Favored Powers (Cleric)':
    'Type=class,Cleric Require="advances >= 8",features.Cleric',
  'Divine Mastery':
    'Type=class,Cleric,Druid ' +
    'Require="advances >= 12","features.Cleric || features.Druid"',
  'Druid':'Type=class Require="spirit >= 6","skills.Survival >= 6"',
  'Attuned':'Type=class,Druid Require=features.Druid',
  'Wild Shape':'Type=class,Druid Require="advances >= 4",features.Druid',
  'Favored Powers (Druid)':
    'Type=class,Druid Require="advances >= 8",features.Druid',
  'Fighter':'Type=class Require="strength >= 6","skills.Fighting >= 6"',
  'Deadly Blow':'Type=class,Fighter Require="advances >= 4",features.Fighter',
  'Martial Flexibility (Improved)':
    'Type=class,Fighter Require="advances >= 7",features.Fighter',
  'Martial Prowess':
    'Type=class,Fighter Require="advances >= 12",features.Fighter',
  'Monk':
    'Type=class Require="agility >= 6","spirit >= 6","skills.Fighting >= 6"',
  'Mystic Powers (Monk)':
    'Type=class,Monk Require="advances >= 4",features.Monk',
  'Great Ki':
    'Type=class,Monk Require="advances >= 8","features.Mystic Powers (Monk)"',
  'Wholeness Of Body':
    'Type=class,Monk Require="advances >= 12","features.Mystic Powers (Monk)"',
  'Paladin':
    'Type=class ' +
    'Require="spirit >= 6","strength >= 6","hindrances.Vow || hindrances.Vow+"',
  'Mystic Powers (Paladin)':
    'Type=class,Paladin Require="advances >= 4",features.Paladin',
  'Mercy':'Type=class,Paladin Require="advances >= 8",features.Paladin',
  'Mount':'Type=class,Paladin Require="advances >= 12",features.Paladin',
  'Ranger':
    'Type=class ' +
    'Require="skills.Athletics >= 6 || skills.Fighting >= 6 || skills.Shooting >= 6","skills.Survival >= 6"',
  'Quarry':'Type=class,Ranger Require="advances >= 4",features.Ranger',
  'Mystic Powers (Ranger)':
    'Type=class,Ranger Require="advances >= 8",features.Ranger',
  'Master Hunter':'Type=class,Ranger Require="advances >= 12",features.Ranger',
  'Rogue':
    'Type=class ' +
    'Require="agility >= 6","skills.Notice >= 6","skills.Stealth >= 6"',
  'Trap Sense':'Type=class,Rogue Require="advances >= 4",features.Rogue',
  'Uncanny Reflexes':'Type=class,Rogue Require="advances >= 8",features.Rogue',
  'Opportunist':'Type=class,Rogue Require="advances >= 12",features.Rogue',
  'Sorcerer':'Type=class Require="smarts >= 6","spirit >= 6"',
  'Favored Powers (Sorcerer)':
    'Type=class,Sorcerer Require="advances >= 4",features.Sorcerer',
  'Aberrant Bloodline':
    'Type=class,Sorcerer,bloodline ' +
    'Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Abyssal Bloodline':
    'Type=class,Sorcerer,bloodline ' +
    'Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Arcane Bloodline':
    'Type=class,Sorcerer,bloodline ' +
    'Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Celestial Bloodline':
    'Type=class,Sorcerer,bloodline ' +
    'Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Destined Bloodline':
    'Type=class,Sorcerer,bloodline ' +
    'Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Draconic Bloodline':
    'Type=class,Sorcerer,bloodline ' +
    'Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Elemental Bloodline (Air)':
    'Type=class,Sorcerer,bloodline ' +
    'Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Elemental Bloodline (Earth)':
    'Type=class,Sorcerer,bloodline ' +
    'Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Elemental Bloodline (Fire)':
    'Type=class,Sorcerer,bloodline ' +
    'Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Elemental Bloodline (Water)':
    'Type=class,Sorcerer,bloodline ' +
    'Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Fey Bloodline':
    'Type=class,Sorcerer,bloodline ' +
    'Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Infernal Bloodline':
    'Type=class,Sorcerer,bloodline ' +
    'Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Undead Bloodline':
    'Type=class,Sorcerer,bloodline ' +
    'Require=features.Sorcerer,"bloodlineEdgeCount == 1"',
  'Arcane Mastery':
    'Type=class,Sorcerer,Wizard ' +
    'Require="advances >= 8","features.Sorcerer || features.Wizard"',
  'Advanced Bloodline':
    'Type=class,Sorcerer Require="advances >= 12",features.Sorcerer',
  'Wizard':'Type=class Require="smarts >= 6","skills.Occult >= 6"',
  'Bonded Object':
    'Type=class,Wizard ' +
    'Require="features.Arcane Bond || features.Arcane Bloodline"',
  'Familiar':
    'Type=class,Wizard ' +
    'Require="features.Arcane Bond || features.Arcane Bloodline"',
  'Favored Powers (Wizard)':
    'Type=class,Wizard Require="advances >= 4",features.Wizard',
  'Eldritch Inspiration':
    'Type=class,Wizard Require="advances >= 12",features.Wizard',
  // Combat
  'Formation Fighter':'Type=combat Require="skills.Fighting >= 8"',
  'Rapid Reload':'Type=combat Require="skills.Shooting >= 6"',
  'Rapid Shot':SWADE.EDGES['Rapid Fire'],
  'Improved Rapid Shot':
    SWADE.EDGES['Improved Rapid Fire'].replaceAll('Fire', 'Shot'),
  'Improved Trademark Weapon (%weapon)': // Changed requirements
    'Type=combat ' +
    'Imply="weapons.%weapon" ' +
    'Require="advances >= 8","features.Trademark Weapon (%weapon)"',
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
  'Mystic Theurge':
    'Type=prestige ' +
    'Require="advances >= 4","arcaneEdgeCount >= 2","powerPoints >= 1"',
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
  'Scholar (Academics)': // Changed requirements
    'Type=professional Require="smarts >= 8"',
  'Scholar (Battle)':'Type=professional Require="smarts >= 8"',
  'Scholar (Occult)':'Type=professional Require="smarts >= 8"',
  'Scholar (Science)':'Type=professional Require="smarts >= 8"',
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
  'Aberrant Bloodline':
    'Section=arcana,combat ' +
    'Note="May cast <i>Bolt</i>, <i>Blast</i>, and <i>Burst</i> only with Lingering Damage for +1 Power Point",' +
         '"+1 Toughness"',
  'Abyssal Bloodline':
    'Section=combat ' +
    'Note="+1 Toughness/Claws inflict d%{strength}+d4 damage/Has Resistance to electricity"',
  'Advanced Aberrant Bloodline':
    'Section=combat Note="+1 Toughness/Immune to surprise and The Drop"',
  'Advanced Abyssal Bloodline':
    'Section=arcana,combat ' +
    'Note="<i>Summon Ally</i> costs -2 Power Points; summoned entities inflict Fear",' +
         '"Has Resistance to cold and fire"',
  'Advanced Arcane Bloodline':
    'Section=skill Note="May reroll failed Spellcasting"',
  'Advanced Bloodline':
    'Section=feature Note="Has Advanced %V Bloodline features"',
  'Advanced Celestial Bloodline':
    'Section=combat Note="Angel wings grant Flight 12"',
  'Advanced Destined Bloodline':
    'Section=feature Note="+1 Benny each session"',
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
  'Advanced Infernal Bloodline':
    'Section=combat Note="Bat wings grant Flight 12"',
  'Advanced Undead Bloodline':
    'Section=feature Note="Has Undead, Outsider+, and Ugly+ features"',
  'Angel Of Death':'Section=combat Note="May disintegrate slain victim"',
  'Arcane Archer':
    'Section=feature ' +
    'Note="May apply Enhance Arrow feature or Arrow Trapping feature to each shot"',
  'Arcane Archer II':
    'Section=feature ' +
    'Note="May apply Phase Arrow and Hail Of Arrows features 1/encounter"',
  'Arcane Archer III':
    'Section=feature ' +
    'Note="May apply Imbue Arrow feature 1/tn and Death Arrow feature 1/dy"',
  'Arcane Armor':
    'Section=arcana Note="May cast spells in %V armor w/out penalty"',
  'Arcane Background (Bard)':
    'Section=arcana Note="3 Powers/10 Power Points"',
  'Arcane Background (Cleric)':
    'Section=arcana Note="3 Powers/10 Power Points"',
  'Arcane Background (Druid)':
    'Section=arcana Note="3 Powers/10 Power Points"',
  'Arcane Background (Magic)': // Modified from SWADE
    'Section=arcana,feature ' +
    'Note="3 Powers/10 Power Points",' +
         '"Has Armor Interference feature"',
  'Arcane Background (Miracles)':
    'Section=arcana,feature ' +
    'Note="3 Powers/10 Power Points","Has Domain and Vow+ features"',
  'Arcane Background (Sorcerer)':
    'Section=arcana,skill ' +
    'Note="2 Powers/15 Power Points",' +
         '"Spellcasting linked to Spirit instead of Smarts"',
  'Arcane Background (Wizard)':
    'Section=arcana Note="3 Powers/10 Power Points"',
  'Arcane Background (Civilization Domain)':
    'Section=arcana Note="Has access to additional powers"',
  'Arcane Background (Death Domain)':
    'Section=arcana Note="Has access to additional powers"',
  'Arcane Background (Destruction Domain)':
    'Section=arcana Note="Has access to additional powers"',
  'Arcane Background (Elemental Domain)':
    'Section=arcana Note="Has access to additional powers"',
  'Arcane Background (Glory Domain)':
    'Section=arcana Note="Has access to additional powers"',
  'Arcane Background (Knowledge Domain)':
    'Section=arcana Note="Has access to additional powers"',
  'Arcane Background (Luck Domain)':
    'Section=arcana Note="Has access to additional powers"',
  'Arcane Background (Magic Domain)':
    'Section=arcana Note="Has access to additional powers"',
  'Arcane Background (Nature Domain)':
    'Section=arcana Note="Has access to additional powers"',
  'Arcane Background (Protection Domain)':
    'Section=arcana Note="Has access to additional powers"',
  'Arcane Background (Strength Domain)':
    'Section=arcana Note="Has access to additional powers"',
  'Arcane Background (Sun Domain)':
    'Section=arcana Note="Has access to additional powers"',
  'Arcane Background (Travel Domain)':
    'Section=arcana Note="Has access to additional powers"',
  'Arcane Background (Trickery Domain)':
    'Section=arcana Note="Has access to additional powers"',
  'Arcane Background (War Domain)':
    'Section=arcana Note="Has access to additional powers"',
  'Arcane Bloodline':
    'Section=feature Note="+1 Edge Points (Bonded Object or Familiar)"',
  'Arcane Bond':
    'Section=feature Note="+1 Edge Points (Bonded Object or Familiar)"',
  'Arcane Mastery':
    'Section=arcana Note="May use epic power modifiers on arcane spells"',
  'Arcane Trickster':
    'Section=feature ' +
    'Note="May use Impromptu Attack feature 1/encounter and Ranged Legerdemain feature"',
  'Arcane Trickster II':
    'Section=feature Note="May use Invisible Thief feature 1/dy"',
  'Arcane Trickster III':'Section=feature Note="Has Surprise Spells feature"',
  'Armor Interference':
    'Section=attribute,skill ' +
    'Note="-4 Agility w/%1 armor or shield",' +
         '"-4 %2Agility-based skills w/%1 armor or shield"',
  'Armor Restriction':
    'Section=attribute,skill ' +
    'Note="-4 Agility w/%V armor or shield",' +
         '"-4 Agility-based skills w/%V armor or shield"',
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
    'Section=skill Note="Gains +1 Spellcasting when object held or worn"',
  'Born In The Saddle':
    'Section=skill ' +
    'Note="May make free reroll on Riding; +2 mount Pace, +1 mount Run step"',
  'Breath Weapon':
    'Section=combat Note="9\\" cone inflicts 3d6 damage plus energy effects"',
  'Call Down The Legends':'Section=combat Note="May summon 5 shades for 1 hr"',
  'Celestial Bloodline':
    'Section=arcana,combat ' +
    'Note="<i>Bolt</i>, <i>Blast</i>, and <i>Burst</i> inflict +2 damage on evil creatures",' +
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
    'Note="R5\\" Self and allies gain reroll to resist and recover from spells"',
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
    'Note="R2\\" May spend 2 Power Points to inflict wound on all undead (Spirit neg)"',
  'Detect Evil':
    'Section=arcana ' +
    'Note="R%{smarts}\\" May detect evil creature or object at will"',
  'Dirge Of Doom':
    'Section=arcana ' +
    'Note="R10\\" May inflict -2 on foe Soak roll, Trait reroll, or damage reroll"',
  'Divine Mastery':
    'Section=arcana Note="May use epic power modifiers on divine spells"',
  'Domain':'Section=feature Note="+1 Edge Points (domain)"',
  'Draconic Bloodline':
    'Section=arcana,combat ' +
    'Note="+1 damage from powers w/draconic trappings",' +
         '"+2 Armor/Claws inflict d%{strength}+d4"',
  'Dragon Disciple':
    'Section=feature Note="May use Breath Weapon feature 1/encounter"',
  'Dragon Disciple II':'Section=feature Note="Has Wings feature"',
  'Dragon Disciple III':
    'Section=feature ' +
    'Note="May use Dragon Form feature for 5 min (10 min inflicts 1 level of fatigue) 2/dy"',
  'Dragon Form':
    'Section=combat ' +
    'Note="Gains Size 3, Strength d12, Vigor d10, Armor 4, Bite and Claw inflict d%{strength}+d8, AP 2, Resistance to heritage energy"',
  'Druid':
    'Section=feature ' +
    'Note="Has Arcane Background (Druid), Armor Interference, Nature Bond, Nature Sense, Secret Language (Druidic), Vow+, and Wilderness Stride features"',
  'Duelist':'Section=feature Note="Has Surgical Strike and Parry features"',
  'Duelist II':'Section=feature Note="Has Crippling Strike feature"',
  'Duelist III':'Section=feature Note="Has Deflect Arrows feature"',
  'Eldritch Inspiration':
    'Section=arcana Note="May spend Benny to cast spell from spellbook"',
  'Eldritch Knight':'Section=feature Note="Has Eldritch Recharge feature"',
  'Eldritch Knight II':'Section=feature Note="Has Eldritch Strike feature"',
  'Eldritch Knight III':
    'Section=feature Note="Has Eldritch Strike (Improved) feature"',
  'Eldritch Recharge':
    'Section=arcana Note="Raise on attack restores 1 Power Point"',
  'Eldritch Strike':
    'Section=arcana Note="May spend 2 Power Points for +2 attack"',
  'Eldritch Strike (Improved)':
    'Section=arcana Note="May spend 2 Power Points for +2 damage"',
  'Elemental Bloodline (Air)':'Section=combat Note="May fly at Pace 6"',
  'Elemental Bloodline (Earth)':'Section=combat Note="May burrow at Pace 6"',
  'Elemental Bloodline (Fire)':
    'Section=arcana Note="Powers with fire trapping inflict +2 damage"',
  'Elemental Bloodline (Water)':
    'Section=arcana Note="Powers hinder targets"',
  'Enhance Arrow':
    'Section=combat Note="Arrow gains +1 attack and inflicts +1 damage"',
  'Enraged':
    'Section=feature ' +
    'Note="Ignores 2 points of wound penalties and all fatigue penalties"',
  'Epic Tales':
    'Section=feature Note="Allies hearing story during rest each gain 1 Benny"',
  'Familiar':
    'Section=feature ' +
    'Note="Can communicate w/magical, Wild Card pet that stores 5 Power Points"',
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
    'Note="May reroll failed attacks against %V chosen creature type",' +
         '"May reroll failed Survival to track %V chosen creature type"',
  'Favored Terrain':
    'Section=combat Note="Gains additional Action Card in %V chosen terrain"',
  'Fey Bloodline':
    'Section=combat ' +
    'Note="Ignores movement penalties for difficult ground/Touch inflicts Distracted"',
  'Fighter':'Section=feature Note="Has Martial Flexibility feature"',
  'Formation Fighter':'Section=combat Note="+1 Gang Up bonus (+4 max)"',
  'Fury':
    'Section=combat ' +
    'Note="+%V Strength step; every attack must be a Wild Attack"',
  'Great Ki':
    'Section=arcana ' +
    'Note="May use Mystic Powers (Monk) to cast <i>Boost Trait</i> (Strength), <i>Protection</i>, <i>Wall Walker</i>, and <i>Warrior\'s Gift</i>"',
  'Greater Darkvision':
    'Section=feature Note="R20\\" Sees clearly in pitch darkness"',
  'Greater Lore':'Section=arcana Note="+2 Power Count"',
  'Hail Of Arrows':'Section=combat Note="Arrow effects all in 3\\" radius"',
  'Healer':'Section=skill Note="May reroll Healing"', // Modified from SWADE
  'Hide In Plain Sight':
    'Section=arcana Note="May become invisible at will when immobile"',
  'Imbue Arrow':'Section=arcana Note="Centers area spell where arrow lands"',
  'Impromptu Attack':
    'Section=combat Note="May use Sneak Attack on non-Vulnerable foe"',
  'Infernal Bloodline':
    'Section=arcana,combat ' +
    'Note="Powers with fire trapping inflict +1 damage",' +
         '"Has Resistance to fire and immunity to poison"',
  'Inspire Heroics':
    'Section=feature ' +
    'Note="R%{smarts}\\" May spend Benny 1/encounter to grant 5 Trait or damage rerolls"',
  'Intimidating Glare':
    'Section=combat ' +
    'Note="May take free Intimidation action when Action card is jack or better"',
  'Invisible Thief':
    'Section=arcana ' +
    'Note="May spend 1 Power Point to cast <i>Invisibility</i> w/automatic raise"',
  'Linguist': // Modified from SWADE
    'Section=skill Note="+%V Language Count"',
  'Lore':
    'Section=skill ' +
    'Note="May reroll Academics, Common Knowledge, Occult, and Science"',
  'Loremaster':'Section=feature Note="Has Lore feature"',
  'Loremaster II':'Section=feature Note="Has Secret (Loremaster) feature"',
  'Loremaster III':'Section=feature Note="Has Greater Lore feature"',
  'Martial Discipline':'Section=combat Note="+1 Toughness in no armor"',
  'Martial Flexibility':
    'Section=combat ' +
    'Note="May gain benefits of combat edge for 5 rd %V/encounter"',
  'Martial Flexibility (Improved)':
    'Section=combat Note="Increased Martial Flexibility effects"',
  'Martial Prowess':'Section=combat Note="May reroll failed combat attacks"',
  'Master Hunter':
    'Section=feature ' +
    'Note="Successful attacks on favored enemy inflict +d6 damage"',
  'Mercy':
    'Section=arcana ' +
    'Note="R%{spirit}\\" Removes Distracted, Shaken, or Vulnerable from target"',
  'Mobility':'Section=combat Note="+1 Run step"',
  'Monk':
    'Section=feature ' +
    'Note="Has Armor Restriction, Martial Discipline, Mobility, Stunning Fist, and Unarmed Strike features"',
  'Mount':
    'Section=feature ' +
    'Note="Bonded mount gains Resilience and two advances, may be summoned"',
  'Mystic Powers (Monk)':
    'Section=arcana ' +
    'Note="10 Power Points/May cast <i>Boost Trait</i> (Agility, Athletics, Fighting, or Stealth), <i>Deflection</i>, <i>Smite</i>, and <i>Speed</i> on self w/automatic success (+2 Power Points for raise)"',
  'Mystic Powers (Paladin)':
    'Section=arcana ' +
    'Note="10 Power Points/May cast self <i>Boost Trait</i> (Fighting, Strength, or Vigor), self <i>Smite</i>, <i>Healing</i>, and <i>Relief</i> w/automatic success (+2 Power Points for raise)"',
  'Mystic Powers (Ranger)':
    'Section=arcana ' +
    'Note="10 Power Points/May cast <i>Beast Friend</i>, self <i>Boost Trait</i> (Athletics, Fighting, or Shooting), <i>Entangle</i>, and self <i>Warrior\'s Gift</i> w/automatic success (+2 Power Points for raise)"',
  'Mystic Powers (Shadow Force)':
    'Section=arcana ' +
    'Note="10 Power Points/May cast <i>Blast</i>, <i>Illusion</i>, <i>Summon Ally</i>, and self <i>Teleport</i> w/automatic success (+2 Power Points for raise)"',
  'Mystic Theurge':'Section=feature Note="Has Combined Spells feature"',
  'Mystic Theurge II':'Section=feature Note="Has Spell Synergy feature"',
  'Mystic Theurge III':'Section=feature Note="Has Spell Synthesis feature"',
  'Nature Bond':
    'Section=feature Note="+1 Edge Points (Attuned or Beast Master)"',
  'Nature Sense':
    'Section=skill Note="Survival linked to Spirit instead of Smarts"',
  'Opportunist':
    'Section=combat ' +
    'Note="May attack foe who is using Extraction on Withdraw; foe w/out Extraction is Vulnerable"',
  'Paladin':
    'Section=feature ' +
    'Note="Has Aura Of Courage, Code Of Honor+, Detect Evil, and Smite Evil features"',
  'Parry':'Section=combat Note="Defend maneuver gives +6 Parry"',
  'Pathfinder Chronicler':'Section=feature Note="Has Pathfinding feature"',
  'Pathfinder Chronicler II':
    'Section=feature Note="May use Epic Tales feature 1/session"',
  'Pathfinder Chronicler III':
    'Section=feature Note="May use Call Down The Legends feature 1/wk"',
  'Pathfinding':
    'Section=feature ' +
    'Note="Increases travel speed to known locations by 10%; successful Smarts-2 discards Enemies card"',
  'Phase Arrow':'Section=combat Note="Arrow passes through obstacles"',
  'Powerful Blow':'Section=combat Note="Wild Attack does +4 damage"',
  'Quarry':
    'Section=feature Note="Gains additional Favored Enemy and Favored Terrain"',
  'Rage':
    'Section=combat ' +
    'Note="Has Fury, Enraged, and Reckless Abandon features for 5 rd at will or when Shaken or wounded (Smarts neg); suffers 1 level of fatigue afterward until 1 hr rest"',
  'Ranger':
    'Section=feature ' +
    'Note="Has Armor Restriction, Favored Enemy, Favored Terrain, and Wilderness Stride features"',
  'Rapid Reload':
    'Section=combat Note="Reduces reload value of chosen ranged weapon by 1"',
  'Ranged Legerdemain':'Section=skill Note="May use R5\\" Thievery-2"',
  'Reckless Abandon':
    'Section=combat ' +
    'Note="Critical failure on attack hits random target or self"',
  'Resistance To Poison':'Section=combat Note="+4 to resist poison"',
  'Rogue':
    'Section=feature Note="Has Armor Restriction and Sneak Attack features"',
  'School':
    'Section=feature ' +
    'Note="May select specialist school (free casting reroll) and two opposition schools (-2 casting rolls)"',
  'Secret (Loremaster)':
    'Section=feature Note="May use chosen feature from any core class"',
  'Secret Language (Druidic)':
    'Section=feature Note="Can converse secretly w/other druids"',
  'Shadow Cloak':
    'Section=combat ' +
    'Note="May attempt free Soak when wounded in dim or dark illumination"',
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
    'Note="Raise on Unarmed Strike makes foe choice of Distracted or Vulnerable"',
  'Surgical Strike':
    'Section=combat Note="+2 damage with light weapons (MinStr <= d6)"',
  'Surprise Spells':
    'Section=arcana Note="May use Sneak Attack feature with attack spells"',
  'Swift Death':'Section=combat Note="May attack aware foe w/The Drop"',
  'Trap Sense':
    'Section=feature ' +
    'Note="R5\\" Attempts Notice for traps automatically; ignores 2 points penalty to evade and disarm"',
  'Troubadour':
    'Section=skill ' +
    'Note="+2 Common Knowledge/May use Performance in place of Battle"',
  'Unarmed Strike':
    'Section=combat ' +
    'Note="+1 Unarmed attacks, AP +2, damage d%{strength}+d4, always considered armed"',
  'Uncanny Reflexes':
    'Section=combat ' +
    'Note="Ignores penalty for normal Evasion; may use Evasion at -2 for any area effect"',
  'Undead':
    'Section=combat ' +
    'Note="+2 Toughness/+2 Shaken recovery/Takes no additional damage from Called Shot/Ignores 1 point of wound penalties/Doesn\'t breathe or eat/Immune to disease and poison/Doesn\'t Bleed Out or heal naturally/R10\\" Ignores illumination penalties"',
  'Undead Bloodline':
    'Section=combat Note="Has Resistance to cold/+1 Soak"',
  'Wholeness Of Body':
    'Section=arcana Note="May spend 2 Power Points to attempt Soak roll"',
  'Wild Shape':
    'Section=arcana Note="May cast <i>Shape Change</i> at double duration"',
  'Wilderness Stride':
    'Section=combat Note="Ignores movement penalties for difficult ground"',
  'Wings':'Section=combat Note="Fly speed 8"',
  'Wizard':
    'Section=feature ' +
    'Note="Has Arcane Background (Wizard), Arcane Bond, Armor Interference, School, and Spellbooks features"',
  'Rapid Shot':SWADE.FEATURES['Rapid Fire'],
  'Improved Rapid Shot':
    SWADE.FEATURES['Improved Rapid Fire'].replaceAll('Fire', 'Shot'),
  'Two-Weapon Fighting':SWADE.FEATURES['Two-Fisted'],
  'Fix It':SWADE.FEATURES['Mister Fix It'],
  // Hindrances
  'Outsider+':
    'Section=feature,skill ' +
    'Note="Strangers are unfriendly or hostile","-2 Persuasion (other races)"',
  'Timid+':SWADE.FEATURES['Yellow+'],
  // Races
  'Adaptability':
    'Section=attribute,feature Note="+1 Attribute Points","+1 Edge Points"',
  'Darkvision':
    'Section=skill Note="Ignores illumination penalties up to 10\\""',
  'Elven Magic':'Section=combat Note="May reroll to resist powers"',
  'Flexibility':'Section=attribute Note="+1 Attribute Points"',
  'Gnome Magic':
    'Section=arcana ' +
    'Note="Knows <i>Beast Friend</i>, <i>Light</i>, <i>Sound</i>, and <i>Telekinesis</i>/1 Power Point"',
  'Intelligence':'Section=attribute Note="+1 Smarts step"',
  'Intimidating':'Section=skill Note="+1 Intimidation step"',
  'Iron Constitution':
    'Section=combat ' +
    'Note="+1 to resist poison/+1 to resist and recover from powers"',
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
    'Section=attribute ' +
    'Note="+1 Strength step (encumbrance and minimum strength requirements)"',
  'Tough':'Section=attribute Note="+1 Vigor step"',
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
      '"End targeted power (Arcane skill neg)"',
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
      '"+10 PP Restores older wound",' +
      '"+15 PP Heals crippling injury",' +
      '"+2/+3 PP 2\\"/3\\" radius heals allies",' +
      '"+1 PP Neutralizes poison or disease"',
  'Illusion':
    'School=Illusion ' +
    'Modifier=' +
      '"+1 PP 3\\" radius",' +
      '"+3 PP Inflicts Shaken (Raise wounds) (Smarts neg)",' +
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
      '"Self sees visions of history of target" ' +
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
      '"Removes Shaken, Distracted, or Vulnerable (Raise 2 of these) or numbs 1 wound or fatigue penalty (Raise 2) for 1 hr"',
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
      '"Creates mundane item that lasts 1 hr"',
  'Curse':
    'Advances=4 ' +
    'PowerPoints=5 ' +
    'Range=touch ' +
    'School=Necromancy ' +
    'Modifier=' +
      '"+5 PP Inflicts fatigue each rd (Spirit neg); incapacity turns to stone" ' +
    'Description=' +
      '"Target suffers 1 level fatigue and additional level each sunset (Spirit neg)"',
  'Locate':
    'Advances=0 ' +
    'PowerPoints=3 ' +
    'Range=self ' +
    'School=Divination ' +
    'Modifier=' +
      '"+1 PP Self learns best path to target" ' +
    'Description=' +
      '"Gives direction of chosen item (-2 if caster has never seen item, running water blocks spell) for 10 min"',
  'Planar Binding':
    'Advances=8 ' +
    'PowerPoints=8 ' +
    'Range=smarts ' +
    'School=Conjuration ' +
    'Description=' +
      '"Summons extraplanar creature to perform service (Spirit neg)"',
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
      '"Self travels to chosen plane, w/in 10d10 miles of known location"',
  'Sanctuary':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=touch ' +
    'School=Enchantment ' +
    'Modifier=' +
      '"+2/+3 PP 2\\"/3\\" radius",' +
      '"+1 PP Spirit-2" ' +
    'Description=' +
      '"Evil creatures cannot attack target (Spirit neg) for 5 rd"',
  'Scrying':
    'Advances=4 ' +
    'PowerPoints=3 ' +
    'Range=self ' +
    'School=Divination ' +
    'Modifier=' +
      '"+1 PP Shares vision with allies in %{smarts}\\" radius" ' +
    'Description=' +
      '"Self sees chosen target (-2 unfamiliar target, Spirit neg) for 5 rd"',
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
      '"Alters reality in exchange for permanent loss of 3 Power Points (Raise no loss)"'
};
PF4SW.POWERS = {};
for(var p in PF4SW.POWERS_CHANGES) {
  PF4SW.POWERS[p] = (SWADE.POWERS[p] || '') + ' ' + PF4SW.POWERS_CHANGES[p];
}
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
    'Languages=Common,Halfling',
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
PF4SW.SHIELDS = {
  'None':'Parry=0 Cover=0 MinStr=0 Weight=0',
  'Light':'Parry=1 Cover=0 MinStr=6 Weight=4',
  'Medium':'Parry=2 Cover=-2 MinStr=8 Weight=8',
  'Heavy':'Parry=2 Cover=-4 MinStr=10 Weight=12'
};
PF4SW.SKILLS = Object.assign({}, SWADE.SKILLS);
delete PF4SW.SKILLS['Electronics'];
delete PF4SW.SKILLS['Focus'];
delete PF4SW.SKILLS['Hacking'];
delete PF4SW.SKILLS['Language (%language)'];
delete PF4SW.SKILLS['Psionics'];
delete PF4SW.SKILLS['Research'];
delete PF4SW.SKILLS['Weird Science'];
PF4SW.WEAPONS = {
  'Bastard Sword':'Damage=Str+d8 MinStr=8 Weight=6 Category=1h AP=1',
  'Battle Axe':'Damage=Str+d8 MinStr=8 Weight=6 Category=1h',
  'Blowgun':'Damage=d4-2 MinStr=4 Weight=1 Category=R Range=3',
  'Bolas':'Damage=Str+d4 MinStr=4 Weight=2 Category=R Range=3',
  'Composite Bow':'Damage=Str+d6 MinStr=6 Weight=3 Category=R Range=12 AP=1',
  'Dagger':'Damage=Str+d4 MinStr=4 Weight=1 Category=1h Range=3',
  'Falchion':'Damage=Str+d8 MinStr=8 Weight=8 Category=1h AP=1',
  'Flail':'Damage=Str+d6 MinStr=6 Weight=5 Category=1h',
  'Glaive':'Damage=Str+d8 MinStr=8 Weight=10 Category=2h',
  'Great Axe':'Damage=Str+d10 MinStr=10 Weight=12 Category=2h AP=3 Parry=-1',
  'Great Sword':'Damage=Str+d10 MinStr=10 Weight=6 Category=2h AP=2',
  'Guisarme':'Damage=Str+d6 MinStr=6 Weight=12 Category=2h AP=1',
  'Halberd':'Damage=Str+d8 MinStr=8 Weight=12 Category=2h AP=1',
  'Hand Axe':'Damage=Str+d6 MinStr=6 Weight=3 Category=1h Range=3',
  'Hand Crossbow':'Damage=2d4 MinStr=4 Weight=2 Category=R Range=5',
  'Hand Repeating Crossbow':'Damage=2d4 MinStr=4 Weight=3 Category=R Range=5',
  'Heavy Club':'Damage=Str+d6 MinStr=6 Weight=5 Category=1h',
  'Heavy Crossbow':'Damage=2d8 MinStr=6 Weight=8 Category=R Range=15 AP=2',
  'Heavy Flail':'Damage=Str+d8 MinStr=8 Weight=10 Category=2h',
  'Heavy Mace':'Damage=Str+d8 MinStr=8 Weight=8 Category=1h AP=1',
  'Heavy Repeating Crossbow':
    'Damage=2d8 MinStr=8 Weight=12 Category=R Range=15 AP=2',
  'Javelin':'Damage=Str+d6 MinStr=6 Weight=3 Category=R Range=4',
  'Katana':'Damage=Str+d6+1 MinStr=6 Weight=3 Category=2h',
  'Knife':'Damage=Str+d4 MinStr=4 Weight=1 Category=1h Range=3',
  'Lance':'Damage=Str+d8 MinStr=8 Weight=10 Category=1h',
  'Light Club':'Damage=Str+d4 MinStr=4 Weight=2 Category=1h',
  'Light Crossbow':'Damage=2d6 MinStr=6 Weight=5 Category=R Range=10 AP=2',
  'Light Mace':'Damage=Str+d6 MinStr=6 Weight=4 Category=1h',
  'Light Repeating Crossbow':
    'Damage=2d6 MinStr=6 Weight=8 Category=R Range=10 AP=2',
  'Long Bow':'Damage=2d6 MinStr=8 Weight=3 Category=R Range=15 AP=1',
  'Long Sword':'Damage=Str+d8 MinStr=8 Weight=4 Category=1h',
  'Maul':'Damage=Str+d10 MinStr=10 Weight=10 Category=2h AP=2',
  'Morningstar':'Damage=Str+d6 MinStr=6 Weight=6 Category=1h',
  'Net':'Damage=d0 MinStr=4 Weight=8 Category=R Range=3',
  'Pike':'Damage=Str+d8 MinStr=8 Weight=18 Category=2h',
  'Quarterstaff':'Damage=Str+d4 MinStr=4 Weight=4 Category=2h Parry=1',
  'Ranseur':'Damage=Str+d6 MinStr=6 Weight=12 Category=1h',
  'Rapier':'Damage=Str+d4 MinStr=4 Weight=2 Category=1h Parry=1',
  'Sap':'Damage=Str+d4 MinStr=4 Weight=1 Category=1h',
  'Scimitar':'Damage=Str+d6 MinStr=6 Weight=4 Category=1h',
  'Scythe':'Damage=Str+d6 MinStr=6 Weight=10 Category=2h',
  'Short Bow':'Damage=2d6 MinStr=6 Weight=2 Category=R Range=12',
  'Short Spear':'Damage=Str+d6 MinStr=6 Weight=3 Category=1h Range=4',
  'Short Sword':'Damage=Str+d6 MinStr=6 Weight=2 Category=1h',
  'Shuriken':'Damage=Str+d4 MinStr=4 Weight=0 Category=R Range=3',
  'Sickle':'Damage=Str+d4 MinStr=4 Weight=2 Category=1h',
  'Sling':'Damage=Str+d4 MinStr=4 Weight=1 Category=R Range=4',
  'Spear':'Damage=Str+d6 MinStr=6 Weight=6 Category=2h Range=3',
  'Spiked Chain':'Damage=Str+d6 MinStr=6 Weight=6 Category=2h AP=1',
  'Staff':'Damage=Str+d4 MinStr=4 Weight=4 Category=2h Parry=1',
  'Starknife':'Damage=Str+d4 MinStr=4 Weight=3 Category=1h Range=3 Parry=1',
  'Trident':'Damage=Str+d6 MinStr=6 Weight=4 Category=1h Range=3 AP=1',
  'Unarmed':'Damage=Str+d0 MinStr=0 Weight=0 Category=Un',
  'Warhammer':'Damage=Str+d6 MinStr=6 Weight=5 Category=1h AP=1',
  'Whip':'Damage=Str+d4 MinStr=4 Weight=2 Category=1h Parry=-1',
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
PF4SW.identityRules = function(rules, races, concepts, deitys, alignments) {
  QuilvynUtils.checkAttrTable(alignments, []);
  SWADE.identityRules(rules, races, {}, concepts, deitys);
  rules.defineEditorElement('race');
  rules.defineEditorElement
    ('race', 'Ancestry', 'select-one', 'races', 'imageUrl');
  rules.defineEditorElement
    ('alignment', 'Alignment', 'select-one', 'alignments', 'deity');
  rules.defineSheetElement('Alignment', 'Deity');
  rules.defineSheetElement('Deity');
  rules.defineSheetElement('DeityInfo', 'Alignment+', '<b>Deity</b>: %V', ' ');
  rules.defineSheetElement('Deity', 'DeityInfo/', '%V');
  rules.defineSheetElement('Deity Alignment', 'DeityInfo/', '(%V)');
  for(var deity in deitys) {
    rules.choiceRules(rules, 'Deity', deity, deitys[deity]);
  }
  for(var alignment in alignments) {
    rules.choiceRules(rules, 'Alignment', alignment, alignments[alignment]);
  }
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
  rules.defineRule('edgePoints', '', '=', '1');
  rules.defineRule
    ('languageCount', 'smarts', '=', '1 + Math.floor(source / 2)');
  rules.defineEditorElement
    ('languages', 'Languages', 'set', 'languages', 'deity');
  rules.defineSheetElement('Languages', 'Skills+', null, '; ');
  QuilvynRules.validAllocationRules
    (rules, 'language', 'languageCount', 'Sum "^languages\\."');
};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
PF4SW.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Alignment')
    PF4SW.alignmentRules(rules, name);
  else if(type == 'Arcana')
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
  else if(type == 'Race' || type == 'Ancestry') {
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

/* Defines in #rules# the rules associated with alignment #name#. */
PF4SW.alignmentRules = function(rules, name) {
  if(!name) {
    console.log('Empty alignment name');
    return;
  }
  // No rules pertain to alignment
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

/*
 * Defines in #rules# the rules associated with deity #name#, who has alignment
 * #alignment# and is associated the the list of domains #domains#.
 */
PF4SW.deityRules = function(rules, name, alignment, domains) {

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
    var bloodline = name.replace(/\s+Bloodline/, '');
    rules.defineRule('featureNotes.advancedBloodline',
      'features.' + name, '=', '"' + bloodline + '"'
    );
    rules.defineRule('features.Advanced ' + name,
      'featureNotes.advancedBloodline', '?', null,
      'features.' + name, '=', '1'
    );
  }
  if(name == 'Advanced Bloodline') {
    rules.defineRule
      ('features.Undead', 'featureNotes.advancedUndeadBloodline', '=', '1');
    rules.defineRule
      ('features.Outsider+', 'featureNotes.advancedUndeadBloodline', '=', '1');
    rules.defineRule
      ('features.Ugly+', 'featureNotes.advancedUndeadBloodline', '=', '1');
  } else if(name == 'Arcane Armor') {
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
    rules.defineRule('features.Armor Interference',
      'featureNotes.arcaneBackground(Magic)', '=', '1'
    );
    rules.defineRule('skillNotes.armorInterference.1',
      'featureNotes.arcaneBackground(Magic)', '=', '"medium or heavy"'
    );
    rules.defineRule('skillNotes.armorInterference.2',
      'featureNotes.arcaneBackground(Magic)', '=', '"Spellcasting and "'
    );
  } else if(name == 'Arcane Background (Miracles)') {
    rules.defineRule('edgePoints', 'featureNotes.domain', '+', '1');
    rules.defineRule
      ('features.Domain', 'featureNotes.arcaneBackground(Miracles)', '=', '1');
    rules.defineRule
      ('features.Vow+', 'featureNotes.arcaneBackground(Miracles)', '=', '1');
  } else if(name == 'Arcane Bloodline') {
    rules.defineRule('edgePoints', 'featureNotes.arcaneBloodline', '+', '1');
  } else if(name == 'Assassin') {
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
  } else if(name == 'Arcane Trickster III') {
    rules.defineRule
      ('features.Surprise Spells', 'featureNotes.arcaneTricksterIII', '=', '1');
  } else if(name == 'Barbarian') {
    rules.defineRule('attributeNotes.armorRestriction',
      'featureNotes.barbarian', '=', '"heavy"'
    );
    rules.defineRule('combatNotes.fury',
      '', '=', '1',
      'combatNotes.strengthSurge', '+', '1'
    );
    rules.defineRule
      ('features.Armor Restriction', 'featureNotes.barbarian', '=', '1');
    rules.defineRule('features.Enraged', 'features.Rage', '=', '1');
    rules.defineRule('features.Fury', 'features.Rage', '=', '1');
    rules.defineRule('features.Fast', 'featureNotes.barbarian', '=', '1');
    rules.defineRule('features.Rage', 'featureNotes.barbarian', '=', '1');
    rules.defineRule('features.Reckless Abandon', 'features.Rage', '=', '1');
    rules.defineRule('skillNotes.armorRestriction',
      'featureNotes.barbarian', '=', '"heavy"'
    );
  } else if(name == 'Bard') {
    rules.defineRule('attributeNotes.armorInterference.1',
      'featureNotes.bard', '=', '"medium or heavy"'
    );
    rules.defineRule
      ('features.Arcane Background (Bard)', 'featureNotes.bard', '=', '1');
    rules.defineRule
      ('features.Armor Interference', 'featureNotes.bard', '=', '1');
    rules.defineRule('features.Sharp Tongued', 'featureNotes.bard', '=', '1');
    rules.defineRule('skillNotes.armorInterference.1',
      'featureNotes.bard', '=', '"medium or heavy"'
    );
    rules.defineRule('skillNotes.armorInterference.2',
      'featureNotes.bard', '=', '"Performance and "'
    );
  } else if(name == 'Cleric') {
    rules.defineRule('edgePoints', 'featureNotes.domain', '+', '1');
    rules.defineRule
      ('features.Arcane Background (Cleric)', 'featureNotes.cleric', '=', '1');
    rules.defineRule
      ('features.Channel Energy', 'featureNotes.cleric', '=', '1');
    rules.defineRule('features.Domain', 'featureNotes.cleric', '=', '1');
    rules.defineRule('features.Vow+', 'featureNotes.cleric', '=', '1');
  } else if(name == 'Draconic Bloodline') {
    rules.defineRule
      ('armorToughness', 'combatNotes.draconicBloodline', '+=', '2');
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
    rules.defineRule('attributeNotes.armorInterference.1',
      'featureNotes.druid', '=', '"medium or heavy"'
    );
    rules.defineRule('edgePoints', 'featureNotes.natureBond', '+', '1');
    rules.defineRule
      ('features.Arcane Background (Druid)', 'featureNotes.druid', '=', '1');
    rules.defineRule
      ('features.Armor Interference', 'featureNotes.druid', '=', '1');
    rules.defineRule('features.Nature Bond', 'featureNotes.druid', '=', '1');
    rules.defineRule('features.Nature Sense', 'featureNotes.druid', '=', '1');
    rules.defineRule
      ('features.Secret Language (Druidic)', 'featureNotes.druid', '=', '1');
    rules.defineRule('features.Vow+', 'featureNotes.druid', '=', '1');
    rules.defineRule
      ('features.Wilderness Stride', 'featureNotes.druid', '=', '1');
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
      'featureNotes.druid', '=', '"Faith and "'
    );
  } else if(name == 'Duelist') {
    rules.defineRule
      ('features.Surgical Strike', 'featureNotes.duelist', '=', '1');
    rules.defineRule('features.Parry', 'featureNotes.duelist', '=', '1');
  } else if(name == 'Duelist II') {
    rules.defineRule
      ('features.Crippling Strike', 'featureNotes.duelistII', '=', '1');
  } else if(name == 'Duelist III') {
    rules.defineRule
      ('features.Deflect Arrows', 'featureNotes.duelistIII', '=', '1');
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
    rules.defineRule('combatNotes.martialFlexibility',
      '', '=', '1',
      'combatNotes.martialFlexibility(Improved)', '+', '1'
    );
    rules.defineRule
      ('features.Martial Flexibility', 'featureNotes.fighter', '=', '1');
  } else if(name == 'Linguist') {
    rules.defineRule('languageCount', 'skillNotes.linguist', '+', null);
    rules.defineRule
      ('skillNotes.linguist', 'smarts', '=', 'Math.floor(source / 2)');
  } else if(name == 'Loremaster') {
    rules.defineRule('features.Lore', 'featureNotes.loremaster', '=', '1');
  } else if(name == 'Loremaster II') {
    rules.defineRule
      ('features.Secret (Loremaster)', 'featureNotes.loremasterII', '=', '1');
  } else if(name == 'Loremaster III') {
    rules.defineRule
      ('features.Greater Lore', 'featureNotes.loremasterIII', '=', '1');
  } else if(name == 'Monk') {
    rules.defineRule
      ('attackAdjustment.Unarmed', 'combatNotes.unarmedStrike', '+=', '1');
    rules.defineRule
      ('attributeNotes.armorRestriction', 'featureNotes.monk', '=', '"any"');
    rules.defineRule('combatNotes.martialDiscipline.1',
      'combatNotes.martialDiscipline', '?', null,
      'armor.None', '=', '1'
    );
    rules.defineRule
      ('damageStep.Unarmed', 'combatNotes.unarmedStrike', '+=', '1');
    rules.defineRule
      ('features.Armor Restriction', 'featureNotes.monk', '=', '1');
    rules.defineRule
      ('features.Martial Discipline', 'featureNotes.monk', '=', '1');
    rules.defineRule('features.Mobility', 'featureNotes.monk', '=', '1');
    rules.defineRule('features.Stunning Fist', 'featureNotes.monk', '=', '1');
    rules.defineRule('features.Unarmed Strike', 'featureNotes.monk', '=', '1');
    rules.defineRule('toughness', 'combatNotes.martialDiscipline.1', '+', null);
    rules.defineRule
      ('skillNotes.armorRestriction', 'featureNotes.monk', '=', '"any"');
  } else if(name == 'Mystic Theurge') {
    rules.defineRule
      ('features.Combined Spells', 'featureNotes.mysticTheurge', '=', '1');
  } else if(name == 'Mystic Theurge II') {
    rules.defineRule
      ('features.Spell Synergy', 'featureNotes.mysticTheurgeII', '=', '1');
  } else if(name == 'Mystic Theurge III') {
    rules.defineRule
      ('features.Spell Synthesis', 'featureNotes.mysticTheurgeIII', '=', '1');
  } else if(name == 'Paladin') {
    rules.defineRule
      ('features.Aura Of Courage', 'featureNotes.paladin', '=', '1');
    rules.defineRule
      ('features.Code Of Honor+', 'featureNotes.paladin', '=', '1');
    rules.defineRule('features.Detect Evil', 'featureNotes.paladin', '=', '1');
    rules.defineRule('features.Smite Evil', 'featureNotes.paladin', '=', '1');
  } else if(name == 'Pathfinder Chronicler') {
    rules.defineRule
      ('features.Pathfinding', 'featureNotes.pathfinderChronicler', '=', '1');
  } else if(name == 'Pathfinder Chronicler II') {
    rules.defineRule
      ('features.Epic Tales', 'featureNotes.pathfinderChroniclerII', '=', '1');
  } else if(name == 'Pathfinder Chronicler III') {
    rules.defineRule('features.Call Down The Legends',
      'featureNotes.pathfinderChroniclerIII', '=', '1'
    );
  } else if(name == 'Ranger') {
    rules.defineRule('attributeNotes.armorRestriction',
      'featureNotes.ranger', '=', '"heavy"'
    );
    rules.defineRule('combatNotes.favoredEnemy',
      '', '=', '1',
      'featureNotes.quarry', '+', null
    );
    rules.defineRule('combatNotes.favoredTerrain',
      '', '=', '1',
      'featureNotes.quarry', '+', null
    );
    rules.defineRule('skillNotes.favoredEnemy',
      '', '=', '1',
      'featureNotes.quarry', '+', null
    );
    rules.defineRule
      ('features.Armor Restriction', 'featureNotes.ranger', '=', '1');
    rules.defineRule('features.Favored Enemy', 'featureNotes.ranger', '=', '1');
    rules.defineRule
      ('features.Favored Terrain', 'featureNotes.ranger', '=', '1');
    rules.defineRule
      ('features.Wilderness Stride', 'featureNotes.ranger', '=', '1');
    rules.defineRule
      ('skillNotes.armorRestriction', 'featureNotes.ranger', '=', '"heavy"');
  } else if(name == 'Rapid Shot') {
    rules.defineRule('combatNotes.rapidShot',
      '', '=', '1',
      'combatNotes.improvedRapidShot', '+', '1'
    );
  } else if(name == 'Rogue') {
    rules.defineRule('attributeNotes.armorRestriction',
      'featureNotes.rogue', '=', '"medium or heavy"'
    );
    rules.defineRule
      ('features.Armor Restriction', 'featureNotes.rogue', '=', '1');
    rules.defineRule('features.Sneak Attack', 'featureNotes.rogue', '=', '1');
    rules.defineRule('skillNotes.armorRestriction',
      'featureNotes.rogue', '=', '"medium or heavy"'
    );
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
    rules.defineRule('attributeNotes.armorInterference.1',
      'featureNotes.sorcerer', '=', '"any"'
    );
    rules.defineRule('edgePoints', 'featureNotes.bloodline', '+', '1');
    rules.defineRule('features.Arcane Background (Sorcerer)',
      'featureNotes.sorcerer', '=', '1'
    );
    rules.defineRule
      ('features.Armor Interference', 'featureNotes.sorcerer', '=', '1');
    rules.defineRule('features.Bloodline', 'featureNotes.sorcerer', '=', '1');
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
      'featureNotes.sorcerer', '=', '"Spellcasting and "'
    );
    QuilvynRules.validAllocationRules
      (rules, 'bloodline', 'features.Sorcerer', 'bloodlineEdgeCount');
  } else if(name == 'Wizard') {
    rules.defineRule('attributeNotes.armorInterference.1',
      'featureNotes.wizard', '=', '"any"'
    );
    rules.defineRule('edgePoints', 'featureNotes.arcaneBond', '+', '1');
    rules.defineRule
      ('features.Arcane Background (Wizard)', 'featureNotes.wizard', '=', '1');
    rules.defineRule('features.Arcane Bond', 'featureNotes.wizard', '=', '1');
    rules.defineRule
      ('features.Armor Interference', 'featureNotes.wizard', '=', '1');
    rules.defineRule('features.School', 'featureNotes.wizard', '=', '1');
    rules.defineRule('features.Spellbooks', 'featureNotes.wizard', '=', '1');
    rules.defineRule('skillNotes.armorInterference.1',
      'featureNotes.wizard', '=', '"any"'
    );
    rules.defineRule('skillNotes.armorInterference.2',
      'featureNotes.wizard', '=', '"Spellcasting and "'
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
 * Defines in #rules# the rules associated with race #name#, which has the list
 * of hard prerequisites #requires#. #features# list associated features and
 * #languages# any automatic languages.
 */
PF4SW.raceRules = function(rules, name, requires, features, languages) {
  SWADE.raceRules(rules, name, requires, features, languages);
  var prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  var raceAdvances = prefix + 'Advances';
  languages.forEach(x => {
    rules.defineRule('languages.' + x, raceAdvances, '=', '1');
  });
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
PF4SW.raceRulesExtra = function(rules, name) {
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

/*
 * Returns the list of editing elements needed by #choiceRules# to add a #type#
 * item to #rules#.
 */
PF4SW.choiceEditorElements = function(rules, type) {
  return SWADE.choiceEditorElements(rules, type == 'Ancestry' ? 'Race' : type);
};


/* Sets #attributes#'s #attribute# attribute to a random value. */
PF4SW.randomizeOneAttribute = function(attributes, attribute) {

  var attr;
  var attrs = this.applyRules(attributes);
  var choices;
  var howMany;

  if(attribute == 'ancestry')
    attribute = 'race';

  if(attribute == 'alignment') {
    choices = QuilvynUtils.getKeys(this.getChoices('alignments'));
    attributes.alignment = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'edges') {
    // First, make sure class edge is assigned; otherwise, prerequisite tests
    // for other edges may fail
    var allEdges = this.getChoices('edges');
    if(attributes.concept in allEdges) {
      attributes['edges.' + attributes.concept] = 1;
      attrs = this.applyRules(attributes);
    }
    if((attributes.concept == 'Cleric' ||
        attributes['edges.Arcane Background (Cleric)'] ||
        attributes['edges.Arcane Background (Miracles)']) &&
       QuilvynUtils.sumMatching(attributes, /edges.*Domain/) == 0) {
      var deityAttrs = this.getChoices('deitys')[attributes.deity];
      if(!deityAttrs || !deityAttrs.includes('Domain')) {
        choices = QuilvynUtils.getKeys(this.getChoices('edges'), /Arcane Background.*Domain/);
      } else {
        choices = QuilvynUtils.getAttrValueArray(deityAttrs, 'Domain').map(x => 'Arcane Background (' + x + ' Domain)');
      }
      attributes['edges.' + choices[QuilvynUtils.random(0, choices.length - 1)]] = 1;
    }
    if((attributes.concept == 'Druid' ||
        attributes['edges.Arcane Background (Druid)']) &&
       (!attributes['edges.Attuned'] && !attributes['edges.Beast Master'])) {
      choices = ['Attuned', 'Beast Master'];
      attributes['edges.' + choices[QuilvynUtils.random(0, choices.length - 1)]] = 1;
    }
    if((attributes.concept == 'Sorcerer' ||
        attributes['edges.Arcane Background (Sorcerer)']) &&
       QuilvynUtils.sumMatching(attributes, /edges.*Bloodline$/) -
       QuilvynUtils.sumMatching(attributes, /edges.Advanced.*Bloodline$/) <= 0){
      choices = QuilvynUtils.getKeys(this.getChoices('edges'), /Bloodline$/).filter(x => !x.startsWith('Advanced'));
      attributes['edges.' + choices[QuilvynUtils.random(0, choices.length - 1)]] = 1;
    }
    if((attributes.concept == 'Wizard' ||
        attributes['edges.Arcane Background (Wizard)'] ||
        attributes['edges.Arcane Bloodline']) &&
       (!attributes['edges.Bonded Object'] && !attributes['edges.Familiar'])) {
      choices = ['Bonded Object', 'Familiar'];
      attributes['edges.' + choices[QuilvynUtils.random(0, choices.length - 1)]] = 1;
    }
    // Prioritize edges particular to the character's concept, if any
    if(attributes.concept) {
      choices = [];
      for(attr in allEdges) {
        if(allEdges[attr].match('Type=\\S*' + attributes.concept) &&
           !attributes['edges.' + attr])
          choices.push(attr);
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
        var name = attr.charAt(0).toLowerCase() +
                   attr.substring(1).replaceAll(' ', '');
        if(attrs['validationNotes.' + name + 'Edge'] ||
           attrs['sanityNotes.' + name + 'Edge'])
          delete attributes['edges.' + attr];
        else
          howMany--;
      }
    }
  } else if(attribute == 'hindrances') {
    if((attributes.concept == 'Paladin' || attributes['edges.Paladin']) &&
       !attributes['hindrances.Vow'] &&
       !attributes['hindrances.Vow+'])
      attributes['hindrances.Vow'] = 1;
  } else if(attribute == 'languages') {
    howMany = attrs.languageCount || 1;
    choices = QuilvynUtils.getKeys(this.getChoices('languages'));
    for(attr in attrs) {
      if(attr.startsWith('languages.')) {
        attr = attr.replace('languages.', '');
        choices = choices.filter(x => x != attr);
        howMany--;
      }
    }
    while(howMany > 0 && choices.length > 0) {
      attr = choices[QuilvynUtils.random(0, choices.length - 1)];
      attributes['languages.' + attr] = 1;
      choices = choices.filter(x => x != attr);
      howMany--;
    }
  } else if(attribute == 'powers') {
    if(attributes.concept == 'Cleric' || attributes['edges.Cleric'])
      attributes['powers.Healing'] = 1;
  }

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
    '<h3>Usage Notes</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Skills continue to show their normally linked attribute when a\n' +
    "    feature changes the linked attribute (e.g., the Druid's Nature\n" +
    '    feature changes the linked attribute for the Survival skill from\n' +
    '    Smarts to Spirit). Quilvyn uses the new attribute when calculating\n' +
    '    the skill rank.\n' +
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
