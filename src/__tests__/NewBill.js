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
    test("Then the fields should really be empty and some fields should be required.", () => {
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
  describe("When I am on NewBill Page and I leave some fields empty or incorrectly filled", () => {
    test("Then these fields should throw an error message.", () => {
      //const mockTest = jest.fn()
      //mockTest.mockReturnValue("2000-01-01")
      //console.log(mockTest())

      //expenseDate.value = mockTest()
      //expect(() => { mockTest().value }).toReturn()

      const expenseDate = screen.getByTestId("datepicker")
      expenseDate.value = "yyyy-mm-dd" // Champ vide.
      //console.log(expenseDate.value) // N'affiche rien.
      expect(expenseDate.value).toBe("")
      expect(expenseDate.value.length).toBe(0)
      // Test de message d'erreur ??
      // expect().toXxx()

      expenseDate.value = "0000-01-01" // Valeur incorrecte.
      //console.log(expenseDate.value) // N'affiche rien.
      expect(expenseDate.value).toBe("")
      expect(expenseDate.value.length).toBe(0)
      // Test de message d'erreur ??
      // expect().toXxx()

      expect(() => { expenseDate("jj/mm/aaaa") }).toThrowError() // Passe, ok.
      expect(() => { expenseDate("01/01/0000") }).toThrowError() // Passe, ok.
      expect(() => { expenseDate("01/01/2000") }).toThrowError() // Passe, ok.
      expect(() => { expenseDate("2000-01-01") }).toThrowError() // Passe, mais ne devrait pas...
      //expect(() => { expenseDate.value = "2000-01-01" }).toThrowError() // Ne passe pas, ok.
      //expect(() => { expenseDate.value = "0000-01-01" }).toThrowError() // Ne passe pas, mais devrait...

      //const expenseAmount = () => { screen.getByTestId("amount") }
      const expenseAmount = screen.getByTestId("amount")
      //expect(() => { expenseAmount() }).toThrow("Veuillez saisir un nombre.") // Ne passe pas, mais devrait...
      expect(() => { expenseAmount("aaa") }).toThrowError() // Passe, ok.
      expect(() => { expenseAmount(348) }).toThrowError()   // Passe, mais ne devrait pas...
      expect(() => { expenseAmount.value = "aaa" }).toThrowError() // Passe, ok.

      const expensePourcent = screen.getByTestId("pct")
      expect(() => { expensePourcent("") }).toThrowError()    // Passe, ok.
      expect(() => { expensePourcent("aaa") }).toThrowError() // Passe, ok.
      expect(() => { expensePourcent(50) }).toThrowError()    // Passe, mais ne devrait pas...

      let virtualFile = new File([""], "virtual.txt", { type: "text/plain"})
      const fileInput = screen.getByTestId("file")
      fireEvent.change(fileInput, {
        target: {
          files: virtualFile
        }
      })
      expect(() => { fileInput("") }).toThrowError()
      expect(() => { fileInput(virtualFile) }).toThrowError()
    })
  })
  describe("When I am on NewBill Page and I fill fields correctly", () => {
    test("Then the fields should really be correctly filled.", () => {
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

      let virtualFile = new File([""], "virtual.jpg", { type: "image/jpeg"})
      let fileInput = screen.getByTestId("file")
      fireEvent.change(fileInput, {
        target: {
          files: virtualFile
        }
      })
      expect(virtualFile.name).toBe("virtual.jpg")
      expect(fileInput.name.length).toBe(0) // Passe, mais ne devrait pas...
    })
  })
  describe("When I upload a file with wrong extension", () => {
    test("Then the file name should not be displayed.", () => {
    let virtualFile = new File([""], "virtual.txt", { type: "text/plain"})
    const html = NewBillUI()
    document.body.innerHTML = html
    const fileInput = screen.getByTestId("file")
    fireEvent.change(fileInput, {
      target: {
        files: virtualFile
      }
    })
    expect(virtualFile.name).toBe("virtual.txt")
    expect(fileInput.name.length).toBe(0)
    /* Cette manière ci-dessus ne semble pas être la bonne (voir ligne 116). */
    })
  })
})
/* Plusieurs "describe" passent mais sont-ils vraiment efficaces ? */
/* Il est même sûr que le dernier n'est pas bon... */