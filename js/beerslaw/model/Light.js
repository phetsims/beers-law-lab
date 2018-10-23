// Copyright 2013-2017, University of Colorado Boulder

/**
 * Model of a simple light.
 * Origin is at the center of the lens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var BooleanIO = require( 'TANDEM/types/BooleanIO' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Range = require( 'DOT/Range' );
  var VisibleColor = require( 'SCENERY_PHET/VisibleColor' );

  /**
   * @param {Vector2} location cm
   * @param {boolean} on
   * @param {number} lensDiameter cm
   * @param {Property.<BeersLawSolution>} solutionProperty
   * @param {Tandem} tandem
   * @constructor
   */
  function Light( location, on, lensDiameter, solutionProperty, tandem ) {

    var self = this;

    // @public (read-only)
    this.location = location;
    this.lensDiameter = lensDiameter;

    // @public
    this.onProperty = new Property( on, {
      tandem: tandem.createTandem( 'onProperty' ),
      phetioType: PropertyIO( BooleanIO )
    } );
    this.wavelengthProperty = new NumberProperty( solutionProperty.get().molarAbsorptivityData.lambdaMax /*nm*/, {
      tandem: tandem.createTandem( 'wavelengthProperty' ),
      units: 'nanometers',
      range: new Range( VisibleColor.MIN_WAVELENGTH, VisibleColor.MAX_WAVELENGTH )
    } );

    // when the solution changes, set the light to the solution's lambdaMax wavelength
    solutionProperty.link( function( solution ) {
      self.wavelengthProperty.set( solution.molarAbsorptivityData.lambdaMax );
    } );
  }

  beersLawLab.register( 'Light', Light );

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