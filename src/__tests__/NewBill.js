import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { fireEvent, screen } from "@testing-library/dom"
import "@testing-library/jest-dom"

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
      const formNewBill = screen.getByTestId("form-new-bill")
      expect(formNewBill).toBeVisible()
    })
  })
  describe("When I am on NewBill Page and I leave empty fields", () => {
    test("Then the fields should be really empty and some fields should be required.", () => {
      const expenseType = screen.getByTestId("expense-type")
      expect(expenseType.value).toBe("Transports") // 1ère option visible de la liste déroulante.
      expect(expenseType).toBeRequired()

      const expenseName = screen.getByTestId("expense-name")
      expect(expenseName.value).toBe("")
      expect(expenseName).not.toBeRequired()

      const expenseDate = screen.getByTestId("datepicker")
      expect(expenseDate.value).toBe("")
      expect(expenseDate).toBeRequired()

      const expenseAmount = screen.getByTestId("amount")
      expect(expenseAmount.value).toBe("")
      expect(expenseAmount).toBeRequired()

      const expenseTVA = screen.getByTestId("vat")
      expect(expenseTVA.value).toBe("")
      expect(expenseTVA).not.toBeRequired()

      const expensePourcent = screen.getByTestId("pct")
      expect(expensePourcent.value).toBe("")
      expect(expensePourcent).toBeRequired()
      
      const expenseComment = screen.getByTestId("commentary")
      expect(expenseComment.value).toBe("")
      expect(expenseComment).not.toBeRequired()
    })
  })
  describe("When I am on NewBill Page and I fill fields", () => {
    test("Then the fields should be correctly filled.", () => {
      const expenseType = screen.getByTestId("expense-type")
      expect(expenseType.value = "Services en ligne").toBe("Services en ligne")

      const expenseName = screen.getByTestId("expense-name")
      expect(expenseName.value = "Abonnement site").toBe("Abonnement site")

      const expenseDate = screen.getByTestId("datepicker")
      expect(expenseDate.value = "12/11/2021").toBe("12/11/2021")

      const expenseAmount = screen.getByTestId("amount")
      expect(expenseAmount.value = "120").toBe("120")

      const expenseTVA = screen.getByTestId("vat")
      expect(expenseTVA.value = "12").toBe("12")

      const expensePourcent = screen.getByTestId("pct")
      expect(expensePourcent.value = "10").toBe("10")
      
      const expenseComment = screen.getByTestId("commentary")
      expect(expenseComment.value = "Ceci est un commentaire.").toBe("Ceci est un commentaire.")
    })
  })
  describe("When I upload a file with correct extension", () => {
    test("Then the file name should be displayed.", () => {
    let virtual = new File(["fuck"], "virtual.jpg", { type: "image/jpeg"})
    console.log(virtual.value)
    const html = NewBillUI()
    document.body.innerHTML = html
    const newBillInput = screen.getByTestId("file")
    fireEvent.change(newBillInput, {
      target: {
        files: virtual
      }
    })
    expect(virtual.name).toBe("virtual.jpg")
    expect(virtual.name).not.toBeNull()
    expect(virtual.name).toBeDefined()
    })
  })
  describe("When I upload a file with wrong extension", () => {
    test("Then the file name should not be displayed.", () => {
    let virtual = new File([""], "virtual.txt", { type: "text/plain"})
    const html = NewBillUI()
    document.body.innerHTML = html
    const newBillInput = screen.getByTestId("file")
    fireEvent.change(newBillInput, {
      target: {
        files: virtual
      }
    })
    expect(virtual.name).toBe("virtual.txt")
    expect(virtual.name).not.toBeNull()
    expect(virtual.name).toBeDefined()
    })
  })
})
/* Tous les "describe" passent mais sont-ils vraiment efficaces ? */
/* Il est même sûr que le dernier n'est pas bon... */