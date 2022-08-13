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

  rules.defineChoice('choices', WeirdWest.CHOICES);
  rules.choiceEditorElements = WeirdWest.choiceEditorElements;
  rules.choiceRules = WeirdWest.choiceRules;
  rules.editorElements = SWADE.initialEditorElements();
  rules.getFormats = SWADE.getFormats;
  rules.getPlugins = WeirdWest.getPlugins;
  rules.makeValid = SWADE.makeValid;
  rules.randomizeOneAttribute = WeirdWest.randomizeOneAttribute;
  rules.defineChoice('random', WeirdWest.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = WeirdWest.ruleNotes;

  SWADE.createViewers(rules, SWADE.VIEWERS);
  rules.defineChoice('extras',
    'edges', 'edgePoints', 'hindrances', 'sanityNotes', 'validationNotes'
  );
  rules.defineChoice('preset',
    'advances:Advances,text,4',
    'concept:Concept,select-one,concepts',
    'gender:Gender,select-one,genders',
    'ethnicity:Ethnicity,select-one,ethnicitys'
  );

  WeirdWest.attributeRules(rules);
  WeirdWest.combatRules
    (rules, WeirdWest.ARMORS, WeirdWest.SHIELDS, WeirdWest.WEAPONS);
  WeirdWest.arcaneRules(rules, WeirdWest.ARCANAS, WeirdWest.POWERS);
  WeirdWest.talentRules
    (rules, WeirdWest.EDGES, WeirdWest.FEATURES, WeirdWest.GOODIES,
     WeirdWest.HINDRANCES, WeirdWest.LANGUAGES, WeirdWest.SKILLS);
  WeirdWest.identityRules
    (rules, WeirdWest.RACES, WeirdWest.CONCEPTS, WeirdWest.DEITIES,
     WeirdWest.ETHNICITIES, WeirdWest.GENDERS);

  Quilvyn.addRuleSet(rules);

/*
  // Debugging dump of all nicknames
  var firstNames = [];
  for(var e in WeirdWest.ETHNICITIES) {
    if(e == 'Chinese')
      continue;
    firstNames = firstNames
      .concat(QuilvynUtils.getAttrValueArray(WeirdWest.ETHNICITIES[e], 'Female'))
      .concat(QuilvynUtils.getAttrValueArray(WeirdWest.ETHNICITIES[e], 'Male'))
      .concat(QuilvynUtils.getAttrValueArray(WeirdWest.ETHNICITIES[e], 'Nonbinary'));
  }
  firstNames.sort();
  var w = window.open('', '');
  w.document.write(
    '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '<title>Nicknames</title>\n' +
    '</head>\n' +
    '<body>\n'
  );
  var lastFn = '';
  firstNames.forEach(fn => {
    if(fn != lastFn)
      w.document.write(
        fn + ' ' + WeirdWest.nicknames(fn) + '<br/>\n'
      );
    lastFn = fn;
  });
  w.document.write('</body></html>\n');
  w.document.close();
*/

}

WeirdWest.VERSION = '2.3.2.1';

WeirdWest.CHOICES =
  SWADE.CHOICES.filter(x => x != 'Race').concat(['Ethnicity', 'Gender']);
WeirdWest.RANDOMIZABLE_ATTRIBUTES =
  SWADE.RANDOMIZABLE_ATTRIBUTES.filter(x => !['deity','era','race'].includes(x)).concat(['ethnicity']);

WeirdWest.ARCANAS = {
  'Blessed':
    'Skill=Faith ' +
    'Powers=' +
      '"Arcane Protection",Banish,Barrier,"Beast Friend",Blind,' +
      '"Boost/Lower Trait",Confusion,Deflection,"Detect Arcana",Dispel,' +
      'Divination,"Elemental Manipulation",Empathy,' +
      '"Environmental Protection",Havoc,Healing,"Holy Symbol",Light,Numb,' +
      'Protection,Relief,Resurrection,Sanctify,Sloth/Speed,Smite,' +
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
  'None':'Area=Body Armor=0 MinStr=0 Weight=0',
  'Chaps':'Area=Legs Armor=1 MinStr=4 Weight=6',
  'Native Armor':'Area=Body Armor=1 MinStr=4 Weight=3',
  'Rattler Hide Chaps':'Area=Legs Armor=3 MinStr=4 Weight=4',
  'Rattler Hide Duster':'Area=Body Armor=2 MinStr=6 Weight=4',
  "Inventor's Apron":'Area=Torso Armor=2 MinStr=4 Weight=4',
  'Light Armored Hat':'Area=Head Armor=1 MinStr=4 Weight=2',
  'Heavy Armored Hat':'Area=Head Armor=2 MinStr=4 Weight=4',
  'Light Armored Vest':'Area=Torso Armor=2 MinStr=4 Weight=5',
  'Light Armored Corset':'Area=Torso Armor=2 MinStr=4 Weight=5',
  'Heavy Armored Vest':'Area=Torso Armor=4 MinStr=6 Weight=10',
  'Heavy Armored Corset':'Area=Torso Armor=4 MinStr=6 Weight=10',
  'Light Armored Duster':'Area=Torso Armor=2 MinStr=6 Weight=10',
  'Heavy Armored Duster':'Area=Torso Armor=4 MinStr=8 Weight=20'
};
WeirdWest.CONCEPTS = {
  'Agent':
    'Edge=Agent ' +
    'Attribute=Smarts ' +
    'Skill=Fighting,Occult,Shooting',
  'Blessed':
    'Edge="Arcane Background (Blessed)" ' +
    'Attribute=Spirit ' +
    'Skill=Faith',
  'Bounty Hunter': // Estimated related features
    'Attribute=Agility ' +
    'Skill=Shooting,Survival',
  'Chi Master':
    'Edge="Arcane Background (Chi Master)","Martial Artist" ' +
    'Attribute=Agility,Spirit ' +
    'Skill=Focus',
  'Common Folk':'',
  'Deserter': // Estimated related features
    'Edge=Soldier ' +
    'Attribute=Agility,Vigor ' +
    'Skill=Fighting,Shooting',
  'Drifter': // Estimated related features
    'Attribute=Agility ' +
    'Skill=Shooting',
  'Escort': // Estimated related features
    'Edge=Attractive ' +
    'Attribute=Spirit,Vigor ' +
    'Skill=Persuasion',
  'Explorer': // Estimated related features
    'Attribute=Smarts ' +
    'Skill=Research,Survival',
  'Grifter': // Estimated related features
    'Attribute=Spirit ' +
    'Skill=Persuasion',
  'Huckster':
    'Edge="Arcane Background (Huckster)" ' +
    'Attribute=Smarts ' +
    'Skill=Gambling,Spellcasting',
  'Immigrant':'',
  'Indian Shaman':
    'Edge="Arcane Background (Shaman)" ' +
    'Attribute=Spirit ' +
    'Skill=Faith',
  'Indian Warrior': // Estimated related features
    'Attribute=Agility,Vigor ' +
    'Skill=Fighting,Shooting',
  'Mad Scientist':
    'Edge="Arcane Background (Mad Scientist)" ' +
    'Attribute=Smarts ' +
    'Skill=Science,"Weird Science"',
  'Muckraker': // Estimated related features
    'Edge=Investigator ' +
    'Attribute=Smarts ' +
    'Skill=Research',
  'Outlaw':'',
  'Prospector': // Estimated related features
    'Skill=Survival',
  'Sheriff': // Estimated related features
    'Attribute=Agility,Spirit ' +
    'Skill=Intimidation,Persuasion,Shooting',
  'Soldier': // Estimated related features
    'Edge=Soldier ' +
    'Attribute=Agility,Strength,Vigor ' +
    'Skill=Fighting,Shooting',
  'Territorial Ranger':
    'Edge="Territorial Ranger" ' +
    'Attribute=Vigor ' +
    'Skill=Fighting,Intimidation,Riding,Shooting,Survival',
  'Town Marshall': // Estimated related features
    'Attribute=Agility,Spirit ' +
    'Skill=Intimidation,Persuasion,Shooting'
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
      '"Sum \'features.Trademark Weapon\' > 0",' +
      '"skills.Shooting>=10 || skills.Fighting>=10 || skills.Athletics>=10"',
  'True Grit':
    'Type=legendary Require="advances >= 16","spirit >= 10",features.Grit',
  // Agent
  'Agency Promotion':'Type=professional Require="advances >= 4",features.Agent',
  'Man Of A Thousand Faces':
    'Type=professional ' +
    'Require=' +
      'features.Agent,' +
      '"advances >= 4",' +
      '"skills.Performance >= 8"',
  // Blessed
  'Flock':
    'Type=professional ' +
    'Require=' +
      '"features.Arcane Background (Blessed)",' +
      '"advances >= 8",' +
      '"skills.Persuasion >= 8"',
  'True Believer':
    'Type=professional ' +
    'Require=' +
      '"features.Arcane Background (Blessed)",' +
      '"spirit >= 10",' +
      '"skills.Faith >= 6"',
  // Chi Master
  'Celestial Kung Fu':
    'Type=power ' +
    'Require=' +
      '"advances >= 8",' +
      '"spirit >= 8",' +
      '"Sum \'features.Superior Kung Fu\' > 0",' +
      '"skills.Fighting >= 10"',
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
  // Harrowed
  'Harrowed':'Type=weird Require="spirit >= 6"',
  'Cat Eyes':'Type=power Require=features.Harrowed',
  'Improved Cat Eyes':
    'Type=power Require=features.Harrowed,"advances >= 4","features.Cat Eyes"',
  "Chill O' The Grave":'Type=power Require=features.Harrowed,"advances >= 4"',
  'Claws':'Type=combat Require=features.Harrowed',
  'Improved Claws':
    'Type=combat Require=features.Harrowed,"advances >= 8",features.Claws',
  'Ghost':'Type=power Require=features.Harrowed,"advances >= 12"',
  'Hellfire':'Type=power Require=features.Harrowed,"advances >= 12"',
  'Implacable':'Type=combat Require=features.Harrowed,"advances >= 12"',
  'Infest':'Type=power Require=features.Harrowed',
  'Soul Eater':'Type=power Require=features.Harrowed,"advances >= 8"',
  'Spook':'Type=power Require=features.Harrowed',
  "Stitchin'":'Type=power Require=features.Harrowed',
  "Improved Stitchin'":
    'Type=power ' +
    'Require=features.Harrowed,"advances >= 8","features.Stitchin\'"',
  'Supernatural Attribute':'Type=power Require=features.Harrowed',
  'Wither':'Type=power Require=features.Harrowed',
  // Huckster
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
  'Old Hand':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Huckster)",' +
      '"advances >= 12",' +
      '"skills.Spellcasting >= 10"',
  'Whateley Blood':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Huckster)"',
  // Mad Scientist
  'Alchemy':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Mad Scientist)",' +
      '"advances >= 4",' +
      '"skills.Weird Science >= 8"',
  'Iron Bound':
    'Type=power Require="features.Arcane Background (Mad Scientist)"',
  'Ore Eater':
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Mad Scientist)",' +
      '"skills.Weird Science >= 6"',
  'True Genius':
    'Type=power ' +
    'Require="features.Arcane Background (Mad Scientist)","smarts >= 8"',
  // Shaman
  'Fetish':
    'Type=power ' +
    'Require="features.Arcane Background (Shaman)","skills.Faith >= 8"',
  "Spirit's Favor":
    'Type=power ' +
    'Require=' +
      '"features.Arcane Background (Shaman)",' +
      '"advances >= 4",' +
      '"skills.Faith >= 8"',
  // Territorial Ranger
  'Like An Oak':
    'Type=professional ' +
    'Require=' +
      '"features.Territorial Ranger",' +
      '"advances >= 8",' +
      '"features.Grit"',
  'Ranger Promotion':
    'Type=professional ' +
    'Require=' +
      '"features.Territorial Ranger",' +
      '"advances >= 4"'
};
WeirdWest.EDGES = Object.assign({}, SWADE.EDGES, WeirdWest.EDGES_ADDED);
delete WeirdWest.EDGES['Arcane Background (Gifted)'];
delete WeirdWest.EDGES['Arcane Background (Magic)'];
delete WeirdWest.EDGES['Arcane Background (Miracles)'];
delete WeirdWest.EDGES['Arcane Background (Psionics)'];
delete WeirdWest.EDGES['Arcane Background (Weird Science)'];
delete WeirdWest.EDGES['Soul Drain'];
WeirdWest.NICKNAMES = {
  // Unpronouncable nicknames not eliminated by nickname algorithm
  'Courtn':'Type=short',
  'Desm':'Type=short',
  'Edm':'Type=short',
  'Edn':'Type=short',
  'Esth':'Type=short',
  'Gerh':'Type=short',
  'Ign':'Type=short',
  'Magd':'Type=short',
  'Matth':'Type=short',
  'Sydn':'Type=short',
  'Wilh':'Type=short',
  'Abe':'Type=short Long=Abraham',
  'Ains':'Type=short Long=Ainsley',
  'Alec':'Type=short Long=Alexander',
  'Alex':'Type=short Long=Alexander',
  'Art':'Type=short Long=Arthur',
  'Artie':'Type=short Long=Arthur',
  'Ash':'Type=short Long=Asher,Ashley',
  'Becky':'Type=short Long=Rebecca',
  'Bess':'Type=short Long=Elizabeth',
  'Bessie':'Type=short Long=Elizabeth',
  'Beth':'Type=short Long=Bethany,Elizabeth',
  'Betsy':'Type=short Long=Elizabeth',
  'Betty':'Type=short Long=Elizabeth',
  'Brucie':'Type=short Long=Bruce',
  'Charlie':'Type=short Long=Charles,Charlotte',
  'Chuck':'Type=short Long=Charles',
  'Eliza':'Type=short Long=Elizabeth',
  'Fred':'Type=short Long=Alfred,Freda,Frederick',
  'Jim':'Type=short Long=James',
  'Jimmy':'Type=short Long=James',
  'Jules':'Type=short Long=Julia',
  'Julie':'Type=short Long=Julia',
  'Libby':'Type=short Long=Elizabeth',
  'Larry':'Type=short Long=Laurence,Lawrence',
  'Liz':'Type=short Long=Elizabeth',
  'Lizzy':'Type=short Long=Elizabeth',
  'Lou':'Type=short Long=Louisa',
  'Mandy':'Type=short Long=Amanda',
  'Margie':'Type=short Long=Margaret,Margarete,Margarita,Margery,Marguerite',
  'Mike':'Type=short Long=Michael,Micheal,Michel',
  'Mo':'Type=short Long=Moses',
  'Nan':'Type=short Long=Nancy',
  'Nate':'Type=short Long=Nathan',
  'Pete':'Type=short Long=Peter',
  'Ray':'Type=short Long=Raymond',
  'Sue':'Type=short Long=Susan',
  'Tony':'Type=short Long=Anthony',
  'Big':'Type=adjective',
  'Bloody':'Type=adjective',
  'Dusty':'Type=adjective',
  'Fast':'Type=adjective',
  'Fighting':'Type=adjective',
  'Iron':'Type=adjective',
  'Lame':'Type=adjective',
  'Lazy':'Type=adjective',
  'Little':'Type=adjective',
  'Mad':'Type=adjective',
  'Rusty':'Type=adjective',
  'Slow':'Type=adjective',
  'Wild':'Type=adjective',
  'Antelope':'Type=animal',
  'Badger':'Type=animal',
  'Buffalo':'Type=animal',
  'Bull':'Type=animal',
  'Cow':'Type=animal',
  'Coyote':'Type=animal',
  'Crow':'Type=animal Move=Flies,Walks',
  'Deer':'Type=animal',
  'Duck':'Type=animal Move=Flies,Swims,Walks',
  'Eagle':'Type=animal Move=Flies,Walks',
  'Elk':'Type=animal',
  'Fox':'Type=animal',
  'Horse':'Type=animal',
  'Lizard':'Type=animal Move=Crawls,Swims',
  'Owl':'Type=animal Move=Flies,Walks',
  'Rabbit':'Type=animal',
  'Raven':'Type=animal Move=Flies,Walks',
  'Snake':'Type=animal Move=Crawls,Swims',
  'Wolf':'Type=animal',
  'Arizona':'Type=noun',
  'Darkness':'Type=noun',
  'Devil':'Type=noun',
  'Eyes':'Type=noun',
  'Foot':'Type=noun',
  'Gravedigger':'Type=noun',
  'Hand':'Type=noun',
  'Justice':'Type=noun',
  'Kid':'Type=noun',
  'Lightning':'Type=noun',
  'Preacher':'Type=noun',
  'River':'Type=noun',
  'Shadows':'Type=noun',
  'Texas':'Type=noun',
  'Tree':'Type=noun',
  'Laughs':'Type=verb',
  'Looks':'Type=verb',
  'From':'Type=preposition',
  'at':'Type=preposition',
  'in':'Type=preposition',
  'to':'Type=preposition',
  'Over':'Type=preposition',
  'Through':'Type=preposition',
  'Under':'Type=preposition'
};
WeirdWest.ETHNICITIES = {
  'American Indian':'',
  'African American':
    'Female=' +
      'Amanda,Anna,Bethany,Charlotte,Elizabeth,Ellen,Emma,Hannah,Harriet,' +
      'Julia,Louisa,Lucy,Mary,Mattie,Millie,Nellie,Nancy,Rebecca,Sally,Susan ' +
    'Male=' +
      'Abraham,Alonzo,Ambrose,Booker,Elijah,Freeman,Isaac,Isaiah,Israel,King,' +
      'Master,Moses,Perlie,Percy,Presley,Prince,Titus ' +
    'Family=' +
      'Brown,Davis,Harris,Jackson,Johnson,Robinson,Smith,Taylor,Thomas,' +
      'Williams',
  'Chinese':
    'Female=' +
      'Ai,Fen,Ju,Liling,Mei,Nuan,Nuo,Shu,Ting,Xiu,Ya,Zhen ' +
    'Male=' +
      'Biming,Chang,Chao,Cheng,Cong,Da,Daquan,Dequan,Dong,Fai,Fan,Fang,Feng,' +
      'Gang,Ho,Hong,Huang,Hung,Ji,Jia,Jian,Jin,Jing,Kang,Keung,Kong,Kun,Kuo,' +
      'Laquan,Li,Peng,Ping,Qiang,Qing,Shen,Sheng,Si,Song,Wang,Xing,Xun,Yu,' +
      'Zhao,Zhu,Zhuang ' +
    'Nonbinary=' +
      'Ah,An,Bai,Bao,Bo,Chen,Chin,Chun,Fa,Fu,Guang,Guo,Hai,Han,He,Heng,Hua,' +
      'Huan,Hui,Jiang,Jiao,Jie,Jun,Lan,Lei,Lian,Liang,Lim,Lin,Ling,Liu,Min,' +
      'Ming,Mu,Ning,Niu,Qi,Qiu,Rong,Ru,Shan,Shi,Shuang,Shui,Shun,Su,Tai,Tu,' +
      'Wei,Wen,Xiang,Xue,Yan,Yi,Yin,Ying,Yong,Yun,Zan,Zheng,Zhi,Zhong ' +
    'Family=' +
      'Chen,Dong,Feng,Gao,Guo,Han,He,Hu,Huang,Li,Liang,Lin,Liu,Lui,Ma,Song,' +
      'Sun,Tang,Wang,Wu,Xiao,Xie,Xu,Yang,Yu,Zhang,Zhao,Zheng,Zhou,Zhu',
  'English':
    'Female=' +
      'Alice,Amelia,Amy,Ann,Anne,Barbara,Beatrice,Bertha,Charlotte,Clara,' +
      'Constance,Daisy,Doris,Edna,Eileen,Eleanor,Elizabeth,Ella,Ellen,Emily,' +
      'Emma,Esther,Ethel,Eva,Freda,Gertrude,Gladys,Hilda,Irene,Iris,Isabella,' +
      'Ivy,Jane,Jean,Kate,Laura,Lillian,Lily,Louisa,Lucy,Mabel,Margaret,' +
      'Margery,Maria,Marie,Martha,Mary,Maud,May,Mildred,Millicent,Muriel,' +
      'Nora,Olive,Phyllis,Rose,Ruby,Ruth,Sarah,Vera,Violet,Winifred ' +
    'Male=' +
      'Alan,Albert,Alexander,Alfred,Andrew,Anthony,Arnold,Benjamin,Bernard,' +
      'Bertram,Cecil,Charles,Christopher,Clifford,Colin,Cyril,Daniel,David,' +
      'Dennis,Donald,Douglas,Edgar,Edmund,Edward,Edwin,Eric,Evan,Frank,' +
      'Frederick,George,Gerald,Gilbert,Gordon,Henry,Herbert,Horace,Hugo,Jack,' +
      'James,Joseph,Kenneth,Laurence,Lawrence,Lewis,Lionel,Louis,Lucas,' +
      'Martin,Matthew,Maurice,Michael,Norman,Owen,Patrick,Percival,Peter,' +
      'Philip,Raymond,Richard,Robert,Roland,Ronald,Samuel,Stanley,Sydney,' +
      'Thomas,Victor,Wayne,William ' +
    'Nonbinary=' +
      'Alexis,Angel,Ashley,Bailey,Beau,Cameron,Casey,Courtney,Devon,Ellis,' +
      'Harley,Jamie,Jordan,Leigh,Mackenzie,Morgan,Quinn,Taylor ' +
    'Family=' +
      'Abbott,Abrahamson,Abrams,Ackerman,Adair,Adams,Adamson,Adcock,Adkins,' +
      'Aiken,Aikens,Ainsworth,Akers,Albertson,Alden,Allen,Allison,Allsopp,' +
      'Anderson,Andrews,Anson,Appleby,Archer,Armstrong,Ash,Ashton,Ashworth,' +
      'Atkins,Atkinson,Atteberry,Atwater,Atwood,Austin,Avery,Ayers,Babcock,' +
      'Bagley,Bailey,Bain,Baker,Baldwin,Ball,Banks,Bannister,Barber,Barclay,' +
      'Barlow,Barnes,Barnett,Barr,Barton,Bass,Bates,Baxter,Bean,Beck,Beckett,' +
      'Belcher,Bell,Bennett,Benson,Bentley,Benton,Berry,Best,Bird,Bishop,' +
      'Black,Blackburn,Blackwood,Blake,Blakesley,Blanchard,Blue,Blythe,' +
      'Boatwright,Bolton,Bond,Bone,Bonner,Bonney,Boone,Booth,Bowman,Boyce,' +
      'Braddock,Bradford,Bradley,Brand,Brandon,Branson,Brant,Bray,' +
      'Breckenridge,Brent,Brewer,Brewster,Bridges,Brigham,Briley,Bristol,' +
      'Brittain,Brock,Bronson,Brook,Brown,Brownlow,Bryant,Bryson,Buckley,' +
      'Bull,Bullard,Bullock,Bunker,Burgess,Burke,Burnham,Burns,Burrell,' +
      'Burton,Bush,Butler,Butts,Byrd',
  'French':
    'Female=' +
      'Adele,Adeline,Adrienne,Aimee,Albertine,Alice,Aline,Alphonsine,Amelie,' +
      'Andrea,Angele,Angeline,Anne,Annette,Antoinette,Augustine,Bernadette,' +
      'Blanche,Carmen,Caroline,Catherine,Cecile,Celestine,Charlotte,Claire,' +
      'Claudine,Clementine,Clotilde,Constance,Denise,Eleonore,Eliane,' +
      'Elisabeth,Elise,Emelie,Emma,Ernestine,Estelle,Esther,Eugenie,Eulalie,' +
      'Felicie,Genevieve,Georgine,Gertrude,Helene,Henriette,Hermine,' +
      'Hildegarde,Hortense,Jeanne,Josephine,Juliette,Lea,Leone,Leonie,Louise,' +
      'Lucie,Marguerite,Marie,Marion,Marthilde,Noemie,Odile,Olive,Pauline,' +
      'Prudence,Rosalie,Rose,Suzanne,Therese,Valentine,Victorine ' +
    'Male=' +
      'Abel,Adam,Adolphe,Adrien,Albin,Alcide,Alexis,Alfred,Alphonse,Anatole,' +
      'Andre,Antoine,Armand,Arthur,Auguste,Augustin,Bernard,Bertrand,Charles,' +
      'Clair,Clovis,Daniel,Denis,Edgar,Edmond,Elie,Emile,Ernest,Eugene,Felix,' +
      'Ferdinand,Fernand,Francis,Francois,Gabriel,Gaston,Gilbert,Gustave,Guy,' +
      'Hector,Henri,Horace,Jacque,Jean,Joseph,Jules,Julien,Justin,Louis,' +
      'Lucien,Marcel,Martin,Maurice,Michel,Noel,Octave,Paul,Pierre,Raoul,' +
      'Raymond,Rene,Richard,Robert,Roger,Roland,Salomon,Simon,Theophile,' +
      'Victor,Vincent ' +
    'Nonbinary=' +
      'Alix,Ange,Camille,Celeste,Claude,Hyacinthe,Irenee,Leonce,Modeste ' +
    'Family=' +
      'Beauchamp,Blanchard,Boucher,Bouvier,Calvin,Chastain,Colbert,Deschamps,' +
      'Dubois,Dumas,Dupuy,Durant,Duval,Fabre,Fay,Fevre,Forest,Gage,Granger,' +
      'Hardy,Lamar,Lambert,Lane,Langley,Larue,Laurent,Lefevre,Legrand,Lyon,' +
      'Macon,Noel,Page,Petit,Picard,Roche,Rose,Royer,Salmon,Traver,Tremble',
  'German':
    'Female=' +
      'Anna,Charlotte,Clara,Dorothea,Edith,Elfriede,Elisabeth,Erna,Frieda,' +
      'Hedwig,Helga,Ida,Irma,Johanna,Margarete,Maria,Paula,Wilhelmine ' +
    'Male=' +
      'Adolf,Albert,August,Carl,Emil,Ernst,Franz,Friedrich,Gerhard,Gustav,' +
      'Hans,Herbert,Hermann,Karl,Moritz,Otto,Paul,Richard,Robert,Rudolf,' +
      'Walter,Werner,Wilhelm ' +
    'Nonbinary=' +
      'Alex,Chris,Eike,Engel,Jo,Maxi,Micha,Sigi,Ulli,Willy ' +
    'Family=' +
      'Albrecht,Andreas,Armbruster,Bader,Bauer,Baumbach,Baumgartner,Beck,' +
      'Becker,Beltz,Berg,Bernhardt,Best,Bischoff,Bohn,Brandt,Braun,Breiner,' +
      'Bruhn,Busch,Dressler,Eberhart,Everhard,Farber,Fischer,Forney,Frank,' +
      'Fuchs,Geiger,Geissler,Gerber,Gross,Hahn,Hase,Herzog,Hirsch,Hoffmann,' +
      'Hofmeister,Holtz,Huber,Jaeger,Kaiser,Kastner,Keller,Klein,Koch,' +
      'Koenig,Kohl,Kohler,Kramer,Kraus,Krebs,Kruger,Kunkel,Lang,Lehr,Linden,' +
      'Lowe,Mandel,Mann,Marquardt,Meissner,Messer,Messner,Metzger,Meyer,' +
      'Moser,Muller,Neumann,Plank,Pletcher,Post,Rapp,Reis,Reiter,Rettig,' +
      'Reuter,Richter,Ritter,Roth,Schindler,Schmidt,Schneider,Schreiber,' +
      'Schroeder,Schuler,Schultz,Schumacher,Schwartz,Shriver,Spitz,Stark,' +
      'Stein,Stroman,Stuber,Stuck,Trump,Vogel,Vogt,Voss,Wagner,Weber,West,' +
      'Winkler,Winter,Wirth,Wolf,Ziegler,Zimmerman',
  'Irish':
    'Female=' +
      'Aileen,Bridget,Eileen,Honora,Nora,Una ' +
    'Male=' +
      'Barry,Desmond,Micheal,Oran,Owen,Patrick,Shane ' +
    'Nonbinary=' +
      'Aran,Christy,Flann,Kelly,Kennedy,Padraigin,Patsy,Rory,Rowan,Shea ' +
    'Family=' +
      'Boyle,Braden,Brady,Brannon,Breen,Brennan,Buckley,Burns,Byrne,Callahan,' +
      'Carey,Carmody,Carroll,Casey,Cassidy,Cody,Coleman,Collins,Connell,' +
      'Connolly,Connor,Cooney,Corcoran,Coughlin,Cummins,Cunningham,Curran,' +
      'Curry,Daly,Delany,Dempsey,Desmond,Doherty,Dolan,Donnelly,Donovan,' +
      'Doran,Doyle,Driscoll,Duff,Duffy,Dunn,Fallon,Fannon,Farrell,Ferguson,' +
      'Fitzgerald,Fitzpatrick,Flanagan,Flynn,Foley,Friel,Gallagher,Grady,' +
      'Hayden,Hayes,Hennessy,Hickey,Higgins,Hines,Hogan,Hughes,Joyce,Kane,' +
      'Kavanagh,Kean,Keefe,Keegan,Keeley,Kelly,Kennedy,Keys,Lane,Lynch,' +
      'Madden,Magee,Maguire,Mallon,Malone,Markey,McAdams,McAfee,McAlister,' +
      'McBride,McCabe,McCarthy,McCauley,McClelland,McConnell,McCormick,' +
      'McCracken,McCune,McDermott,McFarland,McGee,McGill,McGowan,McGuire,' +
      'McKee,McMahon,McManus,McNab,McNamara,McReynolds,Milligan,Mohan,Monday,' +
      'Moon,Mooney,Morris,Mullen,Mulligan,Mullins,Murdock,Murphy,Murray,' +
      "Nolan,O'Brien,O'ByrneO'Connell,O'Connor,O'Donnell,O'Hara,O'Kane," +
      "O'Leary,O'Malley,O'Neal,O'Neill,O'Sullivan,Power,Quigley,Quinlan," +
      'Quinn,Rafferty,Ready,Reilly,Riley,Riordan,Rowan,Ryan,Seward,Shannon,' +
      'Shea,Sheedy,Shine,Sloan,Sowards,Sullivan,Sweeney,Taggart,Teague,Tighe,' +
      'Toole,Tracey,Wallace,Walsh,Ward',
  'Jewish':
    'Female=' +
      'Adina,Alma,Dana,Ela,Esther,Golda,Hannah,Judith,Leah,Miriam,Naomi,Neta,' +
      'Odelia,Ora,Rachel,Sarah,Zelda ' +
    'Male=' +
      'Aaron,Abraham,Adam,Adi,Ami,Amos,Asa,Asher,Daniel,David,Eden,Eli,' +
      'Elijah,Elon,Ephraim,Ezra,Gideon,Guy,Hershel,Hyman,Ira,Irving,Isaac,' +
      'Isidore,Israel,Jacob,Levi,Malachi,Mordecai,Moses,Nathan,Omer,Orel,' +
      'Oren,Rafael,Rueben,Samuel,Saul,Solomon,Uriel ' +
    'Nonbinary=' +
      'Amit,Ariel,Lior,Maayan,Noam,Ofir,Omer,Or,Shachar,Shai,Uria,Yuval ' +
    'Family=' +
      'Abrahamson,Abrams,Adams,Cline,Cohen,Fisher,Hayes,Kaufmann,Klein,' +
      'Kramer,Lowe,Mandel,Mayer,Meier,Meyer,Neumann,Reis,Rose,Roth,Schneider,' +
      'Schwartz,Sherman,Stein,Stuck,Wirth,Zimmermann',
  'Multiethnic':'',
  'Scottish':
    'Female=' +
      'Aileen,Anna,Fiona,Iona,Isla,Jean,Katrina,Kirsty,Shona ' +
    'Male=' +
      // Graham was on this list, but it's a pain to nickname
      'Alan,Angus,Bruce,Colin,Craig,David,Donald,Douglas,Duncan,Gordon,' +
      'Grant,Keith,Kenneth,Malcolm,Murray,Neil,Roderick,Ronald,Ross,Roy,' +
      'Scott,Stewart,Stuart ' +
    'Nonbinary=' +
      'Ainsley,Athol,Blair,Islay,Jamie,Rory ' +
    'Family=' +
      'Allaway,Atchison,Baird,Balfour,Barber,Barclay,Blackwood,Blaine,Boyd,' +
      'Breckenridge,Bruce,Buchanan,Burns,Calhoun,Cameron,Campbell,Carr,' +
      'Carson,Coburn,Cockburn,Cummins,Cunningham,Darrow,Davis,Drummond,Duff,' +
      'Duffy,Dunbar,Dunn,Falconer,Faulkner,Ferguson,Finley,Fraser,Gibson,' +
      'Grant,Greer,Hamilton,Henderson,Holmes,Houston,Hughes,Hunger,Johnston,' +
      'Kendrick,Kerr,Knox,Laird,Lenox,Lester,Logan,Lowry,Lusk,Magee,Masson,' +
      'Matheson,Maxwell,McAdams,McAfee,McAlister,McCabe,McCaig,McCallum,' +
      'McCauley,McClelland,McConnell,McCormick,McCoy,McCracken,McCreery,' +
      'McDaniel,McDonald,McDougall,McFarland,McGee,McGill,McGregor,McIntyre,' +
      'McKay,McKee,McKenzie,McKinley,McKinney,McLain,McLean,McLeod,McNabb,' +
      'McNeil,McQueen,McRae,McReynolds,McTaggart,Melville,Milne,Mitchell,' +
      'Moffett,Monroe,Montgomery,Morris,Muir,Munroe,Murray,Norris,Paisley,' +
      'Patterson,Patton,Pollock,Ralston,Ramsay,Ready,Ross,Rutherford,' +
      'Saunders,Shaw,Sterling,Stewart,Sutherland,Taggart,Tyree,Wallace,' +
      'Watson,Wood,Woods',
  'Spanish':
    'Female=' +
      'Adela,Adelina,Aida,Alba,Albina,Alicia,Amalia,Amanda,Amelia,Ana,Andrea,' +
      'Angela,Anita,Antonia,Aurelia,Berta,Carlota,Carmela,Carmen,Carolina,' +
      'Cecilia,Celia,Clara,Claudia,Clotilde,Delfina,Delia,Diana,Dolores,' +
      'Elena,Eloisa,Elvira,Emma,Emilia,Esther,Eugenia,Eulalia,Eva,Felicia,' +
      'Filomena,Flora,Francisca,Genoveva,Gloria,Gracia,Gregoria,Guadelupe,' +
      'Herminia,Ines,Irene,Isabel,Josefina,Juana,Justina,Laura,Leonor,Lorena,' +
      'Lorenza,Lucia,Luisa,Luna,Luz,Magdalena,Margarita,Maria,Martina,' +
      'Maltilde,Mercedes,Oliva,Paulina,Ramona,Rosa,Rosalia,Sabina,Silvia,' +
      'Sofia,Susana,Teresa,Valeria ' +
    'Male=' +
      'Abraham,Adolfo,Alberto,Alejandro,Alfonso,Alfredo,Amado,Angel,Antonio,' +
      'Benito,Benjamin,Bernardo,Candido,Casimiro,Clemente,Diego,Domingo,' +
      'Emiliano,Emilio,Enrique,Epifanio,Ernesto,Fabian,Federico,Felipe,Felix,' +
      'Fernando,Florencio,Florian,Francisco,Gabriel,German,Gregorio,Hector,' +
      'Hugo,Ignacio,Jesus,Joaquin,Joel,Jose,Juan,Julio,Leon,Lorenzo,Luis,' +
      'Manuel,Miguel,Nicolas,Pablo,Pedro,Rafael,Roman,Ruben,Santiago,Tomas,' +
      'Vicente ' +
    'Nonbinary=' +
      'Ale,Cande,Chus,Cruz,Guadelupe,Guiomar,Lupe,Maxi,Patrocinio,Reyes,' +
      'Trinidad,Yunuen ' +
    'Family=' +
      'Aguilar,Alvarez,Castillo,Castro,Chavez,Contreras,Cortez,Cruz,Diaz,' +
      'Dominguez,Estrada,Fernandez,Flores,Garcia,Garza,Gomez,Gonzalez,Guerro,' +
      'Gutierrez,Guzman,Hernanez,Herrera,Jimenez,Juarez,Lopez,Luna,Martinez,' +
      'Medina,Mendez,Menoza,Morales,Moreno,Munoz,Ortega,Ortiz,Perez,Ramirez,' +
      'Ramos,Reyes,Rivera,Rodriguez,Rojas,Romero,Ruiz,Salazar,Sanchez,Soto,' +
      'Torres,Vargas,Velasquez,vasquez'
};
WeirdWest.FEATURES_ADDED = {
  // Edges
  'Agency Promotion':
    'Section=feature ' +
    'Note="Has moved up %V ranks in The Agency hierarchy, can request bigger favors"',
  'Agent':
    'Section=feature ' +
    'Note="Works for and receives favors from a covert government agency"',
  'Alchemy':
    'Section=arcana ' +
    'Note="May spend 3 PP to create 3 Snake Oil, Focusing, and/or Peptonic potions lasting 1 dy"',
  'Arcane Background (Blessed)':
    'Section=arcana,feature ' +
    'Note="3 Powers/15 Power Points/Critical failure causes fatigue",' +
         '"Violating core beliefs inflicts -2 Faith for 1 wk; major sins remove powers"',
  'Arcane Background (Chi Master)':
    'Section=arcana ' +
    'Note="3 Powers/15 Power Points/Critical failure causes fatigue/Power range reduced to self or touch"',
  'Arcane Background (Huckster)':
    'Section=arcana ' +
    'Note="3 Powers/10 Power Points/Critical failure causes fatigue/May cast via deal with the devil"',
  'Arcane Background (Mad Scientist)':
    'Section=arcana ' +
    'Note="2 Powers/15 Power Points/Critical failure causes malfunction"',
  'Arcane Background (Shaman)':
    'Section=arcana ' +
    'Note="2 Powers/15 Power Points/Critical failure causes fatigue"',
  'Behold A Pale Horse':
    'Section=feature ' +
    'Note="Mount is a Wild Card with Fearless and Danger Sense features"',
  'Born In The Saddle':
    'Section=skill ' +
    'Note="May reroll Riding/Mount gains +2 Pace and +1 Run step"',
  'Card Sharp':'Section=skill Note="May reroll Gambling"',
  'Cat Eyes':'Section=feature Note="No penalty in %V lighting"',
  'Celestial Kung Fu':
    'Section=combat ' +
    'Note="+1 Edge Points (Superior Kung Fu style); use 2 styles at once"',
  "Chill O' The Grave":
    'Section=combat ' +
    'Note="May spend a benny for a 3%{in} radius cold blast that makes unprepared creatures vulnerable"',
  'Claws':SWADE.FEATURES['Claws'],
  'Damned':'Section=feature Note="Will return as Harrowed if killed"',
  "Don't Get 'im Riled!":
    'Section=combat Note="Adds wound level to damage rolls"',
  'Duelist':'Section=combat Note="Gets two extra hole cards at start of duel"',
  'Fan The Hammer':
     'Section=combat ' +
     'Note="May shoot up to 6 shots in one action at %V; 1 or 2 may hit bystander"',
  'Fast As Lightning':'Section=combat Note="May take 4 actions at -6 each"',
  'Fetish':'Section=skill Note="May reroll Faith"',
  'Flock':'Section=feature Note="Has 5 townsfolk followers"',
  'Gallows Humor':
    'Section=skill ' +
    'Note="May use Taunt vs. fear; Raise gives +1 Support to allies"',
  'Ghost':'Section=feature Note="May become incorporeal at will"',
  'Grit':'Section=attribute Note="Reduces penalties vs. fear by 2"',
  'Guts':'Section=attribute Note="May reroll Vigor vs. fear"',
  'Harrowed':
    'Section=attribute,combat,feature,skill ' +
    'Note="+2 Spirit (Shaken recovery)/Immune to disease and poison","+2 Toughness/Ignore non-head Called Shot damage/Doesn\'t bleed out/Killed only if brain destroyed","+1 Edge Points (Harrowed edge)/Ignores 1 point of wound penalty/Doesn\'t breathe or drink/Smells of decay/May let the devil out for +6 trait and damage for 5 rd","-2 Persuasion/-2 Riding/-2 with animals"',
  'Hellfire':'Section=arcana Note="9%{in} cone inflicts 3d6 damage 1/rd"',
  'Hexslinging':
    'Section=arcana ' +
    'Note="Cast <i>Ammo Whammy</i>, <i>Deflection</i>, <i>Boost Trait</i> (Shooting), and <i>Protection</i> via weapon"',
  'High Roller':
    'Section=arcana Note="Draw %V extra cards for deal with the devil"',
  'Implacable':
    'Section=combat Note="Takes extra wound before incapacitated"',
  'Improved Cat Eyes':'Section=feature Note="Increased Cat Eyes effects"',
  'Improved Claws':'Section=combat Note="Increased Claws damage, AP 2"',
  'Improved Fan The Hammer':
    'Section=combat Note="Increased Fan The Hammer effects"',
  'Improved High Roller':'Section=arcana Note="Increased High Roller effects"',
  "Improved Stitchin'":'Section=combat Note="Increased Stitchin\' effects"',
  'Infest':
    'Section=arcana Note="May summon and control insect swarm for 5 min"',
  'Iron Bound':'Section=feature Note="Connections with industrial science"',
  'Like An Oak':
    'Section=combat ' +
    'Note="R12%{in} allies ignore 2 points of fear penalties on fear checks"',
  'Knack (Bastard)':
    'Section=feature ' +
    'Note="May spend a benny to see invisible and hidden creatures for 5 rd"',
  "Knack (Born On All Hallows' Eve)":
    'Section=feature Note="May spend Conviction to reroll critical failure"',
  'Knack (Born On Christmas)':
    'Section=combat ' +
    'Note="May spend a benny to negate power effect and shake caster (Spirit-4 neg)"',
  'Knack (Breech Birth)':
    'Section=combat Note="May spend a benny to heal 1 wound"',
  'Knack (Seventh Son)':
    'Section=feature Note="May spend a benny to negate a benny effect"',
  'Knack (Shooting Star)':
    'Section=combat ' +
    'Note="May spend a benny to dbl Command range for remainder of encounter"',
  'Knack (Storm Born)':
    'Section=attribute Note="Ignores penalties on benny reroll vs. fear"',
  'Man Of A Thousand Faces':
    'Section=skill Note="+2 Performance (impersonate character type)"',
  'Old Hand':
    'Section=arcana Note="Redraw up to 3 cards for deal with the devil"',
  'Ore Eater':
    'Section=arcana Note="+5 Power Points/May contract ghost rock fever"',
  'Quick Draw':
    'Section=combat,skill ' +
    'Note="Spending a benny gives two extra Action Cards",' +
         '"+2 Athletics (interrupt others\' action)"',
  'Ranger Promotion':
    'Section=feature ' +
    'Note="Has moved up %V ranks in Territorial Ranger hierarchy"',
  'Reputation':
    'Section=skill ' +
    'Note="+2 Intimidation (bad reputation) or may reroll Persuasion (good reputation) with those who have heard stories"',
  'Right Hand Of The Devil':
    'Section=combat Note="Trademark weapon does extra die of damage"',
  'Scout':
    'Section=skill ' +
    'Note="Rolls Notice-2 to detect encounters/Always alert when rolling Notice vs. Stealth/Ignores 2 penalty points for Survival (tracking)/+2 Common Knowledge (known route)"',
  'Soul Eater':
    'Section=combat ' +
    'Note="May make Spirit-2 roll after inflicting unarmed wound to heal self wound or reduce fatigue"',
  "Spirit's Favor":'Section=arcana Note="Cast chosen power as free action"',
  'Spook':
    'Section=arcana ' +
    'Note="Targeted -2 fear check, suffer fatigue for 12%{in} radius effect"',
  "Stitchin'":'Section=combat Note="Make natural healing roll 1/%V"',
  'Superior Kung Fu (Drunken Style)':
    'Section=combat Note="Trades -2 Pace for foes -2 attack"',
  'Superior Kung Fu (Eagle Claw)':
    'Section=combat Note="Hands become heavy weapons with AP 4"',
  'Superior Kung Fu (Mantis)':
    'Section=combat ' +
    'Note="Makes foe distracted or vulnerable after failed attack 1/rd"',
  'Superior Kung Fu (Monkey)':
    'Section=combat ' +
    'Note="Gives +2 Parry; may make Athletics test on all adjacent foes as one action"',
  'Superior Kung Fu (Shuai Chao)':
    'Section=combat Note="Gives free grapple attempt after failed foe attack"',
  'Superior Kung Fu (Tan Tui)':
    'Section=attribute,combat ' +
    'Note="Rise from prone costs no movement",' +
         '"Gives +1 unarmed damage step 1/rd, success knocks back 1d4%{in} (Raise 1d4+2%{in})"',
  'Superior Kung Fu (Wing Chun)':
    'Section=combat Note="Gives +1 Parry and foes -2 melee damage"',
  'Supernatural Attribute':'Section=attribute Note="+%V Attribute Points"',
  'Tale-Teller':
    'Section=skill ' +
    'Note="+2 Persuasion or Performance to lower fear; Raise gives Conviction"',
  'Territorial Ranger':'Section=feature Note="Works for U.S. Marshals agency"',
  'True Believer':'Section=skill Note="May reroll Faith"',
  'True Genius':
    'Section=arcana Note="May spend a benny to reroll madness or malfunction"',
  'True Grit':
    'Section=attribute ' +
    'Note="Ignores penalties vs. fear, may reroll fear effects"',
  "Veteran O' The Weird West":
     'Section=description,feature ' +
     'Note="+4 Advances","Has additional hindrance"',
  'Whateley Blood':
    'Section=arcana,skill ' +
    'Note="Self-fatigue gives 5 power points, self-wound 10","-1 Persuasion"',
  'Wither':
    'Section=arcana ' +
    'Note="Touch reduces target strength (Raise strength and vigor) 1 step for 1 hr"',
  // Hindrances
  "Ailin'":
    'Section=attribute ' +
    'Note="-1 vs. fatigue; critical failure inflicts Ailin\'+"',
  "Ailin'+":
    'Section=attribute Note="-2 vs. fatigue; critical failure inflicts death"',
  'Cursed+':'Section=feature Note="GM gains +1 Benny each session"',
  "Grim Servant O' Death+":
    'Section=combat ' +
    'Note="+1 damage; critical failure hits nearest ally w/Raise"',
  'Heavy Sleeper':
    'Section=attribute,skill ' +
    'Note="-4 Vigor (stay awake)","-4 Notice (wake up)"',
  "Lyin' Eyes":
    'Section=combat ' +
    'Note="-1 Gambling (poker and faro)/-1 Intimidation (lies)/-1 Persuasion (lies)"',
  'Night Terrors+':
    'Section=attribute,feature ' +
    'Note="-1 Spirit","Makes noise while sleeping that keeps others awake"',
  'Old Ways Oath':
    'Section=attribute,feature ' +
    'Note="May reroll Spirit","Has vowed not to use ghost rock-powered items"',
  'Talisman':'Section=arcana Note="-1 casting when talisman absent"',
  'Talisman+':'Section=arcana Note="-2 casting when talisman absent"',
  'Tenderfoot+':
    'Section=feature Note="Suffers additional -1 penalty when wounded"',
  'Trouble Magnet':
    'Section=feature ' +
    'Note="Suffers increased consequences from critical failures"',
  'Trouble Magnet+':'Section=feature Note="Always suffers random consequences"',
};
WeirdWest.FEATURES =
  Object.assign({}, SWADE.FEATURES, WeirdWest.FEATURES_ADDED);
WeirdWest.GENDERS = {
  'Female':'',
  'Male':'',
  'Nonbinary':''
};
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
  'Talisman':'Require="hindrances.Talisman+ == 0",powerPoints Severity=Minor',
  'Talisman+':'Require="hindrances.Talisman == 0",powerPoints Severity=Major',
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
      '"Target suffers 1 level fatigue and additional level each sunset (Spirit neg)"',
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
    'Description="Creates 1 lb item for 5 rd (Raise 5 min)"',
  'Wilderness Walk':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=self ' +
    'Description="Gives triple speed and untraceable in wilderness for 1 hr"'
};
WeirdWest.POWERS = Object.assign({}, SWADE.POWERS, WeirdWest.POWERS_ADDED);
WeirdWest.RACES = {
  'Human':
    'Features=' +
      'Adaptable'
  // Dropped SWADE "Human" language; English proficiency is assumed
};
WeirdWest.LANGUAGES = {
  'English':''
};
WeirdWest.SHIELDS = {
  'None':'Parry=0 Cover=0 MinStr=0 Weight=0',
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

  'Brass Knuckles':'Damage=Str+d4 MinStr=4 Weight=1 Category=1h',
  'Bayonet':'Damage=Str+d4 MinStr=4 Weight=1 Category=1h',
  'Club':'Damage=Str+d4 MinStr=4 Weight=1 Category=1h',
  'War Club':'Damage=Str+d6 MinStr=6 Weight=3 Category=1h Range=3',
  'Bladed War Club':'Damage=Str+d8 MinStr=8 Weight=6 Category=2h AP=2 Parry=-1',
  'Knife':'Damage=Str+d4 MinStr=4 Weight=1 Category=1h Range=3',
  'Bowie Knife':'Damage=Str+d4+1 MinStr=4 Weight=2 Category=1h AP=1 Range=2',
  'Plains Indian Lance':'Damage=Str+d6 MinStr=6 Weight=4 Category=1h Range=2',
  'Saber':'Damage=Str+d6 MinStr=6 Weight=4 Category=1h',
  'Spear':'Damage=Str+d6 MinStr=6 Weight=5 Category=2h Parry=1 Range=3',
  'Tomahawk':'Damage=Str+d6 MinStr=6 Weight=4 Category=1h Range=3',
  'Whip':'Damage=Str+d4 MinStr=4 Weight=2 Category=1h Parry=-1',

  'Gatling Pistol':
    'Damage=2d6 MinStr=4 Weight=5 Category=R Range=12 AP=1 ROF=3',
  'Gatling Carbine':
    'Damage=2d8 MinStr=6 Weight=12 Category=R Range=20 AP=2 ROF=2',
  'Gatling Rifle':
    'Damage=2d8 MinStr=8 Weight=17 Category=R Range=24 AP=2 ROF=2',
  'Gatling Shotgun':'Damage=3d6 MinStr=8 Weight=15 Category=R Range=12 ROF=2',
  'Gatling Gun':'Damage=2d8 MinStr=6 Weight=40 Category=R Range=24 AP=2 ROF=3',

  'Derringer':'Damage=2d4 MinStr=4 Weight=1 Category=R Range=3',
  'English 1840 Model':'Damage=2d6-1 MinStr=4 Weight=1 Category=R Range=5 AP=1',
  'Rupertus Pepperbox':'Damage=2d4 MinStr=6 Weight=1 Category=R Range=5',
  'Wesson Dagger-Pistol':'Damage=2d4 MinStr=6 Weight=1 Category=R Range=5',

  'Colt Army':'Damage=2d6+1 MinStr=4 Weight=2 Category=R Range=12 AP=1',
  'Colt Buntline Special':
    'Damage=2d6+1 MinStr=6 Weight=3 Category=R Range=15 AP=1',
  'Colt Dragoon':'Damage=2d6+1 MinStr=4 Weight=4 Category=R Range=12 AP=1',
  'Colt Navy':'Damage=2d6 MinStr=4 Weight=3 Category=R Range=12 AP=1',
  'Colt Peacemaker':'Damage=2d6+1 MinStr=4 Weight=4 Category=R Range=12 AP=1',
  'LeMat Revolver':'Damage=2d6 MinStr=6 Weight=4 Category=R Range=12 AP=1',
  'LeMat Revolver Shotgun':'Damage=3d6 MinStr=6 Weight=4 Category=R Range=5',

  'Colt Frontier':'Damage=2d6+1 MinStr=4 Weight=2 Category=R Range=12 AP=1',
  'Colt Lightning':'Damage=2d6 MinStr=4 Weight=2 Category=R Range=12 AP=1',
  'Colt Rainmaker':'Damage=2d6 MinStr=4 Weight=2 Category=R Range=12 AP=1',
  'Colt Thunderer':'Damage=2d6 MinStr=4 Weight=2 Category=R Range=12 AP=1',
  'Starr Revolver':'Damage=2d6+1 MinStr=4 Weight=2 Category=R Range=12 AP=1',

  "Sharps '55":'Damage=2d8 MinStr=6 Weight=8 Category=R Range=20 AP=2',
  'Spencer':'Damage=2d8 MinStr=4 Weight=8 Category=R Range=20 AP=2',
  'LeMat Carbine':'Damage=2d8 MinStr=6 Weight=9 Category=R Range=20 AP=1',
  'LeMat Carbine Shotgun':'Damage=3d6 MinStr=6 Weight=9 Category=R Range=12',

  "Ballard '72":'Damage=2d8 MinStr=6 Weight=11 Category=R Range=24 AP=2',
  'Bullard Express':'Damage=2d10 MinStr=8 Weight=11 Category=R Range=24 AP=2',
  "Colt-Paterson Model '36":
    'Damage=2d10 MinStr=8 Weight=12 Category=R Range=24 AP=2',
  'Enfield Musket':'Damage=2d8 MinStr=6 Weight=9 Category=R Range=12 AP=2',
  'Evans Old Model Sporter':
    'Damage=2d8 MinStr=6 Weight=12 Category=R Range=24 AP=2',
  'Sawed-Off Winchester':
    'Damage=2d8-1 MinStr=4 Weight=4 Category=R Range=12 AP=2',
  "Sharp's Big 50":'Damage=2d10 MinStr=8 Weight=11 Category=R Range=30 AP=2',
  'Springfield Rifled Musket':
    'Damage=2d8 MinStr=6 Weight=11 Category=R Range=15',
  "Winchester '73":'Damage=2d8-1 MinStr=6 Weight=10 Category=R Range=24 AP=2',
  "Winchester '76":'Damage=2d8 MinStr=4 Weight=7 Category=R Range=24 AP=2',

  'Colt Revolving Shotgun':'Damage=3d6 MinStr=6 Weight=10 Category=R Range=12',
  'Double-Barrel Shotgun':'Damage=3d6 MinStr=6 Weight=11 Category=R Range=12',
  'Sawed-Off Double-Barrel Shotgun':
    'Damage=3d6 MinStr=4 Weight=6 Category=R Range=5',
  'Single-Barrel Shotgun':'Damage=3d6 MinStr=4 Weight=6 Category=R Range=12',
  'Winchester Lever-Action Shotgun':
    'Damage=3d6 MinStr=6 Weight=6 Category=R Range=12',

  'Bola':'Damage=Str+d1 MinStr=4 Weight=1 Category=R Range=4',
  'Bow':'Damage=2d6 MinStr=6 Weight=2 Category=R Range=12',

  'Flamethrower':'Damage=3d6 MinStr=6 Weight=15 Category=R Range=9',
  'Steam Saw':'Damage=2d6+4 MinStr=8 Weight=20 Category=2h',
  'Steam Gatling':'Damage=2d8 MinStr=6 Weight=50 Category=R Range=24'

};

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
WeirdWest.identityRules = function(
  rules, races, concepts, deities, ethnicities,genders
) {

  SWADE.identityRules(rules, races, {}, concepts, deities);

  QuilvynUtils.checkAttrTable
    (ethnicities, ['Family', 'Female', 'Male', 'Nonbinary']);
  QuilvynUtils.checkAttrTable(genders, []);

  for(var ethnicity in ethnicities) {
    rules.choiceRules(rules, 'Ethnicity', ethnicity, ethnicities[ethnicity]);
  }
  for(var gender in genders) {
    rules.choiceRules(rules, 'Gender', gender, genders[gender]);
  }
  rules.defineEditorElement('ethnicity', 'Ethnicity', 'text', [20], 'race');
  rules.defineSheetElement('Ethnicity', 'Race', ' <b>%V</b>');
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
  else if(type == 'Concept')
    WeirdWest.conceptRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Edge'),
      QuilvynUtils.getAttrValueArray(attrs, 'Skill')
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
  } else if(type == 'Ethnicity')
    WeirdWest.ethnicityRules(rules, name);
  else if(type == 'Feature')
    WeirdWest.featureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Gender')
    WeirdWest.genderRules(rules, name);
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

/*
 * Defines in #rules# the rules associated with concept #name#. #attributes#,
 * #edges#, and #skills# list the names of attributes, edges, and skills
 * associated with the concept.
 */
WeirdWest.conceptRules = function(rules, name, attributes, edges, skills) {
  SWADE.conceptRules(rules, name, attributes, edges, skills); 
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
  if(name == 'Agency Promotion') {
    rules.defineRule
      ('featureNotes.agencyPromotion', 'edges.Agency Promotion', '=', null);
  } else if(name == 'Cat Eyes') {
    rules.defineRule('featureNotes.catEyes',
      '', '=', '"dim or dark"',
      'featureNotes.improvedCatEyes', '=', '"any"'
    );
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
  } else if(name == 'Harrowed') {
    rules.defineRule('edgePoints', 'featureNotes.harrowed', '+=', '1');
  } else if(name == 'High Roller') {
    rules.defineRule('powerNotes.highRoller',
      '', '=', '1',
      'powerNotes.improvedHighRoller', '+', '1'
    );
  } else if(name == 'Ranger Promotion') {
    rules.defineRule
      ('featureRules.rangerPromotion', 'edges.Ranger Promotion', '=', null);
  } else if(name == "Stitchin'") {
    rules.defineRule("combatNotes.stitchin'",
      "features.Stitchin'", '=', '"dy"',
      "combatNotes.improvedStitchin'", '=', '"hr"'
    );
  } else if(name == 'Supernatural Attribute') {
    rules.defineRule('attributeNotes.supernaturalAttribute',
      'edges.Supernatural Attribute', '=', 'source * 2'
    );
  } else {
    SWADE.edgeRulesExtra(rules, name);
  }
};

/* Defines in #rules# the rules associated with ethnicity #name#. */
WeirdWest.ethnicityRules = function(rules, name) {
  if(!name) {
    console.log('Empty ethnicity name');
    return;
  }
  // No rules pertain to ethnicity
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

/* Defines in #rules# the rules associated with gender #name#. */
WeirdWest.genderRules = function(rules, name) {
  if(!name) {
    console.log('Empty gender name');
    return;
  }
  // No rules pertain to gender
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

/*
 * Returns the list of editing elements needed by #choiceRules# to add a #type#
 * item to #rules#.
 */
WeirdWest.choiceEditorElements = function(rules, type) {
  if(type == 'Ethnicity') {
    return([
      ['Female', 'Female Names', 'text', [60]],
      ['Male', 'Male Names', 'text', [60]],
      ['Nonbinary', 'Nonbinary Names', 'text', [60]],
    ]);
  } else if(type == 'Gender') {
    return([]);
  } else {
    return SWADE.choiceEditorElements(rules, type);
  }
};

WeirdWest.nicknames = function(name) {
  var result = QuilvynUtils.getKeys(WeirdWest.NICKNAMES).filter(x => WeirdWest.NICKNAMES[x].match('Long=\\S*\\b' + name + '\\b'));
  var diminutive;
  // Use the first syllable ([consonants] vowels consonants) for the nickname.
  var nicked =
    name.replace(/^(([^aeiouy]|^y(?=[aeiouy]))*[aeiouy]+[^aeiouy]+).*$/i, '$1');
  // Remove certain ends of consonant runs that tend to create ugly nicknames
  // (e.g., Andr for Andrew)
  if(nicked.match(/[^aeiouy][rgwql]$/i))
    nicked = nicked.replace(/.$/, '');
  // Sometimes nicking a final e makes a reasonable nickname (e.g., Kate to
  // Kat), but most often not (e.g., Wayne to Wayn)
  if(name != nicked && name != nicked + 'e' && !(nicked in WeirdWest.NICKNAMES))
    result.push(nicked);
  // If the nickname ends with multiple consonants, make a diminutive using it
  // and further nick by one more letter
  if(nicked.match(/[^aeiouy][^aeiouy]$/i)) {
    if(!name.match(nicked + '(y|ey|ie|ee|e|i)$')) {
      diminutive = nicked + (QuilvynUtils.random(0, 1) == 2 ? 'y' : 'ie');
      if(!(diminutive in WeirdWest.NICKNAMES))
        result.push(diminutive);
    }
    nicked = nicked.replace(/([^aeiouy])[^aeiouy]+$/i, '$1');
    if(!(nicked in WeirdWest.NICKNAMES))
      result.push(nicked);
  }
  // Make a diminutive by doubling the final consonant and adding y or ie
  if(!nicked.match(/[aeiouy]$/i) && !name.match(nicked + '(y|ey|ie|ee|e|i)$')) {
    nicked = nicked + nicked.charAt(nicked.length - 1);
    if(!name.startsWith(nicked)) {
      diminutive = nicked + (QuilvynUtils.random(0, 1) == 2 ? 'y' : 'ie');
      if(!(diminutive in WeirdWest.NICKNAMES))
        result.push(diminutive);
    }
  }
  return result;
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
WeirdWest.randomizeOneAttribute = function(attributes, attribute) {
  if(attribute == 'name') {
    var adjectives =
      QuilvynUtils.getKeys(WeirdWest.NICKNAMES)
      .filter(x => WeirdWest.NICKNAMES[x].match(/adjective/));
    var nouns =
      QuilvynUtils.getKeys(WeirdWest.NICKNAMES)
      .filter(x => WeirdWest.NICKNAMES[x].match(/noun/));
    var ethnicity = attributes.ethnicity;
    var fullName;
    if(ethnicity == 'American Indian') {
      var animals =
        QuilvynUtils.getKeys(WeirdWest.NICKNAMES)
        .filter(x => WeirdWest.NICKNAMES[x].match(/animal/));
      var prepositions =
        QuilvynUtils.getKeys(WeirdWest.NICKNAMES)
        .filter(x => WeirdWest.NICKNAMES[x].match(/preposition/));
      var verbs =
        QuilvynUtils.getKeys(WeirdWest.NICKNAMES)
        .filter(x => WeirdWest.NICKNAMES[x].match(/verb/));
      var animal = animals[QuilvynUtils.random(0, animals.length - 1)];
      // Use "adjective animal" or "[animal who] verb preposition noun"
      if(QuilvynUtils.random(0, 1) == 0) {
        fullName =
          adjectives[QuilvynUtils.random(0, adjectives.length - 1)] + ' ' +
          animal;
      } else {
        var moves =
          QuilvynUtils.getAttrValueArray(WeirdWest.NICKNAMES[animal], 'Move');
        if(moves.length == 0)
          moves = ['Leaps', 'Runs', 'Swims', 'Walks'];
        verbs = verbs.concat(moves);
        fullName =
          (QuilvynUtils.random(0, 1) == 0 ? animal + ' Who ' : '') +
          verbs[QuilvynUtils.random(0, verbs.length - 1)] + ' ' +
          prepositions[QuilvynUtils.random(0, prepositions.length - 1)] + ' ' +
          nouns[QuilvynUtils.random(0, nouns.length - 1)];
      }
      attributes.name = fullName;
      return;
    }
    if(!(ethnicity in WeirdWest.ETHNICITIES))
      ethnicity = 'Multiethnic';
    var names = WeirdWest.ETHNICITIES[ethnicity];
    var gender =
      ['Female', 'Male'].includes(attributes.gender) ? attributes.gender :
      'Nonbinary';
    var choices = QuilvynUtils.getAttrValueArray(names, gender);
    while(choices.length == 0)
      // Multiethnic or "other"; get names for a random ethnicity
      choices = QuilvynUtils.getAttrValueArray(WeirdWest.ETHNICITIES[QuilvynUtils.randomKey(WeirdWest.ETHNICITIES)], gender);
    var personalName = choices[QuilvynUtils.random(0, choices.length - 1)];
    // 2/3 of names get an epithet
    if(QuilvynUtils.random(0, 2) != 2) {
      var nicknames = WeirdWest.nicknames(personalName);
      var epithet =
        QuilvynUtils.random(0, 2) == 0 ?
          adjectives[QuilvynUtils.random(0, adjectives.length - 1)] + ' ' +
          nouns[QuilvynUtils.random(0, nouns.length - 1)]
        : ethnicity != 'Chinese' && nicknames.length > 0 &&
          QuilvynUtils.random(0, 1) == 0 ?
          adjectives[QuilvynUtils.random(0, adjectives.length - 1)] + ' ' +
          nicknames[QuilvynUtils.random(0, nicknames.length - 1)]
        :
          nouns[QuilvynUtils.random(0, nouns.length - 1)];
      personalName += ' "' + epithet + '"';
    }
    choices = QuilvynUtils.getAttrValueArray(names, 'Family');
    while(choices.length == 0)
      choices = QuilvynUtils.getAttrValueArray(WeirdWest.ETHNICITIES[QuilvynUtils.randomKey(WeirdWest.ETHNICITIES)], 'Family');
    var familyName = choices[QuilvynUtils.random(0, choices.length - 1)];
    fullName = personalName + ' ' + familyName;
    if(ethnicity == 'Chinese')
      fullName = familyName + ' ' + personalName;
    attributes.name = fullName;
  } else if(attribute == 'gender') {
    attributes.gender =
      QuilvynUtils.random(0, 2) == 0 ? 'Female' :
      QuilvynUtils.random(0, 1) == 0 ? 'Male' : 'Nonbinary';
  } else {
    SWADE.randomizeOneAttribute.apply(this, [attributes, attribute]);
  }
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
    '</p>\n' +
    '<h3>Usage Notes</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '  Quilvyn uses character ethnicity and gender only when generating\n' +
    '  random names; there are no rule effects for either attribute.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '\n' +
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
    'Deadlands The Weird West © 2020 Pinnacle Entertainment Group.\n' +
    '</p><p>\n' +
    'Quilvyn takes most of its randomized names from the ' +
    '<a href="https://www.mithrilandmages.com/utilities/WesternBrowse.php">Mithril and Mages list of Old West Names</a>.\n' +
    'Name ethnicities are determined from data taken from the <a href="https://www.behindthename.com/">Behind the Name website</a>.\n' +
    '</p>\n' +
    '<img alt="Savage Worlds Fan Logo" width="300" height="200" src="https://peginc.com/wp-content/uploads/2019/01/SW_LOGO_FP_2018.png"/>\n';
};
