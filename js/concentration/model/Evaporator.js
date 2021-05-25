// Copyright 2013-2021, University of Colorado Boulder

/**
 * Model element that determines the rate at which solvent is evaporated from the solution in the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import ConcentrationSolution from './ConcentrationSolution.js';

class Evaporator {

  /**
   * @param {ConcentrationSolution} solution
   * @param {Object} [options]
   */
  constructor( solution, options ) {
    assert && assert( solution instanceof ConcentrationSolution );

    options = merge( {
      maxEvaporationRate: 0.25, // L/s
      tandem: Tandem.REQUIRED
    }, options );

    // @public (read-only) L/sec
    this.maxEvaporationRate = options.maxEvaporationRate;

    // @public
    this.evaporationRateProperty = new NumberProperty( 0, {
      range: new Range( 0, options.maxEvaporationRate ),
      units: 'L/s',
      tandem: options.tandem.createTandem( 'evaporationRateProperty' ),
      phetioReadOnly: true // this is controlled by the model
    } );

    // @public
    this.enabledProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'enabledProperty' ),
      phetioReadOnly: true // this is controlled by the model
    } );

    // disable when the volume gets to zero
    solution.volumeProperty.link( volume => {
      this.enabledProperty.value = ( volume > 0 );
    } );

    // when disabled, set the rate to zero
    this.enabledProperty.link( enabled => {
      if ( !enabled ) {
        this.evaporationRateProperty.value = 0;
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