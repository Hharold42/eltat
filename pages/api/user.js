import prisma from "@/prisma/client";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (e) {
      res.status(500).json({ error: "An error occured while fetching users" });
    }
  } else if (req.method === "POST") {
    const { name, role, email, password, last_name } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = await prisma.user.create({
        data: {
          name,
          lname: last_name,
          role,
          email,
          password: hashedPassword,
        },
      });
      res.status(201).json(newUser);
    } catch (error) {
      res
        .status(500)
        .json({ errror: "An error occurred while creating a user" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
