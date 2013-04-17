// Copyright 2002-2013, University of Colorado

/**
 * The "Beer's Law" module.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var BeersLawModel = require( "beerslaw/model/BeersLawModel" );
  var BeersLawView = require( "beerslaw/view/BeersLawView" );

  function ConcentrationModule( strings ) {
    var model = new BeersLawModel();
    var view = new BeersLawView( model, strings );
    this.step = function ( deltaSeconds ) {
      model.step( deltaSeconds );
      view.step( deltaSeconds );
    };
  }

  return ConcentrationModule;
} );