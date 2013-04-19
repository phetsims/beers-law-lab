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
  var ModelViewTransform2D = require( "PHETCOMMON/view/ModelViewTransform2D" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );  //TODO delete me
  var Vector2 = require( "DOT/Vector2" );

  function BeersLawModule( strings ) {

    console.log( "BeersLawModule constructor" );//XXX

    this.name = strings.beersLaw;
    this.icon = new Rectangle( 0, 0, 40, 40, {fill: 'green'} ); //TODO replace with icon

    // No offset, scale 125x when going from model to view (1cm == 125 pixels)
    var mvt = new ModelViewTransform2D( 125, new Vector2( 0, 0 ) );

    this.createModel = function () {
      console.log( "BeersLawModule.createModel" );//XXX
      return new BeersLawModel( mvt );
    };

    this.createView = function ( model ) {
      console.log( "BeersLawModule.createView" );//XXX
      return new BeersLawView( model, mvt, strings );
    };
  }

  return BeersLawModule;
} );