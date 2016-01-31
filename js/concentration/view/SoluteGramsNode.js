// Copyright 2016, University of Colorado Boulder

/**
 * Displays the amount of solute, in grams.  See beers-law-lab#148
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // strings
  var pattern0SoluteAmountString = require( 'string!BEERS_LAW_LAB/pattern.0soluteAmount' );

  // constants
  var DECIMAL_PLACES = 0;

  /**
   * @param {Property.<number>} soluteGramsProperty - grams of solute
   * @param {Object} [options]
   * @constructor
   */
  function SoluteGramsNode( soluteGramsProperty, options ) {

    options = _.extend( {
      font: new PhetFont( 22 )
    }, options );

    var thisNode = this;
    Text.call( this, '', options );

    soluteGramsProperty.link( function( soluteGrams ) {
      thisNode.text = StringUtils.format( pattern0SoluteAmountString, Util.toFixed( soluteGrams, DECIMAL_PLACES ) );
    } );
  }

  beersLawLab.register( 'SoluteGramsNode', SoluteGramsNode );

  return inherit( Text, SoluteGramsNode );
} );
