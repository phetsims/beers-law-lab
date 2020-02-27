// Copyright 2013-2020, University of Colorado Boulder

/**
 * Base type for all fluids.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const Property = require( 'AXON/Property' );

  class Fluid {

    /**
     * @param {Color} color
     */
    constructor( color ) {
      this.colorProperty = new Property( color ); // @public
    }

    // @public
    reset() {
      this.colorProperty.reset();
    }
  }

  return beersLawLab.register( 'Fluid', Fluid );
} );
