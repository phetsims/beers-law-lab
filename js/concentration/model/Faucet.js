// Copyright 2013-2020, University of Colorado Boulder

/**
 * Faucet model, used for input and output faucets.
 * This model assumes that the pipe enters the faucet from the left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';

class Faucet {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      position: Vector2.ZERO, // center of output pipe, cm
      pipeMinX: -100, // x-coordinate of where the pipe starts, cm
      spoutWidth: 45, // cm
      maxFlowRate: 0.25, // L/s
      tandem: Tandem.REQUIRED
    }, options );

    assert && assert( options.pipeMinX < options.position.x ); // pipe enters the faucet from the left

    // @public (read-only)
    this.position = options.position;
    this.pipeMinX = options.pipeMinX;
    this.spoutWidth = options.spoutWidth;
    this.maxFlowRate = options.maxFlowRate;

    // @public
    this.flowRateProperty = new NumberProperty( 0, {
      range: new Range( 0, options.maxFlowRate ),
      units: 'L/s',
      tandem: options.tandem.createTandem( 'flowRateProperty' ),
      phetioReadOnly: true
    } );
    this.enabledProperty = new BooleanProperty( true );

    // when disabled, turn off the faucet.
    this.enabledProperty.link( enabled => {
      if ( !enabled ) {
        this.flowRateProperty.value = 0;
      }
    } );
  }

  // @public
  reset() {
    this.flowRateProperty.reset();
    this.enabledProperty.reset();
  }
}

beersLawLab.register( 'Faucet', Faucet );
export default Faucet;