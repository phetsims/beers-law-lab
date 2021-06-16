[object Promise]

/**
 * Base class for solute particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
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
    this.positionProperty = new Vector2Property( position );
  }

  /**
   * @returns {Object}
   * @public
   */
  toStateObject() {
    return {
      position: this.positionProperty.value.toStateObject(), // TODO: https://github.com/phetsims/phet-io/issues/1709 call on the core side?
      orientation: NumberIO.toStateObject( this.orientation )
    };
  }

  // @public
  static deserializeComponents( stateObject ) {
    return {
      position: Vector2.Vector2IO.fromStateObject( stateObject.position ),
      orientation: NumberIO.fromStateObject( stateObject.orientation )
    };
  }
}

SoluteParticle.SoluteParticleIO = new IOType( 'SoluteParticleIO', {
  valueType: SoluteParticle,
  documentation: 'A particle of solute to add to the solution',
  toStateObject: soluteParticle => soluteParticle.toStateObject(),
  stateSchema: {
    position: Vector2.Vector2IO,
    orientation: NumberIO
  }
} );

beersLawLab.register( 'SoluteParticle', SoluteParticle );
export default SoluteParticle;