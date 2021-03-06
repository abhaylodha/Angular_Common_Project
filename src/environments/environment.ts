// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // signupUrl: "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=",
  updatePasswordUrl: "https://identitytoolkit.googleapis.com/v1/accounts:update?key=",
  
  // loginUrl: "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=",
  // userDataUrl: "https://ng-course-recipe-book-3c101.firebaseio.com/users",
  // skillsDataUrl: "https://ng-course-recipe-book-3c101.firebaseio.com/skills",
  // locationsDataUrl: "https://ng-course-recipe-book-3c101.firebaseio.com/locations",
  // requirementsDataUrl: "https://ng-course-recipe-book-3c101.firebaseio.com/requirements",
  apiKey: "AIzaSyD_pxwEL_BK3GBldh4hC4gNQT5Ugf-LLJM",

  //Localhost specific settings
  signupUrl: "http://localhost:8080/register?key=",
  loginUrl: "http://localhost:8080/authenticate?key=",
  userDataUrl: "http://localhost:8080/users",
  skillsDataUrl: "http://localhost:8080/skills",
  locationsDataUrl: "http://localhost:8080/locations",
  requirementsDataUrl: "http://localhost:8080/requirements",

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
