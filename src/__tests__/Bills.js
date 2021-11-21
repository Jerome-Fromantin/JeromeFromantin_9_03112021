import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import VerticalLayout from '../views/VerticalLayout.js' // Ajout de code.
import { bills } from "../fixtures/bills.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      //to-do write expect expression
      // Vérifier que la <div id='layout-icon1'> a aussi la classe "active-icon".
      const html = VerticalLayout()
      let user;
      user = JSON.parse(localStorage.getItem('user'))
      console.log(typeof user)
      if (typeof user === 'string') {
        user = JSON.parse(user)
        console.log("Oui !")
      } else {
        console.log("Mince !")
      }
      if (user && user.type === 'Employee') {
        console.log("Tu y es presque !")
        console.log(user)
        console.log(user.type)
        document.body.innerHTML = html
        console.log(html)
      } else {
        console.log("Fuck !")
      }
      //const windowIcon = screen.getByTestId("icon-window")
      //expect(windowIcon).toBeVisible()
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