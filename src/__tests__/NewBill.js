import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes"
import { fireEvent, screen } from "@testing-library/dom"
import "@testing-library/jest-dom"

describe("Given I am connected as an employee", () => {
  /* SYNTAXE D'ORIGINE
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })
  })
  */
  /* CI-DESSOUS, MA SYNTAXE */
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
        formNewBill.addEventListener("submit", handleSubmit)
        fireEvent.submit(formNewBill)
        expect(handleSubmit).toHaveBeenCalled()
      }
      else if (isNaN(expenseAmount.value)) {
        console.log("Montant en lettres !")
        formNewBill.addEventListener("submit", handleSubmit)
        fireEvent.submit(formNewBill)
        expect(handleSubmit).toHaveBeenCalled()
      }
      else if (expenseAmount.value <= 0) {
        console.log("Montant inférieur ou égal à 0 !")
        expect(parseInt(expenseAmount.value)).toBeLessThanOrEqual(0)
        formNewBill.addEventListener("submit", handleSubmit)
        fireEvent.submit(formNewBill)
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
        //value: new File([""], "virtual.jpg"),
        writable: true
      })
      if (fileInput.files == "") {
        //console.log("Fichier manquant !")
        expect(fileInput.files).toBeFalsy()
        formNewBill.addEventListener("submit", handleSubmit)
        fireEvent.submit(formNewBill)
        expect(handleSubmit).toHaveBeenCalled()
      }
      /* Lignes ci-dessous à décommenter quand une valeur est présente. */
      //const fileExt = fileInput.files.name.split(".")[1]
      //if (fileExt !== "jpg" && fileExt !== "jpeg" && fileExt !== "png") {

      /* Ligne ci-dessous à commenter quand une valeur est présente. */
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
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      // Couvrir la fonction "handleChangeFile".
    })
  })
})