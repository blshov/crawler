export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("claw_game_code");
  var status = id == "D3PPWRLV" ? 200 : 422;
  var data =
    id == "D3PPWRLV"
      ? {
          message: "Claw game ready to use",
          data: null,
        }
      : {
          message: "claw game code yang dipilih tidak valid.",
          errors: {
            claw_game_code: ["claw game code yang dipilih tidak valid."],
          },
        };

  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
