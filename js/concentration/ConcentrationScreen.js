// Copyright 2013-2015, University of Colorado Boulder

/**
 * The 'Concentration' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var ConcentrationModel = require( 'BEERS_LAW_LAB/concentration/model/ConcentrationModel' );
  var ConcentrationScreenView = require( 'BEERS_LAW_LAB/concentration/view/ConcentrationScreenView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenConcentrationString = require( 'string!BEERS_LAW_LAB/screen.concentration' );

  // images
  var screenIcon = require( 'image!BEERS_LAW_LAB/Concentration-screen-icon.jpg' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function ConcentrationScreen( tandem ) {

    var modelViewTransform = ModelViewTransform2.createIdentity();

    var options = {
      name: screenConcentrationString,
      homeScreenIcon: new Image( screenIcon ),
      tandem: tandem
    };

    Screen.call( this,
      function() { return new ConcentrationModel( tandem.createTandem( 'model' ) ); },
      function( model ) { return new ConcentrationScreenView( model, modelViewTransform, tandem.createTandem( 'view' ) ); },
      options );
  }

  beersLawLab.register( 'ConcentrationScreen', ConcentrationScreen );

  return inherit( Screen, ConcentrationScreen );
} );