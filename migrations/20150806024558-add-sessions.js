var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('sessions', {
    id: { type: type.TEXT, notNull: true, primaryKey: true },
    expiry: { type: type.TIMESTAMP, notNull: true },
    session: 'JSON'
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('sessions', callback);
};
