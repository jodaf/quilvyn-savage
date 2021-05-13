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

var SWADE_VERSION = '2.2.1.0';

/*
 * This module loads the rules from the Savage Worlds Adventure Edition Core
 * Rules. The SWADE function contains methods that load rules for particular
 * parts of the rules: raceRules for character races, powerRules for powers,
 * etc. These member methods can be called independently in order to use a
 * subset of the SWADE rules. Similarly, the constant fields of SWADE
 * (SKILLS, EDGES, etc.) can be manipulated to modify the choices.
 */
function SWADE() {

  var rules = new QuilvynRules('Savage Worlds', SWADE_VERSION);
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
    'edges', 'edgeCount', 'hinderences', 'sanityNotes', 'validationNotes'
  );
  rules.defineChoice('preset',
    'race:Race,select-one,races', 'advances:Advances,select-one,[0,1,2,3,4,5]');

  SWADE.attributeRules(rules);
  SWADE.combatRules(rules, SWADE.ARMORS, SWADE.SHIELDS, SWADE.WEAPONS);
  SWADE.magicRules(rules, SWADE.POWERS);
  SWADE.identityRules(rules, SWADE.RACES);
  SWADE.talentRules
    (rules, SWADE.EDGES, SWADE.FEATURES, SWADE.GOODIES, SWADE.HINDRANCES,
     SWADE.SKILLS);

  Quilvyn.addRuleSet(rules);

}

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
  'agility', 'smarts', 'spirit', 'strength', 'vigor',
  'name', 'race', 'gender', 'advancements', 'features', 'edges', 'hindrances',
  'skills', 'armor', 'weapons', 'shield', 'powers'
];
SWADE.VIEWERS = ['Collected Notes', 'Compact', 'Standard'];

SWADE.ATTRIBUTES = {
  'Agility':'',
  'Smarts':'',
  'Spirit':'',
  'Strength':'',
  'Vigor':''
};
SWADE.ARMORS = {
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
SWADE.DIES = ['0', 'd4', 'd6', 'd8', 'd10', 'd12', 'd12+1', 'd12+2'];
SWADE.EDGES = {
  'Alertness':'Require="advancement == \'Novice\'"',
  'Ambidextrous':'Require="advancement == \'Novice\'","agility >= 2"',
  'Arcane Background':'Require="advancement == \'Novice\'"'
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
  'Clueless':'Level=Major',
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
  'Young (Minor)':'Level=Minor',
};
SWADE.FEATURES = {
};
SWADE.GOODIES = {
};
SWADE.RACES = {
  'Android':'',
  'Aquarian':'',
  'Avion':'',
  'Dwarf':'',
  'Elf':'',
  'Half-Elf':'',
  'Half-Folk':'',
  'Human':'',
  'Rakashan':'',
  'Saurian':''
};
SWADE.SHIELDS = {
  'None':'AC=0',
  'Shield':'AC=2'
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
SWADE.POWERS = {
};
SWADE.WEAPONS = {
};

/* Defines the rules related to character abilities. */
SWADE.attributeRules = function(rules) {

  for(var attribute in SWADE.ATTRIBUTES) {
    attribute = attribute.toLowerCase();
    rules.defineRule(attribute + 'Die', attribute, '=', 'SWADE.DIES[source]');
    rules.defineChoice('notes', attribute + ':%V (%1)');
    rules.defineRule(attribute + '.1', attribute + 'Die', '=', null);
  }

  QuilvynRules.validAllocationRules
    (rules, 'attributeBoost', 'attributeBoosts', 'Sum "^(agility|smarts|spirit|strength|vigor)$"');

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

/* Defines rules related to magic use. */
SWADE.magicRules = function(rules, powers) {

  // TODO

};

/* Defines rules related to character aptitudes. */
SWADE.talentRules = function(
  rules, edges, features, goodies, hindrances, skills
) {

  QuilvynUtils.checkAttrTable(edges, ['Require', 'Imply', 'Type']);
  QuilvynUtils.checkAttrTable(features, ['Section', 'Note']);
  QuilvynUtils.checkAttrTable(hindrances, ['Level', 'Require', 'Imply', 'Type']);
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
  else if(type == 'Hindrance') {
    SWADE.hindranceRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValueArray(attrs, 'Type')
    );
    SWADE.hindranceRulesExtra(rules, name);
  } else if(type == 'Race') {
    SWADE.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots')
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
    console.log('Empty feat name');
    return;
  }
  if(!Array.isArray(requires)) {
    console.log('Bad requires list "' + requires + '" for feat ' + name);
    return;
  }
  if(!Array.isArray(implies)) {
    console.log('Bad implies list "' + implies + '" for feat ' + name);
    return;
  }
  if(!Array.isArray(types)) {
    console.log('Bad types list "' + types + '" for feat ' + name);
    return;
  }

  var prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');

  if(requires.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'validation', prefix + 'Feat', 'feats.' + name, requires);
  if(implies.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'sanity', prefix + 'Feat', 'feats.' + name, implies);
  rules.defineRule('features.' + name, 'feats.' + name, '=', null);
  for(var i = 0; i < types.length; i++) {
    if(types[i] != 'General')
      rules.defineRule('sum' + types[i] + 'Feats', 'feats.' + name, '+=', null);
  }

};

/*
 * Defines in #rules# the rules associated with edge #name# that cannot be
 * derived directly from the attributes passed to edgeRules.
 */
SWADE.edgeRulesExtra = function(rules, name) {
  // TODO
};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
SWADE.featureRules = function(rules, name, sections, notes) {
  // TBD Move out of SRD35
  SRD35.featureRules(rules, name, sections, notes);
  for(var i = 0; i < notes.length; i++) {
    var matchInfo = notes[i].match(/^([A-Z]\w*)\sProficiency\s\((.*)\)$/);
    if(!matchInfo)
      continue;
    var group = matchInfo[1].toLowerCase();
    var note = sections[i] + 'Notes.' + name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
    var affected = matchInfo[2].split('/');
    for(var j = 0; j < affected.length; j++) {
      matchInfo = affected[j].match(/^Choose\s(\d+)/);
      if(matchInfo)
        rules.defineRule(group + 'ChoiceCount', note, '+=', matchInfo[1]);
      else
        rules.defineRule(group + 'Proficiency.' + affected[j], note, '=', '1');
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
 * ("attribute", "combat", "companion", "feature", "magic", "save", or "skill")
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
SWADE.hindranceRules = function(rules, name, level, requires, implies, types) {
};

/*
 * Defines in #rules# the rules associated with hindrance #name# that cannot be
 * derived directly from the attributes passed to hindranceRules.
 */
SWADE.hindranceRulesExtra = function(rules, name) {
  // TODO
};

/*
 * Defines in #rules# the rules associated with race #name#, which has the list
 * of hard prerequisites #requires#. #features# and #selectables# list
 * associated features and #languages# any automatic languages. If the race
 * grants spell slots, #spellAbility# names the ability for computing spell
 * difficulty class, and #spellSlots# lists the number of spells per level per
 * day granted.
 */
SWADE.raceRules = function(
  rules, name, requires, features, selectables, languages, spellAbility,
  spellSlots
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
  if(spellAbility) {
    spellAbility = spellAbility.toLowerCase();
    if(!(spellAbility.charAt(0).toUpperCase() + spellAbility.substring(1) in SWADE.ATTRIBUTES)) {
      console.log('Bad spell ability "' + spellAbility + '" for class ' + name);
      return;
    }
  }
  if(!Array.isArray(spellSlots)) {
    console.log('Bad spellSlots list "' + spellSlots + '" for race ' + name);
    return;
  }

  var matchInfo;
  var prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  var raceLevel = prefix + 'Level';

  rules.defineRule(raceLevel,
    'race', '?', 'source == "' + name + '"',
    'level', '=', null
  );

  if(requires.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'validation', prefix + 'Race', raceLevel, requires);

  SWADE.featureListRules(rules, features, name, raceLevel, false);
  SWADE.featureListRules(rules, selectables, name, raceLevel, true);
  rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');

  if(languages.length > 0) {
    rules.defineRule('languageCount', raceLevel, '=', languages.length);
    for(var i = 0; i < languages.length; i++) {
      if(languages[i] != 'any')
        rules.defineRule('languages.' + languages[i], raceLevel, '=', '1');
    }
  }

  if(spellSlots.length > 0) {

    rules.defineRule('casterLevels.' + name, raceLevel, '=', null);
    QuilvynRules.spellSlotRules(rules, 'casterLevels.' + name, spellSlots);

    for(var i = 0; i < spellSlots.length; i++) {
      var matchInfo = spellSlots[i].match(/^(\D+)(\d):/);
      if(!matchInfo) {
        console.log('Bad format for spell slot "' + spellSlots[i] + '"');
        continue;
      }
      var spellLevel = matchInfo[2] * 1;
      var spellType = matchInfo[1];
      if(spellType != name)
        rules.defineRule
          ('casterLevels.' + spellType, 'casterLevels.' + name, '^=', null);
      rules.defineRule('spellAttackModifier.' + spellType,
        'casterLevels.' + spellType, '?', null,
        spellAbility + 'Modifier', '=', null,
        'proficiencyBonus', '+', null
      );
      rules.defineRule('spellDifficultyClass.' + spellType,
        'casterLevels.' + spellType, '?', null,
        spellAbility + 'Modifier', '=', '8 + source',
        'proficiencyBonus', '+', null
      );
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
      ('abilityBoosts', 'abilityNotes.half-ElfAbilityAdjustment', '+=', '2');
  } else if(name == 'Half-Elf') {
    rules.defineRule
      ('skillProficiency.Intimidation', 'skillNotes.menacing', '=', '1');
  } else if(name == 'Dragonborn') {
    rules.defineRule('combatNotes.draconicBreath',
      'level', '=', 'Math.floor((source + 9) / 5)'
    );
    rules.defineRule('combatNotes.draconicBreath.1',
      'race', '=', 'source == "Dragonborn" ? "5\'x30\' line" : null',
      'dragonbornFeatures.Gold Draconic Ancestry', '=', '"15\' cone"',
      'dragonbornFeatures.Green Draconic Ancestry', '=', '"15\' cone"',
      'dragonbornFeatures.Red Draconic Ancestry', '=', '"15\' cone"',
      'dragonbornFeatures.Silver Draconic Ancestry', '=', '"15\' cone"',
      'dragonbornFeatures.White Draconic Ancestry', '=', '"15\' cone"'
    );
    rules.defineRule('combatNotes.draconicBreath.2',
      'race', '=', 'source == "Dragonborn" ? "fire" : null',
      'dragonbornFeatures.Black Draconic Ancestry', '=', '"acid"',
      'dragonbornFeatures.Blue Draconic Ancestry', '=', '"lightning"',
      'dragonbornFeatures.Bronze Draconic Ancestry', '=', '"lightning"',
      'dragonbornFeatures.Copper Draconic Ancestry', '=', '"acid"',
      'dragonbornFeatures.Green Draconic Ancestry', '=', '"poison"',
      'dragonbornFeatures.Silver Draconic Ancestry', '=', '"cold"',
      'dragonbornFeatures.White Draconic Ancestry', '=', '"cold"'
    );
    rules.defineRule('combatNotes.draconicBreath.4',
      'combatNotes.draconicBreath.2', '=', 'source.match(/cold|poison/) ? "Con" : "Dex"'
    );
    rules.defineRule
      ('saveNotes.draconicBreath', 'combatNotes.draconicBreath.2', '=', null);
    rules.defineRule('selectableFeatureCount.Dragonborn',
      'race', '=', 'source == "Dragonborn" ? 1 : null'
    );
  } else if(name.match(/Dwarf/)) {
    rules.defineRule
      ('abilityNotes.armorSpeedAdjustment', 'abilityNotes.steady', '^', '0');
    rules.defineRule('combatNotes.dwarvenToughness', 'level', '=', null);
  } else if(name.match(/Elf/)) {
    rules.defineRule
      ('skillProficiency.Perception', 'skillNotes.keenSenses', '=', '1');
  } else if(name == 'Tiefling') {
    rules.defineRule('magicNotes.infernalLegacy',
      'race', '?', 'source == "Tiefling"',
      'level', '=',
        'source<3 ? "<i>Thaumaturgy</i> cantrip" : ' +
        'source<5 ? "<i>Thaumaturgy</i> cantrip, <i>Hellish Rebuke</i> 1/long rest" : ' +
        '"<i>Thaumaturgy</i> cantrip, <i>Hellish Rebuke</i> 1/long rest, <i>Darkness</i> 1/long rest"'
    );
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
    if(!(attribute.charAt(0).toUpperCase() + attribute.substring(1) in SWADE.ATTRIBUTES)) {
      console.log('Bad attribute "' + ability + '" for skill ' + name);
      return;
    }
  }

  rules.defineChoice
      ('notes', 'skills.' + name + ':(' + attribute.substring(0, 3) + ') %V (%1)');
  rules.defineRule
    ('skillDie.' + name, 'skills.' + name, '=', 'SWADE.DIES[source]');
  rules.defineRule('skills.' + name + '.1', 'skillDie.' + name, '=', null);

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
            {name: 'Hit Points', within: 'Section 1', format: '<b>HP</b> %V'},
            {name: 'Initiative', within: 'Section 1', format: '<b>Initiative</b> %V'},
            {name: 'Speed', within: 'Section 1', format: '<b>Speed</b> %V'},
            {name: 'Armor Class', within: 'Section 1', format: '<b>AC</b> %V'},
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
            {name: 'Skill Die', within: 'Section 2', separator: '/'},
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
            {name: 'ExperienceInfo', within: 'AbilityStats', separator: ''},
              {name: 'Experience', within: 'ExperienceInfo'},
              {name: 'Experience Needed', within: 'ExperienceInfo',
               format: '/%V'},
            {name: 'Advancement', within: 'AbilityStats'},
            {name: 'Speed', within: 'AbilityStats'},
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
          {name: 'Ability Notes', within: 'Attributes', separator: noteSep}
        );
      }
      viewer.addElements(
        {name: 'FeaturesAndSkills', within: '_top', separator: outerSep,
         format: '<b>Features/Skills</b><br/>%V'},
          {name: 'Edges', within: 'FeaturesAndSkills', separator: ';'},
          {name: 'Hindrances', within: 'FeaturesAndSkills', separator: ';'}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
            {name: 'Feature Notes', within: 'FeaturePart', separator: noteSep}
        );
      } else {
        viewer.addElements(
          {name: 'AllNotes', within: 'FeaturePart', separator: '\n', columns: "1L"},
            {name: 'Ability Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Feature Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Skill Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Combat Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Save Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Magic Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"}
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
              {name: 'Hit Points', within: 'CombatStats'},
              {name: 'Initiative', within: 'CombatStats'},
              {name: 'Armor Class', within: 'CombatStats'},
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
        {name: 'Magic', within: '_top', separator: outerSep,
         format: '<b>Magic</b><br/>%V'},
          {name: 'SpellPart', within: 'Magic', separator: '\n'},
            {name: 'SpellStats', within: 'SpellPart', separator: innerSep},
              {name: 'Spells Known', within: 'SpellStats', separator: listSep},
              {name: 'Spell Slots', within: 'SpellStats', separator:listSep},
              {name: 'Spell Attack Modifier', within: 'SpellStats',
               format: '<b>Attack</b>: %V', separator: listSep},
              {name: 'Spell Difficulty Class', within: 'SpellStats',
               format: '<b>Spell DC</b>: %V', separator: listSep},
          {name: 'Spells', within: 'Magic', columns: '1L', separator: null}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
          {name: 'Magic Notes', within: 'Magic', separator: noteSep}
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
  else if(type == 'Feat')
    result.push(
      ['Require', 'Prerequisites', 'text', [40]],
      ['Imply', 'Implies', 'text', [40]],
      ['Type', 'Types', 'text', [20]]
    );
  else if(type == 'Feature') {
    var sections =
      ['ability', 'combat', 'companion', 'feature', 'magic', 'skill'];
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
  var attributeChoices = [1, 2, 3, 4, 5];
  var traitChoices = [0, 1, 2, 3, 4, 5];
  var editorElements = [
    ['name', 'Name', 'text', [20]],
    ['race', 'Race', 'select-one', 'races'],
    ['experience', 'Experience', 'text', [8]],
    ['levels', 'Class Levels', 'bag', 'levels'],
    ['imageUrl', 'Image URL', 'text', [20]],
    ['background', 'Background', 'select-one', 'backgrounds'],
    ['agility', 'Agility', 'select-one', attributeChoices],
    ['smarts', 'Smarts', 'select-one', attributeChoices],
    ['spirit', 'Spirit', 'select-one', attributeChoices],
    ['strength', 'Srength', 'select-one', attributeChoices],
    ['vigor', 'Vigor', 'select-one', attributeChoices],
    ['player', 'Player', 'text', [20]],
    ['alignment', 'Alignment', 'select-one', 'alignments'],
    ['gender', 'Gender', 'text', [10]],
    ['deity', 'Deity', 'select-one', 'deities'],
    ['origin', 'Origin', 'text', [20]],
    ['feats', 'Feats', 'set', 'feats'],
    ['selectableFeatures', 'Selectable Features', 'set', 'selectableFeatures'],
    ['skills', 'Skills', 'bag', 'skills'],
    ['toolsChosen', 'Tools', 'set', 'tools'],
    ['languages', 'Languages', 'set', 'languages'],
    ['hitPoints', 'Hit Points', 'text', [4]],
    ['armor', 'Armor', 'select-one', 'armors'],
    ['shield', 'Shield', 'select-one', 'shields'],
    ['weapons', 'Weapons', 'bag', 'weapons'],
    ['weaponsChosen', 'Proficiency', 'set', 'weapons'],
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

  if(attribute == 'armor') {
    var armors = this.getChoices('armors');
    attrs = this.applyRules(attributes);
    choices = [];
    for(attr in armors) {
      var weight = QuilvynUtils.getAttrValue(armors[attr], 'Weight');
      if(weight == null)
        weight = 0;
      else if((weight + '').match(/light/i))
        weight = 1;
      else if((weight + '').match(/medium/i))
        weight = 2;
      else if((weight + '').match(/heavy/i))
        weight = 3;
      if(weight == 0 ||
         attrs['armorProficiency.Heavy'] ||
         weight <= 2 && attrs['armorProficiency.Medium'] ||
         weight == 1 && attrs['armorProficiency.Light'] ||
         attrs['armorProficiency.' + attr])
        choices.push(attr);
    }
    attributes['armor'] = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'boosts') {
    var attrs = this.applyRules(attributes);
    howMany = (attrs.abilityBoosts || 0) - QuilvynUtils.sumMatching(attributes, /Adjust$/);
    while(howMany > 0) {
      attr = QuilvynUtils.randomKey(SWADE.ATTRIBUTES).toLowerCase();
      if(attributes[attr + 'Adjust'] == null)
        attributes[attr + 'Adjust'] = 1;
      else
        attributes[attr + 'Adjust'] += 1;
      howMany--;
    }
  } else if(attribute == 'deity') {
    /* Pick a deity that's no more than one alignment position removed. */
    var aliInfo = attributes.alignment.match(/^([CLN]).*\s([GEN])/);
    var aliPat;
    if(aliInfo == null) /* Neutral character */
      aliPat = 'N[EG]?|[CL]N';
    else if(aliInfo[1] == 'N') /* NG or NE */
      aliPat = 'N|[CLN]' + aliInfo[2];
    else if(aliInfo[2] == 'N') /* CN or LN */
      aliPat = 'N|' + aliInfo[1] + '[GNE]';
    else /* [LC]G or [LC]E */
      aliPat = aliInfo[1] + '[N' + aliInfo[2] + ']|N' + aliInfo[2];
    choices = [];
    var deities = this.getChoices('deities');
    for(attr in deities) {
      if(deities[attr].match('=' + aliPat + '\\b'))
        choices.push(attr);
    }
    if(choices.length > 0)
      attributes.deity = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'feats' || attribute == 'features') {
    var debug = [];
    attribute = attribute == 'feats' ? 'feat' : 'selectableFeature';
    var countPrefix = attribute + 'Count.';
    var prefix = attribute + 's';
    var suffix = attribute.charAt(0).toUpperCase() + attribute.substring(1);
    var toAllocateByType = {};
    attrs = this.applyRules(attributes);
    for(attr in attrs) {
      if(attr.startsWith(countPrefix)) {
        toAllocateByType[attr.replace(countPrefix, '')] = attrs[attr];
      }
    }
    var availableChoices = {};
    var allChoices = this.getChoices(prefix);
    for(attr in allChoices) {
      var types = QuilvynUtils.getAttrValueArray(allChoices[attr], 'Type');
      if(types.indexOf('General') < 0)
        types.push('General');
      if(attrs[prefix + '.' + attr] != null) {
        for(i = 0; i < types.length; i++) {
          var t = types[i];
          if(toAllocateByType[t] != null && toAllocateByType[t] > 0) {
            debug.push(prefix + '.' + attr + ' reduces ' + t + ' feats from ' + toAllocateByType[t]);
            toAllocateByType[t]--;
            break;
          }
        }
      } else if(attrs['features.' + attr] == null) {
        availableChoices[attr] = types;
      }
    }
    for(attr in toAllocateByType) {
      var availableChoicesInType = {};
      for(var a in availableChoices) {
        if(attr == 'General' || availableChoices[a].includes(attr))
          availableChoicesInType[a] = '';
      }
      howMany = toAllocateByType[attr];
      debug.push('Choose ' + howMany + ' ' + attr + ' ' + prefix);
      while(howMany > 0 &&
            (choices=QuilvynUtils.getKeys(availableChoicesInType)).length > 0) {
        debug.push(
          'Pick ' + howMany + ' from ' +
          QuilvynUtils.getKeys(availableChoicesInType).length
        );
        var pick;
        var picks = {};
        pickAttrs(picks, '', choices, howMany, 1);
        debug.push('From ' + QuilvynUtils.getKeys(picks).join(", ") + ' reject');
        for(pick in picks) {
          attributes[prefix + '.' + pick] = 1;
          delete availableChoicesInType[pick];
        }
        var validate = this.applyRules(attributes);
        for(pick in picks) {
          var name = pick.charAt(0).toLowerCase() +
                     pick.substring(1).replaceAll(' ', '').
                     replace(/\(/g, '\\(').replace(/\)/g, '\\)');
          if(QuilvynUtils.sumMatching
               (validate,
                new RegExp('^(sanity|validation)Notes.'+name+suffix)) != 0) {
            delete attributes[prefix + '.' + pick];
            debug[debug.length - 1] += ' ' + name;
          } else {
            howMany--;
            delete availableChoices[pick];
          }
        }
      }
      debug.push('xxxxxxx');
    }
    if(window.DEBUG) {
      var notes = attributes.notes;
      attributes.notes =
        (notes != null ? attributes.notes + '\n' : '') + debug.join('\n');
    }
  } else if(attribute == 'gender') {
    attributes['gender'] = QuilvynUtils.random(0, 99) < 50 ? 'Female' : 'Male';
  } else if(attribute == 'hitPoints') {
    attributes.hitPoints = 0;
    for(var clas in this.getChoices('levels')) {
      if((attr = attributes['levels.' + clas]) == null)
        continue;
      matchInfo = this.getChoices('levels')[clas].match(/^((\d+)?d)?(\d+)$/);
      var number = matchInfo == null || matchInfo[2] == null ||
                   matchInfo[2] == '' ? 1 : matchInfo[2];
      var sides = matchInfo == null || matchInfo[3] == null ||
                  matchInfo[3] == '' ? 6 : matchInfo[3];
      attributes.hitPoints += number * sides;
      while(--attr > 0)
        attributes.hitPoints += QuilvynUtils.random(number, number * sides);
    }
  } else if(attribute == 'languages') {
    attrs = this.applyRules(attributes);
    howMany = attrs.languageCount;
    choices = [];
    for(attr in this.getChoices('languages')) {
      if(attrs['languages.' + attr])
        howMany--;
      else
        choices.push(attr);
    }
    pickAttrs(attributes, 'languages.', choices, howMany, 1);
  } else if(attribute == 'levels') {
    var assignedLevels = QuilvynUtils.sumMatching(attributes, /^levels\./);
    if(!attributes.level) {
      if(assignedLevels > 0)
        attributes.level = assignedLevels
      else if(attributes.experience)
        attributes.level =
          Math.floor((1 + Math.sqrt(1 + attributes.experience/125)) / 2);
      else
        // Random 1..8 with each value half as likely as the previous one.
        attributes.level =
          9 - Math.floor(Math.log(QuilvynUtils.random(2, 511)) / Math.log(2));
    }
    var max = SWADE.LEVELS_EXPERIENCE[attributes.level] * 1000 - 1;
    var min = SWADE.LEVELS_EXPERIENCE[attributes.level - 1] * 1000;
    if(!attributes.experience || attributes.experience < min)
      attributes.experience = QuilvynUtils.random(min, max);
    choices = QuilvynUtils.getKeys(this.getChoices('levels'));
    if(assignedLevels == 0) {
      var classesToChoose =
        attributes.level == 1 || QuilvynUtils.random(1,10) < 9 ? 1 : 2;
      // Find choices that are valid or can be made so
      while(classesToChoose > 0) {
        var which = 'levels.' + choices[QuilvynUtils.random(0,choices.length-1)];
        attributes[which] = 1;
        if(QuilvynUtils.sumMatching(this.applyRules(attributes),
             /^validationNotes.*(BaseAttack|CasterLevel|Spells)/) == 0) {
          assignedLevels++;
          classesToChoose--;
        } else {
          delete attributes[which];
        }
      }
    }
    while(assignedLevels < attributes.level) {
      var which = 'levels.' + choices[QuilvynUtils.random(0,choices.length-1)];
      while(!attributes[which]) {
        which = 'levels.' + choices[QuilvynUtils.random(0,choices.length-1)];
      }
      attributes[which]++;
      assignedLevels++;
    }
    delete attributes.level;
  } else if(attribute == 'name') {
    attributes['name'] = SWADE.randomName(attributes['race']);
  } else if(attribute == 'shield') {
    attrs = this.applyRules(attributes);
    choices = [''];
    for(attr in this.getChoices('shields')) {
      if(attr == 'None' ||
         attrs['armorProficiency.Shield'] ||
         attrs['armorProficiency.' + attr]) {
        choices.push(attr);
      }
    }
    attributes['shield'] = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'skills' || attribute == 'tools') {
    attrs = this.applyRules(attributes);
    var group = this.getChoices(attribute);
    for(attr in attrs) {
    var pat = new RegExp('^features.' + attribute.replace(/s$/, '') + ' Proficiency \\((.*)\\)$', 'i');
      if((matchInfo = attr.match(pat)) == null ||
         !matchInfo[1].match(/\bChoose\b/i))
        continue;
      var pieces = matchInfo[1].split('/');
      for(i = 0; i < pieces.length; i++) {
        matchInfo = pieces[i].match(/^Choose\s+(\d+)\s+from\s+(.*)$/i)
        if(!matchInfo)
          continue;
        var count = matchInfo[1] * 1;
        if(matchInfo[2].match(/^any$/i)) {
          choices = QuilvynUtils.getKeys(group);
        } else {
          choices = matchInfo[2].split(/\s*,\s*/);
          for(var j = choices.length - 1; j >= 0; j--) {
            if(choices[j].match(/^any\s+/i)) {
              var type = choices[j].replace(/^any\s+/, '');
              for(var item in group) {
                if(group[item].includes(type))
                  choices.push(item);
              }
              choices.splice(j, 1);
            }
          }
        }
        for(var k = choices.length - 1; k >= 0; k--) {
          if(!attrs[attribute + 'Chosen.' + choices[k]])
            continue;
          count--;
          choices.splice(k, 1);
        }
      }
      pickAttrs(attributes, attribute + 'Chosen.', choices, count, 1);
    }
    pickAttrs(
      attributes, attribute + 'Chosen.', QuilvynUtils.getKeys(group),
      attrs[attribute.replace(/s$/, '') + 'ChoiceCount'] -
      QuilvynUtils.sumMatching(attributes, '^' + attribute + 'Chosen'), 1
    );
  } else if(attribute == 'spells') {
    var availableSpellsByGroupAndLevel = {};
    var groupAndLevel;
    attrs = this.applyRules(attributes);
    for(attr in this.getChoices('spells')) {
      groupAndLevel = attr.split('(')[1].split(' ')[0];
      if(availableSpellsByGroupAndLevel[groupAndLevel] == null)
        availableSpellsByGroupAndLevel[groupAndLevel] = [];
      availableSpellsByGroupAndLevel[groupAndLevel].push(attr);
    }
    for(attr in attrs) {
      if((matchInfo = attr.match(/^spellSlots\.(.*)/)) == null)
        continue;
      groupAndLevel = matchInfo[1];
      howMany = attrs[attr];
      choices = availableSpellsByGroupAndLevel[groupAndLevel];
      if(choices != null) {
        var slots = attrs['spellSlots.' + groupAndLevel];
        if(slots != null && slots < howMany) {
          howMany = slots;
        }
        pickAttrs
          (attributes, 'spells.', choices, howMany -
           QuilvynUtils.sumMatching(attributes, '^spells\\..*[(]' + groupAndLevel + '[^0]'), 1);
      }
    }
  } else if(attribute == 'weapons') {
    var weapons = this.getChoices('weapons');
    attrs = this.applyRules(attributes);
    choices = [];
    for(attr in weapons) {
      var category = QuilvynUtils.getAttrValue(weapons[attr], 'Category');
      if(category == null)
        category = 0;
      else if((category + '').match(/simple/i))
        category = 1;
      else if((category + '').match(/martial/i))
        category = 2;
      if(category == 0 ||
         attrs['weaponProficiency.Martial'] ||
         category == 1 && attrs['weaponProficiency.Simple'] ||
         attrs['weaponProficiency.' + attr]) {
        choices.push(attr);
      }
    }
    pickAttrs(attributes, 'weapons.', choices,
              3 - QuilvynUtils.sumMatching(attributes, /^weapons\./), 1);
  } else if(
     attribute == 'agility' || attribute == 'smarts' || attribute == 'spirit' ||
     attribute == 'strength' || attribute == 'vigor'
  ) {
    attributes[attribute] = 1;
  } else if(this.getChoices(attribute + 's') != null) {
    attributes[attribute] =
      QuilvynUtils.randomKey(this.getChoices(attribute + 's'));
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
        // attribute (e.g., a feat)
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
    'SWADE Quilvyn Module Version ' + SWADE_VERSION + '\n' +
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
    '  </li><li>\n' +
    '    Quilvyn allows proficiencies from the PHB Skilled feat to be\n' +
    '    applied only to skills, rather than skills or tools.\n' +
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
