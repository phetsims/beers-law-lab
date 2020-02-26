// Copyright 2013-2019, University of Colorado Boulder

/**
 * Radio button group that selects the solution form, either 'solid' (shaker) or 'solution' (dropper).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AquaRadioButton = require( 'SUN/AquaRadioButton' );
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const BLLConstants = require( 'BEERS_LAW_LAB/common/BLLConstants' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Image = require( 'SCENERY/nodes/Image' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const solidString = require( 'string!BEERS_LAW_LAB/solid' );
  const solutionString = require( 'string!BEERS_LAW_LAB/solution' );

  // images
  const dropperIconImage = require( 'image!BEERS_LAW_LAB/dropper-icon.png' );
  const shakerIconImage = require( 'image!BEERS_LAW_LAB/shaker-icon.png' );

  // constants
  const TEXT_OPTIONS = { font: new PhetFont( 22 ), fill: 'black' };
  const SEPARATOR_SPACING = 30;

  class SoluteFormRadioButtonGroup extends Node {

    /**
     * @param {Property.<string>} soluteFormProperty form of the solute, 'solid' or 'solution'
     * @param {Shaker} shaker
     * @param {Dropper} dropper
     * @param {Tandem} tandem
     */
    constructor( soluteFormProperty, shaker, dropper, tandem ) {

      const shakerButton = new AquaRadioButton( soluteFormProperty, 'solid',
        createRadioButtonLabel( solidString, shakerIconImage, TEXT_OPTIONS ), {
          radius: BLLConstants.RADIO_BUTTON_RADIUS,
          tandem: tandem.createTandem( 'solidRadioButton' )
        } );
      shakerButton.touchArea = shakerButton.localBounds.dilatedXY( 10, 2 );

      // vertical separator
      const separator = new Line( 0, 0, 0, shakerButton.height, {
        stroke: 'rgb(150,150,150)',
        lineWidth: 0.5,
        left: shakerButton.right + SEPARATOR_SPACING,
        centerY: shakerButton.centerY
      } );

      const dropperButton = new AquaRadioButton( soluteFormProperty, 'solution',
        createRadioButtonLabel( solutionString, dropperIconImage, TEXT_OPTIONS ), {
          radius: BLLConstants.RADIO_BUTTON_RADIUS,
          left: separator.right + SEPARATOR_SPACING,
          tandem: tandem.createTandem( 'solutionRadioButton' )
        } );
      dropperButton.touchArea = dropperButton.localBounds.dilatedXY( 10, 2 );

      super( {
        children: [ shakerButton, separator, dropperButton ],
        tandem: tandem
      } );

      soluteFormProperty.link( function( soluteForm ) {
        shaker.visibleProperty.set( soluteForm === 'solid' );
        dropper.visibleProperty.set( soluteForm === 'solution' );
      } );

      shaker.visibleProperty.link( function( visible ) {
        soluteFormProperty.set( visible ? 'solid' : 'solution' );
      } );

      dropper.visibleProperty.link( function( visible ) {
        soluteFormProperty.set( visible ? 'solution' : 'solid' );
      } );
    }
  }

  /**
   * Creates the label for a radio button.
   * @param {string} text
   * @param {Image} image
   * @param {Object} [textOptions]
   */
  function createRadioButtonLabel( text, image, textOptions ) {
    return new HBox( {
      spacing: 10,
      children: [ new Text( text, textOptions ), new Image( image ) ]
    } );
  }

  return beersLawLab.register( 'SoluteFormRadioButtonGroup', SoluteFormRadioButtonGroup );
} );