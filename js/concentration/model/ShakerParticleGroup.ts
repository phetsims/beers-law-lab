// Copyright 2020-2022, University of Colorado Boulder

/**
 * ShakerParticleGroup is the PhetioGroup for dynamically creating ShakerParticle instances.
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
import ShakerParticle, { ShakerParticleConstructorParameters } from './ShakerParticle.js';

// Default args to ShakerParticle constructor, passed to createElement during API harvest
const DEFAULT_ARGUMENTS: ShakerParticleConstructorParameters =
  [ Solute.DRINK_MIX, Vector2.ZERO, 0, Vector2.ZERO, Vector2.ZERO ];

type SelfOptions = EmptySelfOptions;

type ShakerParticleGroupOptions = SelfOptions & PickRequired<PhetioGroupOptions, 'tandem'>;

export default class ShakerParticleGroup extends PhetioGroup<ShakerParticle, ShakerParticleConstructorParameters> {

  public constructor( providedOptions: ShakerParticleGroupOptions ) {

    const options = optionize<ShakerParticleGroupOptions, SelfOptions, PhetioGroupOptions>()( {

      // PhetioGroupOptions
      phetioType: PhetioGroup.PhetioGroupIO( ShakerParticle.ShakerParticleIO ),
      phetioDocumentation: 'The group for shaker particles that are dynamically created'
    }, providedOptions );

    // Instantiates a dynamic ShakerParticle.
    const createElement = ( tandem: Tandem, solute: Solute, position: Vector2, orientation: number,
                            initialVelocity: Vector2, acceleration: Vector2 ) =>
      new ShakerParticle( solute, position, orientation, initialVelocity, acceleration, {
        tandem: tandem
      } );

    super( createElement, DEFAULT_ARGUMENTS, options );
  }
}

beersLawLab.register( 'ShakerParticleGroup', ShakerParticleGroup );