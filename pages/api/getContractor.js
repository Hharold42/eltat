import prisma from "../../prisma/client";

export default async function handler(req, res) {
  try {
    if (req.query.id) {
      console.log("GET GC");

      const { id } = req.query;

      const data = await prisma.contractor.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      return res.status(200).json(data);
    }

    const data = await prisma.contractor.findMany();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
}
