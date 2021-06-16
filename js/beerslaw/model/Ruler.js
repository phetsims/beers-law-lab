// Copyright 2013-2021, University of Colorado Boulder

/**
 * Ruler is the model of a ruler that is movable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import BLLMovable from '../../common/model/BLLMovable.js';

class Ruler extends BLLMovable {

  /**
   * @param {Object} [options]
   * @constructor
   */
  constructor( options ) {

    options = merge( {
      length: 2.1, // in cm
      height: 0.35, // in cm
      tandem: Tandem.REQUIRED,
      phetioState: false
    }, options );

    super( options );

    // @public (read-only)
    this.length = options.length;
    this.height = options.height;
  }
}

beersLawLab.register( 'Ruler', Ruler );
export default Ruler;