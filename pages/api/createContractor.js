import prisma from "@/prisma/client";

export default async function handler(req, res) {
  try {
    const contr = JSON.parse(req.body);
    if (req.method === "POST") {
      try {
        const data = await prisma.contractor.create({
          data: {
            name: contr.name,
            comment: contr.comment,
          },
        });
        res.status(200).json(data);
      } catch (err) {
        return res
          .status(500)
          .json({ message: "Error creating a new contractor" });
      }
    }
  } catch (err) {
    return res.status(500).json(err);
  }
}
