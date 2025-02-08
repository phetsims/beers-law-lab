// Copyright 2023-2025, University of Colorado Boulder

/**
 * Colors that are used throughout this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty.js';
import beersLawLab from '../beersLawLab.js';

const BLLColors = {

  screenBackgroundColorProperty: new ProfileColorProperty( beersLawLab, 'screenBackgroundColor', {
    default: 'white'
  } ),

  panelFillProperty: new ProfileColorProperty( beersLawLab, 'panelFill', {
    default: '#F0F0F0'
  } )
};

beersLawLab.register( 'BLLColors', BLLColors );
export default BLLColors;