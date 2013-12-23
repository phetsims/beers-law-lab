// Copyright 2002-2013, University of Colorado Boulder

/**
 * The 'Concentration' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var ConcentrationModel = require( 'BEERS_LAW_LAB/concentration/model/ConcentrationModel' );
  var ConcentrationView = require( 'BEERS_LAW_LAB/concentration/view/ConcentrationView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var concentrationString = require( 'string!BEERS_LAW_LAB/tab.concentration' );

  // images
  var screenIcon = require( 'image!BEERS_LAW_LAB/Concentration-screen-icon.jpg' );

  function ConcentrationScreen() {

    var mvt = ModelViewTransform2.createIdentity();

    Screen.call( this,
      concentrationString,
      new Image( screenIcon ),
      function() { return new ConcentrationModel(); },
      function( model ) { return new ConcentrationView( model, mvt ); }
    );
  }

  return inherit( Screen, ConcentrationScreen );
} );