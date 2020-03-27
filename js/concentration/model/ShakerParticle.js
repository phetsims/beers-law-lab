// Copyright 2013-2020, University of Colorado Boulder

/**
 * A particle that comes out of the shaker.
 * The particle falls towards the surface of the solution, may bounce off the wall
 * of the beaker, and disappears when it hits the surface of the solution (or bottom of the beaker,
 * if the beaker is empty.)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import ShakerParticleIO from './ShakerParticleIO.js';
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
      phetioType: ShakerParticleIO,
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
    const newPosition = this.velocity.times( deltaSeconds ).add( this.positionProperty.get() );

    /*
     * Did the particle hit the left wall of the beaker? If so, change direction.
     * Note that this is a very simplified model, and only deals with the left wall of the beaker,
     * which is the only wall that the particles can hit in practice.
     */
    const minX = beaker.getLeft() + this.solute.particleSize;
    if ( newPosition.x <= minX ) {
      newPosition.setX( minX );
      this.velocity.setX( Math.abs( this.velocity.x ) );
    }

    this.positionProperty.set( newPosition );
  }
}

beersLawLab.register( 'ShakerParticle', ShakerParticle );
export default ShakerParticle;