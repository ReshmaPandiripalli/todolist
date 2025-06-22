const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql2');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Reshma@123',
    database: 'todo',
});

db.connect((err) => {
    if (err) {
        console.log("Error connecting to database");
        return;
    }
    console.log("Connected to database");
});

app.get('/', (req, res) => {
    console.log('Default Route');
    db.query('SELECT * FROM todoItems', (err, result) => {
        if (err) {
            console.log("Error occurred");
            return;
        }
        console.log("Data", result);
        res.json(result);
    });
});

app.post('/add-item', (req, res) => {
    console.log(req.body);
    db.query(
        'INSERT INTO todoItems (itemDescription) VALUES (?)',
        [req.body.text],
        (err, results) => {
            if (err) {
                console.error('Error occurred:', err);
                res.status(500).send('Error inserting data');
                return;
            }
            console.log('Created Successfully');
            res.send('Added successfully');
        }
    );
});

app.put('/edit-item', (req, res) => {
    console.log('Edit Item:', req.body.ID, req.body.itemDescription);
    db.query(
        'UPDATE todoItems SET itemDescription = ? WHERE Id = ?',  // <-- column name Id (capital I)
        [req.body.itemDescription, req.body.ID],
        (err, results) => {
            if (err) {
                console.error('Error updating data', err);
                res.status(500).send('Error updating data');
                return;
            }
            console.log('Updated Successfully');
            res.send('Updated successfully');
        }
    );
});

app.delete('/delete-item', (req, res) => {
    console.log('Delete request for ID:', req.body.ID);
    db.query(
        'DELETE FROM todoItems WHERE Id = ?',  // <-- column name Id (capital I)
        [req.body.ID],
        (err, results) => {
            if (err) {
                console.error('Error deleting item', err);
                res.status(500).send('Error deleting item');
                return;
            }
            console.log('Deleted Successfully');
            res.send('Deleted successfully');
        }
    );
});

app.listen(3000, () => {
    console.log("Server started successfully on port 3000");
});
