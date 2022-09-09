// Copyright 2013-2022, University of Colorado Boulder

/**
 * A particle that comes out of the shaker.
 * The particle falls towards the surface of the solution, may bounce off the wall
 * of the beaker, and disappears when it hits the surface of the solution (or bottom of the beaker,
 * if the beaker is empty.)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import beersLawLab from '../../beersLawLab.js';
import Solute from '../../common/model/Solute.js';
import SoluteParticle from './SoluteParticle.js';

class ShakerParticle extends SoluteParticle {

  /**
   * @param {Solute} solute
   * @param {Vector2} position in the beaker's coordinate frame
   * @param {number} orientation in radians
   * @param {Vector2} initialVelocity
   * @param {Vector2} acceleration
   * @param {Object} [options]
   */
  constructor( solute, position, orientation, initialVelocity, acceleration, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED,
      phetioType: ShakerParticle.ShakerParticleIO,
      phetioDynamicElement: true
    }, options );

    super( solute.particleColor, solute.particleSize, position, orientation, options );

    // @public (read-only, phet-io)
    this.solute = solute;
    this.velocity = initialVelocity;
    this.acceleration = acceleration;
  }

  /**
   *  Propagates the particle to a new position.
   *  @param {number} deltaSeconds
   *  @param {Beaker} beaker
   *  @public
   */
  step( deltaSeconds, beaker ) {

    // mutable calls added to remove the number of new objects we create
    this.velocity = this.acceleration.times( deltaSeconds ).add( this.velocity );
    const newPosition = this.velocity.times( deltaSeconds ).add( this.positionProperty.value );

    /*
     * Did the particle hit the left wall of the beaker? If so, change direction.
     * Note that this is a very simplified model, and only deals with the left wall of the beaker,
     * which is the only wall that the particles can hit in practice.
     */
    const minX = beaker.left + this.solute.particleSize;
    if ( newPosition.x <= minX ) {
      newPosition.setX( minX );
      this.velocity.setX( Math.abs( this.velocity.x ) );
    }

    this.positionProperty.value = newPosition;
  }

  /**
   * @returns {Object}
   * @public
   */
  toStateObject() {
    return merge( super.toStateObject(), {
      solute: Solute.SoluteIO.toStateObject( this.solute ),
      velocity: Vector2.Vector2IO.toStateObject( this.velocity ),
      acceleration: Vector2.Vector2IO.toStateObject( this.acceleration )
    } );
  }

  /**
   * @param stateObject
   * @returns {Object}
   * @public
   */
  static fromStateObject( stateObject ) {
    return merge( SoluteParticle.fromStateObject( stateObject ), {
      solute: Solute.SoluteIO.fromStateObject( stateObject.solute ),
      velocity: Vector2.Vector2IO.fromStateObject( stateObject.velocity ),
      acceleration: Vector2.Vector2IO.fromStateObject( stateObject.acceleration )
    } );
  }
}

ShakerParticle.ShakerParticleIO = new IOType( 'ShakerParticleIO', {
  valueType: ShakerParticle,
  documentation: 'A particle that comes from the shaker.',
  supertype: SoluteParticle.SoluteParticleIO,
  toStateObject: shakerParticle => shakerParticle.toStateObject(),
  stateSchema: {
    solute: Solute.SoluteIO,
    velocity: Vector2.Vector2IO,
    acceleration: Vector2.Vector2IO
  },
  fromStateObject: stateObject => ShakerParticle.fromStateObject,
  stateToArgsForConstructor: stateObject => {
    const parentDeserializedComponents = SoluteParticle.deserializeComponents( stateObject );

    // This must match SoluteParticle constructor signature
    return [
      Solute.SoluteIO.fromStateObject( stateObject.solute ),
      parentDeserializedComponents.position,
      parentDeserializedComponents.orientation,
      Vector2.Vector2IO.fromStateObject( stateObject.velocity ),
      Vector2.Vector2IO.fromStateObject( stateObject.acceleration )
    ];
  }
} );

beersLawLab.register( 'ShakerParticle', ShakerParticle );
export default ShakerParticle;