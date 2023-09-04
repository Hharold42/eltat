import prisma from "../../prisma/client";

export default async function handler(req, res) {
  try {
    console.log("GET GN");

    if (req.query.ids) {
      const { ids } = req.query;

      const parsedIds = ids.split(",").map((id) => parseInt(id));

      const data = await prisma.nomenclature.findMany({
        where: {
          id: { in: parsedIds },
        },
      });

      return res.status(200).json(data);
    }

    const { searchTerm = "", page = 1, pageSize = 10 } = req.query;

    const parsedPage = parseInt(page, 10);
    const parsedPageSize = parseInt(pageSize, 10);

    const skip = (parsedPage - 1) * parsedPageSize;

    if (searchTerm.length < 1) {
      const data = await prisma.nomenclature.findMany({
        skip,
        take: parsedPageSize,
      });

      const totalPages = await prisma.nomenclature.count();

      return res.status(200).json({ data, totalPages });
    }

    const characters = searchTerm.split(" ");

    const data = await prisma.nomenclature.findMany({
      skip,
      take: parsedPageSize,
      orderBy: { name: "asc" },
      where: {
        OR: [
          {
            AND: [
              ...characters.map((char) => ({
                name: { contains: char, mode: "insensitive" },
              })),
            ],
          },
          {
            vendor: { contains: searchTerm, mode: "insensitive" },
          },
          {
            AND: [
              ...characters.map((char) => ({
                manname: { contains: char, mode: "insensitive" },
              })),
            ],
          },
          {
            AND: [
              ...characters.map((char) => ({
                classname: { contains: char, mode: "insensitive" },
              })),
            ],
          },
        ],
      },
    });

    const totalPages = await prisma.nomenclature.count({
      where: {
        OR: [
          {
            AND: [
              ...characters.map((char) => ({
                name: { contains: char, mode: "insensitive" },
              })),
            ],
          },
          {
            vendor: { contains: searchTerm, mode: "insensitive" },
          },
          {
            AND: [
              ...characters.map((char) => ({
                manname: { contains: char, mode: "insensitive" },
              })),
            ],
          },
          {
            AND: [
              ...characters.map((char) => ({
                classname: { contains: char, mode: "insensitive" },
              })),
            ],
          },
        ],
      },
    });

    return res.status(200).json({ data, totalPages });
  } catch (err) {
    return res.status(500).json(err);
  }
}
