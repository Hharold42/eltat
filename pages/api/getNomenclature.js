import prisma from "../../prisma/client";

export default async function handler(req, res) {
  try {
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

    const { searchTerm, page = 1, pageSize = 10 } = req.query;

    const parsedPage = parseInt(page, 10);
    const parsedPageSize = parseInt(pageSize, 10);

    const skip = (parsedPage - 1) * parsedPageSize;

    const data = await prisma.nomenclature.findMany({
      skip,
      take: parsedPageSize,
      where: {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { vendor: { contains: searchTerm, mode: "insensitive" } },
          { manname: { contains: searchTerm, mode: "insensitive" } },
          { classname: { contains: searchTerm, mode: "insensitive" } },
          { fullname: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
}
