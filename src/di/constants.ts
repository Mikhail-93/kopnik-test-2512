export interface IConstants {
  db: {
    logging?: boolean,
    synchronize?: boolean,
  },
  messaging:{
    waitFriendDelay:number,
    baseClientUrl: string,
  }

}

const constants = {
  development: {
    db: {
      "synchronize": false,
      "logging": true,
    },
    messaging: {
      waitFriendDelay: 15000,
      baseClientUrl: 'https://localhost:8080/',
    }
  },
  test: {
    db: {
      "synchronize": false,
      "logging": true,
    },
    messaging: {
      waitFriendDelay: 0,
      baseClientUrl: 'https://localhost:8080/',
    }
  },
  production: {
    db: {
      "synchronize": false,
      "logging": true,
    },
    messaging: {
      waitFriendDelay: 60000,
      baseClientUrl: 'https://staging.kopnik.org/',
    }
  },
} as { [key: string]: IConstants }

export default constants
