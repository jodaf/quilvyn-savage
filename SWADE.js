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
"use strict";

/*
 * This module loads the rules from the Savage Worlds Adventure Edition Core
 * Rules. The SWADE function contains methods that load rules for particular
 * parts of the rules: raceRules for character races, powerRules for powers,
 * etc. These member methods can be called independently in order to use a
 * subset of the SWADE rules. Similarly, the constant fields of SWADE
 * (SKILLS, EDGES, etc.) can be manipulated to modify the choices.
 */
function SWADE() {

  var rules = new QuilvynRules('Savage Worlds', SWADE.VERSION);
  SWADE.rules = rules;

  rules.defineChoice('choices', SWADE.CHOICES);
  rules.choiceEditorElements = SWADE.choiceEditorElements;
  rules.choiceRules = SWADE.choiceRules;
  rules.editorElements = SWADE.initialEditorElements();
  rules.getFormats = SWADE.getFormats;
  rules.makeValid = SWADE.makeValid;
  rules.randomizeOneAttribute = SWADE.randomizeOneAttribute;
  rules.defineChoice('random', SWADE.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = SWADE.ruleNotes;

  SWADE.createViewers(rules, SWADE.VIEWERS);
  rules.defineChoice('extras',
    'edges', 'edgePoints', 'hindrences', 'sanityNotes', 'validationNotes'
  );
  rules.defineChoice('preset',
    'race:Race,select-one,races', 'advances:Advances,text,4'
  );

  SWADE.attributeRules(rules);
  SWADE.combatRules(rules, SWADE.ARMORS_TORSO, SWADE.SHIELDS, SWADE.WEAPONS);
  SWADE.magicRules(rules, SWADE.POWERS);
  SWADE.identityRules(rules, SWADE.RACES);
  SWADE.talentRules
    (rules, SWADE.EDGES, SWADE.FEATURES, SWADE.GOODIES, SWADE.HINDRANCES,
     SWADE.SKILLS);

  Quilvyn.addRuleSet(rules);

}

SWADE.VERSION = '2.3.1.0';

/* List of items handled by choiceRules method. */
SWADE.CHOICES = [
  'Armor', 'Edge', 'Feature', 'Goody', 'Hindrance', 'Race', 'Shield', 'Skill',
  'Spell', 'Weapon'
];
/*
 * List of items handled by randomizeOneAttribute method. The order handles
 * dependencies among attributes when generating random characters.
 */
SWADE.RANDOMIZABLE_ATTRIBUTES = [
  'name', 'race', 'gender', 'advances', 'hindrances', 'improvements',
  'attributes', 'edges', 'skills', 'armor', 'weapons', 'shield', 'powers'
];
SWADE.VIEWERS = ['Collected Notes', 'Compact', 'Standard'];

SWADE.ATTRIBUTES = {
  'agility':'',
  'smarts':'',
  'spirit':'',
  'strength':'',
  'vigor':''
};
SWADE.ARMORS_TORSO = {
  'None':'Armor=0 MinStr=10 Weight=0',
  'Cloth Jacket':'Armor=1 MinStr=4 Weight=5',
  'Cloth Robes':'Armor=1 MinStr=4 Weight=8',
  'Leather Jacket':'Armor=2 MinStr=6 Weight=8',
  'Chain Shirt':'Armor=3 MinStr=8 Weight=25',
  'Chain Leggings':'Armor=3 MinStr=8 Weight=10',
  'Bronze Corselet':'Armor=3 MinStr=8 Weight=13',
  'Plate Corselet':'Armor=4 MinStr=10 Weight=30',
  'Leather Jacket':'Armor=1 MinStr=4 Weight=5',
  'Kevlar Jacket':'Armor=2 MinStr=4 Weight=8',
  'Flak Jacket':'Armor=2 MinStr=6 Weight=10',
  'Kevlar Vest':'Armor=2 MinStr=6 Weight=5',
  'Kevlar Vest With Ceramic Inserts':'Armor=4 MinStr=8 Weight=17',
  'Bulletproof Suit':'Armor=10 MinStr=12 Weight=80',
  'Body Armor':'Armor=4 MinStr=4 Weight=4',
  'Infantry Battle Suit':'Armor=6 MinStr=6 Weight=12'
};
SWADE.ARMORS_ARMS = {
  'None':'Armor=0 MinStr=10 Weight=0',
  'Bronze Vambraces':'Armor=3 MinStr=8 Weight=5',
  'Plate Vambraces':'Armor=4 MinStr=10 Weight=10'
};
SWADE.ARMORS_HEAD = {
  'None':'Armor=0 MinStr=10 Weight=0',
  'Cloth Cap':'Armor=1 MinStr=4 Weight=1',
  'Leather Cap':'Armor=2 MinStr=6 Weight=1',
  'Bronze Helmet':'Armor=3 MinStr=8 Weight=6',
  'Chain Hood':'Armor=3 MinStr=8 Weight=4',
  'Heavy Helm':'Armor=4 MinStr=10 Weight=8',
  'Bike Helmet':'Armor=2 MinStr=4 Weight=1',
  'Motorcycle Helmet':'Armor=3 MinStr=4 Weight=3',
  'Kevlar Helmet':'Armor=4 MinStr=4 Weight=5',
  'Battle Helmet':'Armor=6 MinStr=6 Weight=2'
};
SWADE.ARMORS_LEGS = {
  'None':'Armor=0 MinStr=10 Weight=0',
  'Cloth Leggings':'Armor=1 MinStr=4 Weight=5',
  'Leather Leggings':'Armor=2 MinStr=6 Weight=7',
  'Bronze Greaves':'Armor=3 MinStr=8 Weight=6',
  'Plate Greaves':'Armor=4 MinStr=10 Weight=10',
  'Leather Chaps':'Armor=1 MinStr=4 Weight=5',
  'Kevlar Jeans':'Armor=2 MinStr=4 Weight=4'
};
SWADE.EDGES = {
  // Background
  'Alertness':'Type=background',
  'Ambidextrous':'Type=background Require="agility >= 8"',
  'Arcane Background (Gifted)':'Type=background',
  'Arcane Background (Magic)':'Type=background',
  'Arcane Background (Miracles)':'Type=background',
  'Arcane Background (Psionics)':'Type=background',
  'Arcane Background (Weird Science)':'Type=background',
  'Arcane Resistance':'Type=background Require="spirit >= 8"',
  'Improved Arcane Resistance':
    'Type=background Require="features.Arcane Resistance"',
  'Aristocrat':'Type=background',
  'Attractive':'Type=background Require="vigor >= 6"',
  'Very Attractive':'Type=background Require="feature.Attractive"',
  'Berserk':'Type=background',
  'Brave':'Type=background Require="spirit >= 6"',
  'Brawny':'Type=background Require="strength >= 6","vigor >= 6"',
  'Brute':'Type=background Require="strength >= 6","vigor >= 6"',
  'Charismatic':'Type=background Require="spirit >= 6"',
  'Elan':'Type=background Require="spirit >= 6"',
  'Fame':'Type=background',
  'Famous':'Type=background Require="advances >= 4","features.fame"',
  'Fast Healer':'Type=background Require="vigor >= 8"',
  'Fleet-Footed':'Type=background Require="agility >= 6"',
  'Linguist':'Type=background Require="smarts >= 6"',
  'Luck':'Type=background',
  'Great Luck':'Type=background Require="features.Luck"',
  'Quick':'Type=background Require="agility >= 8"',
  'Rich':'Type=background',
  'Filthy Rich':'Type=background Require="feature.Rich"',
  // Combat
  'Block':'Type=combat Require="advances >= 4","skills.Fighting >= 8"',
  'Improved Block':'Type=combat Require="advances >= 8","features.Block"',
  'Brawler':'Type=combat Require="strength >= 8","vigor >= 8"',
  'Bruiser':'Type=combat Require="advances >= 4","features.Brawler"',
  'Calculating':'Type=combat Require="smarts >= 8"',
  'Combat Reflexes':'Type=combat Require="advances >= 8"',
  'Counterattack':'Type=combat Require="advances >= 4","skills.Fighting >= 8"',
  'Improved Counterattack':
    'Type=combat Require="advances >= 8","features.Counterattack"',
  'Dead Shot':
    'Type=combat Require="skills.Athletics >= 8 || skills.Shooting >= 8"',
  'Dodge':'Type=combat Require="advances >= 4","agility >= 8"',
  'Improved Dodge':'Type=combat Require="advances >= 4","features.Dodge"',
  'Double Tap':'Type=combat Require="advances >= 4","skills.Shooting >= 6"',
  'Extraction':'Type=combat Require="agility >= 8"',
  'Improved Extraction':
    'Type=combat Require="advances >= 4","features.Extraction"',
  'Feint':'Type=combat Require="skills.Fighting >= 8"',
  'First Strike':'Type=combat Require="agility >= 8"',
  'Improved First Strike':
    'Type=combat Require="advances >= 12","features.First Strike"',
  'Free Runner':'Type=combat Require="agility >= 8","skills.Athletics >= 6"',
  'Frenzy':'Type=combat Require="advances >= 4","skills.Fighting >= 8"',
  'Improved Frenzy':'Type=combat Require="advances >= 8","features.Frenzy"',
  'Giant Killer':'Type=combat Require="advances >= 8"',
  'Hard To Kill':'Type=combat Require="spirit >= 8"',
  'Harder To Kill':
    'Type=combat Require="advances >= 8","features.Hard To Kill"',
  'Improvisational Fighter':'Type=combat Require="advances >= 4","smarts >= 6"',
  'Iron Jaw':'Type=combat Require="vigor >= 8"',
  'Killer Instinct':'Type=combat Require="advances >= 4"',
  'Level Headed':'Type=combat Require="advances >= 4","smarts >= 8"',
  'Improved Level Headed':
    'Type=combat Require="advances >= 4","features.Level Headed"',
  'Marksman':
    'Type=combat ' +
    'Require="advances >= 4","skills.Athletics >= 8 || skills.Shooting >= 8"',
  'Martial Artist':'Type=combat Require="skills.Fighting >= 6"',
  'Martial Warrior':
    'Type=combat Require="advances >= 4","features.Martial Artist"',
  'Mighty Blow':'Type=combat Require="skills.Fighting >= 8"',
  'Nerves Of Steel':'Type=combat Require="vigor >= 8"',
  'Improved Nerves Of Steel':'Type=combat Require="features.Nerves Of Steel"',
  'No Mercy':'Type=combat Require="advances >= 4"',
  'Rapid Fire':'Type=combat Require="advances >= 4","skills.Shooting >= 6"',
  'Improved Rapid Fire':
    'Type=combat Require="advances >= 8","features.Rapid Fire"',
  'Rock And Roll':'Type=combat Require="advances >= 4","skills.Shooting >= 8"',
  'Steady Hands':'Type=combat Require="agility >= 8"',
  'Sweep':'Type=combat Require="strength >= 8","skills.Fighting >= 8"',
  'Improved Sweep':'Type=combat Require="advances >= 8","features.Sweep"',
  'Trademark Weapon (%weapon)':
    'Type=combat ' +
    'Imply="weapons.%weapon" ' +
    'Require="skills.%weapon >= 8"',
  'Improved Trademark Weapon (%weapon)':
    'Type=combat ' +
    'Imply="weapons.%weapon" ' +
    'Require="advances >= 4","features.Trademark Weapon (%weapon)"',
  'Two-Fisted':'Type=combat Require="agility >= 8"',
  'Two-Gun Kid':'Type=combat Require="agility >= 8"',
  // Leadership
  'Command':'Type=combat Require="smarts >= 6"',
  'Command Presence':'Type=combat Require="advances >= 4","features.Command"',
  'Fervor':
    'Type=combat Require="advances >= 8","spirit >= 8","features.Command"',
  'Hold The Line!':
    'Type=combat Require="advances >= 4","smarts >= 8","features.Command"',
  'Inspire':'Type=combat Require="advances >= 4","features.Command"',
  'Natural Leader':
    'Type=combat Require="advances >= 4","spirit >= 8","features.Command"',
  'Tactician':
    'Type=combat ' +
    'Require="advances >= 4","smarts >= 8","features.Command","skills.Battle >= 6"',
  'Master Tactician':'Type=combat Require="advances >= 8","features.Tactician"',
  // Power
  'Artificer':'Type=power Require="advances >= 4",hasArcaneBackground',
  'Channeling':'Type=power Require="advances >= 4",hasArcaneBackground',
  'Concentration':'Type=power Require="advances >= 4",hasArcaneBackground',
  'Extra Effort':
    'Type=power ' +
    'Require="advances >= 4","features.Arcane Background (Gifted)","skills.Focus >= 6"',
  'Gadgeteer':
    'Type=power ' +
    'Require="advances >= 4","features.Arcane Background (Weird Science)","skills.Weird Science >= 6"',
  'Holy/Unholy Warrior':
    'Type=power ' +
    'Require="advances >= 4","Arcane Background (Miracles","skills.Faith >= 6"',
  'Mentalist':
    'Type=power ' +
    'Require="advances >= 4","features.Arcane Background (Psionics)","skills.Psionics >= 6"',
  'New Powers':'Type=power Require=hasArcaneBackground"',
  'Power Points':'Type=power Require=hasArcaneBackground"',
  'Power Surge':'Type=power Require="hasArcaneBackground","arcaneSkill >= 8"',
  'Rapid Recharge':
    'Type=power Require="advances >= 4","spirit >= 6",hasArcaneBackground',
  'Improved Rapid Recharge':
    'Type=power Require="advances >= 8","features.Rapid Recharge"',
  'Soul Drain':
    'Type=power ' +
    'Require="advances >= 4",hasArcaneBackground,"arcaneSkill >= 10"',
  'Wizard':
    'Type=power ' +
    'Require="advances >= 4","features.Arcane Background (Magic)","skills.Spellcasting >= 6"',
  // Professional
  'Ace':'Type=professional Require="agility >= 8"',
  'Acrobat':'Type=professional Require="agility >= 8","skills.Athletics >= 8"',
  'Combat Acrobat':
    'Type=professional Require="advances >= 4","features.Acrobat"',
  'Assassin':
    'Type=professional ' +
    'Require="agility >= 8","skills.Fighting >= 6","stealth >= 8"',
  'Investigator':
    'Type=professional Require="smarts >= 6","skills.Research >= 8"',
  'Jack-Of-All-Trades':'Type=professional Require="smarts >= 10"',
  'McGyver':
    'Type=professional ' +
    'Require="smarts >= 6","skills.Notice >= 8","skills.Repair >= 6"',
  'Mr. Fix It':'Type=professional Require="skills.Repair >= 8"',
  'Scholar (Academics)':'Type=professional Require="skills.Research >= 8"',
  'Scholar (Battle)':'Type=professional Require="skills.Research >= 8"',
  'Scholar (Occult)':'Type=professional Require="skills.Research >= 8"',
  'Scholar (Science)':'Type=professional Require="skills.Research >= 8"',
  'Soldier':'Type=professional Require="strength >= 6","vigor >= 6"',
  'Thief':
    'Type=professional ' +
    'Require="agility >= 8","skills.Stealth >= 6","skills.Thievery >= 6"',
  'Woodsman':'Type=professional Require="spirit >= 6","skills.Survival >= 8"',
  // Social
  'Bolster':'Type=social Require="spirit >= 8"',
  'Common Bond':'Type=social Require="spirit >= 8"',
  'Connections':'Type=social',
  'Humiliate':'Type=social Require="skills.Taunt >= 8"',
  'Menacing':
    'Type=social Require="features.Bloodthirsty || features.Mean || features.Ruthless || features.Ugly"',
  'Provoke':'Type=social Require="skills.Taunt >= 6"',
  'Rabble-Rouser':'Type=social Require="spirit >= 8"',
  'Reliable':'Type=social Require="spirit >= 8"',
  'Retort':'Type=social Require="skills.Taunt >= 6"',
  'Streetwise':'Type=social Require="smarts >= 6"',
  'Strong Willed':'Type=social Require="spirit >= 8"',
  'Iron Will':
    'Type=social ' +
    'Require="advances >= 4","features.Brave","features.Strong Willed"',
  'Work The Room':'Type=social Require="spirit >= 8"',
  'Work The Crowd':
    'Type=social Require="advances >= 4","features.Work The Room"',
  // Weird
  'Beast Bond':'Type=weird',
  'Beast Master':'Type=weird Require="spirit >= 8"',
  'Champion':'Type=weird Require="spirit >= 8","skills.Fighting >= 6"',
  'Chi':'Type=weird Require="advances >= 8","features.Martial Warrior"',
  'Danger Sense':'Type=weird',
  'Healer':'Type=weird Require="spirit >= 8"',
  'Liquid Courage':'Type=weird Require="vigor >= 8"',
  'Scavenger':'Type=weird Require="features.Luck"',
  // Legendary
  'Followers':'Type=legendary Require="advances >= 16"',
  'Professional (%trait)':
    'Type=legendary Require="advances >= 16","%trait == 12"',
  'Expert (%trait)':
    'Type=legendary Require="advances >= 16","features.Professional (%trait)"',
  'Master (%trait)':
    'Type=legendary Require="advances >= 16","features.Expert (%trait)"',
  'Sidekick':'Type=legendary Require="advances >= 16"',
  'Tough As Nails':'Type=legendary Require="advances >= 16","vigor >= 8"',
  'Tougher Than Nails':
    'Type=legendary Require="advances >= 16","features.Tough As Nails","vigor >= 12"',
  'Weapon Master':
    'Type=legendary Require="advances >= 16","skills.Fighting >= 12"',
  'Master Of Arms':
    'Type=legendary Require="advances >= 16","features.Weapon Master"'
};
SWADE.FEATURES = {

  // Edges
  'Ace':
    'Section=skill ' +
    'Note="Ignore 2 penalty points on Boating, Driving, and Piloting, spend Benny to Soak vehicle damage"',
  'Acrobat':
    'Section=skill Note="Reroll Athletics (balance, tumble, or grapple)"',
  'Alertness':'Section=skill Note="+2 Notice"',
  'Ambidextrous':
    'Section=combat Note="No off-hand penalty, parry bonuses stack"',
  'Arcane Background (Gifted)':'Section=feature Note="Access to arcane powers"',
  'Arcane Background (Magic)':'Section=feature Note="Access to arcane powers"',
  'Arcane Background (Miracles)':
    'Section=feature Note="Access to arcane powers"',
  'Arcane Background (Psionics)':
    'Section=feature Note="Access to arcane powers"',
  'Arcane Background (Weird Science)':
    'Section=feature Note="Access to arcane powers"',
  'Arcane Resistance':
    'Section=save ' +
    'Note="-%V others\' targeted arcane skill, -%V magical damage"',
  'Aristocrat':
    'Section=skill ' +
    'Note="+2 Persuasion (networking with aristocrats)/+2 Common Knowledge (etiquette, heraldry, gossip)"',
  'Artificer':'Section=magic Note="Create arcane devices"',
  'Assassin':
    'Section=combat Note="+2 damage to Vulnerable foes and during The Drop"',
  'Attractive':
    'Section=skill ' +
    'Note="+%V Performance (attracted target)/+%V Persuasion (attracted target)"',
  'Beast Bond':'Section=companion Note="Spend Bennies on companion animals"',
  'Beast Master':
    'Section=feature ' +
    'Note="Has animal companion, other animals will not attack first"',
  'Berserk':
    'Section=combat ' +
    'Note="After injury, rage gives +1 Strength die, wild attacks, +2 Toughness, and critical failure hits randomly for 10 rd (Sma neg)"',
  'Block':'Section=combat Note="+%V Parry/-%V foe Gang Up bonus"',
  'Bolster':
    'Section=combat ' +
    'Note="Successful foe Test removes Distracted or Vulnerable from ally"',
  'Brave':'Section=save Note="+2 fear checks, -2 fear roll"',
  'Brawler':
    'Section=combat ' +
    'Note="+%V Toughness/+d%1 damage or +%2 damage improvement w/fists or natural weapons"',
  'Brawny':
    'Section=ability ' +
    'Note="+1 Size/+1 Strength die for encumbrance and minimum strength requirements"',
  'Bruiser':'Section=combat Note="Increased Brawler effects"',
  'Brute':
    'Section=combat,skill ' +
    'Note="Use Strength for Athletics","+1/+2/+4 thrown weapon range"',
  'Calculating':
    'Section=combat ' +
    'Note="Ignore 2 points of penalties on 1 action when Action Card is 5 or less"',
  'Champion':'Section=combat Note="+2 damage vs. opposite alignment"',
  'Channeling':
    'Section=magic ' +
    'Note="Raise on arcane skill roll reduces Power Point cost by 1"',
  'Charismatic':'Section=skill Note="Reroll Persuasion"',
  'Chi':'Section=combat Note="Reroll failed attack, force foe attack reroll, or gain +d6 natural damage 1/encounter"',
  'Combat Acrobat':
    'Section=combat ' +
    'Note="Foes -1 attack when self aware of attack and unrestrained"',
  'Combat Reflexes':'Section=combat Note="+2 on recovery rolls"',
  'Command':'Section=feature Note="Extras in %V yd +1 recover from Shaken or Stunned"',
  'Command Presence':'Section=feature Note="Increased Command effects"',
  'Common Bond':
    'Section=feature Note="Communication allows transfer of Bennies to allies"',
  'Concentration':'Section=magic Note="Dbl power duration"',
  'Connections':
    'Section=feature Note="Call in favors from acquaintence or organization"',
  'Counterattack':
    'Section=combat Note="Free Attack after failed foe attack %V/rd"',
  'Danger Sense':
    'Section=skill ' +
    'Note="+2 Notice (surprise), gain -2 Notice roll  in circumstances not usually subject to Notice"',
  'Dead Shot':
    'Section=combat ' +
    'Note="Joker Action Card gives dbl damage from first throwing or shooting"',
  'Dodge':'Section=combat Note="-2 foe ranged attacks"',
  'Double Tap':'Section=combat Note="+1 firearm attack and damage"',
  'Elan':'Section=feature Note="+2 on Benny-purchased trait rerolls"',
  'Expert':'Section=feature Note="TODO"',
  'Expert (%attribute)':'Section=skill Note="Increased Professional effects"',
  'Expert (%skill)':'Section=skill Note="Increased Professional effects"',
  'Extra Effort':
    'Section=magic Note="+1 Focus for 1 Power Point, +2 for 3 Power Points"',
  'Extraction':
    'Section=combat Note="Negate attack of %V foes when withdrawing"',
  'Fame':
    'Section=feature,skill ' +
    'Note=' +
      '"%Vx fee from performing",' +
      '"+%V Persuasion influencing friendly individuals"',
  'Famous':'Section=feature Note="Increased Fame effects"',
  'Fast Healer':
    'Section=combat Note="+2 Vigor (natural healing), check every 3 dy"',
  'Feint':
    'Section=skill ' +
    'Note="Force foe to oppose Fighting test with Smarts instead of Agility"',
  'Fervor':'Section=feature Note="Extras in command range +1 Fighting"',
  'Filthy Rich':'Section=feature Note="Increased Rich effects"',
  'First Strike':
    'Section=combat Note="Free attack against %V foes moving into reach"',
  'Fleet-Footed':'Section=combat Note="+2 Pace/+1 Run die"',
  'Followers':'Section=feature Note="Gain 5 Soldier followers"',
  'Free Runner':
    'Section=skill ' +
    'Note="Move full Pace on difficult ground/+2 Athletics (climbing)/+2 on foot chases"',
  'Frenzy':'Section=combat Note="Extra Fighting improvement on %V attacks/rd"',
  'Gadgeteer':'Section=magic Note="Jury rig arcane device from availble parts"',
  'Giant Killer':'Section=combat Note="+1d6 damage vs. foes 3 sizes larger"',
  'Great Luck':'Section=feature Note="Increased Luck effects"',
  'Hard To Kill':
    'Section=save Note="Ignore Wound penalties to avoid bleeding out"',
  'Harder To Kill':'Section=save Note="50% chance to cheat death"',
  'Healer':'Section=skill Note="+2 Healing"',
  'Hold The Line!':'Section=feature Note="Extras in command range +1 Toughness"',
  'Holy/Unholy Warrior':
    'Section=magic ' +
    'Note="Spend 1-4 Power Points to add equal amount to Soak roll"',
  'Humiliate':'Section=combat Note="Reroll Taunt"',
  'Improved Arcane Resistance':
    'Section=save Note="+2 Arcane Resistance Effects"',
  'Improved Block':'Section=combat Note="Increased Block effects"',
  'Improved Counterattack':
    'Section=combat Note="Two additional Counterattacks"',
  'Improved Dodge':'Section=combat Note="+2 to evade area attacks"',
  'Improved Extraction':
    'Section=combat Note="Increase Extraction effects by 2"',
  'Improved First Strike':
    'Section=combat Note="Increase First Strike effects by 2"',
  'Improved Frenzy':'Section=combat Note="Increased Frenzy effects"',
  'Improved Level Headed':
    'Section=combat Note="Increase Level Headed effects by 1"',
  'Improved Nerves Of Steel':
    'Section=combat Note="Increased Nerves Of Steel effects"',
  'Improved Rapid Fire':'Section=combat Note="Increased Rapid Fire effects"',
  'Improved Rapid Recharge':
    'Section=magic Note="Increased Rapid Recharge effects"',
  'Improved Sweep':'Section=combat Note="Increased Sweep effects"',
  'Improved Trademark Weapon (%weapon)':
    'Section=combat Note="Increased Trademark Weapon effects"',
  'Improvisational Fighter':
    'Section=combat Note="No penalty w/improvised weapons"',
  'Inspire':'Section=skill Note="Use Battle to give all extras in command range +1 on chosen trait"',
  'Investigator':'Section=skill Note="+2 Research (sifting for information)"',
  'Iron Jaw':'Section=combat Note="+2 soak/+2 vs. knockout"',
  'Iron Will':'Section=save Note="+2 resist powers"',
  'Jack-Of-All-Trades':
    'Section=skill ' +
    'Note="Successful Smarts roll gives d4 on chosen skill (d6 with Raise)"',
  'Killer Instinct':'Section=skill Note="Reroll self-initiated opposed test"',
  'Level Headed':'Section=combat Note="Choose best of %V Action Cards"',
  // TODO how to implement this?
  'Linguist':'Section=feature Note="d6 in %{smarts//2} Language skills"',
  'Liquid Courage':
    'Section=ability ' +
    'Note="Drinking alcohol gives +1 Vigor die, -1 Smarts and Agility for 1 hr"',
  'Luck':'Section=feature Note="+%V Benny each session"',
  'Marksman':
    'Section=feature ' +
    'Note="Trade move for +1 Athletics (Throwing), +1 Shooting, or -2 attack penalties"',
  'Martial Artist':
    'Section=combat Note="+%V attack unarmed, do d4+d%{strength} damage"',
  'Martial Warrior':'Section=feature Note="Increased Martial Artist effects"',
  'Master Of Arms':'Section=combat Note="Incresed Weapon Master effects"',
  'Master (%attribute)':'Section=feature Note="Use d10 for Wild Die"',
  'Master (%skill)':'Section=feature Note="Use d10 for Wild Die"',
  'Master Tactician':'Section=combat Note="Increased Tactician effects"',
  'McGyver':'Section=combat Note="Successful Repair roll creates explosive"',
  'Menacing':'Section=skill Note="+2 Intimidation"',
  'Mentalist':'Section=skill Note="+2 Psionics"',
  'Mighty Blow':
    'Section=combat ' +
    'Note="Joker Action Card gives double damage on first Fighting attack"',
  'Mr. Fix It':'Section=skill Note="+2 Repair/Raise cuts time by half"',
  'Natural Leader':'Section=feature Note="Apply Leadership Edges to Wild Cards"',
  'Nerves Of Steel':'Section=combat Note="Ignore %V points of wound penalties"',
  'New Powers':'Section=magic Note="Know 2 additional powers"',
  'No Mercy':'Section=combat Note="+2 Damage on Benny reroll"',
  'Power Points':'Section=magic Note="+5 Power Points"',
  'Power Surge':'Section=magic Note="Recover 10 Power Points when Joker drawn"',
  'Professional (%attribute)':'Section=skill Note="+%V %attribute"',
  'Professional (%skill)':'Section=skill Note="+%V %skill"',
  'Provoke':
    'Section=combat Note="Taunted foe -2 to attack target other than self"',
  'Quick':'Section=combat Note="Redraw action cards under 6"',
  'Rabble-Rouser':
    'Section=combat Note="Taunt or Intimidate all within medium blast range"',
  'Rapid Fire':'Section=combat Note="Increase rate of fire by 1 %V/rd"',
  'Rapid Recharge':'Section=magic Note="Recover %V Power Points/hr"',
  'Reliable':'Section=combat Note="Reroll Support"',
  'Retort':
    'Section=feature Note="Raise on Intimidation or Taunt test distracts foe"',
  'Rich':'Section=feature Note="%Vx starting funds"',
  'Rock And Roll':'Section=combat Note="Trade move for ignoring recoil"',
  'Scavenger':
    'Section=combat Note="Recover knowledge or equipment 1/encounter"',
  'Scholar (Academics)':'Section=feature Note="+2 Academics"',
  'Scholar (Battle)':'Section=feature Note="+2 Battle"',
  'Scholar (Occult)':'Section=feature Note="+2 Occult"',
  'Scholar (Science)':'Section=feature Note="+2 Science"',
  'Sidekick':'Section=feature Note="Special bond with companion"',
  'Soldier':
    'Section=ability ' +
    'Note="+1 Strength die (Encumbrance)/Reroll Vigor (environmental hazards)"',
  'Soul Drain':
    'Section=magic Note="Suffer level of Fatigue to recover 5 Power Points"',
  'Steady Hands':
    'Section=combat ' +
    'Note="No penalty for shot from unstable platform, reduce running shot penalty by 1"',
  'Streetwise':
    'Section=skill ' +
    'Note="+2 Intimidation (criminal network)/+2 Persuasion (criminal network)/+2 Common Knowledge (criminals)"',
  'Strong Willed':'Section=save Note="+2 resist Test with Smarts or Spirit"',
  'Sweep':
    'Section=combat Note="Take %V attack penalty to attack all within reach"',
  'Tactician':'Section=combat Note="Give %V extra action cards to extras"',
  'Thief':
    'Section=skill Note="+1 Climb (urban)/+1 Stealth (urban)/+1 Thievery"',
  'Tough As Nails':'Section=feature Note="Take %V wounds before incapacitated"',
  'Tougher Than Nails':'Section=combat Note="Increased Tough As Nails effects"',
  'Trademark Weapon (%weapon)':
    'Section=combat ' +
    'Note="+%V Athletics (Throwing), Fighting, Shooting and Parry with %weapon"',
  'Two-Fisted':
    'Section=combat Note="No multi-attack penalty for second Fighting attack"',
  'Two-Gun Kid':
    'Section=combat ' +
    'Note="No multi-action penalty for firing or throw weapon with each hand"',
  'Very Attractive':'Section=skill Note="+1 Attractive effects"',
  'Weapon Master':'Section=combat Note="+%V Parry/d%1 bonus damage"',
  'Wizard':'Section=magic Note="Spend 1 Power Point to change power trapping"',
  'Woodsman':'Section=skill Note="+2 Survival/+2 Stealth (nature)"',
  'Work The Crowd':'Section=skill Note="Increased Work The Room effects"',
  'Work The Room':
    'Section=skill ' +
    'Note="+1 die to Support with Persuasion or Performance %V/rd"',

  // Hindrances
  'All Thumbs':
    'Section=skill ' +
    'Note="-2 using mechanical and electrical devices, critical failure breaks device"',
  'Anemic':'Section=save Note="-2 Vigor (resist disease)"',
  'Arrogant':'Section=combat Note="Always take on biggest threat"',
  'Bad Eyes (Major)':'Section=skill Note="-2 vision-linked"',
  'Bad Eyes (Minor)':'Section=skill Note="-1 vision-linked"',
  'Bad Luck':'Section=feature Note="-1 Benny each session"',
  'Big Mouth':'Section=feature Note="Cannot keep secrets"',
  'Blind':'Section=feature Note="-6 visual tasks/+1 Edge Points"',
  'Bloodthirsty':'Section=combat Note="Cruel w/foes"',
  "Can't Swim":
    'Section=combat,skill ' +
    'Note="Swim Pace %{pace//3}","-2 Athletics (swimming)"',
  'Cautious':'Section=feature Note="Requires detailed plan before acting"',
  'Clueless (Major)':'Section=skill Note="-1 Common Knowledge/-1 Notice"',
  'Clumsy':'Section=skill Note="-2 Athletics/-2 Stealth"',
  'Code Of Honor':'Section=feature Note="Insists on acting nobly"',
  'Curious':
    'Section=feature Note="Insists on investigating every mystery and secret"',
  'Death Wish':'Section=feature Note="Will risk death for useful goal"',
  'Delusional (Major)':
    'Section=feature Note="Frequently acts on conspiracy belief"',
  'Delusional (Minor)':'Section=feature Note="Harmless conspiracy belief"',
  'Doubting Thomas':
    'Section=feature Note="Overly skeptical of supernatural reality"',
  'Driven (Major)':
    'Section=feature Note="Overriding desire to fulfill personal goal"',
  'Driven (Minor)':'Section=feature Note="Actions shaped by personal goal"',
  'Elderly':
    'Section=ability,combat,skill ' +
    'Note="-1 Agility/-1 Strength/-1 Vigor","Pace -1","+5 Skill Points"',
  'Enemy (Major)':
    'Section=feature Note="Powerful individual or group wants character dead"',
  'Enemy (Minor)':'Section=feature Note="Individual wants character dead"',
  'Greedy (Major)':
    'Section=feature Note="Adamant about getting more than a fair share"',
  'Greedy (Minor)':'Section=feature Note="Stingy and materialistic"',
  'Habit (Major)':
    'Section=feature Note="Dangerous physical or mental addiction"',
  'Habit (Minor)':'Section=feature Note="Harmless but irritating compulsion"',
  'Hard Of Hearing (Major)':
    'Section=skill Note="Deaf, automatically fails Notice (hearing)"',
  'Hard Of Hearing (Minor)':'Section=skill Note="-4 Notice (hearing)"',
  'Heroic':'Section=feature Note="Always tries to help others"',
  'Hesitant':'Section=combat Note="Use lowest of 2 Action Cards"',
  'Illiterate':'Section=feature Note="Cannot read or write"',
  'Impulsive':'Section=feature Note="Always acts without thinking"',
  'Jealous (Major)':
    'Section=feature Note="Always envious about others\' accomplishments"',
  'Jealous (Minor)':
    'Section=feature Note="Focused jealousy about one topic or person"',
  'Loyal':'Section=feature Note="Always takes risks for friends"',
  'Mean':
    'Section=feature,skill ' +
    'Note="Ill-tempered and disagreeable","-1 Persuasion"',
  'Mild Mannered':'Section=skill Note="-2 Intimidation"',
  'Mute':'Section=feature Note="Cannot speak"',
  'Obese':'Section=ability,combat Note="+1 Size","-1 Pace/-1 Run die"',
  'Obligation (Major)':'Section=feature Note="Regular responsibility 40 hr/wk"',
  'Obligation (Minor)':'Section=feature Note="Regular responsibility 20 hr/wk"',
  'One Arm':'Section=skill Note="-4 on two-handed tasks"',
  'One Eye':'Section=feature Note="-2 vision-depended tasks 10 yards distant"',
  'Outsider (Major)':
    'Section=feature,skill ' +
    'Note="No legal rights","-2 Persuasion (other races)"',
  'Outsider (Minor)':'Section=skill Note="-2 Persuasion (other races)"',
  'Overconfident':'Section=feature Note="Excessive belief in capabilities"',
  'Pacifist (Major)':
    'Section=combat ' +
    'Note="Will not fight living creatures, use nonlethal methods only in defense"',
  'Pacifist (Minor)':
    'Section=feature ' +
    'Note="Will harm others only when no other option available"',
  'Phobia (Major)':'Section=feature Note="-2 in presence of fear target"',
  'Phobia (Minor)':'Section=feature Note="-1 in presence of fear target"',
  'Poverty':
    'Section=feature Note="Half starting funds, lose half funds each wk"',
  'Quirk':'Section=feature Note="Minor compulsion causes occasional trouble"',
  'Secret (Major)':
    'Section=feature ' +
    'Note="Hides knowledge to protect self or others from major trouble"',
  'Secret (Minor)':
    'Section=feature ' +
    'Note="Hides knowledge to protect self or others from minor trouble"',
  'Shamed (Major)':'Section=feature Note="Past event causes social antagonism"',
  'Shamed (Minor)':'Section=feature Note="Past event causes self-doubt"',
  'Slow (Major)':'Section=combat,skill Note="-2 Pace","-2 Athletics"',
  'Slow (Minor)':'Section=combat Note="-1 Pace/-1 Run die"',
  'Small':'Section=ability Note="-1 Size"',
  'Stubborn':'Section=feature Note="Never admits error"',
  'Suspicious (Major)':'Section=feature Note="-2 others\' Support rolls"',
  'Suspicious (Minor)':'Section=feature Note="Frequent trust issues"',
  'Thin Skinned (Major)':'Section=skill Note="-4 vs. Taunt"',
  'Thin Skinned (Minor)':'Section=skill Note="-2 vs. Taunt"',
  'Tongue-Tied':
    'Section=skill ' +
    'Note="-1 Intimidation (speech)/-1 Performance (speech)/-1 Persuasion (speech)/-1 Taunt (speech)"',
  'Ugly (Major)':'Section=skill Note="-2 Persuasion"',
  'Ugly (Minor)':'Section=skill Note="-1 Persuasion"',
  'Vengeful (Major)':'Section=feature Note="Revenge is primary concern"',
  'Vengeful (Minor)':'Section=feature Note="Spends time plotting revenge"',
  'Vow (Minor)':
    'Section=feature Note="Broad requirements on behavior and actions"',
  'Vow (Major)':
    'Section=feature Note="Strict requirements on behavior and actions"',
  'Wanted (Major)':
    'Section=feature Note="Significant trouble from local law enforcement"',
  'Wanted (Minor)':
    'Section=feature Note="Trouble from distant law or minor infractions"',
  'Yellow':'Section=save,skill Note="-2 vs. Fear","-2 vs. Intimidation"',
  'Young (Major)':
    'Section=feature ' +
    'Note="-2 Skill Points/-2 Attribute Points/+2 Benny each session"',
  'Young (Minor)':
    'Section=feature ' +
    'Note="-2 Skill Points/-1 Attribute Points/+1 Benny each session"',

  // Races
  'Adaptable':'Section=feature Note="+1 Edge Points"',
  'Agile':'Section=ability Note="+1 Agility die"',
  'Aquatic':'Section=combat Note="Cannot drown, swim Pace %{pace}"',
  'Armor +2':'Section=combat Note="+2 Parry"',
  'Bite':'Section=combat Note="Can attack w/Fangs"',
  'Claws':'Section=combat Note="Can attack w/Claws"',
  'Construct':
    'Section=combat,save ' +
    'Note=' +
      '"Ignore one level of Wound modifiers",' +
      '"+2 Shaken recovery, immune to disease and poison"',
  'Dependency':
    'Section=feature Note="Immerse in water 1 hr/dy or fatigued"',
  'Environmental Weakness':
    'Section=combat,save Note="+4 damage from cold","-4 vs. cold effects"',
  'Flight':
    'Section=combat,skill ' +
    'Note="Fly Pace 12","Use Athletics for flight maneuvers"',
  'Frail':
    'Section=combat Note="-1 Toughness"',
  'Heritage':
    'Section=feature Note="+2 Improvements (Ability or Edge)"',
  'Keen Senses':'Section=skill Note="+1 Notice die"',
  'Low Light Vision':
    'Section=feature Note="Ignore penalties for dim and dark illumination"',
  'Racial Enemy':'Section=skill Note="-2 Persuasion (racial enemy)"',
  'Reduced Pace':'Section=combat Note="-1 Pace"',
  'Small':'Section=ability Note="-1 Size"',
  'Spirited':'Section=ability Note="+1 Spirit die"',
  'Tough':'Section=ability Note="+1 Vigor die"',
  'Toughness':'Section=combat Note="+1 Toughness"',

  // Misc
  'Attribute Points':'Section=ability Note="%V to distribute"',
  'Skill Points':'Section=skill Note="%V to distribute"'

};
SWADE.GOODIES = {
  // TODO
};
SWADE.HINDRANCES = {
  'All Thumbs':'Level=Minor',
  'Anemic':'Level=Minor',
  'Arrogant':'Level=Major',
  'Bad Eyes (Major)':'Level=Major',
  'Bad Eyes (Minor)':'Level=Minor',
  'Bad Luck':'Level=Major',
  'Big Mouth':'Level=Minor',
  'Blind':'Level=Major',
  'Bloodthirsty':'Level=Major',
  "Can't Swim":'Level=Minor',
  'Cautious':'Level=Minor',
  'Clueless (Major)':'Level=Major',
  'Clumsy':'Level=Major',
  'Code Of Honor':'Level=Major',
  'Curious':'Level=Major',
  'Death Wish':'Level=Minor',
  'Delusional (Major)':'Level=Major',
  'Delusional (Minor)':'Level=Minor',
  'Doubting Thomas':'Level=Minor',
  'Driven (Major)':'Level=Major',
  'Driven (Minor)':'Level=Minor',
  'Elderly':'Level=Major',
  'Enemy (Major)':'Level=Major',
  'Enemy (Minor)':'Level=Minor',
  'Greedy (Major)':'Level=Major',
  'Greedy (Minor)':'Level=Minor',
  'Habit (Major)':'Level=Major',
  'Habit (Minor)':'Level=Minor',
  'Hard Of Hearing (Major)':'Level=Major',
  'Hard Of Hearing (Minor)':'Level=Minor',
  'Heroic':'Level=Major',
  'Hesitant':'Level=Minor',
  'Illiterate':'Level=Minor',
  'Impulsive':'Level=Major',
  'Jealous (Major)':'Level=Major',
  'Jealous (Minor)':'Level=Minor',
  'Loyal':'Level=Minor',
  'Mean':'Level=Minor',
  'Mild Mannered':'Level=Minor',
  'Mute':'Level=Major',
  'Obese':'Level=Minor',
  'Obligation (Major)':'Level=Major',
  'Obligation (Minor)':'Level=Minor',
  'One Arm':'Level=Major',
  'One Eye':'Level=Major',
  'Outsider (Major)':'Level=Major',
  'Outsider (Minor)':'Level=Minor',
  'Overconfident':'Level=Major',
  'Pacifist (Major)':'Level=Major',
  'Pacifist (Minor)':'Level=Minor',
  'Phobia (Major)':'Level=Major',
  'Phobia (Minor)':'Level=Minor',
  'Poverty':'Level=Minor',
  'Quirk':'Level=Minor',
  'Secret (Major)':'Level=Major',
  'Secret (Minor)':'Level=Minor',
  'Shamed (Major)':'Level=Major',
  'Shamed (Minor)':'Level=Minor',
  'Slow (Major)':'Level=Major',
  'Slow (Minor)':'Level=Minor',
  'Small':'Level=Minor',
  'Stubborn':'Level=Minor',
  'Suspicious (Major)':'Level=Major',
  'Suspicious (Minor)':'Level=Minor',
  'Thin Skinned (Major)':'Level=Major',
  'Thin Skinned (Minor)':'Level=Minor',
  'Tongue-Tied':'Level=Major',
  'Ugly (Major)':'Level=Major',
  'Ugly (Minor)':'Level=Minor',
  'Vengeful (Major)':'Level=Major',
  'Vengeful (Minor)':'Level=Minor',
  'Vow (Major)':'Level=Major',
  'Vow (Minor)':'Level=Minor',
  'Wanted (Major)':'Level=Major',
  'Wanted (Minor)':'Level=Minor',
  'Yellow':'Level=Major',
  'Young (Major)':'Level=Major',
  'Young (Minor)':'Level=Minor'
};
SWADE.POWERS = {
  'Arcane Protection':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Description="TODO"',
  'Banish':
    'Advances=8 ' +
    'PowerPoints=3 ' +
    'Description="TODO"',
  'Barrier':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Description="TODO"',
  'Beast Friend':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Description="TODO"',
  'Blast':
    'Advances=4 ' +
    'PowerPoints=3 ' +
    'Description="TODO"',
  'Blind':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description="TODO"',
  'Bolt':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Description="TODO"',
  'Boost/Lower Trait':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description="TODO"',
  'Burrow':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description="TODO"',
  'Burst':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description="TODO"',
  'Confusion':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Description="TODO"',
  'Damage Field':
    'Advances=4 ' +
    'PowerPoints=4 ' +
    'Description="TODO"',
  'Darksight':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Description="TODO"',
  'Deflection':
    'Advances=0 ' +
    'PowerPoints=3 ' +
    'Description="TODO"',
  'Detect/Conceal Arcana':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description="TODO"',
  'Disguise':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Description="TODO"',
  'Dispel':
    'Advances=4 ' +
    'PowerPoints=1 ' +
    'Description="TODO"',
  'Divination':
    'Advances=12 ' +
    'PowerPoints=5 ' +
    'Description="TODO"',
  'Drain Power Points':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Description="TODO"',
  'Elemental Manipulation':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Description="TODO"',
  'Empathy':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Description="TODO"',
  'Entangle':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description="TODO"',
  'Environmental Protection':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description="TODO"',
  'Farsight':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Description="TODO"',
  'Fear':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description="TODO"',
  'Fly':
    'Advances=8 ' +
    'PowerPoints=3 ' +
    'Description="TODO"',
  'Growth/Shrink':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Description="TODO"',
  'Havoc':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description="TODO"',
  'Healing':
    'Advances=0 ' +
    'PowerPoints=3 ' +
    'Description="TODO"',
  'Illusion':
    'Advances=0 ' +
    'PowerPoints=3 ' +
    'Description="TODO"',
  'Intangibility':
    'Advances=12 ' +
    'PowerPoints=5 ' +
    'Description="TODO"',
  'Invisibility':
    'Advances=4 ' +
    'PowerPoints=5 ' +
    'Description="TODO"',
  'Light/Darkness':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description="TODO"',
  'Mind Link':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Description="TODO"',
  'Mind Reading':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description="TODO"',
  'Mind Wipe':
    'Advances=8 ' +
    'PowerPoints=3 ' +
    'Description="TODO"',
  'Object Reading':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Description="TODO"',
  'Protection':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Description="TODO"',
  'Puppet':
    'Advances=8 ' +
    'PowerPoints=3 ' +
    'Description="TODO"',
  'Relief':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Description="TODO"',
  'Resurrection':
    'Advances=12 ' +
    'PowerPoints=30 ' +
    'Description="TODO"',
  'Shape Change':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Description="TODO"',
  'Sloth/Speed':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Description="TODO"',
  'Slumber':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Description="TODO"',
  'Smite':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description="TODO"',
  'Sound/Silence':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Description="TODO"',
  'Speak Language':
    'Advances=0 ' +
    'PowerPoints=1 ' +
    'Description="TODO"',
  'Stun':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description="TODO"',
  'Summon Ally':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description="TODO"',
  'Telekinesis':
    'Advances=4 ' +
    'PowerPoints=3 ' +
    'Description="TODO"',
  'Teleport':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Description="TODO"',
  'Wall Walker':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Description="TODO"',
  "Warrior's Gift":
    'Advances=4 ' +
    'PowerPoints=4 ' +
    'Description="TODO"',
  'Zombie':
    'Advances=8 ' +
    'PowerPoints=3 ' +
    'Description="TODO"'
};
SWADE.RACES = {
  'Android':
    'Features=' +
      'Construct,"Outsider (Major)","Pacifist (Major)","Vow (Major)"',
  'Aquarian':
    'Features=' +
      'Aquatic,Dependency,"Low Light Vision",Toughness',
  'Avion':
    'Features=' +
      '"Can\'t Swim",Flight,Frail,"Keen Senses","Reduced Pace"',
  'Dwarf':
    'Features=' +
      '"Low Light Vision","Reduced Pace",Tough',
  'Elf':
    'Features=' +
      'Agile,"All Thumbs","Low Light Vision"',
  'Half-Elf':
    'Features=' +
      'Heritage,"Low Light Vision","Outsider (Minor)"',
  'Half-Folk':
    'Features=' +
      'Luck,"Reduced Pace",Small,Spirited',
  'Human':
    'Features=' +
      'Adaptable',
  'Rakashan':
    'Features=' +
      'Agile,Bite,Claws,Bloodthirsty,"Can\'t Swim","Low Light Vision",' +
      '"Racial Enemy"',
  'Saurian':
    'Features=' +
      '"Armor +2",Bite,"Environmental Weakness","Keen Senses",' +
      '"Outsider (Minor)"'
};
SWADE.SHIELDS = {
  'None':'Parry=0 Cover=0 MinStr=0 Weight=0',
  'Small':'Parry=1 Cover=0 MinStr=4 Weight=4',
  'Medium':'Parry=2 Cover=-2 MinStr=6 Weight=8',
  'Large':'Parry=3 Cover=-4 MinStr=8 Weight=12',
  'Riot Shield':'Parry=3 Cover=-4 MinStr=4 Weight=5',
  'Ballistic Shield':'Parry=3 Cover=-4 MinStr=6 Weight=9',
  'Small Polymer':'Parry=1 Cover=0 MinStr=4 Weight=2',
  'Medium Polymer':'Parry=2 Cover=-2 MinStr=4 Weight=4',
  'Large Polymer':'Parry=3 Cover=-4 MinStr=6 Weight=6'
};
SWADE.SKILLS = {
  'Academics':'Attribute=smarts',
  'Athletics':'Attribute=agility Core=y',
  'Battle':'Attribute=smarts',
  'Boating':'Attribute=agility',
  'Common Knowledge':'Attribute=smarts Core=y',
  'Driving':'Attribute=agility',
  'Electronics':'Attribute=smarts',
  'Faith':'Attribute=spirit',
  'Fighting':'Attribute=agility',
  'Focus':'Attribute=spirit',
  'Gambling':'Attribute=smarts',
  'Hacking':'Attribute=smarts',
  'Healing':'Attribute=smarts',
  'Intimidation':'Attribute=spirit',
  'Language':'Attribute=smarts',
  'Notice':'Attribute=smarts Core=y',
  'Occult':'Attribute=smarts',
  'Performance':'Attribute=spirit',
  'Persuasion':'Attribute=spirit Core=y',
  'Piloting':'Attribute=agility',
  'Psionics':'Attribute=smarts',
  'Repair':'Attribute=smarts',
  'Research':'Attribute=smarts',
  'Riding':'Attribute=agility',
  'Science':'Attribute=smarts',
  'Shooting':'Attribute=agility',
  'Spellcasting':'Attribute=smarts',
  'Stealth':'Attribute=agility Core=y',
  'Survival':'Attribute=smarts',
  'Taunt':'Attribute=smarts',
  'Weird Science':'Attribute=smarts',
};
SWADE.WEAPONS = {

  'Unarmed':'Damage=0 MinStr=0 Weight=0 Category=Un',
  'Hand Axe':'Damage=d6 MinStr=6 Weight=2 Category=1h',
  'Battle Axe':'Damage=d8 MinStr=8 Weight=4 Category=1h AP=2',
  'Great Axe':'Damage=d10 MinStr=10 Weight=7 Category=2h',
  'Light Club':'Damage=d4 MinStr=4 Weight=2 Category=1h',
  'Heavy Club':'Damage=d6 MinStr=6 Weight=5 Category=1h',
  'Dagger':'Damage=d4 MinStr=4 Weight=1 Category=1h Range=3',
  'Knife':'Damage=d4 MinStr=4 Weight=1 Category=1h Range=3',
  'Flail':'Damage=d6 MinStr=6 Weight=3 Category=1h',
  'Halberd':'Damage=d8 MinStr=8 Weight=6 Category=2h',
  'Katana':'Damage=d6+1 MinStr=8 Weight=3 Category=2h',
  'Lance':'Damage=d8 MinStr=8 Weight=6 Category=1h',
  'Mace':'Damage=d6 MinStr=6 Weight=4 Category=1h',
  'Maul':'Damage=d10 MinStr=10 Weight=10 Category=2h',
  'Pike':'Damage=d8 MinStr=8 Weight=18 Category=2h',
  'Rapier':'Damage=d4 MinStr=4 Weight=2 Category=1h',
  'Spear':'Damage=d6 MinStr=6 Weight=3 Category=2h',
  'Staff':'Damage=d4 MinStr=4 Weight=4 Category=2h',
  'Great Sword':'Damage=d10 MinStr=10 Weight=6 Category=2h',
  'Long Sword':'Damage=d8 MinStr=8 Weight=3 Category=1h',
  'Short Sword':'Damage=d6 MinStr=6 Weight=2 Category=1h',
  'Warhammer':'Damage=d6 MinStr=6 Weight=2 Category=1h AP=1',
  'Bangstick':'Damage=3d6 MinStr=6 Weight=2 Category=1h',
  'Bayonet':'Damage=d4 MinStr=4 Weight=1 Category=1h',
  'Billy Club':'Damage=d4 MinStr=4 Weight=1 Category=1h',
  'Baton':'Damage=d4 MinStr=4 Weight=1 Category=1h',
  'Brass Knuckles':'Damage=d4 MinStr=4 Weight=1 Category=1h',
  'Chainsaw':'Damage=2d6+4 MinStr=6 Weight=20 Category=1h',
  'Switchblade':'Damage=d4 MinStr=4 Weight=1 Category=1h',
  'Survival Knife':'Damage=d4 MinStr=4 Weight=1 Category=1h',
  'Molecular Knife':'Damage=d4+2 MinStr=4 Weight=1 Category=1h AP=2',
  'Molecular Sword':'Damage=d8+2 MinStr=6 Weight=2 Category=1h AP=4',
  'Laser Sword':'Damage=d6+8 MinStr=4 Weight=2 Category=1h AP=12',

  'Throwing Axe':'Damage=d6 MinStr=6 Weight=3 Category=R Range=3',
  'Bow':'Damage=2d6 MinStr=6 Weight=3 Category=R Range=12',
  'Hand Drawn Crossbow':'Damage=2d6 MinStr=6 Weight=5 Category=R Range=10 AP=2',
  'Heavy Crossbow':'Damage=2d8 MinStr=6 Weight=8 Category=R Range=10 AP=2',
  'Heavy Crossbow':'Damage=2d8 MinStr=6 Weight=8 Category=R Range=10 AP=2',
  'Long Bow':'Damage=2d6 MinStr=8 Weight=3 Category=R Range=15 AP=1',
  'Net':'Damage=d0 MinStr=4 Weight=8 Category=R Range=3',
  'Sling':'Damage=d4 MinStr=4 Weight=1 Category=R Range=4',
  'Spear':'Damage=d6 MinStr=6 Weight=3 Category=R Range=3',
  'Compound Bow':'Damage=d6 MinStr=6 Weight=3 Category=R Range=12 AP=1',
  'Crossbow':'Damage=d6 MinStr=6 Weight=7 Category=R Range=15 AP=2',
  'Flintlock Pistol':'Damage=2d6+1 MinStr=4 Weight=3 Category=R Range=5',
  'Brown Bess':'Damage=2d8 MinStr=6 Weight=15 Category=R Range=10',
  'Blunderbuss':'Damage=3d6 MinStr=6 Weight=12 Category=R Range=10',
  'Kentucky Rifle':'Damage=2d8 MinStr=6 Weight=8 Category=R Range=15 AP=2',
  'Springfield Model 1861':'Damage=2d8 MinStr=6 Weight=11 Category=R Range=15',
  'Derringer':'Damage=2d4 MinStr=4 Weight=1 Category=R Range=3',
  'Police Revolver':'Damage=2d6 MinStr=4 Weight=2 Category=R Range=10',
  'Colt Peacemaker':'Damage=2d6+1 MinStr=4 Weight=4 Category=R Range=12 AP=1',
  'Smith & Wesson':'Damage=2d6+1 MinStr=4 Weight=5 Category=R Range=12 AP=1',
  'Colt 1911':'Damage=2d6+1 MinStr=4 Weight=4 Category=R Range=12 AP=1',
  'Desert Eagle':'Damage=2d6+1 MinStr=6 Weight=8 Category=R Range=15 AP=2',
  'Glock':'Damage=2d6 MinStr=4 Weight=3 Category=R Range=12 AP=1',
  'Ruger':'Damage=2d4 MinStr=4 Weight=2 Category=R Range=10',
  'H&K MP5':'Damage=2d6 MinStr=6 Weight=10 Category=R Range=12 AP=1 ROF=3',
  'Tommy Gun':'Damage=2d6+1 MinStr=6 Weight=13 Category=R Range=12 AP=1 ROF=3',
  'Uzi':'Damage=2d6 MinStr=4 Weight=9 Category=R Range=12 AP=1 ROF=3',
  'Double-Barrel Shotgun':'Damage=3d6 MinStr=6 Weight=11 Category=R Range=12',
  'Pump Action Shotgun':'Damage=3d6 MinStr=4 Weight=8 Category=R Range=12',
  'Sawed-Off Shotgun':'Damage=3d6 MinStr=4 Weight=6 Category=R Range=5',
  'Streetsweeper':'Damage=3d6 MinStr=6 Weight=10 Category=R Range=12',
  'Barrett Rifle':'Damage=2d10 MinStr=8 Weight=35 Category=R Range=50 AP=4',
  'M1 Garand':'Damage=2d8 MinStr=6 Weight=10 Category=R Range=24 AP=2',
  'Hunting Rifle':'Damage=2d8 MinStr=6 Weight=8 Category=R Range=24 AP=2',
  'Sharps Big 50':'Damage=2d10 MinStr=8 Weight=11 Category=R Range=30 AP=2',
  'Spencer Carbine':'Damage=2d8 MinStr=4 Weight=8 Category=R Range=20 AP=2',
  "Wincester '73":'Damage=2d8-1 MinStr=6 Weight=10 Category=R Range=24 AP=2',
  'AK47':'Damage=2d8+1 MinStr=6 Weight=10 Category=R Range=24 AP=2 ROF=3',
  'M-16':'Damage=2d8 MinStr=6 Weight=8 Category=R Range=24 AP=2 ROF=3',
  'Steyr AUG':'Damage=2d8 MinStr=6 Weight=8 Category=R Range=24 AP=2 ROF=3',
  'Browning Automatic Rifle':
    'Damage=2d8 MinStr=8 Weight=17 Category=R Range=20 AP=2 ROF=3',
  'Gatling Gun':'Damage=2d8 MinStr=0 Weight=170 Category=R Range=24 AP=2 ROF=3',
  'Minigun':'Damage=2d8+1 MinStr=10 Weight=85 Category=R Range=30 AP=2 ROF=5',
  'M2 Browning':'Damage=2d10 MinStr=0 Weight=84 Category=R Range=50 AP=4 ROF=3',
  'M60':'Damage=2d8+1 MinStr=8 Weight=33 Category=R Range=30 AP=2 ROF=3',
  'MG42':'Damage=2d8+1 MinStr=10 Weight=26 Category=R Range=30 AP=2 ROF=4',
  'SAW':'Damage=2d8 MinStr=8 Weight=20 Category=R Range=30 AP=2 ROF=4',
  'Laser Pistol':'Damage=2d6 MinStr=4 Weight=2 Category=R Range=15 AP=2',
  'Laser SMG':'Damage=2d6 MinStr=4 Weight=4 Category=R Range=15 AP=2 ROF=4',
  'Laser Rifle':'Damage=2d6 MinStr=6 Weight=8 Category=R Range=30 AP=2 ROF=3',
  'Gatling Laser':
    'Damage=3d6+4 MinStr=8 Weight=20 Category=R Range=50 AP=2 ROF=4'
 
};

/* Defines the rules related to character abilities. */
SWADE.attributeRules = function(rules) {

  for(var a in SWADE.ATTRIBUTES) {
    rules.defineRule(a + 'Level', a + 'Allocation', '=', null);
    rules.defineRule(a, a + 'Level', '=', 'Math.min(4 + source * 2, 12)');
    rules.defineRule(a + 'Modifier', a + 'Level', '=', 'Math.max(source-3, 0)');
    rules.defineChoice('notes', a + ':d%V%1');
    rules.defineRule(a + '.1',
      a + 'Modifier', '=', 'source==0 ? "" : QuilvynUtils.signed(source)'
    );
    rules.defineChoice
      ('attributes', a.charAt(0).toUpperCase() + a.substring(1));
    rules.defineChoice('traits', a.charAt(0).toUpperCase() + a.substring(1));
  }
  rules.defineRule('advances', '', '^=', '0');
  rules.defineRule('improvementPoints', 'advances', '=', 'source * 2');
  rules.defineRule('attributePoints',
    '', '=', '5',
    'improvementAllocation.ability', '+', 'Math.floor(source / 2)'
  );
  rules.defineRule
    ('abilityNotes.attributePoints', 'attributePoints', '=', null);
  rules.defineRule('pace', '', '=', '6');
  rules.defineRule('rank',
    'advances', '=', 'source<4 ? "Novice" : source<8 ? "Seasoned" : source<12 ? "Veteran" : source<16 ? "Heroic" : "Legendary"'
  );
  rules.defineRule('run', '', '=', '6');
  rules.defineRule('size', '', '=', '0');
  QuilvynRules.validAllocationRules
    (rules, 'attributePoints', 'attributePoints', 'Sum "^(agility|smarts|spirit|strength|vigor)Allocation$"');
  QuilvynRules.validAllocationRules
    (rules, 'improvements', 'improvementPoints', 'Sum "^improvementAllocation.(ability|edge|skill|hindrance)$"');

};

/* Defines the rules related to combat. */
SWADE.combatRules = function(rules, armors, shields, weapons) {

  QuilvynUtils.checkAttrTable(armors, ['Armor', 'MinStr', 'Weight']);
  QuilvynUtils.checkAttrTable(shields, ['Parry', 'Cover', 'MinStr', 'Weight']);
  QuilvynUtils.checkAttrTable
    (weapons, ['Damage', 'MinStr', 'Weight', 'Category', 'Range', 'AP', 'ROF']);

  for(var armor in armors) {
    rules.choiceRules(rules, 'Armor', armor, armors[armor]);
  }
  for(var shield in shields) {
    rules.choiceRules(rules, 'Shield', shield, shields[shield]);
  }
  for(var weapon in weapons) {
    var pattern = weapon.replace(/  */g, '\\s+');
    var prefix =
      weapon.charAt(0).toLowerCase() + weapon.substring(1).replaceAll(' ', '');
    rules.choiceRules(rules, 'Goody', weapon,
      // To avoid triggering additional weapons with a common suffix (e.g.,
      // "* punching dagger +2" also makes regular dagger +2), require that
      // weapon goodies with a trailing value have no preceding word or be
      // enclosed in parentheses.
      'Pattern="([-+]\\d)\\s+' + pattern + '|(?:^\\W*|\\()' + pattern + '\\s+([-+]\\d)" ' +
      'Effect=add ' +
      'Attribute=' + prefix + 'AttackModifier,' + prefix + 'DamageModifier ' +
      'Value="$1 || $2" ' +
      'Section=combat Note="%V Attack and damage"'
    );
    rules.choiceRules(rules, 'Goody', weapon + ' Proficiency',
      'Pattern="' + pattern + '\\s+proficiency" ' +
      'Effect=set ' +
      'Attribute="weaponProficiency.' + weapon + '" ' +
      'Section=combat Note="Proficiency in ' + weapon + '"'
    );
    rules.choiceRules(rules, 'Weapon', weapon, weapons[weapon]);
  }

  rules.defineRule('combatNotes.fightingParryModifier',
    'skillModifier.Fighting', '=', 'source / 2'
  );
  rules.defineRule('combatNotes.sizeToughnessModifier', 'size', '=', null);
  rules.defineRule
    ('combatNotes.vigorToughnessModifier', 'vigor', '=', 'source / 2');
  rules.defineRule('cover', 'shieldCover', '=', null);
  rules.defineRule('initiative', 'dexterityModifier', '=', null);
  rules.defineRule('parry',
    '', '=', '2',
    'shieldParry', '+', null,
    'combatNotes.fightingParryModifier', '+', null
  );
  rules.defineRule('toughness',
    '', '=', '2',
    'armorToughness', '+', null,
    'combatNotes.vigorToughnessModifier', '+', null,
    'combatNotes.sizeToughnessModifier', '+', null
  );
  rules.defineRule('weapons.Unarmed', '', '=', '1');

};

/* Defines rules related to basic character identity. */
SWADE.identityRules = function(rules, races) {

  QuilvynUtils.checkAttrTable(races, ['Features']);

  for(var race in races) {
    rules.choiceRules(rules, 'Race', race, races[race]);
  }

};

/* Defines rules related to powers. */
SWADE.magicRules = function(rules, powers) {
  QuilvynUtils.checkAttrTable
    (powers, ['Advances', 'PowerPoints', 'Description']);
  for(var power in powers) {
    rules.choiceRules(rules, 'Power', power, powers[power]);
  }
  rules.defineRule('hasArcaneBackground',
    'features.Arcane Background (Gifted)', '=', '1',
    'features.Arcane Background (Magic)', '=', '1',
    'features.Arcane Background (Miracles)', '=', '1',
    'features.Arcane Background (Psionics)', '=', '1',
    'features.Arcane Background (Weird Science)', '=', '1'
  );
  rules.defineRule('arcaneSkill',
    'arcaneSkillGifted', '=', null,
    'arcaneSkillMagic', '=', null,
    'arcaneSkillMiracles', '=', null,
    'arcaneSkillPsionics', '=', null,
    'arcaneSkillWeirdScience', '=', null
  );
  rules.defineRule('arcaneSkillGifted',
    'features.Arcane Background (Gifted)', '?', null,
    'skills.Focus', '=', null
  );
  rules.defineRule('arcaneSkillMagic',
    'features.Arcane Background (Magic)', '?', null,
    'skills.Spellcasting', '=', null
  );
  rules.defineRule('arcaneSkillMiracles',
    'features.Arcane Background (Miracles)', '?', null,
    'skills.Faith', '=', null
  );
  rules.defineRule('arcaneSkillPsionics',
    'features.Arcane Background (Psionics)', '?', null,
    'skills.Psionics', '=', null
  );
  rules.defineRule('arcaneSkillWeirdScience',
    'features.Arcane Background (Weird Science)', '?', null,
    'skills.Weird Science', '=', null
  );
};

/* Defines rules related to character aptitudes. */
SWADE.talentRules = function(
  rules, edges, features, goodies, hindrances, skills
) {

  var c;
  var matchInfo;

  QuilvynUtils.checkAttrTable(edges, ['Require', 'Imply', 'Type']);
  QuilvynUtils.checkAttrTable(features, ['Section', 'Note']);
  QuilvynUtils.checkAttrTable(hindrances, ['Level']);
  QuilvynUtils.checkAttrTable(skills, ['Attribute', 'Core']);

  for(var goody in goodies) {
    rules.choiceRules(rules, 'Goody', goody, goodies[goody]);
  }
  for(var hindrance in hindrances) {
    rules.choiceRules(rules, 'Hindrance', hindrance, hindrances[hindrance]);
  }
  for(var skill in skills) {
    rules.choiceRules(rules, 'Skill', skill, skills[skill]);
    rules.choiceRules(rules, 'Goody', skill,
      'Pattern="([-+]\\d).*\\s+' + skill + '\\s+Skill|' + skill + '\\s+skill\\s+([-+]\\d)"' +
      'Effect=add ' +
      'Value="$1 || $2" ' +
      'Attribute="skills.' + skill + '" ' +
      'Section=skill Note="%V ' + skill + '"'
    );
    rules.defineChoice('traits', skill);
  }
  for(var edge in edges) {
    if((matchInfo = edge.match(/(%(\w+))/)) != null) {
      for(c in rules.getChoices(matchInfo[2] + 's')) {
        rules.choiceRules
          (rules, 'Edge', edge.replace(matchInfo[1], c), edges[edge].replaceAll(matchInfo[1], c));
      }
    } else {
      rules.choiceRules(rules, 'Edge', edge, edges[edge]);
    }
  }
  for(var feature in features) {
    if((matchInfo = feature.match(/(%(\w+))/)) != null) {
      for(c in rules.getChoices(matchInfo[2] + 's')) {
        rules.choiceRules
          (rules, 'Feature', feature.replace(matchInfo[1], c), features[feature].replaceAll(matchInfo[1], c));
      }
    } else {
      rules.choiceRules(rules, 'Feature', feature, features[feature]);
    }
  }

  rules.defineRule('edgePoints',
    '', '=', '1',
    'improvementAllocation.edge', '+', 'Math.floor(source / 2)'
  );
  rules.defineRule('skillPoints',
    '', '=', '12',
    'improvementAllocation.skill', '+', 'source'
  );
  rules.defineRule('skillNotes.skillPoints', 'skillPoints', '=', null);
  QuilvynRules.validAllocationRules
    (rules, 'edgePoints', 'edgePoints', 'Sum "^edges\\."');
  QuilvynRules.validAllocationRules
    (rules, 'skillPoints', 'skillPoints', 'Sum "^skillAllocation\\."');

};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
SWADE.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Armor')
    SWADE.armorRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Armor'),
      QuilvynUtils.getAttrValue(attrs, 'MinStr'),
      QuilvynUtils.getAttrValue(attrs, 'Weight')
    );
  else if(type == 'Edge') {
    SWADE.edgeRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValueArray(attrs, 'Type')
    );
    SWADE.edgeRulesExtra(rules, name);
  } else if(type == 'Feature')
    SWADE.featureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Goody')
    SWADE.goodyRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Pattern'),
      QuilvynUtils.getAttrValue(attrs, 'Effect'),
      QuilvynUtils.getAttrValue(attrs, 'Value'),
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Hindrance')
    SWADE.hindranceRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Level'),
    );
  else if(type == 'Race') {
    SWADE.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages')
    );
    SWADE.raceRulesExtra(rules, name);
  } else if(type == 'Shield')
    SWADE.shieldRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Parry'),
      QuilvynUtils.getAttrValue(attrs, 'Cover'),
      QuilvynUtils.getAttrValue(attrs, 'MinStr'),
      QuilvynUtils.getAttrValue(attrs, 'Weight')
    );
  else if(type == 'Skill')
    SWADE.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Attribute'),
      QuilvynUtils.getAttrValue(attrs, 'Core')
    );
  else if(type == 'Power')
    SWADE.powerRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Advances'),
      QuilvynUtils.getAttrValue(attrs, 'PowerPoints'),
      QuilvynUtils.getAttrValue(attrs, 'Description')
    );
  else if(type == 'Weapon')
    SWADE.weaponRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Damage'),
      QuilvynUtils.getAttrValue(attrs, 'MinStr'),
      QuilvynUtils.getAttrValue(attrs, 'Weight'),
      QuilvynUtils.getAttrValue(attrs, 'Category'),
      QuilvynUtils.getAttrValue(attrs, 'Range'),
      QuilvynUtils.getAttrValue(attrs, 'AP'),
      QuilvynUtils.getAttrValue(attrs, 'ROF')
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
 * Defines in #rules# the rules associated with armor #name#, which adds
 * #armor# to the character's Toughness, requires a strength of #minStr# to
 * use effectively, and weighs #weight#.
 */
SWADE.armorRules = function(rules, name, armor, minStr, weight) {

  if(!name) {
    console.log('Empty armor name');
    return;
  }
  if(typeof armor != 'number') {
    console.log('Bad armor "' + armor + '" for armor ' + name);
    return;
  }
  if(typeof minStr != 'number') {
    console.log('Bad min str "' + minStr + '" for armor ' + name);
    return;
  }
  if(typeof weight != 'number') {
    console.log('Bad weight "' + weight + '" for armor ' + name);
    return;
  }

  if(rules.armorStats == null) {
    rules.armorStats = {
      armor:{},
      minStr:{},
      weight:{}
    };
  }
  rules.armorStats.armor[name] = armor;
  rules.armorStats.minStr[name] = minStr;
  rules.armorStats.weight[name] = weight;

  rules.defineRule('armorToughness',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.armor) + '[source]'
  );
  rules.defineRule('armorMinStr',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.minStr) + '[source]'
  );
  rules.defineRule('armorWeight',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.weight) + '[source]'
  );

};

/*
 * Defines in #rules# the rules associated with edge #name#. #require# and
 * #implies# list any hard and soft prerequisites for the edge, and #types#
 * lists the categories of the edge.
 */
SWADE.edgeRules = function(rules, name, requires, implies, types) {

  if(!name) {
    console.log('Empty edge name');
    return;
  }
  if(!Array.isArray(requires)) {
    console.log('Bad requires list "' + requires + '" for edge ' + name);
    return;
  }
  if(!Array.isArray(implies)) {
    console.log('Bad implies list "' + implies + '" for edge ' + name);
    return;
  }
  if(!Array.isArray(types)) {
    console.log('Bad types list "' + types + '" for edge ' + name);
    return;
  }

  var prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');

  if(requires.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'validation', prefix + 'Edge', 'edges.' + name, requires);
  if(implies.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'sanity', prefix + 'Edge', 'edges.' + name, implies);
  rules.defineRule('features.' + name, 'edges.' + name, '=', null);
  for(var i = 0; i < types.length; i++) {
    if(types[i] != 'General')
      rules.defineRule('sum' + types[i] + 'Edges', 'edges.' + name, '+=', null);
  }

};

/*
 * Defines in #rules# the rules associated with edge #name# that cannot be
 * derived directly from the attributes passed to edgeRules.
 */
SWADE.edgeRulesExtra = function(rules, name) {
  // TODO
  var matchInfo;
  var note;
  if(name == 'Arcane Resistance') {
    rules.defineRule('saveNotes.arcaneResistance',
      '', '=', '-2',
      'saveNotes.improvedArcaneResistance', '+', '-2'
    );
  } else if(name == 'Attractive') {
    rules.defineRule('skillNotes.attractive',
      '', '=', '1',
      'skillNotes.veryAttractive', '+', '1'
    );
  } else if(name == 'Block') {
    rules.defineRule('combatNotes.block',
      '', '=', '1',
      'combatNotes.improvedBlock', '+', '1'
    );
  } else if(name == 'Brawler') {
    rules.defineRule('combatNotes.brawler',
      '', '=', '1',
      'combatNotes.bruiser', '+', '1'
    );
    rules.defineRule('combatNotes.brawler.1',
      '', '=', '4',
      'combatNotes.bruiser', '+', '2'
    );
    rules.defineRule('combatNotes.brawler.2',
      '', '=', '1',
      'combatNotes.bruiser', '+', '1'
    );
  } else if(name == 'Command') {
    rules.defineRule('featureNotes.command',
      '', '=', '10',
      'featureNotes.commandPresence', '+', '10'
    );
  } else if(name == 'Counterattack') {
    rules.defineRule('combatNotes.counterattack',
      '', '=', '1',
      'combatNotes.improvedCounterattack', '+', '1'
    );
  } else if(name == 'Extraction') {
    rules.defineRule('combatNotes.extraction',
      '', '=', '1',
      'combatNotes.improvedExtraction', '+', '2'
    );
  } else if(name == 'Fame') {
    rules.defineRule('featureNotes.fame',
      '', '=', '2',
      'featureNotes.famous', '+', '3'
    );
    rules.defineRule('skillNotes.fame',
      '', '=', '1',
      'featureNotes.famous', '+', '1'
    );
  } else if(name == 'First Strike') {
    rules.defineRule('combatNotes.firstStrike',
      '', '=', '1',
      'combatNotes.improvedFirstStrike', '+', '2'
    );
  } else if(name == 'Frenzy') {
    rules.defineRule('combatNotes.frenzy',
      '', '=', '1',
      'combatNotes.improvedFrenzy', '+', '1'
    );
  } else if(name == 'Level Headed') {
    rules.defineRule('combatNotes.levelHeaded',
      '', '=', '2',
      'combatNotes.improvedLevelHeaded', '+', '1'
    );
  } else if(name == 'Luck') {
    rules.defineRule('featureNotes.luck',
      '', '=', '1',
      'featureNotes.greatLuck', '+', '1'
    );
  } else if(name == 'Martial Artist') {
    rules.defineRule('combatNotes.martialArtist',
      '', '=', '1',
      'combatNotes.martialWarrior', '+', '1'
    );
    rules.defineRule
      ('attackBonus.Unarmed', 'combatNotes.martialArtist', '+', null);
    rules.defineRule
      ('weapons.Unarmed.2', 'combatNotes.martialArtist', '=', '"d4"');
  } else if(name == 'Nerves Of Steel') {
    rules.defineRule('combatNotes.nervesOfSteel',
      '', '=', '1',
      'combatNotes.improvedNervesOfSteel', '+', '1'
    );
  } else if((matchInfo = name.match(/^Professional \(([\w\s]*)\)$/)) != null) {
    var focus = matchInfo[1];
    note = (focus.toLowerCase() in SWADE.ATTRIBUTES ? 'ability' : 'skill') +
           'notes.professional(' + matchInfo[1].replaceAll(' ', '') + ')';
    rules.defineRule(note,
      '', '=', '1',
      note.replace('professional', 'expert'), '+', '1'
    );
  } else if(name == 'Rapid Fire') {
    rules.defineRule('combatNotes.rapidFire',
      '', '=', '1',
      'combatNotes.improvedRapidFire', '+', '1'
    );
  } else if(name == 'Rapid Recharge') {
    rules.defineRule('magicNotes.rapidRecharge',
      '', '=', '10',
      'magicNotes.improvedRapidRecharge', '+', '10'
    );
  } else if(name == 'Rich') {
    rules.defineRule('featureNotes.rich',
      '', '=', '3',
      'featureNotes.filthyRich', '^', '5'
    );
  } else if(name == 'Sweep') {
    rules.defineRule('combatNotes.sweep',
      '', '=', '-2',
      'combatNotes.improvedSweep', '^', '0'
    );
  } else if(name == 'Tactician') {
    rules.defineRule('combatNotes.tactician',
      '', '=', '1',
      'combatNotes.masterTactician', '+', '1'
    );
  } else if(name == 'Tough As Nails') {
    rules.defineRule('combatNotes.toughAsNails',
      '', '=', '4',
      'combatNotes.tougherThanNails', '+', '1'
    );
  } else if(name.startsWith('Trademark Weapon')) {
    note = 'combatNotes.trademarkWeapon' +
           name.replace('Trademark Weapon ', '').replaceAll(' ', '');
    rules.defineRule(note,
      '', '=', '1',
      note.replace('trademark', 'improvedTrademark'), '+', '1'
    );
  } else if(name == 'Weapon Master') {
    rules.defineRule('combatNotes.weaponMaster',
      '', '=', '1',
      'combatNotes.masterOfArms', '+', '1'
    );
    rules.defineRule('combatNotes.weaponMaster.1',
      '', '=', '8',
      'combatNotes.masterOfArms', '=', '10'
    );
  } else if(name == 'Work The Room') {
    rules.defineRule('skillNotes.workTheRoom',
      '', '=', '1',
      'skillNotes.workTheCrowd', '+', '1'
    );
  }
};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
SWADE.featureRules = function(rules, name, sections, notes) {

  if(!name) {
    console.log('Empty feature name');
    return;
  }
  if(!Array.isArray(sections) || sections.length == 0) {
    console.log('Bad sections list "' + sections + '" for feature ' + name);
    return;
  }
  if(!Array.isArray(notes)) {
    console.log('Bad notes list "' + notes + '" for feature ' + name);
    return;
  }
  if(sections.length != notes.length) {
    console.log(sections.length + ' sections, ' + notes.length + ' notes for feature ' + name);
    return;
  }

  var prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');

  for(var i = 0; i < sections.length; i++) {

    var section = sections[i];
    var effects = notes[i];
    var matchInfo;
    var note = section + 'Notes.' + prefix;

    rules.defineChoice('notes', note + ':' + effects);
    rules.defineRule
      (note, 'features.' + name, effects.indexOf('%V') >= 0 ? '?' : '=', null);

    var pieces = effects.split('/');

    for(var j = 0; j < pieces.length; j++) {

      matchInfo = pieces[j].match(/^([-+x](\d+(\.\d+)?|%[V1-9]))\s+(.*)$/);
      if(!matchInfo)
        continue;

      var adjust = matchInfo[1];
      var adjusted = matchInfo[4];
      var adjustor =
        adjust.match(/%\d/) ? note + '.' + adjust.replace(/.*%/, '') : note;
      var op = adjust.startsWith('x') ? '*' : '+';
      if(op == '*')
        adjust = adjust.substring(1);

      if(section == 'save' && adjusted.match(/^[A-Z]\w*$/)) {
        adjusted = 'save.' + adjusted;
      } else if(section == 'skill' &&
                adjusted.match(/^[A-Z][a-z]*(\s[A-Z][a-z]*)*(\s\([A-Z][a-z]*(\s[A-Z][a-z]*)*\))?$/)) {
        adjusted = 'skillModifier.' + adjusted;
      } else if(adjusted.match(/^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/)) {
        adjusted = adjusted.charAt(0).toLowerCase() + adjusted.substring(1).replaceAll(' ', '');
      } else if(adjusted.match(/^[A-Z]\w+ die$/)) {
        adjusted = adjusted.replace(' die', '');
        if(section == 'ability')
          adjusted += 'Level'
        else if(sections == 'skill')
          adjusted = 'skillLevel.' + adjusted;
        else
          adjusted = adjusted.charAt(0).toLowerCase() + adjusted.substring(1);
      } else {
        continue;
      }
      rules.defineRule(adjusted,
        adjustor, op, !adjust.includes('%') ? adjust : adjust.startsWith('-') ? '-source' : 'source'
      );

    }

  }

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
 * ("attribute", "combat", "companion", "feature", "power", "save", or "skill")
 * and formats that show the effects of the goody on the character sheet.
 */
SWADE.goodyRules = function(
  rules, name, pattern, effect, value, attributes, sections, notes
) {
  QuilvynRules.goodyRules
    (rules, name, pattern, effect, value, attributes, sections, notes);
};

/*
 * TODO
 */
SWADE.hindranceRules = function(rules, name, level) {
  // TODO
  rules.defineRule('features.' + name, 'hindrances.' + name, '=', null);
  rules.defineRule('improvementPoints',
    'hindrances.' + name, '+', level=='Major' ? '2' : '1'
  );
};

/*
 * Defines in #rules# the rules associated with race #name#, which has the list
 * of hard prerequisites #requires#. #features# and #selectables# list
 * associated features and #languages# any automatic languages.
 */
SWADE.raceRules = function(
  rules, name, requires, features, selectables, languages
) {

  if(!name) {
    console.log('Empty race name');
    return;
  }
  if(!Array.isArray(requires)) {
    console.log('Bad requires list "' + requires + '" for race ' + name);
    return;
  }
  if(!Array.isArray(features)) {
    console.log('Bad features list "' + features + '" for race ' + name);
    return;
  }
  if(!Array.isArray(selectables)) {
    console.log('Bad selectables list "' + selectables + '" for race ' + name);
    return;
  }
  if(!Array.isArray(languages)) {
    console.log('Bad languages list "' + languages + '" for race ' + name);
    return;
  }

  var matchInfo;
  var prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  var raceLevel = prefix + 'Level';

  rules.defineRule(raceLevel,
    'race', '?', 'source == "' + name + '"',
    'advances', '=', 'source + 1'
  );

  if(requires.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'validation', prefix + 'Race', raceLevel, requires);

  SWADE.featureListRules(rules, features, name, raceLevel, false);
  SWADE.featureListRules(rules, selectables, name, raceLevel, true);
  rules.defineSheetElement(name + ' Features', 'Hindrances+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');

  if(languages.length > 0) {
    rules.defineRule('languageCount', raceLevel, '=', languages.length);
    for(var i = 0; i < languages.length; i++) {
      if(languages[i] != 'any')
        rules.defineRule('languages.' + languages[i], raceLevel, '=', '1');
    }
  }

};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
SWADE.raceRulesExtra = function(rules, name) {
  if(name == 'Half-Elf') {
    rules.defineRule('improvementPoints', 'featureNotes.heritage', '+', '2');
  }
};

/*
 * Defines in #rules# the rules associated with shield #name#, which adds #ac#
 * to the character's armor class.
 */
SWADE.shieldRules = function(rules, name, parry, cover, minStr, weight) {

  if(!name) {
    console.log('Empty shield name');
    return;
  }
  if(typeof parry != 'number') {
    console.log('Bad parry "' + parry + '" for shield ' + name);
    return;
  }
  if(typeof cover != 'number') {
    console.log('Bad cover "' + cover + '" for shield ' + name);
    return;
  }
  if(typeof minStr != 'number') {
    console.log('Bad minStr "' + minStr + '" for shield ' + name);
    return;
  }
  if(typeof weight != 'number') {
    console.log('Bad weight "' + weight + '" for shield ' + name);
    return;
  }

  if(rules.shieldStats == null) {
    rules.shieldStats = {
      parry:{},
      cover:{},
      minStr:{},
      weight:{}
    };
  }
  rules.shieldStats.parry[name] = parry;
  rules.shieldStats.cover[name] = cover;
  rules.shieldStats.minStr[name] = minStr;
  rules.shieldStats.weight[name] = weight;

  rules.defineRule('shieldCover',
    'shield', '=', QuilvynUtils.dictLit(rules.shieldStats.cover) + '[source]'
  );
  rules.defineRule('shieldParry',
    'shield', '=', QuilvynUtils.dictLit(rules.shieldStats.parry) + '[source]'
  );

};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * #attribute# (one of 'agility', 'spirit', etc.).
 */
SWADE.skillRules = function(rules, name, attribute, core) {

  if(!name) {
    console.log('Empty skill name');
    return;
  }
  if(attribute) {
    attribute = attribute.toLowerCase();
    if(!(attribute in SWADE.ATTRIBUTES)) {
      console.log('Bad attribute "' + attribute + '" for skill ' + name);
      return;
    }
  }

  rules.defineRule
    ('skillLevel.' + name, 'skillAllocation.' + name, '=', null);
  if(core && core != 'n' && core != 'N') {
    rules.defineRule('skillLevel.' + name, 'agility', '^=', '0');
  }
  rules.defineRule('skills.' + name,
    'skillLevel.' + name, '=', 'Math.min(4 + source * 2, 12)'
  );
  rules.defineRule('skillModifier.' + name,
    'skillLevel.' + name, '=', 'Math.max(source - 3, 0)'
  );
  rules.defineChoice('notes', 'skills.' + name + ':(' + attribute.substring(0, 3) + ') d%V%1');
  rules.defineRule('skills.' + name + '.1',
    'skillModifier.' + name, '=', 'source==0 ? "" : QuilvynUtils.signed(source)'
  );

};

/*
 * TODO
 */
SWADE.powerRules = function(rules, name, advances, powerPoints, description) {
  if(!name) {
    console.log('Empty power name');
    return;
  }
  if(typeof advances != 'number') {
    console.log('Bad advances "' + advances + '" for power ' + name);
  }
  if(typeof powerPoints != 'number') {
    console.log('Bad powerPoints "' + powerPoints + '" for power ' + name);
  }
  if(!description) {
    console.log('Empty description for power ' + name);
  }
  rules.defineChoice
    ('notes', 'spells.' + name + ': (' + powerPoints + ' PP)' + description);
  // TODO
};

/*
 * Defines in #rules# the rules associated with weapon #name#, which requires a
 * #category# proficiency level to use effectively and has weapon properties
 * #properties#. The weapon does #damage# HP on a successful attack. If
 * specified, the weapon can be used as a ranged weapon with a range increment
 * of #range# feet.
 */
SWADE.weaponRules = function(
  rules, name, damage, minStr, weight, category, range, armorPiercing,
  rateOfFire
) {

  if(!name) {
    console.log('Empty weapon name');
    return;
  }
  var matchInfo = (damage + '').match(/^(((\d*d)?\d+)([\-+]\d+)?)$/);
  if(!matchInfo) {
    console.log('Bad damage "' + damage + '" for weapon ' + name);
    return;
  }
  if(typeof minStr != 'number') {
    console.log('Bad minStr "' + minStr + '" for weapon ' + name);
  }
  if(range && typeof range != 'number') {
    console.log('Bad range "' + range + '" for weapon ' + name);
  }
  if(armorPiercing && typeof armorPiercing != 'number') {
    console.log('Bad AP "' + armorPiercing + '" for weapon ' + name);
  }
  if(rateOfFire && typeof rateOfFire != 'number') {
    console.log('Bad ROF "' + rateOfFire + '" for weapon ' + name);
  }

  var isRanged = category == 'R' || category == 'ranged';
  var is2h = category == '2h' || category == 'two-handed';

  var damage = matchInfo[1];
  var prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  var weaponName = 'weapons.' + name;
  var format = '%V (%1 %2%3%4' + (range ? " R%5'" : '') + ')';

  rules.defineRule('attackBonus.' + name,
    weaponName, '=', '0',
    isRanged ? 'attackBonus.Ranged' : 'attackBonus.Melee', '+', null,
    'weaponAttackAdjustment.' + name, '+', null
  );
  rules.defineRule('damageBonus.' + name,
    weaponName, '=', '0',
    'weaponDamageAdjustment.' + name, '+', null
  );
  rules.defineRule(prefix + 'DamageModifier', 'strength', '=', '0');

  rules.defineChoice('notes', weaponName + ':' + format);
  rules.defineRule(weaponName + '.1',
    'attackBonus.' + name, '=', 'source >= 0 ? "+" + source : source'
  );
  rules.defineRule(weaponName + '.2', weaponName, '=', '"' + damage + '"');
  rules.defineRule(weaponName + '.3', weaponName, '=', '""');
  if(!isRanged) {
    rules.defineRule(weaponName + '.3', 'strength', '=', '"+d" + source');
  }
  rules.defineRule(weaponName + '.4',
    prefix + 'DamageModifier', '=', 'source>0 ? "+" + source : source==0 ? "" : source'
  );
  if(range) {
    rules.defineRule('range.' + name,
      weaponName, '=', range,
      'weaponRangeAdjustment.' + name, '+', null
    );
    rules.defineRule(weaponName + '.5', 'range.' + name, '=', null);
  }

};

/*
 * Defines in #rules# the rules associated with with the list #features#. Rules
 * add each feature to #setName# if the value of #levelAttr# is at least equal
 * to the value required for the feature. If #selectable# is true, the user is
 * allowed to select these features for the character, rather than having them
 * assigned automatically.
 */
SWADE.featureListRules = function(
  rules, features, setName, levelAttr, selectable
) {
  QuilvynRules.featureListRules
    (rules, features, setName, levelAttr, selectable);
  setName = setName.charAt(0).toLowerCase() + setName.substring(1).replaceAll(' ', '') + 'Features';
  for(var i = 0; i < features.length; i++) {
    var feature = features[i].replace(/^(.*\?\s*)?\d+:/, '');
    var matchInfo = feature.match(/([A-Z]\w*)\sProficiency\s\((.*)\)$/);
    if(!matchInfo)
      continue;
    var group = matchInfo[1].toLowerCase();
    var elements = matchInfo[2].split('/');
    for(var j = 0; j < elements.length; j++) {
      matchInfo = elements[j].match(/^Choose\s+(\d+)\s+from/i);
      if(matchInfo) {
        rules.defineRule
          (group + 'ChoiceCount', setName + '.' + feature, '+=', matchInfo[1]);
      } else {
        rules.defineRule(group + 'Proficiency.' + elements[j],
          setName + '.' + feature, '=', '1'
        );
      }
    }
  }
};

/*
 * Returns the dictionary of attribute formats associated with character sheet
 * format #viewer# in #rules#.
 */
SWADE.getFormats = function(rules, viewer) {
  var format;
  var formats = rules.getChoices('notes');
  var result = {};
  var matchInfo;
  if(viewer == 'Collected Notes') {
    for(format in formats) {
      result[format] = formats[format];
      if((matchInfo = format.match(/Notes\.(.*)$/)) != null) {
        var feature = matchInfo[1];
        feature = feature.charAt(0).toUpperCase() + feature.substring(1).replace(/([A-Z(])/g, ' $1');
        formats['features.' + feature] = formats[format];
      }
    }
  } else if(viewer == 'Compact') {
    for(format in formats) {
      if(!format.startsWith('powers.'))
        result[format] = formats[format];
    }
  } else {
    result = formats;
  }
  return result;
};

/* Returns an ObjectViewer loaded with the default character sheet format. */
SWADE.createViewers = function(rules, viewers) {
  for(var i = 0; i < viewers.length; i++) {
    var name = viewers[i];
    var viewer = new ObjectViewer();
    if(name == 'Compact') {
      viewer.addElements(
        {name: '_top', separator: '\n'},
          {name: 'Section 1', within: '_top', separator: '; '},
            {name: 'Identity', within: 'Section 1', format: '%V',
             separator: ''},
              {name: 'Name', within: 'Identity', format: '<b>%V</b>'},
              {name: 'Gender', within: 'Identity', format: ' -- <b>%V</b>'},
              {name: 'Race', within: 'Identity', format: ' <b>%V</b>'},
            {name: 'Initiative', within: 'Section 1', format: '<b>Initiative</b> %V'},
            {name: 'Pace', within: 'Section 1', format: '<b>Pace</b> %V'},
            {name: 'Run', within: 'Section 1', format: '<b>Run</b> %V'},
            {name: 'Toughness', within: 'Section 1', format: '<b>Toughness</b> %V'},
            {name: 'Weapons', within: 'Section 1', format: '<b>%N</b> %V',
             separator: '/'},
            {name: 'Attributes', within: 'Section 1',
             format: '<b>Agi/Sma/Spi/Str/Vig</b> %V', separator: '/'},
              {name: 'Agility', within: 'Abilities', format: '%V'},
              {name: 'Smarts', within: 'Abilities', format: '%V'},
              {name: 'Spirit', within: 'Abilities', format: '%V'},
              {name: 'Strength', within: 'Abilities', format: '%V'},
              {name: 'Vigor', within: 'Abilities', format: '%V'},
          {name: 'Section 2', within: '_top', separator: '; '},
            {name: 'Skills', within: 'Section 2', separator: '/'},
            {name: 'Edges', within: 'Section 2', separator: '/'},
            {name: 'Hindrances', within: 'Section 2', separator: '/'},
            {name: 'Powers', within: 'Section 2', separator: '/'},
            {name: 'Notes', within: 'Section 2'},
            {name: 'Hidden Notes', within: 'Section 2', format: '%V'}
      );
    } else if(name == 'Collected Notes' || name == 'Standard') {
      var innerSep = null;
      var listSep = '; ';
      var noteSep = listSep;
      noteSep = '\n';
      var outerSep = name == '\n';
      viewer.addElements(
        {name: '_top', borders: 1, separator: '\n'},
        {name: 'Header', within: '_top'},
          {name: 'Identity', within: 'Header', separator: ''},
            {name: 'Name', within: 'Identity', format: '<b>%V</b>'},
            {name: 'Gender', within: 'Identity', format: ' -- <b>%V</b>'},
            {name: 'Race', within: 'Identity', format: ' <b>%V</b>'},
            {name: 'Rank', within: 'Identity', format: ' <b>%V Adventurer</b>'},
          {name: 'Image Url', within: 'Header', format: '<img src="%V"/>'},
        {name: 'Attributes', within: '_top', separator: outerSep},
          {name: 'Abilities', within: 'Attributes', separator: innerSep},
            {name: 'Agility', within: 'Abilities'},
            {name: 'Smarts', within: 'Abilities'},
            {name: 'Spirit', within: 'Abilities'},
            {name: 'Strength', within: 'Abilities'},
            {name: 'Vigor', within: 'Abilities'},
          {name: 'Description', within: 'Attributes', separator: innerSep},
            {name: 'Size', within: 'Description'},
            {name: 'Origin', within: 'Description'},
            {name: 'Player', within: 'Description'},
          {name: 'AbilityStats', within: 'Attributes', separator: innerSep},
            {name: 'Advances', within: 'AbilityStats'},
            {name: 'Improvement Points', within: 'AbilityStats'},
            {name: 'Improvement Allocation', within: 'AbilityStats', separator: listSep}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
          {name: 'Ability Notes', within: 'Attributes', separator: noteSep}
        );
      }
      viewer.addElements(
        {name: 'FeaturesAndSkills', within: '_top', separator: outerSep,
         format: '<b>Features/Skills</b><br/>%V'},
          {name: 'FeaturePart', within: 'FeaturesAndSkills', separator: innerSep},
            {name: 'EdgePart', within: 'FeaturePart', separator: ' '},
              {name: 'EdgeStats', within: 'EdgePart', separator: ''},
                {name: 'Edge Points', within: 'EdgeStats', format: '<b>Edges</b> (%V points):'},
              {name: 'Edges', within: 'EdgePart', format: '%V', separator: listSep},
            {name: 'Hindrances', within: 'FeaturePart', separator: listSep}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
            {name: 'Feature Notes', within: 'FeaturesAndSkills', separator: noteSep}
        );
      } else {
        viewer.addElements(
          {name: 'AllNotes', within: 'FeaturesAndSkills', separator: '\n', columns: "1L"},
            {name: 'Ability Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Feature Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Skill Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Combat Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Save Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Power Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"}
        );
      }
      viewer.addElements(
          {name: 'Skill Points', within: 'FeaturesAndSkills', format: '<b>Skills</b> (%V Points):'},
          {name: 'Skills', within: 'FeaturesAndSkills', format: '%V', columns: '3LE', separator: null},
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
            {name: 'Skill Notes', within: 'FeaturesAndSkills', separator:noteSep}
        );
      }
      viewer.addElements(
        {name: 'Combat', within: '_top', separator: outerSep,
         format: '<b>Combat</b><br/>%V'},
          {name: 'CombatPart', within: 'Combat', separator: '\n'},
            {name: 'CombatStats', within: 'CombatPart', separator: innerSep},
              {name: 'ToughnessInfo', within: 'CombatStats', separator: ''},
                {name: 'Toughness', within: 'ToughnessInfo'},
                {name: 'Armor Toughness', within: 'ToughnessInfo', format: ' (%V)'},
              {name: 'ParryInfo', within: 'CombatStats', separator: ''},
                {name: 'Parry', within: 'ParryInfo'},
                {name: 'Shield Parry', within: 'ParryInfo', format: ' (%V)'},
              {name: 'Cover', within: 'CombatStats'},
              {name: 'Speed', within: 'CombatStats', separator: ''},
                {name: 'Pace', within: 'Speed', format: '<b>Pace/Run</b>: %V'},
                {name: 'Run', within: 'Speed', format: '/+d%V'},
              {name: 'Attacks Per Round', within: 'CombatStats'},
            {name: 'CombatProfs', within: 'CombatPart', separator: innerSep},
              {name: 'Armor Proficiency', within: 'CombatProfs', separator: listSep},
              {name: 'Weapon Proficiency', within: 'CombatProfs', separator: listSep},
            {name: 'Gear', within: 'CombatPart', separator: innerSep},
              {name: 'Armor', within: 'Gear'},
              {name: 'Shield', within: 'Gear'},
              {name: 'Weapons', within: 'Gear', separator: listSep},
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
            {name: 'Combat Notes', within: 'CombatPart', separator: noteSep}
        );
      }
      viewer.addElements(
          {name: 'SavePart', within: 'Combat', separator: '\n'},
            {name: 'Save Proficiency', within: 'SavePart', separator: listSep},
            {name: 'Save', within: 'SavePart', separator: listSep}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
            {name: 'Save Notes', within: 'SavePart', separator: noteSep}
        );
      }
      viewer.addElements(
        {name: 'Power', within: '_top', separator: outerSep,
         format: '<b>Power</b><br/>%V'},
          {name: 'SpellPart', within: 'Power', separator: '\n'},
            {name: 'SpellStats', within: 'SpellPart', separator: innerSep},
              {name: 'Spells Known', within: 'SpellStats', separator: listSep},
              {name: 'Spell Slots', within: 'SpellStats', separator:listSep},
              {name: 'Spell Attack Modifier', within: 'SpellStats',
               format: '<b>Attack</b>: %V', separator: listSep},
              {name: 'Spell Difficulty Class', within: 'SpellStats',
               format: '<b>Spell DC</b>: %V', separator: listSep},
          {name: 'Spells', within: 'Power', columns: '1L', separator: null}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
          {name: 'Power Notes', within: 'Power', separator: noteSep}
        );
      }
      viewer.addElements(
        {name: 'Notes Area', within: '_top', separator: outerSep,
         format: '<b>Notes</b><br/>%V'},
          {name: 'NotesPart', within: 'Notes Area', separator: '\n'},
            {name: 'Notes', within: 'NotesPart', format: '%V'},
            {name: 'Hidden Notes', within: 'NotesPart', format: '%V'},
          {name: 'ValidationPart', within: 'Notes Area', separator: '\n'},
            {name: 'Sanity Notes', within: 'ValidationPart', separator:noteSep},
            {name: 'Validation Notes', within: 'ValidationPart',
             separator: noteSep}
      );
    } else
      continue;
    rules.defineViewer(name, viewer);
  }
};

/*
 * Returns the list of editing elements needed by #choiceRules# to add a #type#
 * item to #rules#.
 */
SWADE.choiceEditorElements = function(rules, type) {
  var result = [];
  var zeroToTen = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  if(type == 'Alignment')
    result.push(
      // empty
    );
  else if(type == 'Armor') {
    var zeroToFifty = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    var minusTenToZero = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0];
    var tenToEighteen = [10, 11, 12, 13, 14, 15, 16, 17, 18];
    result.push(
      ['AC', 'AC Bonus', 'select-one', [0, 1, 2, 3, 4, 5]],
      ['Bulky', 'Bulky', 'checkbox', ['']],
      ['Dex', 'Max Dex', 'select-one', zeroToTen],
      ['Str', 'Min Str', 'select-one', tenToEighteen],
      ['Weight', 'Weight', 'select-one', ['None', 'Light', 'Medium', 'Heavy']]
    );
  } else if(type == 'Background') {
    result.push(
      ['Equipment', 'Equipment', 'text', [40]],
      ['Features', 'Features', 'text', [40]],
      ['Languages', 'Languages', 'text', [40]]
    );
  } else if(type == 'Class') {
    result.push(
      ['Require', 'Prerequisites', 'text', [40]],
      ['HitDie', 'Hit Die', 'select-one', ['d4', 'd6', 'd8', 'd10', 'd12']],
      ['Features', 'Features', 'text', [40]],
      ['Selectables', 'Selectable Features', 'text', [40]],
      ['Languages', 'Languages', 'text', [30]],
      ['CasterLevelArcane', 'Arcane Level', 'text', [10]],
      ['CasterLevelDivine', 'Divine Level', 'text', [10]],
      ['SpellAbility', 'Spell Ability', 'select-one', ['charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom']],
      ['SpellSlots', 'Spells Slots', 'text', [40]],
      ['Spells', 'Spells', 'text', [40]]
    );
  } else if(type == 'Deity')
    result.push(
      ['Alignment', 'Alignment', 'select-one', QuilvynUtils.getKeys(rules.getChoices('alignments'))],
      ['Domain', 'Domains', 'text', [30]],
      ['Sphere', 'Sphere', 'text', [15]]
    );
  else if(type == 'Edge')
    result.push(
      ['Require', 'Prerequisites', 'text', [40]],
      ['Imply', 'Implies', 'text', [40]],
      ['Type', 'Types', 'text', [20]]
    );
  else if(type == 'Feature') {
    var sections =
      ['ability', 'combat', 'companion', 'feature', 'power', 'skill'];
    result.push(
      ['Section', 'Section', 'select-one', sections],
      ['Note', 'Note', 'text', [60]]
    );
  } else if(type == 'Goody') {
    var effects = ['add', 'lower', 'raise', 'set'];
    result.push(
      ['Pattern', 'Pattern', 'text', [40]],
      ['Effect', 'Effect', 'select-one', effects],
      ['Value', 'Value', 'text', [20]],
      ['Section', 'Section', 'select-one', sections],
      ['Note', 'Note', 'text', [60]]
    );
  } else if(type == 'Language')
    result.push(
      // empty
    );
  else if(type == 'Path')
    result.push(
      ['Group', 'Group', 'text', [15]],
      ['Level', 'Level', 'text', [15]],
      ['Features', 'Features', 'text', [40]],
      ['Selectables', 'Features', 'text', [40]],
      ['SpellAbility', 'Spell Ability', 'select-one', ['charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom']],
      ['SpellSlots', 'Spells Slots', 'text', [40]],
      ['Spells', 'Spells', 'text', [40]]
    );
  else if(type == 'Race')
    result.push(
      ['Require', 'Prerequisites', 'text', [40]],
      ['Features', 'Features', 'text', [60]],
      ['Selectables', 'Selectables', 'text', [60]],
      ['Languages', 'Languages', 'text', [30]],
      ['SpellAbility', 'Spell Ability', 'select-one', ['charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom']],
      ['SpellSlots', 'Spells Slots', 'text', [40]],
      ['Spells', 'Spells', 'text', [80]]
    );
  else if(type == 'School')
    result.push(
      ['Features', 'Features', 'text', [40]]
    );
  else if(type == 'Shield')
    result.push(
      ['AC', 'Armor Class', 'select-one', [1, 2, 3, 4, 5]]
    );
  else if(type == 'Skill')
    result.push(
      ['Ability', 'Ability', 'select-one', ['charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom']],
      ['Class', 'Class Skill', 'text', [30]]
    );
  else if(type == 'Spell') {
    var zeroToNine = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    result.push(
      ['School', 'School', 'select-one', QuilvynUtils.getKeys(rules.getChoices('schools'))],
      ['Group', 'Caster Group', 'text', [15]],
      ['Level', 'Level', 'select-one', zeroToNine],
      ['Description', 'Description', 'text', [60]]
    );
  } else if(type == 'Tool')
    result.push(
      ['Type', 'Type', 'text', [20]]
    );
  else if(type == 'Weapon') {
    var oneToFive = [1, 2, 3, 4, 5];
    var sixteenToTwenty = [16, 17, 18, 19, 20];
    var zeroToOneFifty =
     [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
    result.push(
      ['Category', 'Category', 'select-one', ['Simple', 'Martial']],
      ['Property', 'Property', 'select-one', ['Unarmed', 'Light', 'One-Handed', 'Two-Handed', 'Ranged']],
      ['Damage', 'Damage', 'select-one', QuilvynUtils.getKeys(SWADE.VERSATILE_WEAPON_DAMAGE)],
      ['Range', 'Range in Feet', 'select-one', zeroToOneFifty]
    );
  }
  return result;
};

/* Returns the elements in a basic 5E character editor. */
SWADE.initialEditorElements = function() {
  var allocations = [0, 1, 2, 3, 4, 5, 6];
  var improvementTypes = ['Ability', 'Edge', 'Hindrance', 'Skill'];
  var editorElements = [
    ['name', 'Name', 'text', [20]],
    ['race', 'Race', 'select-one', 'races'],
    ['imageUrl', 'Image URL', 'text', [20]],
    ['agilityAllocation', 'Agility', 'select-one', allocations],
    ['smartsAllocation', 'Smarts', 'select-one', allocations],
    ['spiritAllocation', 'Spirit', 'select-one', allocations],
    ['strengthAllocation', 'Strength', 'select-one', allocations],
    ['vigorAllocation', 'Vigor', 'select-one', allocations],
    ['player', 'Player', 'text', [20]],
    ['alignment', 'Alignment', 'select-one', 'alignments'],
    ['gender', 'Gender', 'text', [10]],
    ['deity', 'Deity', 'select-one', 'deities'],
    ['origin', 'Origin', 'text', [20]],
    ['advances', 'Advances', 'text', [4]],
    ['improvements', 'Improvement Allocation', 'bag', improvementTypes],
    ['edges', 'Edges', 'set', 'edges'],
    ['hindrances', 'Hindrances', 'set', 'hindrances'],
    ['skillAllocation', 'Skills', 'bag', 'skills'],
    ['languages', 'Languages', 'set', 'languages'],
    ['armor', 'Armor', 'select-one', 'armors'],
    ['shield', 'Shield', 'select-one', 'shields'],
    ['weapons', 'Weapons', 'bag', 'weapons'],
    ['powers', 'Powers', 'fset', 'powers'],
    ['notes', 'Notes', 'textarea', [40,10]],
    ['hiddenNotes', 'Hidden Notes', 'textarea', [40,10]]
  ];
  return editorElements;
};

/* Returns a random name for a character of race #race#. */
SWADE.randomName = function(race) {

  /* Return a random character from #string#. */
  function randomChar(string) {
    return string.charAt(QuilvynUtils.random(0, string.length - 1));
  }

  if(race == null)
    race = 'Human';
  else if(race.match(/Dragonborn/))
    race = 'Dragonborn';
  else if(race == 'Half-Elf')
    race = QuilvynUtils.random(0, 99) < 50 ? 'Elf' : 'Human';
  else if(race.match(/Dwarf/))
    race = 'Dwarf';
  else if(race.match(/Elf/))
    race = 'Elf';
  else if(race.match(/Gnome/))
    race = 'Gnome';
  else if(race.match(/Half-Folk/))
    race = 'Half-Folk';
  else if(race.match(/Orc/))
    race = 'Orc';
  else if(race.match(/Tiefling/))
    race = 'Tiefling';
  else
    race = 'Human';

  var clusters = {
    B:'lr', C:'hlr', D:'r', F:'lr', G:'lnr', K:'lnr', P:'lr', S:'chklt', T:'hr',
    W:'h',
    c:'hkt', l:'cfkmnptv', m: 'p', n:'cgkt', r: 'fv', s: 'kpt', t: 'h'
  };
  var consonants = {
    'Dragonborn':'bcdfghjklmnprstvwz', 'Dwarf':'dgkmnprst', 'Elf':'fhlmnpqswy',
    'Gnome':'bdghjlmnprstw', 'Half-Folk':'bdfghlmnprst',
    'Human': 'bcdfghjklmnprstvwz', 'Orc': 'dgjkprtvxz',
    'Tiefling': 'bcdfghjklmnprstvwz'
  }[race];
  var endConsonant = '';
  var leading = 'ghjqvwy';
  var vowels = {
    'Dragonborn':'aeiou', 'Dwarf':'aeiou', 'Elf':'aeioy', 'Gnome':'aeiou',
    'Half-Folk':'aeiou', 'Human':'aeiou', 'Orc':'aou', 'Tiefling':'aeiou'
  }[race];
  var diphthongs = {a:'wy', e:'aei', o: 'aiouy', u: 'ae'};
  var syllables = QuilvynUtils.random(0, 99);
  syllables = syllables < 50 ? 2 :
              syllables < 75 ? 3 :
              syllables < 90 ? 4 :
              syllables < 95 ? 5 :
              syllables < 99 ? 6 : 7;
  var result = '';
  var vowel;

  for(var i = 0; i < syllables; i++) {
    if(QuilvynUtils.random(0, 99) <= 80) {
      endConsonant = randomChar(consonants).toUpperCase();
      if(clusters[endConsonant] != null && QuilvynUtils.random(0, 99) < 15)
        endConsonant += randomChar(clusters[endConsonant]);
      result += endConsonant;
      if(endConsonant == 'Q')
        result += 'u';
    }
    else if(endConsonant.length == 1 && QuilvynUtils.random(0, 99) < 10) {
      result += endConsonant;
      endConsonant += endConsonant;
    }
    vowel = randomChar(vowels);
    if(endConsonant.length > 0 && diphthongs[vowel] != null &&
       QuilvynUtils.random(0, 99) < 15)
      vowel += randomChar(diphthongs[vowel]);
    result += vowel;
    endConsonant = '';
    if(QuilvynUtils.random(0, 99) <= 60) {
      while(leading.indexOf((endConsonant = randomChar(consonants))) >= 0)
        ; /* empty */
      if(clusters[endConsonant] != null && QuilvynUtils.random(0, 99) < 15)
        endConsonant += randomChar(clusters[endConsonant]);
      result += endConsonant;
    }
  }
  return result.substring(0, 1).toUpperCase() +
         result.substring(1).toLowerCase();

};

/* Sets #attributes#'s #attribute# attribute to a random value. */
SWADE.randomizeOneAttribute = function(attributes, attribute) {

  /*
   * Randomly selects #howMany# elements of the array #choices#, prepends
   * #prefix# to each, and sets those attributes in #attributes# to #value#.
   */
  function pickAttrs(attributes, prefix, choices, howMany, value) {
    var remaining = [].concat(choices);
    for(var i = 0; i < howMany && remaining.length > 0; i++) {
      var which = QuilvynUtils.random(0, remaining.length - 1);
      attributes[prefix + remaining[which]] = value;
      remaining = remaining.slice(0, which).concat(remaining.slice(which + 1));
    }
  }

  var attr;
  var attrs;
  var choices;
  var howMany;
  var i;
  var matchInfo;

  if(attribute == 'advances') {
    if(!attributes.advances) {
      howMany = QuilvynUtils.random(0, 9);
      attributes.advances = howMany<5 ? 0 : howMany<8 ? 1 : howMany<9 ? 2 : 3;
      if(QuilvynUtils.random(0, 9) >= 7)
        attributes.advances += 4;
    }
  } else if(attribute == 'attributes') {
    attrs = this.applyRules(attributes);
    for(attr in SWADE.ATTRIBUTES) {
      attributes[attr + 'Allocation'] = 0;
    }
    howMany = attrs.attributePoints;
    while(howMany > 0) {
      attr = QuilvynUtils.randomKey(SWADE.ATTRIBUTES);
      attributes[attr + 'Allocation']++;
      howMany--;
    }
  } else if(attribute == 'edges') {
    attrs = this.applyRules(attributes);
    howMany = attrs.edgePoints || 0;
    choices = {};
    var allEdges = this.getChoices('edges');
    for(attr in allEdges) {
      if(attrs['features.' + attr] == null)
        choices[attr] = '';
    }
    while(howMany > 0) {
      var pick;
      var picks = {};
      pickAttrs(picks, '', Object.keys(choices), howMany, 1);
      for(pick in picks) {
        attributes['edges.' + pick] = 1;
        delete choices[pick];
      }
      var validate = this.applyRules(attributes);
      for(pick in picks) {
        var name = pick.charAt(0).toLowerCase() +
                   pick.substring(1).replaceAll(' ', '').
                   replace(/\(/g, '\\(').replace(/\)/g, '\\)');
        if(QuilvynUtils.sumMatching
             (validate,
              new RegExp('^(sanity|validation)Notes.' + name)) != 0) {
          delete attributes['edges.' + pick];
        } else {
          howMany--;
        }
      }
    }
  } else if(attribute == 'gender') {
    attributes['gender'] = QuilvynUtils.random(0, 99) < 50 ? 'Female' : 'Male';
  } else if(attribute == 'hindrances') {
    attrs = this.applyRules(attributes);
    var allHindrances = this.getChoices('hindrances');
    howMany = 4;
    for(attr in attributes) {
      matchInfo = attr.match(/^hindrances\.(.*)$/);
      if(!matchInfo)
        continue;
      howMany -= allHindrances[matchInfo[1]].includes('Major') ? 2 : 1;
    }
    while(howMany > 0) {
      var type = howMany==1 || QuilvynUtils.random(0, 9)<8 ? 'Minor' : 'Major';
      choices = [];
      for(attr in allHindrances) {
        if(!('features.' + attr in attrs) && allHindrances[attr].includes(type))
          choices.push(attr);
      }
      attr = choices[QuilvynUtils.random(0, choices.length - 1)];
      attributes['hindrances.' + attr] = 1;
      howMany -= allHindrances[attr].includes('Major') ? 2 : 1;
    }
  } else if(attribute == 'improvements') {
    attrs = this.applyRules(attributes);
    howMany = (attrs['improvementPoints'] || 0) -
              (attrs['improvementAllocation.ability'] || 0) -
              (attrs['improvementAllocation.edge'] || 0) -
              (attrs['improvementAllocation.hindrance'] || 0) -
              (attrs['improvementAllocation.skill'] || 0);
    // Note: not allocating improvements to removing hindrances
    while(howMany > 0) {
      attr = howMany == 1 || QuilvynUtils.random(0, 2) == 0 ? 'skill' :
             QuilvynUtils.random(0, 1) == 0 ? 'edge' : 'ability';
      if(attributes['improvementAllocation.' + attr] == null)
        attributes['improvementAllocation.' + attr] = 0;
      var allocation = attr == 'skill' ? 1 : 2;
      attributes['improvementAllocation.' + attr] += allocation;
      howMany -= allocation;
    }
  } else if(attribute == 'name') {
    attributes['name'] = SWADE.randomName(attributes['race']);
  } else if(this.getChoices(attribute + 's') != null) {
    attributes[attribute] =
      QuilvynUtils.randomKey(this.getChoices(attribute + 's'));
  } else if(attribute == 'powers') {
    // TODO
  } else if(attribute == 'skills') {
    var allSkills = this.getChoices('skills');
    attrs = this.applyRules(attributes);
    howMany = attrs.skillPoints;
    for(attr in attrs) {
      if(attr.match(/^skillAllocation\./))
        howMany -= attributes[attr];
    }
    while(howMany > 0) {
      attr = QuilvynUtils.randomKey(allSkills);
      attr = 'skillAllocation.' + attr;
      if(attributes[attr] && attributes[attr] >= 4)
        continue;
      if(!attributes[attr])
        attributes[attr] = 0;
      attributes[attr]++;
      howMany--;
    }
  } else if(attribute == 'weapons') {
    attrs = this.applyRules(attributes);
    var allWeapons = this.getChoices('weapons');
    choices = [];
    howMany = 3;
    for(attr in attributes)
      if(attr.startsWith('weapons.'))
        howMany--;
    for(attr in allWeapons) {
      var minStr = QuilvynUtils.getAttrValue(allWeapons[attr], 'MinStr');
      if(!minStr || attrs.strength >= minStr)
        choices.push(attr);
    }
    pickAttrs(attributes, 'weapons.', choices, howMany, 1);
  }

};

/* Fixes as many validation errors in #attributes# as possible. */
SWADE.makeValid = function(attributes) {

  var attributesChanged = {};
  var debug = [];
  var notes = this.getChoices('notes');

  // If 8 passes don't get rid of all repairable problems, give up
  for(var pass = 0; pass < 8; pass++) {

    var applied = this.applyRules(attributes);
    var fixedThisPass = 0;

    // Try to fix each sanity/validation note w/a non-zero value
    for(var attr in applied) {

      var matchInfo =
        attr.match(/^(sanity|validation)Notes\.(.*)([A-Z][a-z]+)/);
      var attrValue = applied[attr];

      if(matchInfo == null || !attrValue || notes[attr] == null) {
        continue;
      }

      var problemSource = matchInfo[2];
      var problemCategory = matchInfo[3].substring(0, 1).toLowerCase() +
                            matchInfo[3].substring(1).replaceAll(' ', '');
      if(problemCategory == 'features') {
        problemCategory = 'selectableFeatures';
      }
      var requirements =
        notes[attr].replace(/^(Implies|Requires)\s/, '').split(/\s*\/\s*/);

      for(var i = 0; i < requirements.length; i++) {

        // Find a random requirement choice w/the format "name [op value]"
        var choices = requirements[i].split(/\s*\|\|\s*/);
        while(choices.length > 0) {
          var index = QuilvynUtils.random(0, choices.length - 1);
          matchInfo = choices[index].match(/^([^<>!=]+)(([<>!=~]+)(.*))?/);
          if(matchInfo != null) {
            break;
          }
          choices = choices.slice(0, index).concat(choice.slice(index + 1));
        }
        if(matchInfo == null) {
          continue;
        }

        var toFixCombiner = null;
        var toFixName = matchInfo[1].replace(/\s+$/, '');
        var toFixOp = matchInfo[3] == null ? '>=' : matchInfo[3];
        var toFixValue =
          matchInfo[4] == null ? 1 : matchInfo[4].replace(/^\s+/, '');;
        if(toFixName.match(/^(Max|Sum)/)) {
          toFixCombiner = toFixName.substring(0, 3);
          toFixName = toFixName.substring(4).replace(/^\s+/, '');
        }
        var toFixAttr = toFixName.substring(0, 1).toLowerCase() +
                        toFixName.substring(1).replaceAll(' ', '');

        // See if this attr has a set of choices (e.g., race) or a category
        // attribute (e.g., an edge)
        choices = this.getChoices(toFixAttr + 's');
        if(choices == null) {
           choices = this.getChoices(problemCategory);
        }
        if(choices != null) {
          // Find the set of choices that satisfy the requirement
          var target =
            this.getChoices(problemCategory) == null ? toFixValue : toFixName;
          var possibilities = [];
          for(var choice in choices) {
            if((toFixOp.match(/[^!]=/) && choice == target) ||
               (toFixOp == '!=' && choice != target) ||
               (toFixCombiner != null && choice.indexOf(target) == 0) ||
               (toFixOp == '=~' && choice.match(new RegExp(target))) ||
               (toFixOp == '!~' && !choice.match(new RegExp(target)))) {
              possibilities.push(choice);
            }
          }
          if(possibilities.length == 0) {
            continue; // No fix possible
          }
          if(target == toFixName) {
            toFixAttr =
              problemCategory + '.' +
              possibilities[QuilvynUtils.random(0, possibilities.length - 1)];
          } else {
            toFixValue =
              possibilities[QuilvynUtils.random(0, possibilities.length - 1)];
          }
        }
        if((choices != null || attributes[toFixAttr] != null) &&
           attributesChanged[toFixAttr] == null) {
          // Directly-fixable problem
          debug.push(
            attr + " '" + toFixAttr + "': '" + attributes[toFixAttr] +
            "' => '" + toFixValue + "'"
          );
          if(toFixValue == 0) {
            delete attributes[toFixAttr];
          } else {
            attributes[toFixAttr] = toFixValue;
          }
          attributesChanged[toFixAttr] = toFixValue;
          fixedThisPass++;
        } else if(problemCategory == 'total' && attrValue > 0 &&
                  (choices = this.getChoices(problemSource)) != null) {
          // Too many items allocated in a category
          var possibilities = [];
          for(var k in attributes) {
            if(k.match('^' + problemSource + '\\.') &&
               attributesChanged[k] == null) {
               possibilities.push(k);
            }
          }
          while(possibilities.length > 0 && attrValue > 0) {
            var index = QuilvynUtils.random(0, possibilities.length - 1);
            toFixAttr = possibilities[index];
            possibilities =
              possibilities.slice(0,index).concat(possibilities.slice(index+1));
            var current = attributes[toFixAttr];
            toFixValue = current > attrValue ? current - attrValue : 0;
            debug.push(
              attr + " '" + toFixAttr + "': '" + attributes[toFixAttr] +
              "' => '" + toFixValue + "'"
            );
            if(toFixValue == 0) {
              delete attributes[toFixAttr];
            } else {
              attributes[toFixAttr] = toFixValue;
            }
            attrValue -= current - toFixValue;
            // Don't do this: attributesChanged[toFixAttr] = toFixValue;
            fixedThisPass++;
          }
        } else if(problemCategory == 'total' && attrValue < 0 &&
                  (choices = this.getChoices(problemSource)) != null) {
          // Too few items allocated in a category
          this.randomizeOneAttribute(attributes,
            problemSource == 'selectableFeatures' ? 'features' : problemSource
          );
          debug.push(attr + ' Allocate additional ' + problemSource);
          fixedThisPass++;
        } else if(attr.match(/validationNotes.abilityModifier(Sum|Minimum)/)) {
          // Special cases
          var abilities = {
            'charisma':'', 'constitution':'', 'dexterity':'',
            'intelligence':'', 'strength':'', 'wisdom':''
          };
          if(attr == 'validationNotes.abilityModifierMinimum') {
            toFixAttr = QuilvynUtils.randomKey(abilities);
            toFixValue = 14;
            debug.push(
              attr + " '" + toFixAttr + "': '" + attributes[toFixAttr] +
              "' => '" + toFixValue + "'"
            );
            attributes[toFixAttr] = toFixValue;
            // Don't do this: attributesChanged[toFixAttr] = toFixValue;
            fixedThisPass++;
          } else {
            for(toFixAttr in abilities) {
              if(applied[toFixAttr + 'Modifier'] <= 0) {
                toFixValue = attributes[toFixAttr] + 2;
                debug.push(
                  attr + " '" + toFixAttr + "': '" + attributes[toFixAttr] +
                  "' => '" + toFixValue + "'"
                );
                attributes[toFixAttr] = toFixValue;
                // Don't do this: attributesChanged[toFixAttr] = toFixValue;
                fixedThisPass++;
              }
            }
          }
        }

      }

    }

    debug.push('-----');
    if(fixedThisPass == 0) {
      break;
    }

  }

  if(window.DEBUG)
    attributes.notes =
      (attributes.notes ? attributes.notes + '\n' : '') + debug.join('\n');

};

/* Returns HTML body content for user notes associated with this rule set. */
SWADE.ruleNotes = function() {
  return '' +
    '<h2>SWADE Quilvyn Module Notes</h2>\n' +
    'SWADE Quilvyn Module Version ' + SWADE.VERSION + '\n' +
    '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    The Expertise features of bards and rogues are renamed Bard\n' +
    '    Expertise and Rogue Expertise to distinguish the two.\n' +
    '  </li><li>\n' +
    '    To allow feats to be taken instead of Ability Score Improvements,\n' +
    '    the latter are presented as feats named Ability Boost, Ability\n' +
    '    Boost2, Ability Boost3, etc. In the editor, text boxes next to\n' +
    '    each of the six basic attributes are used to enter the number of\n' +
    '    improvements to each.\n' +
    '  </li><li>\n' +
    '    Quilvyn includes spells granted by individual warlock patrons in\n' +
    '    the warlock spell list.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Limitations</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Quilvyn does not generate background traits, ideals, bonds, flaws,\n' +
    '    or equipment. These items can be entered in the Notes section.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Known Bugs</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Quilvyn does not test multiclass ability prerequisites, and Quilvyn\n'+
    '    gives multiclass characters the complete set of proficiencies for\n' +
    '    each class.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n';
};
