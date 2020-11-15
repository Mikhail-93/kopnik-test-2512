export interface IConstants{
  db: {
    logging?: boolean,
    synchronize?: boolean,
  }
}

const constants = {
  development: {
    db: {
      "synchronize": true,
      "logging": true,
    }
  },
  test: {
    db: {
      // "synchronize": true,
      "logging": true,
    }
  },
  production: {
    db: {
      // "synchronize": true,
      "logging": true,
    }
  },
} as {[key:string]: IConstants}

export default constants
