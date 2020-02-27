// Copyright 2016-2019, University of Colorado Boulder

/**
 * Displays the amount of solute, in grams.  See beers-law-lab#148
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const merge = require( 'PHET_CORE/merge' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Utils = require( 'DOT/Utils' );

  // strings
  const pattern0SoluteAmountString = require( 'string!BEERS_LAW_LAB/pattern.0soluteAmount' );

  // constants
  const DECIMAL_PLACES = 0;

  class SoluteGramsNode extends Text {

    /**
     * @param {Property.<number>} soluteGramsProperty - grams of solute
     * @param {Object} [options]
     */
    constructor( soluteGramsProperty, options ) {

      options = merge( {
        font: new PhetFont( 22 )
      }, options );

      super( '', options );

      soluteGramsProperty.link( soluteGrams => {
        this.text = StringUtils.format( pattern0SoluteAmountString, Utils.toFixed( soluteGrams, DECIMAL_PLACES ) );
      } );
    }
  }

  return beersLawLab.register( 'SoluteGramsNode', SoluteGramsNode );
} );
