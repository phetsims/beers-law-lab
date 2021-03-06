// Copyright 2020-2021, University of Colorado Boulder

/**
 * ShakerParticleGroup is the PhetioGroup for dynamically creating ShakerParticle instances.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import ShakerParticle from './ShakerParticle.js';
import Solute from '../../common/model/Solute.js';

// Default args to ShakerParticle constructor, passed to createElement during API harvest
const DEFAULT_ARGUMENTS = [ Solute.DRINK_MIX, Vector2.ZERO, 0, Vector2.ZERO, Vector2.ZERO ];

class ShakerParticleGroup extends PhetioGroup {

  constructor( options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: PhetioGroup.PhetioGroupIO( ShakerParticle.ShakerParticleIO ),
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
    const createElement = ( tandem, solute, position, orientation, initialVelocity, acceleration ) => {
      return new ShakerParticle( solute, position, orientation, initialVelocity, acceleration, {
        tandem: tandem
      } );
    };

    super( createElement, DEFAULT_ARGUMENTS, options );
  }
}

beersLawLab.register( 'ShakerParticleGroup', ShakerParticleGroup );
export default ShakerParticleGroup;