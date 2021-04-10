const express = require('express')
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000

const pool = require('./db')

//middleware
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// create a todo 
app.post('/todos', async (req, res) => {
    try {
        const { description } = req.body;
        const query = "INSERT INTO todo (description) VALUES($1) RETURNING * ;"
        const values = [description]
        const newTodo = await pool.query(query, values)
        res.json(newTodo)
    } catch (error) {
        res.status(500).json({ error: error })
        console.log(error.message)
    }
})
app.get('/todos', async (req, res) => {
    try {
        const query = "SELECT * FROM todo"
        const allTodo = await pool.query(query)
        res.json(allTodo.rows)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})
app.get('/todos/:id', async (req, res) => {
    try {
        const query = "SELECT * FROM todo WHERE todo_id=$1";
        const value = [req.params.id]
        const todo = await pool.query(query, value)
        res.json(todo.rows)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error })
    }
})
app.delete('/todos/:id', async (req, res) => {
    try {
        const query = "DELETE FROM todo WHERE todo_id=$1"
        const value = [req.params.id]
        const todo = await pool.query(query, value)
        res.json(todo.rowCount)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error })
    }
})
app.put('/todos/:id', async (req, res) => {
    try {
        const { description } = req.body
        console.log(req.body)
        const query = "UPDATE todo SET description=$1 WHERE todo_id=$2"
        const value = [description, req.params.id]
        const todo = await pool.query(query, value)
        res.json(todo.rowCount)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error })
    }
})

app.listen(port, () => {
    console.log('app listen on port: ', port)
})