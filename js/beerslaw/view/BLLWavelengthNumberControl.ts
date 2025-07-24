// Copyright 2025, University of Colorado Boulder

/**
 * BLLWavelengthNumberControl controls the variable wavelength for the light source.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import WavelengthNumberControl from '../../../../scenery-phet/js/WavelengthNumberControl.js';
import beersLawLab from '../../beersLawLab.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import LightMode from '../model/LightMode.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import BLLConstants from '../../common/BLLConstants.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';

const SLIDER_TRACK_SIZE = new Dimension2( 150, 30 );

export default class BLLWavelengthNumberControl extends WavelengthNumberControl {

  public constructor( wavelengthProperty: Property<number>, lightModeProperty: EnumerationProperty<LightMode>, tandem: Tandem ) {

    super( wavelengthProperty, {
      titleNodeOptions: {
        tandem: Tandem.OPT_OUT // because our title is not part of WavelengthNumberControl
      },
      visibleProperty: new DerivedProperty( [ lightModeProperty ], mode => ( mode === LightMode.VARIABLE ), {
        tandem: tandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO
      } ),
      spectrumSliderTrackOptions: {
        size: SLIDER_TRACK_SIZE
      },
      spectrumSliderThumbOptions: {
        width: 35,
        height: 45,
        cursorHeight: SLIDER_TRACK_SIZE.height
      },
      sliderOptions: {
        pdomCreateAriaValueText: value => StringUtils.format( BeersLawLabStrings.pattern[ '0value' ][ '1unitsStringProperty' ].value,
          toFixed( value, BLLConstants.DECIMAL_PLACES_WAVELENGTH ), BeersLawLabStrings.a11y.unitsDescription.nanometersStringProperty.value ),

        // Dynamic dependencies used in pdomCreateAriaValueText.
        pdomDependencies: [
          BeersLawLabStrings.pattern[ '0value' ][ '1unitsStringProperty' ],
          BeersLawLabStrings.a11y.unitsDescription.nanometersStringProperty
        ]
      },
      arrowButtonOptions: {
        scale: 1,
        touchAreaXDilation: 5,
        touchAreaYDilation: 10
      },
      layoutFunction: ( titleNode, numberDisplay, slider, decrementButton, incrementButton ) => {
        assert && assert( decrementButton && incrementButton );
        return new HBox( {
          align: 'top',
          spacing: -10,
          resize: false, // prevent slider from causing a resize when thumb is at min or max
          children: [ decrementButton!, slider, incrementButton! ]
        } );
      },
      accessibleName: BeersLawLabStrings.wavelengthStringProperty,
      tandem: tandem
    } );
  }
}

beersLawLab.register( 'BLLWavelengthNumberControl', BLLWavelengthNumberControl );