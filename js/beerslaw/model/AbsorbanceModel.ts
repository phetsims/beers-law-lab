// Copyright 2013-2022, University of Colorado Boulder

/**
 * AbsorbanceModel is the model for computing the absorbance (and transmittance) of light passing through a solution
 * in a cuvette.
 *
 * AbsorbanceModel model: A = abC
 *
 * Transmittance model: T = 10^A
 *
 * where:
 *
 * A is absorbance
 * T is transmittance (1=fully transmitted, 0=fully absorbed)
 * a is molar absorptivity (1/(cm*M))
 * b is path length, synonymous with cuvette width (cm)
 * C is concentration (M)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawSolution from './BeersLawSolution.js';
import Cuvette from './Cuvette.js';
import Light from './Light.js';

export default class AbsorbanceModel {

  // a : molar absorptivity
  private readonly molarAbsorptivityProperty: TReadOnlyProperty<number>;

  // C : concentration property, wired to the current solution's concentration
  private readonly currentConcentrationProperty: NumberProperty;

  // absorbance: A = abC
  public readonly absorbanceProperty: TReadOnlyProperty<number>;

  public constructor( light: Light, solutionProperty: Property<BeersLawSolution>, cuvette: Cuvette ) {

    //TODO https://github.com/phetsims/beers-law-lab/issues/298 add units
    this.molarAbsorptivityProperty = new DerivedProperty(
      [ solutionProperty, light.wavelengthProperty ],
      ( solution, wavelength ) => {
        return solution.molarAbsorptivityData.wavelengthToMolarAbsorptivity( wavelength );
      } );

    //TODO https://github.com/phetsims/beers-law-lab/issues/298 add units
    this.currentConcentrationProperty = new NumberProperty( solutionProperty.value.concentrationProperty.value );

    // Observe the concentration property of the current solution.
    const concentrationObserver = ( concentration: number ) => {
      this.currentConcentrationProperty.value = concentration;
    };

    // Rewire the concentration observer when the solution changes.
    solutionProperty.link( ( newSolution, oldSolution ) => {
      if ( oldSolution !== null ) {
        oldSolution.concentrationProperty.unlink( concentrationObserver );
      }
      newSolution.concentrationProperty.link( concentrationObserver );
    } );

    //TODO https://github.com/phetsims/beers-law-lab/issues/298 add units
    this.absorbanceProperty = new DerivedProperty(
      [ this.molarAbsorptivityProperty, cuvette.widthProperty, this.currentConcentrationProperty ],
      ( molarAbsorptivity, pathLength, concentration ) => {
        return getAbsorbance( molarAbsorptivity, pathLength, concentration );
      } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  /**
   * Gets absorbance for a specified path length.
   */
  public getAbsorbanceAt( pathLength: number ): number {
    return getAbsorbance( this.molarAbsorptivityProperty.value, pathLength, this.currentConcentrationProperty.value );
  }

  /**
   * Gets transmittance for a specified path length.
   */
  public getTransmittanceAt( pathLength: number ): number {
    return getTransmittance( this.getAbsorbanceAt( pathLength ) );
  }

  /**
   * Converts absorbance to transmittance.
   */
  public getTransmittance(): number {
    return getTransmittance( this.absorbanceProperty.value );
  }
}

/*
 * General model of absorbance: A = abC
 */
function getAbsorbance( molarAbsorptivity: number, pathLength: number, concentration: number ): number {
  return molarAbsorptivity * pathLength * concentration;
}

/*
 * General model of transmittance: T = 10^A
 */
function getTransmittance( absorbance: number ): number {
  return Math.pow( 10, -absorbance );
}

beersLawLab.register( 'AbsorbanceModel', AbsorbanceModel );