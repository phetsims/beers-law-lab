// Copyright 2002-2013, University of Colorado

/**
 * The "Concentration" tab. Conforms to the contact specified in joist/Tab
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var ConcentrationModel = require( "concentration/model/ConcentrationModel" );
  var ConcentrationView = require( "concentration/view/ConcentrationView" );
  var Image = require( "SCENERY/nodes/Image" );
  var ModelViewTransform2D = require( "PHETCOMMON/view/ModelViewTransform2D" );
  var Vector2 = require( "DOT/Vector2" );

  // images
  var ICON = require( "image!images/Concentration-icon.jpg" );

  function ConcentrationTab( strings ) {

    this.name = strings.concentration;
    this.icon = new Image( ICON );

    // model-view transform (unity)
    var mvt = new ModelViewTransform2D( 1, new Vector2( 0, 0 ) );

    this.createModel = function () {
      return new ConcentrationModel();
    };

    this.createView = function ( model ) {
      return new ConcentrationView( model, mvt, strings );
    };
  }

  return ConcentrationTab;
} );