// Copyright 2002-2013, University of Colorado

/**
 * Model for computing the absorbance (and transmittance) of light passing through a solution in a cuvette.
 * <p>
 * Absorbance model: A = abC
 * <p>
 * Transmittance model: T = 10^A
 * <p>
 * where:
 * <ul>
 * <li>A is absorbance
 * <li>T is transmittance (1=fully transmitted, 0=fully absorbed)
 * <li>a is molar absorptivity (1/(cm*M))
 * <li>b is path length (cm)
 * <li>C is concentration (M)
 * </ul>
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var Property = require( "PHETCOMMON/model/property/Property" );

  /**
   * @param {Light} light
   * @param {Property} solution of type BeersLawSolution
   * @param {Cuvette} cuvette
   * @constructor
   */
  function Absorbance( light, solution, cuvette ) {

    var thisAbsorbance = this;

    // a: molar absorptivity, units=1/(cm*M)
    {
      var computeMolarAbsorptivity = function () {
        return solution.get().molarAbsorptivityData.wavelengthToMolarAbsorptivity( light.wavelength.get() );
      };

      thisAbsorbance.molarAbsorptivity = new Property( computeMolarAbsorptivity() );

      // dependencies from which this property is derived:
      var updateMolarAbsorptivity = function () {
        thisAbsorbance.molarAbsorptivity.set( computeMolarAbsorptivity() );
      };
      solution.addObserver( updateMolarAbsorptivity );
      light.wavelength.addObserver( updateMolarAbsorptivity );
    }

    // b: path length, synonymous with cuvette width, units=cm
    {
      var computePathLength = function () {
        return cuvette.width.get();
      };

      thisAbsorbance.pathLength = new Property( computePathLength() );

      // dependencies from which this property is derived:
      var updatePathLength = function () {
        thisAbsorbance.pathLength.set( computePathLength() );
      };
      cuvette.width.addObserver( updatePathLength );
    }

    // C: concentration, units=M
    {
      thisAbsorbance.concentration = new Property( solution.get().concentration.get() );

      // Observe the concentration property of the current solution.
      var updateConcentration = function ( concentration ) {
        thisAbsorbance.concentration.set( concentration );
      };
      solution.get().concentration.addObserver( updateConcentration );

      // Rewire the concentration observer when the solution changes.
      solution.addObserver( function ( newSolution, oldSolution ) {
        if ( oldSolution != null ) {
          oldSolution.concentration.removeObserver( updateConcentration );
        }
        newSolution.concentration.addObserver( updateConcentration );
      } );
    }

    // compute absorbance: A = abC
    {
      var computeAbsorbance = function () {
        return Absorbance._getAbsorbance( thisAbsorbance.molarAbsorptivity.get(), thisAbsorbance.pathLength.get(), thisAbsorbance.concentration.get() );
      };

      thisAbsorbance.value = new Property( computeAbsorbance() );

      // dependencies from which this property is derived:
      var updateAbsorbance = function () {
        thisAbsorbance.value.set( computeAbsorbance() );
      };
      thisAbsorbance.molarAbsorptivity.addObserver( updateAbsorbance );
      thisAbsorbance.pathLength.addObserver( updateAbsorbance );
      thisAbsorbance.concentration.addObserver( updateAbsorbance );
    }
  }

  // Gets absorbance for a specified path length.
  Absorbance.prototype.getAbsorbanceAt = function ( pathLength ) {
    return Absorbance._getAbsorbance( this.molarAbsorptivity.get(), pathLength, this.concentration.get() );
  };

  // Gets transmittance for a specified path length.
  Absorbance.prototype.getTransmittanceAt = function ( pathLength ) {
    return Absorbance._getTransmittance( this.getAbsorbanceAt( pathLength ) );
  };

  // Converts absorbance to transmittance.
  Absorbance.prototype.getTransmittance = function () {
    return Absorbance._getTransmittance( this.value.get() );
  };

  /*
   * General model of absorbance: A = abC
   * @param {Number} molarAbsorptivity
   * @param {Number} pathLength
   * @param {Number} concentration
   * @return {Number}
   */
  Absorbance._getAbsorbance = function ( molarAbsorptivity, pathLength, concentration ) {
    return molarAbsorptivity * pathLength * concentration;
  };

  /*
   * General model of transmittance: T = 10^A
   * @param {Number} absorbance
   * @return {Number}
   */
  Absorbance._getTransmittance = function ( absorbance ) {
    return Math.pow( 10, -absorbance );
  };

  return Absorbance;
} );





