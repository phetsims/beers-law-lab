// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model of the dropper, contains solute in solution form (stock solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import BLLMovable from '../../common/model/BLLMovable.js';

class Dropper extends BLLMovable {

  /**
   * @param {Vector2} position
   * @param {Bounds2} dragBounds
   * @param {Property.<Solute>} soluteProperty
   * @param {number} maxFlowRate
   * @param {boolean} visible
   * @param {Object} [options]
   */
  constructor( position, dragBounds, soluteProperty, maxFlowRate, visible, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    super( position, dragBounds, options );

    // @public
    this.soluteProperty = soluteProperty;
    this.visibleProperty = new BooleanProperty( visible );

    // @public true if the dropper is dispensing solution
    this.dispensingProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'dispensingProperty' )
    } );
    this.enabledProperty = new BooleanProperty( true );
    this.isEmptyProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isEmptyProperty' ),
      phetioReadOnly: true
    } );
    this.flowRateProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'flowRateProperty' ),
      units: 'L/s'
    } );

    // Turn off the dropper when it's disabled.
    this.enabledProperty.link( enabled => {
      if ( !enabled ) {
        this.dispensingProperty.set( false );
      }
    } );

    // Toggle the flow rate when the dropper is turned on/off.
    this.dispensingProperty.link( dispensing => {
      this.flowRateProperty.set( dispensing ? maxFlowRate : 0 );
    } );

    // When the dropper becomes empty, disable it.
    this.isEmptyProperty.link( empty => {
      if ( empty ) {
        this.enabledProperty.set( false );
      }
    } );
  }

  // @public
  reset() {
    super.reset();
    this.visibleProperty.reset();
    this.dispensingProperty.reset();
    this.enabledProperty.reset();
    this.isEmptyProperty.reset();
    this.flowRateProperty.reset();
  }
}

beersLawLab.register( 'Dropper', Dropper );
export default Dropper;