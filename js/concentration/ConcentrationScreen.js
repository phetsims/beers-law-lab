// Copyright 2002-2013, University of Colorado Boulder

/**
 * The 'Concentration' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var BLLImages = require( 'common/BLLImages' );
  var BLLStrings = require( 'common/BLLStrings' );
  var ConcentrationModel = require( 'concentration/model/ConcentrationModel' );
  var ConcentrationView = require( 'concentration/view/ConcentrationView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );

  function ConcentrationScreen() {

    this.name = BLLStrings.concentration;
    this.icon = new Image( BLLImages.getImage( 'Concentration-icon.jpg' ) );
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