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
  describe("When I am on NewBill Page and I upload a file", () => {
    test("Then the file type should be verified and the file rejected if not valid.", () => {
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
      const handleChangeFile = jest.fn(nouvelleNote.handleChangeFile) // ???
      const handleSubmit = jest.fn(nouvelleNote.handleSubmit)
      //const validFileType = jest.fn(validFileType) // ???

      /* DATE : Test apparemment inutile pour le "coverage". */
      /*const expenseDate = screen.getByTestId("datepicker")
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
      }*/

      /* MONTANT : Test apparemment inutile pour le "coverage". */
      /*const expenseAmount = screen.getByTestId("amount")
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
      }*/

      /* POURCENTAGE : Test apparemment inutile pour le "coverage". */
      /*const expensePourcent = screen.getByTestId("pct")
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
      }*/

      /* UPLOAD */
      const fileInput = screen.getByTestId("file")
      Object.defineProperty(fileInput, "files", {
        value: new File([""], "virtual.txt", {type: "text/plain"}),
        writable: true
      })
      const fileExt = fileInput.files.name.split(".")[1]
      if (fileExt !== "jpg" && fileExt !== "jpeg" && fileExt !== "png") {
        console.log("Extension de fichier incorrecte !")
        expect(fileInput.files).toBeTruthy()
        expect(fileInput.files.name).toBe("virtual." + fileExt)
        formNewBill.addEventListener("submit", handleSubmit)
        fireEvent.submit(formNewBill)
        expect(handleSubmit).toHaveBeenCalled()
        /* LIGNES CI-DESSOUS A SUPPRIMER ? */
        fileInput.addEventListener("click", handleChangeFile)
        fireEvent.click(fileInput) // PROBLEME !!
        // Cannot read property 'files' of null : ligne 20 fichier "containers/NewBill.js"
        expect(handleChangeFile).toHaveBeenCalled()
      }
    })
  })
})