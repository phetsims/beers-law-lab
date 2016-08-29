// Copyright 2013-2015, University of Colorado Boulder

/**
 * A particle that comes out of the shaker.
 * The particle falls towards the surface of the solution, may bounce off the wall
 * of the beaker, and disappears when it hits the surface of the solution (or bottom of the beaker,
 * if the beaker is empty.)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SoluteParticle = require( 'BEERS_LAW_LAB/concentration/model/SoluteParticle' );

  // phet-io modules
  var TShakerParticle = require( 'ifphetio!PHET_IO/simulations/beers-law-lab/TShakerParticle' );

  /**
   * @param {Solute} solute
   * @param {Vector2} location in the beaker's coordinate frame
   * @param {number} orientation in radians
   * @param {Vector2} initialVelocity
   * @param {Vector2} acceleration
   * @param {Tandem} tandem
   * @constructor
   */
  function ShakerParticle( solute, location, orientation, initialVelocity, acceleration, tandem ) {

    SoluteParticle.call( this, solute.particleColor, solute.particleSize, location, orientation );

    // @public (read-only, phet-io)
    this.solute = solute;
    this.velocity = initialVelocity;
    this.acceleration = acceleration;

    tandem.addInstance( this, TShakerParticle );

    // @private
    this.disposeShakerParticle = function() {
      tandem.removeInstance( this );
    };
  }

  beersLawLab.register( 'ShakerParticle', ShakerParticle );

  return inherit( SoluteParticle, ShakerParticle, {

    // @public
    dispose: function() {
      this.disposeShakerParticle();
    },

    /**
     *  Propagates the particle to a new location.
     *  @param {number} deltaSeconds
     *  @param {Beaker} beaker
     *  @public
     */
    step: function( deltaSeconds, beaker ) {
      // mutable calls added to remove the number of new objects we create
      this.velocity = this.acceleration.times( deltaSeconds ).add( this.velocity );
      var newLocation = this.velocity.times( deltaSeconds ).add( this.locationProperty.get() );

      /*
       * Did the particle hit the left wall of the beaker? If so, change direction.
       * Note that this is a very simplified model, and only deals with the left wall of the beaker,
       * which is the only wall that the particles can hit in practice.
       */
      var minX = beaker.getLeft() + this.solute.particleSize;
      if ( newLocation.x <= minX ) {
        newLocation.setX( minX );
        this.velocity.setX( Math.abs( this.velocity.x ) );
      }

      this.locationProperty.set( newLocation );
    }
  } );
} );
