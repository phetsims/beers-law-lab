// Copyright 2002-2013, University of Colorado

/**
 * Faucet, with a movable handle to control the flow rate.
 * Releasing the handle sets the flow rate to zero.
 * When the faucet is disabled, the flow rate is set to zero and the handle is disabled.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define(
  [
    "SCENERY/nodes/Node",
    "SCENERY/nodes/Image",
    "PHETCOMMON/util/Inheritance",
    "image!images/faucet_handle.png",
    "image!images/faucet_pipe.png",
    "image!images/faucet_pivot.png",
    "image!images/faucet_spout.png"
  ],
  function ( Node, Image, Inheritance, handleImage, pipeImage, pivotImage, spoutImage ) {

    function FaucetNode( faucet, mvt ) {

      Node.call( this ); // constructor stealing

      // child nodes
      var handleNode = new Image( handleImage );
      var pipeNode = new Image( pipeImage );
      var pivotNode = new Image( pivotImage );
      var spoutNode = new Image( spoutImage );

      // rendering order
      this.addChild( pipeNode );
      this.addChild( handleNode );
      this.addChild( pivotNode );
      this.addChild( spoutNode );

      // layout
    }

    Inheritance.inheritPrototype( FaucetNode, Node ); // prototype chaining

    return FaucetNode;
  }
);
