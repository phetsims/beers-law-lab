// Copyright 2016-2020, University of Colorado Boulder

/**
 * Displays the amount of solute, in grams.  See beers-law-lab#148
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import beersLawLab from '../../beersLawLab.js';
import beersLawLabStrings from '../../beersLawLabStrings.js';

// constants
const DECIMAL_PLACES = 0;

class SoluteGramsNode extends Text {

  /**
   * @param {Property.<number>} soluteGramsProperty - grams of solute
   * @param {Object} [options]
   */
  constructor( soluteGramsProperty, options ) {
    assert && assert( soluteGramsProperty instanceof Property );

    options = merge( {
      font: new PhetFont( 22 )
    }, options );

    super( '', options );

    soluteGramsProperty.link( soluteGrams => {
      this.text = StringUtils.format( beersLawLabStrings.pattern[ '0soluteAmount' ],
        Utils.toFixed( soluteGrams, DECIMAL_PLACES ) );
    } );
  }
}

beersLawLab.register( 'SoluteGramsNode', SoluteGramsNode );
export default SoluteGramsNode;