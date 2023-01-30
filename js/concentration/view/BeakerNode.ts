// Copyright 2013-2023, University of Colorado Boulder

/**
 * Visual representation of a beaker that is filled to the top with a solution.
 * Ticks on the left edge of the beaker. Origin is at the bottom center.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, NodeOptions, Path, Text } from '../../../../scenery/js/imports.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import Beaker from '../model/Beaker.js';
import BLLPreferences from '../../common/model/BLLPreferences.js';

// constants
const RIM_OFFSET = 20;
const MINOR_TICK_SPACING = 0.1; // L
const MINOR_TICKS_PER_MAJOR_TICK = 5;
const MAJOR_TICK_LENGTH = 30;
const MINOR_TICK_LENGTH = 15;
const TICK_LABEL_X_SPACING = 8;
const MAJOR_TICK_VALUES_LITERS = [ '\u00bd', '1' ]; // 1/2 L, 1 L
const MAJOR_TICK_VALUES_MILLILITERS = [ '500', '1000' ]; // 500 mL, 1000 mL
assert && assert( MAJOR_TICK_VALUES_LITERS.length === MAJOR_TICK_VALUES_MILLILITERS.length );

type SelfOptions = EmptySelfOptions;

type BeakerNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class BeakerNode extends Node {

  public constructor( beaker: Beaker, modelViewTransform: ModelViewTransform2, providedOptions: BeakerNodeOptions ) {

    const options = optionize<BeakerNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      pickable: false,
      visiblePropertyOptions: {
        phetioReadOnly: true
      }
    }, providedOptions );

    super( options );

    // outline of the beaker, starting from upper left
    const width = modelViewTransform.modelToViewDeltaX( beaker.size.width );
    const height = modelViewTransform.modelToViewDeltaY( beaker.size.height );
    const outlineShape = new Shape()
      .moveTo( -( width / 2 ) - RIM_OFFSET, -height - RIM_OFFSET )
      .lineTo( -( width / 2 ), -height )
      .lineTo( -( width / 2 ), 0 )
      .lineTo( width / 2, 0 )
      .lineTo( width / 2, -height )
      .lineTo( ( width / 2 ) + RIM_OFFSET, -height - RIM_OFFSET );
    this.addChild( new Path( outlineShape, {
      stroke: 'black',
      lineWidth: 3,
      lineCap: 'round',
      lineJoin: 'round'
    } ) );

    // horizontal tick marks and tick labels, at left edge of beaker, from bottom up
    const tickMarksNode = new Node( {
      tandem: options.tandem.createTandem( 'tickMarksNode' )
    } );
    this.addChild( tickMarksNode );
    const tickLabelsNode = new Node( {
      tandem: options.tandem.createTandem( 'tickLabelsNode' )
    } );
    this.addChild( tickLabelsNode );

    const numberOfTicks = Utils.roundSymmetric( beaker.volume / MINOR_TICK_SPACING );
    const deltaY = height / numberOfTicks;
    for ( let i = 1; i <= numberOfTicks; i++ ) {

      // tick
      const isMajorTick = ( i % MINOR_TICKS_PER_MAJOR_TICK === 0 );
      const y = -( i * deltaY );
      const leftX = -width / 2;
      const rightX = leftX + ( isMajorTick ? MAJOR_TICK_LENGTH : MINOR_TICK_LENGTH );
      const tickShape = new Shape().moveTo( leftX, y ).lineTo( rightX, y );
      const tickPath = new Path( tickShape, {
        stroke: 'black',
        lineWidth: 2,
        lineCap: 'butt',
        lineJoin: 'bevel'
      } );
      tickMarksNode.addChild( tickPath );

      // major tick label
      if ( isMajorTick ) {
        const labelIndex = ( i / MINOR_TICKS_PER_MAJOR_TICK ) - 1;
        if ( labelIndex < MAJOR_TICK_VALUES_LITERS.length ) {

          // display ticks in liters or milliliters, see beers-law-lab#150
          const labelStringProperty = new DerivedProperty( [
              BeersLawLabStrings.pattern[ '0value' ][ '1unitsStringProperty' ],
              BeersLawLabStrings.units.litersStringProperty,
              BeersLawLabStrings.units.millilitersStringProperty,
              BLLPreferences.beakerUnitsProperty
            ],
            ( pattern, litersString, millilitersString, beakerUnits ) =>
              StringUtils.format( pattern,
                ( beakerUnits === 'liters' ) ? MAJOR_TICK_VALUES_LITERS[ labelIndex ] : MAJOR_TICK_VALUES_MILLILITERS[ labelIndex ],
                ( beakerUnits === 'liters' ) ? litersString : millilitersString )
          );

          tickLabelsNode.addChild( new Text( labelStringProperty, {
            font: new PhetFont( 24 ),
            fill: 'black',
            x: rightX + TICK_LABEL_X_SPACING,
            centerY: tickPath.centerY,
            maxWidth: 0.25 * beaker.size.width // constrain width for i18n
            // No PhET-iO instrumentation is desired.
          } ) );
        }
      }
    }

    const position = modelViewTransform.modelToViewPosition( beaker.position );
    this.x = position.x;
    this.y = position.y;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

beersLawLab.register( 'BeakerNode', BeakerNode );