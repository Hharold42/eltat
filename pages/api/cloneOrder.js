import prisma from "@/prisma/client";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      console.log("POST CLO");
      const id = parseInt(req.query.id);
      console.log(id);
      const originalOrder = await prisma.order.findUnique({
        where: {
          id: id,
        },
      });

      let copyComm = "";

      if (originalOrder.comment[0] === "[") {
        const arr = originalOrder.comment.split(`~`);
        const name = arr[0];
        const number = Number(arr[1]);
        copyComm = `${name}~${number + 1}`;
      } else {
        copyComm = `[Копия заказа ${originalOrder.id}]~1`;
      }

      const clonedOrder = await prisma.order.create({
        data: {
          name: originalOrder.name,
          contractorId: originalOrder.contractorId,
          teamIds: originalOrder.teamIds,
          paydate: originalOrder.paydate,
          shipdate: originalOrder.shipdate,
          margin: originalOrder.margin,
          nomenclature: originalOrder.nomenclature,
          comment: copyComm,
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
