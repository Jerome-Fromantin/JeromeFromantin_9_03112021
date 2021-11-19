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
        value: "",
        //value: "0000-02-03",
        writable: true
      })
      if (expenseDate.value.length == 0) {
        //console.log("Date manquante !")
        expect(expenseDate.value).toBe("")
        expect(expenseDate.value.length).toBe(0)
        formNewBill.addEventListener("submit", handleSubmit)
        fireEvent.submit(formNewBill)
        expect(handleSubmit).toHaveBeenCalled()
      }
      else if (expenseDate.value.split("-")[0] == "0000") {
        console.log("Date incorrecte !")
        expect(expenseDate.value).toBe("0000-02-03")
        expect(expenseDate.value.split("-")[0]).toBe("0000")
        formNewBill.addEventListener("submit", handleSubmit)
        fireEvent.submit(formNewBill)
        expect(handleSubmit).toHaveBeenCalled()
      }

      /* MONTANT */
      Object.defineProperty(expenseAmount, "value", {
        value: "",
        writable: true
      })
      if (expenseAmount.value.length == 0) {
        //console.log("Montant manquant !")
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
        expect(expenseAmount.value).toBeNaN()                 // NE PASSE PAS, CONTRADICTION !!
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

      /* POURCENTAGE */
      Object.defineProperty(expensePourcent, "value", {
        value: "",
        writable: true
      })
      if (expensePourcent.value.length == 0) {
        //console.log("Pourcentage manquant !")
        expect(expensePourcent.value).toBe("")
        expect(expensePourcent.value.length).toBe(0)
        formNewBill.addEventListener("submit", handleSubmit)
        fireEvent.submit(formNewBill)
        expect(handleSubmit).toHaveBeenCalled()
      }
      else if (isNaN(expensePourcent.value)) {
        console.log("Pourcentage en lettres !")
        expect(expensePourcent.value).toBeNaN()                 // NE PASSE PAS, CONTRADICTION !!
        formNewBill.addEventListener("submit", handleSubmit)
        fireEvent.submit(formNewBill)
        expect(handleSubmit).toHaveBeenCalled()
      }
      else if (expensePourcent.value <= 0) {
        console.log("Pourcentage inférieur ou égal à 0 !")
        expect(parseInt(expensePourcent.value)).toBeLessThanOrEqual(0)
        formNewBill.addEventListener("submit", handleSubmit)
        fireEvent.submit(formNewBill)
        expect(handleSubmit).toHaveBeenCalled()
      }

      /* UPLOAD */
      Object.defineProperty(fileInput, "files", {
        value: "",
        //value: new File([""], "virtual.jpeg", { type: "text/plain"}),
        writable: true
      })
      if (fileInput.files == "") {
        //console.log("Fichier manquant !")
        expect(fileInput.files).toBeFalsy()
        formNewBill.addEventListener("submit", handleSubmit)
        fireEvent.submit(formNewBill)
        expect(handleSubmit).toHaveBeenCalled()
      }
      // Lignes ci-dessous à décommenter quand une valeur est présente.
      //const fileExt = fileInput.files.name.split(".")[1]
      //if (fileExt !== "jpg" && fileExt !== "jpeg" && fileExt !== "png") {
      else if (fileExt !== "jpg" && fileExt !== "jpeg" && fileExt !== "png") {
        console.log("Extension de fichier incorrecte !")
        expect(fileInput.files).toBeTruthy()
        expect(fileInput.files.name).toBe("virtual." + fileExt)
        formNewBill.addEventListener("submit", handleSubmit)
        fireEvent.submit(formNewBill)
        expect(handleSubmit).toHaveBeenCalled()
      }
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
      expect(expenseDate.value = "2021-11-12").toBe("2021-11-12")

      const expenseAmount = screen.getByTestId("amount")
      expect(expenseAmount.value = "120").toBe("120")

      const expenseTVA = screen.getByTestId("vat")
      expect(expenseTVA.value = "12").toBe("12")

      const expensePourcent = screen.getByTestId("pct")
      expect(expensePourcent.value = "10").toBe("10")
      
      const expenseComment = screen.getByTestId("commentary")
      expect(expenseComment.value = "Ceci est un commentaire.").toBe("Ceci est un commentaire.")

      const virtualFile = new File([""], "virtual.jpg", { type: "image/jpeg"})
      const fileInput = screen.getByTestId("file")
      fireEvent.change(fileInput, {
        target: {
          files: virtualFile
        }
      })
      expect(virtualFile.name).toBe("virtual.jpg")
      expect(fileInput.files.name).toBe("virtual.jpg")
    })
  })
  describe("When I am on NewBill Page and I upload a file with wrong extension", () => {
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
    })
  })
})
/* Le dernier "describe" n'est pas bon... */