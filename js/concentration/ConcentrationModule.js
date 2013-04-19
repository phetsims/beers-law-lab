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
  var ModelViewTransform2D = require( "PHETCOMMON/view/ModelViewTransform2D" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );  //TODO delete me
  var Vector2 = require( "DOT/Vector2" );

  function ConcentrationModule( strings ) {

    console.log( "ConcentrationModule constructor" );//XXX

    this.name = strings.concentration;
    this.icon = new Rectangle( 0, 0, 40, 40, {fill: 'red'} ); //TODO replace with icon

    // model-view transform (unity)
    var mvt = new ModelViewTransform2D( 1, new Vector2( 0, 0 ) );

    this.createModel = function () {
      console.log( "ConcentrationModule.createModel" );//XXX
      return new ConcentrationModel();
    };

    this.createView = function ( model ) {
      console.log( "ConcentrationModule.createView" );//XXX
      return new ConcentrationView( model, mvt, strings );
    };
  }

  return ConcentrationModule;
} );