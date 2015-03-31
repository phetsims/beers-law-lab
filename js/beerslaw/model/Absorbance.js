// Copyright 2002-2013, University of Colorado Boulder

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
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Light} light
   * @param {Property.<BeersLawSolution>} solutionProperty
   * @param {Cuvette} cuvette
   * @constructor
   */
  function Absorbance( light, solutionProperty, cuvette ) {

    var thisAbsorbance = this;

    // a: molar absorptivity, units=1/(cm*M)
    {
      var computeMolarAbsorptivity = function() {
        return solutionProperty.get().molarAbsorptivityData.wavelengthToMolarAbsorptivity( light.wavelengthProperty.get() );
      };

      thisAbsorbance.molarAbsorptivityProperty = new Property( computeMolarAbsorptivity() ); // @private

      // dependencies from which this property is derived:
      var updateMolarAbsorptivity = function() {
        thisAbsorbance.molarAbsorptivityProperty.set( computeMolarAbsorptivity() );
      };
      solutionProperty.link( updateMolarAbsorptivity );
      light.wavelengthProperty.link( updateMolarAbsorptivity );
    }

    // b: path length, synonymous with cuvette width, units=cm
    {
      var computePathLength = function() {
        return cuvette.widthProperty.get();
      };

      thisAbsorbance.pathLength = new Property( computePathLength() );

      // dependencies from which this property is derived:
      var updatePathLength = function() {
        thisAbsorbance.pathLength.set( computePathLength() );
      };
      cuvette.widthProperty.link( updatePathLength );
    }

    // C: concentration, units=M
    {
      thisAbsorbance.concentration = new Property( solutionProperty.get().concentrationProperty.get() );

      // Observe the concentration property of the current solution.
      var updateConcentration = function( concentration ) {
        thisAbsorbance.concentration.set( concentration );
      };
      solutionProperty.get().concentrationProperty.link( updateConcentration );

      // Rewire the concentration observer when the solution changes.
      solutionProperty.link( function( newSolution, oldSolution ) {
        if ( oldSolution !== null ) {
          oldSolution.concentrationProperty.unlink( updateConcentration );
        }
        newSolution.concentrationProperty.link( updateConcentration );
      } );
    }

    // compute absorbance: A = abC
    {
      var computeAbsorbance = function() {
        return getAbsorbance( thisAbsorbance.molarAbsorptivityProperty.get(), thisAbsorbance.pathLength.get(), thisAbsorbance.concentration.get() );
      };

      thisAbsorbance.value = new Property( computeAbsorbance() );

      // dependencies from which this property is derived:
      var updateAbsorbance = function() {
        thisAbsorbance.value.set( computeAbsorbance() );
      };
      thisAbsorbance.molarAbsorptivityProperty.link( updateAbsorbance );
      thisAbsorbance.pathLength.link( updateAbsorbance );
      thisAbsorbance.concentration.link( updateAbsorbance );
    }
  }

  /*
   * General model of absorbance: A = abC
   * @param {number} molarAbsorptivity
   * @param {number} pathLength
   * @param {number} concentration
   * @return {number}
   */
  var getAbsorbance = function( molarAbsorptivity, pathLength, concentration ) {
    return molarAbsorptivity * pathLength * concentration;
  };

  /*
   * General model of transmittance: T = 10^A
   * @param {number} absorbance
   * @return {number}
   */
  var getTransmittance = function( absorbance ) {
    return Math.pow( 10, -absorbance );
  };

  return inherit( Object, Absorbance, {

    // Gets absorbance for a specified path length.
    getAbsorbanceAt: function( pathLength ) {
      return getAbsorbance( this.molarAbsorptivityProperty.get(), pathLength, this.concentration.get() );
    },

    // Gets transmittance for a specified path length.
    getTransmittanceAt: function( pathLength ) {
      return getTransmittance( this.getAbsorbanceAt( pathLength ) );
    },

    // Converts absorbance to transmittance.
    getTransmittance: function() {
      return getTransmittance( this.value.get() );
    }
  } );
} );





