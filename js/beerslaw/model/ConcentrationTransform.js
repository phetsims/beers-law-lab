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
define( function ( require ) {
  "use strict";

  // imports
  var strings = require( "i18n!../../../nls/beers-law-lab-strings" ); //TODO pass in as a param?

  /**
   * @param {Number} scale scale factor used to convert model units (M) to view units
   * @param {String} units
   * @constructor
   */
  function ConcentrationTransform( scale, units ) {
    this.scale = scale;
    this.units = units;
  }

  // Converts from model (M) to view (solution specific).
  ConcentrationTransform.prototype.modelToView = function ( modelConcentration ) {
    return modelConcentration * this.scale;
  };

  // Converts from view (solution specific) to model (M).
  ConcentrationTransform.prototype.viewToModel = function ( viewConcentration ) {
    return viewConcentration / this.scale;
  };

  ConcentrationTransform.M = new ConcentrationTransform( 1, strings.units_M );
  ConcentrationTransform.mM = new ConcentrationTransform( 1000, strings.units_mM );
  ConcentrationTransform.uM = new ConcentrationTransform( 1000000, strings.units_uM );

  return ConcentrationTransform;
} );
