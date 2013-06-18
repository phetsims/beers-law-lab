// Copyright 2002-2013, University of Colorado

/**
 * Button with an arrow that points left or right.
 *
 * @author Chris Malley (PixelZoom, Inc)
 */
define( function( require ) {

  // imports
  var Button = require( 'SUN/Button' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var ENABLED_COLOR = 'black';
  var DISABLED_COLOR = 'rgb(175,175,175)';

  /**
   * @param {ArrowButton.Direction} direction
   * @param callback
   * @param options
   * @constructor
   */
  function ArrowButton( direction, callback, options ) {

    var DEFAULT_ARROW_WIDTH = 20;
    options = _.extend( {
        arrowHeight: DEFAULT_ARROW_WIDTH,
        arrowWidth: DEFAULT_ARROW_WIDTH * Math.sqrt( 3 ) / 2,
        cornerRadius: 4,
        xMargin: 7
      },
      options );

    var shape = ( direction === ArrowButton.Direction.LEFT ) ?
                new Shape().moveTo( 0, 0 ).lineTo( options.arrowWidth, options.arrowHeight / 2 ).lineTo( 0, options.arrowHeight ).close() :
                new Shape().moveTo( 0, options.arrowHeight / 2 ).lineTo( options.arrowWidth, 0 ).lineTo( options.arrowWidth, options.arrowHeight ).close();
    var path = new Path( { fill: ENABLED_COLOR, shape: shape } );
    Button.call( this, path, callback, options );

    this.setEnabled = function( enabled ) {
      path.fill = enabled ? ENABLED_COLOR : DISABLED_COLOR;
      //TODO change Button stroke
    }
  }

  inherit( Button, ArrowButton );

  ArrowButton.Direction = {
    'LEFT': 0,
    'RIGHT': 1
  };

  return ArrowButton;
} );