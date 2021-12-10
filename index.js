const fs = require('fs');
const mysql = require('mysql');
const express = require('express');

const json = fs.readFileSync('credentials.json', 'utf8');
const credentials = JSON.parse(json);

const connection = mysql.createConnection(credentials);

const service = express();

service.use(express.json());

const port = 5001;
service.listen(port, () => {
  console.log(`We're live on port ${port}!`);
});

connection.connect(error => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
});

function rowToSeries(row) {
    return {
      id: row.id,
      packname: row.packname,
      youtuber: row.youtuber,
      episodecount: row.episodecount,
      startdate: row.startdate,
      enddate: row.enddate
    };
  }

  service.use((request, response, next) => {
    response.set('Access-Control-Allow-Origin', '*');
    next();
  });

  service.options('*', (request, response) => {
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    response.sendStatus(200);
  });

service.post('/ytseries/create', (request, response) => {
    if (request.body.hasOwnProperty('packname') &&
        request.body.hasOwnProperty('youtuber') &&
        request.body.hasOwnProperty('episodecount') &&
        request.body.hasOwnProperty('startdate') &&
        request.body.hasOwnProperty('enddate')) {
  
      const parameters = [
        request.body.packname,
        request.body.youtuber,
        request.body.episodecount,
        request.body.startdate,
        request.body.enddate
      ];
  
      const query = 'INSERT INTO ytseries(packname, youtuber, episodecount, startdate, enddate) VALUES (?, ?, ?, ?, ?)';
      connection.query(query, parameters, (error, result) => {
        if (error) {
          response.status(500);
          response.json({
            ok: false,
            results: error.message,
          });
        } else {
          response.json({
            ok: true,
            results: result.insertId,
          });
        }
      });
  
    } else {
      response.status(400);
      response.json({
        ok: false,
        results: 'Incomplete YouTube series.',
      });
    }
  });

  service.patch('/ytseries/update/:id', (request, response) => {
    const parameters = [
      request.body.packname,
      request.body.youtuber,
      request.body.episodecount,
      request.body.startdate,
      request.body.enddate,
      parseInt(request.params.id)
    ];
  
    const query = 'UPDATE ytseries SET packname = ?, youtuber = ?, episodecount = ?, startdate = ?, enddate = ? WHERE id = ?';
    connection.query(query, parameters, (error, result) => {
      if (error) {
        response.status(404);
        response.json({
          ok: false,
          results: error.message,
        });
      } else {
        response.json({
          ok: true,
        });
      }
    });
  });

  service.patch('/ytseries/update/episodes/:id', (request, response) => {
    const parameters = [
      request.body.episodecount,
      parseInt(request.params.id)
    ];
  
    const query = 'UPDATE ytseries SET episodecount = ? WHERE id = ?';
    connection.query(query, parameters, (error, result) => {
      if (error) {
        response.status(404);
        response.json({
          ok: false,
          results: error.message,
        });
      } else {
        response.json({
          ok: true,
        });
      }
    });
  });

  service.patch('/ytseries/update/enddate/:id', (request, response) => {
    const parameters = [
      request.body.enddate,
      parseInt(request.params.id)
    ];
  
    const query = 'UPDATE ytseries SET enddate = ? WHERE id = ?';
    connection.query(query, parameters, (error, result) => {
      if (error) {
        response.status(404);
        response.json({
          ok: false,
          results: error.message,
        });
      } else {
        response.json({
          ok: true,
        });
      }
    });
  });

  service.delete('/ytseries/delete/:id', (request, response) => {
    const parameters = [parseInt(request.params.id)];
  
    const query = 'UPDATE ytseries SET is_deleted = 1 WHERE id = ?';
    connection.query(query, parameters, (error, result) => {
      if (error) {
        response.status(404);
        response.json({
          ok: false,
          results: error.message,
        });
      } else {
        response.json({
          ok: true,
        });
      }
    });
  });

  service.get('/ytseries/get/:id', (request, response) => {
    const parameters = [
      parseInt(request.params.id)
    ];
  
    const query = 'SELECT * FROM ytseries WHERE id = ? and is_deleted = 0';
    connection.query(query, parameters, (error, rows) => {
      if (error) {
        response.status(500);
        response.json({
          ok: false,
          results: error.message,
        });
      } else {
        const series = rows.map(rowToSeries);
        response.json({
          ok: true,
          results: rows.map(rowToSeries),
        });
      }
    });
  });

  service.get('/ytseries/get', (request, response) => {
  
    const query = 'SELECT * FROM ytseries WHERE is_deleted = 0';
    connection.query(query, (error, rows) => {
      if (error) {
        response.status(500);
        response.json({
          ok: false,
          results: error.message,
        });
      } else {
        const series = rows.map(rowToSeries);
        response.json({
          ok: true,
          results: rows.map(rowToSeries),
        });
      }
    });
  });

  service.get("/report.html", (request, response) => {
    response.sendFile("report.html", {root: __dirname});
  });