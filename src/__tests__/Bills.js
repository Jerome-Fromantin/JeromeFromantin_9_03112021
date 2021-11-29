/**
* @jest-environment jsdom
*/
// Le commentaire ci-dessus est nécessaire pour que Jest comprenne que le test d'intégration
// présent plus bas se fait dans l'environnement du DOM.

import { screen, getByTestId } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import VerticalLayout from '../views/VerticalLayout.js'
import { bills } from "../fixtures/bills.js"
import Router from "../app/Router.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js"
import LoadingPage from "../views/LoadingPage.js"
import firebase from "../__mocks__/firebase"
import DashboardUI from "../views/DashboardUI.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      //to-do write expect expression
      // Vérifier que la <div id='layout-icon1'> a aussi la classe "active-icon".
      /* Message :
      "Il faut mocker les données, et le localstorage, pour pouvoir appeler la fonction Router() qui
      s'occupe de charger le projet, et ensuite, vous aurez la classe voulue..."
      */
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
        value: { pathname: ROUTES_PATH['Bills'] },
        writable: true
      })

      //let user = JSON.parse(localStorage.getItem('user'))

      //const html = VerticalLayout()
      document.body.innerHTML = '<div id="root"></div>'
      //document.body.innerHTML = ROUTES({ pathname: window.location.pathname })
      Router()
      console.log(window.location.pathname) // #employee/bills
      const windowIcon = screen.getByTestId("icon-window")
      console.log(windowIcon.classList.contains("active-icon")) // false
      //expect(windowIcon.classList.contains("active-icon")).toBeTruthy()
      //window.onNavigate(ROUTES_PATH['Bills'])
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

describe('Given I am connected on app (as an Employee or an HR admin)', () => {
  describe('When LoadingPage is called', () => {
    test(('Then it should render Loading...'), () => {
      const html = LoadingPage()
      document.body.innerHTML = html
      expect(screen.getAllByText('Loading...')).toBeTruthy()

      /*if (loading) {
        expect(BillsUI).toReturn()
      } else if (error) {
        expect(BillsUI).toReturn()
      }*/
    })
  })
})



// Test d'intégration GET modifié depuis le modèle de Dashboard...
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
      const html = DashboardUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("Then it should fetch bills from an API and fail with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = DashboardUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})