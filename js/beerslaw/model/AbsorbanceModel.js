// Copyright 2013-2021, University of Colorado Boulder

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
import beersLawLab from '../../beersLawLab.js';
import Cuvette from './Cuvette.js';
import Light from './Light.js';

class AbsorbanceModel {

  /**
   * @param {Light} light
   * @param {Property.<BeersLawSolution>} solutionProperty
   * @param {Cuvette} cuvette
   */
  constructor( light, solutionProperty, cuvette ) {
    assert && assert( light instanceof Light );
    assert && assert( solutionProperty instanceof Property );
    assert && assert( cuvette instanceof Cuvette );

    // @private {DerivedProperty.<number>} a : molar absorptivity
    this.molarAbsorptivityProperty = new DerivedProperty(
      [ solutionProperty, light.wavelengthProperty ],
      ( solution, wavelength ) => {
        return solution.molarAbsorptivityData.wavelengthToMolarAbsorptivity( wavelength );
      } );

    // @private C : concentration property, wired to the current solution's concentration
    this.currentConcentrationProperty = new NumberProperty( solutionProperty.value.concentrationProperty.value );

    // Observe the concentration property of the current solution.
    const concentrationObserver = concentration => {
      this.currentConcentrationProperty.value = concentration;
    };

    // Rewire the concentration observer when the solution changes.
    solutionProperty.link( ( newSolution, oldSolution ) => {
      if ( oldSolution !== null ) {
        oldSolution.concentrationProperty.unlink( concentrationObserver );
      }
      newSolution.concentrationProperty.link( concentrationObserver );
    } );

    // @public {DerivedProperty.<number>} absorbance: A = abC
    this.absorbanceProperty = new DerivedProperty(
      [ this.molarAbsorptivityProperty, cuvette.widthProperty, this.currentConcentrationProperty ],
      ( molarAbsorptivity, pathLength, concentration ) => {
        return getAbsorbance( molarAbsorptivity, pathLength, concentration );
      } );
  }

  /**
   * Gets absorbance for a specified path length.
   * @param pathLength
   * @returns {number}
   * @public
   */
  getAbsorbanceAt( pathLength ) {
    return getAbsorbance( this.molarAbsorptivityProperty.value, pathLength, this.currentConcentrationProperty.value );
  }

  /**
   * Gets transmittance for a specified path length.
   * @param {number} pathLength
   * @returns {number}
   * @public
   */
  getTransmittanceAt( pathLength ) {
    return getTransmittance( this.getAbsorbanceAt( pathLength ) );
  }

  /**
   * Converts absorbance to transmittance.
   * @returns {number}
   * @public
   */
  getTransmittance() {
    return getTransmittance( this.absorbanceProperty.value );
  }
}

/*
 * General model of absorbance: A = abC
 * @param {number} molarAbsorptivity
 * @param {number} pathLength
 * @param {number} concentration
 * @returns {number}
 */
function getAbsorbance( molarAbsorptivity, pathLength, concentration ) {
  return molarAbsorptivity * pathLength * concentration;
}

/*
 * General model of transmittance: T = 10^A
 * @param {number} absorbance
 * @returns {number}
 */
function getTransmittance( absorbance ) {
  return Math.pow( 10, -absorbance );
}

beersLawLab.register( 'AbsorbanceModel', AbsorbanceModel );
export default AbsorbanceModel;