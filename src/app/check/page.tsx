"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
const MainScene = dynamic(() => import("@/app/main"), { ssr: false });
const Checker = () => {
  const api = process.env.NEXT_PUBLIC_API;
  const searchParams = useSearchParams();
  const cgc = searchParams.get("claw_game_code");
  const [status, setStatus] = useState("loading");
  const router = useRouter();
  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    fetch(`${api}/api/claw-game/check?claw_game_code=${cgc}`, {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    }).then((res) => {
      res.json().then((resData) => {
        console.log(resData, res.status);
        if (
          res.status == 200 &&
          resData.message != "Claw game has already used"
        ) {
          setStatus("valid");
          localStorage.setItem("token", resData.message as string);
          localStorage.setItem("claw_game_code", cgc as string);
        } else if (
          res.status == 200 &&
          resData.message == "Claw game has already used"
        ) {
          setStatus("played");
        } else {
          setStatus("invalid");
        }
      });
    });
  });
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center">
      {status == "loading" ? (
        "validating purchase..."
      ) : status == "valid" && cgc ? (
        <MainScene
          clawCode={cgc}
          isGamePlayed={false}
          clawAssetLocation={"assets/rapsclaw-min.webp"}
          rewardAssetsLocations={[
            "assets/rapsball1-min.webp",
            "assets/rapsball2-min.webp",
            "assets/rapsball3-min.webp",
            "assets/rapsball4-min.webp",
            "assets/rapsball5-min.webp",
            "assets/rapsball6-min.webp",
          ]}
          bottomBorderAssetLocation={"assets/logo-min.webp"}
          topBorderAssetLocation={"assets/logo-min.webp"}
          bgAssetLocation={"assets/bg-min.webp"}
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
            return data;
          }}
        ></MainScene>
      ) : status == "played" && cgc ? (
        <MainScene
          clawCode={cgc}
          isGamePlayed={true}
          clawAssetLocation={"assets/rapsclaw-min.webp"}
          rewardAssetsLocations={[
            "assets/rapsball1-min.webp",
            "assets/rapsball2-min.webp",
            "assets/rapsball3-min.webp",
            "assets/rapsball4-min.webp",
            "assets/rapsball5-min.webp",
            "assets/rapsball6-min.webp",
          ]}
          bottomBorderAssetLocation={"assets/logo-min.webp"}
          topBorderAssetLocation={"assets/logo-min.webp"}
          bgAssetLocation={"assets/bg-min.webp"}
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
            return data;
          }}
        ></MainScene>
      ) : (
        <div className="flex flex-col">
          {"game code invalid"}
          <button onClick={() => router.push("https://rapspoint.com/")}>
            kembali
          </button>
        </div>
      )}
    </main>
  );
};
const PageCheck = () => {
  return (
    <Suspense>
      <Checker />
    </Suspense>
  );
};
export default PageCheck;
