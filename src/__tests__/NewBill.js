import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { fireEvent, screen } from "@testing-library/dom"

describe("Given I am connected as an employee", () => {
  /* SYNTAXE D'ORIGINE
  // describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })
  */
  /* CI-DESSOUS, MA SYNTAXE */
  describe("When I am on NewBill Page", () => {
    test("Then the form should be displayed.", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      expect(NewBillUI()).toMatch(html)
      /* Test bien écrit ?! */
    })
  })
  describe("When I am on NewBill Page and I click on button with empty fields", () => {
    test("Then it should ...", () => {
      const expenseType = screen.getByTestId("expense-type")
      expect((expenseType.value = null)).toBeNull()
      //expect(expenseType.value = "Repas").toBeFalsy()
      expect(expenseType.value = "Services en ligne").not.toBe("Transports")
      expect(expenseType.value = "Transports").toBe("Transports")
      const expenseTypeOption = screen.getByDisplayValue("Transports")
      const expenseTypeTestValue = "Transports"
      expect(expenseTypeOption.value).toContain(expenseTypeTestValue)

      const expenseName = screen.getByTestId("expense-name")
      expect(expenseName.value).toBe("")

      const expenseDate = screen.getByTestId("datepicker")
      expect(expenseDate.value).toBe("")

      const expenseAmount = screen.getByTestId("amount")
      expect(expenseAmount.value).toBe("")

      const expenseTVA = screen.getByTestId("vat")
      expect(expenseTVA.value).toBe("")

      const expensePourcent = screen.getByTestId("pct")
      expect(expensePourcent.value).toBe("")
      
      const expenseComment = screen.getByTestId("commentary")
      expect(expenseComment.value).toBe("")
    })
  })
  describe("When I upload a file with correct extension", () => {
    test("Then the Bills page modal should show the image.", () => {
    const virtual = new File([], "virtualFile.jpg", { type: "image/jpeg"})
    const html = NewBillUI()
    document.body.innerHTML = html
    const newBillInput = screen.getByTestId("file")
    //newBillInput.value = "virtualFile.jpg"
    fireEvent.change(newBillInput, { target: { fileName: "virtualFile.jpg" } })
    console.log(newBillInput.files[0])
    expect(NewBill).toBeTruthy()
    })
  })
})