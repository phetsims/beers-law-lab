// Copyright 2002-2013, University of Colorado

/**
 * The "Concentration" module.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var ConcentrationModel = require( "concentration/model/ConcentrationModel" );
  var ConcentrationView = require( "concentration/view/ConcentrationView" );

  function ConcentrationModule( strings ) {
    var model = new ConcentrationModel();
    var view = new ConcentrationView( model, strings );
    this.step = function ( deltaSeconds ) {
      model.step( deltaSeconds );
      view.step( deltaSeconds );
    };
  }

  return ConcentrationModule;
} );