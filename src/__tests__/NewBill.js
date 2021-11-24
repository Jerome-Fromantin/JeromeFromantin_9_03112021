import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes"
import { fireEvent, screen } from "@testing-library/dom"
import "@testing-library/jest-dom"

describe("Given I am connected as an employee", () => {
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
      //const handleChangeFile = jest.fn(nouvelleNote.handleChangeFile) // ???
      const handleSubmit = jest.fn(nouvelleNote.handleSubmit)
      //const validFileType = jest.fn(validFileType) // ???

      formNewBill.addEventListener("submit", handleSubmit)
      fireEvent.submit(formNewBill)
      expect(handleSubmit).toHaveBeenCalled()
    })
  })

  describe("When I am on NewBill Page and I upload a file", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const fileInput = screen.getByTestId("file")
      Object.defineProperty(fileInput, "files", {
        value: [new File([""], "virtual.txt", {type: "text/plain"})],
        writable: true
      })
      
      /*Object.defineProperty(fileInput, "value", {
        value: "virtual.txt",
        writable: true
      })*/
      /*const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }*/

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

      const firestore = jest.fn()
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
      fireEvent.change(fileInput, {
        target: {
          value: ""
        }
      })
      expect(handleChangeFile).toHaveBeenCalled()
      expect(refMock).not.toHaveBeenCalled()
    })
  })

  describe("When I am on NewBill Page and I upload a file", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const fileInput = screen.getByTestId("file")
      Object.defineProperty(fileInput, "files", {
        value: [new File([""], "virtual.jpg", {type: "image/jpeg"})],
        writable: true
      })
      
      /*Object.defineProperty(fileInput, "value", {
        value: "virtual.txt",
        writable: true
      })*/
      /*const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }*/

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

      const firestore = jest.fn()
      const successDwl = jest.fn((url) => url)
      const snapshot = jest.fn()
      Object.defineProperty(snapshot, "ref", {
        value: {
          getDownloadURL: jest.fn(() => new Promise(successDwl))
        },
        writable: true
      })

      const nouvelleNote = new NewBill({ document, onNavigate: null, firestore, localStorage: window.localStorage })
      nouvelleNote.createBill = jest.fn()

      const handleChangeFile = jest.fn(nouvelleNote.handleChangeFile)

      const firstThen = jest.fn(() => snapshot)
      //nouvelleNote.successPut = firstThen
      const resolveMock = jest.fn(() => snapshot)
      const rejectMock = jest.fn()
      const promise = new Promise(resolveMock, rejectMock)
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
      expect(successDwl).toHaveBeenCalled()
      //expect(firstThen).toHaveBeenCalled()
    })
  })
})