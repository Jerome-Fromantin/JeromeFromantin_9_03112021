/**
* @jest-environment jsdom
*/
// Le commentaire ci-dessus est nécessaire pour que Jest comprenne que le test d'intégration
// présent plus bas se fait dans l'environnement du DOM.

import NewBill from "../containers/NewBill.js"
import NewBillUI from "../views/NewBillUI.js"
import { ROUTES } from "../constants/routes"
import { bills } from "../fixtures/bills"
import { fireEvent, getByText, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/dom"

describe("Given I am connected as an employee", () => {
  describe("When I am on New Bill Page and I submit a new bill", () => {
    test("Then the function to manage it is called", () => {
      // Définition des paramètres de la ligne 44.
      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const firestore = jest.fn()

      function getCurrentUser(user) {
        if (user == "user") {
          const currentUser = {
            email: "charles-atan@hotmail.fr"
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

      formNewBill.addEventListener("submit", handleSubmit)
      fireEvent.submit(formNewBill)

      expect(handleSubmit).toHaveBeenCalled()
    })
  })

  describe("When I am on New Bill Page and I upload an invalid file", () => {
    test("Then the functions to manage it are called", () => {
      // Définition des paramètres de la ligne 107.
      const html = NewBillUI()
      document.body.innerHTML = html

      const firestore = jest.fn()

      function getCurrentUser(user) {
        if (user == "user") {
          const currentUser = {
            email: "charles-atan@hotmail.fr"
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

      // Crée un fichier virtuel avec une extension non valide.
      const fileInput = screen.getByTestId("file")
      Object.defineProperty(fileInput, "files", {
        value: [new File([""], "virtual.txt", {type: "text/plain"})],
        writable: true
      })

      // Simule la boite d'alerte pour les fichiers non valides.
      const alertMock = jest.fn()
      Object.defineProperty(window, "alert", {
        value: alertMock,
        writable: true
      })

      // Simule la fonction stockant le nom de fichier quand il est valide.
      const refMock = jest.fn()
      Object.defineProperty(firestore, "storage", {
        value: {
          ref: refMock
        },
        writable: true
      })

      const nouvelleNote = new NewBill({ document, onNavigate: null, firestore, localStorage: window.localStorage })
      nouvelleNote.createBill = jest.fn()

      const handleChangeFile = jest.fn(nouvelleNote.handleChangeFile)

      fileInput.addEventListener("change", handleChangeFile)
      fireEvent.change(fileInput)

      // Appelle la fonction qui gère l'upload du fichier.
      expect(handleChangeFile).toHaveBeenCalled()
      // Fichier invalide donc appelle la boite d'alerte.
      expect(alertMock).toHaveBeenCalled()
      // Fichier invalide donc n'appelle pas la fonction de stockage.
      expect(refMock).not.toHaveBeenCalled()
    })
  })

  describe("When I am on New Bill Page and I upload a valid file", () => {
    test("Then the functions to manage it are called", () => {
      // Définition des paramètres de la ligne 164.
      const html = NewBillUI()
      document.body.innerHTML = html

      const firestore = jest.fn()

      function getCurrentUser(user) {
        if (user == "user") {
          const currentUser = {
            email: "charles-atan@hotmail.fr"
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

      // Crée un fichier virtuel avec une extension valide.
      const fileInput = screen.getByTestId("file")
      Object.defineProperty(fileInput, "files", {
        value: [new File([""], "virtual.jpg", {type: "image/jpeg"})],
        writable: true
      })

      // Simule la boite d'alerte pour les fichiers non valides.
      const alertMock = jest.fn()
      Object.defineProperty(window, "alert", {
        value: alertMock,
        writable: true
      })

      const nouvelleNote = new NewBill({ document, onNavigate: null, firestore, localStorage: window.localStorage })
      nouvelleNote.createBill = jest.fn()

      const handleChangeFile = jest.fn(nouvelleNote.handleChangeFile)

      const snapshot = {
        ref: {
          getDownloadURL: jest.fn().mockResolvedValue("http://www.test.com")
        }
      }

      // Simule la fonction successPut du container ligne 28 à 30.
      const successPut = jest.fn()
      
      const resolveProm = new Promise(jest.fn())

      const resolveMock = jest.fn(() => resolveProm)
      const rejectMock = jest.fn()

      const promise = new Promise(successPut, rejectMock)
      promise.then = resolveMock

      const putMock = jest.fn().mockResolvedValue(snapshot)
      const refMock = jest.fn((fileName) => ({put: putMock}))
      Object.defineProperty(firestore, "storage", {
        value: {
          ref: refMock
        },
        writable: true
      })
      
      fileInput.addEventListener("change", handleChangeFile)
      fireEvent.change(fileInput, {
        target: {
          value: ""
        }
      })

      expect(handleChangeFile).toHaveBeenCalled()
      expect(refMock).toHaveBeenCalled()
      expect(putMock).toHaveBeenCalled()
    })
  })
})

// Test d'intégration.
describe("Given I am connected as an employee", () => {
  describe("When I am on New Bill Page and I submit a bill", () => {
    test("Then it should render Bills page with the new bill", async () => {
      const mockBills = jest.fn(() => {
        return {
          add: jest.fn().mockResolvedValue()
        }
      })

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const firestore = jest.fn()

      firestore.bills = mockBills

      const nouvelleNote = new NewBill({ document, onNavigate, firestore, localStorage: window.localStorage })
      nouvelleNote.createBill(bills[0])

      const onNavigateMock = jest.fn(nouvelleNote.successCreate)

      expect(firestore.bills).toHaveBeenCalled()
      expect(mockBills).toHaveBeenCalledTimes(1)

      waitForElementToBeRemoved(document.querySelector('form')).then(() => {
        const pageTitle = getByText("Mes notes de frais")
        
        expect(pageTitle).toBeTruthy()
        expect(onNavigateMock).toHaveBeenCalled()
      })
    })
  })

  describe("When I am on New Bill Page and I submit a bill which fails", () => {
    test("Then it should stay on this page", async () => {
      document.body.innerHTML = NewBillUI()
      
      const mockAdd = jest.fn().mockRejectedValue()
      const mockBills = jest.fn(() => {
        return {
          add: mockAdd
        }
      })

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const firestore = jest.fn()

      firestore.bills = mockBills

      const nouvelleNote = new NewBill({ document, onNavigate, firestore, localStorage: window.localStorage })
      
      const onNavigateMock = jest.fn(nouvelleNote.failCreate)
      nouvelleNote.createBill(bills[0])

      expect(firestore.bills).toHaveBeenCalled()
      expect(mockBills).toHaveBeenCalledTimes(1)

      waitFor(() => expect(mockAdd).toHaveBeenCalled()).then(() => {
        expect(onNavigateMock).toHaveBeenCalled()
      })
    })
  })
})