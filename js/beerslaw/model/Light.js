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
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );
  const VisibleColor = require( 'SCENERY_PHET/VisibleColor' );

  class Light {

    /**
     * @param {Vector2} position cm
     * @param {boolean} on
     * @param {number} lensDiameter cm
     * @param {Property.<BeersLawSolution>} solutionProperty
     * @param {Tandem} tandem
     */
    constructor( position, on, lensDiameter, solutionProperty, tandem ) {

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
      solutionProperty.link( solution => {
        this.wavelengthProperty.set( solution.molarAbsorptivityData.lambdaMax );
      } );
    }

    // @public
    reset() {
      this.onProperty.reset();
    }

    // @public
    getMinY() {
      return this.position.y - ( this.lensDiameter / 2 );
    }

    // @public
    getMaxY() {
      return this.position.y + ( this.lensDiameter / 2 );
    }
  }

  return beersLawLab.register( 'Light', Light );
} );