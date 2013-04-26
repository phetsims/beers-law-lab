// Copyright 2002-2013, University of Colorado

/**
 * A particle that comes out of the shaker.
 * The particle falls towards the surface of the solution, may bounce off the wall
 * of the beaker, and disappears when it hits the surface of the solution (or bottom of the beaker,
 * if the beaker is empty.)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var SoluteParticle = require( "concentration/model/SoluteParticle" );
  var Vector2 = require( "DOT/Vector2" );

  /**
   * Constructor
   * @param {Solute} solute
   * @param {Vector2} location in the beaker's coordinate frame
   * @param {Number} orientation in radians
   * @param {Vector2} initialVelocity
   * @param {Vector2} acceleration
   * @constructor
   */
  function ShakerParticle( solute, location, orientation, initialVelocity, acceleration ) {

    SoluteParticle.call( this, solute.particleColor, solute.particleSize, location, orientation );

    this.solute = solute;
    this.velocity = initialVelocity;
    this.acceleration = acceleration;
  }

  inherit( ShakerParticle, SoluteParticle );

  /**
   *  Propagates the particle to a new location.
   *  @param {Number} deltaSeconds
   *  @param {Beaker} beaker
   */
  ShakerParticle.prototype.step = function ( deltaSeconds, beaker ) {

    this.velocity = this.velocity.plus( this.acceleration.times( deltaSeconds ) );
    var newLocation = this.location.get().plus( this.velocity.times( deltaSeconds ) );

    /*
     * Did the particle hit the left wall of the beaker? If so, change direction.
     * Note that this is a very simplified model, and only deals with the left wall of the beaker,
     * which is the only wall that the particles can hit in practice.
     */
    var minX = beaker.getLeft() + this.solute.particleSize;
    if ( newLocation.x <= minX ) {
      newLocation = new Vector2( minX, newLocation.y );
      this.velocity = new Vector2( Math.abs( this.velocity.x ), this.velocity.y );
    }

    this.location.set( newLocation );
  };

  return ShakerParticle;
} );
