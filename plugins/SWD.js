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
  rules.plugin = SWD;
  SWD.rules = rules;

  rules.defineChoice('choices', SWD.CHOICES);
  rules.choiceEditorElements = SWD.choiceEditorElements;
  rules.choiceRules = SWD.choiceRules;
  rules.removeChoice = SWADE.removeChoice;
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
    (rules, SWD.EDGES, SWD.FEATURES, SWD.GOODIES, SWD.HINDRANCES, SWD.SKILLS);
  SWD.identityRules(rules, SWD.RACES, SWD.ERAS, SWD.CONCEPTS);

  Quilvyn.addRuleSet(rules);

}

SWD.VERSION = '2.4.1.0';

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
  'Elan':'Type=Combat Require="spirit >= 8"',
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
    'Type=Professional ' +
    'Require=' +
      '"features.Arcane Background (Miracles)",' +
      '"spirit >= 8",' +
      '"strength >= 6",' +
      '"vigor >= 8",' +
      '"skills.Faith >= 6",' +
      '"skills.Fighting >= 8"',
  'Gadgeteer':
    'Type=Professional ' +
    'Require=' +
      '"features.Arcane Background (Weird Science)",' +
      '"smarts >= 8",' +
      '"skills.Repair >= 8",' +
      '"skills.Weird Science >= 8"',
  'Holy/Unholy Warrior':
    'Type=Professional ' +
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
    'Type=Professional ' +
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
    'Type=Professional ' +
    'Require=' +
      '"agility >= 8",' +
      '"skills.Climbing >= 6",' +
      '"skills.Lockpicking >= 6",' +
      '"skills.Stealth >= 8"',
  'Wizard':
    'Type=Professional ' +
    'Require=' +
      '"features.Arcane Background (Magic)",' +
      '"smarts >= 8",' +
      '"skills.Knowledge (Arcana) >= 8",' +
      '"skills.Spellcasting >= 6"',
  'Woodsman':
    'Type=Professional ' +
    'Require="spirit >= 6","skills.Survival >= 8","skills.Tracking >= 8"',
  // Social
  'Bolster':null,
  'Charismatic':'Type=Social Require="spirit >= 8"',
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
  'Tough As Nails':'Type=Legendary Require="advances >= 16"',
  'Tougher Than Nails':null

};
SWD.EDGES = {
  // Background
  'Arcane Background (Super Powers)':'Type=Background',
  'Noble':'Type=Background',
  // Combat
  'Florentine':'Type=Combat Require="agility >= 8","skills.Fighting >= 8"',
  'Improved Martial Artist':
    'Type=Combat ' +
    'Require="advances >= 8","features.Martial Artist","skills.Fighting >= 10"',
  'Quick Draw':'Type=Combat Require="agility >= 8"',
  // Leadership
  'Leader Of Men':'Type=Leadership Require="advances >= 4","features.Command"',
  // Power
  'New Power':'Type=Power Require="powerPoints >= 1"',
  // Professional
  'Adept':
    'Type=Professional ' +
    'Require=' +
      '"features.Arcane Background (Miracles)",' +
      '"features.Martial Artist",' +
      '"skills.Faith >= 8",' +
      '"skills.Fighting >= 8"',
  'Scholar':'Type=Professional"',
  // Legendary
  'Martial Arts Master':
    'Type=Legendary ' +
    'Require=' +
      '"advances >= 16",' +
      '"features.Improved Martial Artist",' +
      '"skills.Fighting >= 12"',
  'Improved Tough As Nails':
    'Type=Legendary Require="advances >= 16","features.Tough As Nails"'
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
    'Section=combat,skill ' +
    'Note=' +
      '"May spend a Benny to Soak vehicle damage",' +
      '"+2 Boating/+2 Driving/+2 Piloting"',
  'Acrobat':
    'Section=attribute,combat ' +
    'Note="+2 Agility (acrobatic maneuvers)","+1 Parry"',
  'Adept':
    'Section=arcana ' +
    'Note="May spend 1 Power Point for unarmed AP 2/May activate chosen power on self as a free action"',
  'Alertness':SWADE.FEATURES.Alertness,
  'Ambidextrous':'Section=combat Note="Suffers no off-hand penalty"',
  'Arcane Background (Magic)':
    'Section=arcana,arcana ' +
    'Note=' +
      '"3 Powers/10 Power Points",' +
      '"Rolled 1 on Spellcasting die inflicts Shaken"',
  'Arcane Background (Miracles)':
    'Section=arcana,feature ' +
    'Note=' +
      '"2 Powers/10 Power Points",' +
      '"Violating core beliefs inflicts -2 Faith for 1 wk; major sins remove powers"',
  'Arcane Background (Psionics)':
    'Section=arcana,arcana ' +
    'Note=' +
      '"3 Powers/10 Power Points",' +
      '"Rolled 1 on Psionics die inflicts Shaken; critical failure shakes allies in a 3\\" radius"',
  'Arcane Background (Super Powers)':
    'Section=arcana Note="1 Power/20 Power Points"',
  'Arcane Background (Weird Science)':
    'Section=arcana,arcana ' +
    'Note=' +
      '"1 Power/10 Power Points",' +
      '"Rolled 1 on Weird Science die causes a malfunction"',
  'Arcane Resistance':
    'Section=combat ' +
    'Note="+%{combatNotes.improvedArcaneResistance?4:2} Armor vs. arcane powers/+%{combatNotes.improvedArcaneResistance?4:2} Trait resisting arcane powers"',
  'Assassin':'Section=combat Note="+2 damage to unaware foes"',
  'Attractive':
    'Section=skill Note="+%{skillNotes.veryAttractive?4:2} Charisma"',
  'Beast Bond':SWADE.FEATURES['Beast Bond'],
  'Beast Master':SWADE.FEATURES['Beast Master'],
  'Berserk':
    'Section=combat ' +
    'Note="Injury causes +2 Fighting, Strength, melee damage, and Toughness, -2 Parry, ignores Wound penalties, and random hits when 1 rolled on Fighting die (Smarts-2 neg)"',
  'Block':'Section=combat Note="+%{combatNotes.improvedBlock?2:1} Parry"',
  'Brave':'Section=attribute Note="+2 Spirit vs. fear"',
  'Brawler':'Section=combat Note="+2 Unarmed damage"',
  'Brawny':
    'Section=attribute,combat ' +
    'Note=' +
      '"+1 Strength Step (encumbrance and minimum strength requirements)",' +
      '"+1 Toughness"',
  'Bruiser':'Section=combat Note="Raise on unarmed attack inflicts d8 damage"',
  'Champion':
    'Section=combat ' +
    'Note="+2 damage and Toughness vs. foe w/supernaturally opposed alignment"',
  'Charismatic':'Section=skill Note="+2 Charisma"',
  'Combat Reflexes':'Section=combat Note="+2 on Shaken recovery rolls"',
  'Command':
    'Section=feature ' +
    'Note="R%{commandRange}\\" Commanded gain +%{featureNotes.inspire?2:1} to recover from Shaken"',
  'Command Presence':SWADE.FEATURES['Command Presence'],
  'Common Bond':SWADE.FEATURES['Common Bond'],
  'Connections':SWADE.FEATURES.Connections,
  'Counterattack':
    'Section=combat ' +
    'Note="May make a free %{combatNotes.improvedCounterattack?\'\':\'-2 \'}attack after a failed foe attack"',
  'Danger Sense':
    'Section=combat Note="May test Notice-2 before a surprise attack"',
  'Dead Shot':SWADE.FEATURES['Dead Shot'],
  'Dodge':
    'Section=combat ' +
    'Note="-%{combatNotes.improvedDodge?2:1} foe ranged attacks, +%{combatNotes.improvedDodge?2:1} evading area attacks"',
  'Elan':SWADE.FEATURES.Elan,
  'Expert (%attribute)':SWADE.FEATURES['Expert (%attribute)'],
  'Expert (%skill)':SWADE.FEATURES['Expert (%skill)'],
  'Extraction':
    'Section=combat ' +
    'Note="Successful Agility negates attack of 1 foe%{combatNotes.improvedExtraction?\' (Raise all foes)\':\'\'} during withdrawal"',
  'Fast Healer':'Section=combat Note="+2 Vigor (natural healing)"',
  'Fervor':SWADE.FEATURES.Fervor,
  'Filthy Rich':SWADE.FEATURES['Filthy Rich'],
  'First Strike':
    'Section=combat ' +
    'Note="May make a free attack when a foe moves into reach%{combatNotes.improvedFirstStrike?\'\':\' 1/rd\'}"',
  'Fleet-Footed':'Section=combat Note="+2 Pace/+2 Run Step"',
  'Florentine':
    'Section=combat ' +
    'Note="+1 attack vs. a foe wielding a single weapon/-1 foe Gang Up bonus"',
  'Followers':SWADE.FEATURES.Followers,
  'Frenzy':
    'Section=combat Note="May make an additional Fighting attack each rd%{combatNotes.improvedFrenzy?\'\':\', suffering -2 on all attacks\'}"',
  'Gadgeteer':SWADE.FEATURES.Gadgeteer,
  'Giant Killer':SWADE.FEATURES['Giant Killer'],
  'Great Luck':SWADE.FEATURES['Great Luck'],
  'Hard To Kill':
    'Section=combat ' +
    'Note="Ignores Wound penalties on Vigor tests to avoid incapacitation or death"',
  'Harder To Kill':SWADE.FEATURES['Harder To Kill'],
  'Healer':SWADE.FEATURES.Healer,
  'Hold The Line!':SWADE.FEATURES['Hold The Line!'],
  'Holy/Unholy Warrior':
    'Section=arcana ' +
    'Note="R%{spirit}\\" May spend 1 Power Point to shake supernatural creatures (Spirit neg; critical failure destroyed)"',
  'Improved Arcane Resistance':SWADE.FEATURES['Improved Arcane Resistance'],
  'Improved Block':SWADE.FEATURES['Improved Block'],
  'Improved Counterattack':SWADE.FEATURES['Improved Counterattack'],
  'Improved Dodge':'Section=combat Note="Increased Dodge effects"',
  'Improved Extraction':SWADE.FEATURES['Improved Extraction'],
  'Improved First Strike':SWADE.FEATURES['Improved First Strike'],
  'Improved Frenzy':SWADE.FEATURES['Improved Frenzy'],
  'Improved Level Headed':SWADE.FEATURES['Improved Level Headed'],
  'Improved Martial Artist':
    'Section=combat Note="Increased Martial Artist effects"',
  'Improved Nerves Of Steel':SWADE.FEATURES['Improved Nerves Of Steel'],
  'Improved Rapid Recharge':SWADE.FEATURES['Improved Rapid Recharge'],
  'Improved Sweep':SWADE.FEATURES['Improved Sweep'],
  'Improved Tough As Nails':
    'Section=combat Note="Increased Tough As Nails effects"',
  'Improved Trademark Weapon (%weapon)':
    SWADE.FEATURES['Improved Trademark Weapon (%weapon)'],
  'Improvisational Fighter':SWADE.FEATURES['Improvisational Fighter'],
  'Inspire':'Section=feature Note="Increased Command effects"',
  'Investigator':
    'Section=skill,skill ' +
    'Note=' +
      '"+2 Investigation/+2 Streetwise",' +
      '"+2 Notice (sifting for information)"',
  'Jack-Of-All-Trades':
    'Section=skill Note="Rolls d4 when attempting untrained Smarts skills"',
  'Killer Instinct':
    'Section=skill Note="May reroll 1s and wins ties on opposed tests"',
  'Leader Of Men':
    'Section=combat Note="R%{commandRange}\\" Commanded use d10 wild die"',
  'Level Headed':SWADE.FEATURES['Level Headed'],
  'Linguist':
    'Section=skill ' +
    'Note="+%V Skill Points (d4 in in %{smarts} Knowledge (Language) skills)/May attempt smarts-2 to understand other familiar tongues"',
  'Liquid Courage':
    'Section=attribute ' +
    'Note="Drinking alcohol gives +1 Vigor Step and negates 1 Wound penalty for 1 hr"',
  'Luck':SWADE.FEATURES.Luck,
  'Marksman':'Section=combat Note="May forego move for a +2 ranged attack"',
  'Martial Artist':
    'Section=combat ' +
    'Note="+%{combatNotes.improvedMartialArtist?2:1} Unarmed damage Step"',
  'Martial Arts Master':'Section=combat Note="+2 Unarmed damage"',
  'Master Of Arms':SWADE.FEATURES['Master Of Arms'],
  'Master (%attribute)':SWADE.FEATURES['Master (%attribute)'],
  'Master (%skill)':SWADE.FEATURES['Master (%skill)'],
  'McGyver':
    'Section=skill Note="May create an improvised weapon, explosive, or tool"',
  'Mentalist':SWADE.FEATURES.Mentalist,
  'Mighty Blow':SWADE.FEATURES['Mighty Blow'],
  'Mister Fix It':SWADE.FEATURES['Mister Fix It'],
  'Natural Leader':
    'Section=feature Note="R%{commandRange}\\" May share Bennies with commanded"',
  'Nerves Of Steel':SWADE.FEATURES['Nerves Of Steel'],
  'New Power':'Section=arcana Note="+%V Power Count"',
  'No Mercy':'Section=combat Note="May spend a Benny to reroll damage"',
  'Noble':
    'Section=feature,skill ' +
    'Note="Has Rich feature","+2 Charisma"',
  'Power Points':SWADE.FEATURES['Power Points'],
  'Power Surge':
    'Section=arcana ' +
    'Note="Drawing a joker Action Card restores 2d6 Power Points"',
  'Professional (Agility)':SWADE.FEATURES['Professional (Agility)'],
  'Professional (Smarts)':SWADE.FEATURES['Professional (Smarts)'],
  'Professional (Spirit)':SWADE.FEATURES['Professional (Spirit)'],
  'Professional (Strength)':SWADE.FEATURES['Professional (Strength)'],
  'Professional (Vigor)':SWADE.FEATURES['Professional (Vigor)'],
  'Professional (%skill)':SWADE.FEATURES['Professional (%skill)'],
  'Quick':SWADE.FEATURES.Quick,
  'Quick Draw':'Section=combat Note="May draw a weapon as a free action"',
  'Rapid Recharge':
    'Section=arcana ' +
    'Note="Recovers %{arcanaNotes.improvedRapidRecharge?4:2} Power Points/hr"',
  'Rich':SWADE.FEATURES.Rich,
  'Rock And Roll':SWADE.FEATURES['Rock And Roll'],
  'Scavenger':'Section=combat Note="May recover equipment 1/encounter"',
  'Scholar':'Section=skill Note="+2 on 2 chosen skills"',
  'Sidekick':SWADE.FEATURES.Sidekick,
  'Soul Drain':
    'Section=arcana ' +
    'Note="Successful Spirit roll allows immediate Power activation w/out spending Power Points"',
  'Steady Hands':SWADE.FEATURES['Steady Hands'],
  'Strong Willed':
    'Section=attribute,skill ' +
    'Note="+2 Smarts (resist Tests)/+2 Spirit (resist Tests)",' +
         '"+2 Intimidation/+2 Taunt"',
  'Sweep':SWADE.FEATURES.Sweep,
  'Tactician':
    'Section=combat ' +
    'Note="R%{commandRange}\\" Successful Knowledge (Battle) allows distribution of an Action Card to commanded for each success and raise"',
  'Thief':
    'Section=skill,skill ' +
    'Note=' +
      '"+2 Climbing/+2 Lockpicking",' +
      '"+2 Notice (traps)/+1 Repair (traps)/+2 Stealth (urban)"',
  'Tough As Nails':
    'Section=combat Note="+%{combatNotes.improvedToughAsNails?2:1} Toughness"',
  'Trademark Weapon (%melee)':'Section=combat Note="+%V attack with %melee"',
  'Trademark Weapon (%ranged)':'Section=combat Note="+%V attack with %ranged"',
  'Two-Fisted':SWADE.FEATURES['Two-Fisted'],
  'Very Attractive':SWADE.FEATURES['Very Attractive'],
  'Weapon Master':
    'Section=combat Note="+%{combatNotes.masterOfArms?2:1} Parry"',
  'Wizard':
    'Section=arcana ' +
    'Note="Each raise on an arcane roll reduces the cost of a Power use by 1"',
  'Woodsman':
    'Section=skill ' +
    'Note="+2 Stealth (wilds)/+2 Survival (wilds)/+2 Tracking (wilds)"',

  // Hindrances
  'All Thumbs':
    'Section=skill,skill ' +
    'Note=' +
      '"-2 Repair",' +
      '"Rolled 1 on Repair die breaks device"',
  'Anemic':
    'Section=feature Note="-2 Fatigue checks (resist poison and disease)"',
  'Arrogant+':SWADE.FEATURES['Arrogant+'],
  'Bad Eyes':
     'Section=skill ' +
     'Note="-2 on distant visual Trait rolls and ranged attacks w/out corrective lenses"',
  'Bad Eyes+':
    'Section=skill Note="-2 on distant visual Trait rolls and ranged attacks"',
  'Bad Luck+':SWADE.FEATURES['Bad Luck+'],
  'Big Mouth':SWADE.FEATURES['Big Mouth'],
  'Blind+':
    'Section=feature,skill ' +
    'Note="+1 Edge Points","-6 on visual tasks, -2 on social"',
  'Bloodthirsty+':'Section=skill Note="-4 Charisma"',
  'Cautious':SWADE.FEATURES.Cautious,
  'Clueless+':'Section=attribute Note="-2 Smarts (common knowledge)"',
  'Code Of Honor+':SWADE.FEATURES['Code Of Honor+'],
  'Curious+':SWADE.FEATURES['Curious+'],
  'Death Wish':SWADE.FEATURES['Death Wish'],
  'Delusional':SWADE.FEATURES.Delusional,
  'Delusional+':SWADE.FEATURES['Delusional+'],
  'Doubting Thomas':'Section=attribute Note="-2 vs. supernatural horror"',
  'Elderly+':
    'Section=attribute,combat,skill ' +
    'Note="-1 Strength Step/-1 Vigor Step","-1 Pace","+5 Skill Points"',
  'Enemy':SWADE.FEATURES.Enemy,
  'Enemy+':SWADE.FEATURES['Enemy+'],
  'Greedy':SWADE.FEATURES.Greedy,
  'Greedy+':SWADE.FEATURES['Greedy+'],
  'Habit':
    'Section=feature,skill ' +
    'Note="Has an irritating but harmless compulsion","-1 Charisma"',
  'Habit+':SWADE.FEATURES['Habit+'],
  'Hard Of Hearing':'Section=skill Note="-2 Notice (hearing)"',
  'Hard Of Hearing+':SWADE.FEATURES['Hard Of Hearing+'],
  'Heroic+':SWADE.FEATURES['Heroic+'],
  'Illiterate':SWADE.FEATURES.Illiterate,
  'Lame+':'Section=combat Note="-2 Pace/-1 Run Step"',
  'Loyal':SWADE.FEATURES.Loyal,
  'Mean':
    'Section=feature,skill ' +
    'Note="Ill-tempered and disagreeable","-2 Charisma"',
  'Obese':'Section=combat Note="-1 Pace/-1 Run Step/+1 Toughness"',
  'One Arm+':SWADE.FEATURES['One Arm+'],
  'One Eye+':
    'Section=skill,skill ' +
    'Note=' +
      '"-2 Shooting/-2 Throwing",' +
      '"-2 tasks requiring depth perception/-1 Charisma unless missing eye is covered"',
  'One Leg+':
    'Section=combat,combat,skill ' +
    'Note=' +
      '"-4 Pace",' +
      '"Cannot run",' +
      '"-2 Climbing/-2 Fighting/-2 Swimming"',
  'Outsider':'Section=skill Note="-2 Charisma (other races)"',
  'Overconfident+':SWADE.FEATURES['Overconfident+'],
  'Pacifist':SWADE.FEATURES.Pacifist,
  'Pacifist+':SWADE.FEATURES['Pacifist+'],
  'Phobia':
    'Section=feature ' +
    'Note="-2 on Trait rolls in the presence of phobia subject"',
  'Phobia+':
    'Section=feature ' +
    'Note="-4 on Trait rolls in the presence of phobia subject"',
  'Poverty':SWADE.FEATURES.Poverty,
  'Quirk':SWADE.FEATURES.Quirk,
  'Small+':'Section=combat Note="-1 Toughness"',
  'Stubborn':SWADE.FEATURES.Stubborn,
  'Ugly':'Section=skill Note="-2 Charisma"',
  'Vengeful':SWADE.FEATURES.Vengeful,
  'Vengeful+':SWADE.FEATURES['Vengeful+'],
  'Vow':SWADE.FEATURES.Vow,
  'Vow+':SWADE.FEATURES['Vow+'],
  'Wanted':SWADE.FEATURES.Wanted,
  'Wanted+':SWADE.FEATURES['Wanted+'],
  'Yellow+':'Section=attribute Note="-2 Spirit vs. fear"',
  'Young+':
    'Section=attribute,feature,skill ' +
    'Note="-2 Attribute Points","+1 Benny each session","-2 Skill Points"',

  // Races
  'Adaptable':SWADE.FEATURES.Adaptable,
  'Advanced Civilization':'Section=attribute Note="+1 Smarts Step"',
  'Agile':SWADE.FEATURES.Agile,
  'Aquatic':
    'Section=combat,feature,skill ' +
    'Note="Swim Pace %{pace}","Cannot drown","d6 in Swimming"',
  'Asimov Circuits':'Section=feature Note="Has Pacifist+ feature"',
  'Atlantean Tough':'Section=combat Note="+1 Toughness"',
  'Bite':SWADE.FEATURES.Bite,
  'Burrowing':SWADE.FEATURES.Burrowing,
  'Claws':
    'Section=combat,skill ' +
    'Note="Claws are a natural weapon","+2 Climbing"',
  'Construct':
    'Section=attribute,combat ' +
    'Note=' +
      '"+2 Shaken recovery, immune to disease and poison",' +
      '"Ignores Wound penalties/Requires Repair to heal"',
  'Dehydration':
    'Section=feature Note="Requires 1 hr/dy immersion to avoid fatigue"',
  'Flight':'Section=combat Note="Fly Pace %{pace}"',
  'Fortunate':'Section=feature Note="+1 Benny each session"',
  'Hardy':SWADE.FEATURES.Hardy,
  'Heritage':SWADE.FEATURES.Heritage,
  'Hollow-Boned':'Section=combat Note="-1 Toughness"',
  'Immune To Disease':SWADE.FEATURES['Immune To Disease'],
  'Immune To Poison':SWADE.FEATURES['Immune To Poison'],
  'Infravision':
    'Section=combat ' +
    'Note="Suffers half normal penalties when attacking in poor lighting"',
  'Low Light Vision':SWADE.FEATURES['Low Light Vision'],
  'Mostly Human':'Section=feature Note="+1 Edge Points"',
  'Multiple Limbs':
    'Section=combat ' +
    'Note="May take 1 additional actions per extra limb w/out a multi-action penalty"',
  'Natural Weapons':'Section=combat Note="Has Bite, Claws, and Tail features"',
  'Poison':SWADE.FEATURES['Poisonous Touch'],
  'Potent Poison':
    'Section=combat Note="Poison target suffers -%V Vigor to resist"',
  'Programming':'Section=skill Note="+2 Skill Points"',
  'Racial Enemy':'Section=skill Note="-4 Charisma (racial enemy)"',
  'Recharge':
    'Section=feature ' +
    'Note="Requires access to a power source 1/dy to avoid fatigue"',
  'Saurian Senses':'Section=skill Note="+2 Notice"',
  'Semi-Aquatic':SWADE.FEATURES['Semi-Aquatic'],
  'Short':'Section=combat,description Note="-1 Toughness","-1 Size"',
  'Slow':'Section=combat Note="-1 Pace"',
  'Spirited':SWADE.FEATURES.Spirited,
  'Strong':SWADE.FEATURES.Strong,
  'Tail':SWADE.FEATURES.Tail,
  'Tough':SWADE.FEATURES.Tough,
  'Unnatural':'Section=feature Note="-2 arcane power effects"',
  'Wall Walker':SWADE.FEATURES['Wall Walker'],
  'Warm Natured':'Section=attribute Note="-4 Vigor (resist cold)"'

};
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
    'Description="Creates sections of 1\\" high wall for PP rd"',
  'Beast Friend':
    'PowerPoints=3+2xSize ' +
    'Range=smarts*50',
  'Blast':
    'PowerPoints=2 ' +
    'Range=24 ' +
    'Description="2\\" radius inflicts 2d6 damage"',
  'Blind':
    'Range=12 ' +
    'Description=' +
      '"Target suffers Shaken and -2 on Parry (Agility-2 neg, 1 on die also suffers -6 Trait tests) for 1 rd"',
  'Bolt':
    'PowerPoints=1/missile ' +
    'Range=12 ' +
    'Description="Inflicts 2d6 damage"',
  'Boost/Lower Trait':
    'Range=smarts ' +
    'Description=' +
      '"Target gains +1 Trait Step or suffers -1 Trait Step (Raise +2 or -2 (Spirit neg)) for 3 rd"',
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
      '"Distracts and throws creatures in 2\\" radius 2d6\\" (Strength neg)"',
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
    'Description="Teleports PPx10\\" (Raise PPx15\\")"',
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
    'Description="Target gains +2 Armor (Raise +4) for 3 rd"',
  'Greater Healing':
    'Advances=8 ' +
    'PowerPoints=10 ' +
    'Range=touch ' +
    'Description="Restores 1 wound (Raise 2 wounds) w/out a time limit or removes poison, disease, or sickness"',
  'Light/Obscure':SWADE.POWERS['Light/Darkness'] + ' ' +
    'Description=' +
      '"Creates a 3\\" radius bright light for 30 min or darkness for 3 rd"',
  'Pummel':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Range=9 ' +
    'Description="Cone pushes creatures 2d6\\" (Strength neg)"',
  'Quickness':
    'Advances=4 ' +
    'PowerPoints=4 ' +
    'Range=touch ' +
    'Description="Target gains an additional action for 3 rd (Raise also may redraw Action Cards below 8)"',
  'Slow':
    'Advances=4 ' +
    'PowerPoints=1 ' +
    'Range=smarts*2 ' +
    'Description=' +
      '"Target move counts as an action (Raise also must redraw Action Cards above 10) for 3 rd (Spirit neg)"',
  'Smite':
    'Range=touch',
  'Speed':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Range=touch ' +
    'Description="Target gains dbl Pace (Raise also Run as a free action) for 3 rd"',
  'Succor':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Range=touch ' +
    'Description="Target recovers from 1 level of fatigue (Raise 2 levels) and Shaken"',
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
    'Abilities=' +
      '"Asimov Circuits",Construct,Outsider,Programming,Recharge,Unnatural',
  'Atlantean':
    'Abilities=' +
      '"Advanced Civilization",Aquatic,"Atlantean Tough",Dehydration',
  'Avion':
    'Abilities=' +
      'Flight,"Hollow-Boned","Mostly Human"',
  'Dwarf':
    'Abilities=' +
      '"Low Light Vision",Slow,Tough',
  'Elf':
    'Abilities=' +
      'Agile,"All Thumbs","Low Light Vision"',
  'Half-Elf':
    'Abilities=' +
      'Heritage,"Low Light Vision",Outsider',
  'Half-Folk':
    'Abilities=' +
      'Fortunate,Short,Spirited',
  'Half-Orc':
    'Abilities=' +
      'Infravision,Outsider,Strong',
  'Human':
    'Abilities=' +
      'Adaptable',
  'Rakashan':
    'Abilities=' +
      'Agile,Bloodthirsty+,Claws,"Low Light Vision","Racial Enemy"',
  'Saurian':
    'Abilities=' +
      '"Natural Weapons",Outsider,"Saurian Senses","Warm Natured"',
};
SWD.SHIELDS = {
  'None':'Parry=0 Cover=0 Weight=0',
  'Small Shield':'Era=Medieval Parry=1 Cover=0 Weight=8',
  'Medium Shield':'Era=Medieval Parry=1 Cover=2 Weight=12',
  'Large Shield':'Era=Medieval Parry=2 Cover=2 Weight=20'
};
SWD.SKILLS = {
  'Boating':'Attribute=Agility',
  'Climbing':'Attribute=Strength',
  'Driving':'Attribute=Agility Era=Modern,Future',
  'Fighting':'Attribute=Agility',
  'Gambling':'Attribute=Smarts',
  'Healing':'Attribute=Smarts',
  'Intimidation':'Attribute=Spirit',
  'Investigation':'Attribute=Smarts',
  'Knowledge (Academics)':'Attribute=Smarts',
  'Knowledge (Arcana)':'Attribute=Smarts',
  'Knowledge (Battle)':'Attribute=Smarts',
  'Knowledge (Computers)':'Attribute=Smarts Era=Modern,Future',
  'Knowledge (Electronics)':'Attribute=Smarts Era=Modern,Future',
  'Knowledge (History)':'Attribute=Smarts',
  'Knowledge (Journalism)':'Attribute=Smarts',
  'Knowledge (Law)':'Attribute=Smarts',
  'Knowledge (Medicine)':'Attribute=Smarts',
  'Knowledge (Occult)':'Attribute=Smarts',
  'Knowledge (Science)':'Attribute=Smarts',
  'Lockpicking':'Attribute=Agility',
  'Notice':'Attribute=Smarts',
  'Persuasion':'Attribute=Spirit',
  'Piloting':'Attribute=Agility Era=Modern,Future',
  'Repair':'Attribute=Smarts',
  'Riding':'Attribute=Agility',
  'Shooting':'Attribute=Agility',
  'Stealth':'Attribute=Agility',
  'Streetwise':'Attribute=Smarts',
  'Survival':'Attribute=Smarts',
  'Swimming':'Attribute=Agility',
  'Taunt':'Attribute=Smarts',
  'Throwing':'Attribute=Agility',
  'Tracking':'Attribute=Smarts',
  // Arcane Background skills
  'Faith':'Attribute=Spirit',
  'Psionics':'Attribute=Smarts',
  'Spellcasting':'Attribute=Smarts',
  'Weird Science':'Attribute=Smarts'
};
SWD.WEAPONS = {

  'Unarmed':
    'Era=Medieval,Modern,Future Damage=Str+d0 Weight=0 Category=Unarmed',
  'Dagger':
    'Era=Medieval,Modern Damage=Str+d4 Weight=1 Category=One-Handed Range=3',
  'Knife':
    'Era=Medieval,Modern Damage=Str+d4 Weight=1 Category=One-Handed Range=3',
  'Great Sword':
    'Era=Medieval Damage=Str+d10 Weight=12 Category=Two-Handed Parry=-1',
  'Flail':'Era=Medieval Damage=Str+d6 Weight=8 Category=One-Handed',
  'Katana':'Era=Medieval Damage=Str+d6+2 Weight=6 Category=Two-Handed AP=2',
  'Long Sword':'Era=Medieval Damage=Str+d8 Weight=8 Category=One-Handed',
  'Rapier':'Era=Medieval Damage=Str+d4 Weight=3 Category=One-Handed Parry=1',
  'Short Sword':'Era=Medieval Damage=Str+d6 Weight=4 Category=One-Handed',

  'Axe':'Era=Medieval Damage=Str+d6 Weight=2 Category=One-Handed',
  'Battle Axe':'Era=Medieval Damage=Str+d8 Weight=10 Category=One-Handed',
  'Great Axe':
    'Era=Medieval Damage=Str+d10 Weight=15 Category=Two-Handed AP=1 Parry=-1',
  'Maul':
    'Era=Medieval Damage=Str+d8 Weight=20 Category=Two-Handed AP=2 Parry=-1',
  'Warhammer':'Era=Medieval Damage=Str+d6 Weight=8 Category=One-Handed AP=1',

  'Halberd':'Era=Medieval Damage=Str+d8 Weight=15 Category=Two-Handed',
  'Lance':'Era=Medieval Damage=Str+d8 Weight=10 Category=One-Handed AP=2',
  'Pike':'Era=Medieval Damage=Str+d8 Weight=25 Category=Two-Handed',
  'Staff':'Era=Medieval Damage=Str+d4 Weight=8 Category=Two-Handed Parry=1',
  'Spear':
    'Era=Medieval Damage=Str+d6 Weight=5 Category=Two-Handed Range=3 Parry=1',

  'Bangstick':'Era=Modern Damage=3d6 Weight=2 Category=One-Handed',
  'Bayonet':'Era=Modern Damage=Str+d6 Weight=1 Category=One-Handed Parry=1',
  'Billy Club':'Era=Modern Damage=Str+d4 Weight=1 Category=One-Handed',
  'Baton':'Era=Modern Damage=Str+d4 Weight=1 Category=One-Handed',
  'Brass Knuckles':'Era=Modern Damage=Str+d4 Weight=1 Category=One-Handed',
  'Chainsaw':'Era=Modern Damage=2d6+4 Weight=20 Category=One-Handed',
  'Switchblade':'Era=Modern Damage=Str+d4 Weight=1 Category=One-Handed',
  'Survival Knife':'Era=Modern Damage=Str+d4 Weight=3 Category=One-Handed',

  'Molecular Knife':
    'Era=Future Damage=Str+d4+2 Weight=1 Category=One-Handed AP=2',
  'Molecular Sword':
    'Era=Future Damage=Str+d8+2 Weight=8 Category=One-Handed AP=4',
  'Laser Sword':'Era=Future Damage=Str+d6+8 Weight=5 Category=One-Handed AP=12',

  'Throwing Axe':'Era=Medieval Damage=Str+d6 Weight=2 Category=Ranged Range=3',
  'Bow':'Era=Medieval Damage=2d6 Weight=3 MinStr=6 Category=Ranged Range=12',
  'Crossbow':
    'Era=Medieval Damage=2d6 Weight=10 MinStr=6 Category=Ranged Range=15',
  'English Long Bow':
    'Era=Medieval Damage=2d6 Weight=5 MinStr=8 Category=Ranged Range=15',
  'Sling':'Era=Medieval Damage=Str+d4 Weight=1 Category=Ranged Range=4',

  'Brown Bess':
    'Era=Modern Damage=2d8 Weight=15 MinStr=6 Category=Ranged Range=10',
  'Blunderbuss':
    'Era=Modern Damage=3d6 Weight=12 MinStr=6 Category=Ranged Range=10',
  'Flintlock Pistol':'Era=Modern Damage=2d6+1 Weight=3 Category=Ranged Range=5',
  'Kentucky Rifle':
    'Era=Modern Damage=2d8 Weight=8 MinStr=6 Category=Ranged Range=15 AP=2',
  'Springfield':
    'Era=Modern Damage=2d8 Weight=11 MinStr=6 Category=Ranged Range=15',

  'Derringer':'Era=Modern Damage=2d6+1 Weight=2 Category=Ranged Range=5 AP=1',
  'Colt Dragoon':'Era=Modern Damage=2d6+1 Weight=4 Category=Ranged Range=12',
  'Colt 1911':'Era=Modern Damage=2d6+1 Weight=4 Category=Ranged Range=12',
  'S&W 44':'Era=Modern Damage=2d6+1 Weight=5 Category=Ranged Range=12 AP=1',
  'Desert Eagle':'Era=Modern Damage=2d8 Weight=8 Category=Ranged Range=15 AP=2',
  'Glock':'Era=Modern Damage=2d6 Weight=3 Category=Ranged AP=1 Range=12 AP=1',
  'Peacemaker':
    'Era=Modern Damage=2d6+1 Weight=3 Category=Ranged AP=1 Range=12 AP=1',
  'Ruger':'Era=Modern Damage=2d6+1 Weight=2 Category=Ranged Range=10',
  'S&W 357':'Era=Modern Damage=2d6+1 Weight=4 Category=Ranged Range=12 AP=1',
  'H&K MP5':
    'Era=Modern Damage=2d6 Weight=10 Category=Ranged AP=1 Range=12 ROF=3',
  'MP40':'Era=Modern Damage=2d6 Weight=11 Category=Ranged AP=1 Range=12 ROF=3',
  'Tommy Gun':
    'Era=Modern Damage=2d6+1 Weight=13 Category=Ranged AP=1 Range=12 ROF=3',
  'Uzi':'Era=Modern Damage=2d6 Weight=9 Category=Ranged AP=1 Range=12 ROF=3',

  'Double-Barrel Shotgun':
    'Era=Modern Damage=3d6 Weight=11 Category=Ranged Range=12',
  'Pump Action Shotgun':
    'Era=Modern Damage=3d6 Weight=8 Category=Ranged Range=12',
  'Sawed Off DB':'Era=Modern Damage=3d6 Weight=6 Category=Ranged Range=5',
  'Streetsweeper':'Era=Modern Damage=3d6 Weight=10 Category=Ranged Range=12',

  'Barrett Rifle':
    'Era=Modern Damage=2d10 Weight=35 MinStr=8 Category=Ranged AP=4 Range=50',
  'M1':'Era=Modern Damage=2d8 Weight=10 MinStr=6 Category=Ranged AP=2 Range=24',
  'Kar98':
    'Era=Modern Damage=2d8 Weight=9 MinStr=6 Category=Ranged AP=2 Range=24',
  'Sharps Big 50':
    'Era=Modern Damage=2d10 Weight=11 MinStr=8 Category=Ranged AP=2 Range=30',
  'Spencer Carbine':
    'Era=Modern Damage=2d8 Weight=8 Category=Ranged AP=2 Range=20',
  "Winchester '76":
    'Era=Modern Damage=2d8 Weight=10 MinStr=6 Category=Ranged AP=2 Range=24',

  'AK47':
    'Era=Modern Damage=2d8+1 Weight=10 MinStr=6 Category=Ranged AP=2 ' +
    'Range=24 ROF=3',
  'H&K G3':
    'Era=Modern Damage=2d8 Weight=10 MinStr=6 Category=Ranged AP=2 ' +
    'Range=24 ROF=3',
  'M-16':'Era=Modern Damage=2d8 Weight=8 Category=Ranged AP=2 Range=24 ROF=3',
  'Steyr AUG':
    'Era=Modern Damage=2d8 Weight=8 Category=Ranged AP=2 Range=24 ROF=3',

  'Gatling Gun':
    'Era=Modern Damage=2d8 Weight=40 Category=Ranged AP=2 Range=24 ROF=3',
  'M2 Browning':
    'Era=Modern Damage=2d10 Weight=84 Category=Ranged AP=4 Range=50 ROF=3',
  'M1919':'Era=Modern Damage=2d8 Weight=32 Category=Ranged AP=2 Range=24 ROF=3',
  'M60':
    'Era=Modern Damage=2d8+1 Weight=33 MinStr=8 Category=Ranged AP=2 ' +
    'Range=30 ROF=3',
  '7.7 MG':
    'Era=Modern Damage=2d8 Weight=85 Category=Ranged AP=2 Range=30 ROF=3',
  'MG34':
    'Era=Modern Damage=2d8+1 Weight=26 MinStr=8 Category=Ranged AP=2 ' +
    'Range=30 ROF=3',
  'MG42':
    'Era=Modern Damage=2d8+1 Weight=26 MinStr=8 Category=Ranged AP=2 ' +
    'Range=30 ROF=4',
  'SAW':
    'Era=Modern Damage=2d8 Weight=20 MinStr=8 Category=Ranged AP=2 ' +
    'Range=30 ROF=4',
  'Besa MG':
    'Era=Modern Damage=2d8 Weight=54 MinStr=8 Category=Ranged AP=2 ' +
    'Range=40 ROF=3',
  'DTMG':
    'Era=Modern Damage=2d8+1 Weight=26 MinStr=8 Category=Ranged AP=2 ' +
    'Range=30 ROF=3',
  '14.5mm MG':
    'Era=Modern Damage=3d6 Weight=26 MinStr=8 Category=Ranged AP=2 ' +
    'Range=50 ROF=3',

  'Laser Pistol':'Era=Future Damage=3d6 Weight=4 Category=Ranged Range=15',
  'Laser Rifle':
    'Era=Future Damage=3d6 Weight=8 MinStr=6 Category=Ranged Range=30 ROF=3',
  'Laser MG':
    'Era=Future Damage=3d6 Weight=15 MinStr=8 Category=Ranged Range=50 ROF=5'
 
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
SWD.identityRules = function(rules, races, eras, concepts) {
  SWADE.identityRules(rules, races, eras, concepts);
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
  rules, edges, features, goodies, hindrances, skills
) {
  for(let f in features)
    if(!features[f])
      console.log(f);
  SWADE.talentRules(rules, edges, features, goodies, hindrances, skills);
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
  } else if(type == 'Power')
    SWD.powerRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Advances'),
      QuilvynUtils.getAttrValue(attrs, 'PowerPoints'),
      QuilvynUtils.getAttrValue(attrs, 'Range'),
      QuilvynUtils.getAttrValue(attrs, 'Description')
    );
  else if(type == 'Race') {
    SWD.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Abilities')
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
      QuilvynUtils.getAttrValueArray(attrs, 'Era'),
      QuilvynUtils.getAttrValue(attrs, 'Attribute'),
      QuilvynUtils.getAttrValue(attrs, 'Core')
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
  type =
    type.charAt(0).toLowerCase() + type.substring(1).replaceAll(' ', '') + 's';
  rules.addChoice(type, name, attrs);
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
  if(name == 'Brawler') {
    rules.defineRule
      ('damageAdjustment.Unarmed', 'combatNotes.brawler', '+', '2');
  } else if(name == 'Command') {
    rules.defineRule('commandRange',
      'features.Command', '=', '5',
      'featureNotes.commandPresence', '+', '5'
    );
  } else if(name == 'Linguist') {
    rules.defineRule('skillNotes.linguist', 'smarts', '=', null);
    rules.defineRule('skillPoints', 'skillNotes.linguist', '+', null);
  } else if(name == 'Martial Artist') {
    rules.defineRule('damageStep.Unarmed',
      'combatNotes.martialArtist', '+=', '1',
      'combatNotes.improvedMartialArtist', '+', '1'
    );
  } else if(name == 'Martial Arts Master') {
    rules.defineRule
      ('damageAdjustment.Unarmed', 'combatNotes.martialArtsMaster', '+', '2');
  } else if(name == 'New Power') {
    rules.defineRule('arcanaNotes.newPower', 'edges.New Power', '=', null);
  } else if(SWADE.edgeRulesExtra) {
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
  if(SWADE.hindranceRulesExtra)
    SWADE.hindranceRulesExtra(rules, name);
  // No changes needed to the rules defined by base method
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
 * of hard prerequisites #requires#. #abilities# list associated abilities.
 */
SWD.raceRules = function(rules, name, requires, abilities) {
  SWADE.raceRules(rules, name, requires, abilities);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
SWD.raceRulesExtra = function(rules, name) {
  if(name == 'Atlantean') {
    rules.defineRule('skillStep.Swimming', 'skillNotes.aquatic', '+=', '2');
  } else if(name == 'Half-Elf') {
    rules.defineRule
      ('improvementPoints', 'descriptionNotes.heritage', '+', '2');
  } else if(name == 'Rakashan') {
    rules.defineRule
      ('isRakashan', 'race', '=', 'source == "Rakashan" ? 1 : null');
    rules.defineRule('damageStep.Claws', 'isRakashan', '^=', '2');
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
SWD.skillRules = function(rules, name, eras, attribute, core) {
  SWADE.skillRules(rules, name, eras, attribute, core);
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
    '  Quilvyn does not note characters with the Gadgeteer edge who do' +
    '  not have the required d6+ in two scientific Knowledge skills.\n' +
    '  </li><li>\n' +
    '  The SWD plugin supports all the same homebrew choices as the SWADE' +
    '  plugin. See the <a href="plugins/homebrew-swade.html">SWADE Homebrew' +
    '  documentation</a> for details.\n' +
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
