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
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var concentrationString = require( 'string!BEERS_LAW_LAB/tab.concentration' );

  // images
  var screenIcon = require( 'image!BEERS_LAW_LAB/Concentration-screen-icon.jpg' );

  function ConcentrationScreen() {

    this.name = concentrationString;
    this.icon = new Image( screenIcon );
    this.backgroundColor = 'white';

    var mvt = ModelViewTransform2.createIdentity();

    this.createModel = function() {
      return new ConcentrationModel();
    };

    this.createView = function( model ) {
      return new ConcentrationView( model, mvt );
    };
  }

  return ConcentrationScreen;
} );