// Copyright 2013-2019, University of Colorado Boulder

/**
 * Radio button group that selects the solute form, either 'solid' (shaker) or 'solution' (dropper).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AquaRadioButtonGroup = require( 'SUN/AquaRadioButtonGroup' );
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const BLLConstants = require( 'BEERS_LAW_LAB/common/BLLConstants' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Image = require( 'SCENERY/nodes/Image' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const solidString = require( 'string!BEERS_LAW_LAB/solid' );
  const solutionString = require( 'string!BEERS_LAW_LAB/solution' );

  // images
  const dropperIconImage = require( 'image!BEERS_LAW_LAB/dropper-icon.png' );
  const shakerIconImage = require( 'image!BEERS_LAW_LAB/shaker-icon.png' );

  // constants
  const RADIO_BUTTON_TEXT_OPTIONS = { font: new PhetFont( 22 ), fill: 'black' };

  class SoluteFormRadioButtonGroup extends AquaRadioButtonGroup {

    /**
     * @param {Property.<string>} soluteFormProperty form of the solute, 'solid' or 'solution'
     * @param {Shaker} shaker
     * @param {Dropper} dropper
     * @param {Tandem} tandem
     */
    constructor( soluteFormProperty, shaker, dropper, tandem ) {

      // radio button descriptions
      const items = [
        {
          value: 'solid',
          node: createRadioButtonLabel( solidString, shakerIconImage, RADIO_BUTTON_TEXT_OPTIONS ),
          tandemName: 'solidRadioButton'
        },
        {
          value: 'solution',
          node: createRadioButtonLabel( solutionString, dropperIconImage, RADIO_BUTTON_TEXT_OPTIONS ),
          tandemName: 'solutionRadioButton'
        }
      ];

      super( soluteFormProperty, items, {
        orientation: 'horizontal',
        spacing: 60,
        radioButtonOptions: { radius: BLLConstants.RADIO_BUTTON_RADIUS },
        touchAreaYDilation: 2,
        tandem: tandem
      } );

      soluteFormProperty.link( soluteForm => {
        shaker.visibleProperty.set( soluteForm === 'solid' );
        dropper.visibleProperty.set( soluteForm === 'solution' );
      } );

      shaker.visibleProperty.link( visible => {
        soluteFormProperty.set( visible ? 'solid' : 'solution' );
      } );

      dropper.visibleProperty.link( visible => {
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