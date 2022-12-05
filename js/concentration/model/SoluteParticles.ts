// Copyright 2022, University of Colorado Boulder

/**
 * SoluteParticles is the base class for a system of Solute particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Solute from '../../common/model/Solute.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import beersLawLab from '../../beersLawLab.js';

export default class SoluteParticles {

  protected readonly soluteProperty: TReadOnlyProperty<Solute>;

  protected constructor( soluteProperty: TReadOnlyProperty<Solute> ) {
    this.soluteProperty = soluteProperty;
  }

  /**
   * Gets the size of all particles in the system. Particles are square.
   */
  public getParticleSize(): number {
    return this.soluteProperty.value.particleSize;
  }

  /**
   * Gets the Canvas fillStyle for all particles in the system.
   */
  public getFillStyle(): string {
    return this.soluteProperty.value.fillStyle;
  }

  /**
   * Gets the Canvas strokeStyle for all particles in the system.
   */
  public getStrokeStyle(): string {
    return this.soluteProperty.value.strokeStyle;
  }
}

beersLawLab.register( 'SoluteParticles', SoluteParticles );