[Heroes Kingdom Evolution](http://angarak.com/MMHK/extension/)
==============================================================


What you need to build your own version of the extension
--------------------------------------------------------

* make sure Java is installed; it is required to build the whole stuff

* get [ant from apache](http://ant.apache.org/) 

* you'll need [ant-contrib](http://sourceforge.net/projects/ant-contrib/files/) as well: copy `ant-contrib-1.0b3.jar` inside ant's `lib` directory


Build Options
-------------

There are some options available in the `build.xml` file. Some are optional, some are mandatory.

* `DEBUG` can be switched to compress or not the resulting scripts

* `chrome-id` may be changed if you're planning to install this extension as an *unpacked* one for development purposes

* `chrome` contains the path to the *chrome* executable

* `-DnoRedist=true` may be given at build time to skip packaging


How to build your own Heroes Kingdom Evolution
----------------------------------------------

In the main directory, call ant to build and package everything :

    ant

The result will then be available in `build` as an unpackaged extension and in `redist` as a ready-to-use one.


In order to build it without packaging, two choices are available :

    ant clean
    ant chrome

or

    ant -DnoRedist=true

The result will then be available in `build` as an unpackaged extension.
