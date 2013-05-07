// Copyright 2002-2013, University of Colorado

/**
 * This object will be extended lazily after the image loader completes.
 * Makes it possible to load through the module system rather having to
 * pass as parameter everywhere or resort to using a global.
 */
define( function( require ) {
  "use strict";

  var BLLImages = {};

  return BLLImages;
} );