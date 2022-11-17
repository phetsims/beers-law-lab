// Copyright 2016-2022, University of Colorado Boulder

/**
 * SolutionVolumeNode displays the volume of the solution, in L. See https://github.com/phetsims/beers-law-lab/issues/161
 *
 * Note that this is a Node instead of an HBox because the local y origin must be at the center of the tick mark,
 * so that it aligns with tick marks on the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Line, Node, NodeOptions, Text } from '../../../../scenery/js/imports.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BLLPreferences from '../../common/model/BLLPreferences.js';

type SelfOptions = EmptySelfOptions;

type SolutionVolumeNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class SolutionVolumeNode extends Node {

  public constructor( volumeProperty: Property<number>, providedOptions: SolutionVolumeNodeOptions ) {

    const options = optionize<SolutionVolumeNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      visibleProperty: BLLPreferences.showSolutionVolumeProperty
    }, providedOptions );

    const tickMarkNode = new Line( 0, 0, 10, 0, {
      stroke: 'black',
      lineWidth: 2,
      centerY: 0
    } );

    const soluteAmountStringProperty = new DerivedProperty(
      [ BeersLawLabStrings.pattern[ '0value' ][ '1unitsStringProperty' ], volumeProperty, BeersLawLabStrings.units.litersStringProperty ],
      ( pattern, volume, liters ) => {

        // Display integer values with 0 decimal places, non-integer values with 2 decimal places.
        const valueString = Number.isInteger( volume ) ? Utils.toFixed( volume, 0 ) : Utils.toFixed( volume, 2 );
        return StringUtils.format( pattern, valueString, liters );
      } );

    const soluteAmountText = new Text( soluteAmountStringProperty, {
      font: new PhetFont( 20 ),
      maxWidth: 60 // determined empirically
    } );

    soluteAmountText.boundsProperty.link( bounds => {
      soluteAmountText.right = tickMarkNode.left - 3;
      soluteAmountText.centerY = tickMarkNode.centerY;
    } );

    options.children = [ soluteAmountText, tickMarkNode ];

    super( options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

beersLawLab.register( 'SolutionVolumeNode', SolutionVolumeNode );
