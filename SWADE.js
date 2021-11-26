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
    'edges', 'edgePoints', 'hinderences', 'sanityNotes', 'validationNotes'
  );
  rules.defineChoice('preset',
    'race:Race,select-one,races', 'advances:Advances,text,4'
  );

  SWADE.attributeRules(rules);
  SWADE.combatRules(rules, SWADE.ARMORS, SWADE.SHIELDS, SWADE.WEAPONS);
  SWADE.magicrRules(rules, SWADE.POWERS);
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
SWADE.ARMORS = {
  // TODO
  'None':'AC=0 Dex=10 Weight=0',
  'Padded':'AC=1 Dex=10 Weight=1',
  'Leather':'AC=1 Dex=10 Weight=1',
  'Studded Leather':'AC=2 Dex=10 Weight=1',
  'Hide':'AC=2 Dex=2 Weight=2',
  'Chain Shirt':'AC=3 Dex=2 Weight=2',
  'Scale Mail':'AC=4 Dex=2 Weight=2',
  'Breastplate':'AC=4 Dex=2 Weight=2',
  'Half Plate':'AC=5 Dex=2 Weight=2',
  'Ring Mail':'AC=4 Dex=0 Weight=3',
  'Chain Mail':'AC=6 Dex=0 Str=13 Weight=3',
  'Splint':'AC=7 Dex=0 Str=15 Weight=3',
  'Plate':'AC=8 Dex=0 Str=15 Weight=3'
};
SWADE.EDGES = {
  'Alertness':'Type=background',
  'Ambidextrous':'Type=background Require="agility >= 8"',
  'Arcane Background':'Type=background',
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
  'Fame':'Type=background Require="advances >= 4","features.fame"',
  'Fast Healer':'Type=background Require="vigor >= 8"',
  'Fleet-Footed':'Type=background Require="agility >= 6"',
  'Linguist':'Type=background Require="smarts >= 6"',
  'Luck':'Type=background',
  'Great Luck':'Type=background Require="features.Luck"',
  'Quick':'Type=background Require="agility >= 8"',
  'Rich':'Type=background',
  'Filthy Rich':'Type=background Require="feature.Rich"',
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
  'Trademark Weapon (%weapon)':'Type=combat Require="skills.%weapon >= 8"',
  'Improved Trademark Weapon':'Type=combat Require="advances >= 4"',
  'Two-Fisted':'Type=combat Require="agility >= 8"',
  'Two-Gun Kid':'Type=combat Require="agility >= 8"',
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
  'Artificer':'Type=power Require="advances >= 4",isArcane',
  'Concentration':'Type=power Require="advances >= 4",isArcane',
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
  'New Powers':'Type=power Require=isArcane"',
  'Power Points':'Type=power Require=isArcane"',
  // TODO arcane skill d8+
  'Power Surge':'Type=power Require="isArcane"',
  'Rapid Recharge':
    'Type=power Require="advances >= 4","spirit >= 6",isArcane',
  'Improved Rapid Recharge':
    'Type=power Require="advances >= 8","features.Rapid Recharge"',
  // TODO arcane skill d10+
  'Soul Drain':'Type=power Require="advances >= 4",isArcane',
  'Wizard':
    'Type=power ' +
    'Require="advances >= 4","features.Arcane Background (Magic)","skills.Spellcasting >= 6"',
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
  'Scholar':'Type=professional Require="skills.Research >= 8"',
  'Soldier':'Type=professional Require="strength >= 6","vigor >= 6"',
  'Thief':
    'Type=professional ' +
    'Require="agility >= 8","skills.Stealth >= 6","skills.Thievery >= 6"',
  'Woodsman':'Type=professional Require="spirit >= 6","skills.Survival >= 8"',
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
  'Beast Bond':'Type=weird',
  'Beast Master':'Type=weird Require="spirit >= 8"',
  'Champion':'Type=weird Require="spirit >= 8","skills.Fighting >= 6"',
  'Chi':'Type=weird Require="advances >= 8","features.Martial Warrior"',
  'Danger Sense':'Type=weird',
  'Healer':'Type=weird Require="spirit >= 8"',
  'Liquid Courage':'Type=weird Require="vigor >= 8"',
  'Scavenger':'Type=weird Require="features.Luck"',
  'Followers':'Type=legendary Require="advances >= 16"',
  // TODO Maximum die type in selected trait
  'Professional':'Type=legendary Require="advances >= 16"',
  // TODO Professional in selected trait
  'Expert':'Type=legendary Require="advances >= 16"',
  // TODO Expert in selected trait
  'Master':'Type=legendary Require="advances >= 16"',
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
  'Ace':'Section=feature Note="TODO"',
  'Acrobat':'Section=feature Note="TODO"',
  'Alertness':'Section=skill Note="+2 Notice"',
  'Ambidextrous':
    'Section=combat Note="No off-hand penalty, parry bonuses stack"',
  'Arcane Background':'Section=feature Note="TODO"',
  'Arcane Resistance':
    'Section=save Note="-2 others\' targeted arcane skill, -2 magical damage"',
  'Aristocrat':
    'Section=feature ' +
    'Note="+2 Persuasion (networking with aristocrats)/+2 Common Knowledge (etiquette, heraldry, gossip)"',
  'Artificer':'Section=feature Note="TODO"',
  'Assassin':'Section=feature Note="TODO"',
  'Attractive':
    'Section=skill ' +
    'Note="+%V Performance (attracted target)/+%V Persuasion (attracted target)"',
  'Beast Bond':'Section=feature Note="TODO"',
  'Beast Master':'Section=feature Note="TODO"',
  'Berserk':
    'Section=combat ' +
    'Note="After injury, rage causes +1 strength die, wild attacks, +2 Toughness, and critical failure hits randomly for 10 rd (Sma neg)"',
  'Block':'Section=combat Note="+%V Parry/-%V foe Gang Up bonus"',
  'Bolster':'Section=feature Note="TODO"',
  'Brave':'Section=save Note="+2 fear checks, -2 fear roll"',
  'Brawler':
    'Section=combat ' +
    'Note="+%V Toughness/+d%1 damage or +%2 damage die w/fists or natural weapons"',
  'Brawny':'Section=feature Note="TODO"',
  'Bruiser':'Section=combat Note="Increased Brawler effects"',
  'Brute':'Section=feature Note="TODO"',
  'Calculating':
    'Section=combat ' +
    'Note="Ignore 2 points of penalties on 1 action when Action Card is 5 or less"',
  'Champion':'Section=feature Note="TODO"',
  'Charismatic':'Section=skill Note="Reroll Persuasion"',
  'Chi':'Section=feature Note="TODO"',
  'Combat Acrobat':'Section=feature Note="TODO"',
  'Combat Reflexes':'Section=combat Note="+2 on recovery rolls"',
  'Command Presence':'Section=feature Note="TODO"',
  'Command':'Section=feature Note="TODO"',
  'Common Bond':'Section=feature Note="TODO"',
  'Concentration':'Section=feature Note="TODO"',
  'Connections':'Section=feature Note="TODO"',
  'Counterattack':
    'Section=combat Note="Free Attack after failed foe attack %V/rd"',
  'Danger Sense':'Section=feature Note="TODO"',
  'Dead Shot':
    'Section=combat ' +
    'Note="Joker Action Card gives dbl damage from first thowing or shooting"',
  'Dodge':'Section=combat Note="-2 foe ranged attacks"',
  'Double Tap':'Section=combat Note="+1 firearm attack and damage"',
  'Elan':'Section=feature Note="+2 on Benny-purchased trait rerolls"',
  'Expert':'Section=feature Note="TODO"',
  'Extra Effort':'Section=feature Note="TODO"',
  'Extraction':
    'Section=combat Note="Negate attack of %V foes when withdrawing"',
  'Fame':
    'Section=feature,skill ' +
    'Note=' +
      '"5x fee from performing",' +
      '"+2 Persuasion influencing friendly individuals"',
  'Fast Healer':
    'Section=combat Note="+2 Vigor (natural healing), check every 3 dy"',
  'Feint':
    'Section=skill ' +
    'Note="Force foe to oppose Fighting test with Smarts instead of Agility"',
  'Fervor':'Section=feature Note="TODO"',
  'Filthy Rich':'Section=feature Note="+2x Rich effects"',
  'First Strike':
    'Section=combat Note="Free attack against %V foes moving into reach"',
  'Fleet-Footed':'Section=ability Note="+2 Pace/+1 run die"',
  'Followers':'Section=feature Note="TODO"',
  'Free Runner':
    'Section=skill ' +
    'Note="Move full Pace on difficult ground/+2 Athletics (climbing)/+2 on foot chases"',
  'Frenzy':'Section=combat Note="Extra Fighting die on %V attcks/rd"',
  'Gadgeteer':'Section=feature Note="TODO"',
  'Giant Killer':'Section=combat Note="+1d6 damage vs. foes 3 sizes larger"',
  'Great Luck':'Section=feature Note="+1 Luck effects"',
  'Hard To Kill':
    'Section=save Note="Ignore Wound penalties to avoid bleeding out"',
  'Harder To Kill':'Section=save Note="50% chance to cheat death"',
  'Healer':'Section=feature Note="TODO"',
  'Hold The Line!':'Section=feature Note="TODO"',
  'Holy/Unholy Warrior':'Section=feature Note="TODO"',
  'Humiliate':'Section=feature Note="TODO"',
  'Improved Arcane Resistance':'Section=feature Note="TODO"',
  'Improved Block':'Section=combat Note="+1 Block effects"',
  'Improved Counterattack':
    'Section=combat Note="Two additional Counterattacks"',
  'Improved Dodge':'Section=combat Note="+2 to evade area attacks"',
  'Improved Extraction':
    'Section=combat Note="Increase Extraction effects by 2"',
  'Improved First Strike':
    'Section=combat Note="Increase First Strike effects by 2"',
  'Improved Frenzy':'Section=combat Note="Increase Frenzy effects by 1"',
  'Improved Level Headed':
    'Section=combat Note="Increase Level Headed effects by 1"',
  'Improved Nerves Of Steel':'Section=feature Note="TODO"',
  'Improved Rapid Fire':'Section=feature Note="TODO"',
  'Improved Rapid Recharge':'Section=feature Note="TODO"',
  'Improved Sweep':'Section=feature Note="TODO"',
  'Improved Trademark Weapon':'Section=feature Note="TODO"',
  'Improvisational Fighter':
    'Section=combat Note="No penalty w/improvised weapons"',
  'Inspire':'Section=feature Note="TODO"',
  'Investigator':'Section=feature Note="TODO"',
  'Iron Jaw':'Section=combat Note="+2 soak/+2 vs. knockout"',
  'Iron Will':'Section=feature Note="TODO"',
  'Jack-Of-All-Trades':'Section=feature Note="TODO"',
  'Killer Instinct':'Section=skill Note="Reroll sel-initiated opposed test"',
  'Level Headed':'Section=combat Note="Choose best of %V Action Cards"',
  'Linguist':'Section=feature Note="TODO"',
  'Liquid Courage':'Section=feature Note="TODO"',
  'Luck':'Section=feature Note="+%V Benny each session"',
  'Marksman':'Section=feature Note="TODO"',
  'Martial Artist':'Section=feature Note="TODO"',
  'Martial Warrior':'Section=feature Note="TODO"',
  'Master Of Arms':'Section=feature Note="TODO"',
  'Master Tactician':'Section=feature Note="TODO"',
  'Master':'Section=feature Note="TODO"',
  'McGyver':'Section=feature Note="TODO"',
  'Menacing':'Section=feature Note="TODO"',
  'Mentalist':'Section=feature Note="TODO"',
  'Mighty Blow':'Section=feature Note="TODO"',
  'Mr. Fix It':'Section=feature Note="TODO"',
  'Natural Leader':'Section=feature Note="TODO"',
  'Nerves Of Steel':'Section=feature Note="TODO"',
  'New Powers':'Section=feature Note="TODO"',
  'No Mercy':'Section=feature Note="TODO"',
  'Power Points':'Section=feature Note="TODO"',
  'Power Surge':'Section=feature Note="TODO"',
  'Professional':'Section=feature Note="TODO"',
  'Provoke':'Section=feature Note="TODO"',
  'Quick':'Section=combat Note="Redraw action cards under 6"',
  'Rabble-Rouser':'Section=feature Note="TODO"',
  'Rapid Fire':'Section=feature Note="TODO"',
  'Rapid Recharge':'Section=feature Note="TODO"',
  'Reliable':'Section=feature Note="TODO"',
  'Retort':'Section=feature Note="TODO"',
  'Rich':'Section=feature Note="%Vx starting funds"',
  'Rock And Roll':'Section=feature Note="TODO"',
  'Scavenger':'Section=feature Note="TODO"',
  'Scholar':'Section=feature Note="TODO"',
  'Sidekick':'Section=feature Note="TODO"',
  'Soldier':'Section=feature Note="TODO"',
  'Soul Drain':'Section=feature Note="TODO"',
  'Steady Hands':'Section=feature Note="TODO"',
  'Streetwise':'Section=feature Note="TODO"',
  'Strong Willed':'Section=feature Note="TODO"',
  'Sweep':'Section=feature Note="TODO"',
  'Tactician':'Section=feature Note="TODO"',
  'Thief':'Section=feature Note="TODO"',
  'Tough As Nails':'Section=feature Note="TODO"',
  'Tougher Than Nails':'Section=feature Note="TODO"',
  'Trademark Weapon (%weapon)':'Section=feature Note="TODO"',
  'Two-Fisted':'Section=feature Note="TODO"',
  'Two-Gun Kid':'Section=feature Note="TODO"',
  'Very Attractive':'Section=skill Note="+1 Attractive effects"',
  'Weapon Master':'Section=feature Note="TODO"',
  'Wizard':'Section=feature Note="TODO"',
  'Woodsman':'Section=feature Note="TODO"',
  'Work The Crowd':'Section=feature Note="TODO"',
  'Work The Room':'Section=feature Note="TODO"',

  // Hindrances
  'All Thumbs':
    'Section=skill ' +
    'Note="-2 using mechanical and electrical devices, critical failure breaks device"',
  'Anemic':'Section=save Note="-2 Vigor (resist disease)"',
  'Arrogant':'Section=combat Note="Always take on biggest threat"',
  'Bad Eyes (Major)':'Section=skill Note="-2 vision-linked"',
  'Bad Eyes (Minor)':'Section=skill Note="-1 vision-linked"',
  'Bad Luck':'Section=feature Note="-1 Benny each session"',
  'Big Mouth':'Section=feature Note="TODO"',
  'Blind':'Section=feature Note="TODO"',
  'Bloodthirsty':'Section=combat Note="Cruel w/foes"',
  "Can't Swim":
    'Section=combat,skill ' +
    'Note="Swim pace %{pace//3}","-2 Athletics (swimming)"',
  'Cautious':'Section=feature Note="TODO"',
  'Clueless (Major)':'Section=skill Note="-1 Common Knowledge/-1 Notice"',
  'Clueless (Minor)':'Section=feature Note="TODO"',
  'Clumsy':'Section=feature Note="TODO"',
  'Code Of Honor':'Section=feature Note="TODO"',
  'Curious':'Section=feature Note="TODO"',
  'Death Wish':'Section=feature Note="TODO"',
  'Delusional (Major)':'Section=feature Note="TODO"',
  'Delusional (Minor)':'Section=feature Note="TODO"',
  'Doubting Thomas':'Section=feature Note="TODO"',
  'Driven (Major)':'Section=feature Note="TODO"',
  'Driven (Minor)':'Section=feature Note="TODO"',
  'Elderly':'Section=feature Note="TODO"',
  'Enemy (Major)':'Section=feature Note="TODO"',
  'Enemy (Minor)':'Section=feature Note="TODO"',
  'Greedy (Major)':'Section=feature Note="TODO"',
  'Greedy (Minor)':'Section=feature Note="TODO"',
  'Habit (Major)':'Section=feature Note="TODO"',
  'Habit (Minor)':'Section=feature Note="TODO"',
  'Hard Of Hearing (Major)':'Section=feature Note="TODO"',
  'Hard Of Hearing (Minor)':'Section=feature Note="TODO"',
  'Heroic':'Section=feature Note="TODO"',
  'Hesitant':'Section=feature Note="TODO"',
  'Illiterate':'Section=feature Note="TODO"',
  'Impulsive':'Section=feature Note="TODO"',
  'Jealous (Major)':'Section=feature Note="TODO"',
  'Jealous (Minor)':'Section=feature Note="TODO"',
  'Loyal':'Section=feature Note="TODO"',
  'Mean':'Section=feature Note="TODO"',
  'Mild Mannered':'Section=feature Note="TODO"',
  'Mute':'Section=feature Note="TODO"',
  'Obese':'Section=feature Note="TODO"',
  'Obligation (Major)':'Section=feature Note="TODO"',
  'Obligation (Minor)':'Section=feature Note="TODO"',
  'One Arm':'Section=feature Note="TODO"',
  'One Eye':'Section=feature Note="TODO"',
  'Outsider (Major)':
    'Section=feature,skill ' +
    'Note="No legal rights","-2 Persuasion (other races)"',
  'Outsider (Minor)':'Section=skill Note="-2 Persuasion (other races)"',
  'Overconfident':'Section=feature Note="TODO"',
  'Pacifist (Major)':
    'Section=combat ' +
    'Note="Will not fight living creatures, use nonlethal methods only in defense"',
  'Pacifist (Minor)':'Section=feature Note="TODO"',
  'Phobia (Major)':'Section=feature Note="TODO"',
  'Phobia (Minor)':'Section=feature Note="TODO"',
  'Poverty':'Section=feature Note="TODO"',
  'Quirk':'Section=feature Note="TODO"',
  'Secret (Major)':'Section=feature Note="TODO"',
  'Secret (Minor)':'Section=feature Note="TODO"',
  'Shamed (Major)':'Section=feature Note="TODO"',
  'Shamed (Minor)':'Section=feature Note="TODO"',
  'Slow (Major)':'Section=feature Note="TODO"',
  'Slow (Minor)':'Section=feature Note="TODO"',
  'Small':'Section=feature Note="TODO"',
  'Stubborn':'Section=feature Note="TODO"',
  'Suspicious (Major)':'Section=feature Note="TODO"',
  'Suspicious (Minor)':'Section=feature Note="TODO"',
  'Thin Skinned (Major)':'Section=feature Note="TODO"',
  'Thin Skinned (Minor)':'Section=feature Note="TODO"',
  'Tongue-Tied':'Section=feature Note="TODO"',
  'Ugly (Major)':'Section=feature Note="TODO"',
  'Ugly (Minor)':'Section=feature Note="TODO"',
  'Vengeful (Major)':'Section=feature Note="TODO"',
  'Vengeful (Minor)':'Section=feature Note="TODO"',
  'Vow (Minor)':
    'Section=feature Note="Broad requiremens on behavior and actions"',
  'Vow (Major)':
    'Section=feature Note="Strict requirements on behavior and actions"',
  'Wanted (Major)':'Section=feature Note="TODO"',
  'Wanted (Minor)':'Section=feature Note="TODO"',
  'Yellow':'Section=feature Note="TODO"',
  'Young (Major)':'Section=feature Note="TODO"',
  'Young (Minor)':'Section=feature Note="TODO"',

  // Races
  'Adaptable':'Section=feature Note="+1 Edge Points"',
  'Agile':'Section=ability Note="+1 Agility die"',
  'Aquatic':'Section=combat Note="Cannot drown, swim pace %{pace}"',
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
    'Note="Fly pace 12","Use Athletics for flight maneuvers"',
  'Frail':
    'Section=combat Note="-1 Toughness"',
  'Heritage':
    'Section=feature Note="+2 Improvement Points (Ability Die or Edge)"',
  'Keen Senses':'Section=skill Note="+1 Notice die"',
  'Low Light Vision':
    'Section=feature Note="Ignore penalties for dim and dark illumination"',
  'Racial Enemy':'Section=skill Note="-2 Persuasion (racial enemy)"',
  'Reduced Pace':'Section=combat Note="-1 Pace"',
  'Size -1':'Section=combat Note="-1 Toughness"',
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
  'Clueless (Minor)':'Level=Minor',
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
  // TODO
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
      'Luck,"Reduced Pace","Size -1",Spirited',
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
  'None':'AC=0',
  'Small':'AC=1',
  'Medium':'AC=2',
  'Large':'AC=3'
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
  // TODO
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
  }
  rules.defineRule('advances', '', '^=', '0');
  rules.defineRule('improvementPoints.total', 'advances', '=', 'source * 2');
  rules.defineRule('attributePoints',
    '', '=', '5',
    'improvementPoints.ability', '+', 'Math.floor(source / 2)'
  );
  rules.defineRule
    ('abilityNotes.attributePoints', 'attributePoints', '=', null);
  rules.defineRule('pace', '', '=', '6');
  rules.defineRule('rank',
    'advances', '=', 'source<4 ? "Novice" : source<8 ? "Seasoned" : source<12 ? "Veteran" : source<16 ? "Heroic" : "Legendary"'
  );
  QuilvynRules.validAllocationRules
    (rules, 'attributePoints', 'attributePoints', 'Sum "^(agility|smarts|spirit|strength|vigor)Allocation$"');
  QuilvynRules.validAllocationRules
    (rules, 'improvementPoints', 'improvementPoints.total', 'Sum "^improvementPoints.(ability|edge|skill|hindrance)$"');

};

/* Defines the rules related to combat. */
SWADE.combatRules = function(rules, armors, shields, weapons) {

  QuilvynUtils.checkAttrTable
    (armors, ['AC', 'Bulky', 'Dex', 'Str', 'Weight']);
  QuilvynUtils.checkAttrTable(shields, ['AC']);
  QuilvynUtils.checkAttrTable
    (weapons, ['Category', 'Damage', 'Property', 'Range']);

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

  rules.defineRule('abilityNotes.armorSpeedAdjustment',
    'armorStrShortfall', '=', 'source > 0 ? -10 : null'
  );
  rules.defineRule
    ('armorClass', 'combatNotes.dexterityArmorClassAdjustment', '+', null);
  rules.defineRule('armorStrShortfall',
    'armorStrRequirement', '=', null,
    'strength', '+', '-source'
  );
  rules.defineRule('attacksPerRound', '', '=', '1');
  rules.defineRule('betterAttackAdjustment',
    'combatNotes.dexterityAttackAdjustment', '=', null,
    'combatNotes.strengthAttackAdjustment', '^', null
  );
  rules.defineRule('betterDamageAdjustment',
    'combatNotes.dexterityDamageAdjustment', '=', null,
    'combatNotes.strengthDamageAdjustment', '^', null
  );
  rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
    'dexterityModifier', '=', null,
    'armorWeight', '*', 'source == 3 ? 0 : null'
  );
  rules.defineRule
    ('combatNotes.dexterityAttackAdjustment', 'dexterityModifier', '=', null);
  rules.defineRule
    ('combatNotes.dexterityDamageAdjustment', 'dexterityModifier', '=', null);
  rules.defineRule
    ('combatNotes.strengthAttackAdjustment', 'strengthModifier', '=', null);
  rules.defineRule
    ('combatNotes.strengthDamageAdjustment', 'strengthModifier', '=', null);
  rules.defineRule('features.Nonproficient Armor',
    // Modify heavy so that Prof (Light+Medium) doesn't suffice for heavy armor
    'armorWeight', '=', 'source == 3 ? 4 : source',
    'armorProficiency.Light', '+', '-1',
    'armorProficiency.Medium', '+', '-2',
    'armorProficiency.Heavy', '+', '-4',
    '', '^', '0'
  );
  rules.defineRule('features.Two-Handed Weapon With Shield',
    'shield', '?', 'source != "None"'
  );
  rules.defineRule('initiative', 'dexterityModifier', '=', null);
  rules.defineRule('parry',
    '', '=', '2',
    'skillModifier.Fighting', '+', 'source / 2'
  );
  rules.defineRule('toughness', 'vigor', '=', 'source / 2 + 2');
  rules.defineRule('weapons.Unarmed', '', '=', '1');

  for(var ability in SWADE.ATTRIBUTES) {
    rules.defineRule('saveBonus.' + ability,
      'saveProficiency.' + ability, '?', null,
      'proficiencyBonus', '=', null
    );
    rules.defineRule('save.' + ability,
      ability.toLowerCase() + 'Modifier', '=', null,
      'saveBonus.' + ability, '+', null
    );
  }

  QuilvynRules.validAllocationRules
    (rules, 'armorProficiency', 'armorChoiceCount', 'Sum "^armorsChosen\\."');
  QuilvynRules.validAllocationRules
    (rules, 'weaponProficiency', 'weaponChoiceCount', 'Sum "^weaponsChosen\\."');

};

/* Defines rules related to basic character identity. */
SWADE.identityRules = function(rules, races) {

  QuilvynUtils.checkAttrTable
    (races, ['Require', 'Features', 'Selectables', 'SpellSlots', 'Spells']);

  for(var race in races) {
    rules.choiceRules(rules, 'Race', race, races[race]);
  }

};

/* Defines rules related to powers. */
SWADE.magicrRules = function(rules, powers) {
  // TODO
};

/* Defines rules related to character aptitudes. */
SWADE.talentRules = function(
  rules, edges, features, goodies, hindrances, skills
) {

  QuilvynUtils.checkAttrTable(edges, ['Require', 'Imply', 'Type']);
  QuilvynUtils.checkAttrTable(features, ['Section', 'Note']);
  QuilvynUtils.checkAttrTable(hindrances, ['Level']);
  QuilvynUtils.checkAttrTable(skills, ['Attribute', 'Core']);

  for(var edge in edges) {
    rules.choiceRules(rules, 'Edge', edge, edges[edge]);
  }
  for(var feature in features) {
    rules.choiceRules(rules, 'Feature', feature, features[feature]);
  }
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
  }
  rules.defineRule('edgePoints',
    '', '=', '1',
    'improvementPoints.edge', '+', 'Math.floor(source / 2)'
  );
  rules.defineRule('skillPoints',
    '', '=', '12',
    'improvementPoints.skill', '+', 'source'
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
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Str'),
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
      QuilvynUtils.getAttrValue(attrs, 'AC')
    );
  else if(type == 'Skill')
    SWADE.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Attribute'),
      QuilvynUtils.getAttrValue(attrs, 'Core')
    );
  else if(type == 'Power') {
    var description = QuilvynUtils.getAttrValue(attrs, 'Description');
    var groupLevels = QuilvynUtils.getAttrValueArray(attrs, 'Level');
    var school = QuilvynUtils.getAttrValue(attrs, 'School');
    var schoolAbbr = school.substring(0, 4);
    for(var i = 0; i < groupLevels.length; i++) {
      var matchInfo = groupLevels[i].match(/^(\D+)(\d+)$/);
      if(!matchInfo) {
        console.log('Bad level "' + groupLevels[i] + '" for spell ' + name);
        continue;
      }
      var group = matchInfo[1];
      var level = matchInfo[2] * 1;
      var fullName = name + '(' + group + level + ' ' + schoolAbbr + ')';
      // TODO indicate domain spells in attributes?
      var domainSpell = SWADE.PATHS[group + ' Domain'] != null;
      SWADE.spellRules
        (rules, fullName, school, group, level, description, domainSpell);
      rules.addChoice('spells', fullName, attrs);
    }
  } else if(type == 'Weapon')
    SWADE.weaponRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Category'),
      QuilvynUtils.getAttrValueArray(attrs, 'Property'),
      QuilvynUtils.getAttrValue(attrs, 'Damage'),
      QuilvynUtils.getAttrValue(attrs, 'Range')
    );
  else {
    console.log('Unknown choice type "' + type + '"');
    return;
  }
  if(type != 'Feature' && type != 'Power') {
    type =
      type.charAt(0).toLowerCase() + type.substring(1).replaceAll(' ', '') + 's';
    rules.addChoice(type, name, attrs);
  }
};

/*
 * Defines in #rules# the rules associated with armor #name#, which adds #ac#
 * to the character's armor class, requires a #weight# proficiency level to use
 * effectively, allows a maximum dex bonus to ac of #maxDex#, requires (if
 * specified) a strength of #minStr# to avoid a speed penalty.
 */
SWADE.armorRules = function(rules, name, ac, maxDex, minStr, weight) {

  if(!name) {
    console.log('Empty armor name');
    return;
  }
  if(typeof ac != 'number') {
    console.log('Bad ac "' + ac + '" for armor ' + name);
    return;
  }
  if(typeof maxDex != 'number') {
    console.log('Bad max dex "' + maxDex + '" for armor ' + name);
    return;
  }
  if(minStr != null && typeof minStr != 'number') {
    console.log('Bad min str "' + minStr + '" for armor ' + name);
    return;
  }
  if(weight == null ||
     !(weight + '').match(/^([0-3]|none|light|medium|heavy)$/i)) {
    console.log('Bad weight "' + weight + '" for armor ' + name);
    return;
  }

  if((weight + '').match(/^[0-3]$/))
    ; // empty
  else if(weight.match(/^none$/i))
    weight = 0;
  else if(weight.match(/^light$/i))
    weight = 1;
  else if(weight.match(/^medium$/i))
    weight = 2;
  else if(weight.match(/^heavy$/i))
    weight = 3;

  if(rules.armorStats == null) {
    rules.armorStats = {
      ac:{},
      dex:{},
      str:{},
      weight:{}
    };
  }
  rules.armorStats.ac[name] = ac;
  rules.armorStats.dex[name] = maxDex;
  rules.armorStats.str[name] = minStr;
  rules.armorStats.weight[name] = weight;

  rules.defineRule('armorClass',
    '', '=', '10',
    'armor', '+', QuilvynUtils.dictLit(rules.armorStats.ac) + '[source]'
  );
  rules.defineRule('armorStrRequirement',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.minStr) + '[source]'
  );
  rules.defineRule('armorWeight',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.weight) + '[source]'
  );
  rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
    'armor', 'v', QuilvynUtils.dictLit(rules.armorStats.dex) + '[source]'
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
  if(name == 'Attractive') {
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
  } else if(name == 'Rich') {
    rules.defineRule('featureNotes.rich',
      '', '=', '3',
      'featureNotes.filthyRich', '^', '5'
    );
  }
};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
SWADE.featureRules = function(rules, name, sections, notes) {
  // TBD Move out of SRD35
  SRD35.featureRules(rules, name, sections, notes);
  for(var i = 0; i < sections.length; i++) {
    var matchInfo = notes[i].match(/^([-+]\d+) ([A-Z]\w+) die$/);
    if(!matchInfo)
      continue;
    var note =
      name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
    if(sections[i] == 'ability')
      rules.defineRule(matchInfo[2].toLowerCase() + 'Level',
        'abilityNotes.' + note, '+', matchInfo[1]
      );
    else if(sections[i] == 'skill')
      rules.defineRule('skillLevel.' + matchInfo[2],
        'skillNotes.' + note, '+', matchInfo[1]
      );
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
  rules.defineRule('improvementPoints.total',
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
    rules.defineRule
      ('improvementPoints.total', 'featureNotes.heritage', '+', '2');
  }
};

/*
 * Defines in #rules# the rules associated with shield #name#, which adds #ac#
 * to the character's armor class.
 */
SWADE.shieldRules = function(rules, name, ac) {

  if(!name) {
    console.log('Empty shield name');
    return;
  }
  if(typeof ac != 'number') {
    console.log('Bad ac "' + ac + '" for shield ' + name);
    return;
  }

  if(rules.shieldStats == null) {
    rules.shieldStats = {
      ac:{},
    };
  }
  rules.shieldStats.ac[name] = ac;

  rules.defineRule
    ('armorClass', 'shield', '+', QuilvynUtils.dictLit(rules.shieldStats.ac) + '[source]');

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
 * Defines in #rules# the rules associated with spell #name#, which is from
 * magic school #school#. #casterGroup# and #level# are used to compute any
 * saving throw value required by the spell. #description# is a verbose
 * description of the spell's effects.
 */
SWADE.powerRules = function(
  rules, name, school, casterGroup, level, description, domainSpell
) {
  // TBD Move out of SRD35
  SRD35.spellRules
    (rules, name, school, casterGroup, level, description, domainSpell);
};

/*
 * Defines in #rules# the rules associated with weapon #name#, which requires a
 * #category# proficiency level to use effectively and has weapon properties
 * #properties#. The weapon does #damage# HP on a successful attack. If
 * specified, the weapon can be used as a ranged weapon with a range increment
 * of #range# feet.
 */
SWADE.weaponRules = function(rules, name, category, properties, damage, range) {

  if(!name) {
    console.log('Bad name for weapon  "' + name + '"');
    return;
  }
  if(category == null ||
     !(category + '').match(/^([0-2]|unarmed|simple|martial)$/i)) {
    console.log('Bad category "' + category + '" for weapon ' + name);
    return;
  }
  if(!Array.isArray(properties)) {
    console.log('Bad properties list "' + properties + '" for weapon ' + name);
    return;
  }
  var matchInfo = (damage + '').match(/^(((\d*d)?\d+)([\-+]\d+)?)$/);
  if(!matchInfo) {
    console.log('Bad damage "' + damage + '" for weapon ' + name);
    return;
  }
  if(range && typeof range != 'number') {
    console.log('Bad range "' + range + '" for weapon ' + name);
  }

  if((category + '').match(/^[0-2]$/))
    ; // empty
  else if(category.match(/^unarmed$/i))
    category = 0;
  else if(category.match(/^simple$/i))
    category = 1;
  else if(category.match(/^martial$/i))
    category = 2;

  var isFinessed = properties.includes('finesse') || properties.includes('Fi');
  var isRanged = properties.includes('ranged') || properties.includes('R');
  var is2h = properties.includes('two-handed') || properties.includes('2h');

  var damage = matchInfo[1];
  var weaponName = 'weapons.' + name;
  var format = '%V (%1 %2%3' + (range ? " R%4'" : '') + ')';

  if(damage.startsWith('d'))
    damage = '1' + damage;

  rules.defineChoice('notes',
    weaponName + ':' + format,
    'sanityNotes.nonproficientWeaponPenalty.' + name + ':%V attack'
  );

  if(category > 0) {
    rules.defineRule('sanityNotes.nonproficientWeaponPenalty.' + name,
      weaponName, '?', null,
      'proficiencyBonus', '=', '-source',
      'weaponProficiency.Martial', '^', '0',
      'weaponProficiency.' + name, '^', '0'
    );
    if(category == 1) {
      rules.defineRule('sanityNotes.nonproficientWeaponPenalty.' + name,
        'weaponProficiency.Simple', '^', '0'
      );
    }
  }
  rules.defineRule('weaponProficiencyBonus.' + name,
    weaponName, '?', null,
    'proficiencyBonus', '=', null,
    'sanityNotes.nonproficientWeaponPenalty.' + name, 'v', 'source == 0 ? null : 0'
  );
  rules.defineRule('attackBonus.' + name,
    weaponName, '=', '0',
    isFinessed ? 'betterAttackAdjustment' :
      isRanged ? 'combatNotes.dexterityAttackAdjustment' :
                 'combatNotes.strengthAttackAdjustment', '+', null,
    isRanged ? 'attackBonus.Ranged' : 'attackBonus.Melee', '+', null,
    'weaponProficiencyBonus.' + name, '+', null,
    'weaponAttackAdjustment.' + name, '+', null
  );
  rules.defineRule('damageBonus.' + name,
    weaponName, '=', '0',
    isFinessed ? 'betterDamageAdjustment' :
      isRanged ? 'combatNotes.dexterityDamageAdjustment' :
                 'combatNotes.strengthDamageAdjustment', '+', null,
    'weaponDamageAdjustment.' + name, '+', null
  );
  if(!range) {
    rules.defineRule('attackBonus.' + name, 'monkMeleeAttackBonus', '+', null);
    rules.defineRule('damageBonus.' + name, 'monkMeleeDamageBonus', '+', null);
  }

  rules.defineRule(weaponName + '.1',
    'attackBonus.' + name, '=', 'source >= 0 ? "+" + source : source'
  );
  rules.defineRule(weaponName + '.2', weaponName, '=', '"' + damage + '"');
  if(properties.includes('Ve') || properties.includes('versatile'))
    rules.defineRule(weaponName + '.2',
      'shield', '=', 'source == "None" ? SWADE.VERSATILE_WEAPON_DAMAGE["' + damage + '"] : null'
    );
  rules.defineRule(weaponName + '.3',
    'damageBonus.' + name, '=', 'source > 0 ? "+" + source : source == 0 ? "" : source'
  );
  if(range) {
    rules.defineRule('range.' + name,
      weaponName, '=', range,
      'weaponRangeAdjustment.' + name, '+', null
    );
    rules.defineRule(weaponName + '.4', 'range.' + name, '=', null);
  } else {
    rules.defineRule(weaponName + '.2', 'monkMeleeDieBonus', '^', null);
  }

  if(is2h)
    rules.defineRule
      ('features.Two-Handed Weapon With Shield', weaponName, '=', '1');

  rules.defineRule('weaponProficiency.' + name,
    'weaponsChosen.' + name, '=', 'source ? 1 : null'
  );

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
            {name: 'Toughness', within: 'Section 1', format: '<b>HP</b> %V'},
            {name: 'Initiative', within: 'Section 1', format: '<b>Initiative</b> %V'},
            {name: 'Pace', within: 'Section 1', format: '<b>Pace</b> %V'},
            {name: 'Toughness', within: 'Section 1', format: '<b>AC</b> %V'},
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
          {name: 'Image Url', within: 'Header', format: '<img src="%V"/>'},
        {name: 'Attributes', within: '_top', separator: outerSep},
          {name: 'Abilities', within: 'Attributes', separator: innerSep},
            {name: 'Agility', within: 'Abilities'},
            {name: 'Smarts', within: 'Abilities'},
            {name: 'Spirit', within: 'Abilities'},
            {name: 'Strength', within: 'Abilities'},
            {name: 'Vigor', within: 'Abilities'},
          {name: 'Description', within: 'Attributes', separator: innerSep},
            {name: 'Origin', within: 'Description'},
            {name: 'Player', within: 'Description'},
          {name: 'AbilityStats', within: 'Attributes', separator: innerSep},
            {name: 'AdvanceInfo', within: 'AbilityStats', separator: ''},
              {name: 'Advances', within: 'AdvanceInfo'},
              {name: 'Rank', within: 'AdvanceInfo', format: ' (%V)'},
            {name: 'Improvement Points', within: 'AbilityStats',
             separator: listSep}
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
          {name: 'Skills', within: 'FeaturesAndSkills', columns: '3LE', separator: null},
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
              {name: 'Toughness', within: 'CombatStats'},
              {name: 'Initiative', within: 'CombatStats'},
              {name: 'Parry', within: 'CombatStats'},
              {name: 'Pace', within: 'CombatStats'},
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
  var raises = [0, 1, 2, 3, 4, 5, 6];
  var improvementTypes = ['Ability', 'Edge', 'Hindrance', 'Skill'];
  var editorElements = [
    ['name', 'Name', 'text', [20]],
    ['race', 'Race', 'select-one', 'races'],
    ['imageUrl', 'Image URL', 'text', [20]],
    ['agilityAllocation', 'Agility', 'select-one', raises],
    ['smartsAllocation', 'Smarts', 'select-one', raises],
    ['spiritAllocation', 'Spirit', 'select-one', raises],
    ['strengthAllocation', 'Srength', 'select-one', raises],
    ['vigorAllocation', 'Vigor', 'select-one', raises],
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
    ['spells', 'Spells', 'fset', 'spells'],
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
  else if(race.match(/Halfling/))
    race = 'Halfling';
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
    'Gnome':'bdghjlmnprstw', 'Halfling':'bdfghlmnprst',
    'Human': 'bcdfghjklmnprstvwz', 'Orc': 'dgjkprtvxz',
    'Tiefling': 'bcdfghjklmnprstvwz'
  }[race];
  var endConsonant = '';
  var leading = 'ghjqvwy';
  var vowels = {
    'Dragonborn':'aeiou', 'Dwarf':'aeiou', 'Elf':'aeioy', 'Gnome':'aeiou',
    'Halfling':'aeiou', 'Human':'aeiou', 'Orc':'aou', 'Tiefling':'aeiou'
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
  } else if(attribute == 'armor') {
    // TODO
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
      if(attrs['edges.' + attr] == null)
        choices[attr] = '';
    }
    console.log('Choose ' + howMany + ' edges');
    while(howMany > 0) {
      console.log('Pick ' + howMany + ' from ' + Object.keys(choices).length);
      var pick;
      var picks = {};
      pickAttrs(picks, '', Object.keys(choices), howMany, 1);
      console.log(picks);
      console.log('From ' + Object.keys(picks).join(", ") + ' reject');
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
          console.log(name);
        } else {
          howMany--;
        }
      }
    }
  } else if(attribute == 'gender') {
    attributes['gender'] = QuilvynUtils.random(0, 99) < 50 ? 'Female' : 'Male';
  } else if(attribute == 'hindrances') {
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
        if(!('hindrances.' + attr in attributes) &&
           allHindrances[attr].includes(type))
          choices.push(attr);
      }
      attr = choices[QuilvynUtils.random(0, choices.length - 1)];
      attributes['hindrances.' + attr] = 1;
      howMany -= allHindrances[attr].includes('Major') ? 2 : 1;
    }
  } else if(attribute == 'improvements') {
    attrs = this.applyRules(attributes);
    howMany = (attrs['improvementPoints.total'] || 0) -
              (attrs['improvementPoints.ability'] || 0) -
              (attrs['improvementPoints.edge'] || 0) -
              (attrs['improvementPoints.hindrance'] || 0) -
              (attrs['improvementPoints.skill'] || 0);
    // Note: not allocating improvements to removing hindrances
    while(howMany > 0) {
      attr = howMany == 1 || QuilvynUtils.random(0, 2) == 0 ? 'skill' :
             QuilvynUtils.random(0, 1) == 0 ? 'edge' : 'ability';
      if(attributes['improvementPoints.' + attr] == null)
        attributes['improvementPoints.' + attr] = 0;
      var allocation = attr == 'skill' ? 1 : 2;
      attributes['improvementPoints.' + attr] += allocation;
      howMany -= allocation;
    }
  } else if(attribute == 'name') {
    attributes['name'] = SWADE.randomName(attributes['race']);
  } else if(this.getChoices(attribute + 's') != null) {
    attributes[attribute] =
      QuilvynUtils.randomKey(this.getChoices(attribute + 's'));
  } else if(attribute == 'powers') {
    // TODO
  } else if(attribute == 'shield') {
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
    // TODO
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
    '    Quilvyn presents sub-race choices (e.g., Lightfoot vs. Stout\n' +
    '    Halfling) as separate races in the editor Race menu.\n' +
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
