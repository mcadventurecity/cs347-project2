DROP TABLE IF EXISTS ytseries;

CREATE TABLE ytseries (
  id SERIAL PRIMARY KEY,
  packname varchar(255),
  youtuber varchar(255),
  episodecount INT,
  startdate DATE,
  enddate DATE,
  is_deleted INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);