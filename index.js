const fs = require('fs');
const mysql = require('mysql');

const json = fs.readFileSync('credentials.json', 'utf8');
const credentials = JSON.parse(json);

const connection = mysql.createConnection(credentials);

const service = express();

service.use(express.json());

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

service.post('/ytseries', (request, response) => {
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

  service.get('/series/:id', (request, response) => {
    const parameters = [
      parseInt(request.params.id)
    ];
  
    const query = 'SELECT * FROM ytseries WHERE id = ?';
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

  service.get('/series', (request, response) => {
  
    const query = 'SELECT * FROM ytseries';
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