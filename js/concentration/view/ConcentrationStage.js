// Copyright 2013, University of Colorado

//TODO delete this after porting to Scenery
/**
 * Stage for the "Concentration" module, sets up the scenegraph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define(
  [
    "easel",
    "PHETCOMMON/view/ModelViewTransform2D",
    "PHETCOMMON/math/Point2D",
    "PHETCOMMON/model/Inheritance",
    "EASEL-PHET/nodes/FrameRateNode",
    "concentration/view/BeakerNode",
    "concentration/view/ShakerNode",
    "concentration/view/FaucetNode",
    "concentration/view/FaucetFluidNode",
    "i18n!../../../nls/beers-law-lab-strings"
  ],
  function ( Easel, ModelViewTransform2D, Point2D, Inheritance, FrameRateNode, BeakerNode, ShakerNode, FaucetNode, FaucetFluidNode, Strings ) {

    function ConcentrationStage( canvas, model ) {

      Easel.Stage.call( this, canvas ); // constructor stealing

      this.enableMouseOver();

      // model-view transform (unity)
      var mvt = new ModelViewTransform2D( 1, new Point2D( 0, 0 ) );

      // background that fills the stage
      var background = new Easel.Shape();

      // frame rate display, upper left
      var frameRateNode = new FrameRateNode( 'black' );
      frameRateNode.x = 20;
      frameRateNode.y = 20;

      var beakerNode = new BeakerNode( model.beaker, mvt );
      var shakerNode = new ShakerNode( model.shaker, mvt );

      // faucets
      var SOLVENT_FLUID_HEIGHT = model.beaker.location.y - model.solventFaucet.location.y;
      var DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
      var solventFaucetNode = new FaucetNode( model.solventFaucet, mvt );
      var drainFaucetNode = new FaucetNode( model.drainFaucet, mvt );
      var solventFluidNode = new FaucetFluidNode( model.solventFaucet, model.solution.solvent, SOLVENT_FLUID_HEIGHT, mvt );
      var drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution, DRAIN_FLUID_HEIGHT, mvt );

      // stuff that doesn't scale
      this.addChild( background );
      this.addChild( frameRateNode );

      // rendering order
      var rootContainer = new Easel.Container();
      this.addChild( rootContainer );
      rootContainer.addChild( solventFluidNode );
      rootContainer.addChild( solventFaucetNode );
      rootContainer.addChild( drainFluidNode );
      rootContainer.addChild( drainFaucetNode );
      rootContainer.addChild( beakerNode );
      rootContainer.addChild( shakerNode );

      // resize handler
      var that = this;
      var handleResize = function () {

        // get the window width
        var width = $( window ).width();
        var height = $( window ).height();

        // make the canvas fill the window
        canvas.width = width;
        canvas.height = height;

        // expand the background to fill the canvas
        background.graphics
          .beginFill( 'white' )
          .rect( 0, 0, canvas.width, canvas.height );

        // force rendering update
        that.tick();
      };
      $( window ).resize( handleResize );
      handleResize(); // initial size
    }

    Inheritance.inheritPrototype( ConcentrationStage, Easel.Stage );

    // Resets all view-specific properties
    ConcentrationStage.prototype.reset = function () {
      //TODO
    };

    return ConcentrationStage;
  } );
