// Copyright 2002-2013, University of Colorado

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
  "use strict";

  // imports
  var BLLStrings = require( "common/BLLStrings" );

  /**
   * @param {Number} scale scale factor used to convert model units (Moles, M) to view units
   * @param {String} units
   * @constructor
   */
  function ConcentrationTransform( scale, units ) {
    this.scale = scale;
    this.units = units;
  }

  ConcentrationTransform.prototype = {

    /**
     * Converts from model (M) to view (solution specific).
     * @param {Number} modelConcentration
     * @returns {number}
     */
    modelToView: function( modelConcentration ) {
      return modelConcentration * this.scale;
    },

    /**
     * Converts from view (solution specific) to model (M).
     * @param {Number} viewConcentration
     * @returns {number}
     */
    viewToModel: function( viewConcentration ) {
      return viewConcentration / this.scale;
    }
  };

  ConcentrationTransform.M = new ConcentrationTransform( 1, BLLStrings.units_M );
  ConcentrationTransform.mM = new ConcentrationTransform( 1000, BLLStrings.units_mM );
  ConcentrationTransform.uM = new ConcentrationTransform( 1000000, BLLStrings.units_uM );

  return ConcentrationTransform;
} );
