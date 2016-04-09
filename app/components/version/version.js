'use strict';

angular.module('ITSApp.version', [
  'ITSApp.version.interpolate-filter',
  'ITSApp.version.version-directive'
])

.value('version', '0.1');
