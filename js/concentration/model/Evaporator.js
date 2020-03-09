// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model element that determines the rate at which solvent is evaporated from the solution in the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import beersLawLab from '../../beersLawLab.js';

class Evaporator {

  /**
   * @param {number} maxEvaporationRate L/sec
   * @param {ConcentrationSolution} solution
   * @param {Tandem} tandem
   */
  constructor( maxEvaporationRate, solution, tandem ) {

    this.maxEvaporationRate = maxEvaporationRate; // @public (read-only) L/sec

    // @public
    this.evaporationRateProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'evaporationRateProperty' ),
      phetioReadOnly: true, // this is controlled by the model
      units: 'liters/second'
    } );

    // @public
    this.enabledProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'enabledProperty' ),
      phetioReadOnly: true, // this is controlled by the model
      phetioFeatured: true
    } );

    // disable when the volume gets to zero
    solution.volumeProperty.link( volume => {
      this.enabledProperty.set( volume > 0 );
    } );

    // when disabled, set the rate to zero
    this.enabledProperty.link( enabled => {
      if ( !enabled ) {
        this.evaporationRateProperty.set( 0 );
      }
    } );
  }

  // @public
  reset() {
    this.evaporationRateProperty.reset();
    this.enabledProperty.reset();
  }
}

beersLawLab.register( 'Evaporator', Evaporator );
export default Evaporator;