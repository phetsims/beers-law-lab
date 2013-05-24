// Copyright 2002-2013, University of Colorado

/**
 * The "Beer's Law" tab. Conforms to the contract specified in joist/Tab.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var BLLImages = require( "common/BLLImages" );
  var BLLStrings = require( "common/BLLStrings" );
  var BeersLawModel = require( "beerslaw/model/BeersLawModel" );
  var BeersLawView = require( "beerslaw/view/BeersLawView" );
  var Image = require( "SCENERY/nodes/Image" );
  var ModelViewTransform2 = require( "PHETCOMMON/view/ModelViewTransform2" );
  var Vector2 = require( "DOT/Vector2" );

  function BeersLawTab() {

    this.name = BLLStrings.beersLaw;
    this.icon = new Image( BLLImages.getImage( "Beers-Law-icon.jpg" ) );
    this.backgroundColor = "white";

    // No offset, scale 125x when going from model to view (1cm == 125 pixels)
    var mvt = ModelViewTransform2.createOffsetScaleMapping( new Vector2( 0, 0 ), 125 );

    this.createModel = function() {
      return new BeersLawModel( mvt );
    };

    this.createView = function( model ) {
      return new BeersLawView( model, mvt );
    };
  }

  return BeersLawTab;
} );