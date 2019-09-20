// Copyright 2013-2019, University of Colorado Boulder

/**
 * The 'Beer's Law' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const BeersLawModel = require( 'BEERS_LAW_LAB/beerslaw/model/BeersLawModel' );
  const BeersLawScreenView = require( 'BEERS_LAW_LAB/beerslaw/view/BeersLawScreenView' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Screen = require( 'JOIST/Screen' );
  const Vector2 = require( 'DOT/Vector2' );

  // strings
  const screenBeersLawString = require( 'string!BEERS_LAW_LAB/screen.beersLaw' );

  // image
  const screenIcon = require( 'image!BEERS_LAW_LAB/BeersLaw-screen-icon.jpg' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function BeersLawScreen( tandem ) {

    // No offset, scale 125x when going from model to view (1cm == 125 pixels)
    const modelViewTransform = ModelViewTransform2.createOffsetScaleMapping( new Vector2( 0, 0 ), 125 );

    const options = {
      name: screenBeersLawString,
      homeScreenIcon: new Image( screenIcon ),
      tandem: tandem
    };

    Screen.call( this,
      function() { return new BeersLawModel( modelViewTransform, tandem.createTandem( 'model' ) ); },
      function( model ) { return new BeersLawScreenView( model, modelViewTransform, tandem.createTandem( 'view' ) ); },
      options );
  }

  beersLawLab.register( 'BeersLawScreen', BeersLawScreen );

  return inherit( Screen, BeersLawScreen );
} );