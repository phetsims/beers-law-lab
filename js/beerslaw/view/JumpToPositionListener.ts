// Copyright 2025, University of Colorado Boulder

/**
 * JumpToPositionListener is a keyboard listener that is specialized for the 'jump to useful position' shortcut.
 * See see https://github.com/phetsims/beers-law-lab/issues/35.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import beersLawLab from '../../beersLawLab.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { JumpPosition } from '../../common/model/JumpPosition.js';
import Property from '../../../../axon/js/Property.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import type { OneKeyStroke } from '../../../../scenery/js/input/KeyDescriptor.js';

export default class JumpToPositionListener extends KeyboardListener<OneKeyStroke[]> {

  public constructor( targetNode: Node,
                      hotkeyData: HotkeyData,
                      positionProperty: Property<Vector2>,
                      jumpPositions: JumpPosition[],
                      jumpPositionIndexProperty: Property<number> ) {
    super( {
      keyStringProperties: HotkeyData.combineKeyStringProperties( [ hotkeyData ] ),
      fire: ( event, keysPressed ) => {
        if ( hotkeyData.hasKeyStroke( keysPressed ) ) {
          phet.log && phet.log( `hotkey J, jumpPositionIndex=${jumpPositionIndexProperty.value}` );
          positionProperty.value = jumpPositions[ jumpPositionIndexProperty.value ].positionProperty.value;
          targetNode.addAccessibleObjectResponse( jumpPositions[ jumpPositionIndexProperty.value ].accessibleObjectResponseStringProperty );
          if ( jumpPositionIndexProperty.value < jumpPositions.length - 1 ) {
            jumpPositionIndexProperty.value++;
          }
          else {
            jumpPositionIndexProperty.value = 0;
          }
        }
      }
    } );
  }
}

beersLawLab.register( 'JumpToPositionListener', JumpToPositionListener );