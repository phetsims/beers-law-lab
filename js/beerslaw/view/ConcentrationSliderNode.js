// Copyright 2013, University of Colorado

/**
 * Slider for changing a solution's concentration.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function ( require ) {
  "use strict";

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );

  /**
   * @param {Property} solution of type BeersLawSolution
   * @constructor
   */
  function ConcentrationSliderNode( solution ) {

    var thisNode = this;
    Node.call( thisNode );

    // TODO placeholder
    thisNode.addChild( new Rectangle( 0, 0, 250, 10, { stroke: 'black' } ) );
  }

  inherit( ConcentrationSliderNode, Node );

  return ConcentrationSliderNode;
} );