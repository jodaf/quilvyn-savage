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
/* globals QuilvynUtils, SWADE */
"use strict";

/*
 * This module loads the rules from the Savage Worlds Adventure Edition Super
 * Powers Companion. The SWADESPC function contains methods that load rules for
 * particular parts of the rules: ancestryRules for character ancestries,
 * arcaneRules for powers, etc. These member methods can be called
 * independently in order to use a subset of the SWADESPC rules. Similarly, the
 * constant fields of SWADE (SKILLS, EDGES, etc.) can be manipulated to modify
 * the choices.
 */
function SWADESPC(baseRules, rules) {

  if(window.SWADE == null) {
    alert('The SWADESPC module requires use of the SWADE module');
    return;
  }

  if(rules == null)
    rules = SWADE.rules;
  rules.defineChoice('choices', 'Super Power');
  rules.defineChoice('random', 'superPowers');
  rules.spcReplacedChoiceRules = rules.choiceRules;
  rules.choiceRules = SWADESPC.choiceRules;
  rules.spcReplacedRandomizer = rules.randomizeOneAttribute;
  rules.randomizeOneAttribute = SWADESPC.randomizeOneAttribute;
  SWADESPC.combatRules(rules, SWADESPC.ARMORS, SWADESPC.SHIELDS, SWADESPC.WEAPONS);
  SWADESPC.arcaneRules
    (rules, SWADESPC.ARCANAS, SWADESPC.POWERS, SWADESPC.SUPER_POWERS);
  SWADESPC.talentRules
    (rules, SWADESPC.EDGES, SWADESPC.FEATURES, SWADESPC.GOODIES,
     SWADESPC.HINDRANCES, SWADESPC.SKILLS);
  SWADESPC.identityRules
    (rules, SWADESPC.ANCESTRYS, SWADESPC.ERAS, SWADESPC.CONCEPTS);

}

SWADESPC.VERSION = '2.4.1.0';

SWADESPC.ANCESTRYS = {
  // empty
};
SWADESPC.ARCANAS = {
  // empty
};
SWADESPC.ARMORS = {
  'Body Suit':'Area=Body Armor=2 MinStr=6 Weight=8',
  'Body Armor':'Area=Body Armor=2 MinStr=6 Weight=5',
  'Heavy Body Armor':'Area=Body Armor=4 MinStr=8 Weight=17',
  'Combat Armor':'Area=Body Armor=2 MinStr=8 Weight=12',
  'Heavy Combat Armor':'Area=Body Armor=4 MinStr=10 Weight=30',
  'Ballistic Helm':'Area=Body Armor=4 MinStr=4 Weight=5',
  'Cape':'Area=Torso Armor=0 MinStr=0 Weight=2'
};
SWADESPC.CONCEPTS = {
  'Super Hero I':
    'Edge="Super Powers I"',
  'Super Hero II':
    'Edge="Super Powers II"',
  'Super Hero III':
    'Edge="Super Powers III"',
  'Super Hero IV':
    'Edge="Super Powers IV"',
  'Super Hero V':
    'Edge="Super Powers V"'
};
SWADESPC.EDGES = {
  'Super Powers I':'Type=Background Require="superPowerEdgeCount == 1"',
  'Super Powers II':'Type=Background Require="superPowerEdgeCount == 1"',
  'Super Powers III':'Type=Background Require="superPowerEdgeCount == 1"',
  'Super Powers IV':'Type=Background Require="superPowerEdgeCount == 1"',
  'Super Powers V':'Type=Background Require="superPowerEdgeCount == 1"',
  'The Best There Is':'Type=Background',
  'Take The Hit':
    'Type=Combat ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Iron Jaw",' +
      '"vigor >= 10"',
  'Team Leader':
    'Type=Leadership ' +
    'Require=' +
      '"advances >= 4",' +
      '"features.Command",' +
      '"features.Common Bond",' +
      '"features.Natural Leader"',
  'Dynamic Duo':'Type=Social Require="spirit >= 8"',
  'Sidekick':'Type=Social Require="advances >= 8"'
};
SWADESPC.ERAS = {
  // empty
};
SWADESPC.FEATURES = {
  // Edges
  'Dynamic Duo':
    'Section=combat ' +
    'Note="Adds both Support hit bonus and Combined Attack damage bonus when assising partner"',
  // Sidekick as SWADE
  'Super Powers I':
    'Section=arcana ' +
    'Note="15 Super Power Points/Power Limit %{arcanaNotes.theBestThereIs?7:5}"',
  'Super Powers II':
    'Section=arcana ' +
    'Note="30 Super Power Points/Power Limit %{arcanaNotes.theBestThereIs?15:10}"',
  'Super Powers III':
    'Section=arcana ' +
    'Note="45 Super Power Points/Power Limit %{arcanaNotes.theBestThereIs?22:15}"',
  'Super Powers IV':
    'Section=arcana ' +
    'Note="60 Super Power Points/Power Limit %{arcanaNotes.theBestThereIs?30:20}"',
  'Super Powers V':
    'Section=arcana ' +
    'Note="75 Super Power Points/%{arcanaNotes.theBestThereIs ? 37 : 25} Power Limit"',
  'Take The Hit':
    'Section=combat Note="May reroll when Soaking or resisting Knockout"',
  'Team Leader':
    'Section=combat Note="R${commandRange}\\" Allies may exchange Bennies"',
  'The Best There Is':'Section=arcana Note="Increased Power Limit"',
  // Hindrances
  'Alien Form+':
    'Section=feature ' +
    'Note="Healing on self suffers -4 penalty/May suffer gear and social penalties"',
  'Dependency+':
    'Section=feature ' +
    'Note="Must spend 1 hr/dy in contact w/specific substance or suffer Fatigue or loss of powers"',
  'Dependent':
    'Section=feature ' +
    'Note="Has personal connection that occasionally requires attention"',
  'Dependent+':
    'Section=feature ' +
    'Note="Has personal connection that frequently requires attention"',
  'Distinctive Appearance':
    'Section=feature ' +
    'Note="Physical features make self easy to recognize and track"',
  'Environmental Weakness':
    'Section=combat ' +
    'Note="-4 vs. specific Power type/+4 damage from specific Power type"',
  'Grim':
    'Section=combat ' +
    'Note="Provoked (-2 to affect other opponents) by any successful Taunt; lasts until a Joker is drawn"',
  'Idealistic':
    'Section=feature Note="Approaches moral dilemmas with absolute thinking"',
  'Meglomaniac+':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"Gains no benefit from Command effects",' +
      '"Insists on being in charge",' +
      '"-4 Support rolls"',
  'Monologuer+':
    'Section=combat Note="Club Action Card causes self to waste turn talking"',
  'Power Negation':
    'Section=arcana Note="Exposure to rare substance negates powers"',
  'Power Negation+':
    'Section=arcana Note="Exposure to common substance negates powers"',
  'Reckless+':
    'Section=arcana ' +
    'Note="Critical failure on arcane skill roll causes wild loss of control"',
  'Secret Identity+':
    'Section=feature Note="Uncovering of alter ego will cause trouble"',
  "Terminally Ill":
    'Section=attribute ' +
    'Note="-1 vs. Fatigue; critical failure inflicts Ailin\'+"',
  "Terminally Ill+":
    'Section=attribute Note="-2 vs. Fatigue; critical failure inflicts death"',
  'Transformation':
    'Section=feature Note="Requires successful Focus to gain powers"',
  'Transformation+':
    'Section=feature ' +
    'Note="Requires external trigger or difficult process to gain powers"',
  'Vulnerability':
    'Section=feature ' +
    'Note="Specific substance in 12\\" radius inflicts Distracted"',
  'Vulnerability+':
    'Section=feature Note="Specific substance in 12\\" radius inflicts Fatigue"'
};
SWADESPC.GOODIES = {
  // empty
};
SWADESPC.HINDRANCES = {
  'Alien Form+':'Severity=Major',
  'Dependency+':'Severity=Major',
  'Dependent':'Severity=Minor',
  'Dependent+':'Severity=Major',
  'Distinctive Appearance':'Severity=Minor',
  'Environmental Weakness':'Severity=Minor',
  'Grim':'Severity=Minor',
  'Idealistic':'Severity=Minor',
  'Meglomaniac+':'Severity=Major',
  'Monologuer+':'Severity=Major',
  'Power Negation':'Severity=Minor',
  'Power Negation+':'Severity=Major',
  'Reckless+':'Severity=Major',
  'Secret Identity+':'Severity=Major',
  'Terminally Ill':'Severity=Minor',
  'Terminally Ill+':'Severity=Major',
  'Transformation':'Severity=Minor',
  'Transformation+':'Severity=Major',
  'Vulnerability':'Severity=Minor',
  'Vulnerability+':'Severity=Major'
};
SWADESPC.POWERS = {
  // empty
};
SWADESPC.SHIELDS = {
  'Energy Shield':SWADE.SHIELDS['Large Shield'] + ' Era= Weight=12'
};
SWADESPC.SKILLS = {
  // empty
};
SWADESPC.SUPER_POWERS = {
  'Absorption':
    'SuperPowerPoints=2 ' +
    'Modifier=' +
      '"-1 SPP Cannot absorb two Power Types" ' +
    'Description=' +
      '"FILL"',
  'Additional Actions':
    'SuperPowerPoints=5 ' +
    'Modifier=' +
      '"-1 SPP Cannot absorb two Power Types" ' +
    'Description=' +
      '"FILL"'
};
SWADESPC.WEAPONS = {
  'Baton':SWADE.WEAPONS.Baton + ' Weight=2',
  'Weighted Net':SWADE.WEAPONS.Net + ' Era=',
  'Nullifier Rod':'Damage=Str+d4 MinStr=4 Weight=2 Category=One-Handed',
  'Gauntlets':'Damage=Str+d4 Minstr=6 Weight=3 Category=One-Handed',
  'Two-Handed Mallet':
    'Damage=Str+d8 Minstr=8 Weight=7 Category=Two-Handed Parry=-1',
  'Wrist Claws':'Damage=Str+d6 Minstr=6 Weight=2 Category=One-Handed AP=2',
  'Pulse Pistol':'Damage=2d6 Minstr=4 Weight=2 Category=Ranged Range=10 AP=2',
  'Pulse SMG':
    'Damage=2d6 Minstr=6 Weight=4 Category=Ranged Range=10 AP=2 ROF=3',
  'Pulse Rifle':'Damage=3d6 Minstr=6 Weight=6 Category=Ranged Range=20 AP=4',
  'Pulse Assault Rifle':
    'Damage=3d6 Minstr=6 Weight=8 Category=Ranged Range=15 AP=4 ROF=3',
  'Pulse Sniper Rifle':
    'Damage=4d6 Minstr=6 Weight=6 Category=Ranged Range=40 AP=4',
  'Pulse Gatling':
    'Damage=3d6 Minstr=8 Weight=12 Category=Ranged Range=20 AP=4 ROF=3',
  'Pulse Cannon':
    // TODO MinStr is actually d12+1
    'Damage=4d10 Minstr=12 Weight=200 Category=Ranged Range=100 AP=10 ROF=3',
};

/* Defines rules related to powers. */
SWADESPC.arcaneRules = function(rules, arcanas, powers, superPowers) {
  SWADE.arcaneRules(rules, arcanas, powers);
  rules.defineEditorElement
    ('superPowers', 'Super Powers', 'set', 'superPowers', 'powers');
  for(let sp in superPowers) {
    rules.choiceRules(rules, 'Super Power', sp, superPowers[sp]);
  }
  QuilvynRules.validAllocationRules
    (rules, 'superPowers', 'superPowerPoints', 'allocatedSuperPowerPoints');
};

/* Defines the rules related to combat. */
SWADESPC.combatRules = function(rules, armors, shields, weapons) {
  delete rules.getChoices('armors')['Body Armor'];
  delete rules.getChoices('weapons')['Baton'];
  SWADE.combatRules(rules, armors, shields, weapons);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to basic character identity. */
SWADESPC.identityRules = function(rules, ancestries, eras, concepts) {
  SWADE.identityRules(rules, ancestries, eras, concepts);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to character aptitudes. */
SWADESPC.talentRules = function(
  rules, edges, features, goodies, hindrances, skills)
{
  delete rules.getChoices('edges').Sidekick;
  delete rules.getChoices('notes')['validationNotes.sidekickEdge'];
  SWADE.talentRules(rules, edges, features, goodies, hindrances, skills);
  for(let e in edges)
    SWADESPC.edgeRulesExtra(rules, e, edges[e]);
  for(let h in hindrances)
    SWADESPC.hindranceRulesExtra(rules, h, hindrances[h]);
  // Override SWADE maximum points from hindrances for supers
  rules.defineRule('hindrancePoints',
    '', 'v', 'null',
    'maximumHindrancePoints', 'v', null
  );
  rules.defineRule('maximumHindrancePoints',
    '', '=', '4',
    'superPowerPoints', '^', '6'
  );
};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
SWADESPC.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Super Power') {
    SWADESPC.superPowerRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'SuperPowerPoints'),
      QuilvynUtils.getAttrValue(attrs, 'Range'),
      QuilvynUtils.getAttrValue(attrs, 'Description'),
      QuilvynUtils.getAttrValueArray(attrs, 'Modifier')
    );
    rules.addChoice('superPowers', name, attrs);
  } else {
    rules.spcReplacedChoiceRules(rules, type, name, attrs);
  }
};

/*
 * Defines in #rules# the rules associated with edge #name# that cannot be
 * derived directly from the attributes passed to edgeRules.
 */
SWADESPC.edgeRulesExtra = function(rules, name) {
  let matchInfo;
  if((matchInfo = name.match(/^Super Powers (I|II|III|IV|V)$/))) {
    // Super Powers edges are free
    rules.defineRule('edgePoints', 'features.' + name, '+', '1');
    rules.defineRule('superPowerEdgeCount', 'features.' + name, '+=', '1');
    rules.defineRule('superPowerPoints',
      'features.' + name, '=', matchInfo[1]=='V' ? 75 : matchInfo[1] == 'IV' ? 60 : (15 * matchInfo.length)
    );
    rules.defineRule
      ('powerLimit', 'superPowerPoints', '=', 'Math.floor(source / 3)');
  }
};

/*
 * Defines in #rules# the rules associated with hindrance #name# that cannot be
 * derived directly from the attributes passed to hindranceRules.
 */
SWADESPC.hindranceRulesExtra = function(rules, name) {
  if(name == 'Grim') {
    // Fulfills prereq for Menacing edge
    rules.defineRule
      ('validationNotes.menacingEdgeAlt.0', 'features.Grim', '+', '1');
  }
};

/*
 * Defines in #rules# the rules associated with power #name#, which requires
 * #superPowerPoints# Super Power Points to acquir, and can be cast at range
 * #range#. #description# is a concise description of the power's effects and
 * #modifiers# lists the super power point cost and effects of any
 * power-specific modifiers.
 */
SWADESPC.superPowerRules = function(
  rules, name, superPowerPoints, range, description, modifiers
) {
  // FILL
  rules.defineRule('allocatedSuperPowerPoints',
    'superPowers.' + name, '+=', superPowerPoints
  );
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
SWADESPC.randomizeOneAttribute = function(attributes, attribute) {
  if(attribute == 'superPowers') {
  } else {
    return this.spcReplacedRandomizer(attributes, attribute);
  }
};

/* Returns HTML body content for user notes associated with this rule set. */
SWADESPC.ruleNotes = function() {
  return '' +
    '<h2>SWADE Super Powers Companion Quilvyn Module Notes</h2>\n' +
    'SWADE Super Powers Companion Quilvyn Module Version ' + SWADESPC.VERSION + '\n' +
    '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '  Quilvyn provides five different Super Power edges to reflect the five ' +
    '  possible campaign power levels.\n' +
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
    'Savage Worlds Adventure Edition Super Powers Companion ' +
    '© 2021 Pinnacle Entertainment Group.\n' +
    '</p>\n' +
    '<img alt="Savage Worlds Fan Logo" width="300" height="200" src="https://peginc.com/wp-content/uploads/2019/01/SW_LOGO_FP_2018.png"/>\n';
};
