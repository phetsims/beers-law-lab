// Copyright 2013-2022, University of Colorado Boulder

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
 * C is concentration (M)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawSolution from './BeersLawSolution.js';
import Cuvette from './Cuvette.js';
import Light from './Light.js';

export default class SolutionInCuvette extends PhetioObject {

  // a : molar absorptivity
  private readonly molarAbsorptivityProperty: TReadOnlyProperty<number>;

  // C : concentration property, wired to the current solution's concentration
  public readonly concentrationProperty: ReadOnlyProperty<number>;

  // absorbance: A = abC
  public readonly absorbanceProperty: TReadOnlyProperty<number>;

  // absorbance: T = 10^-A
  public readonly transmittanceProperty: TReadOnlyProperty<number>;

  public constructor( solutions: BeersLawSolution[],
                      solutionProperty: ReadOnlyProperty<BeersLawSolution>,
                      cuvette: Cuvette,
                      light: Light,
                      tandem: Tandem ) {

    super( {
      tandem: tandem,
      phetioState: false,
      phetioDocumentation: 'the solution in the cuvette'
    } );

    const concentrationProperties = solutions.map( solution => solution.concentrationProperty );
    this.concentrationProperty = DerivedProperty.deriveAny(
      [ solutionProperty, ...concentrationProperties ],
      () => solutionProperty.value.concentrationProperty.value, {
        units: 'mol/L',
        tandem: tandem.createTandem( 'concentrationProperty' ),
        phetioValueType: NumberIO,
        phetioDocumentation: 'concentration of the solution in the cuvette'
      } );

    this.molarAbsorptivityProperty = new DerivedProperty(
      [ solutionProperty, light.wavelengthProperty ],
      ( solution, wavelength ) => solution.molarAbsorptivityData.wavelengthToMolarAbsorptivity( wavelength ), {
        units: 'm^2/mol',
        tandem: tandem.createTandem( 'molarAbsorptivityProperty' ),
        phetioValueType: NumberIO,
        phetioDocumentation: 'molar absorptivity (molar absorption coefficient) of the solution in the cuvette'
      } );

    this.absorbanceProperty = new DerivedProperty(
      [ this.molarAbsorptivityProperty, cuvette.widthProperty, this.concentrationProperty ],
      ( molarAbsorptivity, cuvetteWidth, concentration ) =>
        getAbsorbance( molarAbsorptivity, cuvetteWidth, concentration ), {
        tandem: tandem.createTandem( 'absorbanceProperty' ),
        phetioValueType: NumberIO,
        phetioDocumentation: 'absorbance of the selected solution'
      } );

    this.transmittanceProperty = new DerivedProperty(
      [ this.absorbanceProperty ],
      absorbance => getTransmittance( absorbance ), {
        units: '%',
        tandem: tandem.createTandem( 'transmittanceProperty' ),
        phetioValueType: NumberIO,
        phetioDocumentation: 'transmittance of the solution in the cuvette'
      } );

    this.addLinkedElement( solutionProperty, {
      tandem: tandem.createTandem( solutionProperty.tandem.name ),
      phetioDocumentation: solutionProperty.phetioDocumentation
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Gets absorbance for a specified path length.
   */
  public getAbsorbanceAt( pathLength: number ): number {
    return getAbsorbance( this.molarAbsorptivityProperty.value, pathLength, this.concentrationProperty.value );
  }

  /**
   * Gets transmittance for a specified path length.
   */
  public getTransmittanceAt( pathLength: number ): number {
    return getTransmittance( this.getAbsorbanceAt( pathLength ) );
  }
}

/*
 * General model of absorbance: A = abC
 */
function getAbsorbance( molarAbsorptivity: number, pathLength: number, concentration: number ): number {
  return molarAbsorptivity * pathLength * concentration;
}

/*
 * General model of transmittance: T = 10^-A
 */
function getTransmittance( absorbance: number ): number {
  return Math.pow( 10, -absorbance );
}

beersLawLab.register( 'SolutionInCuvette', SolutionInCuvette );