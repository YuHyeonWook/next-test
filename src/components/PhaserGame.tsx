import React, {useEffect, useRef} from "react";
import Phaser from "phaser";

class Breakout extends Phaser.Scene {
  constructor() {
    super({key: "breakout"});
    this.bricks;
    this.paddle;
    this.ball;
  }

  /**
   * @description // 필요한 assets을 로드한다.
   */
  preload() {
    this.load.atlas("assets", "/assets/games/breakout.png", "/assets/games/breakout.json");
  }
  create() {
    this.physics.world.setBoundsCollision(true, true, true, false);

    this.bricks = this.physics.add.staticGroup({
      key: "assets",
      frame: ["blue1", "red1", "green1", "yellow1", "silver1", "purple1"],
      frameQuantity: 10,
      gridAlign: {width: 10, height: 6, cellWidth: 64, cellHeight: 32, x: 112, y: 100},
    });

    this.ball = this.physics.add
      .image(400, 500, "assets", "ball1")
      .setCollideWorldBounds(true)
      .setBounce(1);
    this.ball.setData("onPaddle", true);

    this.paddle = this.physics.add.image(400, 550, "assets", "paddle1").setImmovable();

    this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);
    this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);

    this.input.on(
      "pointermove",
      function (pointer) {
        this.paddle.x = Phaser.Math.Clamp(pointer.x, 52, 748);

        if (this.ball.getData("onPaddle")) {
          this.ball.x = this.paddle.x;
        }
      },
      this,
    );

    this.input.on(
      "pointerup",
      function (pointer) {
        if (this.ball.getData("onPaddle")) {
          this.ball.setVelocity(-75, -300);
          this.ball.setData("onPaddle", false);
        }
      },
      this,
    );
  }

  hitBrick(ball, brick) {
    brick.disableBody(true, true);

    if (this.bricks.countActive() === 0) {
      this.resetLevel();
    }
  }

  resetBall() {
    this.ball.setVelocity(0);
    this.ball.setPosition(this.paddle.x, 500);
    this.ball.setData("onPaddle", true);
  }

  resetLevel() {
    this.resetBall();

    this.bricks.children.each((brick) => {
      brick.enableBody(false, 0, 0, true, true);
    });
  }

  hitPaddle(ball, paddle) {
    let diff = 0;

    if (ball.x < paddle.x) {
      diff = paddle.x - ball.x;
      ball.setVelocityX(-10 * diff);
    } else if (ball.x > paddle.x) {
      diff = ball.x - paddle.x;
      ball.setVelocityX(10 * diff);
    } else {
      ball.setVelocityX(2 + Math.random() * 8);
    }
  }

  update() {
    if (this.ball.y > 600) {
      this.resetBall();
    }
  }
}

const BreakoutGame = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: gameRef.current,
        scene: [Breakout],
        physics: {
          default: "arcade",
        },
      };

      const game = new Phaser.Game(config);

      return () => {
        game.destroy(true);
      };
    }
  }, []);

  return <div ref={gameRef} />;
};

export default BreakoutGame;
