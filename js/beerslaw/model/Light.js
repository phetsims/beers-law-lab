// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model of a simple light.
 * Origin is at the center of the lens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Vector2} location cm
   * @param {boolean} on
   * @param {number} lensDiameter cm
   * @param {Property.<BeersLawSolution>} solution
   * @constructor
   */
  function Light( location, on, lensDiameter, solution ) {

    var thisLight = this;

    thisLight.location = location;
    thisLight.on = new Property( on );
    thisLight.wavelength = new Property( solution.get().molarAbsorptivityData.lambdaMax ); // nm
    thisLight.lensDiameter = lensDiameter;

    // when the solution changes, set the light to the solution's lambdaMax wavelength
    solution.link( function( solution ) {
      thisLight.wavelength.set( solution.molarAbsorptivityData.lambdaMax );
    } );
  }

  return inherit( Object, Light, {

    reset: function() {
      this.on.reset();
    },

    getMinY: function() {
      return this.location.y - ( this.lensDiameter / 2 );
    },

    getMaxY: function() {
      return this.location.y + ( this.lensDiameter / 2 );
    }
  } );
} );