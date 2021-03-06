### ESJava: *EXPERIMENTAL* Java => ES6 Transpiler
[![npm version](https://badge.fury.io/js/esjava.svg)](http://badge.fury.io/js/esjava)
[![Dependency Status](https://david-dm.org/mazko/esjava.svg)](https://david-dm.org/mazko/esjava)
[![devDependency Status](https://david-dm.org/mazko/esjava/dev-status.svg)](https://david-dm.org/mazko/esjava#info=devDependencies)

- [Online Demo](http://mazko.github.io/ESJava)

- Real World Examples: [Lucene Tokenizers](http://mazko.github.io/blog/posts/2015/10/21/kak-perestat-bespokoitsia-i-nachat-portirovat/) | [Snowball Stemmers](https://github.com/mazko/jssnowball)

- [Parser Only](http://mazko.github.io/jsjavaparser)


### Example:

    ~$ npm i -g esjava

    ~$ echo '
       public class Horse extends Animal {
         Horse(String name) {
           super(name);
         }
         private static final int UNIVERSE = 42;
       }
       ' > HelloWorld.java

    ~$ esjava HelloWorld.java
       'use strict';
       class Horse extends Animal {
         constructor(name) {
           super(name);
         }
         static get UNIVERSE() {
           return 42;
         }
       }