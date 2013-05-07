// Copyright 2002-2013, University of Colorado

/**
 * This object will be extended lazily after the image loader completes.
 * Makes it possible to load through the module system rather than passed as parameter everywhere or used as global.
 */
define( function( require ) {
  "use strict";

  var BLLImages = {};

  return BLLImages;
} );