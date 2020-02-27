// Copyright 2013-2020, University of Colorado Boulder

/**
 * Base class for solute particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';

class SoluteParticle extends PhetioObject {

  /**
   * @param {Color} color
   * @param {number} size particles are square, this is the length of one side
   * @param {Vector2} position position of the particle in the beaker's coordinate frame
   * @param {number} orientation in radians
   * @param {Object} [options]
   */
  constructor( color, size, position, orientation, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    // @public (read-only)
    this.color = color;
    this.size = size;
    this.orientation = orientation;

    // @public
    this.positionProperty = new Property( position );
  }
}

beersLawLab.register( 'SoluteParticle', SoluteParticle );
export default SoluteParticle;