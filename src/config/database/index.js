const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { promisify } = require('util');
const createTables = require('./schema');
const logger = require('../../utils/logger');

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, '../../data/auth.db'), (err) => {
      if (err) {
        logger.error('Error connecting to the database:', err);
      } else {
        logger.info('Connected to SQLite database');
      }
    });

    // Promisify database operations
    this.db.runAsync = promisify(this.db.run.bind(this.db));
    this.db.getAsync = promisify(this.db.get.bind(this.db));
    this.db.allAsync = promisify(this.db.all.bind(this.db));
  }

  async init() {
    try {
      await this.db.runAsync(createTables);
      logger.info('Database tables created successfully');
    } catch (error) {
      logger.error('Error initializing database:', error);
      throw error;
    }
  }

  async close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          logger.error('Error closing database:', err);
          reject(err);
        } else {
          logger.info('Database connection closed');
          resolve();
        }
      });
    });
  }
}

const database = new Database();
database.init().catch(err => {
  logger.error('Failed to initialize database:', err);
  process.exit(1);
});

module.exports = database.db;