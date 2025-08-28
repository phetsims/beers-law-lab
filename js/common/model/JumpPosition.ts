// Copyright 2025, University of Colorado Boulder

/**
 * JumpPosition is the information about a position that be quickly set using the 'J' (for jump) keyboard shortcut.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import beersLawLab from '../../beersLawLab.js';

type SelfOptions = {

  // The position to jump to, possibly dynamic.
  positionProperty: TReadOnlyProperty<Vector2>;

  // Optional function for checking whether a JumpPosition is currently relevant. Used to skip a JumpPosition.
  // If not provided, the JumpPosition is always relevant.
  isRelevant?: () => boolean;

  // The accessibleObjectResponse that is added when the keyboard shortcut is used to jump to this position.
  accessibleObjectResponseStringProperty: TReadOnlyProperty<string>;
};

type JumpPositionOptions = SelfOptions;

export default class JumpPosition {

  public readonly positionProperty: TReadOnlyProperty<Vector2>;
  public readonly isRelevant: () => boolean;
  public readonly accessibleObjectResponseStringProperty: TReadOnlyProperty<string>;

  public constructor( providedOptions: JumpPositionOptions ) {

    this.positionProperty = providedOptions.positionProperty;
    this.isRelevant = providedOptions.isRelevant || ( () => true );
    this.accessibleObjectResponseStringProperty = providedOptions.accessibleObjectResponseStringProperty;
  }
}

beersLawLab.register( 'JumpPosition', JumpPosition );