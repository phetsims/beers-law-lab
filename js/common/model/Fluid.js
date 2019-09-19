// Copyright 2013-2015, University of Colorado Boulder

/**
 * Base type for all fluids.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );

  /**
   * @param {Color} color
   * @constructor
   */
  function Fluid( color ) {
    this.colorProperty = new Property( color ); // @public
  }

  beersLawLab.register( 'Fluid', Fluid );

  return inherit( Object, Fluid, {

    // @public
    reset: function() {
      this.colorProperty.reset();
    }
  } );
} );
