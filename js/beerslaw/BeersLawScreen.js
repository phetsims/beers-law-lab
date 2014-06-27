// Copyright 2002-2013, University of Colorado Boulder

/**
 * The 'Beer's Law' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BeersLawModel = require( 'BEERS_LAW_LAB/beerslaw/model/BeersLawModel' );
  var BeersLawView = require( 'BEERS_LAW_LAB/beerslaw/view/BeersLawView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Screen = require( 'JOIST/Screen' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var beersLawString = require( 'string!BEERS_LAW_LAB/tab.beersLaw' );

  // image
  var screenIcon = require( 'image!BEERS_LAW_LAB/BeersLaw-screen-icon.jpg' );

  function BeersLawScreen() {

    // No offset, scale 125x when going from model to view (1cm == 125 pixels)
    var modelViewTransform = ModelViewTransform2.createOffsetScaleMapping( new Vector2( 0, 0 ), 125 );

    Screen.call( this,
      beersLawString,
      new Image( screenIcon ),
      function() { return new BeersLawModel( modelViewTransform ); },
      function( model ) { return new BeersLawView( model, modelViewTransform ); }
    );
  }

  return inherit( Screen, BeersLawScreen );
} );