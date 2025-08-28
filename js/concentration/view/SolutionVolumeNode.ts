// Copyright 2022-2025, University of Colorado Boulder

/**
 * SolutionVolumeNode displays the volume of the solution, in L. See https://github.com/phetsims/beers-law-lab/issues/161
 *
 * Note that this is a Node instead of an HBox because the local y origin must be at the center of the tick mark,
 * so that it aligns with tick marks on the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
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
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import BLLConstants from '../../common/BLLConstants.js';

type SelfOptions = EmptySelfOptions;

type SolutionVolumeNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class SolutionVolumeNode extends Node {

  public constructor( volumeProperty: TReadOnlyProperty<number>, providedOptions: SolutionVolumeNodeOptions ) {

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

    // Display integer values with 0 decimal places, non-integer values with 2 decimal places.
    const volumeStringProperty = new DerivedStringProperty( [ volumeProperty, BLLPreferences.beakerUnitsProperty ],
      ( volume, beakerUnits ) => {
        let volumeString: string;
        if ( beakerUnits === 'liters' ) {
          volumeString = Number.isInteger( volume ) ? toFixed( volume, 0 ) : toFixed( volume, BLLConstants.DECIMAL_PLACES_VOLUME_LITERS );
        }
        else {
          volumeString = toFixed( volume * 1000, BLLConstants.DECIMAL_PLACES_VOLUME_MILLILITERS ); // convert L to mL
        }
        return volumeString;
      } );

    const unitsProperty = new DerivedStringProperty( [
      BLLPreferences.beakerUnitsProperty,
      BeersLawLabStrings.units.litersStringProperty,
      BeersLawLabStrings.units.millilitersStringProperty
    ], ( beakerUnits, litersString, millilitersString ) =>
      ( beakerUnits === 'liters' ) ? litersString : millilitersString );

    const stringProperty = new DerivedStringProperty( [
        BeersLawLabStrings.pattern[ '0value' ][ '1unitsStringProperty' ],
        volumeStringProperty,
        unitsProperty
      ],
      ( pattern, volumeString, units ) => StringUtils.format( pattern, volumeString, units )
    );

    const text = new Text( stringProperty, {
      font: new PhetFont( 22 ),
      maxWidth: 100 // determined empirically
    } );

    text.boundsProperty.link( bounds => {
      text.right = triangleNode.left - 6;
      text.bottom = triangleNode.centerY - 1;
    } );

    options.children = [ text, triangleNode ];
    options.accessibleParagraph = createAccessibleParagraph( volumeProperty, volumeStringProperty );

    super( options );
  }
}

/**
 * Creates the accessible paragraph for this Node.
 */
function createAccessibleParagraph( volumeProperty: TReadOnlyProperty<number>, volumeStringProperty: TReadOnlyProperty<string> ): TReadOnlyProperty<string> {

  const unitsDescriptionProperty = new DerivedStringProperty( [
      volumeProperty,
      BLLPreferences.beakerUnitsProperty,
      BeersLawLabStrings.a11y.unitsDescription.litersStringProperty,
      BeersLawLabStrings.a11y.unitsDescription.millilitersStringProperty
    ],
    ( volume, beakerUnits, litersString, millilitersString ) => ( beakerUnits === 'liters' ) ? litersString : millilitersString
  );

  return new PatternStringProperty( BeersLawLabStrings.a11y.solutionVolumeNode.accessibleParagraphStringProperty, {
    value: volumeStringProperty,
    units: unitsDescriptionProperty
  }, {
    isDisposable: false // because we cannot clean up unitsDescriptionProperty
  } );
}

beersLawLab.register( 'SolutionVolumeNode', SolutionVolumeNode );