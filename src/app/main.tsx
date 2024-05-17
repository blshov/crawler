"use client";
import { useEffect, useState } from "react";
import "./style.css";
import * as Phaser from "phaser";
import Link from "next/link";

const MainScene = (props: {
  clawAssetLocation: string;
  rewardAssetsLocations: string[];
  bottomBorderAssetLocation: string;
  topBorderAssetLocation: string;
  bgAssetLocation: string;
  rewardList: string[];
  fetchCallback: (clawGameCode: string) => Promise<string>;
}) => {
  const [isGameDone, setIsGameDone] = useState(false);
  const [isNewPage, setIsNewPage] = useState(true);

  const [reward, setReward] = useState<String>("");
  const sizes = {
    width: 380,
    height: 700,
  };
  class GameScene extends Phaser.Scene {
    claw: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined;
    clawSpeed: any;
    cursor: Phaser.Input.Pointer | undefined;
    touchInput: Phaser.Input.Pointer | undefined;
    isClawDropped: any = false;
    bottomCover: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined;
    randomBalls: any[];
    ballCrawled: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined;
    isClawOccupied: any;
    timedEvent: Phaser.Time.TimerEvent | undefined;
    rewardStrings: string[];
    rope: any;
    constructor() {
      super("scene-game");
      this.claw;
      this.rope;
      this.cursor;
      this.touchInput;
      this.clawSpeed = 350;
      this.isClawDropped;
      this.randomBalls = [];
      this.ballCrawled;
      this.bottomCover;
      this.isClawOccupied = false;
      this.rewardStrings = props.rewardList;
    }
    preload() {
      this.load.image("bg", props.bgAssetLocation);
      for (var i = 0; i < props.rewardAssetsLocations.length; i++) {
        this.load.image(props.rewardList[i], props.rewardAssetsLocations[i]);
      }
      this.load.image("claw", props.clawAssetLocation);
      this.load.image("rope", "assets/rapsrope.png");
      this.load.image("topBorder", props.bottomBorderAssetLocation);
      this.load.image("bottomBorder", props.topBorderAssetLocation);
    }
    create() {
      this.add.image(0, 0, "bg").setOrigin(0, 0);

      this.bottomCover = this.physics.add
        .image(0, sizes.height - 50, "bottomBorder")
        .setOrigin(0, 0)
        .setVisible(false);
      this.bottomCover.setImmovable(true);
      this.claw = this.physics.add
        .image(sizes.width / 2, sizes.height - 560, "claw")
        .setScale(0.1)
        .setVelocityX(this.clawSpeed);
      this.rope = this.physics.add
        .image(sizes.width / 2, sizes.height - 600, "rope")
        .setOrigin(0, 0.6)
        .setScale(0.1, 0.2);
      this.cursor = this.input.activePointer;

      this.touchInput = this.input.pointer1;
      this.claw.setInteractive();
      this.claw.body.allowGravity = false;
      this.rope.body.allowGravity = false;

      for (var i = 0; i < 25; i++) {
        const border = 60;
        const tempBall = this.physics.add
          .image(
            Phaser.Math.Between(0 + border, sizes.width - border),
            sizes.height - Phaser.Math.Between(100, 250),
            this.rewardStrings[
              Phaser.Math.Between(0, this.rewardStrings.length - 1)
            ]
          )
          .setOrigin(0.5, 0.5)
          .setAngularVelocity(i % 2 == 0 ? 150 : -150)
          .setGravityY(4000)
          .setVelocityY(800)
          .setName(i.toString())
          .setCollideWorldBounds(true);
        tempBall.setScale(0.064).setCircle(tempBall.body.width / 2);
        this.randomBalls.push(tempBall);

        for (var j = 0; j < i; j++) {
          this.physics.add.collider(
            this.randomBalls[i],
            this.randomBalls[i - j - 1]
          );
        }
      }
      if (this.randomBalls != undefined) {
        for (var i = 0; i < this.randomBalls?.length; i++) {
          this.physics.add.overlap(
            this.claw,
            this.randomBalls[i],
            (o1, o2: any) => {
              this.claw?.setVelocityY(-this.clawSpeed);
              if (!this.isClawOccupied) {
                this.randomBalls[parseInt(o2.name)].body.allowGravity = false;
                this.ballCrawled = this.randomBalls[parseInt(o2.name)];
              }
              !this.isClawOccupied &&
                this.randomBalls[parseInt(o2.name)].setX(
                  this.claw?.body.center.x
                );
              !this.isClawOccupied &&
                this.randomBalls[parseInt(o2.name)].setY(
                  this.claw?.body.bottom! - 20
                );
              !this.isClawOccupied &&
                this.randomBalls[parseInt(o2.name)].setVelocityY(
                  -this.clawSpeed
                );
              !this.isClawOccupied &&
                this.randomBalls[parseInt(o2.name)].body.setSize(0);

              this.isClawOccupied = true;
            },
            undefined,
            this.create
          );
        }
        for (var i = 0; i < this.randomBalls?.length; i++) {
          this.physics.add.overlap(
            this.bottomCover,
            this.randomBalls[i],
            (o1, o2: any) => {
              this.randomBalls[parseInt(o2.name)].setVelocityY(0);
              this.randomBalls[parseInt(o2.name)].setGravityY(0);
              this.randomBalls[parseInt(o2.name)].setY(
                this.randomBalls[parseInt(o2.name)].body.y - 5
              );
            },
            undefined,
            this.create
          );

          // this.physics.add.collider(this.bottomCover, this.randomBalls[i]);
          this.timedEvent = this.time.addEvent({
            delay: 1000,
            callback: this.onEvent,
            callbackScope: this,
            loop: true,
          });
        }
      }
    }

    update() {
      this.rope.setX(this.claw?.body.x);
      this.rope.setY(this.claw?.body.y);

      if (this.claw?.body.y! < 0) {
        fetchReward().then((fetchedReward) => {
          setReward(fetchedReward);
          setIsGameDone(true);
          localStorage.removeItem("token");
          localStorage.removeItem("claw_game_code");
        });

        this.claw?.setVelocity(0, 0);

        this.ballCrawled?.setCollideWorldBounds(false);
        this.ballCrawled?.setOrigin(0.5, 0.5);
        this.ballCrawled!.setVelocity(0, 0);
        this.scene.pause();
      }
      if (this.cursor!.isDown || this.touchInput!.isDown) {
        this.dropClaw();
      }
      if (!this.isClawOccupied && this.claw?.x! >= sizes.width - 25) {
        this.claw?.setVelocityX(-this.clawSpeed);
        this.physics.world.gravity.set(12000, 6000);
      }
      if (!this.isClawOccupied && this.claw?.x! <= 25) {
        this.claw?.setVelocityX(this.clawSpeed);
        this.physics.world.gravity.set(-12000, 6000);
      }
    }
    dropClaw() {
      setIsNewPage(false);
      this.claw?.setVelocityX(0);
      this.claw?.setVelocityY(this.clawSpeed);
    }
    onEvent() {
      for (var i = 0; i < this.randomBalls?.length; i++) {
        this.randomBalls[i].setTexture(
          this.rewardStrings[
            Phaser.Math.Between(0, this.rewardStrings.length - 1)
          ]
        );
      }
    }
  }
  const fetchReward = async () => {
    const clawGameCode = localStorage.getItem("claw_game_code");
    const reward = await props.fetchCallback(clawGameCode!);
    return reward;
  };

  useEffect(() => {
    const getCanvas = () => {
      const canvas = document.getElementById("gameCanvas");
      if (canvas instanceof HTMLCanvasElement) return canvas;
      else return undefined;
    };
    const config = {
      type: Phaser.CANVAS,
      width: sizes.width,
      height: sizes.height,
      canvas: getCanvas(),
      physics: {
        default: "arcade",
        arcade: {
          gravity: {
            y: 0,
            x: 0,
          },
          // debug: true,
          fps: 60,
        },
      },
      scene: GameScene,
    };
    const game = new Phaser.Game(config);
  }, []);
  return (
    <div
      className={`flex h-full w-full font-oxanium ${
        !isGameDone ? "bg-[#140C1F] z-[-2]" : ""
      }`}
      id="main"
    >
      {isGameDone && (
        <div className="top-0 left-0 flex absolute w-full h-full animate-opacity-slow items-center justify-center overflow-hidden">
          <div className="flex animate-opacity-slow-half w-full h-full bg-slate-800 z-0 opacity-70"></div>
          <img
            className="flex flex-col w-screen aspect-square  animate-spin-slow absolute invert"
            src="surpeff.png"
            alt=""
          />
          {/* <div className="flex flex-col w-screen aspect-square bg-gradient-to-r from-transparent to-white animate-spin-slow"></div> */}
          <div className="flex flex-col gap-6 absolute items-center justify-center">
            <div className="lg:text-5xl text-2xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
              🎉 SELAMAT! 🎉
            </div>
            <div className="px-8 flex drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] flex-col animate-spin-show w-64 h-64 bg-slate-500 rounded-md items-center justify-center ">
              <div className="flex w-full h-full items-center justify-center basis-9/12 ">
                <div className="w-[100px] aspect-square justify-center items-center bg-white flex rounded-[9999px] blur-2xl"></div>
                <div className="h-[50px] overflow-hidden rotate-[17deg] absolute">
                  <img
                    height={150}
                    width={150}
                    src={"assets/ticket.png"}
                    alt=""
                  />
                </div>
              </div>
              <div className="flex w-full h-full items-center text-center justify-center basis-2/12 bg-slate-800 ">
                {reward}
              </div>
            </div>
            <div className="lg:text-4xl text-xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
              Kamu mendapat {reward}
            </div>
            <div className="flex gap-4 flex-row items-center justify-center">
              <Link
                className="flex h-16 w-32 rounded-lg text-black bg-white items-center justify-center"
                href={"https://rapspoint.com"}
              >
                Kembali
              </Link>
              {/* <button
              onClick={() => {
                window.location.reload();
              }}
              className="flex h-16 w-32 rounded-lg bg-slate-800 items-center justify-center"
            >
              Main lagi
            </button> */}
            </div>
          </div>
        </div>
      )}
      {isNewPage && (
        <div className="top-0 left-0 flex absolute w-full h-full  items-center justify-center overflow-hidden">
          <div className="flex bg-slate-500 w-full h-full opacity-20"></div>
          <div className="flex absolute text-2xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
            Tap untuk memulai
          </div>
        </div>
      )}
      <div className="flex justify-center items-center w-screen">
        <img className="h-screen " src="assets/rapsmachine.png" alt="" />
      </div>
      <canvas className="h-screen" id="gameCanvas"></canvas>
    </div>
  );
};
export default MainScene;
