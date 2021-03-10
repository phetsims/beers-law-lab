// Copyright 2013-2020, University of Colorado Boulder

/**
 * Fluid is the base class model for all fluids.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import beersLawLab from '../../beersLawLab.js';

class Fluid {

  /**
   * @param {Color} color
   */
  constructor( color ) {
    this.colorProperty = new Property( color ); // @public
  }

  // @public
  reset() {
    this.colorProperty.reset();
  }
}

beersLawLab.register( 'Fluid', Fluid );
export default Fluid;