const express = require('express');
const users = require('./MOCK_DATA.json');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({extended: false}));

app.use((req, res, next)=>{
    console.log("Middleware 1");
    next();
})

app.use((req, res, next)=>{
    fs.appendFile("log.txt", 
        `\n${Date.now()}: ${req.method}: ${req.path}`, 
        (err, data)=>{
            next();
        }
    )
})

app.get('/api/users', (req, res) => {
    return res.json(users);
})

app.get('/users', (req, res) => {
    const html = `
        <ul>
            ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
        </ul>
    `
    res.send(html);
})

app
    .route('/api/users/:id')
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        return res.json(user);
    })
    .patch((req, res)=>{
        return res.json({status: 'pending'});
    })
    .delete((req, res)=>{
        // const id = Number(req.params.id);
        // const user = users.find((user) => user.id === id);
        return res.json({status: 'Pending'});
    });

app.post('/api/users', (req, res)=>{
    const body = req.body;
    users.push({...body, id: users.length +1});
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data)=>{
        return res.json({status: 'success', id: users.length});
    })
})

app.use('/', (req, res) => {
    res.send('<h1>This is Home Page</h1>');
})

app.listen(PORT, () => {
    console.log(`App running on localhost:${PORT}`);
})