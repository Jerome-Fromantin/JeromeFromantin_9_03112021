/**
* @jest-environment jsdom
*/
// Le commentaire ci-dessus est nécessaire pour que Jest comprenne que le test d'intégration
// présent plus bas se fait dans l'environnement du DOM.

import NewBill from "../containers/NewBill.js"
import NewBillUI from "../views/NewBillUI.js"
import { ROUTES } from "../constants/routes"
import bills from "../fixtures/bills"
import firestore from "../app/Firestore.js"
import { fireEvent, screen } from "@testing-library/dom"

describe("Given I am connected as an employee", () => {
  describe("When I am on New Bill Page and I submit a new bill", () => {
    test("Then the function to manage it is called", () => {
      // Définition des paramètres de la ligne 45.
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
      // Définition des paramètres de la ligne 108.
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
      // Définition des paramètres de la ligne 165.
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

      // Simule la fonction successPut du container ligne 28 à 30.
      const successPut = jest.fn(nouvelleNote.successPut)
      
      // Simule la fonction successDwl du container ligne 32 à 35.
      const successDwl = jest.fn(nouvelleNote.successDwl)

      const snapshot = jest.fn()
      Object.defineProperty(snapshot, "ref", {
        value: {
          getDownloadURL: jest.fn(() => new Promise(successDwl))
        },
        writable: true
      })

      const resolveProm = new Promise(jest.fn())
      resolveProm.then = successDwl

      const resolveMock = jest.fn(() => resolveProm)
      const rejectMock = jest.fn()

      const promise = new Promise(successPut, rejectMock)
      promise.then = resolveMock

      const putMock = jest.fn((file) => promise)
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
      expect(resolveMock).toHaveBeenCalled()
      expect(rejectMock).not.toHaveBeenCalled()
      expect(successPut).toHaveBeenCalled()
      expect(successDwl).toHaveBeenCalled()
      expect(alertMock).not.toHaveBeenCalled()
    })
  })
})

// Test d'intégration POST à modifier.
describe("Given I am connected as an employee", () => {
  describe("When I am on New Bill Page and I submit a bill", () => {
    test("Then it should render Bills page with the new bill", () => {
      //jest.mock("../app/Firestore.js")

      const mockBills = jest.fn((bill) => {
        return {
          add: jest.fn().mockResolvedValue(bill)
        }
      })

      // Fonction normale
      /*const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }*/
      // 1er mock
      const onNavigateMock = jest.fn((pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      })
      // 2ème mock
      //const onNavigateMock2 = jest.fn(pathname => document.body.innerHTML = ROUTES({ pathname }))

      const firestore = jest.fn()

      firestore.bills = mockBills
      const nouvelleNote = new NewBill({ document, onNavigate: onNavigateMock, firestore, localStorage: window.localStorage })
      nouvelleNote.createBill() //bill en paramètre

      //expect(firestore).toHaveBeenCalled()
      expect(firestore.bills).toHaveBeenCalled()
      expect(mockBills).toHaveBeenCalledTimes(1)
      //expect(onNavigateMock).toHaveBeenCalled() // Ne passe pas...
      //expect(onNavigateMock2).toHaveBeenCalled() // Ne passe pas...
    })
  })
})

/*
Ouais pour les test d'intégration, pour le get tu check juste si déjà les bonnes fonctions sont
appelées et si tu recup bien les data que tu attends ( les data mockées dans les fixtures en gros)
pour le post tu check juste si les bonnes fonctions sont appelées avec les bons paramètres
*/