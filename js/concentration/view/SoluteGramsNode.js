// Copyright 2016, University of Colorado Boulder

/**
 * Displays the amount of solute, in grams.  See beers-law-lab#148
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const inherit = require( 'PHET_CORE/inherit' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );

  // strings
  const pattern0SoluteAmountString = require( 'string!BEERS_LAW_LAB/pattern.0soluteAmount' );

  // constants
  const DECIMAL_PLACES = 0;

  /**
   * @param {Property.<number>} soluteGramsProperty - grams of solute
   * @param {Object} [options]
   * @constructor
   */
  function SoluteGramsNode( soluteGramsProperty, options ) {

    options = _.extend( {
      font: new PhetFont( 22 )
    }, options );

    const self = this;

    Text.call( this, '', options );

    soluteGramsProperty.link( function( soluteGrams ) {
      self.text = StringUtils.format( pattern0SoluteAmountString, Util.toFixed( soluteGrams, DECIMAL_PLACES ) );
    } );
  }

  beersLawLab.register( 'SoluteGramsNode', SoluteGramsNode );

  return inherit( Text, SoluteGramsNode );
} );
