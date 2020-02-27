// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model for computing the absorbance (and transmittance) of light passing through a solution in a cuvette.
 *
 * Absorbance model: A = abC
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
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Property = require( 'AXON/Property' );

  class Absorbance {

    /**
     * @param {Light} light
     * @param {Property.<BeersLawSolution>} solutionProperty
     * @param {Cuvette} cuvette
     */
    constructor( light, solutionProperty, cuvette ) {

      // @private a : molar absorptivity
      this.molarAbsorptivityProperty = new DerivedProperty(
        [ solutionProperty, light.wavelengthProperty ],
        ( solution, wavelength ) => {
          return solution.molarAbsorptivityData.wavelengthToMolarAbsorptivity( wavelength );
        } );

      // @private C : concentration property, wired to the current solution's concentration
      {
        this.currentConcentrationProperty = new Property( solutionProperty.get().concentrationProperty.get() );

        // Observe the concentration property of the current solution.
        const concentrationObserver = concentration => {
          this.currentConcentrationProperty.set( concentration );
        };

        // Rewire the concentration observer when the solution changes.
        solutionProperty.link( ( newSolution, oldSolution ) => {
          if ( oldSolution !== null ) {
            oldSolution.concentrationProperty.unlink( concentrationObserver );
          }
          newSolution.concentrationProperty.link( concentrationObserver );
        } );
      }

      // @public absorbance: A = abC
      this.absorbanceProperty = new DerivedProperty(
        [ this.molarAbsorptivityProperty, cuvette.widthProperty, this.currentConcentrationProperty ],
        ( molarAbsorptivity, pathLength, concentration ) => {
          return getAbsorbance( molarAbsorptivity, pathLength, concentration );
        } );
    }

    // @public Gets absorbance for a specified path length.
    getAbsorbanceAt( pathLength ) {
      return getAbsorbance( this.molarAbsorptivityProperty.get(), pathLength, this.currentConcentrationProperty.get() );
    }

    // @public Gets transmittance for a specified path length.
    getTransmittanceAt( pathLength ) {
      return getTransmittance( this.getAbsorbanceAt( pathLength ) );
    }

    // @public Converts absorbance to transmittance.
    getTransmittance() {
      return getTransmittance( this.absorbanceProperty.get() );
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

  return beersLawLab.register( 'Absorbance', Absorbance );
} );
