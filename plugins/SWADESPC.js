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
  rules.defineChoice('choices', 'Super Power', 'Super Power Modifier');
  rules.defineChoice('random', 'superPowers');
  rules.spcReplacedChoiceRules = rules.choiceRules;
  rules.choiceRules = SWADESPC.choiceRules;
  rules.spcReplacedRandomizer = rules.randomizeOneAttribute;
  rules.randomizeOneAttribute = SWADESPC.randomizeOneAttribute;
  SWADESPC.combatRules(rules, SWADESPC.ARMORS, SWADESPC.SHIELDS, SWADESPC.WEAPONS);
  SWADESPC.arcaneRules
    (rules, SWADESPC.ARCANAS, SWADESPC.POWERS, SWADESPC.SUPER_POWERS,
     SWADESPC.SUPER_POWER_MODIFIERS);
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
    'Cost=2 ' +
    'Modifiers=' +
      '"Achilles Heel","Additional Power Type",Growth,Mastery,Reflection,' +
      'Transference,Transmute ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Additional Actions':
    'Cost=5 ' +
    'Modifiers=' +
      'Concentration,Evaluation,"Fast Action","Mental Only","Physical Only" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Ageless':
    'Cost=1 ' +
    'Modifiers=' +
      '"Very Old" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Altered Form':
    'Cost=2 ' +
    'Modifiers=' +
      '"Fall Proof",Grappler,Reach,"Requires Activation",Sticky,Viscous,' +
      'Yield ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Animal Companion':
    'Cost=3 ' +
    'Modifiers=' +
      'Intelligent,Speech,Summonable,"Super Powers","Telepathic Link" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Animal Control':
    'Cost=Special ' +
    'Modifiers=' +
      '"Requires Touch",Summonable,"Telepathic Link" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Aquatic':
    'Cost=1 ' +
    'Modifiers=' +
      '"Fast Swimmer" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Armor':
    'Cost=1 ' +
    'Modifiers=' +
      '"Heavy Armor","Partial Protection","Requires Activation",Sealed ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Awareness':
    'Cost=1 ' +
    'Modifiers=' +
      '"Requires Activation" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Blind':
    'Cost=1 ' +
    'Modifiers=' +
      '"Area Effect",Strong ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Boost/Lower Trait':
    'Cost=2 ' +
    'Modifiers=' +
      '"Additional Recipients","Any Trait",Leech,Power,"Requires Touch" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Broadcast':
    'Cost=2 ' +
    'Modifiers=' +
      '"Channel Surfer",Manipulation,Range ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Burrowing':
    'Cost=1 ' +
    'Modifiers=' +
      '"Block Buster",Pace,Tunneler ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Chameleon':
    'Cost=3 ' +
    'Modifiers=' +
      '"Inanimate Object",Biometrics,"Requires Touch" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Construct':
    'Cost=8 ' +
    'Modifiers=' +
      'Dependency ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Copycat':
    'Cost=1 ' +
    'Modifiers=' +
      'Arcane,Devices,Duration,"Overly Accurate","Partial Power",' +
      '"Requires Touch" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Damage Field':
    'Cost=Special ' +
    'Modifiers=' +
      '"Armor Piercing","Area Effect",Lethal,Permanent ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Deadeye':
    'Cost=2 ' +
    'Modifiers=' +
      'Deadly ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Decay':
    'Cost=2 ' +
    'Modifiers=' +
      '"Area Effect","Midas Touch",Strong,"Requires Touch" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Dodge':
    'Cost=1 ' +
    'Modifiers=' +
      'Defender,Deflect,"Requires Activation" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  "Doesn't Breathe":
    'Cost=1 ' +
    'Modifiers=' +
      'Extreme ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  "Doesn't Eat":
    'Cost=1 ' +
    'Modifiers=' +
      'Extreme ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  "Doesn't Sleep":
    'Cost=1 ' +
    'Modifiers=' +
      'Tireless ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Duplication':
    'Cost=4 ' +
    'Modifiers=' +
      'Equipped,Leashed,"No Tell",Promotion ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Earthquake':
    'Cost=2 ' +
    'Modifiers=' +
      'Strong ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Energy Control':
    'Cost=5 ' +
    'Modifiers=' +
      '"Additional Power Type","Area Effect",Power,"Requires Material" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Entangle':
    'Cost=3 ' +
    'Modifiers=' +
      '"Area Effect",Deadly,"Requires Material","Requires Touch",Strong ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Environmental Resistance':
    'Cost=1 ' +
    'Modifiers=' +
      '"Additional Power Type","Area Effect",Immunity,"Requires Activation" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Explode':
    'Cost=2 ' +
    'Modifiers=' +
      '"Big Bang",Failsafe,"Temporary Disintegration" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Extra Limbs':
    'Cost=2 ' +
    'Modifiers=' +
      'Reach ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Fear':
    'Cost=2 ' +
    'Modifiers=' +
      '"Area Effect","Requires Touch",Strong ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Fearless':
    'Cost=2 ' +
    'Modifiers=' +
      'Steady ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Flight':
    'Cost=2 ' +
    'Modifiers=' +
      'FTL,Glider,Maneuverable,Ungainly ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Force Field':
    'Cost=1 ' +
    'Modifiers=' +
      '"Area Effect","Life Support",Mobile,"Requires Activation" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Genius':
    'Cost=2 ' +
    'Modifiers=' +
      '"Fast Learner" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Growth':
    'Cost=3 ' +
    'Modifiers=' +
      'Permanent,Swat ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Hardy':
    'Cost=2 ' +
    'Modifiers= ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Healing':
    'Cost=3 ' +
    'Modifiers=' +
      'Cure,Fatigue,Refresh,"Requires Touch",Restoration,Resurrection ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Heightened Senses (Eagle Eyes)':
    'Cost=1 ' +
    'Modifiers= ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Heightened Senses (Hearing)':
    'Cost=1 ' +
    'Modifiers= ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Heightened Senses (Infravision)':
    'Cost=1 ' +
    'Modifiers= ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Heightened Senses (Low Light Vision)':
    'Cost=1 ' +
    'Modifiers= ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Heightened Senses (Microscopic Vision)':
    'Cost=1 ' +
    'Modifiers= ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Heightened Senses (Smell)':
    'Cost=1 ' +
    'Modifiers= ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Heightened Senses (X-Ray Vision)':
    'Cost=1 ' +
    'Modifiers= ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Illusion':
    'Cost=4 ' +
    'Modifiers=' +
      '"After Effects","Area Effect",Distraction,"Film Quality",Obscurement,' +
      '"System Shock" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Immune To Disease':
    'Cost=1 ' +
    'Modifiers=' +
      '"Cure Disease" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Immune To Poison':
    'Cost=1 ' +
    'Modifiers=' +
      '"Cure Poison" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Infection':
    'Cost=2 ' +
    'Modifiers=' +
      'Affliction,"Area Effect",Contagious,Duration,Lethal,Mutation,' +
      'Replication,"Requires Touch",Strong ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Intangibility':
    'Cost=5 ' +
    'Modifiers=' +
      '"Affect Others",Permanent,"Requires Activation" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Interface':
    'Cost=2 ' +
    'Modifiers=' +
      '"Code Breaker",Fast,Range ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Invisibility':
    'Cost=8 ' +
    'Modifiers=' +
      'Mobile,Permanent,Personal,Projection,"True Invisibility" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Jinx':
    'Cost=4 ' +
    'Modifiers=' +
      '"Greater Jinx" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Leaping':
    'Cost=1 ' +
    'Modifiers=' +
      'Bounce,"Death From Above" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Machine Control':
    'Cost=Special ' +
    'Modifiers=' +
      'Multi-Task,"Requires Touch" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Malfunction':
    'Cost=3 ' +
    'Modifiers=' +
      '"Area Effect","Requires Touch" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Matter Control':
    'Cost=5 ' +
    'Modifiers=' +
      '"Additional Power Type","Area Effect",Power,"Requires Material" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Melee Attack':
    'Cost=2 ' +
    'Modifiers=' +
      '"Armor Piercing",Charge,Smash,"Thrown Weapons" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Mind Control':
    'Cost=5 ' +
    'Modifiers=' +
      'Forgetful,Leashed,"Multiple Minds","Requires Touch",Smarts,Strong ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Mind Reading':
    'Cost=3 ' +
    'Modifiers=' +
      '"Memory Mastery","Requires Touch",Strong ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Mind Shield':
    'Cost=1 ' +
    'Modifiers=' +
      '"Area Effect",Strong ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Minions':
    'Cost=2 ' +
    'Modifiers=' +
      'Resilient,Summonable,"Super Powers" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Negation':
    'Cost=3 ' +
    'Modifiers=' +
      '"Area Effect","Full Spectrum","Requires Touch",Strong ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'No Vital Organs':
    'Cost=1 ' +
    'Modifiers= ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Object Reading':
    'Cost=2 ' +
    'Modifiers=' +
      '"Requires Touch" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Obscure':
    'Cost=4 ' +
    'Modifiers=' +
      '"Additional Sense","Area Effect",Self,Strong ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Pace':
    'Cost=2 ' +
    'Modifiers=' +
      'Strider ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Parry':
    'Cost=4 ' +
    'Modifiers=' +
      'Deflect,Protector ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Poison':
    'Cost=4 ' +
    'Modifiers=' +
      '"Area Effect",Deadly,Strong,"Requires Touch" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Possession':
    'Cost=5 ' +
    'Modifiers=' +
      'Forgetful,Memories,"Requires Touch",Strong ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Push':
    'Cost=1 ' +
    'Modifiers=' +
      'Strong ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Ranged Attack':
    'Cost=3 ' +
    'Modifiers=' +
      '"Armor Piercing","Area Effect",Charge,Cone,Lethal,"Rate Of Fire",' +
      '"Requires Material",Spread ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Reach':
    'Cost=1 ' +
    'Modifiers= ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Regeneration':
    'Cost=2 ' +
    'Modifiers=' +
      'Destruction,Relief,Regrowth ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Scan':
    'Cost=2 ' +
    'Modifiers=' +
      '"Additional Power Type",Calibration,Distance,Tracker ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Shape Change':
    'Cost=2 ' +
    'Modifiers=' +
      'Powers,Primal,Retention,Speech ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Shrink':
    'Cost=4 ' +
    'Modifiers=' +
      'Density,Microscopic,"Quick Change",Smaller ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Skill Bonus':
    'Cost=2 ' +
    'Modifiers=' +
      '"Greater Jinx" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Slow':
    'Cost=2 ' +
    'Modifiers=' +
      '"Additional Recipients" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Spacer':
    'Cost=2 ' +
    'Modifiers=' +
      '"Requires Activation",Shareable ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Speak Language':
    'Cost=1 ' +
    'Modifiers=' +
      '"Written Word" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Speed':
    'Cost=3 ' +
    'Modifiers=' +
      'Maneuverable,Pummel,"Surface Tension",Vibrate,Ungainly ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Stun':
    'Cost=3 ' +
    'Modifiers=' +
      '"Area Effect","Requires Touch",Strong ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Super Attribute':
    'Cost=2 ' +
    'Modifiers=' +
      '"Not Today" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Super Edge':
    'Cost=2 ' +
    'Modifiers= ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Super Skill':
    'Cost=1 ' +
    'Modifiers= ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Super Science':
    'Cost=4 ' +
    'Modifiers=' +
      'Overload ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Super Sorcery':
    'Cost=4 ' +
    'Modifiers=' +
      'Backlash ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Swinging':
    'Cost=2 ' +
    'Modifiers=' +
      '"Strong Line" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Telekinesis':
    'Cost=3 ' +
    'Modifiers=' +
      '"Fine Control",Flight,Power ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Telepathy':
    'Cost=2 ' +
    'Modifiers=' +
      'Range,"Mind Rider",Switchboard ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Teleport':
    'Cost=2 ' +
    'Modifiers=' +
      'Portal,Range,"Rapid Teleport",Redirect,"Teleport Other",Traverse ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Toughness':
    'Cost=1 ' +
    'Modifiers=' +
      '"Requires Activation" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Uncanny Reflexes':
    'Cost=3 ' +
    'Modifiers=' +
      '"Requires Activation" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Undead':
    'Cost=8 ' +
    'Modifiers=' +
      '"Spark Of Life" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Vehicle':
    'Cost=1 ' +
    'Modifiers=' +
      'Armored,"Bulletproof Glass",Enclosed,"Ejection Seats",Flight,Handling,' +
      'Passengers,Size,"Super Powers",Weapons ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Wall Walker':
    'Cost=1 ' +
    'Modifiers=' +
      '"Strong Grip" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Weather Control':
    'Cost=7 ' +
    'Modifiers=' +
      '"Outdoor Only" ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"',
  'Whirlwind':
    'Cost=3 ' +
    'Modifiers=' +
      '"Area Effect",Damage,Cone,Strong ' +
    'Section=feature ' +
    'Note=' +
      '"FILL"'
};
SWADESPC.SUPER_POWER_MODIFIERS = {
  'Achilles Heel':'Cost=-1',
  'Additional Power Type':'Cost=1,2,4,8',
  'Additional Recipients':'Cost=1',
  'Additional Sense':'Cost=1',
  'Affect Others':'Cost=2',
  'Affliction':'Cost=2',
  'After Effects':'Cost=1',
  'Alternate Trait':'Cost=1',
  'Any Trait':'Cost=2',
  'Arcane':'Cost=2',
  'Area Effect':'Cost=2,3,4', // TODO
  'Armor Piercing':'Cost=1',
  'Armored':'Cost=2,4',
  'Backlash':'Cost=-1',
  'Big Bang':'Cost=2',
  'Biometrics':'Cost=2',
  'Block Buster':'Cost=1',
  'Bounce':'Cost=1',
  'Bulletproof Glass':'Cost=1',
  'Calibration':'Cost=2',
  'Channel Surfer':'Cost=1',
  'Charge':'Cost=1',
  'Code Breaker':'Cost=1',
  'Concentration':'Cost=2',
  'Cone':'Cost=1',
  'Contagious':'Cost=1',
  'Contingent':'Cost=0',
  'Cure':'Cost=2',
  'Cure Disease':'Cost=2',
  'Cure Poison':'Cost=1',
  'Damage':'Cost=2',
  'Deadly':'Cost=1,2,4',
  'Death From Above':'Cost=1',
  'Defender':'Cost=2,4',
  'Deflect':'Cost=2',
  'Density':'Cost=5',
  'Dependency':'Cost=-2',
  'Destruction':'Cost=-1',
  'Device':'Cost=-1',
  'Devices':'Cost=2',
  'Distance':'Cost=1,2',
  'Distraction':'Cost=1',
  'Duration':'Cost=1,3',
  'Ejection Seats':'Cost=1',
  'Enclosed':'Cost=1',
  'Equipped':'Cost=2',
  'Evaluation':'Cost=2',
  'Extreme':'Cost=1',
  'FTL':'Cost=1',
  'Failsafe':'Cost=1',
  'Fall Proof':'Cost=1',
  'Fast':'Cost=2',
  'Fast Action':'Cost=2',
  'Fast Learner':'Cost=1',
  'Fast Swimmer':'Cost=1,2',
  'Fatigue':'Cost=2',
  'Film Quality':'Cost=1',
  'Fine Control':'Cost=3',
  'Flight':'Cost=1,2',
  'Forgetful':'Cost=2',
  'Full Spectrum':'Cost=3',
  'Glider':'Cost=-1',
  'Grappler':'Cost=1',
  'Greater Jinx':'Cost=2',
  'Growth':'Cost=3',
  'Handling':'Cost=1,2',
  'Heavy Armor':'Cost=4',
  'Heavy Weapon':'Cost=1',
  'Immunity':'Cost=2',
  'Inanimate Object':'Cost=2',
  'Intelligent':'Cost=2',
  'Leashed':'Cost=-2',
  'Leech':'Cost=2',
  'Lethal':'Cost=-1,1',
  'Life Support':'Cost=2',
  'Limitation':'Cost=-1',
  'Linked':'Cost=2',
  'Maneuverable':'Cost=1',
  'Manipulation':'Cost=1,3',
  'Mastery':'Cost=1',
  'Memories':'Cost=2',
  'Memory Mastery':'Cost=3,5',
  'Mental Only':'Cost=-1',
  'Microscopic':'Cost=3',
  'Midas Touch':'Cost=-2',
  'Mind Rider':'Cost=3',
  'Mobile':'Cost=1',
  'Multi-Task':'Cost=2,4',
  'Multiple Minds':'Cost=2',
  'Mutation':'Cost=1',
  'No Tell':'Cost=1',
  'Not Today':'Cost=2',
  'Obscurement':'Cost=2',
  'Outdoor Only':'Cost=-2',
  'Overload':'Cost=-1',
  'Overly Accurate':'Cost=-2',
  'Pace':'Cost=1',
  'Partial Power':'Cost=2',
  'Partial Protection':'Cost=-1,-2',
  'Passengers':'Cost=1,2,4',
  'Permanent':'Cost=-2',
  'Personal':'Cost=-2',
  'Physical Only':'Cost=-1',
  'Portal':'Cost=2',
  'Power':'Cost=2,5',
  'Powers':'Cost=4',
  'Primal':'Cost=-4',
  'Projection':'Cost=3,6',
  'Promotion':'Cost=2',
  'Protector':'Cost=2',
  'Pummel':'Cost=4',
  'Quick Change':'Cost=1',
  'Range':'Cost=1,2',
  'Rapid Teleport':'Cost=1',
  'Rate Of Fire':'Cost=3,6',
  'Reach':'Cost=1',
  'Redirect':'Cost=4',
  'Reflection':'Cost=2',
  'Refresh':'Cost=2',
  'Regrowth':'Cost=2',
  'Relief':'Cost=2',
  'Replication':'Cost=1',
  'Requires Activation':'Cost=-1',
  'Requires Material':'Cost=-1,-2',
  'Requires Touch':'Cost=-2',
  'Resilient':'Cost=1',
  'Restoration':'Cost=2',
  'Resurrection':'Cost=2',
  'Retention':'Cost=4',
  'Sealed':'Cost=2',
  'Selective':'Cost=1',
  'Self':'Cost=-1',
  'Shareable':'Cost=1',
  'Size':'Cost=1',
  'Smaller':'Cost=8,16',
  'Smarts':'Cost=1',
  'Smash':'Cost=3',
  'Spark Of Life':'Cost=2',
  'Speech':'Cost=1,2',
  'Spread':'Cost=1',
  'Steady':'Cost=2',
  'Sticky':'Cost=2',
  'Strider':'Cost=1',
  'Strong':'Cost=1,2',
  'Strong Grip':'Cost=1',
  'Strong Line':'Cost=1',
  'Summonable':'Cost=2,4',
  'Super Powers':'Cost=2,3,5,8',
  'Surface Tension':'Cost=1',
  'Swat':'Cost=1,2',
  'Switchable':'Cost=1',
  'Switchboard':'Cost=2',
  'System Shock':'Cost=2',
  'Telepathic Link':'Cost=1,2',
  'Teleport Other':'Cost=5',
  'Temporary Disintegration':'Cost=-1',
  'Thrown Weapons':'Cost=2',
  'Tireless':'Cost=1',
  'Tracker':'Cost=1',
  'Transference':'Cost=2',
  'Transmute':'Cost=3',
  'Traverse':'Cost=3',
  'True Invisibility':'Cost=2',
  'Tunneler':'Cost=1',
  'Ungainly':'Cost=-2',
  'Very Old':'Cost=2',
  'Vibrate':'Cost=5',
  'Viscous':'Cost=2',
  'Weapons':'Cost=1,2,3,4',
  'Written Word':'Cost=1',
  'Yield':'Cost=1'
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
SWADESPC.arcaneRules = function(
  rules, arcanas, powers, superPowers, superPowerModifiers
) {
  SWADE.arcaneRules(rules, arcanas, powers);
  QuilvynUtils.checkAttrTable
    (superPowers, ['Cost', 'Note', 'Section', 'Modifiers']);
  QuilvynUtils.checkAttrTable(superPowerModifiers, ['Cost', 'Note', 'Powers']);
  rules.defineEditorElement
    ('superPowerSelections', 'Super Powers', 'setbag', 'superPowerSelections',
     'powers');
  rules.defineSheetElement('Super Power Points', 'Power Count');
  rules.defineSheetElement('Super Powers', 'Powers');
  for(let spm in superPowerModifiers) {
    rules.choiceRules
      (rules, 'Super Power Modifier', spm, superPowerModifiers[spm]);
  }
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
      QuilvynUtils.getAttrValue(attrs, 'Cost'),
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note'),
      QuilvynUtils.getAttrValueArray(attrs, 'Modifiers')
    );
    rules.addChoice('superPowers', name, attrs);
  } else if(type == 'Super Power Modifier') {
    SWADESPC.superPowerModifierRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Cost'),
      QuilvynUtils.getAttrValue(attrs, 'Note'),
      QuilvynUtils.getAttrValueArray(attrs, 'Powers'),
    );
    rules.addChoice('superPowerModifiers', name, attrs);
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
 * FILL
 */
SWADESPC.superPowerRules = function(
  rules, name, cost, section, note, modifiers
) {
  // FILL
  let baseName = name + ' (Base: ' + cost + ' SPP)';
  let baseSelection = 'superPowerSelections.' + baseName;
  rules.addChoice('superPowerSelections', baseName, '');
  rules.defineRule('superPowers.' + name, baseSelection, '=', '1');
  rules.defineRule
    ('allocatedSuperPowerPoints', baseSelection, '+=', cost + ' * source');
  // TODO
  rules.defineChoice('notes', 'superPowers.' + name + ':' + note);
  let allModifiers = rules.getChoices('superPowerModifiers');
  for(let i = 0; i < modifiers.length; i++) {
    let m = modifiers[i];
    if(!allModifiers || !(m in allModifiers)) {
      console.log('Unknown super power modifier "' + m + '"');
      continue;
    }
    let costs = QuilvynUtils.getAttrValueArray(allModifiers[m], 'Cost') || [1];
    let modifierName = name + ' (' + m + ': ' + costs.join('/') + ' SPP)';
    let modifierSelection = 'superPowerSelections.' + modifierName;
    rules.addChoice('superPowerSelections', modifierName, '');
    rules.defineRule(baseSelection, modifierSelection, '=', '1');
    // Replace costs w/cumulative values for computing allocated points
    for(let j = 1; j < costs.length; j++)
      costs[j] += costs[j - 1];
    rules.defineRule('allocatedSuperPowerPoints',
      modifierSelection, '+', costs.length==1 ? costs[0] + ' * source' : ('[' + costs.join(', ') + '][source - 1] || ' + costs[costs.length - 1])
    );
  }
};

/*
 * FILL
 */
SWADESPC.superPowerModifierRules = function( rules, name, cost, note, powers) {
  // FILL
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
