import prisma from "@/prisma/client";

export default async function handler(req, res) {
  try {
    const proj = JSON.parse(req.body);
    if (req.method === "POST") {
      console.log("POST CRP");

      if (!proj.name.length) {
        return res
          .status(500)
          .json({ message: "please dont leave this empty" });
      }
      try {
        const data = await prisma.project.create({
          data: {
            name: proj.name,
            comment: proj.comment,
          },
        });
        return res.status(200).json(data);
      } catch (err) {
        return res
          .status(500)
          .json({ message: "Error creating a new project" });
      }
    }
  } catch (err) {
    return res.status(500).json(err);
  }
}
