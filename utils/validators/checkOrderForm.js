export default function checkForm(formDataObj) {
  const res = { code: 1, message: "ok" };

  const keys = Object.keys(formDataObj);

  keys.forEach((item) => {
    if (item !== "comment") {
      if (formDataObj[item] === null) {
        res.code = -1;
        res.message = "Не все поля заполнены";
      }
    }
  });

  return res;
}
