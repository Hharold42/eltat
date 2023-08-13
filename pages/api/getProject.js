import prisma from "../../prisma/client";

export default async function handler(req, res) {
  console.log("wtf2");
  try {
    const data = await prisma.project.findMany();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
}
