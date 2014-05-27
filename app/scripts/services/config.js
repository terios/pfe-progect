angular.module('services.config', [])
	.constant('configuration', {
		URL_REQUEST: 'http://localhost:3000',
		DROPBOX_TYPE: '<%= [DROPBOX_TYPE] %>',
		CATALOGUE_NAME: '<%= [CATALOGUE_NAME] %>'
	});