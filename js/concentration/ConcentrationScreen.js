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
  var concentrationString = require( 'string!BEERS_LAW_LAB/concentration' );
  var Vector2 = require( 'DOT/Vector2' );

  // images
  var concentrationImage = require( 'image!BEERS_LAW_LAB/../images/Concentration-icon.jpg' );

  function ConcentrationScreen() {

    this.name = concentrationString;
    this.icon = new Image( concentrationImage );
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