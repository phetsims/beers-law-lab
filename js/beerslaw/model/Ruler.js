// Copyright 2013-2020, University of Colorado Boulder

/**
 * Ruler model, to take advantage of position reset.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
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
      insets: 0.1, // the horizontal insets at the ends of the ruler, in cm
      height: 0.35 // in cm
    }, options );

    super( options );

    // @public (read-only)
    this.length = options.length;
    this.insets = options.insets;
    this.height = options.height;
  }
}

beersLawLab.register( 'Ruler', Ruler );
export default Ruler;