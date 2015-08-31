// Copyright 2002-2013, University of Colorado Boulder

/**
 * Manages the transformation between how concentration values are stored in
 * the model, and how they are presented in the view.
 * <p>
 * In the model, concentration is stored in moles per liter (M) for all solutions.
 * In the view, the concentration units will vary by solution, such that the
 * concentration can be displayed as integral values (no decimals, no scientific notation.)
 * This class specifies the units to be used for displaying the concentration in
 * the view (eg, M, mM, uM) and handles the conversion between model and view units.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  // strings
  var units_mMString = require( 'string!BEERS_LAW_LAB/units.mM' );
  var units_uMString = require( 'string!BEERS_LAW_LAB/units.uM' );

  /**
   * @param {number} scale scale factor used to convert model units (Moles, M) to view units
   * @param {string} units
   * @constructor
   */
  function ConcentrationTransform( scale, units ) {

    // @public (read-only)
    this.scale = scale;
    this.units = units;
  }

  inherit( Object, ConcentrationTransform, {

    /**
     * Converts from model (M) to view (solution specific).
     * @param {number} modelConcentration
     * @returns {number}
     * @public
     */
    modelToView: function( modelConcentration ) {
      return modelConcentration * this.scale;
    },

    /**
     * Converts from view (solution specific) to model (M).
     * @param {number} viewConcentration
     * @returns {number}
     * @public
     */
    viewToModel: function( viewConcentration ) {
      return viewConcentration / this.scale;
    }
  } );

  // specific transforms
  ConcentrationTransform.mM = new ConcentrationTransform( 1000, units_mMString );
  ConcentrationTransform.uM = new ConcentrationTransform( 1000000, units_uMString );

  return ConcentrationTransform;
} );
