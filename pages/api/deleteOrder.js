import prisma from "@/prisma/client";

export default async function handler(req, res) {
  try {
    if (req.method === "DELETE") {
      console.log("DELETE DO");

      const id = parseInt(req.query.id);
      const data = await prisma.order.delete({
        where: {
          id: id,
        },
      });

      return res.status(200).json(data);
    } else {
      return res.status(501).json({ message: "Method not allowed" });
    }
  } catch (err) {
    return res.status(500).json({ err: err });
  }
}
