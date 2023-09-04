import prisma from "@/prisma/client";

export default async function handler(req, res) {
  if (req.method === "GET") {
    console.log("GET PERF");

    try {
      const performers = await prisma.performer.findMany();
      res.status(200).json(performers);
    } catch (e) {
      res
        .status(500)
        .json({ error: "An error occured while fetching performers" });
    }
  } else if (req.method === "POST") {
    console.log("POST PERF");

    const { name, last_name, role } = req.body;
    try {
      const newPerformer = await prisma.performer.create({
        data: {
          lname: last_name,
          role,
          name,
        },
      });
      return res.status(201).json(newPerformer);
    } catch (e) {
      res
        .status(500)
        .json({ error: "An error occured while creating a performer" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
