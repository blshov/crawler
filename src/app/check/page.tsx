"use client";
import { useEffect, useState } from "react";
import MainScene from "../main";
import { useRouter, useSearchParams } from "next/navigation";

const PageCheck = () => {
  const searchParams = useSearchParams();

  const search = searchParams.get("claw_game_code");
  const [status, setStatus] = useState("loading");
  const router = useRouter();
  useEffect(() => {
    const api = "";
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    fetch(`${api}/api/claw-game/check?claw_game_code=${search}`, {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    }).then((res) => {
      res.json().then((resData) => {
        console.log(resData, res.status);
        if (res.status == 200) {
          setStatus("valid");
          localStorage.setItem("token", resData.message as string);
          localStorage.setItem("claw_game_code", search as string);

          router.push("/");
        } else {
          setStatus("invalid");
          router.push("https://rapspoint.com/");
        }
      });
    });
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {status == "loading"
        ? "validating purchase..."
        : status == "valid"
        ? "redirecting"
        : "game code invalid"}
    </main>
  );
};
export default PageCheck;
