// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  serverAddres: 'http://localhost:1337',
  //serverAddres: 'http://10.3.3.20:1337',
  //labServerAddres: 'http://10.3.200.20:3000',
  intermediaryServerAddres: 'http://localhost:3001',
  authServerAddres: 'http://localhost:3001',
  production: false,
};

// export const environment = {
//   serverAddres: 'http://10.3.3.20:1337',
//   //serverAddres: 'http://10.3.3.20:1337',
//   //labServerAddres: 'http://10.3.200.20:3000',
//   intermediaryServerAddres: 'http://10.3.3.20:3001',
//   production: false,
// };
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
