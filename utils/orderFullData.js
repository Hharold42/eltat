import axios from "axios";

const getOrderFullData = async (id) => {
  const data = (await axios.get(`/api/getOrders?detail=${id}`)).data;

  const nomenIds = data.nomenclature;

  const nomenAoO = (await axios.get(`/api/getNomenclature?ids=${nomenIds}`))
    .data;

  const parsedNomen = nomenAoO?.map((item) => {
    let count = 0;
    nomenIds.map((id) => {
      if (id === item.id) {
        count++;
      }
    });

    return { ...item, count: count };
  });

  const contractor = (
    await axios.get(`/api/getContractor?id=${data.contractorId}`)
  ).data;

  const project = (await axios.get(`/api/getProject?id=${data.projectId_}`))
    .data;

  const contractorName = contractor.name;
  const projectName = project.name;

  return { data, parsedNomen, contractorName, projectName };
};

export default getOrderFullData;
