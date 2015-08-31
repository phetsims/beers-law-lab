// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for computing the absorbance (and transmittance) of light passing through a solution in a cuvette.
 * <p>
 * Absorbance model: A = abC
 * a : molar absorptivity, units=1/(cm*M)
 * b : path length, synonymous with cuvette width, units=cm
 * C : concentration, units=M
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
  var DerivedProperty = require( 'AXON/DerivedProperty' );
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

    // @public a : molar absorptivity
    thisAbsorbance.molarAbsorptivityProperty = new DerivedProperty( [ solutionProperty, light.wavelengthProperty ],
      function( solution, wavelength ) {
        return solution.molarAbsorptivityData.wavelengthToMolarAbsorptivity( wavelength );
      } );

    // @public C : concentration property, wired to the current solution's concentration
    {
      thisAbsorbance.concentrationProperty = new Property( solutionProperty.get().concentrationProperty.get() ); // @private

      // Observe the concentration property of the current solution.
      var concentrationObserver = function( concentration ) {
        thisAbsorbance.concentrationProperty.set( concentration );
      };
      solutionProperty.get().concentrationProperty.link( concentrationObserver );

      // Rewire the concentration observer when the solution changes.
      solutionProperty.link( function( newSolution, oldSolution ) {
        if ( oldSolution !== null ) {
          oldSolution.concentrationProperty.unlink( concentrationObserver );
        }
        newSolution.concentrationProperty.link( concentrationObserver );
      } );
    }

    // @public absorbance: A = abC
    thisAbsorbance.absorbanceProperty = new DerivedProperty( [ thisAbsorbance.molarAbsorptivityProperty, cuvette.widthProperty, thisAbsorbance.concentrationProperty ],
      function( molarAbsorptivity, pathLength, concentration ) {
        return getAbsorbance( molarAbsorptivity, pathLength, concentration );
      } );
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

    // @public Gets absorbance for a specified path length.
    getAbsorbanceAt: function( pathLength ) {
      return getAbsorbance( this.molarAbsorptivityProperty.get(), pathLength, this.concentrationProperty.get() );
    },

    // @public Gets transmittance for a specified path length.
    getTransmittanceAt: function( pathLength ) {
      return getTransmittance( this.getAbsorbanceAt( pathLength ) );
    },

    // @public Converts absorbance to transmittance.
    getTransmittance: function() {
      return getTransmittance( this.absorbanceProperty.get() );
    }
  } );
} );





