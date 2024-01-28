## Savage Worlds plugins for the Quilvyn RPG character sheet generator

The quilvyn-savage package bundles modules that extend Quilvyn to work with
the Savage Worlds RPG, applying the rules from these source books:

- <a href="https://peginc.com/product/savage-worlds-adventure-edition-core-rules-pdf-swade/">Savage Worlds Adventure Edition</a>
- <a href="https://peginc.com/product/fantasy-companion-swade/">SWADE Fantasy Companion</a>
- <a href="https://peginc.com/product/horror-companion-swade/">SWADE Horror Companion</a>
- <a href="https://peginc.com/product/swade-super-powers-companion/">SWADE Super Power Companion</a>
- <a href="https://peginc.com/product/savage-worlds-deluxe-explorers-edition/">Savage Worlds Deluxe Edition</a>
- <a href="https://peginc.com/product/deadlands-the-weird-west-core-rules/"> Deadlands: The Weird West</a>
- <a href="https://peginc.com/product/pathfinder-for-savage-worlds-core-rules/">Pathfinder for Savage Worlds Core Rules</a>

### Requirements

quilvyn-savage relies on the core modules installed by the quilvyn-core package.

### Installation

To use quilvyn-savage, unbundle the release package, making sure that the
contents of the plugins/ and Images/ subdirectories are placed into the
corresponding Quilvyn installation subdirectories, then append the following
lines to the file plugins/plugins.js:

    RULESETS["Savage Worlds Deluxe Edition (SWD)"] = {
      url:'plugins/SWD.js',
      group:'Savage Worlds',
      require:'SWADE.js'
    };
    RULESETS["Savage Worlds Adventurer's Edition (SWADE)"] = {
      url:'plugins/SWADE.js',
      group:'Savage Worlds'
    };
    RULESETS["Fantasy Companion supplement to SWADE rules"] = {
      url:'plugins/SWADEFC.js',
      group:'Savage Worlds',
      supplement:"Savage Worlds Adventurer's Edition (SWADE)"
    };
    RULESETS["Horror Companion supplement to SWADE rules"] = {
      url:'plugins/SWADEHC.js',
      group:'Savage Worlds',
      supplement:"Savage Worlds Adventurer's Edition (SWADE)"
    };
    RULESETS["Super Powers Companion supplement to SWADE rules"] = {
      url:'plugins/SWADESPC.js',
      group:'Savage Worlds',
      supplement:"Savage Worlds Adventurer's Edition (SWADE)"
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

Once the quilvyn-savage package is installed as described above, start Quilvyn
and check the box next to one or more of the rule set names listed above in
the initial window. The rules from the supplements extend the Savage Worlds
Adventurer's Edition rule set.
