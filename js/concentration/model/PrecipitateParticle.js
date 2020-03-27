// Copyright 2013-2020, University of Colorado Boulder

/**
 * One particle that makes up the precipitate that forms on the bottom of the beaker.
 * Precipitate particles are static (they don't move). They have no associated animation,
 * and they magically appear on the bottom of the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import PrecipitateParticleIO from './PrecipitateParticleIO.js';
import SoluteParticle from './SoluteParticle.js';

class PrecipitateParticle extends SoluteParticle {

  /**
   * @param {Solute} solute
   * @param {Vector2} position position in the beaker's coordinate frame
   * @param {number} orientation in radians
   * @param {Object} [options]
   */
  constructor( solute, position, orientation, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED,
      phetioType: PrecipitateParticleIO,
      phetioDynamicElement: true
    }, options );

    super( solute.particleColor, solute.particleSize, position, orientation, options );

    // @public (phet-io)
    this.solute = solute;
  }
}

beersLawLab.register( 'PrecipitateParticle', PrecipitateParticle );
export default PrecipitateParticle;