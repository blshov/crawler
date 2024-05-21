"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
const Checker = () => {
  const searchParams = useSearchParams();

  const cgc = searchParams.get("claw_game_code");
  const [status, setStatus] = useState("loading");
  const router = useRouter();
  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API;
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    fetch(`${api}/api/claw-game/check?claw_game_code=${cgc}`, {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    }).then((res) => {
      res.json().then((resData) => {
        console.log(resData, res.status);
        if (res.status == 200) {
          setStatus("valid");
          localStorage.setItem("token", resData.message as string);
          localStorage.setItem("claw_game_code", cgc as string);

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
const PageCheck = () => {
  return (
    <Suspense>
      <Checker />
    </Suspense>
  );
};
export default PageCheck;
