// Copyright 2013-2021, University of Colorado Boulder

// @ts-nocheck
/**
 * Cuvette is a simple model of a cuvette. A cuvette is a small tube of circular or square cross section,
 * sealed at one end, made of plastic, glass, or fused quartz (for UV light) and designed to hold samples
 * for spectroscopic experiments.
 *
 * In this case, the cuvette is the vessel that holds the solution.
 * It has a fixed height, but a variable width, making it possible to change
 * the path length. Position is fixed.  Origin is at the upper-left corner.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';

class Cuvette extends PhetioObject {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      position: Vector2.ZERO,
      widthRange: new RangeWithValue( 0.5, 2.0, 1.0 ), // variable width, cm
      height: 3, // fixed height, cm
      tandem: Tandem.REQUIRED,
      phetioState: false
    }, options );

    super( options );

    // @public (read-only)
    this.position = options.position;
    this.widthProperty = new NumberProperty( options.widthRange.defaultValue, {
      units: 'cm',
      range: options.widthRange,
      tandem: options.tandem.createTandem( 'widthProperty' )
    } );
    this.height = options.height;
  }

  // @public
  reset() {
    this.widthProperty.reset();
  }
}

beersLawLab.register( 'Cuvette', Cuvette );
export default Cuvette;