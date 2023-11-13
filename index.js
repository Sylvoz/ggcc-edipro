import express from 'express'
import { ggcc_edipro} from './ggcc_edipro.js'

const app= express()

app.use(express.json())

// Routes
app.get('/extractor', async (req, res) => {
  const user=req.query.user
  const password= req.query.password
  const id=req.query.id
  const total= await ggcc_edipro(user,id,password)
  const {invoice_amount }= total.data
  if (invoice_amount == "Error al cargar página"){
    res.status(500).json(total)
  }else {
    res.status(200).json(total);
  }
})  


// PORT
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server hosted on: ${PORT}`)
})