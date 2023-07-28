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
 * This module loads the rules from the Savage Worlds Adventure Edition Core
 * Rules. The SWD function contains methods that load rules for particular
 * parts of the rules: raceRules for character races, arcaneRules for powers,
 * etc. These member methods can be called independently in order to use a
 * subset of the SWD rules. Similarly, the constant fields of SWD
 * (SKILLS, EDGES, etc.) can be manipulated to modify the choices.
 */
function SWD() {

  if(window.SWADE == null) {
    alert('The SWD module requires use of the SWADE module');
    return;
  }

  var rules =
    new QuilvynRules('Savage Worlds Deluxe Edition', SWD.VERSION);
  SWD.rules = rules;

  rules.defineChoice('choices', SWD.CHOICES);
  rules.choiceEditorElements = SWD.choiceEditorElements;
  rules.choiceRules = SWD.choiceRules;
  rules.editorElements = SWD.initialEditorElements();
  rules.getFormats = SWD.getFormats;
  rules.getPlugins = SWD.getPlugins;
  rules.makeValid = SWD.makeValid;
  rules.randomizeOneAttribute = SWD.randomizeOneAttribute;
  rules.defineChoice('random', SWD.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = SWD.ruleNotes;

  SWD.createViewers(rules, SWD.VIEWERS);
  rules.defineChoice('extras',
    'edges', 'edgePoints', 'hindrances', 'sanityNotes', 'validationNotes'
  );
  rules.defineChoice('preset',
    'race:Race,select-one,races', 'era:Era,select-one,eras',
    'advances:Advances,text,4', 'concepts:Concepts,set,concepts'
  );

  SWD.attributeRules(rules);
  SWD.combatRules(rules, SWD.ARMORS, SWD.SHIELDS, SWD.WEAPONS);
  SWD.arcaneRules(rules, SWD.ARCANAS, SWD.POWERS);
  SWD.talentRules
    (rules, SWD.EDGES, SWD.FEATURES, SWD.GOODIES, SWD.HINDRANCES,
     SWD.LANGUAGES, SWD.SKILLS);
  SWD.identityRules(rules, SWD.RACES, SWD.ERAS, SWD.CONCEPTS, SWD.DEITIES);

  Quilvyn.addRuleSet(rules);

}

SWD.VERSION = '2.3.2.9';

/* List of items handled by choiceRules method. */
SWD.CHOICES = [].concat(SWADE.CHOICES);
/*
 * List of items handled by randomizeOneAttribute method. The order handles
 * dependencies among attributes when generating random characters.
 */
SWD.RANDOMIZABLE_ATTRIBUTES = [].concat(SWADE.RANDOMIZABLE_ATTRIBUTES);
SWD.VIEWERS = [].concat(SWADE.VIEWERS);

SWD.ARCANAS = {
  'Magic':'Skill=Spellcasting',
  'Miracles':'Skill=Faith',
  'Psionics':'Skill=Psionics',
  'Super Powers':'',
  'Weird Science':'Skill="Weird Science"'
};
SWD.ATTRIBUTES = Object.assign({}, SWADE.ATTRIBUTES);
SWD.ARMORS = {

  'None':'Area=Body Armor=0 Weight=0',

  'Leather':'Era=Medieval Area=Body Armor=1 Weight=15',
  'Chain Hauberk':'Era=Medieval Area=Body Armor=2 Weight=25',
  'Plate Corselet':'Era=Medieval Area=Torso Armor=3 Weight=25',
  'Plate Vambraces':'Era=Medieval Area=Arms Armor=3 Weight=10',
  'Plate Greaves':'Era=Medieval Area=Legs Armor=3 Weight=15',
  'Pot Helm':'Era=Medieval Area=Head Armor=3 Weight=4',
  'Steel Helmet':'Era=Medieval Area=Head Armor=3 Weight=8',

  'Flak Jacket':'Era=Modern Area=Torso Armor=2 Weight=12',
  'Kevlar Vest':'Era=Modern Area=Torso Armor=2 Weight=8',
  'Kevlar Vest With Inserts':'Era=Modern Area=Torso Armor=3 Weight=12',
  'Motorcycle Helmet':'Era=Modern Area=Head Armor=3 Weight=5',
  'Steel Pot':'Era=Modern Area=Head Armor=4 Weight=5',

  'Infantry Battle Suit':'Era=Future Area=Body Armor=6 Weight=20',
  'Hard Armor':'Era=Future Area=Body Armor=8 Weight=30',
  'Powered Scout Suit':'Era=Future Area=Body Armor=10 Weight=0',
  'Powered Battle Suit':'Era=Future Area=Body Armor=12 Weight=0',
  'Powered Heavy Suit':'Era=Future Area=Body Armor=14 Weight=0',
  'Reflective Vest':'Era=Future Area=Body Armor=10 Weight=5'

};
SWD.CONCEPTS_CHANGES = {
  'Aristocrat':null,
  'Brute':null,
  'Gifted':null,
  'Investigator':
    'Skill=Investigation,Streetwise',
  'Thief':
    'Skill=Climbing,Lockpicking,Stealth'
};
SWD.CONCEPTS = {
  'Super':
    'Edge="Arcane Background (Super Powers)"'
};
for(var concept in SWADE.CONCEPTS) {
  if(!(concept in SWD.CONCEPTS_CHANGES))
    SWD.CONCEPTS[concept] = SWADE.CONCEPTS[concept];
  else if(SWD.CONCEPTS_CHANGES[concept] != null)
    SWD.CONCEPTS[concept] =
      SWADE.CONCEPTS[concept] + ' ' + SWD.CONCEPTS_CHANGES[concept];
}
SWD.DEITIES = {
  'None':''
};
SWD.EDGES_CHANGES = {
  // Background
  'Aristocrat':null,
  'Brute':null,
  'Fame':null,
  'Famous':null,
  'Filthy Rich':'Require="features.Rich || features.Noble"',
  // Combat
  'Brawler':'Require="strength >= 8"',
  'Calculating':null,
  'Combat Reflexes':'Require="advances >= 4"',
  'Dead Shot':
    'Require="advances >= 4","skills.Shooting >= 10 || skills.Throwing >= 10"',
  'Improved Dodge':'Require="advances >= 8","features.Dodge"',
  'Double Tap':null,
  'Elan':'Type=combat Require="spirit >= 8"',
  'Improved Extraction':'Require="features.Extraction"',
  'Feint':null,
  'Free Runner':null,
  'Frenzy':'Require="advances >= 4","skills.Fighting >= 10"',
  'Iron Jaw':null,
  'Killer Instinct':'Require="advances >= 12"',
  'Marksman':'Require="advances >= 4"',
  'Mighty Blow':'Require="advances >= 4","skills.Fighting >= 10"',
  'Rapid Fire':null,
  'Improved Rapid Fire':null,
  'Improved Trademark Weapon (%weapon)':
    'Imply="weapons.%weapon" ' +
    'Require="advances >= 8","features.Trademark Weapon (%weapon)"',
  'Two-Gun Kid':null,
  // Leadership
  'Command Presence':'Require="features.Command"',
  'Natural Leader':'Require="spirit >= 8","features.Command"',
  'Tactician':
    'Require=' +
      '"advances >= 4",' +
      '"smarts >= 8",' +
      '"features.Command",' +
      '"skills.Knowledge (Battle) >= 6"',
  'Master Tactician':null,
  // Power
  'Artificer':null,
  'Channeling':null,
  'Concentration':null,
  'Extra Effort':null,
  'New Powers':null,
  // Professional
  'Acrobat':'Require="agility >= 8","strength >= 8"',
  'Combat Acrobat':null,
  'Assassin':
    'Require=' +
      '"agility >= 8",' +
      '"skills.Climbing >= 6",' +
      '"skills.Fighting >= 6",' +
      '"skills.Stealth >= 8"',
  'Champion':
    'Type=professional ' +
    'Require=' +
      '"features.Arcane Background (Miracles)",' +
      '"spirit >= 8",' +
      '"strength >= 6",' +
      '"vigor >= 8",' +
      '"skills.Faith >= 6",' +
      '"skills.Fighting >= 8"',
  'Gadgeteer':
    'Type=professional ' +
    'Require=' +
      '"features.Arcane Background (Weird Science)",' +
      '"smarts >= 8",' +
      '"skills.Repair >= 8",' +
      '"skills.Weird Science >= 8"',
  'Holy/Unholy Warrior':
    'Type=professional ' +
    'Require=' +
      '"features.Arcane Background (Miracles)",' +
      '"spirit >= 8",' +
      '"skills.Faith >= 6"',
  'Investigator':
    'Require=' +
      '"smarts >= 8",' +
      '"skills.Investigation >= 8",' +
      '"skills.Streetwise >= 8"',
  'Mentalist':
    'Type=professional ' +
    'Require=' +
      '"features.Arcane Background (Psionics)",' +
      '"smarts >= 8",' +
      '"skills.Psionics >= 6"',
  'Scholar (Academics)':null,
  'Scholar (Battle)':null,
  'Scholar (Occult)':null,
  'Scholar (Science)':null,
  'Soldier':null,
  'Thief':
    'Type=professional ' +
    'Require=' +
      '"agility >= 8",' +
      '"skills.Climbing >= 6",' +
      '"skills.Lockpicking >= 6",' +
      '"skills.Stealth >= 8"',
  'Wizard':
    'Type=professional ' +
    'Require=' +
      '"features.Arcane Background (Magic)",' +
      '"smarts >= 8",' +
      '"skills.Knowledge (Arcana) >= 8",' +
      '"skills.Spellcasting >= 6"',
  'Woodsman':
    'Type=professional ' +
    'Require="spirit >= 6","skills.Survival >= 8","skills.Tracking >= 8"',
  // Social
  'Bolster':null,
  'Charismatic':'Type=social Require="spirit >= 8"',
  'Humiliate':null,
  'Menacing':null,
  'Provoke':null,
  'Rabble-Rouser':null,
  'Reliable':null,
  'Retort':null,
  'Streetwise':null,
  'Strong Willed':'Require="skills.Intimidation >= 6","skills.Taunt >= 6"',
  'Iron Will':null,
  'Work The Room':null,
  'Work The Crowd':null,
  // Weird
  'Chi':null,
  // Legendary
  'Tough As Nails':'Type=legendary Require="advances >= 16"',
  'Tougher Than Nails':null

};
SWD.EDGES = {
  // Background
  'Arcane Background (Super Powers)':'Type=background',
  'Noble':'Type=background',
  // Combat
  'Florentine':'Type=combat Require="agility >= 8","skills.Fighting >= 8"',
  'Improved Martial Artist':
    'Type=combat ' +
    'Require="advances >= 8","features.Martial Artist","skills.Fighting >= 10"',
  'Quick Draw':'Type=combat Require="agility >= 8"',
  // Leadership
  'Leader Of Men':'Type=leadership Require="advances >= 4","features.Command"',
  // Power
  'New Power':'Type=power Require="powerPoints >= 1"',
  // Professional
  'Adept':
    'Type=professional ' +
    'Require=' +
      '"features.Arcane Background (Miracles)",' +
      '"features.Martial Artist",' +
      '"skills.Faith >= 8",' +
      '"skills.Fighting >= 8"',
  'Scholar':'Type=professional"',
  // Legendary
  'Martial Arts Master':
    'Type=legendary ' +
    'Require=' +
      '"advances >= 16",' +
      '"features.Improved Martial Artist",' +
      '"skills.Fighting >= 12"',
  'Improved Tough As Nails':
    'Type=legendary Require="advances >= 16","features.Tough As Nails"'
};
for(var edge in SWADE.EDGES) {
  if(!(edge in SWD.EDGES_CHANGES))
    SWD.EDGES[edge] = SWADE.EDGES[edge];
  else if(SWD.EDGES_CHANGES[edge] != null)
    SWD.EDGES[edge] = SWADE.EDGES[edge] + ' ' + SWD.EDGES_CHANGES[edge];
}
SWD.ERAS = {
  'Medieval':'',
  'Modern':'',
  'Future':''
};
SWD.FEATURES = {

  // Edges
  'Ace':
    'Section=skill ' +
    'Note="+2 Boating/+2 Driving/+2 Piloting/Spend Benny to Soak vehicle damage"',
  'Acrobat':
    'Section=attribute,combat ' +
    'Note="+2 Agility (acrobatic maneuvers)","+1 Parry"',
  'Adept':
    'Section=arcana ' +
    'Note="May spend 1 Power Point for unarmed AP 2, activate self power as free action"',
  'Alertness':'SWADE',
  'Ambidextrous':'Section=combat Note="No off-hand penalty"',
  'Arcane Background (Magic)':
    'Section=arcana,skill ' +
    'Note="3 Powers/10 Power Points",' +
         '"1 on Spellcasting inflicts Shaken"',
  'Arcane Background (Miracles)':
    'Section=arcana,feature ' +
    'Note="2 Powers/10 Power Points",' +
         '"Violating core beliefs inflicts -2 Faith for 1 wk; major sins remove powers"',
  'Arcane Background (Psionics)':
    'Section=arcana,skill ' +
    'Note="3 Powers/10 Power Points",' +
         '"1 on Psionics inflicts Shaken, critical failure shakes allies in 3%{in} radius"',
  'Arcane Background (Super Powers)':
    'Section=arcana Note="1 Power/20 Power Points"',
  'Arcane Background (Weird Science)':
    'Section=arcana,skill ' +
    'Note="1 Power/10 Power Points","1 on Weird Science causes malfunction"',
  'Arcane Resistance':
    'Section=combat ' +
    'Note="+%V Armor vs arcane powers/+%V trait resisting arcane powers"',
  'Assassin':'Section=combat Note="+2 damage to unaware foes"',
  'Attractive':'Section=skill Note="+%V Charisma"',
  'Beast Bond':'SWADE',
  'Beast Master':'SWADE',
  'Berserk':
    'Section=combat ' +
    'Note="Injury causes +2 Fighting, Strength, melee damage, and Toughness, -2 Parry, ignores Wound penalties, and random hits on 1 on Fighting die (Smarts-2 neg)"',
  'Block':'Section=combat Note="+%V Parry"',
  'Brave':'Section=attribute Note="+2 Spirit vs. fear"',
  'Brawler':'Section=combat Note="+2 Unarmed damage"',
  'Brawny':
    'Section=attribute,combat ' +
    'Note=' +
      '"+1 Strength step (encumbrance and minimum strength requirements)",' +
      '"+1 Toughness"',
  'Bruiser':'Section=combat Note="Roll d8 for unarmed damage Raise"',
  'Champion':
    'Section=combat ' +
    'Note="+2 damage and Toughness vs. supernatural creatures of opposed alignment"',
  'Charismatic':'Section=skill Note="+2 Charisma"',
  'Combat Reflexes':'Section=combat Note="+2 on Shaken recovery rolls"',
  'Command':
    'Section=feature ' +
    'Note="R%{commandRange}%{in} Commanded +%V to recover from Shaken"',
  'Command Presence':'SWADE',
  'Common Bond':'SWADE',
  'Connections':'SWADE',
  'Counterattack':
    'Section=combat Note="Free %1attack after failed foe attack"',
  'Danger Sense':
    'Section=combat Note="May test Notice-2 before surprise attack"',
  'Dead Shot':'SWADE',
  'Dodge':'Section=combat Note="-%V foe ranged attacks, +%V evading area attacks"',
  'Elan':'SWADE',
  'Expert (%attribute)':'SWADE',
  'Expert (%skill)':'SWADE',
  'Extraction':
    'Section=combat ' +
    'Note="May make Agility test to negate attack of %V when withdrawing"',
  'Fast Healer':'Section=combat Note="+2 Vigor (natural healing)"',
  'Fervor':'SWADE',
  'Filthy Rich':'SWADE',
  'First Strike':'SWADE',
  'Fleet-Footed':'Section=combat Note="+2 Pace/+2 Run step"',
  'Florentine':
    'Section=combat ' +
    'Note="+1 attack vs. single-weapon foe, -1 foe Gang Up bonus"',
  'Followers':'SWADE',
  'Frenzy':'Section=combat Note="+1 Fighting roll/rd%1"',
  'Gadgeteer':'SWADE',
  'Giant Killer':'SWADE',
  'Great Luck':'SWADE',
  'Hard To Kill':
    'Section=combat ' +
    'Note="Ignores wound penalties on Vigor tests to avoid incapacitation or death"',
  'Harder To Kill':'SWADE',
  'Healer':'SWADE',
  'Hold The Line!':'SWADE',
  'Holy/Unholy Warrior':
    'Section=arcana ' +
    'Note="R%{spirit}%{in} Spend 1 Power Point to shake supernatural creatures (Spirit neg; critical failure destroyed)"',
  'Improved Arcane Resistance':'SWADE',
  'Improved Block':'SWADE',
  'Improved Counterattack':'SWADE',
  'Improved Dodge':'Section=combat Note="Increased Dodge effects"',
  'Improved Extraction':'SWADE',
  'Improved First Strike':'SWADE',
  'Improved Frenzy':'SWADE',
  'Improved Level Headed':'SWADE',
  'Improved Martial Artist':
    'Section=combat Note="Increased Martial Artist effects"',
  'Improved Nerves Of Steel':'SWADE',
  'Improved Rapid Recharge':'SWADE',
  'Improved Sweep':'SWADE',
  'Improved Tough As Nails':
    'Section=combat Note="Increased Tough As Nails effects"',
  'Improved Trademark Weapon (%weapon)':'SWADE',
  'Improvisational Fighter':'SWADE',
  'Inspire':'Section=feature Note="Increased Command effects"',
  'Investigator':
    'Section=skill ' +
    'Note="+2 Investigation/+2 Streetwise/+2 Notice (sifting for information)"',
  'Jack-Of-All-Trades':'Section=skill Note="d4 on untrained Smarts skills"',
  'Killer Instinct':
    'Section=skill Note="May reroll 1s and wins ties on opposed tests"',
  'Leader Of Men':
    'Section=combat Note="R%{commandRange}%{in} Commanded use d10 wild die"',
  'Level Headed':'SWADE',
  'Linguist':
    'Section=skill ' +
    'Note="+%V Skill Points (d4 in in %{smarts} Knowledge (Language) skills), Smarts-2 to understand other familiar tongues"',
  'Liquid Courage':
    'Section=attribute ' +
    'Note="Drinking alcohol gives +1 Vigor step, ignore 1 wound penalty for 1 hr"',
  'Luck':'SWADE',
  'Marksman':'Section=combat Note="Trade move for +2 ranged attack"',
  'Martial Artist':'Section=combat Note="+%V Unarmed damage step"',
  'Martial Arts Master':'Section=combat Note="+2 Unarmed damage"',
  'Master Of Arms':'SWADE',
  'Master (%attribute)':'SWADE',
  'Master (%skill)':'SWADE',
  'McGyver':
    'Section=skill Note="May create improvised weapon, explosive, or tool"',
  'Mentalist':'SWADE',
  'Mighty Blow':'SWADE',
  'Mister Fix It':'SWADE',
  'Natural Leader':
    'Section=feature Note="R%{commandRange}%{in} Share bennies with commanded"',
  'Nerves Of Steel':'SWADE',
  'New Power':'Section=arcana Note="+%V Power Count"',
  'No Mercy':'Section=combat Note="May spend Benny to reroll damage"',
  'Noble':
    'Section=feature,skill ' +
    'Note="Has Rich feature","+2 Charisma"',
  'Power Points':'SWADE',
  'Power Surge':
    'Section=arcana Note="Joker Action Card restores 2d6 Power Points"',
  'Professional (Agility)':'SWADE',
  'Professional (Smarts)':'SWADE',
  'Professional (Spirit)':'SWADE',
  'Professional (Strength)':'SWADE',
  'Professional (Vigor)':'SWADE',
  'Professional (%skill)':'SWADE',
  'Quick':'SWADE',
  'Quick Draw':'Section=combat Note="Draw weapon as free action"',
  'Rapid Recharge':'SWADE',
  'Rich':'SWADE',
  'Rock And Roll':'SWADE',
  'Scavenger':'Section=combat Note="May recover equipment 1/encounter"',
  'Scholar':'Section=skill Note="+2 on 2 chosen skills"',
  'Sidekick':'SWADE',
  'Soul Drain':
    'Section=arcana Note="May make Spirit roll to recover Power Points"',
  'Steady Hands':
    'Section=combat ' +
    'Note="No penalty for shot from unstable platform, reduce running shot penalty by 1"',
  'Strong Willed':
    'Section=attribute,skill ' +
    'Note="+2 Smarts (resist Tests)/+2 Spirit (resist Tests)",' +
         '"+2 Intimidation/+2 Taunt"',
  'Sweep':'SWADE',
  'Tactician':
    'Section=combat ' +
    'Note="R%{commandRange}%{in} Roll Knowledge (Battle), distribute %V Action Card to commanded for each success and raise"',
  'Thief':
    'Section=skill ' +
    'Note="+2 Climbing/+2 Lockpicking/+2 Notice (traps)/+1 Repair (traps)/+2 Stealth (urban)"',
  'Tough As Nails':'Section=combat Note="+%V Toughness"',
  'Trademark Weapon (%melee)':
    'Section=combat Note="+%V attack with %melee"',
  'Trademark Weapon (%ranged)':
    'Section=combat Note="+%V attack with %ranged"',
  'Two-Fisted':'SWADE',
  'Very Attractive':'SWADE',
  'Weapon Master':'Section=combat Note="+%V Parry"',
  'Wizard':'Section=arcana Note="Raises reduce Power Point cost of casting"',
  'Woodsman':'Section=skill Note="+2 Stealth (wilds)/+2 Survival (wilds)/+2 Tracking (wilds)"',

  // Hindrances
  'All Thumbs':'Section=skill Note="-2 Repair/Roll of 1 breaks device"',
  'Anemic':
    'Section=feature Note="-2 Fatigue checks (resist poison and disease)"',
  'Arrogant+':'SWADE',
  'Bad Eyes':
     'Section=skill ' +
     'Note="-2 on distant visual trait rolls and ranged attacks w/out corrective lenses"',
  'Bad Eyes+':
    'Section=skill Note="-2 on distant visual trait rolls and ranged attacks"',
  'Bad Luck+':'SWADE',
  'Big Mouth':'SWADE',
  'Blind+':
    'Section=feature,skill ' +
    'Note="+1 Edge Points","-6 on visual tasks, -2 on social"',
  'Bloodthirsty+':'Section=skill Note="-4 Charisma"',
  'Cautious':'SWADE',
  'Clueless+':'Section=attribute Note="-2 Smarts (common knowledge)"',
  'Code Of Honor+':'SWADE',
  'Curious+':'SWADE',
  'Death Wish':'SWADE',
  'Delusional':'SWADE',
  'Delusional+':'SWADE',
  'Doubting Thomas':'Section=attribute Note="-2 vs. supernatural horror"',
  'Elderly+':
    'Section=attribute,combat,skill ' +
    'Note="-1 Strength step/-1 Vigor step","-1 Pace","+5 Skill Points"',
  'Enemy':'SWADE',
  'Enemy+':'SWADE',
  'Greedy':'SWADE',
  'Greedy+':'SWADE',
  'Habit':
    'Section=feature,skill ' +
    'Note="Has irritating but harmless compulsion","-1 Charisma"',
  'Habit+':'SWADE',
  'Hard Of Hearing':'Section=skill Note="-2 Notice (hearing)"',
  'Hard Of Hearing+':'SWADE',
  'Heroic+':'SWADE',
  'Illiterate':'SWADE',
  'Lame+':'Section=combat Note="-2 Pace/-1 Run step"',
  'Loyal':'SWADE',
  'Mean':
    'Section=feature,skill ' +
    'Note="Ill-tempered and disagreeable","-2 Charisma"',
  'Obese':'Section=combat Note="-1 Pace/-1 Run step/+1 Toughness"',
  'One Arm+':'SWADE',
  'One Eye+':
    'Section=feature,skill ' +
    'Note="-2 Shooting/-2 Throwing/-2 tasks requiring depth perception",' +
         '"-1 Charisma unless missing eye is covered"',
  'One Leg+':
    'Section=combat,skill ' +
    'Note="-4 Pace/Cannot run","-2 Climbing/-2 Fighting/-2 Swimming"',
  'Outsider':'Section=skill Note="-2 Charisma (other races)"',
  'Overconfident+':'SWADE',
  'Pacifist':'SWADE',
  'Pacifist+':'SWADE',
  'Phobia':
    'Section=feature Note="-2 on trait rolls in presence of phobia subject"',
  'Phobia+':
    'Section=feature Note="-4 on trait rolls in presence of phobia subject"',
  'Poverty':'SWADE',
  'Quirk':'SWADE',
  'Small+':'Section=combat Note="-1 Toughness"',
  'Stubborn':'SWADE',
  'Ugly':'Section=skill Note="-2 Charisma"',
  'Vengeful':'SWADE',
  'Vengeful+':'SWADE',
  'Vow':'SWADE',
  'Vow+':'SWADE',
  'Wanted':'SWADE',
  'Wanted+':'SWADE',
  'Yellow+':'Section=attribute Note="-2 Spirit vs. fear"',
  'Young+':
    'Section=attribute,feature,skill ' +
    'Note="-2 Attribute Points","+1 Benny each session","-2 Skill Points"',

  // Races
  'Adaptable':'Section=feature Note="+1 Edge Points"',
  'Advanced Civilization':'Section=attribute Note="+1 Smarts step"',
  'Agile':'SWADE',
  'Aquatic':
    'Section=combat,feature,skill ' +
    'Note="Swim Pace %{pace}","Cannot drown","d6 in Swimming"',
  'Asimov Circuits':'Section=feature Note="Has Pacifist+ hindrance"',
  'Atlantean Tough':'Section=combat Note="+1 Toughness"',
  'Bite':'SWADE',
  'Burrowing':
    'Section=feature Note="Can burrow into loose earth and surprise foes"',
  'Claws':
    'Section=combat,skill ' +
    'Note="Claws are a natural weapon","+2 Climbing"',
  'Construct':
    'Section=attribute,combat ' +
    'Note=' +
      '"+2 Shaken recovery, immune to disease and poison",' +
      '"Ignores wound modifiers, requires Repair to heal"',
  'Dehydration':
    'Section=feature Note="Requires 1 hr immersion/dy to avoid fatigue"',
  'Flight':'Section=combat Note="Fly Pace %{pace}"',
  'Fortunate':'Section=feature Note="+1 Benny each session"',
  'Hardy':'Section=combat Note="Not wounded by second Shaken result"',
  'Heritage':'SWADE',
  'Hollow-Boned':'Section=combat Note="-1 Toughness"',
  'Immune To Disease':'Section=attribute Note="Has immunity to disease"',
  'Immune To Poison':'Section=attribute Note="Has immunity to poison"',
  'Infravision':
    'Section=combat ' +
    'Note="Half penalties when attacking in bad lighting"',
  'Low Light Vision':'SWADE',
  'Mostly Human':'Section=feature Note="+1 Edge Points"',
  'Multiple Limbs':
    'Section=combat Note="Extra actions w/out multi-action penalty"',
  'Natural Weapons':'Section=combat Note="Has Bite, Claws, and Tail features"',
  'Poison':'Section=combat Note="Touch inflicts Mild Poison effects (Vigor neg)"',
  'Potent Poison':'Section=combat Note="Poison target -%V Vigor to resist"',
  'Programming':'Section=skill Note="+2 Skill Points"',
  'Racial Enemy':'Section=skill Note="-4 Charisma (racial enemy)"',
  'Recharge':
    'Section=feature ' +
    'Note="Requires access to power source 1/dy to avoid fatigue"',
  'Saurian Senses':'Section=skill Note="+2 Notice"',
  'Semi-Aquatic':'SWADE',
  'Short':'Section=combat,description Note="-1 Toughness","-1 Size"',
  'Slow':'Section=combat Note="-1 Pace"',
  'Spirited':'SWADE',
  'Strong':'Section=attribute Note="+1 Strength step"',
  'Tail':'SWADE',
  'Tough':'SWADE',
  'Unnatural':'Section=feature Note="-2 arcane power effects"',
  'Wall Walker':
    'Section=combat ' +
    'Note="Normal Pace on vertical surfaces, %{pace//2} on inverted"',
  'Warm Natured':'Section=attribute Note="-4 Vigor (resist cold)"'

};
for(var feature in SWD.FEATURES) {
  SWD.FEATURES[feature] =
    SWD.FEATURES[feature].replace('SWADE', SWADE.FEATURES[feature]);
}
SWD.GOODIES = Object.assign({}, SWADE.GOODIES);
SWD.HINDRANCES_CHANGES = {
  "Can't Swim":null,
  'Clumsy+':null,
  'Driven':null,
  'Driven+':null,
  'Hesitant':null,
  'Impulsive+':null,
  'Jealous':null,
  'Jealous+':null,
  'Mild Mannered':null,
  'Mute+':null,
  'Obligation':null,
  'Obligation+':null,
  'Outsider+':null,
  'Ruthless':null,
  'Ruthless+':null,
  'Secret':null,
  'Secret+':null,
  'Shamed':null,
  'Shamed+':null,
  'Slow':null,
  'Slow+':null,
  'Small':null,
  'Suspicious':null,
  'Suspicious+':null,
  'Thin Skinned':null,
  'Thin Skinned+':null,
  'Tongue-Tied+':null,
  'Ugly+':null,
  'Young':null,
};
SWD.HINDRANCES = {
  'Lame+':'Severity=Major',
  'One Leg+':'Severity=Major',
  'Small+':'Severity=Major'
};
for(var hindrance in SWADE.HINDRANCES) {
  if(!(hindrance in SWD.HINDRANCES_CHANGES))
    SWD.HINDRANCES[hindrance] = SWADE.HINDRANCES[hindrance];
  else if(SWD.HINDRANCES_CHANGES[hindrance])
    SWD.HINDRANCES[hindrance] =
      SWADE.HINDRANCES[hindrance] + ' ' + SWD.HINDRANCES_CHANGES[hindrance];
}
SWD.POWERS_CHANGES = {
  'Arcane Protection':null,
  'Barrier':
    'PowerPoints=1/Section ' +
    'Description="Creates sections of 1%{in} high wall for PP rd"',
  'Beast Friend':
    'PowerPoints=3+2xSize ' +
    'Range=smarts*50',
  'Blast':
    'PowerPoints=2 ' +
    'Range=24 ' +
    'Description="2%{in} radius inflicts 2d6 damage"',
  'Blind':
    'Range=12 ' +
    'Description=' +
      '"Target Shaken and suffers -2 on Parry (Agility-2 neg, 1 on die also suffers -6 trait tests) for 1 rd"',
  'Bolt':
    'PowerPoints=1/missile ' +
    'Range=12 ' +
    'Description="Inflicts 2d6 damage"',
  'Boost/Lower Trait':
    'Range=smarts ' +
    'Description=' +
      '"Target gains +1 trait step or suffers -1 trait step (Raise +2 or -2 (Spirit neg)) for 3 rd"',
  'Burrow':
    'PowerPoints=3 ' +
    'Range=self',
  'Burst':
    'Description="Cone inflicts 2d10 damage (Agility neg)"',
  'Confusion':
    'Range=smarts*2 ' +
    'Description="Target suffers Shaken (Smarts-2 neg)"',
  'Damage Field':
    'Range=touch ' +
    'Description="Target touch inflicts 2d6 (Raise 2d8) damage for 3 rd"',
  'Darksight':
    'Range=touch ' +
    'Description="Target halves illumination penalties (Raise 6 pts) for 1 hr"',
  'Deflection':
    'PowerPoints=2 ' +
    'Range=touch',
  'Detect/Conceal Arcana':
    'Range=sight',
  'Dispel':'PowerPoints=3',
  'Disguise':
    'PowerPoints=3 ' +
    'Range=touch',
  'Drain Power Points':
    'Advances=12 ' +
    'PowerPoints=3 ' +
    'Description="Drains 1d6+1 PP (Raise 1d8+2) (Spirit neg, +2 if types differ)"',
  'Elemental Manipulation':
    'Range=smarts*2',
  'Empathy':null,
  'Entangle':
    'Description=' +
      '"Impedes target (Raise binds) (Agility neg, Agility or Strength ends)"',
  'Environmental Protection':
    'Range=touch',
  'Farsight':
    'PowerPoints=3 ' +
    'Range=touch ' +
    'Description=' +
      '"Target halves range penalties (Raise dbl range increments) for 3 rd"',
  'Fear':'Range=smarts*2',
  'Fly':
    'Range=touch ' +
    'Description="Target gains ability to fly at normal walking Pace for 5 rd"',
  'Havoc':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Range=smarts*2 ' +
    'Description=' +
      '"Distracts and throws creatures in 2%{in} radius 2d6%{in} (Strength neg)"',
  'Illusion':null,
  'Intangibility':'Range=touch',
  'Invisibility':'Range=self',
  'Light/Darkness':null,
  'Mind Link':null,
  'Mind Reading':'PowerPoints=3',
  'Mind Wipe':null,
  'Object Reading':null,
  'Protection':null,
  'Puppet':'Description="Target obeys self for 3 rd (Spirit neg)"',
  'Relief':null,
  'Resurrection':null,
  'Shape Change':'Description="Transforms into animal form for 1 min"',
  'Sloth/Speed':null,
  'Slumber':
    'Range=smarts*2 ' +
    'Description="Target sleeps for 1 min (Spirit neg)"',
  'Sound/Silence':null,
  'Speak Language':'Range=touch',
  'Stun':
    'Range=12 ' +
    'Description="Target Shaken (Vigor neg)"',
  'Summon Ally':'PowerPoints=3+',
  'Telekinesis':
    'PowerPoints=5 ' +
    'Range=smarts ' +
    'Description=' +
      '"Moves %{spirit*10} lb item (Raise %{spirit*50} lb) remotely for 3 rd"',
  'Teleport':
    'PowerPoints=3+ ' +
    'Range=self ' +
    'Description="Teleports PPx10%{in} (Raise PPx15%{in})"',
  "Warrior's Gift":'Range=touch',
  'Zombie':
    'Description=' +
      '"Animates and controls corpse for 1 hr (Raise 1d6 hr, 2 until destroyed)"'
};
SWD.POWERS = {
  'Armor':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=touch ' +
    'Description="Gives +2 Armor (Raise +4) for 3 rd"',
  'Greater Healing':
    'Advances=8 ' +
    'PowerPoints=10 ' +
    'Range=touch ' +
    'Description="Restores 1 wound (Raise 2 wounds) w/out time limit or removes poison, disease, or sickness"',
  'Light/Obscure':SWADE.POWERS['Light/Darkness'] + ' ' +
    'Description=' +
      '"Creates 3%{in} radius bright light for 30 min or darkness for 3 rd"',
  'Pummel':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Range=9 ' +
    'Description="Cone pushes creatures 2d6%{in} (Strength neg)"',
  'Quickness':
    'Advances=4 ' +
    'PowerPoints=4 ' +
    'Range=touch ' +
    'Description="Target gains second action for 3 rd (Raise also redraw Action Cards below 8)"',
  'Slow':
    'Advances=4 ' +
    'PowerPoints=1 ' +
    'Range=smarts*2 ' +
    'Description=' +
      '"Target move counts as action (Raise also redraw Action Cards above 10) for 3 rd (Spirit neg)"',
  'Smite':
    'Range=touch',
  'Speed':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Range=touch ' +
    'Description="Target dbl Pace (Raise also Run as free action) for 3 rd"',
  'Succor':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Range=touch ' +
    'Description="Removes 1 level of fatigue (Raise 2 levels) and Shaken"',
  'Wall Walker':
    'Range=touch'
};
for(var power in SWADE.POWERS) {
  if(!(power in SWD.POWERS_CHANGES))
    SWD.POWERS[power] = SWADE.POWERS[power].replace(' 5 rd', ' 3 rd');
  else if(SWD.POWERS_CHANGES[power])
    SWD.POWERS[power] = SWADE.POWERS[power].replace(' 5 rd', ' 3 rd') + ' ' + SWD.POWERS_CHANGES[power];
}
SWD.RACES = {
  'Android':
    'Features=' +
      '"Asimov Circuits",Construct,Outsider,Programming,Recharge,Unnatural',
  'Atlantean':
    'Features=' +
      '"Advanced Civilization",Aquatic,"Atlantean Tough",Dehydration',
  'Avion':
    'Features=' +
      'Flight,"Hollow-Boned","Mostly Human"',
  'Dwarf':
    'Features=' +
      '"Low Light Vision",Slow,Tough',
  'Elf':
    'Features=' +
      'Agile,"All Thumbs","Low Light Vision"',
  'Half-Elf':
    'Features=' +
      'Heritage,"Low Light Vision",Outsider',
  'Half-Folk':
    'Features=' +
      'Fortunate,Short,Spirited',
  'Half-Orc':
    'Features=' +
      'Infravision,Outsider,Strong',
  'Human':
    'Features=' +
      'Adaptable',
  'Rakashan':
    'Features=' +
      'Agile,Bloodthirsty+,Claws,"Low Light Vision","Racial Enemy"',
  'Saurian':
    'Features=' +
      '"Natural Weapons",Outsider,"Saurian Senses","Warm Natured"',
};
SWD.LANGUAGES = {};
SWD.SHIELDS = {
  'None':'Parry=0 Cover=0 Weight=0',
  'Small Shield':'Era=Medieval Parry=1 Cover=0 Weight=8',
  'Medium Shield':'Era=Medieval Parry=1 Cover=2 Weight=12',
  'Large Shield':'Era=Medieval Parry=2 Cover=2 Weight=20'
};
SWD.SKILLS = {
  'Boating':'Attribute=agility',
  'Climbing':'Attribute=strength',
  'Driving':'Attribute=agility Era=Modern,Future',
  'Fighting':'Attribute=agility',
  'Gambling':'Attribute=smarts',
  'Healing':'Attribute=smarts',
  'Intimidation':'Attribute=spirit',
  'Investigation':'Attribute=smarts',
  'Knowledge (Academics)':'Attribute=smarts',
  'Knowledge (Arcana)':'Attribute=smarts',
  'Knowledge (Battle)':'Attribute=smarts',
  'Knowledge (Computers)':'Attribute=smarts Era=Modern,Future',
  'Knowledge (Electronics)':'Attribute=smarts Era=Modern,Future',
  'Knowledge (History)':'Attribute=smarts',
  'Knowledge (Journalism)':'Attribute=smarts',
  'Knowledge (Language (%language))':'Attribute=smarts',
  'Knowledge (Law)':'Attribute=smarts',
  'Knowledge (Medicine)':'Attribute=smarts',
  'Knowledge (Occult)':'Attribute=smarts',
  'Knowledge (Science)':'Attribute=smarts',
  'Lockpicking':'Attribute=agility',
  'Notice':'Attribute=smarts',
  'Persuasion':'Attribute=spirit',
  'Piloting':'Attribute=agility Era=Modern,Future',
  'Repair':'Attribute=smarts',
  'Riding':'Attribute=agility',
  'Shooting':'Attribute=agility',
  'Stealth':'Attribute=agility',
  'Streetwise':'Attribute=smarts',
  'Survival':'Attribute=smarts',
  'Swimming':'Attribute=agility',
  'Taunt':'Attribute=smarts',
  'Throwing':'Attribute=agility',
  'Tracking':'Attribute=smarts',
  // Arcane Background skills
  'Faith':'Attribute=spirit',
  'Psionics':'Attribute=smarts',
  'Spellcasting':'Attribute=smarts',
  'Weird Science':'Attribute=smarts'
};
SWD.WEAPONS = {

  'Unarmed':'Era=Medieval,Modern,Future Damage=Str+d0 Weight=0 Category=Un',
  'Dagger':'Era=Medieval,Modern Damage=Str+d4 Weight=1 Category=1h Range=3',
  'Knife':'Era=Medieval,Modern Damage=Str+d4 Weight=1 Category=1h Range=3',
  'Great Sword':'Era=Medieval Damage=Str+d10 Weight=12 Category=2h Parry=-1',
  'Flail':'Era=Medieval Damage=Str+d6 Weight=8 Category=1h',
  'Katana':'Era=Medieval Damage=Str+d6+2 Weight=6 Category=2h AP=2',
  'Long Sword':'Era=Medieval Damage=Str+d8 Weight=8 Category=1h',
  'Rapier':'Era=Medieval Damage=Str+d4 Weight=3 Category=1h Parry=1',
  'Short Sword':'Era=Medieval Damage=Str+d6 Weight=4 Category=1h',

  'Axe':'Era=Medieval Damage=Str+d6 Weight=2 Category=1h',
  'Battle Axe':'Era=Medieval Damage=Str+d8 Weight=10 Category=1h',
  'Great Axe':'Era=Medieval Damage=Str+d10 Weight=15 Category=2h AP=1 Parry=-1',
  'Maul':'Era=Medieval Damage=Str+d8 Weight=20 Category=2h AP=2 Parry=-1',
  'Warhammer':'Era=Medieval Damage=Str+d6 Weight=8 Category=1h AP=1',

  'Halberd':'Era=Medieval Damage=Str+d8 Weight=15 Category=2h',
  'Lance':'Era=Medieval Damage=Str+d8 Weight=10 Category=1h AP=2',
  'Pike':'Era=Medieval Damage=Str+d8 Weight=25 Category=2h',
  'Staff':'Era=Medieval Damage=Str+d4 Weight=8 Category=2h Parry=1',
  'Spear':'Era=Medieval Damage=Str+d6 Weight=5 Category=2h Range=3 Parry=1',

  'Bangstick':'Era=Modern Damage=3d6 Weight=2 Category=1h',
  'Bayonet':'Era=Modern Damage=Str+d6 Weight=1 Category=1h Parry=1',
  'Billy Club':'Era=Modern Damage=Str+d4 Weight=1 Category=1h',
  'Baton':'Era=Modern Damage=Str+d4 Weight=1 Category=1h',
  'Brass Knuckles':'Era=Modern Damage=Str+d4 Weight=1 Category=1h',
  'Chainsaw':'Era=Modern Damage=2d6+4 Weight=20 Category=1h',
  'Switchblade':'Era=Modern Damage=Str+d4 Weight=1 Category=1h',
  'Survival Knife':'Era=Modern Damage=Str+d4 Weight=3 Category=1h',

  'Molecular Knife':'Era=Future Damage=Str+d4+2 Weight=1 Category=1h AP=2',
  'Molecular Sword':'Era=Future Damage=Str+d8+2 Weight=8 Category=1h AP=4',
  'Laser Sword':'Era=Future Damage=Str+d6+8 Weight=5 Category=1h AP=12',

  'Throwing Axe':'Era=Medieval Damage=Str+d6 Weight=2 Category=R Range=3',
  'Bow':'Era=Medieval Damage=2d6 Weight=3 MinStr=6 Category=R Range=12',
  'Crossbow':'Era=Medieval Damage=2d6 Weight=10 MinStr=6 Category=R Range=15',
  'English Long Bow':
    'Era=Medieval Damage=2d6 Weight=5 MinStr=8 Category=R Range=15',
  'Sling':'Era=Medieval Damage=Str+d4 Weight=1 Category=R Range=4',

  'Brown Bess':'Era=Modern Damage=2d8 Weight=15 MinStr=6 Category=R Range=10',
  'Blunderbuss':'Era=Modern Damage=3d6 Weight=12 MinStr=6 Category=R Range=10',
  'Flintlock Pistol':'Era=Modern Damage=2d6+1 Weight=3 Category=R Range=5',
  'Kentucky Rifle':
    'Era=Modern Damage=2d8 Weight=8 MinStr=6 Category=R Range=15 AP=2',
  'Springfield':'Era=Modern Damage=2d8 Weight=11 MinStr=6 Category=R Range=15',

  'Derringer':'Era=Modern Damage=2d6+1 Weight=2 Category=R Range=5 AP=1',
  'Colt Dragoon':'Era=Modern Damage=2d6+1 Weight=4 Category=R Range=12',
  'Colt 1911':'Era=Modern Damage=2d6+1 Weight=4 Category=R Range=12',
  'S&W 44':'Era=Modern Damage=2d6+1 Weight=5 Category=R Range=12 AP=1',
  'Desert Eagle':'Era=Modern Damage=2d8 Weight=8 Category=R Range=15 AP=2',
  'Glock':'Era=Modern Damage=2d6 Weight=3 Category=R AP=1 Range=12 AP=1',
  'Peacemaker':'Era=Modern Damage=2d6+1 Weight=3 Category=R AP=1 Range=12 AP=1',
  'Ruger':'Era=Modern Damage=2d6+1 Weight=2 Category=R Range=10',
  'S&W 357':'Era=Modern Damage=2d6+1 Weight=4 Category=R Range=12 AP=1',
  'H&K MP5':'Era=Modern Damage=2d6 Weight=10 Category=R AP=1 Range=12 ROF=3',
  'MP40':'Era=Modern Damage=2d6 Weight=11 Category=R AP=1 Range=12 ROF=3',
  'Tommy Gun':
    'Era=Modern Damage=2d6+1 Weight=13 Category=R AP=1 Range=12 ROF=3',
  'Uzi':'Era=Modern Damage=2d6 Weight=9 Category=R AP=1 Range=12 ROF=3',

  'Double-Barrel Shotgun':'Era=Modern Damage=3d6 Weight=11 Category=R Range=12',
  'Pump Action Shotgun':'Era=Modern Damage=3d6 Weight=8 Category=R Range=12',
  'Sawed Off DB':'Era=Modern Damage=3d6 Weight=6 Category=R Range=5',
  'Streetsweeper':'Era=Modern Damage=3d6 Weight=10 Category=R Range=12',

  'Barrett Rifle':
    'Era=Modern Damage=2d10 Weight=35 MinStr=8 Category=R AP=4 Range=50',
  'M1':'Era=Modern Damage=2d8 Weight=10 MinStr=6 Category=R AP=2 Range=24',
  'Kar98':'Era=Modern Damage=2d8 Weight=9 MinStr=6 Category=R AP=2 Range=24',
  'Sharps Big 50':
    'Era=Modern Damage=2d10 Weight=11 MinStr=8 Category=R AP=2 Range=30',
  'Spencer Carbine':'Era=Modern Damage=2d8 Weight=8 Category=R AP=2 Range=20',
  "Winchester '76":
    'Era=Modern Damage=2d8 Weight=10 MinStr=6 Category=R AP=2 Range=24',

  'AK47':
    'Era=Modern Damage=2d8+1 Weight=10 MinStr=6 Category=R AP=2 Range=24 ROF=3',
  'H&K G3':
    'Era=Modern Damage=2d8 Weight=10 MinStr=6 Category=R AP=2 Range=24 ROF=3',
  'M-16':'Era=Modern Damage=2d8 Weight=8 Category=R AP=2 Range=24 ROF=3',
  'Steyr AUG':
    'Era=Modern Damage=2d8 Weight=8 Category=R AP=2 Range=24 ROF=3',

  'Gatling Gun':
    'Era=Modern Damage=2d8 Weight=40 Category=R AP=2 Range=24 ROF=3',
  'M2 Browning':
    'Era=Modern Damage=2d10 Weight=84 Category=R AP=4 Range=50 ROF=3',
  'M1919':'Era=Modern Damage=2d8 Weight=32 Category=R AP=2 Range=24 ROF=3',
  'M60':
    'Era=Modern Damage=2d8+1 Weight=33 MinStr=8 Category=R AP=2 Range=30 ROF=3',
  '7.7 MG':'Era=Modern Damage=2d8 Weight=85 Category=R AP=2 Range=30 ROF=3',
  'MG34':
    'Era=Modern Damage=2d8+1 Weight=26 MinStr=8 Category=R AP=2 Range=30 ROF=3',
  'MG42':
    'Era=Modern Damage=2d8+1 Weight=26 MinStr=8 Category=R AP=2 Range=30 ROF=4',
  'SAW':
    'Era=Modern Damage=2d8 Weight=20 MinStr=8 Category=R AP=2 Range=30 ROF=4',
  'Besa MG':
    'Era=Modern Damage=2d8 Weight=54 MinStr=8 Category=R AP=2 Range=40 ROF=3',
  'DTMG':
    'Era=Modern Damage=2d8+1 Weight=26 MinStr=8 Category=R AP=2 Range=30 ROF=3',
  '14.5mm MG':
    'Era=Modern Damage=3d6 Weight=26 MinStr=8 Category=R AP=2 Range=50 ROF=3',

  'Laser Pistol':'Era=Future Damage=3d6 Weight=4 Category=R Range=15',
  'Laser Rifle':
    'Era=Future Damage=3d6 Weight=8 MinStr=6 Category=R Range=30 ROF=3',
  'Laser MG':
    'Era=Future Damage=3d6 Weight=15 MinStr=8 Category=R Range=50 ROF=5'
 
};

/* Defines the rules related to character attributes and description. */
SWD.attributeRules = function(rules) {
  SWADE.attributeRules(rules);
  // No changes needed to the rules defined by base method
};

/* Defines the rules related to combat. */
SWD.combatRules = function(rules, armors, shields, weapons) {
  SWADE.combatRules(rules, armors, shields, weapons);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to basic character identity. */
SWD.identityRules = function(rules, races, eras, concepts, deitys) {
  SWADE.identityRules(rules, races, eras, concepts, deitys);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to powers. */
SWD.arcaneRules = function(rules, arcanas, powers) {
  SWADE.arcaneRules(rules, arcanas, powers);
  // Power Modifiers aren't part of the SWD rules
  rules.defineRule('commonPowerModifiers', 'powerPoints', '=', 'null');
};

/* Defines rules related to character aptitudes. */
SWD.talentRules = function(
  rules, edges, features, goodies, hindrances, languages, skills
) {
  SWADE.talentRules
    (rules, edges, features, goodies, hindrances, languages, skills);
  rules.defineRule('skillPoints', '', '=', '15');
  rules.defineChoice
    ('notes', 'skillNotes.charisma:%V Persuasion/%V Streetwise');
  rules.defineRule('charisma', 'advances', '=', '0');
  rules.defineRule
    ('skillNotes.charisma', 'charisma', '=', 'QuilvynUtils.signed(source)');
  rules.defineRule
    ('skillModifier.Persuasion', 'skillNotes.charisma', '+=', null);
  rules.defineRule
    ('skillModifier.Streetwise', 'skillNotes.charisma', '+=', null);
};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
SWD.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Arcana')
    SWD.arcanaRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValueArray(attrs, 'Powers')
    );
  else if(type == 'Armor')
    SWD.armorRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Era'),
      QuilvynUtils.getAttrValueArray(attrs, 'Area'),
      QuilvynUtils.getAttrValue(attrs, 'Armor'),
      QuilvynUtils.getAttrValue(attrs, 'MinStr'),
      QuilvynUtils.getAttrValue(attrs, 'Weight')
    );
  else if(type == 'Concept')
    SWD.conceptRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Edge'),
      QuilvynUtils.getAttrValueArray(attrs, 'Skill')
    );
  else if(type == 'Deity')
    SWD.deityRules(rules, name);
  else if(type == 'Edge') {
    SWD.edgeRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValueArray(attrs, 'Type')
    );
    SWD.edgeRulesExtra(rules, name);
  } else if(type == 'Era')
    SWD.eraRules(rules, name);
  else if(type == 'Feature')
    SWD.featureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Goody')
    SWD.goodyRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Pattern'),
      QuilvynUtils.getAttrValue(attrs, 'Effect'),
      QuilvynUtils.getAttrValue(attrs, 'Value'),
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Hindrance') {
    SWD.hindranceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'Severity')
    );
    SWD.hindranceRulesExtra(rules, name);
  } else if(type == 'Language')
    SWD.languageRules(rules, name);
  else if(type == 'Power')
    SWD.powerRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Advances'),
      QuilvynUtils.getAttrValue(attrs, 'PowerPoints'),
      QuilvynUtils.getAttrValue(attrs, 'Range'),
      QuilvynUtils.getAttrValue(attrs, 'Description')
    );
  else if(type == 'Race') {
    SWD.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages')
    );
    SWD.raceRulesExtra(rules, name);
  } else if(type == 'Shield')
    SWD.shieldRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Era'),
      QuilvynUtils.getAttrValue(attrs, 'Parry'),
      QuilvynUtils.getAttrValue(attrs, 'Cover'),
      QuilvynUtils.getAttrValue(attrs, 'MinStr'),
      QuilvynUtils.getAttrValue(attrs, 'Weight')
    );
  else if(type == 'Skill')
    SWD.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Attribute'),
      QuilvynUtils.getAttrValue(attrs, 'Core'),
      QuilvynUtils.getAttrValueArray(attrs, 'Era')
    );
  else if(type == 'Weapon')
    SWD.weaponRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Era'),
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
SWD.arcanaRules = function(rules, name, skill, powers) {
  SWADE.arcanaRules(rules, name, skill, powers);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with armor #name#, found during era
 * #eras#, which covers the body areas listed in #areas#, adds #armor# to the
 * character's Toughness, requires a strength of #minStr# to use effectively,
 * and weighs #weight#.
 */
SWD.armorRules = function(rules, name, eras, areas, armor, minStr, weight) {
  SWADE.armorRules(rules, name, eras, areas, armor, minStr || 0, weight);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with concept #name#. #attributes#,
 * #edges#, and #skills# list the names of attributes, edges, and skills
 * associated with the concept.
 */
SWD.conceptRules = function(rules, name, attributes, edges, skills) {
  SWADE.conceptRules(rules, name, attributes, edges, skills); 
  // No changes needed to the rules defined by base method
};

/* Defines in #rules# the rules associated with deity #name#. */
SWD.deityRules = function(rules, name) {
  SWADE.deityRules(rules, name);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with edge #name#. #require# and
 * #implies# list any hard and soft prerequisites for the edge, and #types#
 * lists the categories of the edge.
 */
SWD.edgeRules = function(rules, name, requires, implies, types) {
  SWADE.edgeRules(rules, name, requires, implies, types);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with edge #name# that cannot be
 * derived directly from the attributes passed to edgeRules.
 */
SWD.edgeRulesExtra = function(rules, name) {
  if(name == 'Arcane Resistance') {
    rules.defineRule('combatNotes.arcaneResistance',
      '', '=', '2',
      'combatNotes.improvedArcaneResistance', '+', '2'
    );
  } else if(name == 'Attractive') {
    rules.defineRule('skillNotes.attractive',
      '', '=', '2',
      'skillNotes.veryAttractive', '+', '2'
    );
  } else if(name == 'Brawler') {
    rules.defineRule
      ('damageAdjustment.Unarmed', 'combatNotes.brawler', '+', '2');
  } else if(name == 'Command') {
    rules.defineRule('commandRange',
      'features.Command', '=', '5',
      'featureNotes.commandPresence', '+', '5'
    );
    rules.defineRule('featureNotes.command',
      '', '=', '1',
      'featureNotes.inspire', '+', '1'
    );
  } else if(name == 'Counterattack') {
    rules.defineRule('combatNotes.counterattack.1',
      '', '=', '"-2 "',
      'combatNotes.improvedCounterattack', '=', '""'
    );
  } else if(name == 'Dodge') {
    rules.defineRule('combatNotes.dodge',
      '', '=', '1',
      'combatNotes.improvedDodge', '+', '1'
    );
  } else if(name == 'Extraction') {
    rules.defineRule('combatNotes.extraction',
      '', '=', '"1 foe"',
      'combatNotes.improvedExtraction', '=', '"all foes"'
    );
  } else if(name == 'First Strike') {
    rules.defineRule('combatNotes.firstStrike',
      '', '=', '1',
      'combatNotes.improvedFirstStrike', '=', '"all"'
    );
  } else if(name == 'Frenzy') {
    rules.defineRule('combatNotes.frenzy.1',
      '', '=', '", all at -2"',
      'combatNotes.improvedFrenzy', '=', '""'
    );
  } else if(name == 'Linguist') {
    rules.defineRule('skillNotes.linguist', 'smarts', '=', null);
    rules.defineRule('skillPoints', 'skillNotes.linguist', '+', null);
  } else if(name == 'Martial Artist') {
    SWADE.edgeRulesExtra(rules, name);
    rules.defineRule('combatNotes.martialArtist',
      'combatNotes.improvedMartialArtist', '+', '1'
    );
  } else if(name == 'Martial Arts Master') {
    rules.defineRule
      ('damageAdjustment.Unarmed', 'combatNotes.martialArtsMaster', '+', '2');
  } else if(name == 'New Power') {
    rules.defineRule('arcanaNotes.newPower', 'edges.New Power', '=', null);
  } else if(name == 'Noble') {
    rules.defineRule('features.Rich', 'featureNotes.noble', '=', '1');
  } else if(name == 'Rapid Recharge') {
    rules.defineRule('arcanaNotes.rapidRecharge',
      '', '=', '2',
      'arcanaNotes.improvedRapidRecharge', '+', '2'
    );
  } else if(name == 'Tough As Nails') {
    rules.defineRule('combatNotes.toughAsNails',
      '', '=', '1',
      'combatNotes.improvedToughAsNails', '+', '1'
    );
  } else {
    SWADE.edgeRulesExtra(rules, name);
  }
};

/* Defines in #rules# the rules associated with era #name#. */
SWD.eraRules = function(rules, name) {
  SWADE.eraRules(rules, name);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
SWD.featureRules = function(rules, name, sections, notes) {
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
SWD.goodyRules = function(
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
SWD.hindranceRules = function(rules, name, requires, severity) {
  SWADE.hindranceRules(rules, name, requires, severity);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with hindrance #name# that cannot be
 * derived directly from the attributes passed to hindranceRules.
 */
SWD.hindranceRulesExtra = function(rules, name) {
  SWADE.hindranceRulesExtra(rules, name);
  // No changes needed to the rules defined by base method
};

/* Defines in #rules# the rules associated with language #name#. */
SWD.languageRules = function(rules, name) {
  if(!name) {
    console.log('Empty language name');
    return;
  }
  SWD.skillRules
    (rules, 'Knowledge (Language (' + name + '))', 'smarts', false, []);
};

/*
 * Defines in #rules# the rules associated with power #name#, which may be
 * acquired only after #advances# advances, requires #powerPoints# Power Points
 * to use, and can be cast at range #range#. #description# is a concise
 * description of the power's effects.
 */
SWD.powerRules = function(
  rules, name, advances, powerPoints, range, description
) {
  SWADE.powerRules
    (rules, name, advances, powerPoints, range, description, null, []);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with race #name#, which has the list
 * of hard prerequisites #requires#. #features# list associated features and
 * #languages# any automatic languages.
 */
SWD.raceRules = function(rules, name, requires, features, languages) {
  SWADE.raceRules(rules, name, requires, features, languages);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
SWD.raceRulesExtra = function(rules, name) {
  if(name == 'Android') {
    rules.defineRule
      ('features.Pacifist+', 'featureNotes.asimovCircuits', '=', '1');
  } else if(name == 'Atlantean') {
    rules.defineRule('skillStep.Swimming', 'skillNotes.aquatic', '+=', '2');
  } else if(name == 'Half-Elf') {
    rules.defineRule
      ('improvementPoints', 'descriptionNotes.heritage', '+', '2');
  } else if(name == 'Rakashan') {
    rules.defineRule
      ('isRakashan', 'race', '=', 'source == "Rakashan" ? 1 : null');
    rules.defineRule('damageStep.Claws', 'isRakashan', '^=', '2');
  } else if(name == 'Saurian') {
    rules.defineRule('features.Bite', 'combatNotes.naturalWeapons', '=', '1');
    rules.defineRule('features.Claws', 'combatNotes.naturalWeapons', '=', '1');
    rules.defineRule('features.Tail', 'combatNotes.naturalWeapons', '=', '1');
  }
};

/*
 * Defines in #rules# the rules associated with shield #name#, found during
 * eras #eras#, which adds #parry# to the character's Parry, provides #cover#
 * cover, requires #minStr# to handle, and weighs #weight#.
 */
SWD.shieldRules = function(rules, name, eras, parry, cover, minStr, weight) {
  SWADE.shieldRules(rules, name, eras, parry, cover, minStr || 0, weight);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * #attribute# (one of 'agility', 'spirit', etc.). If specified, the skill is
 * available only in the eras listed in #eras#.
 */
SWD.skillRules = function(rules, name, attribute, core, eras) {
  SWADE.skillRules(rules, name, attribute, core, eras);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with weapon #name#, found during
 * eras #eras#, which belongs to category #category#, requires #minStr# to use
 * effectively, and weighs #weight#. The weapon does #damage# HP on a
 * successful attack. If specified, the weapon bypasses #armorPiercing# points
 * of armor. Also if specified, the weapon can be used as a ranged weapon with
 * a range increment of #range# feet, firing #rateOfFire# per round. Parry, if
 * specified, indicates the parry bonus from wielding the weapon.
 */
SWD.weaponRules = function(
  rules, name, eras, damage, minStr, weight, category, armorPiercing, range,
  rateOfFire, parry
) {
  if(minStr == null && (damage + '').match(/d\d+/))
    minStr = damage.match(/d(\d+)/)[1] - 0;
  SWADE.weaponRules(
    rules, name, eras, damage, minStr, weight, category, armorPiercing, range,
    rateOfFire, parry
  );
  // No changes needed to the rules defined by base method
};

/*
 * Returns the dictionary of attribute formats associated with character sheet
 * format #viewer# in #rules#.
 */
SWD.getFormats = SWADE.getFormats;

/* Returns an ObjectViewer loaded with the default character sheet format. */
SWD.createViewers = SWADE.createViewers;

/*
 * Returns the list of editing elements needed by #choiceRules# to add a #type#
 * item to #rules#.
 */
SWD.choiceEditorElements = SWADE.choiceEditorElements;

/* Returns the elements in a basic 5E character editor. */
SWD.initialEditorElements = SWADE.initialEditorElements;

/* Sets #attributes#'s #attribute# attribute to a random value. */
SWD.randomizeOneAttribute = SWADE.randomizeOneAttribute;

/* Fixes as many validation errors in #attributes# as possible. */
SWD.makeValid = SWADE.makeValid;

/* Returns an array of plugins upon which this one depends. */
SWD.getPlugins = function() {
  return [SWADE];
};

/* Returns HTML body content for user notes associated with this rule set. */
SWD.ruleNotes = function() {
  return '' +
    '<h2>SWD Quilvyn Module Notes</h2>\n' +
    'SWD Quilvyn Module Version ' + SWD.VERSION + '\n' +
    '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Quilvyn does not note characters with the Gadgeteer edge who do\n' +
    '    not have the required d6+ in two scientific Knowledge skills.\n' +
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
    "Savage Worlds Deluxe Explorer's Edition © 2012 Great White Games, LLC; DBA\n" +
    'Pinnacle Entertainment Group.\n' +
    '</p>\n' +
    '<img alt="Savage Worlds Fan Logo" width="300" height="200" src="https://peginc.com/wp-content/uploads/2019/01/SW_LOGO_FP_2018.png"/>\n';
};
