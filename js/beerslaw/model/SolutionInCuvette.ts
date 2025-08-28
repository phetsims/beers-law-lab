// Copyright 2013-2025, University of Colorado Boulder

/**
 * SolutionInCuvette is the model for computing the absorbance (and transmittance) of light passing through a solution
 * in a cuvette.
 *
 * SolutionInCuvette model: A = abC
 *
 * Transmittance model: T = 10^-A
 *
 * where:
 *
 * A is absorbance
 * T is transmittance (1=fully transmitted, 0=fully absorbed)
 * a is molar absorptivity (1/(cm*M))
 * b is path length, synonymous with cuvette width (cm)
 * C is concentration (M or mol/L)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawSolution from './BeersLawSolution.js';

export default class SolutionInCuvette extends PhetioObject {

  // a : molar absorptivity
  public readonly molarAbsorptivityProperty: TReadOnlyProperty<number>;

  // C : concentration property, wired to the current solution's concentration
  public readonly concentrationProperty: ReadOnlyProperty<number>;

  // absorbance: A = abC
  public readonly absorbanceProperty: TReadOnlyProperty<number>;

  // absorbance: T = 10^-A
  public readonly transmittanceProperty: TReadOnlyProperty<number>;

  public constructor( solutions: BeersLawSolution[],
                      solutionProperty: ReadOnlyProperty<BeersLawSolution>,
                      cuvetteWidthProperty: TReadOnlyProperty<number>,
                      wavelengthProperty: TReadOnlyProperty<number>,
                      tandem: Tandem ) {

    super( {
      isDisposable: false,
      tandem: tandem,
      phetioState: false,
      phetioDocumentation: 'The solution in the cuvette'
    } );

    const concentrationProperties = solutions.map( solution => solution.concentrationProperty );
    this.concentrationProperty = DerivedProperty.deriveAny(
      [ solutionProperty, ...concentrationProperties ],
      () => solutionProperty.value.concentrationProperty.value, {
        units: 'mol/L',
        tandem: tandem.createTandem( 'concentrationProperty' ),
        phetioFeatured: true,
        phetioValueType: NumberIO,
        phetioDocumentation: 'Concentration of the solution in the cuvette'
      } );

    this.molarAbsorptivityProperty = new DerivedProperty(
      [ solutionProperty, wavelengthProperty ],
      ( solution, wavelength ) => solution.molarAbsorptivityData.wavelengthToMolarAbsorptivity( wavelength ), {
        units: '1/(cm*M)',
        tandem: tandem.createTandem( 'molarAbsorptivityProperty' ),
        phetioFeatured: true,
        phetioValueType: NumberIO,
        phetioDocumentation: 'Molar absorptivity (molar absorption coefficient) of the solution in the cuvette'
      } );

    this.absorbanceProperty = new DerivedProperty(
      [ this.molarAbsorptivityProperty, cuvetteWidthProperty, this.concentrationProperty ],
      ( molarAbsorptivity, cuvetteWidth, concentration ) =>
        SolutionInCuvette.getAbsorbance( molarAbsorptivity, cuvetteWidth, concentration ), {
        tandem: tandem.createTandem( 'absorbanceProperty' ),
        phetioFeatured: true,
        phetioValueType: NumberIO,
        phetioDocumentation: 'Absorbance of the selected solution'
      } );

    this.transmittanceProperty = new DerivedProperty(
      [ this.absorbanceProperty ],
      absorbance => SolutionInCuvette.getTransmittance( absorbance ), {
        tandem: tandem.createTandem( 'transmittanceProperty' ),
        phetioFeatured: true,
        phetioValueType: NumberIO,
        phetioDocumentation: 'Transmittance of the solution in the cuvette'
      } );

    this.addLinkedElement( solutionProperty );
  }

  /**
   * General model of absorbance: A = abC
   */
  public static getAbsorbance( molarAbsorptivity: number, pathLength: number, concentration: number ): number {
    return molarAbsorptivity * pathLength * concentration;
  }

  /*
 * General model of transmittance: T = 10^-A
 */
  public static getTransmittance( absorbance: number ): number {
    return Math.pow( 10, -absorbance );
  }
}

beersLawLab.register( 'SolutionInCuvette', SolutionInCuvette );