angular.module('services.config', [])
	.constant('configuration', {
		URL_REQUEST: 'http://localhost:88',
		DROPBOX_TYPE: '<%= [DROPBOX_TYPE] %>',
		CATALOGUE_NAME: '<%= [CATALOGUE_NAME] %>'
	});