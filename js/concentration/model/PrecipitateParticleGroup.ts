// Copyright 2020-2022, University of Colorado Boulder

/**
 * PrecipitateParticleGroup is the PhetioGroup for dynamically creating PrecipitateParticle instances.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioGroup, { PhetioGroupOptions } from '../../../../tandem/js/PhetioGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import Solute from '../../common/model/Solute.js';
import PrecipitateParticle, { PrecipitateParticleConstructorParameters } from './PrecipitateParticle.js';

// Default args to PrecipitateParticle constructor, passed to createElement during API harvest
const DEFAULT_ARGUMENTS: PrecipitateParticleConstructorParameters = [ Solute.DRINK_MIX, Vector2.ZERO, 0 ];

type SelfOptions = EmptySelfOptions;

type PrecipitateParticleGroupOptions = SelfOptions & PickRequired<PhetioGroupOptions, 'tandem'>;

export default class PrecipitateParticleGroup extends PhetioGroup<PrecipitateParticle, PrecipitateParticleConstructorParameters> {

  public constructor( providedOptions: PrecipitateParticleGroupOptions ) {

    const options = optionize<PrecipitateParticleGroupOptions, SelfOptions, PhetioGroupOptions>()( {

      // PhetioGroupOptions
      phetioType: PhetioGroup.PhetioGroupIO( PrecipitateParticle.PrecipitateParticleIO ),
      phetioDocumentation: 'The group for precipitate particles that are dynamically created'
    }, providedOptions );

    // Instantiates a dynamic PrecipitateParticle.
    const createElement = ( tandem: Tandem, solute: Solute, position: Vector2, orientation: number ) =>
      new PrecipitateParticle( solute, position, orientation, {
        tandem: tandem
      } );

    super( createElement, DEFAULT_ARGUMENTS, options );
  }
}

beersLawLab.register( 'PrecipitateParticleGroup', PrecipitateParticleGroup );