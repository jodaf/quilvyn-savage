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
 * This module loads the rules from the WeirdWest Player's Guide. The WeirdWest
 * function contains methods that load rules for particular parts of the rules:
 * raceRules for character races, arcaneRules for powers, etc. These member
 * methods can be called independently in order to use a subset of the
 * WeirdWest rules. Similarly, the constant fields of WeirdWest (SKILLS, EDGES,
 * etc.) can be manipulated to modify the choices.
 */
function WeirdWest(baseRules) {

  var rules = new QuilvynRules('Deadlands Weird West', WeirdWest.VERSION);
  WeirdWest.rules = rules;

  rules.defineChoice('choices', SWADE.CHOICES);
  rules.choiceEditorElements = SWADE.choiceEditorElements;
  rules.choiceRules = WeirdWest.choiceRules;
  rules.editorElements = SWADE.initialEditorElements();
  rules.getFormats = SWADE.getFormats;
  rules.getPlugins = WeirdWest.getPlugins;
  rules.makeValid = SWADE.makeValid;
  rules.randomizeOneAttribute = WeirdWest.randomizeOneAttribute;
  rules.defineChoice('random', SWADE.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = WeirdWest.ruleNotes;

  SWADE.createViewers(rules, SWADE.VIEWERS);
  rules.defineChoice('extras',
    'edges', 'edgePoints', 'hindrances', 'sanityNotes', 'validationNotes'
  );
  rules.defineChoice('preset',
    'advances:Advances,text,4', 'arcaneFocus:Arcane Focus?,checkbox,',
    'focusType:Focus Type,select-one,arcanas'
  );

  WeirdWest.attributeRules(rules);
  WeirdWest.combatRules
    (rules, WeirdWest.ARMORS, WeirdWest.SHIELDS, WeirdWest.WEAPONS);
  WeirdWest.arcaneRules(rules, WeirdWest.ARCANAS, WeirdWest.POWERS);
  WeirdWest.identityRules(rules, WeirdWest.RACES, WeirdWest.DEITIES);
  WeirdWest.talentRules
    (rules, WeirdWest.EDGES, WeirdWest.FEATURES, WeirdWest.GOODIES,
     WeirdWest.HINDRANCES, WeirdWest.LANGUAGES, WeirdWest.SKILLS);

  Quilvyn.addRuleSet(rules);

}

WeirdWest.VERSION = '2.3.1.0';

WeirdWest.ARCANAS = {
  'Blessed':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection",Banish,Barrier,"Beast Friend",Blind,' +
      '"Boost/Lower Trait",Confusion,Deflection,"Detect Arcana",Dispel,' +
      'Divination,"Elemental Manipulation",Empathy,' +
      '"Environmental Protection",Havoc,Healing,"Holy Symbol",' +
      'Light,Numb,Protection,Relief,Resurrection,Sanctify,Sloth/Speed,Smite,' +
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
WeirdWest.ARMORS = {
  'None':'Area=Body Armor=0 MinStr=4 Weight=0',
  'Chaps':'Area=Legs Armor=1 MinStr=4 Weight=6',
  'Native Armor':'Area=Body Armor=1 MinStr=4 Weight=3',
  'Rattler Hide Duster':'Area=Body Armor=2 MinStr=4 Weight=4'
};
WeirdWest.DEITIES = {
  'None':'',
};
WeirdWest.EDGES_ADDED = {
  // Background
  'Arcane Background (Blessed)':
    'Type=background Require="spirit >= 6","skills.Faith >= 4"',
  'Arcane Background (Chi Master)':
    'Type=background ' +
    'Require=' +
      '"agility >= 6",' +
      '"spirit >= 6",' +
      '"features.Martial Artist",' +
      '"skills.Focus >= 4"',
  'Arcane Background (Huckster)':
    'Type=background Require="skills.Gambling >= 6","skills.Spellcasting >= 4"',
  'Arcane Background (Mad Scientist)':
    'Type=background ' +
    'Require="smarts >= 8","skills.Science >= 6","skills.Weird Science >= 4"',
  'Arcane Background (Shaman)':
    'Type=background Require="spirit >= 8","skills.Faith >= 4"',
  'Gallows Humor':'Type=background Require="skills.Taunt >= 6"',
  "Veteran O' The Weird West":
    'Type=background Require="spirit >= 6","skills.Occult >= 6"',
  // Combat
  "Don't Get 'im Riled!":'Type=combat',
  'Duelist':'Type=combat Require="skills.Shooting >= 6"',
  'Fan The Hammer':
    'Type=combat Require="advances >= 4","agility >= 8","skills.Shooting >= 8"',
  'Improved Fan The Hammer':
    'Type=combat ' +
    'Require=' +
      '"advances >= 12",' +
      '"agility >= 10",' +
      '"features.Fan The Hammer",' +
      '"skills.Shooting >= 10"',
  'Quick Draw':'Type=combat Require="agility >= 8"',
  // Professional
  'Agent':
    'Type=professional ' +
    'Require=' +
      '"smarts >= 8",' +
      '"skills.Fighting >= 6",' +
      '"skills.Occult >= 6",' +
      '"skills.Shooting >= 6"',
  'Born In The Saddle':
    'Type=professional Require="agility >= 8","skills.Riding >= 6"',
  'Card Sharp':'Type=professional Require="skills.Gambling >= 6"',
  'Guts':'Type=professional Require="spirit >= 6"',
  'Scout':'Type=professional Require="advances >= 4",features.Woodsman',
  'Tale-Teller':
    'Type=professional ' +
    'Require="skills.Performance >= 8 || skills.Persuasion >= 8"',
  'Territorial Ranger':
    'Type=professional ' +
    'Require=' +
      '"vigor >= 6",' +
      '"skills.Fighting >= 6",' +
      '"skills.Intimidation >= 6",' +
      '"skills.Riding >= 6",' +
      '"skills.Shooting >= 6",' +
      '"skills.Survival >= 4"',
  // Social
  'Reputation':'Require="advances >= 8"',
  // Weird
  'Grit':'Type=weird Require="advances >= 8","spirit >= 8",features.Guts',
  'Harrowed':'Type=weird Require="spirit >= 6"',
  'Knack (Bastard)':'Type=weird',
  "Knack (Born On All Hallows' Eve)":'Type=weird',
  'Knack (Born On Christmas)':
     'Type=weird ' +
     'Require="features.Arcane Background (Blessed) || features.Arcane Background (Shaman)"',
  'Knack (Breech Birth)':'Type=weird',
  'Knack (Seventh Son)':'Type=weird',
  'Knack (Shooting Star)':'Type=weird',
  'Knack (Storm Born)':'Type=weird',
  // Legendary
  'Behold A Pale Horse':'Type=legendary Require="advances >= 16"',
  'Damned':
    'Type=legendary Require="advances >= 16","spirit >= 6",features.Reputation',
  'Fast As Lightning':
    'Type=legendary Require="advances >= 16","agility >= 10",features.Quick',
  'Right Hand Of The Devil':
    'Type=legendary ' +
    'Require=' +
      '"advances >= 16",' +
      '"skills.Shooting>=10 || skills.Fighting>=10 || skills.Athletics>=10",' +
      '"Sum \'features.Trademark Weapon\' > 0"',
  'True Grit':
    'Type=legendary Require="advances >= 16","spirit >= 10",features.Grit',
  // "Class"-specific
  'Alchemy':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Mad Scientist)",' +
      '"advances >= 4",' +
      '"skills.Weird Science >= 8"',
  'Cat Eyes':'Type=power Require=features.Harrowed',
  'Celestial Kung Fu':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Chi Master)",' +
      '"advances >= 8",' +
      '"features.Superior Kung Fu",' +
      '"spirit >= 8"',
  "Chill O' The Grave":'Type=power Require=features.Harrowed,"advances >= 4"',
  'Claws':'Type=power Require=features.Harrowed',
  'Fetish':
    'Type=power ' +
    'Require="features.Arcane Background (Shaman)","skills.Faith >= 8"',
  'Flock':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Blessed)",' +
      '"advances >= 8",' +
      '"skills.Persuasion >= 8"',
  'Ghost':'Type=power Require=features.Harrowed,"advances >= 12"',
  'Hellfire':'Type=power Require=features.Harrowed,"advances >= 12"',
  'Hexslinging':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Huckster)",' +
      '"advances >= 4",' +
      '"skills.Shooting >= 8"',
  'High Roller':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Huckster)",' +
      '"advances >= 4",' +
      '"spirit >= 8",' +
      '"skills.Spellcasting >= 6"',
  'Improved High Roller':
    'Type=power ' +
    'Require=' +
      '"advances >= 8",' +
      '"features.High Roller"',
  'Implacable':'Type=power Require=features.Harrowed,"advances >= 12"',
  'Improved Cat Eyes':
    'Type=power Require=features.Harrowed,"features.Cat Eyes"',
  'Improved Claws':'Type=power Require=features.Harrowed,"advances >= 8"',
  "Improved Stitchin'":
    'Type=power ' +
    'Require=features.Harrowed,"features.Stitchin\'","advances >= 8"',
  'Infest':'Type=power Require=features.Harrowed',
  'Iron Bound':
    'Type=power Require="features.Arcane Background (Mad Scientist)"',
  'Like An Oak':
    'Type=professional ' +
    'Require=' +
      '"features.Territorial Ranger",' +
      '"advances >= 8",' +
      '"features.Grit"',
  'Old Hand':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Huckster)",' +
      '"advances >= 12",' +
      '"skills.Spellcasting >= 10"',
  'Ore Eater':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Mad Scientist)",' +
      '"skills.Weird Science >= 6"',
  'Ranger Promotion':
    'Type=professional ' +
    'Require=' +
      '"features.Territorial Ranger",' +
      '"advances >= 4"',
  'Soul Eater':'Type=power Require=features.Harrowed,"advances >= 8"',
  "Spirit's Favor":
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Shaman)",' +
      '"advances >= 4",' +
      '"skills.Faith >= 8"',
  'Spook':'Type=power Require=features.Harrowed',
  "Stitchin'":'Type=power Require=features.Harrowed',
  'Supernatural Attribute':'Type=power Require=features.Harrowed',
  'Superior Kung Fu (Drunken Style)':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Chi Master)",' +
      '"spirit >= 6",' +
      '"skills.Fighting >= 8"',
  'Superior Kung Fu (Eagle Claw)':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Chi Master)",' +
      '"spirit >= 6",' +
      '"skills.Fighting >= 8"',
  'Superior Kung Fu (Mantis)':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Chi Master)",' +
      '"spirit >= 6",' +
      '"skills.Fighting >= 8"',
  'Superior Kung Fu (Monkey)':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Chi Master)",' +
      '"spirit >= 6",' +
      '"skills.Fighting >= 8"',
  'Superior Kung Fu (Shuai Chao)':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Chi Master)",' +
      '"spirit >= 6",' +
      '"skills.Fighting >= 8"',
  'Superior Kung Fu (Tan Tui)':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Chi Master)",' +
      '"spirit >= 6",' +
      '"skills.Fighting >= 8"',
  'Superior Kung Fu (Wing Chun)':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Chi Master)",' +
      '"spirit >= 6",' +
      '"skills.Fighting >= 8"',
  'True Believer':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Blessed)",' +
      '"spirit >= 10",' +
      '"skills.Faith >= 6"',
  'True Genius':
    'Type=power ' +
    'Require="features.Arcane Background (Mad Scientist)","smarts >= 8"',
  'Whateley Blood':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Huckster)"',
  'Wither':'Type=power Require=features.Harrowed'
};
WeirdWest.EDGES = Object.assign({}, SWADE.EDGES, WeirdWest.EDGES_ADDED);
delete WeirdWest.EDGES['Arcane Background (%arcana)'];
delete WeirdWest.EDGES['Soul Drain'];
WeirdWest.FEATURES_ADDED = {
  // Edges
  'Agent':'Section=feature Note="Member of covert government agency"',
  'Alchemy':
    'Section=power ' +
    'Note="Spend 3 PP to create 3 Snake Oil, Focusing, and/or Peptonic potions lasting 1 dy"',
  'Arcane Background (Blessed)':
    'Section=arcana Note="Power Count 3/Power Points 15"',
  'Arcane Background (Chi Master)':
    'Section=arcana Note="Power Count 3/Power Points 15"',
  'Arcane Background (Huckster)':
    'Section=arcana Note="Power Count 3/Power Points 10"',
  'Arcane Background (Mad Scientist)':
    'Section=arcana Note="Power Count 2/Power Points 15"',
  'Arcane Background (Shaman)':
    'Section=arcana Note="Power Count 2/Power Points 15"',
  'Behold A Pale Horse':
    'Section=feature ' +
    'Note="Mount is a Wild Card with Fearless and Danger Sense"',
  'Born In The Saddle':
    'Section=skill Note="Reroll Riding/Mount +2 Pace and +1 Run step"',
  'Card Sharp':'Section=skill Note="Reroll Gambling"',
  'Cat Eyes':'Section=feature Note="No penalty in dim or dark lighting"',
  'Celestial Kung Fu':
    'Section=combat ' +
    'Note="Gain additional Superior Kung Fu style, use 2 styles at once"',
  "Chill O' The Grave":
    'Section=combat ' +
    'Note="Spend benny for 3%{in} radius cold blast that makes unprepared creatures Vulnerable"',
  'Claws':SWADE.FEATURES['Claws'],
  'Damned':'Section=feature Note="Will return as Harrowed if killed"',
  "Don't Get 'im Riled!":
    'Section=combat Note="Add wound level to damage rolls"',
  'Duelist':'Section=combat Note="Gets two extra Hole Cards at start of duel"',
  'Fan The Hammer':
     'Section=combat Note="Can shoot up to 6 shots in one action at %V"',
  'Fast As Lightning':'Section=combat Note="Can take 4 actions at -6"',
  'Fetish':'Section=skill Note="Reroll Faith"',
  'Flock':'Section=feature Note="Has 5 townsfolk followers"',
  'Gallows Humor':
    'Section=skill Note="Use Taunt vs. fear, Raise gives +1 Support to allies"',
  'Ghost':'Section=feature Note="Can become incorporeal at will"',
  'Grit':'Section=attribute Note="Reduce penalties vs. fear by 2"',
  'Guts':'Section=attribute Note="Reroll Vigor vs. fear"',
  'Harrowed':'Section=feature Note="Has returned from death"',
  'Hellfire':'Section=power Note="9%{in} code inflicts 3d6 damage 1/rd"',
  'Hexslinging':
    'Section=power ' +
    'Note="Cast <i>Ammo Whammy</i>, <i>Deflection</i>, <i>Boost Trait</i> (Shooting), and <i>Protection</i> via weapon"',
  'High Roller':
    'Section=power Note="Draw %V extra cards for deal with the devil"',
  'Implacable':
    'Section=combat Note="Can take extra wound before becoming incapacitated"',
  'Improved Cat Eyes':'Section=feature Note="No lighting penalties"',
  'Improved Claws':'Section=feature Note="Increased Claws damage, AP 2"',
  'Improved Fan The Hammer':
    'Section=combat Note="Increased Fan The Hammer effects"',
  'Improved High Roller':'Section=power Note="Increased High Roller effects"',
  "Improved Stitchin'":'Section=combat Note="Increased Stitchin\' effects"',
  'Infest':'Section=power Note="Can summon and control insect swarm for 5 min"',
  'Iron Bound':'Section=feature Note="Connections with industrial science"',
  'Like An Oak':
    'Section=combat ' +
    'Note="R12%{in} allies ignore 2 points of fear penalties on fear checks"',
  'Knack (Bastard)':
    'Section=feature ' +
    'Note="Can spend benny to see invisible and hiddeen creatures for 5 rd"',
  "Knack (Born On All Hallows' Eve)":
    'Section=feature Note="Can spend Conviction to reroll critical failure"',
  'Knack (Born On Christmas)':
    'Section=combat ' +
    'Note="Can spend a benny to negate power effect and shake caster (Spirit-4 neg)"',
  'Knack (Breech Birth)':
    'Section=combat Note="Can spend a benny to heal 1 wound"',
  'Knack (Seventh Son)':
    'Section=feature Note="Can spend a benny to negate another"',
  'Knack (Shooting Star)':
    'Section=combat Note="Can spend a benny to dbl command range"',
  'Knack (Storm Born)':
    'Section=attribute Note="Ignore penalties when vs. fear"',
  'Old Hand':
    'Section=power Note="Redraw up to 3 cards for deal with the devil"',
  'Ore Eater':
    'Section=power Note="+5 Power Points/May contract ghost rock fever"',
  'Quick Draw':
    'Section=combat,skill ' +
    'Note="Spending a benny on an additional Action Card gives two more",' +
         '"+2 Athletcs (interrupt others\' action)"',
  'Ranger Promotion':
    'Section=combat ' +
    'Note="Has moved up %V ranks in Territorial Ranger hierarchy"',
  'Reputation':
    'Section=skill ' +
    'Note="+2 Intimidation or Persuasion with those who have heard stories"',
  'Right Hand Of The Devil':
    'Section=combat Note="Trademark weapon does extra die of damage"',
  'Scout':
    'Section=skill ' +
    'Note="Notice-2 (encounters)/Alert Notice vs. Stealth/Ignore 2 penalty points for Survival (tracking)/+2 Common Knowledge (known route)"',
  'Soul Eater':
    'Section=combat ' +
    'Note="Can make Spirit-2 roll after inflicting unarmed wound to heal self wound"',
  "Spirit's Favor":'Section=power Note="Cast chosen power as free action"',
  'Spook':
    'Section=power ' +
    'Note="Target makes -2 fear check, take fatigue for 12%{in} radius effect"',
  "Stitchin'":'Section=combat Note="Make natural healing roll 1/%1"',
  'Superior Kung Fu (Drunken Style)':
    'Section=combat Note="-2 Pace/Foes -2 attack"',
  'Superior Kung Fu (Eagle Claw)':
    'Section=combat Note="Hands are heavy weapons with AP 4"',
  'Superior Kung Fu (Mantis)':
    'Section=combat Note="Foe who misses is distracted or vulnerable 1/rd"',
  'Superior Kung Fu (Monkey)':
    'Section=combat ' +
    'Note="+2 Parry/Make Athletics test against all adjacent foes"',
  'Superior Kung Fu (Shuai Chao)':
    'Section=combat Note="Can grapple after foe fails attack"',
  'Superior Kung Fu (Tan Tui)':
    'Section=attribute,combat ' +
    'Note="Rise from prone costs no movement",' +
         '"+1 kick attack die 1/rd and knocks back 1d4%{in} (Raise 1d4+2%{in})"',
  'Superior Kung Fu (Wing Chun)':
    'Section=combat Note="+1 Parry and foes -2 melee damage"',
  'Supernatural Attribute':'Section=attribute Note="+%V Attribute Points"',
  'Tale-Teller':
    'Section=skill ' +
    'Note="+2 Persuasion or Performance to lower fear, Raise gives supporters Conviction"',
  'Territorial Ranger':'Section=feature Note="Member of U.S. Marshals"',
  'True Believer':'Section=skill Note="Reroll Faith"',
  'True Genius':
    'Section=power Note="Spend a benny to reroll madness or malfunction"',
  'True Grit':
    'Section=attribute Note="Ignore penalties vs. fear, reroll fear effects"',
  "Veteran O' The Weird West":
     'Section=attribute,feature ' +
     'Note="+4 Advances","Has unique major hindrance"',
  'Whateley Blood':
    'Section=power,skill ' +
    'Note="Self-fatigue gives 5 power points, self-wound 10","-1 Persuasion"',
  'Wither':
    'Section=power ' +
    'Note="Touch reduces target strength (Raise strength and vigor) 1 step for 1 hr"',
  // Hindrances
  "Ailin'":
    'Section=attribute ' +
    'Note="-1 vs. Fatigue, critical failure inflicts Ailin\'+"',
  "Ailin'+":
    'Section=attribute Note="-2 vs. Fatigue, critical failure inflicts death"',
  'Cursed+':'Section=feature Note="+1 Benny to GM each session"',
  "Grim Servant O' Death+":
    'Section=combat Note="+1 damage, critical failure hits ally w/Raise"',
  'Heavy Sleeper':
    'Section=attribute,skill ' +
    'Note="-4 Vigor (stay awake)","-4 Notice (wake up)"',
  "Lyin' Eyes":
    'Section=combat ' +
    'Note="-1 Gambling (poker and faro)/-1 Intimidation (lies)/-1 Persuasion (lies)"',
  'Night Terrors+':
    'Section=attribute,feature Note="-1 Spirit","Noise keeps others awake"',
  'Old Ways Oath':
    'Section=attribute,feature ' +
    'Note="Reroll Spirit","Cannot use ghost rock-powered items"',
  'Talisman':'Section=arcana Note="-1 casting when talisman absent"',
  'Talisman+':'Section=arcana Note="-2 casting when talisman absent"',
  'Tenderfoot+':'Section=feature Note="Additional -1 penalty when wounded"',
  'Trouble Magnet':
    'Section=feature Note="Increased consequences from critical failures"',
  'Trouble Magnet+':
    'Section=feature Note="Always target of random consequences"',
};
WeirdWest.FEATURES =
  Object.assign({}, SWADE.FEATURES, WeirdWest.FEATURES_ADDED);
WeirdWest.GOODIES = Object.assign({}, SWADE.GOODIES);
WeirdWest.HINDRANCES_ADDED = {
  "Ailin'":'Require="hindrances.Ailin\'+ == 0" Severity=Minor',
  "Ailin'+":'Require="hindrances.Ailin\' == 0" Severity=Major',
  'Cursed+':'Severity=Major',
  "Grim Servant O' Death+":'Severity=Major',
  'Heavy Sleeper':'Severity=Minor',
  "Lyin' Eyes":'Severity=Minor',
  'Night Terrors+':'Severity=Major',
  'Old Ways Oath':'Severity=Minor',
  'Talisman':'Require="hindrances.Talisman+ == 0" Severity=Minor',
  'Talisman+':'Require="hindrances.Talisman == 0" Severity=Major',
  'Tenderfoot+':'Severity=Major',
  'Trouble Magnet':'Require="hindrances.Trouble Magnet+ == 0" Severity=Minor',
  'Trouble Magnet+':'Require="hindrances.Trouble Magnet == 0" Severity=Major'
};
WeirdWest.HINDRANCES =
  Object.assign({}, SWADE.HINDRANCES, WeirdWest.HINDRANCES_ADDED);
WeirdWest.POWERS_ADDED = {
  'Ammo Whammy':
    'Advances=4 ' +
    'PowerPoints=4 ' +
    'Range=self ' +
    'Description="Hex gun ammo has additional effects for 5 rd"',
  'Curse':
    'Advances=4 ' +
    'PowerPoints=5 ' +
    'Range=touch ' +
    'Description=' +
      '"Target suffers 1 level fatigue and additional level each sunset"',
  'Detect Arcana':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Description="Target can detect supernatural effects for 5 rd"',
  'Growth':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Description=' +
      '"Target gains Toughness and Strength step (Spirit neg) for 5 rd"',
  'Holy Symbol':
    'Advances=0 ' +
    'PowerPoints=3 ' +
    'Range=self ' +
    'Description=' +
      '"Supernaturally evil creatures cannot attack self physically (Spirit neg (Raise Spirit-2)) for 5 rd"',
  'Light':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Description="Creates 3%{in} radius bright light for 10 min"',
  'Numb':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=self ' +
    'Description=' +
      '"Allies in %{spirit}%{in} radius ignore 1 point of wound or fatigue penalties (Raise 2) for 5 rd"',
  'Sanctify':
    'Advances=8 ' +
    'PowerPoints=10 ' +
    'Range=touch ' +
    'Description=' +
      '"Supernaturally evil creatures in 15%{in} sq suffer fatigue (Spirit neg (Raise Spirit-2)) until next sunset"',
  'Trinkets':
    'Advances=0 ' +
    'PowerPoints=3 ' +
    'Range=smarts ' +
    'Description="Create 1 lb item for 5 rd (Raise 5 min)"',
  'Wilderness Walk':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=self ' +
    'Description="Triple speed and untraceable in wilderness for 1 hr"'
};
WeirdWest.POWERS = Object.assign({}, SWADE.POWERS, WeirdWest.POWERS_ADDED);
WeirdWest.RACES = {
  'Human':SWADE.RACES['Human']
};
WeirdWest.LANGUAGES = {
  'English':''
};
WeirdWest.SHIELDS = {
  'Medium Native Shield':'Parry=2 Cover=2 MinStr=4 Weight=5',
  'Small Native Shield':'Parry=1 Cover=1 MinStr=4 Weight=3'
};
WeirdWest.SKILLS_ADDED = {
  'Trade':'Attribute=smarts'
};
WeirdWest.SKILLS = Object.assign({}, SWADE.SKILLS, WeirdWest.SKILLS_ADDED);
delete WeirdWest.SKILLS['Knowledge (Electronics)'];
delete WeirdWest.SKILLS['Knowledge (Hacking)'];
WeirdWest.WEAPONS = {
};
for(var weapon in SWADE.WEAPONS) {
  if(SWADE.WEAPONS[weapon].includes('Victorian'))
    WeirdWest.WEAPONS[weapon] = SWADE.WEAPONS[weapon];
}

/* Defines the rules related to character attributes and description. */
WeirdWest.attributeRules = function(rules) {
  SWADE.attributeRules(rules);
  // No changes needed to the rules defined by base method
};

/* Defines the rules related to combat. */
WeirdWest.combatRules = function(rules, armors, shields, weapons) {
  SWADE.combatRules(rules, armors, shields, weapons);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to basic character identity. */
WeirdWest.identityRules = function(rules, races, deities) {
  SWADE.identityRules(rules, races, {}, deities);
  rules.defineEditorElement('race');
  rules.defineSheetElement('Race');
  rules.defineRule('race', 'advances', '=', '"Human"');
};

/* Defines rules related to powers. */
WeirdWest.arcaneRules = function(rules, arcanas, powers) {
  SWADE.arcaneRules(rules, arcanas, powers);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to character aptitudes. */
WeirdWest.talentRules = function(
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
WeirdWest.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Arcana')
    WeirdWest.arcanaRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValueArray(attrs, 'Powers')
    );
  else if(type == 'Armor')
    WeirdWest.armorRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Area'),
      QuilvynUtils.getAttrValue(attrs, 'Armor'),
      QuilvynUtils.getAttrValue(attrs, 'MinStr'),
      QuilvynUtils.getAttrValue(attrs, 'Weight')
    );
  else if(type == 'Deity')
    WeirdWest.deityRules(rules, name);
  else if(type == 'Edge') {
    WeirdWest.edgeRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValueArray(attrs, 'Type')
    );
    WeirdWest.edgeRulesExtra(rules, name);
  } else if(type == 'Feature')
    WeirdWest.featureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Goody')
    WeirdWest.goodyRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Pattern'),
      QuilvynUtils.getAttrValue(attrs, 'Effect'),
      QuilvynUtils.getAttrValue(attrs, 'Value'),
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Hindrance') {
    WeirdWest.hindranceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'Severity')
    );
    WeirdWest.hindranceRulesExtra(rules, name);
  } else if(type == 'Language')
    WeirdWest.languageRules(rules, name);
  else if(type == 'Power')
    WeirdWest.powerRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Advances'),
      QuilvynUtils.getAttrValue(attrs, 'PowerPoints'),
      QuilvynUtils.getAttrValue(attrs, 'Range'),
      QuilvynUtils.getAttrValue(attrs, 'Description')
    );
  else if(type == 'Race')
    WeirdWest.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages')
    );
  else if(type == 'Shield')
    WeirdWest.shieldRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Parry'),
      QuilvynUtils.getAttrValue(attrs, 'Cover'),
      QuilvynUtils.getAttrValue(attrs, 'MinStr'),
      QuilvynUtils.getAttrValue(attrs, 'Weight')
    );
  else if(type == 'Skill')
    WeirdWest.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Attribute'),
      QuilvynUtils.getAttrValue(attrs, 'Core')
    );
  else if(type == 'Weapon')
    WeirdWest.weaponRules(rules, name,
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
WeirdWest.arcanaRules = function(rules, name, skill, powers) {
  SWADE.arcanaRules(rules, name, skill);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with armor #name#, which covers the
 * body areas listed in #areas#, adds #armor# to the character's Toughness,
 * requires a strength of #minStr# to use effectively, and weighs #weight#.
 */
WeirdWest.armorRules = function(rules, name, areas, armor, minStr, weight) {
  SWADE.armorRules
    (rules, name, ['Victorian'], areas, armor, minStr, weight);
  // No changes needed to the rules defined by base method
};

/* Defines in #rules# the rules associated with deity #name#. */
WeirdWest.deityRules = function(rules, name) {
  SWADE.deityRules(rules, name);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with edge #name#. #require# and
 * #implies# list any hard and soft prerequisites for the edge, and #types#
 * lists the categories of the edge.
 */
WeirdWest.edgeRules = function(rules, name, requires, implies, types) {
  SWADE.edgeRules(rules, name, requires, implies, types);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with edge #name# that cannot be
 * derived directly from the attributes passed to edgeRules.
 */
WeirdWest.edgeRulesExtra = function(rules, name) {
  if(name == 'Arcane Background (Blessed)') {
    rules.defineRule
      ('powerCount', 'arcanaNotes.arcaneBackground(Blessed)', '+=', '3');
    rules.defineRule
      ('powerPoints', 'arcanaNotes.arcaneBackground(Blessed)', '+=', '15');
  } else if(name == 'Arcane Background (Chi Master)') {
    rules.defineRule
      ('powerCount', 'arcanaNotes.arcaneBackground(ChiMaster)', '+=', '3');
    rules.defineRule
      ('powerPoints', 'arcanaNotes.arcaneBackground(ChiMaster)', '+=', '15');
  } else if(name == 'Arcane Background (Huckster)') {
    rules.defineRule
      ('powerCount', 'arcanaNotes.arcaneBackground(Huckster)', '+=', '3');
    rules.defineRule
      ('powerPoints', 'arcanaNotes.arcaneBackground(Huckster)', '+=', '10');
  } else if(name == 'Arcane Background (Mad Scientist)') {
    rules.defineRule
      ('powerCount', 'arcanaNotes.arcaneBackground(MadScientist)', '+=', '2');
    rules.defineRule
      ('powerPoints', 'arcanaNotes.arcaneBackground(MadScientist)', '+=', '15');
  } else if(name == 'Arcane Background (Shaman)') {
    rules.defineRule
      ('powerCount', 'arcanaNotes.arcaneBackground(Shaman)', '+=', '2');
    rules.defineRule
      ('powerPoints', 'arcanaNotes.arcaneBackground(Shaman)', '+=', '15');
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
  } else if(name == 'High Roller') {
    rules.defineRule('powerNotes.highRoller',
      '', '=', '1',
      'powerNotes.improvedHighRoller', '+', '1'
    );
  } else if(name == 'Ranger Promotion') {
    rules.defineRule
      ('featureRules.rangerPromotion', 'edges.Ranger Promotion', '=', null);
  } else if(name == "Stitchin'") {
    rules.defineRule("combatNotes.stitchin'.1",
      "features.Stitchin'", '=', '"dy"',
      "combatNotes.improvedStitchin'", '=', '"hr"'
    );
  } else if(name == 'Supernatural Athlete') {
    rules.defineRule('attibuteNotes.supernaturalAthlete',
      'edges.Supernatural Athlete', '=', null
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
WeirdWest.featureRules = function(rules, name, sections, notes) {
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
WeirdWest.goodyRules = function(
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
WeirdWest.hindranceRules = function(rules, name, requires, severity) {
  SWADE.hindranceRules(rules, name, requires, severity);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with hindrance #name# that cannot be
 * derived directly from the attributes passed to hindranceRules.
 */
WeirdWest.hindranceRulesExtra = function(rules, name) {
  SWADE.hindranceRulesExtra(rules, name);
};

/* Defines in #rules# the rules associated with language #name#. */
WeirdWest.languageRules = function(rules, name) {
  SWADE.languageRules(rules, name);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with power #name#, which may be
 * acquired only after #advances# advances, requires #powerPoints# Power Points
 * to use, and can be cast at range #range#. #description# is a concise
 * description of the power's effects.
 */
WeirdWest.powerRules = function(
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
WeirdWest.raceRules = function(rules, name, requires, features, languages) {
  SWADE.raceRules(rules, name, requires, features, languages);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with shield #name#, which adds
 * #parry# to the character's Parry, provides #cover# cover, requires #minStr#
 * to handle, and weighs #weight#.
 */
WeirdWest.shieldRules = function(rules, name, parry, cover, minStr, weight) {
  SWADE.shieldRules
    (rules, name, ['Victorian'], parry, cover, minStr, weight);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * #attribute# (one of 'agility', 'spirit', etc.).
 */
WeirdWest.skillRules = function(rules, name, attribute, core) {
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
WeirdWest.weaponRules = function(
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
WeirdWest.randomizeOneAttribute = function(attributes, attribute) {
  SWADE.randomizeOneAttribute.apply(this, [attributes, attribute]);
};

/* Returns an array of plugins upon which this one depends. */
WeirdWest.getPlugins = function() {
  var result = [SWADE].concat(SWADE.getPlugins());
  return result;
};

/* Returns HTML body content for user notes associated with this rule set. */
WeirdWest.ruleNotes = function() {
  return '' +
    '<h2>WeirdWest Quilvyn Module Notes</h2>\n' +
    'WeirdWest Quilvyn Module Version ' + WeirdWest.VERSION + '\n' +
    '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '  </li>\n' +
    '</ul>\n' +
    '<h3>Copyrights and Licensing</h3>\n' +
    '<p>\n' +
    'All copyrights to character, vehicle, and other rules and settings are\n' +
    'owned by their respective copyright holders. This application makes no\n' +
    'claim against any properties.\n' +
    '</p><p>\n' +
    'Quilvyn is not approved or endorsed by Pinnacle Entertainment Group.\n' +
    'Portions of the materials used are property of Pinnacle Entertainment Group.\n' +
    '© Pinnacle Entertainment Group.\n' +
    '</p><p>\n' +
    'Deadlands The Weird West © 2020 Pinnacle Entertainment Group.\n' +
    '</p>\n';
};
