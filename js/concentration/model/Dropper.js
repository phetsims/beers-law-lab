// Copyright 2013-2021, University of Colorado Boulder

// @ts-nocheck
/**
 * Model of the dropper, contains solute in solution form (stock solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import BLLMovable from '../../common/model/BLLMovable.js';

class Dropper extends BLLMovable {

  /**
   * @param {Property.<Solute>} soluteProperty
   * @param {Object} [options]
   */
  constructor( soluteProperty, options ) {
    assert && assert( soluteProperty instanceof Property, 'invalid soluteProperty' );

    options = merge( {
      maxFlowRate: 1, // L/s
      visible: true,
      tandem: Tandem.REQUIRED,
      phetioState: false
    }, options );

    super( options );

    // @public
    this.soluteProperty = soluteProperty;
    this.visibleProperty = new BooleanProperty( options.visible );
    this.enabledProperty = new BooleanProperty( true );

    // @public true if the dropper is dispensing solution
    this.isDispensingProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isDispensingProperty' )
    } );
    this.isEmptyProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isEmptyProperty' ),
      phetioReadOnly: true
    } );
    this.flowRateProperty = new NumberProperty( 0, {
      range: new Range( 0, options.maxFlowRate ),
      units: 'L/s',
      tandem: options.tandem.createTandem( 'flowRateProperty' ),
      phetioReadOnly: true
    } );

    // Turn off the dropper when it's disabled.
    this.enabledProperty.link( enabled => {
      if ( !enabled ) {
        this.isDispensingProperty.value = false;
      }
    } );

    // Toggle the flow rate when the dropper is turned on/off.
    this.isDispensingProperty.link( dispensing => {
      this.flowRateProperty.value = ( dispensing ? options.maxFlowRate : 0 );
    } );

    // When the dropper becomes empty, disable it.
    this.isEmptyProperty.link( empty => {
      if ( empty ) {
        this.enabledProperty.value = false;
      }
    } );
  }

  // @public
  reset() {
    super.reset();
    this.visibleProperty.reset();
    this.isDispensingProperty.reset();
    this.enabledProperty.reset();
    this.isEmptyProperty.reset();
    this.flowRateProperty.reset();
  }
}

beersLawLab.register( 'Dropper', Dropper );
export default Dropper;