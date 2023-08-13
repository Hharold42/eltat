import prisma from "../../prisma/client";

export default async function handler(req, res) {
  try {
    const data = await prisma.nomenclature.findMany({ take: 10 });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
}
