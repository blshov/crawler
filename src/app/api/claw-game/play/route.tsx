export async function POST(request: Request) {
  const data = {
    message: "Claw game successfully played",
    data: {
      id: 2,
      code: "D3PPWRLV",
      transaction: {
        reff_id: "MLT-1715783167",
      },
      voucher: {
        name: "Reward Capit MLT-1715783167",
        code: "RKD1EOXE",
        discount_amount: 1000,
        min_purchase: 30000,
        start_date: "2024-05-15",
        end_date: "2024-08-15",
        start_time: "00:00:00",
        end_time: "23:59:59",
        valid_days: [
          "Minggu",
          "Senin",
          "Selasa",
          "Rabu",
          "Kamis",
          "Jumat",
          "Sabtu",
        ],
        service: {
          name: "Top Up Mobile Legends",
        },
      },
      created_at: "15 May 2024",
    },
  };

  return Response.json(data);
}
