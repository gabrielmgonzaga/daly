exports.development = {
  client: 'postgresql',
  connection: {
    user: 'superuser',
    database: 'weather'
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations'
  }
}
