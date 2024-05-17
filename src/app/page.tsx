"use client";
import { useRouter, useSearchParams } from "next/navigation";
import MainScene from "./main";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isValid, setValid] = useState(false);
  const api = "";
  // Rule :
  //
  // clawAssetLocation = location where claw asset is located inside public folder (acceptable size is width = 64px & height = 64px)
  // rewardAssetsLocation = location where reward assets is located inside public folder (acceptable size is width = 64px & height = 64px)
  // bottomBorderAssetLocation = location where bottomBorder asset is located inside public folder (acceptable size is width = 64px & height = 64px)
  // topBorderAssetLocation = location where topBorder asset is located inside public folder (acceptable size is width = 400px & height = 100px)
  // bgAssetLocation = location where background asset is located inside public folder (acceptable size is width = 400px & height = 700px)
  // rewardList = unique name of each reward listed in rewardAssetsLocations in the same order (both variables' length should be the same)
  // fetchCallback = this async function meant to be used to fetch credentials needed for the game to run
  // randomizedRewardCallback = this function meant to be used to do something after the reward code is generated after the game is done
  const validateToken = async (token: string) => {
    return token == "Claw game ready to use";
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token)
      validateToken(token).then((tokenIsValid) => {
        console.log(tokenIsValid);
        if (!tokenIsValid) {
          router.push("https://rapspoint.com/");
          localStorage.removeItem("token");
          const clawGameCode = localStorage.getItem("claw_game_code");
          clawGameCode && localStorage.removeItem("claw_game_code");
        }
        setValid(tokenIsValid);
      });
    else {
      router.push("https://rapspoint.com/");
    }
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {isValid && (
        <MainScene
          clawAssetLocation={"assets/rapsclaw.png"}
          rewardAssetsLocations={[
            "assets/rapsball1.png",
            "assets/rapsball2.png",
            "assets/rapsball3.png",
            "assets/rapsball4.png",
            "assets/rapsball5.png",
            "assets/rapsball6.png",
          ]}
          bottomBorderAssetLocation={"assets/logo.png"}
          topBorderAssetLocation={"assets/logo.png"}
          bgAssetLocation={"assets/bg.png"}
          rewardList={["star1", "star2", "star3", "star4", "star5", "star6"]}
          fetchCallback={async function (clawGameCode: string): Promise<any> {
            var myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");

            var formdata = new FormData();
            formdata.append("claw_game_code", clawGameCode);
            const res = await fetch(`${api}/api/claw-game/play`, {
              method: "POST",
              headers: myHeaders,
              body: formdata,
              redirect: "follow",
            }).catch((error) => {
              console.log("error", error);
              throw new Error(error);
            });
            const data = await res.json();
            return data.data.voucher.name;
          }}
        ></MainScene>
      )}
    </main>
  );
}
