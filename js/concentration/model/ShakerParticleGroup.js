// Copyright 2020, University of Colorado Boulder

/**
 * ShakerParticleGroup is the PhetioGroup for dynamically creating ShakerParticle instances.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import PhetioGroupIO from '../../../../tandem/js/PhetioGroupIO.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import ShakerParticle from './ShakerParticle.js';
import ShakerParticleIO from './ShakerParticleIO.js';
import SoluteInstances from './SoluteInstances.js';

// Default args to ShakerParticle constructor, passed to createMember during API harvest
const DEFAULT_ARGUMENTS = [ SoluteInstances.DRINK_MIX, Vector2.ZERO, 0, Vector2.ZERO, Vector2.ZERO ];

class ShakerParticleGroup extends PhetioGroup {

  constructor( options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: PhetioGroupIO( ShakerParticleIO ),
      phetioDocumentation: 'The group for shaker particles that are dynamically created'
    }, options );

    /**
     * Instantiates a dynamic ShakerParticle.
     * @param {Tandem} tandem - PhetioGroup requires tandem to be the first param
     * @param {Solute} solute
     * @param {Vector2} position - in the beaker's coordinate frame
     * @param {number} orientation - in radians
     * @param {Vector2} initialVelocity
     * @param {Vector2} acceleration
     * @returns {ShakerParticle}
     */
    const createMember = ( tandem, solute, position, orientation, initialVelocity, acceleration ) => {
      return new ShakerParticle( solute, position, orientation, initialVelocity, acceleration, {
        tandem: tandem
      } );
    };

    super( createMember, DEFAULT_ARGUMENTS, options );
  }
}

beersLawLab.register( 'ShakerParticleGroup', ShakerParticleGroup );
export default ShakerParticleGroup;