// Copyright 2020, University of Colorado Boulder

/**
 * PrecipitateParticleGroup is the PhetioGroup for dynamically creating PrecipitateParticle instances.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import PhetioGroupIO from '../../../../tandem/js/PhetioGroupIO.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import PrecipitateParticle from './PrecipitateParticle.js';
import SoluteInstances from './SoluteInstances.js';

// Default args to PrecipitateParticle constructor, passed to createElement during API harvest
const DEFAULT_ARGUMENTS = [ SoluteInstances.DRINK_MIX, Vector2.ZERO, 0 ];

class PrecipitateParticleGroup extends PhetioGroup {

  constructor( options ) {
  
    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: PhetioGroupIO( PrecipitateParticle.PrecipitateParticleIO ),
      phetioDocumentation: 'The group for precipitate particles that are dynamically created'
    }, options );

    /**
     * Instantiates a dynamic ShakerParticle.
     * @param {Tandem} tandem - PhetioGroup requires tandem to be the first param
     * @param {Solute} solute
     * @param {Vector2} position position in the beaker's coordinate frame
     * @param {number} orientation in radians
     * @returns {PrecipitateParticle}
     */
    const createElement = ( tandem, solute, position, orientation ) => {
      return new PrecipitateParticle( solute, position, orientation, {
        tandem: tandem
      } );
    };

    super( createElement, DEFAULT_ARGUMENTS, options );
  }
}

beersLawLab.register( 'PrecipitateParticleGroup', PrecipitateParticleGroup );
export default PrecipitateParticleGroup;