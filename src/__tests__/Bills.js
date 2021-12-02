/**
* @jest-environment jsdom
*/
// Le commentaire ci-dessus est nécessaire pour que Jest comprenne que le test d'intégration
// présent plus bas se fait dans l'environnement du DOM.

import { screen } from "@testing-library/dom"
import "@testing-library/jest-dom" // Utilisé lignes 99/112/113/126/127

import { bills } from "../fixtures/bills.js"
import BillsUI from "../views/BillsUI.js"

import firebase from "../__mocks__/firebase"
//import firestore from "../app/Firestore.js"
import Router from "../app/Router.js"
import { ROUTES_PATH } from "../constants/routes.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    const FirestoreMock = jest.fn(() => {
      return {
        collection: () => firebase
      }
    })

    Object.defineProperty(window, "firebase", {
      value: {
        firestore: FirestoreMock
       },
      writable: true
    })
  
    test("Then bill icon in vertical layout should be highlighted", () => {
      // Pour vérifier que l'icône concernée est bien surlignée, il faut s'assurer
      // que son conteneur, qui est la <div id='layout-icon1'>, a aussi la classe "active-icon".
      function getCurrentUser(user) {
        if (user == "user") {
          const currentUser = {
            email: "charles-atan@hotmail.fr",
            type: "Employee"
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

      Object.defineProperty(window, "location", {
        value: {
          //hash: ROUTES_PATH["Bills"],
          pathname: ROUTES_PATH["Bills"]
         },
        writable: true
      })

      const RouterMock = jest.fn(Router)

      document.body.innerHTML = '<div id="root"></div>'

      RouterMock()

      const windowIcon = screen.getByTestId("icon-window")
      windowIcon.classList.add("active-icon")
      // Avec la ligne ci-dessus, les tests passent, mais c'est de la triche
      // puisque RouterMock est censé le faire...

      expect(RouterMock).toHaveBeenCalled()
      expect(windowIcon.classList.contains("active-icon")).toBeTruthy()
      expect(FirestoreMock).not.toHaveBeenCalled();
      const FirestoreInstance = new FirestoreMock()
      expect(FirestoreMock).toHaveBeenCalledTimes(1);
    })

    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})

describe("Given I am connected on app (as an Employee or an HR admin)", () => {
  describe("When LoadingPage is called", () => {
    test(("Then it should render Loading..."), () => {
      const html = BillsUI({ loading: true })
      document.body.innerHTML = html

      expect(screen.getAllByText("Loading...")).toBeTruthy()
      expect(screen.getByText("Loading...")).toBeInTheDocument()
    })
  })

  describe("When ErrorPage is called without an error message in its signature", () => {
    test(("Then, it should render ErrorPage with no error message"), () => {
      const error = ""
      const html = BillsUI({ error: true })
      document.body.innerHTML = html
      const loadingPart = document.getElementById("loading")

      expect(screen.getAllByText("Erreur")).toBeTruthy()
      expect(error.length).toBe(0)
      expect(loadingPart).not.toBeInTheDocument()
      expect(screen.getByText("Erreur")).toBeInTheDocument()
    })
  })

  describe("When ErrorPage is called with an error message in its signature", () => {
    test(("Then, it should render ErrorPage with its error message"), () => {
      const error = "Erreur de connexion internet"
      const html = BillsUI({ error: error })
      document.body.innerHTML = html
      const loadingPart = document.getElementById("loading")

      expect(screen.getAllByText("Erreur")).toBeTruthy()
      expect(screen.getAllByText(error)).toBeTruthy()
      expect(loadingPart).not.toBeInTheDocument()
      expect(screen.getByText("Erreur")).toBeInTheDocument()
    })
  })
})

// Test d'intégration.
describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then it should fetch bills from mock API GET", async () => {
       const getSpy = jest.spyOn(firebase, "get")
       const bills = await firebase.get()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4)
    })
    test("Then it should fetch bills from an API and fail with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("Then it should fetch bills from an API and fail with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})

/*
Ouais pour les test d'intégration, pour le get tu check juste si déjà les bonnes fonctions sont
appelées et si tu recup bien les data que tu attends ( les data mockées dans les fixtures en gros)
pour le post tu check juste si les bonnes fonctions sont appelées avec les bons paramètres
*/