import prisma from "../../prisma/client";

export default async function handler(req, res) {
  try {
    if (req.query.ids) {
      const { ids } = req.query;

      const parsedIds = ids.split(",").map((item) => parseInt(item));
      const data = await prisma.performer.findMany({
        where: {
          id: { in: parsedIds },
        },
      });

      return res.status(200).json(data);
    }
    const data = await prisma.performer.findMany();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
}
