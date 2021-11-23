import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import VerticalLayout from '../views/VerticalLayout.js' // Ajout de code.
import { bills } from "../fixtures/bills.js"
import Router from "../app/Router.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      //to-do write expect expression
      // Vérifier que la <div id='layout-icon1'> a aussi la classe "active-icon".
      /* Message :
      "Il faut mocker les données, et le localstorage, pour pouvoir appeler la fonction Router() qui
      s'occupe de charger le projet, et ensuite, vous aurez la classe voulue..."
      */
      const html = VerticalLayout()
      document.body.innerHTML = html

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

      const VerticalLayout = jest.fn(VerticalLayout())
      
      let user = JSON.parse(localStorage.getItem('user'))
      if (typeof user.email === 'string') {
        console.log("Oui !")
        console.log(user)
        //user = JSON.parse(user)
      }
      user.type = "Employee"
      if (user && user.type === 'Employee') {
        console.log("Tu y es presque !")
        expect(VerticalLayout).toReturn()
      }
      const windowIcon = screen.getByTestId("icon-window")
      expect(windowIcon).toBeVisible()
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