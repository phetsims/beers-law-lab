// Copyright 2013-2019, University of Colorado Boulder

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
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenConcentrationString = require( 'string!BEERS_LAW_LAB/screen.concentration' );

  // images
  const screenIcon = require( 'image!BEERS_LAW_LAB/Concentration-screen-icon.jpg' );

  class ConcentrationScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const modelViewTransform = ModelViewTransform2.createIdentity();

      const options = {
        name: screenConcentrationString,
        homeScreenIcon: new Image( screenIcon ),
        tandem: tandem
      };

      super(
        () => new ConcentrationModel( { tandem: tandem.createTandem( 'model' ) } ),
        model => new ConcentrationScreenView( model, modelViewTransform, tandem.createTandem( 'view' ) ),
        options
      );
    }
  }

  return beersLawLab.register( 'ConcentrationScreen', ConcentrationScreen );
} );