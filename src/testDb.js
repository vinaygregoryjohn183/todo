const pool = require('./config/database');

async function testConnection() {
  try {
    // Test the connection
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL');

    // Test if todos table exists
    const tableResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'todos'
      );
    `);
    
    if (tableResult.rows[0].exists) {
      console.log('Todos table exists');
      
      // Test query
      const testQuery = await client.query('SELECT * FROM todos LIMIT 1');
      console.log('Sample query result:', testQuery.rows);
    } else {
      console.log('Todos table does not exist. Creating table...');
      
      // Create the table
      await client.query(`
        CREATE TABLE todos (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          completed BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Todos table created successfully');
    }

    client.release();
  } catch (err) {
    console.error('Database connection error:', err.message);
  } finally {
    // Close the pool
    await pool.end();
  }
}

testConnection(); 