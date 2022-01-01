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
/* globals ObjectViewer, Quilvyn, QuilvynRules, QuilvynUtils */
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
  rules.choiceEditorElements = SWADE.choiceEditorElements;
  rules.choiceRules = SWD.choiceRules;
  rules.editorElements = SWADE.initialEditorElements();
  rules.getFormats = SWADE.getFormats;
  rules.getPlugins = SWD.getPlugins;
  rules.makeValid = SWADE.makeValid;
  rules.randomizeOneAttribute = SWADE.randomizeOneAttribute;
  rules.defineChoice('random', SWD.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = SWD.ruleNotes;

  SWADE.createViewers(rules, SWADE.VIEWERS);
  rules.defineChoice('extras',
    'edges', 'edgePoints', 'hindrances', 'sanityNotes', 'validationNotes'
  );
  rules.defineChoice('preset',
    'race:Race,select-one,races', 'era:Era,select-one,eras',
    'advances:Advances,text,4', 'arcaneFocus:Arcane Focus?,checkbox,',
    'focusType:Focus Type,select-one,arcanas'
  );

  SWD.attributeRules(rules);
  SWD.combatRules(rules, SWD.ARMORS, SWD.SHIELDS, SWD.WEAPONS);
  SWD.arcaneRules(rules, SWD.ARCANAS, SWD.POWERS);
  SWD.identityRules(rules, SWD.RACES, SWD.ERAS, SWD.DEITIES);
  SWD.talentRules
    (rules, SWD.EDGES, SWD.FEATURES, SWD.GOODIES, SWD.HINDRANCES,
     SWD.LANGUAGES, SWD.SKILLS);

  Quilvyn.addRuleSet(rules);

}

SWD.VERSION = '2.3.1.0';

/* List of items handled by choiceRules method. */
SWD.CHOICES = [].concat(SWADE.CHOICES);
/*
 * List of items handled by randomizeOneAttribute method. The order handles
 * dependencies among attributes when generating random characters.
 */
SWD.RANDOMIZABLE_ATTRIBUTES = [].concat(SWADE.RANDOMIZABLE_ATTRIBUTES);

SWD.ARCANAS = {
  'Magic':'Skill=Spellcasting',
  'Miracles':'Skill=Faith',
  'Psionics':'Skill=Psionics',
  'Super Powers':'',
  'Weird Science':'Skill="Weird Science"'
};
SWD.ATTRIBUTES = Object.assign({}, SWADE.ATTRIBUTES);
SWD.ARMORS = {

  'None':'Area=Body Armor=0 MinStr=4 Weight=0',

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
SWD.DEITIES = {
  'None':''
};
SWD.EDGES = {
  // Background
  'Alertness':'Type=background',
  'Ambidextrous':'Type=background Require="agility >= 8"',
  'Arcane Background (%arcana)':'Type=background',
  'Arcane Resistance':'Type=background Require="spirit >= 8"',
  'Improved Arcane Resistance':
    'Type=background Require="features.Arcane Resistance"',
  'Attractive':'Type=background Require="vigor >= 6"',
  'Very Attractive':'Type=background Require="features.Attractive"',
  'Berserk':'Type=background',
  'Brave':'Type=background Require="spirit >= 6"',
  'Brawny':'Type=background Require="strength >= 6","vigor >= 6"',
  'Fast Healer':'Type=background Require="vigor >= 8"',
  'Fleet-Footed':'Type=background Require="agility >= 6"',
  'Linguist':'Type=background Require="smarts >= 6"',
  'Luck':'Type=background',
  'Great Luck':'Type=background Require="features.Luck"',
  'Noble':'Type=background',
  'Quick':'Type=background Require="agility >= 8"',
  'Rich':'Type=background',
  'Filthy Rich':'Type=background Require="features.Rich"',
  // Combat
  'Block':'Type=combat Require="advances >= 4","skills.Fighting >= 8"',
  'Improved Block':'Type=combat Require="advances >= 8","features.Block"',
  'Brawler':'Type=combat Require="strength >= 8","vigor >= 8"',
  'Bruiser':'Type=combat Require="advances >= 4","features.Brawler"',
  'Combat Reflexes':'Type=combat Require="advances >= 8"',
  'Counterattack':'Type=combat Require="advances >= 4","skills.Fighting >= 8"',
  'Improved Counterattack':
    'Type=combat Require="advances >= 8","features.Counterattack"',
  'Dead Shot':
    'Type=combat Require="skills.Athletics >= 8 || skills.Shooting >= 8"',
  'Dodge':'Type=combat Require="advances >= 4","agility >= 8"',
  'Improved Dodge':'Type=combat Require="advances >= 4","features.Dodge"',
  'Elan':'Type=combat Require="spirit >= 8"',
  'Extraction':'Type=combat Require="agility >= 8"',
  'Improved Extraction':
    'Type=combat Require="advances >= 4","features.Extraction"',
  'First Strike':'Type=combat Require="agility >= 8"',
  'Improved First Strike':
    'Type=combat Require="advances >= 12","features.First Strike"',
  'Florentine':'Type=combat Require="agility >= 8","skills.Fighting >= 8"',
  'Frenzy':'Type=combat Require="advances >= 4","skills.Fighting >= 8"',
  'Improved Frenzy':'Type=combat Require="advances >= 8","features.Frenzy"',
  'Giant Killer':'Type=combat Require="advances >= 8"',
  'Hard To Kill':'Type=combat Require="spirit >= 8"',
  'Harder To Kill':
    'Type=combat Require="advances >= 8","features.Hard To Kill"',
  'Improvisational Fighter':'Type=combat Require="advances >= 4","smarts >= 6"',
  'Killer Instinct':'Type=combat Require="advances >= 4"',
  'Level Headed':'Type=combat Require="advances >= 4","smarts >= 8"',
  'Improved Level Headed':
    'Type=combat Require="advances >= 4","features.Level Headed"',
  'Marksman':
    'Type=combat ' +
    'Require="advances >= 4","skills.Athletics >= 8 || skills.Shooting >= 8"',
  'Martial Artist':'Type=combat Require="skills.Fighting >= 6"',
  'Improved Martial Artist':
    'Type=combat Require="advances >= 4","features.Martial Artist"',
  'Mighty Blow':'Type=combat Require="skills.Fighting >= 8"',
  'Nerves Of Steel':'Type=combat Require="vigor >= 8"',
  'Improved Nerves Of Steel':'Type=combat Require="features.Nerves Of Steel"',
  'No Mercy':'Type=combat Require="advances >= 4"',
  'Quick Draw':'Type=combat Require="agility >= 8"',
  'Rock And Roll':'Type=combat Require="advances >= 4","skills.Shooting >= 8"',
  'Steady Hands':'Type=combat Require="agility >= 8"',
  'Sweep':'Type=combat Require="strength >= 8","skills.Fighting >= 8"',
  'Improved Sweep':'Type=combat Require="advances >= 8","features.Sweep"',
  'Trademark Weapon (%melee)':
    'Type=combat ' +
    'Imply="weapons.%melee" ' +
    'Require="skills.Fighting >= 8"',
  'Trademark Weapon (%ranged)':
    'Type=combat ' +
    'Imply="weapons.%ranged" ' +
    'Require="skills.Shooting >= 8"',
  'Improved Trademark Weapon (%weapon)':
    'Type=combat ' +
    'Imply="weapons.%weapon" ' +
    'Require="advances >= 4","features.Trademark Weapon (%weapon)"',
  'Two-Fisted':'Type=combat Require="agility >= 8"',
  // Leadership
  'Command':'Type=leadership Require="smarts >= 6"',
  'Command Presence':
    'Type=leadership Require="advances >= 4","features.Command"',
  'Fervor':
    'Type=leadership Require="advances >= 8","spirit >= 8","features.Command"',
  'Hold The Line!':
    'Type=leadership Require="advances >= 4","smarts >= 8","features.Command"',
  'Inspire':'Type=leadership Require="advances >= 4","features.Command"',
  'Leader Of Men':'Type=leadership Require="advances >= 4","features.Command"',
  'Natural Leader':
    'Type=leadership Require="advances >= 4","spirit >= 8","features.Command"',
  'Tactician':
    'Type=leadership ' +
    'Require="advances >= 4","smarts >= 8","features.Command","skills.Battle >= 6"',
  // Power
  'New Powers':'Type=power Require="powerPoints >= 1"',
  'Power Points':'Type=power Require="powerPoints >= 1"',
  'Rapid Recharge':
    'Type=power Require="advances >= 4","spirit >= 6","powerPoints >= 1"',
  'Improved Rapid Recharge':
    'Type=power Require="advances >= 8","features.Rapid Recharge"',
  'Power Surge':'Type=power Require="powerPoints >= 1","arcaneSkill >= 8"',
  'Soul Drain':
    'Type=power ' +
    'Require="advances >= 4","powerPoints >= 1","arcaneSkill >= 10"',
  // Professional
  'Ace':'Type=professional Require="agility >= 8"',
  'Acrobat':'Type=professional Require="agility >= 8","skills.Athletics >= 8"',
  'Assassin':
    'Type=professional ' +
    'Require="agility >= 8","skills.Fighting >= 6","skills.Stealth >= 8"',
  'Champion':
    'Type=professional ' +
    'Require=' +
      '"features.Arcane Background (Miracles)",' +
      '"spirit >= 8","strength >= 6",' +
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
      // TODO two science knowledge skills >= 6
  'Holy/Unholy Warrior':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Miracles)",' +
      '"spirit >= 8",' +
      '"skills.Faith >= 6"',
  'Investigator':
    'Type=professional Require="smarts >= 6","skills.Research >= 8"',
  'Jack-Of-All-Trades':'Type=professional Require="smarts >= 10"',
  'McGyver':
    'Type=professional ' +
    'Require="smarts >= 6","skills.Notice >= 8","skills.Repair >= 6"',
  'Mentalist':
    'Type=professional ' +
    'Require=' +
      '"features.Arcane Background (Psionics)",' +
      '"smarts >= 8",' +
      '"skills.Psionics >= 6"',
  'Mister Fix It':'Type=professional Require="skills.Repair >= 8"',
  'Scholar':'Type=professional Require="skills.Research >= 8"',
  'Soldier':'Type=professional Require="strength >= 6","vigor >= 6"',
  'Thief':
    'Type=professional ' +
    'Require="agility >= 8","skills.Stealth >= 6","skills.Thievery >= 6"',
  'Wizard':
    'Type=professional ' +
    'Require=' +
      '"features.Arcane Background (Magic)",' +
      '"smarts >= 8",' +
      '"skills.Knowledge (Arcana) >= 8",' +
      '"skills.Spellcasting >= 6"',
  'Woodsman':'Type=professional Require="spirit >= 6","skills.Survival >= 8"',
  // Social
  'Charismatic':'Type=social Require="spirit >= 8"',
  'Common Bond':'Type=social Require="spirit >= 8"',
  'Connections':'Type=social',
  'Strong Willed':'Type=social Require="spirit >= 8"',
  // Weird
  'Beast Bond':'Type=weird',
  'Beast Master':'Type=weird Require="spirit >= 8"',
  'Healer':'Type=weird Imply=skills.Healing Require="spirit >= 8"',
  'Liquid Courage':'Type=weird Require="vigor >= 8"',
  'Scavenger':'Type=weird Require="features.Luck"',
  // Legendary
  'Followers':'Type=legendary Require="advances >= 16"',
  'Martial Arts Master':
    'Type=legendary ' +
    'Require=' +
      '"advances >= 16",' +
      '"features.Improved Martial Artist",' +
      '"skills.Fighting >= 12"',
  'Professional (%attribute)':
    'Type=legendary Require="advances >= 16","%attribute == 12"',
  'Professional (%skill)':
    'Type=legendary Require="advances >= 16","skills.%skill == 12"',
  'Expert (%trait)':
    'Type=legendary Require="advances >= 16","features.Professional (%trait)"',
  'Master (%trait)':
    'Type=legendary Require="advances >= 16","features.Expert (%trait)"',
  'Sidekick':'Type=legendary Require="advances >= 16"',
  'Tough As Nails':'Type=legendary Require="advances >= 16","vigor >= 8"',
  'Improved Tough As Nails':
    'Type=legendary Require="advances >= 16","features.Tough As Nails","vigor >= 12"',
  'Weapon Master':
    'Type=legendary Require="advances >= 16","skills.Fighting >= 12"',
  'Master Of Arms':
    'Type=legendary Require="advances >= 16","features.Weapon Master"'
};
SWD.ERAS = {
  'Medieval':'',
  'Modern':'',
  'Future':''
};
SWD.FEATURES = {

  // Edges
  'Ace':
    'Section=skill ' +
    'Note="Ignore 2 penalty points on Boating, Driving, and Piloting, spend Benny to Soak vehicle damage"',
  'Acrobat':
    'Section=skill Note="Reroll Athletics (balance, tumble, or grapple)"',
  'Alertness':'Section=skill Note="+2 Notice"',
  'Ambidextrous':
    'Section=combat Note="No off-hand penalty, weapon Parry bonuses stack"',
  'Arcane Background (Gifted)':
    'Section=arcana Note="Power Count 1/Power Points 15"',
  'Arcane Background (Magic)':
    'Section=arcana Note="Count 3/Power Points 10"',
  'Arcane Background (Miracles)':
    'Section=arcana Note="Power Count 3/Power Points 10"',
  'Arcane Background (Psionics)':
    'Section=arcana Note="Power Count 3/Power Points 10"',
  'Arcane Background (Weird Science)':
    'Section=arcana Note="Power Count 2/Power Points 15"',
  'Arcane Resistance':
    'Section=combat ' +
    'Note="%V others\' targeted arcane skill, %V magical damage"',
  'Aristocrat':
    'Section=skill ' +
    'Note="+2 Persuasion (networking with aristocrats)/+2 Common Knowledge (etiquette, heraldry, gossip)"',
  'Artificer':'Section=arcana Note="Give items arcane powers"',
  'Assassin':
    'Section=combat Note="+2 damage to Vulnerable foes and with The Drop"',
  'Attractive':
    'Section=skill ' +
    'Note="+%V Performance (attracted target)/+%V Persuasion (attracted target)"',
  'Beast Bond':'Section=feature Note="Spend Bennies on companion animals"',
  'Beast Master':
    'Section=feature ' +
    'Note="Has animal companion, other animals will not attack first"',
  'Berserk':
    'Section=combat ' +
    'Note="Injury causes +1 Strength step, wild attacks, +2 Toughness, ignore 1 Wound penalty, and critical failure hits randomly for up to 10 rd (Smarts-2 neg)"',
  'Block':'Section=combat Note="+%V Parry/-%V foe Gang Up bonus"',
  'Bolster':
    'Section=combat ' +
    'Note="Successful foe Test removes Distracted or Vulnerable from ally"',
  'Brave':'Section=attribute Note="+2 Spirit vs. fear, -2 fear table roll"',
  'Brawler':'Section=combat Note="+%V Toughness/+%1 Unarmed damage step"',
  'Brawny':
    'Section=attribute,combat,description ' +
    'Note=' +
      '"+1 Strength step (encumbrance and minimum strength requirements)",' +
      '"+1 Toughness",' +
      '"+1 Size"',
  'Bruiser':'Section=combat Note="Increased Brawler effects"',
  'Brute':
    'Section=combat,skill ' +
    'Note=' +
      '"+1/+2/+4 thrown weapon range",' +
      '"Advance Athletics relative to Strength/Use Strength with Athletics Tests"',
  'Calculating':
    'Section=combat ' +
    'Note="Ignore 2 points of penalties on 1 action when Action Card is 5 or less"',
  'Champion':'Section=combat Note="+2 damage vs. opposite alignment"',
  'Channeling':
    'Section=arcana ' +
    'Note="Raise on arcane skill roll reduces Power Point cost by 1"',
  'Charismatic':'Section=skill Note="Reroll Persuasion"',
  'Chi':'Section=combat Note="Reroll failed attack, force foe attack reroll, or gain +d6 Natural Weapon damage 1/encounter"',
  'Combat Acrobat':
    'Section=combat ' +
    'Note="Foes -1 attack when self aware of attack and unrestrained"',
  'Combat Reflexes':
    'Section=combat Note="+2 on Shaken and Stunned recovery rolls"',
  'Command':
    'Section=feature ' +
    'Note="R%{commandRange}%{in} Extras +1 to recover from Shaken or Stunned"',
  'Command Presence':'Section=feature Note="Increased Command effects"',
  'Common Bond':
    'Section=feature Note="Communication allows transfer of Bennies to allies"',
  'Concentration':'Section=arcana Note="Dbl Power duration"',
  'Connections':
    'Section=feature Note="Call in favors from acquaintance or organization"',
  'Counterattack':
    'Section=combat Note="Free Attack after failed foe attack %V/rd"',
  'Danger Sense':
    'Section=skill ' +
    'Note="+2 Notice (surprise), gain -2 Notice roll  in circumstances not usually subject to Notice"',
  'Dead Shot':
    'Section=combat ' +
    'Note="Joker Action Card gives dbl damage from first successful ranged attack"',
  'Dodge':'Section=combat Note="-2 foe ranged attacks"',
  'Double Tap':'Section=combat Note="+1 firearm attack and damage"',
  'Elan':'Section=feature Note="+2 on Benny-purchased Trait rerolls"',
  'Expert (%attribute)':'Section=skill Note="Increased Professional effects"',
  'Expert (%skill)':'Section=skill Note="Increased Professional effects"',
  'Extra Effort':
    'Section=arcana Note="Spend 1 or 3 Power Points to gain +1 or +2 Focus"',
  'Extraction':
    'Section=combat Note="Negate attack of %V foes when withdrawing"',
  'Fame':
    'Section=feature,skill ' +
    'Note=' +
      '"%Vx fee from performing",' +
      '"+%V Persuasion (influencing friendly individuals)"',
  'Famous':'Section=feature Note="Increased Fame effects"',
  'Fast Healer':
    'Section=combat Note="+2 Vigor (natural healing), check every 3 dy"',
  'Feint':
    'Section=skill ' +
    'Note="Force foe to oppose Fighting test with Smarts instead of Agility"',
  'Fervor':
    'Section=combat Note="R%{commandRange}%{in} Extras +1 Fighting damage"',
  'Filthy Rich':'Section=feature Note="Increased Rich effects"',
  'First Strike':
    'Section=combat Note="Free attack when %V foes move into reach"',
  'Fleet-Footed':'Section=combat Note="+2 Pace/+1 Run step"',
  'Followers':'Section=feature Note="Gain 5 soldier followers"',
  'Free Runner':
    'Section=combat,skill ' +
    'Note=' +
      '"Move full Pace on difficult ground",' +
      '"+2 Athletics (climbing)/+2 on foot chases"',
  'Frenzy':'Section=combat Note="Extra Fighting die on %V attacks/rd"',
  'Gadgeteer':
    'Section=arcana Note="Jury rig arcane device from available parts"',
  'Giant Killer':
    'Section=combat Note="+1d6 damage vs. foes of size %{size+3} or greater"',
  'Great Luck':'Section=feature Note="Increased Luck effects"',
  'Half-Folk Luck':'Section=feature Note="+1 Benny each session"',
  'Hard To Kill':
    'Section=combat ' +
    'Note="No wound penalties on Vigor tests to avoid bleeding out"',
  'Harder To Kill':'Section=combat Note="50% chance to cheat death"',
  'Healer':'Section=skill Note="+2 Healing"',
  'Hold The Line!':'Section=combat Note="Commanded Extras +1 Toughness"',
  'Holy/Unholy Warrior':
    'Section=arcana ' +
    'Note="Spend 1-4 Power Points to add equal amount to Soak roll"',
  'Humiliate':'Section=skill Note="Reroll Taunt"',
  'Improved Arcane Resistance':
    'Section=combat Note="Increased Arcane Resistance effects"',
  'Improved Block':'Section=combat Note="Increased Block effects"',
  'Improved Counterattack':
    'Section=combat Note="Increased Counterattack effects"',
  'Improved Dodge':'Section=combat Note="+2 evading area attacks"',
  'Improved Extraction':'Section=combat Note="Increased Extraction effects"',
  'Improved First Strike':
    'Section=combat Note="Increased First Strike effects"',
  'Improved Frenzy':'Section=combat Note="Increased Frenzy effects"',
  'Improved Level Headed':
    'Section=combat Note="Increased Level Headed effects"',
  'Improved Nerves Of Steel':
    'Section=combat Note="Increased Nerves Of Steel effects"',
  'Improved Rapid Fire':'Section=combat Note="Increased Rapid Fire effects"',
  'Improved Rapid Recharge':
    'Section=arcana Note="Increased Rapid Recharge effects"',
  'Improved Sweep':'Section=combat Note="Increased Sweep effects"',
  'Improved Trademark Weapon (%weapon)':
    'Section=combat Note="Increased Trademark Weapon effects"',
  'Improvisational Fighter':
    'Section=combat Note="No penalty w/improvised weapons"',
  'Inspire':
    'Section=skill ' +
    'Note="R%{commandRange}%{in} Support all Extras on any trait using Battle 1/rd"',
  'Investigator':
    'Section=skill Note="+2 Research/+2 Notice (sifting for information)"',
  'Iron Jaw':'Section=combat Note="+2 Soak rolls and vs. knockout"',
  'Iron Will':'Section=attribute Note="+2 vs. Powers"',
  'Jack-Of-All-Trades':
    'Section=skill ' +
    'Note="Successful Smarts roll gives d4 on chosen skill (Raise d6)"',
  'Killer Instinct':'Section=skill Note="Reroll self-initiated opposed Test"',
  'Level Headed':'Section=combat Note="Choose best of %V Action Cards"',
  'Linguist':
    'Section=skill ' +
    'Note="+%V Skill Points (d6 in in %{smarts//2} Language skills)"',
  'Liquid Courage':
    'Section=attribute ' +
    'Note="Drinking alcohol gives +1 Vigor step, -1 Smarts, Agility and associated skills for 1 hr"',
  'Luck':'Section=feature Note="+%V Benny each session"',
  'Marksman':
    'Section=combat ' +
    'Note="Trade move for +1 ranged attack or -2 ranged attack penalties"',
  'Martial Artist':
    'Section=combat Note="+%V Unarmed attack/+%1 Unarmed damage step"',
  'Martial Warrior':'Section=combat Note="Increased Martial Artist effects"',
  'Master Of Arms':'Section=combat Note="Increased Weapon Master effects"',
  'Master (%attribute)':'Section=attribute Note="Use d10 for Wild Die"',
  'Master (%skill)':'Section=skill Note="Use d10 for Wild Die on %skill rolls"',
  'Master Tactician':'Section=combat Note="Increased Tactician effects"',
  'McGyver':
    'Section=skill ' +
    'Note="Use Repair to create improvised weapon, explosive, or tool"',
  'Menacing':'Section=skill Note="+2 Intimidation"',
  'Mentalist':'Section=skill Note="+2 opposed Psionics"',
  'Mighty Blow':
    'Section=combat ' +
    'Note="Joker Action Card gives dbl damage on first successful melee attack"',
  'Mister Fix It':'Section=skill Note="+2 Repair/Raise cuts time by half"',
  'Natural Leader':'Section=feature Note="Apply leadership edges to Wild Cards"',
  'Nerves Of Steel':'Section=combat Note="Ignore %V points of wound penalties"',
  'New Powers':'Section=arcana Note="+%V Power Count"',
  'No Mercy':'Section=combat Note="+2 on Benny damage reroll"',
  'Power Points':'Section=arcana Note="+%V Power Points"',
  'Power Surge':
    'Section=arcana Note="Recover 10 Power Points when Action Card is a joker"',
  'Professional (%attribute)':'Section=attribute Note="+%V %attribute step"',
  'Professional (%skill)':'Section=skill Note="+%V %skill step"',
  'Provoke':
    'Section=combat ' +
    'Note="Raise on Taunt inflicts -2 on foe attacks on other targets; joker Action Card ends"',
  'Quick':'Section=combat Note="Discard and redraw Action Cards lower than 6"',
  'Rabble-Rouser':
    'Section=skill Note="Taunt or Intimidate all enemies in 2%{in} radius"',
  'Rapid Fire':'Section=combat Note="Increase ROF by 1 %V/rd"',
  'Rapid Recharge':'Section=arcana Note="Recover %V Power Points/hr"',
  'Reliable':'Section=skill Note="Reroll Support"',
  'Retort':
    'Section=skill ' +
    'Note="Raise on Intimidation or Taunt Test causes foe to be Distracted"',
  'Rich':'Section=feature Note="%Vx starting funds"',
  'Rock And Roll':'Section=combat Note="Trade move for ignoring recoil"',
  'Scavenger':
    'Section=combat Note="Recover knowledge or equipment 1/encounter"',
  'Scholar (Academics)':'Section=skill Note="+2 Academics"',
  'Scholar (Battle)':'Section=skill Note="+2 Battle"',
  'Scholar (Occult)':'Section=skill Note="+2 Occult"',
  'Scholar (Science)':'Section=skill Note="+2 Science"',
  'Sidekick':'Section=feature Note="Special bond with companion"',
  'Soldier':
    'Section=attribute ' +
    'Note="+1 Strength step (encumbrance)/Reroll Vigor (environmental hazards)"',
  'Soul Drain':'Section=arcana Note="Suffer Fatigue to recover 5 Power Points"',
  'Steady Hands':
    'Section=combat ' +
    'Note="No penalty for shot from unstable platform, reduce running shot penalty by 1"',
  'Streetwise':
    'Section=skill ' +
    'Note="+2 Intimidation (criminal network)/+2 Persuasion (criminal network)/+2 Common Knowledge (criminals)"',
  'Strong Willed':
    'Section=attribute Note="+2 Smarts (resist Tests)/+2 Spirit (resist Tests)"',
  'Sweep':'Section=combat Note="%1Attack all within reach"',
  'Tactician':
    'Section=combat ' +
    'Note="R%{commandRange}%{in} Distribute %V Action Cards to Extras"',
  'Thief':
    'Section=skill Note="+1 Climb (urban)/+1 Stealth (urban)/+1 Thievery"',
  'Tough As Nails':'Section=combat Note="Take %V wounds before incapacitated"',
  'Tougher Than Nails':'Section=combat Note="Increased Tough As Nails effects"',
  'Trademark Weapon (%melee)':
    'Section=combat Note="+%V attack and Parry with %melee"',
  'Trademark Weapon (%ranged)':
    'Section=combat Note="+%V attack and Parry with %ranged"',
  'Two-Fisted':
    'Section=combat ' +
    'Note="No multi-action penalty for melee attack with each hand"',
  'Two-Gun Kid':
    'Section=combat ' +
    'Note="No multi-action penalty for ranged attack with each hand"',
  'Very Attractive':'Section=skill Note="Increased Attractive effects"',
  'Weapon Master':
    'Section=combat Note="+%V Parry/+d%1 damage on melee attack Raise"',
  'Wizard':'Section=arcana Note="Spend 1 Power Point to change Power trapping"',
  'Woodsman':'Section=skill Note="+2 Survival/+2 Stealth (nature)"',
  'Work The Crowd':'Section=skill Note="Increased Work The Room effects"',
  'Work The Room':
    'Section=skill Note="+1 Performance or Persuasion step in Support %V/rd"',

  // Hindrances
  'All Thumbs':
    'Section=skill ' +
    'Note="-2 using mechanical and electrical devices, critical failure breaks device"',
  'Anemic':'Section=attribute Note="-2 Vigor (resist disease)"',
  'Arrogant+':'Section=combat Note="Always takes on the biggest threat"',
  'Bad Eyes':'Section=skill Note="-1 on visual trait rolls"',
  'Bad Eyes+':'Section=skill Note="-2 on visual trait rolls"',
  'Bad Luck+':'Section=feature Note="-1 Benny each session"',
  'Big Mouth':'Section=feature Note="Cannot keep secrets"',
  'Blind+':'Section=feature,skill Note="+1 Edge Points","-6 on visual tasks"',
  'Bloodthirsty+':'Section=combat Note="Cruel to foes"',
  'Cautious':'Section=feature Note="Requires detailed plan before acting"',
  'Clueless+':'Section=skill Note="-1 Common Knowledge/-1 Notice"',
  'Code Of Honor+':'Section=feature Note="Always insists on acting nobly"',
  'Curious+':
    'Section=feature Note="Insists on investigating every mystery and secret"',
  'Death Wish':'Section=feature Note="Will risk death for valued goal"',
  'Delusional':'Section=feature Note="Has harmless conspiracy belief"',
  'Delusional+':'Section=feature Note="Frequently acts on conspiracy belief"',
  'Doubting Thomas':
    'Section=feature Note="Insists on rationalizing supernatural events"',
  'Elderly+':
    'Section=attribute,combat,skill ' +
    'Note="-1 Agility/-1 Strength/-1 Vigor","-1 Pace/-1 Run","+5 Skill Points"',
  'Enemy':
    'Section=feature ' +
    'Note="Individual or remote group wants character eliminated"',
  'Enemy+':
    'Section=feature ' +
    'Note="Powerful individual or group wants character eliminated"',
  'Greedy':'Section=feature Note="Demands more than a fair share"',
  'Greedy+':
    'Section=feature ' +
    'Note="Violently insists on getting more than a fair share"',
  'Habit':'Section=feature Note="Has irritating but harmless compulsion"',
  'Habit+':'Section=feature Note="Has dangerous physical or mental addiction"',
  'Hard Of Hearing':'Section=skill Note="-4 Notice (hearing)"',
  'Hard Of Hearing+':
    'Section=skill Note="Deaf, automatically fails Notice (hearing)"',
  'Heroic+':'Section=feature Note="Always tries to help others"',
  'Illiterate':'Section=feature Note="Cannot read or write"',
  'Lame':'Section=feature Note="TODO"',
  'Loyal':'Section=feature Note="Always takes risks for friends"',
  'Mean':
    'Section=feature,skill ' +
    'Note="Ill-tempered and disagreeable","-1 Persuasion"',
  'Obese':
    'Section=attribute,combat,description ' +
    'Note=' +
      '"-1 Strength step (worn gear)",' +
      '"-1 Pace/-1 Run step/+1 Toughness",' +
      '"+1 Size"',
  'One Arm+':'Section=skill Note="-4 on two-handed tasks"',
  'One Eye+':'Section=feature Note="-2 on visual tasks 10 yd distant"',
  'One Leg+':'Section=feature Note="TODO"',
  'Outsider':'Section=skill Note="-2 Persuasion (other races)"',
  'Overconfident+':
    'Section=feature Note="Has excessive opinion of own capabilities"',
  'Pacifist':
    'Section=combat ' +
    'Note="Will harm others only when no other option available"',
  'Pacifist+':
    'Section=combat ' +
    'Note="Will not fight living creatures, uses nonlethal methods only in defense"',
  'Phobia':
    'Section=feature Note="-1 on trait rolls in presence of phobia subject"',
  'Phobia+':
    'Section=feature Note="-2 on trait rolls in presence of phobia subject"',
  'Poverty':
    'Section=feature Note="Starts with half funds, loses half funds each wk"',
  'Quirk':
    'Section=feature ' +
    'Note="Has minor compulsion that occasionally causes trouble"',
  'Small+':'Section=combat,description Note="-1 Toughness","-1 Size"',
  'Stubborn':'Section=feature Note="Never admits error"',
  'Ugly':'Section=skill Note="-1 Persuasion"',
  'Vengeful':'Section=feature Note="Spends time plotting revenge"',
  'Vengeful+':'Section=feature Note="Places primary focus on revenge"',
  'Vow':
    'Section=feature Note="Has broad restrictions on behavior and decisions"',
  'Vow+':
    'Section=feature Note="Has tight restrictions on behavior and decisions"',
  'Wanted':
    'Section=feature Note="Has trouble with distant law or minor infractions"',
  'Wanted+':
    'Section=feature Note="Has significant trouble with local law enforcement"',
  'Yellow+':'Section=attribute Note="-2 Spirit vs. fear and Intimidation"',
  'Young':
    'Section=attribute,feature,skill ' +
    'Note="-1 Attribute Points","+1 Benny each session","-2 Skill Points"',
  'Young+':
    'Section=attribute,feature,skill ' +
    'Note="-2 Attribute Points",' +
          '"Small/+2 Benny each session",' +
          '"-2 Skill Points"',

  // Races
  'Adaptable':'Section=feature Note="+1 Edge Points"',
  'Advanced Civilization':'Section=feature Note=TODO',
  'Agile':'Section=attribute Note="+1 Agility step"',
  'Aquatic':'Section=combat,feature Note="Swim Pace %{pace}","Cannot drown"',
  'Asimov Circuits':'Section=feature Note="Has Pacific+ hindrance"',
  'Burrowing':
    'Section=feature Note="Can burrow into loose earth and surprise foes"',
  'Claws':'Section=combat Note="Claws are Natural Weapon"',
  'Construct':
    'Section=attribute,combat ' +
    'Note=' +
      '"+2 Shaken recovery, immune to disease and poison",' +
      '"Ignores one level of Wound modifiers, requires Repair to heal"',
  'Dehydration':'Section=feature Note=TODO',
  'Flight':
    'Section=combat,skill ' +
    'Note="Fly Pace 12","Uses Athletics for flight maneuvers"',
  'Fortunate':'Section=feature Note="+1 Benny each session"',
  'Heritage':
    'Section=description Note="+2 Improvement Points (attribute or edge)"',
  'Hollow-Boned':'Section=combat Note="-1 Toughness"',
  'Infravision':
    'Section=combat ' +
    'Note="Half penalties when attacking warm invisible targets"',
  'Immune To Disease':'Section=attribute Note="Has immunity to disease"',
  'Immune To Poison':'Section=attribute Note="Has immunity to poison"',
  'Keen Senses':'Section=skill Note="+2 Notice (specific sense)"',
  'Low Light Vision':
    'Section=feature Note="Ignores penalties for dim and dark illumination"',
  'Mostly Human':'Section=feature Note=TODO',
  'Multiple Limbs':'Section=feature Note=TODO',
  'Natural Weapons':'Section=combat Note=TODO',
  'Poison':'Section=combat Note="Touch causes Mild Poison effects (Vigor neg)"',
  'Potent Poison':'Section=combat Note="TODO"',
  'Programming':'Section=skill Note="+2 Skill Points"',
  'Racial Enemy':'Section=skill Note="-2 Persuasion (racial enemy)"',
  'Recharge':'Section=feature Note=TODO',
  'Saurian Senses':'Section=feature Note="Alertness edge"',
  'Semi-Aquatic':'Section=feature Note="Can hold breath for 15 min"',
  'Slow':'Section=combat Note="-1 Pace"',
  'Small':'Section=combat,description Note="-1 Toughness","-1 Size"',
  'Spirited':'Section=attribute Note="+1 Spirit step"',
  'Strong':'Section=attribute Note="+1 Strength step"',
  'Tough':'Section=attribute Note="+1 Vigor step"',
  'Wall Walker':
    'Section=combat ' +
    'Note="Normal Pace on vertical surfaces, %{pace//2} on inverted"',
  'Warm Natured':'Section=feature Note=TODO'

};
SWD.GOODIES = Object.assign({}, SWADE.GOODIES);
SWD.HINDRANCES = {
  'All Thumbs':'Severity=Minor',
  'Anemic':'Severity=Minor',
  'Arrogant+':'Severity=Major',
  'Bad Eyes':'Require="features.Bad Eyes+ == 0" Severity=Minor',
  'Bad Eyes+':'Require="features.Bad Eyes == 0" Severity=Major',
  'Bad Luck+':'Severity=Major',
  'Big Mouth':'Severity=Minor',
  'Blind+':'Severity=Major',
  'Bloodthirsty+':'Severity=Major',
  'Cautious':'Severity=Minor',
  'Clueless+':'Severity=Major',
  'Code Of Honor+':'Severity=Major',
  'Curious+':'Severity=Major',
  'Death Wish':'Severity=Minor',
  'Delusional':'Require="features.Delusional+ == 0" Severity=Minor',
  'Delusional+':'Require="features.Delusional == 0" Severity=Major',
  'Doubting Thomas':'Severity=Minor',
  'Elderly+':'Severity=Major',
  'Enemy':'Require="features.Enemy+ == 0" Severity=Minor',
  'Enemy+':'Require="features.Enemy == 0" Severity=Major',
  'Greedy':'Require="features.Greedy+ == 0" Severity=Minor',
  'Greedy+':'Require="features.Greedy == 0" Severity=Major',
  'Habit':'Require="features.Habit+ == 0" Severity=Minor',
  'Habit+':'Require="features.Habit == 0" Severity=Major',
  'Hard Of Hearing':'Require="features.Hard Of Hearing+ == 0" Severity=Minor',
  'Hard Of Hearing+':'Require="features.Hard Of Hearing == 0" Severity=Major',
  'Heroic+':'Severity=Major',
  'Illiterate':'Severity=Minor',
  'Lame+':'Severity=Major',
  'Loyal':'Severity=Minor',
  'Mean':'Severity=Minor',
  'Obese':'Severity=Minor',
  'One Arm+':'Severity=Major',
  'One Eye+':'Severity=Major',
  'One Leg+':'Severity=Major',
  'Outsider':'Severity=Minor',
  'Overconfident+':'Severity=Major',
  'Pacifist':'Require="features.Pacifist+ == 0" Severity=Minor',
  'Pacifist+':'Require="features.Pacifist == 0" Severity=Major',
  'Phobia':'Require="features.Phobia+ == 0" Severity=Minor',
  'Phobia+':'Require="features.Phobia == 0" Severity=Major',
  'Poverty':'Severity=Minor',
  'Quirk':'Severity=Minor',
  'Small+':'Severity=Major',
  'Stubborn':'Severity=Minor',
  'Ugly':'Require="features.Ugly+ == 0" Severity=Minor',
  'Vengeful':'Require="features.Vengeful+ == 0" Severity=Minor',
  'Vengeful+':'Require="features.Vengeful == 0" Severity=Major',
  'Vow':'Require="features.Vow+ == 0" Severity=Minor',
  'Vow+':'Require="features.Vow == 0" Severity=Major',
  'Wanted':'Require="features.Wanted+ == 0" Severity=Minor',
  'Wanted+':'Require="features.Wanted == 0" Severity=Major',
  'Yellow+':'Severity=Major',
  'Young+':'Require="features.Young == 0" Severity=Major'
};
SWD.POWERS = {
  'Arcane Protection':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Description=' +
      '"R%{smarts}%{in} Foes suffer -2 (Raise -4) to affect target for 5 rd"',
  'Banish':
    'Advances=8 ' +
    'PowerPoints=3 ' +
    'Description=' +
      '"R%{smarts}%{in} Target suffers Shaken (Raise 1 Wound), returns to native plane if incapacitated (Spirit neg)"',
  'Barrier':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Description=' +
      '"R%{smarts}%{in} Creates a 5%{in} long by 1%{in} high wall for 5 rd"',
  'Beast Friend':
    'Advances=0 ' +
    'PowerPoints=1/Size ' +
    'Description=' +
      '"R%{smarts}%{in} Target can speak with and control beast actions for 10 min"',
  'Blast':
    'Advances=4 ' +
    'PowerPoints=3 ' +
    'Description=' +
      '"R%{smarts*2}%{in} Choice of 1%{in} or 2%{in} radius inflicts 2d6 damage (Raise 3d6)"',
  'Blind':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description=' +
      '"R%{smarts}%{in} Target suffers -2 on vision tasks (Raise -4) (Vigor neg 2 points (Raise 4) each rd)"',
  'Bolt':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Description="R%{smarts*2}%{in} Inflicts 2d6 damage (Raise 3d6)"',
  'Boost/Lower Trait':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description=' +
      '"R%{smarts*2}%{in} Target gains +1 Trait step (Raise +2) for 5 rd or suffers -1 Trait step (Raise -2) (Spirit recovers 1 step each rd)"',
  'Burrow':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description="R%{smarts}%{in} Target can merge into earth for 5 rd"',
  'Burst':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description="9%{in} cone inflicts 2d6 damage (Raise 3d6)"',
  'Confusion':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Description=' +
      '"R%{smarts}%{in} Target suffers Distracted and Vulnerable for 1 rd (Smarts neg) (Raise Smarts -2)"',
  'Damage Field':
    'Advances=4 ' +
    'PowerPoints=4 ' +
    'Description=' +
      '"R%{smarts}%{in} Creatures adjacent to target suffer 2d4 damage"',
  'Darksight':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Description=' +
      '"R%{smarts}%{in} Target ignores 4 points illumination penalties (Raise 6 pts) for 1 hr"',
  'Deflection':
    'Advances=0 ' +
    'PowerPoints=3 ' +
    'Description=' +
      '"R%{smarts}%{in} Foes suffer -2 attacks (Raise -4) on target for 5 rd"',
  'Detect/Conceal Arcana':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description=' +
      '"R%{smarts}%{in} Target can detect supernatural effects for 5 rd or conceals target aura for 1 hr"',
  'Disguise':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Description=' +
      '"R%{smarts}%{in} Target assumes another\'s appearance for 10 min"',
  'Dispel':
    'Advances=4 ' +
    'PowerPoints=1 ' +
    'Description=' +
      '"R%{smarts}%{in} End targeted power (Arcane skill neg, +2 if types differ)"',
  'Divination':
    'Advances=12 ' +
    'PowerPoints=5 ' +
    'Description=' +
      '"Self 1 min contact with otherworld force grants arcane skill roll to gain information"',
  'Drain Power Points':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Description="R%{smarts}%{in} Drains 1d6 PP (Raise adds drained PP to self) (Spirit neg, +2 if types differ)"',
  'Elemental Manipulation':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Description=' +
      '"R%{smarts}%{in} Performs minor elemental manipulation for 5 rd"',
  'Empathy':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Description="R%{smarts}%{in} Self learns target emotions and surface thoughts, gains +1 Intimidation, Persuasion, Performance, and Taunt for 5 rd (Raise +2) (Spirit neg)"',
  'Entangle':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description="R%{smarts}%{in} Target suffers Restrained (Raise Bound)"',
  'Environmental Protection':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description=' +
      '"R%{smarts}%{in} Target gains protection from hazards for 1 hr"',
  'Farsight':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Description=' +
      '"R%{smarts}%{in} Target sees up to 1 mile for 5 rd (Raise half Range penalties)"',
  'Fear':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description=' +
      '"R%{smarts}%{in} Target Extra flees, Wild Card rolls on fear table (Spirit neg) (Raise -2)"',
  'Fly':
    'Advances=8 ' +
    'PowerPoints=3 ' +
    'Description="R%{smarts}%{in} Target gains 12 Fly for 5 rd"',
  'Growth/Shrink':
    'Advances=4 ' +
    'PowerPoints=2/Size ' +
    'Description="R%{smarts}%{in} Target gains or loses Toughness and Strength step for 5 rd"',
  'Havoc':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description="R%{smarts}%{in} Distracts and throws creatures in 2%{in} radius or 9%{in} cone 2d6%{in} (Strength neg) (Raise Strength -2)"',
  'Healing':
    'Advances=0 ' +
    'PowerPoints=3 ' +
    'Description="Touched recovers 1 Wound (Raise 2) suffered in past hr"',
  'Illusion':
    'Advances=0 ' +
    'PowerPoints=3 ' +
    'Description=' +
      '"R%{smarts}%{in} Creates 2%{in} radius visual illusion for 5 rd"',
  'Intangibility':
    'Advances=12 ' +
    'PowerPoints=5 ' +
    'Description=' +
      '"R%{smarts}%{in} Target becomes unaffected by physical world for 5 rd (Spirit neg)"',
  'Invisibility':
    'Advances=4 ' +
    'PowerPoints=5 ' +
    'Description=' +
      '"R%{smarts}%{in} Target becomes invisible, foes -4 sight-based actions (Raise -6) for 5 rd"',
  'Light/Darkness':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description=' +
      '"R%{smarts}%{in} Creates 3%{in} radius bright light or darkness for 10 min"',
  'Mind Link':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Description=' +
      '"R%{smarts}%{in} Two targets communicate up to 1 mile telepathically (Raise 5 miles) for 30 min"',
  'Mind Reading':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description=' +
      '"R%{smarts}%{in} Self gains 1 truthful answer from target (Smarts neg)"',
  'Mind Wipe':
    'Advances=8 ' +
    'PowerPoints=3 ' +
    'Description="R%{smarts}%{in} Target forgets up to 30 min event (Smarts neg)"',
  'Object Reading':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Description=' +
      '"Self sees five yr of events that occurred w/in 10 yd of touched object (Raise 100 yr and 20 yd)"',
  'Protection':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Description="R%{smarts}%{in} Target gains +2 Armor (Raise +4) for 5 rd"',
  'Puppet':
    'Advances=8 ' +
    'PowerPoints=3 ' +
    'Description=' +
      '"R%{smarts}%{in} Target obeys self (Raise complete control) for 5 rd (Spirit neg)"',
  'Relief':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Description=' +
      '"R%{smarts}%{in} Target recovers 1 Fatigue level or Shaken (Raise 2 levels or Stunned)"',
  'Resurrection':
    'Advances=12 ' +
    'PowerPoints=30 ' +
    'Description=' +
      '"Successful -8 casting roll returns touched 1 yr corpse to life with 3 Wounds and Exhausted (Raise 0 Wounds)"',
  'Shape Change':
    'Advances=0 ' +
    'PowerPoints=3+ ' +
    'Description="Caster takes animal form for 5 rd"',
  'Sloth/Speed':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Description=' +
      '"R%{smarts}%{in} Target gains dbl Pace for 5 rd or suffers half pace (Spirit ends)"',
  'Slumber':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Description="R%{smarts}%{in} Target sleeps for 1 hr (Spirit neg)"',
  'Smite':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description=' +
      '"R%{smarts}%{in} Target weapon inflicts +2 damage (Raise +4) for 5 rd"',
  'Sound/Silence':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Description=' +
      '"R%{smarts*5}%{in} Creates sound up to shout or R%{smarts}%{in} Mutes 3%{in} radius for 5 rd"',
  'Speak Language':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Description="R%{smarts}%{in} Target speaks unknown language for 10 min"',
  'Stun':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description="R%{smarts}%{in} Target Stunned (Vigor neg)"',
  'Summon Ally':
    'Advances=0 ' +
    'PowerPoints=2+ ' +
    'Description="R%{smarts}%{in} Creates obedient servant for 5 rd"',
  'Telekinesis':
    'Advances=4 ' +
    'PowerPoints=3 ' +
    'Description=' +
      '"R%{smarts*2}%{in} Moves items remotely as Strength d10 (Raise d12) for 5 rd (Spirit neg)"',
  'Teleport':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Description=' +
      '"R%{smarts}%{in} Target teleports 12%{in} (Raise 24%{in})"',
  'Wall Walker':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description=' +
      '"R%{smarts}%{in} Target moves at half Pace (Raise full Pace) on vertical and inverted surfaces for 5 rd"',
  "Warrior's Gift":
    'Advances=4 ' +
    'PowerPoints=4 ' +
    'Description="R%{smarts}%{in} Target gains combat edge effects for 5 rd"',
  'Zombie':
    'Advances=8 ' +
    'PowerPoints=3 ' +
    'Description="R%{smarts}%{in} Animates and controls corpse for 1 hr"'
};
SWD.RACES = {
  'Android':
    'Features=' +
      '"Asimov Circuits",Construct,Outsider,Programming,Recharge,Unnatural ' +
    'Languages=Android',
  'Atlantean':
    'Features=' +
      '"Advanced Civilization",Aquatic,Dehydration,Tough ' +
    'Languages=Atlantean',
  'Avion':
    'Features=' +
      'Flight,"Hollow-Boned","Mostly Human" ' +
    'Languages=Avion',
  'Dwarf':
    'Features=' +
      '"Low Light Vision",Slow,Tough ' +
    'Languages=Dwarf',
  'Elf':
    'Features=' +
      'Agile,"All Thumbs","Low Light Vision" ' +
    'Languages=Elf',
  'Half-Elf':
    'Features=' +
      'Heritage,"Low Light Vision",Outsider ' +
    'Languages=Elf,Human',
  'Half-Folk':
    'Features=' +
      'Fortunate,Short,Spirited ' +
    'Languages=Half-Folk',
  'Half-Orc':
    'Features=' +
      'Infravision,Outsider,Strong ' +
    'Languages=Half-Orc',
  'Human':
    'Features=' +
      'Adaptable ' +
    'Languages=Human',
  'Rakashan':
    'Features=' +
      'Agile,Bloodthirsty+,Claws,"Low Light Vision","Racial Enemy" ' +
    'Languages=Rakashan',
  'Saurian':
    'Features=' +
      '"Natural Weapons",Outsider,"Saurian Senses","Warm Natured" ' +
    'Languages=Saurian'
};
SWD.LANGUAGES = {};
for(var r in SWD.RACES) {
  SWD.LANGUAGES[r] = '';
}
SWD.SHIELDS = {
  'None':'Parry=0 Cover=0 Weight=0',
  'Small':'Era=Medieval Parry=1 Cover=0 Weight=8',
  'Medium':'Era=Medieval Parry=1 Cover=-2 Weight=12',
  'Large':'Era=Medieval Parry=2 Cover=-2 Weight=20'
};
SWD.SKILLS = {
  'Boating':'Attribute=agility',
  'Climbing':'Attribute=strength',
  'Driving':'Attribute=agility Era=Modern,Future',
  'Fighting':'Attribute=agility',
  'Faith':'Attribute=spirit',
  'Gambling':'Attribute=smarts',
  'Healing':'Attribute=smarts',
  'Intimidation':'Attribute=spirit',
  'Investigations':'Attribute=smarts',
  'Knowledge':'Attribute=smarts',
  'Lockpicking':'Attribute=agility',
  'Notice':'Attribute=smarts',
  'Persuasion':'Attribute=spirit',
  'Piloting':'Attribute=agility Era=Modern,Future',
  'Psionics':'Attribute=smarts',
  'Repair':'Attribute=smarts',
  'Research':'Attribute=smarts',
  'Riding':'Attribute=agility',
  'Shooting':'Attribute=agility',
  'Spellcating':'Attribute=smarts',
  'Stealth':'Attribute=agility',
  'Streetwise':'Attribute=smarts',
  'Survival':'Attribute=smarts',
  'Swimming':'Attribute=agility',
  'Taunt':'Attribute=smarts',
  'Throwing':'Attribute=agility',
  'Tracking':'Attribute=smarts',
  'Weird Science':'Attribute=smarts'
};
SWD.WEAPONS = {

  'Unarmed':
    'Era=Ancient,Medieval,Colonial,Victorian,Modern,Future ' +
    'Damage=Str+d0 MinStr=0 Weight=0 Category=Un',
  'Hand Axe':'Era=Ancient,Medieval Damage=Str+d6 MinStr=6 Weight=2 Category=1h',
  'Battle Axe':'Era=Medieval Damage=Str+d8 MinStr=8 Weight=4 Category=1h AP=2',
  'Great Axe':
    'Era=Medieval Damage=Str+d10 MinStr=10 Weight=7 Category=2h Parry=-1',
  'Light Club':
    'Era=Ancient,Medieval Damage=Str+d4 MinStr=4 Weight=2 Category=1h',
  'Heavy Club':
    'Era=Ancient,Medieval Damage=Str+d6 MinStr=6 Weight=5 Category=1h',
  'Dagger':
    'Era=Ancient,Medieval,Colonial,Victorian,Modern ' +
    'Damage=Str+d4 MinStr=4 Weight=1 Category=1h Range=3',
  'Knife':
    'Era=Ancient,Medieval,Colonial,Victorian,Modern ' +
    'Damage=Str+d4 MinStr=4 Weight=1 Category=1h Range=3',
  'Flail':'Era=Medieval Damage=Str+d6 MinStr=6 Weight=3 Category=1h',
  'Halberd':'Era=Medieval Damage=Str+d8 MinStr=8 Weight=6 Category=2h',
  'Javelin':
    'Era=Ancient,Medieval Damage=Str+d6 MinStr=6 Weight=3 Category=R Range=3',
  'Katana':'Era=Medieval Damage=Str+d6+1 MinStr=8 Weight=3 Category=2h',
  'Lance':'Era=Medieval Damage=Str+d8 MinStr=8 Weight=6 Category=1h',
  'Mace':'Era=Medieval Damage=Str+d6 MinStr=6 Weight=4 Category=1h',
  'Maul':'Era=Medieval Damage=Str+d10 MinStr=10 Weight=10 Category=2h',
  'Pike':'Era=Medieval Damage=Str+d8 MinStr=8 Weight=18 Category=2h',
  'Rapier':'Era=Medieval Damage=Str+d4 MinStr=4 Weight=2 Category=1h Parry=1',
  'Spear':
    'Era=Ancient,Medieval ' +
    'Damage=Str+d6 MinStr=6 Weight=3 Category=2h Range=3 Parry=1',
  'Staff':
    'Era=Ancient,Medieval Damage=Str+d4 MinStr=4 Weight=4 Category=2h Parry=1',
  'Great Sword':
    'Era=Medieval,Colonial Damage=Str+d10 MinStr=10 Weight=6 Category=2h',
  'Long Sword':
    'Era=Medieval,Colonial Damage=Str+d8 MinStr=8 Weight=3 Category=1h',
  'Short Sword':
    'Era=Medieval,Colonial Damage=Str+d6 MinStr=6 Weight=2 Category=1h',
  'Warhammer':'Era=Medieval Damage=Str+d6 MinStr=6 Weight=2 Category=1h AP=1',
  'Bangstick':'Era=Modern Damage=3d6 MinStr=6 Weight=2 Category=1h',
  'Bayonet':
    'Era=Victorian,Modern Damage=Str+d4 MinStr=4 Weight=1 Category=1h Parry=1',
  'Billy Club':
    'Era=Victorian,Modern Damage=Str+d4 MinStr=4 Weight=1 Category=1h',
  'Baton':'Era=Victorian,Modern Damage=Str+d4 MinStr=4 Weight=1 Category=1h',
  'Brass Knuckles':
    'Era=Victorian,Modern Damage=Str+d4 MinStr=4 Weight=1 Category=1h',
  'Chainsaw':'Era=Modern Damage=2d6+4 MinStr=6 Weight=20 Category=1h',
  'Switchblade':'Era=Modern Damage=Str+d4 MinStr=4 Weight=1 Category=1h',
  'Survival Knife':'Era=Modern Damage=Str+d4 MinStr=4 Weight=1 Category=1h',
  'Molecular Knife':
    'Era=Future Damage=Str+d4+2 MinStr=4 Weight=1 Category=1h AP=2',
  'Molecular Sword':
    'Era=Future Damage=Str+d8+2 MinStr=6 Weight=2 Category=1h AP=4',
  'Laser Sword':
    'Era=Future Damage=Str+d6+8 MinStr=4 Weight=2 Category=1h AP=12',

  'Throwing Axe':
    'Era=Ancient,Medieval Damage=Str+d6 MinStr=6 Weight=3 Category=R Range=3',
  'Bow':'Era=Ancient,Medieval Damage=2d6 MinStr=6 Weight=3 Category=R Range=12',
  'Hand Drawn Crossbow':
    'Era=Medieval Damage=2d6 MinStr=6 Weight=5 Category=R AP=2 Range=10',
  'Heavy Crossbow':
    'Era=Medieval Damage=2d8 MinStr=6 Weight=8 Category=R AP=2 Range=10',
  'Long Bow':
    'Era=Medieval Damage=2d6 MinStr=8 Weight=3 Category=R AP=1 Range=15',
  'Net':'Era=Medieval Damage=d0 MinStr=4 Weight=8 Category=R Range=3',
  'Sling':
    'Era=Ancient,Medieval Damage=Str+d4 MinStr=4 Weight=1 Category=R Range=4',
  'Compound Bow':
    'Era=Medieval Damage=Str+d6 MinStr=6 Weight=3 Category=R AP=1 Range=12',
  'Crossbow':
    'Era=Medieval Damage=2d6 MinStr=6 Weight=7 Category=R AP=2 Range=15',
  'Flintlock Pistol':
    'Era=Colonial Damage=2d6+1 MinStr=4 Weight=3 Category=R Range=5',
  'Brown Bess':
    'Era=Colonial Damage=2d8 MinStr=6 Weight=15 Category=R Range=10',
  'Blunderbuss':
    'Era=Colonial Damage=3d6 MinStr=6 Weight=12 Category=R Range=10',
  'Kentucky Rifle':
    'Era=Colonial Damage=2d8 MinStr=6 Weight=8 Category=R AP=2 Range=15',
  'Springfield Model 1861':
    'Era=Victorian Damage=2d8 MinStr=6 Weight=11 Category=R Range=15',
  'Derringer':'Era=Victorian Damage=2d4 MinStr=4 Weight=1 Category=R Range=3',
  'Police Revolver':
    'Era=Victorian Damage=2d6 MinStr=4 Weight=2 Category=R Range=10',
  'Colt Peacemaker':
    'Era=Victorian Damage=2d6+1 MinStr=4 Weight=4 Category=R AP=1 Range=12',
  'Smith & Wesson':
    'Era=Victorian Damage=2d6+1 MinStr=4 Weight=5 Category=R AP=1 Range=12',
  'Colt 1911':
    'Era=Modern Damage=2d6+1 MinStr=4 Weight=4 Category=R AP=1 Range=12',
  'Desert Eagle':
    'Era=Modern Damage=2d8 MinStr=6 Weight=8 Category=R AP=2 Range=15',
  'Glock':'Era=Modern Damage=2d6 MinStr=4 Weight=3 Category=R AP=1 Range=12',
  'Ruger':'Era=Modern Damage=2d4 MinStr=4 Weight=2 Category=R Range=10',
  'H&K MP5':
    'Era=Modern Damage=2d6 MinStr=6 Weight=10 Category=R AP=1 Range=12 ROF=3',
  'Tommy Gun':
    'Era=Modern Damage=2d6+1 MinStr=6 Weight=13 Category=R AP=1 Range=12 ROF=3',
  'Uzi':
    'Era=Modern Damage=2d6 MinStr=4 Weight=9 Category=R AP=1 Range=12 ROF=3',
  'Double-Barrel Shotgun':
    'Era=Modern Damage=3d6 MinStr=6 Weight=11 Category=R Range=12',
  'Pump Action Shotgun':
    'Era=Modern Damage=3d6 MinStr=4 Weight=8 Category=R Range=12',
  'Sawed-Off Shotgun':
    'Era=Modern Damage=3d6 MinStr=4 Weight=6 Category=R Range=5',
  'Streetsweeper':
    'Era=Modern Damage=3d6 MinStr=6 Weight=10 Category=R Range=12',
  'Barrett Rifle':
    'Era=Modern Damage=2d10 MinStr=8 Weight=35 Category=R AP=4 Range=50',
  'M1 Garand':
    'Era=Modern Damage=2d8 MinStr=6 Weight=10 Category=R AP=2 Range=24',
  'Hunting Rifle':
    'Era=Modern Damage=2d8 MinStr=6 Weight=8 Category=R AP=2 Range=24',
  'Sharps Big 50':
    'Era=Modern Damage=2d10 MinStr=8 Weight=11 Category=R AP=2 Range=30',
  'Spencer Carbine':
    'Era=Modern Damage=2d8 MinStr=4 Weight=8 Category=R AP=2 Range=20',
  "Winchester '73":
    'Era=Modern Damage=2d8 MinStr=6 Weight=10 Category=R AP=2 Range=24',
  'AK47':
    'Era=Modern Damage=2d8+1 MinStr=6 Weight=10 Category=R AP=2 Range=24 ROF=3',
  'M-16':
    'Era=Modern Damage=2d8 MinStr=6 Weight=8 Category=R AP=2 Range=24 ROF=3',
  'Steyr AUG':
    'Era=Modern Damage=2d8 MinStr=6 Weight=8 Category=R AP=2 Range=24 ROF=3',
  'Browning Automatic Rifle':
    'Era=Modern Damage=2d8 MinStr=8 Weight=17 Category=R AP=2 Range=20 ROF=3',
  'Gatling Gun':
    'Era=Modern Damage=2d8 MinStr=0 Weight=170 Category=R AP=2 Range=24 ROF=3',
  'Minigun':
    'Era=Modern Damage=2d8+1 MinStr=10 Weight=85 Category=R AP=2 Range=30 ROF=5',
  'M2 Browning':
    'Era=Modern Damage=2d10 MinStr=0 Weight=84 Category=R AP=4 Range=50 ROF=3',
  'M60':
    'Era=Modern Damage=2d8+1 MinStr=8 Weight=33 Category=R AP=2 Range=30 ROF=3',
  'MG42':
    'Era=Modern Damage=2d8+1 MinStr=10 Weight=26 Category=R AP=2 Range=30 ROF=4',
  'SAW':
    'Era=Modern Damage=2d8 MinStr=8 Weight=20 Category=R AP=2 Range=30 ROF=4',
  'Laser Pistol':
    'Era=Future Damage=2d6 MinStr=4 Weight=2 Category=R AP=2 Range=15',
  'Laser SMG':
    'Era=Future Damage=2d6 MinStr=4 Weight=4 Category=R AP=2 Range=15 ROF=4',
  'Laser Rifle':
    'Era=Future Damage=3d6 MinStr=6 Weight=8 Category=R AP=2 Range=30 ROF=3',
  'Gatling Laser':
    'Era=Future Damage=3d6+4 MinStr=8 Weight=20 Category=R AP=2 Range=50 ROF=4'
 
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
SWD.identityRules = function(rules, races, eras, deitys) {
  SWADE.identityRules(rules, races, eras, deitys);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to powers. */
SWD.arcaneRules = function(rules, arcanas, powers) {
  SWADE.arcaneRules(rules, arcanas, powers);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to character aptitudes. */
SWD.talentRules = function(
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
      QuilvynUtils.getAttrValue(attrs, 'MinStr') || 0,
      QuilvynUtils.getAttrValue(attrs, 'Weight')
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
      QuilvynUtils.getAttrValue(attrs, 'MinStr') || 0,
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
  SWADE.armorRules(rules, name, eras, areas, armor, minStr, weight);
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
  SWADE.edgeRulesExtra(rules, name);
  // No changes needed to the rules defined by base method
};

/* Defines in #rules# the rules associated with language #name#. */
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
  SWADE.languageRules(rules, name);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with power #name#, which may be
 * acquired only after #advances# advances and requires #powerPoints# Power
 * Points to use. #description# is a concise description of the power's effects.
 */
SWD.powerRules = function(rules, name, advances, powerPoints, description) {
  SWADE.powerRules(rules, name, advances, powerPoints, description);
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
  SWADE.raceRulesExtra(rules, name);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with shield #name#, found during
 * eras #eras#, which adds #parry# to the character's Parry, provides #cover#
 * cover, requires #minStr# to handle, and weighs #weight#.
 */
SWD.shieldRules = function(rules, name, eras, parry, cover, minStr, weight) {
  SWADE.shieldRules(rules, name, eras, parry, cover, minStr, weight);
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
  SWADE.weaponRules(
    rules, name, eras, damage, minStr, weight, category, armorPiercing, range,
    rateOfFire, parry
  );
  // No changes needed to the rules defined by base method
};

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
    '    Major hindrances are noted by a "+" after the name. For example,\n' +
    '    "Greedy" is a minor hindrance and "Greedy+" a major one.\n' +
    '  </li><li>\n' +
    '    Quilvyn assumes that every race has its own language and that\n' +
    '    half-elf characters know both Elf and Human.\n' +
    '  </li><li>\n' +
    '    If the Arcane Focus box is checked when creating a random\n' +
    '    character, Quilvyn will select either New Powers or Power Points\n' +
    '    for most of the character\'s edges.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '<h3>Limitations</h3>\n' +
    '<ul>\n' +
    '</ul>\n' +
    '<h3>Known Bugs</h3>\n' +
    '<ul>\n' +
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
    '<img alt="Savage Worlds Fan Logo" width="300" height="200" src="https://cdn-cmhfa.nitrocdn.com/sILXXMmoPZtGHchENBdSFUfGNBQKBJVN/assets/static/optimized/rev-7a1d351/wp-content/uploads/2021/04/SW_LOGO_FP_2018-300x200-1.png"/>\n';
};
