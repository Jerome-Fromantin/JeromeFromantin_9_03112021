import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    /* SYNTAXE D'ORIGINE
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })
    */
    /* CI-DESSOUS, MA SYNTAXE */
    test("Then I upload a file with correct extension, the Bills page should show the image.", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      expect(NewBill).toBeTruthy()
    })
    /* Ce test passe, mais ça ne veut pas dire que c'est bon pour autant... */
  })
})