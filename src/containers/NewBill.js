
import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, firestore, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.firestore = firestore
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    new Logout({ document, localStorage, onNavigate })
  }

  fileTypes = [
    "image/jpeg",
    "image/png"
  ]

  validFileType(fileType) {
    return this.fileTypes.includes(fileType)
  }

  successPut(snapshot) {
    return snapshot.ref.getDownloadURL()
  }

  successDwl(url, fileName) {
    this.fileUrl = url
    this.fileName = fileName
  }

  handleChangeFile = e => {
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
    const fileType = file.type
    const filePath = e.target.value.split(/\\/g)
    this.fileName = filePath[filePath.length-1]
    
    if (this.validFileType(fileType)) {
      this.firestore
      .storage
      .ref(`justificatifs/${this.fileName}`)
      .put(file)
      .then(this.successPut)
      .then(this.successDwl)
    }
    else {
      document.querySelector(`input[data-testid="file"]`).value = null
      this.fileUrl = null
      this.fileName = null
      window.alert('Seuls les fichiers de type "jpg", "jpeg" ou "png" sont autorisés.')
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    // console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
    const email = JSON.parse(localStorage.getItem("user")).email
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
      date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    }
    this.createBill(bill)
    this.onNavigate(ROUTES_PATH['Bills'])
  }

  // not need to cover this function by tests
  createBill = (bill) => {
    if (this.firestore) {
      this.firestore
      .bills()
      .add(bill)
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => error)
    }
  }
}