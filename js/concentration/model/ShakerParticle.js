// Copyright 2013-2020, University of Colorado Boulder

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
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import PhetioGroupIO from '../../../../tandem/js/PhetioGroupIO.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import ShakerParticleIO from './ShakerParticleIO.js';
import SoluteInstances from './SoluteInstances.js';
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

  /**
   * Creates a PhetioGroup for ShakerParticles, which are dynamically created.
   * @param {Tandem} tandem
   * @returns {PhetioGroup}
   */
  static createGroup( tandem ) {
    return new PhetioGroup(

      // createMember
      ( tandem, solute, position, orientation, initialVelocity, acceleration ) => {
        return new ShakerParticle( solute, position, orientation, initialVelocity, acceleration, {
          tandem: tandem
        } );
      },

      // defaultArguments, passed to createMember during API harvest
      [ SoluteInstances.DRINK_MIX, Vector2.ZERO, 0, Vector2.ZERO, Vector2.ZERO ],

      // options
      {
        tandem: tandem,
        phetioType: PhetioGroupIO( ShakerParticleIO ),
        phetioDocumentation: 'The group for shaker particles that are dynamically created'
      }
    );
  }
}

beersLawLab.register( 'ShakerParticle', ShakerParticle );
export default ShakerParticle;