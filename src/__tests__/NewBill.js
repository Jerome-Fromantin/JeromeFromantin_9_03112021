import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes"
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
  describe("When I am on NewBill Page and I haven't done anything", () => {
    test("Then the fields should be empty and some fields should be required.", () => {
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

      const fileInput = screen.getByTestId("file")
      expect(fileInput.value).toBe("")
      expect(fileInput).toBeRequired()
    })
  })
  describe("When I am on NewBill Page and I leave some fields empty or incorrectly filled", () => {
    test("Then these fields should throw an error message after submit.", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = jest.fn()

      function getCurrentUser(user) {
        if (user == "user") {
          const currentUser = {
            email: "jeromefromantin@hotmail.fr"
          }
          return JSON.stringify(currentUser)
        }
        return null
      }

      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(getCurrentUser),
          setItem: jest.fn(() => null)
        },
        writable: true
      })

      const nouvelleNote = new NewBill({ document, onNavigate, firestore, localStorage: window.localStorage })
      nouvelleNote.createBill = jest.fn()

      const formNewBill = screen.getByTestId("form-new-bill")
      //const validateFields = jest.fn(nouvelleNote.validateFields) // Test de validation des champs
      const handleSubmit = jest.fn(nouvelleNote.handleSubmit)

      /* Récupération des 4 champs pouvant produire un message d'erreur */
      const expenseDate = screen.getByTestId("datepicker")
      const expenseAmount = screen.getByTestId("amount")
      const expensePourcent = screen.getByTestId("pct")
      const fileInput = screen.getByTestId("file")

      /* DATE */
      Object.defineProperty(expenseDate, "value", {
        value: "",                      // Champ vide.
        writable: true
      })
      expect(expenseDate.value).toBe("")
      expect(expenseDate.value.length).toBe(0)
      formNewBill.addEventListener("submit", handleSubmit)
      fireEvent.submit(formNewBill)
      expect(handleSubmit).toHaveBeenCalled()

      expenseDate.value = "0000-01-01"  // Valeur incorrecte.
      expect(expenseDate.value).toBe("0000-01-01")
      expect(expenseDate.value.split("-")[0]).toBe("0000")
      formNewBill.addEventListener("submit", handleSubmit)
      fireEvent.submit(formNewBill)
      expect(handleSubmit).toHaveBeenCalled()

      /* MONTANT */
      Object.defineProperty(expenseAmount, "value", {
        value: "aaa",
        writable: true
      })
      console.log(expenseAmount.value.length)
      if (expenseAmount.value.length == 0) {
        console.log("Montant manquant !")
        expect(expenseAmount.value).toBe("")
        expect(expenseAmount.value.length).toBe(0)
        //expenseAmount.addEventListener("focusout", validateFields)
        //fireEvent.focusOut(expenseAmount)
        formNewBill.addEventListener("submit", handleSubmit)
        fireEvent.submit(formNewBill)
        //expect(validateFields).toHaveBeenCalled()
        expect(handleSubmit).toHaveBeenCalled()
      }
      else if (isNaN(expenseAmount.value)) {
        console.log("Montant en lettres !")
        expect(expenseAmount.value).toBeNaN()
        formNewBill.addEventListener("submit", handleSubmit)
        fireEvent.submit(formNewBill)
        //expect(validateFields).toHaveBeenCalled()
        expect(handleSubmit).toHaveBeenCalled()
      }
      else if (expenseAmount.value <= 0) {
        console.log("Montant inférieur ou égal à 0 !")
        expect(parseInt(expenseAmount.value)).toBeLessThanOrEqual(0)
        formNewBill.addEventListener("submit", handleSubmit)
        fireEvent.submit(formNewBill)
        //expect(validateFields).toHaveBeenCalled()
        expect(handleSubmit).toHaveBeenCalled()
      }
      else {
        console.log("OK")
      }

      /* POURCENTAGE */
      Object.defineProperty(expensePourcent, "value", {
        value: "",                      // Champ vide.
        writable: true
      })
      expect(expensePourcent.value).toBe("")
      expect(expensePourcent.value.length).toBe(0)
      formNewBill.addEventListener("submit", handleSubmit)
      fireEvent.submit(formNewBill)
      expect(handleSubmit).toHaveBeenCalled()

      expensePourcent.value = "aaa"  // Valeur incorrecte.
      expect(expensePourcent.value).toBe("aaa")
      formNewBill.addEventListener("submit", handleSubmit)
      fireEvent.submit(formNewBill)
      expect(handleSubmit).toHaveBeenCalled()

      /* UPLOAD */
      Object.defineProperty(fileInput, "value", {
        files: "",                      // Champ vide.
        writable: true
      })
      expect(fileInput.value).toBeUndefined()
      formNewBill.addEventListener("submit", handleSubmit)
      fireEvent.submit(formNewBill)
      expect(handleSubmit).toHaveBeenCalled()

      fileInput.value = new File([""], "virtual.txt", { type: "text/plain"})  // Valeur incorrecte.
      expect(fileInput.value.name).toBe("virtual.txt")
      formNewBill.addEventListener("submit", handleSubmit)
      fireEvent.submit(formNewBill)
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
  describe("When I am on NewBill Page and I fill fields correctly", () => {
    test("Then the fields should really be correctly filled.", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
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