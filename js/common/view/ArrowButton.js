// Copyright 2002-2013, University of Colorado

/**
 * Button with an arrow that points left or right.
 *
 * @author Chris Malley (PixelZoom, Inc)
 */
define( function( require ) {
  'use strict';

  // imports
  var Button = require( 'SUN/Button' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {ArrowButton.Direction} direction
   * @param callback
   * @param options
   * @constructor
   */
  function ArrowButton( direction, callback, options ) {

    var thisButton = this;

    var DEFAULT_ARROW_WIDTH = 20;
    options = _.extend( {
        arrowHeight: DEFAULT_ARROW_WIDTH,
        arrowWidth: DEFAULT_ARROW_WIDTH * Math.sqrt( 3 ) / 2,
        cornerRadius: 4,
        xMargin: 7,
        enabledFill: 'black',
        disabledFill: 'rgb(175,175,175)'
      },
      options );

    var shape = ( direction === ArrowButton.Direction.LEFT ) ?
                new Shape().moveTo( 0, 0 ).lineTo( options.arrowWidth, options.arrowHeight / 2 ).lineTo( 0, options.arrowHeight ).close() :
                new Shape().moveTo( 0, options.arrowHeight / 2 ).lineTo( options.arrowWidth, 0 ).lineTo( options.arrowWidth, options.arrowHeight ).close();
    var path = new Path( { fill: options.enabledFill, shape: shape } );
    Button.call( this, path, callback, options );

    thisButton.setEnabled = function( enabled ) {
      path.fill = enabled ? options.enabledFill : options.disabledFill;
      thisButton.pickable = enabled; //TODO workaround for lack of Button.enabled
    };
    thisButton.setEnabled( true );
  }

  inherit( Button, ArrowButton );

  // direction that the arrow points
  ArrowButton.Direction = {
    'LEFT': 0,
    'RIGHT': 1
  };

  return ArrowButton;
} );