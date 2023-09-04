import prisma from "@/prisma/client";

export default async function handler(req, res) {
  try {
    console.log("POST GO");
    if (req.query.detail) {
      const { detail } = req.query;

      const data = await prisma.order.findUnique({
        where: {
          id: parseInt(detail),
        },
      });
      if (!!data === false) {
        return res.status(404).json({ message: "Не найдено" });
      }

      const projectName = await prisma.project.findUnique({
        where: {
          id: data.projectId_,
        },
      });

      const contractorName = await prisma.contractor.findUnique({
        where: {
          id: data.contractorId,
        },
      });

      return res.status(200).json({
        ...data,
        contractorName: contractorName.name,
        projectName: projectName.name,
      });
    }

    const {
      searchTerm = "",
      searchProj = -1,
      searchContr = -1,
      page = 1,
      pageSize = 10,
    } = req.query;

    const parsedPage = parseInt(page, 10);
    const parsedPageSize = parseInt(pageSize, 10);
    const skip = (parsedPage - 1) * parsedPageSize;
    const parsedProj = parseInt(searchProj);
    const parsedContr = parseInt(searchContr);

    let searchParams = [
      searchTerm.length > 0 ? { id: parseInt(searchTerm, 10) } : {},
    ];

    if (!!parsedProj && parsedProj > 0) {
      searchParams = [...searchParams, { projectId_: parsedProj }];
    }

    if (!!parsedContr && parsedContr > 0) {
      searchParams = [...searchParams, { contractorId: parsedContr }];
    }

    const data = await prisma.order.findMany({
      where: {
        AND: searchParams,
      },
      skip,
      take: parsedPageSize,
      orderBy: {
        id: "desc",
      },
    });

    const totalItems = await prisma.order.count({
      where: {
        AND: searchParams,
      },
    });

    return res.status(200).json({ data, totalItems });
  } catch (err) {
    return res.status(500).json(err);
  }
}
