// Copyright 2002-2013, University of Colorado

/**
 * The "Beer's Law" tab. Conforms to the contact specified in joist/Tab.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var BeersLawModel = require( "beerslaw/model/BeersLawModel" );
  var BeersLawView = require( "beerslaw/view/BeersLawView" );
  var Image = require( "SCENERY/nodes/Image" );
  var ModelViewTransform2D = require( "PHETCOMMON/view/ModelViewTransform2D" );
  var Vector2 = require( "DOT/Vector2" );

  // images
  var ICON = require( "image!images/Beers-Law-icon.jpg" );

  function BeersLawTab( strings ) {

    this.name = strings.beersLaw;
    this.icon = new Image( ICON );
    this.backgroundColor = 'white';

    // No offset, scale 125x when going from model to view (1cm == 125 pixels)
    var mvt = new ModelViewTransform2D( 125, new Vector2( 0, 0 ) );

    this.createModel = function () {
      return new BeersLawModel( mvt );
    };

    this.createView = function ( model ) {
      return new BeersLawView( model, mvt, strings );
    };
  }

  return BeersLawTab;
} );