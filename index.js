const e = require('express');
const express = require('express');
const mysql = require('mysql2');
const axios = require('axios');
const app = express();
const host = '0.0.0.0';
const port = 3000;
const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nginx-node',
};
const connection = mysql.createConnection(config);
let persons = [];
const personsDefault = [
  'Lenira Nogueira',
  'Rubi Rodrigues',
  'Pépio Oliveira',
  'Aimée de Souza',
  'Sandra Souza',
  'Virgílio das Neves',
  'Ondino Peixoto',
  'Pio Sales',
  'Lory Moura',
  'Roboredo Nunes',
  'Peniel de Souza',
  'Vladislava da Cruz',
  'Jesualdo Lima',
  'Wanda de Souza',
  'Bia da Rocha',
  'Isaí da Cruz',
];

async function getPersonsData() {
  return new Promise(async (resolve, reject) => {
    if (persons.length > 0) resolve(true);
    try {
      const res = await axios.get(
        'https://randomuser.me/api/?results=100&inc=name&nat=br'
      );
      if (res.data && res.data.results && res.data.results.length > 0) {
        persons = [];
        for (let i = 0; i < res.data.results.length; i++) {
          const element = res.data.results[i];
          persons.push(`${element.name.first} ${element.name.last}`);
        }
        resolve(true);
      } else resolve(false);
    } catch (err) {
      reject(err);
    }
  });
}

async function createTable(conn) {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT * FROM information_schema.TABLES WHERE TABLE_NAME = ?`,
      ['people'],
      function (err, result) {
        if (err) throw err;
        if (result.length == 0) {
          conn.query(
            `create table people(id int AUTO_INCREMENT PRIMARY KEY, name varchar(100) not null)`,
            function (err, result) {
              if (err) reject(err);
              if (result) resolve(true);
              else resolve(false);
            }
          );
        } else resolve(true);
      }
    );
  });
}

async function insertPerson(conn) {
  return new Promise((resolve, reject) => {
    const personIndex = Math.floor(Math.random() * 15 + 1) - 1;
    if (personIndex < 0) reject(false);
    const name = persons[personIndex];
    const sqlGet = `SELECT * FROM people WHERE name = '${name}'`;
    conn.query(sqlGet, function (err, result) {
      if (err) reject(err);
      if (result.length == 0) {
        sql = `INSERT people(name) VALUES('${name}');`;
        conn.query(sql, function (err, result) {
          if (err) reject(err);
          if (result) resolve(true);
          else resolve(false);
        });
      } else resolve(false);
    });
  });
}

async function getPersons(conn) {
  return new Promise((resolve, reject) => {
    const sqlGet = `SELECT * FROM people`;
    conn.query(sqlGet, function (err, result) {
      if (err) throw reject(err);
      resolve(result);
    });
  });
}

app.get('/', async (req, res) => {
  const table = await createTable(connection);
  if (!table) throw 'Falha ao cria a tabela people';
  const dataPersons = await getPersonsData();
  if (!dataPersons) persons = personsDefault;
  const person = await insertPerson(connection);
  if (!person) await insertPerson(connection);
  const html = ['<h1>Full Cycle Rocks!</h1>'];
  html.push('<ul>');
  const persons = await getPersons(connection);
  for (let i = 0; i < persons.length; i++) {
    const element = persons[i];
    html.push(`<li>${element.name}</li>`);
  }
  html.push('</ul>');
  res.send(html.join(''));
});

app.listen(port, host, () =>
  console.log(`Application running on http://${host}:${port}`)
);
