import prisma from "@/prisma/client";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const id = parseInt(req.query.id);
      const originalOrder = await prisma.order.findUnique({
        where: {
          id: id,
        },
      });

      const clonedOrder = await prisma.order.create({
        data: {
          name: originalOrder.name,
          contractorId: originalOrder.contractorId,
          teamIds: originalOrder.teamIds,
          paydate: originalOrder.paydate,
          shipdate: originalOrder.shipdate,
          margin: originalOrder.margin,
          nomenclature: originalOrder.nomenclature,
          comment: originalOrder.comment,
          createdAt: originalOrder.createdAt,
          projectId_: originalOrder.projectId_,
          cost: originalOrder.cost,
          completed: originalOrder.completed,
          userId: originalOrder.userId,
        },
      });

      return res.status(200).json(clonedOrder);
    } else {
      return res.status(501).json({ message: "Method not allowed" });
    }
  } catch (err) {
    return res.status(500).json({ err: err });
  }
}
