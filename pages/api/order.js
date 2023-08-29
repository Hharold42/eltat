import prisma from "@/prisma/client";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      const { id } = req.body;
      const data = await prisma.order.update({
        where: {
          id: parseInt(id, 10),
        },
        data: {
          completed: true,
        },
      });
      return res.status(200).json(data);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Error updation a order" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
