// Copyright 2002-2013, University of Colorado

/**
 * Base type for all fluids.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define(
  [ "PHETCOMMON/model/property/Property" ],
  function ( Property ) {

    /**
     * @param {Color} color
     * @constructor
     */
    function Fluid( color ) {
        this.colorProperty = new Property( color );
    }

    Fluid.prototype.reset = function() {
      console.log( "Fluid.reset" ); //XXX
      this.colorProperty.reset();
    }

    return Fluid;
  }
);
