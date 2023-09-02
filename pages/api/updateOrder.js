import prisma from "@/prisma/client";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      if (req.query.mode === "om") {
        try {
          console.log(req.body);
          const { margin, id, prevMargin } = req.body;

          const data = await prisma.order.update({
            where: {
              id: id,
            },
            data: {
              margin: prevMargin + margin,
            },
          });
          return res.status(200).json(data);
        } catch (err) {
          return res
            .status(500)
            .json({ message: "Error updation a orders margin" });
        }
      } else {
        try {
          const order = JSON.parse(req.body);

          const data = await prisma.order.update({
            where: {
              id: parseInt(order.id, 10),
            },
            data: {
              name: order.name,
              contractorId: parseInt(order.contractorId, 10),
              teamIds: order.teamIds.map((id) => parseInt(id)),
              paydate: new Date(order.paydate),
              shipdate: new Date(order.shipdate),
              margin: parseInt(order.margin),
              nomenclature: order.nomenclature.map((item) => parseInt(item)),
              comment: order?.comment,
              createdAt: new Date(),
              projectId_: parseInt(order.projectId),
              cost: parseFloat(order.cost),
            },
          });
          return res.status(200).json(data);
        } catch (err) {
          return res.status(500).json({ message: "Error updation a order" });
        }
      }
    }
  } catch (err) {
    return res.status(500).json(err);
  }
}
