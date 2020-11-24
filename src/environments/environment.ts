// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: 'AIzaSyDnU26pi9wiGoR_pONF1wI0SJAvaIHoQQc',
    authDomain: 'covid19-ft-eurecom.firebaseapp.com',
    databaseURL: 'https://covid19-ft-eurecom.firebaseio.com',
    projectId: 'covid19-ft-eurecom',
    storageBucket: 'covid19-ft-eurecom.appspot.com',
    messagingSenderId: '462881265482',
    appId: '1:462881265482:web:4a1cfa270cb98e6c0193b3',
    measurementId: 'G-ERK0MDFT0R'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
