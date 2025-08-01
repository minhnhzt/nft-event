// MongoDB initialization script
db = db.getSiblingDB('nft_project_db');

// Create admin user for the application
db.createUser({
  user: 'nft_user',
  pwd: 'nft_password',
  roles: [
    {
      role: 'readWrite',
      db: 'nft_project_db'
    }
  ]
});

// Create collections
db.createCollection('users');
db.createCollection('nfttemplates');
db.createCollection('events');
db.createCollection('mintrecords');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.nfttemplates.createIndex({ "creator": 1 });
db.events.createIndex({ "createdBy": 1 });
db.events.createIndex({ "startDate": 1 });
db.events.createIndex({ "endDate": 1 });
db.mintrecords.createIndex({ "user": 1 });
db.mintrecords.createIndex({ "event": 1 });
db.mintrecords.createIndex({ "status": 1 });

print('MongoDB initialized successfully!'); 