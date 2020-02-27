// Copyright 2013-2020, University of Colorado Boulder

/**
 * Combo box for selecting solutions.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const ComboBox = require( 'SUN/ComboBox' );
  const ComboBoxItem = require( 'SUN/ComboBoxItem' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const pattern0LabelString = require( 'string!BEERS_LAW_LAB/pattern.0label' );
  const solutionString = require( 'string!BEERS_LAW_LAB/solution' );

  class SolutionComboBox extends ComboBox {

    /**
     * @param {BeersLawSolution[]} solutions
     * @param {Property.<BeersLawSolution>} selectedSolutionProperty
     * @param {Node} solutionListParent
     * @param {Tandem} tandem
     * @constructor
     */
    constructor( solutions, selectedSolutionProperty, solutionListParent, tandem ) {

      // 'Solution' label
      const label = new Text( StringUtils.format( pattern0LabelString, solutionString ), { font: new PhetFont( 20 ) } );

      // items
      const items = solutions.map( solution => createItem( solution, tandem ) );

      super( items, selectedSolutionProperty, solutionListParent, {
        labelNode: label,
        listPosition: 'above',
        xMargin: 12,
        yMargin: 12,
        highlightFill: 'rgb( 218, 255, 255 )',
        cornerRadius: 8,
        tandem: tandem
      } );
    }
  }

  /**
   * Creates a combo box item.
   * @private
   * @param {BeersLawSolution} solution
   * @param {Tandem} tandem
   * @returns {ComboBoxItem}
   */
  function createItem( solution, tandem ) {

    const colorSquare = new Rectangle( 0, 0, 20, 20, {
      fill: solution.saturatedColor,
      stroke: solution.saturatedColor.darkerColor()
    } );

    const solutionName = new RichText( solution.getDisplayName(), {
      font: new PhetFont( 20 ),
      tandem: tandem.createTandem( solution.tandemName + 'Text' )
    } );

    const hBox = new HBox( {
      spacing: 5,
      children: [ colorSquare, solutionName ]
    } );

    return new ComboBoxItem( hBox, solution, {
      tandemName: solution.tandemName
    } );
  }

  return beersLawLab.register( 'SolutionComboBox', SolutionComboBox );
} );