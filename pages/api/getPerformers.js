import prisma from "../../prisma/client";

export default async function handler(req, res) {
  try {
    const data = await prisma.performer.findMany();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
}
