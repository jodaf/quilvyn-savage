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
 * This module loads the rules from the WeirdWest Player's Guide. The WeirdWest
 * function contains methods that load rules for particular parts of the rules:
 * raceRules for character races, arcaneRules for powers, etc. These member
 * methods can be called independently in order to use a subset of the
 * WeirdWest rules. Similarly, the constant fields of WeirdWest (SKILLS, EDGES,
 * etc.) can be manipulated to modify the choices.
 */
function WeirdWest(baseRules) {

  if(window.SWADE == null) {
    alert('The WeirdWest module requires use of the SWADE module');
    return;
  }

  let rules = new QuilvynRules('Deadlands Weird West', WeirdWest.VERSION);
  rules.plugin = WeirdWest;
  WeirdWest.rules = rules;

  rules.defineChoice('choices', WeirdWest.CHOICES);
  rules.choiceEditorElements = WeirdWest.choiceEditorElements;
  rules.choiceRules = WeirdWest.choiceRules;
  rules.removeChoice = SWADE.removeChoice;
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
    'concepts:Concepts,set,concepts',
    'gender:Gender,text,10',
    'ethnicity:Ethnicity,select-one,ethnicitys'
  );

  WeirdWest.attributeRules(rules);
  WeirdWest.combatRules
    (rules, WeirdWest.ARMORS, WeirdWest.SHIELDS, WeirdWest.WEAPONS);
  WeirdWest.arcaneRules(rules, WeirdWest.ARCANAS, WeirdWest.POWERS);
  WeirdWest.talentRules
    (rules, WeirdWest.EDGES, WeirdWest.FEATURES, WeirdWest.GOODIES,
     WeirdWest.HINDRANCES, WeirdWest.SKILLS);
  WeirdWest.identityRules
    (rules, WeirdWest.RACES, WeirdWest.CONCEPTS, WeirdWest.ETHNICITIES,
     WeirdWest.NICKNAMES);

  Quilvyn.addRuleSet(rules);

}

WeirdWest.VERSION = '2.4.1.0';

WeirdWest.CHOICES =
  SWADE.CHOICES.filter(x => !['Era', 'Race'].includes(x)).concat(['Ethnicity', 'Nickname']);
WeirdWest.RANDOMIZABLE_ATTRIBUTES =
  SWADE.RANDOMIZABLE_ATTRIBUTES.filter(x => !['era','race'].includes(x))
    .concat(['ethnicity']);

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
    'Skill=Fighting,Intimidation,Shooting',
  'Chi Master':
    'Edge="Arcane Background (Chi Master)","Martial Artist" ' +
    'Attribute=Agility,Spirit ' +
    'Skill=Focus',
  'Common Folk':'',
  'Deserter': // Estimated related features
    'Edge=Soldier ' +
    'Attribute=Agility,Strength,Vigor ' +
    'Skill=Athletics,Fighting,Shooting',
  'Drifter': // Estimated related features
    'Attribute=Agility ' +
    'Skill="Common Knowledge",Shooting',
  'Escort': // Estimated related features
    'Edge=Attractive ' +
    'Attribute=Spirit,Vigor ' +
    'Skill=Notice,Performance',
  'Explorer': // Estimated related features
    'Attribute=Smarts ' +
    'Skill=Notice,Research,Survival',
  'Grifter': // Estimated related features
    'Attribute=Spirit ' +
    'Skill=Notice,Performance,Persuasion',
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
    'Skill="Common Knowledge",Notice,Research',
  'Outlaw': // Estimated related features
    'Attribute=Agility ' +
    'Skill=Notice,Shooting,Stealth',
  'Prospector': // Estimated related features
    'Skill=Survival',
  'Sheriff': // Estimated related features
    'Attribute=Agility,Smarts,Spirit ' +
    'Skill="Common Knowledge",Intimidation,Notice,Riding,Shooting',
  'Soldier': // Estimated related features
    'Edge=Soldier ' +
    'Attribute=Agility,Strength,Vigor ' +
    'Skill=Athletics,Fighting,Shooting',
  'Territorial Ranger':
    'Edge="Territorial Ranger" ' +
    'Attribute=Vigor ' +
    'Skill=Fighting,Intimidation,Riding,Shooting,Survival',
  'Town Marshall': // Estimated related features
    'Attribute=Agility,Smarts,Spirit ' +
    'Skill="Common Knowledge",Intimidation,Notice,Shooting'
};
WeirdWest.EDGES_ADDED = {
  // Background
  'Arcane Background (Blessed)':
    'Type=Background Require="spirit >= 6","skills.Faith >= 4"',
  'Arcane Background (Chi Master)':
    'Type=Background ' +
    'Require=' +
      '"agility >= 6",' +
      '"spirit >= 6",' +
      '"features.Martial Artist",' +
      '"skills.Focus >= 4"',
  'Arcane Background (Huckster)':
    'Type=Background Require="skills.Gambling >= 6","skills.Spellcasting >= 4"',
  'Arcane Background (Mad Scientist)':
    'Type=Background ' +
    'Require="smarts >= 8","skills.Science >= 6","skills.Weird Science >= 4"',
  'Arcane Background (Shaman)':
    'Type=Background Require="spirit >= 8","skills.Faith >= 4"',
  'Gallows Humor':'Type=Background Require="skills.Taunt >= 6"',
  "Veteran O' The Weird West":
    'Type=Background Require="spirit >= 6","skills.Occult >= 6"',
  // Combat
  "Don't Get 'im Riled!":'Type=Combat',
  'Duelist':'Type=Combat Require="skills.Shooting >= 6"',
  'Fan The Hammer':
    'Type=Combat Require="advances >= 4","agility >= 8","skills.Shooting >= 8"',
  'Improved Fan The Hammer':
    'Type=Combat ' +
    'Require=' +
      '"advances >= 12",' +
      '"agility >= 10",' +
      '"features.Fan The Hammer",' +
      '"skills.Shooting >= 10"',
  'Quick Draw':'Type=Combat Require="agility >= 8"',
  // Professional
  'Agent':
    'Type=Professional ' +
    'Require=' +
      '"smarts >= 8",' +
      '"skills.Fighting >= 6",' +
      '"skills.Occult >= 6",' +
      '"skills.Shooting >= 6"',
  'Born In The Saddle':
    'Type=Professional Require="agility >= 8","skills.Riding >= 6"',
  'Card Sharp':'Type=Professional Require="skills.Gambling >= 6"',
  'Guts':'Type=Professional Require="spirit >= 6"',
  'Scout':'Type=Professional Require="advances >= 4",features.Woodsman',
  'Tale-Teller':
    'Type=Professional ' +
    'Require="skills.Performance >= 8 || skills.Persuasion >= 8"',
  'Territorial Ranger':
    'Type=Professional ' +
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
  'Grit':'Type=Weird Require="advances >= 8","spirit >= 8",features.Guts',
  'Knack (Bastard)':'Type=Weird',
  "Knack (Born On All Hallows' Eve)":'Type=Weird',
  'Knack (Born On Christmas)':
     'Type=Weird ' +
     'Require="features.Arcane Background (Blessed) || features.Arcane Background (Shaman)"',
  'Knack (Breech Birth)':'Type=Weird',
  'Knack (Seventh Son)':'Type=Weird',
  'Knack (Shooting Star)':'Type=Weird',
  'Knack (Storm Born)':'Type=Weird',
  // Legendary
  'Behold A Pale Horse':'Type=Legendary Require="advances >= 16"',
  'Damned':
    'Type=Legendary Require="advances >= 16","spirit >= 6",features.Reputation',
  'Fast As Lightning':
    'Type=Legendary Require="advances >= 16","agility >= 10",features.Quick',
  'Right Hand Of The Devil':
    'Type=Legendary ' +
    'Require=' +
      '"advances >= 16",' +
      '"Sum \'features.Trademark Weapon\' > 0",' +
      '"skills.Shooting>=10 || skills.Fighting>=10 || skills.Athletics>=10"',
  'True Grit':
    'Type=Legendary Require="advances >= 16","spirit >= 10",features.Grit',
  // Agent
  'Agency Promotion':'Type=Professional Require="advances >= 4",features.Agent',
  'Man Of A Thousand Faces':
    'Type=Professional ' +
    'Require=' +
      'features.Agent,' +
      '"advances >= 4",' +
      '"skills.Performance >= 8"',
  // Blessed
  'Flock':
    'Type=Professional ' +
    'Require=' +
      '"features.Arcane Background (Blessed)",' +
      '"advances >= 8",' +
      '"skills.Persuasion >= 8"',
  'True Believer':
    'Type=Professional ' +
    'Require=' +
      '"features.Arcane Background (Blessed)",' +
      '"spirit >= 10",' +
      '"skills.Faith >= 6"',
  // Chi Master
  'Celestial Kung Fu':
    'Type=Power ' +
    'Require=' +
      '"advances >= 8",' +
      '"spirit >= 8",' +
      '"Sum \'features.Superior Kung Fu\' > 0",' +
      '"skills.Fighting >= 10"',
  'Superior Kung Fu (Drunken Style)':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Chi Master)",' +
      '"spirit >= 6",' +
      '"skills.Fighting >= 8"',
  'Superior Kung Fu (Eagle Claw)':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Chi Master)",' +
      '"spirit >= 6",' +
      '"skills.Fighting >= 8"',
  'Superior Kung Fu (Mantis)':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Chi Master)",' +
      '"spirit >= 6",' +
      '"skills.Fighting >= 8"',
  'Superior Kung Fu (Monkey)':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Chi Master)",' +
      '"spirit >= 6",' +
      '"skills.Fighting >= 8"',
  'Superior Kung Fu (Shuai Chao)':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Chi Master)",' +
      '"spirit >= 6",' +
      '"skills.Fighting >= 8"',
  'Superior Kung Fu (Tan Tui)':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Chi Master)",' +
      '"spirit >= 6",' +
      '"skills.Fighting >= 8"',
  'Superior Kung Fu (Wing Chun)':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Chi Master)",' +
      '"spirit >= 6",' +
      '"skills.Fighting >= 8"',
  // Harrowed
  'Harrowed':'Type=Weird Require="spirit >= 6"',
  'Cat Eyes':'Type=Power Require=features.Harrowed',
  'Improved Cat Eyes':
    'Type=Power Require=features.Harrowed,"advances >= 4","features.Cat Eyes"',
  "Chill O' The Grave":'Type=Power Require=features.Harrowed,"advances >= 4"',
  'Claws':'Type=Combat Require=features.Harrowed',
  'Improved Claws':
    'Type=Combat Require=features.Harrowed,"advances >= 8",features.Claws',
  'Ghost':'Type=Power Require=features.Harrowed,"advances >= 12"',
  'Hellfire':'Type=Power Require=features.Harrowed,"advances >= 12"',
  'Implacable':'Type=Combat Require=features.Harrowed,"advances >= 12"',
  'Infest':'Type=Power Require=features.Harrowed',
  'Soul Eater':'Type=Power Require=features.Harrowed,"advances >= 8"',
  'Spook':'Type=Power Require=features.Harrowed',
  "Stitchin'":'Type=Power Require=features.Harrowed',
  "Improved Stitchin'":
    'Type=Power ' +
    'Require=features.Harrowed,"advances >= 8","features.Stitchin\'"',
  'Supernatural Attribute':'Type=Power Require=features.Harrowed',
  'Wither':'Type=Power Require=features.Harrowed',
  // Huckster
  'Hexslinging':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Huckster)",' +
      '"advances >= 4",' +
      '"skills.Shooting >= 8"',
  'High Roller':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Huckster)",' +
      '"advances >= 4",' +
      '"spirit >= 8",' +
      '"skills.Spellcasting >= 6"',
  'Improved High Roller':
    'Type=Power ' +
    'Require=' +
      '"advances >= 8",' +
      '"features.High Roller"',
  'Old Hand':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Huckster)",' +
      '"advances >= 12",' +
      '"skills.Spellcasting >= 10"',
  'Whateley Blood':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Huckster)"',
  // Mad Scientist
  'Alchemy':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Mad Scientist)",' +
      '"advances >= 4",' +
      '"skills.Weird Science >= 8"',
  'Iron Bound':
    'Type=Power Require="features.Arcane Background (Mad Scientist)"',
  'Ore Eater':
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Mad Scientist)",' +
      '"skills.Weird Science >= 6"',
  'True Genius':
    'Type=Power ' +
    'Require="features.Arcane Background (Mad Scientist)","smarts >= 8"',
  // Shaman
  'Fetish':
    'Type=Power ' +
    'Require="features.Arcane Background (Shaman)","skills.Faith >= 8"',
  "Spirit's Favor":
    'Type=Power ' +
    'Require=' +
      '"features.Arcane Background (Shaman)",' +
      '"advances >= 4",' +
      '"skills.Faith >= 8"',
  // Territorial Ranger
  'Like An Oak':
    'Type=Professional ' +
    'Require=' +
      '"features.Territorial Ranger",' +
      '"advances >= 8",' +
      '"features.Grit"',
  'Ranger Promotion':
    'Type=Professional ' +
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
  'Courtn':'Type=Short',
  'Desm':'Type=Short',
  'Edm':'Type=Short',
  'Edn':'Type=Short',
  'Esth':'Type=Short',
  'Ign':'Type=Short',
  'Magd':'Type=Short',
  'Matth':'Type=Short',
  'Sydn':'Type=Short',

  'Abe':'Type=Short Long=Abraham',
  'Alex':'Type=Short Long=Alexander',
  'Angie':'Type=Short Long=Angela,Angele,Angeline',
  'Art':'Type=Short Long=Arthur',
  'Artie':'Type=Short Long=Arthur',
  'Ash':'Type=Short Long=Asher,Ashley',
  'Becky':'Type=Short Long=Rebecca',
  'Bert':'Type=Short Long=Albert,Albertine,Alberto,Berta,Bertram,Bertrand',
  'Bertie':'Type=Short Long=Albert,Albertine,Alberto,Berta,Bertram,Bertrand',
  'Bess':'Type=Short Long=Elisabeth,Elizabeth',
  'Bessie':'Type=Short Long=Elisabeth,Elizabeth',
  'Beth':'Type=Short Long=Bethany,Elisabeth,Elizabeth',
  'Betsy':'Type=Short Long=Elisabeth,Elizabeth',
  'Betty':'Type=Short Long=Elisabeth,Elizabeth',
  'Bram':'Type=Short Long=Abraham',
  'Brucie':'Type=Short Long=Bruce',
  'Carol':'Type=Short Long=Carolina,Caroline',
  'Charlie':'Type=Short Long=Charles,Charlotte',
  'Chuck':'Type=Short Long=Charles',
  'Della':'Type=Short Long=Adela',
  'Dick':'Type=Short Long=Richard',
  'Eliza':'Type=Short Long=Elisabeth,Elizabeth',
  'Fred':'Type=Short Long=Alfred,Freda,Frederick',
  'Jim':'Type=Short Long=James',
  'Jimmy':'Type=Short Long=James',
  'Jules':'Type=Short Long=Julia',
  'Julie':'Type=Short Long=Julia',
  'Libby':'Type=Short Long=Elisabeth,Elizabeth',
  'Larry':'Type=Short Long=Laurence,Lawrence',
  'Lina':'Type=Short Long=Adelina,Adeline,Aileen,Eileen,Magdalena',
  'Liz':'Type=Short Long=Elisabeth,Elizabeth',
  'Lizzy':'Type=Short Long=Elisabeth,Elizabeth',
  'Lou':'Type=Short Long=,Louis,Louisa,Louise',
  'Mandy':'Type=Short Long=Amanda',
  'Margie':'Type=Short Long=Margaret,Margarete,Margarita,Margery,Marguerite',
  'Mike':'Type=Short Long=Michael,Micheal,Michel',
  'Mo':'Type=Short Long=Moses',
  'Nan':'Type=Short Long=Nancy',
  'Nate':'Type=Short Long=Nathan',
  'Nick':'Type=Short Long=Nicolas',
  'Pete':'Type=Short Long=Peter',
  'Ray':'Type=Short Long=Raymond',
  'Rose':'TYpe=Short Long=Rosa,Rosalia,Rosalie',
  'Stu':'Type=Short Long=Stuart',
  'Sue':'Type=Short Long=Susan,Susana,Suzanne',
  'Tom':'Type=Short Long=Thomas,Tomas',
  'Tony':'Type=Short Long=Anthony',
  'Big':'Type=Adjective',
  'Black':'Type=Adjective',
  'Bloody':'Type=Adjective',
  'Brown':'Type=Adjective',
  'Dirty':'Type=Adjective',
  'Dusty':'Type=Adjective',
  'Fast':'Type=Adjective',
  'Fighting':'Type=Adjective',
  'Iron':'Type=Adjective',
  'Lame':'Type=Adjective',
  'Lazy':'Type=Adjective',
  'Little':'Type=Adjective',
  'Lucky':'Type=Adjective',
  'Mad':'Type=Adjective',
  'Red':'Type=Adjective',
  'Rusty':'Type=Adjective',
  'Slow':'Type=Adjective',
  'Wild':'Type=Adjective',
  'Antelope':'Type=Animal',
  'Badger':'Type=Animal',
  'Bear':'Type=Animal',
  'Buffalo':'Type=Animal',
  'Bull':'Type=Animal',
  'Cow':'Type=Animal',
  'Coyote':'Type=Animal',
  'Crow':'Type=Animal Move=Flies,Walks',
  'Deer':'Type=Animal',
  'Duck':'Type=Animal Move=Flies,Swims,Walks',
  'Eagle':'Type=Animal Move=Flies,Walks',
  'Elk':'Type=Animal',
  'Fox':'Type=Animal',
  'Horse':'Type=Animal',
  'Lizard':'Type=Animal Move=Crawls,Swims',
  'Owl':'Type=Animal Move=Flies,Walks',
  'Rabbit':'Type=Animal',
  'Raven':'Type=Animal Move=Flies,Walks',
  'Snake':'Type=Animal Move=Crawls,Swims',
  'Wolf':'Type=Animal',
  'Cactus':'Type=Nature',
  'Darkness':'Type=Nature',
  'Lightning':'Type=Nature',
  'Mountain':'Type=Nature',
  'River':'Type=Nature',
  'Shadows':'Type=Nature',
  'Tree':'Type=Nature',
  'Water':'Type=Nature',
  'Arizona':'Type=Noun',
  'Arkansas':'Type=Noun',
  'Blackjack':'Type=Noun',
  'Devil':'Type=Noun',
  'Dynamite':'Type=Noun',
  'Doc':'Type=Noun',
  'Eyes':'Type=Noun',
  'Foot':'Type=Noun',
  'Gravedigger':'Type=Noun',
  'Hand':'Type=Noun',
  'Justice':'Type=Noun',
  'Kid':'Type=Noun',
  'Pappy':'Type=Noun',
  'Preacher':'Type=Noun',
  'Texas':'Type=Noun',
  'From':'Type=Preposition',
  'At':'Type=Preposition',
  'In':'Type=Preposition',
  'To':'Type=Preposition',
  'Over':'Type=Preposition',
  'Through':'Type=Preposition',
  'Under':'Type=Preposition',
  'Drinks':'Type=Verb',
  'Laughs':'Type=Verb',
  'Looks':'Type=Verb'

};
WeirdWest.ETHNICITIES = {
  'American Indian':'',
  'African American':
    'Feminine=' +
      'Amanda,Anna,Bethany,Charlotte,Elizabeth,Ellen,Emma,Hannah,Harriet,' +
      'Julia,Louisa,Lucy,Mary,Mattie,Millie,Nellie,Nancy,Rebecca,Sally,Susan ' +
    'Masculine=' +
      'Abraham,Alonzo,Ambrose,Booker,Elijah,Freeman,Isaac,Isaiah,Israel,King,' +
      'Master,Moses,Perlie,Percy,Presley,Prince,Titus ' +
    'Family=' +
      'Brown,Davis,Harris,Jackson,Johnson,Robinson,Smith,Taylor,Thomas,' +
      'Williams ' +
    'Order=Western',
  'Chinese':
    'Feminine=' +
      'Ai,Fen,Ju,Liling,Mei,Nuan,Nuo,Shu,Ting,Xiu,Ya,Zhen ' +
    'Masculine=' +
      'Biming,Chang,Chao,Cheng,Cong,Da,Daquan,Dequan,Dong,Fai,Fan,Fang,Feng,' +
      'Gang,Ho,Hong,Huang,Hung,Ji,Jia,Jian,Jin,Jing,Kang,Keung,Kong,Kun,Kuo,' +
      'Laquan,Li,Peng,Ping,Qiang,Qing,Shen,Sheng,Si,Song,Wang,Xing,Xun,Yu,' +
      'Zhao,Zhu,Zhuang ' +
    'Neutral=' +
      'Ah,An,Bai,Bao,Bo,Chen,Chin,Chun,Fa,Fu,Guang,Guo,Hai,Han,He,Heng,Hua,' +
      'Huan,Hui,Jiang,Jiao,Jie,Jun,Lan,Lei,Lian,Liang,Lim,Lin,Ling,Liu,Min,' +
      'Ming,Mu,Ning,Niu,Qi,Qiu,Rong,Ru,Shan,Shi,Shuang,Shui,Shun,Su,Tai,Tu,' +
      'Wei,Wen,Xiang,Xue,Yan,Yi,Yin,Ying,Yong,Yun,Zan,Zheng,Zhi,Zhong ' +
    'Family=' +
      'Chen,Dong,Feng,Gao,Guo,Han,He,Hu,Huang,Li,Liang,Lin,Liu,Lui,Ma,Song,' +
      'Sun,Tang,Wang,Wu,Xiao,Xie,Xu,Yang,Yu,Zhang,Zhao,Zheng,Zhou,Zhu ' +
    'Order=Eastern',
  'English':
    'Feminine=' +
      'Alice,Amelia,Amy,Ann,Anne,Barbara,Beatrice,Bertha,Charlotte,Clara,' +
      'Constance,Daisy,Doris,Edna,Eileen,Eleanor,Elizabeth,Ella,Ellen,Emily,' +
      'Emma,Esther,Ethel,Eva,Freda,Gertrude,Gladys,Hilda,Irene,Iris,Isabella,' +
      'Ivy,Jane,Jean,Kate,Laura,Lillian,Lily,Louisa,Lucy,Mabel,Margaret,' +
      'Margery,Maria,Marie,Martha,Mary,Maud,May,Mildred,Millicent,Muriel,' +
      'Nora,Olive,Phyllis,Rose,Ruby,Ruth,Sarah,Vera,Violet,Winifred ' +
    'Masculine=' +
      'Alan,Albert,Alexander,Alfred,Andrew,Anthony,Arnold,Benjamin,Bernard,' +
      'Bertram,Cecil,Charles,Christopher,Clifford,Colin,Cyril,Daniel,David,' +
      'Dennis,Donald,Douglas,Edgar,Edmund,Edward,Edwin,Eric,Evan,Frank,' +
      'Frederick,George,Gerald,Gilbert,Gordon,Henry,Herbert,Horace,Hugo,Jack,' +
      'James,Joseph,Kenneth,Laurence,Lawrence,Lewis,Lionel,Louis,Lucas,' +
      'Martin,Matthew,Maurice,Michael,Norman,Owen,Patrick,Percival,Peter,' +
      'Philip,Raymond,Richard,Robert,Roland,Ronald,Samuel,Stanley,Sydney,' +
      'Thomas,Victor,Wayne,William ' +
    'Neutral=' +
      'Alexis,Angel,Ashley,Bailey,Beau,Cameron,Casey,Courtney,Devon,Ellis,' +
      'Harley,Jamie,Jordan,Leigh,Mackenzie,Morgan,Quinn,Taylor ' +
    'Family=' +
      // Arbitrary subset of the 100s of English family names in the sources
      'Abbott,Abrahamson,Aikens,Atkinson,Atwater,Avery,Babcock,Bailey,Baker,' +
      'Baldwin,Banks,Barton,Bates,Beckett,Bentley,Best,Boatwright,Booth,' +
      'Brandon,Branson,Bray,Bristol,Brock,Bronson,Buckley,Bull,Burgess,Burke,' +
      'Burnham,Byrd,Cantree,Carpenter,Carver,Caulfield,Clarkson,Clayton,' +
      'Close,Colby,Cole,Collingwood,Combs,Cooper,Dale,Darnell,Donaldson,Eads,' +
      'Earl,Ellsworth,Falconer,Fay,Forrest,Foss,Frost,Gardner,Gates,Gibbs,' +
      'Glass,Goddard,Granger,Gully,Hackett,Haden,Haggard,Haley,Hammond,' +
      'Hancock,Harden,Harding,Harlen,Hathaway,Haywood,Holmes,Honeycutt,' +
      'Hooker,Horton,Howland,Hubbard,Hurst,Hutchinson,Jackman,Jackson,Jepson,' +
      'Joiner,Joyce,Kelsey,Kennard,Kerr,Key,King,Kingston,Kipling,Kirby,' +
      'Landon,Lee,Lincoln,Long,Lynn,Lyon,Marley,Marsh,Mason,Masterson,' +
      'Mathews,Maynard,Merchant,Merrill,Miller,Mills,Milton,Montgomery,Moon,' +
      'Morse,Morton,Moss,Mutton,Nicholson,Nixon,Norris,Odell,Palmer,Pearson,' +
      'Peck,Penn,Pierce,Pilgrim,Pitt,Plank,Poindexter,Priestly,Pryor,Quincy,' +
      'Ramsey,Rhodes,Ridge,Riley,Robertson,Robinson,Rollins,Ross,Roy,Rye,' +
      'Sawyer,Selby,Serman,Shepherd,Simons,Skinner,Smedley,Smith,Spooner,' +
      'Stanton,Steele,Street,Stringer,Sutton,Swanson,Sweet,Taylor,Terry,' +
      'Tindall,Tinker,Tipton,Triggs,Tyler,Underhill,Vance,Vernon,Wallace,' +
      'Warrick,Washington,Waterman,Watt,Webb,Whitaker,Whitney,Wood ' +
    'Order=Western',
  'French':
    'Feminine=' +
      'Adele,Adeline,Adrienne,Aimee,Albertine,Alice,Aline,Alphonsine,Amelie,' +
      'Andrea,Angele,Angeline,Anne,Annette,Antoinette,Augustine,Bernadette,' +
      'Blanche,Carmen,Caroline,Catherine,Cecile,Celestine,Charlotte,Claire,' +
      'Claudine,Clementine,Clotilde,Constance,Denise,Eleonore,Eliane,' +
      'Elisabeth,Elise,Emelie,Emma,Ernestine,Estelle,Esther,Eugenie,Eulalie,' +
      'Felicie,Genevieve,Georgine,Gertrude,Helene,Henriette,Hermine,' +
      'Hildegarde,Hortense,Jeanne,Josephine,Juliette,Lea,Leone,Leonie,Louise,' +
      'Lucie,Marguerite,Marie,Marion,Marthilde,Noemie,Odile,Olive,Pauline,' +
      'Prudence,Rosalie,Rose,Suzanne,Therese,Valentine,Victorine ' +
    'Masculine=' +
      'Abel,Adam,Adolphe,Adrien,Albin,Alcide,Alexis,Alfred,Alphonse,Anatole,' +
      'Andre,Antoine,Armand,Arthur,Auguste,Augustin,Bernard,Bertrand,Charles,' +
      'Clair,Clovis,Daniel,Denis,Edgar,Edmond,Elie,Emile,Ernest,Eugene,Felix,' +
      'Ferdinand,Fernand,Francis,Francois,Gabriel,Gaston,Gilbert,Gustave,Guy,' +
      'Hector,Henri,Horace,Jacque,Jean,Joseph,Jules,Julien,Justin,Louis,' +
      'Lucien,Marcel,Martin,Maurice,Michel,Noel,Octave,Paul,Pierre,Raoul,' +
      'Raymond,Rene,Richard,Robert,Roger,Roland,Salomon,Simon,Theophile,' +
      'Victor,Vincent ' +
    'Neutral=' +
      'Alix,Ange,Camille,Celeste,Claude,Hyacinthe,Irenee,Leonce,Modeste ' +
    'Family=' +
      'Beauchamp,Blanchard,Boucher,Bouvier,Calvin,Chastain,Colbert,Deschamps,' +
      'Dubois,Dumas,Dupuy,Durant,Duval,Fabre,Fay,Fevre,Forest,Gage,Granger,' +
      'Hardy,Lamar,Lambert,Lane,Langley,Larue,Laurent,Lefevre,Legrand,Lyon,' +
      'Macon,Noel,Page,Petit,Picard,Roche,Rose,Royer,Salmon,Traver,Tremble ' +
    'Order=Western',
  'German':
    'Feminine=' +
      'Anna,Charlotte,Clara,Dorothea,Edith,Elfriede,Elisabeth,Erna,Frieda,' +
      'Hedwig,Helga,Ida,Irma,Johanna,Margarete,Maria,Paula,Wilhelmine ' +
    'Masculine=' +
      'Adolf,Albert,August,Carl,Emil,Ernst,Franz,Friedrich,Gerhard,Gustav,' +
      'Hans,Herbert,Hermann,Karl,Moritz,Otto,Paul,Richard,Robert,Rudolf,' +
      'Walter,Werner,Wilhelm ' +
    'Neutral=' +
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
      'Winkler,Winter,Wirth,Wolf,Ziegler,Zimmerman ' +
    'Order=Western',
  'Irish':
    'Feminine=' +
      'Aileen,Bridget,Eileen,Honora,Nora,Una ' +
    'Masculine=' +
      'Barry,Desmond,Micheal,Oran,Owen,Patrick,Shane ' +
    'Neutral=' +
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
      'Toole,Tracey,Wallace,Walsh,Ward ' +
    'Order=Western',
  'Jewish':
    'Feminine=' +
      'Adina,Alma,Dana,Ela,Esther,Golda,Hannah,Judith,Leah,Miriam,Naomi,Neta,' +
      'Odelia,Ora,Rachel,Sarah,Zelda ' +
    'Masculine=' +
      'Aaron,Abraham,Adam,Adi,Ami,Amos,Asa,Asher,Daniel,David,Eden,Eli,' +
      'Elijah,Elon,Ephraim,Ezra,Gideon,Guy,Hershel,Hyman,Ira,Irving,Isaac,' +
      'Isidore,Israel,Jacob,Levi,Malachi,Mordecai,Moses,Nathan,Omer,Orel,' +
      'Oren,Rafael,Rueben,Samuel,Saul,Solomon,Uriel ' +
    'Neutral=' +
      'Amit,Ariel,Lior,Maayan,Noam,Ofir,Omer,Or,Shachar,Shai,Uria,Yuval ' +
    'Family=' +
      'Abrahamson,Abrams,Adams,Cline,Cohen,Fisher,Hayes,Kaufmann,Klein,' +
      'Kramer,Lowe,Mandel,Mayer,Meier,Meyer,Neumann,Reis,Rose,Roth,Schneider,' +
      'Schwartz,Sherman,Stein,Stuck,Wirth,Zimmermann ' +
    'Order=Western',
  'Multiethnic':'',
  'Scottish':
    'Feminine=' +
      'Aileen,Anna,Fiona,Iona,Isla,Jean,Katrina,Kirsty,Shona ' +
    'Masculine=' +
      // Graham was on this list, but it's a pain to nickname
      'Alan,Angus,Bruce,Colin,Craig,David,Donald,Douglas,Duncan,Gordon,' +
      'Grant,Keith,Kenneth,Malcolm,Murray,Neil,Roderick,Ronald,Ross,Roy,' +
      'Scott,Stewart,Stuart ' +
    'Neutral=' +
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
      'Watson,Wood,Woods ' +
    'Order=Western',
  'Spanish':
    'Feminine=' +
      'Adela,Adelina,Aida,Alba,Albina,Alicia,Amalia,Amanda,Amelia,Ana,Andrea,' +
      'Angela,Anita,Antonia,Aurelia,Berta,Carlota,Carmela,Carmen,Carolina,' +
      'Cecilia,Celia,Clara,Claudia,Clotilde,Delfina,Delia,Diana,Dolores,' +
      'Elena,Eloisa,Elvira,Emma,Emilia,Esther,Eugenia,Eulalia,Eva,Felicia,' +
      'Filomena,Flora,Francisca,Genoveva,Gloria,Gracia,Gregoria,Guadelupe,' +
      'Herminia,Ines,Irene,Isabel,Josefina,Juana,Justina,Laura,Leonor,Lorena,' +
      'Lorenza,Lucia,Luisa,Luna,Luz,Magdalena,Margarita,Maria,Martina,' +
      'Maltilde,Mercedes,Oliva,Paulina,Ramona,Rosa,Rosalia,Sabina,Silvia,' +
      'Sofia,Susana,Teresa,Valeria ' +
    'Masculine=' +
      'Abraham,Adolfo,Alberto,Alejandro,Alfonso,Alfredo,Amado,Angel,Antonio,' +
      'Benito,Benjamin,Bernardo,Candido,Casimiro,Clemente,Diego,Domingo,' +
      'Emiliano,Emilio,Enrique,Epifanio,Ernesto,Fabian,Federico,Felipe,Felix,' +
      'Fernando,Florencio,Florian,Francisco,Gabriel,German,Gregorio,Hector,' +
      'Hugo,Ignacio,Jesus,Joaquin,Joel,Jose,Juan,Julio,Leon,Lorenzo,Luis,' +
      'Manuel,Miguel,Nicolas,Pablo,Pedro,Rafael,Roman,Ruben,Santiago,Tomas,' +
      'Vicente ' +
    'Neutral=' +
      'Ale,Cande,Chus,Cruz,Guadelupe,Guiomar,Lupe,Maxi,Patrocinio,Reyes,' +
      'Trinidad,Yunuen ' +
    'Family=' +
      'Aguilar,Alvarez,Castillo,Castro,Chavez,Contreras,Cortez,Cruz,Diaz,' +
      'Dominguez,Estrada,Fernandez,Flores,Garcia,Garza,Gomez,Gonzalez,Guerro,' +
      'Gutierrez,Guzman,Hernanez,Herrera,Jimenez,Juarez,Lopez,Luna,Martinez,' +
      'Medina,Mendez,Menoza,Morales,Moreno,Munoz,Ortega,Ortiz,Perez,Ramirez,' +
      'Ramos,Reyes,Rivera,Rodriguez,Rojas,Romero,Ruiz,Salazar,Sanchez,Soto,' +
      'Torres,Vargas,Velasquez,Vasquez ' +
    'Order=Western'
};
WeirdWest.FEATURES_ADDED = {

  // Edges
  'Agency Promotion':
    'Section=feature ' +
    'Note="Has moved up %{$\'edges.Agency Promotion\'} ranks in The Agency hierarchy; can request bigger favors"',
  'Agent':
    'Section=feature ' +
    'Note="Works for and receives favors from a covert government agency"',
  'Alchemy':
    'Section=arcana ' +
    'Note="May spend 3 PP to create 3 Snake Oil, Focusing, and/or Peptonic potions lasting 1 dy"',
  'Arcane Background (Blessed)':
    'Section=arcana,arcana,feature ' +
    'Note=' +
      '"3 Powers/15 Power Points",' +
      '"Critical failure causes Fatigue",' +
      '"Violating core beliefs inflicts -2 Faith for 1 wk; major sins remove powers"',
  'Arcane Background (Chi Master)':
    'Section=arcana,arcana ' +
    'Note=' +
      '"3 Powers/15 Power Points",' +
      '"Critical failure causes Fatigue/Power range reduced to self or touch"',
  'Arcane Background (Huckster)':
    'Section=arcana,arcana ' +
    'Note=' +
      '"3 Powers/10 Power Points",' +
      '"Critical failure causes Fatigue/May cast via Deal with the Devil"',
  'Arcane Background (Mad Scientist)':
    'Section=arcana,arcana ' +
    'Note=' +
      '"2 Powers/15 Power Points",' +
      '"Critical failure causes malfunction"',
  'Arcane Background (Shaman)':
    'Section=arcana,arcana ' +
    'Note=' +
      '"2 Powers/15 Power Points",' +
      '"Critical failure causes Fatigue"',
  'Behold A Pale Horse':
    'Section=feature ' +
    'Note="Mount is a Wild Card with Fearless and Danger Sense features"',
  'Born In The Saddle':
    'Section=skill ' +
    'Note="May reroll Riding/Mount gains +2 Pace and +1 Run Step"',
  'Card Sharp':'Section=skill Note="May reroll Gambling"',
  'Cat Eyes':
    'Section=feature ' +
    'Note="Suffers no penalty in %{featureNotes.improvedCatEyes?\'any\':\'dim or dark\'} lighting"',
  'Celestial Kung Fu':
    'Section=combat ' +
    'Note="+1 Edge Points (Superior Kung Fu style); may use 2 styles at once"',
  "Chill O' The Grave":
    'Section=combat ' +
    'Note="May spend a benny for a 3\\" radius cold blast that makes unprepared creatures vulnerable"',
  'Claws':SWADE.FEATURES.Claws,
  'Damned':'Section=feature Note="Will return as a Harrowed if killed"',
  "Don't Get 'im Riled!":
    'Section=combat Note="Adds Wound level to damage rolls"',
  'Duelist':
    'Section=combat Note="Dealt two extra hole cards at the start of a duel"',
  'Fan The Hammer':
     'Section=combat ' +
     'Note="May shoot up to 6 shots in one action at %{combatNotes.improvedFanTheHammer?-2:-4}; a roll of 1 or 2 may hit a bystander"',
  'Fast As Lightning':'Section=combat Note="May take 4 actions at -6 each"',
  'Fetish':'Section=skill Note="May reroll Faith"',
  'Flock':'Section=feature Note="Has 5 townsfolk followers"',
  'Gallows Humor':
    'Section=skill Note="May use Taunt vs. fear; Raise gives +1 to allies"',
  'Ghost':'Section=feature Note="May become incorporeal at will"',
  'Grit':'Section=attribute Note="Reduces penalties vs. fear by 2"',
  'Guts':'Section=attribute Note="May reroll Vigor vs. fear"',
  'Harrowed':
    'Section=attribute,combat,combat,feature,skill,skill ' +
    'Note=' +
      '"+2 Spirit (Shaken recovery)",' +
      '"+2 Toughness",' +
      '"Ignores non-head Called Shot damage/Doesn\'t bleed out/Killed only if brain is destroyed/Immune to disease and poison",' +
      '"+1 Edge Points (Harrowed edge)/Ignores 1 point of Wound penalty/Doesn\'t breathe or drink/Smells of decay/May Let the Devil Out for +6 trait and damage for 5 rd",' +
      '"-2 Persuasion/-2 Riding",' +
      '"-2 with animals"',
  'Hellfire':'Section=arcana Note="9\\" cone inflicts 3d6 damage 1/rd"',
  'Hexslinging':
    'Section=arcana ' +
    'Note="May cast <i>Ammo Whammy</i>, <i>Deflection</i>, <i>Boost Trait</i> (Shooting), and <i>Protection</i> via weapon"',
  'High Roller':
    'Section=arcana ' +
    'Note="Dealt %{powerNotes.improvedHighRoller?2:1} extra cards for Deal with the Devil"',
  'Implacable':
    'Section=combat Note="Takes +1 Wound before becoming incapacitated"',
  'Improved Cat Eyes':'Section=feature Note="Increased Cat Eyes effects"',
  'Improved Claws':'Section=combat Note="Increased Claws damage, AP 2"',
  'Improved Fan The Hammer':
    'Section=combat Note="Increased Fan The Hammer effects"',
  'Improved High Roller':'Section=arcana Note="Increased High Roller effects"',
  "Improved Stitchin'":'Section=combat Note="Increased Stitchin\' effects"',
  'Infest':
    'Section=arcana Note="May summon and control an insect swarm for 5 min"',
  'Iron Bound':'Section=feature Note="Has connections with industrial science"',
  'Like An Oak':
    'Section=combat ' +
    'Note="R12\\" allies ignore 2 points of fear penalties on fear checks"',
  'Knack (Bastard)':
    'Section=feature ' +
    'Note="May spend a benny to see invisible and hidden creatures for 5 rd"',
  "Knack (Born On All Hallows' Eve)":
    'Section=feature Note="May spend Conviction to reroll a critical failure"',
  'Knack (Born On Christmas)':
    'Section=combat ' +
    'Note="May spend a benny to negate a Power effect and shake the caster (Spirit-4 neg)"',
  'Knack (Breech Birth)':
    'Section=combat Note="May spend a benny to heal 1 Wound"',
  'Knack (Seventh Son)':
    'Section=feature Note="May spend a benny to negate a benny effect"',
  'Knack (Shooting Star)':
    'Section=combat ' +
    'Note="May spend a benny to dbl Command range for the remainder of the encounter"',
  'Knack (Storm Born)':
    'Section=attribute Note="Ignores penalties on benny reroll vs. fear"',
  'Man Of A Thousand Faces':
    'Section=skill Note="+2 Performance (impersonate character type)"',
  'Old Hand':
    'Section=arcana Note="May redraw up to 3 cards for Deal with the Devil"',
  'Ore Eater':
    'Section=arcana,feature ' +
    'Note=' +
      '"+5 Power Points",' +
      '"May contract ghost rock fever"',
  'Quick Draw':
    'Section=combat,skill ' +
    'Note=' +
      '"May spend a benny to receive two extra Action Cards",' +
      '"+2 Athletics (interrupt others\' action)"',
  'Ranger Promotion':
    'Section=feature ' +
    'Note="Has moved up %{$\'edges.Ranger Promotion\'} ranks in Territorial Ranger hierarchy"',
  'Reputation':
    'Section=skill ' +
    'Note="+2 Intimidation (bad reputation) or may reroll Persuasion (good reputation) with those who have heard stories"',
  'Right Hand Of The Devil':
    'Section=combat Note="Trademark weapon does +1 die of damage"',
  'Scout':
    'Section=skill ' +
    'Note="Successful Notice-2 detects encounters/Always considered alert vs. Stealth/Ignores 2 penalty points for Survival (tracking)/+2 Common Knowledge (known route)"',
  'Soul Eater':
    'Section=combat ' +
    'Note="Successful Spirit-2 roll after inflicting an unarmed Wound heals self Wound or reduces Fatigue"',
  "Spirit's Favor":
    'Section=arcana Note="May cast chosen power as a free action"',
  'Spook':
    'Section=arcana ' +
    'Note="May make a targeted -2 fear effect or suffer Fatigue to make a 12\\" radius fear effect"',
  "Stitchin'":'Section=combat Note="May attempt a natural healing roll 1/%V"',
  'Superior Kung Fu (Drunken Style)':
    'Section=combat Note="May suffer -2 Pace to inflict -2 attack on foes"',
  'Superior Kung Fu (Eagle Claw)':
    'Section=combat Note="Hands are heavy weapons with AP 4"',
  'Superior Kung Fu (Mantis)':
    'Section=combat ' +
    'Note="May make foe Distracted or Vulnerable after a failed attack 1/rd"',
  'Superior Kung Fu (Monkey)':
    'Section=combat ' +
    'Note="Gives +2 Parry/May make an Athletics test on all adjacent foes as a single action"',
  'Superior Kung Fu (Shuai Chao)':
    'Section=combat ' +
    'Note="May make a free grapple attempt after a failed foe attack"',
  'Superior Kung Fu (Tan Tui)':
    'Section=attribute,combat ' +
    'Note="Standing from prone costs no movement",' +
         '"Gives +1 unarmed damage Step 1/rd/Successful unarmed attack knocks back 1d4\\" (Raise 1d4+2\\")"',
  'Superior Kung Fu (Wing Chun)':
    'Section=combat Note="Gives +1 Parry/Foes suffer -2 melee damage"',
  'Supernatural Attribute':'Section=attribute Note="+%V Attribute Points"',
  'Tale-Teller':
    'Section=skill ' +
    'Note="Successful +2 Persuasion or Performance lowers fear; Raise gives Conviction"',
  'Territorial Ranger':
    'Section=feature Note="Works for the U.S. Marshals agency"',
  'True Believer':'Section=skill Note="May reroll Faith"',
  'True Genius':
    'Section=arcana Note="May spend a benny to reroll madness or malfunction"',
  'True Grit':
    'Section=attribute ' +
    'Note="Ignores penalties vs. fear/May reroll fear effects"',
  "Veteran O' The Weird West":
     'Section=description,feature ' +
     'Note="+4 Advances","Has an additional hindrance"',
  'Whateley Blood':
    'Section=arcana,skill ' +
    'Note="May suffer Fatigue to gain 5 Power Points or 1 Wound to gain 10","-1 Persuasion"',
  'Wither':
    'Section=arcana ' +
    'Note="Touch reduces target Strength (Raise Strength and Vigor) 1 Step for 1 hr"',

  // Hindrances
  "Ailin'":
    'Section=attribute ' +
    'Note="-1 vs. Fatigue; critical failure inflicts Ailin\'+"',
  "Ailin'+":
    'Section=attribute Note="-2 vs. Fatigue; critical failure inflicts death"',
  'Cursed+':'Section=feature Note="GM gains +1 Benny each session"',
  "Grim Servant O' Death+":
    'Section=combat ' +
    'Note="Inflicts +1 damage; critical failure hits nearest ally w/Raise"',
  'Heavy Sleeper':
    'Section=attribute,skill ' +
    'Note="-4 Vigor (stay awake)","-4 Notice (wake up)"',
  "Lyin' Eyes":
    'Section=skill ' +
    'Note="-1 Gambling (poker and faro)/-1 Intimidation (lies)/-1 Persuasion (lies)"',
  'Night Terrors+':
    'Section=attribute,feature ' +
    'Note="-1 Spirit","Disturbs the sleep of others nearby"',
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
  'Trouble Magnet+':
    'Section=feature Note="Random consequences always affect self"'

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
    'Description="Hex gun ammo gains additional effects for 5 rd"',
  'Curse':
    'Advances=4 ' +
    'PowerPoints=5 ' +
    'Range=touch ' +
    'Description=' +
      '"Target suffers 1 level of Fatigue and an additional level each sunset (Spirit neg)"',
  'Detect Arcana':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Description="Target can detect the presence of supernatural effects (Raise also the type) for 5 rd"',
  'Growth':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Description=' +
      '"Target gains Toughness and Strength Step (Spirit neg) for 5 rd"',
  'Holy Symbol':
    'Advances=0 ' +
    'PowerPoints=3 ' +
    'Range=self ' +
    'Modifier=' +
      '"+2/+3 PP 2\\"/3\\" radius",' +
      '"+1 PP Spirit-2" ' +
    'Description=' +
      '"Supernaturally evil creatures cannot attack self physically (Spirit neg (Raise Spirit-2)) for 5 rd"',
  'Light':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Description=' +
      '"Creates a 3\\" radius (Raise or a 5\\" beam) bright light for 10 min"',
  'Numb':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=self ' +
    'Description=' +
      '"Allies in a %{spirit}\\" radius ignore 1 point of Wound or Fatigue penalties (Raise 2) for 5 rd"',
  'Puppet':SWADE.POWERS.Puppet
    .replace('Modifier=', 'Modifier="+1 PP Self can use target senses",'),
  'Sanctify':
    'Advances=8 ' +
    'PowerPoints=10 ' +
    'Range=touch ' +
    'Description=' +
      '"Supernaturally evil creatures in a 15\\" sq suffer Fatigue (Spirit neg (Raise Spirit-2)) until the next sunset"',
  'Shrink':
    'Advances=4 ' +
    'PowerPoints=2 ' +
    'Range=smarts ' +
    'Description=' +
      '"Target loses Toughness and Strength Step (Spirit neg) for 5 rd"',
  'Trinkets':
    'Advances=0 ' +
    'PowerPoints=3 ' +
    'Range=smarts ' +
    'Modifier=' +
      '"+1 PP Creates a set of items",' +
      '"+2 PP Creates 2 lb item" ' +
    'Description="Creates a 1 lb item for 5 rd (Raise 5 min)"',
  'Wilderness Walk':
    'Advances=0 ' +
    'PowerPoints=2 ' +
    'Range=self ' +
    'Modifier=' +
      '"+1 PP/additional target" ' +
    'Description="Gains triple speed and becomes untraceable in wilderness for 1 hr"'
};
WeirdWest.POWERS = Object.assign({}, SWADE.POWERS, WeirdWest.POWERS_ADDED);
WeirdWest.RACES = {
  'Human':
    'Abilities=' +
      'Adaptable'
};
WeirdWest.SHIELDS = {
  'None':'Parry=0 Cover=0 MinStr=0 Weight=0',
  'Medium Native Shield':'Parry=2 Cover=2 MinStr=4 Weight=5',
  'Small Native Shield':'Parry=1 Cover=1 MinStr=4 Weight=3'
};
WeirdWest.SKILLS_ADDED = {
  'Trade':'Attribute=Smarts'
};
WeirdWest.SKILLS = Object.assign({}, SWADE.SKILLS, WeirdWest.SKILLS_ADDED);
delete WeirdWest.SKILLS.Electronics;
delete WeirdWest.SKILLS.Hacking;
WeirdWest.WEAPONS = {

  'Brass Knuckles':'Damage=Str+d4 MinStr=4 Weight=1 Category=One-Handed',
  'Bayonet':'Damage=Str+d4 MinStr=4 Weight=1 Category=One-Handed',
  'Club':'Damage=Str+d4 MinStr=4 Weight=1 Category=One-Handed',
  'War Club':'Damage=Str+d6 MinStr=6 Weight=3 Category=One-Handed Range=3',
  'Bladed War Club':
    'Damage=Str+d8 MinStr=8 Weight=6 Category=Two-Handed AP=2 Parry=-1',
  'Knife':'Damage=Str+d4 MinStr=4 Weight=1 Category=One-Handed Range=3',
  'Bowie Knife':
    'Damage=Str+d4+1 MinStr=4 Weight=2 Category=One-Handed AP=1 Range=2',
  'Plains Indian Lance':
    'Damage=Str+d6 MinStr=6 Weight=4 Category=One-Handed Range=2',
  'Saber':'Damage=Str+d6 MinStr=6 Weight=4 Category=One-Handed',
  'Spear':'Damage=Str+d6 MinStr=6 Weight=5 Category=Two-Handed Parry=1 Range=3',
  'Tomahawk':'Damage=Str+d6 MinStr=6 Weight=4 Category=One-Handed Range=3',
  'Unarmed':SWADE.WEAPONS.Unarmed,
  'Whip':'Damage=Str+d4 MinStr=4 Weight=2 Category=One-Handed Parry=-1',

  'Gatling Pistol':
    'Damage=2d6 MinStr=4 Weight=5 Category=Ranged Range=12 AP=1 ROF=3',
  'Gatling Carbine':
    'Damage=2d8 MinStr=6 Weight=12 Category=Ranged Range=20 AP=2 ROF=2',
  'Gatling Rifle':
    'Damage=2d8 MinStr=8 Weight=17 Category=Ranged Range=24 AP=2 ROF=2',
  'Gatling Shotgun':
    'Damage=3d6 MinStr=8 Weight=15 Category=Ranged Range=12 ROF=2',
  'Gatling Gun':
    'Damage=2d8 MinStr=6 Weight=40 Category=Ranged Range=24 AP=2 ROF=3',

  'Derringer':'Damage=2d4 MinStr=4 Weight=1 Category=Ranged Range=3',
  'English 1840 Model':
    'Damage=2d6-1 MinStr=4 Weight=1 Category=Ranged Range=5 AP=1',
  'Rupertus Pepperbox':'Damage=2d4 MinStr=6 Weight=1 Category=Ranged Range=5',
  'Wesson Dagger-Pistol':'Damage=2d4 MinStr=6 Weight=1 Category=Ranged Range=5',

  'Colt Army':'Damage=2d6+1 MinStr=4 Weight=2 Category=Ranged Range=12 AP=1',
  'Colt Buntline Special':
    'Damage=2d6+1 MinStr=6 Weight=3 Category=Ranged Range=15 AP=1',
  'Colt Dragoon':'Damage=2d6+1 MinStr=4 Weight=4 Category=Ranged Range=12 AP=1',
  'Colt Navy':'Damage=2d6 MinStr=4 Weight=3 Category=Ranged Range=12 AP=1',
  'Colt Peacemaker':
    'Damage=2d6+1 MinStr=4 Weight=4 Category=Ranged Range=12 AP=1',
  'LeMat Revolver':'Damage=2d6 MinStr=6 Weight=4 Category=Ranged Range=12 AP=1',
  'LeMat Revolver Shotgun':
    'Damage=3d6 MinStr=6 Weight=4 Category=Ranged Range=5',

  'Colt Frontier':
    'Damage=2d6+1 MinStr=4 Weight=2 Category=Ranged Range=12 AP=1',
  'Colt Lightning':'Damage=2d6 MinStr=4 Weight=2 Category=Ranged Range=12 AP=1',
  'Colt Rainmaker':'Damage=2d6 MinStr=4 Weight=2 Category=Ranged Range=12 AP=1',
  'Colt Thunderer':'Damage=2d6 MinStr=4 Weight=2 Category=Ranged Range=12 AP=1',
  'Starr Revolver':
    'Damage=2d6+1 MinStr=4 Weight=2 Category=Ranged Range=12 AP=1',

  "Sharps '55":'Damage=2d8 MinStr=6 Weight=8 Category=Ranged Range=20 AP=2',
  'Spencer':'Damage=2d8 MinStr=4 Weight=8 Category=Ranged Range=20 AP=2',
  'LeMat Carbine':'Damage=2d8 MinStr=6 Weight=9 Category=Ranged Range=20 AP=1',
  'LeMat Carbine Shotgun':
    'Damage=3d6 MinStr=6 Weight=9 Category=Ranged Range=12',

  "Ballard '72":'Damage=2d8 MinStr=6 Weight=11 Category=Ranged Range=24 AP=2',
  'Bullard Express':
    'Damage=2d10 MinStr=8 Weight=11 Category=Ranged Range=24 AP=2',
  "Colt-Paterson Model '36":
    'Damage=2d10 MinStr=8 Weight=12 Category=Ranged Range=24 AP=2',
  'Enfield Musket':'Damage=2d8 MinStr=6 Weight=9 Category=Ranged Range=12 AP=2',
  'Evans Old Model Sporter':
    'Damage=2d8 MinStr=6 Weight=12 Category=Ranged Range=24 AP=2',
  'Sawed-Off Winchester':
    'Damage=2d8-1 MinStr=4 Weight=4 Category=Ranged Range=12 AP=2',
  "Sharp's Big 50":
    'Damage=2d10 MinStr=8 Weight=11 Category=Ranged Range=30 AP=2',
  'Springfield Rifled Musket':
    'Damage=2d8 MinStr=6 Weight=11 Category=Ranged Range=15',
  "Winchester '73":
    'Damage=2d8-1 MinStr=6 Weight=10 Category=Ranged Range=24 AP=2',
  "Winchester '76":'Damage=2d8 MinStr=4 Weight=7 Category=Ranged Range=24 AP=2',

  'Colt Revolving Shotgun':
    'Damage=3d6 MinStr=6 Weight=10 Category=Ranged Range=12',
  'Double-Barrel Shotgun':
    'Damage=3d6 MinStr=6 Weight=11 Category=Ranged Range=12',
  'Sawed-Off Double-Barrel Shotgun':
    'Damage=3d6 MinStr=4 Weight=6 Category=Ranged Range=5',
  'Single-Barrel Shotgun':
    'Damage=3d6 MinStr=4 Weight=6 Category=Ranged Range=12',
  'Winchester Lever-Action Shotgun':
    'Damage=3d6 MinStr=6 Weight=6 Category=Ranged Range=12',

  'Bola':'Damage=Str+d1 MinStr=4 Weight=1 Category=Ranged Range=4',
  'Bow':'Damage=2d6 MinStr=6 Weight=2 Category=Ranged Range=12',

  'Flamethrower':'Damage=3d6 MinStr=6 Weight=15 Category=Ranged Range=9',
  'Steam Saw':'Damage=2d6+4 MinStr=8 Weight=20 Category=Two-Handed',
  'Steam Gatling':'Damage=2d8 MinStr=6 Weight=50 Category=Ranged Range=24'

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
  rules, races, concepts, ethnicities, nicknames
) {

  SWADE.identityRules(rules, races, {}, concepts);

  QuilvynUtils.checkAttrTable
    (ethnicities, ['Family', 'Feminine', 'Masculine', 'Neutral', 'Order']);
  QuilvynUtils.checkAttrTable(nicknames, ['Type', 'Long', 'Move']);

  for(let ethnicity in ethnicities) {
    rules.choiceRules(rules, 'Ethnicity', ethnicity, ethnicities[ethnicity]);
  }
  for(let nickname in nicknames) {
    rules.choiceRules(rules, 'Nickname', nickname, nicknames[nickname]);
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
  rules, edges, features, goodies, hindrances, skills
) {
  SWADE.talentRules(rules, edges, features, goodies, hindrances, skills);
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
  else if(type == 'Edge') {
    WeirdWest.edgeRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValueArray(attrs, 'Type')
    );
    WeirdWest.edgeRulesExtra(rules, name);
  } else if(type == 'Ethnicity')
    WeirdWest.ethnicityRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Feminine'),
      QuilvynUtils.getAttrValueArray(attrs, 'Masculine'),
      QuilvynUtils.getAttrValueArray(attrs, 'Neutral'),
      QuilvynUtils.getAttrValueArray(attrs, 'Family'),
      QuilvynUtils.getAttrValue(attrs, 'Order')
    );
  else if(type == 'Feature')
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
  else if(type == 'Nickname')
    WeirdWest.nicknameRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Type'),
      QuilvynUtils.getAttrValueArray(attrs, 'Long'),
      QuilvynUtils.getAttrValueArray(attrs, 'Move')
    );
  else if(type == 'Power')
    WeirdWest.powerRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Advances'),
      QuilvynUtils.getAttrValue(attrs, 'PowerPoints'),
      QuilvynUtils.getAttrValue(attrs, 'Range'),
      QuilvynUtils.getAttrValue(attrs, 'Description'),
      QuilvynUtils.getAttrValueArray(attrs, 'Modifier'),
      QuilvynUtils.getAttrValue(attrs, 'BasedOn')
    );
  else if(type == 'Race')
    WeirdWest.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Abilities')
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
  type =
    type.charAt(0).toLowerCase() + type.substring(1).replaceAll(' ', '') + 's';
  rules.addChoice(type, name, attrs);
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
  SWADE.armorRules(rules, name, [], areas, armor, minStr, weight);
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
  if(name == 'Celestial Kung Fu') {
    rules.defineRule('edgePoints', 'combatNotes.celestialKungFu', '+=', '1');
  } else if(name == 'Claws') {
    rules.defineRule('damageStep.Claws',
      'combatNotes.claws', '+=', '2',
      'combatNotes.improvedClaws', '+', '1'
    );
  } else if(name == 'Harrowed') {
    rules.defineRule('edgePoints', 'featureNotes.harrowed', '+=', '1');
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

/*
 * Defines in #rules# the rules associated with ethnicity #name#. #femaleNames#,
 * #maleNames#, #neutralNames#, and #familyNames# each list the various names
 * associated with the ethnicity. If true, #order# indicates the arrangement
 * of the parts of a name--either "Western" (personal name, then family name)
 * or "Eastern" (family name, then personal name).
 */
WeirdWest.ethnicityRules = function(
  rules, name, femaleNames, maleNames, neutralNames, familyNames, order
) {
  if(!name) {
    console.log('Empty ethnicity name');
    return;
  }
  if(!Array.isArray(femaleNames)) {
    console.log('Bad female names "' + femaleNames + '" for ethnicity ' + name);
    return;
  }
  if(!Array.isArray(maleNames)) {
    console.log('Bad male names "' + maleNames + '" for ethnicity ' + name);
    return;
  }
  if(!Array.isArray(neutralNames)) {
    console.log
      ('Bad neutral names "' + neutralNames + '" for ethnicity ' + name);
    return;
  }
  if(!Array.isArray(familyNames)) {
    console.log('Bad family names "' + familyNames + '" for ethnicity ' + name);
    return;
  }
  if(order && !(order + '').match(/^(eastern|western)$/i)) {
    console.log('Bad order "' + order + '" for ethnicity ' + name);
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
 * Defines in #rules# the rules associated with nickname #name#. #types# lists
 * the function(s) of the nickname, #longs# lists the full names for short
 * nicknames, and #moves# lists the movement verbs for animal nicknames.
 */
WeirdWest.nicknameRules = function(rules, name, types, longs, moves) {
  if(!name) {
    console.log('Empty ethnicity name');
    return;
  }
  if(!Array.isArray(types)) {
    console.log('Bad types "' + types + '" for nickname ' + name);
    return;
  }
  if(!Array.isArray(longs)) {
    console.log('Bad longs "' + longs + '" for nickname ' + name);
    return;
  }
  if(!Array.isArray(moves)) {
    console.log('Bad moves "' + moves + '" for nickname ' + name);
    return;
  }
  // No rules pertain to nicknames
};

/*
 * Defines in #rules# the rules associated with power #name#, which may be
 * acquired only after #advances# advances, requires #powerPoints# Power Points
 * to use, and can be cast at range #range#. #description# is a concise
 * description of the power's effects. #modifiers# lists specific modifications
 * that may be applied when using this power. #basedOn#, if defined, is an
 * existing power that this power adapts; other undefined parameters are copied
 * from the attributes of this power.
 */
WeirdWest.powerRules = function(
  rules, name, advances, powerPoints, range, description, modifiers, basedOn
) {
  SWADE.powerRules(
    rules, name, advances, powerPoints, range, description, modifiers, basedOn
  );
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with race #name#, which has the list
 * of hard prerequisites #requires#. #abilities# lists associated abilities.
 */
WeirdWest.raceRules = function(rules, name, requires, abilities) {
  SWADE.raceRules(rules, name, requires, abilities);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with shield #name#, which adds
 * #parry# to the character's Parry, provides #cover# cover, requires #minStr#
 * to handle, and weighs #weight#.
 */
WeirdWest.shieldRules = function(rules, name, parry, cover, minStr, weight) {
  SWADE.shieldRules(rules, name, [], parry, cover, minStr, weight);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * #attribute# (one of 'agility', 'spirit', etc.).
 */
WeirdWest.skillRules = function(rules, name, attribute, core) {
  SWADE.skillRules(rules, name, [], attribute, core);
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
    rules, name, [], damage, minStr, weight, category, armorPiercing,
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
    let orders = ['Eastern', 'Western'];
    return([
      ['Feminine', 'Feminine', 'text', [60]],
      ['Masculine', 'Masculine', 'text', [60]],
      ['Neutral', 'Neutral', 'text', [60]],
      ['Family', 'Family', 'text', [60]],
      ['Order', 'Ordering', 'select-one', orders]
    ]);
  } else if(type == 'Nickname') {
    let nicknameTypes = [
      'Adjective', 'Animal', 'Nature', 'Noun', 'Preposition', 'Short', 'Verb'
    ];
    return([
      ['Type', 'Type', 'select-one', nicknameTypes],
      ['Long', 'Full Name', 'text', [30]],
      ['Move', 'Movement Verbs', 'text', [30]]
    ]);
  } else {
    return SWADE.choiceEditorElements(rules, type);
  }
};

/*
 * Returns an array of nicknames for the full given name #name#. #nicknames# is
 * a dictionary (see WeirdWest.NICKNAMES) that includes specific, non-computed
 * shortened versions of particular names (i.e., Dick for Richard).
 */
WeirdWest.nicknames = function(name, nicknames) {
  let result =
    QuilvynUtils.getKeys(nicknames)
      .filter(x => nicknames[x].match('Long=\\S*\\b' + name + '\\b'));
  let diminutive;
  // Use the first syllable ([consonants] vowels consonants) for the nickname.
  let nicked =
    name.replace(/^(([^aeiouy]|^y(?=[aeiouy]))*[aeiouy]+[^aeiouy]+).*$/i, '$1');
  // Remove certain ends of consonant runs that tend to create ugly nicknames
  // (e.g., Andr for Andrew)
  if(nicked.match(/([^aeiouy][rwql]|[^aeiouyn]g|[^aeiouycpst]h)$/i))
    nicked = nicked.replace(/.$/, '');
  // Sometimes nicking a final e makes a reasonable nickname (e.g., Kate to
  // Kat), but most often not (e.g., Wayne to Wayn)
  if(name != nicked && name != nicked + 'e' && !(nicked in nicknames))
    result.push(nicked);
  // If the nickname ends with multiple consonants, make a diminutive using it
  // and compute an even shorter nickname by removing the last letter.
  if(nicked.match(/[^aeiouy][^aeiouy]$/i)) {
    if(!name.match(nicked + '(y|ey|ie|ee|e|i)$')) {
      diminutive = nicked + (QuilvynUtils.random(0, 1) == 2 ? 'y' : 'ie');
      if(!(diminutive in nicknames))
        result.push(diminutive);
    }
    nicked = nicked.replace(/([^aeiouy])[^aeiouy]+$/i, '$1');
    if(!(nicked in nicknames))
      result.push(nicked);
  }
  // Make a diminutive by doubling the final consonant and adding y or ie
  if(!nicked.match(/[aeiouy]$/i) && !name.match(nicked + '(y|ey|ie|ee|e|i)$')) {
    nicked = nicked + nicked.charAt(nicked.length - 1);
    if(!name.startsWith(nicked)) {
      diminutive = nicked + (QuilvynUtils.random(0, 1) == 2 ? 'y' : 'ie');
      if(!(diminutive in nicknames))
        result.push(diminutive);
    }
  }
  return result;
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
WeirdWest.randomizeOneAttribute = function(attributes, attribute) {
  if(attribute == 'name') {
    let allNicknames = this.getChoices('nicknames');
    let adjectives =
      QuilvynUtils.getKeys(allNicknames)
      .filter(x => allNicknames[x].match(/adjective/i));
    let ethnicity = attributes.ethnicity;
    let fullName;
    if(ethnicity == 'American Indian') {
      let animals =
        QuilvynUtils.getKeys(allNicknames)
        .filter(x => allNicknames[x].match(/animal/i));
      let natures =
        QuilvynUtils.getKeys(allNicknames)
        .filter(x => allNicknames[x].match(/nature/i));
      let prepositions =
        QuilvynUtils.getKeys(allNicknames)
        .filter(x => allNicknames[x].match(/preposition/i));
      let verbs =
        QuilvynUtils.getKeys(allNicknames)
        .filter(x => allNicknames[x].match(/verb/i));
      let animal = animals[QuilvynUtils.random(0, animals.length - 1)];
      // Use "adjective animal" or "[animal who] verb preposition noun"
      if(QuilvynUtils.random(0, 1) == 0) {
        fullName =
          adjectives[QuilvynUtils.random(0, adjectives.length - 1)] + ' ' +
          animal;
      } else {
        let moves =
          QuilvynUtils.getAttrValueArray(allNicknames[animal], 'Move');
        if(moves.length == 0)
          moves = ['Leaps', 'Runs', 'Swims', 'Walks'];
        verbs = verbs.concat(moves);
        fullName =
          (QuilvynUtils.random(0, 1) == 0 ? animal + ' Who ' : '') +
          verbs[QuilvynUtils.random(0, verbs.length - 1)] + ' ' +
          prepositions[QuilvynUtils.random(0, prepositions.length - 1)] + ' ' +
          natures[QuilvynUtils.random(0, natures.length - 1)];
      }
      attributes.name = fullName;
      return;
    }
    let allEthnicities = this.getChoices('ethnicitys');
    if(!(ethnicity in allEthnicities))
      ethnicity = 'Multiethnic';
    let names = allEthnicities[ethnicity];
    let gender =
      attributes.gender && attributes.gender.match(/^f(emale)?$/i) ? 'Feminine':
      attributes.gender && attributes.gender.match(/^m(ale)?$/i) ? 'Masculine' :
      'Neutral';
    let choices = QuilvynUtils.getAttrValueArray(names, gender);
    let order = QuilvynUtils.getAttrValue(names, 'Order');
    while(choices.length == 0)
      // Multiethnic or "other"; get names for a random ethnicity
      choices = QuilvynUtils.getAttrValueArray(allEthnicities[QuilvynUtils.randomKey(allEthnicities)], gender);
    let personalName = choices[QuilvynUtils.random(0, choices.length - 1)];
    let epithet = '';
    // 2/3 of names get an epithet
    if(QuilvynUtils.random(0, 2) != 2) {
      let nicknames = WeirdWest.nicknames(personalName, allNicknames);
      let nouns =
        QuilvynUtils.getKeys(allNicknames)
        .filter(x => allNicknames[x].match(/animal|nature|noun/i));
      epithet =
        QuilvynUtils.random(0, 2) == 0 ?
          adjectives[QuilvynUtils.random(0, adjectives.length - 1)] + ' ' +
          nouns[QuilvynUtils.random(0, nouns.length - 1)]
        : nicknames.length > 0 && QuilvynUtils.random(0, 1) == 0 ?
          adjectives[QuilvynUtils.random(0, adjectives.length - 1)] + ' ' +
          nicknames[QuilvynUtils.random(0, nicknames.length - 1)]
        :
          nouns[QuilvynUtils.random(0, nouns.length - 1)];
      epithet = '"' + epithet + '" ';
    }
    choices = QuilvynUtils.getAttrValueArray(names, 'Family');
    while(choices.length == 0)
      choices = QuilvynUtils.getAttrValueArray(allEthnicities[QuilvynUtils.randomKey(allEthnicities)], 'Family');
    let familyName = choices[QuilvynUtils.random(0, choices.length - 1)];
    fullName =
      (order + '').match(/^eastern$/i) ?
        epithet + familyName + ' ' + personalName
      : (personalName + ' ' + epithet + familyName);
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
  let result = [SWADE].concat(SWADE.getPlugins());
  return result;
};

/* Returns HTML body content for user notes associated with this rule set. */
WeirdWest.ruleNotes = function() {
  return '' +
    '<h2>Weird West Quilvyn Module Notes</h2>\n' +
    'Weird West Quilvyn Module Version ' + WeirdWest.VERSION + '\n' +
    '</p>\n' +
    '<h3>Usage Notes</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '  Quilvyn uses character ethnicity and gender only when generating' +
    '  random names; there are no rule effects for either attribute.\n' +
    '  </li><li>\n' +
    '  Discussion of adding different types of homebrew options to the' +
    '  Weird West rule set can be found in <a href="plugins/homebrew-weirdwest.html">Weird West Homebrew Examples</a>.\n' +
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
