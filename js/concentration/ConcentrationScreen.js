// Copyright 2013-2017, University of Colorado Boulder

/**
 * The 'Concentration' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const ConcentrationModel = require( 'BEERS_LAW_LAB/concentration/model/ConcentrationModel' );
  const ConcentrationScreenView = require( 'BEERS_LAW_LAB/concentration/view/ConcentrationScreenView' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenConcentrationString = require( 'string!BEERS_LAW_LAB/screen.concentration' );

  // images
  const screenIcon = require( 'image!BEERS_LAW_LAB/Concentration-screen-icon.jpg' );

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
      function() { return new ConcentrationModel( { tandem: tandem.createTandem( 'model' ) } ); },
      function( model ) { return new ConcentrationScreenView( model, modelViewTransform, tandem.createTandem( 'view' ) ); },
      options );
  }

  beersLawLab.register( 'ConcentrationScreen', ConcentrationScreen );

  return inherit( Screen, ConcentrationScreen );
} );