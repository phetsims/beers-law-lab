// Copyright 2013-2015, University of Colorado Boulder

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
   * @param {Property.<BeersLawSolution>} solutionProperty
   * @constructor
   */
  function Light( location, on, lensDiameter, solutionProperty ) {

    var thisLight = this;

    // @public (read-only)
    thisLight.location = location;
    thisLight.lensDiameter = lensDiameter;

    // @public
    thisLight.onProperty = new Property( on );
    thisLight.wavelengthProperty = new Property( solutionProperty.get().molarAbsorptivityData.lambdaMax ); // nm

    // when the solution changes, set the light to the solution's lambdaMax wavelength
    solutionProperty.link( function( solution ) {
      thisLight.wavelengthProperty.set( solution.molarAbsorptivityData.lambdaMax );
    } );
  }

  return inherit( Object, Light, {

    // @public
    reset: function() {
      this.onProperty.reset();
    },

    // @public
    getMinY: function() {
      return this.location.y - ( this.lensDiameter / 2 );
    },

    // @public
    getMaxY: function() {
      return this.location.y + ( this.lensDiameter / 2 );
    }
  } );
} );