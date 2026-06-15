
const express = require('express')
const productos = require('./data/productos.json')
const app = express()
const PORT = "3005"
app.use(express.json())

app.get('/', (_, res) => {
  res.status(200).json({message: 'Bienvenido a la API de Productos'})
})

app.get('/productos', (_, res) => {
  res.status(200).json(productos)
})

app.get('/productos/:idProducto', (req, res) => {
  const id = req.params.idProducto
  if(isNaN(id)) {
    res.status(400).json({message: 'Paramétro de Id Incorrecto'})
    return
  }
  const producto = productos.find(p => p.id === +id)
  if (!producto) {
    res.status(404).json({message: `El producto con id ${id} no se encuentra.`})
    return
  }
  res.status(200).json(producto)
})

app.get('/productos/categorias/list', (_, res) => {
  const categorias = [...(new Set(productos.map(p => p.categorias)))]
  res.status(200).json(categorias)
})

app.get('/productos/categorias/valorizado', (_, res) => {
  const valorizado = productos.reduce((arr, ele) => {
    const cate = arr.find(each => each.categoria == ele.categorias)
    if(!cate) {
      arr.push({categoria: ele.categorias, valor: ele.precio * ele.stock})
    } else {
      cate.valor += ele.precio * ele.stock
    }
    return arr
  }, [])
  res.status(200).json(valorizado)
})

app.listen(PORT, (err) => {
  if(err) {
    console.error(err.message)
    process.exit(1)
  }
  console.log(`La aplicación esta escuchando en el puerto ${PORT}`)
})
