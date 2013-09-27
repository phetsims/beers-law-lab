// Copyright 2002-2013, University of Colorado Boulder

/**
 * The 'Beer's Law' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var BeersLawModel = require( 'BEERS_LAW_LAB/beerslaw/model/BeersLawModel' );
  var BeersLawView = require( 'BEERS_LAW_LAB/beerslaw/view/BeersLawView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var strings = require( 'BEERS_LAW_LAB/beers-law-lab-strings' );
  var Vector2 = require( 'DOT/Vector2' );

  // images
  var beersLawImage = require( 'image!BEERS_LAW_LAB/../images/Beers-Law-icon.jpg' );

  function BeersLawScreen() {

    this.name = strings.beersLaw;
    this.icon = new Image( beersLawImage );
    this.backgroundColor = 'white';

    // No offset, scale 125x when going from model to view (1cm == 125 pixels)
    var mvt = ModelViewTransform2.createOffsetScaleMapping( new Vector2( 0, 0 ), 125 );

    this.createModel = function() {
      return new BeersLawModel( mvt );
    };

    this.createView = function( model ) {
      return new BeersLawView( model, mvt );
    };
  }

  return BeersLawScreen;
} );