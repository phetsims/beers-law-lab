// Copyright 2022-2024, University of Colorado Boulder

/**
 * SolutionVolumeNode displays the volume of the solution, in L. See https://github.com/phetsims/beers-law-lab/issues/161
 *
 * Note that this is a Node instead of an HBox because the local y origin must be at the center of the tick mark,
 * so that it aligns with tick marks on the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BLLPreferences from '../../common/model/BLLPreferences.js';

type SelfOptions = EmptySelfOptions;

type SolutionVolumeNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class SolutionVolumeNode extends Node {

  public constructor( volumeProperty: Property<number>, providedOptions: SolutionVolumeNodeOptions ) {

    const options = optionize<SolutionVolumeNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false,
      visibleProperty: BLLPreferences.showSolutionVolumeProperty
    }, providedOptions );

    const triangleSize = 15;
    const triangleShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( triangleSize, triangleSize / 2 )
      .lineTo( 0, triangleSize )
      .close();
    const triangleNode = new Path( triangleShape, {
      fill: 'black',
      centerY: 0
    } );

    const stringProperty = new DerivedStringProperty( [
        BeersLawLabStrings.pattern[ '0value' ][ '1unitsStringProperty' ],
        volumeProperty,
        BeersLawLabStrings.units.litersStringProperty,
        BeersLawLabStrings.units.millilitersStringProperty,
        BLLPreferences.beakerUnitsProperty
      ],
      ( pattern, volume, litersString, millilitersString, beakerUnits ) => {

        // Display integer values with 0 decimal places, non-integer values with 2 decimal places.
        let volumeString: string;
        let units: string;
        if ( beakerUnits === 'liters' ) {
          volumeString = Number.isInteger( volume ) ? Utils.toFixed( volume, 0 ) : Utils.toFixed( volume, 2 );
          units = litersString;
        }
        else {
          volumeString = Utils.toFixed( volume * 1000, 0 ); // convert L to mL
          units = millilitersString;
        }
        return StringUtils.format( pattern, volumeString, units );
      } );

    const text = new Text( stringProperty, {
      font: new PhetFont( 22 ),
      maxWidth: 100 // determined empirically
    } );

    text.boundsProperty.link( bounds => {
      text.right = triangleNode.left - 6;
      text.bottom = triangleNode.centerY - 1;
    } );

    options.children = [ text, triangleNode ];

    super( options );
  }
}

beersLawLab.register( 'SolutionVolumeNode', SolutionVolumeNode );