// Copyright 2002-2013, University of Colorado Boulder

/**
 * The 'Concentration' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConcentrationModel = require( 'BEERS_LAW_LAB/concentration/model/ConcentrationModel' );
  var ConcentrationView = require( 'BEERS_LAW_LAB/concentration/view/ConcentrationView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var concentrationString = require( 'string!BEERS_LAW_LAB/screen.concentration' );

  // images
  var screenIcon = require( 'image!BEERS_LAW_LAB/Concentration-screen-icon.jpg' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function ConcentrationScreen( tandem ) {

    var modelViewTransform = ModelViewTransform2.createIdentity();
    var screenTandem = tandem.createTandem( 'concentrationScreen' );

    Screen.call( this,
      concentrationString,
      new Image( screenIcon ),
      function() { return new ConcentrationModel( screenTandem ); },
      function( model ) { return new ConcentrationView( model, modelViewTransform, screenTandem ); }
    );
  }

  return inherit( Screen, ConcentrationScreen );
} );