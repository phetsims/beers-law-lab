// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model of a simple light.
 * Origin is at the center of the lens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );
  const VisibleColor = require( 'SCENERY_PHET/VisibleColor' );

  /**
   * @param {Vector2} position cm
   * @param {boolean} on
   * @param {number} lensDiameter cm
   * @param {Property.<BeersLawSolution>} solutionProperty
   * @param {Tandem} tandem
   * @constructor
   */
  function Light( position, on, lensDiameter, solutionProperty, tandem ) {

    const self = this;

    // @public (read-only)
    this.position = position;
    this.lensDiameter = lensDiameter;

    // @public
    this.onProperty = new BooleanProperty( on, {
      tandem: tandem.createTandem( 'onProperty' )
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
      return this.position.y - ( this.lensDiameter / 2 );
    },

    // @public
    getMaxY: function() {
      return this.position.y + ( this.lensDiameter / 2 );
    }
  } );
} );