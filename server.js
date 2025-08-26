
require('dotenv').config();
// console.log('MONGODB_URI:', process.env.MONGODB_URI);

const express = require('express');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const path = require('path');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Session middleware setup
app.use(session({
  secret: 'your_secret_key', // Change this to a strong secret in production
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set secure: true if using HTTPS
}));

// Authentication middleware to protect routes
function authMiddleware(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/login.html');
  }
}

// MongoDB Atlas connection URI from environment variable
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: MONGODB_URI environment variable not set.');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let vehicleCollection;
let feedmillCollection;
let headOfficeCollection;
let deletedRecordsCollection;
let historyRecordsCollection;

async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const vehicleDatabase = client.db('vehicleMaintenanceDB');
    vehicleCollection = vehicleDatabase.collection('maintenanceRecords');

    // Use the same database for feedmill but different collection
    feedmillCollection = vehicleDatabase.collection('feedmillMaintenanceRecords');

    // Use the same database for head office division with different collection
    headOfficeCollection = vehicleDatabase.collection('headOfficeMaintenanceRecords');

    // Use the same database for deleted records collection
    deletedRecordsCollection = vehicleDatabase.collection('deletedRecords');

    // Use the same database for history records collection
    historyRecordsCollection = vehicleDatabase.collection('historyRecords');

    // Assign collections to global variables
    global.vehicleCollection = vehicleCollection;
    global.feedmillCollection = feedmillCollection;
    global.headOfficeCollection = headOfficeCollection;
    global.deletedRecordsCollection = deletedRecordsCollection;
    global.historyRecordsCollection = historyRecordsCollection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

connectDB();

// API routes

app.get('/api/records', async (req, res) => {
  try {
    const division = req.headers['x-division'] || req.session.division;
    let records;
    if (division === 'feedmill') {
      records = await feedmillCollection.find({}).toArray();
    } else if (division === 'headoffice') {
      records = await headOfficeCollection.find({}).toArray();
    } else {
      records = await vehicleCollection.find({}).toArray();
    }
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});
app.post('/api/save_history', async (req, res) => {
  try {
    const { recordId, changes, editedBy } = req.body;
    if (!recordId || !changes) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Fetch current record to get original data
    let currentRecord;
    if (req.session.division === 'feedmill') {
      currentRecord = await global.feedmillCollection.findOne({ _id: new ObjectId(recordId) });
    } else if (req.session.division === 'headoffice') {
      currentRecord = await global.headOfficeCollection.findOne({ _id: new ObjectId(recordId) });
    } else {
      currentRecord = await global.vehicleCollection.findOne({ _id: new ObjectId(recordId) });
    }

    if (!currentRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Convert changes object with oldValue/newValue to previousData object with old values
    const previousData = {};
    for (const field in changes) {
      if (changes.hasOwnProperty(field)) {
        previousData[field] = changes[field].oldValue || '';
      }
    }

    // Prepare history record with previousData and metadata
    const historyRecord = {
      originalRecordId: currentRecord._id,
      previousData: previousData,
      editedBy: editedBy || req.session.user || 'Unknown',
      editedAt: new Date()
    };

    await global.historyRecordsCollection.insertOne(historyRecord);

    res.json({ message: 'History saved successfully' });
  } catch (error) {
    console.error('Error saving history:', error);
    res.status(500).json({ error: 'Failed to save history' });
  }
});
app.post('/api/save_history', async (req, res) => {
  try {
    const { recordId, changes, editedBy } = req.body;
    if (!recordId || !changes) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Fetch current record to get original data
    let currentRecord;
    if (req.session.division === 'feedmill') {
      currentRecord = await global.feedmillCollection.findOne({ _id: new ObjectId(recordId) });
    } else if (req.session.division === 'headoffice') {
      currentRecord = await global.headOfficeCollection.findOne({ _id: new ObjectId(recordId) });
    } else {
      currentRecord = await global.vehicleCollection.findOne({ _id: new ObjectId(recordId) });
    }

    if (!currentRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Convert changes object with oldValue/newValue to previousData object with old values
    const previousData = {};
    for (const field in changes) {
      if (changes.hasOwnProperty(field)) {
        previousData[field] = changes[field].oldValue || '';
      }
    }

    // Prepare history record with previousData and metadata
    const historyRecord = {
      originalRecordId: currentRecord._id,
      previousData: previousData,
      editedBy: editedBy || req.session.user || 'Unknown',
      editedAt: new Date()
    };

    await global.historyRecordsCollection.insertOne(historyRecord);

    res.json({ message: 'History saved successfully' });
  } catch (error) {
    console.error('Error saving history:', error);
    res.status(500).json({ error: 'Failed to save history' });
  }
});
app.get('/api/records/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const division = req.headers['x-division'] || req.session.division;
    let record;
    if (division === 'feedmill') {
      record = await feedmillCollection.findOne({ _id: new ObjectId(id) });
    } else if (division === 'headoffice') {
      record = await headOfficeCollection.findOne({ _id: new ObjectId(id) });
    } else {
      record = await vehicleCollection.findOne({ _id: new ObjectId(id) });
    }
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch record' });
  }
});
app.get('/api/records/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const division = req.headers['x-division'] || req.session.division;
    let record;
    if (division === 'feedmill') {
      record = await feedmillCollection.findOne({ _id: new ObjectId(id) });
    } else if (division === 'headoffice') {
      record = await headOfficeCollection.findOne({ _id: new ObjectId(id) });
    } else {
      record = await vehicleCollection.findOne({ _id: new ObjectId(id) });
    }
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch record' });
  }
});
app.post('/api/records', async (req, res) => {
  try {
    const division = req.headers['x-division'] || req.session.division;
    const newRecord = req.body;
  // Ensure EMS and emsRenewalDate fields are present for all divisions
  newRecord.ems = newRecord.ems || '';
  newRecord.emsRenewalDate = newRecord.emsRenewalDate || '';
    let result;
    if (division === 'feedmill') {
      result = await feedmillCollection.insertOne(newRecord);
    } else if (division === 'headoffice') {
      result = await headOfficeCollection.insertOne(newRecord);
    } else {
      result = await vehicleCollection.insertOne(newRecord);
    }
    res.status(201).json({ _id: result.insertedId, ...newRecord });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create record' });
  }
});
app.post('/api/records', async (req, res) => {
  try {
    const division = req.headers['x-division'] || req.session.division;
    const newRecord = req.body;
    let result;
    if (division === 'feedmill') {
      result = await feedmillCollection.insertOne(newRecord);
    } else if (division === 'headoffice') {
      result = await headOfficeCollection.insertOne(newRecord);
    } else {
      result = await vehicleCollection.insertOne(newRecord);
    }
    res.status(201).json({ _id: result.insertedId, ...newRecord });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create record' });
  }
});
app.put('/api/records/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedRecord = req.body;
    const division = req.headers['x-division'] || req.session.division;

    // Fetch current record before update
    let currentRecord;
    if (division === 'feedmill') {
      currentRecord = await feedmillCollection.findOne({ _id: new ObjectId(id) });
    } else if (division === 'headoffice') {
      currentRecord = await headOfficeCollection.findOne({ _id: new ObjectId(id) });
    } else {
      currentRecord = await vehicleCollection.findOne({ _id: new ObjectId(id) });
    }

    if (!currentRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }

  // Check if any of the specified fields have changed
  const keysToCheck = ['vehicleNumber', 'maintenanceType', 'openingKM', 'closingKM', 'kmDriven', 'remarks', 'maintenanceRenewalDate', 'ems', 'emsRenewalDate'];
    let hasChanges = false;

    for (const key of keysToCheck) {
      let originalVal = currentRecord[key];
      let updatedVal = updatedRecord[key];

      // Normalize numbers to string for comparison
      if (typeof updatedVal === 'number') {
        updatedVal = updatedVal.toString();
      }
      if (typeof originalVal === 'number') {
        originalVal = originalVal.toString();
      }

      if (originalVal !== updatedVal) {
        hasChanges = true;
        break;
      }
    }

    if (hasChanges) {
      // Save current record to history collection with timestamp and user info
      const historyRecord = {
        originalRecordId: currentRecord._id,
        previousData: {
          vehicleNumber: currentRecord.vehicleNumber,
          maintenanceType: currentRecord.maintenanceType,
          openingKM: currentRecord.openingKM,
          closingKM: currentRecord.closingKM,
          kmDriven: currentRecord.kmDriven,
          remarks: currentRecord.remarks,
          lastServiceDate: currentRecord.maintenanceRenewalDate,
          ems: currentRecord.ems,
          emsRenewalDate: currentRecord.emsRenewalDate
        },
        editedBy: req.session.user || 'Unknown',
        editedAt: new Date()
      };

      await historyRecordsCollection.insertOne(historyRecord);
    }

    // Proceed with update
    let result;
    if (division === 'feedmill') {
      result = await feedmillCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedRecord }
      );
    } else if (division === 'headoffice') {
      result = await headOfficeCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedRecord }
      );
    } else {
      result = await vehicleCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedRecord }
      );
    }

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ _id: id, ...updatedRecord });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update record' });
  }
});
app.put('/api/records/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedRecord = req.body;
    const division = req.headers['x-division'] || req.session.division;

    // Fetch current record before update
    let currentRecord;
    if (division === 'feedmill') {
      currentRecord = await feedmillCollection.findOne({ _id: new ObjectId(id) });
    } else if (division === 'headoffice') {
      currentRecord = await headOfficeCollection.findOne({ _id: new ObjectId(id) });
    } else {
      currentRecord = await vehicleCollection.findOne({ _id: new ObjectId(id) });
    }

    if (!currentRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Check if any of the specified fields have changed
    const keysToCheck = ['vehicleNumber', 'maintenanceType', 'openingKM', 'closingKM', 'kmDriven', 'remarks', 'maintenanceRenewalDate'];
    let hasChanges = false;

    for (const key of keysToCheck) {
      let originalVal = currentRecord[key];
      let updatedVal = updatedRecord[key];

      // Normalize numbers to string for comparison
      if (typeof updatedVal === 'number') {
        updatedVal = updatedVal.toString();
      }
      if (typeof originalVal === 'number') {
        originalVal = originalVal.toString();
      }

      if (originalVal !== updatedVal) {
        hasChanges = true;
        break;
      }
    }

    if (hasChanges) {
      // Save current record to history collection with timestamp and user info
      const historyRecord = {
        originalRecordId: currentRecord._id,
        previousData: {
          vehicleNumber: currentRecord.vehicleNumber,
          maintenanceType: currentRecord.maintenanceType,
          openingKM: currentRecord.openingKM,
          closingKM: currentRecord.closingKM,
          kmDriven: currentRecord.kmDriven,
          remarks: currentRecord.remarks,
          lastServiceDate: currentRecord.maintenanceRenewalDate
        },
        editedBy: req.session.user || 'Unknown',
        editedAt: new Date()
      };

      await historyRecordsCollection.insertOne(historyRecord);
    }

    // Proceed with update
    let result;
    if (division === 'feedmill') {
      result = await feedmillCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedRecord }
      );
    } else if (division === 'headoffice') {
      result = await headOfficeCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedRecord }
      );
    } else {
      result = await vehicleCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedRecord }
      );
    }

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ _id: id, ...updatedRecord });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update record' });
  }
});
app.delete('/api/records/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleteReason = req.body.deleteReason || 'No reason provided';
    const deletedBy = req.body.deletedBy || req.session.user || 'Unknown';
    const division = req.headers['x-division'] || req.session.division;

    let recordToDelete;
    if (division === 'feedmill') {
      recordToDelete = await feedmillCollection.findOne({ _id: new ObjectId(id) });
    } else if (division === 'headoffice') {
      recordToDelete = await headOfficeCollection.findOne({ _id: new ObjectId(id) });
    } else {
      recordToDelete = await vehicleCollection.findOne({ _id: new ObjectId(id) });
    }

    if (!recordToDelete) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Add deletion metadata
    const deletedRecord = {
      ...recordToDelete,
      deleteReason,
      deletedBy,
      deletedAt: new Date()
    };

    // Store deleted record in deletedRecords collection
    await deletedRecordsCollection.insertOne(deletedRecord);

    // Delete the record from the main collection
    let result;
    if (division === 'feedmill') {
      result = await feedmillCollection.deleteOne({ _id: new ObjectId(id) });
    } else if (division === 'headoffice') {
      result = await headOfficeCollection.deleteOne({ _id: new ObjectId(id) });
    } else {
      result = await vehicleCollection.deleteOne({ _id: new ObjectId(id) });
    }

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ message: 'Record deleted and stored in deleted records' });
  } catch (error) {
    console.error('Error in DELETE /api/records/:id:', error);
    res.status(500).json({ error: 'Failed to delete and store record' });
  }
});
app.delete('/api/records/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleteReason = req.body.deleteReason || 'No reason provided';
    const deletedBy = req.body.deletedBy || req.session.user || 'Unknown';
    const division = req.headers['x-division'] || req.session.division;

    let recordToDelete;
    if (division === 'feedmill') {
      recordToDelete = await feedmillCollection.findOne({ _id: new ObjectId(id) });
    } else if (division === 'headoffice') {
      recordToDelete = await headOfficeCollection.findOne({ _id: new ObjectId(id) });
    } else {
      recordToDelete = await vehicleCollection.findOne({ _id: new ObjectId(id) });
    }

    if (!recordToDelete) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Add deletion metadata
    const deletedRecord = {
      ...recordToDelete,
      deleteReason,
      deletedBy,
      deletedAt: new Date()
    };

    // Store deleted record in deletedRecords collection
    await deletedRecordsCollection.insertOne(deletedRecord);

    // Delete the record from the main collection
    let result;
    if (division === 'feedmill') {
      result = await feedmillCollection.deleteOne({ _id: new ObjectId(id) });
    } else if (division === 'headoffice') {
      result = await headOfficeCollection.deleteOne({ _id: new ObjectId(id) });
    } else {
      result = await vehicleCollection.deleteOne({ _id: new ObjectId(id) });
    }

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ message: 'Record deleted and stored in deleted records' });
  } catch (error) {
    console.error('Error in DELETE /api/records/:id:', error);
    res.status(500).json({ error: 'Failed to delete and store record' });
  }
});

app.post('/api/save_history', async (req, res) => {
  try {
    const { recordId, changes, editedBy } = req.body;
    if (!recordId || !changes) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Fetch current record to get original data
    let currentRecord;
    if (req.session.division === 'feedmill') {
      currentRecord = await global.feedmillCollection.findOne({ _id: new ObjectId(recordId) });
    } else if (req.session.division === 'headoffice') {
      currentRecord = await global.headOfficeCollection.findOne({ _id: new ObjectId(recordId) });
    } else {
      currentRecord = await global.vehicleCollection.findOne({ _id: new ObjectId(recordId) });
    }

    if (!currentRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Convert changes object with oldValue/newValue to previousData object with old values
    const previousData = {};
    for (const field in changes) {
      if (changes.hasOwnProperty(field)) {
        previousData[field] = changes[field].oldValue || '';
      }
    }

    // Prepare history record with previousData and metadata
    const historyRecord = {
      originalRecordId: currentRecord._id,
      previousData: previousData,
      editedBy: editedBy || req.session.user || 'Unknown',
      editedAt: new Date()
    };

    await global.historyRecordsCollection.insertOne(historyRecord);

    res.json({ message: 'History saved successfully' });
  } catch (error) {
    console.error('Error saving history:', error);
    res.status(500).json({ error: 'Failed to save history' });
  }
});

// New API endpoint to get history records
app.get('/api/history_records', async (req, res) => {
  try {
    const historyRecords = await global.historyRecordsCollection.find({}).toArray();
    res.json(historyRecords);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history records' });
  }
});

app.get('/api/records/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const division = req.headers['x-division'] || req.session.division;
    let record;
    if (division === 'feedmill') {
      record = await feedmillCollection.findOne({ _id: new ObjectId(id) });
    } else if (division === 'headoffice') {
      record = await headOfficeCollection.findOne({ _id: new ObjectId(id) });
    } else {
      record = await vehicleCollection.findOne({ _id: new ObjectId(id) });
    }
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch record' });
  }
});

app.post('/api/records', async (req, res) => {
  try {
    const division = req.headers['x-division'] || req.session.division;
    const newRecord = req.body;
    let result;
    if (division === 'feedmill') {
      result = await feedmillCollection.insertOne(newRecord);
    } else if (division === 'headoffice') {
      result = await headOfficeCollection.insertOne(newRecord);
    } else {
      result = await vehicleCollection.insertOne(newRecord);
    }
    res.status(201).json({ _id: result.insertedId, ...newRecord });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create record' });
  }
});

app.put('/api/records/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedRecord = req.body;
    const division = req.headers['x-division'] || req.session.division;

    // Fetch current record before update
    let currentRecord;
    if (division === 'feedmill') {
      currentRecord = await feedmillCollection.findOne({ _id: new ObjectId(id) });
    } else if (division === 'headoffice') {
      currentRecord = await headOfficeCollection.findOne({ _id: new ObjectId(id) });
    } else {
      currentRecord = await vehicleCollection.findOne({ _id: new ObjectId(id) });
    }

    if (!currentRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Check if any of the specified fields have changed
    const keysToCheck = ['vehicleNumber', 'maintenanceType', 'openingKM', 'closingKM', 'kmDriven', 'remarks', 'maintenanceRenewalDate'];
    let hasChanges = false;

    for (const key of keysToCheck) {
      let originalVal = currentRecord[key];
      let updatedVal = updatedRecord[key];

      // Normalize numbers to string for comparison
      if (typeof updatedVal === 'number') {
        updatedVal = updatedVal.toString();
      }
      if (typeof originalVal === 'number') {
        originalVal = originalVal.toString();
      }

      if (originalVal !== updatedVal) {
        hasChanges = true;
        break;
      }
    }

    if (hasChanges) {
      // Save current record to history collection with timestamp and user info
      const historyRecord = {
        originalRecordId: currentRecord._id,
        previousData: {
          vehicleNumber: currentRecord.vehicleNumber,
          maintenanceType: currentRecord.maintenanceType,
          openingKM: currentRecord.openingKM,
          closingKM: currentRecord.closingKM,
          kmDriven: currentRecord.kmDriven,
          remarks: currentRecord.remarks,
          lastServiceDate: currentRecord.maintenanceRenewalDate
        },
        editedBy: req.session.user || 'Unknown',
        editedAt: new Date()
      };

      await historyRecordsCollection.insertOne(historyRecord);
    }

    // Proceed with update
    let result;
    if (division === 'feedmill') {
      result = await feedmillCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedRecord }
      );
    } else if (division === 'headoffice') {
      result = await headOfficeCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedRecord }
      );
    } else {
      result = await vehicleCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedRecord }
      );
    }

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ _id: id, ...updatedRecord });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update record' });
  }
});

app.delete('/api/records/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleteReason = req.body.deleteReason || 'No reason provided';
    const deletedBy = req.body.deletedBy || req.session.user || 'Unknown';
    const division = req.headers['x-division'] || req.session.division;

    let recordToDelete;
    if (division === 'feedmill') {
      recordToDelete = await feedmillCollection.findOne({ _id: new ObjectId(id) });
    } else if (division === 'headoffice') {
      recordToDelete = await headOfficeCollection.findOne({ _id: new ObjectId(id) });
    } else {
      recordToDelete = await vehicleCollection.findOne({ _id: new ObjectId(id) });
    }

    if (!recordToDelete) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Add deletion metadata
    const deletedRecord = {
      ...recordToDelete,
      deleteReason,
      deletedBy,
      deletedAt: new Date()
    };

    // Store deleted record in deletedRecords collection
    await deletedRecordsCollection.insertOne(deletedRecord);

    // Delete the record from the main collection
    let result;
    if (division === 'feedmill') {
      result = await feedmillCollection.deleteOne({ _id: new ObjectId(id) });
    } else if (division === 'headoffice') {
      result = await headOfficeCollection.deleteOne({ _id: new ObjectId(id) });
    } else {
      result = await vehicleCollection.deleteOne({ _id: new ObjectId(id) });
    }

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ message: 'Record deleted and stored in deleted records' });
  } catch (error) {
    console.error('Error in DELETE /api/records/:id:', error);
    res.status(500).json({ error: 'Failed to delete and store record' });
  }
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Hardcoded user credentials and roles
  const users = [
    { username: 'user', password: 'feedmill@123', division: 'feedmill', role: 'user' },
    { username: 'admin', password: 'NU67IJvWI/d', division: 'feedmill', role: 'admin' },
    { username: 'user', password: 'processing@123', division: 'vehicle', role: 'user' }, // example for other user
    { username: 'admin', password: 'xsqaIP7&9M*|', division: 'vehicle', role: 'admin' }, // example for other admin
    { username: 'admin', password: 'h7PSGBuG!h', division: 'headoffice', role: 'admin' }, // added missing head office admin user
    { username: 'user', password: 'headoffice@123', division: 'headoffice', role: 'user' }, // added new head office user
    { username: 'Database', password: 'PASSWORD@1234', division: 'vehicle', role: 'admin' },
    { username: 'history', password: '@V+1+}6qDR8)', division: 'vehicle', role: 'history' }
  ];

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    req.session.user = user.username;
    req.session.division = user.division;
    req.session.role = user.role;
    res.json({ success: true, division: user.division, role: user.role });
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

// New API endpoint to get deleted records
app.get('/api/deleted-records', async (req, res) => {
  try {
    const deletedRecords = await deletedRecordsCollection.find({}).toArray();
    res.json(deletedRecords);
  } catch (error) {
    console.error('Failed to fetch deleted records:', error);
    res.status(500).json({ error: 'Failed to fetch deleted records' });
  }
});

// Logout route
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Redirect root URL to login.html
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Serve static files from the 'public' directory with auth protection for Project-Vehicle-Management-admin.html
app.get('/Project-Vehicle-Management-admin.html', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Project-Vehicle-Management-admin.html'));
});

// Serve static files from the 'public' directory with auth protection for project_headOffice-Management-admin.html
app.get('/project_headOffice-Management-admin.html', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'project_headOffice-Management-admin.html'));
});

// Serve static files from the 'public' directory with auth protection for history_service.html
app.get('/history_service.html', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'history_service.html'));
});

// Serve other static files without auth
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
