export interface IConstants{
  db: {
    logging?: boolean,
    synchronize?: boolean,
  }
}

const constants = {
  development: {
    db: {
      "synchronize": false,
      "logging": true,
    }
  },
  test: {
    db: {
      "synchronize": false,
      "logging": true,
    }
  },
  production: {
    db: {
      "synchronize": false,
      "logging": true,
    }
  },
} as {[key:string]: IConstants}

export default constants
