// Copyright 2013, University of Colorado

//TODO implement, this is a placeholder
define( function( require ) {

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );

  /**
   * @param {Dimension2} trackSize
   * @param {Property} wavelength of type Number
   * @constructor
   */
  function WavelengthSliderNode( trackSize, wavelength ) {

    var thisNode = this;
    Rectangle.call( this, 0, 0, 200, 10, { fill: "white", stroke: "black" } );
  }

  inherit( WavelengthSliderNode, Rectangle );

  return WavelengthSliderNode;
});
