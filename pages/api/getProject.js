import prisma from "../../prisma/client";

export default async function handler(req, res) {
  try {
    if (req.query.id) {
      const { id } = req.query;

      const data = await prisma.project.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      return res.status(200).json(data);
    }

    const data = await prisma.project.findMany();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
}
