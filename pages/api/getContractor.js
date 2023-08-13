import prisma from "../../prisma/client";

export default async function handler(req, res) {
  console.log("wtf");
  try {
    const data = await prisma.contractor.findMany();
    console.log(data);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
}
