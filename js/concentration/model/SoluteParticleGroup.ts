// Copyright 2020-2023, University of Colorado Boulder

/**
 * SoluteParticleGroup is the PhetioGroup for dynamically creating SoluteParticle instances.
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
import SoluteParticle, { SoluteParticleCreateElementArguments } from './SoluteParticle.js';

// Arguments passed to createElement when creating the archetype
const DEFAULT_ARGUMENTS: SoluteParticleCreateElementArguments = [
  Solute.DRINK_MIX, // solute
  Vector2.ZERO, // position
  0, // orientation
  Vector2.ZERO, // velocity
  Vector2.ZERO // acceleration
];

type SelfOptions = EmptySelfOptions;

type SoluteParticleGroupOptions = SelfOptions & PickRequired<PhetioGroupOptions, 'tandem' | 'phetioDocumentation'>;

export default class SoluteParticleGroup extends PhetioGroup<SoluteParticle, SoluteParticleCreateElementArguments> {

  public constructor( providedOptions: SoluteParticleGroupOptions ) {

    const options = optionize<SoluteParticleGroupOptions, SelfOptions, PhetioGroupOptions>()( {

      // PhetioGroupOptions
      phetioType: PhetioGroup.PhetioGroupIO( SoluteParticle.SoluteParticleIO )
    }, providedOptions );

    // Instantiates a dynamic SoluteParticle.
    const createElement = ( tandem: Tandem, solute: Solute, position: Vector2, orientation: number,
                            velocity: Vector2, acceleration: Vector2 ) =>
      new SoluteParticle( solute, position, orientation, {
        velocity: velocity,
        acceleration: acceleration,
        tandem: tandem
      } );

    super( createElement, DEFAULT_ARGUMENTS, options );
  }
}

beersLawLab.register( 'SoluteParticleGroup', SoluteParticleGroup );