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
    'easel',
    "PHETCOMMON/model/Inheritance",
    "PHETCOMMON/model/property/Property",
    'image!images/faucet_handle.png',
    'image!images/faucet_pipe.png',
    'image!images/faucet_pivot.png',
    'image!images/faucet_spout.png'
  ],
  function ( Easel, Inheritance, Property, handleImage, pipeImage, pivotImage, spoutImage ) {

    function FaucetNode( faucet, mvt ) {

      Easel.Container.call( this ); // constructor stealing

      // child nodes
      var handleNode = new Easel.Bitmap( handleImage );
      var pipeNode = new Easel.Bitmap( pipeImage );
      var pivotNode = new Easel.Bitmap( pivotImage );
      var spoutNode = new Easel.Bitmap( spoutImage );

      // rendering order
      this.addChild( pipeNode );
      this.addChild( handleNode );
      this.addChild( pivotNode );
      this.addChild( spoutNode );

      // layout
    }

    Inheritance.inheritPrototype( FaucetNode, Easel.Container ); // prototype chaining

    return FaucetNode;
  }
);
