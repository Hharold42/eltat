export default function checkForm(formDataObj) {
  console.log(Object.values(formDataObj));
  const values = Object.values(formDataObj);

  if (values.includes(null)) {
    return { code: -1, message: "Не все поля заполнены" };
  }
  return { code: 1, message: "ok" };
}
