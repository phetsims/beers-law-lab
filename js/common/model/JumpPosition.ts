// Copyright 2025, University of Colorado Boulder

/**
 * JumpPosition is the information about a position that be quickly set using the 'J' (for jump) keyboard shortcut.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';

export type JumpPosition = {

  // The position to jump to, possibly dynamic.
  positionProperty: TReadOnlyProperty<Vector2>;

  // The accessibleObjectResponse that is added when the keyboard shortcut is used to jump to this position.
  accessibleObjectResponseStringProperty: TReadOnlyProperty<string>;
};