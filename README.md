## Savage Worlds plugins for the Quilvyn RPG character sheet generator

The quilvyn-savage package bundles modules that extend Quilvyn to work with
the Savage Worlds RPG, applying the rules of the
<a href="https://peginc.com/product/savage-worlds-adventure-edition-core-rules-pdf-swade/">Savage Worlds Adventure Edition</a>,
<a href="https://peginc.com/product/fantasy-companion-swade/">SWADE Fantasy Companion</a>.
<a href="https://peginc.com/product/savage-worlds-deluxe-explorers-edition/">Savage Worlds Deluxe Edition</a>,
<a href="https://peginc.com/product/deadlands-the-weird-west-core-rules/"> Deadlands: THe Weird West</a>, and
<a href="https://peginc.com/product/pathfinder-for-savage-worlds-core-rules/">Pathfinder for Savage Worlds Core Rules</a>.

### Requirements

quilvyn-savage relies on the core modules installed by the quilvyn-core package.

### Installation

To use quilvyn-savage, unbundle the release package, making sure that the
contents of the plugins/ and Images/ subdirectories are placed into the
corresponding Quilvyn installation subdirectories, then append the following
lines to the file plugins/plugins.js:

    RULESETS["Savage Worlds Deluxe Edition"] = {
      url:'plugins/SWD.js',
      group:'Savage Worlds',
      require:'SWADE.js'
    };
    RULESETS["Savage Worlds Adventurer's Edition"] = {
      url:'plugins/SWADE.js',
      group:'Savage Worlds'
    };
    RULESETS["Savage Worlds Adventurer's Edition Fantasy Companion"] = {
      url:'plugins/SWADEFC.js',
      group:'Savage Worlds',
      require:'SWADE.js'
    };
    RULESETS["Deadlands - The Weird West"] = {
      url:'plugins/WeirdWest.js',
      group:'Savage Worlds',
      require:'SWADE.js'
    };
    RULESETS["Pathfinder for SWADE"] = {
      url:'plugins/PF4SW.js',
      group:'Savage Worlds',
      require:'SWADE.js'
    };

### Usage

Once the SWADE plugin is installed as described above, start Quilvyn and
check the box next to one or more of the rule set names listed above in
the initial window.
